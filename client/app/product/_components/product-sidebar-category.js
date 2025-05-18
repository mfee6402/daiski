// 'use client'; // 使用 Next.js 的 client component 模式，允許在前端使用互動功能（如 onClick）

// // 引入 shadcn 的 Accordion 元件，這些元件會構成分類展開用的手風琴結構
// import {
//   Accordion,
//   AccordionItem,
//   AccordionTrigger,
//   AccordionContent,
// } from '@/components/ui/accordion';

// import {
//   Collapsible,
//   CollapsibleContent,
//   CollapsibleTrigger,
// } from '@/components/ui/collapsible';

// import { useState, useEffect } from 'react';
// import { useSearchParams } from 'next/navigation';

// // 定義一個 React 組件，接受 props：categories（分類資料）與 onSelect（點選分類時要執行的 callback）
// export default function ProductSidebarCategory({
//   categories = [],
//   onSelectCategory,
// }) {
//   const searchParams = useSearchParams();
//   const category_id = searchParams.get('category_id');

//   // 建立 state 來控制展開哪些分類（受控元件）
//   const [openCategories, setOpenCategories] = useState([]);

//   useEffect(() => {
//     const openSet = new Set();

//     // 加入固定打開的分類（例如 id=1）
//     const fixed = categories.find((c) => c.id === 1);
//     if (fixed?.fullPath) {
//       const levels = fixed.fullPath.split(' > ').map((s) => s.trim());
//       levels.forEach((label) => openSet.add(label));
//     }

//     // 加入目前 URL 中指定的分類對應的所有層級
//     if (category_id) {
//       const current = categories.find(
//         (c) => c.id === parseInt(category_id, 10)
//       );
//       if (current?.fullPath) {
//         const levels = current.fullPath.split(' > ').map((s) => s.trim());
//         levels.forEach((label) => openSet.add(label));
//       }
//     }

//     setOpenCategories((prevState) => {
//       // 返回新的 set，將當前的開啟項目和新開啟的項目合併
//       return Array.from(new Set([...prevState, ...Array.from(openSet)]));
//     });
//   }, [categories, category_id]);
//   /**
//    * buildTree：將扁平的分類資料轉換成巢狀樹狀結構
//    * 例如 "滑雪用品 > 滑雪外套 > 男款" 會被拆成多層嵌套物件
//    */
//   const buildTree = (list) => {
//     const root = {}; // 最外層的根節點
//     list.forEach((item) => {
//       // 防呆：確認 item.fullPath 是字串才做 split，不然包成陣列處理
//       const path =
//         typeof item.fullPath === 'string'
//           ? item.fullPath.split(' > ').map((s) => s.trim()) // 用 " > " 拆成層級，並去除每段前後空白
//           : [String(item.fullPath)];

//       let current = root; // 每次從 root 開始往下建層級
//       path.forEach((label, idx) => {
//         // 如果這層還沒建，就先建起來（包含預設 children 與 id）
//         if (!current[label]) current[label] = { __children: {}, __id: null };

//         // 如果是最後一層（代表這是實際的分類項目），就記下對應的 id
//         if (idx === path.length - 1) current[label].__id = item.id;

//         // 把 current 指向下一層 children，繼續建下面的分類
//         current = current[label].__children;
//       });
//     });
//     return root; // 回傳整棵樹
//   };

//   /**
//    * renderTree：遞迴渲染樹狀結構，使用 Accordion 呈現有子分類的節點
//    */
//   const renderTree = (node) =>
//     Object.entries(node).map(([label, data]) => {
//       const children = data.__children || {}; // 該分類下的子分類
//       const hasChildren = Object.keys(children).length > 0; // 判斷是否有子分類

//       if (hasChildren) {
//         // 如果有子分類，使用 Accordion 組件展開顯示
//         return (
//           <AccordionItem key={label} value={label}>
//             <AccordionTrigger
//               onClick={() => onSelectCategory?.(data.__id)}
//               className="hover:text-primary-500 cursor-pointer"
//             >
//               {label}
//             </AccordionTrigger>{' '}
//             {/* 可點擊展開的分類名 */}
//             <AccordionContent>
//               <ul className="ml-4 space-y-1 ">
//                 {renderTree(children)} {/* 遞迴渲染子分類 */}
//               </ul>
//             </AccordionContent>
//           </AccordionItem>
//         );
//       }

//       // 如果沒有子分類，就用普通的按鈕顯示，點擊時呼叫 onSelect 並帶入 id
//       return (
//         <li key={label}>
//           <button
//             type="button"
//             onClick={() => onSelectCategory?.(data.__id)} // 點擊分類時執行 onSelect 回呼（若有傳入）
//             className="w-full text-left hover:text-primary-500 cursor-pointer" // 讓文字靠左＋滑過時變色
//           >
//             {label} {/* 顯示分類名稱 */}
//           </button>
//         </li>
//       );
//     });

//   // 先用 buildTree 把 categories 資料轉換成樹狀結構
//   const tree = buildTree(categories);
//   //   console.log('defaultOpen:', defaultOpen);

//   return (
//     <div className="flex flex-col gap-4 px-4 py-2">
//       {/* 分類標題 */}
//       <h3 className="mb-2 text-2xl uppercase text-primary-800">商品分類</h3>

//       {/* 渲染樹狀分類，使用手風琴方式顯示有子層的分類 */}
//       <Accordion
//         type="multiple"
//         className="w-full "
//         value={openCategories}
//         onValueChange={setOpenCategories}
//       >
//         {renderTree(tree)}
//       </Accordion>
//     </div>
//   );
// }
'use client';

import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from '@/components/ui/collapsible';

export default function ProductSidebarCategory({
  categories = [],
  selectedCategoryId,
  onSelectCategory,
  openCategories = [],
  onToggleCategory,
}) {
  // 建樹函式
  const buildTree = (list) => {
    const root = {};
    list.forEach((item) => {
      const path =
        typeof item.fullPath === 'string'
          ? item.fullPath.split(' > ').map((s) => s.trim())
          : [String(item.fullPath)];
      let current = root;
      path.forEach((label, idx) => {
        if (!current[label]) current[label] = { __children: {}, __id: null };
        if (idx === path.length - 1) current[label].__id = item.id;
        current = current[label].__children;
      });
    });
    return root;
  };

  // 遞迴渲染
  const renderTree = (node) =>
    Object.entries(node).map(([label, data]) => {
      const children = data.__children || {};
      const hasChildren = Object.keys(children).length > 0;
      const isOpen = openCategories.includes(label);
      const isActive = data.__id === selectedCategoryId;

      return (
        <Collapsible
          key={label}
          open={isOpen}
          onOpenChange={(open) => {
            onToggleCategory?.(label, open);
          }}
        >
          <div className="flex justify-between items-center w-full px-2 py-1 hover:bg-gray-100 rounded-md ">
            {/* 點名稱導航主分類 */}
            <button
              type="button"
              onClick={() => onSelectCategory?.(data.__id)}
              className={`
           flex-1 text-left font-medium cursor-pointer
           ${
             isActive
               ? 'text-primary-500' // ← 被選中時的顏色
               : 'text-secondary-800'
           }   
           hover:text-primary-500
         `}
            >
              {label}
            </button>

            {/* 點箭頭展開／收合 */}
            {hasChildren && (
              <CollapsibleTrigger asChild>
                <button
                  type="button"
                  className="w-4 h-4 flex-shrink-0 focus:outline-none transition-transform data-[state=open]:rotate-180 hover:text-primary-500 cursor-pointer"
                >
                  <svg
                    className="w-4 h-4 "
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
              </CollapsibleTrigger>
            )}
          </div>

          <CollapsibleContent
            className="pl-4  border-l border-gray-200 space-y-1 overflow-hidden
       data-[state=open]:animate-[var(--animate-expand)]
    data-[state=closed]:animate-[var(--animate-collapse)]"
          >
            {/* 子分類 */}
            {hasChildren && <ul>{renderTree(children)}</ul>}
          </CollapsibleContent>
        </Collapsible>
      );
    });

  const tree = buildTree(categories);

  return (
    <div className="px-4 py-2">
      <h3 className="mb-2 text-2xl font-semibold uppercase text-primary-800">
        商品分類
      </h3>
      <div className="space-y-2">{renderTree(tree)}</div>
    </div>
  );
}
