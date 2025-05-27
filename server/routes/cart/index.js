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
router.get('/', authenticate, async function (req, res, next) {
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
          include: {
            // courseVariant: {
            //     //     select: {
            //     //       course_id: true,
            //     //       price: true,
            //     //       duration: true,
            //     //       start_at: true,
            //     //       course: {
            //     //         select: {
            //     //           name: true,
            //     //           CourseImg: {
            //     //             select: {
            //     //               img: true,
            //     //             },
            //     //           },
            //     //         },
            //     //       },
            //     //     },
            // },
          },
        },
      },

      where: {
        userId: userId,
      },
    });

    // id用於react的迴圈key值;
    const CartProduct = data.CartProduct.map((item) => ({
      id: item.productSku.id,
      quantity: item.quantity,
      price: item.productSku.price,
      name: item.productSku.product.name,
      imageUrl: item.productSku.product.product_image[0].url,
      size: item.productSku.product_size.name,
    }));

    // const CartCourse = data.CartCourse.map((item) => ({
    //   id: item.courseVariant.id,
    //   price: item.courseVariant.price,
    //   name: item.courseVariant.course.name,
    //   imageUrl: item.courseVariant.course.CourseImg[0].img,
    //   start_at: item.courseVariant.start_at,
    //   duration: item.courseVariant.duration,
    // }));

    const url = `http://localhost:3005/api/group/user/1`;

    let resGroup = await fetch(url);
    let CartGroup = (await resGroup.json()).memberships;

    CartGroup = CartGroup.map((item) => ({
      id: item.groupMemberId,
      title: item.group.title,
      time: item.group.time,
      price: item.group.price,
      // NOTE若無照片則回傳預設
      imageUrl: item.group.imageUrl ? item.group.imageUrl : '',
    }));

    const cart = {
      ...data,
      CartProduct,
      // CartCourse,
      CartGroup,
    };

    return res.status(200).json({ status: 'success', cart });
  } catch (e) {
    next(e);
  }
});

// 更新(只有商品有數量，課程跟揪團票券固定只有1)
router.put('/:itemId', authenticate, async function (req, res) {
  console.log(+req.params.itemId);
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
  try {
    await prisma.cartProduct.updateMany({
      where: {
        cartId: +userCart.id,
        [foreignKeyName]: +req.params.itemId,
      },
      data: {
        quantity: {
          increment: 1,
        },
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

export default router;
