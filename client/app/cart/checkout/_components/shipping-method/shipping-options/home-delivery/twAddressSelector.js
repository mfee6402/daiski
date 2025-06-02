'use client';

import React, { useState, useEffect } from 'react';

import { twAddress } from './tw-address-data';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

export default function TwAddressSelector() {
  const [city, setCity] = useState('');
  const [district, setDistrict] = useState('');
  const [zipCode, setZipCode] = useState('');

  const handleCityChange = (value) => {
    setCity(value);
    setDistrict('');
    setZipCode('');
  };

  const handleDistrictChange = (value) => {
    setDistrict(value);
    setZipCode(twAddress[city][value]);
  };
  return (
    <>
      <div className="w-full flex flex-col gap-4 ">
        <h6 className="text-p-tw">地址</h6>

        <div className="flex gap-4">
          {/* 顯示郵遞區號 */}
          <div className="w-full">
            <div className="border px-3 py-1 rounded-md bg-slate-100 text-slate-700">
              {zipCode || '郵遞區號'}
            </div>
          </div>

          {/* 選擇縣市 */}
          <div className="w-full">
            <Select onValueChange={handleCityChange}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="請選擇縣市" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {Object.keys(twAddress).map((cityName) => (
                    <SelectItem key={cityName} value={cityName}>
                      {cityName}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          {/* 選擇區域 */}
          <div className="w-full">
            <Select onValueChange={handleDistrictChange} disabled={!city}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="請選擇區域" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {city &&
                    Object.keys(twAddress[city]).map((districtName) => (
                      <SelectItem key={districtName} value={districtName}>
                        {districtName}
                      </SelectItem>
                    ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <Input
            className="border-1 border-primary-600 w-full  "
            type="text"
            name="phone"
            // value={user.email}
            // onChange={}
          />
        </div>
      </div>
    </>
  );
}
