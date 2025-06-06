// components/custom-cursor.jsx
'use client';

import React, { useEffect, useState } from 'react';
import {
  motion,
  useMotionValue,
  useSpring,
  useVelocity,
  useTransform,
  AnimatePresence, // 引入 AnimatePresence 以便更好地處理粒子進出場動畫
} from 'framer-motion';
import Image from 'next/image';
import { useTheme } from 'next-themes';

const CustomCursor = () => {
  const { theme } = useTheme();
  // console.log(theme);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  const NUM_TRAIL_VERTICES = 12;
  const BASE_TRAIL_OFFSET = 7; // 雖然現在是單線，但保留以備將來調整

  const trailVertices = [];
  for (let i = 0; i < NUM_TRAIL_VERTICES; i++) {
    const dotSpringConfig = {
      damping: 18 + i * 2.0,
      stiffness: 240 - i * 12,
      mass: 0.5 + i * 0.02,
    };
    trailVertices.push({
      x: useSpring(cursorX, dotSpringConfig),
      y: useSpring(cursorY, dotSpringConfig),
    });
  }

  const trailLineSegments = [];
  if (NUM_TRAIL_VERTICES > 1) {
    for (let i = 0; i < NUM_TRAIL_VERTICES - 1; i++) {
      const d = useTransform(
        [
          trailVertices[i].x,
          trailVertices[i].y,
          trailVertices[i + 1].x,
          trailVertices[i + 1].y,
        ],
        ([startX, startY, endX, endY]) => {
          if (isNaN(startX) || isNaN(startY) || isNaN(endX) || isNaN(endY))
            return 'M 0 0';
          return `M ${startX.toFixed(2)} ${startY.toFixed(2)} L ${endX.toFixed(2)} ${endY.toFixed(2)}`;
        }
      );
      trailLineSegments.push({ id: i, d }); // 為 trailLineSegments 添加 id
    }
  }

  const [isHoveringClickable, setIsHoveringClickable] = useState(false);

  // --- [代碼解釋區塊 F - 星塵粒子效果狀態與配置] ---
  const [particles, setParticles] = useState([]);
  const MAX_PARTICLES = 30; // 最大同時存在的粒子數
  const PARTICLE_EMISSION_RATE = 0.3; // 每次鼠標移動時發射粒子的概率 (0 到 1)
  const PARTICLE_LIFESPAN_MIN = 800; // ms
  const PARTICLE_LIFESPAN_MAX = 1500; // ms

  // 星塵顏色池 (靈感來自游標的閃光點，偏亮色)
  // const sparkleColors = [
  //   'rgba(255, 255, 220, 0.9)', // 淡黃
  //   'rgba(200, 225, 255, 0.9)', // 淡藍
  //   'rgba(255, 210, 240, 0.9)', // 淡粉
  //   'rgba(230, 230, 250, 0.9)', // 淡紫
  // ];
  // 2. 為亮色和暗色模式定義不同的粒子顏色
  const sparkleColorsConfig = {
    light: [
      'rgba(255, 255, 200, 1)', // 淡黃, 透明度略低
      'rgba(200, 225, 255, 1)', // 淡藍
      'rgba(255, 210, 230, 1)', // 淡粉
      'rgba(220, 220, 250, 1)', // 淡紫
    ],
    dark: [
      'rgba(255, 255, 200, 0.7)', // 淡黃, 透明度略低
      'rgba(200, 225, 255, 0.7)', // 淡藍
      'rgba(255, 210, 230, 0.7)', // 淡粉
      'rgba(220, 220, 250, 0.7)', // 淡紫
    ],
  };
  // --- [結束 代碼解釋區塊 F] ---

  useEffect(() => {
    setIsMounted(true);
    if (typeof window !== 'undefined') {
      const hasTouch =
        'ontouchstart' in window ||
        navigator.maxTouchPoints > 0 ||
        window.matchMedia('(pointer: coarse)').matches;
      setIsTouchDevice(hasTouch);
    }
  }, []);

  useEffect(() => {
    if (!isMounted) return;
    if (isTouchDevice) {
      document.documentElement.classList.remove('custom-cursor-active');
      if (document.body.style.cursor === 'none')
        document.body.style.cursor = 'auto';
    } else {
      document.documentElement.classList.add('custom-cursor-active');
    }
    return () => {
      if (isMounted) {
        document.documentElement.classList.remove('custom-cursor-active');
        if (document.body.style.cursor === 'none')
          document.body.style.cursor = 'auto';
      }
    };
  }, [isTouchDevice, isMounted]);

  useEffect(() => {
    if (isTouchDevice || !isMounted) return;
    const currentSparkleColors =
      theme === 'dark' ? sparkleColorsConfig.dark : sparkleColorsConfig.light;

    const moveCursor = (e) => {
      const currentX = e.clientX;
      const currentY = e.clientY;
      cursorX.set(currentX);
      cursorY.set(currentY);

      const target = e.target;
      const currentlyHoveringTarget = !!target.closest(
        'a, button, [role="button"], input[type="submit"], input[type="reset"], input[type="image"], label[for], select, textarea, .clickable-custom'
      );
      setIsHoveringClickable((prev) =>
        prev !== currentlyHoveringTarget ? currentlyHoveringTarget : prev
      );

      // --- [代碼解釋區塊 G - 發射星塵粒子] ---
      if (Math.random() < PARTICLE_EMISSION_RATE) {
        const newParticle = {
          id: Date.now() + Math.random(), // 唯一ID
          x: currentX + (Math.random() - 0.5) * 15, // 在鼠標周圍隨機偏移
          y: currentY + (Math.random() - 0.5) * 15,
          // 粒子動畫的最終漂移位置
          finalX: currentX + (Math.random() - 0.5) * 60,
          finalY: currentY + (Math.random() - 0.5) * 60,
          // color:
          //   sparkleColors[Math.floor(Math.random() * sparkleColors.length)],
          // 3. 根據當前主題選擇顏色
          color:
            currentSparkleColors[
              Math.floor(Math.random() * currentSparkleColors.length)
            ],
          scale: Math.random() * 0.6 + 0.4, // 初始大小 0.4 到 1.0
          duration:
            Math.random() * (PARTICLE_LIFESPAN_MAX - PARTICLE_LIFESPAN_MIN) +
            PARTICLE_LIFESPAN_MIN,
        };
        setParticles((prevParticles) => {
          // 添加新粒子到數組開頭，並限制最大數量
          const updated = [newParticle, ...prevParticles];
          return updated.slice(0, MAX_PARTICLES);
        });
      }
      // --- [結束 代碼解釋區塊 G] ---
    };
    // window.addEventListener('mousemove', moveCursor);
    window.addEventListener('pointermove', moveCursor);
    return () => window.removeEventListener('mousemove', moveCursor);
  }, [isTouchDevice, isMounted, cursorX, cursorY, theme]); // cursorX, cursorY 作為依賴

  const cursorVariants = {
    default: {
      scale: 1,
      opacity: 1,
      transition: { type: 'tween', ease: 'backOut', duration: 0.3 },
    },
    clickable: {
      scale: 1.3,
      transition: { type: 'spring', stiffness: 400, damping: 15 },
    },
  };

  if (!isMounted || isTouchDevice) return null;

  const geminiColors = [
    [200, 225, 255],
    [200, 225, 225],
    [236, 64, 122], // Pink
    [255, 160, 0], // Orange (尾部)
  ];

  return (
    <>
      {/* SVG 線段軌跡 這一個區塊取消註解會看到有軌跡線跟著滑鼠 但是不怎麼好看我就先註解了 */}
      {/* <svg
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          pointerEvents: 'none',
          zIndex: 9997, // SVG軌跡在粒子之下
        }}
      >
        {trailLineSegments.map((segment, index) => {
          const progress =
            index / (NUM_TRAIL_VERTICES > 1 ? NUM_TRAIL_VERTICES - 1 : 1);
          const baseStrokeOpacity = 0.05;
          const strokeOpacity = baseStrokeOpacity * (1 - progress ** 0.7);
          const baseStrokeWidth = 7;
          const strokeWidth = Math.max(
            0.5,
            baseStrokeWidth * (1 - progress ** 0.8)
          );

          let r, g, b;
          const colorStop = Math.floor(progress * (geminiColors.length - 1));
          const nextColorStop = Math.min(
            colorStop + 1,
            geminiColors.length - 1
          );
          const segmentProgress =
            progress * (geminiColors.length - 1) - colorStop;
          const c1 = geminiColors[colorStop];
          const c2 = geminiColors[nextColorStop];
          r = Math.round(c1[0] + (c2[0] - c1[0]) * segmentProgress);
          g = Math.round(c1[1] + (c2[1] - c1[1]) * segmentProgress);
          b = Math.round(c1[2] + (c2[2] - c1[2]) * segmentProgress);
          const strokeColor = `rgba(${r}, ${g}, ${b}, ${strokeOpacity})`;

          return (
            <motion.path
              key={segment.id} // 使用 trailLineSegments 中定義的 id
              d={segment.d}
              fill="none"
              stroke={strokeColor}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{
                filter: `blur(${Math.max(0, 1.5 - strokeWidth * 0.3)}px)`,
              }}
            />
          );
        })}
      </svg> */}

      {/* --- [代碼解釋區塊 H - 星塵粒子渲染] --- */}
      {/* AnimatePresence 用於處理粒子被從列表移除時的出場動畫 (如果粒子的動畫自己不帶opacity到0) */}
      {/* 在這個例子中，粒子動畫的 opacity 會到0，所以 AnimatePresence 主要用於列表管理 */}
      <AnimatePresence>
        {particles.map((p) => (
          <motion.div
            key={p.id} // 每個粒子需要唯一 key
            className="fixed top-0 left-0 pointer-events-none rounded-full"
            style={{
              // 初始位置由 p.x, p.y 設定 (通過 initial prop)
              // backgroundColor: p.color, // 粒子顏色
              zIndex: 9998, // 粒子在SVG軌跡之上，主鼠標之下
            }}
            initial={{
              // 粒子初始狀態
              x: p.x,
              y: p.y,
              scale: p.scale * 0.5, // 從一半大小開始
              opacity: 0,
            }}
            animate={{
              // 粒子動畫目標狀態和過程
              x: p.finalX, // 漂移到最終位置
              y: p.finalY,
              scale: [p.scale, p.scale * 1.3, p.scale * 0.8, 0.1], // 大小脈衝後縮小消失
              opacity: [0.7, 1, 0.7, 0], // 透明度先增後減至消失
              //backgroundColor: [p.color, sparkleColors[Math.floor(Math.random() * sparkleColors.length)], p.color], //顏色可以閃爍
            }}
            transition={{
              // 動畫過渡配置
              duration: p.duration / 1000, // 轉換為秒
              ease: 'easeOut',
              // times: [0, 0.2, 0.8, 1] // 對應 animate 數組中各個階段的時間點
            }}
            // 動畫完成後將粒子從狀態中移除
            onAnimationComplete={() => {
              setParticles((prevPs) =>
                prevPs.filter((particle) => particle.id !== p.id)
              );
            }}
          >
            {/* 內層div用於更精細的樣式控制，例如固定的粒子大小和發光 */}
            <div
              style={{
                width: '7px', // 粒子固定大小
                height: '7px',
                borderRadius: '50%',
                backgroundColor: p.color,
                boxShadow: `0 0 6px 2px ${p.color.replace('0.9', '0.5')}`, // 用粒子顏色創建輝光
              }}
            />
          </motion.div>
        ))}
      </AnimatePresence>
      {/* --- [結束 代碼解釋區塊 H] --- */}

      {/* 主鼠標 */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9999]"
        style={{ translateX: cursorX, translateY: cursorY }}
        variants={cursorVariants}
        animate={isHoveringClickable ? 'clickable' : 'default'}
      >
        <div className="">
          {isHoveringClickable ? (
            <Image
              priority
              src="/icons8-cursor-64.svg"
              alt=""
              width={32}
              height={32}
              className="opacity-100"
            />
          ) : (
            <Image
              priority
              src="/icons8-cursor-64.svg"
              alt=""
              width={28}
              height={28}
              className="opacity-95"
            />
          )}
        </div>
      </motion.div>
    </>
  );
};

export default CustomCursor;
