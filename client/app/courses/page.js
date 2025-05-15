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

export default function CoursesPage(props) {
  const [filters, setFilters] = useState({
    keyword: '',
    boardType: '', // '' | '單板' | '雙板'
    language: '', // '' | '中文' | '日文' | '英文'
  });

  return (
    <main className="bg-white">
      {/* 篩選列 */}
      <div className="max-w-[1440px] mx-auto p-8">
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"></div>
        </div>
      </div>
    </main>
  );
}
