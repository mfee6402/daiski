'use client';
// FIXME 要把資料表單放入localStore嗎?方便重新整理的時候保留資料
import React, { useState, useEffect } from 'react';
import Process from '../_components/process';
import ShippingMethod from './_components/shippingMethod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';

import PaymentOption from './_components/paymentOption';

export default function CheckoutPage(props) {
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = new FormData(e.target);
    const payment = form.get('payment');
    if (payment === 'paypal') {
      router.push('/cart/checkout/paypal');
    } else if (payment === 'ecpay') {
      // 可傳金額當 query 參數
      router.push('/api/cart/ecpay-test-only?amount=2500');
    } else {
      // 假設是貨到付款或信用卡，這裡可以寫訂單建立邏輯
      // 然後跳轉
      // await fetch('/api/order', { method: 'POST', body: form });
      router.push('/cart/summary');
    }
  };

  return (
    <>
      <Process step="2"></Process>
      {/* 要使用form標記的原因 */}
      {/* 1. 用FormData */}
      {/* 2. 要用HTML5(瀏覽器內建)的表單驗証功能 */}
      {/* <form onSubmit={}> */}
      <Card className="shadow-lg bg-card text-card-foreground dark:bg-card-dark dark:text-card-foreground-dark border border-border dark:border-border-dark">
        <form onSubmit={handleSubmit}>
          {/* 寄送方式 */}
          <CardHeader>
            <CardTitle className="text-lg font-semibold">寄送方式</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col w-full p-12 gap-5  ">
              <ShippingMethod></ShippingMethod>
            </div>
          </CardContent>
          {/* 付款方式 */}
          <CardHeader>
            <CardTitle className="text-lg font-semibold">付款方式</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col w-full p-12 gap-5  ">
              {/* 貨到付款 */}
              <PaymentOption
                optionName="貨到付款"
                radioValue="cashOnDelivery"
              ></PaymentOption>

              {/* Paypal */}
              <PaymentOption
                optionName="PayPal"
                radioValue="paypal"
              ></PaymentOption>

              {/* 綠界 */}
              <PaymentOption
                optionName="綠界"
                radioValue="ecpay"
              ></PaymentOption>
            </div>
            {/* FIXME改顏色 */}
            <div className="flex justify-end ">
              <Button type="submit" className="px-6 py-2.5 ">
                確認付款
              </Button>
            </div>
          </CardContent>
        </form>
      </Card>
    </>
  );
}
