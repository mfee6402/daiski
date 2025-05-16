'use client';
import { produce } from 'immer';
import { useEffect } from 'react';

export default function QuantityButton({
  productIndex = 0,
  data = '',
  setData = () => {},
  type = '',
}) {
  const url = `http://localhost:3005/api/cart/${productIndex}`;
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
        onClick={() => {
          console.log(data.cart);
          const nextCart = produce(data, (draft) => {
            if (type === 'minus') {
              draft.cart.CartProduct[productIndex].quantity--;
            } else if (type === 'plus') {
              draft.cart.CartProduct[productIndex].quantity++;
            }
          });
          setData(nextCart);
          fetchData(nextCart);
        }}
      >
        {type === 'minus' && '-'}
        {type === 'plus' && '+'}
      </button>
    </>
  );
}
