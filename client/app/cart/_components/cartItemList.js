'use client';

import React, { useState, useEffect } from 'react';
import Delete from './delete-button';
import WishList from './wish-list';
import QuantityButton from './quantity-button';
import Favorite from './favorite';
import { useCart } from '@/hooks/use-cart';
import Image from 'next/image';

export default function CartItemList({ category = '' }) {
  const { cart } = useCart();
  // NOTE 測試用，等待會員製作完收藏資料庫再修正，用於決定收藏的愛心狀態(實心、空心)
  const tmpWishListLeg = 3;
  const initWishList = new Array(tmpWishListLeg).fill(false);

  const [wishList, setWishList] = useState(initWishList);

  const titleMap = {
    CartProduct: '商品',
    CartCourse: '課程',
    CartGroup: '揪團',
  };
  const toUTC8 = (utcString) => {
    const date = new Date(utcString);
    date.setHours(date.getHours() + 8); // 加上 8 小時
    const [d, t] = date.toISOString().split('T');
    return `${d} ${t.split('.')[0]}`; // 回傳 "YYYY-MM-DD HH:mm:ss"
  };

  return (
    <>
      <div className="border-b-5 border-secondary-500">
        <h6 className="text-h6-tw">{titleMap[category]}</h6>
      </div>

      <div className="mt-10 flex flex-col gap-4">
        {cart[category]?.map((item, i) => {
          const totalPrice = (
            item.price * (item.quantity ? item.quantity : 1)
          ).toLocaleString();

          return (
            <div key={category + item.id} className="flex justify-between">
              {/* 圖與名稱 */}
              <div className="flex  w-full ">
                {item.imageUrl && (
                  <Image
                    src={
                      item?.imageUrl
                        ? `http://localhost:3005${item.imageUrl}`
                        : ''
                    }
                    alt={item.imageUrl}
                    width={96}
                    height={96}
                    className="object-fill w-[96]"
                  ></Image>
                )}
                <div>
                  <p>{item.name}</p>
                </div>
              </div>
              {/* 時間 */}

              {category !== 'CartProduct' && (
                <div className="w-full flex justify-center items-center flex-col ">
                  <p className="flex flex-col">
                    <span className="text-h6-tw ">{toUTC8(item?.startAt)}</span>
                    <span className="text-p-tw flex justify-end  ">
                      ~{toUTC8(item?.endAt)}
                    </span>
                  </p>
                </div>
              )}

              {/* 尺寸 */}
              {category === 'CartProduct' && (
                <div className="w-full flex justify-center items-center ">
                  <p className="text-h6-tw">{item?.size}</p>
                </div>
              )}

              {/* 價格 */}
              <div className="w-full flex justify-center items-center ">
                <p className="text-h6-tw">${totalPrice}</p>
              </div>
              {/* 數量(只有商品有) */}
              {category === 'CartProduct' && (
                <div className="flex justify-center w-full items-center">
                  <QuantityButton
                    item={item}
                    category={category}
                    type="minus"
                  ></QuantityButton>
                  <div className="flex justify-center w-[50]">
                    <p className="text-h6-tw">{item.quantity}</p>
                  </div>
                  <QuantityButton
                    item={item}
                    category={category}
                    type="plus"
                  ></QuantityButton>
                </div>
              )}
              {/* FIXME */}
              {/* 活動日期(只有課程跟揪團有) */}
              {/* 收藏、刪除 */}
              <div className="flex justify-center w-full gap-4">
                {/* <WishList
                  wishList={wishList}
                  index={i}
                  setWishList={setWishList}
                ></WishList> */}
                {/* FIXME 收藏按鈕 */}
                {/* {category === 'CartProduct' && <Favorite data></Favorite>} */}

                {/* 刪除只有商品有 */}
                {category === 'CartProduct' && (
                  <Delete
                    name={item.name}
                    category={category}
                    item={item}
                  ></Delete>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
