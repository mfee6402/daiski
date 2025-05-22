// app/groups/[groups-id]/_components/CommentSection.js
'use client';
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/use-auth'; // 引入 useAuth hook
// import { loginRoute } from '@/config'; // 移除了 loginRoute 的導入

export default function CommentSection({
  groupId,
  initialComments = [],
  API_BASE,
  isClient,
  onCommentPosted,
}) {
  const { user, isAuth, isLoading: isAuthLoading } = useAuth();
  const currentUserId = user?.id;
  const currentUserInfo = user
    ? { id: user.id, name: user.name, avatar: user.avatar }
    : null;

  const [comments, setComments] = useState(initialComments || []);
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // 確保 comments 陣列存在且不為空
    if (!comments || comments.length === 0) {
      return;
    }

    const ids = comments.map((c) => c.id);
    const uniqueIds = new Set(ids);

    if (ids.length !== uniqueIds.size) {
      console.warn('偵測到重複的 comment IDs:', JSON.stringify(ids)); // 印出所有 ID 方便查看

      // 找出具體哪些 ID 重複了
      const idCounts = ids.reduce((acc, id) => {
        acc[id] = (acc[id] || 0) + 1;
        return acc;
      }, {});

      const duplicateIds = Object.entries(idCounts)
        .filter(([id, count]) => count > 1)
        .map(([id]) => id);

      console.warn('重複的 ID 是:', JSON.stringify(duplicateIds));
    }
  }, [comments]);

  useEffect(() => {
    setComments(initialComments || []);
  }, [initialComments]);

  const handlePostComment = async (e) => {
    e.preventDefault();

    if (!isAuth) {
      setError('請先登入才能發表留言。');
      return;
    }

    if (!newComment.trim() || !groupId || isSubmitting) {
      return;
    }

    setIsSubmitting(true);
    setError('');

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
      user: {
        id: tempUser.id,
        name: tempUser.name || '您',
        avatar: tempUser.avatar || null,
      },
      isTemporary: true,
    };

    setComments((prevComments) => [optimisticComment, ...prevComments]);
    const commentToSubmit = newComment;
    setNewComment('');

    try {
      const response = await fetch(
        `${API_BASE}/api/group/${groupId}/comments`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ content: commentToSubmit }),
          credentials: 'include', // 如果 API_BASE 是不同網域且需要 cookie，請取消註解此行
        }
      );

      if (!response.ok) {
        const errData = await response
          .json()
          .catch(() => ({ message: '發表留言失敗，無法解析錯誤回應' }));
        if (response.status === 401 || response.status === 403) {
          throw new Error(
            errData.message || '您可能需要重新登入，或沒有權限執行此操作。'
          );
        }
        throw new Error(
          errData.error || errData.message || `伺服器錯誤: ${response.status}`
        );
      }

      const savedComment = await response.json();

      setComments((prevComments) => [
        savedComment,
        ...prevComments.filter((c) => c.id !== tempCommentId),
      ]);

      if (onCommentPosted) {
        onCommentPosted(savedComment);
      }
    } catch (err) {
      console.error('發表留言錯誤:', err);
      setError(`發表留言失敗: ${err.message}`);
      setComments((prevComments) =>
        prevComments.filter((c) => c.id !== tempCommentId)
      );
      setNewComment(commentToSubmit);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isAuthLoading) {
    return (
      <p className="p-4 text-center text-muted-foreground">
        正在載入使用者資訊...
      </p>
    );
  }

  return (
    <Card className="w-full max-w-screen-2xl mx-auto shadow-lg p-6 rounded-lg border-t border-border bg-card text-foreground mt-8">
      <h3 className="text-lg font-semibold mb-4 text-primary-800">
        留言區 ({comments?.length || 0})
      </h3>
      {isAuth ? (
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
              {isSubmitting ? '發送中...' : '送出留言'}
            </Button>
          </div>
        </form>
      ) : (
        <p className="mb-6 text-sm text-muted-foreground">
          請先
          {/* 將連結修改為固定的 "/auth/login" 路徑 */}
          <a href="/auth/login" className="text-primary-500 hover:underline">
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
                <Avatar className="w-8 h-8 flex-shrink-0">
                  <AvatarImage
                    src={
                      comment.user?.avatar
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
