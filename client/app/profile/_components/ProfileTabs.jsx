"use client";
import React, { useState } from 'react';

const ProfileTabs = () => {
  const [activeTab, setActiveTab] = useState('揪團');
  const tabs = ['會員資訊', '訂單紀錄', '我的收藏', '揪團'];

  return (
    <nav className="flex gap-2.5 items-center pt-2.5 pl-2.5 text-2xl text-center whitespace-nowrap text-zinc-700">
      <div className="flex flex-wrap gap-2.5 self-stretch p-1.5 my-auto rounded-md bg-slate-100 min-h-20 min-w-60">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`gap-2.5 self-stretch px-3 py-1.5 h-full rounded w-[150px] ${
              activeTab === tab ? 'bg-white' : 'text-neutral-700'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>
    </nav>
  );
};

export default ProfileTabs;
