"use client";
import React from 'react';
import ProfileTabs from './_components/ProfileTabs';
import ProfileAvatar from './_components/ProfileAvatar';
import ProfileBio from './_components/ProfileBio';
import ProfileForm from './_components/ProfileForm';

const SectionKv = () => {
  return (
    <main className="flex overflow-hidden relative flex-col pt-24 min-h-[1251px] shadow-[0px_4px_4px_rgba(0,0,0,0.25)]">
      <img
        src="https://cdn.builder.io/api/v1/image/assets/TEMP/b9dac4507e93d421bdae6f308f39274dce7c350e?placeholderIfAbsent=true&apiKey=c7e2682b052c4c1083ff0177ef8c30b4"
        alt="Background"
        className="object-cover absolute inset-0 size-full"
      />
      <img
        src="https://cdn.builder.io/api/v1/image/assets/TEMP/216f9b887d17ce426c90c029279717dd8c4be8db?placeholderIfAbsent=true&apiKey=c7e2682b052c4c1083ff0177ef8c30b4"
        alt="Decoration"
        className="object-contain absolute z-0 w-10 h-10 aspect-square bottom-[187px] right-[13px]"
      />
      <div className="flex relative z-0 flex-col flex-1 items-end self-center max-w-full bg-white bg-opacity-0 w-[1536px]">
        <ProfileTabs />
        <section className="flex gap-10 justify-center items-start py-8 w-full max-w-screen-2xl bg-white bg-opacity-80">
          <div className="flex flex-wrap gap-10 items-center min-w-60">
            <ProfileAvatar />
            <ProfileBio />
          </div>
        </section>
        <ProfileForm />
      </div>
    </main>
  );
};

export default SectionKv;

