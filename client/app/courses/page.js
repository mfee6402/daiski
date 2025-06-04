'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { PiPersonSimpleSki } from 'react-icons/pi';
import { MapPinned } from 'lucide-react';
import { InputWithButton } from './_component/input';
import { DatePickerWithRange } from './_component/datepicker';
import Link from 'next/link';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Snowflake } from 'lucide-react';
import Image from 'next/image';

export default function CoursesPage(props) {
  // 篩選
  const [filters, setFilters] = useState({
    loaction: '',
    difficulty: '',
    keyword: '',
    boardtype: '', // '' | '單板' | '雙板'
  });

  /* -------- 2. 下拉選單的選項 -------- */
  const [options, setOptions] = useState({
    boardTypes: [],
    locations: [],
    difficulties: [],
  });

  const [course, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // useEffect(() => {
  //   fetch('http://localhost:3005/api/courses')
  //     .then(async (res) => {
  //       if (!res.ok) {
  //         const text = await res.text();
  //         throw new Error(`錯誤`);
  //       }
  //       return res.json();
  //     })
  //     .then((data) => {
  //       setCourses(data);
  //     })
  //     .catch((err) => setError(err.message))
  //     .finally(() => setLoading(false));
  // }, []);
  /* === A. 第一次載入先抓「可選條件」 === */
  useEffect(() => {
    fetch('http://localhost:3005/api/courses/filters')
      .then((res) => res.json())
      .then(setOptions)
      .catch(() => setError('載入篩選清單失敗'));
  }, []);

  useEffect(() => {
    setLoading(true);

    const params = new URLSearchParams(
      Object.entries(filters).filter((_, v) => v) // 去掉空值
    );

    fetch(`http://localhost:3005/api/courses?{params.toString()}`)
      .then((res) => res.json())
      .then(setCourses)
      .catch(() => setError('載入課程失敗'))
      .finally(() => setLoading(false));
  }, [filters]);
  /* -------- 4. 寫回 filters 的通用函式 -------- */
  const handle = (field) => (value) =>
    setFilters((p) => ({ ...p, [field]: value }));

  const handleSearch = useCallback(
    (kw) => setFilters((p) => ({ ...p, keyword: kw })),
    []
  );

  if (loading) {
    return <p className="text-center p-8">載入中…</p>;
  }
  if (error) {
    return <p className="text-center p-8 text-red-600">發生錯誤：{error}</p>;
  }

  return (
    <main className="bg-white ">
      {/* 篩選列 */}
      <div className=" mx-auto p-8">
        <div className="flex items-center justify-center  gap-2 mb-4 relative">
          <div className="flex flex-wrap items-center gap-4">
            {/* 板型（動態產生） */}
            <Select onValueChange={handle('boardtype')}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="單 / 雙板" />
              </SelectTrigger>
              <SelectContent>
                {options.boardTypes.map((b) => (
                  <SelectItem key={b} value={b}>
                    {b}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* 雪場（動態產生） */}
            <Select onValueChange={handle('location')}>
              <SelectTrigger className="w-[180px]">
                <MapPinned className="mr-1" />
                <SelectValue placeholder="雪場" />
              </SelectTrigger>
              <SelectContent>
                {options.locations.map((l) => (
                  <SelectItem key={l} value={l}>
                    {l}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* 難度（動態產生） */}
            <Select onValueChange={handle('difficulty')}>
              <SelectTrigger className="w-[180px]">
                <Snowflake className="mr-1" />
                <SelectValue placeholder="難度" />
              </SelectTrigger>
              <SelectContent>
                {options.difficulties.map((d) => (
                  <SelectItem key={d} value={d}>
                    {d}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <DatePickerWithRange />
            {/* 關鍵字 */}
            <div className="flex w-100 max-w-sm items-center space-x-2">
              <InputWithButton onSearch={handleSearch} />
            </div>
          </div>
        </div>
      </div>
      {/* 課程卡片 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mt-8">
        {course.map((c) => (
          <div
            key={c.id}
            className="max-w-xs max-auto rounded-xl shadow-md overflow-hidden border"
          >
            <Link href={`/courses/${c.id}`}>
              <Image
                src={`http://localhost:3005/${c.photo}`}
                alt={c.name}
                width={400}
                height={250}
                className="w-full h-48 object-cover hover:scale-[1.02] transition"
              />
            </Link>

            <div className="p-4">
              <Link href={`/courses/${c.id}`}>
                <h3 className="">{c.name}</h3>
              </Link>
              <p className="text-sm text-gray-500">{c.location}</p>
              <p className="text-sm text-gray-500 mt-1">{c.period}</p>

              <p className="text-sm  mt-2 mb-2">
                售價
                <span className="text-red-500">
                  {' '}
                  $NT {(+c.price).toLocaleString()}{' '}
                </span>
                起
              </p>
              <hr />
              {/* 點按鈕也能進入詳細頁 */}
              <Link href={`/courses/${c.id}`}>
                <button className="mt-4 w-full bg-gray-800 text-white text-sm py-2 rounded-full hover:bg-gray-700 trsndition">
                  查看課程
                </button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
