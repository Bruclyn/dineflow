import Link from 'next/link'
import { ShoppingCart, MapPin, Star, Search, Store, Package } from 'lucide-react'
import LandingNav from '@/app/components/landing-nav'

const SOCIALS: { label: string; path: string }[] = [
  {
    label: 'Instagram',
    path: 'M12 2.16c3.2 0 3.58.01 4.85.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.06.41 2.23.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.16-1.06.36-2.23.41-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.25-2.23-.41a3.7 3.7 0 01-1.38-.9 3.7 3.7 0 01-.9-1.38c-.16-.42-.36-1.06-.41-2.23-.06-1.27-.07-1.65-.07-4.85s.01-3.58.07-4.85c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.06-.36 2.23-.41 1.27-.06 1.65-.07 4.85-.07zM12 6.35a5.65 5.65 0 100 11.3 5.65 5.65 0 000-11.3zm0 9.32a3.67 3.67 0 110-7.34 3.67 3.67 0 010 7.34zm5.88-9.54a1.32 1.32 0 11-2.64 0 1.32 1.32 0 012.64 0z',
  },
  {
    label: 'X',
    path: 'M18.9 1.15h3.68l-8.04 9.19L24 22.85h-7.41l-5.8-7.58-6.64 7.58H.47l8.6-9.83L0 1.15h7.6l5.24 6.93 6.06-6.93zm-1.29 19.5h2.04L6.49 3.24H4.3L17.61 20.65z',
  },
  {
    label: 'Facebook',
    path: 'M24 12.07C24 5.4 18.63 0 12 0S0 5.4 0 12.07C0 18.1 4.39 23.1 10.13 24v-8.44H7.08v-3.49h3.05V9.41c0-3.02 1.79-4.69 4.53-4.69 1.31 0 2.68.24 2.68.24v2.97h-1.51c-1.49 0-1.95.93-1.95 1.88v2.26h3.32l-.53 3.49h-2.79V24C19.61 23.1 24 18.1 24 12.07z',
  },
]

const STEPS = [
  {
    num: '01',
    icon: Search,
    title: 'Browse Restaurants',
    description: 'Explore local restaurants and their full menus in just a few seconds.',
  },
  {
    num: '02',
    icon: ShoppingCart,
    title: 'Add to Cart',
    description: 'Pick your favourite dishes and check out in a few simple taps.',
  },
  {
    num: '03',
    icon: Package,
    title: 'Track Your Order',
    description: 'Follow your order in real time, from the kitchen right to your door.',
  },
]

const WHY_FEATURES = [
  {
    icon: Store,
    title: 'Multiple Restaurants',
    description: 'Discover a growing selection of the best local spots, all in one place.',
  },
  {
    icon: ShoppingCart,
    title: 'Easy Ordering',
    description: 'A smooth cart and checkout that gets you fed in minutes, not hours.',
  },
  {
    icon: Package,
    title: 'Live Order Tracking',
    description: 'Watch your order progress in real time, every step of the way.',
  },
  {
    icon: Star,
    title: 'Verified Reviews',
    description: 'Real ratings from real diners to help you choose with confidence.',
  },
]

const TRUST = [
  { emoji: '🏪', label: '4 Restaurants' },
  { emoji: '🛒', label: 'Easy Ordering' },
  { emoji: '📦', label: 'Live Tracking' },
  { emoji: '⭐', label: 'Real Reviews' },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      <LandingNav />

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-orange-50 via-white to-orange-50/30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center min-h-[85vh] py-16">
            {/* Left — text */}
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-orange-100 px-3.5 py-1.5 text-xs font-semibold text-orange-700 mb-6">
                🏪 Lagos &amp; Abuja&apos;s Food Marketplace
              </span>

              <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-gray-900 leading-[1.05]">
                Delicious Food, Delivered to Your Doorstep
              </h1>

              <p className="mt-6 text-lg text-gray-500 max-w-md leading-relaxed">
                Discover the best local restaurants, explore their menus, and get your favourite
                meals in minutes.
              </p>

              <div className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <Link
                  href="/register"
                  className="text-center rounded-full bg-orange-500 px-8 py-4 text-sm font-semibold text-white hover:bg-orange-600 shadow-lg shadow-orange-200 transition-colors"
                >
                  Get Started
                </Link>
                <Link
                  href="/partner"
                  className="text-center rounded-full bg-gray-900 px-8 py-4 text-sm font-semibold text-white hover:bg-gray-800 shadow-lg transition-colors"
                >
                  Become a Partner
                </Link>
              </div>

              <div className="mt-10 flex flex-wrap gap-x-6 gap-y-3">
                {TRUST.map((item) => (
                  <div
                    key={item.label}
                    className="flex items-center gap-1.5 text-xs font-medium text-gray-500"
                  >
                    <span className="text-sm">{item.emoji}</span>
                    {item.label}
                  </div>
                ))}
              </div>
            </div>

            {/* Right — floating mockup cards */}
            <div className="relative h-[420px] hidden sm:block">
              {/* Card A: restaurant card */}
              <div className="absolute top-0 right-2 w-64 rounded-2xl bg-white shadow-xl p-4 -rotate-2">
                <div className="h-28 w-full rounded-xl bg-gradient-to-br from-orange-400 to-orange-600" />
                <div className="mt-3 flex items-center justify-between gap-2">
                  <p className="text-sm font-semibold text-gray-900">Spice Garden</p>
                  <span className="inline-flex items-center gap-0.5 rounded-full bg-orange-100 px-2 py-0.5 text-xs font-bold text-orange-600">
                    ⭐ 4.8
                  </span>
                </div>
                <span className="mt-2 inline-flex rounded-full bg-orange-50 px-2 py-0.5 text-[11px] font-medium text-orange-600">
                  Nigerian Cuisine
                </span>
              </div>

              {/* Card B: order status */}
              <div className="absolute bottom-6 left-0 w-60 rounded-2xl bg-white shadow-xl p-4 rotate-1">
                <p className="text-xs font-semibold text-gray-800">Order #D9DF · Preparing 🍳</p>
                <div className="mt-3 flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-orange-500 animate-pulse" />
                  <span className="h-2 w-2 rounded-full bg-orange-500" />
                  <span className="h-2 w-2 rounded-full bg-orange-200" />
                  <span className="h-2 w-2 rounded-full bg-orange-200" />
                </div>
              </div>

              {/* Card C: review chip */}
              <div className="absolute top-40 right-0 rounded-2xl bg-white shadow-xl px-4 py-3 rotate-0">
                <p className="text-xs font-semibold text-gray-700">
                  ⭐⭐⭐⭐⭐ <span className="ml-1">Amazing food!</span>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Decorative blobs */}
        <div className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-orange-200/40 blur-3xl" aria-hidden="true" />
        <div className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-amber-200/40 blur-3xl" aria-hidden="true" />
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="bg-white py-20 md:py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-gray-900">How DineFlow Works</h2>
            <p className="mt-3 text-gray-500">Order in three simple steps</p>
          </div>

          <div className="relative grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-6">
            {/* Dashed connector (desktop) */}
            <div
              className="hidden md:block absolute top-8 left-[16.66%] right-[16.66%] border-t-2 border-dashed border-orange-200"
              aria-hidden="true"
            />

            {STEPS.map((step) => (
              <div key={step.num} className="relative flex flex-col items-center text-center">
                <div className="relative z-10 flex h-16 w-16 items-center justify-center rounded-full bg-orange-100 text-lg font-bold text-orange-600 ring-4 ring-white">
                  {step.num}
                </div>
                <div className="mt-4 flex h-11 w-11 items-center justify-center rounded-full bg-orange-50 text-orange-500">
                  <step.icon className="h-5 w-5" strokeWidth={2} />
                </div>
                <h3 className="mt-4 text-lg font-medium text-gray-900">{step.title}</h3>
                <p className="mt-2 text-sm text-gray-500 leading-relaxed max-w-[240px]">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why DineFlow */}
      <section id="why" className="bg-orange-50 py-20 md:py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-[40%_60%] gap-12 lg:gap-16 items-center">
            {/* Left */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-orange-500">
                Why DineFlow
              </p>
              <h2 className="mt-3 text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
                Why thousands choose DineFlow
              </h2>
              <p className="mt-4 text-base text-gray-500 leading-relaxed max-w-md">
                We bring your city&apos;s best kitchens together in one warm, friendly app — so
                good food is always just a few taps away.
              </p>
              <Link
                href="/register"
                className="mt-8 inline-block rounded-full bg-orange-500 px-8 py-4 text-sm font-semibold text-white hover:bg-orange-600 shadow-lg shadow-orange-200/60 transition-colors"
              >
                Get Started
              </Link>
            </div>

            {/* Right — 2x2 grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {WHY_FEATURES.map((feature) => (
                <div
                  key={feature.title}
                  className="rounded-2xl bg-white shadow-sm p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-orange-100 text-orange-500 mb-4">
                    <feature.icon className="h-5 w-5" strokeWidth={2} />
                  </div>
                  <h3 className="text-base font-medium text-gray-900">{feature.title}</h3>
                  <p className="mt-1.5 text-sm text-gray-500 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 md:py-20">
        <div className="mx-4 md:mx-16 rounded-3xl bg-orange-500 overflow-hidden">
          <div className="px-6 sm:px-10 py-20 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            {/* Left */}
            <div className="text-center lg:text-left">
              <h2 className="text-3xl md:text-4xl font-bold text-white">Ready to order?</h2>
              <p className="mt-3 text-base text-orange-50 max-w-md mx-auto lg:mx-0">
                Join DineFlow today and get your favourite meals delivered in minutes.
              </p>
              <Link
                href="/register"
                className="mt-8 inline-block rounded-full bg-white px-8 py-4 text-sm font-semibold text-orange-600 hover:bg-orange-50 shadow-lg transition-colors"
              >
                Get Started
              </Link>
            </div>

            {/* Right — floating food illustration */}
            <div className="relative h-44 hidden lg:block">
              <div className="absolute top-0 left-12 flex h-24 w-24 items-center justify-center rounded-3xl bg-white/95 shadow-xl text-5xl rotate-6">
                🍲
              </div>
              <div className="absolute top-8 left-44 flex h-28 w-28 items-center justify-center rounded-3xl bg-white/95 shadow-xl text-6xl -rotate-3">
                🍔
              </div>
              <div className="absolute top-2 right-2 flex h-20 w-20 items-center justify-center rounded-3xl bg-white/95 shadow-xl text-4xl rotate-12">
                🥗
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
            {/* Brand */}
            <div className="col-span-2 md:col-span-1">
              <span className="text-xl font-bold text-orange-500 tracking-tight">DineFlow</span>
              <p className="mt-3 text-sm text-gray-400 leading-relaxed max-w-xs">
                Warm, friendly food delivery from your city&apos;s best local kitchens.
              </p>
              <div className="mt-5 flex items-center gap-3">
                {SOCIALS.map((social) => (
                  <span
                    key={social.label}
                    aria-label={social.label}
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-white/5 text-gray-300 hover:bg-orange-500 hover:text-white transition-colors"
                  >
                    <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" aria-hidden="true">
                      <path d={social.path} />
                    </svg>
                  </span>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-sm font-semibold text-white mb-4">Quick Links</h3>
              <ul className="space-y-2.5 text-sm text-gray-400">
                <li><Link href="/#how-it-works" className="hover:text-orange-400 transition-colors">How It Works</Link></li>
                <li><Link href="/#why" className="hover:text-orange-400 transition-colors">Why DineFlow</Link></li>
                <li><Link href="/register" className="hover:text-orange-400 transition-colors">Sign Up</Link></li>
                <li><Link href="/login" className="hover:text-orange-400 transition-colors">Log in</Link></li>
              </ul>
            </div>

            {/* For Restaurants */}
            <div>
              <h3 className="text-sm font-semibold text-white mb-4">For Restaurants</h3>
              <ul className="space-y-2.5 text-sm text-gray-400">
                <li><Link href="/partner" className="hover:text-orange-400 transition-colors">Become a Partner</Link></li>
                <li><Link href="/partner" className="hover:text-orange-400 transition-colors">Grow Your Business</Link></li>
                <li><Link href="/login" className="hover:text-orange-400 transition-colors">Partner Login</Link></li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h3 className="text-sm font-semibold text-white mb-4">Support</h3>
              <ul className="space-y-2.5 text-sm text-gray-400">
                <li className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" /> Lagos &amp; Abuja</li>
                <li>Help Center</li>
                <li>Contact Us</li>
                <li>Privacy &amp; Terms</li>
              </ul>
            </div>
          </div>

          <div className="mt-12 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-xs text-gray-500">
              &copy; {new Date().getFullYear()} DineFlow. All rights reserved.
            </p>
            <p className="text-xs text-gray-500">Made with ❤️ for food lovers</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
