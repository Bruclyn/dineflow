import { resolveAdmin } from '@/lib/admin/resolve-admin'
import { createClient } from '@/lib/supabase/server'
import OrderStatusActions from './order-status-actions'

type OrderItem = {
  id: string
  quantity: number
  menu_items: { name: string } | null
}

type Order = {
  id: string
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'completed' | 'cancelled'
  order_type: 'pickup' | 'delivery'
  total_amount: number
  created_at: string
  delivery_address: string | null
  notes: string | null
  order_items: OrderItem[]
}

const STATUS_COLOURS: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-700',
  confirmed: 'bg-blue-100 text-blue-700',
  preparing: 'bg-orange-100 text-orange-700',
  ready: 'bg-green-100 text-green-700',
  completed: 'bg-gray-100 text-gray-600',
  cancelled: 'bg-red-100 text-red-600',
}

export default async function AdminOrdersPage() {
  const { restaurantId } = await resolveAdmin()
  const supabase = await createClient()

  const { data } = await supabase
    .from('orders')
    .select('id, status, order_type, total_amount, created_at, delivery_address, notes, order_items(id, quantity, menu_items(name))')
    .eq('restaurant_id', restaurantId)
    .order('created_at', { ascending: false })
    .limit(100)

  const orders = (data ?? []) as Order[]

  return (
    <main className="flex-1 px-4 sm:px-8 py-8 max-w-5xl w-full mx-auto">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
          <p className="text-sm text-gray-500 mt-0.5">{orders.length} order{orders.length !== 1 ? 's' : ''} total</p>
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="rounded-2xl border border-gray-100 bg-white shadow-sm px-6 py-24 text-center">
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-orange-50 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-orange-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <p className="text-sm font-medium text-gray-400">No orders yet</p>
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </div>
      )}
    </main>
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
    <div className="rounded-2xl border border-gray-100 bg-white shadow-sm p-4 sm:p-5 flex flex-col sm:flex-row sm:items-start gap-4">
      {/* Left: order info */}
      <div className="flex-1 min-w-0 space-y-2">
        {/* Header row */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-mono text-xs font-bold text-gray-800">
            #{order.id.slice(0, 8).toUpperCase()}
          </span>
          <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${STATUS_COLOURS[order.status] ?? 'bg-gray-100 text-gray-600'}`}>
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
          <span className="text-xs text-gray-400 ml-auto">{placedAt}</span>
        </div>

        {/* Items */}
        <p className="text-sm text-gray-700 leading-relaxed">{itemSummary}</p>

        {/* Delivery address */}
        {order.order_type === 'delivery' && order.delivery_address && (
          <p className="text-xs text-gray-400">
            <span className="font-medium text-gray-500">Deliver to:</span> {order.delivery_address}
          </p>
        )}

        {/* Notes */}
        {order.notes && (
          <p className="text-xs text-gray-400 italic">
            <span className="not-italic font-medium text-gray-500">Note:</span> {order.notes}
          </p>
        )}

        {/* Total */}
        <p className="text-sm font-bold text-gray-900 tabular-nums">
          ₦{order.total_amount.toLocaleString('en-NG')}
        </p>
      </div>

      {/* Right: action buttons */}
      <div className="shrink-0 w-full sm:w-36">
        <OrderStatusActions orderId={order.id} status={order.status} />
      </div>
    </div>
  )
}
