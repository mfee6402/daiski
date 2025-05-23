'use client';
import { produce } from 'immer';
import { useEffect } from 'react';

export default function QuantityButton({
  itemId = 0,
  categoryId,
  data = '',
  setData = () => {},
  type = '',
}) {
  const url = `http://localhost:3005/api/cart/${categoryId}`;
  // 將更新傳回後端
  async function fetchData(nextCart) {
    try {
      const res = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cart: nextCart.cart,
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
          const nextCart = produce(data, (draft) => {
            draft.cart.CartProduct.map((item) => {
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

          setData(nextCart);
          fetchData(nextCart);
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
