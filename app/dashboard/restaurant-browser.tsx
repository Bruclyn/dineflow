'use client'

import { useState } from 'react'
import Link from 'next/link'
import type { Restaurant } from './page'

export default function RestaurantBrowser({ restaurants }: { restaurants: Restaurant[] }) {
  const [query, setQuery] = useState('')

  const filtered =
    query.trim().length > 0
      ? restaurants.filter((r) =>
          r.name.toLowerCase().includes(query.trim().toLowerCase())
        )
      : restaurants

  return (
    <div className="space-y-6">
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
  return (
    <Link
      href={`/restaurant/${restaurant.id}`}
      className="group flex flex-col bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow"
    >
      {/* Cover / placeholder */}
      <div className="relative h-36 w-full bg-gradient-to-br from-orange-100 to-orange-50 overflow-hidden">
        {restaurant.cover_image_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={restaurant.cover_image_url}
            alt={restaurant.name}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 text-orange-200"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2 9m5-9v9m4-9v9m5-9l2 9"
              />
            </svg>
          </div>
        )}

        {/* Logo badge */}
        {restaurant.logo_url && (
          <div className="absolute bottom-2 left-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={restaurant.logo_url}
              alt={`${restaurant.name} logo`}
              className="h-10 w-10 rounded-lg border-2 border-white shadow object-cover bg-white"
            />
          </div>
        )}
      </div>

      {/* Card body */}
      <div className="flex flex-col flex-1 gap-2 p-4">
        <h2 className="text-sm font-semibold text-gray-900 leading-snug group-hover:text-orange-500 transition-colors">
          {restaurant.name}
        </h2>

        {restaurant.description && (
          <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">
            {restaurant.description}
          </p>
        )}

        {restaurant.address && (
          <div className="mt-auto flex items-center gap-1.5 text-xs text-gray-400 pt-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-3.5 w-3.5 shrink-0"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                clipRule="evenodd"
              />
            </svg>
            <span className="truncate">{restaurant.address}</span>
          </div>
        )}
      </div>
    </Link>
  )
}
