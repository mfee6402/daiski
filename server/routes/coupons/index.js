import express from 'express';
import prisma from '../../lib/prisma.js';

const router = express.Router();

/* GET home page. */
// router.get('/', function (req, res) {
//   res
//     .status(200)
//     .json({ status: 'success', message: 'Express(path: /api/demo1)' });
// });

// 查詢
router.get('/', async function (req, res) {
  const coupon = await prisma.coupon.findMany({
    select: {
      // 想顯示的 scalar 欄位
      name: true,
      startAt: true,
      endAt: true,
      usageLimit: true,
      minPurchase: true,
      // 關聯欄位也放進 select
      couponType: {
        select: {
          type: true,
          amount: true,
        },
      },
    },
  });
  const flattened = coupon.map(({ couponType, ...rest }) => ({
    ...rest,
    ...couponType,
  }));

  res.status(200).json({ status: 'success', flattened });
});

export default router;
