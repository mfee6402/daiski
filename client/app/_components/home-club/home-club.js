'use client';

import React, { useState, UseHomeClub } from 'react';
import ClubLi from './club-li';

const cards = [
  { id: 1, src: './home-images/0508-1.jpg', title: 'The Craft' },
  { id: 2, src: './home-images/0508-2.jpg', title: 'The Craft' },
  { id: 3, src: './home-images/0508-3.jpg', title: 'The Craft' },
  { id: 4, src: './home-images/2017Vol335.jpg', title: 'The Craft' },
  { id: 5, src: './home-images/hs00.jpg', title: 'The Craft' },
  { id: 6, src: './home-images/hs1-1.jpg', title: 'The Craft' },
  { id: 7, src: './home-images/hs5-1.jpg', title: 'The Craft' },
  { id: 8, src: './home-images/image12.png', title: 'The Craft' },
];

export default function HomeClub() {
  // const { listRef, itemRefs, activeIdx, setActiveIdx } = UseHomeClub(
  //   cards.length,
  //   10
  // ); bug還沒好
  const [activeIdx, setActiveIdx] = useState(0); // 0 = 第一張開啟
  return (
    <section className="flex items-center justify-center m-10">
      <ul
        // ref={listRef}
        className="grid grid-cols-[10fr_repeat(6,_1fr)] gap-2 w-full
          max-w-[calc(100%-4rem)]
          h-[clamp(300px,40dvh,474px)]
          transition-[grid-template-columns] duration-600
          ease-[linear(0_0%,_.154_4.1%,_.293_8.3%,_.417_12.6%,_.528_17.1%,_.626_21.8%,_.71_26.6%,_.782_31.7%,_.843_37%,_.889_42.2%,_.926_47.8%,_.954_53.8%,_.975_60.3%,_.988_67.1%,_.996_75%,_1_100%)]"
      >
        {cards.map((card, idx) => (
          <ClubLi
            key={card.id}
            src={card.src}
            title={card.title}
            isActive={activeIdx === idx}
            onSelect={() => setActiveIdx(idx)} // ← 更新 Hook 狀態
          />
        ))}
      </ul>
    </section>
  );
}
