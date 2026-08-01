/**
 * Deck format family detection from card count + mapping to ramp/removal presets.
 * Used by Analyzer auto-defaults (P1-9) and clear Format controls (P1-4).
 *
 * P1-9 suite (2026-08-01): format-aware castability horizon + Karsten source
 * scaling for non-60-card decks (Commander / Limited).
 */

import type { FormatPreset } from '../types/manaProducers'

/** Coarse family for UI banners, land guidance, QuickVerdict tiers. */
export type DeckFormatFamily = 'limited' | 'edh' | 'constructed'

const LIMITED_MAX = 45
const EDH_MIN = 99

/** Karsten 2022 tables are published for this deck size. */
export const KARSTEN_REFERENCE_DECK_SIZE = 60

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

// ---------------------------------------------------------------------------
// P1-9 — castability horizon + Karsten scaling
// ---------------------------------------------------------------------------

export interface CastabilityHorizon {
  /** Inclusive CMC / turn lower bound for "priority" spells. */
  minTurn: number
  /** Inclusive CMC / turn upper bound for "priority" spells. */
  maxTurn: number
  /** Short label for UI chips (e.g. "T5–T8"). */
  label: string
  /** One-line explanation for banners. */
  description: string
}

/**
 * Turns that matter most when reading castability for a format family.
 * - Constructed / Limited: early curve (T1–T4)
 * - Commander: mid-game (T4–T8) — includes CMC-4 commanders (Atraxa, etc.)
 */
export function castabilityHorizon(family: DeckFormatFamily): CastabilityHorizon {
  if (family === 'edh') {
    return {
      minTurn: 4,
      maxTurn: 8,
      label: 'T4–T8',
      description:
        'Commander games resolve mid-curve — priority spells are CMC 4–8 (commander, ramp payoffs, haymakers). Early rocks/dorks still listed below.',
    }
  }
  if (family === 'limited') {
    return {
      minTurn: 1,
      maxTurn: 4,
      label: 'T1–T4',
      description: 'Limited is won on the early curve — priority spells are CMC 1–4.',
    }
  }
  return {
    minTurn: 1,
    maxTurn: 4,
    label: 'T1–T4',
    description: 'Constructed priority curve is CMC 1–4 (on-curve threats and interaction).',
  }
}

/** Whether a spell CMC falls in the format's priority castability horizon. */
export function isInCastabilityHorizon(cmc: number, family: DeckFormatFamily): boolean {
  const h = castabilityHorizon(family)
  const t = Math.max(0, Math.round(Number.isFinite(cmc) ? cmc : 0))
  return t >= h.minTurn && t <= h.maxTurn
}

/**
 * Scale a Karsten-2022 source count (published for 60-card) to another deck size.
 *
 * First-order hypergeometric approximation: for the same cards-seen and symbols
 * needed, sources required scale roughly with N/60. Used by Manabase color checks.
 *
 * Examples (single pip, turn 1 → 14 sources @ 60):
 * - 40-card Limited ≈ 9
 * - 100-card Commander ≈ 23
 */
export function scaleKarstenSources(
  sourcesFor60: number,
  deckSize: number,
  referenceSize: number = KARSTEN_REFERENCE_DECK_SIZE
): number {
  if (!Number.isFinite(sourcesFor60) || sourcesFor60 <= 0) return 0
  if (!Number.isFinite(deckSize) || deckSize <= 0) return Math.round(sourcesFor60)
  if (!Number.isFinite(referenceSize) || referenceSize <= 0) {
    return Math.round(sourcesFor60)
  }
  // Near-60 decks: no noise from float rounding
  if (Math.abs(deckSize - referenceSize) < 0.5) return Math.round(sourcesFor60)

  const scaled = (sourcesFor60 * deckSize) / referenceSize
  // At least 1 if the 60-card table wanted any sources; never exceed deck size.
  const rounded = Math.max(1, Math.round(scaled))
  return Math.min(rounded, Math.floor(deckSize))
}

/**
 * Honest EDH caveats (Rule 0 / command zone). Keep short for banners.
 * Longer copy lives on /guide#commander.
 */
export function commanderCaveats(opts?: {
  commanderNames?: string[]
  librarySize?: number
  listSize?: number
}): {
  commandZone: string
  karstenScaled: string
  multiplayer: string
} {
  const names = opts?.commanderNames?.filter(Boolean) ?? []
  const librarySize = opts?.librarySize
  const listSize = opts?.listSize

  let commandZone: string
  if (names.length > 0) {
    const who = names.slice(0, 2).join(' + ')
    const more = names.length > 2 ? ` (+${names.length - 2})` : ''
    const libNote =
      librarySize != null && listSize != null && librarySize < listSize
        ? ` Library for other spells uses ${librarySize} cards (commander(s) excluded from the draw pile).`
        : ' Treated as always available (command zone), not drawn from the library.'
    commandZone = `Commander detected: ${who}${more}.${libNote}`
  } else {
    commandZone =
      'No commander marker found — paste with *CMDR* or a Commander section, or put the commander first in a 100-card list. Until then, odds treat the full list as the library.'
  }

  return {
    commandZone,
    karstenScaled:
      'Karsten source targets are scaled from the 60-card tables by deck size (N/60). Useful guide, not a published EDH table.',
    multiplayer:
      'Multiplayer politics and Rule 0 are out of scope — this is a manabase / castability lens only.',
  }
}

/** Arena / export marker for commander on a card line (before cleanCardName). */
export function lineHasCommanderMarker(rawCardToken: string): boolean {
  return /\*CMDR\*/i.test(rawCardToken)
}

/**
 * Effective library size for hypergeom when commander(s) sit in the command zone.
 * If the user included commander(s) in a 100-card paste, other spells should use N−cmd.
 */
export function effectiveLibrarySize(
  listSize: number,
  commanderCopiesInList: number,
  family: DeckFormatFamily
): number {
  if (family !== 'edh') return listSize
  if (!Number.isFinite(listSize) || listSize <= 0) return listSize
  if (!Number.isFinite(commanderCopiesInList) || commanderCopiesInList <= 0) return listSize
  return Math.max(1, listSize - commanderCopiesInList)
}

/**
 * EDH fallback: if nothing marked *CMDR* / Commander section, treat the first
 * maindeck non-land as commander (common export style: commander on line 1).
 */
export function applyCommanderFallback<
  T extends {
    name: string
    quantity?: number
    isLand?: boolean
    isSideboard?: boolean
    isCommander?: boolean
  },
>(cards: T[]): T[] {
  if (cards.some((c) => c.isCommander)) return cards
  const total = cards.reduce((s, c) => s + (c.quantity ?? 1), 0)
  if (detectDeckFormatFamily(total) !== 'edh') return cards
  const first = cards.find((c) => !c.isLand && !c.isSideboard)
  if (!first) return cards
  return cards.map((c) => (c === first ? { ...c, isCommander: true } : c))
}

/** Basic land names (incl. snow / wastes) — allowed qty > 1 in singleton formats. */
const BASIC_LAND_NAMES = new Set(
  [
    'Plains',
    'Island',
    'Swamp',
    'Mountain',
    'Forest',
    'Wastes',
    'Snow-Covered Plains',
    'Snow-Covered Island',
    'Snow-Covered Swamp',
    'Snow-Covered Mountain',
    'Snow-Covered Forest',
  ].map((n) => n.toLowerCase())
)

export function isBasicLandName(name: string): boolean {
  const base = name.split('//')[0].trim().toLowerCase()
  return BASIC_LAND_NAMES.has(base)
}

/**
 * Non-basic cards with quantity > 1 (singleton warning for EDH lists).
 * Does not prove legality — just a UX heads-up.
 */
export function findSingletonViolations(
  cards: ReadonlyArray<{ name: string; quantity?: number; isLand?: boolean }>
): string[] {
  const hits: string[] = []
  for (const c of cards) {
    const qty = c.quantity ?? 1
    if (qty <= 1) continue
    if (isBasicLandName(c.name)) continue
    hits.push(c.name)
  }
  return hits
}
