'use client';

import React, { useState, useEffect } from 'react';
import CouponCard from './_components/coupon-card';
import Container from '@/components/container';
import CouponSelected from './_components/coupon-selected';
import { Toaster } from '@/components/ui/sonner';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/use-auth';

import useSWR from 'swr';
// import useSWRMutation from 'swr/dist/mutation';
import useSWRMutation from 'swr/mutation';
import { mutate } from 'swr';
import { CloudCog } from 'lucide-react';

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
      fetch(url).then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
  );
  // 幫你加的
  const coupons = data?.coupons;

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
      mutateCoupons();
      alert(e.message);
    }
    mutateCoupons((prev) => {
      // if (!prev || !Array.isArray(prev.coupons)) return prev
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
      await Promise.all(
        coupons.map((c) => trigger({ userId: user.id, couponId: c.id }))
      );
      // await trigger({ couponId: coupon.id }); // 這行才真的 fetch
      mutateCoupons();

      toast.success('已領取優惠券！');
    } catch (e) {
      mutateCoupons();
      alert(e.message);
    }
    mutateCoupons((prev) => {
      // if (!prev || !Array.isArray(prev.coupons)) return prev
      return {
        ...prev,
        coupons: prev.coupons.map((c) => ({ ...c, _used: true })),
      };
    }, false);
  };

  // console.log(handleClaim);

  // 管理每張卡的 已領取 狀態
  const [used, setUsed] = useState([]);

  // 單張領取
  // const handleUse = (id) => {
  //   setUsed((prev) => ({ ...prev, [id]: true }));
  // };

  // 一鍵領取：把所有 coupon.id 全部設為 true
  // const handleClaimAll = () => {
  //   const newUsed = {};
  //   coupons.forEach((c) => {
  //     newUsed[c.id] = true;
  //   });
  //   // setUsed(newUsed);
  //   toast('已一鍵領取所有優惠券！');
  // };

  // 格式化時間
  const formatDateTime = (d) => {
    const [date, time] = d.toISOString().split('T');
    return `${date} ${time.split('.')[0]}`;
  };

  // 篩選
  const [selectedTarget, setSelectedTarget] = useState('全部');

  const filteredData =
    selectedTarget === '全部'
      ? coupons
      : coupons?.filter((item) => item.target === selectedTarget);

  const targets = ['全部', '課程', '全站', '商品'];

  // sonner
  // const showSonner = useSonner();

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
            <button className="font-tw leading-p-tw cursor-pointer">
              我的優惠劵
            </button>
          </div>

          {/* 領取 */}
          <div className="border border-primary-600 w-full flex flex-row p-5 items-center justify-around rounded-lg">
            <button className="font-tw leading-p-tw cursor-pointer">
              玩遊戲獲取優惠卷
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
                  selectedTarget={selectedTarget}
                  setSelectedTarget={setSelectedTarget}
                />
              );
            })}
          </div>

          <hr />
        </section>

        {/* 優惠劵 */}
        <ul className="grid grid-cols-1 justify-items-center gap-x-25 gap-y-6 lg:grid-cols-2 my-10">
          {filteredData?.map((c) => {
            const now = Date.now();
            const start = new Date(c.startAt).getTime();
            const end = new Date(c.endAt).getTime();

            // 完整狀態判斷
            const isUpcoming = now < start;
            const isExpired = now > end;
            {
              /* const isUsed = used.includes(c.id); */
            }
            const isUsed = c._used;

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
            const disabled = isExpired || isUsed;

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
      </Container>
      <Toaster position="bottom-right" richColors />
    </>
  );
}
