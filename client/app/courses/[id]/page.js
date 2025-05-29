'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Clock5, MapPin } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
// import L from 'leaflet';
// import 'leaflet/dist/leaflet.css';
import Image from 'next/image';
import { memo, useMemo } from 'react';
import Container from '@/components/container';
import Link from 'next/link';
// 修正 Leaflet 預設圖標路徑
// if (typeof window !== 'undefined') {
//   delete L.Icon.Default.prototype._getIconUrl;
//   L.Icon.Default.mergeOptions({
//     iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
//     iconUrl: require('leaflet/dist/images/marker-icon.png'),
//     shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
//   });
// }
// function CourseMap({ latitude, longitude, locName }) {
//   const lat = Number(latitude) || 25.033;
//   const lng = Number(longitude) || 121.5654;
//   const center = useMemo(() => [lat, lng], [lat, lng]);
// }

export default function CoursesIdPage() {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // const variant = course.variants?.[0];
  // const coach = variant?.coach;
  const coaches = () => {
    if (!Array.isArray(course.variants)) return [];
    const map = new Map();
    course.variants.forEach((v) => {
      if (v.coach) map.set(v.coach.id, v.coach); // v.coach = { id, name, photo }
    });
    return [...map.values()];
  };

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
  const variant = coaches.length ? course.variants[0] : null;
  // Array.isArray(course.variants) && course.variants.length
  //   ? course.variants[0]
  //   : null;
  // 再安全取 location
  // const loc = variant?.location || {};
  // const latitude = loc.latitude;
  // const longitude = loc.longitude;
  // const locName = loc.name || '未提供地點名稱';

  return (
    <>
      <main className=" py-8 bg-gray-100  min-h-screen">
        {/* 主卡片 */}
        <Container>
          <div className="bg-white grid md:grid-cols-[3fr_1fr] gap-8 rounded-2xl shadow-lg mb-8 ">
            {/* hero圖片 */}
            <div className="relative md:col-span-2 ">
              <Image
                src={
                  course.images
                    ? `http://localhost:3005${course.images[0]}`
                    : ''
                }
                alt="{course.name}"
                width={1080}
                height={360}
                className="w-full h-64 object-cover  rounded-t-lg overflow-hidden "
              />

              {/* 標籤 */}
              <div className="absolute left-0 px-8 flex flex-wrap gap-2 py-6">
                {course.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 text-white rounded bg-blue-400"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* 課程名稱 */}
            <div className="p-6 space-y-8">
              <h1 className="text-2xl mb-2 font-bold">{course.name}</h1>
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
              <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-6 w-[60%] ml-5">
                {/* 難易度 */}
                <div className="mb-6">
                  <h2 className="text-xl font-semibold">難易度</h2>
                  <p>{course.difficulty}</p>
                </div>
                {/* 教練 */}
                <div className="mb-6">
                  <h2 className="text-xl font-semibold">指導教練</h2>
                  <p>{course.variants[0]?.coach.name}</p>
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
            </div>
            {/* <div className="px-8 py-6 space-y-6"></div> */}

            {/* ——— 右側側邊欄 ——— */}
            <div className="w-80">
              {/* sticky 直到距離頂端 6rem (= top-24) */}
              <div className="sticky top-24  space-y-4">
                {/* 报名卡片 */}
                <div className="bg-white p-6 rounded-2xl shadow-lg">
                  <div className="text-center">
                    {/* 主辦方 Logo */}
                    {course.organizer?.logo && (
                      <Image
                        src={course.organizer.logo}
                        alt={course.organizer.name}
                        width={48}
                        height={48}
                        className="rounded-full mx-auto"
                      />
                    )}
                    <h3 className="mt-3 font-semibold text-lg">
                      {course.organizer?.name}
                    </h3>
                  </div>
                  <Link href={`/courses/${id}/sign-up`}>
                    <button className="mt-6 w-full px-4 py-2 bg-primary-600 text-white rounded-full hover:bg-primary-500 transition">
                      立即報名
                    </button>
                  </Link>
                  {/* 下方提示卡片 */}
                  {/* <div className="bg-pink-50 border border-pink-200 rounded-2xl p-4">
                  <h4 className="font-semibold mb-2">線下活動</h4>
                  <p className="text-sm text-gray-600 leading-relaxed"></p>
                  <button className="mt-2 text-pink-600 underline text-sm">
                    如何取票？
                  </button>
                </div> */}
                </div>
              </div>
            </div>
          </div>

          {/* 課程基本資訊 */}

          {/* 地圖 */}
          {/* <div className="h-64 w-full">
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
            </div> */}

          {/* <div className="mt-12">
              <h2 className="text-2xl mb-8">教練資訊</h2>
              <div className="flex">
                <div className="max-w-xs mx-auto border-2 border-blue-200 rounded-2xl p-6 text-center">
                  <Image
                    src="null"
                    alt=""
                    width={100}
                    height={100}
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
            </div> */}
          {/* </div> */}
          {/* </div> */}
        </Container>
      </main>
    </>
  );
}
