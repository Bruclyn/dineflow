import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, Star, Clock } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import AddToCartButton from './add-to-cart-button'
import MenuTabs from './menu-tabs'
import CartNavIcon from '@/app/components/cart-nav-icon'
import UserMenu from '@/app/components/user-menu'
import { restaurantCoverUrl, localFoodImage } from '@/lib/food-images'
import { parseTags } from '@/lib/menu-tags'

type Restaurant = {
  id: string
  name: string
  description: string | null
  address: string | null
  phone: string | null
  email: string | null
  logo_url: string | null
  cover_image_url: string | null
  cuisine_type: string | null
}

type Category = {
  id: string
  name: string
  display_order: number
}

type MenuItem = {
  id: string
  name: string
  description: string | null
  price: number
  image_url: string | null
  tags: string | null
  prep_time_mins: number | null
  categories: Category | null
}

type Review = {
  id: string
  rating: number
  comment: string | null
  created_at: string
}

const DELIVERY_TIMES = ['20–30 min', '25–35 min', '30–40 min']

export default async function RestaurantPage({
  params,
}: {
  params: { id: string }
}) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const [{ data: restaurant }, { data: menuItems }, { data: reviews }] =
    await Promise.all([
      supabase
        .from('restaurants')
        .select('id, name, description, address, phone, email, logo_url, cover_image_url, cuisine_type')
        .eq('id', params.id)
        .single<Restaurant>(),
      supabase
        .from('menu_items')
        .select('id, name, description, price, image_url, tags, prep_time_mins, categories(id, name, display_order)')
        .eq('restaurant_id', params.id)
        .eq('is_available', true)
        .order('name', { ascending: true }),
      supabase
        .from('reviews')
        .select('id, rating, comment, created_at')
        .eq('restaurant_id', params.id)
        .order('created_at', { ascending: false })
        .limit(20),
    ])

  if (!restaurant) notFound()

  const initial = (user.user_metadata?.full_name?.[0] ?? user.email?.[0] ?? 'U').toUpperCase()

  const items = (menuItems ?? []) as unknown as MenuItem[]
  const reviewList = (reviews ?? []) as Review[]

  const avgRating =
    reviewList.length > 0
      ? reviewList.reduce((sum, r) => sum + r.rating, 0) / reviewList.length
      : null

  const deliveryTime =
    DELIVERY_TIMES[
      restaurant.id.split('').reduce((a, c) => a + c.charCodeAt(0), 0) % DELIVERY_TIMES.length
    ]

  // Build a lookup of category display_order so we can sort headings correctly
  const categoryOrder: Record<string, number> = {}
  const grouped = items.reduce<Record<string, MenuItem[]>>((acc, item) => {
    const cat = item.categories?.name ?? 'Other'
    const order = item.categories?.display_order ?? 9999
    acc[cat] = acc[cat] ?? []
    acc[cat].push(item)
    categoryOrder[cat] = Math.min(categoryOrder[cat] ?? 9999, order)
    return acc
  }, {})

  const categories = Object.keys(grouped).sort(
    (a, b) => (categoryOrder[a] ?? 9999) - (categoryOrder[b] ?? 9999)
  )

  const tabs = categories.map((name, i) => ({ name, id: `menu-cat-${i}` }))

  return (
    <div className="min-h-screen bg-[#FAFAF8]">
      {/* Navbar */}
      <nav className="bg-white border-b border-[#E5E7EB] sticky top-0 z-30 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <Link
            href="/dashboard"
            className="flex items-center gap-1.5 text-sm font-medium text-[#6B7280] hover:text-[#E8471E] transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Link>
          <span className="font-display text-xl font-bold tracking-tight text-[#E8471E]">DineFlow</span>
          <div className="flex items-center gap-3">
            <CartNavIcon />
            <UserMenu initial={initial} />
          </div>
        </div>
      </nav>

      {/* Banner — 300px, full-width */}
      <div className="relative h-[300px] w-full overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={restaurant.cover_image_url ?? restaurantCoverUrl(restaurant.name, 1600, 600)}
          alt={restaurant.name}
          className="h-full w-full object-cover"
        />
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Identity — below banner, logo overlapping bottom-left */}
        <div className="relative -mt-8 mb-8">
          <div className="h-16 w-16 shrink-0 overflow-hidden rounded-full border-4 border-white bg-white shadow-lg">
            {restaurant.logo_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={restaurant.logo_url}
                alt={`${restaurant.name} logo`}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-[#E8471E]">
                <span className="text-2xl font-bold text-white">{restaurant.name.charAt(0)}</span>
              </div>
            )}
          </div>

          <h1 className="mt-3 font-display text-2xl md:text-[28px] font-bold text-[#1A1A2E]">
            {restaurant.name}
          </h1>

          <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-[#6B7280]">
            {restaurant.cuisine_type && <span>{restaurant.cuisine_type}</span>}
            {restaurant.cuisine_type && <span className="text-[#E5E7EB]">•</span>}
            {avgRating !== null ? (
              <span className="flex items-center gap-1 font-semibold text-[#1A1A2E]">
                <Star className="h-4 w-4 fill-[#F5A623] text-[#F5A623]" />
                {avgRating.toFixed(1)}
                <span className="font-normal text-[#6B7280]">({reviewList.length})</span>
              </span>
            ) : (
              <span className="flex items-center gap-1 text-[#6B7280]">
                <Star className="h-4 w-4 text-[#E5E7EB]" />
                New
              </span>
            )}
            <span className="text-[#E5E7EB]">•</span>
            <span className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {deliveryTime}
            </span>
          </div>

          {restaurant.description && (
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[#6B7280]">
              {restaurant.description}
            </p>
          )}

          {(restaurant.phone || restaurant.email) && (
            <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5">
              {restaurant.phone && (
                <a
                  href={`tel:${restaurant.phone}`}
                  className="flex items-center gap-1.5 text-xs font-medium text-[#E8471E] hover:text-[#C93D18] transition-colors"
                >
                  <span>📞</span>
                  {restaurant.phone}
                </a>
              )}
              {restaurant.email && (
                <a
                  href={`mailto:${restaurant.email}`}
                  className="flex items-center gap-1.5 text-xs font-medium text-[#E8471E] hover:text-[#C93D18] transition-colors"
                >
                  <span>✉️</span>
                  {restaurant.email}
                </a>
              )}
            </div>
          )}
        </div>

        {/* Menu */}
        {categories.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <p className="text-sm font-medium text-[#6B7280]">No menu items yet</p>
            <p className="text-xs text-[#6B7280]/70 mt-1">
              This restaurant hasn&apos;t added any items yet. Check back soon.
            </p>
          </div>
        ) : (
          <>
            <MenuTabs tabs={tabs} />
            <div className="space-y-10 mt-6 mb-10">
              {tabs.map((tab) => (
                <section key={tab.id} id={tab.id} className="scroll-mt-32">
                  <h2 className="font-display text-lg font-bold text-[#1A1A2E] mb-4">{tab.name}</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {grouped[tab.name].map((item) => (
                      <MenuItemCard
                        key={item.id}
                        item={item}
                        restaurantId={restaurant.id}
                        restaurantName={restaurant.name}
                      />
                    ))}
                  </div>
                </section>
              ))}
            </div>
          </>
        )}

        {/* Reviews */}
        <section className="pb-16">
          <h2 className="font-display text-base font-bold text-[#1A1A2E] mb-4 pb-2 border-b border-[#E5E7EB]">
            Reviews{reviewList.length > 0 && ` (${reviewList.length})`}
          </h2>

          {reviewList.length === 0 ? (
            <div className="rounded-xl bg-white shadow-[0_2px_8px_rgba(0,0,0,0.08)] px-6 py-10 text-center">
              <p className="text-sm font-medium text-[#6B7280]">No reviews yet</p>
              <p className="text-xs text-[#6B7280]/70 mt-1">Be the first to share your experience!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {reviewList.map((review) => (
                <div key={review.id} className="rounded-xl bg-white shadow-[0_2px_8px_rgba(0,0,0,0.08)] p-5">
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <StarRow rating={review.rating} />
                    <span className="shrink-0 text-xs text-[#6B7280]">
                      {new Date(review.created_at).toLocaleDateString('en-NG', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </span>
                  </div>
                  {review.comment && (
                    <p className="text-sm text-[#1A1A2E]/80 leading-relaxed">{review.comment}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  )
}

function MenuItemCard({
  item,
  restaurantId,
  restaurantName,
}: {
  item: MenuItem
  restaurantId: string
  restaurantName: string
}) {
  const tags = parseTags(item.tags)

  return (
    <div className="flex gap-4 rounded-xl bg-white p-4 shadow-[0_2px_8px_rgba(0,0,0,0.08)] transition-shadow hover:shadow-[0_4px_16px_rgba(0,0,0,0.12)]">
      {item.image_url ? (
        /* Real uploaded image (remote) — plain img avoids next.config remotePatterns */
        /* eslint-disable-next-line @next/next/no-img-element */
        <img
          src={item.image_url}
          alt={item.name}
          className="h-[100px] w-[100px] shrink-0 rounded-lg object-cover"
        />
      ) : (
        <Image
          src={localFoodImage(item.name)}
          alt={item.name}
          width={100}
          height={100}
          className="h-[100px] w-[100px] shrink-0 rounded-lg object-cover"
        />
      )}

      <div className="flex flex-1 flex-col min-w-0">
        <h3 className="font-display text-[15px] font-semibold text-[#1A1A2E]">{item.name}</h3>

        {(tags.length > 0 || item.prep_time_mins != null) && (
          <div className="mt-1 flex flex-wrap items-center gap-1">
            {item.prep_time_mins != null && (
              <span className="inline-flex items-center rounded-full bg-[#F3F4F6] px-2 py-0.5 text-[11px] font-semibold text-[#6B7280]">
                ⏱ {item.prep_time_mins} mins
              </span>
            )}
            {tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex rounded-full bg-[#E8471E]/10 px-2 py-0.5 text-[11px] font-medium text-[#E8471E]"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {item.description && (
          <p className="mt-1 text-[13px] leading-relaxed text-[#6B7280] line-clamp-2">
            {item.description}
          </p>
        )}

        <div className="mt-auto flex items-center justify-between pt-3">
          <span className="text-base font-bold text-[#E8471E]">
            ₦{item.price.toLocaleString('en-NG')}
          </span>
          <AddToCartButton
            item={{
              menu_item_id: item.id,
              name: item.name,
              price: item.price,
              restaurant_id: restaurantId,
              restaurant_name: restaurantName,
            }}
          />
        </div>
      </div>
    </div>
  )
}

function StarRow({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => {
        const filled = rating >= star
        const half = !filled && rating >= star - 0.5
        return (
          <svg
            key={star}
            xmlns="http://www.w3.org/2000/svg"
            className={`h-3.5 w-3.5 ${filled || half ? 'text-[#F5A623]' : 'text-[#E5E7EB]'}`}
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.96a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.37 2.448a1 1 0 00-.364 1.118l1.286 3.96c.3.921-.755 1.688-1.54 1.118l-3.37-2.448a1 1 0 00-1.175 0l-3.37 2.448c-.784.57-1.838-.197-1.539-1.118l1.285-3.96a1 1 0 00-.364-1.118L2.05 9.387c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69l1.286-3.96z" />
          </svg>
        )
      })}
    </div>
  )
}
