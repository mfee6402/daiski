// chat-bubble.js
'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { io } from 'socket.io-client';
import { usePathname } from 'next/navigation';
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
  const [isCheckingGroupAuth, setIsCheckingGroupAuth] = useState(false);
  const [isChatAllowedForActiveGroup, setIsChatAllowedForActiveGroup] =
    useState(false);
  const [joinedGroups, setJoinedGroups] = useState([]);
  const [isLoadingGroups, setIsLoadingGroups] = useState(false);
  const [activeChatGroupId, setActiveChatGroupId] = useState(null);
  const [showGroupList, setShowGroupList] = useState(true);

  const pathname = usePathname();
  const fileRef = useRef(null);
  const scrollAreaRef = useRef(null);
  const socketRef = useRef(null);

  useEffect(() => {
    if (apiBase && !socketRef.current) {
      socketRef.current = io(apiBase, {
        autoConnect: false,
        reconnectionAttempts: 5,
        reconnectionDelay: 3000,
      });
    }
    return () => {
      if (socketRef.current?.connected) {
        socketRef.current.disconnect();
      }
      socketRef.current = null;
    };
  }, [apiBase]);

  const getGroupIdFromUrl = () => {
    const pathSegments = pathname.split('/');
    if (
      pathSegments.length > 2 &&
      pathSegments[1] === 'groups' &&
      pathSegments[2]
    ) {
      const potentialGroupId = pathSegments[2];
      if (
        /^\d+$/.test(potentialGroupId) ||
        (typeof potentialGroupId === 'string' && potentialGroupId.trim() !== '')
      ) {
        return potentialGroupId;
      }
    }
    return null;
  };

  const fetchJoinedGroups = async () => {
    if (!currentUser?.id || !apiBase) return;
    setIsLoadingGroups(true);
    try {
      const response = await fetch(
        `${apiBase}/api/group/groupchat/my-joined-list`,
        {
          credentials: 'include',
        }
      );
      if (response.ok) {
        const data = await response.json();
        if (data.success) setJoinedGroups(data.groups || []);
        else setJoinedGroups([]);
      } else {
        setJoinedGroups([]);
      }
    } catch (error) {
      console.error('[fetchJoinedGroups] API call error:', error); // 保留錯誤日誌
      setJoinedGroups([]);
    } finally {
      setIsLoadingGroups(false);
    }
  };

  const selectGroupAndEnterChat = async (groupId) => {
    if (!groupId || !currentUser || !socketRef.current || !apiBase) {
      return;
    }
    setActiveChatGroupId(groupId);
    setShowGroupList(false);
    setIsCheckingGroupAuth(true);
    setIsChatAllowedForActiveGroup(false);
    setMsgs([]);

    try {
      const response = await fetch(
        `${apiBase}/api/group/groupchat/${groupId}/authorize`,
        {
          method: 'GET',
          credentials: 'include',
          cache: 'no-store',
        }
      );
      if (response.ok) {
        const data = await response.json();
        if (data.authorized) {
          setIsChatAllowedForActiveGroup(true);
          if (!socketRef.current.connected) {
            socketRef.current.connect();
          } else {
            socketRef.current.emit('joinGroupChat', groupId, currentUser.id);
          }
        } else {
          setIsChatAllowedForActiveGroup(false);
          setShowGroupList(true);
          setActiveChatGroupId(null);
        }
      } else {
        const errText = await response.text();
        console.error(
          `[selectGroupAndEnterChat] Auth API HTTP error for group ${groupId}: ${response.status}`,
          errText
        ); // 保留錯誤日誌
        setIsChatAllowedForActiveGroup(false);
        setShowGroupList(true);
        setActiveChatGroupId(null);
      }
    } catch (error) {
      console.error(
        `[selectGroupAndEnterChat] Auth API call failed for group ${groupId}:`,
        error
      ); // 保留錯誤日誌
      setIsChatAllowedForActiveGroup(false);
      setShowGroupList(true);
      setActiveChatGroupId(null);
    } finally {
      setIsCheckingGroupAuth(false);
    }
  };

  useEffect(() => {
    if (open && currentUser?.id) {
      fetchJoinedGroups();
      const groupIdFromUrl = getGroupIdFromUrl();
      if (groupIdFromUrl) {
        if (activeChatGroupId !== groupIdFromUrl) {
          selectGroupAndEnterChat(groupIdFromUrl);
        }
      } else {
        setShowGroupList(true);
        setActiveChatGroupId(null);
        setIsChatAllowedForActiveGroup(false);
        if (socketRef.current?.connected) socketRef.current.disconnect();
      }
    } else if (!open) {
      if (socketRef.current?.connected) {
        socketRef.current.disconnect();
      }
      setActiveChatGroupId(null);
      setIsChatAllowedForActiveGroup(false);
      setShowGroupList(true);
      setMsgs([]);
      setUnread(0);
    }
  }, [open, currentUser?.id, apiBase]);

  useEffect(() => {
    const groupIdFromUrl = getGroupIdFromUrl();
    if (open && currentUser?.id) {
      if (groupIdFromUrl) {
        if (groupIdFromUrl !== activeChatGroupId) {
          selectGroupAndEnterChat(groupIdFromUrl);
        }
      } else {
        if (activeChatGroupId && !showGroupList) {
          setShowGroupList(true);
          if (socketRef.current?.connected) socketRef.current.disconnect();
          setActiveChatGroupId(null);
          setIsChatAllowedForActiveGroup(false);
          setMsgs([]);
        } else if (!activeChatGroupId) {
          setShowGroupList(true);
        }
      }
    }
  }, [pathname, open, currentUser?.id]);

  useEffect(() => {
    const currentSocket = socketRef.current;
    if (
      !currentSocket ||
      !activeChatGroupId ||
      !isChatAllowedForActiveGroup ||
      !currentUser?.id
    ) {
      if (currentSocket?.connected) {
        currentSocket.disconnect();
      }
      setIsConnected(false);
      return;
    }

    if (!currentSocket.connected) {
      currentSocket.connect();
    }

    const handleConnect = () => {
      setIsConnected(true);
      currentSocket.emit('joinGroupChat', activeChatGroupId, currentUser.id);
    };
    const handleDisconnect = () => {
      setIsConnected(false);
    };
    const handleChatMessage = (m) => {
      if (
        m.groupId === activeChatGroupId ||
        (m.room && m.room.toString() === activeChatGroupId)
      ) {
        setMsgs((prev) => [...prev, m]);
        if (!open) setUnread((u) => u + 1);
      }
    };
    const handleJoinedRoomSuccess = (data) => {
      if (data.groupId === activeChatGroupId)
        console.log(`[Socket] Joined room ${data.groupId} successfully.`);
    }; // 保留一個成功日誌
    const handleJoinRoomError = (data) => {
      if (data.groupId === activeChatGroupId) {
        console.error(
          `[Socket] Join room ${data.groupId} error:`,
          data.message
        );
        setIsChatAllowedForActiveGroup(false);
        setShowGroupList(true);
        setActiveChatGroupId(null);
        if (currentSocket.connected) currentSocket.disconnect();
      }
    };

    currentSocket.on('connect', handleConnect);
    currentSocket.on('disconnect', handleDisconnect);
    currentSocket.on('chatMessage', handleChatMessage);
    currentSocket.on('joinedRoomSuccess', handleJoinedRoomSuccess);
    currentSocket.on('joinRoomError', handleJoinRoomError);

    return () => {
      currentSocket.off('connect', handleConnect);
      currentSocket.off('disconnect', handleDisconnect);
      currentSocket.off('chatMessage', handleChatMessage);
      currentSocket.off('joinedRoomSuccess', handleJoinedRoomSuccess);
      currentSocket.off('joinRoomError', handleJoinRoomError);
    };
  }, [
    socketRef,
    activeChatGroupId,
    currentUser?.id,
    isChatAllowedForActiveGroup,
  ]);

  useEffect(() => {
    if (open && scrollAreaRef.current) {
      const sv = scrollAreaRef.current.querySelector(
        'div[style*="overflow: scroll"]'
      );
      if (sv) setTimeout(() => (sv.scrollTop = sv.scrollHeight), 100);
    }
  }, [msgs, open]);
  useEffect(() => {
    if (open) setUnread(0);
  }, [open]);

  const sendMessage = (messageData) => {
    if (
      !socketRef.current ||
      !isConnected ||
      !activeChatGroupId ||
      !isChatAllowedForActiveGroup
    ) {
      console.error('[sendMessage] Aborted: Conditions not met.'); // 保留錯誤日誌
      alert('訊息無法發送：未連接到聊天室或未授權。');
      return;
    }
    socketRef.current.emit(
      'sendMessage',
      messageData,
      activeChatGroupId.toString()
    );
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
    if (
      !file ||
      !currentUser ||
      !activeChatGroupId ||
      !isChatAllowedForActiveGroup
    )
      return;
    const form = new FormData();
    form.append('file', file);
    try {
      const res = await fetch(`${apiBase}/api/group/groupchat/upload`, {
        method: 'POST',
        body: form,
        credentials: 'include',
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
      console.error('[uploadImage] Failed:', err); // 保留錯誤日誌
      alert(`圖片上傳失敗: ${err.message}`);
    } finally {
      if (fileRef.current) fileRef.current.value = null;
    }
  };

  const canInteractWithChat =
    isConnected &&
    activeChatGroupId &&
    isChatAllowedForActiveGroup &&
    !isCheckingGroupAuth;
  const displayTitle =
    activeChatGroupId && isChatAllowedForActiveGroup && !showGroupList
      ? `群組 ${activeChatGroupId}`
      : showGroupList
        ? '選擇聊天群組'
        : isCheckingGroupAuth
          ? '檢查權限中...'
          : activeChatGroupId
            ? `群組 ${activeChatGroupId} (無法進入)`
            : '聊天室';
  const handleChatHeadClick = () => {
    if (!currentUser) {
      alert('請先登入以使用聊天功能。');
      return;
    }
    if (open) {
      onOpenChange(false);
    } else {
      onOpenChange(true);
      const groupIdFromUrl = getGroupIdFromUrl();
      if (!groupIdFromUrl) {
        setShowGroupList(true);
      }
      // fetchJoinedGroups 和 selectGroupAndEnterChat 的邏輯主要由 useEffect 依賴 open 狀態觸發
    }
  };

  const shouldShowGroupList = !isLoadingGroups && showGroupList;
  const shouldShowCheckingAuth = activeChatGroupId && isCheckingGroupAuth;
  const shouldShowNotAllowed =
    activeChatGroupId &&
    !isCheckingGroupAuth &&
    !isChatAllowedForActiveGroup &&
    !showGroupList;
  const shouldShowChatContent =
    activeChatGroupId &&
    isChatAllowedForActiveGroup &&
    !isCheckingGroupAuth &&
    !showGroupList;

  return (
    <>
      {currentUser && (
        <Button
          variant="secondary"
          className="fixed bottom-6 right-6 rounded-full p-4 shadow-lg z-50"
          onClick={handleChatHeadClick}
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
      {open && currentUser && (
        <div className="fixed bottom-20 right-6 w-80 h-[500px] max-h-[70vh] bg-white border border-gray-300 shadow-xl rounded-lg flex flex-col z-40 overflow-hidden">
          <div className="flex items-center justify-between p-3 border-b bg-slate-100 rounded-t-lg flex-shrink-0">
            <h4 className="font-semibold text-slate-800 text-sm truncate pr-2">
              {displayTitle}
            </h4>
            <div>
              {activeChatGroupId &&
                isChatAllowedForActiveGroup &&
                !showGroupList && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => {
                      setShowGroupList(true);
                      if (socketRef.current?.connected)
                        socketRef.current.disconnect();
                      setActiveChatGroupId(null);
                      setIsChatAllowedForActiveGroup(false);
                      setMsgs([]);
                    }}
                    className="text-slate-500 hover:text-slate-700 mr-1 text-xs p-1"
                  >
                    返回列表
                  </Button>
                )}
              <Button
                size="sm"
                variant="ghost"
                onClick={() => onOpenChange(false)}
                aria-label="關閉聊天室"
                className="text-slate-500 hover:text-slate-700 p-1"
              >
                ✕
              </Button>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            {isLoadingGroups && showGroupList && (
              <div className="p-3 text-sm text-center text-gray-500">
                載入您的群組列表中...
              </div>
            )}
            {shouldShowGroupList && (
              <ScrollArea className="h-full">
                <div className="p-2 space-y-1">
                  {joinedGroups.length > 0
                    ? joinedGroups.map((group) => (
                        <Button
                          key={group.id}
                          variant="ghost"
                          className="w-full justify-start text-left h-auto py-2 px-3"
                          onClick={() =>
                            selectGroupAndEnterChat(group.id.toString())
                          }
                        >
                          <span className="truncate">
                            {group.title || `群組 ${group.id}`}
                          </span>
                        </Button>
                      ))
                    : !isLoadingGroups && (
                        <p className="p-3 text-sm text-center text-gray-500">
                          您尚未加入任何可聊天的群組，或沒有群組的聊天權限。
                        </p>
                      )}
                </div>
              </ScrollArea>
            )}
            {shouldShowCheckingAuth && (
              <div className="p-3 text-sm text-center text-gray-500">
                正在檢查群組 {activeChatGroupId} 的權限...
              </div>
            )}
            {shouldShowNotAllowed && (
              <div className="flex-1 p-3 flex items-center justify-center text-sm text-red-600">
                您目前無法進入群組 {activeChatGroupId} 的聊天室。
              </div>
            )}
            {shouldShowChatContent && (
              <>
                <ScrollArea
                  ref={scrollAreaRef}
                  className="h-full p-3 space-y-3 bg-slate-50"
                >
                  {msgs.map((m, i) => (
                    <div
                      key={m.id || `msg-${i}-${m.time}`}
                      className={`flex flex-col max-w-[85%] ${m.user.id === currentUser.id ? 'self-end items-end ml-auto' : 'self-start items-start mr-auto'}`}
                    >
                      <div className="flex items-end gap-1.5">
                        {m.user.id !== currentUser.id && (
                          <Image
                            src={m.user.avatar || '/default-avatar.png'}
                            alt={m.user.name || '用戶'}
                            width={24}
                            height={24}
                            className="rounded-full self-end mb-1"
                          />
                        )}
                        <div
                          className={`px-3 py-2 rounded-xl shadow-sm ${m.user.id === currentUser.id ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'}`}
                        >
                          {m.user.id !== currentUser.id && (
                            <p className="text-xs font-semibold mb-0.5 text-gray-700">
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
                                m.imageUrl.startsWith('http') ||
                                m.imageUrl.startsWith('blob:')
                                  ? m.imageUrl
                                  : `${apiBase}${m.imageUrl}`
                              }
                              alt="聊天圖片"
                              width={200}
                              height={150}
                              className="max-w-full h-auto rounded-md object-cover cursor-pointer"
                              onClick={() =>
                                window.open(
                                  m.imageUrl.startsWith('http') ||
                                    m.imageUrl.startsWith('blob:')
                                    ? m.imageUrl
                                    : `${apiBase}${m.imageUrl}`,
                                  '_blank'
                                )
                              }
                              unoptimized={m.imageUrl.startsWith('blob:')}
                            />
                          )}
                        </div>
                      </div>
                      <span
                        className={`text-xs text-gray-400 mt-0.5 px-1 ${m.user.id === currentUser.id ? 'self-end' : 'self-start'}`}
                      >
                        {new Date(m.time).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                  ))}
                  {!isConnected && (
                    <p className="text-xs text-center text-red-500 py-2">
                      連線中斷，嘗試重新連接...
                    </p>
                  )}
                  {msgs.length === 0 && !isCheckingGroupAuth && (
                    <p className="text-xs text-center text-gray-400 py-2">
                      還沒有訊息，開始聊天吧！
                    </p>
                  )}
                </ScrollArea>
              </>
            )}
          </div>
          {shouldShowChatContent && (
            <div className="flex items-center gap-2 p-3 border-t bg-white rounded-b-lg flex-shrink-0">
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
                disabled={!canInteractWithChat}
              >
                📎
              </Button>
              <Input
                placeholder={
                  canInteractWithChat ? '輸入訊息...' : '無法連接...'
                }
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={(e) =>
                  e.key === 'Enter' &&
                  !e.shiftKey &&
                  canInteractWithChat &&
                  (sendText(), e.preventDefault())
                }
                className="flex-1 text-sm"
                disabled={!canInteractWithChat}
              />
              <Button
                onClick={sendText}
                disabled={!text.trim() || !canInteractWithChat}
                className="text-sm"
              >
                送出
              </Button>
            </div>
          )}
        </div>
      )}
    </>
  );
}
