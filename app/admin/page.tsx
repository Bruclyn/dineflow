import { resolveAdmin } from '@/lib/admin/resolve-admin'
import { createClient } from '@/lib/supabase/server'

async function getStats(restaurantId: string) {
  const supabase = await createClient()

  const todayStart = new Date()
  todayStart.setUTCHours(0, 0, 0, 0)
  const todayIso = todayStart.toISOString()

  const [
    { count: totalOrders },
    { count: todayOrders },
    { count: pendingOrders },
    { data: revenueRows },
    { data: recentOrders },
  ] = await Promise.all([
    supabase
      .from('orders')
      .select('*', { count: 'exact', head: true })
      .eq('restaurant_id', restaurantId),
    supabase
      .from('orders')
      .select('*', { count: 'exact', head: true })
      .eq('restaurant_id', restaurantId)
      .gte('created_at', todayIso),
    supabase
      .from('orders')
      .select('*', { count: 'exact', head: true })
      .eq('restaurant_id', restaurantId)
      .eq('status', 'pending'),
    supabase
      .from('orders')
      .select('total_amount')
      .eq('restaurant_id', restaurantId)
      .neq('status', 'cancelled'),
    supabase
      .from('orders')
      .select('id, status, order_type, total_amount, created_at')
      .eq('restaurant_id', restaurantId)
      .order('created_at', { ascending: false })
      .limit(5),
  ])

  const revenue = (revenueRows ?? []).reduce(
    (sum, o) => sum + ((o.total_amount as number) ?? 0),
    0
  )

  return {
    totalOrders: totalOrders ?? 0,
    todayOrders: todayOrders ?? 0,
    pendingOrders: pendingOrders ?? 0,
    revenue,
    recentOrders: recentOrders ?? [],
  }
}

const STATUS_COLOURS: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-700',
  confirmed: 'bg-blue-100 text-blue-700',
  preparing: 'bg-orange-100 text-orange-700',
  ready: 'bg-green-100 text-green-700',
  completed: 'bg-gray-100 text-gray-600',
  cancelled: 'bg-red-100 text-red-600',
}

export default async function AdminDashboardPage() {
  const { restaurantId, restaurantName } = await resolveAdmin()
  const { totalOrders, todayOrders, pendingOrders, revenue, recentOrders } =
    await getStats(restaurantId)

  return (
    <main className="flex-1 px-4 sm:px-8 py-8 max-w-5xl w-full mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">{restaurantName}</h1>
        <p className="text-sm text-gray-500 mt-0.5">Admin overview</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        <StatCard
          label="Today's Orders"
          value={todayOrders}
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          }
          accent="orange"
        />
        <StatCard
          label="Total Orders"
          value={totalOrders}
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          }
          accent="blue"
        />
        <StatCard
          label="Revenue"
          value={`₦${revenue.toLocaleString('en-NG')}`}
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
          accent="green"
        />
        <StatCard
          label="Pending Orders"
          value={pendingOrders}
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
          accent="yellow"
        />
      </div>

      {/* Recent orders */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-gray-900">Recent orders</h2>
          <a href="/admin/orders" className="text-xs font-semibold text-orange-500 hover:text-orange-600 transition-colors">
            View all →
          </a>
        </div>

        {recentOrders.length === 0 ? (
          <div className="rounded-2xl border border-gray-100 bg-white shadow-sm px-6 py-12 text-center">
            <p className="text-sm text-gray-400">No orders yet</p>
          </div>
        ) : (
          <div className="rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-50">
                  <th className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wide text-gray-400">Order</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wide text-gray-400 hidden sm:table-cell">Type</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wide text-gray-400">Status</th>
                  <th className="text-right px-5 py-3 text-xs font-semibold uppercase tracking-wide text-gray-400">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-5 py-3">
                      <span className="font-mono text-xs text-gray-700">
                        #{(order.id as string).slice(0, 8).toUpperCase()}
                      </span>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {new Date(order.created_at as string).toLocaleString('en-NG', {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </td>
                    <td className="px-5 py-3 hidden sm:table-cell">
                      <span className="capitalize text-gray-600 text-xs">{order.order_type as string}</span>
                    </td>
                    <td className="px-5 py-3">
                      <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${STATUS_COLOURS[order.status as string] ?? 'bg-gray-100 text-gray-600'}`}>
                        {order.status as string}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-right font-semibold text-gray-900 tabular-nums">
                      ₦{(order.total_amount as number).toLocaleString('en-NG')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  )
}

function StatCard({
  label,
  value,
  icon,
  accent,
}: {
  label: string
  value: number | string
  icon: React.ReactNode
  accent: 'orange' | 'blue' | 'green' | 'yellow'
}) {
  const colours = {
    orange: 'bg-orange-50 text-orange-500',
    blue: 'bg-blue-50 text-blue-500',
    green: 'bg-green-50 text-green-500',
    yellow: 'bg-yellow-50 text-yellow-500',
  }

  return (
    <div className="rounded-2xl border border-gray-100 bg-white shadow-sm px-5 py-4">
      <div className={`inline-flex h-9 w-9 items-center justify-center rounded-xl ${colours[accent]} mb-3`}>
        {icon}
      </div>
      <p className="text-2xl font-bold text-gray-900 tabular-nums leading-none">{value}</p>
      <p className="text-xs text-gray-500 mt-1">{label}</p>
    </div>
  )
}
