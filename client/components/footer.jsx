import Image from 'next/image';
import Link from 'next/link';

export default function Footer() {
  return (
    // NOTE min-h-screen做什麼的?他導致我結帳明細sticky有問題
    <div className="flex flex-col">
      {/* <main className="flex-1">123456</main> */}

      <footer className="bg-[#072136] text-[#ffffff] py-12 px-4 md:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-5 gap-8">
          {/* Logo and Contact Info */}
          <div className="md:col-span-1">
            {/* 左側 Logo */}
            <div className="flex-shrink-0">
              <Link href="/">
                <Image
                  src="/LOGO-white.svg"
                  alt="DAISKI"
                  width={150}
                  height={40}
                  className="h-10 w-auto"
                />
              </Link>
            </div>
            <div className="space-y-2 text-sm">
              <p>桃園市 32056 中壢區新生路二段421號</p>
              <p>Mail: DAISKI@gmail.com</p>
              <p>Tel: +886 0912-345-678</p>
              <p>© 2025 by DAISKI</p>
            </div>
          </div>

          {/* Navigation Columns */}
          <div className="md:col-span-1">
            <h3 className="font-medium mb-4 text-lg">關於DAISKI</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="#" className="hover:text-[#eef2f8]">
                  榮譽時刻
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-[#eef2f8]">
                  大事記
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-[#eef2f8]">
                  人才招募
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-[#eef2f8]">
                  隱私權申明
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-[#eef2f8]">
                  服務條款
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-[#eef2f8]">
                  商品專櫃總覽
                </Link>
              </li>
            </ul>
          </div>

          <div className="md:col-span-1">
            <h3 className="font-medium mb-4 text-lg">顧客權益</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="#" className="hover:text-[#eef2f8]">
                  聯絡我們
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-[#eef2f8]">
                  常見Q&A
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-[#eef2f8]">
                  防詐騙宣導
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-[#eef2f8]">
                  退換貨說明
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-[#eef2f8]">
                  24h到貨說明
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-[#eef2f8]">
                  政令宣導
                </Link>
              </li>
            </ul>
          </div>

          <div className="md:col-span-1">
            <h3 className="font-medium mb-4 text-lg">其他服務</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="#" className="hover:text-[#eef2f8]">
                  旅遊
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-[#eef2f8]">
                  美食
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-[#eef2f8]">
                  觀光
                </Link>
              </li>
            </ul>
          </div>

          <div className="md:col-span-1">
            <h3 className="font-medium mb-4 text-lg">企業合作</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="#" className="hover:text-[#eef2f8]">
                  招商專區
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-[#eef2f8]">
                  媒體聯繫
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-[#eef2f8]">
                  大型預約
                </Link>
              </li>
            </ul>

            {/* Social Media Icons */}
            <div className="mt-6 grid grid-cols-2 gap-4">
              <Link
                href="#"
                className="flex items-center justify-center bg-[#ffffff] p-2 rounded-md"
              >
                <Image
                  src="/placeholder.svg?height=24&width=24"
                  alt="Facebook"
                  width={24}
                  height={24}
                  className="text-[#072136]"
                />
              </Link>
              <Link
                href="#"
                className="flex items-center justify-center bg-[#ffffff] p-2 rounded-md"
              >
                <Image
                  src="/placeholder.svg?height=24&width=24"
                  alt="LINE"
                  width={24}
                  height={24}
                  className="text-[#072136]"
                />
              </Link>
              <Link
                href="#"
                className="flex items-center justify-center bg-[#ffffff] p-2 rounded-md"
              >
                <Image
                  src="/placeholder.svg?height=24&width=24"
                  alt="Instagram"
                  width={24}
                  height={24}
                  className="text-[#072136]"
                />
              </Link>
              <Link
                href="#"
                className="flex items-center justify-center bg-[#ffffff] p-2 rounded-md"
              >
                <Image
                  src="/placeholder.svg?height=24&width=24"
                  alt="Twitter"
                  width={24}
                  height={24}
                  className="text-[#072136]"
                />
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
