'use client';

export default function Checkout() {
  return (
    <>
      <div className="relative h-[800]">
        <div className=" w-[450] sm:w-[200] md:w-[250] lg:w-[350] xl:w-[450]  sticky top-30">
          <div className="border-b-5 border-secondary-500">
            <h6 className="text-h6-tw font-bold">結帳明細</h6>
          </div>
          <div className="border-b-5 border-secondary-500">
            <div className="flex justify-between">
              <p className="text-p-tw">商品原價總金額</p>
              {/* NOTE 待寫入金額 */}
              <p className="text-p-tw"></p>
            </div>
            <div>
              <p className="text-p-tw">課程原價總金額</p>
            </div>
            <div>
              <p className="text-p-tw">折扣券</p>
            </div>
          </div>

          <div>
            <h6 className="text-h6-tw font-bold">結帳金額</h6>
          </div>
        </div>
      </div>
    </>
  );
}
