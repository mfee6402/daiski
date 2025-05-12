'use client';

import React, { useState, useEffect } from 'react';
import Process from './_components/process';
import Checkout from './_components/checkout';

import { produce } from 'immer';

import { useGet } from '@/hooks/use-get';

import Delete from './_components/delete-button';
import WishList from './_components/wish-list';

// secondary
export default function CartPage(props) {
  const url = 'http://localhost:3005/api/cart';
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cart, setCart] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch(url);
        const json = await res.json();
        setData(json);
        setLoading(false);
      } catch (err) {
        setError(err);
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  useEffect(() => {
    const nextCart = data;
    setCart(nextCart);
    console.log(cart);
  }, []);

  // const cart = data?.data.cart ? data.data.cart : [];
  const products = cart?.CartProduct ? cart.CartProduct : [];
  const groups = cart?.CartGroup ? cart.CartGroup : [];
  const course = cart?.CartCourse ? cart.CartCourse : [];

  // NOTE 測試用，等待會員製作完收藏資料庫再修正，用於決定收藏的愛心狀態(實心、空心)
  const tmpWishListLeg = 3;
  const initWishList = new Array(tmpWishListLeg).fill(false);

  const [wishList, setWishList] = useState(initWishList);

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
  if (loading) {
    return <p>載入中</p>;
  }

  return (
    <>
      <div className="container mx-auto  ">
        <h3 className="text-h3-tw text-primary-600">CART | 購物車 </h3>
        <Process step="3"></Process>
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
                    <button
                      onClick={() => {
                        // setData(data.product[i].quantity + 1);
                      }}
                    >
                      +1
                    </button>
                    <div className="flex justify-center">
                      <p>{product.quantity}</p>
                    </div>

                    <p>{product.quantity}</p>
                  </div>
                  <div className="flex justify-center w-full">
                    <WishList
                      wishList={wishList}
                      index={i}
                      setWishList={setWishList}
                    ></WishList>
                    <Delete></Delete>
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
