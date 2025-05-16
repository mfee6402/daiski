'use client';
import Container from '@/components/container';
import ProductList from './_components/product-list';
import ProductPagination from './_components/product-pagination';
import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import ProductSidebar from './_components/product-sidebar';
import useSWR from 'swr';
import { useDebounce } from 'use-debounce';

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

  return (
    <Container className="z-10 pt-10 pb-20">
      <main className="flex flex-row min-h-1/2 gap-20 justify-between">
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
        ></ProductSidebar>

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

/* 
商品V2 2025/5/15 18:22前
*/
// export default function ProductPage() {
//   const searchParams = useSearchParams();
//   const router = useRouter();

//   // 分頁 / 分類 state
//   const [pageInfo, setPageInfo] = useState({
//     page: parseInt(searchParams.get('page') || '1', 10),
//     limit: parseInt(searchParams.get('limit') || '12', 10),
//     total: 0,
//     category_id: parseInt(searchParams.get('category_id') || '1', 10),
//   });

//   const [products, setProducts] = useState([]);
//   const [categories, setCategories] = useState([]);
//   const [sizes, setSizes] = useState([]);
//   const [selectedSizes, setSelectedSizes] = useState([]);

//   // 價格篩選 state
//   const [minPrice, setMinPrice] = useState('');
//   const [maxPrice, setMaxPrice] = useState('');

//   // 讀分類抓尺寸
//   useEffect(() => {
//     const url = new URL('http://localhost:3005/api/products/sizes');
//     url.searchParams.set('category_id', String(pageInfo.category_id));
//     fetch(url)
//       .then((r) => r.json())
//       .then((data) => {
//         setSizes(data);
//         setSelectedSizes((prev) =>
//           prev.filter((id) => data.some((s) => s.id === id))
//         );
//       })
//       .catch(console.error);
//   }, [pageInfo.category_id]);

//   // 讀分類清單
//   useEffect(() => {
//     fetch('http://localhost:3005/api/products/categories')
//       .then((r) => r.json())
//       .then(setCategories)
//       .catch(console.error);
//   }, []);

//   // 任何 URL query 變動，都重新拉資料
//   const fetchProducts = () => {
//     const sp = Object.fromEntries(searchParams.entries());
//     const url = new URL('http://localhost:3005/api/products');
//     url.searchParams.set('include', 'card');
//     url.searchParams.set('page', sp.page || '1');
//     url.searchParams.set('limit', sp.limit || '12');
//     url.searchParams.set('category_id', sp.category_id || '1');
//     if (sp.size_id) url.searchParams.set('size_id', sp.size_id);
//     if (sp.min_price) url.searchParams.set('min_price', sp.min_price);
//     if (sp.max_price) url.searchParams.set('max_price', sp.max_price);

//     fetch(url)
//       .then((r) => r.json())
//       .then(({ page, limit, total, data }) => {
//         setProducts(data);
//         setPageInfo((prev) => ({ ...prev, page, limit, total }));
//       })
//       .catch(console.error);
//   };
//   useEffect(fetchProducts, [searchParams]);

//   // 分頁、每頁數、分類、尺寸、價格篩選都透過 router.push 改 URL
//   const goToPage = (newPage) => {
//     const p = new URLSearchParams(Array.from(searchParams.entries()));
//     p.set('page', newPage);
//     router.push(`?${p}`);
//   };
//   const changeLimit = (newLimit) => {
//     const p = new URLSearchParams(Array.from(searchParams.entries()));
//     p.set('page', '1');
//     p.set('limit', newLimit);
//     router.push(`?${p}`);
//   };
//   const handleCategorySelect = (cid) => {
//     const p = new URLSearchParams(Array.from(searchParams.entries()));
//     p.set('page', '1');
//     p.set('category_id', cid);
//     router.push(`?${p}`);
//   };
//   const handleToggleSize = (sizeId) => {
//     const next = selectedSizes.includes(sizeId)
//       ? selectedSizes.filter((i) => i !== sizeId)
//       : [...selectedSizes, sizeId];
//     const p = new URLSearchParams(Array.from(searchParams.entries()));
//     p.set('page', '1');
//     if (next.length) p.set('size_id', next.join(','));
//     else p.delete('size_id');
//     router.push(`?${p}`);
//     setSelectedSizes(next);
//   };
//   const handlePriceFilter = () => {
//     const p = new URLSearchParams(Array.from(searchParams.entries()));
//     p.set('page', '1');
//     if (minPrice) p.set('min_price', minPrice);
//     else p.delete('min_price');
//     if (maxPrice) p.set('max_price', maxPrice);
//     else p.delete('max_price');
//     router.push(`?${p}`);
//   };

//   const totalPages = Math.max(1, Math.ceil(pageInfo.total / pageInfo.limit));

//   return (
//     <Container className="z-10 pt-10 pb-20">
//       <main className="flex flex-row min-h-1/2 gap-20">
//         <ProductSidebar
//           limit={pageInfo.limit}
//           onChangeLimit={changeLimit}
//           categories={categories}
//           onSelectCategory={handleCategorySelect}
//           sizes={sizes}
//           selectedSizes={selectedSizes}
//           onToggleSize={handleToggleSize}
//           minPrice={minPrice}
//           maxPrice={maxPrice}
//           onChangePrice={(type, value) => {
//             if (type === 'min') setMinPrice(value);
//             else setMaxPrice(value);
//           }}
//           onTriggerPriceFilter={handlePriceFilter}
//         />

//         <div className="flex flex-col gap-10">
//           <ProductList products={products} />
//           <ProductPagination
//             page={pageInfo.page}
//             totalPages={totalPages}
//             onPageChange={goToPage}
//           />
//         </div>
//       </main>
//     </Container>
//   );
// }

/* 
商品V1
*/
// export default function ProductPage() {
//   const searchParams = useSearchParams();
//   const router = useRouter();

//   // 初始 state：從 URL 讀 page & limit，fallback 分別是 1 與 12
//   const [pageInfo, setPageInfo] = useState({
//     page: parseInt(searchParams.get('page') || '1', 10),
//     limit: parseInt(searchParams.get('limit') || '12', 10),
//     total: 0,
//     category_id: parseInt(searchParams.get('category_id') || '1', 10),
//   });
//   const [products, setProducts] = useState([]);
//   const [categories, setCategories] = useState([]);
//   const [sizes, setSizes] = useState([]);
//   const [selectedSizes, setSelectedSizes] = useState([]);
//   const [minPrice, setMinPrice] = useState('');
//   const [maxPrice, setMaxPrice] = useState('');

//   // 當 category_id 變動時，去抓尺寸清單
//   useEffect(() => {
//     const cat = pageInfo.category_id;
//     const url = new URL('http://localhost:3005/api/products/sizes');
//     url.searchParams.set('category_id', String(cat));

//     fetch(url.toString())
//       .then((r) => r.json())
//       .then((data) => {
//         setSizes(data);
//         // 保留之前選的，但如果新分類沒包含，就移除
//         setSelectedSizes((prev) =>
//           prev.filter((id) => data.some((s) => s.id === id))
//         );
//       })
//       .catch(console.error);
//   }, [pageInfo.category_id]);

//   // 監聽 URL 上的 page & limit 變化，更新 state
//   useEffect(() => {
//     const currentPage = parseInt(searchParams.get('page') || '1', 10);
//     const currentLimit = parseInt(searchParams.get('limit') || '12', 10);
//     const currentCategory = parseInt(
//       searchParams.get('category_id') || '1',
//       10
//     );
//     setPageInfo((prev) => ({
//       ...prev,
//       page: currentPage,
//       limit: currentLimit,
//       category_id: currentCategory,
//     }));
//   }, [searchParams]);

//   useEffect(() => {
//     const { page, limit, category_id } = pageInfo;
//     const url = new URL('http://localhost:3005/api/products');
//     url.searchParams.set('include', 'card');
//     url.searchParams.set('page', page);
//     url.searchParams.set('limit', limit);
//     url.searchParams.set('category_id', category_id);

//     if (selectedSizes.length) {
//       url.searchParams.set('size_id', selectedSizes.join(','));
//     } else {
//       url.searchParams.delete('size_id');
//     }

//     fetch(url.toString())
//       .then((res) => res.json())
//       .then(({ page: p, limit: l, total, data }) => {
//         setProducts(data);
//         setPageInfo((prev) => ({ ...prev, page: p, limit: l, total }));
//       })
//       .catch(console.error);
//   }, [pageInfo.page, pageInfo.limit, pageInfo.category_id, selectedSizes]);

//   useEffect(() => {
//     fetch('http://localhost:3005/api/products/categories')
//       .then((res) => res.json())
//       .then((data) => setCategories(data))
//       .catch(console.error);
//   }, []);

//   const goToPage = (newPage) => {
//     const current = new URLSearchParams(Array.from(searchParams.entries()));
//     current.set('page', newPage);
//     router.push(`?${current.toString()}`);
//   };

//   const changeLimit = (newLimit) => {
//     const current = new URLSearchParams(Array.from(searchParams.entries()));
//     current.set('page', '1'); // 換每頁數量時重置為第 1 頁
//     current.set('limit', newLimit);
//     router.push(`?${current.toString()}`);
//     setPageInfo((prev) => ({
//       ...prev,
//       limit: newLimit,
//       page: 1,
//     }));
//   };

//   const handleCategorySelect = (category_id) => {
//     const current = new URLSearchParams(Array.from(searchParams.entries()));
//     current.set('category_id', category_id);
//     current.set('page', '1'); // 選分類後常見做法：跳回第 1 頁
//     router.push(`?${current.toString()}`);
//   };

//   const totalPages = Math.max(1, Math.ceil(pageInfo.total / pageInfo.limit));

//   return (
//     <Container className="z-10 pt-10 pb-20">
//       <main className="flex flex-row min-h-1/2 gap-20">
//         <ProductSidebar
//           limit={pageInfo.limit}
//           onChangeLimit={changeLimit}
//           categories={categories}
//           onSelectCategory={handleCategorySelect}
//           /* 新增三個 props */
//           sizes={sizes}
//           selectedSizes={selectedSizes}
//           onToggleSize={(sizeId) => {
//             // 勾選／取消勾選
//             setSelectedSizes((prev) =>
//               prev.includes(sizeId)
//                 ? prev.filter((i) => i !== sizeId)
//                 : [...prev, sizeId]
//             );
//             // reset 回第 1 頁
//             const params = new URLSearchParams(
//               Array.from(searchParams.entries())
//             );
//             params.set('page', '1');
//             router.push(`?${params.toString()}`);
//           }}
//           minPrice={minPrice}
//           maxPrice={maxPrice}
//           onChangePrice={(type, value) => {
//             if (type === 'min') setMinPrice(value);
//             if (type === 'max') setMaxPrice(value);
//           }}
//           onTriggerPriceFilter={() => {
//             const params = new URLSearchParams(
//               Array.from(searchParams.entries())
//             );
//             params.set('page', '1');
//             router.push(`?${params.toString()}`);
//           }}
//         />
//         <div className="flex flex-col gap-10">
//           <ProductList products={products} />
//           <ProductPagination
//             page={pageInfo.page}
//             totalPages={totalPages}
//             onPageChange={goToPage}
//           />
//         </div>
//       </main>
//     </Container>
//   );
// }
