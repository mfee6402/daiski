import React from 'react';

const SocialLoginButton = ({ provider, icon, className = '' }) => {
  return (
    <div className="relative w-full">
      <button className={`w-full gap-2 px-6 text-lg font-medium leading-loose border border-solid border-slate-300 min-h-[60px] rounded-[30px] text-slate-500 ${className}`}>
        Continue with {provider}
      </button>
      <img
        src={icon}
        alt={`${provider} icon`}
        className="object-contain absolute top-4 left-7 aspect-[1.04] w-[27px]"
      />
    </div>
  );
};

export default SocialLoginButton;
