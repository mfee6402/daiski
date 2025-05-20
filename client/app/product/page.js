'use client';
import Container from '@/components/container';
import ProductList from './_components/product-list';
import ProductPagination from './_components/product-pagination';
import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import ProductSidebar from './_components/product-sidebar';
import useSWR from 'swr';
import { useDebounce } from 'use-debounce';
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { X, Sliders } from 'lucide-react';

import { useAuth } from '@/hooks/use-auth';

// 1. Next.js Server Component（可直接 await fetch）
// export default async function ProductsPage() {
//   // 2. 呼叫後端 API
//   const res = await fetch('http://localhost:4000/api/products')
//   const products = await res.json()

//   console.log(products)
//   console.log(typeof [products])
//   return (
//     <>
//       <Container>
//         <main className="">
//           <ProductList products={products} />
//         </main>
//       </Container>
//     </>
//   )
// }

/*
商品V3 (已修復 category_id 同步問題)
*/
// SWR fetcher：把 URL 拿去 fetch 然後轉成 JSON
const fetcher = (url) =>
  fetch(`http://localhost:3005${url}`).then((res) => res.json());

export default function ProductPage() {
  const { user, isAuth, isLoading } = useAuth();

  const searchParams = useSearchParams();
  const router = useRouter();

  // ─── 1. 搜尋輸入 state & 防抖 ───
  const initialSearch = searchParams.get('search') || '';
  const [searchText, setSearchText] = useState(initialSearch);
  const [debouncedSearch] = useDebounce(searchText, 300);

  // ==================== 新增的 useEffect 同步防抖值到 URL ====================
  useEffect(() => {
    const params = new URLSearchParams(Array.from(searchParams.entries()));
    const currentSearch = params.get('search') || '';

    // 只有當防抖值與當前 URL 參數不同時才更新
    if (debouncedSearch !== currentSearch) {
      // 更新或刪除 search 參數
      if (debouncedSearch) {
        params.set('search', debouncedSearch);
      } else {
        params.delete('search');
      }
      // 重置頁碼並導航
      params.set('page', '1');
      router.push(`?${params.toString()}`, undefined, { shallow: true }); // <--- 使用 shallow routing
    }
  }, [debouncedSearch, router, searchParams]); // <--- 加入這裡

  // ─── 2. 取得「搜尋建議」──

  // 當 debouncedSearch 長度 >= 2 時呼叫，否則 key = null（不發請求）

  const { data: suggestions = [], isValidating: sugLoading } = useSWR(
    debouncedSearch.length >= 2
      ? `/api/products/search-suggestions?search=${encodeURIComponent(debouncedSearch)}&limit=5`
      : null,

    fetcher
  );

  // 點選建議後：更新輸入、更新 URL (加上 search & 重設 page=1)

  const handleSelect = (item) => {
    setSearchText(item.name);

    const params = new URLSearchParams(Array.from(searchParams.entries()));

    params.set('search', item.name);

    params.set('page', '1');

    router.push(`?${params.toString()}`);
  };

  // ─── 3. 其他篩選條件 state ───
  const [pageInfo, setPageInfo] = useState({
    page: parseInt(searchParams.get('page') || '1', 10),
    limit: parseInt(searchParams.get('limit') || '12', 10),
    total: 0,
    category_id: parseInt(searchParams.get('category_id') || '1', 10),
  });
  const [categories, setCategories] = useState([]);
  // ─── 新增：品牌列表 & 已選品牌 state ───
  const [brands, setBrands] = useState([]);
  const [selectedBrands, setSelectedBrands] = useState(
    searchParams
      .get('brand_id')
      ?.split(',')
      .map((v) => Number(v)) || []
  );

  const [sizes, setSizes] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState(
    searchParams
      .get('size_id')
      ?.split(',')
      .map((v) => Number(v)) || []
  );
  const [showAllSizes, setShowAllSizes] = useState(false);
  const previewCount = 12;
  const sizesToShow = showAllSizes ? sizes : sizes.slice(0, previewCount);
  const canToggleSizes = sizes.length > previewCount;
  const [minPrice, setMinPrice] = useState(searchParams.get('min_price') || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('max_price') || '');
  const [sidebarOpen, setSidebarOpen] = useState(false); //sidebar sheet 狀態

  // 從 URL 同步 category_id (和 page) 到 pageInfo state
  const categoryIdFromUrl = searchParams.get('category_id');
  useEffect(() => {
    const newCategoryId = parseInt(categoryIdFromUrl || '1', 10);
    setPageInfo((prev) => {
      // 只有當 URL 的 category_id 與 state 中的不同時才更新
      if (prev.category_id !== newCategoryId) {
        // 分類已改變，更新 category_id 並重置頁碼為 1
        return { ...prev, category_id: newCategoryId, page: 1 };
      }
      // 如果 category_id 相同，但 URL 的 page 與 state 不同，也同步 page
      // (這部分可以根據 productRes 更新 pageInfo 的邏輯來決定是否需要)
      // const newPage = parseInt(searchParams.get('page') || '1', 10);
      // if (prev.page !== newPage) {
      //   return { ...prev, page: newPage };
      // }
      return prev; // 否則保持不變
    });
  }, [categoryIdFromUrl, searchParams]); // 依賴從 URL 讀取的 category_id 和 searchParams 以捕獲 page 變化

  // 讀分類清單（只做一次）
  useEffect(() => {
    fetch('http://localhost:3005/api/products/categories')
      .then((r) => r.json())
      .then(setCategories)
      .catch(console.error);
  }, []);

  // 讀尺寸列表（當 pageInfo.category_id 變更時觸發）
  useEffect(() => {
    // 確保 pageInfo.category_id 是一個有效的值才去請求
    if (!pageInfo.category_id) return;

    const url = new URL('http://localhost:3005/api/products/sizes');
    url.searchParams.set('category_id', String(pageInfo.category_id));
    fetch(url)
      .then((r) => r.json())
      .then((data) => {
        setSizes(data);
        setSelectedSizes((prevSelected) =>
          prevSelected.filter((id) => data.some((s) => s.id === id))
        );
      })
      .catch(console.error);
  }, [pageInfo.category_id]); // 關鍵依賴：確保 pageInfo.category_id 更新後此 effect 執行

  // ─── 當 category_id 變更時，讀品牌列表 ───
  useEffect(() => {
    if (!pageInfo.category_id) return;
    const url = new URL('http://localhost:3005/api/products/brands');
    url.searchParams.set('category_id', String(pageInfo.category_id));
    fetch(url)
      .then((r) => r.json())
      .then((data) => {
        setBrands(data);
        // 只保留仍存在於新列表裡的 selectedBrands
        setSelectedBrands((prev) =>
          prev.filter((id) => data.some((b) => b.id === id))
        );
      })
      .catch(console.error);
  }, [pageInfo.category_id]);

  // ─── 4. 用 SWR 抓「商品列表」──
  // Key function：
  const productsKey = () => {
    const sp = Object.fromEntries(searchParams.entries());
    sp.include = 'card';
    sp.page = sp.page || '1';
    sp.limit = sp.limit || '12';
    sp.category_id = sp.category_id || '1';
    if (searchParams.get('search')) sp.search = searchParams.get('search');
    const qs = new URLSearchParams(sp).toString();
    return `/api/products?${qs}`;
  };

  const { data: productRes, error: productError } = useSWR(
    productsKey(),
    fetcher
  );

  // 當 SWR 回來結果後，更新 pageInfo（page, limit, total）
  useEffect(() => {
    if (productRes) {
      setPageInfo((prev) => ({
        ...prev, // 保留已同步的 category_id
        page: productRes.page,
        limit: productRes.limit,
        total: productRes.total,
      }));
    }
  }, [productRes]);

  const products = productRes?.data || [];
  const totalPages = Math.max(1, Math.ceil(pageInfo.total / pageInfo.limit));

  // ─── 5. 各種篩選操作 handler ───
  const goToPage = (newPage) => {
    const p = new URLSearchParams(Array.from(searchParams.entries()));
    p.set('page', String(newPage)); // 確保是 string
    router.push(`?${p.toString()}`);
  };

  const changeLimit = (newLimit) => {
    const p = new URLSearchParams(Array.from(searchParams.entries()));
    p.set('page', '1');
    p.set('limit', String(newLimit)); // 確保是 string
    router.push(`?${p.toString()}`);
  };

  const handleCategorySelect = (cid) => {
    // setPageInfo 更新 category_id 的邏輯已移至上面的 useEffect
    const p = new URLSearchParams(Array.from(searchParams.entries()));
    p.set('page', '1');
    p.set('category_id', String(cid)); // 確保是 string
    router.push(`?${p.toString()}`);
  };

  const handleToggleCategory = (label, open) => {
    setOpenCategories((prev) => {
      const set = new Set(prev);
      open ? set.add(label) : set.delete(label);
      return Array.from(set);
    });
  };

  // ─── 新增：切換品牌 checkbox───
  const handleToggleBrand = (bid) => {
    const next = selectedBrands.includes(bid)
      ? selectedBrands.filter((i) => i !== bid)
      : [...selectedBrands, bid];
    const p = new URLSearchParams(Array.from(searchParams.entries()));
    p.set('page', '1');
    if (next.length) p.set('brand_id', next.join(','));
    else p.delete('brand_id');
    router.push(`?${p.toString()}`);
    setSelectedBrands(next);
  };

  // ─── 新增：重置品牌───
  const handleResetBrands = () => {
    const p = new URLSearchParams(Array.from(searchParams.entries()));
    p.delete('brand_id');
    p.set('page', '1');
    router.push(`?${p.toString()}`, undefined, { shallow: true });
    setSelectedBrands([]);
  };

  // 1. Helper：根據 categories & selectedCategoryId 計算要預設開啟哪些 label
  const getDefaultOpen = (categoriesList, selectedId) => {
    const set = new Set();

    // 總是展開 id=1 的那一路
    const fixed = categoriesList.find((c) => c.id === 1);
    if (fixed?.fullPath) {
      fixed.fullPath
        .split(' > ')
        .map((s) => s.trim())
        .forEach((label) => set.add(label));
    }

    // 如果有選中分類，再把它的 fullPath 也拆開加入
    if (selectedId) {
      const cur = categoriesList.find((c) => c.id === selectedId);
      if (cur?.fullPath) {
        cur.fullPath
          .split(' > ')
          .map((s) => s.trim())
          .forEach((label) => set.add(label));
      }
    }

    return Array.from(set);
  };
  // 2. openCategories state，初始值用 helper 計算
  const [openCategories, setOpenCategories] = useState(() =>
    getDefaultOpen(categories, pageInfo.category_id)
  );
  // 3. 當 categories 或 selectedCategoryId (= pageInfo.category_id) 變動時，重新同步
  useEffect(() => {
    setOpenCategories(getDefaultOpen(categories, pageInfo.category_id));
  }, [categories, pageInfo.category_id]);

  const handleToggleSize = (sid) => {
    const next = selectedSizes.includes(sid)
      ? selectedSizes.filter((i) => i !== sid)
      : [...selectedSizes, sid];
    const p = new URLSearchParams(Array.from(searchParams.entries()));
    p.set('page', '1');
    if (next.length) p.set('size_id', next.join(','));
    else p.delete('size_id');
    router.push(`?${p.toString()}`);
    setSelectedSizes(next); // 立即更新 UI 反饋
  };

  // (其餘 handleSelect, JSX return 部分不變)
  // 新增：重置所有尺寸的 handler
  const handleResetSizes = () => {
    // 1. 清掉 URL 上的 size_id，並把 page 重設1
    const p = new URLSearchParams(Array.from(searchParams.entries()));
    p.delete('size_id');
    p.set('page', '1');
    router.push(`?${p.toString()}`, undefined, { shallow: true });

    // 2. 立即在 UI 上清空 selectedSizes
    setSelectedSizes([]);
  };

  // 價格錯誤訊息 state
  const [priceError, setPriceError] = useState('');

  // onTriggerPriceFilter 改成帶驗證
  const handlePriceFilter = () => {
    const min = Number(minPrice);
    const max = Number(maxPrice);
    if (min < 0 || max < 0) {
      setPriceError('價格不可為負數');
      return;
    }
    if (max < min) {
      setPriceError('最高價不能低於最低價');
      return;
    }
    // 驗證通過
    setPriceError('');
    const p = new URLSearchParams(Array.from(searchParams.entries()));
    p.set('page', '1');
    if (minPrice) p.set('min_price', minPrice);
    else p.delete('min_price');
    if (maxPrice) p.set('max_price', maxPrice);
    else p.delete('max_price');
    router.push(`?${p.toString()}`, undefined, { shallow: true });
  };

  // 重置價格
  const handleResetPrice = () => {
    const p = new URLSearchParams(Array.from(searchParams.entries()));
    p.delete('min_price');
    p.delete('max_price');
    p.set('page', '1');
    router.push(`?${p.toString()}`, undefined, { shallow: true });
    setMinPrice('');
    setMaxPrice('');
    setPriceError('');
  };

  if (isLoading) {
    return <div>載入中...</div>; // 顯示 loading 畫面
  }

  if (!isAuth) {
    // return <div>請先登入才能查看此頁面。</div>;
  }

  return (
    <Container className="z-10 pt-4 md:pt-10 pb-20">
      <div>
        <h1>你好，{user?.name}！</h1>
        <p>你的 Email 是：{user.email}</p>
      </div>
      <main className="flex flex-col md:flex-row min-h-1/2 gap-4 md:gap-20 justify-between">
        {/* <ProductSidebar
          limit={pageInfo.limit}
          onChangeLimit={changeLimit}
          categories={categories}
          selectedCategoryId={pageInfo.category_id}
          onSelectCategory={handleCategorySelect}
          openCategories={openCategories}
          onToggleCategory={handleToggleCategory}
          sizes={sizesToShow}
          selectedSizes={selectedSizes}
          onToggleSize={handleToggleSize}
          onResetSizes={handleResetSizes}
          showAllSizes={showAllSizes}
          canToggleSizes={canToggleSizes}
          onToggleShowAllSizes={() => setShowAllSizes((prev) => !prev)}
          brands={brands}
          selectedBrands={selectedBrands}
          onToggleBrand={handleToggleBrand}
          onResetBrands={handleResetBrands}
          minPrice={minPrice}
          maxPrice={maxPrice}
          onChangePrice={(type, val) => {
            const clean = val.replace(/\D/g, '');
            if (type === 'min') setMinPrice(clean);
            else setMaxPrice(clean);
            setPriceError('');
          }}
          onTriggerPriceFilter={handlePriceFilter}
          onResetPrice={handleResetPrice}
          priceError={priceError}
          searchValue={searchText}
          onChangeSearch={setSearchText}
          suggestions={suggestions} // <--- 傳遞搜尋建議
          isLoading={sugLoading} // <--- 傳遞加載狀態
          onSelect={handleSelect} // <--- 傳遞點選建議處理
        ></ProductSidebar> */}

        {/* md+ 顯示常駐 Sidebar */}
        <div className="hidden md:flex">
          <ProductSidebar
            limit={pageInfo.limit}
            onChangeLimit={changeLimit}
            categories={categories}
            selectedCategoryId={pageInfo.category_id}
            onSelectCategory={handleCategorySelect}
            openCategories={openCategories}
            onToggleCategory={handleToggleCategory}
            sizes={sizesToShow}
            selectedSizes={selectedSizes}
            onToggleSize={handleToggleSize}
            onResetSizes={handleResetSizes}
            showAllSizes={showAllSizes}
            canToggleSizes={canToggleSizes}
            onToggleShowAllSizes={() => setShowAllSizes((prev) => !prev)}
            brands={brands}
            selectedBrands={selectedBrands}
            onToggleBrand={handleToggleBrand}
            onResetBrands={handleResetBrands}
            minPrice={minPrice}
            maxPrice={maxPrice}
            onChangePrice={(type, val) => {
              const clean = val.replace(/\D/g, '');
              if (type === 'min') setMinPrice(clean);
              else setMaxPrice(clean);
              setPriceError('');
            }}
            onTriggerPriceFilter={handlePriceFilter}
            onResetPrice={handleResetPrice}
            priceError={priceError}
            searchValue={searchText}
            onChangeSearch={setSearchText}
            suggestions={suggestions} // <--- 傳遞搜尋建議
            isLoading={sugLoading} // <--- 傳遞加載狀態
            onSelect={handleSelect} // <--- 傳遞點選建議處理
          />
        </div>

        {/* md- 顯示按鈕 + Sheet */}
        <div className="flex md:hidden">
          <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" className="m-4">
                <Sliders className=" h-4 w-4" />
                篩選
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-full p-4 overflow-auto">
              <SheetHeader className="flex items-center justify-between">
                <SheetTitle>篩選條件</SheetTitle>
              </SheetHeader>
              <ProductSidebar
                limit={pageInfo.limit}
                onChangeLimit={changeLimit}
                categories={categories}
                selectedCategoryId={pageInfo.category_id}
                onSelectCategory={handleCategorySelect}
                openCategories={openCategories}
                onToggleCategory={handleToggleCategory}
                sizes={sizesToShow}
                selectedSizes={selectedSizes}
                onToggleSize={handleToggleSize}
                onResetSizes={handleResetSizes}
                showAllSizes={showAllSizes}
                canToggleSizes={canToggleSizes}
                onToggleShowAllSizes={() => setShowAllSizes((prev) => !prev)}
                brands={brands}
                selectedBrands={selectedBrands}
                onToggleBrand={handleToggleBrand}
                onResetBrands={handleResetBrands}
                minPrice={minPrice}
                maxPrice={maxPrice}
                onChangePrice={(type, val) => {
                  const clean = val.replace(/\D/g, '');
                  if (type === 'min') setMinPrice(clean);
                  else setMaxPrice(clean);
                  setPriceError('');
                }}
                onTriggerPriceFilter={handlePriceFilter}
                onResetPrice={handleResetPrice}
                priceError={priceError}
                searchValue={searchText}
                onChangeSearch={setSearchText}
                suggestions={suggestions} // <--- 傳遞搜尋建議
                isLoading={sugLoading} // <--- 傳遞加載狀態
                onSelect={handleSelect} // <--- 傳遞點選建議處理
              />
            </SheetContent>
          </Sheet>
        </div>

        <div className="flex flex-col gap-10 flex-1">
          <ProductList products={products} />
          {productError && (
            <div className="text-red-500">載入商品時發生錯誤</div>
          )}
          <ProductPagination
            page={pageInfo.page}
            totalPages={totalPages}
            onPageChange={goToPage}
          />
        </div>
      </main>
    </Container>
  );
}
