import express from 'express';
import prisma from '../../lib/prisma.js';

// 解token獲得使用者資訊
import authenticate from '../../middlewares/authenticate.js';

const router = express.Router();

const cartCreateMap = {
  CartGroup: prisma.cartGroup,
  CartProduct: prisma.cartProduct,
  CartCourse: prisma.cartCourse,
};
const foreignKeyMap = {
  CartGroup: 'groupMemberId',
  CartProduct: 'productSkuId',
  CartCourse: 'courseId',
};

// 新增
router.post('/', authenticate, async function (req, res, next) {
  try {
    const userId = +req.user.id;
    const category = req.body.category;
    const itemId = req.body.itemId;

    // 檢查分類
    const cartModel = cartCreateMap[category];
    const foreignKeyName = foreignKeyMap[category];

    if (!cartModel) {
      return res.status(200).json({ status: 'fail', message: '分類不存在' });
    }

    // 查詢使用者對應的購物車
    const userCart = await prisma.cart.findFirst({
      where: { userId },
    });

    // FIXME檢查是否參加過判斷訂單中有沒有(改為其他人判斷是否參加過)

    // FIXME 要處理使用者如果沒購物車的話，要先新增購物車

    // 新增
    try {
      // 判斷是否存在，若不存在才新增，否則用PUT增加
      const existingItem = await cartModel.findFirst({
        where: {
          cartId: +userCart.id,
          [foreignKeyName]: itemId,
        },
      });
      if (!existingItem) {
        if (category === 'CartProduct') {
          await cartModel.create({
            data: {
              cartId: userCart.id,
              [foreignKeyName]: itemId,
              quantity: 1,
            },
          });
        } else {
          // 非商品沒有數量屬性
          await cartModel.create({
            data: {
              cartId: userCart.id,
              [foreignKeyName]: itemId,
            },
          });
        }
        return res.status(200).json({ status: 'success', data: '新增成功' });
      }
      return res
        .status(200)
        .json({ status: 'fail', data: '新增失敗，已存在，請改用PUT' });
    } catch (error) {
      return res.status(200).json({ status: 'fail', data: '新增失敗' });
    }
  } catch (e) {
    next(e);
  }
});

// 查詢
router.get('/', authenticate, async function (req, res) {
  try {
    const userId = +req.user.id;

    const data = await prisma.cart.findUnique({
      select: {
        CartProduct: {
          select: {
            id: true,
            quantity: true,
            productSku: {
              select: {
                id: true,
                price: true,
                product_size: {
                  select: {
                    name: true,
                  },
                },
                product: {
                  select: {
                    name: true,
                    product_image: {
                      select: {
                        url: true,
                      },
                      where: {
                        sort_order: 0,
                      },
                    },
                  },
                },
              },
            },
          },
        },
        CartCourse: {
          select: {
            courseVariant: {
              select: {
                id: true,
                price: true,
                duration: true,
                start_at: true,
                course: {
                  select: {
                    name: true,
                    CourseImg: {
                      select: {
                        img: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },

      where: {
        userId: userId,
      },
    });

    // 商品、課程攤平
    const CartProduct = data.CartProduct.map((item) => ({
      id: item.productSku.id,
      quantity: item.quantity,
      price: item.productSku.price,
      name: item.productSku.product.name,
      imageUrl: item.productSku.product.product_image[0].url,
      size: item.productSku.product_size.name,
    }));

    const CartCourse = data.CartCourse.map((item) => {
      const start_at = item.courseVariant.start_at;
      const duration = item.courseVariant.duration;
      const date = new Date(start_at);
      date.setHours(date.getHours() + duration);
      const end_at = date.toISOString();
      return {
        id: item.courseVariant.id,
        price: item.courseVariant.price,
        name: item.courseVariant.course.name,
        imageUrl: item.courseVariant.course.CourseImg[0].img,
        startAt: start_at,
        endAt: end_at,
        duration: duration,
      };
    });

    const totalCartProduct = CartProduct.reduce((acc, product) => {
      acc += product.price * product.quantity;
      return acc;
    }, 0);
    const totalCartCourse = CartCourse.reduce((acc, course) => {
      acc += course.price;
      return acc;
    }, 0);

    // 調用後端API獲得Group資料
    const url = `http://localhost:3005/api/group/user/${userId}`;

    let resGroup = await fetch(url);
    let CartGroup = (await resGroup.json()).memberships;

    CartGroup = CartGroup.map((item) => ({
      id: item.groupMemberId,
      name: item.group.title,
      startAt: item.group.time.split(' —')[0],
      endAt: item.group.time.split('— ')[1],
      price: item.group.price,
      // FIXME若無照片則回傳預設
      imageUrl: item.group.imageUrl ? item.group.imageUrl : '',
    }));

    // 優惠券
    const couponData = await prisma.userCoupon.findMany({
      select: {
        couponId: true,
        coupon: {
          select: {
            minPurchase: true,
            endAt: true,
            name: true,
            couponTarget: {
              select: {
                target: true,
              },
            },
            couponType: {
              select: {
                amount: true,
                type: true,
              },
            },
          },
        },
      },
      where: {
        userId: userId,
      },
    });

    // FIXME 要判斷過期跟已使用(問+1要不要做)
    const CartCoupon = couponData.map((item) => {
      const id = item.couponId;
      const name = item.coupon.name;
      const target = item.coupon.couponTarget.target;
      const amount = item.coupon.couponType.amount;
      const type = item.coupon.couponType.type;
      const endAt = item.coupon.endAt;
      const minPurchase = item.coupon.minPurchase;
      let canUse = false;
      const checked = false;
      // totalCartCourse
      // totalCartProduct
      if (target === '全站') {
        if (totalCartProduct + totalCartCourse >= minPurchase) {
          canUse = true;
        }
      } else if (target === '商品') {
        if (totalCartProduct >= minPurchase) {
          canUse = true;
        }
      } else if (target === '課程') {
        if (totalCartCourse >= minPurchase) {
          canUse = true;
        }
      }
      return {
        id,
        name,
        target,
        amount,
        type,
        endAt,
        minPurchase,
        canUse,
        checked,
      };
    });

    const cart = {
      ...data,
      CartProduct,
      CartCourse,
      CartGroup,
      CartCoupon,
    };

    return res.status(200).json({ status: 'success', cart });
  } catch (error) {
    return res
      .status(200)
      .json({ status: 'fail', message: `查詢失敗:${error}` });
  }
});

// 更新(只有商品有數量，課程跟揪團票券固定只有1)
router.put('/:itemId', authenticate, async function (req, res) {
  const category = req.body.category;
  // 檢查分類
  const cartModel = cartCreateMap[category];
  const foreignKeyName = foreignKeyMap[category];

  if (!cartModel) {
    return res.status(200).json({ status: 'fail', message: '分類不存在' });
  }

  const userId = +req.user.id;
  const nextItem = req.body.item;

  // 查詢使用者對應的購物車
  const userCart = await prisma.cart.findFirst({
    where: { userId },
  });
  try {
    await prisma.cartProduct.updateMany({
      where: {
        cartId: +userCart.id,
        [foreignKeyName]: +req.params.itemId,
      },
      data: {
        quantity: nextItem.quantity,
      },
    });

    res.status(200).json({ status: 'success', data: '更新商品成功' });
  } catch (error) {
    res.status(200).json({ status: 'fail', message: '更新商品失敗' });
  }
});

// 刪除
router.delete('/:itemId', authenticate, async function (req, res) {
  try {
    const category = req.body.category;
    // 檢查分類
    const cartModel = cartCreateMap[category];
    const foreignKeyName = foreignKeyMap[category];

    if (!cartModel) {
      return res.status(200).json({ status: 'fail', message: '分類不存在' });
    }

    const userId = +req.user.id;
    // 查詢使用者對應的購物車
    const userCart = await prisma.cart.findFirst({
      where: { userId },
    });

    await cartModel.deleteMany({
      where: {
        cartId: +userCart.id,
        [foreignKeyName]: +req.params.itemId,
      },
    });

    res.status(200).json({ status: 'success', message: '刪除成功' });
  } catch (error) {
    res
      .status(200)
      .json({ status: 'fail', message: '刪除失敗', error: { error } });
  }
});

// router.get('/coupon', authenticate, async function (req, res) {
//   try {
//     const userId = +req.user.id;
//     const data = await prisma.userCoupon.findMany({
//       where: {
//         userId: userId,
//       },
//     });
//     return res.status(200).json({ status: 'success', data: data });
//   } catch (error) {
//     res
//       .status(200)
//       .json({ status: 'fail', message: '優惠券選擇失敗:', error: { error } });
//   }
// });

export default router;
