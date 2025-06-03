'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import RateDialog from './rate-dialog';

export default function RateButton({ orderId, productId }) {
  // 控制 Dialog 開/關
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* 按紐：點擊時打開對話框 */}
      <Button size="sm" onClick={() => setOpen(true)}>
        我要評價
      </Button>

      {/* 把 orderId, productId, open, onOpenChange 傳給 RateDialog */}
      <RateDialog
        orderId={orderId}
        productId={productId}
        open={open}
        onOpenChange={setOpen}
      />
    </>
  );
}
