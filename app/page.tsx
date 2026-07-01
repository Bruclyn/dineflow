import Link from 'next/link'
import {
  UtensilsCrossed,
  ShoppingCart,
  MapPin,
  Star,
  Search,
  Truck,
} from 'lucide-react'

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
    icon: UtensilsCrossed,
    title: 'Pick a restaurant',
    description: 'Browse our partner restaurants and find something you’re craving.',
  },
  {
    icon: ShoppingCart,
    title: 'Add to cart & checkout',
    description: 'Build your order, choose pickup or delivery, and check out securely.',
  },
  {
    icon: Truck,
    title: 'Track your order to your door',
    description: 'Watch your order move from the kitchen to your table in real time.',
  },
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
      <section className="relative overflow-hidden bg-gradient-to-br from-orange-50 via-orange-50 to-amber-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-24 sm:py-32 text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/80 border border-orange-100 px-3.5 py-1.5 text-xs font-semibold text-orange-600 mb-6 shadow-sm">
            <UtensilsCrossed className="h-3.5 w-3.5" />
            Now serving your city
          </span>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-gray-900 max-w-3xl mx-auto leading-tight">
            Order from the best restaurants near you
          </h1>

          <p className="mt-6 text-base sm:text-lg text-gray-600 max-w-xl mx-auto leading-relaxed">
            DineFlow connects you with your favourite local restaurants — browse menus, order in
            seconds, and track every step until it arrives.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/register"
              className="w-full sm:w-auto rounded-xl bg-orange-500 px-8 py-3.5 text-sm font-bold text-white hover:bg-orange-600 shadow-sm shadow-orange-200 transition-colors"
            >
              Get Started
            </Link>
            <Link
              href="/login"
              className="w-full sm:w-auto rounded-xl border-2 border-orange-200 bg-white/70 px-8 py-3.5 text-sm font-bold text-orange-600 hover:bg-white hover:border-orange-300 transition-colors"
            >
              Browse Restaurants
            </Link>
          </div>
        </div>

        {/* Decorative gradient blobs */}
        <div className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-orange-200/40 blur-3xl" aria-hidden="true" />
        <div className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-amber-200/40 blur-3xl" aria-hidden="true" />
      </section>

      {/* Features */}
      <section id="features" className="max-w-6xl mx-auto px-4 sm:px-6 py-20 sm:py-28">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900">Everything you need to eat well</h2>
          <p className="mt-3 text-sm sm:text-base text-gray-500">
            A smoother way to discover, order, and enjoy food from restaurants you love.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {FEATURES.map((feature) => (
            <div
              key={feature.title}
              className="rounded-2xl border border-gray-100 bg-white shadow-sm p-6 hover:shadow-md transition-shadow"
            >
              <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-orange-50 text-orange-500 mb-4">
                <feature.icon className="h-5 w-5" strokeWidth={2} />
              </div>
              <h3 className="text-sm font-bold text-gray-900">{feature.title}</h3>
              <p className="mt-1.5 text-sm text-gray-500 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="bg-gray-50 border-y border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-20 sm:py-28">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900">How It Works</h2>
            <p className="mt-3 text-sm sm:text-base text-gray-500">
              From craving to doorstep in three simple steps.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-6">
            {STEPS.map((step, idx) => (
              <div key={step.title} className="relative text-center sm:text-left">
                <div className="flex items-center gap-3 sm:flex-col sm:items-start">
                  <div className="shrink-0 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-500 text-white font-bold text-lg shadow-sm shadow-orange-200">
                    {idx + 1}
                  </div>
                  <div className="sm:mt-5 flex items-center gap-2 sm:hidden">
                    <step.icon className="h-4 w-4 text-orange-500" />
                  </div>
                </div>
                <div className="mt-4 sm:mt-5">
                  <div className="hidden sm:flex items-center gap-2 mb-2">
                    <step.icon className="h-4 w-4 text-orange-500" />
                  </div>
                  <h3 className="text-sm font-bold text-gray-900">{step.title}</h3>
                  <p className="mt-1.5 text-sm text-gray-500 leading-relaxed">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-orange-500">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16 sm:py-20 text-center">
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white">Ready to order?</h2>
          <p className="mt-3 text-sm sm:text-base text-orange-100 max-w-lg mx-auto">
            Join DineFlow today and get your favourite meals delivered in minutes.
          </p>
          <div className="mt-8">
            <Link
              href="/register"
              className="inline-block rounded-xl bg-white px-8 py-3.5 text-sm font-bold text-orange-600 hover:bg-orange-50 shadow-sm transition-colors"
            >
              Get Started
            </Link>
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
