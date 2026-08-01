import { LAND_CATEGORY_NAMES, type LandMetadata } from '../../types/lands'
import { landService } from '../../services/landService'

/**
 * Categorize a land using Scryfall-verified metadata.
 * This replaces keyword-based detection which caused false positives
 * (e.g., "Swampsnare Trap" matching "swamp" keyword).
 *
 * @param name - Card name
 * @param landMetadata - Optional LandMetadata from Scryfall API
 * @returns Human-readable category string
 */
export function categorizeLandFromMetadata(
  name: string,
  landMetadata?: LandMetadata | null
): string {
  // If we have verified metadata, use it
  if (landMetadata) {
    return LAND_CATEGORY_NAMES[landMetadata.category] || 'Other Land'
  }

  // Fallback: seed/cache sync lookup (no network)
  return categorizeLandComplete(name)
}

/**
 * Check if a card is a land using metadata.
 * Prefer this over isLandCardComplete when metadata is available.
 *
 * @param card - Card object with isLand boolean from Scryfall
 * @returns true if card is a land
 */
export function isLandFromMetadata(card: { isLand?: boolean }): boolean {
  return card.isLand === true
}

/**
 * Synchronous land detection via landService seed/cache.
 * Unknown names outside the seed return false (async Scryfall path is detectLand).
 */
export function isLandCardComplete(name: string): boolean {
  return landService.isLandSync(name)
}

/**
 * Synchronous land categorization via landService seed/cache.
 * Returns a human-readable label from LAND_CATEGORY_NAMES, or "Other Land".
 */
export function categorizeLandComplete(name: string): string {
  return landService.getCategoryLabelSync(name)
}
