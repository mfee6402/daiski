import ProductSidebarFilter from './product-sidebar-filter';
import ProductSidebarCategory from './product-sidebar-category';
import ProductSidebarSearch from './product-sidebar-search';

export default function ProductSidebar({
  limit,
  onChangeLimit,
  categories,
  selectedCategoryId,
  onSelectCategory,
  openCategories,
  onToggleCategory,
  sizes,
  selectedSizes,
  onToggleSize,
  onResetSizes,
  showAllSizes,
  onToggleShowAllSizes,
  canToggleSizes,
  brands,
  selectedBrands,
  onToggleBrand,
  onResetBrands,
  minPrice,
  maxPrice,
  onChangePrice,
  onTriggerPriceFilter,
  onResetPrice,
  priceError,
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
        selectedCategoryId={selectedCategoryId}
        openCategories={openCategories}
        onToggleCategory={onToggleCategory}
      />

      <ProductSidebarFilter
        limit={limit}
        onChangeLimit={onChangeLimit}
        sizes={sizes}
        selectedSizes={selectedSizes}
        onToggleSize={onToggleSize}
        onResetSizes={onResetSizes}
        showAllSizes={showAllSizes}
        onToggleShowAllSizes={onToggleShowAllSizes}
        canToggleSizes={canToggleSizes}
        brands={brands}
        selectedBrands={selectedBrands}
        onToggleBrand={onToggleBrand}
        onResetBrands={onResetBrands}
        minPrice={minPrice}
        maxPrice={maxPrice}
        onChangePrice={onChangePrice}
        onTriggerPriceFilter={onTriggerPriceFilter}
        onResetPrice={onResetPrice}
        priceError={priceError}
      />
    </div>
  );
}
