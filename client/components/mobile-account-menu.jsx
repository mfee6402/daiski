import { User } from 'lucide-react';
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/ui/accordion';

export function MobileAccountMenu() {
  return (
    <div className="w-full">
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="account-menu">
          {/* 直接用 AccordionTrigger 當按鈕，刪除 asChild + Button */}
          <AccordionTrigger
            className="
              size-6 
              rounded-full 
              border-2 
              border-black 
              hover:bg-gray-100 
              transition 
              cursor-pointer
              flex 
              items-center 
              justify-center  data-[state=open]:rotate-0
            "
          >
            <div className="flex items-center justify-between text-base gap-3">
              <User className="size-4 text-black" />
              <span>會員</span>
            </div>
          </AccordionTrigger>

          <AccordionContent className="p-2">
            <div className="text-sm font-medium text-gray-500 mb-2">
              帳號選單
            </div>
            <div className="space-y-1">
              <button className="w-full text-left px-2 py-1 rounded hover:bg-gray-100 text-base">
                個人資料
              </button>
              <button className="w-full text-left px-2 py-1 rounded hover:bg-gray-100 text-base">
                訂單記錄
              </button>
              <button className="w-full text-left px-2 py-1 rounded hover:bg-gray-100 text-base">
                優惠券
              </button>
              <button className="w-full text-left px-2 py-1 rounded hover:bg-gray-100 text-base">
                揪團
              </button>
              <button className="w-full text-left px-2 py-1 rounded hover:bg-gray-100 text-base">
                登出
              </button>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
