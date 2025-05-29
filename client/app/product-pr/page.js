// pages/product-pr.jsx
'use client';
import React, { useRef, useEffect, useState } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { FiCheckCircle } from 'react-icons/fi';
import Link from 'next/link';

const snowParticleCount = 60;

const SnowParticle = () => {
  const [style, setStyle] = useState({});

  useEffect(() => {
    setStyle({
      position: 'absolute',
      left: `${Math.random() * 100}vw`,
      top: `${Math.random() * 100}vh`,
      width: `${Math.random() * 3 + 1}px`,
      height: `${Math.random() * 3 + 1}px`,
      backgroundColor: 'white',
      borderRadius: '50%',
      opacity: Math.random() * 0.5 + 0.2,
      pointerEvents: 'none',
      zIndex: 5,
    });
  }, []);

  return (
    <motion.div
      style={style}
      animate={{
        y: [0, 100, 0], // Simple up/down movement for placeholder
        x: [0, Math.random() * 20 - 10, 0], // Simple side-to-side
        opacity: [0.3, 0.8, 0.3], // Fade in/out
      }}
      transition={{
        duration: Math.random() * 10 + 10, // Longer, varied duration
        repeat: Infinity,
        ease: 'linear',
      }}
    />
  );
};

const bgGradient =
  'linear-gradient(135deg, #43C6DB 0%, #74C6FA 20%, #B1B4FF 50%, #E6B3FF 80%, #FFD1E4 100%)';

export default function ProductPR() {
  return (
    <>
      <Head>
        <title>X-2000 極限滑雪板 宣傳頁</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <main className="flex flex-col items-center overflow-hidden bg-gray-50">
        <Hero />
        <GradientDivider />
        <ParallaxSection
          id="durability"
          title="堅不可摧的耐用性"
          text="採用軍用級複合材料，無懼任何嚴酷考驗，讓您盡情釋放滑雪激情。"
          image="/ProductPicture (4).jfif"
        />
        <AnimatedPattern />
        <Features />
        <WavyDivider />
        <ParallaxSection
          id="design"
          title="劃時代的設計美學"
          text="流線造型與人體工學完美結合，不僅賞心悅目，更提供無與倫比的操控體驗。"
          reverse
          image="/ProductPicture (4).jfif"
        />
        <Gallery />
        <DiagonalDivider />
        <ParallaxSection
          id="control"
          title="精準靈敏的操控"
          text="先進的抓地技術與輕盈的板身設計，讓您在雪地上如魚得水，精準掌控每一次轉彎。"
          image="/ProductPicture (4).jfif"
        />
        <Testimonials />
        <FooterCTA />
      </main>
    </>
  );
}

function Hero() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });

  const bgScale = useTransform(scrollYProgress, [0, 1], [1.1, 1.3]);
  const bgOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0.5]);
  const textY = useTransform(scrollYProgress, [0, 0.5], [0, -100]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.6, 0.8], [1, 1, 0]);
  const blur = useTransform(scrollYProgress, [0, 0.3], ['0px', '8px']);
  const rotate = useTransform(scrollYProgress, [0, 1], ['0deg', '-5deg']);

  const springConfig = { stiffness: 100, damping: 30, restDelta: 0.001 };
  const smoothTextY = useSpring(textY, springConfig);
  const smoothBgScale = useSpring(bgScale, springConfig);

  return (
    <section ref={ref} className="relative w-full h-screen overflow-hidden">
      <div className="absolute inset-0" style={{ background: bgGradient }} />
      {Array.from({ length: snowParticleCount }).map((_, i) => (
        <SnowParticle key={`hero-snow-${i}`} />
      ))}
      <motion.div
        className="absolute inset-0 overflow-hidden"
        style={{
          scale: smoothBgScale,
          opacity: bgOpacity,
          filter: blur,
          rotate,
        }}
      >
        <Image
          src="/ProductPicture (4).jfif"
          alt="X-2000 極限滑雪板"
          fill
          className="object-cover"
          priority
        />
      </motion.div>
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center text-white px-6">
        <motion.h1
          className="text-6xl md:text-8xl font-bold mb-6 drop-shadow-xl"
          style={{ y: smoothTextY, opacity: textOpacity }}
        >
          X-2000
        </motion.h1>
        <motion.p
          className="text-2xl md:text-3xl mb-8 drop-shadow-lg"
          style={{
            y: useTransform(smoothTextY, (v) => v * 0.8),
            opacity: textOpacity,
          }}
          transition={{ delay: 0.1 }}
        >
          駕馭寒冬，征服雪域
        </motion.p>
        <motion.div
          style={{
            opacity: textOpacity,
            scale: useTransform(textOpacity, [0, 1], [0.8, 1]),
          }}
          transition={{ delay: 0.2 }}
        >
          <CTA href="#features">探索卓越性能</CTA>
        </motion.div>
      </div>
    </section>
  );
}

function ParallaxSection({ id, title, text, reverse = false, image }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const imageY = useTransform(
    scrollYProgress,
    [0, 1],
    [reverse ? '40%' : '-40%', reverse ? '-20%' : '20%']
  );
  const textY = useTransform(scrollYProgress, [0, 1], ['20%', '-20%']);
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [0, 1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 1.05, 0.8]);
  const rotate = useTransform(
    scrollYProgress,
    [0, 1],
    [reverse ? '-15deg' : '15deg', '0deg']
  );

  const springConfig = { stiffness: 50, damping: 20 };
  const smoothImageY = useSpring(imageY, springConfig);
  const smoothTextY = useSpring(textY, springConfig);
  const smoothScale = useSpring(scale, springConfig);
  const smoothRotate = useSpring(rotate, springConfig);

  return (
    <section
      id={id}
      ref={ref}
      className={`relative w-full h-screen overflow-hidden flex items-center justify-center ${reverse ? 'flex-row-reverse bg-gray-800' : 'bg-gray-700'}`}
    >
      <motion.div
        className="absolute inset-0 overflow-hidden"
        style={{ y: smoothImageY, scale: smoothScale, rotate: smoothRotate }}
      >
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover opacity-60"
          style={{ transformOrigin: 'center' }}
        />
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-black/50 to-transparent"
          style={{ opacity }}
        />
      </motion.div>
      <motion.div
        className="relative z-10 max-w-2xl px-8 text-white text-center"
        style={{ y: smoothTextY, opacity, scale: smoothScale }}
      >
        <h2 className="text-5xl md:text-6xl font-extrabold mb-8 drop-shadow-2xl">
          {title}
        </h2>
        <p className="text-xl md:text-2xl leading-relaxed drop-shadow-xl">
          {text}
        </p>
      </motion.div>
    </section>
  );
}

function Features() {
  const features = [
    {
      title: '超輕航太材質',
      desc: '極致輕盈，提供無與倫比的靈活性與速度。',
      icon: FiCheckCircle,
    },
    {
      title: '全地形適應',
      desc: '無論是陡峭山峰還是平緩雪道，都能輕鬆駕馭。',
      icon: FiCheckCircle,
    },
    {
      title: '卓越穩定性',
      desc: '高速滑行和急轉彎時，依舊保持驚人的穩定性。',
      icon: FiCheckCircle,
    },
    {
      title: '持久耐用',
      desc: '頂級材料和工藝，確保雪板經久耐用，陪伴您征戰多年。',
      icon: FiCheckCircle,
    },
  ];
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start 70%', 'end 30%'],
  });
  const scaleTitle = useTransform(scrollYProgress, [0, 0.5], [0.8, 1]);
  const opacityTitle = useTransform(scrollYProgress, [0, 0.5], [0, 1]);

  return (
    <section
      id="features"
      ref={containerRef}
      className="py-24 px-6 bg-gradient-to-br from-white to-slate-100"
    >
      <motion.div
        className="max-w-6xl mx-auto text-center mb-16"
        style={{ scale: scaleTitle, opacity: opacityTitle }}
      >
        <h2 className="text-5xl font-extrabold text-gray-800 mb-8 drop-shadow-md">
          核心優勢
        </h2>
        <p className="text-xl text-gray-700 leading-relaxed drop-shadow-md">
          X-2000 滑雪板，以卓越性能重新定義滑雪體驗。
        </p>
      </motion.div>
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
        {features.map((f, i) => (
          <FeatureItem key={i} feature={f} index={i} />
        ))}
      </div>
    </section>
  );
}

function FeatureItem({ feature, index }) {
  const variants = {
    hidden: { opacity: 0, y: 50, rotateX: -30, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      rotateX: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        delay: index * 0.15,
        ease: 'easeOut', // CORRECTED
      },
    },
  };

  return (
    <motion.div
      className="bg-white rounded-2xl shadow-xl p-8 flex flex-col items-center text-center hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
      variants={variants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      style={{ perspective: 800 }}
    >
      <motion.div
        className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center mb-6 shadow-lg"
        whileHover={{ scale: 1.1, rotate: 15 }}
      >
        <feature.icon className="text-3xl" />
      </motion.div>
      <h3 className="font-semibold text-2xl text-gray-800 mb-3">
        {feature.title}
      </h3>
      <p className="text-gray-700 leading-relaxed text-md">{feature.desc}</p>
    </motion.div>
  );
}

function Gallery() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const opacityTitle = useTransform(
    scrollYProgress,
    [0, 0.2, 0.8, 1],
    [0, 1, 1, 0]
  );
  const yTitle = useTransform(
    scrollYProgress,
    [0, 0.2, 0.8, 1],
    [50, 0, 0, -50]
  );

  const itemVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
        ease: 'easeOut',
      },
    }),
  };

  return (
    <section
      id="gallery"
      ref={ref}
      className="py-24 w-full bg-slate-50 overflow-hidden"
    >
      <motion.div
        className="max-w-6xl mx-auto text-center mb-16"
        style={{ opacity: opacityTitle, y: yTitle }}
      >
        <h2 className="text-5xl font-extrabold text-gray-800 mb-8 drop-shadow-md">
          產品展示
        </h2>
        <p className="text-xl text-gray-700 leading-relaxed drop-shadow-md">
          多角度欣賞 X-2000 的精湛工藝與設計細節。
        </p>
      </motion.div>
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 px-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <motion.div
            key={i}
            custom={i}
            variants={itemVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
          >
            <Image
              src="/ProductPicture (4).jfif"
              alt={`產品圖 ${i}`}
              width={600}
              height={400}
              className="object-cover w-full h-full"
              loading="lazy"
            />
          </motion.div>
        ))}
      </div>
    </section>
  );
}

function Testimonials() {
  const testimonialsData = [
    {
      author: '艾米麗',
      text: '這塊滑雪板讓我找回了飛翔的感覺！輕盈、靈敏、穩定，簡直是雪地上的藝術品。',
      rating: 5,
    },
    {
      author: '傑克',
      text: 'X-2000 的設計太棒了，不僅外觀吸睛，操控性更是無可挑剔。強烈推薦給所有追求極致體驗的滑雪愛好者！',
      rating: 5,
    },
    {
      author: '李維',
      text: '作為一名滑雪教練，我試過無數雪板，X-2000 的表現絕對是頂尖的。它能幫助你提升技巧，享受每一次滑行。',
      rating: 4,
    },
  ];
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const containerRotateX = useTransform(scrollYProgress, [0, 1], [15, -15]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

  const springContainerRotateX = useSpring(containerRotateX, {
    stiffness: 40,
    damping: 15,
  });

  return (
    <section
      id="testimonials"
      ref={ref}
      className="py-24 w-full bg-gradient-to-br from-indigo-700 via-purple-700 to-pink-700 text-white overflow-hidden"
    >
      <motion.div
        className="max-w-6xl mx-auto text-center mb-16"
        style={{
          opacity: useTransform(opacity, (v) => Math.max(0, v * 1.5 - 0.2)),
          y: useTransform(opacity, [0, 1], [30, 0]),
        }}
      >
        <h2 className="text-5xl font-extrabold mb-8 drop-shadow-lg">
          使用者心聲
        </h2>
        <p className="text-xl leading-relaxed drop-shadow-md">
          聽聽其他滑雪愛好者如何評價 X-2000。
        </p>
      </motion.div>
      <motion.div
        className="relative max-w-7xl mx-auto px-6"
        style={{ perspective: 1200 }}
      >
        <motion.div
          className="flex gap-10 overflow-x-auto scroll-smooth pb-10 snap-x snap-mandatory"
          style={{ rotateX: springContainerRotateX, opacity }}
        >
          {testimonialsData.map((t, i) => (
            <motion.div
              key={i}
              className="min-w-[90%] sm:min-w-[70%] md:min-w-[50%] lg:min-w-[35%] bg-white/10 rounded-2xl p-10 flex-shrink-0 shadow-xl backdrop-blur-lg snap-center"
              whileHover={{
                scale: 1.03,
                boxShadow: '0px 10px 30px rgba(0,0,0,0.3)',
              }}
              transition={{ duration: 0.3 }}
              initial={{ opacity: 0, y: 20, rotateY: -10 }}
              whileInView={{
                opacity: 1,
                y: 0,
                rotateY: 0,
                transition: { delay: i * 0.15, duration: 0.5 },
              }}
              viewport={{ once: true, amount: 0.3 }}
            >
              <div className="flex mb-4">
                {Array.from({ length: t.rating }).map((_, starIdx) => (
                  <svg
                    key={starIdx}
                    className="w-5 h-5 text-yellow-400 fill-current"
                    viewBox="0 0 20 20"
                  >
                    <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                  </svg>
                ))}
              </div>
              <p className="text-lg italic mb-6 leading-relaxed">{t.text}</p>
              <p className="font-semibold text-right text-xl">— {t.author}</p>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}

function FooterCTA() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });
  const y = useTransform(scrollYProgress, [0, 1], [100, 0]);
  const opacity = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <motion.section
      ref={ref}
      style={{ y, opacity }}
      className="py-24 w-full bg-gray-100 flex justify-center items-center"
    >
      <div className="max-w-3xl text-center px-8">
        <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-8">
          準備好體驗極限了嗎？
        </h2>
        <p className="text-lg md:text-xl text-gray-700 mb-12">
          X-2000
          極限滑雪板將帶您進入前所未有的滑雪境界。立即行動，開啟您的雪地冒險之旅！
        </p>
        <CTA href="/product/45">立即購買 X-2000</CTA>
      </div>
    </motion.section>
  );
}

function CTA({ href, children }) {
  return (
    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
      <Link
        href={href}
        className="px-12 py-5 bg-gradient-to-br from-red-500 via-red-600 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white font-extrabold rounded-full shadow-xl text-lg transition-all duration-300 active:scale-95"
      >
        {children}
      </Link>
    </motion.div>
  );
}

function GradientDivider() {
  return (
    <div className="w-full h-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 shadow-lg" />
  );
}

function WavyDivider() {
  return (
    <div className="w-full overflow-hidden leading-[0px]">
      <svg
        viewBox="0 0 1200 120"
        preserveAspectRatio="none"
        className="relative block w-full h-[80px] md:h-[120px] fill-gray-100"
      >
        <path d="M0,64 C200,0 400,120 600,64 C800,0 1000,120 1200,64 L1200,120 L0,120 Z" />
      </svg>
    </div>
  );
}

function DiagonalDivider() {
  return (
    <div className="h-20 md:h-32 bg-gradient-to-r from-slate-100 to-gray-50 transform -skew-y-3 my-[-1px]"></div>
  );
}

function AnimatedPattern() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [0, 0.2, 0]);
  const y = useTransform(scrollYProgress, [0, 1], ['-20%', '20%']);
  const scale = useTransform(scrollYProgress, [0.3, 0.7], [1, 1.1]);
  const rotate = useTransform(scrollYProgress, [0, 1], ['-5deg', '5deg']);

  const numLines = 30;
  const lines = Array.from({ length: numLines });

  const containerStyle = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    overflow: 'hidden',
    pointerEvents: 'none',
    zIndex: 0,
  };

  const lineBaseStyle = {
    position: 'absolute',
    width: '2px',
    height: '150%',
    left: '50%',
    top: '-25%',
    backgroundColor: 'rgba(100, 149, 237, 0.15)',
    transformOrigin: 'center center',
  };

  return (
    <section
      ref={ref}
      className="relative w-full h-72 md:h-96 overflow-hidden bg-slate-200"
    >
      <motion.div
        style={{
          ...containerStyle,
          opacity,
          y,
          scale,
          rotate,
        }}
      >
        {lines.map((_, i) => (
          <motion.div
            key={`pattern-line-${i}`}
            style={{
              ...lineBaseStyle,
              transform: `translateX(-50%) rotate(${(i / numLines) * 360}deg)`,
            }}
          />
        ))}
      </motion.div>
      <div className="relative z-10 flex items-center justify-center h-full">
        <motion.p
          style={{
            opacity: useTransform(scrollYProgress, [0.3, 0.5, 0.7], [0, 1, 0]),
          }}
          className="text-2xl text-slate-600 font-semibold italic"
        >
          X-2000: Elevate Your Ride
        </motion.p>
      </div>
    </section>
  );
}
