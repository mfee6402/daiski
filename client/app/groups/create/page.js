'use client';

import React, { useState, useEffect, useMemo } from 'react';

// Next.js App Router: 存為 app/groups/create/page.js
export default function CreateGroupPage() {
  // 基本資訊狀態
  const [type, setType] = useState('滑雪');
  const [title, setTitle] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [location, setLocation] = useState('');
  const [minParticipants, setMinParticipants] = useState(1);
  const [maxParticipants, setMaxParticipants] = useState(6);
  const [allowBeginners, setAllowBeginners] = useState(false);

  // 封面上傳狀態
  const [coverFile, setCoverFile] = useState(null);
  const [coverPreview, setCoverPreview] = useState('');
  useEffect(() => {
    if (!coverFile) return;
    const url = URL.createObjectURL(coverFile);
    setCoverPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [coverFile]);

  // 活動說明
  const [description, setDescription] = useState('');

  // 即時預覽文字
  const infoText = useMemo(() => {
    const sd = startDate || '??';
    const ed = endDate || '??';
    return `${sd} ~ ${ed} · ${location || '??'} · ${minParticipants}-${maxParticipants}人`;
  }, [startDate, endDate, location, minParticipants, maxParticipants]);

  return (
    <div className="bg-slate-50 text-gray-800">
      <main className="max-w-screen-xl mx-auto px-4 py-6 space-y-6 lg:grid lg:grid-cols-3 lg:gap-8">
        {/* 表單區 */}
        <form
          className="space-y-10 lg:col-span-2"
          onSubmit={(e) => e.preventDefault()}
        >
          {/* 步驟指示 */}
          <ol className="flex items-center gap-4 text-base text-slate-500">
            <li className="flex items-center gap-2 after:flex-1 after:h-px after:bg-slate-300">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-sky-600 text-white">
                1
              </span>
              <span>基本資訊</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-200 text-slate-500">
                2
              </span>
              <span>確認 & 發佈</span>
            </li>
          </ol>

          {/* 基本資訊 */}
          <section className="bg-white p-8 shadow-sm shadow-slate-200 relative">
            <h2 className="relative mb-8 pl-5 text-h6 font-semibold">
              基本資訊
              <span className="absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 bg-gradient-to-b from-sky-500 to-indigo-500"></span>
            </h2>
            <div className="grid gap-6 md:grid-cols-2">
              {/* 活動類型 */}
              <div>
                <label className="mb-1 block text-base font-medium text-slate-700">
                  活動類型
                </label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="w-full border border-slate-300 bg-white px-3 py-2 text-base focus:ring-2 focus:ring-sky-200"
                >
                  <option>滑雪</option>
                  <option>登山</option>
                  <option>露營</option>
                  <option>其他</option>
                </select>
              </div>

              {/* 標題 */}
              <div>
                <label className="mb-1 block text-base font-medium text-slate-700">
                  揪團標題
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="例如：北海道雙板初學團"
                  className="w-full border border-slate-300 bg-white px-3 py-2 text-base focus:ring-2 focus:ring-sky-200"
                />
              </div>

              {/* 開始日期 */}
              <div>
                <label className="mb-1 block text-base font-medium text-slate-700">
                  開始日期
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full border border-slate-300 bg-white px-3 py-2 text-base focus:ring-2 focus:ring-sky-200"
                />
              </div>

              {/* 結束日期 */}
              <div>
                <label className="mb-1 block text-base font-medium text-slate-700">
                  結束日期
                </label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full border border-slate-300 bg-white px-3 py-2 text-base focus:ring-2 focus:ring-sky-200"
                />
              </div>

              {/* 地點 */}
              <div className="md:col-span-2">
                <label className="mb-1 block text-base font-medium text-slate-700">
                  活動地點
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="例如：二世谷滑雪場"
                  className="w-full border border-slate-300 bg-white px-3 py-2 text-base focus:ring-2 focus:ring-sky-200"
                />
              </div>

              {/* 人數 */}
              <div>
                <label className="mb-1 block text-base font-medium text-slate-700">
                  最少人數
                </label>
                <input
                  type="number"
                  min="1"
                  value={minParticipants}
                  onChange={(e) => setMinParticipants(+e.target.value)}
                  className="w-full border border-slate-300 bg-white px-3 py-2 text-base text-right focus:ring-2 focus:ring-sky-200"
                />
              </div>

              <div>
                <label className="mb-1 block text-base font-medium text-slate-700">
                  最多人數
                </label>
                <input
                  type="number"
                  min="1"
                  value={maxParticipants}
                  onChange={(e) => setMaxParticipants(+e.target.value)}
                  className="w-full border border-slate-300 bg-white px-3 py-2 text-base text-right focus:ring-2 focus:ring-sky-200"
                />
              </div>

              {/* 歡迎新手 */}
              <div className="md:col-span-2 flex items-center gap-3">
                <span className="text-base font-medium text-slate-700">
                  歡迎新手參加
                </span>
                <label className="relative inline-flex cursor-pointer items-center">
                  <input
                    type="checkbox"
                    checked={allowBeginners}
                    onChange={(e) => setAllowBeginners(e.target.checked)}
                    className="peer sr-only"
                  />
                  <div className="h-5 w-10 bg-slate-300 transition-colors peer-checked:bg-sky-500"></div>
                  <div className="absolute left-1 top-1 h-3 w-3 bg-white transition-transform peer-checked:translate-x-5"></div>
                </label>
              </div>
            </div>
          </section>

          {/* 封面上傳 */}
          <section className="bg-white p-8 shadow-sm shadow-slate-200">
            <h2 className="relative mb-8 pl-5 text-h6 font-semibold">
              封面圖片上傳
              <span className="absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 bg-gradient-to-b from-sky-500 to-indigo-500"></span>
            </h2>
            <div
              onClick={() => document.getElementById('coverInput').click()}
              className="flex h-52 cursor-pointer flex-col items-center justify-center border-2 border-dashed border-slate-300 bg-sky-50/40 text-slate-400 hover:border-sky-500 transition-colors"
            >
              <p>拖曳或點擊上傳封面</p>
              <input
                id="coverInput"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => setCoverFile(e.target.files[0] || null)}
              />
            </div>
            {coverPreview && (
              <div className="mt-4">
                <img
                  src={coverPreview}
                  alt="封面預覽"
                  className="w-full h-auto object-cover rounded-md"
                />
              </div>
            )}
          </section>
          {/* 活動說明 */}
          <section className="bg-white p-8 shadow-sm shadow-slate-200">
            <h2 className="mb-4 text-lg font-semibold">活動說明</h2>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="請詳細說明行程、費用及注意事項…"
              className="w-full h-40 border border-slate-300 p-2 focus:ring-2 focus:ring-sky-200"
            />
          </section>
          {/* 按鈕 */}
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={() => window.history.back()}
              className="border border-slate-300 px-6 py-2 hover:bg-slate-50"
            >
              放棄
            </button>
            <button
              type="submit"
              className="bg-sky-600 px-6 py-2 text-white hover:bg-sky-700"
            >
              送出
            </button>
          </div>
        </form>

        {/* 預覽區 */}
        <aside className="hidden lg:block">
          <div className="sticky top-24">
            <h3 className="mb-4 text-h6 font-medium text-slate-600">
              即時預覽
            </h3>
            <div className="overflow-hidden bg-white shadow shadow-slate-200">
              <div
                className="h-40 bg-cover bg-center"
                style={{
                  backgroundImage: coverPreview
                    ? `url(${coverPreview})`
                    : 'none',
                }}
              ></div>
              <div className="space-y-2 p-4">
                <h4 className="truncate text-base font-semibold text-slate-700">
                  {title || '(標題預覽)'}
                </h4>
                <p className="text-base text-slate-500">{infoText} | NT$0</p>
              </div>
            </div>
          </div>
        </aside>
      </main>
    </div>
  );
}
