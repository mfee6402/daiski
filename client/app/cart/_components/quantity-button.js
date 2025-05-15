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
  async function fetchData() {
    try {
      const res = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          data: data,
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
          const nextCart = produce(data, (draft) => {
            if (type === 'minus') {
              draft.cart.CartProduct[productIndex].quantity--;
            } else if (type === 'plus') {
              draft.cart.CartProduct[productIndex].quantity++;
            }
          });
          setData(nextCart);
          fetchData();
        }}
      >
        +
      </button>
    </>
  );
}
