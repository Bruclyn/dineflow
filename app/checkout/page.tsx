'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useCart } from '@/lib/cart/cart-context'
import { createClient } from '@/lib/supabase/client'

export default function CheckoutPage() {
  const { items, total, clearCart } = useCart()
  const router = useRouter()

  const orderPlacedRef = useRef(false)
  const [authChecked, setAuthChecked] = useState(false)
  const [orderType, setOrderType] = useState<'pickup' | 'delivery'>('delivery')
  const [deliveryAddress, setDeliveryAddress] = useState('')
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    createClient()
      .auth.getUser()
      .then(({ data: { user } }) => {
        if (!user) router.replace('/login')
        else setAuthChecked(true)
      })
  }, [router])

  useEffect(() => {
    if (authChecked && items.length === 0 && !orderPlacedRef.current) {
      router.replace('/dashboard')
    }
  }, [authChecked, items.length, router])

  if (!authChecked || items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="h-8 w-8 rounded-full border-2 border-orange-500 border-t-transparent animate-spin" />
      </div>
    )
  }

  const restaurantId = items[0].restaurant_id
  const restaurantName = items[0].restaurant_name

  async function handlePlaceOrder() {
    if (orderType === 'delivery' && !deliveryAddress.trim()) {
      setError('Please enter a delivery address.')
      return
    }

    setLoading(true)
    setError(null)

    const supabase = createClient()
    const { data, error: rpcError } = await supabase.rpc('place_order', {
      p_restaurant_id: restaurantId,
      p_order_type: orderType,
      p_delivery_address: orderType === 'delivery' ? deliveryAddress.trim() : null,
      p_notes: notes.trim() || null,
      p_items: items.map((i) => ({ menu_item_id: i.menu_item_id, quantity: i.quantity })),
    })

    if (rpcError) {
      setError(rpcError.message)
      setLoading(false)
      return
    }

    orderPlacedRef.current = true
    router.push(`/orders/${data}`)
    clearCart()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white border-b border-gray-100 sticky top-0 z-10 shadow-sm">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <Link
            href="/cart"
            className="flex items-center gap-1.5 text-sm font-medium text-gray-600 hover:text-orange-500 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </Link>
          <span className="text-xl font-bold text-orange-500 tracking-tight">DineFlow</span>
          <div className="w-16" />
        </div>
      </nav>

      <main className="max-w-2xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        <h1 className="text-xl font-bold text-gray-900">Checkout</h1>

        {/* Order summary */}
        <section className="rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-50">
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">Order summary</p>
            <p className="text-sm font-medium text-gray-700 mt-0.5">From {restaurantName}</p>
          </div>
          <ul className="divide-y divide-gray-50">
            {items.map((item) => (
              <li key={item.menu_item_id} className="flex items-center justify-between gap-4 px-5 py-3">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="shrink-0 inline-flex h-5 w-5 items-center justify-center rounded-full bg-orange-100 text-xs font-bold text-orange-600 tabular-nums">
                    {item.quantity}
                  </span>
                  <span className="text-sm text-gray-800 truncate">{item.name}</span>
                </div>
                <span className="shrink-0 text-sm font-semibold text-gray-900 tabular-nums">
                  ₦{(item.price * item.quantity).toLocaleString('en-NG')}
                </span>
              </li>
            ))}
          </ul>
          <div className="px-5 py-4 border-t border-gray-100 flex items-center justify-between">
            <span className="text-sm font-bold text-gray-900">Total</span>
            <span className="text-base font-bold text-orange-500 tabular-nums">
              ₦{total.toLocaleString('en-NG')}
            </span>
          </div>
        </section>

        {/* Order type */}
        <section className="rounded-2xl border border-gray-100 bg-white shadow-sm p-5 space-y-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">Order type</p>
          <div className="grid grid-cols-2 gap-3">
            {(['delivery', 'pickup'] as const).map((type) => (
              <button
                key={type}
                onClick={() => setOrderType(type)}
                className={`flex flex-col items-center gap-1.5 rounded-xl border-2 py-4 transition-all ${
                  orderType === type
                    ? 'border-orange-500 bg-orange-50 text-orange-600'
                    : 'border-gray-200 text-gray-500 hover:border-gray-300'
                }`}
              >
                {type === 'delivery' ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                    <path d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10l2 .001M13 16H9m4 0h5.5a.5.5 0 00.5-.5V11l-2.5-3.5H13V16z" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0H5m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                )}
                <span className="text-sm font-semibold capitalize">{type}</span>
              </button>
            ))}
          </div>

          {orderType === 'delivery' && (
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-gray-600" htmlFor="delivery-address">
                Delivery address <span className="text-red-400">*</span>
              </label>
              <textarea
                id="delivery-address"
                rows={3}
                placeholder="Enter your full delivery address…"
                value={deliveryAddress}
                onChange={(e) => setDeliveryAddress(e.target.value)}
                className="w-full resize-none rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm text-gray-800 placeholder-gray-400 outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition-all"
              />
            </div>
          )}
        </section>

        {/* Notes */}
        <section className="rounded-2xl border border-gray-100 bg-white shadow-sm p-5 space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-wide text-gray-400" htmlFor="notes">
            Special instructions (optional)
          </label>
          <textarea
            id="notes"
            rows={2}
            placeholder="Allergies, preferences, or anything else…"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full resize-none rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm text-gray-800 placeholder-gray-400 outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition-all"
          />
        </section>

        {/* Error */}
        {error && (
          <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="mt-0.5 h-4 w-4 shrink-0 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {/* Place order */}
        <button
          onClick={handlePlaceOrder}
          disabled={loading}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-orange-500 py-3.5 text-sm font-bold text-white hover:bg-orange-600 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? (
            <>
              <span className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
              Placing order…
            </>
          ) : (
            <>
              Place order · ₦{total.toLocaleString('en-NG')}
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </>
          )}
        </button>

        <p className="text-center text-xs text-gray-400 pb-4">
          Payment is simulated — no real charge will be made.
        </p>
      </main>
    </div>
  )
}
