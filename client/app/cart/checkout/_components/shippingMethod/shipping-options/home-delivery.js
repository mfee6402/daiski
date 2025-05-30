'use client';

import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
//PopoverClose=>點擊有效後關閉ＵＩ
import { PopoverClose } from '@radix-ui/react-popover';

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
import { Button } from '@/components/ui/button';

export default function HomeDelivery({ shippingSelected }) {
  return (
    <>
      {shippingSelected === 'homeDelivery' && (
        <div className="flex flex-col gap-4">
          <div className="flex gap-10">
            <div className=" w-full max-w-64">
              <label className="flex flex-col  gap-3 w-full max-w-64">
                <h6 className="text-p-tw">收貨人</h6>

                <Input
                  className="border-1 border-primary-600 w-full max-w-64  "
                  type="text"
                  name="name"
                  // value={user.name}
                  // onChange={}
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

          <div className="flex w-full max-w-128">
            <Label
              htmlFor="type-filter"
              className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1"
            >
              地址
            </Label>
            <Select>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select a fruit" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Fruits</SelectLabel>
                  <SelectItem value="apple">Apple</SelectItem>
                  <SelectItem value="banana">Banana</SelectItem>
                  <SelectItem value="blueberry">Blueberry</SelectItem>
                  <SelectItem value="grapes">Grapes</SelectItem>
                  <SelectItem value="pineapple">Pineapple</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-between dark:text-slate-300 dark:border-slate-600 dark:hover:bg-slate-700"
                >
                  AAA
                  <span aria-hidden="true" className="ml-2">
                    ▾
                  </span>
                </Button>
              </PopoverTrigger>
              <PopoverContent
                side="bottom"
                align="start"
                className="w-[var(--radix-popover-trigger-width)] bg-white dark:bg-slate-800 border-border dark:border-slate-700"
              >
                <div className="flex flex-col space-y-1 p-1">
                  <button className="w-full justify-start dark:text-slate-300 dark:hover:bg-slate-700">
                    AAAAA
                  </button>
                </div>
              </PopoverContent>
            </Popover>
            <label className="flex flex-col  gap-3  w-full max-w-128">
              <h6 className="text-p-tw">地址</h6>
              <Input
                className="border-1 border-primary-600 w-full  max-w-128 "
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
