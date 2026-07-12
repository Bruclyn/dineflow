'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

type ExistingReview = {
  rating: number
  comment: string | null
  created_at: string
}

function Star({ filled }: { filled: boolean }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={`h-4 w-4 ${filled ? 'text-[#F5A623]' : 'text-gray-200'}`}
      viewBox="0 0 20 20"
      fill="currentColor"
    >
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.96a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.37 2.448a1 1 0 00-.364 1.118l1.286 3.96c.3.921-.755 1.688-1.54 1.118l-3.37-2.448a1 1 0 00-1.175 0l-3.37 2.448c-.784.57-1.838-.197-1.539-1.118l1.285-3.96a1 1 0 00-.364-1.118L2.05 9.387c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69l1.286-3.96z" />
    </svg>
  )
}

export default function ReviewSection({
  orderId,
  restaurantId,
  existingReview,
}: {
  orderId: string
  restaurantId: string
  existingReview: ExistingReview | null
}) {
  const router = useRouter()
  const [rating, setRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [comment, setComment] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (existingReview) {
    const submittedAt = new Date(existingReview.created_at).toLocaleDateString('en-NG', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })

    return (
      <section className="rounded-2xl border border-gray-100 bg-white shadow-sm px-5 py-5">
        <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-3">Your review</p>
        <div className="flex items-center gap-0.5">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star key={star} filled={existingReview.rating >= star} />
          ))}
        </div>
        {existingReview.comment && (
          <p className="text-sm text-gray-700 mt-3 leading-relaxed">{existingReview.comment}</p>
        )}
        <p className="text-xs text-gray-400 mt-3">Submitted {submittedAt}</p>
      </section>
    )
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    if (rating === 0) {
      setError('Please select a star rating.')
      return
    }

    setSubmitting(true)
    const supabase = createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      setError('You must be signed in to leave a review.')
      setSubmitting(false)
      return
    }

    const { error: insertError } = await supabase.from('reviews').insert({
      customer_id: user.id,
      restaurant_id: restaurantId,
      order_id: orderId,
      rating,
      comment: comment.trim() || null,
    })

    setSubmitting(false)
    if (insertError) {
      setError(insertError.message)
      return
    }

    router.refresh()
  }

  return (
    <section className="rounded-2xl border border-gray-100 bg-white shadow-sm px-5 py-5">
      <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-3">Leave a review</p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              className="p-0.5"
              aria-label={`${star} star${star !== 1 ? 's' : ''}`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`h-7 w-7 transition-colors ${
                  (hoverRating || rating) >= star ? 'text-[#F5A623]' : 'text-gray-200'
                }`}
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.96a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.37 2.448a1 1 0 00-.364 1.118l1.286 3.96c.3.921-.755 1.688-1.54 1.118l-3.37-2.448a1 1 0 00-1.175 0l-3.37 2.448c-.784.57-1.838-.197-1.539-1.118l1.285-3.96a1 1 0 00-.364-1.118L2.05 9.387c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69l1.286-3.96z" />
              </svg>
            </button>
          ))}
        </div>

        <textarea
          rows={3}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Tell us about your experience (optional)…"
          className="w-full resize-none rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm text-gray-800 placeholder-gray-400 outline-none focus:border-[#F5A623] focus:ring-2 focus:ring-[#E8471E]/10 transition-all"
        />

        {error && (
          <div className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-2.5">
            <svg xmlns="http://www.w3.org/2000/svg" className="mt-0.5 h-4 w-4 shrink-0 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-xl bg-[#E8471E] py-3 text-sm font-bold text-white hover:bg-[#C93D18] disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
        >
          {submitting ? 'Submitting…' : 'Submit review'}
        </button>
      </form>
    </section>
  )
}
