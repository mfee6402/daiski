export default function ProductFilter({
  limit,
  onChangeLimit, // 新增這兩個 props
}) {
  return (
    <div className="hidden md:flex flex-col max-w-48 xl:max-w-64 w-full mx-auto bg-[#ffffff] text-[#231815]">
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

        {/* 價格篩選 */}
        <div className="mt-4">
          <label className="block text-sm mb-1">價格範圍</label>
          <div className="flex gap-2">
            <input
              type="number"
              // value={minPrice}
              // onChange={(e) => onChangePrice("min", e.target.value)}
              placeholder="最低價"
              className="w-full border px-2 py-1"
            />
            <input
              type="number"
              // value={maxPrice}
              // onChange={(e) => onChangePrice("max", e.target.value)}
              placeholder="最高價"
              className="w-full border px-2 py-1"
            />
          </div>
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
