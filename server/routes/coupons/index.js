import express from 'express';
import prisma from '../../lib/prisma.js';
import { date } from 'zod';
import authenticate from '../../middlewares/authenticate.js';

const router = express.Router();

/* GET home page. */
// router.get('/', function (req, res) {
//   res
//     .status(200)
//     .json({ status: 'success', message: 'Express(path: /api/demo1)' });
// });

// 查詢
router.get('/', async function (req, res) {
  try {
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
  } catch (error) {
    res.status(200).json({ status: 'fail', data: '查詢資料庫失敗' });
  }
});

// 會員領取優惠卷   //TODO 日期要修改成台灣
router.post('/claimcoupon', authenticate, async function (req, res) {
  const { couponId } = req.body;
  const userId = req.user.id;
  console.log(couponId);

  try {
    const claim = await prisma.userCoupon.create({
      data: { userId, couponId },
    });
    res.status(200).json({ status: 'success', claim });
  } catch (error) {
    res.status(200).json({ status: 'fail', data: '此優惠券已領取過' });
  }
});

// 查詢某會員所有領取過的優惠券
router.get('/usercoupon', authenticate, async function (req, res) {
  try {
    const userId = req.user.id;

    const usercoupons = await prisma.userCoupon.findMany({
      where: {
        userId: userId,
      },
      include: {
        coupon: {
          select: {
            // 想顯示的 scalar 欄位
            id: true,
            name: true,
            startAt: true,
            endAt: true,
            usageLimit: true,
            minPurchase: true,
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
        },
      },
    });
    // usercoupons.map((usecoupon) => usecoupon.coupon);
    const usercoupon = usercoupons.map(({ coupon }) => ({
      id: coupon.id,
      name: coupon.name,
      startAt: coupon.startAt,
      endAt: coupon.endAt,
      usageLimit: coupon.usageLimit,
      minPurchase: coupon.minPurchase,
      type: coupon.couponType.type,
      amount: coupon.couponType.amount,
      target: coupon.couponTarget.target,
    }));
    res.status(200).json({ status: 'success', usercoupon });
  } catch (error) {
    res.status(400).json({ error });
  }
});

const app = express();

// 這行要在所有路由之前
app.use(express.json());

// 這行要確保 router 的路徑跟你呼叫一致
app.use('/api', router);
export default router;
