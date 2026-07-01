'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Category, MenuItem } from './menu-manager'

const NEW_CATEGORY = '__new__'

const inputClass =
  'w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm text-gray-800 placeholder-gray-400 outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition-all'

export default function MenuItemModal({
  restaurantId,
  categories,
  item,
  onClose,
  onSaved,
}: {
  restaurantId: string
  categories: Category[]
  item: MenuItem | null
  onClose: () => void
  onSaved: () => void
}) {
  const isEditing = item !== null

  const [name, setName] = useState(item?.name ?? '')
  const [description, setDescription] = useState(item?.description ?? '')
  const [price, setPrice] = useState(item ? String(item.price) : '')
  const [categoryId, setCategoryId] = useState(
    item?.category_id ?? (categories.length === 0 ? NEW_CATEGORY : categories[0].id)
  )
  const [newCategoryName, setNewCategoryName] = useState('')
  const [isAvailable, setIsAvailable] = useState(item?.is_available ?? true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    if (!name.trim()) {
      setError('Name is required.')
      return
    }

    const priceNum = Number(price)
    if (!price || Number.isNaN(priceNum) || priceNum < 0) {
      setError('Enter a valid price.')
      return
    }

    if (categoryId === NEW_CATEGORY && !newCategoryName.trim()) {
      setError('Enter a category name.')
      return
    }

    setSaving(true)
    const supabase = createClient()

    let finalCategoryId = categoryId
    if (categoryId === NEW_CATEGORY) {
      const { data: newCategory, error: categoryError } = await supabase
        .from('categories')
        .insert({ name: newCategoryName.trim(), restaurant_id: restaurantId })
        .select('id')
        .single()

      if (categoryError || !newCategory) {
        setError(categoryError?.message ?? 'Failed to create category.')
        setSaving(false)
        return
      }
      finalCategoryId = newCategory.id
    }

    const payload = {
      restaurant_id: restaurantId,
      name: name.trim(),
      description: description.trim() || null,
      price: priceNum,
      category_id: finalCategoryId,
      is_available: isAvailable,
    }

    const { error: saveError } = isEditing
      ? await supabase
          .from('menu_items')
          .update(payload)
          .eq('id', item!.id)
          .eq('restaurant_id', restaurantId)
      : await supabase.from('menu_items').insert(payload)

    setSaving(false)
    if (saveError) {
      setError(saveError.message)
      return
    }
    onSaved()
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className="w-full max-w-md max-h-[90vh] overflow-y-auto rounded-2xl bg-white shadow-xl p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold text-gray-900">
            {isEditing ? 'Edit item' : 'Add item'}
          </h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label htmlFor="item-name" className="text-xs font-medium text-gray-600">
              Name
            </label>
            <input
              id="item-name"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={inputClass}
              placeholder="Jollof rice"
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="item-description" className="text-xs font-medium text-gray-600">
              Description
            </label>
            <textarea
              id="item-description"
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className={`${inputClass} resize-none`}
              placeholder="Optional short description…"
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="item-price" className="text-xs font-medium text-gray-600">
              Price (₦)
            </label>
            <input
              id="item-price"
              type="number"
              min="0"
              step="0.01"
              required
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className={inputClass}
              placeholder="2500"
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="item-category" className="text-xs font-medium text-gray-600">
              Category
            </label>
            <select
              id="item-category"
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className={inputClass}
            >
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
              <option value={NEW_CATEGORY}>+ Add new category</option>
            </select>
          </div>

          {categoryId === NEW_CATEGORY && (
            <div className="space-y-1.5">
              <label htmlFor="new-category-name" className="text-xs font-medium text-gray-600">
                New category name
              </label>
              <input
                id="new-category-name"
                type="text"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                className={inputClass}
                placeholder="Main dishes"
              />
            </div>
          )}

          <div className="flex items-center justify-between rounded-xl border border-gray-200 px-3.5 py-2.5">
            <span className="text-sm font-medium text-gray-700">Available on menu</span>
            <button
              type="button"
              role="switch"
              aria-checked={isAvailable}
              onClick={() => setIsAvailable((v) => !v)}
              className={`relative inline-flex h-6 w-10 items-center rounded-full transition-colors shrink-0 ${
                isAvailable ? 'bg-orange-500' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 rounded-full bg-white shadow transform transition-transform ${
                  isAvailable ? 'translate-x-5' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {error && (
            <div className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-2.5">
              <svg xmlns="http://www.w3.org/2000/svg" className="mt-0.5 h-4 w-4 shrink-0 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-xl border border-gray-200 py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 rounded-xl bg-orange-500 py-2.5 text-sm font-semibold text-white hover:bg-orange-600 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
            >
              {saving ? 'Saving…' : isEditing ? 'Save changes' : 'Add item'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
