'use client'

import { useState } from 'react'
import { useCart } from '@/lib/cart/cart-context'

type Props = {
  item: {
    menu_item_id: string
    name: string
    price: number
    restaurant_id: string
    restaurant_name: string
  }
}

export default function AddToCartButton({ item }: Props) {
  const { addItem } = useCart()
  const [added, setAdded] = useState(false)

  function handleClick() {
    addItem(item)
    setAdded(true)
    setTimeout(() => setAdded(false), 1500)
  }

  return (
    <button
      onClick={handleClick}
      className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold transition-all duration-200 ${
        added
          ? 'bg-green-50 text-green-600 border border-green-200'
          : 'bg-orange-500 text-white hover:bg-orange-600 active:scale-95'
      }`}
    >
      {added ? (
        <>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-3.5 w-3.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
          Added
        </>
      ) : (
        <>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-3.5 w-3.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Add to cart
        </>
      )}
    </button>
  )
}
