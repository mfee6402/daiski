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
  const cart = await prisma.cart.findUnique({
  include: {
    // 相當於 JOIN cart ON cart.id = post.cart
    CartProduct:{
      select:{
        productId:true,
        quantity:true
      }
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

  res
    .status(200)
    .json({ status: 'success',data:{cart}})
})

// 更新
router.put('/:itemId', async function (req, res) {
  const cart = await prisma.cartProduct.update({
  where: {
    id: +req.params.itemId,
  },
  data: {
    quantity: 3,
  },
});

  res
    .status(200)
    .json({ status: 'success',data:{cart}})
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
