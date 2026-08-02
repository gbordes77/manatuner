/**
 * Pure decklist parsing utilities (T08).
 * No network, no Scryfall — text in → structured fields out.
 */

/**
 * Normalize card names from any source (MTGA, MTGO, Moxfield, manual input)
 * into the front-face name that Scryfall's `exact=` endpoint accepts.
 *
 * Handles:
 * - MTGA set codes and collector numbers: "Card (SET) 123"
 * - Arena markers: "*CMDR*", "*F*", "*E*", "*CMP*", "*COMPANION*"
 * - Adventure/DFC split notation: "Front // Back" → "Front"
 * - Arena rebalanced "A-" prefix
 * - Unicode whitespace (nbsp, ideographic space)
 */
export function cleanCardName(name: string): string {
  return (
    name
      // Normalize unicode whitespace to regular space
      .replace(/[\u00A0\u2000-\u200B\u3000]/g, ' ')
      // Strip Arena markers (*CMDR*, *F*, *E*, *CMP*, *COMPANION*, etc.)
      .replace(/\s*\*[A-Z]+\*\s*/gi, ' ')
      // Remove MTGA set codes and collector numbers: "(SET) 123", "(SET) 123a"
      .replace(/\s*\([A-Z0-9]{2,4}\)\s*\d+[a-z★]?\s*$/i, '')
      // Remove "A-" prefix for Arena rebalanced cards
      .replace(/^A-/, '')
      // Take only the front face for DFC/adventure/split cards: "Front // Back"
      // Scryfall `exact=` rejects the full "//" form for DFCs like
      // "Fable of the Mirror-Breaker // Reflection of Kiki-Jiki". The front
      // face alone is always accepted.
      .split(/\s*\/\/\s*/)[0]
      // Collapse runs of whitespace and trim
      .replace(/\s+/g, ' ')
      .trim()
  )
}

/**
 * Detect which line index marks the start of the sideboard section,
 * using a pre-scan heuristic when no explicit marker is present.
 *
 * Handles:
 * - Explicit markers: "Sideboard", "Sideboard:", "// Sideboard", "SB:", "# Sideboard"
 * - Inline SB: prefix: "SB: 2 Rest in Peace"
 * - Blank-line separation: a blank line between a main block (40-100 cards) and a tail block (1-15 cards)
 *
 * Returns the 0-based line index where sideboard starts, or -1 if no sideboard detected.
 */
export function detectSideboardStartLine(lines: string[]): number {
  const cardPatterns = [/^(\d+)\s+(.+)$/, /^(\d+)x\s+(.+)$/i, /^(.+)\s+x(\d+)$/i]
  const sideboardMarkers = [/^sideboard:?$/i, /^\/\/\s*sideboard/i, /^sb:?$/i, /^#\s*sideboard/i]
  const sectionMarkers = [
    ...sideboardMarkers,
    /^(deck|maybeboard|commander|companion):?$/i,
    /^\/\/\s*(deck|maybeboard)/i,
  ]

  // Check for explicit sideboard marker first
  for (let i = 0; i < lines.length; i++) {
    const trimmed = lines[i].trim()
    if (sideboardMarkers.some((m) => m.test(trimmed))) {
      return i
    }
  }

  // Check for inline SB: prefix (e.g., "SB: 2 Rest in Peace")
  for (let i = 0; i < lines.length; i++) {
    if (/^sb:\s*\d+/i.test(lines[i].trim())) {
      return i
    }
  }

  // No explicit marker — look for blank-line separation
  const parseQty = (line: string): number => {
    const trimmed = line.trim()
    if (!trimmed) return 0
    if (sectionMarkers.some((m) => m.test(trimmed))) return 0
    for (const pattern of cardPatterns) {
      const m = trimmed.match(pattern)
      if (m) {
        return pattern === cardPatterns[2] ? parseInt(m[2]) : parseInt(m[1])
      }
    }
    return 0
  }

  // Collect blank-line positions
  const blankLineIndices: number[] = []

  for (let i = 0; i < lines.length; i++) {
    if (!lines[i].trim()) {
      blankLineIndices.push(i)
    }
  }

  // Canonical complete-deck sizes that should NOT be treated as main+sideboard
  // splits when no explicit marker is present. This kills the false positive
  // on MTGGoldfish/Moxfield category-grouped exports (audit C3, 2026-04-13)
  // where blank lines separate Creatures / Spells / Lands sections inside a
  // single 60-card main deck.
  const CANONICAL_TOTAL_NO_SIDEBOARD = new Set([40, 60, 80, 99, 100])

  // Try each blank line as a potential main/side split (prefer the last valid one)
  for (let b = blankLineIndices.length - 1; b >= 0; b--) {
    const splitIdx = blankLineIndices[b]

    let cardsBefore = 0
    let cardsAfter = 0

    for (let i = 0; i < splitIdx; i++) {
      cardsBefore += parseQty(lines[i])
    }
    for (let i = splitIdx + 1; i < lines.length; i++) {
      cardsAfter += parseQty(lines[i])
    }

    // Heuristic: main deck is 40-100 cards, sideboard is 1-15 cards
    if (cardsBefore >= 40 && cardsBefore <= 100 && cardsAfter >= 1 && cardsAfter <= 15) {
      // Reject if the total looks like a complete deck (no sideboard expected).
      // Standard/Pioneer/Modern with sideboard = 75. Limited with sideboard = 55-90.
      // Commander = 100 (no SB), Limited deck = 40 (no SB), Standard no-SB = 60.
      if (CANONICAL_TOTAL_NO_SIDEBOARD.has(cardsBefore + cardsAfter)) {
        continue
      }
      return splitIdx
    }
  }

  return -1 // No sideboard detected
}

/** Quantity + raw name patterns used across decklist formats. */
export const DECKLIST_LINE_PATTERNS = [
  /^(\d+)\s+(.+)$/,
  /^(\d+)x\s+(.+)$/i,
  /^(.+)\s+x(\d+)$/i,
] as const

/**
 * Parse a single decklist line into quantity + raw name, or null if not a card line.
 */
export function parseDecklistLine(line: string): { quantity: number; name: string } | null {
  const trimmed = line.trim()
  if (!trimmed) return null
  for (const pattern of DECKLIST_LINE_PATTERNS) {
    const match = trimmed.match(pattern)
    if (match) {
      if (pattern === DECKLIST_LINE_PATTERNS[2]) {
        return { quantity: parseInt(match[2], 10), name: match[1].trim() }
      }
      return { quantity: parseInt(match[1], 10), name: match[2].trim() }
    }
  }
  return null
}

/**
 * If no card was marked commander but the list is 99–100 cards, treat the
 * first maindeck non-land as the commander (common export style).
 */
export function applyCommanderFallback<
  T extends { isCommander?: boolean; isLand?: boolean; isSideboard?: boolean; quantity?: number },
>(cards: T[]): T[] {
  if (cards.some((c) => c.isCommander)) return cards
  const total = cards.reduce((s, c) => s + (c.quantity || 1), 0)
  if (total < 99) return cards
  const first = cards.find((c) => !c.isLand && !c.isSideboard)
  if (!first) return cards
  return cards.map((c) => (c === first ? { ...c, isCommander: true } : c))
}
