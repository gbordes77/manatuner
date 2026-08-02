/**
 * Scryfall card resolution for deck analysis (T08).
 * Bounded in-memory cache + batch collection + named exact→fuzzy.
 * Does NOT own land detection (landService) or analysis orchestration (DeckAnalyzer).
 */

import type { ScryfallCard } from '../types/scryfall'
import { fetchWithTimeout } from './http'
import { BoundedMap } from './scryfall'

// Audit fix H4 (2026-04-13): BoundedMap (LRU, cap 500) instead of unbounded Map.
const scryfallCache = new BoundedMap<string, ScryfallCard>(500)

export type CardResolveResult = {
  data: ScryfallCard | null
  /** True only on definitive 404 (exact + fuzzy). */
  notFound: boolean
}

/**
 * Batch fetch up to 75 cards at once via Scryfall /cards/collection.
 * Populates the shared in-memory cache used by fetchCardFromScryfallWithMeta.
 */
export async function batchFetchFromScryfall(cardNames: string[]): Promise<void> {
  const uncached = cardNames.filter((name) => !scryfallCache.has(name))
  if (uncached.length === 0) return

  const BATCH_SIZE = 75
  for (let i = 0; i < uncached.length; i += BATCH_SIZE) {
    const batch = uncached.slice(i, i + BATCH_SIZE)
    const identifiers = batch.map((name) => ({ name }))

    try {
      const response = await fetchWithTimeout(
        'https://api.scryfall.com/cards/collection',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ identifiers }),
        },
        { timeoutMs: 8000, retries: 1 }
      )

      if (response.ok) {
        const data = await response.json()
        for (const card of data.data || []) {
          scryfallCache.set(card.name, card)
        }
      }
    } catch (error) {
      console.warn('Scryfall batch fetch failed, falling back to individual calls', error)
    }

    // Respect Scryfall rate limit (100ms between requests)
    if (i + BATCH_SIZE < uncached.length) {
      await new Promise((r) => setTimeout(r, 100))
    }
  }
}

/**
 * Fetch a card from Scryfall with:
 * - In-memory BoundedMap cache
 * - 8s timeout + retry on 429/5xx via fetchWithTimeout
 * - Fuzzy fallback when exact match fails
 *
 * Distinguishes definitive not-found (404) from transient network failures.
 */
export async function fetchCardFromScryfallWithMeta(cardName: string): Promise<CardResolveResult> {
  if (scryfallCache.has(cardName)) {
    return { data: scryfallCache.get(cardName)!, notFound: false }
  }

  const encodedName = encodeURIComponent(cardName)
  const exactUrl = `https://api.scryfall.com/cards/named?exact=${encodedName}`
  const fuzzyUrl = `https://api.scryfall.com/cards/named?fuzzy=${encodedName}`

  type Attempt = { kind: 'ok'; data: ScryfallCard } | { kind: 'not_found' } | { kind: 'error' }

  const tryFetch = async (url: string): Promise<Attempt> => {
    try {
      const response = await fetchWithTimeout(url, {}, { timeoutMs: 8000, retries: 1 })

      if (response.ok) {
        return { kind: 'ok', data: (await response.json()) as ScryfallCard }
      }

      if (response.status === 404) {
        return { kind: 'not_found' }
      }

      return { kind: 'error' }
    } catch (error) {
      console.warn(`Scryfall fetch failed for "${cardName}":`, error)
      return { kind: 'error' }
    }
  }

  let result = await tryFetch(exactUrl)

  if (result.kind !== 'ok') {
    const fuzzy = await tryFetch(fuzzyUrl)
    if (fuzzy.kind === 'ok') {
      result = fuzzy
    } else if (result.kind === 'error' || fuzzy.kind === 'error') {
      result = { kind: 'error' }
    } else {
      result = { kind: 'not_found' }
    }
  }

  if (result.kind === 'ok') {
    scryfallCache.set(cardName, result.data)
    return { data: result.data, notFound: false }
  }

  return { data: null, notFound: result.kind === 'not_found' }
}

export async function fetchCardFromScryfall(cardName: string): Promise<ScryfallCard | null> {
  const { data } = await fetchCardFromScryfallWithMeta(cardName)
  return data
}

/** Test helper: clear the card resolver memory cache. */
export function clearCardResolverCache(): void {
  scryfallCache.clear()
}

/** Test helper: cache size. */
export function getCardResolverCacheSize(): number {
  return scryfallCache.size
}
