import express from 'express';
import { PrismaClient } from '@prisma/client';
import multer from 'multer';
import path from 'path';

const router = express.Router();
const prisma = new PrismaClient();

// Multer 設定：把封面圖存到 public/uploads
const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      const dir = path.join(process.cwd(), 'public', 'uploads');
      cb(null, dir);
    },
    filename: (req, file, cb) => {
      cb(null, `${Date.now()}_${file.originalname}`);
    },
  }),
});

// GET /api/group?onlyTypes=true
//   若帶 onlyTypes=true，回傳 ENUM('SKI','MEAL') 內所有值
// GET /api/group
//   預設回傳所有群組資料
router.get('/', async (req, res, next) => {
  try {
    if (req.query.onlyTypes === 'true') {
      // 讀 MySQL ENUM 定義
      const [col] = await prisma.$queryRaw`
        SHOW COLUMNS FROM \`group\` LIKE 'type'
      `;
      const enumDef = col.Type;             // e.g. "enum('SKI','MEAL')"
      const types = enumDef
        .match(/'[^']+'/g)
        .map(s => s.slice(1, -1));          // 去掉單引號
      return res.json(types);
    }

    // 回傳所有 group
    const groups = await prisma.group.findMany({
      orderBy: { createdAt: 'desc' },
    });
    res.json(groups);

  } catch (err) {
    next(err);
  }
});

// POST /api/group
//   接收 multipart/form-data (cover 圖)，並新增一筆 group
router.post('/', upload.single('cover'), async (req, res, next) => {
  try {
    const {
      type, title, start_date, end_date,
      location, min_people, max_people,
      price, allow_newbie, description
    } = req.body;

    let cover_url = null;
    if (req.file) {
      cover_url = `/uploads/${req.file.filename}`;
    }

    const newGroup = await prisma.group.create({
      data: {
        type,
        title,
        start_date: new Date(start_date),
        end_date:   new Date(end_date),
        location,
        min_people: parseInt(min_people, 10),
        max_people: parseInt(max_people, 10),
        price:      parseInt(price, 10),
        allow_newbie: allow_newbie === '1',
        description,
        cover_image: cover_url,
        created_at:  new Date(),
      },
    });

    res.status(201).json(newGroup);
  } catch (err) {
    next(err);
  }
});

export default router;
