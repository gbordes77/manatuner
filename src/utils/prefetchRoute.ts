/**
 * QW2 — idle / hover prefetch for lazy route chunks.
 * Safe to call multiple times; only the first import() runs.
 */

const prefetched = new Set<string>()

export function prefetchAnalyzerChunk(): void {
  if (prefetched.has('analyzer')) return
  prefetched.add('analyzer')
  void import('../pages/AnalyzerPage')
}

/** requestIdleCallback with setTimeout fallback. */
export function scheduleIdlePrefetch(fn: () => void, timeoutMs = 2500): void {
  if (typeof window === 'undefined') return
  const ric = (
    window as Window & {
      requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number
    }
  ).requestIdleCallback
  if (typeof ric === 'function') {
    ric(() => fn(), { timeout: timeoutMs })
  } else {
    setTimeout(fn, Math.min(timeoutMs, 1500))
  }
}
