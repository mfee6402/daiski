// 'use client';

// import { useState, useEffect, useRef } from 'react';
// import useSWR from 'swr';
// import Image from 'next/image';
// import {
//   ChevronUp,
//   ChevronDown,
//   Heart,
//   Share2,
//   Minus,
//   Plus,
// } from 'lucide-react';
// import { Button } from '@/components/ui/button';
// import { useParams } from 'next/navigation';
// import Container from '@/components/container';

// // Swiper v11.2.6 推荐用法
// import { Swiper, SwiperSlide } from 'swiper/react';
// import { Navigation, Mousewheel, Thumbs } from 'swiper/modules';

// import 'swiper/css';
// import 'swiper/css/navigation';
// import 'swiper/css/mousewheel';
// import 'swiper/css/thumbs';

// const fetcher = (url) =>
//   fetch(`http://localhost:3005${url}`).then((r) => r.json());

// export default function ProductDetail() {
//   const { id } = useParams();
//   const { data: product, error } = useSWR(
//     id ? `/api/products/${id}` : null,
//     fetcher
//   );

//   const thumbsSwiper = useRef(null);
//   const [selectedSize, setSelectedSize] = useState(null);
//   const [quantity, setQuantity] = useState(1);

//   useEffect(() => {
//     if (product && selectedSize === null) {
//       const first = product.skus.find((s) => s.stock > 0);
//       if (first) {
//         setSelectedSize(first.sizeId);
//         setQuantity(1);
//       }
//     }
//   }, [product, selectedSize]);

//   if (error) return <p>載入失敗：{error.message}</p>;
//   if (!product) return <p>載入中…</p>;

//   const { images, skus, name, introduction, spec, brand, category } = product;
//   const currentSku = skus.find((s) => s.sizeId === selectedSize) || {};
//   const price = currentSku.price ?? 0;
//   const maxStock = currentSku.stock ?? 0;

//   return (
//     <Container className="z-10 pt-10 pb-20">
//       <div className="flex flex-col gap-8">
//         <div className="flex flex-col md:flex-row gap-8">
//           {/* 上箭頭 */}
//           <div className="hidden md:flex flex-col items-center gap-2">
//             <button
//               className="p-1 hover:text-blue-500 transition-colors"
//               onClick={() => thumbsSwiper.current?.slidePrev()}
//             >
//               <ChevronUp className="w-6 h-6 cursor-pointer" />
//             </button>

//             {/* 小圖 Swiper */}
//             <Swiper
//               onSwiper={(swiper) => (thumbsSwiper.current = swiper)}
//               direction="vertical"
//               slidesPerView={Math.min(4, images.length)} // 動態調整可見數量
//               spaceBetween={8}
//               mousewheel={{ forceToAxis: true }}
//               modules={[Mousewheel, Thumbs]} // 添加Thumbs模組
//               watchSlidesProgress={true} // 添加監聽
//               freeMode={images.length <= 4} // 當數量不足時啟用自由模式
//               className="h-[344px] w-[80px]"
//             >
//               {images.map((src, idx) => (
//                 <SwiperSlide key={idx}>
//                   <button
//                     onClick={() => {
//                       // 雙向同步控制
//                       thumbsSwiper.current?.slideTo(idx);
//                       document
//                         .querySelector('.main-swiper')
//                         ?.swiper?.slideTo(idx);
//                     }}
//                     className={`border-2 w-full h-full aspect-square ${
//                       thumbsSwiper.current?.activeIndex === idx
//                         ? 'border-blue-500'
//                         : 'border-gray-200'
//                     }`}
//                   >
//                     <div className="flex w-full h-full p-1">
//                       <Image
//                         src={src}
//                         alt={`${name} 小圖 ${idx + 1}`}
//                         fill
//                         className="object-cover"
//                       />
//                     </div>
//                   </button>
//                 </SwiperSlide>
//               ))}
//             </Swiper>

//             <button
//               className="p-1 hover:text-blue-500 transition-colors"
//               onClick={() => thumbsSwiper.current?.slideNext()}
//             >
//               <ChevronDown className="w-6 h-6 cursor-pointer" />
//             </button>
//           </div>

//           {/* 主圖 Swiper */}
//           <div className="flex-1 border p-2 max-w-[400px] max-h-[400px] aspect-square">
//             <Swiper
//               modules={[Thumbs]}
//               className="main-swiper w-full h-full"
//               thumbs={{
//                 swiper: thumbsSwiper.current,
//                 slideThumbActiveClass: '!border-blue-500',
//               }}
//               onSlideChange={(swiper) => {
//                 // 添加防錯檢查
//                 if (thumbsSwiper.current && !thumbsSwiper.current.destroyed) {
//                   thumbsSwiper.current.slideTo(swiper.activeIndex);
//                 }
//               }}
//             >
//               {images.map((src, idx) => (
//                 <SwiperSlide key={idx}>
//                   <div className="w-full h-full">
//                     <Image
//                       src={src}
//                       alt={`${name} 圖片 ${idx + 1}`}
//                       fill
//                       className="object-contain"
//                       priority={idx === 0}
//                     />
//                   </div>
//                 </SwiperSlide>
//               ))}
//             </Swiper>
//           </div>

//           {/* 詳細資訊 */}
//           <div className="flex flex-col md:w-1/2">
//             <p className="text-gray-500 mb-2">
//               {category?.name} | {brand?.name}
//             </p>
//             <h1 className="text-2xl font-medium text-gray-800 mb-4">{name}</h1>
//             <p className="text-xl font-bold text-red-600 mb-6">NT$ {price}</p>

//             {/* 尺寸 */}
//             <div className="mb-6">
//               <p className="text-gray-500 mb-2">尺寸</p>
//               <div className="flex gap-2">
//                 {skus.map((s) => {
//                   const isSel = s.sizeId === selectedSize;
//                   return (
//                     <button
//                       key={s.skuId}
//                       onClick={() => s.stock > 0 && setSelectedSize(s.sizeId)}
//                       disabled={s.stock === 0}
//                       className={`
//                         w-12 h-10 border flex items-center justify-center text-sm rounded
//                         ${isSel ? 'bg-primary-600 text-white' : 'border-gray-200 text-gray-800'}
//                         ${
//                           s.stock === 0
//                             ? 'opacity-50 cursor-not-allowed'
//                             : 'hover:bg-primary-500 hover:text-white'
//                         }
//                         transition-colors duration-150`}
//                     >
//                       {s.sizeName}
//                     </button>
//                   );
//                 })}
//               </div>
//               <p className="mt-2 text-sm text-gray-500">庫存：{maxStock} 件</p>
//             </div>

//             {/* 數量 */}
//             <div className="mb-6 flex items-center gap-2">
//               <p className="text-gray-500">數量</p>
//               <div className="flex items-center">
//                 <button
//                   onClick={() => setQuantity((q) => Math.max(1, q - 1))}
//                   className="w-10 h-10 border flex items-center justify-center"
//                 >
//                   <Minus />
//                 </button>
//                 <input readOnly value={quantity} className="w-16 text-center" />
//                 <button
//                   onClick={() => setQuantity((q) => Math.min(maxStock, q + 1))}
//                   className="w-10 h-10 border flex items-center justify-center"
//                 >
//                   <Plus />
//                 </button>
//               </div>
//             </div>

//             {/* 動作按鈕 */}
//             <div className="grid grid-cols-3 gap-4">
//               <Button className="h-12 bg-blue-800 text-white">
//                 加入購物車
//               </Button>
//               <Button variant="outline" className="h-12">
//                 收藏 <Heart className="ml-1" />
//               </Button>
//               <Button className="h-12 bg-blue-500 text-white">
//                 分享 <Share2 className="ml-1" />
//               </Button>
//             </div>
//           </div>
//         </div>

//         {/* 介紹 & 規格 */}
//         <div className="flex flex-col gap-6">
//           <section>
//             <h2 className="text-lg font-semibold mb-2">介紹</h2>
//             <p className="whitespace-pre-wrap">{introduction}</p>
//           </section>
//           <section>
//             <h2 className="text-lg font-semibold mb-2">規格</h2>
//             <p className="whitespace-pre-wrap">{spec}</p>
//           </section>
//         </div>
//       </div>
//     </Container>
//   );
// }

'use client';

import { useState, useEffect, useRef } from 'react';
import useSWR from 'swr';
import Image from 'next/image';
import {
  ChevronUp,
  ChevronDown,
  Heart,
  Share2,
  Minus,
  Plus,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useParams } from 'next/navigation';
import Container from '@/components/container';

// Swiper React integration
import { Swiper, SwiperSlide } from 'swiper/react';
import { Mousewheel, Thumbs } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/mousewheel';
import 'swiper/css/thumbs';

const fetcher = (url) =>
  fetch(`http://localhost:3005${url}`).then((r) => r.json());

export default function ProductDetail() {
  const { id } = useParams();
  const { data: product, error } = useSWR(
    id ? `/api/products/${id}` : null,
    fetcher
  );

  const thumbsSwiperRef = useRef(null);
  const mainSwiperRef = useRef(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [quantity, setQuantity] = useState(1);

  // Initialize default size & quantity
  useEffect(() => {
    if (product && selectedSize === null) {
      const first = product.skus.find((s) => s.stock > 0);
      if (first) {
        setSelectedSize(first.sizeId);
        setQuantity(1);
      }
    }
  }, [product, selectedSize]);

  // Cleanup Swiper instances on unmount
  useEffect(() => {
    return () => {
      if (thumbsSwiperRef.current && !thumbsSwiperRef.current.destroyed) {
        thumbsSwiperRef.current.destroy();
      }
      if (
        mainSwiperRef.current?.swiper &&
        !mainSwiperRef.current.swiper.destroyed
      ) {
        mainSwiperRef.current.swiper.destroy();
      }
    };
  }, []);

  if (error) return <p>載入失敗：{error.message}</p>;
  if (!product) return <p>載入中…</p>;

  const { images, skus, name, introduction, spec, brand, category } = product;
  const currentSku = skus.find((s) => s.sizeId === selectedSize) || {};
  const price = currentSku.price ?? 0;
  const maxStock = currentSku.stock ?? 0;

  return (
    <Container className="z-10 pt-10 pb-20">
      <div className="flex flex-col gap-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* 縮圖區 */}
          <div className="hidden md:flex flex-col items-center gap-2">
            <button
              className="p-1 hover:text-blue-500 transition-colors"
              onClick={() => thumbsSwiperRef.current?.slidePrev()}
            >
              <ChevronUp className="w-6 h-6 cursor-pointer" />
            </button>

            <Swiper
              onSwiper={(swiper) => (thumbsSwiperRef.current = swiper)}
              direction="vertical"
              slidesPerView={Math.min(4, images.length)}
              spaceBetween={8}
              mousewheel={{ forceToAxis: true }}
              modules={[Mousewheel, Thumbs]}
              watchSlidesProgress
              freeMode={images.length <= 4}
              className="h-[344px] w-[80px]"
            >
              {images.map((src, idx) => (
                <SwiperSlide key={idx}>
                  <button
                    onClick={() => {
                      thumbsSwiperRef.current?.slideTo(idx);
                      mainSwiperRef.current?.swiper.slideTo(idx);
                    }}
                    className={`border-2 w-full h-full aspect-square ${
                      thumbsSwiperRef.current?.activeIndex === idx
                        ? 'border-blue-500'
                        : 'border-gray-200'
                    }`}
                  >
                    <div className="flex w-full h-full p-1">
                      <Image
                        src={src}
                        alt={`${name} 小圖 ${idx + 1}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </button>
                </SwiperSlide>
              ))}
            </Swiper>

            <button
              className="p-1 hover:text-blue-500 transition-colors"
              onClick={() => thumbsSwiperRef.current?.slideNext()}
            >
              <ChevronDown className="w-6 h-6 cursor-pointer" />
            </button>
          </div>

          {/* 主圖區 */}
          <div className="flex-1 border p-2 max-w-[400px] max-h-[400px] aspect-square">
            <Swiper
              ref={mainSwiperRef}
              modules={[Thumbs]}
              className="main-swiper w-full h-full"
              thumbs={{ swiper: thumbsSwiperRef.current }}
              onSlideChange={(swiper) => {
                thumbsSwiperRef.current?.slideTo(swiper.activeIndex);
              }}
            >
              {images.map((src, idx) => (
                <SwiperSlide key={idx}>
                  <div className="w-full h-full">
                    <Image
                      src={src}
                      alt={`${name} 圖片 ${idx + 1}`}
                      fill
                      className="object-contain"
                      priority={idx === 0}
                    />
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>

          {/* 詳細資訊 */}
          <div className="flex flex-col md:w-1/2">
            <p className="text-gray-500 mb-2">
              {category?.name} | {brand?.name}
            </p>
            <h1 className="text-2xl font-medium text-gray-800 mb-4">{name}</h1>
            <p className="text-xl font-bold text-red-600 mb-6">NT$ {price}</p>

            {/* 尺寸選擇（僅在有尺寸時顯示） */}
            {skus.some((s) => s.sizeId !== null) && (
              <div className="mb-6">
                <p className="text-gray-500 mb-2">尺寸</p>
                <div className="flex gap-2">
                  {skus
                    .filter((s) => s.sizeId !== null)
                    .map((s) => {
                      const isSel = s.sizeId === selectedSize;
                      return (
                        <button
                          key={s.skuId}
                          onClick={() =>
                            s.stock > 0 && setSelectedSize(s.sizeId)
                          }
                          disabled={s.stock === 0}
                          className={`
                w-12 h-10 border flex items-center justify-center text-sm rounded
                ${isSel ? 'bg-primary-600 text-white' : 'border-gray-200 text-gray-800'}
                ${
                  s.stock === 0
                    ? 'opacity-50 cursor-not-allowed'
                    : 'hover:bg-primary-500 hover:text-white'
                }
                transition-colors duration-150`}
                        >
                          {s.sizeName}
                        </button>
                      );
                    })}
                </div>
              </div>
            )}

            {/* 庫存顯示（無論有無尺寸） */}
            <p className="mt-2 text-sm text-gray-500">庫存：{maxStock} 件</p>

            {/* 數量調整 */}
            <div className="mb-6 flex items-center gap-2">
              <p className="text-gray-500">數量</p>
              <div className="flex items-center">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="w-10 h-10 border flex items-center justify-center"
                >
                  <Minus />
                </button>
                <input readOnly value={quantity} className="w-16 text-center" />
                <button
                  onClick={() => setQuantity((q) => Math.min(maxStock, q + 1))}
                  className="w-10 h-10 border flex items-center justify-center"
                >
                  <Plus />
                </button>
              </div>
            </div>

            {/* 動作按鈕 */}
            <div className="grid grid-cols-3 gap-4">
              <Button className="h-12 bg-blue-800 text-white">
                加入購物車
              </Button>
              <Button variant="outline" className="h-12">
                收藏 <Heart className="ml-1" />
              </Button>
              <Button className="h-12 bg-blue-500 text-white">
                分享 <Share2 className="ml-1" />
              </Button>
            </div>
          </div>
        </div>

        {/* 介紹 & 規格 */}
        <div className="flex flex-col gap-6">
          <section>
            <h2 className="text-lg font-semibold mb-2">介紹</h2>
            <p className="whitespace-pre-wrap">{introduction}</p>
          </section>
          <section>
            <h2 className="text-lg font-semibold mb-2">規格</h2>
            <p className="whitespace-pre-wrap">{spec}</p>
          </section>
        </div>
      </div>
    </Container>
  );
}
