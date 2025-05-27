'use client';

import React, { useState, useEffect } from 'react';
import CouponCard from './_components/coupon-card';
import Container from '@/components/container';
import CouponSelected from './_components/coupon-selected';
import { Toaster } from '@/components/ui/sonner';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/use-auth';
import Image from 'next/image';

import useSWR from 'swr';
// import useSWRMutation from 'swr/dist/mutation';
import useSWRMutation from 'swr/mutation';
import { mutate } from 'swr';

export default function CouponsPage(props) {
  // 在 useSWR 呼叫時，就直接傳 inline fetcher
  const {
    data,
    error,
    isLoading,
    mutate: mutateCoupons,
  } = useSWR(
    'http://localhost:3005/api/coupons',
    // 這就是 inline fetcher：直接用 fetch 回傳 Promise
    (url) =>
      fetch(url, {
        credentials: 'include',
      }).then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
  );
  const coupons = data?.coupons;

  // console.log(data);

  // 使用useSWRMutation來管理讀取post
  const { trigger } = useSWRMutation(
    'http://localhost:3005/api/coupons/claimcoupon',
    (url, { arg }) => {
      return fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', // 若靠 cookie 登入，一定要加
        body: JSON.stringify(arg), // arg 會是 trigger 傳進來的參數 { userId, couponId }
      }).then((r) => {
        if (!r.ok) throw new Error('領取失敗');
        return r.json(); // 後端回資料
      });
    }
  );

  // 讀取會員ＩＤ
  const { user, isAuth } = useAuth();

  // 執行一次領券
  const handleClaim = async (coupon) => {
    try {
      if (!isAuth) return alert('請先登錄');
      await trigger({ couponId: coupon.id }); // 這行才真的 fetch
      mutateCoupons();

      toast.success('已領取優惠券！');
    } catch (e) {
      alert(e.message);
    }
    mutateCoupons((prev) => {
      return {
        ...prev,
        coupons: prev.coupons.map((c) =>
          c.id === coupon.id ? { ...c, _used: true } : c
        ),
      };
    }, false);
  };

  // 執行多次領券
  const handleClaimAll = async () => {
    try {
      if (!isAuth) return alert('請先登錄');
      // 先判斷狀態 讓他是可領取和未領取的
      const claimable = couponsWithStatus?.filter(
        (c) => c.status === '可領取' && !c._used
      );
      // 如果沒有可以領的訊息
      if (!claimable?.length) {
        return toast.info('目前沒有可領取的優惠券');
      }
      // 領取的動作
      await Promise.all(
        claimable.map((c) => trigger({ userId: user.id, couponId: c.id }))
      );
      mutateCoupons();
      toast.success('已領取優惠券！');
    } catch (e) {
      alert(e.message);
    }
    mutateCoupons((prev) => {
      return {
        ...prev,
        coupons: couponsWithStatus.map((c) => {
          if (c.status === '可領取') {
            return {
              ...c,
              _used: true,
            };
          }
          return c;
        }),
      };
    }, false);
  };

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
    const start = new Date(coupon.startAt).getTime();
    const end = new Date(coupon.endAt).getTime();

    if (coupon._used) return '已領取';

    if (now < start) return '尚未開始';
    if (now > end) return '已過期';
    return '可領取';
  }

  // 為了避免點了篩選又重新檢查一次狀態
  const couponsWithStatus = coupons?.map((c) => ({
    ...c,
    status: getStatus(c),
  }));

  const [selectedTarget, setSelectedTarget] = useState('可領取');

  // 用 filter 寫出對狀態和分類的篩選
  const filteredData = couponsWithStatus?.filter((c) => {
    // if (c.status === '已領取') return true;
    if (selectedTarget === '可領取') {
      return c.status === selectedTarget || c.status === '已領取';
    }
    if (selectedTarget === '尚未開始') {
      return c.status === selectedTarget;
    }
    if (['全站', '商品', '課程'].includes(selectedTarget)) {
      //不顯示不能領取的優惠券
      return (
        c.target === selectedTarget &&
        (c.status === '可領取' || c.status === '已領取')
      );
    }
    return true;
  });

  const targets = ['可領取', '尚未開始', '全站', '商品', '課程'];

  // loading / error 處理
  if (isLoading) return <p className="text-center py-4">載入中…</p>;
  if (error)
    return (
      <p className="text-center py-4 text-red-600">讀取失敗：{error.message}</p>
    );

  return (
    <>
      <Container>
        <section className="flex flex-col gap-6 mt-20">
          {/* 開頭 */}
          <div className="flex flex-row items-center justify-between">
            <h5 className="font-tw text-h5-tw">領取優惠劵</h5>
            <a
              href="http://localhost:3000/profile"
              className="font-tw leading-p-tw cursor-pointer hover:underline decoration-red decoration-2 underline-offset-4 "
            >
              查看我的優惠劵
            </a>
          </div>

          {/* 領取 */}
          <div className="border border-primary-600 w-full flex flex-row p-5 items-center justify-around rounded-lg">
            <button className="font-tw leading-p-tw cursor-pointer">
              <a href="http://localhost:3000/game">玩遊戲獲取優惠券</a>
            </button>
            <div className="h-4 w-px border-l-2 border-secondary-800"></div>
            <button
              className="font-tw leading-p-tw cursor-pointer"
              onClick={handleClaimAll}
            >
              一鍵領取優惠劵
            </button>
          </div>

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
                />
              );
            })}
          </div>

          <hr />
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
              const isUpcoming = c.status === '尚未開始';
              const isExpired = c.status === '已過期';
              const isUsed = c.status === '已領取';

              // 顯示時間與標籤
              const displayTime = formatDateTime(
                new Date(isUpcoming ? c.startAt : c.endAt)
              );
              const timeLabel = isUpcoming ? '開始' : '結束';

              // 按鈕文字 & disabled
              let buttonText = '領取';
              if (isUsed) buttonText = '已領取';
              else if (isUpcoming) buttonText = '尚未開始';
              else if (isExpired) buttonText = '已過期';
              const disabled = isExpired || isUsed || isUpcoming;

              // 卡片與按鈕樣式
              let statusClass = '';
              if (isUsed) statusClass = 'bg-[#404040]/10';
              else if (isUpcoming) statusClass = '';
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
                    onUse={() => handleClaim(c)}
                  />
                </li>
              );
            })}
          </ul>
        )}
      </Container>
      <Toaster position="bottom-right" richColors />
    </>
  );
}
