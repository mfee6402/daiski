'use client';

import { User } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from './ui/button';

export function AccountPopover() {
  return (
    // <DropdownMenu>
    //   <DropdownMenuTrigger asChild>
    //     <button className="rounded-full border-2 border-black hover:bg-gray-100 transition cursor-pointer">
    //       <User className="size-6 text-black" />
    //     </button>
    //   </DropdownMenuTrigger>
    //   <DropdownMenuContent align="end" className="w-24">
    //     <DropdownMenuLabel>帳號選單</DropdownMenuLabel>
    //     <DropdownMenuSeparator />
    //     <DropdownMenuItem>個人資料</DropdownMenuItem>
    //     <DropdownMenuItem>設定</DropdownMenuItem>
    //     <DropdownMenuItem>登出</DropdownMenuItem>
    //   </DropdownMenuContent>
    // </DropdownMenu>
    <Popover>
      {/* 觸發按鈕 */}
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="size-6 rounded-full border-2 border-black hover:bg-gray-100 transition cursor-pointer"
        >
          <User className="size-4 " />
        </Button>
      </PopoverTrigger>

      {/* 彈出內容 */}
      <PopoverContent
        side="bottom"
        align="end"
        sideOffset={4}
        className="w-48 p-2"
      >
        <div className="text-sm font-medium text-gray-500 mb-2">帳號選單</div>
        <div className="space-y-1">
          <button className="w-full text-left px-2 py-1 rounded hover:bg-gray-100">
            個人資料
          </button>
          <button className="w-full text-left px-2 py-1 rounded hover:bg-gray-100">
            訂單記錄
          </button>
          <button className="w-full text-left px-2 py-1 rounded hover:bg-gray-100">
            優惠券
          </button>
          <button className="w-full text-left px-2 py-1 rounded hover:bg-gray-100">
            揪團
          </button>
          <button className="w-full text-left px-2 py-1 rounded hover:bg-gray-100">
            登出
          </button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
