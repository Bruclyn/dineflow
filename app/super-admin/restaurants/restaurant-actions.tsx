'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

type Status = 'pending' | 'active' | 'suspended'
type Action = 'approve' | 'reject' | 'suspend' | 'reactivate'

const NEXT_STATUS: Record<Action, Status> = {
  approve: 'active',
  reject: 'suspended',
  suspend: 'suspended',
  reactivate: 'active',
}

const LABEL: Record<Action, string> = {
  approve: 'Approve',
  reject: 'Reject',
  suspend: 'Suspend',
  reactivate: 'Reactivate',
}

const LOADING_LABEL: Record<Action, string> = {
  approve: 'Approving…',
  reject: 'Rejecting…',
  suspend: 'Suspending…',
  reactivate: 'Reactivating…',
}

export default function RestaurantActions({
  restaurantId,
  status,
}: {
  restaurantId: string
  status: Status
}) {
  const [loading, setLoading] = useState<Action | null>(null)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  async function handleAction(action: Action) {
    setLoading(action)
    setError(null)
    const supabase = createClient()
    const { error: err } = await supabase
      .from('restaurants')
      .update({ status: NEXT_STATUS[action] })
      .eq('id', restaurantId)
    if (err) {
      setError(err.message)
    } else {
      router.refresh()
    }
    setLoading(null)
  }

  function ActionButton({ action, variant }: { action: Action; variant: 'primary' | 'danger' }) {
    return (
      <button
        onClick={() => handleAction(action)}
        disabled={loading !== null}
        className={`flex-1 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
          variant === 'primary'
            ? 'bg-[#E8471E] text-white hover:bg-[#C93D18]'
            : 'border border-red-200 text-red-500 hover:bg-red-50'
        }`}
      >
        {loading === action ? LOADING_LABEL[action] : LABEL[action]}
      </button>
    )
  }

  return (
    <div className="flex flex-col gap-2">
      {status === 'pending' && (
        <div className="flex gap-2">
          <ActionButton action="approve" variant="primary" />
          <ActionButton action="reject" variant="danger" />
        </div>
      )}
      {status === 'active' && <ActionButton action="suspend" variant="danger" />}
      {status === 'suspended' && <ActionButton action="reactivate" variant="primary" />}
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  )
}
