"use client";
import React from 'react';
import Input from './Input';
import Button from './Button';

const ProfileForm = () => {
  return (
    <section className="flex overflow-hidden flex-col justify-center w-full bg-white bg-opacity-80">
      <div className="flex flex-col justify-center px-6 pt-6 w-full rounded-lg border border-solid bg-white bg-opacity-80 border-slate-300 border-opacity-80 min-h-[737px]">
        <div className="flex-1 w-full">
          <div className="flex w-full min-h-10" />
          <div className="px-64 mt-8 w-full whitespace-nowrap">
            <Input
              label="姓名"
              defaultValue="name"
              className="max-md:max-w-full"
            />
            <div className="mt-8">
              <Input
                label="使用者名稱"
                defaultValue="@peduarte"
                className="max-md:max-w-full"
              />
            </div>
            <div className="mt-8">
              <Input
                label="Email"
                defaultValue="@peduarte"
                className="max-md:max-w-full"
              />
            </div>
            <div className="mt-8">
              <Input
                label="電話"
                defaultValue="@peduarte"
                className="max-md:max-w-full"
              />
            </div>
          </div>
          <div className="flex gap-2 items-center mt-8 w-full text-sm font-medium leading-6">
            <Button variant="secondary">Save changes</Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProfileForm;
