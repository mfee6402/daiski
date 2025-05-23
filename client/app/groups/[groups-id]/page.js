// app/groups/[groups-id]/page.js
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';

// 引入子組件
import GroupBreadCrumb from './_components/bread-crumb';
import GroupMainInfoCard from './_components/group-info';
import OrganizerIntroduction from './_components/organizer-introduction';
import ActivityDescription from './_components/activity-description';
import CommentSection from './_components/comment-section';
import MobileStickyButtons from './_components/sticky-buttons';

import { Button } from '@/components/ui/button';

// 引入購物車鉤子
import { useCart } from '@/hooks/use-cart';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:3005';

export default function GroupDetailPage() {
  // 購物車鉤子
  const { onAdd } = useCart();

  const params = useParams();
  const groupId = params['groups-id'];
  const router = useRouter();

  const [group, setGroup] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [countdown, setCountdown] = useState('計算中...'); // Initial state for countdown
  const [progressWidth, setProgressWidth] = useState('0%');

  const [currentUser, setCurrentUser] = useState(null);
  const [isOrganizer, setIsOrganizer] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    setCurrentUser({
      id: 1,
      name: '測試用戶小明',
      avatar: `${API_BASE}/uploads/556889.jpg`, // Ensure this path is valid or handle missing avatar
    });
  }, []);

  const fetchGroupData = useCallback(async () => {
    if (!groupId) {
      setLoading(false);
      setError('無效的揪團 ID。');
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/api/group/${groupId}`);
      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(
          errData.error || `無法獲取揪團資料 (狀態碼 ${response.status})`
        );
      }
      const data = await response.json();
      setGroup(data);

      if (currentUser && data.creator && data.creator.id === currentUser.id) {
        setIsOrganizer(true);
      } else {
        setIsOrganizer(false);
      }

      if (
        data &&
        typeof data.currentPeople === 'number' &&
        typeof data.maxPeople === 'number' &&
        data.maxPeople > 0
      ) {
        setProgressWidth(
          `${Math.min((data.currentPeople / data.maxPeople) * 100, 100)}%`
        );
      } else {
        setProgressWidth('0%');
      }
      setError('');
    } catch (err) {
      console.error('[主頁面] 獲取揪團資料時發生錯誤:', err);
      setError(err.message);
      setGroup(null);
    } finally {
      setLoading(false);
    }
  }, [groupId, API_BASE, currentUser]);

  useEffect(() => {
    fetchGroupData();
  }, [fetchGroupData]);

  // 倒數計時的 useEffect - *** 修正處 ***
  useEffect(() => {
    if (!group) return;

    const deadline = group.registrationDeadline || group.endDate;
    if (!deadline) {
      setCountdown('未設定截止日期');
      return;
    }

    const deadlineTime = new Date(deadline).getTime();
    let intervalId = null; // 1. Initialize intervalId to null

    const updateTimer = () => {
      const now = Date.now();
      let diff = deadlineTime - now;

      if (diff <= 0) {
        setCountdown('報名已截止');
        if (intervalId) {
          // 2. Check if intervalId has been set before clearing
          clearInterval(intervalId);
          intervalId = null; // Optional: reset to null after clearing
        }
        return;
      }

      const d = String(Math.floor(diff / 86400000)).padStart(2, '0');
      const h = String(Math.floor((diff % 86400000) / 3600000)).padStart(
        2,
        '0'
      );
      const m = String(Math.floor((diff % 3600000) / 60000)).padStart(2, '0');
      const s = String(Math.floor((diff % 60000) / 1000)).padStart(2, '0');
      setCountdown(`${d}天 ${h}時 ${m}分 ${s}秒`);
    };
    updateTimer();
    if (new Date().getTime() < deadlineTime) {
      intervalId = setInterval(updateTimer, 1000); // intervalId is assigned here
    } else {
      // If deadline already passed on component mount and was not caught by the first updateTimer call
      // (e.g. if updateTimer logic was slightly different), ensure countdown is "報名已截止"
      setCountdown('報名已截止');
    }

    // Cleanup function
    return () => {
      if (intervalId) {
        // 3. Ensure intervalId is valid before clearing in cleanup
        clearInterval(intervalId);
      }
    };
  }, [group]); // Dependency array remains [group]

  const handleNewCommentPosted = useCallback((newComment) => {
    setGroup((prevGroup) => {
      if (!prevGroup) return null;
      const updatedComments = [newComment, ...(prevGroup.comments || [])];
      return { ...prevGroup, comments: updatedComments };
    });
  }, []);

  const handleJoinGroup = () => {
    onAdd('group', group.id);

    alert(
      `功能待開發：加入揪團 ${group?.title || groupId}，group_id為${group.id}`
    );
  };

  const handleJoinChat = () =>
    alert(`功能待開發：加入 ${group?.title || groupId} 的聊天室`);
  const handleEditGroup = () => router.push(`/groups/${groupId}/edit`);
  const handleDeleteGroup = async () => {
    if (
      window.confirm(`確定要刪除揪團 "${group?.title}" 嗎？此操作無法復原。`)
    ) {
      alert(`功能待開發：刪除揪團 ${group?.title || groupId}`);
      // Example API call (uncomment and adapt)
      // try {
      //   const response = await fetch(`${API_BASE}/api/group/${groupId}`, { method: 'DELETE' });
      //   if (!response.ok) {
      //     const errData = await response.json().catch(() => ({}));
      //     throw new Error(errData.error || '刪除失敗');
      //   }
      //   alert('揪團已刪除');
      //   router.push('/groups');
      // } catch (error) {
      //   console.error('刪除揪團失敗:', error);
      //   alert(`刪除失敗: ${error.message}`);
      // }
    }
  };

  if (loading && !group)
    return (
      <div className="min-h-screen flex items-center justify-center p-8 text-center text-primary-800 text-xl bg-secondary-200">
        載入中…
      </div>
    );
  if (error && !group)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-8 text-center text-destructive bg-secondary-200">
        <p className="mb-4 text-p-tw">錯誤：{error}</p>
        <Button
          onClick={() => router.push('/groups')}
          className="bg-primary-500 text-white hover:bg-primary-600 text-p-tw px-4 py-2 rounded-md"
        >
          回揪團列表
        </Button>
      </div>
    );
  if (!group && !loading)
    // If not loading and group is still null
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-8 text-center text-secondary-800 bg-secondary-200">
        <p className="mb-4 text-p-tw">查無此揪團資料。</p>
        <Button
          onClick={() => router.push('/groups')}
          className="bg-primary-500 text-white hover:bg-primary-600 text-p-tw px-4 py-2 rounded-md"
        >
          回揪團列表
        </Button>
      </div>
    );

  // If group data exists, render the page
  if (!group) return null; // Should be caught by above conditions, but as a fallback

  const PageLevelError = () =>
    error ? (
      <div className="w-full max-w-[1920px] mx-auto px-4 py-2 text-center bg-destructive/10 text-destructive border border-destructive rounded-md mb-4">
        <p>{error}</p>
      </div>
    ) : null;

  return (
    <div className="bg-secondary-200 text-secondary-800 min-h-screen">
      <main className="w-full max-w-[1920px] mx-auto px-4 py-8 space-y-8">
        <PageLevelError />
        <GroupBreadCrumb title={group.title || '揪團標題'} router={router} />

        <GroupMainInfoCard
          group={group}
          API_BASE={API_BASE}
          isClient={isClient}
          countdown={countdown}
          progressWidth={progressWidth}
          onJoinGroup={handleJoinGroup}
          onJoinChat={handleJoinChat}
          isOrganizer={isOrganizer}
          onEditGroup={handleEditGroup}
          onDeleteGroup={handleDeleteGroup}
        />

        {group.creator?.introduction && (
          <OrganizerIntroduction user={group.creator} API_BASE={API_BASE} />
        )}

        <ActivityDescription description={group.description} />

        <CommentSection
          groupId={groupId}
          initialComments={group.comments || []}
          API_BASE={API_BASE}
          currentUserId={currentUser?.id}
          currentUserInfo={currentUser}
          isClient={isClient}
          onCommentPosted={handleNewCommentPosted}
        />
      </main>

      <MobileStickyButtons
        groupTitle={group.title}
        groupId={groupId}
        onJoinGroup={handleJoinGroup}
        onJoinChat={handleJoinChat}
        isOrganizer={isOrganizer}
        onEdit={handleEditGroup}
        onDelete={handleDeleteGroup}
      />
    </div>
  );
}
