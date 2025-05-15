'use client';
import HomeDelivery from './shipping-options/home-delivery';
import StorePickup from './shipping-options/storePickup';

export default function ShippingOptions({
  shippingSelected = '',
  setShippingSelected = () => {},
  name = '',
  method = '',
}) {
  return (
    <>
      <label className="inline-flex items-center space-x-2 relative">
        <input
          value={method}
          checked={shippingSelected === method}
          type="radio"
          name="shippingMethod"
          className="peer appearance-none w-6 h-6 rounded-full border-2 border-primary-600   checked:border-primary-600"
          onChange={() => setShippingSelected(method)}
        />
        {/* 內部圓點 */}
        <span className="pointer-events-none w-3  h-3 rounded-full bg-primary-600 absolute left-1.5 my-auto opacity-0 peer-checked:opacity-100" />

        <h6 className=" text-h6-tw">{name}</h6>
      </label>
      {/* 每個選項只負責自己的擴展內容 */}
      {shippingSelected === method && (
        <HomeDelivery shippingSelected={shippingSelected}></HomeDelivery>
      )}
      {shippingSelected === method && (
        <StorePickup shippingSelected={shippingSelected}></StorePickup>
      )}
    </>
  );
}
