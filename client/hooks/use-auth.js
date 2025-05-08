import { createContext, useContext, useState } from 'react'

// context套用第1步: 建立context
// 特殊物件用大駝峰(帕斯卡)命名。createContext的傳入參數defaultValue也有備援值(context套用失敗或錯誤出現的值)，可以用有意義的預設值或是null(通常是針對物件或是要除錯用)

// 以下為jsdoc的註解，這個註解是用來描述這個context的值的結構
/**
 * @typedef {Object} User 使用者資料
 * @property {number} id 使用者的唯一識別碼
 * @property {string} username 使用者名稱
 * @property {string} name 使用者的全名
 * @property {string} email 使用者的電子郵件地址
 *
 * @typedef {Object} AuthContextValue
 * @property {User} user 當前登入的使用者資料
 * @property {boolean} isAuth 是否已登入
 * @property {Function} login 登入方法
 * @property {Function} logout 登出方法
 *
 */

/**
 * 會員上下文，用於提供會員認証與授權相關的狀態和操作函式。
 *
 * @type {React.Context<AuthContextValue | null>}
 */
const AuthContext = createContext(null)
// 設定displayName屬性
// context可選的屬性，用於搭配react devtools(瀏覽器擴充)使用，方便除錯。不給定的話統一使用`Context`名稱
AuthContext.displayName = 'AuthContext'
// 命名導出(named export)
export { AuthContext }

// 命名導出(named export)
// 有共享狀態的AuthProvider元件，它也是用來包裹套嵌的元件(有開頭結尾)
// 和會員認証與授權有關的狀態都集中在這個元件中管理
export function AuthProvider({ children }) {
  // 預設會員的物件值
  const defaultUser = { id: 0, name: '', username: '', email: '' }
  // 定義會員狀態
  const [user, setUser] = useState(defaultUser)
  // 判斷會員是否登入(如果user.id=0則是非登入情況)
  const isAuth = Boolean(user.id)
  // 登入(模擬)
  const login = () => {
    setUser({ id: 3, name: '哈利', username: 'harry', email: 'harry@test.com' })
  }
  // 登出(模擬)
  const logout = () => {
    setUser(defaultUser)
  }

  return (
    <>
      <AuthContext.Provider value={{ isAuth, user, login, logout }}>
        {children}
      </AuthContext.Provider>
    </>
  )
}

// 客製化名稱的自訂勾子
// 目的是提供更好的閱讀性，搭配上面的AuthProvider專門使用
/**
 * useAuth 是一個專門用來讀取 AuthContext 值的自訂勾子 (hook)。
 *
 * 此勾子提供了使用者的相關資訊與操作方法，包括：
 * - 使用者資料 (user)
 * - 是否已登入 (isAuth)
 * - 登入方法 (login)
 * - 登出方法 (logout)
 *
 * @returns {AuthContextValue} 回傳包含使用者資訊與操作方法的物件
 */
export const useAuth = () => useContext(AuthContext)
