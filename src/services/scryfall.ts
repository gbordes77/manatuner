import type { Card } from '@/types'
import type { ScryfallCard } from '../types/scryfall'
import { DECKLIST_MAX_CARDS, parseDecklist } from './deckParser'
import {
  abortable,
  abortableDelay,
  fetchJsonWithTimeout,
  HttpError,
  isCancellation,
  throwIfAborted,
} from './http'
import {
  getCachedCard,
  setCachedCard,
  clearPersistentScryfallCache,
} from './scryfallPersistentCache'

const SCRYFALL_API_BASE = 'https://api.scryfall.com'
const RATE_LIMIT_DELAY = 100 // 100ms entre les requêtes

interface ScryfallResponse<T> {
  object: string
  data?: T[]
  not_found?: any[]
  total_cards?: number
  has_more?: boolean
}

/**
 * Bounded LRU Map — caps memory for long sessions (Cube grinders, power users
 * analyzing 50 decks in one tab). When `max` is reached, the oldest entry is
 * evicted. Re-accessing a key refreshes its recency.
 */
export class BoundedMap<K, V> extends Map<K, V> {
  constructor(private readonly max: number) {
    super()
  }
  override get(key: K): V | undefined {
    const value = super.get(key)
    if (value !== undefined) {
      // Touch: delete and re-set to move to newest slot
      super.delete(key)
      super.set(key, value)
    }
    return value
  }
  override set(key: K, value: V): this {
    if (super.has(key)) {
      super.delete(key)
    } else if (super.size >= this.max) {
      // Evict oldest (first insertion)
      const oldestKey = super.keys().next().value
      if (oldestKey !== undefined) super.delete(oldestKey)
    }
    super.set(key, value)
    return this
  }
}

// Cache pour éviter les requêtes répétées — bounded to 500 entries each
const cardCache = new BoundedMap<string, Card>(500)
const collectionCache = new BoundedMap<string, Card[]>(100)

// Rate limiting
let lastRequestTime = 0

const ensureRateLimit = async (signal?: AbortSignal): Promise<void> => {
  throwIfAborted(signal)
  const timeSinceLastRequest = Date.now() - lastRequestTime
  if (timeSinceLastRequest < RATE_LIMIT_DELAY) {
    await abortableDelay(RATE_LIMIT_DELAY - timeSinceLastRequest, signal)
  }
  throwIfAborted(signal)
  lastRequestTime = Date.now()
}

/**
 * Convertit une carte Scryfall en format interne
 */
const convertScryfallCard = (scryfallCard: ScryfallCard): Card => {
  return {
    id: scryfallCard.id,
    name: scryfallCard.name,
    mana_cost: scryfallCard.mana_cost || undefined,
    cmc: scryfallCard.cmc,
    colors: scryfallCard.colors,
    color_identity: scryfallCard.color_identity,
    type_line: scryfallCard.type_line,
    rarity: scryfallCard.rarity,
    set: scryfallCard.set,
    set_name: scryfallCard.set || 'Unknown',
    legalities: {},
    imageUris: scryfallCard.image_uris,
    layout: scryfallCard.layout,
    // Include card_faces for DFCs (double-faced cards, transform, modal_dfc, etc.)
    card_faces: scryfallCard.card_faces?.map((face) => ({
      name: face.name,
      mana_cost: face.mana_cost,
      type_line: face.type_line,
      oracle_text: face.oracle_text,
      colors: face.colors || [],
      image_uris: face.image_uris,
    })),
  } as Card
}

/**
 * Effectue une requête à l'API Scryfall
 */
const scryfallRequest = async <T>(endpoint: string, signal?: AbortSignal): Promise<T> => {
  await ensureRateLimit(signal)

  try {
    const { response, data } = await fetchJsonWithTimeout<T>(
      `${SCRYFALL_API_BASE}${endpoint}`,
      {},
      { timeoutMs: 8000, retries: 1, signal }
    )

    if (!response.ok) {
      throw new HttpError(
        response.status,
        `Scryfall API error: ${response.status} ${response.statusText}`
      )
    }

    return data!
  } catch (error) {
    console.error('Scryfall request failed:', error)
    throw error
  }
}

/**
 * Recherche une carte by name avec fallbacks intelligents
 */
export const searchCardByName = async (
  name: string,
  signal?: AbortSignal
): Promise<Card | null> => {
  throwIfAborted(signal)
  const cacheKey = name.toLowerCase().trim()

  // L1: in-memory hot cache
  if (cardCache.has(cacheKey)) {
    return cardCache.get(cacheKey)!
  }

  // L2: IndexedDB persistent warm cache (survives reloads, 30-day TTL)
  const persisted = await (signal
    ? abortable(getCachedCard(cacheKey), signal)
    : getCachedCard(cacheKey))
  throwIfAborted(signal)
  if (persisted) {
    cardCache.set(cacheKey, persisted) // promote to hot
    return persisted
  }

  // Liste des variantes à essayer
  const nameVariants = [
    name.trim(),
    name.replace(/'/g, "'"), // Apostrophe droite → courbe
    name.replace(/'/g, "'"), // Apostrophe courbe → droite
    name.replace(/['']/g, ''), // Supprimer apostrophes
    name.replace(/,/g, ''), // Supprimer virgules
    name.replace(/\s+/g, ' ').trim(), // Normaliser espaces
  ]

  for (const variant of nameVariants) {
    try {
      const encodedName = encodeURIComponent(variant)
      const response = await scryfallRequest<ScryfallCard>(
        `/cards/named?fuzzy=${encodedName}`,
        signal
      )

      throwIfAborted(signal)
      const card = convertScryfallCard(response)
      cardCache.set(cacheKey, card)
      setCachedCard(cacheKey, card).catch(() => {}) // fire-and-forget IDB write

      return card
    } catch (error) {
      if (isCancellation(error)) throw error
      continue
    }
  }

  console.warn(`🚫 Aucune variante trouvée pour: "${name}"`)
  return null
}

/**
 * Recherche multiple cartes by collection
 */
export const searchCardsByCollection = async (
  cardNames: string[],
  signal?: AbortSignal
): Promise<Card[]> => {
  throwIfAborted(signal)
  const cacheKey = [...cardNames].sort().join('|')

  if (collectionCache.has(cacheKey)) {
    return collectionCache.get(cacheKey)!
  }

  try {
    const identifiers = cardNames.map((name) => ({ name: name.trim() }))

    const { response, data } = await fetchJsonWithTimeout<ScryfallResponse<ScryfallCard>>(
      `${SCRYFALL_API_BASE}/cards/collection`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ identifiers }),
      },
      { timeoutMs: 8000, retries: 1, signal }
    )

    if (!response.ok) {
      throw new Error(`Scryfall collection API error: ${response.status}`)
    }

    throwIfAborted(signal)
    const cards = data?.data?.map(convertScryfallCard) || []

    collectionCache.set(cacheKey, cards)
    return cards
  } catch (error) {
    if (isCancellation(error)) throw error
    console.error('Collection search failed:', error)

    // Fallback: recherche une par une
    const results: Card[] = []
    for (const name of cardNames) {
      const card = await searchCardByName(name, signal)
      if (card) {
        results.push(card)
      }
    }

    return results
  }
}

/** Compatibility exports: the same resource limits apply at every parsing entry. */
export const DECKLIST_QTY_MIN = 1
export const DECKLIST_QTY_MAX = DECKLIST_MAX_CARDS
export const DECKLIST_NAME_MIN = 1
export { DECKLIST_NAME_MAX } from './deckParser'

/** Canonical validation and main-library population, with explicit quantities required. */
export const parseDecklistText = (text: string): { name: string; quantity: number }[] =>
  parseDecklist(text)
    .entries.filter((entry) => entry.section === 'main')
    .map(({ name, quantity }) => ({ name, quantity }))

/**
 * Analyse une decklist complète avec l'API Scryfall
 */
export const analyzeDecklistText = async (
  text: string,
  signal?: AbortSignal
): Promise<{
  cards: Card[]
  notFound: string[]
  totalCards: number
}> => {
  const parsedCards = parseDecklistText(text)
  const uniqueNames = [...new Set(parsedCards.map((c) => c.name))]

  const foundCards = await searchCardsByCollection(uniqueNames, signal)
  const foundNames = new Set(foundCards.map((c) => c.name.toLowerCase()))

  const notFound = uniqueNames.filter((name) => !foundNames.has(name.toLowerCase()))

  const totalCards = parsedCards.reduce((sum, card) => sum + card.quantity, 0)

  return {
    cards: foundCards,
    notFound,
    totalCards,
  }
}

/**
 * Obtient les suggestions de terrains pour une combinaison de couleurs
 */
export const getLandSuggestions = async (colors: string[]): Promise<Card[]> => {
  const colorString = colors.sort().join('')
  const cacheKey = `lands_${colorString}`

  if (collectionCache.has(cacheKey)) {
    return collectionCache.get(cacheKey)!
  }

  try {
    // Recherche de terrains basiques et non-basiques
    const queries = [
      `t:land (${colors.map((c) => `c:${c}`).join(' OR ')})`,
      `t:land produces:${colors.join('')}`,
      `t:land ${colors.map((c) => `produces:${c}`).join(' ')} -t:basic`,
    ]

    const allLands: Card[] = []

    for (const query of queries) {
      try {
        const response = await scryfallRequest<ScryfallResponse<ScryfallCard>>(
          `/cards/search?q=${encodeURIComponent(query)}&order=edhrec&dir=desc`
        )

        if (response.data) {
          const lands = response.data
            .slice(0, 20) // Limite à 20 résultats par query
            .map(convertScryfallCard)

          allLands.push(...lands)
        }
      } catch (error) {
        console.warn(`Land search failed for query: ${query}`, error)
      }
    }

    // Déduplique et trie par popularité
    const uniqueLands = Array.from(new Map(allLands.map((land) => [land.id, land])).values())

    collectionCache.set(cacheKey, uniqueLands)
    return uniqueLands
  } catch (error) {
    console.error('Land suggestions failed:', error)
    return []
  }
}

/**
 * Vide le cache (utile pour les tests ou le refresh)
 *
 * Clears the in-memory L1 caches synchronously. The IndexedDB L2 cache is
 * cleared fire-and-forget — callers don't need to await it.
 */
export const clearCache = (): void => {
  cardCache.clear()
  collectionCache.clear()
  clearPersistentScryfallCache().catch(() => {})
}

/**
 * Stats du cache
 */
export const getCacheStats = () => {
  return {
    cardCacheSize: cardCache.size,
    collectionCacheSize: collectionCache.size,
    totalCachedItems: cardCache.size + collectionCache.size,
  }
}

// =============================================================================
// LAND-SPECIFIC FUNCTIONS
// =============================================================================

/** Extended land data for land detection system */
export interface ScryfallLandData {
  id: string
  name: string
  type_line: string
  oracle_text?: string
  produced_mana?: string[]
  layout: string
  keywords?: string[]
  card_faces?: Array<{
    name: string
    type_line: string
    oracle_text?: string
    mana_cost?: string
    colors?: string[]
  }>
}

/** Cache for land-specific data — BoundedMap (T13), cap 300. */
const landDataCache = new BoundedMap<string, ScryfallLandData | null>(300)

/**
 * Fetch land-specific data from Scryfall with oracle_text and card_faces.
 * This is optimized for the land detection system.
 *
 * @param cardName - The exact card name to look up
 * @returns Land data or null if not found or not a land
 */
export const fetchLandData = async (
  cardName: string,
  signal?: AbortSignal
): Promise<ScryfallLandData | null> => {
  throwIfAborted(signal)
  const cacheKey = cardName.toLowerCase().trim()
  if (landDataCache.has(cacheKey)) return landDataCache.get(cacheKey) ?? null
  try {
    const encodedName = encodeURIComponent(cardName.trim())
    let definitiveNotFound = true
    for (const match of ['exact', 'fuzzy']) {
      await ensureRateLimit(signal)
      const { response, data } = await fetchJsonWithTimeout<ScryfallCard>(
        `${SCRYFALL_API_BASE}/cards/named?${match}=${encodedName}`,
        {},
        { timeoutMs: 8000, retries: 1, signal }
      )
      if (response.ok) {
        throwIfAborted(signal)
        return processLandData(data!, cacheKey)
      }
      if (response.status !== 404) definitiveNotFound = false
    }
    // Only definitive absence may become a negative cache entry.
    if (definitiveNotFound) landDataCache.set(cacheKey, null)
    return null
  } catch (error) {
    if (isCancellation(error)) throw error
    console.warn(`[Scryfall] Failed to fetch land data for "${cardName}":`, error)
    return null
  }
}

/**
 * Process and cache Scryfall response for land data
 */
const processLandData = (data: ScryfallCard, cacheKey: string): ScryfallLandData | null => {
  // Check if it's a land
  const isLand =
    data.type_line?.toLowerCase().includes('land') ||
    data.card_faces?.some((face) => face.type_line?.toLowerCase().includes('land'))

  if (!isLand) {
    landDataCache.set(cacheKey, null)
    return null
  }

  const landData: ScryfallLandData = {
    id: data.id,
    name: data.name,
    type_line: data.type_line,
    oracle_text: data.oracle_text,
    produced_mana: data.produced_mana,
    layout: data.layout,
    keywords: data.keywords,
    card_faces: data.card_faces?.map((face) => ({
      name: face.name,
      type_line: face.type_line,
      oracle_text: face.oracle_text,
      mana_cost: face.mana_cost,
      colors: face.colors,
    })),
  }

  landDataCache.set(cacheKey, landData)
  return landData
}

/** Scryfall /cards/collection accepts at most 75 identifiers (T07). */
export const SCRYFALL_COLLECTION_CHUNK_SIZE = 75

/**
 * Batch fetch land data for multiple cards.
 * Uses the collection endpoint in chunks of 75; not_found → /cards/named fallback;
 * whole-batch failure → sequential fetchLandData (T07).
 *
 * @param cardNames - Array of card names to look up
 * @returns Map of card names to their land data (or null if not a land)
 */
export const fetchLandDataBatch = async (
  cardNames: string[],
  signal?: AbortSignal
): Promise<Map<string, ScryfallLandData | null>> => {
  throwIfAborted(signal)
  const results = new Map<string, ScryfallLandData | null>()
  const toFetch: string[] = []

  // Check cache first
  for (const name of cardNames) {
    const cacheKey = name.toLowerCase().trim()
    if (landDataCache.has(cacheKey)) {
      results.set(name, landDataCache.get(cacheKey) ?? null)
    } else {
      toFetch.push(name)
    }
  }

  if (toFetch.length === 0) {
    return results
  }

  // Chunk at Scryfall collection limit
  for (let i = 0; i < toFetch.length; i += SCRYFALL_COLLECTION_CHUNK_SIZE) {
    const chunk = toFetch.slice(i, i + SCRYFALL_COLLECTION_CHUNK_SIZE)
    try {
      await ensureRateLimit(signal)

      const identifiers = chunk.map((name) => ({ name: name.trim() }))

      const { response, data } = await fetchJsonWithTimeout<ScryfallResponse<ScryfallCard>>(
        `${SCRYFALL_API_BASE}/cards/collection`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ identifiers }),
        },
        { timeoutMs: 8000, retries: 1, signal }
      )

      if (!response.ok) {
        throw new Error(`Scryfall collection API error: ${response.status}`)
      }

      throwIfAborted(signal)

      // Index returned cards by lowercased name for matching request keys
      const byLower = new Map<string, ScryfallCard>()
      for (const card of data?.data || []) {
        byLower.set(card.name.toLowerCase().trim(), card)
      }

      // not_found from API (explicit) — fall back to /cards/named (exact→fuzzy)
      const notFoundFromApi = new Set(
        (data?.not_found || [])
          .map((nf: { name?: string }) => (nf?.name || '').toLowerCase().trim())
          .filter(Boolean)
      )

      for (const name of chunk) {
        const lower = name.toLowerCase().trim()
        const card = byLower.get(lower)
        if (card) {
          const landData = processLandData(card, lower)
          // Store under the request name so callers can key by input
          results.set(name, landData)
          continue
        }

        // Partial match: Scryfall may normalize names (punctuation)
        let matched: ScryfallCard | undefined
        for (const [key, c] of byLower) {
          if (key === lower || c.name.toLowerCase().trim() === lower) {
            matched = c
            break
          }
        }
        if (matched) {
          const landData = processLandData(matched, lower)
          results.set(name, landData)
          continue
        }

        // not_found or unmatched → individual named lookup (T07)
        if (notFoundFromApi.has(lower) || !byLower.has(lower)) {
          const landData = await fetchLandData(name, signal)
          results.set(name, landData)
        }
      }
    } catch (error) {
      if (isCancellation(error)) throw error
      console.error('[Scryfall] Batch land data fetch failed (chunk):', error)

      // Fallback: sequential named fetch for this chunk
      for (const name of chunk) {
        if (!results.has(name)) {
          const landData = await fetchLandData(name, signal)
          results.set(name, landData)
        }
      }
    }
  }

  return results
}

/**
 * Clear the land data cache
 */
export const clearLandDataCache = (): void => {
  landDataCache.clear()
}

/**
 * Get land data cache stats
 */
export const getLandDataCacheStats = () => {
  let lands = 0
  let nonLands = 0

  for (const value of landDataCache.values()) {
    if (value === null) {
      nonLands++
    } else {
      lands++
    }
  }

  return { total: landDataCache.size, lands, nonLands }
}
