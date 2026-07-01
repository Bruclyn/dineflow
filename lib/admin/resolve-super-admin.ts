import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export type SuperAdminContext = {
  userId: string
}

export async function resolveSuperAdmin(): Promise<SuperAdminContext> {
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

  if (profile?.role !== 'super_admin') redirect('/dashboard')

  return { userId: user.id }
}
