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
