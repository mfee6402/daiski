'use client';
import Container from '@/components/container';
import ProductList from './_components/product-list';
import ProductFilter from './_components/product-filter';
import ProductPagination from './_components/product-pagination';
import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

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

export default function ProductPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // 初始 state：從 URL 讀 page & limit，fallback 分別是 1 與 12
  const [pageInfo, setPageInfo] = useState({
    page: parseInt(searchParams.get('page') || '1', 10),
    limit: parseInt(searchParams.get('limit') || '12', 10),
    total: 0,
  });
  const [products, setProducts] = useState([]);

  // 監聽 URL 上的 page & limit 變化，更新 state
  useEffect(() => {
    const currentPage = parseInt(searchParams.get('page') || '1', 10);
    const currentLimit = parseInt(searchParams.get('limit') || '12', 10);
    setPageInfo((prev) => ({
      ...prev,
      page: currentPage,
      limit: currentLimit,
    }));
  }, [searchParams]);

  useEffect(() => {
    const { page, limit } = pageInfo;
    const url = new URL('http://localhost:3005/api/products');
    url.searchParams.set('include', 'card');
    url.searchParams.set('page', page);
    url.searchParams.set('limit', limit);

    fetch(url.toString())
      .then((res) => res.json())
      .then(({ page: p, limit: l, total, data }) => {
        setProducts(data);
        setPageInfo((prev) => ({ ...prev, page: p, limit: l, total }));
      })
      .catch(console.error);
  }, [pageInfo.page, pageInfo.limit]);

  const goToPage = (newPage) => {
    const current = new URLSearchParams(Array.from(searchParams.entries()));
    current.set('page', newPage);
    router.push(`?${current.toString()}`);
  };

  const changeLimit = (newLimit) => {
    const current = new URLSearchParams(Array.from(searchParams.entries()));
    current.set('page', '1'); // 換每頁數量時重置為第 1 頁
    current.set('limit', newLimit);
    router.push(`?${current.toString()}`);
    setPageInfo((prev) => ({
      ...prev,
      limit: newLimit,
      page: 1,
    }));
  };

  const totalPages = Math.max(1, Math.ceil(pageInfo.total / pageInfo.limit));

  return (
    <Container className="z-10 pt-10 pb-20">
      <main className="flex flex-row min-h-1/2 gap-20">
        <ProductFilter limit={pageInfo.limit} onChangeLimit={changeLimit} />
        <div className="flex flex-col gap-10">
          <ProductList products={products} />
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
