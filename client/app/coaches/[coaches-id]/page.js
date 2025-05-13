'use client';

import React, { useState, useEffect } from 'react';

export default function CoachIdPage(props) {
  return (
    <>
      <main className="mx-auto p-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* 教練照片 */}
          <div className="w-full lg:w-1/3">
            <img
              src=""
              alt=""
              width={500}
              height={600}
              className="rounded-lg object-cover"
            />
          </div>
          {/* 教練資訊 */}
          <div className="flex-1 space-y-6">
            {/* 教練姓名 */}
            <h1 className="text-3xl">教練名字</h1>
            {/* 板類標籤 */}
            <div className="flex flex-wrap gap-2">單板</div>
            {/* 授課語言 */}
            <div className="">
              <h2 className="text-lg mb-1">授課語言</h2>
              <p className="text-gray-700">中文</p>
            </div>
            {/* 個人經歷 */}
            <div className="">
              <h2 className="text-lg mb-1">個人經歷</h2>
              <p className="text-gray-700">
                Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                Quaerat iure corrupti laudantium cupiditate provident, totam
                laboriosam porro dolores adipisci esse dolorem odio minus minima
                cum perspiciatis aut, modi illo velit? Quibusdam perferendis
                incidunt, asperiores et a eaque fugit non. Omnis incidunt
                deleniti alias vero voluptatem quia officia, molestias
                repellendus dolor?
              </p>
            </div>
            {/* 自我介紹 */}
            <div className="">
              <h2 className="text-lg mb-1">自我介紹</h2>
              <p className="text-gray-700">
                Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                Quaerat iure corrupti laudantium cupiditate provident, totam
                laboriosam porro dolores adipisci esse dolorem odio minus minima
                cum perspiciatis aut, modi illo velit? Quibusdam perferendis
                incidunt, asperiores et a eaque fugit non. Omnis incidunt
                deleniti alias vero voluptatem quia officia, molestias
                repellendus dolor?
              </p>
            </div>
            {/* 證照 */}
            <div className="">
              <h2 className="text-lg mb-1">專業證照</h2>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
