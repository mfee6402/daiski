'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';

export default function SkiCard({
  title = '',
  imgSrc = '',
  src = '',
  reverse = false,
  className = '',
}) {
  return (
    <li
      className={[
        'w-full h-full flex flex-row items-center',
        reverse ? 'flex-row-reverse' : '',
        className, // 傳入外部想加的 margin、負 margin…
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {/* 文字區塊 */}
      <div className="w-[35%]">
        <h3 className="text-2xl font-bold mb-4">{title}</h3>
        <a href={src}>
          <button className="bg-black text-white px-4 py-2 rounded">
            了解更多
          </button>
        </a>
      </div>

      {/* 圖片區塊 */}
      <div className="relative w-[65%] h-[35rem]">
        <Image
          src={imgSrc}
          alt={title}
          fill
          className={`object-cover h-full ${reverse ? 'mr-auto' : 'ml-auto'}`}
          priority
        />
      </div>
    </li>
  );
}
