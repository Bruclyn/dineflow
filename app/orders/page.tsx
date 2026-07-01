import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import CartNavIcon from '@/app/components/cart-nav-icon'
import LogoutButton from '@/app/dashboard/logout-button'

type OrderStatus = 'pending' | 'confirmed' | 'preparing' | 'ready' | 'completed' | 'cancelled'

type OrderItem = {
  id: string
  quantity: number
  menu_items: { name: string } | null
}

type Order = {
  id: string
  status: OrderStatus
  order_type: 'pickup' | 'delivery'
  total_amount: number
  created_at: string
  restaurants: { name: string } | null
  order_items: OrderItem[]
}

const ACTIVE_STATUSES: OrderStatus[] = ['pending', 'confirmed', 'preparing', 'ready']

const STATUS_COLOURS: Record<OrderStatus, string> = {
  pending: 'bg-orange-100 text-orange-700',
  confirmed: 'bg-orange-100 text-orange-700',
  preparing: 'bg-orange-100 text-orange-700',
  ready: 'bg-orange-100 text-orange-700',
  completed: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-600',
}

export default async function MyOrdersPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data } = await supabase
    .from('orders')
    .select(
      'id, status, order_type, total_amount, created_at, restaurants(name), order_items(id, quantity, menu_items(name))'
    )
    .eq('customer_id', user.id)
    .order('created_at', { ascending: false })

  const orders = (data ?? []) as Order[]

  // Stable sort: active orders first, completed/cancelled below — each group keeps its
  // existing newest-first order since Array.prototype.sort is stable.
  const sorted = [...orders].sort((a, b) => {
    const aActive = ACTIVE_STATUSES.includes(a.status) ? 0 : 1
    const bActive = ACTIVE_STATUSES.includes(b.status) ? 0 : 1
    return aActive - bActive
  })

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-100 sticky top-0 z-10 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <span className="text-xl font-bold text-orange-500 tracking-tight">DineFlow</span>
          <div className="flex items-center gap-2">
            <CartNavIcon />
            <LogoutButton />
          </div>
        </div>
      </nav>

      <main className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">My Orders</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {sorted.length} order{sorted.length !== 1 ? 's' : ''}
          </p>
        </div>

        {sorted.length === 0 ? (
          <div className="rounded-2xl border border-gray-100 bg-white shadow-sm px-6 py-24 text-center">
            <div className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-orange-50 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-orange-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <p className="text-sm font-medium text-gray-700">No orders yet</p>
            <p className="mt-1 text-xs text-gray-400">
              Once you place an order, you&apos;ll be able to track it here.
            </p>
            <Link
              href="/dashboard"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-orange-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-orange-600 transition-colors"
            >
              Browse restaurants
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {sorted.map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}

function OrderCard({ order }: { order: Order }) {
  const placedAt = new Date(order.created_at).toLocaleString('en-NG', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })

  const itemSummary = order.order_items
    .map((i) => `${i.quantity}× ${i.menu_items?.name ?? 'Item'}`)
    .join(', ')

  return (
    <Link
      href={`/orders/${order.id}`}
      className="group block rounded-2xl border border-gray-100 bg-white shadow-sm p-4 sm:p-5 hover:shadow-md hover:border-orange-100 transition-all"
    >
      <div className="flex flex-wrap items-center gap-2 mb-2">
        <span className="font-mono text-xs font-bold text-gray-800">
          #{order.id.slice(0, 8).toUpperCase()}
        </span>
        <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${STATUS_COLOURS[order.status]}`}>
          {order.status}
        </span>
        <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-600 capitalize">
          {order.order_type === 'delivery' ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10l2 .001M13 16H9m4 0h5.5a.5.5 0 00.5-.5V11l-2.5-3.5H13V16z" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0H5m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          )}
          {order.order_type}
        </span>
        <span className="text-xs text-gray-400 ml-auto shrink-0">{placedAt}</span>
      </div>

      <p className="text-sm font-semibold text-gray-900">{order.restaurants?.name ?? 'Restaurant'}</p>
      {itemSummary && (
        <p className="text-sm text-gray-500 mt-0.5 line-clamp-1">{itemSummary}</p>
      )}

      <div className="mt-2.5 flex items-center justify-between">
        <span className="text-sm font-bold text-orange-500 tabular-nums">
          ₦{order.total_amount.toLocaleString('en-NG')}
        </span>
        <span className="text-xs font-semibold text-gray-400 group-hover:text-orange-500 transition-colors">
          View details →
        </span>
      </div>
    </Link>
  )
}
