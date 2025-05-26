'use client'; // 如果你使用 Next.js App Router

import useSWR from 'swr'; // 引入 useSWR
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  TableCaption,
} from '@/components/ui/table'; // 確認路徑是否正確
import Image from 'next/image';

// API URL 常數
const API_BASE_URL = 'http://localhost:3005/api';
const FAVORITES_API_URL = `${API_BASE_URL}/profile/favorites`;
const PRODUCT_API_URL = `${API_BASE_URL}/products`;

// --- JSDoc 類型定義保持不變 ---
/**
 * @typedef {object} ProductCategory
 * @property {number} id
 * @property {string} name
 */
// ... (其他 JSDoc 定義)
/**
 * JSDoc for Product type based on your API
 * @typedef {object} Product
 * @property {number} id
 * @property {string} name
 * @property {number} price
 * @property {string} [image]
 * @property {ProductCategory} [category]
 * @property {ProductBrand} [brand]
 * // ... 其他屬性
 */
// --- JSDoc 類型定義結束 ---

// 通用的 fetcher 函數
const fetcher = async (url) => {
  const res = await fetch(url, {
    credentials: 'include', // 確保 Cookie 被傳送
  });
  if (!res.ok) {
    const error = new Error('請求資料時發生錯誤。');
    try {
      error.info = await res.json(); // 嘗試獲取錯誤的詳細內容
    } catch (e) {
      // 如果回應不是 JSON 或沒有內容
      error.info = res.statusText;
    }
    error.status = res.status;
    throw error;
  }
  return res.json();
};

// 用於獲取單個商品詳細資訊的 fetcher (或在主 fetcher 中處理)
// 為了簡化，我們會在下面的 useSWR 中直接實作商品詳細資訊的獲取邏輯
// 但如果你需要，也可以定義一個專用的商品 fetcher

export default function ProfileWishlist() {
  // 1. 使用 useSWR 獲取收藏商品 ID 列表
  const {
    data: favoriteIds, // 如果成功，favoriteIds 會是 [1,3,4,...] 這樣的陣列
    error: favoritesError,
    isLoading: isLoadingFavorites,
  } = useSWR(FAVORITES_API_URL, fetcher, {
    // SWR 選項 (可選)
    // revalidateOnFocus: true, // 預設為 true，視窗聚焦時重新驗證
    // refreshInterval: 0, // 預設不輪询
  });

  // 2. 根據 favoriteIds 獲取商品詳細資訊
  // SWR 的 key 可以是陣列，當陣列中任何一個值改變時，SWR 會重新請求
  // 如果 favoriteIds 尚未載入完成或為空，則 key 為 null，SWR 不會發起請求
  const productDetailsKey = favoriteIds
    ? ['productDetails', ...favoriteIds]
    : null;

  const {
    data: favoriteProducts, // 這將是完整的商品物件陣列
    error: productsError,
    isLoading: isLoadingProducts,
  } = useSWR(
    productDetailsKey, // 如果 favoriteIds 未定義或為空，這裡會是 null 或 ['productDetails']
    async ([_key, ...ids]) => {
      // _key 是 'productDetails', ids 是 favoriteIds 陣列
      if (!ids || ids.length === 0) {
        return []; // 如果沒有 ID，返回空陣列
      }
      const productDetailsPromises = ids.map(async (id) => {
        // 這裡我們直接呼叫 fetch，因為每個商品的 URL 不同
        // 注意：如果 fetcher 設計為接受完整 URL，也可以使用 fetcher
        const productResponse = await fetch(`${PRODUCT_API_URL}/${id}`, {
          credentials: 'include', // 如果商品 API 也需要認證
        });
        if (!productResponse.ok) {
          console.warn(
            `無法獲取商品 ${id} 的詳細資訊: ${productResponse.statusText}`
          );
          return null;
        }
        const productData = await productResponse.json();
        return {
          id: productData.id,
          name: productData.name,
          price:
            productData.skus && productData.skus.length > 0
              ? productData.skus[0].price
              : 0,
          image:
            productData.images && productData.images.length > 0
              ? productData.images[0]
              : undefined,
          category: productData.category,
          brand: productData.brand,
        };
      });
      return (await Promise.all(productDetailsPromises)).filter(
        (product) => product !== null
      );
    },
    {
      // 當 favoriteIds 改變時，SWR 會自動重新請求
      // SWR 預設的 revalidateOnFocus 等行為對這個 hook 也有效
    }
  );

  const isLoading = isLoadingFavorites || isLoadingProducts;
  const error = favoritesError || productsError;

  if (isLoading) {
    return <p>載入收藏商品中...</p>;
  }

  if (error) {
    // 你可以根據 error.status 或 error.info 顯示更詳細的錯誤訊息
    let errorMessage = '載入收藏商品時發生錯誤。';
    if (error.status === 401) {
      errorMessage = '未授權，請先登入。';
    } else if (error.info && typeof error.info.message === 'string') {
      errorMessage = error.info.message;
    } else if (typeof error.message === 'string') {
      errorMessage = error.message;
    }
    return <p>錯誤: {errorMessage}</p>;
  }

  if (!favoriteProducts || favoriteProducts.length === 0) {
    return <p>您的收藏清單是空的。</p>;
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">我的收藏</h1>
      <Table>
        <TableCaption>這是您收藏的商品列表。</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">圖片</TableHead>
            <TableHead>商品名稱</TableHead>
            <TableHead>分類</TableHead>
            <TableHead>品牌</TableHead>
            <TableHead className="text-right">價格</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {favoriteProducts.map((product) => (
            <TableRow key={product.id}>
              <TableCell>
                {product.image ? (
                  <Image
                    src={product.image}
                    alt={product.name}
                    width={64} // 調整為較合理的預設值，或讓 CSS 控制
                    height={64} // 調整為較合理的預設值，或讓 CSS 控制
                    className="h-16 w-16 object-cover rounded" // CSS 仍然可以覆蓋
                    priority={false} // 通常列表圖片不需要優先載入
                  />
                ) : (
                  <div className="h-16 w-16 bg-gray-200 rounded flex items-center justify-center text-xs text-gray-500">
                    無圖片
                  </div>
                )}
              </TableCell>
              <TableCell className="font-medium">{product.name}</TableCell>
              <TableCell>{product.category?.name || '未分類'}</TableCell>
              <TableCell>{product.brand?.name || '無品牌'}</TableCell>
              <TableCell className="text-right">
                ${product.price ? product.price.toLocaleString() : 'N/A'}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
