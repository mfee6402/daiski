'use client';

import React, { useState, useEffect } from 'react';
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
  const [filters, setFilters] = useState({
    keyword: '',
    boardType: '', // '' | '單板' | '雙板'
    language: '', // '' | '中文' | '日文' | '英文'
  });

  const [course, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('http://localhost:3005/api/courses')
      .then(async (res) => {
        if (!res.ok) {
          const text = await res.text();
          throw new Error(`錯誤`);
        }
        return res.json();
      })
      .then((data) => {
        setCourses(data);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

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
            <Select>
              <SelectTrigger className="w-[180px]"></SelectTrigger>
              <SelectContent>
                <SelectItem value="單板">單板</SelectItem>
                <SelectItem value="雙板">雙板</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger className="w-[180px]">
                <MapPinned />
                <SelectValue placeholder="雪場" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="二世谷">二世谷</SelectItem>
                <SelectItem value="野澤">野澤</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger className="w-[180px]">
                <Snowflake />
                <SelectValue placeholder="難易度" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="初級">初級</SelectItem>
                <SelectItem value="中級">中級</SelectItem>
                <SelectItem value="高級">高級</SelectItem>
              </SelectContent>
            </Select>
            <DatePickerWithRange />
            {/* 關鍵字 */}
            <div className="flex w-100 max-w-sm items-center space-x-2">
              <InputWithButton />
            </div>
            {/* <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"></div> */}
          </div>
        </div>
      </div>
      {/* 課程卡片 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
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
                className="w-full h-48 object-cover"
              />
            </Link>

            <div className="p-4">
              <Link href={`/courses/${c.id}`}>
                <h3 className="">{c.name}</h3>
              </Link>
              <p className="text-sm text-gray-500 mt-1">{c.period}</p>
              <p className="text-sm  mt-2 mb-2">
                售價
                <span className="text-red-500"> $NT {c.price} </span>起
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
