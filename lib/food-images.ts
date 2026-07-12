const PHOTO_IDS = {
  burger: '1568901346375-23c9450c58cd',
  pizza: '1565299624946-b28f40a0ae38',
  rice: '1596797038530-2c107229654b',
  salad: '1512621776951-a57141f2eefd',
  soup: '1547592166-23ac45744acd',
  drink: '1544145945-f90425340c7e',
  noodles: '1585032226651-759b368d7246',
  chicken: '1626645738196-c2a7c87a8f58',
  restaurant: '1517248135467-4c7edcad34c4',
  spread: '1414235077428-338989a2e8c0',
} as const

export type FoodCategory = keyof typeof PHOTO_IDS

export function foodImageUrl(category: FoodCategory, width: number, height: number) {
  return `https://images.unsplash.com/photo-${PHOTO_IDS[category]}?w=${width}&h=${height}&fit=crop&auto=format`
}

// Map a restaurant to a distinct cover photo so cards don't all look identical.
// Uses direct images.unsplash.com CDN URLs (source.unsplash.com is deprecated).
const RESTAURANT_COVER_MAP: [RegExp, FoodCategory][] = [
  [/burger/i, 'burger'],
  [/grill|bbq|barbecue|smok/i, 'chicken'],
  [/spice|garden|jollof|nigerian|afri/i, 'rice'],
  [/kitchen|mama|home|mum/i, 'spread'],
  [/pizza|italian/i, 'pizza'],
  [/noodle|pasta|chinese|asian|wok/i, 'noodles'],
  [/salad|vegan|green|healthy/i, 'salad'],
  [/soup|broth/i, 'soup'],
]

export function restaurantCoverUrl(name: string, width: number, height: number): string {
  for (const [pattern, category] of RESTAURANT_COVER_MAP) {
    if (pattern.test(name)) return foodImageUrl(category, width, height)
  }
  // Deterministic fallback: spread arbitrary names across the photo set for variety.
  const keys = Object.keys(PHOTO_IDS) as FoodCategory[]
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = (hash * 31 + name.charCodeAt(i)) >>> 0
  }
  return foodImageUrl(keys[hash % keys.length], width, height)
}

const KEYWORD_MAP: [RegExp, FoodCategory][] = [
  [/burger/i, 'burger'],
  [/pizza/i, 'pizza'],
  [/rice|jollof/i, 'rice'],
  [/salad|egusi|vegetable/i, 'salad'],
  [/soup/i, 'soup'],
  [/drink|juice|zobo|shake|smoothie/i, 'drink'],
  [/noodle|pasta|spaghetti/i, 'noodles'],
  [/chicken|beef|meat|fish|suya/i, 'chicken'],
]

export function guessFoodCategory(name: string): FoodCategory {
  for (const [pattern, category] of KEYWORD_MAP) {
    if (pattern.test(name)) return category
  }
  return 'spread'
}

// Local food photos in /public/, mapped by dish / category keyword.
// NOTE: mapped by the ACTUAL pixel content of each file — icon-11 is the
// fried-rice wok and icon-12 is pounded yam + egusi (the reverse of some
// numbering), so each dish shows the correct photo.
const LOCAL_FOOD_MAP: [RegExp, string][] = [
  [/burger|sandwich|shawarma|wrap/i, '/icon-10.png'],
  [/fries|chips|\bsides?\b|plantain|potato/i, '/icon-9.png'],
  [/frappe|milkshake|shake|smoothie|dessert|ice ?cream|cake|parfait|sundae/i, '/icon-8.png'],
  [/zobo|drink|juice|soda|water|chapman|cola|beverage|\btea\b|coffee/i, '/icon-7.png'],
  [/rice|jollof|basmati|pilau|risotto|fried rice/i, '/icon-11.png'],
  [/yam|pounded|eba|fufu|amala|semo|swallow|soup|egusi|okra|ogbono|efo|afang|stew|local|native/i, '/icon-12.png'],
]

// Returns a local /public image path for a dish name, for use with next/image.
export function localFoodImage(name: string): string {
  for (const [pattern, path] of LOCAL_FOOD_MAP) {
    if (pattern.test(name)) return path
  }
  return '/icon-12.png'
}
