import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import AddToCartButton from './add-to-cart-button'
import CartNavIcon from '@/app/components/cart-nav-icon'
import UserMenu from '@/app/components/user-menu'
import { foodImageUrl, guessFoodCategory } from '@/lib/food-images'
import { parseTags } from '@/lib/menu-tags'

type Restaurant = {
  id: string
  name: string
  description: string | null
  address: string | null
  logo_url: string | null
  cover_image_url: string | null
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
        .select('id, name, description, address, logo_url, cover_image_url')
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white border-b border-gray-100 sticky top-0 z-10 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <Link
            href="/dashboard"
            className="flex items-center gap-1.5 text-sm font-medium text-gray-600 hover:text-orange-500 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </Link>
          <span className="text-xl font-bold text-orange-500 tracking-tight">DineFlow</span>
          <div className="flex items-center gap-3">
            <CartNavIcon />
            <UserMenu initial={initial} />
          </div>
        </div>
      </nav>

      {/* Cover banner with overlaid identity */}
      <div className="relative h-56 w-full overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={restaurant.cover_image_url ?? foodImageUrl('restaurant', 1200, 448)}
          alt={restaurant.name}
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent" />

        <div className="absolute inset-x-0 bottom-0">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 pb-5 flex items-end gap-4">
            {/* Logo */}
            <div className="shrink-0 h-16 w-16 sm:h-20 sm:w-20 rounded-2xl border-2 border-white/90 shadow-lg bg-white overflow-hidden">
              {restaurant.logo_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={restaurant.logo_url}
                  alt={`${restaurant.name} logo`}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-orange-500">
                  <span className="text-2xl font-bold text-white">
                    {restaurant.name.charAt(0)}
                  </span>
                </div>
              )}
            </div>

            <div className="pb-1 min-w-0">
              <h1 className="text-xl sm:text-2xl font-bold text-white leading-tight truncate drop-shadow-sm">
                {restaurant.name}
              </h1>

              {avgRating !== null && (
                <div className="mt-1.5 flex items-center gap-1.5">
                  <StarRow rating={avgRating} />
                  <span className="text-sm font-semibold text-white">
                    {avgRating.toFixed(1)}
                  </span>
                  <span className="text-xs text-white/75">
                    ({reviewList.length} {reviewList.length === 1 ? 'review' : 'reviews'})
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Restaurant details */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {restaurant.description && (
          <p className="text-sm text-gray-500 leading-relaxed mt-4 mb-2">
            {restaurant.description}
          </p>
        )}

        {restaurant.address && (
          <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-8">
            <span>📍</span>
            {restaurant.address}
          </div>
        )}

        {/* Menu */}
        {categories.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <p className="text-sm font-medium text-gray-400">No menu items yet</p>
            <p className="text-xs text-gray-400 mt-1">
              This restaurant hasn&apos;t added any items yet. Check back soon.
            </p>
          </div>
        ) : (
          <div className="space-y-10 mb-10">
            {categories.map((cat) => (
              <section key={cat}>
                <h2 className="sticky top-16 z-10 -mx-4 sm:-mx-6 px-4 sm:px-6 py-2.5 bg-gray-50/95 backdrop-blur-sm text-base font-bold text-orange-600 mb-4 border-b border-orange-100">
                  {cat}
                </h2>
                <div className="space-y-3">
                  {grouped[cat].map((item) => (
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
        )}

        {/* Reviews */}
        <section className="pb-16">
          <h2 className="text-base font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-100">
            Reviews{reviewList.length > 0 && ` (${reviewList.length})`}
          </h2>

          {reviewList.length === 0 ? (
            <div className="rounded-2xl border border-gray-100 bg-white shadow-sm px-6 py-10 text-center">
              <p className="text-sm font-medium text-gray-400">No reviews yet</p>
              <p className="text-xs text-gray-400 mt-1">Be the first to share your experience!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {reviewList.map((review) => (
                <div key={review.id} className="rounded-2xl border border-gray-100 bg-white shadow-sm p-5">
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <StarRow rating={review.rating} />
                    <span className="shrink-0 text-xs text-gray-400">
                      {new Date(review.created_at).toLocaleDateString('en-NG', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </span>
                  </div>
                  {review.comment && (
                    <p className="text-sm text-gray-700 leading-relaxed">{review.comment}</p>
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
  const imageUrl = item.image_url ?? foodImageUrl(guessFoodCategory(item.name), 160, 160)
  const tags = parseTags(item.tags)

  return (
    <div className="flex items-center gap-4 bg-white rounded-2xl border border-gray-100 shadow-sm p-3">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={imageUrl}
        alt={item.name}
        className="h-20 w-20 shrink-0 rounded-xl object-cover"
      />

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <h3 className="text-sm font-semibold text-gray-900">{item.name}</h3>
          {item.prep_time_mins != null && (
            <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-[11px] font-semibold text-gray-600">
              ⏱ {item.prep_time_mins} mins
            </span>
          )}
        </div>
        {tags.length > 0 && (
          <div className="mt-1 flex flex-wrap gap-1">
            {tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex rounded-full bg-orange-50 px-2 py-0.5 text-[11px] font-medium text-orange-600"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
        {item.description && (
          <p className="mt-0.5 text-sm text-gray-500 leading-relaxed line-clamp-2">
            {item.description}
          </p>
        )}
        <p className="mt-1.5 text-sm font-bold text-orange-500">
          ₦{item.price.toLocaleString('en-NG')}
        </p>
      </div>

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
            className={`h-3.5 w-3.5 ${
              filled || half ? 'text-orange-400' : 'text-gray-200'
            }`}
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
