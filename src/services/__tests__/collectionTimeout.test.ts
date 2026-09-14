import { beforeEach, afterEach, describe, expect, it, vi } from 'vitest'

const cards = [
  {
    id: 'qa-plains',
    name: 'Plains',
    type_line: 'Basic Land — Plains',
    layout: 'normal',
    cmc: 0,
    colors: [],
    color_identity: ['W'],
    produced_mana: ['W'],
    oracle_text: '{T}: Add {W}.',
  },
  {
    id: 'qa-lions',
    name: 'Savannah Lions',
    type_line: 'Creature — Cat',
    layout: 'normal',
    cmc: 1,
    mana_cost: '{W}',
    colors: ['W'],
    color_identity: ['W'],
  },
]

describe('collection-only outage stays inside the analysis deadline', () => {
  beforeEach(() => {
    vi.resetModules()
    vi.useFakeTimers()
  })
  afterEach(() => {
    vi.useRealTimers()
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
  })
  function mockOutage() {
    let releasePost!: (response: Response) => void
    const fetchMock = vi.fn((url: string) => {
      if (url.includes('/collection'))
        return new Promise<Response>((resolve) => {
          releasePost = resolve
        })
      const params = new URL(url).searchParams
      const name = params.get('exact') || params.get('fuzzy')
      const card = cards.find((c) => c.name === name)
      return Promise.resolve(new Response(JSON.stringify(card || {}), { status: card ? 200 : 404 }))
    })
    vi.stubGlobal('fetch', fetchMock)
    return {
      fetchMock,
      late: () =>
        releasePost(new Response(JSON.stringify({ data: [{ ...cards[0], name: 'STALE' }] }))),
    }
  }
  it('finishes a real deck analysis via named GET when every collection hangs', async () => {
    const { DeckAnalyzer } = await import('../deckAnalyzer')
    const { fetchMock, late } = mockOutage()
    const result = DeckAnalyzer.analyzeDeck('24 Plains\n36 Savannah Lions').catch((error) => error)
    await vi.advanceTimersByTimeAsync(20_000)
    const analysis = await result
    expect(analysis.totalCards).toBe(60)
    expect(analysis.totalLands).toBe(24)
    expect(analysis.cards.some((c: { name: string }) => c.name === 'Savannah Lions')).toBe(true)
    expect(fetchMock.mock.calls.some(([url]) => url.includes('/named?exact='))).toBe(true)
    expect(fetchMock.mock.calls.some(([url]) => url.includes('fuzzy='))).toBe(false)
    late()
    await vi.advanceTimersByTimeAsync(100)
    expect(analysis.cards.some((c: { name: string }) => c.name === 'STALE')).toBe(false)
  })
  it('recovers land metadata through GET after a local collection timeout', async () => {
    const { fetchLandDataBatch } = await import('../scryfall')
    mockOutage()
    const result = fetchLandDataBatch(['Plains']).catch((error) => error)
    await vi.advanceTimersByTimeAsync(9000)
    const lands = await result
    expect(lands.get('Plains')?.produced_mana).toEqual(['W'])
  })
  it('does not fall back after user cancellation', async () => {
    const { batchFetchFromScryfall } = await import('../cardResolver')
    const { fetchMock } = mockOutage()
    const controller = new AbortController()
    const result = batchFetchFromScryfall(['Plains'], controller.signal).catch(
      (error) => error.name
    )
    await vi.advanceTimersByTimeAsync(100)
    controller.abort()
    await vi.advanceTimersByTimeAsync(10_000)
    expect(await result).toBe('AbortError')
    expect(fetchMock).toHaveBeenCalledTimes(1)
  })
  it('does not fall back after the parent deadline expires', async () => {
    const { batchFetchFromScryfall } = await import('../cardResolver')
    const { withTimeout } = await import('../http')
    const { fetchMock } = mockOutage()
    const result = withTimeout((signal) => batchFetchFromScryfall(['Plains'], signal), 1000).catch(
      (error) => error.name
    )
    await vi.advanceTimersByTimeAsync(10_000)
    expect(await result).toBe('HttpTimeoutError')
    expect(fetchMock).toHaveBeenCalledTimes(1)
  })
  it('keeps the original 30-second deadline while named fallbacks are in flight', async () => {
    const { DeckAnalyzer } = await import('../deckAnalyzer')
    const fetchMock = vi.fn((url: string, _init?: RequestInit) => {
      if (url.includes('/collection')) return new Promise<Response>(() => {})
      const name = new URL(url).searchParams.get('exact') || 'Unknown'
      return new Promise<Response>((resolve) =>
        setTimeout(() => resolve(new Response(JSON.stringify({ ...cards[1], name }))), 6000)
      )
    })
    vi.stubGlobal('fetch', fetchMock)
    const result = DeckAnalyzer.analyzeDeck('24 Plains\n18 Savannah Lions\n18 QA Slow Spell').catch(
      (error) => error
    )
    await vi.advanceTimersByTimeAsync(29_999)
    const count = fetchMock.mock.calls.length
    expect(fetchMock.mock.calls.some(([url]) => url.includes('/named?exact='))).toBe(true)
    await vi.advanceTimersByTimeAsync(1)
    expect((await result).name).toBe('HttpTimeoutError')
    expect(fetchMock.mock.calls[count - 1][1]?.signal?.aborted).toBe(true)
    await vi.advanceTimersByTimeAsync(10_000)
    expect(fetchMock).toHaveBeenCalledTimes(count)
  })
})
