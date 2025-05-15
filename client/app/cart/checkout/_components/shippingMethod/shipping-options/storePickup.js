'use client';

import React, { useState, useEffect } from 'react';
import { useShip711StoreOpener } from '../../../_hooks/use-ship-711-store';

export default function StorePickup({ shippingSelected }) {
  const { store711, openWindow } = useShip711StoreOpener(
    `http://localhost:3005/api/shipment/711`,
    { autoCloseMins: 3 } // x分鐘沒完成選擇會自動關閉，預設5分鐘。
  );
  return (
    <>
      {shippingSelected === 'storePickup' && (
        <div className=" w-full">
          <button
            type="button"
            className="bg-secondary-500 px-6 py-2.5 text-h6-tw"
            onClick={() => {
              openWindow();
            }}
          >
            選擇門市
          </button>

          <div>
            <div>
              門市名稱:
              <input
                type="text"
                className="w-auto"
                value={store711.storename}
                disabled
              />
            </div>
            <div>
              門市地址:
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
