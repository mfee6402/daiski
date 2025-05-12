// import express from 'express'
// const router = express.Router()

// /* GET home page. */
// router.get('/', function (req, res) {
//   res
//     .status(200)
//     .json({ status: 'success', message: 'Express(path: /api/OK!)' })
// })

// export default router

// routes/products.js

// import express from 'express';
// const router = express.Router();
// import { PrismaClient } from '@prisma/client';

// // 初始化 Prisma Client
// const prisma = new PrismaClient();

// // --------------------------------------------------
// // GET /api/products — 取得所有商品
// // --------------------------------------------------
// router.get('/', async (req, res, next) => {
//   try {
//     // 用 Prisma API 查所有 product，並指定要哪些欄位
//     const products = await prisma.product.findMany({
//       select: {
//         id: true,
//         name: true,
//         category_id: true,
//         brand_id: true,
//         introduction: true,
//         spec: true,
//         created_at: true,
//         publish_at: true,
//         unpublish_at: true,
//         delete_at: true,
//       },
//     });
//     // 直接回傳 JSON 陣列
//     res.json(products);
//   } catch (error) {
//     next(error);
//   }
// });

// // --------------------------------------------------
// // GET /api/products/categories — 取得分類的完整路徑列表
// // --------------------------------------------------
// router.get('/categories', async (req, res, next) => {
//   try {
//     // 1. 用 Prisma 把所有分類與它們的 ancestor 清單一起撈出
//     const categories = await prisma.product_category.findMany({
//       select: {
//         id: true,
//         name: true,
//         ancestors: {
//           // ancestors 來自 Closure Table 關聯
//           select: {
//             depth: true,
//             ancestor: { select: { name: true } },
//           },
//           orderBy: { depth: 'desc' }, // 先把最遠的祖先放前面
//         },
//       },
//     });

//     // 2. 如果沒查到任何分類，就回 404
//     if (categories.length === 0) {
//       return res.status(404).json({ message: 'not found' });
//     }

//     // 3. 在 JavaScript 端對每個分類做一次 map + join，拼出完整路徑
//     const result = categories.map((cat) => {
//       // 先取出所有 ancestor 的 name（已按 depth desc 排序）
//       const names = cat.ancestors.map((a) => a.ancestor.name);
//       // 把自己本身的名稱接在最後
//       names.push(cat.name);
//       return {
//         id: cat.id,
//         fullPath: names.join(' > '),
//       };
//     });

//     // 4. 回傳最終結果
//     res.json(result);
//   } catch (error) {
//     next(error);
//   }
// });

// // --------------------------------------------------
// // GET /api/products/:id — 取得單一商品
// // --------------------------------------------------
// router.get('/:id', async (req, res, next) => {
//   const { id } = req.params;
//   try {
//     // 用 findUnique 依 id 撈單筆商品
//     const product = await prisma.product.findUnique({
//       where: { id: Number(id) },
//       select: {
//         id: true,
//         name: true,
//         category_id: true,
//         brand_id: true,
//         introduction: true,
//         spec: true,
//         created_at: true,
//         publish_at: true,
//         unpublish_at: true,
//         delete_at: true,
//       },
//     });
//     // 若無此商品就回 404
//     if (!product) {
//       return res.status(404).json({ message: 'Product not found' });
//     }
//     // 回傳該商品
//     res.json(product);
//   } catch (error) {
//     next(error);
//   }
// });

// export default router;

import express from 'express';
const router = express.Router();
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// // GET /api/products — 支援 include=card 參數
// router.get('/', async (req, res, next) => {
//   const { include } = req.query;

//   try {
//     // 如果有帶 include=card，回傳卡片需要的欄位
//     if (include === 'card') {
//       const raw = await prisma.product.findMany({
//         where: {
//           delete_at: null,
//         },
//         include: {
//           product_image: {
//             where: { sort_order: 0, valid: 1 },
//             take: 1,
//             select: { url: true },
//           },
//           product_sku: {
//             where: { deleted_at: null },
//             orderBy: { price: 'asc' },
//             take: 1,
//             select: { price: true },
//           },
//           product_category: {
//             select: { name: true },
//           },
//           product_brand: {
//             select: { name: true },
//           },
//           // product_rating: {
//           //   select: { rating: true },
//           // },
//         },
//       });

//       const products = raw.map((p) => {
//         // const ratings = p.product_rating.map((r) => Number(r.rating));
//         // const avgRating =
//         //   ratings.length > 0
//         //     ? (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1)
//         //     : null;

//         return {
//           id: p.id,
//           name: p.name,
//           // image: p.product_image[0]?.url || '/placeholder.jpg',
//           image: p.product_image[0]
//             ? `http://localhost:3005${p.product_image[0].url}`
//             : 'http://localhost:3005/placeholder.jpg',
//           price: p.product_sku[0]?.price ?? 0,
//           category: p.product_category?.name ?? '無分類',
//           brand: p.product_brand?.name ?? '無品牌',
//           // rating: avgRating,
//         };
//       });

//       return res.json(products);
//     }

//     // 預設查詢：只查基本欄位
//     const products = await prisma.product.findMany({
//       select: {
//         id: true,
//         name: true,
//         category_id: true,
//         brand_id: true,
//         introduction: true,
//         spec: true,
//         created_at: true,
//         publish_at: true,
//         unpublish_at: true,
//         delete_at: true,
//       },
//     });

//     res.json(products);
//   } catch (error) {
//     next(error);
//   }
// });

// GET /api/products — 支援 include=card、page、limit 參數
router.get('/', async (req, res, next) => {
  const { include, page = '1', limit = '10' } = req.query;
  // 轉成數字，並確保最小為 1
  const pageNum = Math.max(parseInt(page, 10), 1);
  const pageSize = Math.max(parseInt(limit, 10), 1);

  try {
    // 分頁用的 Prisma 參數
    const pagination = {
      skip: (pageNum - 1) * pageSize,
      take: pageSize,
    };

    const total = await prisma.product.count({
      where: { delete_at: null },
    });

    // 如果有帶 include=card，回傳卡片需要的欄位
    if (include === 'card') {
      const raw = await prisma.product.findMany({
        where: { delete_at: null },
        ...pagination,
        include: {
          product_image: {
            where: { sort_order: 0, valid: 1 },
            take: 1,
            select: { url: true },
          },
          product_sku: {
            where: { deleted_at: null },
            orderBy: { price: 'asc' },
            take: 1,
            select: { price: true },
          },
          product_category: { select: { name: true } },
          product_brand: { select: { name: true } },
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
        brand: p.product_brand?.name ?? '無品牌',
      }));

      return res.json({
        page: pageNum,
        limit: pageSize,
        total,
        data: products,
      });
    }

    // 預設查詢：只查基本欄位 + 分頁
    const basic = await prisma.product.findMany({
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
    const categories = await prisma.product_category.findMany({
      select: {
        id: true,
        name: true,
        ancestors: {
          select: {
            depth: true,
            ancestor: { select: { name: true } },
          },
          orderBy: { depth: 'desc' },
        },
      },
    });

    if (categories.length === 0) {
      return res.status(404).json({ message: 'not found' });
    }

    const result = categories.map((cat) => {
      const names = cat.ancestors.map((a) => a.ancestor.name);
      names.push(cat.name);
      return {
        id: cat.id,
        fullPath: names.join(' > '),
      };
    });

    res.json(result);
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
