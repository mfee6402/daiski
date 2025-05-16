'use client';

export default function Content() {
  return (
    <>
      <div className="flex flex-col justify-center items-center gap-10 ">
        <h3 className="font-tw text-h6-tw sm:text-h3-tw ">最新商品</h3>
        <a
          href="/product"
          className="inline-block px-14 py-3  text-primary-600 border  hover:bg-primary-600 hover:text-white font-tw text-p-tw"
        >
          了解更多
        </a>
      </div>
    </>
  );
}
