'use client'

import { useState } from 'react'
import Link from 'next/link'
import type { Restaurant } from './page'
import { restaurantCoverUrl } from '@/lib/food-images'

const ALL = 'All'

export default function RestaurantBrowser({
  restaurants,
  firstName,
  greeting,
}: {
  restaurants: Restaurant[]
  firstName: string
  greeting: string
}) {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState(ALL)

  // Unique cuisine types derived from the actual data (no hardcoding)
  const categories = Array.from(
    new Set(
      restaurants
        .map((r) => r.cuisine_type)
        .filter((c): c is string => !!c && c.trim().length > 0)
    )
  ).sort()

  const search = query.trim().toLowerCase()
  const filtered = restaurants.filter((r) => {
    const matchesCategory = category === ALL || r.cuisine_type === category
    const matchesSearch = search.length === 0 || r.name.toLowerCase().includes(search)
    return matchesCategory && matchesSearch
  })

  return (
    <div>
      {/* Welcome banner */}
      <div className="bg-gradient-to-b from-[#E8471E]/10 to-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
          <h1 className="font-display text-2xl md:text-3xl font-bold text-[#1A1A2E]">
            Good {greeting}, {firstName} 👋
          </h1>
          <p className="mt-1 text-gray-500">What are you craving today?</p>

          {/* Search bar */}
          <div className="relative mt-5 w-full max-w-2xl">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z"
                />
              </svg>
            </div>
            <input
              type="search"
              placeholder="Search restaurants…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full rounded-full border border-gray-100 bg-white py-3.5 pl-12 pr-4 text-sm text-[#1A1A2E] placeholder-gray-400 shadow-sm outline-none transition focus:border-[#E8471E]/40 focus:ring-2 focus:ring-[#E8471E]/10"
            />
          </div>
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 pb-16">
        {/* Cuisine pills */}
        {categories.length > 0 && (
          <div className="flex gap-3 overflow-x-auto py-4">
            {[ALL, ...categories].map((cat) => {
              const active = category === cat
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat)}
                  className={`shrink-0 rounded-full px-5 py-2 text-sm font-medium transition-colors ${
                    active
                      ? 'bg-[#E8471E] text-white'
                      : 'border border-gray-200 bg-white text-gray-600 hover:bg-[#E8471E]/10 hover:text-[#C93D18]'
                  }`}
                >
                  {cat}
                </button>
              )
            })}
          </div>
        )}

        {/* Grid */}
        {filtered.length > 0 ? (
          <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((r) => (
              <RestaurantCard key={r.id} restaurant={r} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-[#E8471E]/10">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-[#F5A623]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z"
                />
              </svg>
            </div>
            <p className="text-sm font-medium text-gray-700">
              {query ? `No results for "${query}"` : 'No restaurants available'}
            </p>
            <p className="mt-1 text-xs text-gray-400">
              {query ? 'Try a different search term.' : 'Check back soon — more are on the way.'}
            </p>
          </div>
        )}
      </main>
    </div>
  )
}

function RestaurantCard({ restaurant }: { restaurant: Restaurant }) {
  const initial = restaurant.name.charAt(0).toUpperCase()

  return (
    <Link
      href={`/restaurant/${restaurant.id}`}
      className="group flex flex-col bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden"
    >
      {/* Cover image */}
      <div className="relative h-44 w-full overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={restaurant.cover_image_url ?? restaurantCoverUrl(restaurant.name, 400, 220)}
          alt={restaurant.name}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>

      {/* Card body */}
      <div className="relative flex flex-col flex-1 p-5">
        {/* Overlapping logo badge */}
        <div className="absolute -top-6 left-5">
          {restaurant.logo_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={restaurant.logo_url}
              alt={`${restaurant.name} logo`}
              className="h-12 w-12 rounded-full ring-2 ring-white object-cover bg-white shadow"
            />
          ) : (
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#E8471E] text-base font-bold text-white ring-2 ring-white shadow">
              {initial}
            </div>
          )}
        </div>

        <div className="mt-6 flex items-center gap-2 flex-wrap">
          <h2 className="text-lg font-semibold text-[#1A1A2E] leading-snug group-hover:text-[#E8471E] transition-colors">
            {restaurant.name}
          </h2>
          {restaurant.cuisine_type && (
            <span className="inline-flex rounded-full bg-[#E8471E]/10 px-2 py-0.5 text-xs font-medium text-[#C93D18]">
              {restaurant.cuisine_type}
            </span>
          )}
        </div>

        {restaurant.description && (
          <p className="mt-1.5 text-sm text-gray-500 leading-relaxed line-clamp-2">
            {restaurant.description}
          </p>
        )}

        {restaurant.address && (
          <div className="mt-3 flex items-center gap-1 text-xs text-gray-400">
            <span>📍</span>
            <span className="truncate">{restaurant.address}</span>
          </div>
        )}

        {/* Order Now — revealed on hover */}
        <span className="mt-3 text-sm font-semibold text-[#E8471E] opacity-0 -translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-200">
          Order Now →
        </span>
      </div>
    </Link>
  )
}
