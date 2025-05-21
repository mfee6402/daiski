import express from 'express';
import prisma from '../../lib/prisma.js';

const router = express.Router();

// 抓教練列表
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
// 教練詳細頁
router.get('/:id', async (req, res) => {
  const coachId = parseInt(req.params.id, 10);
  if (isNaN(coachId)) {
    // 如果參數不是數字回傳400
    return res.status(400).json({ message: '無效的教練id' });
  }
  try {
    const coach = await prisma.coach.findUnique({
      where: { id: coachId },
      select: {
        id: true,
        name: true,
        profilephoto: true,
        bio: true,
        experience: true,
        LanguageCoach: {
          select: {
            language: { select: { name: true } },
          },
        },
        BoardtypeCoach: {
          select: {
            boardtype: { select: { name: true } },
          },
        },
        LicenseCoach: {
          select: {
            license: { select: { name: true } },
          },
        },
        CourseVariant: {
          orderBy: { start_at: 'asc' },
          select: {
            start_at: true,
            course: {
              select: {
                name: true,
                CourseImg: {
                  take: 1,
                  select: { img: true },
                },
              },
            },
          },
        },
      },
    });
    if (!coach) {
      return res.status(404).json({ message: '找不到教練' });
    }
    const result = {
      id: coach.id,
      name: coach.name,
      profilephoto: coach.profilephoto,
      bio: coach.bio,
      experience: coach.experience,
      languages: coach.LanguageCoach.map((cl) => cl.language.name),
      boardtypes: coach.BoardtypeCoach.map((cb) => cb.boardtype.name),
      license: coach.LicenseCoach.map((cl) => cl.license.name),
      courses: coach.CourseVariant.map((cv) => ({
        name: cv.course.name,
        date: new Date(cv.start_at).toLocaleDateString('zh-TW', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
        }),
        photo: cv.course.CourseImg[0]?.img || null,
      })),
    };
    res.status(200).json(result);
  } catch (error) {
    console.error('取得教練資訊失敗:', error);
    res.status(500).json({ message: '伺服器錯誤' });
  }
});
export default router;
