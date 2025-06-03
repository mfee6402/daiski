'use client';

import React, { useState, useEffect } from 'react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { useCart } from '@/hooks/use-cart';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';

import CouponCard from '@/app/coupons/_components/coupon-card';
export default function Coupon(props) {
  const { cart, setCart } = useCart();
  const applyCoupon = (id) => {
    const nextCoupon = cart.CartCoupon.map((coupon) => {
      if (coupon.id === id) {
        return { ...coupon, checked: true };
      } else {
        return { ...coupon, checked: false };
      }
    });
    setCart({ ...cart, CartCoupon: nextCoupon });
  };

  return (
    <Card className="shadow-lg bg-card text-card-foreground dark:bg-card-dark dark:text-card-foreground-dark border border-border dark:border-border-dark  ">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">優惠券</CardTitle>
      </CardHeader>
      <div className="w-full px-15">
        <Carousel opts={{ align: 'start' }}>
          <CarouselContent className="">
            {cart.CartCoupon?.map((item) => {
              const id = item.id;
              const name = item.name;
              const type = item.type;
              const endAt = new Date(item.endAt).toLocaleString();
              const amount = item.amount;
              const target = item.target;
              const canUse = item.canUse;
              const minPurchase = item.minPurchase;
              {
                /* const buttonClass = canUse
                ? 'hover:bg-secondary-800 hover:text-white'
                : 'bg-secondary-800 text-white cursor-default'; */
              }
              return (
                <CarouselItem
                  className={`2xl:basis-1/3 lg:basis-1/2 md:basis-1/1  ${item.checked && 'bg-secondary-500 '}`}
                  key={id}
                >
                  <CouponCard
                    // 原始資料
                    type={type}
                    target={target}
                    amount={amount}
                    minPurchase={minPurchase}
                    name={name}
                    // 時間顯示
                    displayTime={endAt}
                    // 狀態
                    buttonText={canUse ? '使用' : '不滿足'}
                    // buttonClass={buttonClass}
                    // 互動
                    onUse={() => canUse && applyCoupon(id)}
                  />
                </CarouselItem>
              );
            })}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>
    </Card>
  );
}
