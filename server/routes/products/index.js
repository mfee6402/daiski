import express from 'express';
const router = express.Router();
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET /api/products — 支援 include=card、page、limit、category_id、size_id、min_price、max_price 參數
router.get('/', async (req, res, next) => {
  const {
    include,
    page = '1',
    limit,
    category_id,
    size_id,
    min_price,
    max_price,
    search,
  } = req.query;
  const pageNum = Math.max(parseInt(page, 10), 1);
  const pageSize = Math.max(parseInt(limit, 10), 1);

  try {
    // 1. 組基礎 where
    const where = { delete_at: null };

    // 2. 如果有 search，就加上 name 模糊搜尋
    if (typeof search === 'string' && search.trim().length >= 2) {
      where.name = {
        contains: search.trim(),
      };
    }

    // 2. 如果有 category_id，就先從 closure table 取所有後裔 id
    let category_ids;
    if (category_id) {
      const rows = await prisma.productCategoryPath.findMany({
        where: { ancestor: Number(category_id) },
        select: { descendant: true },
      });
      // descendant 包含 depth=0（自己）和所有 depth>0（子、孫、重孫…）
      category_ids = rows.map((r) => r.descendant);
      where.category_id = { in: category_ids };
    }

    //  如果有 brand_id，就加上品牌過濾
    if (req.query.brand_id) {
      // 支援多選 comma-separated
      const ids = String(req.query.brand_id)
        .split(/[,\s]+/)
        .map((v) => Number(v))
        .filter((v) => !Number.isNaN(v));
      if (ids.length) {
        where.brand_id = { in: ids };
      }
    }

    //size_id
    if (size_id) {
      // 前端傳「逗號分隔」或重複 ?size_id=1&size_id=3
      const ids = String(size_id)
        .split(/[,\s]+/)
        .map((v) => Number(v))
        .filter((v) => !Number.isNaN(v));

      // Prisma 語法：products 底下有至少一個 sku，其 size_id 在 ids 裡
      where.product_sku = {
        some: {
          deleted_at: null,
          size_id: { in: ids },
        },
      };
    }

    // 3. 組 SKU 篩選：size + price
    const skuFilter = { deleted_at: null };

    if (size_id) {
      const ids = String(size_id)
        .split(/[,\s]+/)
        .map(Number)
        .filter((v) => !Number.isNaN(v));
      skuFilter.size_id = { in: ids };
    }

    const minP = Number(min_price);
    const maxP = Number(max_price);
    if (!Number.isNaN(minP) || !Number.isNaN(maxP)) {
      skuFilter.price = {};
      if (!Number.isNaN(minP)) skuFilter.price.gte = minP;
      if (!Number.isNaN(maxP)) skuFilter.price.lte = maxP;
    }

    if (Object.keys(skuFilter).length > 1) {
      where.product_sku = { some: skuFilter };
    }

    // 4. 拿總數
    const total = await prisma.product.count({ where });

    const pagination = {
      skip: (pageNum - 1) * pageSize,
      take: pageSize,
    };

    // 5. include=card
    if (include === 'card') {
      const raw = await prisma.product.findMany({
        where,
        ...pagination,
        include: {
          product_image: {
            where: { sort_order: 0, deleted_at: null },
            take: 1,
            select: { url: true },
          },
          product_sku: {
            where: skuFilter,
            orderBy: { price: 'asc' },
            take: 1,
            select: { price: true },
          },
          product_category: { select: { name: true, id: true } },
          product_brand: { select: { name: true, id: true } },
        },
      });

      const products = raw.map((p) => ({
        id: p.id,
        name: p.name,
        image: p.product_image[0]
          ? `http://localhost:3005${p.product_image[0].url}`
          : 'http://localhost:3005/placeholder.jpg',
        price: p.product_sku[0]?.price ?? 0,
        category: p.product_category?.name ?? '無分類',
        category_id: p.product_category?.id ?? null,
        brand: p.product_brand?.name ?? '無品牌',
        brand_id: p.product_brand?.id ?? null,
      }));

      return res.json({
        page: pageNum,
        limit: pageSize,
        total,
        data: products,
      });
    }

    // 6. 預設 basic 查詢
    const basic = await prisma.product.findMany({
      where,
      select: {
        id: true,
        name: true,
        category_id: true,
        brand_id: true,
        introduction: true,
        spec: true,
        created_at: true,
        publish_at: true,
        unpublish_at: true,
        delete_at: true,
      },
      ...pagination,
    });

    res.json({
      page: pageNum,
      limit: pageSize,
      total,
      data: basic,
    });
  } catch (error) {
    next(error);
  }
});

// 在 import 之後、其他 router.get 之前加入：
/**
 * GET /api/products/search-suggestions
 * Query:
 *   - q: 關鍵字（必填，長度需 ≥ 2）
 *   - limit: 最多回傳幾筆（選填，預設 5）
 */
router.get('/search-suggestions', async (req, res, next) => {
  try {
    const { search, limit } = req.query;
    const keyword = typeof search === 'string' ? search.trim() : '';
    const max = Math.max(parseInt(limit, 10), 1);

    // 關鍵字長度限制
    if (keyword.length < 2) {
      return res.status(400).json({ message: 'search 長度需 ≥ 2 字元' });
    }

    const suggestions = await prisma.product.findMany({
      where: {
        delete_at: null,
        name: {
          contains: keyword,
        },
      },
      orderBy: { name: 'asc' },
      take: 3,
      select: {
        id: true,
        name: true,
      },
    });

    res.json(suggestions);
  } catch (error) {
    next(error);
  }
});

// --------------------------------------------------
// GET /api/products/categories — 取得分類的完整路徑列表
// --------------------------------------------------
router.get('/categories', async (req, res, next) => {
  try {
    const categories = await prisma.productCategory.findMany({
      where: { deleted_at: null }, // 若有做「軟刪除」
      select: {
        id: true,
        name: true,
        product_category_path_product_category_path_descendantToproduct_category:
          {
            // 取出這個 category 作為「descendant」的所有 path 條目
            where: {
              depth: { gt: 0 }, // 只要祖先（depth>0），不要自己(depth=0)
            },
            select: {
              depth: true,
              product_category_product_category_path_ancestorToproduct_category:
                {
                  select: { name: true }, // 取出 ancestor 的 name
                },
            },
            orderBy: { depth: 'desc' }, // depth 大（離 root 越遠）排前面
          },
      },
    });

    if (categories.length === 0) {
      return res.status(404).json({ message: 'no categories found' });
    }

    const result = categories.map((cat) => {
      // 先把 ancestors 的 name 拿出來
      const ancestorNames =
        cat.product_category_path_product_category_path_descendantToproduct_category.map(
          (p) =>
            p.product_category_product_category_path_ancestorToproduct_category
              .name
        );

      // 把自己（cat.name）放到最後
      ancestorNames.push(cat.name);

      return {
        id: cat.id,
        fullPath: ancestorNames.join(' > '),
      };
    });

    res.json(result);
  } catch (error) {
    next(error);
  }
});

// --------------------------------------------------
// GET /api/products/categories/list — 取得所有分類的 id + name 平面列表
// --------------------------------------------------
router.get('/categories/list', async (req, res, next) => {
  try {
    const categories = await prisma.productCategory.findMany({
      where: {
        deleted_at: null, // 如果你有做軟刪除
      },
      select: {
        id: true,
        name: true,
      },
      // orderBy: {
      //   name: 'asc', // 可以依名稱排序（或 parentId、created_at）
      // },
    });

    if (!categories.length) {
      return res.status(404).json({ message: 'no categories found' });
    }

    res.json(categories);
  } catch (error) {
    next(error);
  }
});

// --------------------------------------------------
// GET /api/products/sizes — 取得所有尺寸，或特定分類下可用的尺寸
// --------------------------------------------------
router.get('/sizes', async (req, res, next) => {
  const { category_id } = req.query;

  try {
    // 如果有帶 category_id，先抓該分類（含所有子孫分類）的 ID
    let sizeFilter = {};
    if (category_id) {
      const catId = Number(category_id);
      // 1. 抓所有 descendant id（含自己）
      const paths = await prisma.productCategoryPath.findMany({
        where: { ancestor: catId },
        select: { descendant: true },
      });
      const categoryIds = paths.map((p) => p.descendant);

      // 2. 從 product_sku 找出這些分類下所有未刪除且有指定 size_id 的 sku
      const skuRows = await prisma.productSku.findMany({
        where: {
          deleted_at: null,
          size_id: { not: null },
          product: {
            delete_at: null,
            category_id: { in: categoryIds },
          },
        },
        distinct: ['size_id'],
        select: { size_id: true },
      });
      const sizeIds = skuRows.map((s) => s.size_id);

      sizeFilter = { id: { in: sizeIds } };
    }

    // 最後從 product_size 取出符合條件的尺寸清單
    const sizes = await prisma.productSize.findMany({
      where: sizeFilter,
      orderBy: { sort_order: 'asc' },
      select: {
        id: true,
        name: true,
      },
    });

    res.json(sizes);
  } catch (error) {
    next(error);
  }
});

// --------------------------------------------------
// GET /api/products/brands — 取得所有品牌，或特定分類下可用的品牌
// --------------------------------------------------
router.get('/brands', async (req, res, next) => {
  const { category_id } = req.query;

  try {
    // 1. 如果有帶 category_id，先抓該分類（含所有子孫）的 ID
    let brandFilter = {};
    if (category_id) {
      const catId = Number(category_id);
      // a. 拿所有 descendant id（含自己）
      const paths = await prisma.productCategoryPath.findMany({
        where: { ancestor: catId },
        select: { descendant: true },
      });
      const categoryIds = paths.map((p) => p.descendant);

      // b. 從 product 找出這些分類下所有未刪除且有 brand_id 的商品
      const productRows = await prisma.product.findMany({
        where: {
          delete_at: null,
          brand_id: { not: null },
          category_id: { in: categoryIds },
        },
        distinct: ['brand_id'],
        select: { brand_id: true },
      });
      const brandIds = productRows.map((p) => p.brand_id);

      // c. 在品牌過濾條件中加入這些 ID
      if (brandIds.length) {
        brandFilter.id = { in: brandIds };
      } else {
        // 若完全沒有符合的品牌，就直接回空陣列
        return res.json([]);
      }
    }

    // 2. 最後從 product_brand 取出符合條件的品牌清單
    const brands = await prisma.productBrand.findMany({
      where: {
        deleted_at: null,
        ...brandFilter,
      },
      orderBy: { sort_order: 'asc' },
      select: {
        id: true,
        name: true,
      },
    });

    res.json(brands);
  } catch (error) {
    next(error);
  }
});

// --------------------------------------------------
// GET /api/products/:id — 取得單一商品
// --------------------------------------------------
router.get('/:id', async (req, res, next) => {
  const { id } = req.params;
  try {
    const product = await prisma.product.findUnique({
      where: { id: Number(id) },
      select: {
        id: true,
        name: true,
        category_id: true,
        brand_id: true,
        introduction: true,
        spec: true,
        created_at: true,
        publish_at: true,
        unpublish_at: true,
        delete_at: true,
      },
    });

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json(product);
  } catch (error) {
    next(error);
  }
});

export default router;
