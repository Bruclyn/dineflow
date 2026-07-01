'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

type Status = 'pending' | 'confirmed' | 'preparing' | 'ready' | 'completed' | 'cancelled'

const ADVANCE_LABEL: Partial<Record<Status, string>> = {
  pending: 'Confirm',
  confirmed: 'Start Preparing',
  preparing: 'Mark Ready',
  ready: 'Complete',
}

const ADVANCE_NEXT: Partial<Record<Status, Status>> = {
  pending: 'confirmed',
  confirmed: 'preparing',
  preparing: 'ready',
  ready: 'completed',
}

const TERMINAL: Status[] = ['completed', 'cancelled']

export default function OrderStatusActions({
  orderId,
  status,
}: {
  orderId: string
  status: Status
}) {
  const [loading, setLoading] = useState<'advance' | 'cancel' | null>(null)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  async function update(newStatus: Status) {
    setLoading(newStatus === 'cancelled' ? 'cancel' : 'advance')
    setError(null)
    const supabase = createClient()
    const { error: err } = await supabase
      .from('orders')
      .update({ status: newStatus })
      .eq('id', orderId)
    if (err) {
      setError(err.message)
    } else {
      router.refresh()
    }
    setLoading(null)
  }

  if (TERMINAL.includes(status)) {
    return (
      <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold capitalize ${
        status === 'completed' ? 'bg-gray-100 text-gray-500' : 'bg-red-100 text-red-600'
      }`}>
        {status}
      </span>
    )
  }

  const nextLabel = ADVANCE_LABEL[status]
  const nextStatus = ADVANCE_NEXT[status]

  return (
    <div className="flex flex-col gap-2">
      {nextStatus && nextLabel && (
        <button
          onClick={() => update(nextStatus)}
          disabled={loading !== null}
          className="flex items-center justify-center gap-1.5 rounded-xl bg-orange-500 px-3 py-2 text-xs font-semibold text-white hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading === 'advance' ? (
            <span className="h-3 w-3 rounded-full border-2 border-white border-t-transparent animate-spin" />
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          )}
          {nextLabel}
        </button>
      )}
      <button
        onClick={() => update('cancelled')}
        disabled={loading !== null}
        className="flex items-center justify-center gap-1.5 rounded-xl border border-gray-200 px-3 py-2 text-xs font-semibold text-gray-500 hover:border-red-300 hover:text-red-500 hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {loading === 'cancel' ? (
          <span className="h-3 w-3 rounded-full border-2 border-current border-t-transparent animate-spin" />
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        )}
        Cancel
      </button>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  )
}
