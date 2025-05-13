'use client';

import React, { useState } from 'react';
import { Funnel } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function CoachesPage() {
  // 篩選狀態
  const [filters, setFilters] = useState({
    keyword: '',
    boardType: '', // '' | '單板' | '雙板'
    language: '', // '' | '中文' | '日文' | '英文'
  });
  const [showFilter, setShowFilter] = useState();
  // 教練清單：可以後端拿或者寫成 props 傳進來
  const teachers = [
    {
      id: 1,
      name: 'Lily',
      photo: '/lily.jpg',
      boardType: ['單板', '雙板'],
      languages: ['中文', '日文'],
      intro: '多語言教學，教學經驗豐富',
    },
    // ...你其他的老師
  ];

  // 套用篩選邏輯
  const filtered = teachers.filter((t) => {
    const matchKeyword = !filters.keyword || t.name.includes(filters.keyword);
    const matchBoard =
      !filters.boardType || t.boardType.includes(filters.boardType);
    const matchLang =
      !filters.language || t.languages.includes(filters.language);
    return matchKeyword && matchBoard && matchLang;
  });

  return (
    <main className=" bg-white">
      <div className="max-w-[1440px] mx-auto p-8"></div>
      {/* 篩選列 */}
      <div className="flex items-center justify-center  gap-2 mb-4 relative">
        {/* 篩選按鈕 */}
        <Button
          variant="outline"
          id="filter-btn"
          onClick={() => {
            setShowFilter((v) => !v);
          }}
        >
          <Funnel />
          <span>篩選</span>
        </Button>

        <Select>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="授課語言" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="light">中文</SelectItem>
            <SelectItem value="dark">日文</SelectItem>
            <SelectItem value="system">英文</SelectItem>
            <SelectItem value="system">韓文</SelectItem>
            <SelectItem value="system">粵語</SelectItem>
          </SelectContent>
        </Select>

        <Select>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="單/雙板" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="light">單板</SelectItem>
            <SelectItem value="dark">雙板</SelectItem>
          </SelectContent>
        </Select>

        {/* 清除全部 */}
        {/* Chips 列表 */}
        {/* <div className="flex flex-wrap items-center gap-2 mb-6">
          {filters.keyword && (
            <div className="flex items-center bg-gray-800 text-white text-sm px-3 py-1 rounded-full">
              <span>{filters.keyword}</span>
              <button
                onClick={() => setFilters((f) => ({ ...f, keyword: '' }))}
                className="ml-1"
              ></button>
            </div>
          )}
          {filters.boardType && (
            <div className="flex items-center bg-gray-800 text-white text-sm px-3 py-1 rounded-full">
              <span>{filters.boardType}</span>
              <button
                onClick={() => setFilters((f) => ({ ...f, boardType: '' }))}
                className="ml-1"
              ></button>
            </div>
          )}
          {filters.language && (
            <div className="flex items-center bg-gray-800 text-white text-sm px-3 py-1 rounded-full">
              <span>{filters.language}</span>
              <button
                onClick={() => setFilters((f) => ({ ...f, language: '' }))}
                className="ml-1"
              ></button>
            </div>
          )}
        </div> */}
        {/* 關鍵字 */}
        <div className="flex w-100 max-w-sm items-center space-x-2">
          <Input
            type="text"
            placeholder="請輸入關鍵字..."
            value={filters.keyword}
            onChange={(e) =>
              setFilters((f) => ({ ...f, keyword: e.target.value }))
            }
          />
          <Button
            type="submit"
            onClick={(e) => {
              setFilters((f) => ({ ...f, keyword: e.target.value }));
            }}
          >
            搜尋
          </Button>
        </div>

        {/* 板類 */}
        {/* <div className="flex space-x-2">
          {['', '單板', '雙板'].map((type) => (
            <button
              key={type || 'all'}
              onClick={() => setFilters((f) => ({ ...f, boardType: type }))}
              className={`
                px-4 py-2 border rounded-lg transition
                ${
                  filters.boardType === type
                    ? 'bg-blue-500 text-white border-blue-500'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
                }
              `}
            >
              {type === '' ? '全部板類' : type}
            </button>
          ))}
        </div> */}
      </div>

      {/* 教練卡片列表 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mt-8">
        {filtered.map((t) => (
          <div
            key={t.id}
            className="max-w-xs mx-auto border-2 border-blue-200 rounded-2xl p-6 text-center"
          >
            <img
              src={t.photo}
              alt={t.name}
              className="w-32 h-32 rounded-full mx-auto object-cover"
            />
            <h2 className="mt-4 text-xl font-semibold flex items-center justify-center">
              <span className="mr-2">🇹🇼</span>
              {t.name}
            </h2>
            <p className="mt-2 text-gray-700">{t.boardType.join('、')}</p>
            <p className="mt-1 text-gray-700">語言：{t.languages.join('、')}</p>
            <p className="mt-1 text-gray-700">{t.intro}</p>
            <button className="mt-6 bg-gray-800 text-white text-sm px-6 py-2 rounded-full hover:bg-gray-700 transition">
              查看課程
            </button>
          </div>
        ))}
      </div>
    </main>
  );
}
