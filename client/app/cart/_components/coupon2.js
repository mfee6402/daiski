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
export default function Coupon2(props) {
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
  console.log(cart);
  return (
    <div className=" w-full p-10">
      <Carousel opts={{ align: 'start' }} className="w-full">
        <CarouselContent className="">
          {cart.CartCoupon?.map((item) => {
            const id = item.id;
            const name = item.name;
            const type = item.type;
            const endAt = new Date(item.endAt).toLocaleString();
            const amount = item.amount;
            const target = item.target;
            const canUse = item.canUse;
            return (
              <CarouselItem className="basis-1/3" key={id}>
                <div>
                  <p>名稱:{name}</p>
                  <p>對象:{target}</p>
                  <p>類型:{type}</p>
                  <p>結束時間:{endAt}</p>
                  <p>折抵金額:{amount}</p>
                  {/* FIXME 可以使用要高亮，未滿金額之類的不能使用要低光 */}
                  <div className="flex justify-end">
                    <Button
                      onClick={() => {
                        {
                          canUse && applyCoupon(id);
                        }
                      }}
                    >
                      {canUse ? '使用' : '不滿足'}
                    </Button>
                  </div>
                </div>
              </CarouselItem>
            );
          })}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
}
