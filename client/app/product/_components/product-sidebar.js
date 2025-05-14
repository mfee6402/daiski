import { Search } from 'lucide-react';
import ProductSidebarFilter from './product-sidebar-filter';
import ProductSidebarCategory from './product-sidebar-category';

export default function ProductSidebar({ limit, onChangeLimit, categories,onSelectCategory }) {
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

      <ProductSidebarCategory categories={categories} onSelectCategory={onSelectCategory}/>

      <ProductSidebarFilter limit={limit} onChangeLimit={onChangeLimit} />
    </div>
  );
}
