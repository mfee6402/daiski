'use client';

import useSWR from 'swr';
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  TableCaption,
} from '@/components/ui/table';
import { useAuth } from '@/hooks/use-auth';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
// import RateButton from '@/components/rate-button';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { PiStarThin } from 'react-icons/pi';
import RateButton from '@/components/rate-button';
import { Rat } from 'lucide-react';
/* -------------------- 常數 -------------------- */
const API_BASE_URL = 'http://localhost:3005/api';
const ORDERS_API_URL = `${API_BASE_URL}/cart/orders`;

/* -------------------- 通用 fetcher -------------------- */
const fetcher = async (url) => {
  const res = await fetch(url, { credentials: 'include' });
  if (!res.ok) {
    const err = new Error('請求失敗');
    err.status = res.status;
    try {
      err.info = await res.json();
    } catch {
      err.info = res.statusText;
    }
    throw err;
  }
  return res.json(); // { status, orders }
};

/* -------------------- 動畫用 TableRow -------------------- */
const MotionTableRow = motion(TableRow);

/* -------------------- 元件 -------------------- */
export default function ProfileOrders() {
  const { isAuth, isLoading: authLoading } = useAuth();

  const {
    data, // { status, orders }
    error,
    isLoading, // 訂單載入狀態
  } = useSWR(isAuth ? ORDERS_API_URL : null, fetcher);

  const orders = data?.orders ?? [];

  /* ---------- 介面狀態 ---------- */
  if (authLoading || isLoading) return <p className="p-4">載入中…</p>;
  if (error)
    return <p className="p-4 text-red-500">載入失敗：{error.message}</p>;
  if (orders.length === 0) return <p className="p-4">目前沒有訂單紀錄</p>;

  /* ---------- 主畫面 ---------- */
  return (
    <div className="container mx-0 xl:mx-auto overflow-y-auto h-dvh p-4">
      <Accordion type="multiple" className="space-y-4">
        {orders.map((order) => (
          <AccordionItem key={order.id} value={`order-${order.id}`}>
            {/* === 折疊列 – 訂單摘要 === */}
            <AccordionTrigger className="flex justify-self-start items-center pr-4 text-right">
              <div className="">
                <span className="font-semibold">訂單 #{order.id}</span>
              </div>
              <div className="">
                <span className="text-sm text-muted-foreground">
                  {new Date(order.createdAt).toLocaleString('zh-TW')}
                </span>
              </div>
              <div className="w-[180px]">
                <span>NT$ {order.amount.toLocaleString()}</span>
              </div>
            </AccordionTrigger>

            {/* === 展開內容 – 三張表格 === */}
            <AccordionContent className="space-y-8 pt-4">
              {/* 1️⃣ 商品一覽 */}
              {order.OrderProduct?.length > 0 && (
                <section>
                  <h3 className="mb-2 text-lg font-medium">商品</h3>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-20">預覽</TableHead>
                        <TableHead>名稱</TableHead>
                        <TableHead className="w-24 text-center">評價</TableHead>
                        <TableHead className="w-24 text-center">數量</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {order.OrderProduct.map((p) => (
                        <TableRow key={`product-${order.id}-${p.id}`}>
                          <TableCell>
                            <Image
                              src={`http://localhost:3005/${p.imageUrl}`}
                              alt={p.name}
                              width={60}
                              height={60}
                              className="rounded-md object-cover"
                            />
                          </TableCell>
                          <TableCell className="font-medium">
                            {p.name}
                          </TableCell>
                          <TableCell className="text-center ">
                            {/* 評價的button放這邊 */}
                            {/* <button className="">
                              <PiStarThin />
                            </button> */}
                            {console.log(p)}
                            <RateButton
                              orderId={order.id}
                              productSkuId={p.id}
                            />
                          </TableCell>
                          <TableCell className="text-center">
                            {p.quantity}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </section>
              )}

              {/* 2️⃣ 課程一覽 */}
              {order.OrderCourse?.length > 0 && (
                <section>
                  <h3 className="mb-2 text-lg font-medium">課程</h3>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-20">預覽</TableHead>
                        <TableHead>名稱</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {order.OrderCourse.map((c, idx) => (
                        <TableRow key={`course-${order.id}-${idx}`}>
                          <TableCell>
                            <Image
                              src={`http://localhost:3005/${c.imageUrl}`}
                              alt={c.name}
                              width={60}
                              height={60}
                              className="rounded-md object-cover"
                            />
                          </TableCell>
                          <TableCell className="font-medium">
                            {c.name}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </section>
              )}

              {/* 3️⃣ 揪團一覽 */}
              {order.OrderGroup?.length > 0 && (
                <section>
                  <h3 className="mb-2 text-lg font-medium">揪團</h3>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-20">預覽</TableHead>
                        <TableHead>名稱</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {order.OrderGroup.map((g, idx) => (
                        <TableRow key={`group-${order.id}-${idx}`}>
                          <TableCell>
                            <Image
                              src={`http://localhost:3005/${g.imageUrl}`}
                              alt={g.name}
                              width={60}
                              height={60}
                              className="rounded-md object-cover"
                            />
                          </TableCell>
                          <TableCell className="font-medium">
                            {g.name}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </section>
              )}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
