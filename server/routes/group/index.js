// routes/group/index.js
import express from 'express'
import prisma from '../../lib/prisma.js'   // 你建立的 PrismaClient 實例

const router = express.Router()

// 1. 列表：GET /api/groups
router.get('/', async (req, res, next) => {
  try {
    const groups = await prisma.group.findMany({
      include: {
        user: true,
        location: true,
        images: { where: { sortOrder: 0 } },
      }
    })
    res.json(groups)
  } catch (err) {
    next(err)
  }
})

// 2. 詳細：GET /api/groups/:id
router.get('/:id', async (req, res, next) => {
  try {
    const id = Number(req.params.id)
    const group = await prisma.group.findUnique({
      where: { id },
      include: {
        user: true,
        location: true,
        members: true,
        images: { orderBy: { sortOrder: 'asc' } },
        comments: { orderBy: { createdAt: 'desc' } },
        chatRoom: { include: { messages: true } },
      }
    })
    if (!group) return res.status(404).json({ error: 'Not Found' })
    res.json(group)
  } catch (err) {
    next(err)
  }
})

// 3. 建立：POST /api/groups
router.post('/', async (req, res, next) => {
  try {
    const {
      userId, locationId, title, type, difficulty,
      startDate, endDate, minPeople, maxPeople,
      price, description, allowNewbie
    } = req.body

    const newGroup = await prisma.group.create({
      data: {
        userId,
        locationId,
        title,
        type,
        difficulty,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        minPeople,
        maxPeople,
        price,
        description,
        allowNewbie,
      }
    })
    res.status(201).json(newGroup)
  } catch (err) {
    next(err)
  }
})

// 4. 更新：PUT /api/groups/:id
router.put('/:id', async (req, res, next) => {
  try {
    const id = Number(req.params.id)
    const data = req.body
    const updated = await prisma.group.update({
      where: { id },
      data,
    })
    res.json(updated)
  } catch (err) {
    next(err)
  }
})

// 5. 刪除：DELETE /api/groups/:id
router.delete('/:id', async (req, res, next) => {
  try {
    const id = Number(req.params.id)
    await prisma.group.delete({ where: { id } })
    res.status(204).end()
  } catch (err) {
    next(err)
  }
})

export default router
