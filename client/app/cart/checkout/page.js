'use client';

import React, { useState, useEffect } from 'react';
import Process from '../_components/process';

export default function CheckoutPage(props) {
  const handleSubmit = (e) => {
    e.preventDefault();
    alert('表單送出，(後端可能)將網頁跳轉');
  };

  return (
    <>
      <h3 className="text-h3-tw text-primary-600">CART | 購物車 </h3>
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
          <label className="inline-flex items-center space-x-2 relative">
            <input
              type="radio"
              name="shippingMethod"
              className="peer appearance-none w-6 h-6 rounded-full border-2 border-primary-600   checked:border-primary-600"
            />
            {/* 內部圓點 */}
            <span className="pointer-events-none w-3  h-3 rounded-full bg-primary-600 absolute left-1.5 my-auto opacity-0 peer-checked:opacity-100" />

            <h6 className=" text-h6-tw">宅配</h6>
          </label>

          <div className="flex gap-10">
            <div className=" w-full">
              <label className="flex flex-col  gap-3">
                <h6 className="text-h6-tw">收貨人</h6>

                <input
                  className="border-1 border-primary-600 w-full h-12 text-p-tw px-2"
                  type="text"
                  name="name"
                  // value={user.name}
                  // onChange={}
                />
              </label>
            </div>
            {/* <span className={styles['error']}>{errors.name}</span> */}
            <div className="w-full">
              <label className="flex flex-col  gap-3  ">
                <h6 className="text-h6-tw">手機</h6>
                <input
                  className="border-1 border-primary-600 w-full h-12 text-p-tw  px-2 "
                  type="text"
                  name="phone"
                  // value={user.email}
                  // onChange={}
                />
              </label>
              {/* <span className={styles['error']}>{errors.email}</span> */}
            </div>
          </div>
          {/* <span className={styles['error']}>{errors.confirmPassword}</span> */}
          <label className="inline-flex items-center space-x-2 relative">
            <input
              type="radio"
              name="shippingMethod"
              className="peer appearance-none w-6 h-6 rounded-full border-2 border-primary-600   checked:border-primary-600"
            />
            {/* 內部圓點 */}
            <span className="pointer-events-none w-3  h-3 rounded-full bg-primary-600 absolute left-1.5 my-auto opacity-0 peer-checked:opacity-100" />

            <h6 className=" text-h6-tw">超商取貨</h6>
          </label>
        </div>
        {/* 付款方式 */}
        <div className="border-b-5 border-secondary-500">
          <h6 className="text-h6-tw">付款方式</h6>
        </div>
        <div className="flex flex-col w-full p-12 gap-5  ">
          <label className="inline-flex items-center space-x-2 relative">
            <input
              type="radio"
              name="payment"
              className="peer appearance-none w-6 h-6 rounded-full border-2 border-primary-600   checked:border-primary-600"
            />
            {/* 內部圓點 */}
            <span className="pointer-events-none w-3  h-3 rounded-full bg-primary-600 absolute left-1.5  my-auto  opacity-0 peer-checked:opacity-100" />

            <h6 className=" text-h6-tw">貨到付款</h6>
          </label>
          <label className="inline-flex items-center space-x-2 relative">
            <input
              type="radio"
              name="payment"
              className="peer appearance-none w-6 h-6 rounded-full border-2 border-primary-600   checked:border-primary-600"
            />
            {/* 內部圓點 */}
            <span className="pointer-events-none w-3  h-3 rounded-full bg-primary-600 absolute left-1.5 my-auto  opacity-0 peer-checked:opacity-100" />

            <h6 className=" text-h6-tw">信用卡</h6>
          </label>
          <label className="inline-flex items-center space-x-2 relative">
            <input
              type="radio"
              name="payment"
              className="peer appearance-none w-6 h-6 rounded-full border-2 border-primary-600   checked:border-primary-600"
            />
            {/* 內部圓點 */}
            <span className="pointer-events-none w-3  h-3 rounded-full bg-primary-600 absolute left-1.5 my-auto opacity-0 peer-checked:opacity-100" />

            <h6 className=" text-h6-tw">LINE PAY</h6>
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
