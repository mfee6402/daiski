import { Search } from 'lucide-react';

export default function ProductFilter({
  limit,
  onChangeLimit, // 新增這兩個 props
}) {
  return (
    <div className="hidden md:flex flex-col max-w-48 xl:max-w-64 w-full mx-auto bg-[#ffffff] text-[#231815]">
      {/* Search Bar */}
      <div className="relative px-4 py-2 border-b border-[#d8d8d8]">
        <div className="relative">
          <input
            type="text"
            className="w-full py-1.5 pl-8 pr-2 text-sm border-none focus:outline-none"
            placeholder=""
          />
          <Search className="absolute left-0 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#969696]" />
        </div>
      </div>

      {/* Categories Section */}
      <div className="px-4 py-2">
        <div className="mb-2">
          <span className="inline-block px-2 py-0.5 bg-[#1eb7c8] text-white text-xs">
            滑雪用品 | Snow
          </span>
        </div>

        <ul className="space-y-2 text-sm">
          <li>毛帽 | 保暖帽</li>
          <li>滑雪鏡 | 眼片 | 雪鏡配件</li>
          <li>滑雪面罩 | 脖圍 | 頭套</li>
          <li>滑雪手套 | 手套內層 | 手套墊</li>
          <li>滑雪外套 | 雪衣</li>
          <li>滑雪褲 | 雪褲</li>
          <li>運身衣衣 | 雪衣褲套裝</li>
          <li>滑雪襪</li>
        </ul>

        <div className="my-2 border-t border-dashed border-[#d8d8d8]"></div>

        <ul className="space-y-2 text-sm mb-4">
          <li>雪板 | 雪板袋 | 雪板配件</li>
          <li>雪板 | SnowBoards</li>
        </ul>
      </div>

      {/* Filter Checkboxes */}
      <div className="px-4 py-2 border-t border-[#d8d8d8]">
        <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
          <label className="flex items-center space-x-2">
            <input type="checkbox" className="rounded border-[#cccccc]" />
            <span>L</span>
          </label>
          <label className="flex items-center space-x-2">
            <input type="checkbox" className="rounded border-[#cccccc]" />
            <span>L/XL</span>
          </label>

          <label className="flex items-center space-x-2">
            <input type="checkbox" className="rounded border-[#cccccc]" />
            <span>M</span>
          </label>

          <label className="flex items-center space-x-2">
            <input type="checkbox" className="rounded border-[#cccccc]" />
            <span>M/L</span>
          </label>
          <label className="flex items-center space-x-2">
            <input type="checkbox" className="rounded border-[#cccccc]" />
            <span>S</span>
          </label>

          <label className="flex items-center space-x-2">
            <input type="checkbox" className="rounded border-[#cccccc]" />
            <span>S/M</span>
          </label>
          <label className="flex items-center space-x-2">
            <input type="checkbox" className="rounded border-[#cccccc]" />
            <span>XL</span>
          </label>

          <label className="flex items-center space-x-2">
            <input type="checkbox" className="rounded border-[#cccccc]" />
            <span>XL/2XL</span>
          </label>
          <label className="flex items-center space-x-2">
            <input type="checkbox" className="rounded border-[#cccccc]" />
            <span>XS</span>
          </label>

          <label className="flex items-center space-x-2">
            <input type="checkbox" className="rounded border-[#cccccc]" />
            <span>XXL</span>
          </label>
          <label className="flex items-center space-x-2">
            <input type="checkbox" className="rounded border-[#cccccc]" />
            <span>XXS</span>
          </label>

          <label className="flex items-center space-x-2">
            <input type="checkbox" className="rounded border-[#cccccc]" />
            <span>XXXL</span>
          </label>
        </div>

        {/* 每頁筆數選項 */}
        <div className="px-2 py-2 border-t border-[#d8d8d8]">
          <label className="flex items-center space-x-2 text-sm mb-2">
            <span>每頁顯示：</span>
            <select
              value={limit}
              onChange={(e) => onChangeLimit(Number(e.target.value))}
              className="border rounded px-2 py-1"
            >
              {[4, 8, 12, 20, 50].map((n) => (
                <option key={n} value={n}>
                  {n} 筆
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>
    </div>
  );
}
