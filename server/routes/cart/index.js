import express from 'express'
import db from '../../config/mysql.js'
import prisma from '../../lib/prisma.js'


const router = express.Router()


// 新增
router.post('/', async function (req, res) {
  const cart = await prisma.cart.create({
  
  data: {
    userId: 1,
  },
});

  res
    .status(200)
    .json({ status: 'success',data:{cart}})
})


// 查詢
router.get('/', async function (req, res) {
  const data = await prisma.cart.findUnique({
  include: {
    // 相當於 JOIN cart ON cart.id = post.cart
    
     CartProduct: {
      include: {
        product: {
          include: {
            product_image: true, // 取得圖片
          },
        },
      },
    },
    CartCourse:{
     select:{
        courseId:true,
      }
    },
    CartGroup:{
     select:{
        groupId:true,
      }
    },
    
  },
  where: {
    id: 1,
  },
});
  // 攤平 CartProduct 內的 product.name 成 productName
  // const flatCartProduct = data.CartProduct.map(item => ({
  //   id: item.id,
  //   cartId: item.cartId,
  //   productId: item.productId,
  //   quantity: item.quantity,
  //   name: item.product.name
  // }));

  // 替換原本的 CartProduct 為攤平後的資料
  // const cart = {
  //   ...data,
  //   CartProduct: flatCartProduct
  // };
  res
    .status(200)
    .json({ status: 'success', data})
})

// 更新(只有商品有數量，課程跟揪團票券固定只有1)
router.put('/:itemId', async function (req, res) {
  // console.log(req.body.data.cart)
  // console.log(req.body.data.cart.CartProduct[req.params.itemId].quantity)

  // const cart = await prisma.cartProduct.update({
  // where: {
  //   id: +req.params.itemId,
  // },
  // data: {
  //   quantity: req.body.data.cart.CartProduct[req.params.itemId].quantity,
  // },
// });
console.log(+req.params.itemId)
  res
    .status(200)
    .json({ status: 'success',data:{}})
})

// 刪除
router.delete('/:itemId', async function (req, res) {
  const cart = await prisma.cart.delete({
  where: {
    id: +req.params.itemId,
  }
});

  res
    .status(200)
    .json({ status: 'success',data:{cart}})
})

export default router
