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
    // 相當於 JOIN
     CartProduct:
     {
      include:{
        productSku:{
          select:{
            price:true,
            product_size:{
              select:{
                name:true
              }
            },
            product:{
              select:{
                name:true,
                product_image:{
                  select:{
                    url:true
                  },
                  where:{
                    sort_order:0
                  }
                }
              }
            }
          }
        }
      }
    },
    CartCourse:true,
    // {
    //  select:{
    //     courseId:true,
    //   }
    // },
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

  const CartProduct = data.CartProduct.map(item => ({
    id: item.id,
    productSkuId: item.productSkuId,
    quantity: item.quantity,
    price: item.productSku.price,
    name: item.productSku.product.name,
    imageUrl:  item.productSku.product.product_image[0].url,
    size:  item.productSku.product_size.name
  }));

  const cart = {
    ...data,
    CartProduct
  }

  res
    .status(200)
    .json({ status: 'success', cart})
})

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
