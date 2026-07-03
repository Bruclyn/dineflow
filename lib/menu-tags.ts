// Predefined menu-item tags. Stored in menu_items.tags as a comma-separated
// string of these exact labels (emoji included) and displayed verbatim.
export const MENU_TAGS = [
  '🌶️ Spicy',
  '🥗 Vegetarian',
  '🐟 Seafood',
  '🔥 Bestseller',
  '🆕 New',
  '🥩 Grilled',
  '🌿 Healthy',
] as const

export function parseTags(tags: string | null | undefined): string[] {
  if (!tags) return []
  return tags
    .split(',')
    .map((t) => t.trim())
    .filter(Boolean)
}
