'use client';
import React from 'react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/hooks/use-cart';

export default function ProductAddCartButton({
  skuId,
  quantity,
  price,
  name,
  imageUrl,
  size,
}) {
  // const { onAdd } = useCart();

  return (
    <Button
      className="h-12 bg-primary-600 text-white w-full"
      onClick={() => {
        console.log({
          id: skuId,
          quantity: quantity,
          price: price,
          name: name,
          imageUrl: imageUrl,
          size: size,
        });
        // onAdd('CartProduct', {
        //   id: skuId,
        //   quantity: quantity,
        //   price: price,
        //   name: name,
        //   imageUrl: imageUrl,
        //   size: size,
        // });
      }}
    >
      加入購物車
    </Button>
  );
}
