'use client';

import React, { useState, useEffect } from 'react';
import Delete from './delete-button';
import WishList from './wish-list';
import QuantityButton from './quantity-button';
import Favorite from './favorite';
import { useCart } from '@/hooks/use-cart';
import Image from 'next/image';

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';

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
      <Card className="shadow-lg bg-card text-card-foreground dark:bg-card-dark dark:text-card-foreground-dark border border-border dark:border-border-dark ">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">
            {titleMap[category]}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mt-10 flex flex-col gap-4">
            <Table>
              <TableBody>
                {cart[category]?.map((item) => {
                  const totalPrice = (
                    item.price * (item.quantity ? item.quantity : 1)
                  ).toLocaleString();

                  return (
                    <TableRow
                      key={item.id}
                      className="flex flex-row justify-between items-center"
                    >
                      {/* 圖片 */}
                      {item.imageUrl && (
                        <TableCell>
                          <div
                            className={`relative ${category === 'CartProduct' ? 'h-[96px] w-[96px]' : 'h-[96px] w-[168px]'}`}
                          >
                            <Image
                              // FIXME
                              fill
                              src={
                                item?.imageUrl
                                  ? `http://localhost:3005${item.imageUrl}`
                                  : ''
                              }
                              alt={item.imageUrl}
                              className=""
                            ></Image>
                          </div>
                        </TableCell>
                      )}
                      {/* 品名 */}
                      <TableCell className="whitespace-normal break-words">
                        <div className="w-[100px] sm:w-[150px] md:w-[175px] lg:w-[200px]">
                          <p className="text-p-tw line-clamp-3">{item.name}</p>
                        </div>
                      </TableCell>

                      {/* 尺寸 */}
                      {category === 'CartProduct' && (
                        <TableCell>
                          <div className="w-full flex justify-center items-center ">
                            <p className="text-p-tw">{item?.size}</p>
                          </div>
                        </TableCell>
                      )}
                      {/* 價格 */}
                      <TableCell>
                        <div className="w-full flex justify-center items-center ">
                          <p className="text-p-tw">${totalPrice}</p>
                        </div>
                      </TableCell>
                      {/* 時間 */}
                      {category !== 'CartProduct' && (
                        <TableCell>
                          <div className="w-full flex justify-center items-center flex-col ">
                            <p className="flex flex-col">
                              <span className="text-p-tw ">
                                {toUTC8(item?.startAt)} ～ {toUTC8(item?.endAt)}
                              </span>
                            </p>
                          </div>
                        </TableCell>
                      )}
                      {/* 數量 */}
                      {category === 'CartProduct' && (
                        <TableCell>
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
                        </TableCell>
                      )}
                      {/* 刪除 */}
                      <TableCell>
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
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
