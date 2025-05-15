'use client';

import React, { useState, useEffect } from 'react';

import ShippingOptions from './shippingMethod/shipping-options';

export default function ShippingMethod() {
  const [shippingSelected, setShippingSelected] = useState('homeDelivery');
  return (
    <>
      <ShippingOptions
        shippingSelected={shippingSelected}
        setShippingSelected={setShippingSelected}
        name="宅配"
        method="homeDelivery"
      ></ShippingOptions>

      <ShippingOptions
        shippingSelected={shippingSelected}
        setShippingSelected={setShippingSelected}
        name="超商取貨"
        method="storePickup"
      ></ShippingOptions>
    </>
  );
}
