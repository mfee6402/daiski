'use client';

import { useState } from 'react';
import { useUserRegister } from '@/services/rest-client/use-user';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAuth } from '@/hooks/use-auth';
import Link from 'next/link';
import { Toaster } from 'sonner';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

// newUser資料範例(物件) 註: name改為在profile資料表中
// {
//     "username":"ginny",
//     "password":"123456",
//     "name":"金妮",
//     "email":"ginny@test.com",
// }

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useUserRegister();
  const [userInput, setUserInput] = useState({
    name: '',
    account: '',
    password: '',
    confirmPassword: '',
    email: '',
    phone: '',
    birthday: '',
    is_coach: '',
  });
  //錯誤訊息狀態
  const [errors, setErrors] = useState({
    name: '姓名為必填',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const { isAuth } = useAuth();

  // 輸入帳號 密碼用
  // const handleFieldChange = (e) => {
  //   //[e.target.name]計算得來屬性名稱語法(computed property name)
  //   setUserInput({ ...userInput, [e.target.name]: e.target.value });
  // };

  const handleFieldChange = (e) => {
    const { name, value, type, checked } = e.target;
    setUserInput((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    // 阻擋表單預設送出行為
    e.preventDefault();
    // 檢查是否有登入，如果有登入就不能註冊
    if (isAuth) return toast.error('錯誤：請先登出再註冊');
    if (userInput.password !== userInput.confirmPassword) {
      return toast.error('錯誤：兩次密碼不一致');
    }
    try {
      // 後端要的是數字 0 / 1
      const payload = {
        ...userInput,
        is_coach: userInput.is_coach ? 1 : 0,
      };
      //做表單驗證
      //定義一個全新的錯誤物件，因為使用者會反覆操作修正這表單，代表每次驗證都是從頭驗證起
      const newErrors = {
        name: '姓名為必填',
        email: '',
        password: '',
        confirmPassword: '',
      };
      //最後沒問題提交(fetch)到伺服器
      // const res = await register(userInput);
      // const resData = await res.json();
      const res = await register(payload);
      const data = await res.json().catch(() => ({}));

      if (userInput.name === '') {
        newErrors.name = '姓名為必填';
      }
      // console.log(resData)
      if (res.ok && data.status === 'success') {
        // toast.success('註冊成功！');
        //要補上跳轉到登入頁面
        toast.success('註冊成功', {
          onClose: () => router.push('/auth/login'),
        });
      } else {
        toast.error(`註冊失敗：${data.message || res.statusText}`);
      }
    } catch (err) {
      console.error(err);
      toast.error('無法連線伺服器，稍後再試');
    }
  };

  return (
    <>
      <div className="flex container justify-center  mx-auto  gap-1">
        <div className="hidden sm:block w-1/2 flex-1 min-w-0">
          <Image
            src="/register.png"
            alt="register Image"
            width={100}
            height={100}
            className="object-cover shadow-lg w-full"
          />
        </div>
        <div className="relative w-full sm:w-1/2 py-12 left flex-1 min-w-0 bg-[url('/register.png')] bg-cover bg-center sm:bg-none px-4 sm:px-0">
          <div className="absolute inset-0 bg-white/60 sm:hidden" />
          <div className="relative z-10">
            <div className="text-center ">
              <h1 className="text-h2-tw">會員註冊</h1>
              <p>
                已經有帳號？
                <Link href="/auth/login">
                  <span className="text-primary-500">前往登入！</span>
                </Link>
              </p>
            </div>
            <div className="max-w-md mx-auto mt-6">
              <form onSubmit={handleSubmit} noValidate method="post" action="/">
                <label>
                  姓名:
                  <input
                    type="text"
                    name="name"
                    value={userInput.name}
                    onChange={handleFieldChange}
                    className="w-full px-4 py-3 rounded-lg border border-[#dae9f2] focus:outline-none focus:ring-2 focus:ring-[#2770ea]"
                  />
                </label>
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
                <label>
                  密碼:
                  <input
                    type="password"
                    name="password"
                    value={userInput.password}
                    onChange={handleFieldChange}
                    className="w-full px-4 py-3 rounded-lg border border-[#dae9f2] focus:outline-none focus:ring-2 focus:ring-[#2770ea]"
                  />
                </label>
                <label>
                  確認密碼:
                  <input
                    type="password"
                    name="confirmPassword"
                    value={userInput.confirmPassword}
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
                <label>
                  手機:
                  <input
                    type="text"
                    name="phone"
                    value={userInput.phone}
                    onChange={handleFieldChange}
                    className="w-full px-4 py-3 rounded-lg border border-[#dae9f2] focus:outline-none focus:ring-2 focus:ring-[#2770ea]"
                    required
                  />
                </label>
                <label>
                  生日:
                  <input
                    type="date"
                    name="birthday"
                    value={userInput.birthday}
                    onChange={handleFieldChange}
                    className=""
                    required
                  />
                </label>
                <label className="inline-flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="is_coach"
                    checked={userInput.is_coach}
                    onChange={handleFieldChange}
                  />
                  我是教練
                </label>
                <button
                  type="submit"
                  className="w-full mt-16 px-4 py-3 hover:bg-primary-500 rounded-md text-white bg-primary-600"
                >
                  註冊
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={() => {
          // 測試帳號 herry/11111
          setUserInput({
            name: '榮恩',
            email: 'ron@test.com',
            account: 'ron',
            password: '99999',
            confirmPassword: '99999',
            phone: '0912345678',
            birthday: '1999-01-01',
            is_coach: 'true',
          });
        }}
      >
        一鍵輸入範例
      </button>
      <hr />
      <p>會員狀態:{isAuth ? '已登入' : '未登入'}</p>
      <hr />
      <p>
        規則:
        註冊時，username與email不能與目前資料庫有相同的值。name是屬於profile資料表。
      </p>
      <p>注意: 進行註冊時，應該要在會員登出狀態</p>
      {/* <p>
        <a href="/user">會員登入認証&授權測試(JWT)</a>
      </p> */}
      {/* 土司訊息視窗用 */}
      <ToastContainer position="bottom-right" autoClose={1000} closeOnClick />
    </>
  );
}
