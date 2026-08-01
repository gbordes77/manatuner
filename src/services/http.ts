/**
 * Shared HTTP helpers for Scryfall (and other) network calls.
 * Provides a single AbortController + timeout + retry policy.
 */

export class HttpTimeoutError extends Error {
  readonly name = 'HttpTimeoutError'
  constructor(message = 'Request timed out') {
    super(message)
    Object.setPrototypeOf(this, HttpTimeoutError.prototype)
  }
}

export class HttpError extends Error {
  readonly name = 'HttpError'
  readonly status: number

  constructor(status: number, message?: string) {
    super(message ?? `HTTP ${status}`)
    this.status = status
    Object.setPrototypeOf(this, HttpError.prototype)
  }
}

export interface FetchWithTimeoutOptions {
  /** Abort after this many ms (default 8000) */
  timeoutMs?: number
  /**
   * Number of *retries* after the first attempt (default 1 → up to 2 attempts).
   * Retries only on HTTP 429 and 5xx.
   */
  retries?: number
  /** Optional external AbortSignal (user cancelled an analysis, etc.) */
  signal?: AbortSignal
}

const sleep = (ms: number): Promise<void> =>
  new Promise((resolve) => {
    setTimeout(resolve, ms)
  })

function parseRetryAfterMs(header: string | null, attempt: number): number {
  const fallback = 500 * (attempt + 1)
  if (!header) return fallback

  const asSeconds = Number(header)
  if (Number.isFinite(asSeconds) && asSeconds >= 0) {
    return asSeconds * 1000
  }

  const asDate = Date.parse(header)
  if (Number.isFinite(asDate)) {
    return Math.max(0, asDate - Date.now())
  }

  return fallback
}

function isAbortError(error: unknown): boolean {
  return (
    (error instanceof DOMException && error.name === 'AbortError') ||
    (error instanceof Error && error.name === 'AbortError')
  )
}

/**
 * fetch() with AbortController timeout, optional retries on 429/5xx,
 * Retry-After respect, and typed errors.
 *
 * On success (including HTTP 4xx that are not retried), returns the Response
 * so callers keep their existing `response.ok` / status checks.
 * On timeout: rejects with HttpTimeoutError.
 * On external abort: rejects with AbortError.
 * On network failure: rejects with the underlying error (no retry — only 429/5xx).
 */
export async function fetchWithTimeout(
  url: string,
  init: RequestInit = {},
  options: FetchWithTimeoutOptions = {}
): Promise<Response> {
  const { timeoutMs = 8000, retries = 1, signal: externalSignal } = options

  if (externalSignal?.aborted) {
    throw new DOMException('The operation was aborted.', 'AbortError')
  }

  let lastError: unknown

  for (let attempt = 0; attempt <= retries; attempt++) {
    const controller = new AbortController()
    let timedOut = false

    const timeoutId = setTimeout(() => {
      timedOut = true
      controller.abort()
    }, timeoutMs)

    const onExternalAbort = () => {
      controller.abort()
    }
    if (externalSignal) {
      externalSignal.addEventListener('abort', onExternalAbort)
    }

    // Compose signals: prefer our controller (covers timeout + external)
    const requestInit: RequestInit = {
      ...init,
      signal: controller.signal,
    }

    try {
      const response = await fetch(url, requestInit)
      clearTimeout(timeoutId)
      if (externalSignal) {
        externalSignal.removeEventListener('abort', onExternalAbort)
      }

      const retriable = response.status === 429 || response.status >= 500
      if (retriable && attempt < retries) {
        const delayMs = parseRetryAfterMs(response.headers.get('Retry-After'), attempt)
        await sleep(delayMs)
        continue
      }

      return response
    } catch (error) {
      clearTimeout(timeoutId)
      if (externalSignal) {
        externalSignal.removeEventListener('abort', onExternalAbort)
      }

      if (isAbortError(error)) {
        if (externalSignal?.aborted) {
          throw error
        }
        if (timedOut) {
          throw new HttpTimeoutError(`Request timed out after ${timeoutMs}ms: ${url}`)
        }
        // Abort from init.signal or other — rethrow
        throw error
      }

      // Network / TypeError etc. — do not retry (policy: 429/5xx only)
      lastError = error
      throw error
    }
  }

  throw lastError ?? new Error(`fetchWithTimeout failed for ${url}`)
}
