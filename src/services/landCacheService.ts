/**
 * Land Cache Service for ManaTuner
 *
 * Multi-level caching system for land metadata:
 * 1. Memory cache (Map) - O(1) reads, loaded once from localStorage
 * 2. localStorage - durable persistence, flushed in batch (not per set)
 *
 * @version 2.0 — batched writes (T04)
 * @see docs/LAND_SYSTEM_REDESIGN.md
 */

import type {
  CachedLandEntry,
  ILandCacheService,
  LandCacheStats,
  LandCacheStorage,
  LandMetadata,
} from '@/types/lands'

// =============================================================================
// CONSTANTS
// =============================================================================

/** localStorage key for the land cache */
const CACHE_KEY = 'manatuner_lands_cache'

/** Cache Time-To-Live in days */
const CACHE_TTL_DAYS = 30

/** Current cache version (for migrations) */
const CACHE_VERSION = '2.2' // Reparse modern Oracle wording: enters tapped.

/** Maximum entries to keep during emergency cleanup */
const MAX_ENTRIES_EMERGENCY = 100

/** Maximum entries before triggering cleanup */
const MAX_ENTRIES_BEFORE_CLEANUP = 500

/** Debounce delay for deferred flushes after individual set() calls */
const FLUSH_DEBOUNCE_MS = 500

// =============================================================================
// LAND CACHE SERVICE
// =============================================================================

/**
 * Service for caching land metadata with multi-level storage.
 * Storage is loaded once into memory; writes are batched into a single
 * stringify + setItem (end of preload, idle/debounced, or page hide).
 */
class LandCacheService implements ILandCacheService {
  /** In-memory metadata for instant get() */
  private memoryCache: Map<string, LandMetadata> = new Map()

  /** Full entry map (TTL + source) — SSOT for flush payload */
  private entries: Map<string, CachedLandEntry> = new Map()

  /** ISO timestamp of last cleanup (persisted) */
  private lastCleanup: string = new Date().toISOString()

  /** Pending localStorage write */
  private dirty = false

  /** Debounce / idle handle */
  private flushTimer: ReturnType<typeof setTimeout> | null = null
  private idleHandle: number | null = null

  /** Flag to track if cleanup has been run this session */
  private cleanupRan = false

  /** Lifecycle listeners attached once */
  private listenersAttached = false

  constructor() {
    this.loadIntoMemory()
    this.attachLifecycleListeners()
    this.lazyCleanup()
  }

  // ===========================================================================
  // PUBLIC METHODS
  // ===========================================================================

  /**
   * Get a land from in-memory cache (O(1)).
   * Storage was loaded once at construction.
   */
  get(cardName: string): LandMetadata | null {
    const normalizedName = this.normalizeName(cardName)

    const entry = this.entries.get(normalizedName)
    if (entry && !this.isExpired(entry.expiresAt)) {
      // Keep memoryCache in sync
      if (!this.memoryCache.has(normalizedName)) {
        this.memoryCache.set(normalizedName, entry.metadata)
      }
      return entry.metadata
    }

    if (entry && this.isExpired(entry.expiresAt)) {
      this.entries.delete(normalizedName)
      this.memoryCache.delete(normalizedName)
      this.markDirty()
    }

    return this.memoryCache.get(normalizedName) ?? null
  }

  /**
   * Store a land in memory and schedule a batched flush to localStorage.
   */
  set(cardName: string, metadata: LandMetadata, source: 'scryfall' | 'pattern' | 'seed'): void {
    this.setInternal(cardName, metadata, source, true)
  }

  /**
   * Check if a land is in cache and not expired (O(1) memory).
   */
  has(cardName: string): boolean {
    return this.get(cardName) !== null
  }

  /**
   * Clean up expired entries (memory + schedule flush).
   */
  cleanup(): void {
    const now = new Date()
    let removedCount = 0

    for (const [name, entry] of this.entries) {
      if (this.isExpired(entry.expiresAt)) {
        this.entries.delete(name)
        this.memoryCache.delete(name)
        removedCount++
      }
    }

    this.lastCleanup = now.toISOString()
    this.cleanupRan = true
    this.markDirty()
    this.flushSync()

    if (removedCount > 0) {
      console.debug(`[LandCacheService] Cleaned up ${removedCount} expired entries`)
    }
  }

  /**
   * Get cache statistics for debugging and monitoring.
   */
  getStats(): LandCacheStats {
    const bySource: Record<string, number> = {}

    for (const entry of this.entries.values()) {
      bySource[entry.source] = (bySource[entry.source] || 0) + 1
    }

    let storageSizeBytes: number | undefined
    try {
      const raw = localStorage.getItem(CACHE_KEY)
      if (raw) {
        storageSizeBytes = new Blob([raw]).size
      }
    } catch {
      // Ignore errors
    }

    return {
      total: this.entries.size,
      bySource,
      memorySize: this.memoryCache.size,
      storageSizeBytes,
    }
  }

  /**
   * Clear all cache (both memory and localStorage).
   */
  clear(): void {
    this.memoryCache.clear()
    this.entries.clear()
    this.dirty = false
    this.cancelScheduledFlush()

    try {
      localStorage.removeItem(CACHE_KEY)
    } catch (e) {
      console.warn('[LandCacheService] Failed to clear localStorage:', e)
    }

    console.debug('[LandCacheService] Cache cleared')
  }

  /**
   * Preload multiple lands into memory from seed data.
   * A single localStorage write is performed at the end (not per land).
   */
  preloadFromSeed(lands: Record<string, Partial<LandMetadata>>): void {
    let loadedCount = 0

    for (const [name, partialMetadata] of Object.entries(lands)) {
      // Skip if already in cache (don't overwrite fresher data)
      if (this.has(name)) {
        continue
      }

      const metadata: LandMetadata = {
        name,
        category: partialMetadata.category || 'unknown',
        produces: partialMetadata.produces || [],
        producesAny: partialMetadata.producesAny || false,
        etbBehavior: partialMetadata.etbBehavior || { type: 'always_untapped' },
        isFetch: partialMetadata.isFetch || false,
        fetchTargets: partialMetadata.fetchTargets,
        isCreatureLand: partialMetadata.isCreatureLand || false,
        hasChannel: partialMetadata.hasChannel || false,
        isMDFC: partialMetadata.isMDFC,
        otherFace: partialMetadata.otherFace,
        basicLandTypes: partialMetadata.basicLandTypes,
        confidence: partialMetadata.confidence || 100,
        producesAnyForCreaturesOnly: partialMetadata.producesAnyForCreaturesOnly,
        producesAmount: partialMetadata.producesAmount,
      }

      // Write memory only — no per-item flush
      this.setInternal(name, metadata, 'seed', false)
      loadedCount++
    }

    if (loadedCount > 0) {
      this.markDirty()
      this.flushSync()
      console.debug(`[LandCacheService] Preloaded ${loadedCount} lands from seed`)
    }
  }

  /**
   * Force a synchronous flush of dirty state to localStorage.
   * Exposed for tests and lifecycle handlers.
   */
  flushSync(): void {
    this.cancelScheduledFlush()
    if (!this.dirty) return
    this.persistToStorage()
  }

  // ===========================================================================
  // PRIVATE METHODS
  // ===========================================================================

  private setInternal(
    cardName: string,
    metadata: LandMetadata,
    source: 'scryfall' | 'pattern' | 'seed',
    scheduleFlush: boolean
  ): void {
    const normalizedName = this.normalizeName(cardName)
    const now = new Date()
    const expiresAt = new Date(now.getTime() + CACHE_TTL_DAYS * 24 * 60 * 60 * 1000)

    const entry: CachedLandEntry = {
      metadata,
      fetchedAt: now.toISOString(),
      source,
      expiresAt: expiresAt.toISOString(),
    }

    this.memoryCache.set(normalizedName, metadata)
    this.entries.set(normalizedName, entry)
    this.dirty = true

    if (this.entries.size > MAX_ENTRIES_BEFORE_CLEANUP) {
      this.evictOldestInMemory(MAX_ENTRIES_BEFORE_CLEANUP)
    }

    if (scheduleFlush) {
      this.scheduleFlush()
    }
  }

  /**
   * Load localStorage once into memory maps.
   * Corrupted JSON → empty cache (no throw).
   */
  private loadIntoMemory(): void {
    try {
      const raw = localStorage.getItem(CACHE_KEY)
      if (!raw) return

      let parsed: LandCacheStorage
      try {
        parsed = JSON.parse(raw) as LandCacheStorage
      } catch {
        console.warn('[LandCacheService] Corrupted cache JSON, resetting')
        try {
          localStorage.removeItem(CACHE_KEY)
        } catch {
          /* ignore */
        }
        return
      }

      if (parsed.version !== CACHE_VERSION) {
        console.debug('[LandCacheService] Cache version mismatch, clearing')
        try {
          localStorage.removeItem(CACHE_KEY)
        } catch {
          /* ignore */
        }
        return
      }

      this.lastCleanup = parsed.lastCleanup || new Date().toISOString()

      for (const [name, entry] of Object.entries(parsed.lands || {})) {
        if (entry && !this.isExpired(entry.expiresAt)) {
          this.entries.set(name, entry)
          this.memoryCache.set(name, entry.metadata)
        }
      }
    } catch (e) {
      console.warn('[LandCacheService] Failed to read localStorage:', e)
    }
  }

  private markDirty(): void {
    this.dirty = true
  }

  private scheduleFlush(): void {
    this.cancelScheduledFlush()

    // Prefer requestIdleCallback when available; always keep a debounce fallback.
    const ric = (
      globalThis as unknown as {
        requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number
      }
    ).requestIdleCallback

    if (typeof ric === 'function') {
      this.idleHandle = ric(() => this.flushSync(), { timeout: FLUSH_DEBOUNCE_MS * 2 })
    }

    this.flushTimer = setTimeout(() => this.flushSync(), FLUSH_DEBOUNCE_MS)
  }

  private cancelScheduledFlush(): void {
    if (this.flushTimer !== null) {
      clearTimeout(this.flushTimer)
      this.flushTimer = null
    }
    if (this.idleHandle !== null) {
      const cic = (globalThis as unknown as { cancelIdleCallback?: (id: number) => void })
        .cancelIdleCallback
      if (typeof cic === 'function') {
        cic(this.idleHandle)
      }
      this.idleHandle = null
    }
  }

  private buildStoragePayload(): LandCacheStorage {
    const lands: Record<string, CachedLandEntry> = {}
    for (const [name, entry] of this.entries) {
      lands[name] = entry
    }
    return {
      version: CACHE_VERSION,
      lastCleanup: this.lastCleanup,
      lands,
    }
  }

  /**
   * Persist memory → localStorage with quota recovery.
   */
  private persistToStorage(): void {
    const storage = this.buildStoragePayload()
    const payload = JSON.stringify(storage)

    try {
      localStorage.setItem(CACHE_KEY, payload)
      this.dirty = false
      return
    } catch (e) {
      const isQuota =
        e instanceof DOMException &&
        (e.name === 'QuotaExceededError' || e.name === 'NS_ERROR_DOM_QUOTA_REACHED')

      if (!isQuota) {
        console.warn('[LandCacheService] Failed to save to localStorage:', e)
        return
      }

      // Evict oldest entries then retry once (aligned with privacy.ts quota handling)
      this.evictOldestInMemory(MAX_ENTRIES_EMERGENCY)
      try {
        localStorage.setItem(CACHE_KEY, JSON.stringify(this.buildStoragePayload()))
        this.dirty = false
        console.debug(
          `[LandCacheService] Saved after quota eviction (${this.entries.size} entries)`
        )
      } catch {
        console.error('[LandCacheService] Failed to save even after cleanup — abandoning flush')
        // Leave dirty=true so a later flush may retry; do not throw.
      }
    }
  }

  private evictOldestInMemory(keep: number): void {
    if (this.entries.size <= keep) return

    const sorted = [...this.entries.entries()].sort(
      (a, b) => new Date(b[1].fetchedAt).getTime() - new Date(a[1].fetchedAt).getTime()
    )
    const keepSet = new Set(sorted.slice(0, keep).map(([name]) => name))

    for (const name of this.entries.keys()) {
      if (!keepSet.has(name)) {
        this.entries.delete(name)
        this.memoryCache.delete(name)
      }
    }
    this.dirty = true
  }

  private normalizeName(name: string): string {
    return name.trim()
  }

  private isExpired(expiresAt: string): boolean {
    return new Date(expiresAt) < new Date()
  }

  private lazyCleanup(): void {
    if (this.cleanupRan) return

    const lastCleanup = new Date(this.lastCleanup)
    const now = new Date()
    const daysSinceCleanup = (now.getTime() - lastCleanup.getTime()) / (1000 * 60 * 60 * 24)

    if (daysSinceCleanup > 7) {
      this.cleanup()
    } else {
      this.cleanupRan = true
    }
  }

  private attachLifecycleListeners(): void {
    if (this.listenersAttached) return
    if (typeof window === 'undefined' || typeof document === 'undefined') return

    this.listenersAttached = true

    const flush = () => this.flushSync()
    window.addEventListener('beforeunload', flush)
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') {
        flush()
      }
    })
  }
}

// =============================================================================
// SINGLETON EXPORT
// =============================================================================

/** Singleton instance of the land cache service */
export const landCacheService = new LandCacheService()

/** Export the class for testing */
export { LandCacheService }
