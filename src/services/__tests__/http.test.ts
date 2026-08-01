import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { fetchWithTimeout, HttpTimeoutError } from '../http'

describe('fetchWithTimeout (T05)', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
  })

  it('resolves a successful response', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue(new Response(JSON.stringify({ ok: true }), { status: 200 }))
    vi.stubGlobal('fetch', fetchMock)

    const promise = fetchWithTimeout('https://api.scryfall.com/cards/named?exact=Plains')
    const res = await promise
    expect(res.ok).toBe(true)
    expect(fetchMock).toHaveBeenCalledTimes(1)
  })

  it('throws HttpTimeoutError when abort fires from timeout', async () => {
    const fetchMock = vi.fn().mockImplementation((_url: string, init?: RequestInit) => {
      return new Promise((_resolve, reject) => {
        const signal = init?.signal
        if (signal) {
          signal.addEventListener('abort', () => {
            reject(new DOMException('The operation was aborted.', 'AbortError'))
          })
        }
      })
    })
    vi.stubGlobal('fetch', fetchMock)

    const promise = fetchWithTimeout(
      'https://api.scryfall.com/slow',
      {},
      { timeoutMs: 100, retries: 0 }
    )
    // Attach rejection handler before advancing timers
    const assertion = expect(promise).rejects.toBeInstanceOf(HttpTimeoutError)
    await vi.advanceTimersByTimeAsync(150)
    await assertion
  })

  it('retries on 429 then succeeds', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(new Response('rate limited', { status: 429 }))
      .mockResolvedValueOnce(new Response(JSON.stringify({ name: 'Plains' }), { status: 200 }))
    vi.stubGlobal('fetch', fetchMock)

    const promise = fetchWithTimeout(
      'https://api.scryfall.com/cards/named',
      {},
      { timeoutMs: 5000, retries: 1 }
    )
    // Allow backoff sleep(500) to complete
    const resultPromise = promise.then((r) => r)
    await vi.advanceTimersByTimeAsync(600)
    const res = await resultPromise

    expect(res.status).toBe(200)
    expect(fetchMock).toHaveBeenCalledTimes(2)
  })

  it('does not retry on 404', async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response('not found', { status: 404 }))
    vi.stubGlobal('fetch', fetchMock)

    const res = await fetchWithTimeout(
      'https://api.scryfall.com/cards/named?exact=Nope',
      {},
      { timeoutMs: 5000, retries: 1 }
    )

    expect(res.status).toBe(404)
    expect(fetchMock).toHaveBeenCalledTimes(1)
  })

  it('propagates external abort signal', async () => {
    const controller = new AbortController()
    const fetchMock = vi.fn().mockImplementation((_url: string, init?: RequestInit) => {
      return new Promise((_resolve, reject) => {
        init?.signal?.addEventListener('abort', () => {
          reject(new DOMException('The operation was aborted.', 'AbortError'))
        })
      })
    })
    vi.stubGlobal('fetch', fetchMock)

    const promise = fetchWithTimeout(
      'https://api.scryfall.com/cards/named',
      {},
      { timeoutMs: 10000, retries: 0, signal: controller.signal }
    )
    const assertion = expect(promise).rejects.toMatchObject({ name: 'AbortError' })
    controller.abort()
    await assertion
  })

  it('respects Retry-After header on 429', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(
        new Response('rate limited', {
          status: 429,
          headers: { 'Retry-After': '2' },
        })
      )
      .mockResolvedValueOnce(new Response('ok', { status: 200 }))
    vi.stubGlobal('fetch', fetchMock)

    const promise = fetchWithTimeout(
      'https://api.scryfall.com/cards/collection',
      { method: 'POST' },
      { timeoutMs: 5000, retries: 1 }
    )
    // Retry-After: 2 seconds
    await vi.advanceTimersByTimeAsync(2100)
    const res = await promise
    expect(res.status).toBe(200)
    expect(fetchMock).toHaveBeenCalledTimes(2)
  })
})
