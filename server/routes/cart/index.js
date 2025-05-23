import express from 'express';
import prisma from '../../lib/prisma.js';

// 解token獲得使用者資訊
import authenticate from '../../middlewares/authenticate.js';

const router = express.Router();

// 新增
router.post('/', authenticate, async function (req, res, next) {
  try {
    //   const userId = +req.user.id;
    //   const category = req.body.category;
    //   const itemId = req.body.itemId;
    //   console.log({ userId, category, itemId });
    //   const cartCreateMap = {
    //     CartGroup: prisma.cartGroup,
    //     CartProduct: prisma.cartProduct,
    //     CartCourse: prisma.cartCourse,
    //   };
    //   // 檢查分類
    //   const cartModel = cartCreateMap[category];

    //   if (!cartModel) {
    //     return res.status(200).json({ status: 'fail', message: '分類不存在' });
    //   }

    //   // 獲得使用者對應的購物車
    //   const userCart = await prisma.cart.findFirst({
    //     where: { userId },
    //   });

    //   // FIXME檢查是否參加過，除了判斷購物車有沒有(已做)，還要判斷訂單中有沒有
    //   const checkJoin = await prisma.cartGroup.findFirst({
    //     where: { cartId: userCart.id, groupMemberId: itemId },
    //   });
    //   if (checkJoin) {
    //     console.log('已參加');
    //     return res.status(200).json({ status: 'fail', message: '已參加' });
    //   }

    //   // FIXME 要處理如果沒購物車的話，要先新增購物車

    //   // 新增
    //   await cartModel.create({
    //     data: {
    //       cartId: userCart.id,
    //       groupMemberId: itemId,
    //     },
    //   });

    res.status(200).json({ status: 'success', data: 'OK' });
  } catch (e) {
    next(e);
  }
});

// 查詢
router.get('/', async function (req, res, next) {
  try {
    // const userId = +req.user.id;

    const data = await prisma.cart.findUnique({
      select: {
        // 相當於 JOIN
        CartProduct: {
          select: {
            id: true,
            quantity: true,
            productSku: {
              select: {
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
            courseVariant: true,
          },
        },

        CartGroup: {
          include: {
            groupMember: {
              select: {
                joinedAt: true,
                group: {
                  select: {
                    title: true,
                    price: true,
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
      // FIXME等待會員資料
      // 查詢第1台購物車
      where: {
        userId: 1,
      },
    });

    // id用於react的迴圈key值
    const CartProduct = data.CartProduct.map((item) => ({
      id: item.id,
      productSkuId: item.productSkuId,
      quantity: item.quantity,
      price: item.productSku.price,
      name: item.productSku.product.name,
      imageUrl: item.productSku.product.product_image[0].url,
      size: item.productSku.product_size.name,
    }));

    const CartGroup = data.CartGroup.map((item) => ({
      id: item.id,
      joinedAt: item.groupMember.joinedAt,
      title: item.groupMember.group.title,
      price: item.groupMember.group.price,
      // NOTE若無照片則回傳預設
      imageUrl: item.groupMember.group.images[0]?.imageUrl
        ? item.groupMember.group.images[0].imageUrl
        : '',
    }));

    const cart = {
      ...data,
      CartProduct,
      CartGroup,
    };

    res.status(200).json({ status: 'success', cart });
  } catch (e) {
    next(e);
  }
});

// 更新(只有商品有數量，課程跟揪團票券固定只有1，但為了日後擴充性，req傳遞購物車全部)
router.put('/:itemId', async function (req, res) {
  // console.log(req.body.data.cart)
  // console.log(req.body.data.cart.CartProduct[req.params.itemId].quantity)

  //   const cart = await prisma.cartProduct.update({
  //   where: {
  //     id: +req.params.itemId,
  //   },
  //   data: {
  //     quantity: req.body.data.cart.CartProduct[req.params.itemId].quantity,
  //   },
  // });

  res.status(200).json({ status: 'success', data: {} });
});

// 刪除
router.delete('/:itemId', async function (req, res) {
  const cart = await prisma.cart.delete({
    where: {
      id: +req.params.itemId,
    },
  });

  res.status(200).json({ status: 'success', data: { cart } });
});

export default router;
