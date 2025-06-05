'use client';

import React, { useState, useEffect } from 'react';
import { useCart } from '@/hooks/use-cart';
import Process from '../_components/process';
import Checkout from '../_components/checkout';
import { FaRegCheckCircle } from 'react-icons/fa';

import Coupon from '../_components/coupon';

import CartItemList from '../_components/cartItemList';

import { useAuth } from '@/hooks/use-auth';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';

export default function SummaryPage() {
  const [order, setOrder] = useState({});
  useEffect(() => {
    async function fetchData() {
      try {
        const url = 'http://localhost:3005/api/cart/order';
        const res = await fetch(url, { credentials: 'include' });
        const data = await res.json();
        setOrder(data.order);
      } catch (error) {
        console.log(error);
      }
    }
    fetchData();
  }, []);

  console.log(order);
  const payMentMap = {
    cashOnDelivery: '宅配',
    storePickup: '超商取貨',
  };

  return (
    <>
      {/* <Process step="3"></Process> */}
      <div className="flex justify-center items-center flex-col gap-4 py-4  bg-secondary-200 rounded-md my-10">
        <FaRegCheckCircle className="text-4xl text-primary-600" />
        <p className="text-h6-tw">訂單完成</p>
      </div>

      <div className="flex justify-between md:gap-6  ">
        <div className="flex flex-col w-full gap-6 min-w-0 justify-center item-center">
          <Card className="shadow-lg bg-card text-card-foreground dark:bg-card-dark dark:text-card-foreground-dark border border-border dark:border-border-dark">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">訂單資訊</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between flex-col gap-12 ">
                <p className="text-p-tw">訂單編號：{order.id}</p>
                <p className="text-p-tw">收件人：{order.name}</p>
                <p className="text-p-tw">手機：{order.phone}</p>
                <p className="text-p-tw">
                  付款方式：{payMentMap[order.payment]}
                </p>
                <p className="text-p-tw">收貨地址：{order.address}</p>
              </div>
            </CardContent>
          </Card>

          <CartItemList
            key="orderProduct"
            category="orderProduct"
            data={order}
            isOrder={true}
          ></CartItemList>
          <CartItemList
            key="CartCourse"
            category="orderCourse"
            data={order}
            isOrder={true}
          ></CartItemList>
          <CartItemList
            key="CartGroup"
            category="orderGroup"
            data={order}
            isOrder={true}
          ></CartItemList>
          <Coupon isOrder={true}></Coupon>
        </div>
        <div className="">
          <Checkout isOrder={true}></Checkout>
        </div>
      </div>
    </>
  );
}
