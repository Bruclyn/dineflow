'use client'

import { useState } from 'react'
import { Plus, Check } from 'lucide-react'
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
      aria-label={added ? 'Added to cart' : `Add ${item.name} to cart`}
      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full shadow-sm transition-all duration-200 ${
        added
          ? 'bg-green-500 text-white'
          : 'bg-orange-500 text-white hover:bg-orange-600 active:scale-90'
      }`}
    >
      {added ? (
        <Check className="h-5 w-5" strokeWidth={2.5} />
      ) : (
        <Plus className="h-5 w-5" strokeWidth={2.5} />
      )}
    </button>
  )
}
