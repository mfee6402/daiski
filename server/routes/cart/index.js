import express from 'express';
import prisma from '../../lib/prisma.js';

// 解token獲得使用者資訊
import authenticate from '../../middlewares/authenticate.js';

const router = express.Router();

// 新增
router.post('/', authenticate, async function (req, res, next) {
  try {
    const userId = +req.user.id;
    const category = req.body.category;
    const itemId = req.body.itemId;

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

    // FIXME檢查是否參加過，除了判斷購物車有沒有(已做)，還要判斷訂單中有沒有
    const existingCartItem = await cartModel.findFirst({
      where: {
        cartId: userCart.id,
        [foreignKeyName]: itemId,
      },
    });
    if (existingCartItem && category !== 'CartProduct') {
      console.log('已有且不可增加');
      return res
        .status(200)
        .json({ status: 'fail', message: '已有且不可增加' });
    }

    // FIXME 要處理使用者如果沒購物車的話，要先新增購物車

    // 新增
    if (category === 'CartProduct') {
      const existingCartItem = await cartModel.findFirst({
        where: {
          cartId: userCart.id,
          [foreignKeyName]: itemId,
        },
      });

      if (existingCartItem) {
        // 商品已存在，數量 +1
        await cartModel.update({
          where: {
            id: existingCartItem.id,
          },
          data: {
            quantity: {
              increment: 1,
            },
          },
        });
      } else {
        // 商品不存在，新增一筆
        await cartModel.create({
          data: {
            cartId: userCart.id,
            [foreignKeyName]: itemId,
            quantity: 1,
          },
        });
      }
    } else {
      await cartModel.create({
        data: {
          cartId: userCart.id,
          [foreignKeyName]: itemId,
          quantity: 1,
        },
      });
    }

    res.status(200).json({ status: 'success', data: '新增成功' });
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
  const updateQuantity = req.body.updateQuantity;
  try {
    const cart = await prisma.cartProduct.update({
      where: {
        id: +req.params.itemId,
      },
      data: {
        quantity: updateQuantity,
      },
    });

    res.status(200).json({ status: 'success', data: { cart } });
  } catch (error) {
    res.status(200).json({ status: 'fail', message: '更新商品失敗' });
  }
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
