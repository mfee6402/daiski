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
import RateButton from '@/components/rate-button';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
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

  /* SWR 只有登入後才打 API；未登入傳 null → SWR 會暫停 */
  const {
    data, // { status, orders }
    error,
    isLoading: ordersLoading,
  } = useSWR(isAuth ? ORDERS_API_URL : null, fetcher);

  const orders = data?.orders ?? [];

  /* ---------- 介面狀態 ---------- */
  if (authLoading || ordersLoading) return <p className="p-4">載入中…</p>;
  if (error)
    return <p className="p-4 text-red-500">載入失敗：{error.message}</p>;
  if (orders.length === 0) return <p className="p-4">目前沒有訂單紀錄</p>;

  /* ---------- 主畫面 ---------- */
  return (
    <div className="container mx-0 xl:mx-auto overflow-y-auto h-dvh">
      <Table className="w-full table-fixed">
        <TableCaption>歷史訂單</TableCaption>

        <TableHeader>
          <TableRow>
            <TableHead className="w-20">訂單編號</TableHead>
            <TableHead className="w-1/5">課程</TableHead>
            <TableHead className="w-1/5">揪團活動</TableHead>
            <TableHead className="w-2/5">商品 (數量)</TableHead>

            <TableHead className="text-right w-28">消費金額</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          <AnimatePresence initial={false}>
            {orders.map((o) => (
              <MotionTableRow
                key={o.id}
                layout
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 4, transition: { duration: 0.2 } }}
              >
                {/* 訂單編號 */}
                <TableCell>{o.id}</TableCell>

                {/* 課程 (列出多筆以「、」隔開) */}
                <TableCell className="whitespace-normal break-words">
                  {o.OrderCourse.map((c) => c.name).join('、')}
                </TableCell>

                {/* 揪團活動 */}
                <TableCell className="whitespace-normal break-words">
                  {o.OrderGroup.map((g) => g.name).join('、')}
                </TableCell>

                {/* 商品含數量 */}
                <TableCell className="whitespace-normal break-words">
                  {o.OrderProduct.map((p) => `${p.name} ×${p.quantity}`).join(
                    '、'
                  )}
                </TableCell>

                {/* 金額 */}
                <TableCell className="text-right font-medium">
                  NT$ {o.amount.toLocaleString()}
                </TableCell>
              </MotionTableRow>
            ))}
          </AnimatePresence>
        </TableBody>
      </Table>
    </div>
  );
}
