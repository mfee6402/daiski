import { createContext, useContext, useState, useEffect } from 'react'

// context套用第1步: 建立context
// createContext的傳入參數defaultValue也有備援值(context套用失敗或錯誤出現的值)
// 以下為jsdoc的註解，這個註解是用來描述這個context的值的結構
/**
 * 購物車上下文，用於提供購物車相關的狀態和操作函式。
 *
 * 此上下文包含購物車的商品列表、操作函式（如增加、減少、移除商品）以及購物車的總數量和總金額。
 *
 * @typedef {Object} CartContextValue
 * @property {Array} items - 購物車中的商品列表，每個商品是包含 `id`、`count` 等屬性的物件。
 * @property {(itemId: string) => void} onIncrease - 用於增加購物車中某商品數量的函式。
 * @property {(itemId: string) => void} onDecrease - 用於減少購物車中某商品數量的函式。
 * @property {(itemId: string) => void} onRemove - 用於移除購物車中某商品的函式。
 * @property {(product: { id: string; price: number; name: string }) => void} onAdd - 用於將新商品加入購物車的函式。
 * @property {number} totalQty - 購物車中所有商品的總數量。
 * @property {number} totalAmount - 購物車中所有商品的總金額。
 */
/**
 * 購物車上下文，用於提供購物車相關的狀態和操作函式。
 *
 * @type {React.Context<CartContextValue | null>}
 */
const CartContext = createContext(null)
// 設定displayName屬性(react devtools除錯用)
CartContext.displayName = 'CartContext'

// 有共享狀態的CartProvider元件，用來包裹套嵌的元件
export function CartProvider({ children }) {
  // 購物車中的項目 與商品的物件屬性會相差一個count屬性(數字類型，代表購買數量)
  const [items, setItems] = useState([])
  // 代表是否完成第一次渲染呈現的布林狀態值(信號值)
  const [didMount, setDidMount] = useState(false)

  // 處理遞增
  const onIncrease = (itemId) => {
    const nextItems = items.map((v) => {
      if (v.id === itemId) {
        // 如果比對出id=itemId的成員，則進行再拷貝物件，並且作修改`count: v.count+1`
        return { ...v, count: v.count + 1 }
      } else {
        // 否則回傳原本物件
        return v
      }
    })

    // 3 設定到狀態
    setItems(nextItems)
  }
  // 處理遞減
  const onDecrease = (itemId) => {
    const nextItems = items.map((v) => {
      if (v.id === itemId) {
        // 如果比對出id=itemId的成員，則進行再拷貝物件，並且作修改`count: v.count-1`
        return { ...v, count: v.count - 1 }
      } else {
        // 否則回傳原本物件
        return v
      }
    })

    // 3 設定到狀態
    setItems(nextItems)
  }
  // 處理刪除
  const onRemove = (itemId) => {
    const nextItems = items.filter((v, i) => {
      // 過濾出id不為itemId的物件資料
      return v.id !== itemId
    })
    // 3
    setItems(nextItems)
  }
  // 處理新增
  const onAdd = (product) => {
    // 判斷要加入的商品物件是否已經在購物車狀態
    const foundIndex = items.findIndex((v) => v.id === product.id)

    if (foundIndex !== -1) {
      // 如果有找到 ===> 遞增購物車狀態商品數量
      onIncrease(product.id)
    } else {
      // 否則 ===> 新增到購物車狀態
      // 擴增一個count屬性， 預設為1
      const newItem = { ...product, count: 1 }
      // 加到購物車狀態最前面
      const nextItems = [newItem, ...items]
      // 設定到狀態
      setItems(nextItems)
    }
  }

  // 使用陣列的迭代方法reduce(歸納, 累加)
  // 稱為"衍生,派生"狀態(derived state)，意即是狀態的一部份，或是由狀態計算得來的值
  const totalQty = items.reduce((acc, v) => acc + v.count, 0)
  const totalAmount = items.reduce((acc, v) => acc + v.count * v.price, 0)

  // 第一次渲染完成後，從localStorage取出儲存購物車資料進行同步化
  useEffect(() => {
    // 讀取localStorage資料(key為cart)，如果不存在(null)會使用預設值空陣列([])
    const storedItems = JSON.parse(localStorage.getItem('cart')) || []
    // 設定到購物車狀態中 localStroage (key=cart) ===> items
    setItems(storedItems)
    // 第一次渲染已完成
    setDidMount(true)
  }, [])

  // 當狀態items有更動時，要進行和loalStorage寫入的同步化
  useEffect(() => {
    // 排除第一次的渲染同步化工作
    if (didMount) {
      // items ===>  localStroage (key=cart)
      localStorage.setItem('cart', JSON.stringify(items))
    }
    // eslint-disable-next-line
  }, [items])

  return (
    <>
      <CartContext.Provider
        // 如果傳出的值很多時，建議可以將數值/函式分組，然後依英文字母排序
        value={{
          items,
          totalAmount,
          totalQty,
          onAdd,
          onDecrease,
          onIncrease,
          onRemove,
        }}
      >
        {children}
      </CartContext.Provider>
    </>
  )
}

// 搭配上面的CartProvider專門客製化名稱的勾子，目的是提供更好的閱讀性
/**
 * 自訂 Hook，用於存取購物車的context(上下文)。
 *
 * 此 Hook 提供購物車context(上下文)的存取功能，包括購物車中的商品列表、
 * 增加、減少、移除商品數量的函式，以及計算購物車總數量與總金額的功能。
 * 使用此 Hook 時，必須在 CartProvider 的子元件中使用。
 *
 * @returns {CartContextValue} 購物車context(上下文)的值。
 *
 * @example
 * const { items, onAdd, onRemove, totalQty, totalAmount } = useCart();
 */
export const useCart = () => useContext(CartContext)
