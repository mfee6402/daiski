import React from 'react';

function EmailInput() {
  return (
    <div className="flex flex-col gap-3.5">
      <div className="flex flex-col gap-2">
        <label
          htmlFor="email"
          className="text-base font-medium tracking-normal leading-5 text-slate-500"
        >
          電子郵件
        </label>
        <div className="flex items-center px-3 bg-white rounded-xl border shadow-sm border-slate-300 h-[55px]">
          <input
            id="email"
            type="email"
            placeholder="example@gmail.com"
            className="w-full text-base tracking-normal leading-5 bg-transparent text-slate-600"
          />
        </div>
      </div>
    </div>
  );
}

export default EmailInput;
