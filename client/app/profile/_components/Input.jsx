"use client";
import React from 'react';

const Input = ({ label, className = '', ...props }) => {
  return (
    <div className="flex flex-wrap gap-4 items-center w-full">
      {label && (
        <label className="self-stretch my-auto text-2xl text-center text-black w-[150px]">
          {label}
        </label>
      )}
      <input
        className={`flex-1 shrink self-stretch px-3 py-2 my-auto text-base leading-7 rounded-md border border-solid border-slate-300 bg-white bg-opacity-80 min-w-60 text-slate-900 ${className}`}
        {...props}
      />
    </div>
  );
};

export default Input;
