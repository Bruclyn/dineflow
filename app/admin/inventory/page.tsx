import { resolveAdmin } from '@/lib/admin/resolve-admin'
import { createClient } from '@/lib/supabase/server'
import InventoryManager, { type InventoryRow } from './inventory-manager'

export default async function AdminInventoryPage() {
  const { restaurantId } = await resolveAdmin()
  const supabase = await createClient()

  const { data: inventory } = await supabase
    .from('inventory')
    .select('id, stock_quantity, low_stock_threshold, menu_items(id, name)')
    .eq('restaurant_id', restaurantId)

  const rows = ((inventory ?? []) as unknown as InventoryRow[]).slice().sort((a, b) =>
    (a.menu_items?.name ?? '').localeCompare(b.menu_items?.name ?? '')
  )

  return (
    <main className="flex-1 px-4 sm:px-8 py-8 max-w-4xl w-full mx-auto">
      <InventoryManager restaurantId={restaurantId} initialRows={rows} />
    </main>
  )
}
