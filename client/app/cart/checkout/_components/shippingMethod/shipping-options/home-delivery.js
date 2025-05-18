'use client';

import React, { useState, useEffect } from 'react';

export default function HomeDelivery({ shippingSelected }) {
  return (
    <>
      {shippingSelected === 'homeDelivery' && (
        <div className="flex gap-10">
          <div className=" w-full">
            <label className="flex flex-col  gap-3">
              <h6 className="text-h6-tw">收貨人</h6>

              <input
                className="border-1 border-primary-600 w-full h-12 text-p-tw px-2"
                type="text"
                name="name"
                // value={user.name}
                // onChange={}
              />
            </label>
          </div>
          {/* <span className={styles['error']}>{errors.name}</span> */}
          <div className="w-full">
            <label className="flex flex-col  gap-3  ">
              <h6 className="text-h6-tw">手機</h6>
              <input
                className="border-1 border-primary-600 w-full h-12 text-p-tw  px-2 "
                type="text"
                name="phone"
                // value={user.email}
                // onChange={}
              />
            </label>
            {/* <span className={styles['error']}>{errors.email}</span> */}
          </div>
        </div>
      )}
    </>
  );
}
