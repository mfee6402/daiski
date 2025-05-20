'use client';
import React, { useState } from 'react';

const PasswordInput = ({ label, value, onChange, className = '' }) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="flex flex-col items-start w-full">
      <label className="flex flex-col items-start text-base font-medium tracking-normal leading-none whitespace-nowrap text-slate-500">
        {label}
      </label>
      <div className="flex flex-wrap gap-10 self-stretch py-2 pr-1.5 pl-3 mt-3 w-full bg-white rounded-xl border border-solid shadow-sm border-slate-300">
        <input
          type={showPassword ? 'text' : 'password'}
          value={value}
          onChange={onChange}
          placeholder="@#*%"
          className="my-auto text-base tracking-normal leading-none text-slate-600 bg-transparent border-none outline-none flex-1"
        />
        <div className="flex gap-3.5 items-center pr-4 rounded-none">
          <div className="flex shrink-0 self-stretch my-auto w-px h-10 bg-slate-300" />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="focus:outline-none"
          >
            <img
              src={
                showPassword
                  ? 'https://cdn.builder.io/api/v1/image/assets/TEMP/19478e244cda57bad6800eb9b02531459d6f82d3?placeholderIfAbsent=true&apiKey=c7e2682b052c4c1083ff0177ef8c30b4'
                  : 'https://cdn.builder.io/api/v1/image/assets/TEMP/0e0af9d04fd9bdf243092a4ae958da81808810d6?placeholderIfAbsent=true&apiKey=c7e2682b052c4c1083ff0177ef8c30b4'
              }
              className="object-contain shrink-0 self-stretch my-auto w-6 aspect-square"
              alt={showPassword ? 'Hide password' : 'Show password'}
            />
          </button>
        </div>
      </div>
    </div>
  );
};

export default PasswordInput;
