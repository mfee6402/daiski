import React from 'react';

const FormField = ({ label, type = 'text', value, placeholder, className = '' }) => {
  return (
    <div className="flex flex-col items-start w-full">
      <label className="flex gap-2 items-start max-w-full text-base font-medium tracking-normal leading-none whitespace-nowrap text-slate-500">
        {label}
      </label>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        className={`flex flex-col justify-center items-start self-stretch py-2 px-3 mt-3.5 text-base tracking-normal leading-none whitespace-nowrap bg-white rounded-xl border border-solid shadow-sm border-slate-300 text-slate-600 w-full ${className}`}
      />
    </div>
  );
};

export default FormField;
