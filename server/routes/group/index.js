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
async function getUserIdFromRequest(req) {
  const testOrganizerId =
    req.body.organizerId ||
    req.query.organizerId ||
    req.headers['x-user-id'] ||
    2; // 嘗試從多個地方獲取，預設為 1
  if (process.env.NODE_ENV !== 'production') {
    console.warn(
      `警告：正在使用測試 userId: ${testOrganizerId}。在生產環境中，請務必替換為安全的身份驗證邏輯來獲取 userId。`
    );
  }
  const numericUserId = Number(testOrganizerId);
  return isNaN(numericUserId) ? null : numericUserId;
}

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
    const organizerId = 1;

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
      organizerId, // 關聯到創建者
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
router.post('/:groupId/comments', async (req, res, next) => {
  try {
    const groupId = parseInt(req.params.groupId, 10);
    const { content } = req.body;
    const userId = await getUserIdFromRequest(req); // 獲取留言者 ID

    if (isNaN(groupId)) {
      return res.status(400).json({ error: '無效的群組 ID' });
    }
    if (!userId) {
      return res
        .status(401)
        .json({ error: '未經授權或無法識別用戶以發表留言' });
    }
    if (!content || typeof content !== 'string' || content.trim() === '') {
      return res.status(400).json({ error: '留言內容不可為空' });
    }

    const groupExists = await prisma.group.findUnique({
      where: { id: groupId },
    });
    if (!groupExists) {
      return res.status(404).json({ error: '找不到指定的群組' });
    }

    const newComment = await prisma.groupComment.create({
      data: {
        content: content.trim(),
        groupId: groupId,
        userId: userId,
      },
      include: {
        // 返回留言時，帶上留言者的資訊
        user: {
          select: { id: true, name: true, avatar: true },
        },
      },
    });
    res.status(201).json(newComment);
  } catch (err) {
    console.error('Error posting comment:', err);
    next(err);
  }
});
// GET /api/group/:id  → 回傳一筆 group 的完整資料
router.get('/:groupId', async (req, res, next) => {
  try {
    const id = Number(req.params.groupId);
    if (Number.isNaN(id)) {
      return res.status(400).json({ error: '無效的 ID' });
    }

    const group = await prisma.group.findUnique({
      where: { id },
      include: {
        user: { select: { name: true, avatar: true } },
        images: { orderBy: { sortOrder: 'asc' } },
        location: true,
        _count: { select: { members: true } },
        comments: {
          orderBy: { createdAt: 'desc' },
          include: {
            user: {
              // 每則留言的留言者資訊
              select: { id: true, name: true, avatar: true },
            },
          },
        }, // 如果有留言
      },
    });

    if (!group) {
      return res.status(404).json({ error: '找不到該揪團' });
    }

    // 轉換後端欄位名稱
    const {
      _count,
      images,
      customLocation,
      location,
      user,
      comments,
      ...rest
    } = group;
    const displayLocation =
      group.type === ActivityType.SKI
        ? location?.name // 滑雪活動使用關聯的 Location 名稱
        : customLocation || location?.name; // 其他活動優先使用 customLocation，若無則用關聯 Location 名稱

    res.json({
      ...rest,
      creator: user, // 將 user 重命名為 creator
      location: displayLocation,
      currentPeople: _count?.members || 0,
      images, // 返回所有圖片
      comments, // 返回包含使用者資訊的留言
    });
  } catch (err) {
    console.error(`Error fetching group with id ${req.params.id}:`, err);
    next(err);
  }
});
// PUT /api/group/:groupId (編輯揪團)
router.put('/:groupId', upload.single('cover'), async (req, res, next) => {
  try {
    const groupId = Number(req.params.groupId);
    if (isNaN(groupId)) return res.status(400).json({ error: '無效的揪團 ID' });

    const userId = await getUserIdFromRequest(req);
    if (!userId) return res.status(401).json({ error: '未授權或無法識別用戶' });

    const groupToUpdate = await prisma.group.findUnique({ where: { id: groupId } });
    if (!groupToUpdate) return res.status(404).json({ error: '找不到要編輯的揪團' });
    if (groupToUpdate.organizerId !== userId) return res.status(403).json({ error: '您沒有權限編輯此揪團' });

    const {
      type: rawType, title, start_date, end_date, location: locationInput,
      customLocation: customLocationInput, difficulty, min_people, max_people,
      price, allow_newbie, description,
    } = req.body;

    const dataToUpdate = {};

    if (rawType) {
      const labelToKey = { 滑雪: ActivityType.SKI, 聚餐: ActivityType.MEAL };
      if (labelToKey[rawType]) dataToUpdate.type = labelToKey[rawType];
      else if (Object.values(ActivityType).includes(rawType)) dataToUpdate.type = rawType;
      else return res.status(400).json({ error: `無效的活動類型：${rawType}` });
    }

    if (title !== undefined) dataToUpdate.title = title;
    if (start_date) {
      const sd = parseYMD(start_date);
      if (!sd) return res.status(400).json({ error: '開始日期格式錯誤' });
      dataToUpdate.startDate = sd;
    }
    if (end_date) {
      const ed = parseYMD(end_date);
      if (!ed) return res.status(400).json({ error: '結束日期格式錯誤' });
      dataToUpdate.endDate = ed;
    }

    const finalStartDate = dataToUpdate.startDate || groupToUpdate.startDate;
    const finalEndDate = dataToUpdate.endDate || groupToUpdate.endDate;
    if (finalEndDate < finalStartDate) return res.status(400).json({ error: '結束日期不能早於開始日期' });

    if (min_people !== undefined) dataToUpdate.minPeople = Number(min_people);
    if (max_people !== undefined) dataToUpdate.maxPeople = Number(max_people);
    if (price !== undefined) dataToUpdate.price = Number(price);
    if (allow_newbie !== undefined) dataToUpdate.allowNewbie = allow_newbie === '1' || allow_newbie === true;
    if (description !== undefined) dataToUpdate.description = description;

    const effectiveType = dataToUpdate.type || groupToUpdate.type;
    if (effectiveType === ActivityType.SKI) {
      if (locationInput !== undefined) {
        if (locationInput) {
            dataToUpdate.locationId = Number(locationInput);
            dataToUpdate.customLocation = null; // 滑雪類型清除 customLocation
        } else {
            dataToUpdate.locationId = null; // 允許清除地點
        }
      }
      if (difficulty !== undefined) dataToUpdate.difficulty = difficulty;
      else if (locationInput !== undefined && !difficulty ) dataToUpdate.difficulty = null; // 如果更新了地點但沒給難度，則清除難度
    } else { // MEAL 或其他類型
      if (customLocationInput !== undefined || locationInput !== undefined) {
        const newCustomLocation = customLocationInput || locationInput;
        if (newCustomLocation) {
            dataToUpdate.customLocation = newCustomLocation;
            dataToUpdate.locationId = null; // 非滑雪類型清除 locationId
        } else {
            dataToUpdate.customLocation = null;
        }
      }
      dataToUpdate.difficulty = null; // 非滑雪類型清除難度
    }

    if (req.file) {
      const newImageUrl = `/uploads/${req.file.filename}`;
      const existingImage = await prisma.groupImage.findFirst({ where: { groupId } });
      if (existingImage) {
        await prisma.groupImage.update({ where: { id: existingImage.id }, data: { imageUrl: newImageUrl } });
      } else {
        await prisma.groupImage.create({ data: { groupId, imageUrl: newImageUrl, sortOrder: 0 } });
      }
      // TODO: 考慮刪除舊的 public/uploads 中的圖片檔案
    }

    if (Object.keys(dataToUpdate).length === 0 && !req.file) {
      return res.status(400).json({ error: '沒有提供任何需要更新的資料' });
    }

    const updatedGroup = await prisma.group.update({ where: { id: groupId }, data: dataToUpdate });
    res.status(200).json(updatedGroup);
  } catch (err) {
    if (err instanceof multer.MulterError) {
        return res.status(400).json({ error: `圖片上傳錯誤: ${err.message}` });
    }
    if (err.message === '僅允許上傳圖片檔案！') {
        return res.status(400).json({ error: err.message });
    }
    console.error(`編輯揪團 ${req.params.groupId} 失敗:`, err);
    if (err.code === 'P2025') return res.status(404).json({ error: '找不到要更新的揪團或相關資源。' });
    if (err.code === 'P2003' && err.meta?.field_name?.includes('locationId')) return res.status(400).json({ error: '提供的地點 ID 無效或不存在。' });
    return res.status(500).json({ error: '伺服器內部錯誤，更新揪團失敗。' });
  }
});

// DELETE /api/group/:groupId (刪除揪團)
router.delete('/:groupId', async (req, res, next) => {
  try {
    const groupId = Number(req.params.groupId);
    if (isNaN(groupId)) return res.status(400).json({ error: '無效的揪團 ID' });

    const userId = await getUserIdFromRequest(req);
    if (!userId) return res.status(401).json({ error: '未授權或無法識別用戶' });

    const groupToDelete = await prisma.group.findUnique({ where: { id: groupId } });
    if (!groupToDelete) return res.status(404).json({ error: '找不到要刪除的揪團' });
    if (groupToDelete.organizerId !== userId) return res.status(403).json({ error: '您沒有權限刪除此揪團' });

    // 假設 Prisma schema 中已設定 onDelete: Cascade
    // 否則需要手動刪除 GroupImage, GroupMember, GroupComment
    await prisma.group.delete({ where: { id: groupId } });

    // TODO: 考慮刪除 public/uploads 中的相關圖片檔案

    res.status(200).json({ message: '揪團已成功刪除' });
  } catch (err) {
    console.error(`刪除揪團 ${req.params.groupId} 失敗:`, err);
    if (err.code === 'P2025') return res.status(404).json({ error: '找不到要刪除的揪團。' });
    // P2003 (Foreign key constraint failed) 通常在 onDelete: Cascade 設定不當時發生
    // 但如果 Cascade 已設定，更可能是 P2025 (Record to delete does not exist)
    if (err.code === 'P2003') {
        return res.status(409).json({ error: '無法刪除揪團，可能因為它仍被其他資料引用。請確認資料庫關聯設定。' });
    }
    return res.status(500).json({ error: '伺服器內部錯誤，刪除揪團失敗。' });
  }
});
export default router;
