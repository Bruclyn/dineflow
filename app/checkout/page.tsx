'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Check, Minus, Plus, Trash2, Truck, Store, CreditCard, Wallet } from 'lucide-react'
import { useCart } from '@/lib/cart/cart-context'
import { createClient } from '@/lib/supabase/client'

const DELIVERY_FEE = 500
const STEPS = ['Cart', 'Delivery', 'Payment'] as const

export default function CheckoutPage() {
  const { items, total, clearCart, updateQuantity, removeItem } = useCart()
  const router = useRouter()

  const orderPlacedRef = useRef(false)
  const [authChecked, setAuthChecked] = useState(false)
  const [step, setStep] = useState(1)
  const [orderType, setOrderType] = useState<'pickup' | 'delivery'>('delivery')
  const [deliveryAddress, setDeliveryAddress] = useState('')
  const [notes, setNotes] = useState('')
  const [payment, setPayment] = useState<'card' | 'wallet'>('card')
  const [card, setCard] = useState({ name: '', number: '', expiry: '', cvc: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [placedAt] = useState(() => Date.now())

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
      <div className="min-h-screen bg-[#FAFAF8] flex items-center justify-center">
        <div className="h-8 w-8 rounded-full border-2 border-[#E8471E] border-t-transparent animate-spin" />
      </div>
    )
  }

  const restaurantId = items[0].restaurant_id
  const restaurantName = items[0].restaurant_name

  const subtotal = total
  const deliveryFee = orderType === 'delivery' ? DELIVERY_FEE : 0
  const serviceFee = Math.round(subtotal * 0.05)
  const grandTotal = subtotal + deliveryFee + serviceFee

  const eta = new Date(placedAt + 35 * 60 * 1000).toLocaleTimeString('en-NG', {
    hour: 'numeric',
    minute: '2-digit',
  })

  const naira = (n: number) => `₦${n.toLocaleString('en-NG')}`

  function goNext() {
    setError(null)
    if (step === 2 && orderType === 'delivery' && !deliveryAddress.trim()) {
      setError('Please enter a delivery address.')
      return
    }
    setStep((s) => Math.min(3, s + 1))
  }

  async function handlePlaceOrder() {
    if (orderType === 'delivery' && !deliveryAddress.trim()) {
      setError('Please enter a delivery address.')
      setStep(2)
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

  const inputClass =
    'w-full rounded-lg border border-[#E5E7EB] px-4 py-3 text-sm text-[#1A1A2E] placeholder-[#6B7280] outline-none focus:ring-2 focus:ring-[#E8471E] focus:border-transparent transition'

  return (
    <div className="min-h-screen bg-[#FAFAF8]">
      {/* Navbar */}
      <nav className="bg-white border-b border-[#E5E7EB] sticky top-0 z-30 shadow-sm">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <button
            onClick={() => (step === 1 ? router.push('/cart') : setStep((s) => s - 1))}
            className="flex items-center gap-1.5 text-sm font-medium text-[#6B7280] hover:text-[#E8471E] transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>
          <span className="font-display text-xl font-bold tracking-tight text-[#E8471E]">DineFlow</span>
          <div className="w-16" />
        </div>
      </nav>

      <main className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
        {/* Stepper */}
        <div className="mb-8 flex items-center">
          {STEPS.map((label, i) => {
            const n = i + 1
            const done = step > n
            const active = step === n
            return (
              <div key={label} className="flex flex-1 items-center last:flex-none">
                <div className="flex items-center gap-2">
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold transition-colors ${
                      done || active ? 'bg-[#E8471E] text-white' : 'bg-white border border-[#E5E7EB] text-[#6B7280]'
                    }`}
                  >
                    {done ? <Check className="h-4 w-4" strokeWidth={3} /> : n}
                  </div>
                  <span
                    className={`text-sm font-semibold ${active || done ? 'text-[#1A1A2E]' : 'text-[#6B7280]'}`}
                  >
                    {label}
                  </span>
                </div>
                {i < STEPS.length - 1 && (
                  <div className={`mx-3 h-0.5 flex-1 rounded ${done ? 'bg-[#E8471E]' : 'bg-[#E5E7EB]'}`} />
                )}
              </div>
            )
          })}
        </div>

        <h1 className="font-display text-2xl font-bold text-[#1A1A2E]">
          {step === 1 ? 'Review your cart' : step === 2 ? 'Delivery details' : 'Payment'}
        </h1>
        <p className="mt-1 text-sm text-[#6B7280]">From {restaurantName}</p>

        <div className="mt-6 space-y-6">
          {/* STEP 1 — Cart review */}
          {step === 1 && (
            <>
              <section className="space-y-3">
                {items.map((item) => (
                  <div
                    key={item.menu_item_id}
                    className="flex items-center gap-4 rounded-xl bg-white p-4 shadow-[0_2px_8px_rgba(0,0,0,0.08)]"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-[#1A1A2E]">{item.name}</p>
                      <p className="mt-0.5 text-xs font-medium text-[#E8471E]">{naira(item.price)}</p>
                    </div>
                    <div className="flex shrink-0 items-center gap-1.5">
                      <button
                        onClick={() => updateQuantity(item.menu_item_id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                        aria-label="Decrease quantity"
                        className="flex h-7 w-7 items-center justify-center rounded-lg border border-[#E5E7EB] text-[#6B7280] hover:border-[#E8471E] hover:text-[#E8471E] disabled:opacity-30 transition-colors"
                      >
                        <Minus className="h-3.5 w-3.5" strokeWidth={2.5} />
                      </button>
                      <span className="w-6 text-center text-sm font-semibold text-[#1A1A2E] tabular-nums">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.menu_item_id, item.quantity + 1)}
                        aria-label="Increase quantity"
                        className="flex h-7 w-7 items-center justify-center rounded-lg border border-[#E5E7EB] text-[#6B7280] hover:border-[#E8471E] hover:text-[#E8471E] transition-colors"
                      >
                        <Plus className="h-3.5 w-3.5" strokeWidth={2.5} />
                      </button>
                    </div>
                    <span className="w-20 shrink-0 text-right text-sm font-bold text-[#1A1A2E] tabular-nums">
                      {naira(item.price * item.quantity)}
                    </span>
                    <button
                      onClick={() => removeItem(item.menu_item_id)}
                      aria-label={`Remove ${item.name}`}
                      className="shrink-0 flex h-7 w-7 items-center justify-center rounded-lg text-[#6B7280]/60 hover:bg-red-50 hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </section>

              <CostSummary
                subtotal={subtotal}
                deliveryFee={deliveryFee}
                serviceFee={serviceFee}
                grandTotal={grandTotal}
                orderType={orderType}
                naira={naira}
              />
            </>
          )}

          {/* STEP 2 — Delivery details */}
          {step === 2 && (
            <>
              <section className="rounded-xl bg-white p-5 shadow-[0_2px_8px_rgba(0,0,0,0.08)] space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  {(['delivery', 'pickup'] as const).map((type) => (
                    <button
                      key={type}
                      onClick={() => setOrderType(type)}
                      className={`flex flex-col items-center gap-1.5 rounded-lg border-2 py-4 transition-all ${
                        orderType === type
                          ? 'border-[#E8471E] bg-[#E8471E]/5 text-[#E8471E]'
                          : 'border-[#E5E7EB] text-[#6B7280] hover:border-[#6B7280]/40'
                      }`}
                    >
                      {type === 'delivery' ? <Truck className="h-5 w-5" /> : <Store className="h-5 w-5" />}
                      <span className="text-sm font-semibold capitalize">{type}</span>
                    </button>
                  ))}
                </div>

                {orderType === 'delivery' && (
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-[#1A1A2E]" htmlFor="delivery-address">
                      Delivery address <span className="text-[#E8471E]">*</span>
                    </label>
                    <textarea
                      id="delivery-address"
                      rows={3}
                      placeholder="Enter your full delivery address…"
                      value={deliveryAddress}
                      onChange={(e) => setDeliveryAddress(e.target.value)}
                      className={`${inputClass} resize-none`}
                    />
                  </div>
                )}

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#1A1A2E]" htmlFor="notes">
                    Delivery instructions <span className="font-normal text-[#6B7280]">(optional)</span>
                  </label>
                  <textarea
                    id="notes"
                    rows={2}
                    placeholder="Allergies, gate code, landmarks…"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className={`${inputClass} resize-none`}
                  />
                </div>
              </section>

              <div className="flex items-center gap-3 rounded-xl bg-[#F5A623]/10 px-4 py-3">
                <Truck className="h-5 w-5 shrink-0 text-[#F5A623]" />
                <p className="text-sm text-[#1A1A2E]">
                  Estimated arrival <span className="font-semibold">around {eta}</span> (~35 min)
                </p>
              </div>

              <CostSummary
                subtotal={subtotal}
                deliveryFee={deliveryFee}
                serviceFee={serviceFee}
                grandTotal={grandTotal}
                orderType={orderType}
                naira={naira}
              />
            </>
          )}

          {/* STEP 3 — Payment */}
          {step === 3 && (
            <>
              <section className="rounded-xl bg-white p-5 shadow-[0_2px_8px_rgba(0,0,0,0.08)] space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setPayment('card')}
                    className={`flex items-center justify-center gap-2 rounded-lg border-2 py-3 text-sm font-semibold transition-all ${
                      payment === 'card'
                        ? 'border-[#E8471E] bg-[#E8471E]/5 text-[#E8471E]'
                        : 'border-[#E5E7EB] text-[#6B7280] hover:border-[#6B7280]/40'
                    }`}
                  >
                    <CreditCard className="h-5 w-5" />
                    Card
                  </button>
                  <button
                    onClick={() => setPayment('wallet')}
                    className={`flex items-center justify-center gap-2 rounded-lg border-2 py-3 text-sm font-semibold transition-all ${
                      payment === 'wallet'
                        ? 'border-[#E8471E] bg-[#E8471E]/5 text-[#E8471E]'
                        : 'border-[#E5E7EB] text-[#6B7280] hover:border-[#6B7280]/40'
                    }`}
                  >
                    <Wallet className="h-5 w-5" />
                    DineFlow Wallet
                  </button>
                </div>

                {payment === 'card' ? (
                  <div className="space-y-3">
                    <input
                      className={inputClass}
                      placeholder="Cardholder name"
                      value={card.name}
                      onChange={(e) => setCard({ ...card, name: e.target.value })}
                    />
                    <input
                      className={inputClass}
                      placeholder="Card number"
                      inputMode="numeric"
                      value={card.number}
                      onChange={(e) => setCard({ ...card, number: e.target.value })}
                    />
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        className={inputClass}
                        placeholder="MM / YY"
                        value={card.expiry}
                        onChange={(e) => setCard({ ...card, expiry: e.target.value })}
                      />
                      <input
                        className={inputClass}
                        placeholder="CVC"
                        inputMode="numeric"
                        value={card.cvc}
                        onChange={(e) => setCard({ ...card, cvc: e.target.value })}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="rounded-lg bg-[#FAFAF8] px-4 py-4 text-sm text-[#6B7280]">
                    Pay instantly from your DineFlow Wallet balance. Balance:{' '}
                    <span className="font-semibold text-[#1A1A2E]">₦25,000</span>
                  </div>
                )}
              </section>

              <CostSummary
                subtotal={subtotal}
                deliveryFee={deliveryFee}
                serviceFee={serviceFee}
                grandTotal={grandTotal}
                orderType={orderType}
                naira={naira}
              />

              <p className="text-center text-xs text-[#6B7280]">
                Payment is simulated — no real charge will be made.
              </p>
            </>
          )}

          {/* Error */}
          {error && (
            <div className="flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="mt-0.5 h-4 w-4 shrink-0 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* Footer actions */}
          {step < 3 ? (
            <button
              onClick={goNext}
              className="w-full rounded-lg bg-[#E8471E] px-6 py-4 text-sm font-semibold text-white hover:bg-[#C93D18] transition-colors"
            >
              {step === 1 ? 'Continue to delivery' : 'Continue to payment'}
            </button>
          ) : (
            <button
              onClick={handlePlaceOrder}
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#E8471E] px-6 py-4 text-base font-semibold text-white hover:bg-[#C93D18] disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? (
                <>
                  <span className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                  Placing order…
                </>
              ) : (
                <>Place Order · {naira(grandTotal)}</>
              )}
            </button>
          )}
        </div>
      </main>
    </div>
  )
}

function CostSummary({
  subtotal,
  deliveryFee,
  serviceFee,
  grandTotal,
  orderType,
  naira,
}: {
  subtotal: number
  deliveryFee: number
  serviceFee: number
  grandTotal: number
  orderType: 'pickup' | 'delivery'
  naira: (n: number) => string
}) {
  return (
    <section className="rounded-xl bg-white p-5 shadow-[0_2px_8px_rgba(0,0,0,0.08)]">
      <div className="space-y-2.5 text-sm">
        <div className="flex justify-between">
          <span className="text-[#6B7280]">Subtotal</span>
          <span className="font-medium text-[#1A1A2E] tabular-nums">{naira(subtotal)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-[#6B7280]">Delivery fee</span>
          <span className="font-medium text-[#1A1A2E] tabular-nums">
            {orderType === 'delivery' ? naira(deliveryFee) : 'Free (pickup)'}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-[#6B7280]">Service fee (5%)</span>
          <span className="font-medium text-[#1A1A2E] tabular-nums">{naira(serviceFee)}</span>
        </div>
        <div className="flex items-center justify-between border-t border-[#E5E7EB] pt-2.5">
          <span className="font-bold text-[#1A1A2E]">Total</span>
          <span className="text-base font-bold text-[#E8471E] tabular-nums">{naira(grandTotal)}</span>
        </div>
      </div>
      <p className="mt-3 text-center text-xs text-[#6B7280]">No hidden fees — everything shown upfront.</p>
    </section>
  )
}
