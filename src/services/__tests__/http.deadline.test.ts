import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { fetchJsonWithTimeout, fetchWithTimeout, HttpTimeoutError } from '../http'

describe('F08 total HTTP deadline and JSON bodies', () => {
  beforeEach(() => vi.useFakeTimers())
  afterEach(() => {
    vi.useRealTimers()
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
  })

  it('rejects pre-aborted signals including RequestInit signal without fetching', async () => {
    const controller = new AbortController()
    controller.abort()
    const fetchMock = vi.fn()
    vi.stubGlobal('fetch', fetchMock)
    await expect(
      fetchWithTimeout('https://example.test', { signal: controller.signal })
    ).rejects.toMatchObject({ name: 'AbortError' })
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('keeps cancellation active after headers while JSON never settles', async () => {
    const controller = new AbortController()
    let networkSignal: AbortSignal | null | undefined
    const json = vi.fn(() => new Promise(() => {}))
    vi.stubGlobal(
      'fetch',
      vi.fn((_url, init) => {
        networkSignal = init.signal
        return Promise.resolve({ ok: true, status: 200, json })
      })
    )
    const outcome = fetchJsonWithTimeout(
      'https://example.test',
      {},
      { signal: controller.signal }
    ).catch((error) => error)
    await vi.advanceTimersByTimeAsync(1)
    expect(json).toHaveBeenCalledOnce()
    controller.abort()
    expect(await outcome).toMatchObject({ name: 'AbortError' })
    expect(networkSignal?.aborted).toBe(true)
    expect(vi.getTimerCount()).toBe(0)
  })

  it('bounds JSON that ignores abort and preserves timeout identity', async () => {
    let networkSignal: AbortSignal | null | undefined
    vi.stubGlobal(
      'fetch',
      vi.fn((_url, init) => {
        networkSignal = init.signal
        return Promise.resolve({ ok: true, status: 200, json: () => new Promise(() => {}) })
      })
    )
    const outcome = fetchJsonWithTimeout('https://example.test', {}, { timeoutMs: 100 }).catch(
      (error) => error
    )
    await vi.advanceTimersByTimeAsync(100)
    expect(await outcome).toBeInstanceOf(HttpTimeoutError)
    expect(networkSignal?.aborted).toBe(true)
    expect(vi.getTimerCount()).toBe(0)
  })

  it('does not reset the budget for a retry or accelerate a long Retry-After', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue(new Response('', { status: 429, headers: { 'Retry-After': '10' } }))
    vi.stubGlobal('fetch', fetchMock)
    const outcome = fetchJsonWithTimeout('https://example.test', {}, { timeoutMs: 1000 }).catch(
      (error) => error
    )
    await vi.advanceTimersByTimeAsync(1000)
    expect(await outcome).toBeInstanceOf(HttpTimeoutError)
    expect(fetchMock).toHaveBeenCalledOnce()
    expect(vi.getTimerCount()).toBe(0)
  })

  it('does not overflow the timer for a huge Retry-After', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue(new Response('', { status: 429, headers: { 'Retry-After': '31536000' } }))
    vi.stubGlobal('fetch', fetchMock)
    const outcome = fetchJsonWithTimeout('https://example.test', {}, { timeoutMs: 1000 }).catch(
      (error) => error
    )
    await vi.advanceTimersByTimeAsync(1000)
    expect(await outcome).toBeInstanceOf(HttpTimeoutError)
    expect(fetchMock).toHaveBeenCalledOnce()
  })

  it('uses the remaining budget for a retry body', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(new Response('', { status: 503, headers: { 'Retry-After': '0.05' } }))
      .mockResolvedValueOnce({ ok: true, status: 200, json: () => new Promise(() => {}) })
    vi.stubGlobal('fetch', fetchMock)
    const outcome = fetchJsonWithTimeout('https://example.test', {}, { timeoutMs: 100 }).catch(
      (error) => error
    )
    await vi.advanceTimersByTimeAsync(100)
    expect(await outcome).toBeInstanceOf(HttpTimeoutError)
    expect(fetchMock).toHaveBeenCalledTimes(2)
  })

  it.each([429, 500, 503])('retries %i only once and reads successful JSON', async (status) => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(new Response('', { status, headers: { 'Retry-After': '0.02' } }))
      .mockResolvedValueOnce(new Response('{"name":"Forest"}', { status: 200 }))
    vi.stubGlobal('fetch', fetchMock)
    const outcome = fetchJsonWithTimeout<{ name: string }>('https://example.test')
    await vi.advanceTimersByTimeAsync(19)
    expect(fetchMock).toHaveBeenCalledOnce()
    await vi.advanceTimersByTimeAsync(1)
    expect((await outcome).data?.name).toBe('Forest')
    expect(fetchMock).toHaveBeenCalledTimes(2)
  })

  it('handles HTTP-date Retry-After without sending early', async () => {
    vi.setSystemTime(new Date('2026-09-06T00:00:00Z'))
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(
        new Response('', {
          status: 429,
          headers: { 'Retry-After': 'Sun, 06 Sep 2026 00:00:02 GMT' },
        })
      )
      .mockResolvedValueOnce(new Response('{}'))
    vi.stubGlobal('fetch', fetchMock)
    const outcome = fetchJsonWithTimeout('https://example.test')
    await vi.advanceTimersByTimeAsync(1999)
    expect(fetchMock).toHaveBeenCalledOnce()
    await vi.advanceTimersByTimeAsync(1)
    await outcome
    expect(fetchMock).toHaveBeenCalledTimes(2)
  })

  it.each([400, 404])('does not retry permanent HTTP %i or parse its body', async (status) => {
    const json = vi.fn()
    const fetchMock = vi.fn().mockResolvedValue({ ok: false, status, json })
    vi.stubGlobal('fetch', fetchMock)
    const result = await fetchJsonWithTimeout('https://example.test')
    expect(result.response.status).toBe(status)
    expect(result.data).toBeUndefined()
    expect(fetchMock).toHaveBeenCalledOnce()
    expect(json).not.toHaveBeenCalled()
  })

  it('does not retry malformed JSON or network failures', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(new Response('{'))
      .mockRejectedValueOnce(new TypeError('offline'))
    vi.stubGlobal('fetch', fetchMock)
    await expect(fetchJsonWithTimeout('https://example.test')).rejects.toBeInstanceOf(SyntaxError)
    await expect(fetchJsonWithTimeout('https://example.test')).rejects.toBeInstanceOf(TypeError)
    expect(fetchMock).toHaveBeenCalledTimes(2)
  })
})
