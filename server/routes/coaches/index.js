import express from 'express';
import prisma from '../../lib/prisma.js';
const router = express.Router();

/* GET home page. */
router.get('/:id', function (req, res) {
  res
    .status(200)
    .json({ status: 'success', message: 'Express(path: /api/demo1)' });
});

// GET /api /coaches
// router.get('/', async function (req, res) {
//   const coaches = await prisma.coach.find({});
//   res.json(coaches);
// });
export default router;
