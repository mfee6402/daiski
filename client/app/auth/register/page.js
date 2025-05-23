'use client';

import { useState } from 'react';
import { useUserRegister } from '@/services/rest-client/use-user';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAuth } from '@/hooks/use-auth';
import Link from 'next/link';
import { Toaster } from 'sonner';
import Image from 'next/image';

// newUser資料範例(物件) 註: name改為在profile資料表中
// {
//     "username":"ginny",
//     "password":"123456",
//     "name":"金妮",
//     "email":"ginny@test.com",
// }

export default function RegisterPage() {
  const { register } = useUserRegister();
  const [userInput, setUserInput] = useState({
    name: '',
    email: '',
    username: '',
    password: '',
  });

  const { isAuth } = useAuth();

  // 輸入帳號 密碼用
  const handleFieldChange = (e) => {
    setUserInput({ ...userInput, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    // 阻擋表單預設送出行為
    e.preventDefault();
    // 檢查是否有登入，如果有登入就不能註冊
    if (isAuth) {
      toast.error('錯誤 - 會員已登入');
      return;
    }

    const res = await register(userInput);
    const resData = await res.json();

    // console.log(resData)
    if (resData.status === 'success') {
      toast.success('資訊 - 會員註冊成功');
    } else {
      toast.error(`錯誤 - 註冊失敗: ${resData.message}`);
    }
  };

  return (
    <>
      <div className="flex container justify-center  mx-auto  gap-1">
        <div className="w-1/2 sr-only sm:not-sr-only">
          <Image
            src="/register.png"
            alt="register Image"
            width={100}
            height={100}
            className="object-cover shadow-lg w-full"
          />
        </div>
        <div className="w-1/2 px-6 py-12">
          <div className="text-center ">
            <h1 className="text-h2-tw">會員註冊</h1>
            <p>
              已經有帳號？
              <Link href="/auth/login">
                <span className="text-primary-500">點擊登入！</span>
              </Link>
            </p>
          </div>
          <div className="max-w-md mx-auto mt-6">
            <label>
              帳號:
              <input
                type="text"
                name="username"
                value={userInput.username}
                onChange={handleFieldChange}
                className="w-full px-4 py-3 rounded-lg border border-[#dae9f2] focus:outline-none focus:ring-2 focus:ring-[#2770ea]"
              />
            </label>
            <label>
              密碼:
              <input
                type="text"
                name="password"
                value={userInput.password}
                onChange={handleFieldChange}
                className="w-full px-4 py-3 rounded-lg border border-[#dae9f2] focus:outline-none focus:ring-2 focus:ring-[#2770ea]"
              />
            </label>
            <label>
              電子郵件信箱:
              <input
                type="text"
                name="email"
                value={userInput.email}
                onChange={handleFieldChange}
                className="w-full px-4 py-3 rounded-lg border border-[#dae9f2] focus:outline-none focus:ring-2 focus:ring-[#2770ea]"
              />
            </label>
            <button
              type="submit"
              className="w-full mt-16 px-4 py-3 hover:bg-primary-500 rounded-md text-white bg-primary-600"
            >
              註冊
            </button>
          </div>
        </div>
      </div>

      <p>
        規則:
        註冊時，username與email不能與目前資料庫有相同的值。name是屬於profile資料表。
      </p>
      <p>注意: 進行註冊時，應該要在會員登出狀態</p>
      <p>會員狀態:{isAuth ? '已登入' : '未登入'}</p>
      <p>
        <a href="/user">會員登入認証&授權測試(JWT)</a>
      </p>
      <hr />
      <form onSubmit={handleSubmit}>
        <p>
          <label>
            姓名:
            <input
              type="text"
              name="name"
              value={userInput.name}
              onChange={handleFieldChange}
            />
          </label>
        </p>
        <p>
          <label>
            電子郵件信箱:
            <input
              type="text"
              name="email"
              value={userInput.email}
              onChange={handleFieldChange}
            />
          </label>
        </p>
        <p>
          <label>
            帳號:
            <input
              type="text"
              name="username"
              value={userInput.username}
              onChange={handleFieldChange}
            />
          </label>
        </p>
        <p>
          <label>
            密碼:
            <input
              type="text"
              name="password"
              value={userInput.password}
              onChange={handleFieldChange}
            />
          </label>
        </p>
        <br />
        <button type="submit">註冊</button>
        <br />
        <button
          type="button"
          onClick={() => {
            // 測試帳號 herry/11111
            setUserInput({
              name: '榮恩',
              email: 'ron@test.com',
              username: 'ron',
              password: '99999',
            });
          }}
        >
          一鍵輸入範例
        </button>
      </form>
      {/* 土司訊息視窗用 */}
      <ToastContainer />
    </>
  );
}
