// routes/groupchat.js (或者您實際的 routes/group/index.js 或 routes/group/chat.js)

import express from 'express';
import multer from 'multer';
// 假設 authenticate.js 在 server/middlewares/authenticate.js
import authenticate from '../../middlewares/authenticate.js'; // << --- 再次確認此路徑是否正確
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient(); // 建議：將此實例化移至共享的 db.js 檔案中
const router = express.Router();

// --- 圖片上傳設定 (使用 multer) ---
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // 確保 'public/uploads/' 資料夾相對於您 server.js (或 index.js 主檔案) 存在
    cb(null, 'public/uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('不支援的檔案類型，僅限上傳圖片!'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 1024 * 1024 * 5, // 限制檔案大小為 5MB
  },
});

// --- HTTP API 路由定義 ---

// Helper function to set no-cache headers
const setNoCacheHeaders = (res) => {
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.setHeader('Pragma', 'no-cache'); // For HTTP/1.0 proxies
  res.setHeader('Expires', '0'); // Proxies
};

/**
 * @route   POST /upload
 * @desc    處理圖片上傳
 * @access  Private
 */
router.post('/upload', authenticate, upload.single('file'), (req, res) => {
  setNoCacheHeaders(res); // 加入快取控制
  if (!req.file) {
    return res
      .status(400)
      .json({ message: '沒有上傳檔案，或者檔案類型不被接受' });
  }
  const imageUrl = `/uploads/${req.file.filename}`; // 相對於 public 資料夾的路徑
  res.status(200).json({
    message: '圖片上傳成功',
    url: imageUrl,
  });
});

/**
 * @route   GET /:groupId/authorize
 * @desc    檢查當前登入使用者是否有權限加入指定 groupId 的聊天室
 * @access  Private
 */
router.get('/:groupId/authorize', authenticate, async (req, res) => {
  setNoCacheHeaders(res); // 加入快取控制
  const { groupId: groupIdString } = req.params;
  const userId = req.user?.id;
  console.log('API /:groupId/authorize - req.user:', req.user);
  console.log('API /:groupId/authorize - req.user.id:', req.user?.id);

  if (!userId) {
    return res
      .status(401)
      .json({ authorized: false, message: '未授權，無法識別使用者' });
  }
  if (!groupIdString) {
    return res.status(400).json({ authorized: false, message: '缺少群組 ID' });
  }
  const groupId = parseInt(groupIdString, 10);
  if (isNaN(groupId)) {
    return res
      .status(400)
      .json({ authorized: false, message: '群組 ID 格式不正確' });
  }

  try {
    console.log(`檢查授權: 使用者 ID ${userId}, 群組 ID ${groupId}`);
    const memberRecord = await prisma.groupMember.findUnique({
      where: {
        // 請再次確認您 Prisma schema 中 GroupMember 的 @@unique([groupId, userId])
        // 所產生的複合唯一識別符名稱，預設通常是 'groupId_userId'
        groupId_userId: {
          groupId: groupId,
          userId: userId,
        },
      },
      select: {
        paidAt: true,
      },
    });

    if (memberRecord) {
      if (memberRecord.paidAt) {
        console.log(`使用者 ${userId} 在群組 ${groupId} 中已付款。`);
        res
          .status(200)
          .json({ authorized: true, message: '已授權，允許加入聊天室' });
      } else {
        console.log(`使用者 ${userId} 在群組 ${groupId} 中已加入但未付款。`);
        res.status(403).json({
          authorized: false,
          message: '您已加入此揪團但尚未完成付款，暫時無法進入聊天室',
        });
      }
    } else {
      console.log(`使用者 ${userId} 不是群組 ${groupId} 的成員。`);
      res.status(403).json({
        authorized: false,
        message: '您尚未加入此揪團，無法進入聊天室',
      });
    }
  } catch (error) {
    console.error(`檢查群組 ${groupId} 聊天室授權時發生錯誤:`, error);
    if (error.code) {
      console.error('Prisma 錯誤代碼:', error.code, '錯誤訊息:', error.message);
    }
    setNoCacheHeaders(res); // 錯誤回應也應避免快取
    res
      .status(500)
      .json({ authorized: false, message: '檢查授權時發生伺服器內部錯誤' });
  }
});

/**
 * @route   GET /my-joined-list
 * @desc    獲取當前登入使用者已加入且有權限聊天的群組列表
 * @access  Private
 */
router.get('/my-joined-list', authenticate, async (req, res) => {
  setNoCacheHeaders(res); // 加入快取控制
  const userId = req.user?.id;

  if (!userId) {
    return res
      .status(401)
      .json({ success: false, message: '未授權，無法識別使用者' });
  }

  try {
    const groupMemberships = await prisma.groupMember.findMany({
      where: {
        userId: userId,
        paidAt: {
          not: null, // 只選擇已付款的 (根據您的授權邏輯)
        },
        group: {
          deletedAt: null, // 確保相關的群組未被軟刪除
        },
      },
      select: {
        groupId: true,
        group: {
          select: {
            title: true,
          },
        },
      },
      orderBy: {
        joinedAt: 'desc',
      },
    });

    const authorizedGroups = groupMemberships.map((gm) => ({
      id: gm.groupId,
      title: gm.group.title,
    }));

    res.status(200).json({ success: true, groups: authorizedGroups });
  } catch (error) {
    console.error(
      `獲取使用者 ${userId} 已加入的聊天群組列表時發生錯誤:`,
      error
    );
    setNoCacheHeaders(res); // 錯誤回應也應避免快取
    res.status(500).json({ success: false, message: '獲取聊天群組列表失敗' });
  }
});

export default router;
