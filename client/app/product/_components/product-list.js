// 'use client';

// import { motion } from 'framer-motion';
// import Link from 'next/link';
// import {
//   Card,
//   CardHeader,
//   CardTitle,
//   CardDescription,
//   CardContent,
//   CardFooter,
// } from '@/components/ui/card';

// export default function ProductList({ products }) {
//   return (
//     <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 overflow-hidden">
//       {products.map((p) => (
//         <motion.li
//           key={p.id}
//           initial={{ opacity: 0, y: 30 }}
//           whileInView={{ opacity: 1, y: 0 }}
//           transition={{ type: 'spring', stiffness: 100, damping: 12 }}
//           viewport={{ once: true, amount: 0.2 }}
//           className=""
//         >
//           <Link href={`/product/${p.id}`}>
//             <Card>
//               <CardHeader>
//                 <CardTitle>{p.name}</CardTitle>
//                 <CardDescription>商品細節</CardDescription>
//               </CardHeader>
//               <CardContent className="text-red-500">
//                 <p>${p.price}</p>
//               </CardContent>
//               <CardFooter>
//                 <p>更多資訊</p>
//               </CardFooter>
//             </Card>
//           </Link>
//         </motion.li>
//       ))}
//     </ul>
//   );
// }

// 'use client';

// import { motion } from 'framer-motion';
// import { useRouter } from 'next/navigation';
// import {
//   Card,
//   CardHeader,
//   CardTitle,
//   CardDescription,
//   CardContent,
//   CardFooter,
// } from '@/components/ui/card';
// import Image from 'next/image';
// import FavoriteButton from '@/components/favorite-button';

// export default function ProductList({ products, favIds, onToggleFavorite }) {
//   const router = useRouter();
//   return (
//     <ul className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 overflow-hidden">
//       {products.map((p) => (
//         <motion.li
//           key={p.id}
//           initial={{ opacity: 0, y: 30 }}
//           whileInView={{ opacity: 1, y: 0 }}
//           transition={{ type: 'spring', stiffness: 100, damping: 12 }}
//           viewport={{ once: true, amount: 0.2 }}
//           className="relative"
//           // 點整個卡片才導航
//           onClick={() => router.push(`/product/${p.id}`)}
//         >
//           <Card>
//             {/* 收藏按钮 */}
//             <div className="absolute top-2 right-2 z-10">
//               <FavoriteButton
//                 isFav={favIds.includes(p.id)}
//                 onToggle={() => onToggleFavorite(p.id)}
//                 variant="circle"
//               />
//             </div>
//             <CardHeader className="w-full aspect-[4/3] overflow-hidden rounded-xl">
//               <Image
//                 src={p.image || '/placeholder.jpg'}
//                 alt={p.name}
//                 width={10}
//                 height={10}
//                 className="w-full h-full object-cover transition duration-300 hover:scale-110"
//               />
//             </CardHeader>
//             <CardContent>
//               <CardTitle className="text-lg font-bold mt-2 line-clamp-2 hover:text-primary-500">
//                 {p.name}
//               </CardTitle>
//               <CardDescription className="text-sm text-gray-600 mt-1 line-clamp-1 hover:text-primary-500">
//                 {p.category} / {p.brand}
//               </CardDescription>
//               <p className="text-red-500 font-semibold text-base mt-2">
//                 ${p.price}
//               </p>
//             </CardContent>
//             <CardFooter>
//               <p className="text-sm text-gray-500">
//                 評價：{p.rating || '尚無評價'}
//               </p>
//             </CardFooter>
//           </Card>
//         </motion.li>
//       ))}
//     </ul>
//   );
// }

'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import Image from 'next/image';
import FavoriteButton from '@/components/favorite-button';

export default function ProductList({ products, favIds, onToggleFavorite }) {
  return (
    <ul className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 overflow-hidden">
      {products.map((p) => (
        <motion.li
          key={p.id}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 100, damping: 12 }}
          viewport={{ once: true, amount: 0.2 }}
          className="relative"
        >
          {/* 將整張卡片包在 Link 裡，設定為 block 讓它填滿 li */}
          <Link href={`/product/${p.id}`} className="block relative">
            {/* 收藏按鈕：內部已 stopPropagation，不會觸發 Link */}
            <div className="absolute top-2 right-2 z-5">
              <FavoriteButton
                isFav={favIds.includes(p.id)}
                onToggle={() => onToggleFavorite(p.id)}
                variant="circle"
              />
            </div>

            <Card>
              <CardHeader className="w-full  overflow-hidden p-4">
                <div className="aspect-[4/3]">
                  <Image
                    src={p.image || '/placeholder.jpg'}
                    alt={p.name}
                    width={10}
                    height={10}
                    className="w-full h-full object-contain transition duration-300 hover:scale-110"
                  />
                </div>
              </CardHeader>
              <CardContent>
                <CardTitle className="text-lg font-bold mt-2 line-clamp-2 hover:text-primary-500">
                  {p.name}
                </CardTitle>
                <CardDescription className="text-sm text-gray-600 mt-1 line-clamp-1 hover:text-primary-500">
                  {p.category} / {p.brand}
                </CardDescription>
                <p className="text-red-500 font-semibold text-base mt-2">
                  ${p.price}
                </p>
              </CardContent>
              <CardFooter>
                <p className="text-sm text-gray-500">
                  評價：{p.rating || '尚無評價'}
                </p>
              </CardFooter>
            </Card>
          </Link>
        </motion.li>
      ))}
    </ul>
  );
}
