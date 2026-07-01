import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export type AdminContext = {
  userId: string
  restaurantId: string
  restaurantName: string
}

export async function resolveAdmin(): Promise<AdminContext> {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single<{ role: string }>()

  const role = profile?.role
  if (role !== 'restaurant_admin' && role !== 'super_admin') redirect('/dashboard')

  const { data: links } = await supabase
    .from('restaurant_admins')
    .select('restaurant_id')
    .eq('user_id', user.id)
    .order('created_at', { ascending: true })
    .limit(1)

  const link = links?.[0]
  if (!link?.restaurant_id) redirect('/dashboard')

  const { data: restaurant } = await supabase
    .from('restaurants')
    .select('name')
    .eq('id', link.restaurant_id)
    .maybeSingle()

  return {
    userId: user.id,
    restaurantId: link.restaurant_id,
    restaurantName: restaurant?.name ?? 'Your Restaurant',
  }
}
