'use client';

import React, { useState, useEffect } from 'react';
import CouponCard from './_components/coupon-card';
import Container from '@/components/container';

export default function CouponsPage(props) {
  return (
    <>
      <Container>
        <section className="flex flex-col gap-6 mt-20">
          {/* 開頭 */}
          <div className="flex flex-row items-center justify-between">
            <h5 className="font-tw text-h5-tw">領取優惠劵</h5>
            <p className="font-tw leading-p-tw">我的優惠劵</p>
          </div>

          {/* 領取 */}
          <div className="border border-primary-600 w-full flex flex-row p-5 items-center justify-around">
            <button className="font-tw leading-p-tw">輸入優惠劵序號</button>
            <div className="h-4 w-px border-l-2 border-secondary-800"></div>
            <button className="font-tw leading-p-tw">一件領取優惠劵</button>
          </div>

          {/* 分類 */}
          <div className="flex flex-row gap-6">
            <button className="font-tw leading-p-tw hover:underline decoration-red decoration-2 underline-offset-4">
              全部
            </button>
            <button className="font-tw leading-p-tw hover:underline decoration-red decoration-2 underline-offset-4">
              課程
            </button>
            <button className="font-tw leading-p-tw hover:underline decoration-red decoration-2 underline-offset-4">
              商品
            </button>
          </div>
          <hr />
        </section>

        {/* 優惠劵 */}
        <section className="grid grid-cols-1 justify-items-center gap-x-25 gap-y-6 lg:grid-cols-2 my-10">
          <CouponCard />
          <CouponCard />
          <CouponCard />
          <CouponCard />
        </section>
      </Container>
    </>
  );
}
