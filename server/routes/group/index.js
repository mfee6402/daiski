// server/routes/group/index.js
import express from 'express';
import { PrismaClient, ActivityType } from '@prisma/client'; // 確保 ActivityType 被正確引入
import multer from 'multer';
import path from 'path';

const router = express.Router();
const prisma = new PrismaClient();

// Multer 設定 (保持不變)
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

// parseYMD 函式 (保持不變)
function parseYMD(str) {
  if (typeof str !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(str)) return null;
  const d = new Date(str + 'T00:00:00Z'); // 使用 UTC 以避免時區問題
  return isNaN(d.getTime()) ? null : d;
}

// GET /api/group?onlyTypes=true  或  GET /api/group
router.get('/', async (req, res, next) => {
  try {
    if (req.query.onlyTypes === 'true') {
      const [col] = await prisma.$queryRaw`
        SHOW COLUMNS FROM \`group\` LIKE 'type'
      `;
      const types =
        col?.Type?.match(/'[^']+'/g).map((s) => s.slice(1, -1)) || [];
      return res.json(types);
    }

    const {
      type,
      date,
      location: locationNameFilter,
      keyword,
      page = 1,
    } = req.query;
    const itemsPerPage = 12; // 您可以根據需求調整每頁顯示的項目數量

    const where = {};
    if (type && type !== '全部') {
      const labelToKey = { 滑雪: ActivityType.SKI, 聚餐: ActivityType.MEAL }; // 確保 ActivityType 中的值與您的 Enum 一致
      if (labelToKey[type]) {
        where.type = labelToKey[type];
      } else if (Object.values(ActivityType).includes(type)) {
        where.type = type;
      }
    }
    if (date) {
      const parsedDate = parseYMD(date);
      if (parsedDate) {
        where.startDate = { lte: parsedDate };
        where.endDate = { gte: parsedDate };
      }
    }
    if (locationNameFilter && locationNameFilter !== '全部') {
      where.OR = [
        {
          location: {
            name: { contains: locationNameFilter },
          },
        },
        {
          customLocation: { contains: locationNameFilter },
        },
      ];
    }
    if (keyword) {
      const keywordCondition = { contains: keyword };
      const keywordOrConditions = [
        { title: keywordCondition },  
        { description: keywordCondition },
        { location: { name: keywordCondition } },
        { customLocation: keywordCondition },
        { user: { name: keywordCondition } },
      ];
      if (where.OR) {
        // 如果已經有 OR 條件 (來自地點篩選)
        where.AND = [
          // 將地點篩選和關鍵字篩選用 AND 連接起來
          { OR: where.OR },
          { OR: keywordOrConditions },
        ];
        delete where.OR; // 移除頂層的 OR
      } else {
        where.OR = keywordOrConditions;
      }
    }

    const totalItems = await prisma.group.count({ where });
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    const groupsFromDb = await prisma.group.findMany({
      where,
      skip: (Number(page) - 1) * itemsPerPage,
      take: itemsPerPage,
      include: {
        user: {
          // 開團者資訊
          select: {
            name: true,
            avatar: true,
          },
        },
        images: {
          // 圖片資訊
          select: {
            imageUrl: true,
          },
          orderBy: { sortOrder: 'asc' },
          take: 1, // 通常卡片列表只需要第一張圖片
        },
        location: true, // 地點物件 (包含 name 等欄位)
        _count: {
          select: { members: true }, // *** 修改處：使用 Group 模型中定義的 'members' 關聯 ***
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const groupsForFrontend = groupsFromDb.map((group) => {
      const {
        _count,
        location,
        customLocation,
        type: groupType,
        ...restOfGroup
      } = group;

      let displayLocation = '地點未定';
      if (groupType === ActivityType.SKI && location) {
        displayLocation = location.name;
      } else if (groupType === ActivityType.MEAL && customLocation) {
        // 假設 MEAL 類型使用 customLocation
        displayLocation = customLocation;
      } else if (location) {
        displayLocation = location.name;
      } else if (customLocation) {
        displayLocation = customLocation;
      }

      return {
        ...restOfGroup,
        type: groupType,
        location: displayLocation,
        currentPeople: _count ? _count.members : 0, // *** 修改處：使用 _count.members 來獲取數量 ***
        // maxPeople 應該直接來自 restOfGroup.maxPeople，請確保 Group 模型中有此欄位且有值
      };
    });

    res.json({ groups: groupsForFrontend, totalPages });
  } catch (err) {
    next(err);
  }
});

// POST /api/group (創建揪團的路由)
router.post('/', upload.single('cover'), async (req, res, next) => {
  try {
    const {
      type: rawType,
      title,
      start_date,
      end_date,
      location: locationInput, // 前端傳來的地點，可能是 location_id (滑雪) 或 地點名稱 (聚餐)
      customLocation: customLocationInput, // 前端可能也會傳這個，或者合併到 locationInput 處理
      min_people,
      max_people,
      price,
      allow_newbie,
      description,
      // userId, // 正式環境應從 session 或 token 獲取
    } = req.body;

    // 假設 userId 暫時寫死為 1，您需要替換成實際的 userId 獲取邏輯
    const userId = 1;

    const labelToKey = { 滑雪: ActivityType.SKI, 聚餐: ActivityType.MEAL };
    let typeKey;
    if (labelToKey[rawType]) {
      typeKey = labelToKey[rawType];
    } else if (Object.values(ActivityType).includes(rawType)) {
      typeKey = rawType;
    } else {
      return res.status(400).json({ error: `無效的活動類型：${rawType}` });
    }

    const sd = parseYMD(start_date);
    const ed = parseYMD(end_date);
    if (!sd || !ed) {
      return res.status(400).json({ error: '日期格式錯誤，請用 yyyy-MM-dd' });
    }
    if (ed < sd) {
      return res.status(400).json({ error: '結束日期不能早於開始日期' });
    }

    const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

    const data = {
      userId, // 關聯到創建者
      type: typeKey,
      title,
      startDate: sd,
      endDate: ed,
      minPeople: Number(min_people),
      maxPeople: Number(max_people),
      price: Number(price),
      allowNewbie: allow_newbie === '1' || allow_newbie === true,
      description,
      // createdAt 會自動生成
    };

    if (typeKey === ActivityType.SKI) {
      if (!locationInput)
        return res.status(400).json({ error: '滑雪活動必須選擇地點 ID' });
      data.locationId = Number(locationInput); // 直接設定 locationId
    } else {
      // 例如 MEAL 或其他類型使用 customLocation
      if (!customLocationInput && !locationInput)
        return res
          .status(400)
          .json({ error: '活動必須提供地點或自訂地點名稱' });
      data.customLocation = customLocationInput || locationInput; // 如果 customLocationInput 沒提供，嘗試使用 locationInput
    }

    const newGroup = await prisma.group.create({ data });

    if (imageUrl) {
      await prisma.groupImage.create({
        data: {
          groupId: newGroup.id,
          imageUrl,
          sortOrder: 0,
        },
      });
    }

    res.status(201).json(newGroup);
  } catch (err) {
    if (err.code === 'P2002' && err.meta?.target?.includes('locationId')) {
      // 假設是外鍵約束錯誤
      return res.status(400).json({ error: '提供的地點 ID 無效或不存在。' });
    }
    console.error('創建揪團失敗:', err);
    next(err);
  }
});

export default router;
