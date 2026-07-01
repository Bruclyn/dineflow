import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

type Role = 'super_admin' | 'restaurant_admin' | 'rider' | 'customer'

const ROLE_REDIRECTS: Record<Role, string> = {
  super_admin: '/admin',
  restaurant_admin: '/admin',
  rider: '/rider',
  customer: '/dashboard',
}

export default async function AuthRedirectPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single<{ role: Role }>()

  if (!profile?.role) {
    redirect('/login')
  }

  const destination = ROLE_REDIRECTS[profile.role] ?? '/dashboard'
  redirect(destination)
}
