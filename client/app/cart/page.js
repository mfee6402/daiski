'use client';

import React, { useState, useEffect } from 'react';
import Process from './_components/process';
import Checkout from './_components/checkout';

import { useGet } from '@/hooks/use-get';

import { Trash2 } from 'lucide-react';
// secondary
export default function CartPage(props) {
  const url = 'http://localhost:3005/api/cart';
  const { data, loading, error } = useGet(url);
  const cart = data ? data.data.cart : [];
  const products = cart?.CartProduct ? cart.CartProduct : [];
  const groups = cart?.CartGroup ? cart.CartGroup : [];
  const course = cart?.CartCourse ? cart.CartCourse : [];
  if (loading) {
    return <p>載入中</p>;
  }

  return (
    <>
      <div className="container mx-auto  ">
        <h3 className="text-h3-tw text-primary-600">CART | 購物車 </h3>
        <Process step="1"></Process>
        <div className="flex justify-between">
          <div className="w-full">
            <div className="border-b-5 border-secondary-500">
              <h6 className="text-h6-tw">商品內容</h6>
            </div>

            {products.map((product, i) => {
              return (
                <div key={product.productId} className="flex justify-between">
                  <div className="flex justify-center w-full">
                    <p>{product.productId}</p>
                  </div>
                  <div className="flex justify-center w-full">
                    <p>{product.quantity}</p>
                  </div>
                  <div className="flex justify-center w-full">
                    <div>收藏</div>
                    <div className="flex justify-center">
                      <Trash2></Trash2>刪除
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <Checkout></Checkout>
        </div>
      </div>
    </>
  );
}
