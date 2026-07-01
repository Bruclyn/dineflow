'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react'

export type CartItem = {
  menu_item_id: string
  name: string
  price: number
  quantity: number
  restaurant_id: string
  restaurant_name: string
}

type CartContextValue = {
  items: CartItem[]
  addItem: (item: Omit<CartItem, 'quantity'>) => void
  removeItem: (menu_item_id: string) => void
  updateQuantity: (menu_item_id: string, quantity: number) => void
  clearCart: () => void
  itemCount: number
  total: number
}

const CartContext = createContext<CartContextValue | null>(null)

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  // Ref keeps addItem from going stale without needing items in its dependency array
  const itemsRef = useRef(items)
  useEffect(() => {
    itemsRef.current = items
  }, [items])

  const addItem = useCallback((incoming: Omit<CartItem, 'quantity'>) => {
    const current = itemsRef.current

    // Cart is locked to one restaurant — prompt before switching
    if (current.length > 0 && current[0].restaurant_id !== incoming.restaurant_id) {
      const ok = window.confirm(
        `Your cart has items from "${current[0].restaurant_name}".\n\nClear cart and start a new order from "${incoming.restaurant_name}"?`
      )
      if (!ok) return
      setItems([{ ...incoming, quantity: 1 }])
      return
    }

    const existingIdx = current.findIndex((i) => i.menu_item_id === incoming.menu_item_id)
    if (existingIdx !== -1) {
      setItems(
        current.map((i, n) =>
          n === existingIdx ? { ...i, quantity: i.quantity + 1 } : i
        )
      )
    } else {
      setItems([...current, { ...incoming, quantity: 1 }])
    }
  }, [])

  const removeItem = useCallback((menu_item_id: string) => {
    setItems((prev) => prev.filter((i) => i.menu_item_id !== menu_item_id))
  }, [])

  const updateQuantity = useCallback((menu_item_id: string, quantity: number) => {
    if (quantity < 1) return
    setItems((prev) =>
      prev.map((i) => (i.menu_item_id === menu_item_id ? { ...i, quantity } : i))
    )
  }, [])

  const clearCart = useCallback(() => setItems([]), [])

  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0)
  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0)

  return (
    <CartContext.Provider
      value={{ items, addItem, removeItem, updateQuantity, clearCart, itemCount, total }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within <CartProvider>')
  return ctx
}
