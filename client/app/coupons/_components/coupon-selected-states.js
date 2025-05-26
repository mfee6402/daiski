'use client';

export default function CouponSelectedStates({
  state,
  selectedStates,
  setSelectedStates,
  onClick,
}) {
  const isActive = selectedStates === state;

  return (
    <button
      className={`font-tw leading-p-tw hover:underline decoration-red decoration-2 underline-offset-4 cursor-pointer ${
        isActive ? 'underline' : ''
      }`}
      onClick={onClick}
    >
      {state}
    </button>
  );
}
