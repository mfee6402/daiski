'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/use-auth';
import {
  useAuthGet,
  useAuthLogout,
  useAuthLogin,
} from '@/services/rest-client/use-user';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { color } from 'framer-motion';

export default function UserPage() {
  // 輸入表單用的狀態
  const [userInput, setUserInput] = useState({ account: '', password: '' });

  // 登入後設定全域的會員資料用
  const { mutate } = useAuthGet();
  const { login } = useAuthLogin();
  const { logout } = useAuthLogout();

  // 取得登入狀態
  const { isAuth, isLoading } = useAuth();

  // 輸入帳號與密碼框用
  const handleFieldChange = (e) => {
    setUserInput({ ...userInput, [e.target.name]: e.target.value });
  };

  // 處理登入
  const handleLogin = async () => {
    // 如果是已登入狀態，就不要再登入
    if (isAuth) {
      toast.error('錯誤 - 會員已登入');
      return;
    }

    const res = await login(userInput);
    const resData = await res.json();

    console.log(resData);

    if (resData?.status === 'success') {
      // 呼叫useAuthGet的mutate方法
      // 將會進行重新驗證(revalidation)(將資料標記為已過期並觸發重新請求)
      mutate();

      toast.success('已成功登入');
    } else {
      toast.error(`登入失敗`);
    }
  };

  // 處理登出
  const handleLogout = async () => {
    const res = await logout();
    const resData = await res.json();
    // 成功登出
    if (resData.status === 'success') {
      // 呼叫useAuthGet的mutate方法
      // 將會進行重新驗證(revalidation)(將資料標記為已過期並觸發重新請求)
      mutate();

      toast.success('已成功登出');
    } else {
      toast.error(`登出失敗`);
    }
  };

  // 處理檢查登入狀態
  const handleCheckAuth = async () => {
    if (isAuth) {
      toast.success('已登入會員');
    } else {
      toast.error(`非會員身份`);
    }
  };

  if (isLoading) {
    return (
      <div>
        <h3>載入中...</h3>
      </div>
    );
  }

  return (
    <>
      <div className="flex container justify-center  mx-auto  gap-1">
        <div className="w-1/2 px-6 py-12">
          <div className="text-center ">
            <h1 className="text-h2-tw">登入</h1>
            <p>
              還不是會員？
              <a href="">
                <span className="text-primary-600">現在加入！</span>
              </a>
            </p>
          </div>
          <div className="max-w-md mx-auto mt-6">
            <label>
              帳號:
              <input
                type="text"
                name="account"
                value={userInput.account}
                onChange={handleFieldChange}
                className="w-full px-4 py-3 rounded-lg border border-[#dae9f2] focus:outline-none focus:ring-2 focus:ring-[#2770ea]"
              />
            </label>
            <label className="">
              密碼:
              <input
                type="text"
                name="password"
                value={userInput.password}
                onChange={handleFieldChange}
                className="w-full px-4 py-3 rounded-lg border border-[#dae9f2] focus:outline-none focus:ring-2 focus:ring-[#2770ea]"
              />
            </label>

            <button
              onClick={handleLogin}
              className="w-full mt-16 px-4 py-3 bg-[#2770ea] rounded-md hover:text-amber-100"
            >
              登入(login)
            </button>
          </div>

          <div className="mt-16">
            <button
              onClick={() => {
                // 測試帳號 harry/11111
                setUserInput({ account: 'harry', password: '11111' });
              }}
            >
              一鍵輸入範例
            </button>
            <hr />
            {/* <h1>會員登入認証&授權測試(JWT)</h1> */}
            <p>會員狀態:{isAuth ? '已登入' : '未登入'}</p>
            <hr />
            <button onClick={handleLogout}>登出(logout)</button>
            <hr />
            <button onClick={handleCheckAuth}>檢查登入狀況(check login)</button>
            <hr />

            {/* <p>
            以下連結為測試會員隱私資料頁，如果未登入完成會跳轉回登入頁(本頁)，實作程式碼詳見useAuth勾子
          </p> */}
            <p>
              <Link href="/auth/login/status">存取會員隱私資料</Link>
            </p>
          </div>
        </div>
        <div className="w-1/2 sr-only sm:not-sr-only">
          <figure>
            <img
              src="/login.png"
              alt="Login Image"
              className="w-full shadow-lg"
            />
          </figure>
        </div>
      </div>

      {/* 土司訊息視窗用 */}
      <ToastContainer />
    </>
  );
}
