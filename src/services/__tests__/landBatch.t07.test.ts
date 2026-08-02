/**
 * T07 — batch unknown land detection non-regression.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { clearLandDataCache, fetchLandDataBatch, SCRYFALL_COLLECTION_CHUNK_SIZE } from '../scryfall'
import { landService } from '../landService'
import { landCacheService } from '../landCacheService'

const COLLECTION_URL = 'https://api.scryfall.com/cards/collection'

function mockLandCard(name: string, type = 'Land — Forest', oracle = '{T}: Add {G}.') {
  return {
    object: 'card',
    id: `id-${name}`,
    name,
    type_line: type,
    oracle_text: oracle,
    produced_mana: ['G'],
    layout: 'normal',
    keywords: [] as string[],
  }
}

describe('T07 fetchLandDataBatch', () => {
  beforeEach(() => {
    clearLandDataCache()
    vi.restoreAllMocks()
  })
  afterEach(() => {
    vi.unstubAllGlobals()
    clearLandDataCache()
  })

  it('SCRYFALL_COLLECTION_CHUNK_SIZE is 75', () => {
    expect(SCRYFALL_COLLECTION_CHUNK_SIZE).toBe(75)
  })

  it('batches via collection endpoint and returns land data', async () => {
    const fetchMock = vi.fn(async (input: RequestInfo | URL) => {
      const url = String(input)
      if (url.includes('/cards/collection')) {
        return {
          ok: true,
          json: async () => ({
            object: 'list',
            data: [mockLandCard('Yavimaya Coast', 'Land', '{T}: Add {G} or {U}.')],
            not_found: [],
          }),
        } as Response
      }
      throw new Error(`unexpected fetch ${url}`)
    })
    vi.stubGlobal('fetch', fetchMock)

    const map = await fetchLandDataBatch(['Yavimaya Coast'])
    expect(map.get('Yavimaya Coast')).not.toBeNull()
    expect(map.get('Yavimaya Coast')?.name).toBe('Yavimaya Coast')
    expect(fetchMock).toHaveBeenCalled()
    const collectionCalls = fetchMock.mock.calls.filter((c) =>
      String(c[0]).includes('/cards/collection')
    )
    expect(collectionCalls.length).toBe(1)
  })

  it('chunks requests at 75 identifiers', async () => {
    const names = Array.from({ length: 80 }, (_, i) => `Fake Land ${i}`)
    const collectionBodies: number[] = []
    const fetchMock = vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
      const url = String(input)
      if (url.includes('/cards/collection')) {
        const body = JSON.parse(String(init?.body || '{}'))
        const identifiers: { name: string }[] = body.identifiers || []
        collectionBodies.push(identifiers.length)
        // Return synthetic lands so we skip the slow not_found → named path
        return {
          ok: true,
          headers: { get: () => null },
          json: async () => ({
            object: 'list',
            data: identifiers.map((id) => mockLandCard(id.name)),
            not_found: [],
          }),
        } as unknown as Response
      }
      throw new Error(`unexpected named call during chunk test: ${url}`)
    })
    vi.stubGlobal('fetch', fetchMock)

    await fetchLandDataBatch(names)
    expect(collectionBodies.length).toBe(2)
    expect(collectionBodies[0]).toBe(75)
    expect(collectionBodies[1]).toBe(5)
  })

  it('not_found falls back to /cards/named', async () => {
    const fetchMock = vi.fn(async (input: RequestInfo | URL) => {
      const url = String(input)
      if (url.includes('/cards/collection')) {
        return {
          ok: true,
          json: async () => ({
            object: 'list',
            data: [],
            not_found: [{ name: 'Misty Rainforest' }],
          }),
        } as Response
      }
      if (url.includes('/cards/named')) {
        return {
          ok: true,
          json: async () =>
            mockLandCard(
              'Misty Rainforest',
              'Land',
              '{T}, Pay 1 life, Sacrifice ~: Search your library for a Island or Forest card.'
            ),
        } as Response
      }
      throw new Error(`unexpected ${url}`)
    })
    vi.stubGlobal('fetch', fetchMock)

    const map = await fetchLandDataBatch(['Misty Rainforest'])
    expect(map.get('Misty Rainforest')?.name).toBe('Misty Rainforest')
    expect(fetchMock.mock.calls.some((c) => String(c[0]).includes('/cards/named'))).toBe(true)
  })

  it('batch failure falls back to sequential named', async () => {
    let collectionTried = false
    const fetchMock = vi.fn(async (input: RequestInfo | URL) => {
      const url = String(input)
      if (url.includes('/cards/collection')) {
        collectionTried = true
        return {
          ok: false,
          status: 500,
          headers: { get: () => null },
          json: async () => ({}),
        } as unknown as Response
      }
      if (url.includes('/cards/named')) {
        return {
          ok: true,
          headers: { get: () => null },
          json: async () => mockLandCard('Breeding Pool', 'Land — Forest Island'),
        } as unknown as Response
      }
      throw new Error(url)
    })
    vi.stubGlobal('fetch', fetchMock)

    const map = await fetchLandDataBatch(['Breeding Pool'])
    expect(collectionTried).toBe(true)
    expect(map.get('Breeding Pool')?.name).toBe('Breeding Pool')
  })
})

describe('T07 landService.prefetchUnknownLands', () => {
  beforeEach(() => {
    clearLandDataCache()
    vi.restoreAllMocks()
  })
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('zero network for full-seed deck names (basics)', async () => {
    const fetchMock = vi.fn()
    vi.stubGlobal('fetch', fetchMock)

    const n = await landService.prefetchUnknownLands([
      'Forest',
      'Island',
      'Mountain',
      'Swamp',
      'Plains',
      'Forest', // dedupe
    ])
    expect(n).toBe(0)
    expect(fetchMock).not.toHaveBeenCalled()
    expect(landService.getLandSync('Forest')).not.toBeNull()
  })

  it('batches unknown names and populates landCache', async () => {
    const fetchMock = vi.fn(async (input: RequestInfo | URL) => {
      const url = String(input)
      if (url.includes('/cards/collection')) {
        return {
          ok: true,
          json: async () => ({
            object: 'list',
            data: [mockLandCard('Exotic Orchard', 'Land', '{T}: Add one mana of any color.')],
            not_found: [],
          }),
        } as Response
      }
      throw new Error(url)
    })
    vi.stubGlobal('fetch', fetchMock)

    // Ensure not in seed (Exotic Orchard may or may not be in seed — clear path)
    const syncBefore = landService.getLandSync('Exotic Orchard')
    if (syncBefore) {
      // Already seeded — still assert zero extra if hit
      const n = await landService.prefetchUnknownLands(['Exotic Orchard'])
      expect(n).toBe(0)
      expect(fetchMock).not.toHaveBeenCalled()
      return
    }

    const n = await landService.prefetchUnknownLands(['Exotic Orchard', 'Exotic Orchard'])
    expect(n).toBe(1)
    expect(landService.getLandSync('Exotic Orchard')).not.toBeNull()
    expect(landCacheService.get('Exotic Orchard')).not.toBeNull()
  })
})

// Keep COLLECTION_URL referenced for future assertion helpers
void COLLECTION_URL
