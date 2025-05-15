import { useState, useRef, useEffect, useLayoutEffect } from 'react';

/**
 * @param {number} itemCount  卡片數量
 * @param {number} wideSpan   展開卡片所佔的 fr（預設 10）
 * @returns {
 *   listRef: React.RefObject<HTMLElement>,
 *   itemRefs: React.MutableRefObject<HTMLElement[]>,
 *   activeIdx: number,
 *   setActiveIdx: (idx:number)=>void
 * }
 */
export default function UseHomeClub(itemCount, wideSpan = 10) {
  const [activeIdx, setActiveIdx] = useState(0); // 哪一張展開
  const listRef = useRef(null); // <ul> DOM
  const itemRefs = useRef([]); // 每張 <li> DOM

  /* 每次 activeIdx 變動 → 重算 grid-template-columns */
  useEffect(() => {
    if (!listRef.current) return;
    const cols = Array(itemCount)
      .fill(0)
      .map((_, i) => (i === activeIdx ? `${wideSpan}fr` : '1fr'))
      .join(' ');
    listRef.current.style.gridTemplateColumns = cols;
  }, [activeIdx, itemCount, wideSpan]);

  /* resize 時量最大寬，寫入 CSS 變數（若你不需要可刪） */
  useLayoutEffect(() => {
    const syncVars = () => {
      if (!itemRefs.current.length) return;
      const maxW = Math.max(...itemRefs.current.map((el) => el.offsetWidth));
      listRef.current?.style.setProperty('--article-width', `${maxW}px`);
      listRef.current?.style.setProperty(
        '--base',
        getComputedStyle(itemRefs.current[0]).minWidth
      );
    };
    syncVars();
    window.addEventListener('resize', syncVars);
    return () => window.removeEventListener('resize', syncVars);
  }, []);

  return { listRef, itemRefs, activeIdx, setActiveIdx };
}
