import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import RestaurantBrowser from './restaurant-browser'
import CartNavIcon from '@/app/components/cart-nav-icon'
import UserMenu from '@/app/components/user-menu'

export type Restaurant = {
  id: string
  name: string
  description: string | null
  address: string | null
  logo_url: string | null
  cover_image_url: string | null
  cuisine_type: string | null
}

export default async function DashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: restaurants } = await supabase
    .from('restaurants')
    .select('id, name, description, address, logo_url, cover_image_url, cuisine_type')
    .eq('status', 'active')
    .order('name')

  const initial = (user.user_metadata?.full_name?.[0] ?? user.email?.[0] ?? 'U').toUpperCase()

  // First name + time-of-day greeting (computed in Lagos time for the target audience)
  const firstName =
    (user.user_metadata?.full_name as string | undefined)?.trim().split(/\s+/)[0] ||
    user.email?.split('@')[0] ||
    'there'
  const lagosHour = Number(
    new Intl.DateTimeFormat('en-US', {
      timeZone: 'Africa/Lagos',
      hour: 'numeric',
      hour12: false,
    }).format(new Date())
  )
  const greeting = lagosHour < 12 ? 'morning' : lagosHour < 17 ? 'afternoon' : 'evening'

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <span className="text-xl font-bold text-orange-500 tracking-tight shrink-0">DineFlow</span>
          <div className="flex items-center gap-3 shrink-0">
            <CartNavIcon />
            <UserMenu initial={initial} />
          </div>
        </div>
      </nav>

      <RestaurantBrowser
        restaurants={(restaurants as Restaurant[]) ?? []}
        firstName={firstName}
        greeting={greeting}
      />
    </div>
  )
}
