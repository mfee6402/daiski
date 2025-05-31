'use client';

import React, { useState, useEffect } from 'react';
import { useCart } from '@/hooks/use-cart';
import Process from '../_components/process';
import Checkout from '../_components/checkout';
import { FaRegCheckCircle } from 'react-icons/fa';

export default function SummaryPage(props) {
  const { cart } = useCart();
  console.log(cart);
  return (
    <>
      {/* <Process step="3"></Process> */}

      <div className="flex justify-center items-center flex-col gap-4 py-4  bg-secondary-200 rounded-md my-10">
        <FaRegCheckCircle className="text-4xl text-primary-600" />
        <p className="text-h6-tw">訂單完成</p>
        {/* <p className="text-h5-tw">感謝您的購買</p> */}
      </div>

      <div className="flex justify-between  ">
        <div className="flex flex-col gap-12">
          <div className="border-b-5 border-secondary-500">
            <h6 className="text-h6-tw">訂單資訊</h6>
          </div>

          <div>
            <p className="text-p-tw">訂單編號：</p>
            <p className="text-p-tw">付款方式：</p>
            <p className="text-p-tw">收件人：</p>
            <p className="text-p-tw">手機：</p>
            <p className="text-p-tw">收貨地址：</p>
          </div>
          <div>
            {cart.CartProduct?.map((item) => {
              return <p key={item.id}>{item.name}</p>;
            })}
          </div>
          <div>
            <Checkout></Checkout>
          </div>
        </div>
      </div>
    </>
  );
}
