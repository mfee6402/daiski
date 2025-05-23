'use client';
import React from 'react';
import { Button } from '@/components/ui/button';

export default function ProductAddCartButton({ skuId, quantity }) {
  return (
    <Button className="h-12 bg-primary-600 text-white w-full">
      加入購物車
    </Button>
  );
}
