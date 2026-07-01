'use client'

import Link from 'next/link'
import { useCart } from '@/lib/cart/cart-context'

export default function CartPage() {
  const { items, removeItem, updateQuantity, clearCart, total } = useCart()

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <CartNav />
        <div className="flex-1 flex flex-col items-center justify-center px-4 py-24 text-center">
          <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-orange-50">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-9 w-9 text-orange-300"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
          </div>
          <h1 className="text-lg font-semibold text-gray-800">Your cart is empty</h1>
          <p className="mt-1.5 text-sm text-gray-400 max-w-xs">
            Add items from a restaurant to get started.
          </p>
          <Link
            href="/dashboard"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-orange-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-orange-600 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Browse restaurants
          </Link>
        </div>
      </div>
    )
  }

  const restaurantName = items[0].restaurant_name

  return (
    <div className="min-h-screen bg-gray-50">
      <CartNav />

      <main className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Your cart</h1>
            <p className="text-xs text-gray-400 mt-0.5">From {restaurantName}</p>
          </div>
          <button
            onClick={clearCart}
            className="text-xs font-medium text-gray-400 hover:text-red-500 transition-colors"
          >
            Clear cart
          </button>
        </div>

        {/* Items */}
        <div className="space-y-3 mb-8">
          {items.map((item) => (
            <div
              key={item.menu_item_id}
              className="flex items-center gap-4 bg-white rounded-2xl border border-gray-100 shadow-sm px-4 py-3"
            >
              {/* Name + price */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">{item.name}</p>
                <p className="text-xs text-orange-500 font-medium mt-0.5">
                  ₦{item.price.toLocaleString('en-NG')}
                </p>
              </div>

              {/* Quantity stepper */}
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  onClick={() => updateQuantity(item.menu_item_id, item.quantity - 1)}
                  disabled={item.quantity <= 1}
                  className="flex h-7 w-7 items-center justify-center rounded-lg border border-gray-200 text-gray-600 hover:border-orange-300 hover:text-orange-500 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  aria-label="Decrease quantity"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4" />
                  </svg>
                </button>

                <span className="w-6 text-center text-sm font-semibold text-gray-900 tabular-nums">
                  {item.quantity}
                </span>

                <button
                  onClick={() => updateQuantity(item.menu_item_id, item.quantity + 1)}
                  className="flex h-7 w-7 items-center justify-center rounded-lg border border-gray-200 text-gray-600 hover:border-orange-300 hover:text-orange-500 transition-colors"
                  aria-label="Increase quantity"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                  </svg>
                </button>
              </div>

              {/* Line subtotal */}
              <p className="w-20 text-right text-sm font-bold text-gray-900 shrink-0 tabular-nums">
                ₦{(item.price * item.quantity).toLocaleString('en-NG')}
              </p>

              {/* Remove */}
              <button
                onClick={() => removeItem(item.menu_item_id)}
                className="shrink-0 flex h-7 w-7 items-center justify-center rounded-lg text-gray-300 hover:text-red-400 hover:bg-red-50 transition-colors"
                aria-label={`Remove ${item.name}`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
        </div>

        {/* Summary card */}
        <div className="rounded-2xl border border-gray-100 bg-white shadow-sm p-5 space-y-3">
          <div className="flex items-center justify-between text-sm text-gray-500">
            <span>Subtotal</span>
            <span className="font-medium text-gray-900 tabular-nums">
              ₦{total.toLocaleString('en-NG')}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm text-gray-500">
            <span>Delivery fee</span>
            <span className="text-gray-400 italic">Calculated at checkout</span>
          </div>
          <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
            <span className="text-base font-bold text-gray-900">Total</span>
            <span className="text-base font-bold text-orange-500 tabular-nums">
              ₦{total.toLocaleString('en-NG')}
            </span>
          </div>

          <Link
            href="/checkout"
            className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-orange-500 py-3 text-sm font-bold text-white hover:bg-orange-600 transition-colors"
          >
            Proceed to checkout
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </main>
    </div>
  )
}

function CartNav() {
  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-10 shadow-sm">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        <Link
          href="/dashboard"
          className="flex items-center gap-1.5 text-sm font-medium text-gray-600 hover:text-orange-500 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </Link>
        <span className="text-xl font-bold text-orange-500 tracking-tight">DineFlow</span>
        <div className="w-16" /> {/* spacer to centre the logo */}
      </div>
    </nav>
  )
}
