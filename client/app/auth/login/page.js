'use client'

import { useAuth } from '@/hooks/use-auth'
// 使用Link元件取代a標記(連結)
// 為了保持目前的狀態值(尤其是針對context中的狀態)
import Link from 'next/link'

export default function LoginPage() {
  // context套用第2步: 在後代元件中使用useContext獲得Provider提供的value值
  // 改為useAuth (相當於useContext(AuthContext)
  const { isAuth, login, logout } = useAuth()

  return (
    <>
      <h1>登入頁</h1>
      <Link href="/cs-05-props/context-user/profile">個人資料頁</Link>
      <hr />
      <p>會員狀態: {isAuth ? '登入中' : '尚未登入'}</p>
      <div>
        {isAuth ? (
          <button onClick={logout}>登出</button>
        ) : (
          <button onClick={login}>會員登入</button>
        )}
      </div>
    </>
  )
}
