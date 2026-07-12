import { createClient } from '@/lib/supabase/server'
import RestaurantActions from './restaurant-actions'

type Restaurant = {
  id: string
  name: string
  address: string | null
  email: string | null
  status: 'pending' | 'active' | 'suspended'
  created_at: string
}

const STATUS_COLOURS: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-700',
  active: 'bg-green-100 text-green-700',
  suspended: 'bg-red-100 text-red-600',
}

export default async function SuperAdminRestaurantsPage() {
  const supabase = await createClient()

  const { data } = await supabase
    .from('restaurants')
    .select('id, name, address, email, status, created_at')
    .order('created_at', { ascending: false })

  const restaurants = (data ?? []) as Restaurant[]

  return (
    <main className="flex-1 px-4 sm:px-8 py-8 max-w-5xl w-full mx-auto">
      <div className="mb-8">
        <h1 className="font-display text-2xl font-bold text-[#1A1A2E]">Restaurants</h1>
        <p className="text-sm text-gray-500 mt-0.5">
          {restaurants.length} restaurant{restaurants.length !== 1 ? 's' : ''} total
        </p>
      </div>

      {restaurants.length === 0 ? (
        <div className="rounded-2xl border border-gray-100 bg-white shadow-sm px-6 py-24 text-center">
          <p className="text-sm font-medium text-gray-400">No restaurants yet</p>
        </div>
      ) : (
        <div className="space-y-3">
          {restaurants.map((restaurant) => (
            <RestaurantCard key={restaurant.id} restaurant={restaurant} />
          ))}
        </div>
      )}
    </main>
  )
}

function RestaurantCard({ restaurant }: { restaurant: Restaurant }) {
  const createdAt = new Date(restaurant.created_at).toLocaleDateString('en-NG', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })

  return (
    <div className="flex flex-col sm:flex-row sm:items-start gap-4 rounded-2xl border border-gray-100 bg-white shadow-sm p-4 sm:p-5">
      <div className="flex-1 min-w-0 space-y-1">
        <div className="flex items-center gap-2 flex-wrap">
          <h3 className="text-sm font-semibold text-[#1A1A2E]">{restaurant.name}</h3>
          <span
            className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${
              STATUS_COLOURS[restaurant.status] ?? 'bg-gray-100 text-gray-600'
            }`}
          >
            {restaurant.status}
          </span>
        </div>
        {restaurant.address && <p className="text-xs text-gray-500">{restaurant.address}</p>}
        {restaurant.email && <p className="text-xs text-gray-400">{restaurant.email}</p>}
        <p className="text-xs text-gray-400">Joined {createdAt}</p>
      </div>

      <div className="shrink-0 w-full sm:w-40">
        <RestaurantActions restaurantId={restaurant.id} status={restaurant.status} />
      </div>
    </div>
  )
}
