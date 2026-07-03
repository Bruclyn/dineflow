import Link from 'next/link'
import {
  ShoppingCart,
  MapPin,
  Star,
  Search,
  Store,
  Package,
  Zap,
} from 'lucide-react'
import { foodImageUrl } from '@/lib/food-images'

const FEATURES = [
  {
    icon: Search,
    title: 'Browse Restaurants',
    description: 'Discover partner restaurants near you and explore their full menus in seconds.',
  },
  {
    icon: ShoppingCart,
    title: 'Easy Ordering',
    description: 'Add your favourites to cart and check out in just a few taps — pickup or delivery.',
  },
  {
    icon: MapPin,
    title: 'Track Your Order',
    description: 'Follow your order in real time, from confirmation to it reaching your door.',
  },
  {
    icon: Star,
    title: 'Rate & Review',
    description: 'Share your experience and help others find the best meals in town.',
  },
]

const STEPS = [
  {
    icon: Store,
    title: 'Browse Restaurants',
    description: 'Explore local restaurants and their menus',
  },
  {
    icon: ShoppingCart,
    title: 'Add to Cart & Checkout',
    description: 'Pick your dishes and check out in seconds',
  },
  {
    icon: Package,
    title: 'Track Your Order',
    description: 'Follow your order from preparing to completed',
  },
]

const TRUST_INDICATORS = [
  { icon: Store, label: 'Multiple Restaurants' },
  { icon: ShoppingCart, label: 'Easy Ordering' },
  { icon: Package, label: 'Live Order Status' },
  { icon: Zap, label: 'Fast Checkout' },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <header className="sticky top-0 z-20 bg-white/80 backdrop-blur-sm border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <span className="text-xl font-bold text-orange-500 tracking-tight">DineFlow</span>

          <nav className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm font-medium text-gray-600 hover:text-orange-500 transition-colors">
              Features
            </a>
            <a href="#how-it-works" className="text-sm font-medium text-gray-600 hover:text-orange-500 transition-colors">
              How It Works
            </a>
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              href="/login"
              className="text-sm font-semibold text-gray-700 hover:text-orange-500 transition-colors px-3 py-2"
            >
              Log in
            </Link>
            <Link
              href="/register"
              className="rounded-lg bg-orange-500 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-600 transition-colors"
            >
              Sign up
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-orange-50 to-orange-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-20 sm:py-28">
          <div className="grid grid-cols-1 lg:grid-cols-[55%_45%] gap-14 lg:gap-8 items-center">
            {/* Left column */}
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-orange-100 px-3.5 py-1.5 text-xs font-semibold text-orange-700 mb-6">
                🏪 Multi-Restaurant Marketplace
              </span>

              <h1 className="text-5xl font-bold tracking-tight text-gray-900 leading-tight">
                Delicious Food, Delivered to Your Doorstep
              </h1>

              <p className="mt-6 text-lg text-gray-600 max-w-md leading-relaxed">
                Discover local restaurants, explore their menus, and get your favourite meals in minutes.
              </p>

              <div className="mt-8 flex flex-col sm:flex-row items-start sm:items-center gap-3">
                <Link
                  href="/register"
                  className="w-full sm:w-auto text-center rounded-full bg-orange-500 px-8 py-3 text-sm font-bold text-white hover:bg-orange-600 shadow-lg shadow-orange-200 transition-colors"
                >
                  Get Started
                </Link>
                <Link
                  href="/login"
                  className="w-full sm:w-auto text-center rounded-full border-2 border-orange-500 bg-white px-8 py-3 text-sm font-bold text-orange-500 hover:bg-orange-50 transition-colors"
                >
                  Browse Restaurants
                </Link>
              </div>

              <div className="mt-10 flex flex-wrap gap-x-6 gap-y-3">
                {TRUST_INDICATORS.map((item) => (
                  <div key={item.label} className="flex items-center gap-1.5 text-xs font-medium text-gray-500">
                    <item.icon className="h-4 w-4 text-orange-500" strokeWidth={2} />
                    {item.label}
                  </div>
                ))}
              </div>
            </div>

            {/* Right column — floating UI mockup cards */}
            <div className="relative h-[380px] sm:h-[420px] hidden sm:block">
              {/* Card A: sample restaurant card */}
              <div className="absolute top-0 right-0 w-64 rounded-2xl bg-white shadow-xl overflow-hidden rotate-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={foodImageUrl('rice', 320, 160)}
                  alt=""
                  className="h-32 w-full object-cover"
                />
                <div className="p-3.5">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-bold text-gray-900">Spice Garden</p>
                    <span className="inline-flex items-center gap-0.5 rounded-full bg-orange-100 px-2 py-0.5 text-xs font-bold text-orange-600">
                      <Star className="h-3 w-3 fill-orange-500 text-orange-500" />
                      4.8
                    </span>
                  </div>
                  <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-gray-100 px-2 py-0.5 text-[11px] font-medium text-gray-500">
                    20–30 min
                  </span>
                </div>
              </div>

              {/* Card B: order status card */}
              <div className="absolute bottom-4 left-0 w-56 rounded-2xl bg-white shadow-xl p-4 -rotate-3">
                <p className="text-xs font-semibold text-gray-800 mb-3">Preparing your order…</p>
                <div className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-orange-500 animate-pulse" />
                  <span className="h-2 w-2 rounded-full bg-orange-200" />
                  <span className="h-2 w-2 rounded-full bg-orange-200" />
                  <span className="h-2 w-2 rounded-full bg-orange-200" />
                </div>
              </div>

              {/* Card C: review chip */}
              <div className="absolute top-24 left-2 w-48 rounded-2xl bg-white shadow-xl p-3.5 rotate-3">
                <div className="flex items-center gap-0.5">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} className="h-3.5 w-3.5 fill-orange-500 text-orange-500" />
                  ))}
                </div>
                <p className="mt-1.5 text-xs font-medium text-gray-700">&ldquo;Great food, fast!&rdquo;</p>
              </div>
            </div>
          </div>
        </div>

        {/* Decorative gradient blobs */}
        <div className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-orange-200/40 blur-3xl" aria-hidden="true" />
        <div className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-amber-200/40 blur-3xl" aria-hidden="true" />
      </section>

      {/* Features */}
      <section id="features" className="max-w-6xl mx-auto px-4 sm:px-6 py-20 sm:py-28">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">Everything you need to eat well</h2>
          <p className="mt-3 text-sm sm:text-base text-gray-500">
            A smoother way to discover, order, and enjoy food from restaurants you love.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {FEATURES.map((feature) => (
            <div
              key={feature.title}
              className="rounded-2xl border border-gray-100 bg-white shadow-sm p-6 hover:shadow-lg transition-shadow"
            >
              <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-orange-100 text-orange-500 mb-4">
                <feature.icon className="h-5 w-5" strokeWidth={2} />
              </div>
              <h3 className="text-sm font-bold text-gray-900">{feature.title}</h3>
              <p className="mt-1.5 text-sm text-gray-500 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="bg-orange-50 border-y border-orange-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-20 sm:py-28">
          <h2 className="text-center text-3xl font-bold text-gray-900 mb-16">How DineFlow Works</h2>

          <div className="relative grid grid-cols-1 sm:grid-cols-3 gap-10 sm:gap-6">
            {/* Dashed connector line (desktop only) */}
            <div
              className="hidden sm:block absolute top-8 left-[16.66%] right-[16.66%] border-t-2 border-dashed border-orange-300"
              aria-hidden="true"
            />

            {STEPS.map((step, idx) => (
              <div key={step.title} className="relative flex flex-col items-center text-center">
                <div className="relative z-10 flex h-16 w-16 items-center justify-center rounded-full bg-orange-100 border-4 border-orange-50">
                  <step.icon className="h-7 w-7 text-orange-500" strokeWidth={2} />
                </div>
                <span className="mt-4 inline-flex h-6 w-6 items-center justify-center rounded-full bg-orange-500 text-xs font-bold text-white">
                  {idx + 1}
                </span>
                <h3 className="mt-3 text-base font-bold text-gray-900">{step.title}</h3>
                <p className="mt-1.5 text-sm text-gray-500 leading-relaxed max-w-[220px]">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-orange-500 overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            {/* Left: headline + CTA */}
            <div className="text-center lg:text-left">
              <h2 className="text-3xl sm:text-4xl font-bold text-white">Ready to order?</h2>
              <p className="mt-3 text-sm sm:text-base text-orange-100 max-w-md mx-auto lg:mx-0">
                Join DineFlow today and get your favourite meals delivered in minutes.
              </p>
              <div className="mt-8">
                <Link
                  href="/register"
                  className="inline-block rounded-full bg-white px-8 py-3.5 text-sm font-bold text-orange-600 hover:bg-orange-50 shadow-lg transition-colors"
                >
                  Get Started
                </Link>
              </div>
            </div>

            {/* Right: floating illustrative cards */}
            <div className="relative h-48 hidden lg:block">
              <div className="absolute top-0 left-10 flex h-24 w-24 items-center justify-center rounded-2xl bg-white shadow-xl text-4xl rotate-6">
                🍜
              </div>
              <div className="absolute top-8 left-40 flex h-28 w-28 items-center justify-center rounded-2xl bg-white shadow-xl text-5xl -rotate-3">
                🍔
              </div>
              <div className="absolute top-2 right-0 flex h-20 w-20 items-center justify-center rounded-2xl bg-white shadow-xl text-3xl rotate-12">
                🥗
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="text-lg font-bold text-orange-500 tracking-tight">DineFlow</span>

            <nav className="flex items-center gap-6">
              <a href="#features" className="text-xs font-medium text-gray-500 hover:text-orange-500 transition-colors">
                Features
              </a>
              <a href="#how-it-works" className="text-xs font-medium text-gray-500 hover:text-orange-500 transition-colors">
                How It Works
              </a>
              <Link href="/login" className="text-xs font-medium text-gray-500 hover:text-orange-500 transition-colors">
                Log in
              </Link>
              <Link href="/register" className="text-xs font-medium text-gray-500 hover:text-orange-500 transition-colors">
                Sign up
              </Link>
            </nav>
          </div>
          <p className="mt-6 text-center sm:text-left text-xs text-gray-400">
            &copy; {new Date().getFullYear()} DineFlow. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}
