'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Clock5, MapPin } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import Image from 'next/image';
// import {
//   Carousel,
//   CarouselContent,
//   CarouselItem,
//   CarouselNext,
//   CarouselPrevious,
// } from '@/components/ui/carousel';
// 修正 Leaflet 預設圖標路徑
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});
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
  const variant =
    Array.isArray(course.variants) && course.variants.length
      ? course.variants[0]
      : null;
  // 再安全取 location
  const loc = variant?.location || {};
  const latitude = loc.latitude;
  const longitude = loc.longitude;
  const locName = loc.name || '未提供地點名稱';
  return (
    <>
      <main className=" py-8 bg-gray-100 ">
        <div className="flex max-w-[1080px] mx-auto px-4 py-8 h-auto">
          <article className="flex-1 pr-8"></article>
          {/* 最寬1080 卡片容器 */}
          <div className="w-full max-w-[1080px] rounded-2xl shadow-lg overflow-hidden bg-white">
            {/* hero圖片 */}
            <div className="relative h-1/2 w-full object-cover">
              <Image
                src={
                  course.images
                    ? `http://localhost:3005${course.images[0]}`
                    : ''
                }
                alt=""
                fill
                className="w-full h-full object-cover "
              />
            </div>
            {/* tag */}
            <div className=" px-8 flex flex-wrap gap-2 py-6">
              {course.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 text-white rounded bg-blue-400"
                >
                  {tag}
                </span>
              ))}
            </div>
            {/* 課程名稱 */}
            <div className="px-8 py-4 .space-y-6">
              <h1 className="text-2xl mb-2 font-bold">{course.name}</h1>
            </div>
            {/* 課程基本資訊 */}
            <div className="px-8 py-6 space-y-6">
              <ul>
                {/* 課程日期 */}
                <li>
                  <Clock5 className="inline-block" />
                  {course.period}
                </li>
                {/* 課程地點 */}
                <li>
                  <MapPin className="inline-block" />
                  {course.variants[0]?.location.city}
                  {course.variants[0]?.location.country &&
                    `,${course.variants[0].location.country}`}
                  {course.variants[0]?.location.address &&
                    `,${course.variants[0].location.address}`}
                  {course.variants[0]?.location.name}
                </li>
                <li>{course.variants[0]?.location.name}</li>
              </ul>
              {/* 難易度 */}
              <div className="mb-6">
                <h2 className="text-xl font-semibold">難易度</h2>
                <p>{course.difficulty}</p>
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
            </div>
            {/* 地圖 */}
            <div className="h-64 w-full">
              <MapContainer
                center={[latitude, longitude]}
                zoom={14}
                style={{ height: '100%', width: '100%' }}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution="&copy; OpenStreetMap contributors"
                />
                <Marker position={[latitude, longitude]}>
                  <Popup>{locName}</Popup>
                </Marker>
              </MapContainer>
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
          </div>
        </div>
      </main>
    </>
  );
}
