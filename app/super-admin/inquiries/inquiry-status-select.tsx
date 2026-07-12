'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export type InquiryStatus = 'pending' | 'contacted' | 'approved' | 'rejected'

const STATUSES: InquiryStatus[] = ['pending', 'contacted', 'approved', 'rejected']

export default function InquiryStatusSelect({
  inquiryId,
  status,
}: {
  inquiryId: string
  status: InquiryStatus
}) {
  const [current, setCurrent] = useState<InquiryStatus>(status)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  async function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const next = e.target.value as InquiryStatus
    const previous = current
    setCurrent(next)
    setSaving(true)
    setError(null)

    const supabase = createClient()
    const { error: err } = await supabase
      .from('partnership_inquiries')
      .update({ status: next })
      .eq('id', inquiryId)

    setSaving(false)
    if (err) {
      setCurrent(previous) // roll back on failure
      setError(err.message)
      return
    }
    router.refresh()
  }

  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={`status-${inquiryId}`} className="sr-only">
        Update status
      </label>
      <select
        id={`status-${inquiryId}`}
        value={current}
        onChange={handleChange}
        disabled={saving}
        className="w-full rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold capitalize text-gray-700 outline-none focus:border-[#F5A623] focus:ring-2 focus:ring-[#E8471E]/10 disabled:opacity-50 transition-all"
      >
        {STATUSES.map((s) => (
          <option key={s} value={s} className="capitalize">
            {s}
          </option>
        ))}
      </select>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  )
}
