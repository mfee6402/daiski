import React from 'react';

function Divider() {
  return (
    <div className="flex gap-4 items-center my-10">
      <div className="flex-1 h-px bg-slate-400" />
      <div className="text-xs tracking-normal leading-5 text-slate-500">
        OR
      </div>
      <div className="flex-1 h-px bg-slate-400" />
    </div>
  );
}

export default Divider;
