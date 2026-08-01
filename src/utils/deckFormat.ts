/**
 * Deck format family detection from card count + mapping to ramp/removal presets.
 * Used by Analyzer auto-defaults (P1-9) and clear Format controls (P1-4).
 */

import type { FormatPreset } from '../types/manaProducers'

/** Coarse family for UI banners, land guidance, QuickVerdict tiers. */
export type DeckFormatFamily = 'limited' | 'edh' | 'constructed'

const LIMITED_MAX = 45
const EDH_MIN = 99

export function detectDeckFormatFamily(totalCards: number): DeckFormatFamily {
  if (!Number.isFinite(totalCards) || totalCards <= 0) return 'constructed'
  if (totalCards <= LIMITED_MAX) return 'limited'
  if (totalCards >= EDH_MIN) return 'edh'
  return 'constructed'
}

/** Default acceleration / removal preset for a family (user can override). */
export function suggestedFormatPreset(family: DeckFormatFamily): FormatPreset {
  switch (family) {
    case 'edh':
      return 'casual_edh'
    case 'limited':
      return 'limited'
    default:
      return 'modern'
  }
}

export function formatFamilyLabel(family: DeckFormatFamily): string {
  switch (family) {
    case 'edh':
      return 'Commander (100-card)'
    case 'limited':
      return 'Limited (40-card)'
    default:
      return 'Constructed (60-card)'
  }
}

/** Short land-count guidance for banners (not hard rules). */
export function landCountGuidance(
  family: DeckFormatFamily,
  totalLands: number,
  totalCards: number
): string {
  if (family === 'edh') {
    const target = '36–38 lands typical'
    return `${totalLands} lands in ${totalCards} — ${target}`
  }
  if (family === 'limited') {
    return `${totalLands} lands in ${totalCards} — aim ~17 lands in a 40-card draft deck`
  }
  return `${totalLands} lands in ${totalCards}`
}
