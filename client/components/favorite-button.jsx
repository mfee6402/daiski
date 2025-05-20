'use client';

import { FaRegHeart, FaHeart } from 'react-icons/fa';
import { Button } from '@/components/ui/button';

/**
 * 收藏按鈕元件 (受控元件)
 * @param {{ isFav: boolean; onToggle: ()=>void; variant?: 'circle'|'rect'; className?: string; }} props
 * 不帶varient參數或是帶varient="circle"參數的話 這個按鈕就是圓形的中間一顆小愛心
 * 參數帶varient="rect"的話 這個按鈕就是圓角長方形 小愛心+已收藏/加入收藏字樣
 */
export default function FavoriteButton({
  isFav,
  onToggle,
  variant,
  className = '',
}) {
  // 只有當 variant 顯式為 'rect' 時，才採用長方形樣式，其他情況都用 circle
  const isRect = variant === 'rect';

  // 按鈕樣式
  const baseClasses = isRect
    ? 'px-4 py-2 rounded-lg space-x-2 flex items-center'
    : 'p-2 rounded-full';
  const btnVariant = isRect ? 'outline' : 'ghost';

  // 先阻止事件冒泡，再執行切換收藏
  const handleClick = (e) => {
    e.stopPropagation();
    onToggle();
  };

  return (
    <Button
      variant={btnVariant}
      className={`${baseClasses} ${className}`}
      onClick={handleClick}
    >
      {isRect ? (
        <>
          {isFav ? <FaHeart size={16} /> : <FaRegHeart size={16} />}
          <span>{isFav ? '已收藏' : '加入收藏'}</span>
        </>
      ) : isFav ? (
        <FaHeart size={20} />
      ) : (
        <FaRegHeart size={20} />
      )}
    </Button>
  );
}
