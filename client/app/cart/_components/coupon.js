'use client';

import React, { useState, useEffect } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export default function Coupon(props) {
  return (
    <>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger>優惠券按鈕</DropdownMenuTrigger>
        <DropdownMenuContent>
          {/* <DropdownMenuLabel>我的優惠券</DropdownMenuLabel> */}

          <DropdownMenuItem>
            快樂滑雪去滿1000折100快樂滑雪去滿1000折100快樂滑雪去滿1000折100快樂滑雪去滿1000折100快樂滑雪去滿1000折100
          </DropdownMenuItem>
          <DropdownMenuItem>Billing</DropdownMenuItem>
          <DropdownMenuItem>Team</DropdownMenuItem>
          <DropdownMenuItem>Subscription</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
