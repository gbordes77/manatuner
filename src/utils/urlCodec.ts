/**
 * URL codec for sharing deck analyses.
 *
 * Encodes a decklist into a compact URL-safe string using base64.
 * Decodes it back on load. Keeps URLs under ~2000 chars for compatibility.
 *
 * Privacy (SEC-2026-08-01): new share links put the deck in the **hash**
 * (`#d=…`) so the payload is not sent to the edge/CDN in the request URL.
 * Legacy query links (`?d=…`) remain supported for Discord/history links.
 */

/** Encode a decklist string into a URL-safe base64 param */
export function encodeDeck(deckList: string): string {
  try {
    // TextEncoder → Uint8Array → base64 → URL-safe base64
    const bytes = new TextEncoder().encode(deckList)
    const binary = String.fromCharCode(...bytes)
    return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
  } catch {
    return ''
  }
}

/** Decode a URL-safe base64 param back to a decklist string */
export function decodeDeck(encoded: string): string {
  try {
    // Restore standard base64
    const base64 = encoded.replace(/-/g, '+').replace(/_/g, '/')
    const padded = base64 + '='.repeat((4 - (base64.length % 4)) % 4)
    const binary = atob(padded)
    const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0))
    return new TextDecoder().decode(bytes)
  } catch {
    return ''
  }
}

function readShareFromParams(params: URLSearchParams): {
  deckList: string
  deckName: string
  tab: number
} | null {
  const encoded = params.get('d')
  if (!encoded) return null

  const deckList = decodeDeck(encoded)
  if (!deckList) return null

  return {
    deckList,
    deckName: params.get('name') || '',
    tab: parseInt(params.get('tab') || '0', 10) || 0,
  }
}

/** Build a shareable URL from current deck state (hash-based for privacy). */
export function buildShareUrl(params: {
  deckList: string
  deckName?: string
  tab?: number
}): string {
  try {
    const url = new URL('/analyzer', window.location.origin)
    const encoded = encodeDeck(params.deckList)
    if (!encoded) return ''

    // Hash fragment is not sent to the server on navigation — reduces CDN log exposure.
    const hash = new URLSearchParams()
    hash.set('d', encoded)
    if (params.deckName) hash.set('name', params.deckName)
    if (params.tab !== undefined && params.tab > 0) hash.set('tab', String(params.tab))
    url.hash = hash.toString()
    return url.toString()
  } catch {
    return ''
  }
}

/**
 * Parse share params from current URL (hash first, then legacy query).
 * T15: if only legacy `?d=` is present, rewrite to `#d=` and strip query `d`
 * so the decklist leaves edge/CDN request logs after first read.
 */
export function parseShareParams(): {
  deckList: string
  deckName: string
  tab: number
} | null {
  if (typeof window === 'undefined') return null

  const hashRaw = window.location.hash.replace(/^#/, '')
  if (hashRaw) {
    const fromHash = readShareFromParams(new URLSearchParams(hashRaw))
    if (fromHash) return fromHash
  }

  const searchParams = new URLSearchParams(window.location.search)
  const fromQuery = readShareFromParams(searchParams)
  if (!fromQuery) return null

  // T15: migrate legacy ?d= → #d= and strip d/name/tab from query
  try {
    const hash = new URLSearchParams()
    const encoded = searchParams.get('d')
    if (encoded) hash.set('d', encoded)
    if (fromQuery.deckName) hash.set('name', fromQuery.deckName)
    if (fromQuery.tab > 0) hash.set('tab', String(fromQuery.tab))

    const next = new URL(window.location.href)
    next.searchParams.delete('d')
    next.searchParams.delete('name')
    next.searchParams.delete('tab')
    next.hash = hash.toString()
    window.history.replaceState(
      {},
      '',
      `${next.pathname}${next.search}${next.hash ? `#${next.hash}` : ''}`
    )
  } catch {
    // history may be unavailable in some test envs
  }

  return fromQuery
}
