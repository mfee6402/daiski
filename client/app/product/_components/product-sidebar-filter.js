import { Button } from '@/components/ui/button';

export default function ProductFilter({
  limit,
  onChangeLimit, // 新增這兩個 props
  sizes,
  selectedSizes,
  onToggleSize,
  minPrice,
  maxPrice,
  onChangePrice,
  onTriggerPriceFilter,
}) {
  return (
    <div className="hidden md:flex flex-col max-w-48 xl:max-w-64 w-full mx-auto bg-[#ffffff] text-[#231815]">
      {/* Filter Checkboxes */}
      <div className="px-4 py-2 border-t border-[#d8d8d8]">
        {/* 尺寸篩選 */}
        <div className="px-4 py-2 border-t">
          <h4 className="font-medium mb-2">尺寸篩選</h4>
          <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
            {sizes.map((s) => (
              <label key={s.id} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={selectedSizes.includes(s.id)}
                  onChange={() => onToggleSize(s.id)}
                  className="rounded border-[#cccccc]"
                />
                <span>{s.name}</span>
              </label>
            ))}
          </div>
        </div>

        {/* 價格篩選 */}
        <div className="flex flex-col gap-2 mt-4">
          <label className="font-medium mb-2">價格篩選</label>
          <div className="flex gap-2">
            <input
              type="number"
              value={minPrice}
              onChange={(e) => onChangePrice('min', e.target.value)}
              placeholder="最低價"
              className="w-full border px-2 py-1"
            />
            <input
              type="number"
              value={maxPrice}
              onChange={(e) => onChangePrice('max', e.target.value)}
              placeholder="最高價"
              className="w-full border px-2 py-1"
            />
          </div>
          <Button
            onClick={onTriggerPriceFilter}
            className="w-full mt-2 hover:bg-primary-500 cursor-pointer"
          >
            價格篩選
          </Button>
        </div>

        {/* 每頁筆數選項 */}
        <div className="flex flex-col gap-4 mt-4 px-2 py-2 border-t border-secondary-800 pt-4">
          <label className="flex items-center space-x-2 text-sm mb-2 ">
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
