"use client";
import React, { useState } from 'react';
import FormField from './FormField';
import PasswordInput from './PasswordInput';
import SocialLoginButton from './SocialLoginButton';
import DividerWithText from './DividerWithText';

const SigninDesktop = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
  };

  return (
    <section className="overflow-hidden pr-14 bg-white max-md:pr-5">
      <div className="flex gap-5 max-md:flex-col">
        <div className="w-[59%] max-md:ml-0 max-md:w-full">
          <img
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/8fde0384a901c919ecdbc5e71e87719655e07484?placeholderIfAbsent=true&apiKey=c7e2682b052c4c1083ff0177ef8c30b4"
            alt="Sign up illustration"
            className="object-contain grow w-full aspect-[0.75] max-md:mt-10 max-md:max-w-full"
          />
        </div>
        <div className="ml-5 w-[41%] max-md:ml-0 max-md:w-full">
          <form onSubmit={handleSubmit} className="flex flex-col pb-4 mt-28 w-full max-md:mt-10 max-md:max-w-full">
            <header className="flex flex-col justify-center items-center self-center max-w-full text-gray-900 w-[303px]">
              <h1 className="text-5xl font-bold leading-none max-md:text-4xl">
                註冊
              </h1>
              <p className="mt-9 text-lg">
                <span className="text-[rgb(113,128,150)]">已經是會員?</span>{" "}
                立即登入!
              </p>
            </header>

            <div className="flex flex-col items-start pl-2.5 mt-7 w-full max-md:max-w-full">
              <FormField
                label="電子郵件"
                value={email}
                placeholder="example@gmail.com"
              />

              <div className="mt-8">
                <PasswordInput
                  label="密碼"
                  value={password}
                />
              </div>

              <div className="mt-8">
                <PasswordInput
                  label="確認密碼"
                  value={confirmPassword}
                />
              </div>

              <label className="flex gap-2 mt-9 max-w-full text-base leading-loose whitespace-nowrap text-slate-500 w-[316px] cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreedToTerms}
                  onChange={(e) => setAgreedToTerms(e.target.checked)}
                  className="rounded border border-solid border-slate-300"
                />
                <span>我已閱讀並同意[會員條款]及[隱私權政策]</span>
              </label>
            </div>

            <button
              type="submit"
              className="gap-2 self-stretch px-6 mt-12 text-xl font-semibold leading-snug text-white whitespace-nowrap bg-cyan-900 rounded-3xl min-h-[60px] max-md:px-5 max-md:mt-10 max-md:mr-2.5"
            >
              登入
            </button>

            <DividerWithText text="OR" />

            <div className="mt-12 space-y-9">
              <SocialLoginButton
                provider="Google"
                icon="https://cdn.builder.io/api/v1/image/assets/TEMP/548e3362281a848e42c2e25a5aa18a2e1797bb30?placeholderIfAbsent=true&apiKey=c7e2682b052c4c1083ff0177ef8c30b4"
              />
              <SocialLoginButton
                provider="Facebook"
                icon="https://cdn.builder.io/api/v1/image/assets/TEMP/89b0eb945a3dedbb5789683a5d285e7d38e6fd28?placeholderIfAbsent=true&apiKey=c7e2682b052c4c1083ff0177ef8c30b4"
              />
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default SigninDesktop;
