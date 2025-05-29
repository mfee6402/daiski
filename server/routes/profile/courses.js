import express from 'express';
import { PrismaClient } from '@prisma/client'; // 調整成你的路徑

const router = express.Router();
const prisma = new PrismaClient();

router.get('/', async (req, res, next) => {
  try {
    // 撈出課程關聯資料
    const course = await prisma.course.findUnique({
      where: { id: courseId },
      select: {
        id: true,
        name: true,
        description: true,
        content: true,
        start_at: true,
        end_at: true,
        CourseImg: { select: { id: true, img: true } },
        CourseVariant: {
          select: {
            id: true,
            difficulty: true,
            price: true,
            duration: true,
            coach_id: true,
          },
        },
        // location: {
        //   select: {
        //     id: true,
        //     name: true,
        //     country: true,
        //     city: true,
        //     address: true,
        //   },
        // },
      },
    });
    // 若找不到資料則回傳 404
    if (!course) {
      return res.status(404).json({ error: '找不到該課程' });
    }

    // 格式化日期為 YYYY/MM/DD
    const fmt = (dt) =>
      new Date(dt).toLocaleDateString('zh-TW', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      });

    // 組成前端易讀的 courseinfo
    const courseinfo = {
      id: course.id,
      name: course.name,
      description: course.description,
      content: course.content,
      period: `${fmt(course.start_at)} ~ ${fmt(course.end_at)}`,
      images: course.CourseImg.map((i) => i.img),
      variants: course.CourseVariant.map((v) => ({
        id: v.id,
        difficulty: v.difficulty,
        price: v.price,
        duration: v.duration,
        max_people: v.max_people,
        start_at: fmt(v.start_at),
        image: v.courseImg?.img || null,
        coach_id: v.coach_id,
        location_id: v.location_id,
      })),
    };

    // 回傳 JSON
    res.json(courseinfo);
  } catch (error) {
    console.error('取得課程資訊失敗:', error);
    res.status(500).json({ message: '伺服器錯誤' });
  }
});
export default router;
