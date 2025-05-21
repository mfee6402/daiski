'use client';
import React from 'react';
import CouponHeader from './CouponHeader';
import CouponTabs from './CouponTabs';
import CouponFilters from './CouponFilters';
import CouponList from './CouponList';
import Pagination from './Pagination';

const CouponManagement = () => {
  return (
    <main className="flex flex-col gap-8 items-center pt-8 w-full bg-white bg-opacity-80 flex-[1_0_0]">
      <section className="flex flex-col gap-6 items-start px-5 py-2.5 w-full">
        <CouponHeader />
        <CouponTabs />
        <div className="flex relative justify-center items-center pb-0.5 w-full h-[3px]">
          <div className="absolute top-0 left-0 w-full h-px bg-slate-200" />
        </div>
        <CouponFilters />
      </section>
      <CouponList />
      <Pagination />
    </main>
  );
};

export default CouponManagement;
