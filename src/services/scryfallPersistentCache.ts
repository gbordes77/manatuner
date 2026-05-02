/**
 * Persistent IndexedDB cache for Scryfall card metadata.
 *
 * Sits BEHIND the in-memory `BoundedMap` LRU in `scryfall.ts`. Read order:
 *   1. memory hot cache (instant, session-scoped)
 *   2. IndexedDB warm cache (this module — survives reloads, ~10ms read)
 *   3. network (Scryfall API fallback)
 *
 * Card metadata is public Scryfall data — not user-private. Storing it
 * locally is pure perf optimization; no GDPR/privacy implication. The
 * privacy panel claim "decklists never leave your browser" is unaffected.
 *
 * Errors are silenced: IDB can be blocked (private browsing, quota full,
 * Safari ITP). Memory cache always works as fallback.
 */
import { createStore, get, set, del, clear } from 'idb-keyval'
import type { Card } from '@/types'

const CACHE_VERSION = 1
const TTL_MS = 30 * 24 * 60 * 60 * 1000 // 30 days — Scryfall card data is stable

let store: ReturnType<typeof createStore> | null = null
function getStore() {
  // Lazy-init: skip if `indexedDB` is unavailable (SSR, very old browsers)
  if (store) return store
  if (typeof indexedDB === 'undefined') return null
  store = createStore('manatuner-scryfall', `cards-v${CACHE_VERSION}`)
  return store
}

interface CachedEntry {
  card: Card
  ts: number
}

export async function getCachedCard(key: string): Promise<Card | null> {
  const s = getStore()
  if (!s) return null
  try {
    const entry = await get<CachedEntry>(key, s)
    if (!entry) return null
    if (Date.now() - entry.ts > TTL_MS) {
      del(key, s).catch(() => {}) // expire async, don't block read
      return null
    }
    return entry.card
  } catch {
    return null
  }
}

export async function setCachedCard(key: string, card: Card): Promise<void> {
  const s = getStore()
  if (!s) return
  try {
    await set(key, { card, ts: Date.now() }, s)
  } catch {
    // IDB blocked or quota — silent. Memory cache still serves the session.
  }
}

export async function clearPersistentScryfallCache(): Promise<void> {
  const s = getStore()
  if (!s) return
  try {
    await clear(s)
  } catch {
    // Silent
  }
}
