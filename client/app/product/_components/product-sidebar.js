import ProductSidebarFilter from './product-sidebar-filter';
import ProductSidebarCategory from './product-sidebar-category';
import ProductSidebarSearch from './product-sidebar-search';

export default function ProductSidebar({
  limit,
  onChangeLimit,
  categories,
  onSelectCategory,
  sizes,
  selectedSizes,
  onToggleSize,
  minPrice,
  maxPrice,
  onChangePrice,
  onTriggerPriceFilter,
  searchValue,
  onChangeSearch,
  suggestions,
  isLoading,
  onSelect,
}) {
  return (
    <div className="hidden md:flex flex-col max-w-48 xl:max-w-64 w-full bg-[#ffffff] text-[#231815]">
      <ProductSidebarSearch
        suggestions={suggestions}
        isLoading={isLoading}
        onSelect={onSelect}
        searchValue={searchValue}
        onChangeSearch={onChangeSearch}
      />

      <ProductSidebarCategory
        categories={categories}
        onSelectCategory={onSelectCategory}
      />

      <ProductSidebarFilter
        limit={limit}
        onChangeLimit={onChangeLimit}
        sizes={sizes}
        selectedSizes={selectedSizes}
        onToggleSize={onToggleSize}
        minPrice={minPrice}
        maxPrice={maxPrice}
        onChangePrice={onChangePrice}
        onTriggerPriceFilter={onTriggerPriceFilter}
      />
    </div>
  );
}
