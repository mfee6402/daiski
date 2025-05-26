import express from 'express';
import prisma from '../../lib/prisma.js';
import { body, validationResult } from 'express-validator';
import fs from 'fs';
import path from 'path';
import multer from 'multer';
// import { exit } from 'process';
// import { fail } from 'assert';

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

// 1. multer 設定：把上傳的圖存到 upload/course/
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'upload/course/'),
  filename: (req, file, cb) => {
    const ext = file.originalname.split('.').pop();
    cb(
      null,
      `course_${Date.now()}_${Math.random().toString(36).slice(-6)}.${ext}`
    );
  },
});
const upload = multer({ storage });

// 2. express-validator 規則
const courseValidators = [
  body('name').notEmpty().withMessage('課程名稱必填'),
  body('description').isLength({ min: 10 }).withMessage('簡述至少 10 字'),
  body('content').notEmpty().withMessage('內文必填'),
  body('start_at').optional().isISO8601().withMessage('開始時間格式異常'),
  body('end_at').isISO8601().withMessage('結束時間格式異常'),
  body('difficulty').notEmpty().withMessage('難度必填'),
  body('price').isNumeric().withMessage('價格須為數字'),
  body('duration').isInt().withMessage('時長須為整數（分鐘）'),
  body('max_people').isInt().withMessage('人數上限須為整數'),
  // location_id 沒填或選「其他」時，可以傳 0，再看 new_location_* 欄位
  body('location_id').isInt().withMessage('地點 ID 必須是數字'),
  body('tagIds').optional().isArray().withMessage('標籤須以陣列形式傳送'),
  body('boardtype_id').isInt().withMessage('請選擇單/雙板'),
];

// 3. 路由
router.post(
  '/:id/create', // :id 可改成你要的路徑參數（教練 id 或不用也行）
  upload.array('images', 5), // 處理上傳欄位 images (最多 5 張)
  courseValidators, // 欄位驗證
  async (req, res) => {
    // 3.1 驗證錯誤
    const errs = validationResult(req);
    if (!errs.isEmpty()) {
      return res.status(400).json({ errors: errs.array() });
    }
    // 3.2 拆解欄位
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
      location_id, // 既有地點的 id，若選「其他」可傳 0
      boardtype_id,
      new_location_name, // 如果選「其他」，前端另外傳這些欄位
      new_location_country,
      new_location_city,
      new_location_address,
      tagIds = [],
    } = req.body;
    console.log('收到的 body:', req.body);
    console.log(
      '收到的 files:',
      req.files.map((f) => f.fieldname)
    );
    console.log('-------');
    console.log(req.body);

    // 圖片檔案路徑
    const imagePaths = req.files.map((f) => `/upload/course/${f.filename}`);

    try {
      // 3.3 transaction 一次處理所有建立
      const course = await prisma.$transaction(async (tx) => {
        // 3.3.1 如果選了「其他」，先建 Location
        let locId = parseInt(location_id, 10);
        if (locId === 0 && new_location_name) {
          const loc = await tx.location.create({
            data: {
              name: new_location_name,
              country: new_location_country,
              city: new_location_city,
              address: new_location_address,
              // latitude/longitude 如要 geocode 可留 0 或後續更新
              latitude: 0,
              longitude: 0,
            },
          });
          locId = loc.id;
        }

        // 3.3.2 建 Course
        const created = await tx.course.create({
          data: {
            name,
            description,
            content,
            start_at: start_at ? new Date(start_at) : new Date(),
            end_at: new Date(end_at),
            // 其它欄位 if needed...
          },
        });

        // 3.3.3 建多張 CourseImg
        const savedImgs = await tx.courseImg.createMany({
          data: imagePaths.map((url) => ({
            course_id: created.id,
            img: url,
          })),
        });

        // 3.3.4 建 CourseVariant
        // 用第一張圖做為 variant 的 course_img_id
        const firstImg = await tx.courseImg.findFirst({
          where: { course_id: created.id },
        });
        console.log({
          course_id: created.id,
          difficulty,
          price,
          duration: parseInt(duration, 10),
          max_people: parseInt(max_people, 10),
          location_id: locId,
          coach_id: parseInt(req.params.id, 10), // or req.user.id
          course_img_id: firstImg?.id,
          start_at: start_at ? new Date(start_at) : new Date(),
        });
        await tx.courseVariant.create({
          data: {
            course_id: created.id,
            difficulty,
            price,
            duration: parseInt(duration, 10),
            max_people: parseInt(max_people, 10),
            location_id: locId,
            coach_id: parseInt(req.params.id, 10), // or req.user.id
            course_img_id: firstImg?.id,
            start_at: start_at ? new Date(start_at) : new Date(),
          },
        });
        // 5) 建立教練跟板型的關聯
        await tx.boardtypeCoach.create({
          data: {
            coach_id: parseInt(req.params.id, 10),
            boardtype_id: parseInt(boardtype_id, 10),
          },
        });

        // 3.3.5 建 CourseTag
        console.log('--------------------');
        const tagMap = {
          初級: 1,
        };
        if (tagIds.length) {
          console.log(tagIds);
          await tx.courseTag.createMany({
            data: tagIds.map((tag) => ({
              course_id: created.id,
              tag_id: parseInt(tagMap[tag], 10),
            })),
          });
        }

        return created;
      });

      return res.status(201).json({ status: 'success', data: course });
    } catch (error) {
      console.error('建立課程失敗, 詳細錯誤：', error);
      return res.status(500).json({ status: 'error', message: '伺服器錯誤' });
    }
  }
);
export default router;
