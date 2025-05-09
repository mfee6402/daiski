'use client';

import React, { useState, useEffect } from 'react';
import Process from './_components/process';
// secondary
export default function CartPage(props) {
  return (
    <>
      <div className="container mx-auto  ">
        <h3 className="text-h3-tw text-primary-600">CART | 購物車 </h3>
        <Process step="1"></Process>
        {/* NOTE h-full為測試用 */}
        <div className="flex justify-between">
          <div className="w-full">
            <div className="border-b-5 border-secondary-500">
              <h6 className="text-h6-tw">商品內容</h6>
            </div>
          </div>
          <div className=" w-[450] sticky top-30">
            <div className="border-b-5 border-secondary-500">
              <h6 className="text-h6-tw font-bold">結帳明細</h6>
            </div>
            <div className="border-b-5 border-secondary-500">
              <div className="flex justify-between">
                <p className="text-p-tw">商品原價總金額</p>
                {/* NOTE 待寫入金額 */}
                <p className="text-p-tw"></p>
              </div>
              <div>
                <p className="text-p-tw">課程原價總金額</p>
              </div>
              <div>
                <p className="text-p-tw">折扣券</p>
              </div>
            </div>
            <div>
              <h6 className="text-h6-tw font-bold">結帳金額</h6>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
