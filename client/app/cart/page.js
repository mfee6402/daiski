'use client';

import React, { useState, useEffect } from 'react';

import Process from './_components/process';
import Checkout from './_components/checkout';

import { produce } from 'immer';

import Delete from './_components/delete-button';
import WishList from './_components/wish-list';
import QuantityButton from './_components/quantity-button';

import Image from 'next/image';
// secondary
export default function CartPage({ setProcess }) {
  const url = 'http://localhost:3005/api/cart';
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
  // console.log()
  // const groups = data?.data.cart.CartGroup ? cart.CartGroup : [];
  // const course = data?.data.cart.CartCourse ? cart.CartCourse : [];

  // NOTE 測試用，等待會員製作完收藏資料庫再修正，用於決定收藏的愛心狀態(實心、空心)
  const tmpWishListLeg = 3;
  const initWishList = new Array(tmpWishListLeg).fill(false);

  const [wishList, setWishList] = useState(initWishList);

  console.log(
    data?.cart.CartProduct[0].product_image ===
      '/productImages/1/ProductPicture.jfif'
  );
  // console.log(products[2]);
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

  return (
    <>
      <Process step="1"></Process>
      <div className="flex justify-between">
        <div className="w-full">
          <div className="border-b-5 border-secondary-500">
            <h6 className="text-h6-tw">商品內容</h6>
          </div>
          {/* 品項 */}
          <div className="mt-10 flex flex-col gap-4">
            {data?.cart.CartProduct.map((product, i) => {
              return (
                <div key={product.productId} className="flex justify-between">
                  <div className="flex  w-full ">
                    {product.product_image && (
                      <Image
                        src={`http://localhost:3005${product.product_image}`}
                        alt="productImage"
                        width={96}
                        height={96}
                        className="object-fill w-[96]"
                      ></Image>
                    )}

                    <div>
                      <p>{product.name}</p>
                    </div>
                  </div>
                  <div className="w-full flex justify-center items-center ">
                    <p className="text-h6-tw">$6000</p>
                  </div>
                  <div className="flex justify-center w-full items-center">
                    <QuantityButton
                      productId={product.productId}
                      data={data}
                      setData={setData}
                      type="minus"
                    ></QuantityButton>
                    <div className="flex justify-center w-[50]">
                      <p className="text-h6-tw">{product.quantity}</p>
                    </div>
                    <QuantityButton
                      productId={product.productId}
                      data={data}
                      setData={setData}
                      type="plus"
                    ></QuantityButton>
                  </div>

                  <div className="flex justify-center w-full gap-4">
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
        </div>
        <Checkout></Checkout>
      </div>
    </>
  );
}
