'use client'

import { useEffect, useRef, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { MENU_TAGS, parseTags } from '@/lib/menu-tags'
import type { Category, MenuItem } from './menu-manager'

const NEW_CATEGORY = '__new__'
const MAX_IMAGE_BYTES = 5 * 1024 * 1024 // 5 MB

const inputClass =
  'w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm text-gray-800 placeholder-gray-400 outline-none focus:border-[#F5A623] focus:ring-2 focus:ring-[#E8471E]/10 transition-all'

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
  // `imageUrl` is the public URL we persist; `previewUrl` is what the box shows
  // (a local blob for instant feedback, swapped to the CDN URL once uploaded).
  const [imageUrl, setImageUrl] = useState<string | null>(item?.image_url ?? null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(item?.image_url ?? null)
  const [uploading, setUploading] = useState(false)
  const [selectedTags, setSelectedTags] = useState<string[]>(parseTags(item?.tags))
  const [prepTime, setPrepTime] = useState(
    item?.prep_time_mins != null ? String(item.prep_time_mins) : ''
  )
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const blobUrlRef = useRef<string | null>(null)

  function revokeBlob() {
    if (blobUrlRef.current) {
      URL.revokeObjectURL(blobUrlRef.current)
      blobUrlRef.current = null
    }
  }
  // Release the object URL when the modal unmounts.
  useEffect(() => revokeBlob, [])

  function toggleTag(tag: string) {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    )
  }

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    // Reset so selecting the same file again still fires onChange.
    e.target.value = ''
    if (!file) return

    setError(null)
    if (!file.type.startsWith('image/')) {
      setError('Please choose an image file.')
      return
    }
    if (file.size > MAX_IMAGE_BYTES) {
      setError('Image must be under 5 MB.')
      return
    }

    // Show a local preview instantly, before the upload round-trip.
    revokeBlob()
    const localUrl = URL.createObjectURL(file)
    blobUrlRef.current = localUrl
    setPreviewUrl(localUrl)
    setUploading(true)

    const supabase = createClient()
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_')
    const path = `${restaurantId}/${Date.now()}-${safeName}`

    const { error: uploadError } = await supabase.storage
      .from('menu-images')
      .upload(path, file, { cacheControl: '3600', upsert: false })

    if (uploadError) {
      setUploading(false)
      setError(`Image upload failed: ${uploadError.message}`)
      // Roll the preview back to the last successfully saved image.
      revokeBlob()
      setPreviewUrl(imageUrl)
      return
    }

    // Swap the blob preview for the public CDN URL we'll persist.
    const { data } = supabase.storage.from('menu-images').getPublicUrl(path)
    setImageUrl(data.publicUrl)
    setPreviewUrl(data.publicUrl)
    setUploading(false)
  }

  function removePhoto() {
    revokeBlob()
    setImageUrl(null)
    setPreviewUrl(null)
  }

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

    let prepTimeValue: number | null = null
    if (prepTime.trim()) {
      const parsed = Number(prepTime)
      if (!Number.isInteger(parsed) || parsed < 0) {
        setError('Ready-in time must be a whole number of minutes.')
        return
      }
      prepTimeValue = parsed
    }

    if (uploading) {
      setError('Please wait for the image to finish uploading.')
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
      image_url: imageUrl,
      tags: selectedTags.length ? selectedTags.join(',') : null,
      prep_time_mins: prepTimeValue,
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
      <div className="w-full max-w-md max-h-[92vh] overflow-y-auto rounded-2xl bg-white shadow-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-[#1A1A2E]">
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

        <form onSubmit={handleSubmit} className="space-y-3">
          {/* Image upload */}
          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-600">Photo</label>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="group relative flex h-28 w-full items-center justify-center overflow-hidden rounded-xl border-2 border-dashed border-gray-200 bg-[#FAFAF8] transition-colors hover:border-[#E8471E]/40 hover:bg-[#E8471E]/10/40 disabled:cursor-wait"
            >
              {previewUrl ? (
                <>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={previewUrl} alt="Menu item preview" className="h-full w-full object-cover" />
                  <span className="absolute bottom-2 right-2 rounded-lg bg-black/60 px-2.5 py-1 text-[11px] font-semibold text-white">
                    Change photo
                  </span>
                </>
              ) : (
                <div className="flex flex-col items-center gap-1 text-gray-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5V18a2.25 2.25 0 002.25 2.25h13.5A2.25 2.25 0 0021 18v-1.5m-13.5-6L12 3m0 0l4.5 4.5M12 3v13.5" />
                  </svg>
                  <span className="text-xs font-medium">Click to upload photo</span>
                </div>
              )}
              {uploading && (
                <div className="absolute inset-0 flex items-center justify-center bg-white/75">
                  <svg className="h-6 w-6 animate-spin text-[#E8471E]" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                </div>
              )}
            </button>
            {previewUrl && !uploading && (
              <button
                type="button"
                onClick={removePhoto}
                className="text-xs font-medium text-red-500 hover:text-red-600 transition-colors"
              >
                Remove photo
              </button>
            )}
          </div>

          <div className="space-y-1">
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

          <div className="space-y-1">
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

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
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
            <div className="space-y-1">
              <label htmlFor="item-prep-time" className="text-xs font-medium text-gray-600">
                Ready in (mins)
              </label>
              <input
                id="item-prep-time"
                type="number"
                min="0"
                step="1"
                value={prepTime}
                onChange={(e) => setPrepTime(e.target.value)}
                className={inputClass}
                placeholder="15"
              />
            </div>
          </div>

          <div className="space-y-1">
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
            <div className="space-y-1">
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

          {/* Tags */}
          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-600">Tags</label>
            <div className="flex flex-wrap gap-2">
              {MENU_TAGS.map((tag) => {
                const active = selectedTags.includes(tag)
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => toggleTag(tag)}
                    aria-pressed={active}
                    className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors ${
                      active
                        ? 'border-[#E8471E] bg-[#E8471E] text-white'
                        : 'border-gray-200 bg-white text-gray-600 hover:border-[#E8471E]/40 hover:bg-[#E8471E]/10'
                    }`}
                  >
                    {tag}
                  </button>
                )
              })}
            </div>
          </div>

          <div className="flex items-center justify-between rounded-xl border border-gray-200 px-3.5 py-2">
            <span className="text-sm font-medium text-gray-700">Available on menu</span>
            <button
              type="button"
              role="switch"
              aria-checked={isAvailable}
              onClick={() => setIsAvailable((v) => !v)}
              className={`relative inline-flex h-6 w-10 items-center rounded-full transition-colors shrink-0 ${
                isAvailable ? 'bg-[#E8471E]' : 'bg-gray-300'
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
              className="flex-1 rounded-xl border border-gray-200 py-2.5 text-sm font-semibold text-gray-600 hover:bg-[#FAFAF8] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 rounded-xl bg-[#E8471E] py-2.5 text-sm font-semibold text-white hover:bg-[#C93D18] disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
            >
              {saving ? 'Saving…' : isEditing ? 'Save changes' : 'Add item'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
