import express from 'express'
import db from '../../config/mysql.js'
import prisma from '../../lib/prisma.js'


const router = express.Router()

/* GET home page. */
router.get('/', async function (req, res) {
  const user = await prisma.users.findUnique({
  where: {
    id: 1,
  },
});

  res
    .status(200)
    .json({ status: 'success',data:{user}})
})

export default router
