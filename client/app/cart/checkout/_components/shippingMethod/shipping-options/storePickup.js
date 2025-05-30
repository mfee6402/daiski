'use client';

import React, { useState, useEffect } from 'react';
import { useShip711StoreOpener } from '../../../_hooks/use-ship-711-store';
import { Button } from '@/components/ui/button';

export default function StorePickup({ shippingSelected }) {
  const { store711, openWindow } = useShip711StoreOpener(
    `http://localhost:3005/api/shipment/711`,
    { autoCloseMins: 3 } // x分鐘沒完成選擇會自動關閉，預設5分鐘。
  );
  return (
    <>
      {shippingSelected === 'storePickup' && (
        <div className="flex flex-col gap-4 w-full">
          {/* FIXME改顏色 */}
          <Button
            type="button"
            className=" px-6 py-2.5 max-w-24"
            onClick={() => {
              openWindow();
            }}
          >
            選擇門市
          </Button>

          <div className="flex flex-col gap-4">
            <div>
              <span className="whitespace-nowrap">門市名稱 : </span>
              <input
                type="text"
                className="w-auto"
                value={store711.storename}
                disabled
              />
            </div>
            <div className="">
              <span className="whitespace-nowrap">門市地址 : </span>
              <input
                type="text"
                className="w-full"
                value={store711.storeaddress}
                disabled
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
