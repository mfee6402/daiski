// app/groups/page.js
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Image from 'next/image';
import Link from 'next/link';

// 從 lucide-react 引入圖示
import { CirclePlus, BadgeCheck, Megaphone } from 'lucide-react';

export default function GroupsPage() {
  const router = useRouter();
  const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:3005';

  const [groupStats, setGroupStats] = useState({
    total: 0,
    ongoing: 0,
    formed: 0,
  });
  const [latestGroups, setLatestGroups] = useState([]);
  const [loadingLatest, setLoadingLatest] = useState(true);

  useEffect(() => {
    async function fetchGroupStats() {
      try {
        const statsRes = await fetch(`${API_BASE}/api/group/summary`);
        if (!statsRes.ok) throw new Error('無法獲取揪團統計數據');
        const statsData = await statsRes.json();
        setGroupStats({
          total: statsData.totalGroups || 0,
          ongoing: statsData.ongoingGroups || 0,
          formed: statsData.formedGroups || 0,
        });
      } catch (err) {
        console.error('載入揪團統計數據失敗:', err);
        setGroupStats({ total: 0, ongoing: 0, formed: 0 });
      }
    }
    async function fetchLatestGroups() {
      try {
        const res = await fetch(`${API_BASE}/api/group/latest`);
        if (!res.ok) throw new Error('無法獲取最新揪團列表');
        const data = await res.json();
        setLatestGroups(data);
      } catch (err) {
        console.error('獲取最新揪團列表失敗:', err);
        setLatestGroups([]);
      } finally {
        setLoadingLatest(false);
      }
    }
    fetchGroupStats();
    fetchLatestGroups();
  }, [API_BASE]);

  return (
    <>
      {/* 跑馬燈 */}
      <section className="bg-secondary-200 dark:bg-slate-800 py-3">
        <div className="relative overflow-hidden max-w-screen-xl mx-auto">
          <div className="whitespace-nowrap animate-marquee pause text-primary-800 dark:text-white text-p-tw font-medium flex items-center gap-4">
            <span>🏂 現正招募中：北海道出國團</span>
            <span>⛷️ 苗場初學教學團</span>
            <span>🎿 富良野自由行！</span>
            <span>📅 官方協助排課中</span>
          </div>
        </div>
      </section>
      {/* Hero Section with Video */}
      <section className="relative pt-36 pb-24 sm:pb-28 md:pb-32 text-center">
        {/* 調整 padding 為統計卡片留空間 */}
        <video
          className="absolute inset-0 w-full h-full object-cover"
          src="/ProductHeroSection.mp4"
          autoPlay
          muted
          loop
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10 max-w-3xl mx-auto px-4">
          <h1 className="text-4xl sm:text-5xl md:text-5xl font-bold text-white">
            找人開團滑雪，一起嗨翻雪場！
          </h1>
          <p className="mt-4 text-lg sm:text-xl text-white/90">
            不論是自由行或是想體驗教學，歡迎發起屬於你的行程，官方協助安排課程與教練，讓旅程更加完美！
          </p>
          <div className="mt-6 flex justify-center gap-4">
            <Button
              onClick={() => router.push('/groups/create')}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              立即開團
            </Button>
            <Button
              variant="outline"
              onClick={() => router.push('/groups/list')}
            >
              查看揪團
            </Button>
          </div>
        </div>
      </section>

      {/* 統計卡片 */}
      <div className="relative -mt-16 z-20 flex justify-center px-4">
        <div className="w-[600px] bg-white dark:bg-transparent backdrop-blur-md shadow-xl rounded-lg p-6 sm:p-8">
          <div className="grid grid-cols-3 divide-x divide-gray-300 dark:divide-slate-700 text-center">
            <div className="px-2 sm:px-3 md:px-4">
              <p className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-blue-600 dark:text-blue-400">
                {groupStats.total}
              </p>
              <p className="text-xs sm:text-sm md:text-base text-slate-600 dark:text-slate-300 mt-1 sm:mt-2">
                總揪團
              </p>
            </div>
            <div className="px-2 sm:px-3 md:px-4">
              <p className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-blue-600 dark:text-blue-400">
                {groupStats.ongoing}
              </p>
              <p className="text-xs sm:text-sm md:text-base text-slate-600 dark:text-slate-300 mt-1 sm:mt-2">
                揪團中
              </p>
            </div>
            <div className="px-2 sm:px-3 md:px-4">
              <p className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-blue-600 dark:text-blue-400">
                {groupStats.formed}
              </p>
              <p className="text-xs sm:text-sm md:text-base text-slate-600 dark:text-slate-300 mt-1 sm:mt-2">
                已成團
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 最新揪團 Section */}
      <section className="bg-transparent dark:bg-transparent py-12 md:py-16 pt-10 sm:pt-12 md:pt-16">
        <div className="max-w-screen-2xl mx-auto px-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8 sm:mb-12 text-slate-800 dark:text-white">
            最新揪團
          </h2>
          {loadingLatest ? (
            <p className="text-center text-slate-500 dark:text-slate-400">
              載入最新揪團中...
            </p>
          ) : latestGroups.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-8">
              {latestGroups.map((group) => (
                <Card
                  key={group.id}
                  className="p-0 overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-lg flex flex-col group bg-white dark:bg-slate-800"
                >
                  <Link href={`/groups/${group.id}`}>
                    <div className="relative w-full h-50">
                      <Image
                        src={
                          group.imageUrl && group.imageUrl.startsWith('/')
                            ? `${API_BASE}${group.imageUrl}`
                            : group.imageUrl || '/deadicon.png'
                        }
                        alt={group.title || '揪團封面'}
                        fill
                        style={{ objectFit: 'cover' }}
                        className="group-hover:scale-105 transition-transform duration-300 rounded-t-lg"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        onError={(e) => {
                          e.currentTarget.src = '/deadicon.png';
                          e.currentTarget.alt = '圖片載入失敗';
                        }}
                      />
                    </div>
                  </Link>
                  <CardContent className="p-4 flex flex-col flex-grow">
                    <p className="text-sm font-medium text-blue-600 dark:text-blue-400 mb-1">
                      {group.type}
                    </p>
                    <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-2">
                      {group.title}
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-2 flex-grow">
                      {group.description}
                    </p>
                    <div className="mt-auto pt-2 border-t border-gray-200 dark:border-slate-700 flex items-center justify-between text-sm text-slate-500 dark:text-slate-400">
                      <span>{group.location}</span>
                      <span>
                        {new Date(group.startDate).toLocaleDateString()}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <p className="text-center text-slate-500 dark:text-slate-400">
              目前沒有最新揪團。
            </p>
          )}
        </div>
      </section>

      {/* Daiski 幫你揪 Section */}
      <section className="py-12 md:py-20 bg-white dark:bg-slate-800">
        <div className="max-w-screen-2xl mx-auto px-6 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold mb-10 sm:mb-14 text-slate-800 dark:text-white">
            Daiski 幫你揪
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
            {/* 特色 1: 免費開團 */}
            <div className="flex flex-col items-center p-6 bg-slate-50 dark:bg-slate-700/50 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="p-3 bg-blue-100 dark:bg-blue-900/50 rounded-full mb-4">
                <CirclePlus
                  className="w-10 h-10 text-blue-600 dark:text-blue-400"
                  strokeWidth={1.5}
                />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-slate-700 dark:text-white">
                免費開團
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                註冊開團完全免費，不收上架費，不限制開團數，輕鬆成為開團主。
              </p>
            </div>
            {/* 特色 2: 快速審核 */}
            <div className="flex flex-col items-center p-6 bg-slate-50 dark:bg-slate-700/50 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="p-3 bg-blue-100 dark:bg-blue-900/50 rounded-full mb-4">
                <BadgeCheck
                  className="w-10 h-10 text-blue-600 dark:text-blue-400"
                  strokeWidth={1.5}
                />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-slate-700 dark:text-white">
                快速審核
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                開團確認上架審核機制，審核快速準確，避免揪團資訊錯誤不到位。
              </p>
            </div>
            {/* 特色 3: 社群曝光 */}
            <div className="flex flex-col items-center p-6 bg-slate-50 dark:bg-slate-700/50 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="p-3 bg-blue-100 dark:bg-blue-900/50 rounded-full mb-4">
                <Megaphone
                  className="w-10 h-10 text-blue-600 dark:text-blue-400"
                  strokeWidth={1.5}
                />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-slate-700 dark:text-white">
                社群曝光
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                開團審核上架後可免費曝光，協助快速找到團員。
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
