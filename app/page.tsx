import Link from 'next/link'
import Image from 'next/image'
import { MapPin, Star, Clock, Store, ShoppingBag, Truck } from 'lucide-react'
import LandingNav from '@/app/components/landing-nav'
import { localRestaurantBanner } from '@/lib/food-images'

const CUISINES = [
  { emoji: '🍚', label: 'Rice' },
  { emoji: '🍔', label: 'Burgers' },
  { emoji: '🍝', label: 'Pasta' },
  { emoji: '🥩', label: 'Grills' },
  { emoji: '🥤', label: 'Drinks' },
  { emoji: '🍱', label: 'Local' },
]

// The four real restaurants, so the homepage showcase links straight to each
// restaurant page. Banner photos come from localRestaurantBanner() (same source
// as the page banners), so a card always matches the top of its restaurant page.
const RESTAURANTS = [
  {
    id: 'a2000000-0000-0000-0000-000000000002',
    name: 'Spice Garden',
    img: '/icon-6.png',
    cuisine: 'Nigerian · Modern',
    rating: 4.8,
    reviews: 214,
    time: '30–40 min',
    promo: '20% OFF',
    initial: 'S',
    color: '#E8471E',
  },
  {
    id: 'a1000000-0000-0000-0000-000000000001',
    name: 'Burger Palace',
    img: '/icon-3.png',
    cuisine: 'Burgers & Fast Food',
    rating: 4.7,
    reviews: 540,
    time: '20–30 min',
    promo: 'Free delivery',
    initial: 'B',
    color: '#F5A623',
  },
  {
    id: 'e3000000-0000-0000-0000-000000000003',
    name: 'Grill House',
    img: '/icon-5.png',
    cuisine: 'Grills & BBQ',
    rating: 4.7,
    reviews: 186,
    time: '30–40 min',
    promo: null,
    initial: 'G',
    color: '#1A1A2E',
  },
  {
    id: 'e2000000-0000-0000-0000-000000000002',
    name: 'Mamas Kitchen',
    img: '/icon-4.png',
    cuisine: 'Home-style Nigerian',
    rating: 4.6,
    reviews: 132,
    time: '20–30 min',
    promo: null,
    initial: 'M',
    color: '#E8471E',
  },
]

const STATS = [
  { icon: '⭐', value: '4.8', label: 'Average Rating' },
  { icon: '🍔', value: '15,000+', label: 'Meals Ordered' },
  { icon: '🏪', value: '50+', label: 'Restaurant Partners' },
  { icon: '🚚', value: '30 min', label: 'Average Delivery' },
]

const STEPS = [
  {
    n: '1',
    icon: Store,
    title: 'Choose a restaurant',
    desc: 'Browse the best local restaurants near you and find your next favourite meal.',
  },
  {
    n: '2',
    icon: ShoppingBag,
    title: 'Pick your meals',
    desc: 'Add delicious dishes to your cart, customise your order and check out in seconds.',
  },
  {
    n: '3',
    icon: Truck,
    title: 'Get it delivered',
    desc: 'Track your order in real time — hot food delivered to your door in about 30 minutes.',
  },
]

const TRUST = [
  { icon: '⭐', text: '4.8 Rating' },
  { icon: '🍔', text: '15,000+ Meals' },
  { icon: '🚚', text: '30 min avg delivery' },
]

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#FAFAF8]">
      <LandingNav />

      {/* 2. Hero */}
      <section className="relative min-h-[calc(100vh-4rem)] w-full overflow-hidden">
        <Image
          src="/icon-2.png"
          alt="Warm restaurant interior with fairy lights"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(to bottom, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.80) 60%, rgba(0,0,0,0.90) 100%)',
          }}
        />

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 flex min-h-[calc(100vh-4rem)] items-center">
          <div className="max-w-2xl py-16">
            <h1 className="font-display font-extrabold text-white text-[36px] leading-[1.1] md:text-[56px]">
              Your Favourite Restaurants. Delivered Fast.
            </h1>
            <p className="mt-5 max-w-md text-lg text-white/80">
              Order from the best local restaurants in your city. Hot food at your door in 30
              minutes.
            </p>

            {/* Search bar */}
            <div className="mt-8 flex w-full max-w-lg flex-col gap-2 rounded-2xl bg-white/95 p-2 shadow-[0_4px_16px_rgba(0,0,0,0.12)] sm:flex-row sm:items-center sm:rounded-full">
              <div className="flex flex-1 items-center gap-2 px-3">
                <MapPin className="h-5 w-5 shrink-0 text-[#6B7280]" />
                <input
                  type="text"
                  placeholder="Enter your delivery location"
                  aria-label="Delivery location"
                  className="w-full bg-transparent py-2.5 text-sm text-[#1A1A2E] placeholder-[#6B7280] focus:outline-none"
                />
              </div>
              <Link
                href="/dashboard"
                className="rounded-full bg-[#E8471E] px-6 py-3 text-center text-sm font-semibold text-white hover:bg-[#C93D18] transition-colors"
              >
                Find Food
              </Link>
            </div>

            {/* Trust badges */}
            <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-sm font-medium text-white/90">
              {TRUST.map((t) => (
                <span key={t.text} className="flex items-center gap-1.5">
                  <span>{t.icon}</span>
                  {t.text}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 3. Popular Cuisines */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        <div className="flex gap-3 overflow-x-auto pb-2">
          {CUISINES.map((c) => (
            <Link
              key={c.label}
              href="/dashboard"
              className="group flex shrink-0 items-center gap-2 rounded-full border border-[#E5E7EB] bg-white px-5 py-2.5 text-sm font-semibold text-[#1A1A2E] shadow-sm transition hover:-translate-y-0.5 hover:shadow-[0_4px_16px_rgba(0,0,0,0.12)]"
            >
              <span className="text-lg">{c.emoji}</span>
              {c.label}
            </Link>
          ))}
        </div>
      </section>

      {/* 4. Featured Restaurants */}
      <section id="restaurants" className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <h2 className="font-display text-3xl font-bold text-[#1A1A2E]">Top Restaurants Near You</h2>
            <p className="mt-2 text-[#6B7280]">Hand-picked favourites, ready to deliver.</p>
          </div>
          <Link
            href="/dashboard"
            className="hidden sm:inline-block text-sm font-semibold text-[#E8471E] hover:text-[#C93D18] transition-colors"
          >
            View all →
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {RESTAURANTS.map((r) => (
            <Link
              key={r.name}
              href={`/restaurant/${r.id}`}
              className="group block rounded-xl bg-white shadow-[0_2px_8px_rgba(0,0,0,0.08)] transition-all hover:shadow-[0_4px_16px_rgba(0,0,0,0.12)] hover:scale-[1.01]"
            >
              {/* Banner */}
              <div className="relative h-[180px] w-full overflow-hidden rounded-t-xl">
                <Image
                  src={localRestaurantBanner(r.name) ?? r.img}
                  alt={`${r.name} restaurant interior`}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
                {r.promo && (
                  <span className="absolute left-3 top-3 rounded-full bg-[#F5A623] px-3 py-1 text-xs font-semibold text-[#1A1A2E]">
                    {r.promo}
                  </span>
                )}
                {/* Logo */}
                <div
                  className="absolute -bottom-5 left-4 flex h-10 w-10 items-center justify-center rounded-full border-2 border-white text-sm font-bold text-white shadow"
                  style={{ backgroundColor: r.color }}
                >
                  {r.initial}
                </div>
              </div>

              {/* Body */}
              <div className="p-5 pt-7">
                <h3 className="font-display text-base font-bold text-[#1A1A2E]">{r.name}</h3>
                <p className="mt-0.5 text-[13px] text-[#6B7280]">{r.cuisine}</p>
                <div className="mt-3 flex items-center gap-4 text-[13px]">
                  <span className="flex items-center gap-1 font-semibold text-[#1A1A2E]">
                    <Star className="h-4 w-4 fill-[#F5A623] text-[#F5A623]" />
                    {r.rating.toFixed(1)}
                    <span className="font-normal text-[#6B7280]">({r.reviews})</span>
                  </span>
                  <span className="flex items-center gap-1 text-[#6B7280]">
                    <Clock className="h-4 w-4" />
                    {r.time}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 5. Trust / Stats */}
      <section className="bg-[#1A1A2E]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {STATS.map((s) => (
              <div key={s.label} className="text-center">
                <div className="text-3xl">{s.icon}</div>
                <div className="mt-2 font-display text-3xl font-bold text-white">{s.value}</div>
                <div className="mt-1 text-sm text-white/70">{s.label}</div>
              </div>
            ))}
          </div>
          <p className="mt-8 text-center text-xs text-white/40">
            * Figures shown are for demonstration purposes
          </p>
        </div>
      </section>

      {/* 6. How It Works */}
      <section id="how-it-works" className="max-w-6xl mx-auto px-4 sm:px-6 py-16 md:py-24">
        <div className="mb-14 text-center">
          <h2 className="font-display text-3xl font-bold text-[#1A1A2E]">How It Works</h2>
          <p className="mt-2 text-[#6B7280]">Three simple steps to a great meal.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8">
          {STEPS.map((step) => (
            <div key={step.n} className="flex flex-col items-center text-center md:items-start md:text-left">
              <div className="flex items-center gap-4">
                <span className="font-display text-5xl font-extrabold text-[#E8471E]">{step.n}</span>
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#E8471E]/10 text-[#E8471E]">
                  <step.icon className="h-6 w-6" strokeWidth={2} />
                </span>
              </div>
              <h3 className="mt-5 font-display text-lg font-bold text-[#1A1A2E]">{step.title}</h3>
              <p className="mt-2 max-w-xs text-sm text-[#6B7280] leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 7. Become a Partner CTA */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-16 md:pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 items-stretch overflow-hidden rounded-2xl bg-white shadow-[0_2px_8px_rgba(0,0,0,0.08)]">
          <div className="p-8 md:p-12 flex flex-col justify-center">
            <span className="inline-flex w-fit rounded-full bg-[#E8471E]/10 px-3 py-1 text-xs font-semibold text-[#E8471E]">
              For Restaurants
            </span>
            <h2 className="mt-4 font-display text-3xl font-bold text-[#1A1A2E]">
              Grow Your Restaurant With DineFlow
            </h2>
            <p className="mt-3 text-[#6B7280] leading-relaxed max-w-md">
              Join 50+ restaurants already earning more with us. Reach thousands of hungry customers
              and manage everything from one simple dashboard.
            </p>
            <Link
              href="/partner"
              className="mt-8 inline-block w-fit rounded-lg bg-[#E8471E] px-6 py-3 text-sm font-semibold text-white hover:bg-[#C93D18] transition-colors"
            >
              Partner With Us
            </Link>
          </div>
          <div className="relative min-h-[260px] lg:min-h-[440px]">
            <Image
              src="/icon-1.png"
              alt="Busy outdoor restaurant terrace"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {/* 8. Footer */}
      <footer className="bg-[#1A1A2E] text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
            <div className="col-span-2 md:col-span-1">
              <span className="font-display text-xl font-bold tracking-tight text-[#E8471E]">DineFlow</span>
              <p className="mt-3 max-w-xs text-sm text-white/60 leading-relaxed">
                Your favourite local restaurants, delivered hot and fast across the city.
              </p>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-white mb-4">Company</h3>
              <ul className="space-y-2.5 text-sm text-white/60">
                <li><Link href="/#how-it-works" className="hover:text-[#F5A623] transition-colors">How It Works</Link></li>
                <li><Link href="/#restaurants" className="hover:text-[#F5A623] transition-colors">Restaurants</Link></li>
                <li><Link href="/partner" className="hover:text-[#F5A623] transition-colors">Become a Partner</Link></li>
                <li><Link href="/register" className="hover:text-[#F5A623] transition-colors">Sign Up</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-white mb-4">Cities</h3>
              <ul className="space-y-2.5 text-sm text-white/60">
                <li>PTI</li>
                <li>Ugbomoro</li>
                <li>Iterigbi</li>
                <li>Warri</li>
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-white mb-4">Contact</h3>
              <ul className="space-y-2.5 text-sm text-white/60">
                <li className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" /> Warri, Nigeria</li>
                <li>hello@dineflow.app</li>
                <li>+234 800 000 0000</li>
              </ul>
            </div>
          </div>

          <div className="mt-12 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-xs text-white/40">
              &copy; {new Date().getFullYear()} DineFlow. All rights reserved.
            </p>
            <p className="text-xs text-white/40">Made with ❤️ for food lovers</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
