'use client';

import useSWR from 'swr';
import { useCallback } from 'react';
import {
  Table,
  TableHeader,
  TableRow, // 原始的 TableRow，用於 MotionTableRow 的基礎
  TableHead,
  TableBody,
  TableCell,
  TableCaption,
} from '@/components/ui/table';
import Image from 'next/image';
import FavoriteButton from '@/components/favorite-button'; // 確保此路徑正確
import { useAuth } from '@/hooks/use-auth'; // 確保此路徑正確
import { motion, AnimatePresence } from 'framer-motion'; // 引入 framer-motion
import Link from 'next/link';

// API URL 常數
const API_BASE_URL = 'http://localhost:3005/api';
const ORDERS_API_URL = `${API_BASE_URL}/cart/orders`;
// const PRODUCT_API_URL = `${API_BASE_URL}/products`;

// 通用的 fetcher 函數
const fetcher = async (url) => {
  const res = await fetch(url, {
    credentials: 'include',
  });
  if (!res.ok) {
    const error = new Error('請求資料時發生錯誤。');
    try {
      error.info = await res.json();
    } catch (error) {
      error.info = res.statusText;
    }
    error.status = res.status;
    throw error;
  }
  return res.json();
};

// 創建一個 motion 版本的 TableRow
// 這會讓 TableRow 元件能夠接收 Framer Motion 的動畫屬性，同時保留其原有樣式和功能
const MotionTableRow = motion(TableRow);

export default function ProfileOrders() {
  const { isAuth, isLoading: isLoadingAuth } = useAuth();
  const {
    data: orders,
    error,
    isLoading: ordersLoading,
  } = useSWR(isAuth ? ORDERS_API_URL : null, fetcher);
  const url = 'http://localhost:3005/api/cart/orders';
  console.log(orders);

  return (
    <div className="container mx-0 xl:mx-auto overflow-y-auto h-dvh ">
      <Table className="table-fixed w-full ">
        <TableHeader>
          <TableRow className="">
            <TableHead className="w-16">訂單編號</TableHead>
            <TableHead className="w-1/5 sm:w-1/2 md:w-1/5 px-4">
              課程
            </TableHead><TableHead className="w-1/5 sm:w-1/2 md:w-1/5 px-4">
              揪團活動
            </TableHead>
            <TableHead className="w-1/5 sm:w-1/2 md:w-3/10 px-4">
              商品
            </TableHead>
            <TableHead className="text-right w-[120px]">商品評分</TableHead>
            <TableHead className="text-right">消費金額</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          <AnimatePresence>
            {/* {orders.map((orders) => ( */}
              {/* <MotionTableRow
                key={orders.id}
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{
                  opacity: 0,
                  transition: { opacity: { duration: 0.2, ease: 'easeOut' } },
                }}
              > */}
              {/* <TableCell className="p-2">
                  <div className="flex-none h-16 w-16">
                    {product.image ? (
                      <Image
                        src={product.image}
                        alt={product.name}
                        width={64}
                        height={64}
                        className="h-full w-full object-cover rounded"
                        priority={false}
                      />
                    ) : (
                      <div className="h-full w-full bg-gray-200 rounded flex items-center justify-center text-xs text-gray-500">
                        無圖片
                      </div>
                    )}
                  </div>
                </TableCell> */}
                {/* <TableCell className="font-medium whitespace-normal break-words px-4">
                  <Link
                    href={`/product/${product.id}`}
                    className="hover:text-primary-500 cursor-none"
                  >
                    <p className="line-clamp-3">{product.name}</p>
                  </Link>
                </TableCell>
                <TableCell className="text-right">
                  ${orders.amount?.toLocaleString() ?? 'N/A'}
                </TableCell> */}

                {/* <TableCell className="text-center">
                  <FavoriteButton
                    isFav={favoriteIds.includes(product.id)}
                    onToggle={() => toggleFavorite(product.id)}
                    isAuth={isAuth}
                    variant="circle"
                  />
                </TableCell> */}
              {/* </MotionTableRow> */}
            {/* ))} */}
          </AnimatePresence>
        </TableBody>
      </Table>

      {/* {isAuth && !isLoading && !error && favoriteProducts.length === 0 && (
        <p className="text-center mt-6 text-gray-500">
          您的訂單紀錄目前是空的。
        </p>
      )} */}
    </div>
  );
}
