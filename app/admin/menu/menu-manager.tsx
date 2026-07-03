'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { foodImageUrl, guessFoodCategory } from '@/lib/food-images'
import { parseTags } from '@/lib/menu-tags'
import MenuItemModal from './menu-item-modal'

export type Category = {
  id: string
  name: string
  display_order: number
}

export type MenuItem = {
  id: string
  name: string
  description: string | null
  price: number
  is_available: boolean
  category_id: string | null
  image_url: string | null
  tags: string | null
  prep_time_mins: number | null
  categories: { id: string; name: string } | null
}

export default function MenuManager({
  restaurantId,
  initialCategories,
  initialItems,
}: {
  restaurantId: string
  initialCategories: Category[]
  initialItems: MenuItem[]
}) {
  const router = useRouter()
  const [modalItem, setModalItem] = useState<MenuItem | null | undefined>(undefined)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [deleteError, setDeleteError] = useState<string | null>(null)

  const grouped = initialItems.reduce<Record<string, MenuItem[]>>((acc, item) => {
    const cat = item.categories?.name ?? 'Uncategorized'
    acc[cat] = acc[cat] ?? []
    acc[cat].push(item)
    return acc
  }, {})

  const categoryNames = Object.keys(grouped).sort((a, b) => a.localeCompare(b))

  async function handleDelete(item: MenuItem) {
    if (!window.confirm(`Delete "${item.name}"? This also removes its inventory record.`)) {
      return
    }
    setDeletingId(item.id)
    setDeleteError(null)

    const supabase = createClient()
    const { error } = await supabase
      .from('menu_items')
      .delete()
      .eq('id', item.id)
      .eq('restaurant_id', restaurantId)

    setDeletingId(null)
    if (error) {
      setDeleteError(error.message)
      return
    }
    router.refresh()
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Menu</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {initialItems.length} item{initialItems.length !== 1 ? 's' : ''} total
          </p>
        </div>
        <button
          onClick={() => setModalItem(null)}
          className="flex shrink-0 items-center gap-1.5 rounded-xl bg-orange-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-orange-600 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Add item
        </button>
      </div>

      {deleteError && (
        <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {deleteError}
        </div>
      )}

      {initialItems.length === 0 ? (
        <div className="rounded-2xl border border-gray-100 bg-white shadow-sm px-6 py-24 text-center">
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-orange-50 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-orange-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <p className="text-sm font-medium text-gray-400">No menu items yet</p>
          <p className="text-xs text-gray-400 mt-1">Add your first item to get started.</p>
        </div>
      ) : (
        <div className="space-y-8">
          {categoryNames.map((cat) => (
            <section key={cat}>
              <h2 className="text-sm font-semibold text-gray-900 mb-3 pb-2 border-b border-gray-100">
                {cat}
              </h2>
              <div className="space-y-2">
                {grouped[cat].map((item) => (
                  <div
                    key={item.id}
                    className="flex flex-col sm:flex-row sm:items-center gap-3 rounded-2xl border border-gray-100 bg-white shadow-sm p-4"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.image_url ?? foodImageUrl(guessFoodCategory(item.name), 128, 128)}
                      alt={item.name}
                      className="h-16 w-16 shrink-0 rounded-xl object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-sm font-semibold text-gray-900">{item.name}</h3>
                        <span
                          className={`inline-flex rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                            item.is_available ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                          }`}
                        >
                          {item.is_available ? 'Available' : 'Unavailable'}
                        </span>
                        {item.prep_time_mins != null && (
                          <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-[11px] font-semibold text-gray-600">
                            ⏱ {item.prep_time_mins} mins
                          </span>
                        )}
                      </div>
                      {parseTags(item.tags).length > 0 && (
                        <div className="mt-1 flex flex-wrap gap-1">
                          {parseTags(item.tags).map((tag) => (
                            <span
                              key={tag}
                              className="inline-flex rounded-full bg-orange-50 px-2 py-0.5 text-[11px] font-medium text-orange-600"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                      {item.description && (
                        <p className="mt-0.5 text-xs text-gray-500 line-clamp-1">{item.description}</p>
                      )}
                      <p className="mt-1 text-sm font-bold text-orange-500 tabular-nums">
                        ₦{item.price.toLocaleString('en-NG')}
                      </p>
                    </div>
                    <div className="shrink-0 flex items-center gap-2">
                      <button
                        onClick={() => setModalItem(item)}
                        className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(item)}
                        disabled={deletingId === item.id}
                        className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-500 hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        {deletingId === item.id ? 'Deleting…' : 'Delete'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      )}

      {modalItem !== undefined && (
        <MenuItemModal
          restaurantId={restaurantId}
          categories={initialCategories}
          item={modalItem}
          onClose={() => setModalItem(undefined)}
          onSaved={() => {
            setModalItem(undefined)
            router.refresh()
          }}
        />
      )}
    </div>
  )
}
