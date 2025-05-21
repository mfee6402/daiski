import express from 'express';
import prisma from '../../lib/prisma.js';
const router = express.Router();

// 抓課程列表
router.get('/', async function (req, res) {
  try {
    const course = await prisma.course.findMany({
      orderBy: { start_at: 'asc' },
      select: {
        id: true,
        name: true,
        start_at: true,
        end_at: true,
        CourseImg: {
          take: 1,
          select: { img: true },
        },
        CourseVariant: {
          select: {
            id: true,
            price: true,
          },
        },
      },
    });
    const result = course.map((c) => {
      const fmt = (date) =>
        new Date(date).toLocaleDateString('zh-TW', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
        });
      return {
        id: c.id,
        name: c.name,
        // 例如 "2025/01/01~2025/01/05"
        period: `${fmt(c.start_at)}~${fmt(c.end_at)}`,
        // price: c.price,
        photo: c.CourseImg[0]?.img || null,
        price: c.CourseVariant[0]?.price || null,
      };
    });

    res.status(200).json(result);
  } catch (error) {
    console.error('取得課程列表失敗：', error);
    res.status(500).json({ message: '伺服器錯誤，無法讀取課程列表' });
  }
});

// 課程詳細頁
router.get('/:id', async (req, res) => {
  const courseId = parseInt(req.params.id, 10);
  if (isNaN(courseId)) {
    // 如果參數不是數字回傳400
    return res.status(400).json({ message: '無效的課程id' });
  }
  try {
    const course = await prisma.course.findUnique({
      where: { id: courseId },
      select: {
        id: true,
        name: true,
        description: true,
        content: true,
        start_at: true,
        end_at: true,
        CourseImg: {
          select: { img: true },
        },
        CourseVariant: {
          select: {
            id: true,
            difficulty: true,
            price: true,
            duration: true,
            location_id: true,
            coach: {
              select: { id: true, name: true },
            },
            courseImg: {
              select: { img: true },
            },
          },
          orderBy: { start_at: 'asc' },
        },
        CourseTag: {
          select: {
            tag: { select: { name: true } },
          },
        },
      },
    });
    if (!course) {
      return res.status(404).json({ message: '找不到該課程' });
    }

    //  平整資料結構，回傳給前端
    const fmtDate = (d) =>
      new Date(d).toLocaleDateString('zh-TW', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      });

    const result = {
      id: course.id,
      name: course.name,
      description: course.description,
      content: course.content,
      period: `${fmtDate(course.start_at)}~${fmtDate(course.end_at)}`,

      // 多張圖片
      images: course.CourseImg.map((i) => i.img),

      // 所有變體（場次）資料
      variants: course.CourseVariant.map((v) => ({
        id: v.id,
        difficulty: v.difficulty,
        price: v.price,
        duration: v.duration,
        locationId: v.location_id,
        coach: { id: v.coach.id, name: v.coach.name },
        photo: v.courseImg?.img ?? null,
      })),

      // 標籤
      tags: course.CourseTag.map((ct) => ct.tag.name),
    };

    res.status(200).json(result);
  } catch (error) {
    console.error('取得課程資訊失敗:', error);
    res.status(500).json({ message: '伺服器錯誤' });
  }
});
export default router;
