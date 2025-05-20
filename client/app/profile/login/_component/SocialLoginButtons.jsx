import React from 'react';

function SocialLoginButtons() {
  return (
    <div className="flex flex-col gap-9">
      <button
        type="button"
        className="flex gap-2 justify-center items-center w-full border border-slate-300 h-[60px] rounded-[30px]"
      >
        <img
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/ad99e3f8df5160bfdd6f9a5d00273c814f73c50f"
          alt="Google logo"
          className="w-[26px] h-[25px]"
        />
        <span className="text-lg font-medium leading-7 text-slate-500">
          Continue with Google
        </span>
      </button>
      <button
        type="button"
        className="flex gap-2 justify-center items-center w-full border border-slate-300 h-[60px] rounded-[30px]"
      >
        <img
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/bc2b5f54fca021b5ddc18d9994b3fad445dd939c"
          alt="Facebook logo"
          className="w-[26px] h-[26px]"
        />
        <span className="text-lg font-medium leading-7 text-slate-500">
          Continue with Facebook
        </span>
      </button>
    </div>
  );
}

export default SocialLoginButtons;
