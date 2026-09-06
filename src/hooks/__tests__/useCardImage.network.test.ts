import { act, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useCardImage } from '../useCardImage'

describe('F08 card image network lifecycle', () => {
  beforeEach(() => vi.useFakeTimers())
  afterEach(() => {
    vi.useRealTimers()
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
  })

  it('bounds a stalled JSON body and reports a recoverable image error', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({ ok: true, status: 200, json: () => new Promise(() => {}) })
    )
    const { result } = renderHook(() => useCardImage('F08 Slow Image'))
    act(() => result.current.startFetch())
    await act(async () => vi.advanceTimersByTimeAsync(300))
    expect(result.current.loading).toBe(true)
    await act(async () => vi.advanceTimersByTimeAsync(8000))
    expect(result.current).toMatchObject({ loading: false, error: true, imageUrl: null })
  })

  it('aborts on name change and never displays the old image response', async () => {
    let resolveOld: (value: unknown) => void = () => {}
    let oldSignal: AbortSignal | undefined
    const fetchMock = vi.fn((_url: string, init: RequestInit) => {
      oldSignal = init.signal ?? undefined
      return Promise.resolve({
        ok: true,
        status: 200,
        json: () =>
          new Promise((resolve) => {
            resolveOld = resolve
          }),
      })
    })
    vi.stubGlobal('fetch', fetchMock)
    const { result, rerender } = renderHook(({ name }) => useCardImage(name), {
      initialProps: { name: 'F08 Old Image' },
    })
    act(() => result.current.startFetch())
    await act(async () => vi.advanceTimersByTimeAsync(300))
    rerender({ name: 'F08 New Image' })
    expect(oldSignal?.aborted).toBe(true)
    await act(async () => resolveOld({ image_uris: { normal: 'https://example.test/old.png' } }))
    expect(result.current).toMatchObject({ imageUrl: null, loading: false, error: false })
  })

  it('stops loading when a pending image request is explicitly cancelled', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockImplementation(() => new Promise(() => {}))
    )
    const { result } = renderHook(() => useCardImage('F08 Cancelled Image'))
    act(() => result.current.startFetch())
    await act(async () => vi.advanceTimersByTimeAsync(300))
    expect(result.current.loading).toBe(true)
    await act(async () => result.current.cancelFetch())
    expect(result.current).toMatchObject({ loading: false, error: false })
    expect(vi.getTimerCount()).toBe(0)
  })

  it('unmounts without a delayed request or retained deadline', async () => {
    const fetchMock = vi.fn()
    vi.stubGlobal('fetch', fetchMock)
    const { result, unmount } = renderHook(() => useCardImage('F08 Unmounted Image'))
    act(() => result.current.startFetch())
    unmount()
    await act(async () => vi.advanceTimersByTimeAsync(10000))
    expect(fetchMock).not.toHaveBeenCalled()
    expect(vi.getTimerCount()).toBe(0)
  })
})
