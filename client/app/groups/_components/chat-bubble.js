// chat-bubble.js
'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { io } from 'socket.io-client';
import { usePathname, useParams } from 'next/navigation'; // 匯入 usePathname 和 useParams
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';

export function ChatBubble({ apiBase, currentUser, open, onOpenChange }) {
  const [msgs, setMsgs] = useState([]);
  const [text, setText] = useState('');
  const [unread, setUnread] = useState(0);
  const [isConnected, setIsConnected] = useState(false);
  const [currentGroupId, setCurrentGroupId] = useState(null);
  const [isChatAllowedForGroup, setIsChatAllowedForGroup] = useState(false);
  const [isCheckingGroupAuth, setIsCheckingGroupAuth] = useState(false);

  const pathname = usePathname(); // 獲取當前路徑
  // const params = useParams(); // 也可以用 params，如果路由結構更複雜

  const socket = useMemo(() => {
    // 只有在 apiBase 存在時才初始化 socket，連接會在 groupId 和授權確認後進行
    if (apiBase) {
      return io(apiBase, { autoConnect: false }); // 設定為手動連接
    }
    return null;
  }, [apiBase]);

  const fileRef = useRef(null);
  const scrollAreaRef = useRef(null);

  // 偵測 URL 變化以更新 currentGroupId
  useEffect(() => {
    // 嘗試從路徑中解析 groupId，例如 /groups/123 -> groupId = 123
    // 這是一個簡化的例子，您可能需要更健壯的解析邏輯
    const pathSegments = pathname.split('/');
    if (
      pathSegments.length > 2 &&
      pathSegments[1] === 'groups' &&
      pathSegments[2]
    ) {
      const potentialGroupId = pathSegments[2];
      // 驗證 potentialGroupId 是否為有效的 ID 格式 (例如數字)
      if (
        /^\d+$/.test(potentialGroupId) ||
        typeof potentialGroupId === 'string'
      ) {
        // 根據您的 groupId 格式調整
        setCurrentGroupId(potentialGroupId);
      } else {
        setCurrentGroupId(null);
      }
    } else {
      setCurrentGroupId(null); // 如果路徑不匹配，則沒有當前群組
    }
  }, [pathname]);

  // 當 currentGroupId 變化或聊天視窗開啟時，檢查授權並連接 Socket
  useEffect(() => {
    if (open && currentGroupId && currentUser && socket) {
      setIsCheckingGroupAuth(true);
      setIsChatAllowedForGroup(false); // 重設授權狀態

      const checkAuthorizationAndConnect = async () => {
        try {
          const response = await fetch(
            `${apiBase}/api/group/groupchat/${currentGroupId}/authorize`
          );
          if (response.ok) {
            const data = await response.json();
            if (data.authorized) {
              setIsChatAllowedForGroup(true);
              if (!socket.connected) {
                socket.connect(); // 授權成功後連接 socket
              }
              // 連接成功後 (在 socket 'connect' 事件中) 再加入房間
            } else {
              console.warn(
                `使用者未被授權加入群組 ${currentGroupId} 的聊天室: ${data.message}`
              );
              onOpenChange(false); // 未授權則關閉聊天視窗
            }
          } else {
            const errData = await response.json().catch(() => ({}));
            console.error(
              `授權檢查 API 錯誤 (群組 ${currentGroupId}): ${response.status}`,
              errData.message || ''
            );
            onOpenChange(false);
          }
        } catch (error) {
          console.error(`呼叫授權 API 失敗 (群組 ${currentGroupId}):`, error);
          onOpenChange(false);
        } finally {
          setIsCheckingGroupAuth(false);
        }
      };
      checkAuthorizationAndConnect();
    } else if (socket && socket.connected && !currentGroupId) {
      // 如果從有 groupId 的頁面切換到沒有 groupId 的頁面，且 socket 仍連接，則斷開
      socket.disconnect();
      setIsConnected(false);
      setMsgs([]); // 清空訊息
    }
  }, [open, currentGroupId, currentUser, socket, apiBase, onOpenChange]);

  // Socket.IO 連線和事件處理
  useEffect(() => {
    if (!socket || !isChatAllowedForGroup || !currentGroupId) {
      // 如果 socket 存在但未被授權或沒有 groupId，確保它是斷開的
      if (socket && socket.connected) {
        socket.disconnect();
      }
      setIsConnected(false);
      return;
    }

    // 只有在授權通過且有 currentGroupId 時才處理 socket 事件
    if (!socket.connected) {
      // 避免重複註冊事件，或在 socket.connect() 成功後再註冊
      // socket.connect(); // 移到授權成功後
    }

    socket.on('connect', () => {
      console.log('Socket.IO 已連接 (ChatBubble):', socket.id);
      setIsConnected(true);
      if (currentGroupId && currentUser?.id) {
        socket.emit('joinGroupChat', currentGroupId, currentUser.id);
        console.log(
          `已發送 joinGroupChat 事件: 群組 ${currentGroupId}, 使用者 ${currentUser.id}`
        );
      }
    });

    socket.on('disconnect', () => {
      console.log('Socket.IO 已離線 (ChatBubble)');
      setIsConnected(false);
    });

    socket.on('chatMessage', (m) => {
      setMsgs((prevMsgs) => [...prevMsgs, m]);
      if (!open) {
        setUnread((prevUnread) => prevUnread + 1);
      }
    });
    socket.on('joinedRoomSuccess', (data) =>
      console.log(`成功加入房間 ${data.groupId}: ${data.message}`)
    );
    socket.on('joinRoomError', (data) => {
      console.error(`加入房間 ${data.groupId} 失敗: ${data.message}`);
      onOpenChange(false);
    });

    return () => {
      // 移除事件監聽器，避免記憶體洩漏
      socket.off('connect');
      socket.off('disconnect');
      socket.off('chatMessage');
      socket.off('joinedRoomSuccess');
      socket.off('joinRoomError');
      // 斷開連接的邏輯可以根據 open 和 currentGroupId 狀態更細緻地處理
      // if (socket.connected) socket.disconnect();
    };
  }, [
    socket,
    open,
    currentGroupId,
    currentUser?.id,
    onOpenChange,
    isChatAllowedForGroup,
  ]); // 加入 isChatAllowedForGroup

  // ... (訊息列表滾動、清空未讀的 useEffect 不變) ...
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollViewport = scrollAreaRef.current.querySelector(
        'div[style*="overflow: scroll"]'
      );
      if (scrollViewport) {
        scrollViewport.scrollTop = scrollViewport.scrollHeight;
      }
    }
  }, [msgs]);

  useEffect(() => {
    if (open) setUnread(0);
  }, [open]);

  const sendMessage = (messageData) => {
    if (!socket || !isConnected || !currentGroupId || !isChatAllowedForGroup) {
      console.error('Socket 未連接、無群組ID或未授權，無法發送訊息');
      return;
    }
    socket.emit('sendMessage', messageData, currentGroupId.toString());
  };

  const sendText = () => {
    const content = text.trim();
    if (!content || !currentUser) return;
    const msg = {
      user: {
        id: currentUser.id,
        name: currentUser.name,
        avatar: currentUser.avatar,
      },
      type: 'text',
      content: content,
      time: Date.now(),
    };
    sendMessage(msg);
    setText('');
  };

  const uploadImage = async (e) => {
    const file = e.target.files?.[0];
    if (!file || !currentUser || !currentGroupId || !isChatAllowedForGroup)
      return;
    const form = new FormData();
    form.append('file', file);
    try {
      const res = await fetch(`${apiBase}/api/group/groupchat/upload`, {
        method: 'POST',
        body: form,
      });
      if (!res.ok) {
        const errData = await res
          .json()
          .catch(() => ({ message: '上傳失敗，無法解析錯誤回應' }));
        throw new Error(errData.message || `圖片上傳失敗: ${res.status}`);
      }
      const data = await res.json();
      if (!data.url) throw new Error('圖片上傳成功，但未獲取到圖片 URL');
      const msg = {
        user: {
          id: currentUser.id,
          name: currentUser.name,
          avatar: currentUser.avatar,
        },
        type: 'image',
        imageUrl: data.url,
        time: Date.now(),
      };
      sendMessage(msg);
    } catch (err) {
      console.error('圖片上傳或處理失敗:', err);
    } finally {
      if (fileRef.current) fileRef.current.value = null;
    }
  };

  // 如果聊天視窗未開啟，或者正在檢查群組授權，則不渲染聊天內容視窗
  const shouldRenderChatWindow =
    open && currentGroupId && isChatAllowedForGroup && !isCheckingGroupAuth;
  const chatWindowTitle =
    currentGroupId && isChatAllowedForGroup
      ? `群組聊天室 (群組 ${currentGroupId})`
      : isCheckingGroupAuth
        ? '檢查權限中...'
        : '聊天室';

  return (
    <>
      {/* 聊天頭 (總是可見，如果 currentUser 存在) */}
      {currentUser && (
        <Button
          variant="secondary"
          className="fixed bottom-6 right-6 rounded-full p-4 shadow-lg z-50"
          onClick={() => {
            // 如果沒有 currentGroupId 或正在檢查權限，點擊時可以不打開，或提示
            if (!currentGroupId && !open) {
              alert('請先進入特定群組頁面以使用聊天功能。'); // 或其他提示方式
              return;
            }
            if (isCheckingGroupAuth && !open) {
              alert('正在檢查聊天室權限，請稍候。');
              return;
            }
            onOpenChange(!open);
          }}
          aria-label="聊天室"
        >
          💬
          {unread > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 px-1.5 py-0.5 text-xs rounded-full"
            >
              {unread > 9 ? '9+' : unread}
            </Badge>
          )}
        </Button>
      )}

      {/* 側邊小視窗 - 只有在 open 且有 currentGroupId 且已授權時才完整顯示內容 */}
      {open && (
        <div className="fixed bottom-20 right-6 w-80 h-[500px] max-h-[70vh] bg-white border border-gray-200 shadow-xl rounded-lg flex flex-col z-40">
          <div className="flex items-center justify-between p-3 border-b bg-slate-50 rounded-t-lg">
            <h4 className="font-semibold text-slate-700">{chatWindowTitle}</h4>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onOpenChange(false)}
              aria-label="關閉聊天室"
              className="text-slate-500 hover:text-slate-700"
            >
              ✕
            </Button>
          </div>

          {!currentGroupId && (
            <div className="flex-1 p-3 flex items-center justify-center text-sm text-gray-500">
              請導航至特定群組頁面以載入聊天室。
            </div>
          )}
          {currentGroupId && isCheckingGroupAuth && (
            <div className="flex-1 p-3 flex items-center justify-center text-sm text-gray-500">
              正在檢查聊天室權限...
            </div>
          )}
          {currentGroupId && !isCheckingGroupAuth && !isChatAllowedForGroup && (
            <div className="flex-1 p-3 flex items-center justify-center text-sm text-red-500">
              您沒有權限進入此聊天室或群組不存在。
            </div>
          )}

          {shouldRenderChatWindow && (
            <>
              <ScrollArea
                ref={scrollAreaRef}
                className="flex-1 p-3 space-y-3 bg-slate-50"
              >
                {/* 訊息列表渲染邏輯 */}
                {msgs.map((m, i) => (
                  <div
                    key={m.id || `msg-${i}`}
                    className={`flex flex-col max-w-[85%] ${m.user.id === currentUser.id ? 'self-end items-end ml-auto' : 'self-start items-start mr-auto'}`}
                  >
                    <div className="flex items-end gap-2">
                      {m.user.id !== currentUser.id && (
                        <Image
                          src={m.user.avatar || '/default-avatar.png'}
                          alt={m.user.name || '用戶'}
                          width={24}
                          height={24}
                          className="rounded-full"
                        />
                      )}
                      <div
                        className={`px-3 py-2 rounded-xl shadow-sm ${m.user.id === currentUser.id ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-800'}`}
                      >
                        {m.user.id !== currentUser.id && (
                          <p className="text-xs font-semibold mb-0.5">
                            {m.user.name || '匿名用戶'}
                          </p>
                        )}
                        {m.type === 'text' ? (
                          <p className="text-sm whitespace-pre-wrap break-words">
                            {m.content}
                          </p>
                        ) : (
                          <Image
                            src={
                              m.imageUrl.startsWith('http')
                                ? m.imageUrl
                                : `${apiBase}${m.imageUrl}`
                            }
                            alt="聊天圖片"
                            width={200}
                            height={150}
                            className="max-w-full h-auto rounded-md object-cover cursor-pointer"
                            onClick={() =>
                              window.open(
                                m.imageUrl.startsWith('http')
                                  ? m.imageUrl
                                  : `${apiBase}${m.imageUrl}`,
                                '_blank'
                              )
                            }
                          />
                        )}
                      </div>
                    </div>
                    <span
                      className={`text-xs text-gray-400 mt-1 ${m.user.id === currentUser.id ? 'self-end' : 'self-start'}`}
                    >
                      {new Date(m.time).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                ))}
                {!isConnected && currentGroupId && (
                  <p className="text-xs text-center text-red-500 py-2">
                    連線中斷，嘗試重新連接...
                  </p>
                )}
              </ScrollArea>
              <div className="flex items-center gap-2 p-3 border-t bg-white rounded-b-lg">
                <input
                  type="file"
                  accept="image/*"
                  ref={fileRef}
                  className="hidden"
                  onChange={uploadImage}
                  aria-label="選擇圖片"
                />
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => fileRef.current?.click()}
                  aria-label="上傳圖片"
                  className="text-slate-500 hover:text-slate-700"
                  disabled={!isConnected || !isChatAllowedForGroup}
                >
                  📎
                </Button>
                <Input
                  placeholder={
                    isConnected && isChatAllowedForGroup
                      ? '輸入訊息...'
                      : currentGroupId
                        ? '無法連接...'
                        : '請選擇群組'
                  }
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  onKeyDown={(e) =>
                    e.key === 'Enter' &&
                    !e.shiftKey &&
                    (sendText(), e.preventDefault())
                  }
                  className="flex-1 text-sm"
                  disabled={!isConnected || !isChatAllowedForGroup}
                />
                <Button
                  onClick={sendText}
                  disabled={
                    !text.trim() || !isConnected || !isChatAllowedForGroup
                  }
                  className="text-sm"
                >
                  送出
                </Button>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
}
