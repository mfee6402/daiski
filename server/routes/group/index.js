import express from 'express';
import { PrismaClient, ActivityType } from '@prisma/client';
import multer from 'multer';
import path from 'path';

const router = express.Router();
const prisma = new PrismaClient();

// ── Multer 設定：把封面圖存到 public/uploads ───────────
const upload = multer({
  storage: multer.diskStorage({
    destination(req, file, cb) {
      const uploadDir = path.join(process.cwd(), 'public', 'uploads');
      cb(null, uploadDir);
    },
    filename(req, file, cb) {
      cb(null, `${Date.now()}_${file.originalname}`);
    },
  }),
});
// ─────────────────────────────────────────────────────────

// YYYY-MM-DD → JS Date；格式錯誤回 null
function parseYMD(str) {
  if (typeof str !== 'string') return null;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(str)) return null;
  const d = new Date(str + 'T00:00:00Z');
  return isNaN(d.getTime()) ? null : d;
}

// GET /api/group?onlyTypes=true
router.get('/', async (req, res, next) => {
  try {
    if (req.query.onlyTypes === 'true') {
      const [col] = await prisma.$queryRaw`
        SHOW COLUMNS FROM \`group\` LIKE 'type'
      `;
      const types = col.Type.match(/'[^']+'/g).map(s => s.slice(1, -1));
      return res.json(types);
    }

    const groups = await prisma.group.findMany({
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
      type: rawType,     // 可能是 enum key 或中文 label
      title,
      start_date,        // "YYYY-MM-DD"
      end_date,
      location,
      min_people,
      max_people,
      price,
      allow_newbie,
      description,
    } = req.body;

    // 1. 支援中文 label → enum key；2. 支援直接傳 key
    const labelToKey = { 滑雪: 'SKI', 聚餐: 'MEAL' };
    let typeKey = null;

    if (labelToKey[rawType]) {
      typeKey = labelToKey[rawType];
    } else if (Object.values(ActivityType).includes(rawType)) {
      typeKey = rawType;
    } else {
      return res.status(400).json({
        error: `無效的類型 ${rawType}，有效值：${Object.values(ActivityType).join(
          ', '
        )}`,
      });
    }

    // 解析 & 驗證日期
    const sd = parseYMD(start_date);
    const ed = parseYMD(end_date);
    if (!sd || !ed) {
      return res.status(400).json({
        error: `日期格式錯誤：start_date=${start_date}, end_date=${end_date}`,
      });
    }

    // 處理封面路徑
    const coverImage = req.file ? `/uploads/${req.file.filename}` : null;

    // 建立
    const newGroup = await prisma.group.create({
      data: {
        type:        typeKey,      // SKI 或 MEAL
        title,
        startDate:   sd,
        endDate:     ed,
        location,
        minPeople:   parseInt(min_people, 10),
        maxPeople:   parseInt(max_people, 10),
        price:       parseInt(price, 10),
        allowNewbie: allow_newbie === '1',
        description,
        coverImage,               // 對應 schema 中的 coverImage
        // 如果你想連 user：
        users: {
          connect: { id: 1 }      // 臨時測試用，之後改成你的 req.user.id
        },
      },
    });

    res.status(201).json(newGroup);

  } catch (err) {
    next(err);
  }
});

export default router;
