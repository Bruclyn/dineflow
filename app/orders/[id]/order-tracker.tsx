'use client'

import { useEffect, useState } from 'react'
import { Check, Receipt, CookingPot, PackageCheck, Bike, XCircle } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

type OrderStatus = 'pending' | 'confirmed' | 'preparing' | 'ready' | 'completed' | 'cancelled'

type Stage = {
  label: string
  pickupLabel: string
  icon: LucideIcon
}

// Four customer-facing stages. The six DB statuses map onto these four so we
// never touch the backend: pending/confirmed -> Received, preparing -> Being
// Prepared, ready -> Picked Up, completed -> On the Way (delivered).
const STAGES: Stage[] = [
  { label: 'Received', pickupLabel: 'Received', icon: Receipt },
  { label: 'Being Prepared', pickupLabel: 'Being Prepared', icon: CookingPot },
  { label: 'Picked Up', pickupLabel: 'Ready', icon: PackageCheck },
  { label: 'On the Way', pickupLabel: 'Ready for Pickup', icon: Bike },
]

const STATUS_TO_STAGE: Record<Exclude<OrderStatus, 'cancelled'>, number> = {
  pending: 0,
  confirmed: 0,
  preparing: 1,
  ready: 2,
  completed: 3,
}

const ETA_MINUTES = { delivery: 40, pickup: 20 } as const

export default function OrderTracker({
  initialOrder,
  createdAt,
  orderType,
}: {
  initialOrder: { id: string; status: OrderStatus }
  createdAt: string
  orderType: 'pickup' | 'delivery'
}) {
  const [status, setStatus] = useState<OrderStatus>(initialOrder.status)
  const [live, setLive] = useState(false)
  const [now, setNow] = useState<number | null>(null)

  useEffect(() => {
    let mounted = true
    const supabase = createClient()

    const channel = supabase
      .channel(`order-status-${initialOrder.id}`)
      .on<{ status: OrderStatus }>(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'orders',
          filter: `id=eq.${initialOrder.id}`,
        },
        (payload) => {
          if (!mounted) return
          setStatus(payload.new.status)
        }
      )
      .subscribe((subscribeStatus) => {
        if (!mounted) return
        setLive(subscribeStatus === 'SUBSCRIBED')
        if (subscribeStatus === 'CHANNEL_ERROR' || subscribeStatus === 'TIMED_OUT') {
          console.warn('Order status Realtime subscription issue:', subscribeStatus)
        }
      })

    return () => {
      mounted = false
      supabase.removeChannel(channel)
    }
  }, [initialOrder.id])

  // Post-mount clock so live countdown text never causes a hydration mismatch.
  useEffect(() => {
    setNow(Date.now())
    const t = setInterval(() => setNow(Date.now()), 30_000)
    return () => clearInterval(t)
  }, [])

  const etaMinutes = ETA_MINUTES[orderType]
  const eta = new Date(new Date(createdAt).getTime() + etaMinutes * 60_000)
  const etaTime = eta.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
    timeZone: 'Africa/Lagos',
  })

  if (status === 'cancelled') {
    return (
      <section className="rounded-xl border border-red-200 bg-red-50 px-6 py-6 shadow-card">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-red-100">
            <XCircle className="h-6 w-6 text-red-500" />
          </span>
          <div>
            <p className="font-display text-lg font-bold text-red-600">Order cancelled</p>
            <p className="mt-0.5 text-sm text-red-400">
              This order was cancelled. If you were charged, the amount will be reversed.
            </p>
          </div>
        </div>
      </section>
    )
  }

  const isCompleted = status === 'completed'
  const currentStage = STATUS_TO_STAGE[status as Exclude<OrderStatus, 'cancelled'>]
  const fraction = currentStage / (STAGES.length - 1) // 0, 1/3, 2/3, 1

  // Large ETA header content.
  let remainingLabel: string
  if (isCompleted) {
    remainingLabel = orderType === 'delivery' ? 'Delivered' : 'Ready for pickup'
  } else if (now === null) {
    remainingLabel = `~${etaMinutes} min away`
  } else {
    const mins = Math.round((eta.getTime() - now) / 60_000)
    remainingLabel = mins <= 1 ? 'Arriving any moment' : `${mins} min away`
  }

  return (
    <section className="overflow-hidden rounded-xl border border-[#E5E7EB] bg-white shadow-card">
      {/* Large ETA header */}
      <div className="border-b border-[#E5E7EB] bg-[#FAFAF8] px-6 py-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-[#6B7280]">
              {isCompleted
                ? 'Order complete'
                : orderType === 'delivery'
                  ? 'Estimated delivery'
                  : 'Estimated ready by'}
            </p>
            {isCompleted ? (
              <p className="mt-1 flex items-center gap-2 font-display text-3xl font-bold text-[#1A1A2E]">
                <Check className="h-7 w-7 text-[#E8471E]" strokeWidth={3} />
                {orderType === 'delivery' ? 'Delivered' : 'Collected'}
              </p>
            ) : (
              <p className="mt-1 font-display text-4xl font-bold leading-none text-[#1A1A2E]">
                {etaTime}
              </p>
            )}
            <p className="mt-2 text-sm font-medium text-[#E8471E]">{remainingLabel}</p>
          </div>

          {live && (
            <span className="flex shrink-0 items-center gap-1.5 rounded-full bg-white px-2.5 py-1 text-[11px] font-semibold text-green-600 shadow-sm">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
              </span>
              Live
            </span>
          )}
        </div>
      </div>

      {/* 4-stage animated progress bar */}
      <div className="px-6 pb-6 pt-8">
        <div className="relative">
          {/* Base track (between first and last node centers) */}
          <div
            className="absolute left-[12.5%] right-[12.5%] top-[22px] h-1 -translate-y-1/2 rounded-full bg-[#E5E7EB]"
            aria-hidden="true"
          />
          {/* Filled track (animates its width as the order advances) */}
          <div
            className="absolute left-[12.5%] top-[22px] h-1 -translate-y-1/2 overflow-hidden rounded-full bg-[#E8471E] transition-[width] duration-700 ease-out"
            style={{ width: `calc(75% * ${fraction})` }}
            aria-hidden="true"
          >
            {!isCompleted && fraction > 0 && (
              <span className="tracker-shimmer absolute inset-0 block" />
            )}
          </div>

          {/* Nodes */}
          <ol className="relative flex items-start justify-between">
            {STAGES.map((stage, idx) => {
              const done = idx < currentStage || isCompleted
              const active = idx === currentStage && !isCompleted
              const Icon = stage.icon
              const label = orderType === 'delivery' ? stage.label : stage.pickupLabel
              return (
                <li
                  key={stage.label}
                  className="flex w-1/4 flex-col items-center text-center"
                >
                  <span
                    className={`relative flex h-11 w-11 items-center justify-center rounded-full border-2 transition-all duration-500 ${
                      done || active
                        ? 'border-[#E8471E] bg-[#E8471E] text-white'
                        : 'border-[#E5E7EB] bg-white text-[#9CA3AF]'
                    }`}
                  >
                    {active && (
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#E8471E] opacity-40" />
                    )}
                    {done ? (
                      <Check className="relative h-5 w-5" strokeWidth={3} />
                    ) : (
                      <Icon className="relative h-5 w-5" strokeWidth={2.2} />
                    )}
                  </span>
                  <span
                    className={`mt-2.5 text-xs font-semibold leading-tight ${
                      active
                        ? 'text-[#E8471E]'
                        : done
                          ? 'text-[#1A1A2E]'
                          : 'text-[#9CA3AF]'
                    }`}
                  >
                    {label}
                  </span>
                </li>
              )
            })}
          </ol>
        </div>
      </div>
    </section>
  )
}
