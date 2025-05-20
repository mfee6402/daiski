'use client';

import { motion } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import useSWR from 'swr';
import Link from 'next/link';
import Image from 'next/image';
import {
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Heart,
  Share2,
  Minus,
  Plus,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useParams } from 'next/navigation';
import Container from '@/components/container';

// Swiper React integration
import { Swiper, SwiperSlide } from 'swiper/react';
import { Mousewheel, Thumbs } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/mousewheel';
import 'swiper/css/thumbs';

function useIsMobile(breakpoint = 1024) {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${breakpoint}px)`);
    setIsMobile(mq.matches);
    const onChange = (e) => setIsMobile(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, [breakpoint]);
  return isMobile;
}

const fetcher = (url) =>
  fetch(`http://localhost:3005${url}`).then((r) => r.json());

export default function ProductDetail() {
  const isMobile = useIsMobile();
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

  //清理
  useEffect(() => {
    // 在 effect 作用域內 snapshot 一次
    const thumbsSwiper = thumbsSwiperRef.current;
    const mainSwiperInstance = mainSwiperRef.current?.swiper;

    return () => {
      // cleanup 時用先前 snapshot 的值
      if (thumbsSwiper && !thumbsSwiper.destroyed) {
        thumbsSwiper.destroy();
      }
      if (mainSwiperInstance && !mainSwiperInstance.destroyed) {
        mainSwiperInstance.destroy();
      }
    };
  }, []);

  if (error) return <p>載入失敗：{error.message}</p>;
  if (!product) return <p>載入中…</p>;

  const {
    images,
    skus,
    name,
    introduction,
    spec,
    brand,
    category,
    related = [],
  } = product;
  const currentSku = skus.find((s) => s.sizeId === selectedSize) || {};
  const price = currentSku.price ?? 0;
  const maxStock = currentSku.stock ?? 0;

  return (
    <Container className="z-10 pt-10 pb-20 m-4 xl:mx-auto ">
      {/* ((縮圖區+主圖區) + 詳細資訊區) + 商品介紹區 */}
      <div className="flex flex-col gap-8 xl:p-4">
        {/* (縮圖區+主圖區) + 詳細資訊區 */}
        <div className="flex flex-col lg:flex-row justify-between xl:justify-around">
          {/* 縮圖區 + 主圖區*/}
          <div className="flex flex-col gap-8 lg:flex-row">
            {/* 縮圖區 */}
            <div
              className={` flex gap-2 items-center
    ${isMobile ? 'flex-row overflow-auto' : 'flex-col'}`}
            >
              <button
                className="p-1 hover:text-blue-500 transition-colors"
                onClick={() => thumbsSwiperRef.current?.slidePrev()}
              >
                {isMobile ? (
                  <ChevronLeft className="w-6 h-6 cursor-pointer" />
                ) : (
                  <ChevronUp className="w-6 h-6 cursor-pointer" />
                )}
              </button>

              <Swiper
                onSwiper={(swiper) => (thumbsSwiperRef.current = swiper)}
                direction={isMobile ? 'horizontal' : 'vertical'}
                slidesPerView={Math.min(4, images.length)}
                spaceBetween={8}
                mousewheel={{ forceToAxis: true }}
                modules={[Mousewheel, Thumbs]}
                watchSlidesProgress
                freeMode={images.length <= 4}
                className={`
        ${isMobile ? 'h-[80px] w-full' : 'h-[344px] w-[80px]'}
      `}
              >
                {images.map((src, idx) => (
                  <SwiperSlide key={idx} className="max-h-[80px]">
                    <button
                      onClick={() => {
                        thumbsSwiperRef.current?.slideTo(idx);
                        mainSwiperRef.current?.swiper.slideTo(idx);
                      }}
                      className={`border w-full h-full  aspect-square cursor-pointer ${
                        thumbsSwiperRef.current?.activeIndex === idx
                          ? 'border-blue-500'
                          : 'border-gray-200'
                      }`}
                    >
                      <div className="flex w-full h-full">
                        <Image
                          src={src}
                          alt={`${name} 小圖 ${idx + 1}`}
                          width={80}
                          height={80}
                          className="object-cover w-full h-full"
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
                {isMobile ? (
                  <ChevronRight className="w-6 h-6 cursor-pointer" />
                ) : (
                  <ChevronDown className="w-6 h-6 cursor-pointer" />
                )}
              </button>
            </div>

            {/* 主圖區 */}
            <div className="flex justify-center border w-full  max-w-[400px]  lg:max-w-[300px]  xl:max-w-[400px] aspect-square">
              <Swiper
                ref={mainSwiperRef}
                modules={[Thumbs]}
                className="main-swiper  w-full  lg:max-w-[300px]  xl:max-w-[400px] aspect-square"
                thumbs={{ swiper: thumbsSwiperRef.current }}
                direction={isMobile ? 'horizontal' : 'vertical'}
                onSlideChange={(swiper) => {
                  thumbsSwiperRef.current?.slideTo(swiper.activeIndex);
                }}
              >
                {images.map((src, idx) => (
                  <SwiperSlide key={idx}>
                    <div className="w-full   lg:max-w-[300px]  xl:max-w-[400px] aspect-square">
                      <Image
                        src={src}
                        alt={`${name} 圖片 ${idx + 1}`}
                        width={10}
                        height={10}
                        className="object-contain w-full  lg:max-w-[300px]  xl:max-w-[400px] aspect-square"
                        priority={idx === 0}
                      />
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </div>

          {/* 詳細資訊 */}
          <div className="flex flex-col gap-4">
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

        <div className="flex flex-col lg:flex-row gap-8">
          {/* 介紹 & 規格 */}
          {/* <div className="flex flex-col gap-6 w-2/3 ">
            <section className="flex flex-col mt-12">
              <h2 className="text-xl font-semibold mb-4 pl-10">介紹</h2>
              <div
                className=" whitespace-pre-wrap"
                dangerouslySetInnerHTML={{ __html: introduction }}
              />
            </section>
            <section className="flex flex-col">
              <h2 className="text-lg font-semibold mb-2 ">規格</h2>
              <p className="whitespace-pre-wrap leading-loose">{spec}</p>
            </section>
          </div> */}

          {/* 介紹 & 規格 Tabs */}

          <Tabs
            defaultValue="introduction"
            className="mt-12 w-2/3 border rounded-md p-4"
          >
            <TabsList className="flex w-1/2">
              <TabsTrigger value="introduction">介紹</TabsTrigger>
              <TabsTrigger value="spec">規格</TabsTrigger>
            </TabsList>

            <TabsContent value="introduction">
              <div
                className=" mt-4 leading-loose"
                dangerouslySetInnerHTML={{ __html: introduction }}
              />
            </TabsContent>

            <TabsContent value="spec">
              <p className="whitespace-pre-wrap mt-4 leading-loose">{spec}</p>
            </TabsContent>
          </Tabs>

          {/* 相關商品區 */}
          {related.length > 0 && (
            <section className="mt-12 w-1/3 border rounded-md p-4">
              <h2 className="text-xl font-semibold mb-4">相關商品</h2>
              <ul className="grid grid-cols-2 gap-4">
                {related.map((item) => (
                  // <Link
                  //   key={item.id}
                  //   href={`/product/${item.id}`}
                  //   className="block border rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
                  // >
                  //   <div className="aspect-square w-full relative">
                  //     <Image
                  //       src={item.image}
                  //       alt={item.name}
                  //       fill
                  //       className="object-cover"
                  //     />
                  //   </div>
                  //   <div className="p-2">
                  //     <p className="text-sm text-gray-700 truncate">
                  //       {item.name}
                  //     </p>
                  //     <p className="text-base font-bold mt-1">
                  //       NT$ {item.price}
                  //     </p>
                  //   </div>
                  // </Link>
                  <motion.li
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ type: 'spring', stiffness: 80, damping: 10 }}
                    viewport={{ once: true, amount: 0.2 }}
                  >
                    <Link href={`/product/${item.id}`}>
                      <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                        {/* 小尺寸縮圖區 */}
                        <CardHeader className="w-full aspect-[4/3] overflow-hidden rounded-xl">
                          <Image
                            src={item.image || '/placeholder.jpg'}
                            alt={item.name}
                            width={10}
                            height={10}
                            className="w-full h-full object-cover transition duration-300 hover:scale-110"
                          />
                        </CardHeader>

                        {/* 內容區：名字 + 價格 */}
                        <CardContent className="p-2">
                          <CardTitle className="text-sm font-medium line-clamp-2 hover:text-primary-500">
                            {item.name}
                          </CardTitle>
                          <p className="text-sm font-semibold text-red-500 mt-1">
                            NT$ {item.price}
                          </p>
                        </CardContent>

                        {/* 可選：如果有必要可以放額外 footer */}
                        {/* <CardFooter className="p-2 pt-0">
              <p className="text-xs text-gray-500">評價：{item.rating || '—'}</p>
            </CardFooter> */}
                      </Card>
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </section>
          )}
        </div>
      </div>
    </Container>
  );
}
