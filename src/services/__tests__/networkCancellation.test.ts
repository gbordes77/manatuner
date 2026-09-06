import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { fetchWithTimeout } from '../http'
import { clearCardResolverCache } from '../cardResolver'
import { clearLandDataCache } from '../scryfall'
import { DeckAnalyzer } from '../deckAnalyzer'

describe('F08 network cancellation', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    clearCardResolverCache()
    clearLandDataCache()
  })
  afterEach(() => {
    vi.useRealTimers()
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
  })
  it('rejects abort during Retry-After without sending a second fetch', async () => {
    const controller = new AbortController()
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(new Response('', { status: 429, headers: { 'Retry-After': '0.02' } }))
      .mockResolvedValue(new Response('{}', { status: 200 }))
    vi.stubGlobal('fetch', fetchMock)
    const promise = fetchWithTimeout(
      'https://example.test/cards',
      {},
      { signal: controller.signal }
    )
    const assertion = expect(promise).rejects.toMatchObject({ name: 'AbortError' })
    await vi.advanceTimersByTimeAsync(5)
    controller.abort()
    await vi.advanceTimersByTimeAsync(100)
    await assertion
    expect(fetchMock).toHaveBeenCalledTimes(1)
  })
  it('analysis passes cancellation into the first collection and starts no fallback', async () => {
    const controller = new AbortController()
    const signals: Array<AbortSignal | null | undefined> = []
    const fetchMock = vi.fn((_url: string, init?: RequestInit) => {
      signals.push(init?.signal)
      controller.abort()
      return Promise.resolve(new Response(JSON.stringify({ data: [] }), { status: 200 }))
    })
    vi.stubGlobal('fetch', fetchMock)
    const assertion = expect(
      DeckAnalyzer.analyzeDeck('24 Mountain\n36 Lightning Bolt', { signal: controller.signal })
    ).rejects.toMatchObject({ name: 'AnalysisCancelledError' })
    await vi.runAllTimersAsync()
    await assertion
    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(signals[0]?.aborted).toBe(true)
  })
})

describe('F08 resolver lineage and cache integrity', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    clearCardResolverCache()
    clearLandDataCache()
  })
  afterEach(() => {
    vi.useRealTimers()
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
  })

  it('cancels a land collection body without falling back or caching absence', async () => {
    const { fetchLandDataBatch, getLandDataCacheStats } = await import('../scryfall')
    const controller = new AbortController()
    const json = vi.fn(() => new Promise(() => {}))
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, status: 200, json })
    vi.stubGlobal('fetch', fetchMock)
    const outcome = fetchLandDataBatch(['F08 Test Land'], controller.signal).catch((error) => error)
    await vi.advanceTimersByTimeAsync(100)
    expect(json).toHaveBeenCalledOnce()
    controller.abort()
    expect(await outcome).toMatchObject({ name: 'AbortError' })
    expect(fetchMock).toHaveBeenCalledOnce()
    expect(getLandDataCacheStats().total).toBe(0)
  })

  it('cancels exact-to-fuzzy card fallback and does not cache an aborted response', async () => {
    const { fetchCardFromScryfallWithMeta, getCardResolverCacheSize } =
      await import('../cardResolver')
    const controller = new AbortController()
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(new Response('', { status: 404 }))
      .mockImplementationOnce((_url: string, init?: RequestInit) => {
        expect(init?.signal).toBeDefined()
        controller.abort()
        return Promise.resolve(new Response('{"name":"F08 Spell"}'))
      })
    vi.stubGlobal('fetch', fetchMock)
    await expect(
      fetchCardFromScryfallWithMeta('F08 Spell', controller.signal)
    ).rejects.toMatchObject({ name: 'AbortError' })
    expect(fetchMock).toHaveBeenCalledTimes(2)
    expect(getCardResolverCacheSize()).toBe(0)
  })

  it('distinguishes exact+fuzzy 404 from transient card failure', async () => {
    const { fetchCardFromScryfallWithMeta } = await import('../cardResolver')
    const fetchMock = vi
      .fn()
      .mockImplementation(() => Promise.resolve(new Response('', { status: 404 })))
    vi.stubGlobal('fetch', fetchMock)
    expect(await fetchCardFromScryfallWithMeta('F08 Absent')).toEqual({
      data: null,
      notFound: true,
    })
    fetchMock.mockImplementation(() =>
      Promise.resolve(new Response('', { status: 503, headers: { 'Retry-After': '0.01' } }))
    )
    const result = fetchCardFromScryfallWithMeta('F08 Offline')
    await vi.runAllTimersAsync()
    expect(await result).toEqual({ data: null, notFound: false })
  })

  it('does not negative-cache transient land failures and can recover', async () => {
    const { fetchLandData, getLandDataCacheStats } = await import('../scryfall')
    const fetchMock = vi
      .fn()
      .mockImplementation(() =>
        Promise.resolve(new Response('', { status: 503, headers: { 'Retry-After': '0.01' } }))
      )
    vi.stubGlobal('fetch', fetchMock)
    const failed = fetchLandData('F08 Recovery Land')
    await vi.runAllTimersAsync()
    expect(await failed).toBeNull()
    expect(getLandDataCacheStats().total).toBe(0)
    fetchMock.mockImplementation(() =>
      Promise.resolve(
        new Response(
          JSON.stringify({
            name: 'F08 Recovery Land',
            type_line: 'Land',
            layout: 'normal',
            produced_mana: ['G'],
          })
        )
      )
    )
    const recovered = fetchLandData('F08 Recovery Land')
    await vi.runAllTimersAsync()
    expect((await recovered)?.name).toBe('F08 Recovery Land')
    expect(getLandDataCacheStats().lands).toBe(1)
    fetchMock.mockClear()
    expect((await fetchLandData('F08 Recovery Land'))?.name).toBe('F08 Recovery Land')
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('bounds the entire sequential deck resolution at 30 seconds', async () => {
    const { HttpTimeoutError } = await import('../http')
    const signals: AbortSignal[] = []
    const fetchMock = vi.fn((_url: string, init?: RequestInit) => {
      signals.push(init!.signal!)
      // Each individual response fits in 8 seconds; accumulated resolution cannot.
      return new Promise<Response>((resolve) =>
        setTimeout(() => resolve(new Response(JSON.stringify({ data: [] }))), 6000)
      )
    })
    vi.stubGlobal('fetch', fetchMock)
    const input = Array.from({ length: 76 }, (_, index) => `1 F08 Unknown ${index}`).join('\n')
    const outcome = DeckAnalyzer.analyzeDeck(input).catch((error) => error)
    await vi.advanceTimersByTimeAsync(29999)
    const calls = fetchMock.mock.calls.length
    expect(calls).toBeGreaterThan(1)
    await vi.advanceTimersByTimeAsync(1)
    expect(await outcome).toBeInstanceOf(HttpTimeoutError)
    expect(signals[signals.length - 1]?.aborted).toBe(true)
    await vi.advanceTimersByTimeAsync(10000)
    expect(fetchMock).toHaveBeenCalledTimes(calls)
  })
})
