'use client';

import React, { useState, useEffect } from 'react';

import Process from './_components/process';
import Checkout from './_components/checkout';

import { produce } from 'immer';

import CartItemList from './_components/cartItemList';

import { useAuth } from '@/hooks/use-auth';
import { useCart } from '@/hooks/use-cart';

export default function CartPage({ setProcess }) {
  const { cart, setCart } = useCart();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user, isAuth, isLoading } = useAuth();

  // useEffect(() => {
  //   async function fetchData() {
  //     try {
  //       const url = 'http://localhost:3005/api/cart';
  //       const res = await fetch(url, { credentials: 'include' });
  //       const json = await res.json();
  //       setData(json);
  //       setLoading(false);
  //     } catch (err) {
  //       setError(err);
  //       setLoading(false);
  //     }
  //   }
  //   fetchData();
  // }, []);

  // const groups = data?.data.cart.CartGroup ? cart.CartGroup : [];

  //   // 定義收藏用狀態
  // const [wishList, setWishList] = useState(false)
  // // 處理收藏布林值切換(toggle)
  // const onToggleWish = (wishList) => {
  //   const nextWishList = books.map((v, i) => {
  //     if (v.isbn === wishList) {
  //       // 如果比對出isbn=bookIsbn的成員，則進行再拷貝物件，並且作修改`bookmark: !v.bookmark`
  //       return { ...v, wishList: !v.wishList }
  //     } else {
  //       // 否則回傳原本物件
  //       return v
  //     }
  //   })
  //   // 3 設定到狀態
  //   setBooks(wishList)
  // }

  // 以上測試區
  // if (loading) {
  // return <p>載入中</p>;
  // }

  if (isAuth) {
    return (
      <>
        <Process step="1"></Process>
        <div className="flex justify-between">
          <div className="w-full">
            <CartItemList
              key="CartProduct"
              category="CartProduct"
            ></CartItemList>
            <CartItemList key="CartGroup" category="CartGroup"></CartItemList>
          </div>
          <Checkout></Checkout>
        </div>
      </>
    );
  } else {
    return <>請先登入</>;
  }
}
