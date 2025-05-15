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
              <h2 className="text-lg mb-1 ">授課語言</h2>
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
              <p>加拿大CASI Level 2 Snowboard 單板指導員</p>
              <div className="tags">
                <button className="mt-6 bg-gray-100 text-black text-sm px-6 py-2 rounded-full  transition">
                  初階
                </button>
                <button className="mt-6 bg-gray-100 text-black text-sm px-6 py-2 rounded-full  transition">
                  零經驗
                </button>
                <button className="mt-6 bg-gray-100 text-black text-sm px-6 py-2 rounded-full  transition">
                  兒童(7-10歲)
                </button>
                <button className="mt-6 bg-gray-100 text-black text-sm px-6 py-2 rounded-full  transition">
                  幼兒(4-6歲)
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-12">
          <h2 className="text-2xl mb-6">課程資訊</h2>
          <div className="flex flex-col sm:flex-row items-center bg-white  border border-gray-200 rounded-lg shadow-sm overflow-hidden">
            <div className=" sm:w-1/4 h-40 relative">
              <img
                src="../../public/image_1"
                alt=""
                width={300}
                height={250}
                className="object-cover"
              />
            </div>
            <div className="flex-1 p-4">
              <p className="text-sm text-gray-500">2025/12/22(一)</p>
              <h3>S3 第三彈 班尾高原＆東京五日行</h3>
              <p className="mt-1 text-sm text-gray-600">
                班尾高原全新雪場 搶先曝光
              </p>
            </div>
            <div className="p-4">
              <button className="m-8 px-4 py-2 bg-gray-800 text-white rounded-full hover:bg-gray-700">
                立即報名
              </button>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
