import { Search } from 'lucide-react';
export default function ProductSidebarSearch({
  searchValue,
  onChangeSearch,
  suggestions,
  isLoading,
  onSelect,
}) {
  return (
    <>
      <div className="relative">
        <input
          value={searchValue}
          onChange={(e) => onChangeSearch(e.target.value)}
          placeholder="搜尋商品..."
        />

        {/* 搜尋建議下拉 */}
        {searchValue && (
          <div className="absolute top-full bg-white border">
            {isLoading ? (
              <div>載入中...</div>
            ) : (
              suggestions.map((item) => (
                <button
                  key={item.id}
                  onClick={() => onSelect(item)}
                  className="hover:bg-gray-100 cursor-pointer"
                >
                  {item.name}
                </button>
              ))
            )}
          </div>
        )}
      </div>
    </>
  );
}
