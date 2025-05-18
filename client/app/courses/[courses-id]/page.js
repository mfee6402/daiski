'use client';

import React, { useState, useEffect } from 'react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
export default function CoursesIdPage(props) {
  return (
    <>
      <div className="max-4-4xl mx-auto p-6">
        {/* <div className="mx-auto p-6"> */}
        {/* 課程主圖 */}
        {/* <img src="" alt="" className="w-full h-64 object-cover" /> */}
        {/* </div> */}
        <Carousel>
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
        </Carousel>
        {/* 課程基本資訊 */}
        <h1 className="text-2xl mb-2 font-bold">
          DAISKI-S3 第三弾 野澤溫泉&東京行
        </h1>
        <p className="text-gray-600">地點:</p>
        <p className="text-gray-600">日期:</p>
        <p className="text-gray-600">時間:</p>
      </div>
      {/* 課程簡介 */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">課程簡介</h2>
        <p className="text-gray-700">
          Lorem ipsum dolor, sit amet consectetur adipisicing elit. Iusto neque
          fugit cupiditate et delectus praesentium quaerat. Asperiores eos
          commodi minima temporibus perspiciatis repudiandae minus, ab corporis
          omnis impedit hic perferendis voluptate consectetur vero labore
          numquam tenetur, illum earum quae eaque?
        </p>
      </div>
      {/* 課程內容 */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">課程內容</h2>
        <ul>
          <li>第一天</li>
          <li>第二天</li>
          <li>第三天</li>
        </ul>
      </div>
      <div className="mt-2">
        <h2 className="text-xl font-semibold mb-2">課程資訊</h2>
      </div>
      <div className="mt-12">
        <h2 className="text-2xl mb-8">教練資訊</h2>
        <div className="flex">
          <div className="max-w-xs mx-auto border-2 border-blue-200 rounded-2xl p-6 text-center">
            <img
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
