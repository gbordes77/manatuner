/** Shared deadlines for Scryfall requests, including retries and response bodies. */
export class HttpTimeoutError extends Error {
  readonly name = 'HttpTimeoutError'
  constructor(message = 'Request timed out') {
    super(message)
    Object.setPrototypeOf(this, HttpTimeoutError.prototype)
  }
}

export class HttpError extends Error {
  readonly name = 'HttpError'
  constructor(
    readonly status: number,
    message = `HTTP ${status}`
  ) {
    super(message)
    Object.setPrototypeOf(this, HttpError.prototype)
  }
}

export interface FetchWithTimeoutOptions {
  /** Total budget across attempts, backoff and (for JSON requests) body; default 8000 ms. */
  timeoutMs?: number
  /** Retries after first attempt; only 429 and 5xx. Default one retry. */
  retries?: number
  signal?: AbortSignal
}

export function throwIfAborted(signal?: AbortSignal | null): void {
  if (signal?.aborted) {
    // Our global deadline must remain distinguishable from a user cancellation.
    if (signal.reason instanceof HttpTimeoutError) throw signal.reason
    throw new DOMException('The operation was aborted.', 'AbortError')
  }
}

export function isCancellation(error: unknown): boolean {
  return (
    (error instanceof Error || error instanceof DOMException) &&
    (error.name === 'AbortError' || error instanceof HttpTimeoutError)
  )
}

/** Reject even when an underlying implementation ignores AbortSignal; detach on settlement. */
export function abortable<T>(operation: Promise<T>, signal: AbortSignal): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const onAbort = () => {
      try {
        throwIfAborted(signal)
      } catch (error) {
        reject(error)
      }
    }
    signal.addEventListener('abort', onAbort, { once: true })
    operation.then(resolve, reject).finally(() => signal.removeEventListener('abort', onAbort))
    if (signal.aborted) onAbort()
  })
}

export async function abortableDelay(ms: number, signal?: AbortSignal): Promise<void> {
  throwIfAborted(signal)
  let timer: ReturnType<typeof setTimeout> | undefined
  try {
    const delay = new Promise<void>((resolve) => {
      timer = setTimeout(resolve, Math.min(ms, 2_147_483_647))
    })
    await (signal ? abortable(delay, signal) : delay)
  } finally {
    clearTimeout(timer)
  }
}

/** One deadline and cancellation lineage across every nested operation. */
export async function withTimeout<T>(
  operation: (signal: AbortSignal) => Promise<T>,
  timeoutMs: number,
  externalSignal?: AbortSignal | null
): Promise<T> {
  throwIfAborted(externalSignal)
  const controller = new AbortController()
  const onAbort = () => controller.abort(externalSignal?.reason)
  externalSignal?.addEventListener('abort', onAbort, { once: true })
  const timer = setTimeout(
    () => controller.abort(new HttpTimeoutError(`Request timed out after ${timeoutMs}ms`)),
    timeoutMs
  )
  try {
    return await abortable(operation(controller.signal), controller.signal)
  } finally {
    clearTimeout(timer)
    externalSignal?.removeEventListener('abort', onAbort)
  }
}

function parseRetryAfterMs(header: string | null, attempt: number): number {
  const fallback = 500 * (attempt + 1)
  if (!header) return fallback
  const seconds = Number(header)
  if (Number.isFinite(seconds) && seconds >= 0) return seconds * 1000
  const date = Date.parse(header)
  return Number.isFinite(date) ? Math.max(0, date - Date.now()) : fallback
}

async function request<T>(
  url: string,
  init: RequestInit,
  options: FetchWithTimeoutOptions,
  consume: (response: Response, signal: AbortSignal) => Promise<T>
): Promise<T> {
  const { timeoutMs = 8000, retries = 1 } = options
  return withTimeout(
    async (signal) => {
      for (let attempt = 0; ; attempt++) {
        throwIfAborted(signal)
        const response = await abortable(fetch(url, { ...init, signal }), signal)
        throwIfAborted(signal)
        if (
          (response.status === 429 || (response.status >= 500 && response.status <= 599)) &&
          attempt < retries
        ) {
          // Release the discarded body before retrying; respect long Retry-After until deadline.
          void response.body?.cancel().catch(() => {})
          await abortableDelay(
            parseRetryAfterMs(response.headers.get('Retry-After'), attempt),
            signal
          )
          continue
        }
        return consume(response, signal)
      }
    },
    timeoutMs,
    options.signal ?? init.signal
  )
}

/** Header-only compatibility API; JSON consumers should use fetchJsonWithTimeout. */
export function fetchWithTimeout(
  url: string,
  init: RequestInit = {},
  options: FetchWithTimeoutOptions = {}
): Promise<Response> {
  return request(url, init, options, async (response) => response)
}

/** Consume successful JSON under the same deadline as fetch and Retry-After. */
export function fetchJsonWithTimeout<T = unknown>(
  url: string,
  init: RequestInit = {},
  options: FetchWithTimeoutOptions = {}
): Promise<{ response: Response; data: T | undefined }> {
  return request(url, init, options, async (response, signal) => {
    const data = response.ok ? await abortable(response.json() as Promise<T>, signal) : undefined
    if (!response.ok) void response.body?.cancel().catch(() => {})
    throwIfAborted(signal)
    return { response, data }
  })
}
