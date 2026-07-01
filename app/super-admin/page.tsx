import { createClient } from '@/lib/supabase/server'

async function getPlatformStats() {
  const supabase = await createClient()

  const [
    { count: totalRestaurants },
    { count: pendingApprovals },
    { count: activeRestaurants },
    { count: totalOrders },
    { data: revenueRows },
  ] = await Promise.all([
    supabase.from('restaurants').select('*', { count: 'exact', head: true }),
    supabase.from('restaurants').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
    supabase.from('restaurants').select('*', { count: 'exact', head: true }).eq('status', 'active'),
    supabase.from('orders').select('*', { count: 'exact', head: true }),
    supabase.from('orders').select('total_amount').neq('status', 'cancelled'),
  ])

  const revenue = (revenueRows ?? []).reduce(
    (sum, o) => sum + ((o.total_amount as number) ?? 0),
    0
  )

  return {
    totalRestaurants: totalRestaurants ?? 0,
    pendingApprovals: pendingApprovals ?? 0,
    activeRestaurants: activeRestaurants ?? 0,
    totalOrders: totalOrders ?? 0,
    revenue,
  }
}

export default async function SuperAdminDashboardPage() {
  const { totalRestaurants, pendingApprovals, activeRestaurants, totalOrders, revenue } =
    await getPlatformStats()

  return (
    <main className="flex-1 px-4 sm:px-8 py-8 max-w-5xl w-full mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Platform overview</h1>
        <p className="text-sm text-gray-500 mt-0.5">Across all restaurants on DineFlow</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        <StatCard
          label="Total Restaurants"
          value={totalRestaurants}
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 21h18M5 21V7l7-4 7 4v14M9 21v-6h6v6" />
            </svg>
          }
          accent="blue"
        />
        <StatCard
          label="Pending Approvals"
          value={pendingApprovals}
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
          accent="yellow"
        />
        <StatCard
          label="Active Restaurants"
          value={activeRestaurants}
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          }
          accent="green"
        />
        <StatCard
          label="Total Orders"
          value={totalOrders}
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          }
          accent="orange"
        />
        <StatCard
          label="Total Revenue"
          value={`₦${revenue.toLocaleString('en-NG')}`}
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
          accent="green"
        />
      </div>
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
