'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { io } from 'socket.io-client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';

/**
 * 無灰色遮罩、非彈窗模式的側邊浮動聊天室
 * 點擊聊天頭切換顯示與否，點擊外部不會自動關閉
 */
export function ChatBubble({ apiBase, currentUser, open, onOpenChange }) {
  const [msgs, setMsgs] = useState([]);
  const [text, setText] = useState('');
  const [unread, setUnread] = useState(0);
  const socket = useMemo(() => io(apiBase), [apiBase]);
  const fileRef = useRef();

  // 接收訊息
  useEffect(() => {
    socket.on('chatMessage', (m) => {
      setMsgs((prev) => [...prev, m]);
      if (!open) setUnread((u) => u + 1);
    });
    return () => socket.disconnect();
  }, [socket, open]);

  // open 變更時清空未讀
  useEffect(() => {
    if (open) setUnread(0);
  }, [open]);

  // 傳送文字訊息
  const sendText = () => {
    const c = text.trim();
    if (!c) return;
    const msg = {
      user: currentUser,
      type: 'text',
      content: c,
      time: Date.now(),
    };
    socket.emit('sendMessage', msg);
    setMsgs((p) => [...p, msg]);
    setText('');
  };

  // 圖片上傳
  const uploadImage = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const form = new FormData();
    form.append('file', file);
    try {
      const res = await fetch(`${apiBase}/api/upload`, {
        method: 'POST',
        body: form,
      });
      const { url } = await res.json();
      const msg = {
        user: currentUser,
        type: 'image',
        imageUrl: url,
        time: Date.now(),
      };
      socket.emit('sendMessage', msg);
      setMsgs((p) => [...p, msg]);
    } catch (err) {
      console.error('上傳失敗', err);
    } finally {
      e.target.value = null;
    }
  };

  return (
    <>
      {/* 聊天頭 */}
      <Button
        variant="secondary"
        className="fixed bottom-6 right-6 rounded-full p-4 shadow-lg z-50"
        onClick={() => onOpenChange(!open)}
      >
        💬
        {unread > 0 && (
          <Badge
            variant="destructive"
            className="absolute -top-1 -right-1 px-1 text-xs"
          >
            {unread}
          </Badge>
        )}
      </Button>

      {/* 側邊小視窗 */}
      {open && (
        <div className="fixed bottom-20 right-6 w-80 h-96 bg-white border border-gray-200 shadow-lg rounded-lg flex flex-col z-40">
          {/* 標題列 */}
          <div className="flex items-center justify-between p-2 border-b">
            <h4 className="font-semibold">聊天室</h4>
            <Button
              size="icon"
              variant="ghost"
              onClick={() => onOpenChange(false)}
            >
              ×
            </Button>
          </div>
          {/* 訊息列表 */}
          <ScrollArea className="flex-1 p-2 space-y-2 overflow-y-auto">
            {msgs.map((m, i) => (
              <div
                key={i}
                className={`flex flex-col max-w-[80%] ${
                  m.user.id === currentUser.id
                    ? 'self-end items-end'
                    : 'self-start items-start'
                }`}
              >
                {m.type === 'text' ? (
                  <div className="px-3 py-1 bg-gray-100 rounded-lg">
                    {m.content}
                  </div>
                ) : (
                  <img
                    src={`${apiBase}${m.imageUrl}`}
                    alt="img"
                    className="max-w-full rounded shadow"
                  />
                )}
                <span className="text-xs text-gray-500 mt-1">
                  {new Date(m.time).toLocaleTimeString()}
                </span>
              </div>
            ))}
          </ScrollArea>
          {/* 輸入區 */}
          <div className="flex items-center gap-2 p-2 border-t">
            <input
              type="file"
              accept="image/*"
              ref={fileRef}
              className="hidden"
              onChange={uploadImage}
            />
            <Button
              variant="ghost"
              className="px-2"
              onClick={() => fileRef.current?.click()}
            >
              📎
            </Button>
            <Input
              placeholder="輸入文字…"
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendText()}
              className="flex-1"
            />
            <Button onClick={sendText}>送出</Button>
          </div>
        </div>
      )}
    </>
  );
}
