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
    return `${d} ${t.split('.')[0].slice(0, 5)}`;
  };

  return (
    <>
      <Card className="shadow-lg bg-card text-card-foreground dark:bg-card-dark dark:text-card-foreground-dark border border-border dark:border-border-dark">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">
            {titleMap[category]}
          </CardTitle>
        </CardHeader>

        <CardContent>
          <div className=" ">
            <Table>
              {/* FIXME hover拿掉 */}
              <TableHeader>
                <TableRow className="w-full">
                  <TableHead>圖片</TableHead>
                  <TableHead>名稱</TableHead>
                  <TableHead className="text-center">{`${category === 'CartProduct' ? '尺寸' : '價格'}`}</TableHead>
                  <TableHead className="text-center">{`${category === 'CartProduct' ? '總價' : '日期'}`}</TableHead>
                  <TableHead className="text-center">{`${category === 'CartProduct' ? '數量' : ''}`}</TableHead>
                  <TableHead className=""></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {cart[category]?.map((item) => {
                  const totalPrice = (
                    item.price * (item.quantity ? item.quantity : 1)
                  ).toLocaleString();

                  return (
                    <TableRow key={item.id}>
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
                        <div className="">
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
                          <div className="flex justify-center w-full items-center gap-6">
                            <QuantityButton
                              item={item}
                              category={category}
                              type="minus"
                            ></QuantityButton>
                            <div className="flex justify-center">
                              <p className="">{item.quantity}</p>
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
                          {/* FIXME 課程跟揪團也要 */}
                          {/* FIXME 揪團刪除路由localhost:3005/api/group/members/${groupMemberId} */}

                          <Delete
                            name={item.name}
                            category={category}
                            item={item}
                          ></Delete>
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
