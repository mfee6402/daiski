'use client';

import React, { useState, useEffect } from 'react';

export default function ClubLi({ src, title, isActive, onSelect }) {
  return (
    <li
      data-active={isActive}
      onClick={onSelect}
      className={`relative overflow-hidden rounded-lg border cursor-pointer
        transition-opacity duration-600 
        ease-[linear(0_0%,_.154_4.1%,_.293_8.3%,_.417_12.6%,_.528_17.1%,_.626_21.8%,_.71_26.6%,_.782_31.7%,_.843_37%,_.889_42.2%,_.926_47.8%,_.954_53.8%,_.975_60.3%,_.988_67.1%,_.996_75%,_1_100%)]
        ${isActive ? 'opacity-100' : 'opacity-80'}`}
    >
      <article className="h-full flex flex-col justify-end gap-4 px-4 pb-4">
        {/* 左側旋轉標題 */}
        <h3
          data-active-text
          className={`absolute top-20 left-4 origin-left -rotate-90 text-lg
            uppercase font-light whitespace-nowrap z-10
            transition-opacity duration-600 
            ease-[linear(0_0%,_.154_4.1%,_.293_8.3%,_.417_12.6%,_.528_17.1%,_.626_21.8%,_.71_26.6%,_.782_31.7%,_.843_37%,_.889_42.2%,_.926_47.8%,_.954_53.8%,_.975_60.3%,_.988_67.1%,_.996_75%,_1_100%)]
            ${isActive ? 'opacity-60' : 'opacity-0'}`}
        >
          {title}
        </h3>

        {/* 圖片 */}
        <a href="#">
          <img
            data-active-img
            src={src}
            alt={title}
            className={`absolute inset-0 w-full h-full object-cover scale-110
              transition-[filter,transform] duration-600 
              ease-[linear(0_0%,_.154_4.1%,_.293_8.3%,_.417_12.6%,_.528_17.1%,_.626_21.8%,_.71_26.6%,_.782_31.7%,_.843_37%,_.889_42.2%,_.926_47.8%,_.954_53.8%,_.975_60.3%,_.988_67.1%,_.996_75%,_1_100%)] 
              [mask-image:radial-gradient(100%_100%_at_100%_0,_#fff,_transparent)]
              ${
                isActive
                  ? 'grayscale-0 brightness-100'
                  : 'grayscale brightness-150'
              }`}
          />
        </a>
      </article>
    </li>
  );
}
