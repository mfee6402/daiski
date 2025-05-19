import React from 'react';

function RememberMeSection() {
  return (
    <div className="flex justify-between items-center mb-10">
      <div className="flex gap-3 items-center">
        <input
          type="checkbox"
          id="remember-me"
          className="w-4 h-4 rounded border border-slate-300"
        />
        <label htmlFor="remember-me" className="text-base leading-10 text-slate-500">
          記住密碼
        </label>
      </div>
      <a
        href="#"
        className="text-base font-medium leading-6 underline text-rose-950"
      >
        忘記密碼?
      </a>
    </div>
  );
}

export default RememberMeSection;
