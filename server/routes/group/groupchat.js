// routes/groupchat.js (或者您實際的 routes/group/chat.js)

import express from 'express';
import multer from 'multer';
import authenticate from '../../middlewares/authenticate.js'; // << --- 匯入您的 authenticate 中介軟體
import { PrismaClient } from '@prisma/client'; // << --- 匯入 Prisma Client

const prisma = new PrismaClient(); // << --- 初始化 Prisma Client (建議在共用檔案中初始化並匯出單一實例)
const router = express.Router();

// --- 圖片上傳設定 (使用 multer) ---
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads/'); // 確保 'public/uploads/' 資料夾存在
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
// http://localhost:3005/api/group/groupchat/${group.id}/authorize
/**
 * @route   POST /upload (實際路徑取決於 server.js 中的掛載點，例如 /api/groupchat/upload)
 * @desc    處理圖片上傳
 * @access  Private
 */
router.post('/upload', authenticate, upload.single('file'), (req, res) => {
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
 * @route   GET /:groupId/authorize (實際路徑取決於 server.js 中的掛載點)
 * @desc    檢查當前登入使用者是否有權限加入指定 groupId 的聊天室
 * @access  Private
 * @param   {string} groupId - 要檢查的群組 ID
 */
router.get('/:groupId/authorize', authenticate, async (req, res) => {
  const { groupId: groupIdString } = req.params; // 從路徑參數獲取 groupId (字串)
  const userId = req.user?.id; // 從 authenticate 中介軟體獲取的 user id (假設是數字)

  if (!userId) {
    // 理論上 authenticate 失敗時不會到這裡
    return res
      .status(401)
      .json({ authorized: false, message: '未授權，無法識別使用者' });
  }

  if (!groupIdString) {
    return res.status(400).json({ authorized: false, message: '缺少群組 ID' });
  }

  const groupId = parseInt(groupIdString, 10); // 將 groupId 字串轉換為數字
  if (isNaN(groupId)) {
    return res
      .status(400)
      .json({ authorized: false, message: '群組 ID 格式不正確' });
  }

  try {
    console.log(`檢查授權: 使用者 ID ${userId}, 群組 ID ${groupId}`);

    // 使用 Prisma 查詢 group_member 資料表
    // 您的 GroupMember schema 中有 @@unique([groupId, userId])
    // Prisma 會為此產生一個名為 groupId_userId 的複合唯一識別符 (請確認，或使用 findFirst)
    const memberRecord = await prisma.groupMember.findUnique({
      where: {
        // Prisma 根據 @@unique([groupId, userId]) 自動產生的欄位名稱通常是 'groupId_userId'
        // 如果不確定，可以檢查 node_modules/.prisma/client/index.d.ts 中的 GroupMemberWhereUniqueInput 型別
        // 或者使用 findFirst 配合明確的 groupId 和 userId 條件
        groupId_userId: {
          // << --- 這是 Prisma 根據 @@unique([groupId, userId]) 產生的複合鍵欄位名
          groupId: groupId,
          userId: userId,
        },
      },
      select: {
        // 只選擇需要的欄位
        paidAt: true,
      },
    });

    // 備選查詢方式 (如果 groupId_userId 名稱不確定或想更明確):
    // const memberRecord = await prisma.groupMember.findFirst({
    //   where: {
    //     AND: [
    //       { groupId: groupId },
    //       { userId: userId }
    //     ]
    //   },
    //   select: {
    //     paidAt: true
    //   }
    // });

    if (memberRecord) {
      // 如果找到了記錄，表示使用者是該群組的成員
      if (memberRecord.paidAt) {
        // 檢查 paidAt 是否有值 (表示已付款)
        console.log(`使用者 ${userId} 在群組 ${groupId} 中已付款。`);
        res
          .status(200)
          .json({ authorized: true, message: '已授權，允許加入聊天室' });
      } else {
        // 如果您目前階段允許未付款者也加入聊天，可以修改這裡的邏輯
        console.log(`使用者 ${userId} 在群組 ${groupId} 中已加入但未付款。`);
        res
          .status(403)
          .json({
            authorized: false,
            message: '您已加入此揪團但尚未完成付款，暫時無法進入聊天室',
          });
        // 或者，如果目前允許未付款者聊天：
        // res.status(200).json({ authorized: true, message: '允許加入聊天室 (尚未付款)' });
      }
    } else {
      // 找不到記錄，表示使用者不是該群組的成員
      console.log(`使用者 ${userId} 不是群組 ${groupId} 的成員。`);
      res
        .status(403)
        .json({
          authorized: false,
          message: '您尚未加入此揪團，無法進入聊天室',
        });
    }
  } catch (error) {
    console.error(`檢查群組 ${groupId} 聊天室授權時發生錯誤:`, error);
    // 可以更細緻地處理 Prisma 相關的錯誤
    if (error.code) {
      // Prisma 錯誤通常有 code 屬性
      console.error('Prisma 錯誤代碼:', error.code, '錯誤訊息:', error.message);
      // 例如 P2025: Record to update not found. (如果用 update 而非 find)
    }
    res
      .status(500)
      .json({ authorized: false, message: '檢查授權時發生伺服器內部錯誤' });
  }
});

export default router;
