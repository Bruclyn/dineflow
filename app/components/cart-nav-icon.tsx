'use client'

import Link from 'next/link'
import { useCart } from '@/lib/cart/cart-context'

export default function CartNavIcon() {
  const { itemCount } = useCart()

  return (
    <Link
      href="/cart"
      aria-label={`Cart${itemCount > 0 ? ` — ${itemCount} item${itemCount === 1 ? '' : 's'}` : ''}`}
      className="relative flex items-center justify-center h-9 w-9 rounded-xl text-gray-600 hover:text-[#E8471E] hover:bg-[#E8471E]/10 transition-colors"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
        />
      </svg>

      {itemCount > 0 && (
        <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] flex items-center justify-center rounded-full bg-[#E8471E] text-white text-[10px] font-bold leading-none px-1 ring-2 ring-white">
          {itemCount > 99 ? '99+' : itemCount}
        </span>
      )}
    </Link>
  )
}
