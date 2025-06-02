'use client';

import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';

import { Button } from '@/components/ui/button';
import TwAddressSelector from './home-delivery/twAddressSelector';

export default function HomeDelivery() {
  const [addressDetail, setAddressDetail] = useState('');
  return (
    <>
      {
        <div className="flex flex-col gap-4">
          <div className="flex gap-10">
            <div className=" w-full max-w-64">
              <label className="flex flex-col  gap-3 w-full max-w-64">
                <h6 className="text-p-tw">收貨人</h6>

                <Input
                  className="border-1 border-primary-600 w-full max-w-64  "
                  type="text"
                  name="name"
                  value={addressDetail}
                  onChange={(e) => {
                    setAddressDetail(e.target.value);
                  }}
                />
              </label>
            </div>
            {/* <span className={styles['error']}>{errors.name}</span> */}
            <div className="w-full max-w-64">
              <label className="flex flex-col  gap-3  w-full max-w-64">
                <h6 className="text-p-tw">手機</h6>
                <Input
                  className="border-1 border-primary-600 w-full  max-w-64 "
                  type="text"
                  name="phone"
                  // value={user.email}
                  // onChange={}
                />
              </label>
              {/* <span className={styles['error']}>{errors.email}</span> */}
            </div>
          </div>

          <div className="flex w-full max-w-138">
            <TwAddressSelector></TwAddressSelector>
          </div>
        </div>
      }
    </>
  );
}
