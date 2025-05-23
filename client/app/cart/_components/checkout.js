'use client';
import Link from 'next/link';

export default function Checkout({ data = {} }) {
  return (
    <>
      <div className=" w-[450] sm:w-[200] md:w-[250] lg:w-[350] xl:w-[450]  sticky top-30">
        <div className="border-b-5 border-secondary-500">
          <h6 className="text-h6-tw font-bold">結帳明細</h6>
        </div>
        <div>
          <div className="flex justify-between">
            <p className="text-p-tw">商品原價總金額</p>
            <p className="text-p-tw">
              $
              {data?.cart?.CartProduct.length != 0
                ? data?.cart?.CartProduct.reduce((acc, product) => {
                    acc += product.quantity * product.price;
                    return acc;
                  }, 0).toLocaleString()
                : 0}
            </p>
          </div>
          {/* FIXME等待課程完成 */}
          {/* <div>
            <p className="text-p-tw">課程原價總金額</p>
            <p className="text-p-tw">
              {' '}
              $
              {data?.cart?.CartCourse.length != 0
                ? data?.cart?.CartCourse.reduce((acc, course) => {
                    acc += course.quantity * course.price;
                    return acc;
                  }, 0).toLocaleString()
                : 0}
            </p> */}
        </div>
        <div className="flex justify-between">
          <p className="text-p-tw">揪團總金額</p>
          <p className="text-p-tw">
            $
            {data?.cart?.CartGroup.length != 0
              ? data?.cart?.CartGroup.reduce((acc, group) => {
                  acc += group.price;
                  return acc;
                }, 0).toLocaleString()
              : 0}
          </p>
        </div>
        <div>
          <div>
            <p className="text-p-tw">折扣券</p>
            {/* FIXME 待寫入金額 */}
            <p className="text-p-tw"></p>
          </div>
        </div>

        <div>
          <h6 className="text-h6-tw font-bold">結帳金額</h6>
          {/* FIXME 待寫入金額 */}
          <p className="text-p-tw"></p>
        </div>
        {/* FIXME 抓數量於"結帳"字後 */}

        <Link href={'/cart/checkout'} className="text-p-tw text-secondary-200">
          <div className="flex justify-center bg-primary-600">結帳</div>
        </Link>
      </div>
    </>
  );
}
