'use client'

import { useState } from 'react'
import Link from 'next/link'
import type { Restaurant } from './page'
import { foodImageUrl } from '@/lib/food-images'

const ALL = 'All'

export default function RestaurantBrowser({ restaurants }: { restaurants: Restaurant[] }) {
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
    <div className="space-y-6">
      {/* Category filter pills */}
      {categories.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {[ALL, ...categories].map((cat) => {
            const active = category === cat
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setCategory(cat)}
                className={
                  active
                    ? 'rounded-full bg-orange-500 px-4 py-1.5 text-sm font-medium text-white shadow-sm transition'
                    : 'rounded-full border border-gray-200 bg-white px-4 py-1.5 text-sm font-medium text-gray-600 transition hover:bg-orange-100'
                }
              >
                {cat}
              </button>
            )
          })}
        </div>
      )}

      {/* Search bar */}
      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 text-gray-400"
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
          className="w-full max-w-sm rounded-xl border border-gray-200 bg-white py-2.5 pl-10 pr-4 text-sm text-gray-900 placeholder-gray-400 shadow-sm outline-none ring-0 transition focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
        />
      </div>

      {/* Grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((r) => (
            <RestaurantCard key={r.id} restaurant={r} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-orange-50">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-orange-400"
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
    </div>
  )
}

function RestaurantCard({ restaurant }: { restaurant: Restaurant }) {
  const initial = restaurant.name.charAt(0).toUpperCase()

  return (
    <Link
      href={`/restaurant/${restaurant.id}`}
      className="group flex flex-col bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-200"
    >
      {/* Cover image */}
      <div className="relative h-40 w-full overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={restaurant.cover_image_url ?? foodImageUrl('restaurant', 400, 200)}
          alt={restaurant.name}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />

        {/* "Order Now" reveal pill */}
        <span className="absolute top-3 right-3 rounded-full bg-orange-500 px-3 py-1 text-xs font-bold text-white shadow-lg opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-200">
          Order Now →
        </span>

        {/* Logo badge */}
        <div className="absolute -bottom-4 left-3">
          {restaurant.logo_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={restaurant.logo_url}
              alt={`${restaurant.name} logo`}
              className="h-11 w-11 rounded-full ring-2 ring-white object-cover bg-white shadow"
            />
          ) : (
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-orange-500 text-base font-bold text-white ring-2 ring-white shadow">
              {initial}
            </div>
          )}
        </div>
      </div>

      {/* Card body */}
      <div className="flex flex-col flex-1 gap-1.5 p-4 pt-6">
        <h2 className="text-lg font-semibold text-gray-900 leading-snug group-hover:text-orange-500 transition-colors">
          {restaurant.name}
        </h2>

        {restaurant.description && (
          <p className="text-sm text-gray-500 leading-relaxed line-clamp-2">
            {restaurant.description}
          </p>
        )}

        {restaurant.address && (
          <div className="mt-auto flex items-center gap-1.5 text-xs text-gray-400 pt-2">
            <span>📍</span>
            <span className="truncate">{restaurant.address}</span>
          </div>
        )}
      </div>
    </Link>
  )
}
