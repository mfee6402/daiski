'use client';

import React, { useState, useEffect } from 'react';
import { PiPersonSimpleSki } from 'react-icons/pi';
import { MapPinned } from 'lucide-react';
import { InputWithButton } from './_component/input';
import { DatePickerWithRange } from './_component/datepicker';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Snowflake } from 'lucide-react';
export default function CoursesPage(props) {
  const [filters, setFilters] = useState({
    keyword: '',
    boardType: '', // '' | '單板' | '雙板'
    language: '', // '' | '中文' | '日文' | '英文'
  });

  return (
    <main className="bg-white">
      {/* 篩選列 */}
      <div className=" mx-auto p-8">
        <div className="flex items-center justify-center  gap-2 mb-4 relative">
          <div className="flex flex-wrap items-center gap-4">
            <Select>
              <SelectTrigger className="w-[180px]">
                <PiPersonSimpleSki />
                <SelectValue placeholder="單/雙板" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">單板</SelectItem>
                <SelectItem value="dark">雙板</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger className="w-[180px]">
                <MapPinned />
                <SelectValue placeholder="雪場" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">二世谷</SelectItem>
                <SelectItem value="dark">野澤</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger className="w-[180px]">
                <Snowflake />
                <SelectValue placeholder="難易度" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">初級</SelectItem>
                <SelectItem value="dark">中級</SelectItem>
                <SelectItem value="dark">高級</SelectItem>
              </SelectContent>
            </Select>
            <DatePickerWithRange />
            {/* 關鍵字 */}
            <div className="flex w-100 max-w-sm items-center space-x-2">
              <InputWithButton />
              {/* <Input
              type="text"
              placeholder="請輸入關鍵字..."
              value={filters.keyword}
              onChange={(e) =>
                setFilters((f) => ({ ...f, keyword: e.target.value }))
              }
            />
            <Button
              type="submit"
              onClick={(e) => {
                setFilters((f) => ({ ...f, keyword: e.target.value }));
              }}
            >
              <Send />
              搜尋
            </Button> */}
            </div>
            {/* <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"></div> */}
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
        <div className="max-w-xs max-auto rounded-xl shadow-md overflow-hidden border">
          <img src="" alt="" className="w-full h-48 object-cover" />
          <div className="p-4">
            <h3 className="">S3 第三彈 野澤溫泉&東京五日行</h3>
            <p className="text-sm text-gray-500 mt-1">野澤新季度 啟動!</p>
            <p className="text-sm  mt-2 mb-2">
              售價<span className="text-red-500"> $NT 65,900 </span>起
            </p>
            <hr />
            <button className="mt-4 w-full bg-gray-800 text-white text-sm py-2 rounded-full hover:bg-gray-700 trsndition">
              立即報名
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
