import React from 'react';

function LoginHeader() {
  return (
    <header className="flex flex-col gap-9 items-center mb-12">
      <h1 className="text-5xl font-bold leading-10 text-gray-900 max-md:text-4xl max-sm:text-4xl">
        登入
      </h1>
      <p className="text-lg leading-7 max-md:text-base">
        <span className="text-slate-500">還不是會員?</span>
        <span className="text-gray-900">現在加入!</span>
      </p>
    </header>
  );
}

export default LoginHeader;
