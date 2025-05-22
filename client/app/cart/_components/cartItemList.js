'use client';

import React, { useState, useEffect } from 'react';
import Delete from './delete-button';
import WishList from './wish-list';
import QuantityButton from './quantity-button';

import Image from 'next/image';
export default function CartItemList({
  data = {},
  setData = () => {},
  category = '',
}) {
  // NOTE 測試用，等待會員製作完收藏資料庫再修正，用於決定收藏的愛心狀態(實心、空心)
  const tmpWishListLeg = 3;
  const initWishList = new Array(tmpWishListLeg).fill(false);

  const [wishList, setWishList] = useState(initWishList);

  const titleMap = {
    product: '商品',
    course: '課程',
    group: '揪團',
  };

  return (
    <>
      {/* 商品 */}
      {/* 課程 */}
      {/* 揪團 */}
      <div className="border-b-5 border-secondary-500">
        <h6 className="text-h6-tw">商品內容</h6>
      </div>

      <div className="mt-10 flex flex-col gap-4">
        {data?.cart?.[category].map((item, i) => {
          return (
            <div key={item.id} className="flex justify-between">
              {/* 圖與名稱 */}
              <div className="flex  w-full ">
                {item.imageUrl && (
                  <Image
                    src={
                      item?.imageUrl
                        ? `http://localhost:3005${item.imageUrl}`
                        : ''
                    }
                    alt="productImage"
                    width={96}
                    height={96}
                    className="object-fill w-[96]"
                  ></Image>
                )}
                <div>
                  <p>{item.name}</p>
                </div>
              </div>
              {/* 尺寸 */}
              <div className="w-full flex justify-center items-center ">
                <p className="text-h6-tw">{item?.size}</p>
              </div>
              {/* 價格 */}
              <div className="w-full flex justify-center items-center ">
                <p className="text-h6-tw">
                  {(
                    item.price * (item.quantity ? item.quantity : 1)
                  ).toLocaleString()}
                </p>
              </div>
              {/* 數量(只有商品有) */}
              {category === 'CartProduct' && (
                <div className="flex justify-center w-full items-center">
                  <QuantityButton
                    category={category}
                    itemId={item.id}
                    data={data}
                    setData={setData}
                    type="minus"
                  ></QuantityButton>
                  <div className="flex justify-center w-[50]">
                    <p className="text-h6-tw">{item.quantity}</p>
                  </div>
                  <QuantityButton
                    category={category}
                    itemId={item.id}
                    data={data}
                    setData={setData}
                    type="plus"
                  ></QuantityButton>
                </div>
              )}
              {/* FIXME */}
              {/* 活動日期(只有課程跟揪團有) */}
              {/* 收藏、刪除 */}
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
    </>
  );
}
