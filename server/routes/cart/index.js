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
    let resGroup = await fetch(
      `http://localhost:3005/api/group/user/${userId}`
    );
    let CartGroup = (await resGroup.json()).memberships;
    console.log(CartGroup);
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
    let resCoupon = await fetch(`http://localhost:3005/api/coupons/cartcoupon`);
    let CartCoupon = await resCoupon.json();

    CartCoupon = couponData.map((item) => {
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
      userInfo: {
        name: '',
        phone: '',
      },
      shippingInfo: {
        zipCode: '',
        address: '',
        shippingMethod: '',
        storename: '',
      },
      payment: '',
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
// 清空購物車
router.delete('/items', authenticate, async function (req, res) {
  try {
    const userId = +req.user.id;
    // 查詢使用者對應的購物車
    const userCart = await prisma.cart.findFirst({
      where: { userId },
    });

    await prisma.cartCourse.deleteMany({
      where: {
        cartId: +userCart.id,
      },
    });
    await prisma.cartProduct.deleteMany({
      where: {
        cartId: +userCart.id,
      },
    });
    await prisma.cartGroup.deleteMany({
      where: {
        cartId: +userCart.id,
      },
    });

    return res.status(200).json({ status: 'success', message: '購物車已清空' });
  } catch (error) {
    return res
      .status(200)
      .json({ status: 'fail', message: `查詢失敗:${error}` });
  }
});
// 刪除特定商品
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
    console.log(req.params.itemId);
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

router.post('/order', authenticate, async function (req, res) {
  try {
    const userId = +req.user.id;
    const orderInput = req.body;

    const {
      shipping,
      payment,
      name,
      phone,
      address,
      amount,
      couponId,
      CartGroup,
      CartCourse,
      CartProduct,
    } = orderInput;

    const orderResult = await prisma.order.create({
      data: {
        userId,
        // 其他欄位，如：
        amount,
        couponId,
        payment,
        address,
        phone,
        name,
        shipping,
      },
    });

    const newOrderId = orderResult.id;

    // 揪團
    const groupIds = CartGroup.map((item) => item.id);
    const orderGroup = groupIds.map((groupId) => ({
      orderId: newOrderId,
      groupId,
    }));

    const orderGroupResult = await prisma.orderGroup.createMany({
      data: orderGroup,
    });

    // 課程
    const courseIds = CartCourse.map((item) => item.id);
    const orderCourse = courseIds.map((courseId) => ({
      orderId: newOrderId,
      courseId,
    }));

    const orderCourseResult = await prisma.orderCourse.createMany({
      data: orderCourse,
    });

    // 商品
    const orderProduct = CartProduct.map((product) => ({
      orderId: newOrderId,
      productSkuId: product.id,
      quantity: product.quantity,
    }));

    const orderProductResult = await prisma.orderProduct.createMany({
      data: orderProduct,
    });

    return res.status(200).json({ status: 'success', data: orderResult });
  } catch (error) {
    res
      .status(200)
      .json({ status: 'fail', message: '訂單失敗:', error: { error } });
  }
});

// 訂單紀錄
router.get('/orders', authenticate, async function (req, res) {
  try {
    const userId = +req.user.id;

    const ordersResult = await prisma.order.findMany({
      select: {
        id: true,
        amount: true,
        createdAt: true,
        orderProduct: {
          select: {
            quantity: true,
            productSku: {
              select: {
                id: true,
                product: {
                  select: {
                    name: true,
                    product_image: {
                      select: {
                        url: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
        orderCourse: {
          select: {
            courseVariant: {
              select: {
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
        orderGroup: {
          select: {
            groupMember: {
              select: {
                group: {
                  select: {
                    title: true,
                    images: {
                      select: {
                        imageUrl: true,
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

    const toUTC8 = (utcString) => {
      const date = new Date(utcString);
      date.setHours(date.getHours() + 8); // 加上 8 小時
      const [d, t] = date.toISOString().split('T');
      return `${d} ${t.split('.')[0].slice(0, 5)}`;
    };

    //  const CartCourse = data.CartCourse.map((item) => {
    //     const start_at = item.courseVariant.start_at;
    //     const duration = item.courseVariant.duration;
    //     const date = new Date(start_at);
    //     date.setHours(date.getHours() + duration);
    //     const end_at = date.toISOString();
    //     return {
    //       id: item.courseVariant.id,
    //       price: item.courseVariant.price,
    //       name: item.courseVariant.course.name,
    //       imageUrl: item.courseVariant.course.CourseImg[0].img,
    //       startAt: start_at,
    //       endAt: end_at,
    //       duration: duration,
    //     };
    //   });

    const orders = ordersResult.map((order) => {
      return {
        id: order.id,
        amount: order.amount,
        createdAt: toUTC8(order.createdAt),

        // 商品名稱陣列
        OrderProduct: order.orderProduct.map((item) => {
          return {
            id: item.productSku.id,
            quantity: item.quantity,
            name: item.productSku.product.name,
            imageUrl: item.productSku.product.product_image[0].url,
          };
        }),

        OrderCourse: order.orderCourse.map((item) => {
          return {
            name: item.courseVariant.course.name,
            imageUrl: item.courseVariant.course.CourseImg[0]?.img,
          };
        }),

        OrderGroup: order.orderGroup.map((item) => {
          return {
            name: item.groupMember.group.title,
            imageUrl: item.groupMember.group.images[0].imageUrl,
          };
        }),
      };
    });

    return res.status(200).json({ status: 'success', orders });
  } catch (error) {
    return res
      .status(200)
      .json({ status: 'fail', message: `查詢失敗:${error}` });
  }
});

export default router;
