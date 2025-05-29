import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/grid';

import 'swiper/css/navigation';
import { useCart } from '@/hooks/use-cart';
import { Grid, Navigation } from 'swiper/modules';

export default function SwiperTailwind() {
  const { cart } = useCart();

  return (
    <div className="h-50 p-4 ">
      <Swiper
        slidesPerView={3}
        grid={{ rows: 1 }}
        spaceBetween={15}
        navigation={true}
        allowTouchMove={false}
        simulateTouch={false}
        modules={[Grid, Navigation]}
        className=" xl:w-300 lg:250 h-full"
      >
        {cart.CartCoupon?.map((item) => {
          const name = item.name;
          const type = item.type;
          const endAt = new Date(item.endAt).toLocaleString();
          const amount = item.amount;
          const target = item.target;
          return (
            <SwiperSlide
              key={item.id}
              className="flex items-center justify-center  bg-amber-400"
            >
              <p>名稱:{name}</p>
              <p>對象:{target}</p>
              <p>類型:{type}</p>
              <p>結束時間:{endAt}</p>
              <p>折抵金額:{amount}</p>
              <div className="flex justify-end">
                <button onClick={console.log('OK')}>使用</button>
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </div>
  );
}
