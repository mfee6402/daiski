import express from 'express';
const router = express.Router();
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET /api/products — 支援 include=card、page、limit、category_id 參數
router.get('/', async (req, res, next) => {
  const { include, page = '1', limit = '10', category_id } = req.query;
  const pageNum = Math.max(parseInt(page, 10), 1);
  const pageSize = Math.max(parseInt(limit, 10), 1);

  try {
    // 1. 組基礎 where
    const where = { delete_at: null };

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

    // 3. 拿總數
    const total = await prisma.product.count({ where });

    const pagination = {
      skip: (pageNum - 1) * pageSize,
      take: pageSize,
    };

    // 4. include=card 情況
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
            where: { deleted_at: null },
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

    // 5. 預設 basic 查詢
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
