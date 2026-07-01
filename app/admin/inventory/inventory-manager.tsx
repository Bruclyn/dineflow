'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export type InventoryRow = {
  id: string
  stock_quantity: number
  low_stock_threshold: number
  menu_items: { id: string; name: string } | null
}

type Draft = {
  stockQuantity: string
  lowStockThreshold: string
}

export default function InventoryManager({
  restaurantId,
  initialRows,
}: {
  restaurantId: string
  initialRows: InventoryRow[]
}) {
  const router = useRouter()

  const [drafts, setDrafts] = useState<Record<string, Draft>>(() =>
    Object.fromEntries(
      initialRows.map((row) => [
        row.id,
        { stockQuantity: String(row.stock_quantity), lowStockThreshold: String(row.low_stock_threshold) },
      ])
    )
  )
  const [savingId, setSavingId] = useState<string | null>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})

  function updateDraft(id: string, field: keyof Draft, value: string) {
    setDrafts((prev) => ({ ...prev, [id]: { ...prev[id], [field]: value } }))
  }

  function isDirty(row: InventoryRow) {
    const draft = drafts[row.id]
    if (!draft) return false
    return (
      draft.stockQuantity !== String(row.stock_quantity) ||
      draft.lowStockThreshold !== String(row.low_stock_threshold)
    )
  }

  async function handleSave(row: InventoryRow) {
    const draft = drafts[row.id]
    const stockQuantity = Number(draft.stockQuantity)
    const lowStockThreshold = Number(draft.lowStockThreshold)

    setErrors((prev) => ({ ...prev, [row.id]: '' }))

    if (Number.isNaN(stockQuantity) || stockQuantity < 0) {
      setErrors((prev) => ({ ...prev, [row.id]: 'Enter a valid stock quantity.' }))
      return
    }
    if (Number.isNaN(lowStockThreshold) || lowStockThreshold < 0) {
      setErrors((prev) => ({ ...prev, [row.id]: 'Enter a valid threshold.' }))
      return
    }

    setSavingId(row.id)
    const supabase = createClient()
    const { error } = await supabase
      .from('inventory')
      .update({ stock_quantity: stockQuantity, low_stock_threshold: lowStockThreshold })
      .eq('id', row.id)
      .eq('restaurant_id', restaurantId)

    setSavingId(null)
    if (error) {
      setErrors((prev) => ({ ...prev, [row.id]: error.message }))
      return
    }
    router.refresh()
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Inventory</h1>
        <p className="text-sm text-gray-500 mt-0.5">
          {initialRows.length} item{initialRows.length !== 1 ? 's' : ''} tracked
        </p>
      </div>

      {initialRows.length === 0 ? (
        <div className="rounded-2xl border border-gray-100 bg-white shadow-sm px-6 py-24 text-center">
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-orange-50 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-orange-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
          <p className="text-sm font-medium text-gray-400">No inventory yet</p>
          <p className="text-xs text-gray-400 mt-1">Add menu items to start tracking stock.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {initialRows.map((row) => {
            const draft = drafts[row.id]
            const stockNum = Number(draft.stockQuantity)
            const thresholdNum = Number(draft.lowStockThreshold)
            const outOfStock = !Number.isNaN(stockNum) && stockNum <= 0
            const lowStock = !outOfStock && !Number.isNaN(stockNum) && !Number.isNaN(thresholdNum) && stockNum <= thresholdNum
            const dirty = isDirty(row)
            const saving = savingId === row.id
            const error = errors[row.id]

            return (
              <div
                key={row.id}
                className="flex flex-col sm:flex-row sm:items-center gap-3 rounded-2xl border border-gray-100 bg-white shadow-sm p-4"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-sm font-semibold text-gray-900">
                      {row.menu_items?.name ?? 'Unknown item'}
                    </h3>
                    {outOfStock && (
                      <span className="inline-flex rounded-full bg-red-100 px-2 py-0.5 text-[11px] font-semibold text-red-600">
                        Out of stock
                      </span>
                    )}
                    {lowStock && (
                      <span className="inline-flex rounded-full bg-orange-100 px-2 py-0.5 text-[11px] font-semibold text-orange-600">
                        Low stock
                      </span>
                    )}
                  </div>
                  {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
                </div>

                <div className="flex items-end gap-3 shrink-0">
                  <div className="flex flex-col gap-1">
                    <label htmlFor={`stock-${row.id}`} className="text-[11px] font-medium text-gray-500">
                      Stock
                    </label>
                    <input
                      id={`stock-${row.id}`}
                      type="number"
                      min="0"
                      value={draft.stockQuantity}
                      onChange={(e) => updateDraft(row.id, 'stockQuantity', e.target.value)}
                      className="w-20 rounded-lg border border-gray-200 px-2 py-1.5 text-sm text-center text-gray-900 outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition-all"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label htmlFor={`threshold-${row.id}`} className="text-[11px] font-medium text-gray-500">
                      Low stock at
                    </label>
                    <input
                      id={`threshold-${row.id}`}
                      type="number"
                      min="0"
                      value={draft.lowStockThreshold}
                      onChange={(e) => updateDraft(row.id, 'lowStockThreshold', e.target.value)}
                      className="w-20 rounded-lg border border-gray-200 px-2 py-1.5 text-sm text-center text-gray-900 outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition-all"
                    />
                  </div>
                  <button
                    onClick={() => handleSave(row)}
                    disabled={!dirty || saving}
                    className="rounded-lg bg-orange-500 px-3 py-2 text-xs font-semibold text-white hover:bg-orange-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    {saving ? 'Saving…' : 'Save'}
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
