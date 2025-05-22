'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
// import {
//   Carousel,
//   CarouselContent,
//   CarouselItem,
//   CarouselNext,
//   CarouselPrevious,
// } from '@/components/ui/carousel';

export default function CoursesIdPage() {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;
    fetch(`http://localhost:3005/api/courses/${id}`)
      .then(async (res) => {
        if (!res.ok) {
          const txt = await res.text();
          throw new Error(`${res.status}: ${txt}`);
        }
        return res.json();
      })
      .then((data) => setCourse(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <p className="p-8 text-center">載入中…</p>;
  if (error)
    return <p className="p-8 text-center text-red-600">錯誤：{error}</p>;
  if (!course) return <p className="p-8 text-center">找不到課程資料。</p>;
  return (
    <>
      <div className="max-4-4xl mx-auto p-6">
        {/* <div className="mx-auto p-6"> 
        {/* 課程主圖 */}
        <Image
          src={course.images ? `http://localhost:3005${course.images[0]}` : ''}
          alt=""
          width={1920}
          height={500}
          className="w-full h-64 object-cover"
        />
        {/* </div> */}
        {/* <Carousel>
          <CarouselContent>
            <CarouselItem>
              <img src="" alt="" className="w-full h-100" />
            </CarouselItem>
            <CarouselItem>
              <img src="" alt="" className="w-full h-100" />
            </CarouselItem>
            <CarouselItem>
              <img src="" alt="" className="w-full h-100" />
            </CarouselItem>
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel> */}
        {/* 課程基本資訊 */}
        <h1 className="text-2xl mb-2 font-bold">{course.name}</h1>
        <p className="text-gray-600">地點:</p>
        <p className="text-gray-600">日期:</p>
        <p className="text-gray-600">時間:</p>
      </div>
      {/* 課程簡介 */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">課程簡介</h2>
        <p className="text-gray-700">{course.description}</p>
      </div>
      {/* 課程內容 */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">課程內容</h2>
        <p className="text-gray-700">{course.content}</p>
      </div>

      <div className="mt-12">
        <h2 className="text-2xl mb-8">教練資訊</h2>
        <div className="flex">
          <div className="max-w-xs mx-auto border-2 border-blue-200 rounded-2xl p-6 text-center">
            <Image
              src=""
              alt=""
              className="w-32 h-32 rounded-full mx-auto object-cover"
            />
            <h2 className="mt-4 text-xl font-semibold flex items-center justify-center">
              <span className="mr-2"></span>
            </h2>
            <p className="mt-2 text-gray-700"></p>
            <p className="mt-1 text-gray-700">語言：</p>
            <p className="mt-1 text-gray-700"></p>
            <button className="mt-6 bg-gray-800 text-white text-sm px-6 py-2 rounded-full hover:bg-gray-700 transition">
              查看課程
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
