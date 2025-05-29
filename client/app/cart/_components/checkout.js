'use client';
import Link from 'next/link';
import { useCart } from '@/hooks/use-cart';
import { useEffect, useState } from 'react';

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
  if (!checkedCoupon) {
    amount = totalProduct + totalCourse + totalGroup;
  } else if (checkedCoupon && checkedCoupon.type === '現金折扣') {
    amount = totalProduct + totalCourse + totalGroup - couponDiscount;
  } else if (checkedCoupon && checkedCoupon.type === '百分比折扣') {
    amount = ((totalProduct + totalCourse) * couponDiscount) / 100 + totalGroup;
  }
  useEffect(() => {
    cart.CartCoupon?.forEach((coupon) => {
      if (coupon.checked) {
        setCheckedCoupon(coupon);
      }
    });
  }, [cart]);
  return (
    <>
      <div className="w-[200] sm:w-[200] md:w-[250] lg:w-[300] xl:w-[400]  sticky top-[100px]">
        <div className="border-b-5 border-secondary-500">
          <h6 className="text-h6-tw font-bold">結帳明細</h6>
        </div>
        <div>
          <div className="flex justify-between">
            <p className="text-p-tw">商品原價總金額</p>
            <p className="text-p-tw">${totalProduct.toLocaleString()}</p>
          </div>

          <div className="flex justify-between">
            <p className="text-p-tw">課程原價總金額</p>
            <p className="text-p-tw">${totalCourse.toLocaleString()}</p>
          </div>
        </div>
        <div className="flex justify-between">
          <p className="text-p-tw">揪團總金額</p>
          <p className="text-p-tw">${totalGroup.toLocaleString()}</p>
        </div>

        <div className="flex justify-between">
          <p className="text-p-tw">折扣金額(不含揪團)</p>
          {/* FIXME 待寫入金額 */}
          <p className="text-p-tw">${couponDiscount}</p>
        </div>

        <div className="flex justify-between">
          <h6 className="text-h6-tw font-bold">結帳金額</h6>
          <p className="text-p-tw">${amount.toLocaleString()}</p>
        </div>
        {/* FIXME 抓數量於"結帳"字後 */}

        <Link href={'/cart/checkout'} className="text-p-tw text-secondary-200">
          <div className="flex justify-center bg-primary-600">結帳</div>
        </Link>
      </div>
    </>
  );
}
