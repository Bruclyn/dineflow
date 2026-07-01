import { resolveAdmin } from '@/lib/admin/resolve-admin'
import { createClient } from '@/lib/supabase/server'
import MenuManager, { type Category, type MenuItem } from './menu-manager'

export default async function AdminMenuPage() {
  const { restaurantId } = await resolveAdmin()
  const supabase = await createClient()

  const [{ data: categories }, { data: menuItems }] = await Promise.all([
    supabase
      .from('categories')
      .select('id, name, display_order')
      .eq('restaurant_id', restaurantId)
      .order('display_order', { ascending: true }),
    supabase
      .from('menu_items')
      .select('id, name, description, price, is_available, category_id, categories(id, name)')
      .eq('restaurant_id', restaurantId)
      .order('name', { ascending: true }),
  ])

  return (
    <main className="flex-1 px-4 sm:px-8 py-8 max-w-5xl w-full mx-auto">
      <MenuManager
        restaurantId={restaurantId}
        initialCategories={(categories ?? []) as unknown as Category[]}
        initialItems={(menuItems ?? []) as unknown as MenuItem[]}
      />
    </main>
  )
}
