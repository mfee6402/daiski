'use client';

import React, { useState, useEffect } from 'react';
import { RiCoupon2Line } from 'react-icons/ri';

export default function CouponCard(props) {
  return (
    <>
      <div
        className="flex w-full max-w-[22rem] sm:max-w-[44rem]  
            border border-primary-600 sm:px-5 sm:py-3 p-1
            items-center gap-4"
      >
        {/* 標頭有icon */}
        <div className="flex-none w-14 flex flex-col items-center">
          <RiCoupon2Line className="text-[35px]" />
          <p className="font-tw  text-black">折價卷</p>
        </div>

        {/* 虛線 */}
        <div className="flex-none h-28 w-px border-l-2 border-dashed border-secondary-500"></div>

        {/* 內容 */}
        <div className="min-w-0 flex-1 space-y-1 pr-2">
          <p className="font-tw leading-p-tw text-secondary-800 truncate">
            現金折扣 $100
          </p>
          <p className="font-tw leading-p-tw text-secondary-800 truncate">
            結帳金額滿 $3000 使用
          </p>
          <p className="font-tw leading-p-tw text-black line-clamp-2">
            課程結帳金額滿3000元線抵100折價卷
          </p>
          <p className="font-tw leading-p-tw text-red truncate">
            04/14 23:59 結束
          </p>
        </div>

        {/* button */}
        <button
          className="flex-none w-[72px] h-8 flex items-center justify-center
               border border-primary-600 font-tw leading-p-tw
               hover:bg-primary-600 hover:text-white transition"
        >
          領取
        </button>
      </div>
    </>
  );
}
