'use client';

import React, { useState, useEffect } from 'react';
import { RiCoupon2Line } from 'react-icons/ri';

export default function CouponCard({
  // 資料相關
  type,
  target,
  amount,
  minPurchase,
  name,
  displayTime, // 已格式化好的「YYYY-MM-DD hh:mm:ss」
  timeLabel, // '開始' 或 '結束'

  // 狀態相關
  statusClass, // 卡片底色 class
  buttonClass, // 按鈕 class
  buttonText, // 按鈕文字
  disabled, // 按鈕是否 disabled

  onUse, // 點擊「領取」時觸發
}) {
  return (
    <>
      <div
        className={`flex w-full max-w-[22rem] sm:max-w-[44rem]  
        border border-primary-600 sm:px-5 sm:py-3 p-1
        items-center gap-4 rounded-lg
        ${statusClass}
        `}
      >
        {/* 標頭有icon */}
        <div className="flex-none w-14 flex flex-col items-center">
          <RiCoupon2Line className="text-[35px]" />
          <p className="font-tw  text-black">{target}</p>
        </div>

        {/* 虛線 */}
        <div className="flex-none h-28 w-px border-l-2 border-dashed border-secondary-500"></div>

        {/* 內容 */}
        <div className="min-w-0 flex-1 space-y-1 pr-2">
          <p className="font-tw leading-p-tw text-secondary-800 truncate">
            {type} ${amount}
          </p>
          <p className="font-tw leading-p-tw text-secondary-800 truncate">
            結帳金額滿 ${minPurchase} 使用
          </p>
          <p className="font-tw leading-p-tw text-black line-clamp-2">{name}</p>
          <p className="font-tw leading-p-tw text-red truncate">
            {displayTime} {timeLabel}
          </p>
        </div>

        {/* button */}
        <button
          className={`
          flex-none w-[72px] h-8 flex items-center justify-center
          border font-tw transition  cursor-pointer
          ${buttonClass}
        `}
          onClick={onUse}
          disabled={disabled}
        >
          {buttonText}
        </button>
      </div>
    </>
  );
}
