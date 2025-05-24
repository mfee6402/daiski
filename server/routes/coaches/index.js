import express from 'express';
import prisma from '../../lib/prisma.js';
import { body, validationResult } from 'express-validator';
import fs from 'fs';
import path from 'path';
import multer from 'multer';
// import { fail } from 'assert';

const router = express.Router();

// multer上傳設定
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = 'upload/course';
    fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  // 檔名加時間戳避免重複
  filename(req, file, cb) {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, unique + path.extname(file.originalname));
  },
});
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 單檔案5MB
});

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

router.post(
  '/:id/create',
  upload.array('images', 5), // ① 先跑圖片上傳
  [
    /* ---------- ② express-validator 基本欄位檢查 ---------- */
    body('name').notEmpty().withMessage('課程名稱必填'),
    body('description').notEmpty(),
    body('content').notEmpty(),
    body('difficulty').isIn(['初級', '中級', '高級']),
    body('price').isFloat({ min: 0 }),
    body('duration').isInt({ min: 1 }),
    body('max_people').isInt({ min: 1 }),
    body('location_id').custom((v, { req }) => {
      if (v === 'other') {
        if (!req.body.new_name?.trim()) throw new Error('雪場名稱必填');
        if (!req.body.new_country?.trim()) throw new Error('國家必填');
        if (!req.body.new_city?.trim()) throw new Error('城市必填');
      } else if (!/^\d+$/.test(v)) {
        throw new Error('location_id 格式錯誤');
      }
      return true;
    }),
    body('coach_id').isInt(),
    body('boardtype_id').isInt(),
    body('start_at').isISO8601(),
    body('end_at').isISO8601(),
  ],
  async (req, res) => {
    /* ---------- ③ 驗證失敗回 400 ---------- */
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ status: 'fail', errors: errors.array() });
    }
    // ---------- 解析地點 ----------
    let locId = Number(req.body.location_id);
    if (req.body.location_id === 'other') {
      const { new_name, new_country, new_city, new_address, new_lat, new_lng } =
        req.body;

      // ① 先查重：同名同國城市 → 直接用舊 id
      const existed = await prisma.location.findFirst({
        where: { name: new_name, country: new_country, city: new_city },
      });

      if (existed) locId = existed.id;
      else {
        // ② 新增 location
        const newLoc = await prisma.location.create({
          data: {
            name: new_name,
            country: new_country,
            city: new_city,
            address: new_address || null,
            latitude: new_lat ? Number(new_lat) : null,
            longitude: new_lng ? Number(new_lng) : null,
          },
        });
        locId = newLoc.id;
      }
    }
    /* ---------- ④ 解析表單欄位 ---------- */
    const {
      name,
      description,
      content,
      start_at,
      end_at,
      difficulty,
      price,
      duration,
      max_people,
      location_id,
      coach_id,
      boardtype_id,
      tags,
    } = req.body;

    /* ---------- ⑤ 處理圖片 ---------- */
    const files = req.files || [];
    if (!files.length) {
      return res
        .status(400)
        .json({ status: 'fail', message: '請至少上傳一張圖片' });
    }
    // 每張圖存到 course_img，第一張設為封面 isCover=true
    const imgBulkData = files.map((f, idx) => ({
      img: `/uploads/course/${f.filename}`,
      isCover: idx === 0,
    }));

    /* ---------- ⑥ 處理 TAG：轉成陣列 ---------- */
    let tagList = [];
    if (tags) {
      try {
        // 前端若送 JSON 字串 ["粉雪","北海道"]
        tagList = Array.isArray(tags) ? tags : JSON.parse(tags);
      } catch {
        // 退而求其次：逗號字串 "粉雪,北海道"
        tagList = String(tags)
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean);
      }
    }

    /* ---------- ⑦ Prisma Transaction ---------- */
    try {
      const created = await prisma.$transaction(async (tx) => {
        /* ① course 主表 */
        const course = await tx.course.create({
          data: {
            name,
            description,
            content,
            start_at: new Date(start_at),
            end_at: new Date(end_at),
          },
        });

        /* ② 批次插入圖片 */
        await tx.courseImg.createMany({
          data: imgBulkData.map((d) => ({ ...d, course_id: course.id })),
        });

        /* ③ 找封面圖 id */
        const coverImg = await tx.courseImg.findFirst({
          where: { course_id: course.id, isCover: true },
        });

        /* ④ 建 course_variant */
        await tx.courseVariant.create({
          data: {
            course_id: course.id,
            difficulty,
            price: String(price), // 你若 Prisma schema 改 Decimal 就存 Number(price)
            duration: Number(duration),
            max_people: Number(max_people),
            location_id: Number(location_id),
            coach_id: Number(coach_id),
            boardtype_id: Number(boardtype_id),
            course_img_id: coverImg.id,
            start_at: new Date(start_at),
          },
        });

        /* ⑤ tag upsert + 關聯 */
        for (const t of tagList) {
          const tag = await tx.tag.upsert({
            where: { name: t },
            update: {},
            create: { name: t },
          });
          await tx.courseTag.create({
            data: { course_id: course.id, tag_id: tag.id },
          });
        }

        return course; // transaction 回傳
      });

      return res.json({ status: 'success', data: created });
    } catch (err) {
      console.error('Create course error:', err);
      return res
        .status(500)
        .json({ status: 'fail', message: '伺服器錯誤，無法建立課程' });
    }
  }
);
export default router;
