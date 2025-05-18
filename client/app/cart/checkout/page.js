'use client';
// FIXME 要把資料表單放入localStore嗎?方便重新整理的時候保留資料
import React, { useState, useEffect } from 'react';
import Process from '../_components/process';
import ShippingMethod from './_components/shippingMethod';

export default function CheckoutPage(props) {
  const handleSubmit = (e) => {
    e.preventDefault();
    alert('表單送出，(後端可能)將網頁跳轉');
  };

  return (
    <>
      <Process step="2"></Process>
      {/* 要使用form標記的原因 */}
      {/* 1. 用FormData */}
      {/* 2. 要用HTML5(瀏覽器內建)的表單驗証功能 */}
      {/* <form onSubmit={}> */}

      <form onSubmit={handleSubmit}>
        {/* 寄送方式 */}
        <div className="border-b-5 border-secondary-500">
          <h6 className="text-h6-tw">寄送方式</h6>
        </div>
        <div className="flex flex-col w-full p-12 gap-5  ">
          <ShippingMethod></ShippingMethod>
        </div>

        {/* 付款方式 */}
        <div className="border-b-5 border-secondary-500">
          <h6 className="text-h6-tw">付款方式</h6>
        </div>
        <div className="flex flex-col w-full p-12 gap-5  ">
          {/* 貨到付款 */}
          <label className="inline-flex items-center space-x-2 relative">
            <input
              type="radio"
              name="payment"
              className="peer appearance-none w-6 h-6 rounded-full border-2 border-primary-600   checked:border-primary-600"
            />
            <span className="pointer-events-none w-3  h-3 rounded-full bg-primary-600 absolute left-1.5  my-auto  opacity-0 peer-checked:opacity-100" />

            <h6 className=" text-h6-tw">貨到付款</h6>
          </label>
          {/* 信用卡 */}
          <label className="inline-flex items-center space-x-2 relative">
            <input
              type="radio"
              name="payment"
              className="peer appearance-none w-6 h-6 rounded-full border-2 border-primary-600   checked:border-primary-600"
            />
            <span className="pointer-events-none w-3  h-3 rounded-full bg-primary-600 absolute left-1.5 my-auto  opacity-0 peer-checked:opacity-100" />

            <h6 className=" text-h6-tw">信用卡</h6>
          </label>
          {/* LINE PAY */}
          <label className="inline-flex items-center space-x-2 relative">
            <input
              type="radio"
              name="payment"
              className="peer appearance-none w-6 h-6 rounded-full border-2 border-primary-600   checked:border-primary-600"
            />
            <span className="pointer-events-none w-3  h-3 rounded-full bg-primary-600 absolute left-1.5 my-auto opacity-0 peer-checked:opacity-100" />

            <h6 className=" text-h6-tw">LINE PAY</h6>
          </label>
          {/* 綠界 */}
          <label className="inline-flex items-center space-x-2 relative">
            <input
              type="radio"
              name="payment"
              className="peer appearance-none w-6 h-6 rounded-full border-2 border-primary-600   checked:border-primary-600"
            />
            <span className="pointer-events-none w-3  h-3 rounded-full bg-primary-600 absolute left-1.5 my-auto opacity-0 peer-checked:opacity-100" />

            <h6 className=" text-h6-tw">綠界</h6>
          </label>
        </div>
        <div className="flex justify-end ">
          <button
            type="submit"
            className="bg-secondary-500 px-6 py-2.5 text-h6-tw"
          >
            確認付款
          </button>
        </div>
      </form>
    </>
  );
}
