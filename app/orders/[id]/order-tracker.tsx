'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

type OrderStatus = 'pending' | 'confirmed' | 'preparing' | 'ready' | 'completed' | 'cancelled'

const STATUS_STEPS: OrderStatus[] = ['pending', 'confirmed', 'preparing', 'ready', 'completed']

const STATUS_LABELS: Record<OrderStatus, string> = {
  pending: 'Order received',
  confirmed: 'Confirmed',
  preparing: 'Preparing',
  ready: 'Ready',
  completed: 'Completed',
  cancelled: 'Cancelled',
}

const STATUS_DESCRIPTIONS: Record<OrderStatus, string> = {
  pending: 'Your order has been received and is awaiting confirmation.',
  confirmed: 'The restaurant has confirmed your order.',
  preparing: 'The kitchen is preparing your food.',
  ready: 'Your order is ready for pickup / out for delivery.',
  completed: 'Order delivered. Enjoy your meal!',
  cancelled: 'This order was cancelled.',
}

export default function OrderTracker({
  initialOrder,
}: {
  initialOrder: { id: string; status: OrderStatus }
}) {
  const [status, setStatus] = useState<OrderStatus>(initialOrder.status)
  const [live, setLive] = useState(false)

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

  if (status === 'cancelled') {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4">
        <p className="text-sm font-semibold text-red-600">Order cancelled</p>
        <p className="text-xs text-red-400 mt-0.5">{STATUS_DESCRIPTIONS.cancelled}</p>
      </div>
    )
  }

  const currentStepIdx = STATUS_STEPS.indexOf(status)

  return (
    <section className="rounded-2xl border border-gray-100 bg-white shadow-sm px-5 py-5">
      <div className="flex items-center justify-between mb-5">
        <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">Order status</p>
        {live && (
          <span className="flex items-center gap-1.5 text-[11px] font-medium text-green-600">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
            </span>
            Live
          </span>
        )}
      </div>

      <div className="relative">
        {/* Track line */}
        <div className="absolute left-[11px] top-1 bottom-1 w-0.5 bg-gray-100" aria-hidden="true" />

        <ol className="space-y-5 relative">
          {STATUS_STEPS.map((step, idx) => {
            const done = currentStepIdx >= idx
            const active = currentStepIdx === idx
            return (
              <li key={step} className="flex items-start gap-3.5">
                <span
                  className={`relative z-10 mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-all ${
                    done ? 'border-orange-500 bg-orange-500' : 'border-gray-200 bg-white'
                  }`}
                >
                  {done && (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-2.5 w-2.5 text-white" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </span>
                <div>
                  <p className={`text-sm font-semibold ${done ? 'text-gray-900' : 'text-gray-400'}`}>
                    {STATUS_LABELS[step]}
                  </p>
                  {active && (
                    <p className="text-xs text-gray-500 mt-0.5">{STATUS_DESCRIPTIONS[step]}</p>
                  )}
                </div>
              </li>
            )
          })}
        </ol>
      </div>
    </section>
  )
}
