// group/page.js
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Pagination } from '@/components/ui/pagination';

export default function GroupsPage() {
  const router = useRouter();
  const [groups, setGroups] = useState([]);
  const [filters, setFilters] = useState({
    type: '全部',
    date: '',
    location: '全部',
    keyword: '',
  });
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const typeOptions = ['全部', '出國團', '單日滑'];
  const locationOptions = ['全部', '二世谷', '苗場'];

  useEffect(() => {
    async function fetchGroups() {
      try {
        const res = await fetch(
          `/api/group?type=${filters.type}&date=${filters.date}&location=${filters.location}&keyword=${filters.keyword}&page=${page}`
        );
        const data = await res.json();
        setGroups(data.groups);
        setTotalPages(data.totalPages);
      } catch (error) {
        console.error('Fetch groups failed:', error);
      }
    }
    fetchGroups();
  }, [filters, page]);

  const handleJoin = (id) => {
    console.log('加入揪團', id);
    // TODO: 實作加入行為
  };

  return (
    <>
      {/* Meta 與自訂動畫 */}
      <meta charSet="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
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

      {/* Filter Section */}
      <section className="max-w-screen-xl mx-auto px-6 py-8">
        <form className="grid grid-cols-1 md:grid-cols-5 gap-6 bg-white py-6 px-6 shadow-md">
          <div>
            <Label htmlFor="filter-type">類型</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-between">
                  {filters.type}
                  <span className="ml-2">▾</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent side="bottom" align="start" className="w-[160px]">
                <h4 className="text-sm font-medium mb-2">選擇類型</h4>
                <div className="flex flex-col space-y-2">
                  {typeOptions.map((opt) => (
                    <Button
                      key={opt}
                      variant={filters.type === opt ? 'secondary' : 'ghost'}
                      onClick={() => setFilters({ ...filters, type: opt })}
                    >
                      {opt}
                    </Button>
                  ))}
                </div>
              </PopoverContent>
            </Popover>
          </div>
          <div>
            <Label htmlFor="filter-date">日期</Label>
            <Input
              id="filter-date"
              type="date"
              value={filters.date}
              onChange={(e) => setFilters({ ...filters, date: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="filter-location">地點</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-between">
                  {filters.location}
                  <span className="ml-2">▾</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent side="bottom" align="start" className="w-[160px]">
                <h4 className="text-sm font-medium mb-2">選擇地點</h4>
                <div className="flex flex-col space-y-2">
                  {locationOptions.map((opt) => (
                    <Button
                      key={opt}
                      variant={filters.location === opt ? 'secondary' : 'ghost'}
                      onClick={() => setFilters({ ...filters, location: opt })}
                    >
                      {opt}
                    </Button>
                  ))}
                </div>
              </PopoverContent>
            </Popover>
          </div>
          <div className="md:col-span-2">
            <Label htmlFor="filter-keyword">關鍵字搜尋</Label>
            <Input
              id="filter-keyword"
              placeholder="輸入關鍵字..."
              value={filters.keyword}
              onChange={(e) =>
                setFilters({ ...filters, keyword: e.target.value })
              }
            />
          </div>
        </form>
      </section>

      {/* Card Grid */}
      <section className="max-w-screen-2xl mx-auto px-4 pb-24">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {groups.map((group) => (
            <Card
              key={group.id}
              className="relative overflow-hidden bg-white shadow-lg transition-transform duration-300 hover:-translate-y-2 hover:shadow-2xl"
            >
              <div className="absolute inset-0 -z-10 bg-gradient-to-br from-sky-100 to-white clip-path-[polygon(0_0,100%_5%,100%_95%,0_100%)]" />
              <div
                className="h-52 bg-cover bg-center"
                style={{ backgroundImage: `url('${group.coverImage}')` }}
              />
              <div className="p-4 flex flex-col justify-between h-[calc(100%-208px)]">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Avatar className="w-8 h-8">
                        <AvatarImage
                          src={group.owner.avatar}
                          alt={group.owner.name}
                        />
                        <AvatarFallback>{group.owner.name[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium text-gray-700">
                          開團者：{group.owner.name}
                        </p>
                      </div>
                    </div>
                    <Badge variant="outline" className="text-xs px-2 py-1">
                      {group.status}
                    </Badge>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2 border-l-4 border-blue-600 pl-2">
                    {group.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-1">
                    {group.location}｜{group.dateRange}｜{group.type}
                  </p>
                  <p className="text-sm text-gray-700 mb-1">
                    目前人數：{group.current} / {group.capacity} 人
                  </p>
                  <p className="text-sm font-semibold text-red-500 mb-4">
                    截止報名：{group.deadline}
                  </p>
                </div>
                <div className="flex items-center justify-between">
                  <Button
                    variant="link"
                    onClick={() => router.push(`/group/${group.id}`)}
                  >
                    查看詳情
                  </Button>
                  <Button onClick={() => handleJoin(group.id)}>加入揪團</Button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Pagination */}
        <div className="max-w-screen-xl mx-auto px-4 py-8 flex justify-center">
          <Pagination
            currentpage={page}
            totalpages={totalPages}
            onPageChange={(p) => setPage(p)}
          />
        </div>
      </section>
    </>
  );
}
