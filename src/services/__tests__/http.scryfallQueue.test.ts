import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

describe('Scryfall shared pacing B04', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.resetModules()
  })
  afterEach(() => {
    vi.useRealTimers()
    vi.unstubAllGlobals()
  })
  it('spaces concurrent collection, named, metadata and retry attempts globally', async () => {
    const { fetchWithTimeout } = await import('../http')
    const starts: number[] = []
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => {
        starts.push(Date.now())
        return new Response('', {
          status: starts.length === 1 ? 429 : 404,
          headers: { 'Retry-After': '0' },
        })
      })
    )
    const pending = Promise.all(
      ['collection', 'named?exact=A', 'named?fuzzy=B'].map((path) =>
        fetchWithTimeout(`https://api.scryfall.com/cards/${path}`)
      )
    )
    await vi.advanceTimersByTimeAsync(2000)
    await pending
    expect(starts).toHaveLength(4)
    for (let i = 1; i < starts.length; i++)
      expect(starts[i] - starts[i - 1]).toBeGreaterThanOrEqual(100)
  })
  it('shares Retry-After with other queued requests', async () => {
    const { fetchWithTimeout } = await import('../http')
    const starts: number[] = []
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => {
        starts.push(Date.now())
        return new Response('', {
          status: starts.length === 1 ? 429 : 404,
          headers: { 'Retry-After': '2' },
        })
      })
    )
    const pending = Promise.all(
      ['A', 'B'].map((name) =>
        fetchWithTimeout(`https://api.scryfall.com/cards/named?exact=${name}`)
      )
    )
    await vi.advanceTimersByTimeAsync(3000)
    await pending
    expect(starts).toHaveLength(3)
    expect(starts[1] - starts[0]).toBeGreaterThanOrEqual(2000)
  })
  it('cancels queued work without sending it and ignores a late response', async () => {
    const { fetchJsonWithTimeout } = await import('../http')
    let resolveFirst!: (response: Response) => void
    const fetchMock = vi
      .fn()
      .mockImplementationOnce(
        () =>
          new Promise<Response>((resolve) => {
            resolveFirst = resolve
          })
      )
      .mockResolvedValue(new Response('{"name":"New"}', { status: 200 }))
    vi.stubGlobal('fetch', fetchMock)
    const old = new AbortController()
    const queued = new AbortController()
    const first = fetchJsonWithTimeout(
      'https://api.scryfall.com/cards/named?exact=Old',
      {},
      { signal: old.signal }
    ).catch((error) => error.name)
    const second = fetchJsonWithTimeout(
      'https://api.scryfall.com/cards/named?exact=Queued',
      {},
      { signal: queued.signal }
    ).catch((error) => error.name)
    await vi.advanceTimersByTimeAsync(0)
    queued.abort()
    old.abort()
    expect(await first).toBe('AbortError')
    expect(await second).toBe('AbortError')
    resolveFirst(new Response('{"name":"Old"}', { status: 200 }))
    const fresh = fetchJsonWithTimeout('https://api.scryfall.com/cards/named?exact=New')
    await vi.advanceTimersByTimeAsync(500)
    expect((await fresh).data).toEqual({ name: 'New' })
    expect(fetchMock).toHaveBeenCalledTimes(2)
  })
  it('includes waiting in the deadline and never retries past long Retry-After', async () => {
    const { fetchWithTimeout } = await import('../http')
    const fetchMock = vi.fn(
      async () => new Response('', { status: 429, headers: { 'Retry-After': '60' } })
    )
    vi.stubGlobal('fetch', fetchMock)
    const first = fetchWithTimeout(
      'https://api.scryfall.com/cards/collection',
      {},
      { timeoutMs: 1000 }
    ).catch((error) => error.name)
    await vi.advanceTimersByTimeAsync(1100)
    expect(await first).toBe('HttpTimeoutError')
    const second = fetchWithTimeout(
      'https://api.scryfall.com/cards/named?exact=A',
      {},
      { timeoutMs: 1000 }
    ).catch((error) => error.name)
    await vi.advanceTimersByTimeAsync(1100)
    expect(await second).toBe('HttpTimeoutError')
    expect(fetchMock).toHaveBeenCalledTimes(1)
  })
  it('paces actual fetch starts even when the first Headers preparation is slow', async () => {
    const { fetchWithTimeout } = await import('../http')
    const NativeHeaders = globalThis.Headers
    let first = true
    vi.stubGlobal(
      'Headers',
      class extends NativeHeaders {
        constructor(init?: HeadersInit) {
          super(init)
          if (first) {
            first = false
            // Local deterministic stand-in for one-time lazy Headers initialization.
            vi.advanceTimersByTime(25)
          }
        }
      }
    )
    const starts: number[] = []
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => {
        starts.push(performance.now())
        return new Response('', { status: 404 })
      })
    )
    const pending = Promise.all(
      ['A', 'B'].map((name) =>
        fetchWithTimeout(`https://api.scryfall.com/cards/named?exact=${name}`)
      )
    )
    await vi.advanceTimersByTimeAsync(500)
    await pending
    expect(starts).toHaveLength(2)
    expect(starts[1] - starts[0]).toBeGreaterThanOrEqual(100)
  })
})
