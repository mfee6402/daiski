import express from 'express';
import prisma from '../../lib/prisma.js';
const router = express.Router();

/* GET home page. */
router.get('/:id', function (req, res) {
  res
    .status(200)
    .json({ status: 'success', message: 'Express(path: /api/demo1)' });
});

router.get('/', async function (req, res) {
  try {
    const coaches = await prisma.coach.findMany({
      select: {
        id: true,
        name: true,
        profilephoto: true,
        LanguageCoach: {
          select: {
            language: {
              select: { name: true },
            },
          },
        },
        BoardtypeCoach: {
          select: {
            boardtype: {
              select: { name: true },
            },
          },
        },
      },
    });
    const result = coaches.map((coach) => ({
      id: coach.id,
      name: coach.name,
      profilephoto: coach.profilephoto,
      languages: coach.LanguageCoach.map((cl) => cl.language.name),
      boardtypes: coach.BoardtypeCoach.map((cl) => cl.boardtype.name),
    }));
    res.status(200).json(result);
  } catch (error) {
    console.error('取得教練列表失敗：', error);
    res.status(500).json({ message: '伺服器錯誤，無法讀取教練資料' });
  }
});
export default router;
