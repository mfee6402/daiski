'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';

export default function PaypalPage(props) {
  const router = useRouter();

  // FIXME 根據結帳金額 設定為變數
  const amount = 3000;

  const initialOptions = {
    // 使用NEXT_PUBLIC_開頭的環境變數，瀏覽器才看的到
    // 沒加之所以能log出來是因為next編譯時就靜態載入
    clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENTID,
  };

  const styles = {
    shape: 'rect',
    layout: 'vertical',
  };

  const onCreateOrder = async () => {
    try {
      const url = 'http://localhost:3005/api/paypal';
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },

        body: JSON.stringify({
          amount: amount,
        }),
      });
      const data = await response.json();
      console.log(data);
      return data.orderId;
    } catch (error) {
      console.log(error);
    }
  };

  const onApprove = async (data) => {
    try {
      if (!data?.orderID) throw new Error('無效的訂單ID');
      const url = `http://localhost:3005/api/paypal/${data.orderID}`;
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const result = await response.json();
      console.log(result);
      router.push('/cart/summary');
    } catch (error) {
      console.log(error);
      router.push('/cart/checkout/paypal/cancel');
    }
  };

  const onError = (error) => {
    console.log('PayPal error', error);
    router.push('/cart/checkout/paypal/cancel');
  };

  return (
    <>
      <p>{'帳號:sb-7idsw42487819@personal.example.com'}</p>
      <p>{'密碼:bF]TT4/a'}</p>
      <PayPalScriptProvider options={initialOptions}>
        <PayPalButtons
          style={styles}
          createOrder={onCreateOrder}
          onApprove={onApprove}
          onError={onError}
          // 只顯示paypal按鈕，限定paypal付款
          fundingSource="paypal"
        ></PayPalButtons>
      </PayPalScriptProvider>
    </>
  );

  //
}
