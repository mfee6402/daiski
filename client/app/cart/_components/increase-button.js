'use client';
import { produce } from 'immer';

export default function IncreaseButton({
  productIndex = 0,
  data = '',
  setData = () => {},
}) {
  return (
    <>
      <button
        onClick={() => {
          const nextCart = produce(data, (draft) => {
            draft.cart.CartProduct[productIndex].quantity++;
          });
          setData(nextCart);
        }}
      >
        +
      </button>
    </>
  );
}
