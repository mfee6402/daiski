// app/groups/[groups-id]/_components/CommentSection.js
'use client';
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
// import { FaPaperPlane } from 'react-icons/fa'; // 如果您想使用圖示

export default function CommentSection({
  groupId,
  initialComments = [],
  API_BASE,
  currentUserId, // 當前登入使用者的 ID
  currentUserInfo, // 當前登入使用者的資訊 { id, name, avatar }
  isClient,
  onCommentPosted, // 新增回呼函數，當留言成功後通知父組件
}) {
  const [comments, setComments] = useState(initialComments || []);
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setComments(initialComments || []);
  }, [initialComments]);

  const handlePostComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim() || !groupId || isSubmitting || !currentUserId) {
      if (!currentUserId) {
        setError('請先登入才能發表留言。');
      }
      return;
    }

    setIsSubmitting(true);
    setError('');

    // 為了即時反饋，先在前端模擬加入留言
    // 確保 currentUserInfo 存在且包含必要資訊
    const tempUser = currentUserInfo || {
      id: currentUserId,
      name: '您',
      avatar: null,
    };
    const tempCommentId = `temp-${Date.now()}`;
    const optimisticComment = {
      id: tempCommentId,
      content: newComment,
      createdAt: new Date().toISOString(),
      user: tempUser,
      isTemporary: true, // 標記為臨時留言
    };

    // 先將臨時留言加到列表最前面
    setComments((prevComments) => [optimisticComment, ...prevComments]);
    const commentToSubmit = newComment; // 保存當前的留言內容
    setNewComment(''); // 清空輸入框

    try {
      const response = await fetch(
        `${API_BASE}/api/group/${groupId}/comments`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            // 如果您的 API 需要身份驗證 (例如 JWT Token)
            // 'Authorization': `Bearer ${localStorage.getItem('your_auth_token')}`,
            // 或是透過 header 傳遞 userId (後端 getUserIdFromRequest 會讀取)
            'x-user-id': String(currentUserId),
          },
          body: JSON.stringify({ content: commentToSubmit }), // 後端會從 token 或 header 獲取 userId
        }
      );

      if (!response.ok) {
        const errData = await response
          .json()
          .catch(() => ({ error: '發表留言失敗，無法解析錯誤回應' }));
        throw new Error(errData.error || `伺服器錯誤: ${response.status}`);
      }

      const savedComment = await response.json(); // API 應返回包含 user 資訊的完整留言物件

      // 用伺服器回傳的留言替換臨時留言
      setComments((prevComments) => [
        savedComment,
        ...prevComments.filter((c) => c.id !== tempCommentId),
      ]);

      if (onCommentPosted) {
        onCommentPosted(savedComment); // 通知父組件有新留言
      }
    } catch (err) {
      console.error('發表留言錯誤:', err);
      setError(`發表留言失敗: ${err.message}`);
      // API 失敗則移除臨時留言，並還原輸入框內容
      setComments((prevComments) =>
        prevComments.filter((c) => c.id !== tempCommentId)
      );
      setNewComment(commentToSubmit); // 允許使用者重新編輯或提交
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-screen-2xl mx-auto shadow-lg p-6 rounded-lg border-t border-border bg-card text-foreground mt-8">
      <h3 className="text-lg font-semibold mb-4 text-primary-800">
        留言區 ({comments?.length || 0})
      </h3>
      {currentUserId ? (
        <form onSubmit={handlePostComment} className="mb-6">
          <Textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="mt-1 w-full border-input p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition resize-none rounded-md bg-background text-foreground"
            rows="3"
            placeholder="輸入你的留言…"
            disabled={isSubmitting}
          />
          {error && <p className="text-sm text-destructive mt-1">{error}</p>}
          <div className="mt-3 text-right">
            <Button
              type="submit"
              className="px-4 py-2 bg-primary-500 text-white hover:bg-primary-600 transition active:scale-95 active:shadow-sm rounded-md text-p-tw"
              disabled={isSubmitting || !newComment.trim()}
            >
              {/* <FaPaperPlane className="mr-2 h-3.5 w-3.5" /> */}
              {isSubmitting ? '發送中...' : '送出留言'}
            </Button>
          </div>
        </form>
      ) : (
        <p className="mb-6 text-sm text-muted-foreground">
          請先
          <a href="/login" className="text-primary-500 hover:underline">
            登入
          </a>
          以發表留言。
        </p>
      )}
      <div className="space-y-4">
        {comments && comments.length > 0 ? (
          comments.map((comment) => (
            <div
              key={comment.id}
              className={`border-b border-border pb-4 last:border-b-0 ${comment.isTemporary ? 'opacity-60' : ''}`}
            >
              <div className="flex items-start space-x-3 mb-1">
                {' '}
                {/* 改為 items-start 以便頭像和文字對齊 */}
                <Avatar className="w-8 h-8 flex-shrink-0">
                  {' '}
                  {/* flex-shrink-0 避免頭像被壓縮 */}
                  <AvatarImage
                    src={
                      comment.user?.avatar // 假設 avatar 已經是完整的 URL 或後端處理過的路徑
                        ? comment.user.avatar.startsWith('http') ||
                          comment.user.avatar.startsWith('/uploads/')
                          ? comment.user.avatar
                          : `${API_BASE}${comment.user.avatar}`
                        : undefined
                    }
                    alt={comment.user?.name || '使用者'}
                  />
                  <AvatarFallback>
                    {comment.user?.name
                      ? comment.user.name[0].toUpperCase()
                      : '訪'}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-grow">
                  {' '}
                  {/* 讓文字內容佔據剩餘空間 */}
                  <div className="flex items-center space-x-2 mb-0.5">
                    <p className="font-semibold text-sm text-foreground">
                      {comment.user?.name || '匿名用戶'}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {comment.isTemporary
                        ? '傳送中...'
                        : isClient && comment.createdAt
                          ? new Date(comment.createdAt).toLocaleString(
                              'zh-TW',
                              {
                                year: 'numeric',
                                month: 'numeric',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                              }
                            )
                          : '剛剛'}
                    </p>
                  </div>
                  <p className="text-sm text-secondary-800 whitespace-pre-wrap break-words">
                    {' '}
                    {/* break-words 處理長單字換行 */}
                    {comment.content}
                  </p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-sm text-muted-foreground">
            還沒有留言喔！快來搶頭香！
          </p>
        )}
      </div>
    </Card>
  );
}
