'use client';

import React, { useState, useEffect } from 'react';

export default function CoursesPage(props) {
  return (
    <>
      <>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Daiski 揪團總覽</title>
        <style
          dangerouslySetInnerHTML={{
            __html:
              '\n    @keyframes marquee {\n      0% {\n        transform: translateX(100%);\n      }\n\n      100% {\n        transform: translateX(-100%);\n      }\n    }\n\n    .animate-marquee {\n      animation: marquee 20s linear infinite;\n    }\n    .pause:hover {\n    animation-play-state: paused;\n  }\n  ',
          }}
        />
        {/* Hero Banner */}
        <section
          className="relative bg-cover bg-[center_80%] bg-no-repeat py-36 text-center"
          style={{
            backgroundImage:
              'url("./26852e04-a393-422d-bd61-8042373024da.png")',
          }}
        >
          <div className="absolute inset-0 bg-slate-800/30 backdrop-blur-[0.5px]" />
          <div className="relative z-10 max-w-3xl mx-auto px-7 py-14 bg-white/80 backdrop-blur-md shadow-2xl">
            <h2 className="text-5xl font-extrabold text-[#003049] mb-6 tracking-wider leading-snug">
              找人開團滑雪，一起嗨翻雪場！
            </h2>
            <p className="text-lg text-gray-700 leading-relaxed mb-8">
              不論是自由行或是想體驗教學，歡迎發起屬於你的行程，官方協助安排課程與教練，讓旅程更加完美！
            </p>
            <div className="flex justify-center gap-6">
              <a
                href="./group-detail.html"
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow transition transform hover:scale-105"
              >
                立即開團
              </a>
              <a
                href="#"
                className="px-6 py-2 border border-blue-600 text-blue-600 hover:bg-blue-50 font-semibold transition transform hover:scale-105"
              >
                查看開團
              </a>
            </div>
          </div>
        </section>
        {/* 跑馬燈 */}
        <section className="bg-sky-100 py-3">
          <div className="relative overflow-hidden max-w-screen-xl mx-auto">
            <div className="whitespace-nowrap animate-marquee pause text-sky-800 text-base font-medium flex items-center gap-4">
              <span>🏂 現正招募中：北海道出國團</span>
              <span>⛷️ 苗場初學教學團</span>
              <span>🎿 富良野自由行！</span>
              <span>📅 官方協助排課中</span>
            </div>
          </div>
        </section>
        {/* Filter Section */}
        <section className="max-w-screen-xl mx-auto px-6 py-8">
          <form className="grid grid-cols-1 md:grid-cols-5 gap-6 bg-white py-6 px-6 shadow-md">
            <div>
              <label className="block text-sm font-medium mb-2">類型</label>
              <select className="border px-3 py-2 w-full">
                <option>全部</option>
                <option>出國團</option>
                <option>單日滑</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">日期</label>
              <input type="date" className="border px-3 py-2 w-full" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">地點</label>
              <select className="border px-3 py-2 w-full">
                <option>全部</option>
                <option>二世谷</option>
                <option>苗場</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-2">
                關鍵字搜尋
              </label>
              <input
                type="text"
                placeholder="輸入關鍵字..."
                className="border px-3 py-2 w-full"
              />
            </div>
          </form>
        </section>
        {/* Card Grid */}
        <section className="max-w-screen-2xl mx-auto px-4 pb-24">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Card 範例 Start */}
            <div className="relative overflow-hidden bg-white shadow-lg transition-transform duration-300 hover:-translate-y-2 hover:shadow-2xl">
              {/* 斜邊漸層底色 */}
              <div className="absolute inset-0 -z-10 bg-gradient-to-br from-sky-100 to-white clip-path-[polygon(0_0,100%_5%,100%_95%,0_100%)]"></div>
              {/* 圖片區塊 */}
              <div
                className="h-52 bg-cover bg-center"
                style={{ backgroundImage: 'url("./image_1.jpg")' }}
              />
              {/* 內容 */}
              <div className="p-4 flex flex-col justify-between h-[calc(100%-208px)]">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <img
                        src="https://i.pravatar.cc/40?u=123"
                        alt="開團者"
                        className="w-8 h-8 rounded-full"
                      />
                      <div>
                        <p className="text-sm font-medium text-gray-700">
                          開團者：小雪人
                        </p>
                      </div>
                    </div>
                    <span className="border border-blue-600 text-blue-600 text-xs font-semibold px-2 py-1">
                      官方協助中
                    </span>
                  </div>
                  {/* 標題加左側彩色線 */}
                  <h3 className="text-lg font-bold text-gray-900 mb-2 border-l-4 border-blue-600 pl-2">
                    北海道雙板揪團出發！
                  </h3>
                  <p className="text-sm text-gray-600 mb-1">
                    二世谷｜2025/01/18 - 01/22｜出國團
                  </p>
                  <p className="text-sm text-gray-700 mb-1">
                    目前人數：5 / 8 人
                  </p>
                  <p className="text-sm font-semibold text-red-500 mb-4">
                    截止報名：2025/01/10
                  </p>
                </div>
                {/* 行動按鈕 */}
                <div className="flex items-center justify-between">
                  <a
                    href="#"
                    className="text-blue-600 text-sm underline hover:text-blue-800"
                  >
                    查看詳情
                  </a>
                  <button className="px-4 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition-transform duration-200 hover:scale-105">
                    加入揪團
                  </button>
                </div>
              </div>
            </div>
            {/* Card 範例 End */}
            <div className="relative overflow-hidden bg-white shadow-lg transition-transform duration-300 hover:-translate-y-2 hover:shadow-2xl">
              {/* 斜邊漸層底色 */}
              <div className="absolute inset-0 -z-10 bg-gradient-to-br from-sky-100 to-white clip-path-[polygon(0_0,100%_5%,100%_95%,0_100%)]"></div>
              {/* 圖片區塊 */}
              <div
                className="h-52 bg-cover bg-center"
                style={{ backgroundImage: 'url("./image_1.jpg")' }}
              />
              {/* 內容 */}
              <div className="p-4 flex flex-col justify-between h-[calc(100%-208px)]">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <img
                        src="https://i.pravatar.cc/40?u=123"
                        alt="開團者"
                        className="w-8 h-8 rounded-full"
                      />
                      <div>
                        <p className="text-sm font-medium text-gray-700">
                          開團者：小雪人
                        </p>
                      </div>
                    </div>
                    <span className="border border-blue-600 text-blue-600 text-xs font-semibold px-2 py-1">
                      官方協助中
                    </span>
                  </div>
                  {/* 標題加左側彩色線 */}
                  <h3 className="text-lg font-bold text-gray-900 mb-2 border-l-4 border-blue-600 pl-2">
                    北海道雙板揪團出發！
                  </h3>
                  <p className="text-sm text-gray-600 mb-1">
                    二世谷｜2025/01/18 - 01/22｜出國團
                  </p>
                  <p className="text-sm text-gray-700 mb-1">
                    目前人數：5 / 8 人
                  </p>
                  <p className="text-sm font-semibold text-red-500 mb-4">
                    截止報名：2025/01/10
                  </p>
                </div>
                {/* 行動按鈕 */}
                <div className="flex items-center justify-between">
                  <a
                    href="#"
                    className="text-blue-600 text-sm underline hover:text-blue-800"
                  >
                    查看詳情
                  </a>
                  <button className="px-4 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition-transform duration-200 hover:scale-105">
                    加入揪團
                  </button>
                </div>
              </div>
            </div>
            <div className="relative overflow-hidden bg-white shadow-lg transition-transform duration-300 hover:-translate-y-2 hover:shadow-2xl">
              {/* 斜邊漸層底色 */}
              <div className="absolute inset-0 -z-10 bg-gradient-to-br from-sky-100 to-white clip-path-[polygon(0_0,100%_5%,100%_95%,0_100%)]"></div>
              {/* 圖片區塊 */}
              <div
                className="h-52 bg-cover bg-center"
                style={{ backgroundImage: 'url("./image_1.jpg")' }}
              />
              {/* 內容 */}
              <div className="p-4 flex flex-col justify-between h-[calc(100%-208px)]">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <img
                        src="https://i.pravatar.cc/40?u=123"
                        alt="開團者"
                        className="w-8 h-8 rounded-full"
                      />
                      <div>
                        <p className="text-sm font-medium text-gray-700">
                          開團者：小雪人
                        </p>
                      </div>
                    </div>
                    <span className="border border-blue-600 text-blue-600 text-xs font-semibold px-2 py-1">
                      官方協助中
                    </span>
                  </div>
                  {/* 標題加左側彩色線 */}
                  <h3 className="text-lg font-bold text-gray-900 mb-2 border-l-4 border-blue-600 pl-2">
                    北海道雙板揪團出發！
                  </h3>
                  <p className="text-sm text-gray-600 mb-1">
                    二世谷｜2025/01/18 - 01/22｜出國團
                  </p>
                  <p className="text-sm text-gray-700 mb-1">
                    目前人數：5 / 8 人
                  </p>
                  <p className="text-sm font-semibold text-red-500 mb-4">
                    截止報名：2025/01/10
                  </p>
                </div>
                {/* 行動按鈕 */}
                <div className="flex items-center justify-between">
                  <a
                    href="#"
                    className="text-blue-600 text-sm underline hover:text-blue-800"
                  >
                    查看詳情
                  </a>
                  <button className="px-4 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition-transform duration-200 hover:scale-105">
                    加入揪團
                  </button>
                </div>
              </div>
            </div>
            <div className="relative overflow-hidden bg-white shadow-lg transition-transform duration-300 hover:-translate-y-2 hover:shadow-2xl">
              {/* 斜邊漸層底色 */}
              <div className="absolute inset-0 -z-10 bg-gradient-to-br from-sky-100 to-white clip-path-[polygon(0_0,100%_5%,100%_95%,0_100%)]"></div>
              {/* 圖片區塊 */}
              <div
                className="h-52 bg-cover bg-center"
                style={{ backgroundImage: 'url("./image_1.jpg")' }}
              />
              {/* 內容 */}
              <div className="p-4 flex flex-col justify-between h-[calc(100%-208px)]">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <img
                        src="https://i.pravatar.cc/40?u=123"
                        alt="開團者"
                        className="w-8 h-8 rounded-full"
                      />
                      <div>
                        <p className="text-sm font-medium text-gray-700">
                          開團者：小雪人
                        </p>
                      </div>
                    </div>
                    <span className="border border-blue-600 text-blue-600 text-xs font-semibold px-2 py-1">
                      官方協助中
                    </span>
                  </div>
                  {/* 標題加左側彩色線 */}
                  <h3 className="text-lg font-bold text-gray-900 mb-2 border-l-4 border-blue-600 pl-2">
                    北海道雙板揪團出發！
                  </h3>
                  <p className="text-sm text-gray-600 mb-1">
                    二世谷｜2025/01/18 - 01/22｜出國團
                  </p>
                  <p className="text-sm text-gray-700 mb-1">
                    目前人數：5 / 8 人
                  </p>
                  <p className="text-sm font-semibold text-red-500 mb-4">
                    截止報名：2025/01/10
                  </p>
                </div>
                {/* 行動按鈕 */}
                <div className="flex items-center justify-between">
                  <a
                    href="#"
                    className="text-blue-600 text-sm underline hover:text-blue-800"
                  >
                    查看詳情
                  </a>
                  <button className="px-4 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition-transform duration-200 hover:scale-105">
                    加入揪團
                  </button>
                </div>
              </div>
            </div>
            <div className="relative overflow-hidden bg-white shadow-lg transition-transform duration-300 hover:-translate-y-2 hover:shadow-2xl">
              {/* 斜邊漸層底色 */}
              <div className="absolute inset-0 -z-10 bg-gradient-to-br from-sky-100 to-white clip-path-[polygon(0_0,100%_5%,100%_95%,0_100%)]"></div>
              {/* 圖片區塊 */}
              <div
                className="h-52 bg-cover bg-center"
                style={{ backgroundImage: 'url("./image_1.jpg")' }}
              />
              {/* 內容 */}
              <div className="p-4 flex flex-col justify-between h-[calc(100%-208px)]">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <img
                        src="https://i.pravatar.cc/40?u=123"
                        alt="開團者"
                        className="w-8 h-8 rounded-full"
                      />
                      <div>
                        <p className="text-sm font-medium text-gray-700">
                          開團者：小雪人
                        </p>
                      </div>
                    </div>
                    <span className="border border-blue-600 text-blue-600 text-xs font-semibold px-2 py-1">
                      官方協助中
                    </span>
                  </div>
                  {/* 標題加左側彩色線 */}
                  <h3 className="text-lg font-bold text-gray-900 mb-2 border-l-4 border-blue-600 pl-2">
                    北海道雙板揪團出發！
                  </h3>
                  <p className="text-sm text-gray-600 mb-1">
                    二世谷｜2025/01/18 - 01/22｜出國團
                  </p>
                  <p className="text-sm text-gray-700 mb-1">
                    目前人數：5 / 8 人
                  </p>
                  <p className="text-sm font-semibold text-red-500 mb-4">
                    截止報名：2025/01/10
                  </p>
                </div>
                {/* 行動按鈕 */}
                <div className="flex items-center justify-between">
                  <a
                    href="#"
                    className="text-blue-600 text-sm underline hover:text-blue-800"
                  >
                    查看詳情
                  </a>
                  <button className="px-4 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition-transform duration-200 hover:scale-105">
                    加入揪團
                  </button>
                </div>
              </div>
            </div>
            <div className="relative overflow-hidden bg-white shadow-lg transition-transform duration-300 hover:-translate-y-2 hover:shadow-2xl">
              {/* 斜邊漸層底色 */}
              <div className="absolute inset-0 -z-10 bg-gradient-to-br from-sky-100 to-white clip-path-[polygon(0_0,100%_5%,100%_95%,0_100%)]"></div>
              {/* 圖片區塊 */}
              <div
                className="h-52 bg-cover bg-center"
                style={{ backgroundImage: 'url("./image_1.jpg")' }}
              />
              {/* 內容 */}
              <div className="p-4 flex flex-col justify-between h-[calc(100%-208px)]">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <img
                        src="https://i.pravatar.cc/40?u=123"
                        alt="開團者"
                        className="w-8 h-8 rounded-full"
                      />
                      <div>
                        <p className="text-sm font-medium text-gray-700">
                          開團者：小雪人
                        </p>
                      </div>
                    </div>
                    <span className="border border-blue-600 text-blue-600 text-xs font-semibold px-2 py-1">
                      官方協助中
                    </span>
                  </div>
                  {/* 標題加左側彩色線 */}
                  <h3 className="text-lg font-bold text-gray-900 mb-2 border-l-4 border-blue-600 pl-2">
                    北海道雙板揪團出發！
                  </h3>
                  <p className="text-sm text-gray-600 mb-1">
                    二世谷｜2025/01/18 - 01/22｜出國團
                  </p>
                  <p className="text-sm text-gray-700 mb-1">
                    目前人數：5 / 8 人
                  </p>
                  <p className="text-sm font-semibold text-red-500 mb-4">
                    截止報名：2025/01/10
                  </p>
                </div>
                {/* 行動按鈕 */}
                <div className="flex items-center justify-between">
                  <a
                    href="#"
                    className="text-blue-600 text-sm underline hover:text-blue-800"
                  >
                    查看詳情
                  </a>
                  <button className="px-4 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition-transform duration-200 hover:scale-105">
                    加入揪團
                  </button>
                </div>
              </div>
            </div>
            <div className="relative overflow-hidden bg-white shadow-lg transition-transform duration-300 hover:-translate-y-2 hover:shadow-2xl">
              {/* 斜邊漸層底色 */}
              <div className="absolute inset-0 -z-10 bg-gradient-to-br from-sky-100 to-white clip-path-[polygon(0_0,100%_5%,100%_95%,0_100%)]"></div>
              {/* 圖片區塊 */}
              <div
                className="h-52 bg-cover bg-center"
                style={{ backgroundImage: 'url("./image_1.jpg")' }}
              />
              {/* 內容 */}
              <div className="p-4 flex flex-col justify-between h-[calc(100%-208px)]">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <img
                        src="https://i.pravatar.cc/40?u=123"
                        alt="開團者"
                        className="w-8 h-8 rounded-full"
                      />
                      <div>
                        <p className="text-sm font-medium text-gray-700">
                          開團者：小雪人
                        </p>
                      </div>
                    </div>
                    <span className="border border-blue-600 text-blue-600 text-xs font-semibold px-2 py-1">
                      官方協助中
                    </span>
                  </div>
                  {/* 標題加左側彩色線 */}
                  <h3 className="text-lg font-bold text-gray-900 mb-2 border-l-4 border-blue-600 pl-2">
                    北海道雙板揪團出發！
                  </h3>
                  <p className="text-sm text-gray-600 mb-1">
                    二世谷｜2025/01/18 - 01/22｜出國團
                  </p>
                  <p className="text-sm text-gray-700 mb-1">
                    目前人數：5 / 8 人
                  </p>
                  <p className="text-sm font-semibold text-red-500 mb-4">
                    截止報名：2025/01/10
                  </p>
                </div>
                {/* 行動按鈕 */}
                <div className="flex items-center justify-between">
                  <a
                    href="#"
                    className="text-blue-600 text-sm underline hover:text-blue-800"
                  >
                    查看詳情
                  </a>
                  <button className="px-4 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition-transform duration-200 hover:scale-105">
                    加入揪團
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* Pagination */}
        <div className="max-w-screen-xl mx-auto px-4 py-8 flex justify-center">
          <nav className="flex items-center space-x-4 text-sm">
            <button className="px-2 py-1 text-gray-600 hover:text-gray-800">
              &lt;
            </button>
            <button className="px-2 py-1 border-b-2 border-pink-500 text-gray-800">
              1
            </button>
            <button className="px-2 py-1 text-gray-600 hover:border-b-2 hover:border-pink-500">
              2
            </button>
            <button className="px-2 py-1 text-gray-600 hover:border-b-2 hover:border-pink-500">
              3
            </button>
            <button className="px-2 py-1 text-gray-600 hover:border-b-2 hover:border-pink-500">
              4
            </button>
            <button className="px-2 py-1 text-gray-600 hover:text-gray-800">
              &gt;
            </button>
          </nav>
        </div>
      </>
    </>
  );
}
