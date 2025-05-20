import express from 'express';
import prisma from '../../lib/prisma.js';
import { date } from 'zod';

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
      id: true,
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
      couponTarget: {
        select: {
          target: true,
        },
      },
    },
  });
  const coupons = coupon.map(({ couponType, couponTarget, ...rest }) => ({
    ...rest,
    type: couponType.type,
    amount: couponType.amount,
    target: couponTarget.target,
  }));
  res.status(200).json({ status: 'success', coupons });
});

// 會員領取優惠卷
router.post('/user_coupon', async function (req, res) {
  const { userId, couponId } = req.body;
  try {
    const claim = await prisma.userCoupon.create({
      data: { userId, couponId },
    });
    res.status(200).json({ status: 'success', claim });
  } catch (error) {
    res.status(400).json({ error: '此優惠券已領取過' });
  }
});

// 查詢某會員所有領取過的優惠券
router.get('/user/coupons', async function (req, res) {
  const userId = req.user.id;
  console.log(userId);
  // try {
  //   const coupons = await prisma.userCoupon.create({
  //     where: { userId },
  //     include: { coupon: true },
  //   });

  //   coupons.map((usecoupon) => usecoupon.coupon);
  //   res.status(200).json({ status: 'success', coupons });
  // } catch (error) {
  //   res.status(400).json({ error: '此優惠券已領取過' });
  // }
  res.status(200).json({ status: 'success', date: 'ok' });
});
export default router;
