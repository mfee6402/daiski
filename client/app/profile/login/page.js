"use client";
import React from 'react';
import LoginHeader from './_component/LoginHeader';
import EmailInput from './_component/EmailInput';
import PasswordInput from './_component/PasswordInput';
import RememberMeSection from './_component/RememberMeSection';
import SocialLoginButtons from './_component/SocialLoginButtons';
import Divider from './_component/Divider';

function LoginPage() {
  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
  };

  return (
    <main className="flex w-full bg-white min-h-[screen]">
      <section className="flex flex-col px-16 py-28 w-[530px] max-md:px-10 max-md:w-full max-sm:px-5">
        <form onSubmit={handleSubmit} className="flex flex-col gap-9 w-full">
          <LoginHeader />

          <div className="flex flex-col gap-9">
            <EmailInput />
            <PasswordInput />
          </div>

          <RememberMeSection />

          <button
            type="submit"
            className="w-full text-xl font-semibold leading-7 text-white bg-cyan-900 rounded-3xl h-[60px]"
          >
            登入
          </button>

          <Divider />

          <SocialLoginButtons />
        </form>
      </section>
      <aside className="flex-1 bg-[url('https://placehold.co/766x1024/12395E/12395E')] max-md:hidden" />
    </main>
  );
}

export default LoginPage;
