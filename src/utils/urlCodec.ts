/**
 * URL codec for sharing deck analyses.
 *
 * Encodes a decklist into a compact URL-safe string using base64.
 * Decodes it back on load with bounded input matching the deck parser.
 *
 * Privacy (SEC-2026-08-01): new share links put the deck in the **hash**
 * (`#d=…`) so the payload is not sent to the edge/CDN in the request URL.
 * Legacy query links (`?d=…`) remain supported for Discord/history links.
 */

import { DECKLIST_MAX_CHARACTERS } from '../services/deckParser'

// UTF-8 needs at most three bytes per UTF-16 code unit; base64 adds 4/3.
export const SHARE_MAX_ENCODED_LENGTH = DECKLIST_MAX_CHARACTERS * 4
// Allows percent-escaped base64 plus a Unicode name, while bounding URLSearchParams work.
const SHARE_MAX_URL_LENGTH = SHARE_MAX_ENCODED_LENGTH * 3 + 20_000
const SHARE_MAX_NAME_LENGTH = 1000

/** Encode a decklist string into a URL-safe base64 param */
export function encodeDeck(deckList: string): string {
  try {
    if (deckList.length > DECKLIST_MAX_CHARACTERS) return ''
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
    if (encoded.length > SHARE_MAX_ENCODED_LENGTH) return ''
    // Restore standard base64
    const base64 = encoded.replace(/-/g, '+').replace(/_/g, '/')
    const padded = base64 + '='.repeat((4 - (base64.length % 4)) % 4)
    const binary = atob(padded)
    const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0))
    const decoded = new TextDecoder('utf-8', { fatal: true }).decode(bytes)
    return decoded.length <= DECKLIST_MAX_CHARACTERS ? decoded : ''
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
  if (!encoded || (params.get('name')?.length || 0) > SHARE_MAX_NAME_LENGTH) return null

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
    if ((params.deckName?.length || 0) > SHARE_MAX_NAME_LENGTH) return ''
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
export function parseShareParams(onError?: (message: string) => void): {
  deckList: string
  deckName: string
  tab: number
} | null {
  if (typeof window === 'undefined') return null

  if (window.location.hash.length + window.location.search.length > SHARE_MAX_URL_LENGTH) {
    onError?.(
      'This share link is too large. Paste a decklist of at most 20,000 characters instead. Your current deck has been kept.'
    )
    return null
  }
  const hashRaw = window.location.hash.replace(/^#/, '')
  if (hashRaw) {
    const fromHash = readShareFromParams(new URLSearchParams(hashRaw))
    if (fromHash) return fromHash
  }

  const searchParams = new URLSearchParams(window.location.search)
  const fromQuery = readShareFromParams(searchParams)
  if (!fromQuery) {
    if (new URLSearchParams(hashRaw).has('d') || searchParams.has('d')) {
      onError?.(
        'This share link is invalid or exceeds the supported size (20,000 deck characters; 1,000 name characters). Paste the decklist instead. Your current deck has been kept.'
      )
    }
    return null
  }

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
    window.history.replaceState({}, '', `${next.pathname}${next.search}${next.hash}`)
  } catch {
    // history may be unavailable in some test envs
  }

  return fromQuery
}
