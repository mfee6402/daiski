'use client';
// FIXME 要把資料表單放入localStore嗎?方便重新整理的時候保留資料
import React, { useState, useEffect } from 'react';
import {
  useForm,
  FormProvider,
  useWatch,
  useFormContext,
} from 'react-hook-form';

import Process from '../_components/process';
import ShippingMethod from './_components/shippingMethod';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';

import { useCart } from '@/hooks/use-cart';

import PaymentOption from './_components/paymentOption';
import { produce } from 'immer';

export default function CheckoutPage(props) {
  const { cart, setCart, onClear } = useCart();
  const router = useRouter();

  const methods = useForm({
    defaultValues: {
      city: '',
      district: '',
      zipCode: '',
      addressDetail: '',
      shouldUnregister: true,
    },
  });

  const onSubmit = async (data) => {
    let nextCart = produce(cart, (draft) => {
      draft.shippingInfo.shippingMethod = data.shippingMethod;
      draft.userInfo.name = data.name;
      draft.userInfo.phone = data.phone;
      draft.payment = data.payment;
    });
    if (data.shippingMethod === 'homeDelivery') {
      nextCart = produce(nextCart, (draft) => {
        draft.shippingInfo.address = data.city + data.district;
        draft.shippingInfo.zipCode = data.zipCode;
      });
    } else if (data.shippingMethod === 'storePickup') {
      nextCart = produce(nextCart, (draft) => {
        draft.shippingInfo.storename = JSON.parse(
          localStorage.getItem('store711')
        ).storename;
        draft.shippingInfo.address = JSON.parse(
          localStorage.getItem('store711')
        ).storeaddress;
      });
    }
    // 設定到狀態
    setCart(nextCart);

    // FIXME 資料庫沒有送貨方式
    const orderData = {
      shipping: nextCart.shippingInfo.shippingMethod,
      payment: nextCart.payment,
      name: nextCart.userInfo.name,
      phone: nextCart.userInfo.phone,
      address: nextCart.shippingInfo.address,
      amount: nextCart.amount,
      couponId: nextCart.couponId,
      CartGroup: nextCart.CartGroup,
      CartCourse: nextCart.CartCourse,
      CartProduct: nextCart.CartProduct,
    };
    // 建立訂單
    const responseOrder = await fetch('http://localhost:3005/api/cart/order', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderData),
    });
    const responseOrderData = await responseOrder.json();

    // 清空購物車
    onClear();

    if (data.payment === 'paypal') {
      router.push('/cart/checkout/paypal');
    } else if (data.payment === 'ecpay') {
      // 可傳金額當 query 參數
      router.push(`http://localhost:3005/api/cart/ecpay-test-only?amount=2500`);
    } else {
      // 假設是貨到付款或信用卡，這裡可以寫訂單建立邏輯
      // 然後跳轉
      // await fetch('/api/order', { method: 'POST', body: form });

      router.push('/cart/summary');
    }
  };

  return (
    <>
      <FormProvider {...methods}>
        <Process step="2"></Process>
        <Card className="shadow-lg bg-card text-card-foreground dark:bg-card-dark dark:text-card-foreground-dark border border-border dark:border-border-dark">
          <form onSubmit={methods.handleSubmit(onSubmit)}>
            {/* 寄送方式 */}
            <CardHeader>
              <CardTitle className="text-lg font-semibold">寄送方式</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col w-full p-12 gap-5  ">
                <ShippingMethod
                // selectedShipping={selectedShipping}
                // setSelectedShipping={setSelectedShipping}
                ></ShippingMethod>
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
                  // onChange={() => setSelectedPayment('cashOnDelivery')}
                ></PaymentOption>

                {/* Paypal */}
                <PaymentOption
                  optionName="PayPal"
                  radioValue="paypal"
                  // onChange={() => setSelectedPayment('paypal')}
                ></PaymentOption>

                {/* 綠界 */}
                <PaymentOption
                  optionName="綠界"
                  radioValue="ecpay"
                  // checked={selectedPayment === 'ecpay'}
                  // onChange={() => setSelectedPayment('ecpay')}
                ></PaymentOption>

                {methods.formState.errors.payment && (
                  <p className="text-red">請選擇一個配送方式</p>
                )}
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
      </FormProvider>
    </>
  );
}
