'use client';

import React, { useState, useEffect } from 'react';

import ShippingOptions from './shipping-method/shipping-options';

import HomeDelivery from './shipping-method/shipping-options/home-delivery';
import StorePickup from './shipping-method/shipping-options/storePickup';

export default function ShippingMethod({
  selectedShipping = '',
  setSelectedShipping = () => {},
}) {
  return (
    <>
      <ShippingOptions
        name="宅配"
        radioValue="homeDelivery"
        checked={selectedShipping === 'homeDelivery'}
        onChange={() => setSelectedShipping('homeDelivery')}
      ></ShippingOptions>
      {selectedShipping === 'homeDelivery' && <HomeDelivery></HomeDelivery>}

      <ShippingOptions
        name="超商取貨"
        radioValue="storePickup"
        checked={selectedShipping === 'storePickup'}
        onChange={() => setSelectedShipping('storePickup')}
      ></ShippingOptions>
      {/* 每個選項只負責自己的擴展內容 */}
      {selectedShipping === 'storePickup' && <StorePickup></StorePickup>}
    </>
  );
}
