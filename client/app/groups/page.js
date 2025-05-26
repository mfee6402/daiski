// app/groups/page.js
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '@/components/ui/popover';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { CustomPagination } from './_components/group-pagination';
import Image from 'next/image';
import Link from 'next/link';

export default function GroupsPage() {
  const router = useRouter();
  const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:3005';

  const [groups, setGroups] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({
    type: '全部',
    date: '',
    location: '全部',
    keyword: '',
  });
  const [typeOptions, setTypeOptions] = useState(['全部']);
  const [locationOptions, setLocationOptions] = useState(['全部']);
  const PAGE_SIZE = 12;

  useEffect(() => {
    async function loadFilterOptions() {
      try {
        const [typesRes, locsRes] = await Promise.all([
          fetch(`${API_BASE}/api/group?onlyTypes=true`),
          fetch(`${API_BASE}/api/location`),
        ]);
        const typesData = await typesRes.json();
        const locsData = await locsRes.json();
        const uniqueTypes = Array.from(new Set(typesData || []));
        setTypeOptions(['全部', ...uniqueTypes]);
        const locationNames = (locsData || []).map((loc) => loc.name);
        const uniqueLocationNames = Array.from(new Set(locationNames));
        setLocationOptions(['全部', ...uniqueLocationNames]);
      } catch (err) {
        console.error('載入篩選選項失敗:', err);
        setTypeOptions(['全部']);
        setLocationOptions(['全部']);
      }
    }
    loadFilterOptions();
  }, [API_BASE]);

  useEffect(() => {
    async function fetchGroups() {
      try {
        const params = new URLSearchParams({ pageSize: String(PAGE_SIZE) });
        if (filters.type !== '全部') params.append('type', filters.type);
        if (filters.date) params.append('date', filters.date);
        if (filters.location !== '全部')
          params.append('location', filters.location);
        if (filters.keyword) params.append('keyword', filters.keyword);
        params.append('page', String(page));
        const res = await fetch(`${API_BASE}/api/group?${params}`);
        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}));
          throw new Error(
            errorData.error || `無法獲取揪團列表 (狀態 ${res.status})`
          );
        }
        const data = await res.json();
        if (data && Array.isArray(data.groups)) {
          setGroups(data.groups);
          setTotalPages(data.totalPages || 1);
        } else {
          setGroups([]);
          setTotalPages(1);
        }
      } catch (err) {
        console.error('獲取揪團列表失敗:', err);
        setGroups([]);
        setTotalPages(1);
      }
    }
    fetchGroups();
  }, [filters, page, API_BASE]);

  const handleJoin = (groupId) => {
    router.push(`/groups/${groupId}`);
  };

  const formatDateRange = (startDate, endDate) => {
    if (!startDate || !endDate) return '日期未定';
    try {
      const start = new Date(startDate).toLocaleDateString('zh-TW', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      });
      const end = new Date(endDate).toLocaleDateString('zh-TW', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      });
      return `${start} ~ ${end}`;
    } catch (err) {
      return '日期格式錯誤';
    }
  };

  return (
    <>
      <title>Daiski 揪團總覽</title>
      <section className="bg-secondary-200 dark:bg-slate-800 py-3">
        {' '}
        {/* Dark mode 背景 */}
        <div className="relative overflow-hidden max-w-screen-xl mx-auto">
          <div className="whitespace-nowrap animate-marquee pause text-primary-800 dark:text-white text-p-tw font-medium flex items-center gap-4">
            {' '}
            {/* Dark mode 文字 */}
            <span>🏂 現正招募中：北海道出國團</span>
            <span>⛷️ 苗場初學教學團</span>
            <span>🎿 富良野自由行！</span>
            <span>📅 官方協助排課中</span>
          </div>
        </div>
      </section>

      <section className="relative py-36 text-center">
        <video
          className="absolute inset-0 w-full h-full object-cover"
          src="/ProductHeroSection.mp4"
          autoPlay
          muted
          loop
          playsInline
        />
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
        <div className="relative max-w-3xl mx-auto px-7 py-14 bg-white/85 dark:bg-slate-900/85 shadow-2xl rounded-lg">
          {' '}
          {/* Dark mode 背景 */}
          <h2 className="font-extrabold mb-6 tracking-wider text-h2-tw text-primary-800 dark:text-white leading-h2-tw">
            {' '}
            {/* Dark mode 文字 */}
            找人開團滑雪，一起嗨翻雪場！
          </h2>
          <p className="mb-8 text-p-tw text-secondary-800 dark:text-slate-300 leading-p-tw">
            {' '}
            {/* Dark mode 文字 */}
            不論是自由行或是想體驗教學，歡迎發起屬於你的行程，官方協助安排課程與教練，讓旅程更加完美！
          </p>
          {/* ... Buttons ... */}
          <div className="flex justify-center gap-6">
            <Button
              onClick={() => router.push('/groups/create')}
              className="px-8 py-3 bg-primary-500  text-white font-semibold shadow-lg transition transform hover:scale-105 rounded-md hover:bg-primary-600 dark:bg-primary-600 dark:hover:bg-primary-700 cursor-none"
            >
              立即開團
            </Button>
            <Button
              variant="outline"
              onClick={() => router.push('/groups')}
              className="px-8 py-3 border-primary-500 text-primary-500 dark:border-primary-400 dark:text-primary-400 font-semibold transition transform hover:scale-105 rounded-md hover:bg-primary-500/10 dark:hover:bg-primary-400/10 cursor-none"
            >
              查看開團
            </Button>
          </div>
        </div>
      </section>

      <section className="max-w-screen-xl mx-auto px-6 py-8 ">
        <form className="grid grid-cols-1 md:grid-cols-5 gap-6 bg-card dark:bg-slate-800 p-6 shadow-md rounded-lg">
          {' '}
          {/* Dark mode 背景 */}
          <div className="cursor-none">
            <Label
              htmlFor="type-filter"
              className="text-p-tw text-secondary-800 dark:text-slate-300 cursor-none"
            >
              類型
            </Label>{' '}
            {/* Dark mode 文字 */}
            {/* ... Popover for type ... */}
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="type-filter"
                  variant="outline"
                  className="w-full justify-between mt-1 text-p-tw cursor-none dark:text-slate-300 dark:border-slate-600 dark:hover:bg-slate-700"
                >
                  {filters.type} <span aria-hidden="true">▾</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent
                side="bottom"
                align="start"
                className="w-auto min-w-[theme(spacing.44)] bg-card dark:bg-slate-800 border-border dark:border-slate-700"
              >
                <div className="flex flex-col space-y-1 p-1">
                  {typeOptions.map((opt) => (
                    <Button
                      key={opt}
                      variant={filters.type === opt ? 'secondary' : 'ghost'}
                      onClick={() => setFilters((f) => ({ ...f, type: opt }))}
                      className="w-full justify-start text-p-tw dark:text-slate-300 dark:hover:bg-slate-700"
                    >
                      {opt}
                    </Button>
                  ))}
                </div>
              </PopoverContent>
            </Popover>
          </div>
          <div>
            <Label
              htmlFor="date-filter"
              className="text-p-tw text-secondary-800 dark:text-slate-300 cursor-none"
            >
              日期
            </Label>
            <Input
              id="date-filter"
              type="date"
              value={filters.date}
              onChange={(e) =>
                setFilters((f) => ({ ...f, date: e.target.value }))
              }
              className="w-full mt-1 text-p-tw !cursor-none dark:bg-slate-700 dark:text-slate-300 dark:border-slate-600"
            />
          </div>
          <div>
            <Label
              htmlFor="location-filter"
              className="text-p-tw text-secondary-800 dark:text-slate-300 cursor-none"
            >
              地點
            </Label>
            {/* ... Popover for location ... */}
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="location-filter"
                  variant="outline"
                  className="w-full justify-between mt-1 text-p-tw cursor-none dark:text-slate-300 dark:border-slate-600 dark:hover:bg-slate-700"
                >
                  {filters.location} <span aria-hidden="true">▾</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent
                side="bottom"
                align="start"
                className="w-auto min-w-[theme(spacing.44)] bg-card dark:bg-slate-800 border-border dark:border-slate-700"
              >
                <div className="flex flex-col space-y-1 p-1">
                  {locationOptions.map((opt) => (
                    <Button
                      key={opt}
                      variant={filters.location === opt ? 'secondary' : 'ghost'}
                      onClick={() =>
                        setFilters((f) => ({ ...f, location: opt }))
                      }
                      className="w-full justify-start text-p-tw dark:text-slate-300 dark:hover:bg-slate-700"
                    >
                      {opt}
                    </Button>
                  ))}
                </div>
              </PopoverContent>
            </Popover>
          </div>
          <div className="md:col-span-2">
            <Label
              htmlFor="keyword-filter"
              className="text-p-tw text-secondary-800 dark:text-slate-300 cursor-none"
            >
              關鍵字搜尋
            </Label>
            <Input
              id="keyword-filter"
              placeholder="輸入揪團名稱、描述等關鍵字..."
              value={filters.keyword}
              onChange={(e) =>
                setFilters((f) => ({ ...f, keyword: e.target.value }))
              }
              className="w-full mt-1 text-p-tw cursor-none dark:bg-slate-700 dark:text-slate-300 dark:border-slate-600"
            />
          </div>
        </form>
      </section>

      <section className="max-w-screen-2xl mx-auto px-6 pb-16">
        {groups.length === 0 && (
          <div className="text-center py-10 text-secondary-800 dark:text-slate-400 text-p-tw">
            <p>目前沒有符合條件的揪團，試試調整篩選條件吧！</p>
          </div>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-8">
          {' '}
          {groups.map((group, index) => (
            <Card
              key={group.id}
              className="overflow-hidden pt-0 pb-2 shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-lg flex flex-col group bg-card text-foreground dark:bg-slate-800 dark:text-slate-200" // Dark mode 卡片背景和文字
            >
              {/* 圖片容器修改：添加 rounded-t-lg 和 overflow-hidden */}
              <Link
                href={`/groups/${group.id}`}
                className="relative block w-full aspect-[4/3] cursor-none rounded-t-lg overflow-hidden"
              >
                {' '}
                {/* 使用 aspect-ratio 替代固定高度 h-48 */}
                <Image
                  src={
                    group.images && group.images[0]?.imageUrl
                      ? `${API_BASE}${group.images[0].imageUrl}`
                      : '/deadicon.png' // 確認 placeholder 圖片路徑是否正確
                  }
                  alt={group.title || '揪團封面'}
                  fill
                  style={{ objectFit: 'cover' }}
                  className="transition-transform duration-300 group-hover:scale-105 rounded-lg"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                  priority={index < 4} // 優先載入首屏可見的圖片
                  onError={(e) => {
                    // 新增圖片載入錯誤處理
                    e.currentTarget.src = '/deadicon.png'; // 錯誤時替換為 /deadicon.png
                    e.currentTarget.alt = '圖片載入失敗';
                  }}
                />
              </Link>

              <CardContent className="p-4 pt-0 flex flex-col flex-grow">
                {' '}
                {/* CardContent 保持 padding */}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2 truncate">
                    <Avatar className="w-8 h-8 flex-shrink-0">
                      <AvatarImage
                        src={
                          group.user?.avatar
                            ? group.user.avatar.startsWith('http')
                              ? group.user.avatar
                              : `${API_BASE}${group.user.avatar}`
                            : undefined // 讓 AvatarFallback 顯示
                        }
                        alt={group.user?.name || '開團者'}
                      />
                      <AvatarFallback>
                        {group.user?.name
                          ? group.user.name[0].toUpperCase()
                          : 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <span className="truncate text-p-tw text-secondary-800 dark:text-slate-400">
                      {' '}
                      {/* Dark mode 文字 */}
                      開團者：{group.user?.name || '匿名用戶'}
                    </span>
                  </div>
                  <Badge
                    variant="outline"
                    className="text-xs flex-shrink-0 dark:border-slate-600 dark:text-slate-400"
                  >
                    {' '}
                    {/* Dark mode Badge */}
                    {group.type}
                  </Badge>
                </div>
                <button
                  onClick={() => router.push(`/groups/${group.id}`)}
                  className="font-bold mb-2 leading-tight truncate text-h6-tw text-primary-800 dark:text-white cursor-none hover:underline text-left w-full " // text-left 和 w-full 確保行為像區塊元素
                  aria-label={group.title || '無標題揪團'} // 提供更清晰的語音描述
                >
                  {group.title || '無標題揪團'}
                </button>
                <p
                  className="text-sm text-gray-600 dark:text-gray-400 mb-1 truncate"
                  title={group.location || '地點未提供'}
                >
                  <span className="font-semibold dark:text-gray-200">
                    地點：
                  </span>
                  {group.location || '地點未提供'}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  <span className="font-semibold dark:text-gray-200">
                    時間：
                  </span>
                  {formatDateRange(group.startDate, group.endDate)}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                  {' '}
                  {/* 價格文字加深一點 */}
                  <span className="font-semibold dark:text-gray-100">
                    費用：
                  </span>
                  NT$ {group.price !== undefined ? group.price : '未定'} /人
                </p>
                <p className="mb-4 text-p-tw text-secondary-800 dark:text-slate-400">
                  {typeof group.currentPeople === 'number' &&
                  typeof group.maxPeople === 'number'
                    ? `${group.currentPeople}/${group.maxPeople} 人`
                    : '人數未定'}
                </p>
                <div className="mt-auto pt-2 flex justify-between items-center border-t border-gray-200 dark:border-gray-700">
                  {' '}
                  {/* Dark mode 分隔線 */}
                  <Button
                    variant="link"
                    className="px-0 text-p-tw text-primary-500 dark:text-primary-400 hover:text-primary-600 dark:hover:text-primary-300 cursor-none"
                    onClick={() => router.push(`/groups/${group.id}`)}
                  >
                    查看詳情
                  </Button>
                  <Button
                    size="sm"
                    className="font-semibold bg-primary-500 text-white rounded-none text-base hover:bg-primary-600 dark:bg-primary-600 dark:hover:bg-primary-700 cursor-none"
                    onClick={() => handleJoin(group.id)}
                  >
                    我要參加
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-10 flex justify-center">
          <CustomPagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </div>
      </section>
    </>
  );
}
