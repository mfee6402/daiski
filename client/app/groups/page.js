// group/page.js
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
import { Pagination } from '@/components/ui/pagination';
import Image from 'next/image';

export default function GroupsPage() {
  const router = useRouter();
  const API_BASE = 'http://localhost:3005';

  // 列表與分頁
  const [groups, setGroups] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // 篩選狀態
  const [filters, setFilters] = useState({
    type: '全部',
    date: '',
    location: '全部',
    keyword: '',
  });

  // 篩選選項（動態從後端載入）
  const [typeOptions, setTypeOptions] = useState([]);
  const [locationOptions, setLocationOptions] = useState([]);

  // 取得活動類型與地點選項
  // useEffect(() => {
  //   async function loadFilterOptions() {
  //     try {
  //       const [typesRes, locsRes] = await Promise.all([
  //         fetch(`${API_BASE}/api/group/types`),
  //         fetch(`${API_BASE}/api/group/location`),
  //       ]);
  //       const types = await typesRes.json(); // e.g. ['滑雪','聚餐']
  //       const locs = await locsRes.json(); // e.g. ['二世谷','苗場', ...]
  //       setTypeOptions(['全部', ...types]);
  //       setLocationOptions(['全部', ...locs]);
  //     } catch (err) {
  //       console.error('載入篩選選項失敗', err);
  //     }
  //   }
  //   loadFilterOptions();
  // }, []);

  // 依篩選條件與頁碼撈團列表
  useEffect(() => {
    async function fetchGroups() {
      try {
        const q = new URLSearchParams({
          type: filters.type,
          date: filters.date,
          location: filters.location,
          keyword: filters.keyword,
          page: String(page),
        }).toString();

        const res = await fetch(`${API_BASE}/api/group?${q}`);

        const data = await res.json();
        // console.log(data.group)
        setGroups(data || []);
        setTotalPages(data.totalPages || 1);
      } catch (err) {
        console.error('Fetch groups failed:', err);
      }
    }
    fetchGroups();
  }, [filters, page]);

  // 加入揪團（示意）
  const handleJoin = (id) => {
    console.log('加入揪團', id);
  };

  return (
    <>
      <title>Daiski 揪團總覽</title>
      <style
        dangerouslySetInnerHTML={{
          __html: `
            @keyframes marquee { 0% { transform: translateX(100%); } 100% { transform: translateX(-100%); } }
            .animate-marquee { animation: marquee 20s linear infinite; }
            .pause:hover { animation-play-state: paused; }
          `,
        }}
      />
      {/* 跑馬燈 */}
      <section className="bg-sky-100 py-3">
        <div className="relative overflow-hidden max-w-screen-xl mx-auto">
          <div className="whitespace-nowrap animate-marquee pause text-sky-800 text-base font-medium flex items-center gap-4">
            <span>🏂 現正招募中：北海道出國團</span>
            <span>⛷️ 苗場初學教學團</span>
            <span>🎿 富良野自由行！</span>
            <span>📅 官方協助排課中</span>
          </div>
        </div>
      </section>
      {/* Hero Banner */}
      <section
        className="relative bg-cover bg-[center_80%] bg-no-repeat py-36 text-center"
        style={{
          backgroundImage: "url('/26852e04-a393-422d-bd61-8042373024da.png')",
        }}
      >
        <div className="absolute inset-0 bg-slate-800/30 backdrop-blur-[0.5px]" />
        <div className="relative max-w-3xl mx-auto px-7 py-14 bg-white/80 backdrop-blur-md shadow-2xl">
          <h2 className="text-5xl font-extrabold text-[#003049] mb-6 tracking-wider leading-snug">
            找人開團滑雪，一起嗨翻雪場！
          </h2>
          <p className="text-lg text-gray-700 leading-relaxed mb-8">
            不論是自由行或是想體驗教學，歡迎發起屬於你的行程，官方協助安排課程與教練，讓旅程更加完美！
          </p>
          <div className="flex justify-center gap-6">
            <Button
              onClick={() => router.push('/groups/create')}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow transition transform hover:scale-105"
            >
              立即開團
            </Button>
            <Button
              variant="outline"
              onClick={() => router.push('/group')}
              className="px-6 py-2 border border-blue-600 text-blue-600 hover:bg-blue-50 font-semibold transition transform hover:scale-105"
            >
              查看開團
            </Button>
          </div>
        </div>
      </section>

      {/* 篩選列 */}
      <section className="max-w-screen-xl mx-auto px-6 py-8">
        <form className="grid grid-cols-1 md:grid-cols-5 gap-6 bg-white p-6 shadow-md rounded-lg">
          {/* 類型 */}
          <div>
            <Label>類型</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-between">
                  {filters.type} <span>▾</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent side="bottom" align="start" className="w-44">
                <div className="flex flex-col space-y-2">
                  {typeOptions.map((opt) => (
                    <Button
                      key={opt}
                      variant={filters.type === opt ? 'secondary' : 'ghost'}
                      onClick={() => setFilters((f) => ({ ...f, type: opt }))}
                    >
                      {opt}
                    </Button>
                  ))}
                </div>
              </PopoverContent>
            </Popover>
          </div>

          {/* 日期 */}
          <div>
            <Label>日期</Label>
            <Input
              type="date"
              value={filters.date}
              onChange={(e) =>
                setFilters((f) => ({ ...f, date: e.target.value }))
              }
            />
          </div>

          {/* 地點 */}
          <div>
            <Label>地點</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-between">
                  {filters.location} <span>▾</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent side="bottom" align="start" className="w-44">
                <div className="flex flex-col space-y-2">
                  {locationOptions.map((opt) => (
                    <Button
                      key={opt}
                      variant={filters.location === opt ? 'secondary' : 'ghost'}
                      onClick={() =>
                        setFilters((f) => ({ ...f, location: opt }))
                      }
                    >
                      {opt}
                    </Button>
                  ))}
                </div>
              </PopoverContent>
            </Popover>
          </div>

          {/* 關鍵字 */}
          <div className="md:col-span-2">
            <Label>關鍵字搜尋</Label>
            <Input
              placeholder="輸入關鍵字..."
              value={filters.keyword}
              onChange={(e) =>
                setFilters((f) => ({ ...f, keyword: e.target.value }))
              }
            />
          </div>
        </form>
      </section>

      {/* 卡片列表 */}
      <section className="max-w-screen-2xl mx-auto px-6 pb-16">
        <div className="flex justify-end mb-4">
          <Button onClick={() => router.push('/groups/create')}>
            立即開團
          </Button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {groups.map((group) => (
            <Card
              key={group.id}
              className="overflow-hidden shadow-lg hover:shadow-2xl transition"
            >
              <Image
                // src={'http://localhost:3005/uploads/123.png'}
                src={
                  group.images[0]?.imageUrl
                    ? `http://localhost:3005${group.images[0].imageUrl}`
                    : ''
                }
                alt={`${group.images[0]?.imageUrl}`}
                width={10}
                height={10}
                className="w-full h-full object-cover transition duration-300 hover:scale-110"
              />

              <CardContent>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {/* <Avatar className="w-8 h-8">
                      <AvatarImage
                        src={group.user.avatar}
                        alt={group.user.name}
                      />
                      <AvatarFallback>{group.user.name[0]}</AvatarFallback>
                    </Avatar> */}
                    <span className="text-sm">開團者：{group.user.name}</span>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {group.status}
                  </Badge>
                </div>
                <h3 className="text-lg font-bold mb-1">{group.title}</h3>
                <p className="text-sm text-gray-600 mb-1">
                  {group.location} ｜{' '}
                  {`${new Date(group.startDate).toLocaleDateString()} ~ ${new Date(group.endDate).toLocaleDateString()}`}
                </p>
                <p className="text-sm text-gray-800 mb-4">
                  {group.currentPeople}/{group.maxPeople} 人
                </p>
                <div className="flex justify-between">
                  <Button
                    variant="link"
                    onClick={() => router.push(`/groups/${group.id}`)}
                  >
                    查看詳情
                  </Button>
                  <Button size="sm" onClick={() => handleJoin(group.id)}>
                    加入揪團
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* 分頁 */}
        <div className="mt-10 flex justify-center">
          <Pagination
            currentpage={page}
            totalpages={totalPages}
            onPageChange={setPage}
          />
        </div>
      </section>
    </>
  );
}
