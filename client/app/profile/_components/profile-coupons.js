'use client';

import React, { useState, useEffect } from 'react';
import CouponCard from '@/app/coupons/_components/coupon-card';
import CouponSelected from '@/app/coupons/_components/coupon-selected';
import CouponSelectedStates from '@/app/coupons/_components/coupon-selected-states';
import { Toaster } from '@/components/ui/sonner';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/use-auth';
import Image from 'next/image';

import useSWR from 'swr';
// import useSWRMutation from 'swr/dist/mutation';
import { mutate } from 'swr';

export default function ProfileCoupons(props) {
  // 在 useSWR 呼叫時，就直接傳 inline fetcher
  const {
    data,
    error,
    isLoading,
    mutate: mutateCoupons,
  } = useSWR(
    'http://localhost:3005/api/coupons/usercoupon',
    // 這就是 inline fetcher：直接用 fetch 回傳 Promise
    (url) =>
      fetch(url, {
        credentials: 'include',
      }).then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
  );
  const usercoupon = data?.usercoupon || [];

  console.log(usercoupon);

  // 讀取會員ＩＤ
  const { user, isAuth } = useAuth();

  // 管理每張卡的 已領取 狀態
  // const [used, setUsed] = useState([]);

  // 格式化時間
  const formatDateTime = (d) => {
    new Date(d.setHours(d.getHours() + 8));
    const [date, time] = d.toISOString().split('T');
    return `${date} ${time.split('.')[0]}`;
  };

  // 狀態的判斷
  function getStatus(coupon) {
    const now = Date.now();
    // const start = new Date(coupon.startAt).getTime();
    const end = new Date(coupon.endAt).getTime();

    // if (coupon._used) return '使用';
    if (now > end) return '已過期';
    return '使用';
  }

  // 為了避免點了篩選又重新檢查一次狀態
  const couponsWithStatus = usercoupon?.map((c) => ({
    ...c,
    status: getStatus(c),
  }));

  const [selectedTarget, setSelectedTarget] = useState('全部');
  const [selectedStates, setSelectedStates] = useState();

  // 先將百分比轉換
  function getValue(c) {
    if (c.type === '現金折扣') {
      return c.amount;
    }
    if (c.type === '百分比折扣') {
      return (c.amount / 100) * c.minPurchase;
    }
  }

  // 算出每張券的最低保證折抵值;
  const values = usercoupon.map(getValue);
  const maxValue = Math.max(...values);
  console.log(maxValue);

  // 用 filter 寫出對狀態和分類的篩選
  const filteredData = couponsWithStatus
    ?.filter((c) => {
      if (['全站', '商品', '課程'].includes(selectedTarget)) {
        return c.target === selectedTarget;
      }
      return true;
    })
    ?.filter((c) => {
      switch (selectedStates) {
        // case '最高折扣':
        // 只挑「使用」且是最高折抵值的卡
        // return c.status === '使用' && getValue(c) === maxValue;

        case '即將到期': {
          const now = Date.now();
          return (
            c.status === '使用' &&
            new Date(c.endAt).getTime() - now < 4 * 24 * 60 * 60 * 1000
          );
        }

        case '已過期':
          return c.status === '已過期';

        case '已使用':
          return c.status === '已使用';

        default:
          // '無' 或 undefined：不做任何狀態過濾，保留所有
          return c.status === '使用';
      }
    })
    .sort((a, b) => getValue(b) - getValue(a));

  const targets = ['全部', '全站', '商品', '課程'];
  const states = ['最高折扣', '即將到期', '已使用', '已過期'];

  // 讓第二行的篩選可以按第二次取消
  const toggleState = (state) => {
    setSelectedStates((prev) => (prev === state ? undefined : state));
  };

  // loading / error 處理
  if (isLoading) return <p className="text-center py-4">載入中…</p>;
  if (error)
    return (
      <p className="text-center py-4 text-red-600">讀取失敗：{error.message}</p>
    );

  return (
    <div className="overflow-y-auto h-dvh">
      <section className="flex flex-col gap-6 px-5">
        {/* 開頭 */}
        <a
          href="http://localhost:3000/coupons"
          className="font-tw leading-p-tw cursor-pointer hover:underline decoration-red decoration-2 underline-offset-4 text-right"
        >
          領取更多優惠卷
        </a>

        {/* 分類 */}
        <div className="flex flex-row gap-6">
          {targets.map((target) => {
            return (
              <CouponSelected
                key={target}
                target={target}
                // filteredData={filteredData}
                selectedTarget={selectedTarget}
                setSelectedTarget={setSelectedTarget}
                // state={state}
                selectedStates={selectedStates}
                setSelectedStates={setSelectedStates}
              />
            );
          })}
        </div>

        <hr />

        {/* 狀態分類 */}
        <div className="flex flex-row gap-6">
          {states.map((state) => {
            return (
              <CouponSelectedStates
                key={state}
                state={state}
                selectedStates={selectedStates}
                setSelectedStates={setSelectedStates}
                onClick={() => toggleState(state)}
              />
            );
          })}
        </div>
      </section>

      {/* 優惠劵 */}
      {filteredData.length === 0 ? (
        <div className="flex flex-col justify-center items-center mt-15">
          <Image src="/coupon.png" alt="沒卷" width={140} height={113} />
          <p className="text-h6-tw">目前沒有更多的優惠券可以領取</p>
          <p className="color-primary-800">多多關注我們隨時領取優惠券</p>
        </div>
      ) : (
        <ul className="grid grid-cols-1 justify-items-center gap-x-25 gap-y-6 lg:grid-cols-2 my-10">
          {filteredData?.map((c) => {
            // 顯示狀態
            const isExpired = c.status === '已過期';
            const isUsed = c.status === '已使用';

            // 顯示時間與標籤
            const displayTime = formatDateTime(new Date(c.endAt));
            const timeLabel = '結束';

            // 按鈕文字 & disabled
            let buttonText = '使用';
            {
              /* if (isUsed) buttonText = '已領取'; */
            }
            if (isExpired) buttonText = '已過期';
            const disabled = isExpired || isUsed;

            // 卡片與按鈕樣式
            let statusClass = '';
            if (isUsed) statusClass = 'bg-[#404040]/10';
            else if (isExpired) statusClass = 'bg-[#404040]/10';

            const buttonClass = disabled
              ? 'bg-secondary-800 text-white cursor-default'
              : 'hover:bg-secondary-800 hover:text-white';

            return (
              <li key={c.id}>
                <CouponCard
                  // 原始資料
                  type={c.type}
                  target={c.target}
                  amount={c.amount}
                  minPurchase={c.minPurchase}
                  name={c.name}
                  // 時間顯示
                  displayTime={displayTime}
                  timeLabel={timeLabel}
                  // 狀態
                  statusClass={statusClass}
                  buttonClass={buttonClass}
                  buttonText={buttonText}
                  disabled={disabled}
                  // 互動
                  // onUse={() => handleClaim(c)}
                />
              </li>
            );
          })}
        </ul>
      )}
      <Toaster position="bottom-right" richColors />
    </div>
  );
}
