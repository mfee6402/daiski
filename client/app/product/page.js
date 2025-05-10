'use client';
import Container from '@/components/container';
import ProductList from './_components/product-list';
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
  const [products, setProducts] = useState([]);

  // 使用 useEffect 來避免重覆 render
  useEffect(() => {
    // fetch json data
    fetch('http://localhost:3005/api/products?include=card')
      .then((res) => res.json())
      .then((data) => setProducts(data));
    // 給予第二個參數為空陣列
    console.log(products);
  }, []);

  return (
    <>
      <Container className="z-10">
        <main className="">
          <ProductList products={products} />
        </main>
      </Container>
    </>
  );
}
