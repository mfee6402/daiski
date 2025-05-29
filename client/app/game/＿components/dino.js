'use client';

import React, { useEffect, useRef, useState } from 'react';
import '../styles/dino.css';

export default function Dino() {
  const dinoRef = useRef(null);
  const scoreRef = useRef(0);

  const [score, setScore] = useState(0);
  const [started, setStarted] = useState(false); // 控制遊戲是否啟動
  const [cactusVisible, setCactusVisible] = useState(false); //控制仙人掌是否可見
  const [obstacles, setObstacles] = useState([]); //用來儲存畫面上還沒消失的障礙物
  const [speed, setSpeed] = useState(1); //設定速度

  // 延長跳躍時間
  const [isJumping, setIsJumping] = useState(false); //是否有在跳躍
  const jumpStartRef = useRef(0);
  const posYRef = useRef(0); // 位置
  const vyRef = useRef(0); // 速度
  const [, forceRender] = useState(0); // 用來觸發畫面更新

  const gravity = -0.6; // 每幀重力加速度
  const jump_power = 10; //起跳出速
  const max_hold_time = 600; //最多可按 500ms

  // 按下開始後的狀態
  const handleStart = () => {
    setStarted(true);
    setScore(0);
    setCactusVisible(false);
    setObstacles([]);
    // const delay = 1_000 + Math.random() * 1_000; // 1-3 秒
    setTimeout(() => setCactusVisible(true), 0);
  };

  // 跳躍處理
  useEffect(() => {
    if (!started) return;

    const onKeyDown = () => {
      if (posYRef.current === 0) {
        vyRef.current = jump_power;
        setIsJumping(true);
        jumpStartRef.current = performance.now();
      }
      console.log(vyRef.current);
    };
    const onKeyUp = () => {
      setIsJumping(false);
    };

    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('keyup', onKeyUp);

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('keyup', onKeyUp);
    };
  }, [started]);

  // 隨時間提升速度
  useEffect(() => {
    if (!started) return;

    // 每5秒speed增加0.2
    const timer = setInterval(() => {
      setSpeed((prev) => prev + 0.3);
    }, 1000);

    return () => clearInterval(timer);
  });

  // 隨機生成
  useEffect(() => {
    // 當 started 變為 true 時，啟動遊戲迴圈
    if (!started || !cactusVisible) return;

    const genInterval = setInterval(
      () => {
        const id = Date.now();

        // 隨機決定障礙物是地面還是天空;
        const type = Math.random() < 0.7 ? 'ground' : 'sky';

        // 把新障礙物加入陣列裡
        setObstacles((prev) => [...prev, { id, type, speed }]);
      },
      1500 + Math.random() * 1500
    );

    return () => clearInterval(genInterval);
  }, [started, cactusVisible, speed]);

  // 碰撞設定 + 分數計算
  useEffect(() => {
    if (!started) return;

    let rafId;

    function loop(time) {
      // 延長跳躍
      if (isJumping && time - jumpStartRef.current < max_hold_time) {
        vyRef.current += jump_power * 0.02;
      }
      console.log(time);

      // 重力
      vyRef.current += gravity;
      // 更新位置
      posYRef.current = Math.max(0, posYRef.current + vyRef.current);

      // 觸發一次 React 重渲染，把 ref 值丟到畫面上
      forceRender((n) => n + 1);

      const dinoEl = dinoRef.current;
      if (!dinoEl) return;

      // 取得恐龍邊界
      const dinoRect = dinoEl.getBoundingClientRect();

      // 記錄當前這一輪檢查中，是否有任何一個障礙物跟恐龍發生碰撞
      let collided = false;

      // 所有障礙物
      obstacles.forEach((o) => {
        const obsEl = document.getElementById(`obs-${o.id}`);
        if (!obsEl) return;

        // 取得障礙物邊界
        const obsRect = obsEl.getBoundingClientRect();

        // 碰撞條件
        const overlapX =
          Math.min(dinoRect.right, obsRect.right) -
          Math.max(dinoRect.left, obsRect.left);

        const overlapY =
          Math.min(dinoRect.bottom, obsRect.bottom) -
          Math.max(dinoRect.top, obsRect.top);

        // 只在左右重疊長度 > 20 時，才算撞；上下重疊只要有就算
        const isCollide =
          overlapX > 25 && // 左右要重疊至少 20px
          overlapY > 1; // 垂直只要有任何重疊

        // 只要撞到就結束遊戲
        if (isCollide) collided = true;
      });

      // 計算分數
      if (collided) {
        alert('Game Over! Your Score: ' + scoreRef.current);
        // ref 重置
        scoreRef.current = 0;
        // state 重置，畫面歸零
        setScore(0);
        // 停遊戲
        setStarted(false);
        return;
      } else {
        // ★ 沒撞到就 +1 分
        scoreRef.current += 1;
        setScore(scoreRef.current);
      }

      // 下一幀繼續執行
      rafId = requestAnimationFrame(loop);
    }

    // 啟動第一幀
    rafId = requestAnimationFrame(loop);

    return () => cancelAnimationFrame(rafId);

    // const loop = setInterval(() => {}, 20);

    // return () => clearInterval(loop);
  }, [started, obstacles, isJumping]);

  return (
    <div className="relative w-[1000px] h-[225px] border border-black mx-auto overflow-hidden mt-10 z-[1]">
      {/* 遊戲畫面 */}
      <div className="absolute top-2 left-2 text-lg font-medium">
        Score: {score}
      </div>

      <div
        ref={dinoRef}
        id="dino"
        className="w-[43px] h-[40px]
                   bg-[url('/game/dino1.jpg')] bg-contain 
                   absolute  left-[50px]"
        style={{ bottom: posYRef.current }}
      />

      {obstacles.map((o) => (
        <div
          key={o.id}
          id={`obs-${o.id}`}
          className={`absolute bg-contain ${
            o.type === 'ground'
              ? "bg-[url('/game/dino4.png')] bottom-0 w-[33px] h-[35px] "
              : "bg-[url('/game/dino5.png')] top-[60px] w-[30px] h-[20px]  "
          }`}
          style={{
            // 把動畫加進來：名稱 move、時長 = 基礎時間(例如 3s) ÷ speed、無限循環
            animation: `move ${3 / o.speed}s linear infinite`,
          }}
        />
      ))}

      {/* 4. 開始前的遮罩 & 彈窗 */}
      {!started && (
        <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center z-10">
          <div className="bg-white p-6 rounded-lg max-w-sm text-center">
            <h2 className="text-2xl font-bold mb-4">注意事項</h2>
            <p className="mb-6">
              • 用「上」讓恐龍跳躍。
              <br />
              • 躲避所有仙人掌，撞到就會結算分數。
              <br />• 分數會隨時間累加，越久存活分數越高。
            </p>
            <button
              // onClick={() => {
              //   scoreRef.current = 0;
              //   handleStart;
              // }}
              onClick={handleStart}
              className="px-5 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 cursor-pointer"
            >
              開始遊戲
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
