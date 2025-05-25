'use client';
import { produce } from 'immer';
import { useEffect } from 'react';
import { useCart } from '@/hooks/use-cart';
import { CloudCog } from 'lucide-react';
export default function QuantityButton({ itemId = 0, type = '' }) {
  const url = `http://localhost:3005/api/cart/${itemId}`;
  const { cart, setCart } = useCart();
  // 將更新傳回後端
  async function fetchData(updateQuantity) {
    try {
      await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          updateQuantity: updateQuantity,
        }),
      });
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <>
      <button
        className="w-[50]"
        onClick={() => {
          const nextCart = produce(cart, (draft) => {
            draft.CartProduct.map((item) => {
              if (itemId === item.id) {
                if (type === 'minus') {
                  // FIXME 增加刪除功能
                  item.quantity === 1
                    ? alert('確認刪除?(待做)')
                    : item.quantity--;
                } else if (type === 'plus') {
                  item.quantity++;
                }
              }
            });
          });

          setCart(nextCart);

          nextCart.CartProduct.map((item) => {
            if (itemId === item.id) {
              fetchData(item.quantity);
            }
          });
        }}
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
