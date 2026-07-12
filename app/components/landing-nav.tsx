'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'

const LINKS = [
  { label: 'Home', href: '/' },
  { label: 'Restaurants', href: '/#restaurants' },
  { label: 'How It Works', href: '/#how-it-works' },
  { label: 'Become a Partner', href: '/partner' },
]

export default function LandingNav() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
    <header
      className={`sticky top-0 z-50 border-b border-[#E5E7EB] bg-white/80 backdrop-blur-md transition-shadow ${
        scrolled ? 'shadow-sm' : ''
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        <Link href="/" className="font-display text-xl font-bold tracking-tight text-[#E8471E]">
          DineFlow
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-sm font-medium text-[#1A1A2E] hover:text-[#E8471E] transition-colors"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/login"
            className="rounded-lg border border-[#E8471E] px-5 py-2 text-sm font-semibold text-[#E8471E] hover:bg-[#E8471E] hover:text-white transition-colors"
          >
            Sign In
          </Link>
          <Link
            href="/register"
            className="rounded-lg bg-[#E8471E] px-5 py-2 text-sm font-semibold text-white hover:bg-[#C93D18] transition-colors"
          >
            Order Now
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setOpen(true)}
          className="md:hidden flex h-10 w-10 items-center justify-center rounded-lg text-[#1A1A2E] hover:bg-black/5 transition-colors"
          aria-label="Open menu"
        >
          <Menu className="h-6 w-6" />
        </button>
      </div>
    </header>

    {/* Mobile full-screen overlay — rendered OUTSIDE the blurred header so
        position:fixed anchors to the viewport, not the header's containing block */}
    {open && (
      <div
        className="fixed inset-0 z-[9999] flex h-screen w-full flex-col overflow-y-auto bg-white md:hidden"
        style={{ boxShadow: '0 4px 16px rgba(0,0,0,0.15)' }}
      >
        {/* Top: logo + close */}
        <div className="flex h-16 shrink-0 items-center justify-between border-b border-[#E5E7EB] px-4 sm:px-6">
          <span className="font-display text-xl font-bold tracking-tight text-[#E8471E]">DineFlow</span>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="flex h-10 w-10 items-center justify-center rounded-lg text-[#1A1A2E] hover:bg-black/5 transition-colors"
            aria-label="Close menu"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Center: links */}
        <nav className="flex flex-1 flex-col items-center justify-center gap-2 px-6">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="rounded-lg px-4 py-3 text-lg font-semibold text-[#1A1A2E] hover:text-[#E8471E] transition-colors"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        {/* Bottom: auth buttons */}
        <div className="flex shrink-0 flex-col gap-3 px-6 pb-10">
          <Link
            href="/login"
            onClick={() => setOpen(false)}
            className="rounded-lg border border-[#E8471E] px-5 py-3 text-center text-sm font-semibold text-[#E8471E] hover:bg-[#E8471E] hover:text-white transition-colors"
          >
            Sign In
          </Link>
          <Link
            href="/register"
            onClick={() => setOpen(false)}
            className="rounded-lg bg-[#E8471E] px-5 py-3 text-center text-sm font-semibold text-white hover:bg-[#C93D18] transition-colors"
          >
            Order Now
          </Link>
        </div>
      </div>
    )}
    </>
  )
}
