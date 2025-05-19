'use client';
import React from 'react';
import Image from 'next/image';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
// import { FaCalendarAlt, FaMapMarkerAlt, FaUsers, FaEdit, FaTrash } from 'react-icons/fa';

// 左側內容區塊 (內部組件)
function ImageAndMembersSection({
  groupUser,
  mainImageUrl,
  memberPreviews = [],
  totalMembers = 0,
  API_BASE,
}) {
  const displayedAvatars = memberPreviews.slice(0, 3);
  const remainingAvatars = totalMembers > 3 ? totalMembers - 3 : 0;

  return (
    <div className="flex flex-col space-y-4">
      <div className="flex items-center space-x-3">
        <Avatar className="w-10 h-10">
          <AvatarImage
            src={
              groupUser?.avatar
                ? `${API_BASE}${groupUser.avatar}`
                : `https://i.pravatar.cc/40?u=${groupUser?.id || 'default'}`
            }
            alt={groupUser?.name}
          />
          <AvatarFallback>
            {groupUser?.name ? groupUser.name[0].toUpperCase() : '主'}
          </AvatarFallback>
        </Avatar>
        <p className="font-semibold text-foreground">
          {groupUser?.name || '主辦人'}
        </p>
      </div>
      <div className="relative overflow-hidden h-64 md:h-80 rounded-md">
        <Image
          src={mainImageUrl}
          alt="揪團封面"
          fill
          style={{ objectFit: 'cover' }}
          className="transition-transform duration-300 ease-out hover:scale-105"
          priority
        />
      </div>
      {memberPreviews.length > 0 && (
        <div className="flex space-x-[-10px] items-center pt-2">
          {displayedAvatars.map((memberUser) => (
            <Avatar
              key={memberUser.id}
              className="w-8 h-8 border-2 border-white dark:border-card rounded-full"
            >
              <AvatarImage
                src={
                  memberUser.avatar
                    ? `${API_BASE}${memberUser.avatar}`
                    : `https://i.pravatar.cc/32?u=${memberUser.id}`
                }
                alt={memberUser.name}
              />
              <AvatarFallback>
                {memberUser.name ? memberUser.name[0].toUpperCase() : '員'}
              </AvatarFallback>
            </Avatar>
          ))}
          {remainingAvatars > 0 && (
            <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center text-xs font-medium border-2 border-white dark:border-card">
              +{remainingAvatars}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// 右側內容區塊 (內部組件)
function InfoAndActionsSection({
  group,
  isClient,
  countdown,
  progressWidth,
  onJoinGroup,
  onJoinChat,
}) {
  return (
    <div className="flex flex-col space-y-4">
      <h2 className="flex items-center text-2xl font-semibold text-primary-800">
        <span className="inline-block w-1 h-6 bg-primary-500 mr-2 rounded-sm"></span>
        {group.title || '揪團標題'}
      </h2>
      <div className="space-y-1 text-sm text-secondary-800">
        <p className="flex items-center">
          <span className="mr-2 text-primary-500 text-lg">📅</span>
          {isClient
            ? `${group.startDate ? new Date(group.startDate).toLocaleDateString('zh-TW') : '待定'} – ${group.endDate ? new Date(group.endDate).toLocaleDateString('zh-TW') : '待定'}`
            : '日期載入中...'}
        </p>
        <p className="flex items-center">
          <span className="mr-2 text-primary-500 text-lg">📍</span>
          {group.location || '地點未定'}
        </p>
        <p className="flex items-center">
          <span className="mr-2 text-primary-500 text-lg">👥</span>
          成團人數：{group.minPeople || '不限'}–{group.maxPeople || '不限'} 人
        </p>
      </div>
      <div>
        <p className="text-base font-semibold text-secondary-800">價格：</p>
        <p className="text-lg font-bold text-custom-green">
          NT${group.price?.toLocaleString() || '洽主辦方'}／人
        </p>
      </div>
      {typeof group.currentPeople === 'number' &&
        typeof group.maxPeople === 'number' &&
        group.maxPeople > 0 && (
          <div>
            <p className="text-sm text-secondary-800 mb-1">
              已報名：{group.currentPeople} 人{' '}
              <span className="float-right">上限：{group.maxPeople} 人</span>
            </p>
            <div className="w-full bg-muted h-2 rounded-full overflow-hidden">
              <div
                className="bg-primary-500 h-2 rounded-full transition-all duration-1000 ease-out"
                style={{ width: progressWidth }}
              ></div>
            </div>
          </div>
        )}
      <div className="text-sm text-destructive">
        <p>
          截止報名：
          {isClient && (group.registrationDeadline || group.endDate)
            ? new Date(
                group.registrationDeadline || group.endDate
              ).toLocaleDateString('zh-TW')
            : '未定'}
        </p>
        <p className="font-mono text-lg">{countdown}</p>
      </div>
      <div className="overflow-hidden h-40 rounded-md border border-border">
        <iframe
          src={`https://maps.google.com/maps?q=${encodeURIComponent(group.location || '台灣')}&hl=zh-TW&z=15&output=embed`}
          className="w-full h-full"
          style={{ border: 0 }}
          allowFullScreen
          title="活動地點地圖"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
      </div>
      <div className="hidden md:flex flex-col space-y-2 pt-2">
        <Button
          onClick={onJoinGroup}
          className="w-full py-3 bg-primary-500 text-white font-semibold text-p-tw text-center hover:bg-primary-600 transition active:scale-95 active:shadow-sm rounded-md"
        >
          我要參加
        </Button>
        <Button
          variant="outline"
          onClick={onJoinChat}
          className="w-full py-3 border-primary-500 text-primary-500 font-semibold text-p-tw hover:bg-primary-500/10 transition active:scale-95 active:shadow-sm rounded-md"
        >
          加入聊天室
        </Button>
      </div>
    </div>
  );
}

// GroupMainInfoCard 主組件
export default function GroupMainInfoCard({
  group,
  API_BASE,
  isClient,
  countdown,
  progressWidth,
  onJoinGroup,
  onJoinChat,
  isOrganizer,
  onEditGroup,
  onDeleteGroup,
}) {
  const mainImageUrl =
    group.images && group.images.length > 0 && group.images[0].imageUrl
      ? `${API_BASE}${group.images[0].imageUrl}`
      : group.cover_image
        ? `${API_BASE}${group.cover_image}`
        : '/images/placeholder-daiski.png';

  return (
    <Card className="w-full max-w-screen-2xl mx-auto shadow-lg p-6 grid grid-cols-1 md:grid-cols-2 gap-6 rounded-lg bg-card">
      {isOrganizer && (
        <div className="md:col-span-2 mb-4 flex justify-end space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onEditGroup}
            className="text-primary-500 border-primary-500 hover:bg-primary-500/10"
          >
            {/* <FaEdit className="mr-1.5 h-3.5 w-3.5" /> */}
            編輯
          </Button>
          <Button variant="destructive" size="sm" onClick={onDeleteGroup}>
            {/* <FaTrash className="mr-1.5 h-3.5 w-3.5" /> */}
            刪除
          </Button>
        </div>
      )}
      <ImageAndMembersSection
        groupUser={group.user}
        mainImageUrl={mainImageUrl}
        memberPreviews={group.memberPreviews || []} // 從 group 物件中獲取
        totalMembers={group.totalMembers || (group.memberPreviews || []).length} // 從 group 物件中獲取
        API_BASE={API_BASE}
      />
      <InfoAndActionsSection
        group={group}
        isClient={isClient}
        countdown={countdown}
        progressWidth={progressWidth}
        onJoinGroup={onJoinGroup}
        onJoinChat={onJoinChat}
      />
    </Card>
  );
}
