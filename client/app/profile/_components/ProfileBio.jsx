"use client";
import React from 'react';
import Button from './Button';

const ProfileBio = () => {
  return (
    <div className="flex flex-col items-end self-stretch my-auto min-w-60 w-[530px]">
      <div className="max-w-full w-[530px]">
        <div className="w-full max-w-[530px]">
          <label className="text-2xl text-black">個人介紹 </label>
          <textarea
            placeholder="Type your message here"
            className="flex-1 shrink gap-2.5 px-3 pt-2 pb-44 mt-2 w-full text-sm leading-none bg-white rounded-md border border-solid border-slate-300 min-h-[200px] text-slate-400"
          />
        </div>
      </div>
      <Button className="mt-3 px-8 min-h-7 w-[93px]">儲存</Button>
    </div>
  );
};

export default ProfileBio;
