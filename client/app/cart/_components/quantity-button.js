'use client';
import { produce } from 'immer';
import { useEffect } from 'react';
import { useCart } from '@/hooks/use-cart';
import { CloudCog } from 'lucide-react';
import Delete from './delete-button';
export default function QuantityButton({ item = {}, type = '' }) {
  const url = `http://localhost:3005/api/cart/${item.id}`;
  const { cart, setCart, onAdd } = useCart();

  // FIXME 使用useCart鉤子，避免程式碼重複
  // 將更新傳回後端
  // async function fetchData(updateQuantity) {
  //   try {
  //     await fetch(url, {
  //       method: 'PUT',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify({
  //         updateQuantity: updateQuantity,
  //       }),
  //     });
  //   } catch (err) {
  //     console.log(err);
  //   }
  // }

  return (
    <>
      <button
        className="w-[50]  disabled:border-secondary-200 "
        onClick={() => {
          console.log({ item });
        }}
        // onClick={() => {
        //   const nextCart = produce(cart, (draft) => {
        //     draft.CartProduct.map((item) => {
        //       if (itemId === item.id) {
        //         if (type === 'minus') {
        //           // FIXME 增加刪除功能
        //           return item.quantity === 1
        //             ? alert('將刪除(待做)')
        //             : item.quantity--;
        //         } else if (type === 'plus') {
        //           return item.quantity++;
        //         }
        //       }
        //     });
        //   });
        //   setCart(nextCart);
        //   const updatedItem = nextCart.CartProduct.find(
        //     (item) => item.id === itemId
        //   );
        //   if (updatedItem) {
        //     fetchData(updatedItem.quantity);
        // onAdd('CartProduct', {
        //   id: itemId,
        //   quantity: updatedItem.quantity,
        //   price: updatedItem.price,
        //   name: updatedItem.name,
        //   imageUrl: updatedItem.imageUrl,
        //   size: updatedItem.size,
        // });
        // }
        // }}
      >
        {/* FIXME -號要加大*/}
        <div>
          <p className="text-h6-tw ">{type === 'minus' && '-'}</p>
        </div>
        <div>
          <p className="text-h6-tw">{type === 'plus' && '+'}</p>
        </div>
      </button>
    </>
  );
}
