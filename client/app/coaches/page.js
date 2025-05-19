'use client';

import React, { useEffect, useState } from 'react';
import { PiPersonSimpleSki } from 'react-icons/pi';
import { Funnel, Globe, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
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

  // 套用篩選邏輯
  const [coaches, setCoaches] = useState([]);
  const [filtered, setFiltered] = useState([]);
  // 3. loading & error 顯示
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // 4. 排序／搜尋暫存 keyword
  const [searchKeyword, setSearchKeyword] = useState('');

  useEffect(() => {
    fetch('http://localhost:3005/api/coaches')
      .then(async (res) => {
        if (!res.ok) {
          const text = await res.text();
          throw new Error(`錯誤`);
        }
        return res.json();
      })
      .then((data) => {
        setCoaches(data);
        setFiltered(data);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);
  //  當 filters 或 coaches 改變，就重新做一次 filter
  useEffect(() => {
    const result = coaches.filter((t) => {
      const matchKeyword = !filters.keyword || t.name.includes(filters.keyword);
      const matchBoard =
        !filters.boardTypes || t.boardTypes.includes(filters.boardType);
      const matchLang =
        !filters.languages || t.languages.includes(filters.language);
      return matchKeyword && matchBoard && matchLang;
    });
    setFiltered(result);
  }, [coaches, filters]);
  console.log(filters);
  //  按下「搜尋」按鈕才把暫存的 keyword 寫入 filters
  const handleSearch = () => {
    setFilters((f) => ({ ...f, keyword: searchKeyword }));
  };

  //  Render
  if (loading) {
    return <p className="text-center p-4">載入中…</p>;
  }
  if (error) {
    return (
      <p className="text-center p-4 text-red-600">讀取資料失敗：{error}</p>
    );
  }
  if (!filtered.length) {
    return <p className="text-center p-4">目前沒有教練資料。</p>;
  }

  return (
    <main className=" bg-white">
      <div className=" mx-auto p-8">
        {/* 篩選列 */}
        <div className="flex items-center justify-center  gap-2 mb-4 relative">
          {/* 語言選單*/}
          <Select
            value={filters.language}
            onValueChange={(val) =>
              setFilters((f) => ({ ...f, language: val }))
            }
          >
            <SelectTrigger className="w-[180px]">
              <Globe />
              <SelectValue placeholder="授課語言" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="中文">中文</SelectItem>
              <SelectItem value="日文">日文</SelectItem>
              <SelectItem value="英文">英文</SelectItem>
              <SelectItem value="韓文">韓文</SelectItem>
              <SelectItem value="粵語">粵語</SelectItem>
            </SelectContent>
          </Select>
          {/* 單雙板 */}
          <Select
            value={filters.boardType}
            onValueChange={(val) =>
              setFilters((f) => ({ ...f, boardType: val }))
            }
          >
            <SelectTrigger className="w-[180px]">
              <PiPersonSimpleSki />
              <SelectValue placeholder="單/雙板" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="單板">單板</SelectItem>
              <SelectItem value="雙板">雙板</SelectItem>
            </SelectContent>
          </Select>

          {/* 關鍵字 */}
          <div className="flex w-100 max-w-sm items-center space-x-2">
            <Input
              type="text"
              placeholder="請輸入關鍵字..."
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
            />
            <Button type="submit" onClick={handleSearch}>
              <Send />
              搜尋
            </Button>
          </div>
        </div>
      </div>

      {/* 教練卡片列表 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mt-8">
        {filtered.map((t) => (
          <div
            key={t.id}
            className="w-75 mx-auto border-2 bordered rounded-2xl p-6 text-center"
          >
            <Image
              src={`http://localhost:3005/${t.profilephoto}`}
              alt={t.name}
              className="w-32 h-32 rounded-full mx-auto object-cover"
              width={150}
              height={150}
            />
            <h2 className="mt-4 text-xl font-semibold flex items-center justify-center">
              <span className="mr-2">{t.name}</span>
            </h2>
            <p className="mt-2 text-gray-700">
              {t.boardtypes.join('、') || '無資料'}
            </p>
            <p className="mt-1 text-gray-700">
              語言：{t.languages || '無資料'}
            </p>
            {/* <p className="mt-1 text-gray-700">{t.intro}</p> */}
            <button className="mt-6 bg-gray-800 text-white text-sm px-6 py-2 rounded-full hover:bg-gray-700 transition">
              查看課程
            </button>
          </div>
        ))}
      </div>
    </main>
  );
}
