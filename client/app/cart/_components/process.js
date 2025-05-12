'use client';
import { ShoppingCart } from 'lucide-react';
import { SquarePen } from 'lucide-react';
import { CircleCheckBig } from 'lucide-react';
import clsx from 'clsx';

export default function Process({ step }) {
  const bgSize = 'flex items-center justify-center rounded-full w-25 h-25';
  const iconSize = 'h-16 w-16 p-0 flex items-center justify-center stroke-1';
  const nowStepBgColor = `bg-primary-600`;
  const nowStepIconColor = `stroke-secondary-200`;
  const otherStepBgColor = `bg-secondary-500`;
  const otherStepIconColor = `stroke-primary-600`;

  return (
    <>
      <div className="flex items-center justify-center flex-col">
        <div>
          <div className="flex items-center justify-center m-5">
            <div
              className={clsx(bgSize, {
                [nowStepBgColor]: step === '1',
                [otherStepBgColor]: step === '2' || step === '3',
              })}
            >
              <ShoppingCart
                className={clsx(iconSize, {
                  [nowStepIconColor]: step === '1',
                  [otherStepIconColor]: step === '2' || step === '3',
                })}
              />
            </div>

            <div className="w-[150] h-[5] bg-secondary-500" />

            <div
              className={clsx(bgSize, {
                [nowStepBgColor]: step === '2',
                [otherStepBgColor]: step === '1' || step === '3',
              })}
            >
              <SquarePen
                className={clsx(iconSize, {
                  [nowStepIconColor]: step === '2',
                  [otherStepIconColor]: step === '1' || step === '3',
                })}
              />
            </div>

            <div className="w-[150] h-[5] bg-secondary-500" />

            <div
              className={clsx(bgSize, {
                [nowStepBgColor]: step === '3',
                [otherStepBgColor]: step === '1' || step === '2',
              })}
            >
              <CircleCheckBig
                className={clsx(iconSize, {
                  [nowStepIconColor]: step === '3',
                  [otherStepIconColor]: step === '1' || step === '2',
                })}
              />
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-p-tw">Step 1 確認訂購</p>
            </div>
            <div>
              <p className="text-p-tw">Step 2 確認訂購</p>
            </div>
            <div>
              <p className="text-p-tw">Step 3 確認訂購</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
