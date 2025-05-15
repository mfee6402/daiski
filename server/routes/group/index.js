// server/routes/group/index.js
import express from 'express';
import { PrismaClient, ActivityType } from '@prisma/client';
import multer from 'multer';
import path from 'path';

const router = express.Router();
const prisma = new PrismaClient();

// Multer：把上傳檔存到 public/uploads
const upload = multer({
  storage: multer.diskStorage({
    destination(req, file, cb) {
      cb(null, path.join(process.cwd(), 'public', 'uploads'));
    },
    filename(req, file, cb) {
      cb(null, `${Date.now()}_${file.originalname}`);
    },
  }),
});

// YYYY-MM-DD → JS Date
function parseYMD(str) {
  if (typeof str !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(str)) return null;
  const d = new Date(str + 'T00:00:00Z');
  return isNaN(d.getTime()) ? null : d;
}

// GET /api/group?onlyTypes=true  或  GET /api/group
router.get('/', async (req, res, next) => {
  try {
    if (req.query.onlyTypes === 'true') {
      const [col] = await prisma.$queryRaw`
        SHOW COLUMNS FROM \`group\` LIKE 'type'
      `;
      const types = col.Type.match(/'[^']+'/g).map((s) => s.slice(1, -1));
      return res.json(types);
    }
    const groups = await prisma.group.findMany({
      include: {
        user: {
          select: {
            name: true,
            avatar: true,
          },
        },
       images: {
          select: {
            imageUrl: true,
          },
        },
      },
      // select: { user: true},
      orderBy: { createdAt: 'desc' },
    });
    res.json(groups);
  } catch (err) {
    next(err);
  }
});

// POST /api/group
router.post('/', upload.single('cover'), async (req, res, next) => {
  try {
    const {
      type: rawType,
      title,
      start_date,
      end_date,
      location, // 滑雪時傳 location_id
      customLocation, // 聚餐時傳文字
      min_people,
      max_people,
      price,
      allow_newbie,
      description,
    } = req.body;

    // 1. 支援 中文 label 或 SKI/MEAL
    const labelToKey = { 滑雪: 'SKI', 聚餐: 'MEAL' };
    let typeKey;
    if (labelToKey[rawType]) {
      typeKey = labelToKey[rawType];
    } else if (Object.values(ActivityType).includes(rawType)) {
      typeKey = rawType;
    } else {
      return res.status(400).json({ error: `無效的活動類型：${rawType}` });
    }

    // 2. 解析 & 驗證日期
    const sd = parseYMD(start_date);
    const ed = parseYMD(end_date);
    if (!sd || !ed) {
      return res.status(400).json({ error: '日期格式錯誤，請用 YYYY-MM-DD' });
    }

    // 3. 處理 cover 路徑
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

    // 4. 組 data
    const data = {
      type: typeKey,
      title,
      startDate: sd,
      endDate: ed,
      minPeople: Number(min_people),
      maxPeople: Number(max_people),
      price: Number(price),
      allowNewbie: allow_newbie === '1',
      description,
      createdAt: new Date(),
      user: { connect: { id: 1 } }, // 測試用，正式可改 session
    };

    // 5. 根據 typeKey 塞入不同欄位
    if (typeKey === ActivityType.SKI) {
      data.location = { connect: { id: Number(location) } };
    } else {
      data.customLocation = customLocation;
    }

    // 6. 建立 group
    const newGroup = await prisma.group.create({ data });

    // 7. 如果有 cover 圖，再寫進 groupimage
    if (imageUrl) {
      await prisma.groupImage.create({
        data: {
          group: { connect: { id: newGroup.id } },
          imageUrl, // schema 裡的 imageUrl
          sortOrder: 0,
        },
      });
    }

    res.status(201).json(newGroup);
  } catch (err) {
    next(err);
  }
});

export default router;
