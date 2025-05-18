'use client';
import { produce } from 'immer';
import { useEffect } from 'react';

export default function QuantityButton({
  productId = 0,
  data = '',
  setData = () => {},
  type = '',
}) {
  const url = `http://localhost:3005/api/cart/${productId}`;
  async function fetchData(nextCart) {
    try {
      const res = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          data: nextCart,
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
            draft.cart.CartProduct.map((product) => {
              if (productId === product.productId) {
                type === 'minus' ? product.quantity-- : product.quantity++;
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
