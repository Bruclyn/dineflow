import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import LogoutButton from './logout-button'
import RestaurantBrowser from './restaurant-browser'
import CartNavIcon from '@/app/components/cart-nav-icon'
import OrdersNavIcon from '@/app/components/orders-nav-icon'

export type Restaurant = {
  id: string
  name: string
  description: string | null
  address: string | null
  logo_url: string | null
  cover_image_url: string | null
}

export default async function DashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: restaurants } = await supabase
    .from('restaurants')
    .select('id, name, description, address, logo_url, cover_image_url')
    .eq('status', 'active')
    .order('name')

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-100 sticky top-0 z-10 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <span className="text-xl font-bold text-orange-500 tracking-tight">DineFlow</span>
          <div className="flex items-center gap-2">
            <OrdersNavIcon />
            <CartNavIcon />
            <LogoutButton />
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-gray-900">Restaurants near you</h1>
          <p className="text-sm text-gray-500 mt-1">
            Browse and order from our partner restaurants
          </p>
        </div>

        <RestaurantBrowser restaurants={(restaurants as Restaurant[]) ?? []} />
      </main>
    </div>
  )
}
