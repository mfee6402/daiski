'use client';
import Link from 'next/link';
import { useCart } from '@/hooks/use-cart';
import { useEffect, useState } from 'react';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';

import { Button } from '@/components/ui/button';
export default function Checkout() {
  const { cart } = useCart();
  const [checkedCoupon, setCheckedCoupon] = useState(null);
  const totalProduct = cart?.CartProduct?.reduce((acc, product) => {
    acc += product.price * product.quantity;
    return acc;
  }, 0);

  const totalCourse = cart?.CartCourse?.reduce((acc, course) => {
    acc += course.price;
    return acc;
  }, 0);

  const totalGroup = cart?.CartGroup?.reduce((acc, group) => {
    acc += group.price;
    return acc;
  }, 0);

  // couponDiscount
  let couponDiscount = 0;
  let amount = 0;

  if (checkedCoupon && checkedCoupon.type === '現金折扣') {
    couponDiscount = checkedCoupon.amount;
    amount = totalProduct + totalCourse + totalGroup - couponDiscount;
  } else if (checkedCoupon && checkedCoupon.type === '百分比折扣') {
    couponDiscount = Math.floor(
      ((totalProduct + totalCourse) * checkedCoupon.amount) / 100
    );
  }

  amount = totalProduct + totalCourse + totalGroup - couponDiscount;
  useEffect(() => {
    cart.CartCoupon?.forEach((coupon) => {
      if (coupon.checked) {
        setCheckedCoupon(coupon);
      }
    });
  }, [cart]);
  return (
    <>
      <Card
        className="shadow-lg bg-card text-card-foreground dark:bg-card-dark dark:text-card-foreground-dark border border-border dark:border-border-dark   md:sticky md:top-[107px]
    fixed bottom-0 left-0 right-0 z-50 w-full min-w-[350px] "
      >
        <CardHeader>
          <CardTitle className="text-lg font-semibold">結帳明細</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-3  ">
            <div className="flex justify-between">
              <p className="text-p-tw">商品原價總金額</p>
              <p className="text-p-tw">${totalProduct.toLocaleString()}</p>
            </div>

            <div className="flex justify-between">
              <p className="text-p-tw">課程原價總金額</p>
              <p className="text-p-tw">${totalCourse.toLocaleString()}</p>
            </div>

            <div className="flex justify-between">
              <p className="text-p-tw">揪團總金額</p>
              <p className="text-p-tw">${totalGroup.toLocaleString()}</p>
            </div>

            <div className="flex justify-between">
              <p className="text-p-tw">折扣金額(不含揪團)</p>
              {/* FIXME 待寫入金額 */}
              <p className="text-p-tw">
                -
                {checkedCoupon?.type === '百分比折扣'
                  ? `${checkedCoupon.amount}%($${couponDiscount})`
                  : `${couponDiscount}`}
              </p>
            </div>

            <div className="flex justify-between">
              <h6 className="text-h6-tw font-bold">結帳金額</h6>
              <p className="text-red">${amount.toLocaleString()}</p>
            </div>
            {/* FIXME 抓數量於"結帳"字後 */}

            <Link
              href={'/cart/checkout'}
              className="text-p-tw text-secondary-200"
            >
              <Button className="flex justify-center bg-primary-600 w-full py-5">
                結帳
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
