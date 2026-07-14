'use client'

import { useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

const inputClass =
  'w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm text-[#1A1A2E] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#E8471E] focus:border-transparent transition'

const BENEFIT_CARDS = [
  {
    icon: '🍽️',
    title: 'More Customers',
    description: 'Get discovered by thousands of users already on the platform',
  },
  {
    icon: '📋',
    title: 'Easy Menu Management',
    description: 'Add, edit and update your menu in real time',
  },
  {
    icon: '📦',
    title: 'Real-time Orders',
    description: 'Receive and manage orders the moment they come in',
  },
  {
    icon: '📊',
    title: 'Simple Dashboard',
    description: 'Everything you need to run your restaurant in one place',
  },
]

const HOW_STEPS = [
  { n: 1, text: 'Apply below' },
  { n: 2, text: 'We review your application' },
  { n: 3, text: 'Go live and start receiving orders' },
]

export default function PartnerPage() {
  const [restaurantName, setRestaurantName] = useState('')
  const [ownerName, setOwnerName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [city, setCity] = useState('')
  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [submitted, setSubmitted] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const supabase = createClient()
    const { error: insertError } = await supabase.from('partnership_inquiries').insert({
      restaurant_name: restaurantName.trim(),
      owner_name: ownerName.trim(),
      phone: phone.trim(),
      email: email.trim(),
      city: city.trim(),
      description: description.trim() || null,
      status: 'pending',
    })

    if (insertError) {
      setError(insertError.message || 'Something went wrong. Please try again.')
      setLoading(false)
      return
    }

    setLoading(false)
    setSubmitted(true)
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="text-xl font-display font-bold text-[#E8471E] tracking-tight">
            DineFlow
          </Link>
          <Link
            href="/login"
            className="text-sm font-semibold text-gray-700 hover:text-[#E8471E] transition-colors"
          >
            Log in
          </Link>
        </div>
      </header>

      <main className="flex-1">
        {/* SECTION A — Marketing hero */}
        <section className="bg-[#1A1A2E] overflow-hidden">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
            <div className="text-center max-w-2xl mx-auto">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3.5 py-1.5 text-xs font-semibold text-[#E8471E]/40 mb-6">
                🤝 For Restaurants
              </span>
              <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white leading-tight">
                Grow your restaurant with DineFlow
              </h1>
              <p className="mt-5 text-base sm:text-lg text-gray-400 leading-relaxed">
                Join Warri&apos;s fastest-growing food marketplace and reach thousands of
                hungry customers.
              </p>
            </div>

            {/* Benefit cards — 2x2 */}
            <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 max-w-3xl mx-auto">
              {BENEFIT_CARDS.map((card) => (
                <div
                  key={card.title}
                  className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 sm:p-6"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#E8471E] text-2xl shadow-sm shadow-[#E8471E]/30">
                    <span aria-hidden="true">{card.icon}</span>
                  </div>
                  <h3 className="mt-4 text-base font-bold text-white">{card.title}</h3>
                  <p className="mt-1.5 text-sm text-gray-400 leading-relaxed">{card.description}</p>
                </div>
              ))}
            </div>

            {/* How it works */}
            <div className="mt-14 max-w-3xl mx-auto">
              <h2 className="text-center text-lg font-bold text-white mb-8">How it works</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
                {HOW_STEPS.map((step) => (
                  <div key={step.n} className="flex sm:flex-col items-center sm:text-center gap-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#E8471E] text-sm font-bold text-white">
                      {step.n}
                    </span>
                    <p className="text-sm text-gray-300 leading-relaxed">{step.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Orange divider leading into the form */}
        <div className="h-1.5 bg-[#E8471E]" aria-hidden="true" />

        {/* SECTION B — Inquiry form */}
        <section className="bg-white">
          <div className="max-w-2xl w-full mx-auto px-4 sm:px-6 py-14 sm:py-20">
            {submitted ? (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8">
                <div className="py-8 text-center">
                  <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <h2 className="font-display text-xl font-bold text-[#1A1A2E]">Application received</h2>
                  <p className="mt-2 text-sm text-gray-600 leading-relaxed max-w-sm mx-auto">
                    Thanks for your interest! We&apos;ll review your application and get in touch within
                    2-3 business days.
                  </p>
                  <Link
                    href="/"
                    className="mt-8 inline-block rounded-lg bg-[#E8471E] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#C93D18] transition-colors"
                  >
                    Back to home
                  </Link>
                </div>
              </div>
            ) : (
              <>
                <div className="text-center mb-8">
                  <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-[#1A1A2E]">
                    Apply to become a partner
                  </h2>
                  <p className="mt-2 text-sm sm:text-base text-gray-500">
                    Fill in your details and we&apos;ll be in touch within 2-3 business days.
                  </p>
                </div>

                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8">
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="restaurantName" className="block text-sm font-medium text-gray-700 mb-1.5">
                          Restaurant name
                        </label>
                        <input
                          id="restaurantName"
                          type="text"
                          required
                          value={restaurantName}
                          onChange={(e) => setRestaurantName(e.target.value)}
                          className={inputClass}
                          placeholder="Spice Garden"
                        />
                      </div>
                      <div>
                        <label htmlFor="ownerName" className="block text-sm font-medium text-gray-700 mb-1.5">
                          Owner name
                        </label>
                        <input
                          id="ownerName"
                          type="text"
                          required
                          value={ownerName}
                          onChange={(e) => setOwnerName(e.target.value)}
                          className={inputClass}
                          placeholder="Jane Doe"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1.5">
                          Phone number
                        </label>
                        <input
                          id="phone"
                          type="tel"
                          required
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className={inputClass}
                          placeholder="08012345678"
                        />
                      </div>
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">
                          Email address
                        </label>
                        <input
                          id="email"
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className={inputClass}
                          placeholder="you@restaurant.com"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1.5">
                        City
                      </label>
                      <input
                        id="city"
                        type="text"
                        required
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className={inputClass}
                        placeholder="Warri"
                      />
                    </div>

                    <div>
                      <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1.5">
                        Tell us about your restaurant
                      </label>
                      <textarea
                        id="description"
                        rows={4}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className={`${inputClass} resize-none`}
                        placeholder="What kind of food do you serve? How many locations? Anything else we should know?"
                      />
                    </div>

                    {error && (
                      <div className="flex items-start gap-2 rounded-lg bg-red-50 border border-red-100 px-4 py-2.5">
                        <span className="text-red-500 mt-0.5 shrink-0">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                        </span>
                        <p className="text-sm text-red-600">{error}</p>
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-[#E8471E] hover:bg-[#C93D18] active:bg-[#C93D18] disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold py-2.5 rounded-lg transition-colors mt-2"
                    >
                      {loading ? 'Submitting…' : 'Submit application'}
                    </button>
                  </form>
                </div>
              </>
            )}
          </div>
        </section>
      </main>
    </div>
  )
}
