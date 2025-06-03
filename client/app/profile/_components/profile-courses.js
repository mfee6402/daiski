'use client';
import Image from 'next/image';
import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import useSWR from 'swr';
import { Button } from '@/components/ui/button';
import { useCourses } from '@/hooks/use-courses';
import { HiCalendarDateRange } from 'react-icons/hi2';
import { IoLocationOutline } from 'react-icons/io5';
import { GiArtificialHive } from 'react-icons/gi';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export default function ProfileCourses(props) {
  // 讀取會員ＩＤ
  const { user, isAuth, token } = useAuth(); // 依你的 useAuth 實作
  const { data, isLoading, error } = useCourses(isAuth ? user.id : null);
  if (!isAuth) return <p className="text-sm">尚未登入</p>;
  if (isLoading) return <p className="text-sm">載入中…</p>;
  if (error) return <p className="text-sm text-destructive">讀取失敗</p>;

  const courses = data?.courses ?? [];
  console.log(courses);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>已報名課程</CardTitle>
        <CardDescription>共 {courses.length} 筆</CardDescription>
      </CardHeader>

      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {courses.length === 0 && (
          <p className="text-muted-foreground">目前沒有任何報名紀錄。</p>
        )}

        {courses.map((c) => (
          <article
            key={c.id}
            className="flex flex-col md:flex-row gap-4 rounded-lg border p-4 min-w-0"
          >
            {/* 圖片 */}
            <Image
              src={
                c.image.startsWith('http')
                  ? c.image
                  : `http://localhost:3005${c.image}`
              }
              alt={c.name}
              width={20}
              height={20}
              className="w-full md:w-1/2 flex-shrink-0  aspect-[4/3] rounded-md object-cover  "
            />

            {/* 文字資訊 */}
            <div className="flex flex-col justify-center items-start gap-3  ">
              <div className="font-medium flex gap-2 items-center">
                <GiArtificialHive /> {c.name}
              </div>
              <div className="text-sm text-muted-foreground flex gap-2 items-center ">
                <HiCalendarDateRange className="size-4" />
                {c.startAt.slice(0, 10)} ~ {c.endAt.slice(0, 10)}
              </div>
              <div className="text-sm flex gap-2 items-center ">
                <IoLocationOutline /> {c.location}
              </div>
            </div>
            <Button asChild variant="outline" className="self-end">
              <Link href={`/courses/${c.course_variant_id}`}>查看</Link>
            </Button>
          </article>
        ))}
      </CardContent>
    </Card>
  );
}
