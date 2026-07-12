import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Check, Truck, Store } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import ReviewSection from './review-section'
import OrderTracker from './order-tracker'

type OrderStatus = 'pending' | 'confirmed' | 'preparing' | 'ready' | 'completed' | 'cancelled'

type Order = {
  id: string
  status: OrderStatus
  order_type: 'pickup' | 'delivery'
  delivery_address: string | null
  notes: string | null
  total_amount: number
  created_at: string
  restaurant_id: string
  restaurants: { name: string; address: string | null } | null
}

type ExistingReview = {
  rating: number
  comment: string | null
  created_at: string
}

type OrderItem = {
  id: string
  quantity: number
  unit_price: number
  subtotal: number
  menu_items: { name: string } | null
}

type Payment = {
  id: string
  amount: number
  status: string
  payment_reference: string | null
  payment_method: string | null
}

export default async function OrderPage({
  params,
}: {
  params: { id: string }
}) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const [
    { data: order },
    { data: orderItems },
    { data: payment },
    { data: existingReview },
  ] = await Promise.all([
    supabase
      .from('orders')
      .select('id, status, order_type, delivery_address, notes, total_amount, created_at, restaurant_id, restaurants(name, address)')
      .eq('id', params.id)
      .eq('customer_id', user.id)
      .single<Order>(),
    supabase
      .from('order_items')
      .select('id, quantity, unit_price, subtotal, menu_items(name)')
      .eq('order_id', params.id),
    supabase
      .from('payments')
      .select('id, amount, status, payment_reference, payment_method')
      .eq('order_id', params.id)
      .maybeSingle<Payment>(),
    supabase
      .from('reviews')
      .select('rating, comment, created_at')
      .eq('order_id', params.id)
      .eq('customer_id', user.id)
      .maybeSingle<ExistingReview>(),
  ])

  if (!order) notFound()

  const items = (orderItems ?? []) as unknown as OrderItem[]
  const placedAt = new Date(order.created_at).toLocaleString('en-NG', {
    dateStyle: 'medium',
    timeStyle: 'short',
  })

  return (
    <div className="min-h-screen bg-[#FAFAF8]">
      {/* Navbar */}
      <nav className="sticky top-0 z-10 border-b border-[#E5E7EB] bg-white/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-2xl items-center justify-between gap-4 px-4 sm:px-6">
          <Link
            href="/dashboard"
            className="flex items-center gap-1.5 text-sm font-medium text-[#6B7280] transition-colors hover:text-[#E8471E]"
          >
            <ArrowLeft className="h-4 w-4" />
            Dashboard
          </Link>
          <span className="font-display text-xl font-extrabold tracking-tight text-[#E8471E]">
            DineFlow
          </span>
          <div className="w-20" />
        </div>
      </nav>

      <main className="mx-auto max-w-2xl space-y-6 px-4 py-8 sm:px-6">
        {/* Confirmation banner */}
        <div className="rounded-xl bg-[#E8471E] px-6 py-5 text-white shadow-card">
          <div className="mb-1 flex items-center gap-3">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/20">
              <Check className="h-5 w-5" strokeWidth={3} />
            </span>
            <h1 className="font-display text-lg font-bold">Order placed successfully!</h1>
          </div>
          <p className="ml-11 text-xs text-orange-100">Placed at {placedAt}</p>
          <p className="ml-11 mt-0.5 font-mono text-xs text-orange-200">
            #{order.id.slice(0, 8).toUpperCase()}
          </p>
        </div>

        {/* Status tracker (live via Realtime) */}
        <OrderTracker
          initialOrder={{ id: order.id, status: order.status }}
          createdAt={order.created_at}
          orderType={order.order_type}
        />

        {/* Order details */}
        <section className="overflow-hidden rounded-xl border border-[#E5E7EB] bg-white shadow-card">
          <div className="flex items-center justify-between border-b border-[#E5E7EB] px-5 py-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-[#6B7280]">Items</p>
            <span className="text-xs text-[#6B7280]">{order.restaurants?.name}</span>
          </div>
          <ul className="divide-y divide-[#E5E7EB]">
            {items.map((item) => (
              <li key={item.id} className="flex items-center justify-between gap-4 px-5 py-3">
                <div className="flex min-w-0 items-center gap-2.5">
                  <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#E8471E]/10 text-xs font-bold tabular-nums text-[#E8471E]">
                    {item.quantity}
                  </span>
                  <span className="truncate text-sm text-[#1A1A2E]">
                    {item.menu_items?.name ?? 'Item'}
                  </span>
                </div>
                <span className="shrink-0 text-sm font-semibold tabular-nums text-[#1A1A2E]">
                  ₦{item.subtotal.toLocaleString('en-NG')}
                </span>
              </li>
            ))}
          </ul>
          <div className="flex items-center justify-between border-t border-[#E5E7EB] px-5 py-4">
            <span className="text-sm font-bold text-[#1A1A2E]">Total paid</span>
            <span className="text-base font-bold tabular-nums text-[#E8471E]">
              ₦{order.total_amount.toLocaleString('en-NG')}
            </span>
          </div>
        </section>

        {/* Delivery / pickup info */}
        <section className="space-y-3 rounded-xl border border-[#E5E7EB] bg-white px-5 py-4 shadow-card">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wide text-[#6B7280]">
              Order type
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#E8471E]/10 px-3 py-1 text-xs font-semibold capitalize text-[#E8471E]">
              {order.order_type === 'delivery' ? (
                <Truck className="h-3.5 w-3.5" />
              ) : (
                <Store className="h-3.5 w-3.5" />
              )}
              {order.order_type}
            </span>
          </div>

          {order.order_type === 'delivery' && order.delivery_address && (
            <div>
              <p className="text-xs text-[#6B7280]">Delivery address</p>
              <p className="mt-0.5 text-sm text-[#1A1A2E]">{order.delivery_address}</p>
            </div>
          )}

          {order.order_type === 'pickup' && order.restaurants?.address && (
            <div>
              <p className="text-xs text-[#6B7280]">Pick up from</p>
              <p className="mt-0.5 text-sm text-[#1A1A2E]">{order.restaurants.address}</p>
            </div>
          )}

          {order.notes && (
            <div>
              <p className="text-xs text-[#6B7280]">Special instructions</p>
              <p className="mt-0.5 text-sm italic text-[#1A1A2E]">{order.notes}</p>
            </div>
          )}
        </section>

        {/* Payment */}
        {payment && (
          <section className="space-y-2 rounded-xl border border-[#E5E7EB] bg-white px-5 py-4 shadow-card">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-[#6B7280]">
              Payment
            </p>
            <div className="flex items-center justify-between text-sm">
              <span className="text-[#6B7280]">Method</span>
              <span className="font-medium capitalize text-[#1A1A2E]">
                {payment.payment_method ?? 'Simulated'}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-[#6B7280]">Status</span>
              <span
                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${
                  payment.status === 'paid' || payment.status === 'completed'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-yellow-100 text-yellow-700'
                }`}
              >
                {payment.status}
              </span>
            </div>
            {payment.payment_reference && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-[#6B7280]">Reference</span>
                <span className="rounded bg-[#FAFAF8] px-2 py-0.5 font-mono text-xs text-[#1A1A2E]">
                  {payment.payment_reference}
                </span>
              </div>
            )}
            <div className="flex items-center justify-between border-t border-[#E5E7EB] pt-2 text-sm">
              <span className="font-bold text-[#1A1A2E]">Amount</span>
              <span className="font-bold tabular-nums text-[#E8471E]">
                ₦{payment.amount.toLocaleString('en-NG')}
              </span>
            </div>
          </section>
        )}

        {order.status === 'completed' && (
          <ReviewSection
            orderId={order.id}
            restaurantId={order.restaurant_id}
            existingReview={existingReview ?? null}
          />
        )}

        <Link
          href="/dashboard"
          className="flex w-full items-center justify-center gap-2 rounded-lg border border-[#E8471E] py-3 text-sm font-semibold text-[#E8471E] transition-colors hover:bg-[#E8471E] hover:text-white"
        >
          Order more food
        </Link>
      </main>
    </div>
  )
}
