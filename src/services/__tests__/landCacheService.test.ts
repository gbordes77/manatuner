import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { LandCacheService } from '../landCacheService'
import type { LandMetadata } from '@/types/lands'

const CACHE_KEY = 'manatuner_lands_cache'

/**
 * Project setup (tests/setup.js) replaces global.localStorage with vi.fn() stubs
 * that do not store values. Provide a real in-memory backend for these tests.
 */
function installMemoryLocalStorage() {
  const store = new Map<string, string>()
  const getItem = vi.fn((key: string) => store.get(key) ?? null)
  const setItem = vi.fn((key: string, value: string) => {
    store.set(key, String(value))
  })
  const removeItem = vi.fn((key: string) => {
    store.delete(key)
  })
  const clear = vi.fn(() => {
    store.clear()
  })

  Object.defineProperty(globalThis, 'localStorage', {
    configurable: true,
    value: {
      getItem,
      setItem,
      removeItem,
      clear,
      get length() {
        return store.size
      },
      key: () => null,
    },
  })

  return { store, getItem, setItem, removeItem, clear }
}

function sampleMeta(name: string): LandMetadata {
  return {
    name,
    category: 'basic',
    produces: ['R'],
    producesAny: false,
    etbBehavior: { type: 'always_untapped' },
    isFetch: false,
    isCreatureLand: false,
    hasChannel: false,
    confidence: 100,
  }
}

describe('LandCacheService batched writes (T04)', () => {
  let ls: ReturnType<typeof installMemoryLocalStorage>

  beforeEach(() => {
    ls = installMemoryLocalStorage()
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
    ls.clear()
  })

  it('batch flush: N set() during preload → single setItem', () => {
    const service = new LandCacheService()
    ls.setItem.mockClear()

    const seed: Record<string, Partial<LandMetadata>> = {}
    for (let i = 0; i < 50; i++) {
      seed[`Test Land ${i}`] = sampleMeta(`Test Land ${i}`)
    }

    service.preloadFromSeed(seed)

    // Exactly one durable write for the whole batch
    const cacheWrites = ls.setItem.mock.calls.filter(([key]) => key === CACHE_KEY)
    expect(cacheWrites.length).toBe(1)

    // All 50 readable from memory
    expect(service.has('Test Land 0')).toBe(true)
    expect(service.has('Test Land 49')).toBe(true)
    expect(service.getStats().total).toBe(50)
  })

  it('individual set() is deferred — not flushed synchronously', () => {
    const service = new LandCacheService()
    ls.setItem.mockClear()

    service.set('Mountain', sampleMeta('Mountain'), 'scryfall')
    // Still only in memory — no sync write yet
    expect(ls.setItem).not.toHaveBeenCalled()
    expect(service.get('Mountain')?.name).toBe('Mountain')

    // After debounce, flush runs
    vi.advanceTimersByTime(600)
    const cacheWrites = ls.setItem.mock.calls.filter(([key]) => key === CACHE_KEY)
    expect(cacheWrites.length).toBeGreaterThanOrEqual(1)
  })

  it('recovers from corrupted localStorage JSON', () => {
    ls.store.set(CACHE_KEY, '{not valid json!!!')
    const service = new LandCacheService()

    // Starts empty, does not throw
    expect(service.getStats().total).toBe(0)
    expect(service.get('Plains')).toBeNull()

    // Can still write after recovery
    service.set('Plains', sampleMeta('Plains'), 'seed')
    expect(service.get('Plains')?.name).toBe('Plains')
  })

  it('on QuotaExceededError: evicts oldest then retries once', () => {
    const service = new LandCacheService()

    for (let i = 0; i < 20; i++) {
      service.set(`Land ${i}`, sampleMeta(`Land ${i}`), 'seed')
    }
    service.flushSync()
    ls.setItem.mockClear()

    let callCount = 0
    ls.setItem.mockImplementation((key: string, value: string) => {
      if (key === CACHE_KEY) {
        callCount++
        if (callCount === 1) {
          throw new DOMException('quota', 'QuotaExceededError')
        }
        ls.store.set(key, String(value))
      } else {
        ls.store.set(key, String(value))
      }
    })

    service.set('Extra Land', sampleMeta('Extra Land'), 'scryfall')
    service.flushSync()

    expect(callCount).toBeGreaterThanOrEqual(2)
    expect(service.get('Extra Land')?.name).toBe('Extra Land')
  })

  it('persists across instances after flush (session reload simulation)', () => {
    const a = new LandCacheService()
    a.preloadFromSeed({
      Island: sampleMeta('Island'),
      Swamp: sampleMeta('Swamp'),
    })
    a.flushSync()

    // New instance reloads from localStorage
    const b = new LandCacheService()
    expect(b.get('Island')?.name).toBe('Island')
    expect(b.get('Swamp')?.name).toBe('Swamp')
  })
})
