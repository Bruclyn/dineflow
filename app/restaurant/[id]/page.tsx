import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import LogoutButton from '@/app/dashboard/logout-button'
import AddToCartButton from './add-to-cart-button'
import CartNavIcon from '@/app/components/cart-nav-icon'
import OrdersNavIcon from '@/app/components/orders-nav-icon'

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
        .select('id, name, description, price, image_url, categories(id, name, display_order)')
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
          <div className="flex items-center gap-2">
            <OrdersNavIcon />
            <CartNavIcon />
            <LogoutButton />
          </div>
        </div>
      </nav>

      {/* Cover image */}
      <div className="relative h-44 sm:h-60 w-full bg-gradient-to-br from-orange-200 to-orange-100 overflow-hidden">
        {restaurant.cover_image_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={restaurant.cover_image_url}
            alt={restaurant.name}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-16 w-16 text-orange-300"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={0.8}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2 9m5-9v9m4-9v9m5-9l2 9"
              />
            </svg>
          </div>
        )}
      </div>

      {/* Restaurant header */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="relative -mt-8 flex items-end gap-4 mb-6">
          {/* Logo */}
          <div className="shrink-0 h-20 w-20 rounded-2xl border-4 border-white shadow-md bg-white overflow-hidden">
            {restaurant.logo_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={restaurant.logo_url}
                alt={`${restaurant.name} logo`}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-orange-50">
                <span className="text-2xl font-bold text-orange-300">
                  {restaurant.name.charAt(0)}
                </span>
              </div>
            )}
          </div>

          <div className="pb-1 min-w-0">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 leading-tight truncate">
              {restaurant.name}
            </h1>

            {avgRating !== null && (
              <div className="mt-1 flex items-center gap-1.5">
                <StarRow rating={avgRating} />
                <span className="text-sm font-medium text-gray-700">
                  {avgRating.toFixed(1)}
                </span>
                <span className="text-xs text-gray-400">
                  ({reviewList.length} {reviewList.length === 1 ? 'review' : 'reviews'})
                </span>
              </div>
            )}
          </div>
        </div>

        {restaurant.description && (
          <p className="text-sm text-gray-500 leading-relaxed mb-2">
            {restaurant.description}
          </p>
        )}

        {restaurant.address && (
          <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-8">
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
                <h2 className="text-base font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-100">
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
                <div key={review.id} className="rounded-2xl border border-gray-100 bg-white shadow-sm p-4">
                  <div className="flex items-center justify-between gap-2 mb-1.5">
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
  return (
    <div className="flex items-start gap-4 bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
      <div className="flex-1 min-w-0">
        <h3 className="text-sm font-semibold text-gray-900">{item.name}</h3>
        {item.description && (
          <p className="mt-0.5 text-xs text-gray-500 leading-relaxed line-clamp-2">
            {item.description}
          </p>
        )}
        <p className="mt-2 text-sm font-bold text-orange-500">
          ₦{item.price.toLocaleString('en-NG')}
        </p>
      </div>
      <div className="shrink-0 pt-0.5">
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
