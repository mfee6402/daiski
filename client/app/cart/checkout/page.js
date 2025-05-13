'use client';

import React, { useState, useEffect } from 'react';
import Process from '../_components/process';

export default function CheckoutPage(props) {
  return (
    <>
      <h3 className="text-h3-tw text-primary-600">CART | 購物車 </h3>
      <Process step="2"></Process>
      <div className="border-b-5 border-secondary-500">
        <h6 className="text-h6-tw">寄送方式</h6>
      </div>
      {/* 要使用form標記的原因 */}
      {/* 1. 用FormData */}
      {/* 2. 要用HTML5(瀏覽器內建)的表單驗証功能 */}
      {/* <form onSubmit={}> */}
      <form>
        <div className="flex w-full p-12 gap-10 ">
          <div className="w-full">
            <label className="gap-5">
              <div>
                <h6 className="text-h6-tw">收貨人:</h6>
              </div>
              <div>
                <input
                  className="border-1 border-primary-600 w-full h-12 "
                  type="text"
                  name="name"
                  // value={user.name}
                  // onChange={}
                />
              </div>
            </label>
          </div>
          {/* <span className={styles['error']}>{errors.name}</span> */}
          <div className="w-full">
            <label>
              <h6 className="text-h6-tw">手機:</h6>
              <input
                className="border-1 border-primary-600 w-full h-12 "
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
        <br />
        <button type="submit">更動</button>
      </form>
    </>
  );
}
