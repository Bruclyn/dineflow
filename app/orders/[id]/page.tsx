import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import ReviewSection from './review-section'

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

const STATUS_STEPS: OrderStatus[] = ['pending', 'confirmed', 'preparing', 'ready', 'completed']

const STATUS_LABELS: Record<OrderStatus, string> = {
  pending: 'Order received',
  confirmed: 'Confirmed',
  preparing: 'Preparing',
  ready: 'Ready',
  completed: 'Completed',
  cancelled: 'Cancelled',
}

const STATUS_DESCRIPTIONS: Record<OrderStatus, string> = {
  pending: 'Your order has been received and is awaiting confirmation.',
  confirmed: 'The restaurant has confirmed your order.',
  preparing: 'The kitchen is preparing your food.',
  ready: 'Your order is ready for pickup / out for delivery.',
  completed: 'Order delivered. Enjoy your meal!',
  cancelled: 'This order was cancelled.',
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

  const items = (orderItems ?? []) as OrderItem[]
  const isCancelled = order.status === 'cancelled'
  const currentStepIdx = STATUS_STEPS.indexOf(order.status as OrderStatus)
  const placedAt = new Date(order.created_at).toLocaleString('en-NG', {
    dateStyle: 'medium',
    timeStyle: 'short',
  })

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white border-b border-gray-100 sticky top-0 z-10 shadow-sm">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <Link
            href="/dashboard"
            className="flex items-center gap-1.5 text-sm font-medium text-gray-600 hover:text-orange-500 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Dashboard
          </Link>
          <span className="text-xl font-bold text-orange-500 tracking-tight">DineFlow</span>
          <div className="w-20" />
        </div>
      </nav>

      <main className="max-w-2xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        {/* Confirmation banner */}
        <div className="rounded-2xl bg-orange-500 px-6 py-5 text-white">
          <div className="flex items-center gap-3 mb-1">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            <h1 className="text-base font-bold">Order placed successfully!</h1>
          </div>
          <p className="text-xs text-orange-100 ml-8">Placed at {placedAt}</p>
          <p className="text-xs text-orange-200 ml-8 mt-0.5 font-mono">#{order.id.slice(0, 8).toUpperCase()}</p>
        </div>

        {/* Status tracker */}
        {isCancelled ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4">
            <p className="text-sm font-semibold text-red-600">Order cancelled</p>
            <p className="text-xs text-red-400 mt-0.5">{STATUS_DESCRIPTIONS.cancelled}</p>
          </div>
        ) : (
          <section className="rounded-2xl border border-gray-100 bg-white shadow-sm px-5 py-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-5">Order status</p>

            <div className="relative">
              {/* Track line */}
              <div className="absolute left-[11px] top-1 bottom-1 w-0.5 bg-gray-100" aria-hidden="true" />

              <ol className="space-y-5 relative">
                {STATUS_STEPS.map((step, idx) => {
                  const done = currentStepIdx >= idx
                  const active = currentStepIdx === idx
                  return (
                    <li key={step} className="flex items-start gap-3.5">
                      <span
                        className={`relative z-10 mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-all ${
                          done
                            ? 'border-orange-500 bg-orange-500'
                            : 'border-gray-200 bg-white'
                        }`}
                      >
                        {done && (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-2.5 w-2.5 text-white" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </span>
                      <div>
                        <p className={`text-sm font-semibold ${done ? 'text-gray-900' : 'text-gray-400'}`}>
                          {STATUS_LABELS[step]}
                        </p>
                        {active && (
                          <p className="text-xs text-gray-500 mt-0.5">{STATUS_DESCRIPTIONS[step]}</p>
                        )}
                      </div>
                    </li>
                  )
                })}
              </ol>
            </div>
          </section>
        )}

        {/* Order details */}
        <section className="rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-50 flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">Items</p>
            <span className="text-xs text-gray-400">
              {order.restaurants?.name}
            </span>
          </div>
          <ul className="divide-y divide-gray-50">
            {items.map((item) => (
              <li key={item.id} className="flex items-center justify-between gap-4 px-5 py-3">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="shrink-0 inline-flex h-5 w-5 items-center justify-center rounded-full bg-orange-100 text-xs font-bold text-orange-600 tabular-nums">
                    {item.quantity}
                  </span>
                  <span className="text-sm text-gray-800 truncate">
                    {item.menu_items?.name ?? 'Item'}
                  </span>
                </div>
                <span className="shrink-0 text-sm font-semibold text-gray-900 tabular-nums">
                  ₦{item.subtotal.toLocaleString('en-NG')}
                </span>
              </li>
            ))}
          </ul>
          <div className="px-5 py-4 border-t border-gray-100 flex items-center justify-between">
            <span className="text-sm font-bold text-gray-900">Total paid</span>
            <span className="text-base font-bold text-orange-500 tabular-nums">
              ₦{order.total_amount.toLocaleString('en-NG')}
            </span>
          </div>
        </section>

        {/* Delivery / pickup info */}
        <section className="rounded-2xl border border-gray-100 bg-white shadow-sm px-5 py-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wide text-gray-400">Order type</span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-orange-50 px-3 py-1 text-xs font-semibold text-orange-600 capitalize">
              {order.order_type === 'delivery' ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10l2 .001M13 16H9m4 0h5.5a.5.5 0 00.5-.5V11l-2.5-3.5H13V16z" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0H5m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              )}
              {order.order_type}
            </span>
          </div>

          {order.order_type === 'delivery' && order.delivery_address && (
            <div>
              <p className="text-xs text-gray-400">Delivery address</p>
              <p className="text-sm text-gray-700 mt-0.5">{order.delivery_address}</p>
            </div>
          )}

          {order.order_type === 'pickup' && order.restaurants?.address && (
            <div>
              <p className="text-xs text-gray-400">Pick up from</p>
              <p className="text-sm text-gray-700 mt-0.5">{order.restaurants.address}</p>
            </div>
          )}

          {order.notes && (
            <div>
              <p className="text-xs text-gray-400">Special instructions</p>
              <p className="text-sm text-gray-700 mt-0.5 italic">{order.notes}</p>
            </div>
          )}
        </section>

        {/* Payment */}
        {payment && (
          <section className="rounded-2xl border border-gray-100 bg-white shadow-sm px-5 py-4 space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-3">Payment</p>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500">Method</span>
              <span className="font-medium text-gray-800 capitalize">
                {payment.payment_method ?? 'Simulated'}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500">Status</span>
              <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${
                payment.status === 'paid' || payment.status === 'completed'
                  ? 'bg-green-100 text-green-700'
                  : 'bg-yellow-100 text-yellow-700'
              }`}>
                {payment.status}
              </span>
            </div>
            {payment.payment_reference && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Reference</span>
                <span className="font-mono text-xs text-gray-700 bg-gray-50 rounded px-2 py-0.5">
                  {payment.payment_reference}
                </span>
              </div>
            )}
            <div className="flex items-center justify-between text-sm pt-2 border-t border-gray-100">
              <span className="font-bold text-gray-900">Amount</span>
              <span className="font-bold text-orange-500 tabular-nums">
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
          className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-orange-500 py-3 text-sm font-bold text-orange-500 hover:bg-orange-50 transition-colors"
        >
          Order more food
        </Link>
      </main>
    </div>
  )
}
