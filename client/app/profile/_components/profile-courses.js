'use client';

import Image from 'next/image';
import Link from 'next/link';
import React, { useState } from 'react';
import useSWR from 'swr';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { HiCalendarDateRange } from 'react-icons/hi2';
import { IoLocationOutline } from 'react-icons/io5';
import { GiArtificialHive } from 'react-icons/gi';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from '@/components/ui/select';

/* ---------- 常數 ---------- */
const COURSES_API = 'http://localhost:3005/api/coaches/me/courses';

/* ---------- 通用 fetcher ---------- */
const fetcher = async (url) => {
  const res = await fetch(url, { credentials: 'include' });
  if (!res.ok) {
    const err = new Error('請求失敗');
    err.status = res.status;
    err.info = await res.text();
    throw err;
  }
  return res.json(); // { asStudent, asCoach }
};

export default function ProfileCourses() {
  /* === 會員狀態 === */
  const { isAuth } = useAuth();

  /* === 篩選狀態 === */
  const [filter, setFilter] = useState('student'); // 'student' | 'coach'

  /* === 取課程資料 === */
  const { data, isLoading, error } = useSWR(
    isAuth ? COURSES_API : null,
    fetcher
  );

  if (!isAuth) return <p className="text-sm">尚未登入</p>;
  if (isLoading) return <p className="text-sm">載入中…</p>;
  if (error)
    return (
      <p className="text-sm text-destructive">讀取失敗（{error.status}）</p>
    );

  /* === 依篩選取資料 === */
  const rawCourses =
    filter === 'student' ? (data?.asStudent ?? []) : (data?.asCoach ?? []);

  /* === 轉成卡片所需欄位 === */
  const courses = rawCourses.map((c) => {
    const [startAt = '', endAt = ''] = (c.date ?? '').split(' ~ ');
    return {
      id: c.id,
      name: c.name,
      startAt,
      endAt,
      image: c.photo,
      location: '', // 後端未提供地點
    };
  });

  /* === 畫面 === */
  return (
    <Card className="w-full">
      {/* ---------- 標頭 ---------- */}
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>
              {filter === 'student' ? '已報名課程' : '我開辦的課程'}
            </CardTitle>
            <CardDescription>共 {courses.length} 筆</CardDescription>
          </div>

          {/* ---------- shadcn Select ---------- */}
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="篩選課程" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="student">參加課程</SelectItem>
              <SelectItem value="coach">開辦課程</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>

      {/* ---------- 清單 ---------- */}
      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {courses.length === 0 && (
          <p className="text-muted-foreground">目前沒有任何課程。</p>
        )}

        {courses.map((c, idx) => (
          <article
            key={`${c.id}-${idx}`} // id 可能重複，加 idx 保證唯一
            className="flex flex-col md:flex-row gap-4 rounded-lg border p-4 min-w-0"
          >
            {/* 圖片 */}
            <Image
              src={
                c.image?.startsWith('http')
                  ? c.image
                  : `http://localhost:3005${c.image}`
              }
              alt={c.name}
              width={20}
              height={20}
              className="w-full md:w-1/2 flex-shrink-0 aspect-[4/3] rounded-md object-cover"
            />

            {/* 文字 */}
            <div className="flex flex-col justify-center gap-3 flex-grow">
              <div className="font-medium flex gap-2 items-center line-clamp-2">
                <GiArtificialHive /> {c.name}
              </div>

              <div className="text-sm text-muted-foreground flex gap-2 items-center">
                <HiCalendarDateRange className="size-4" />
                {c.startAt} ~ {c.endAt}
              </div>

              {c.location && (
                <div className="text-sm flex gap-2 items-center">
                  <IoLocationOutline /> {c.location}
                </div>
              )}
            </div>

            {/* 按鈕：依篩選變換文字 */}
            <Button asChild variant="outline" className="self-end">
              <Link href={`/courses/${c.id}`}>
                {filter === 'coach' ? '編輯' : '查看'}
              </Link>
            </Button>
          </article>
        ))}
      </CardContent>
    </Card>
  );
}
