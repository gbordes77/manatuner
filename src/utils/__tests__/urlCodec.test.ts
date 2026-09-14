import { afterEach, describe, expect, it, vi } from 'vitest'
import { buildShareUrl, decodeDeck, encodeDeck, parseShareParams } from '../urlCodec'

describe('urlCodec', () => {
  const sampleDeck = '4 Lightning Bolt\n20 Mountain\n'

  afterEach(() => {
    // Reset URL to a clean state between tests
    window.history.replaceState({}, '', '/analyzer')
  })

  it('round-trips decklist through encode/decode', () => {
    const encoded = encodeDeck(sampleDeck)
    expect(encoded.length).toBeGreaterThan(0)
    expect(encoded).not.toMatch(/[+/=]/)
    expect(decodeDeck(encoded)).toBe(sampleDeck)
  })

  it('buildShareUrl puts deck in the hash (not query) for privacy', () => {
    const url = buildShareUrl({ deckList: sampleDeck, deckName: 'Aggro', tab: 2 })
    expect(url).toContain('/analyzer#')
    expect(url).not.toMatch(/\?d=/)
    const parsed = new URL(url)
    expect(parsed.search).toBe('')
    expect(parsed.hash).toContain('d=')
    expect(parsed.hash).toContain('name=Aggro')
    expect(parsed.hash).toContain('tab=2')
  })

  it('parseShareParams reads hash-based share links', () => {
    const url = buildShareUrl({ deckList: sampleDeck, deckName: 'Test', tab: 1 })
    const u = new URL(url)
    window.history.replaceState({}, '', `${u.pathname}${u.search}${u.hash}`)
    const shared = parseShareParams()
    expect(shared?.deckList).toBe(sampleDeck)
    expect(shared?.deckName).toBe('Test')
    expect(shared?.tab).toBe(1)
  })

  it('parseShareParams still supports legacy ?d= query links', () => {
    const encoded = encodeDeck(sampleDeck)
    window.history.replaceState(
      {},
      '',
      `/analyzer?d=${encoded}&name=${encodeURIComponent('Legacy')}&tab=3`
    )
    const shared = parseShareParams()
    expect(shared?.deckList).toBe(sampleDeck)
    expect(shared?.deckName).toBe('Legacy')
    expect(shared?.tab).toBe(3)
  })

  it('T15 rewrites legacy ?d= to #d= and strips query d', () => {
    const encoded = encodeDeck(sampleDeck)
    window.history.replaceState(
      {},
      '',
      `/analyzer?d=${encoded}&name=${encodeURIComponent('Legacy')}&tab=2`
    )
    const shared = parseShareParams()
    expect(shared?.deckList).toBe(sampleDeck)
    // After parse, URL should be hash-based without query d=
    expect(window.location.search).not.toMatch(/[?&]d=/)
    expect(window.location.hash).toContain('d=')
    expect(window.location.hash).toContain('name=Legacy')
  })

  it('decodeDeck returns empty string on garbage input', () => {
    expect(decodeDeck('%%%not-base64%%%')).toBe('')
  })

  it('buildShareUrl returns empty string when encode fails', () => {
    // Force TextEncoder to throw
    const spy = vi.spyOn(globalThis, 'TextEncoder').mockImplementation(() => {
      throw new Error('boom')
    })
    expect(buildShareUrl({ deckList: sampleDeck })).toBe('')
    spy.mockRestore()
  })
})

describe('share resilience B02/B12', () => {
  afterEach(() => {
    window.history.replaceState({}, '', '/analyzer')
    vi.restoreAllMocks()
  })
  it('legacy migration preserves Unicode and remains readable on a second parse', () => {
    const deckList = '4 Éclair ⚡\n20 森'
    const deckName = '日本語 – café'
    const query = new URLSearchParams({
      d: encodeDeck(deckList),
      name: deckName,
      tab: '2',
      keep: 'yes',
    })
    window.history.replaceState({}, '', `/analyzer?${query}`)
    const first = parseShareParams()
    expect(parseShareParams()).toEqual(first)
    expect(first).toEqual({ deckList, deckName, tab: 2 })
    expect(window.location.hash.startsWith('#d=')).toBe(true)
    expect(window.location.search).toBe('?keep=yes')
  })
  it('rejects excessive base64 before calling atob', () => {
    const spy = vi.spyOn(globalThis, 'atob')
    expect(decodeDeck('YQ'.repeat(40_001))).toBe('')
    expect(spy).not.toHaveBeenCalled()
  })
  it('preserves Unicode at parser character limit and rejects oversized decoded text', () => {
    const text = '森'.repeat(20_000)
    expect(decodeDeck(encodeDeck(text))).toBe(text)
    expect(decodeDeck(btoa('a'.repeat(20_001)))).toBe('')
  })
  it('rejects a huge raw URL before decoding, explains recovery, and keeps saved input', () => {
    window.history.replaceState({}, '', `/analyzer#d=${'a'.repeat(260_001)}`)
    const spy = vi.spyOn(globalThis, 'atob')
    const onError = vi.fn()
    expect(parseShareParams(onError)).toBeNull()
    expect(spy).not.toHaveBeenCalled()
    expect(onError).toHaveBeenCalledWith(
      expect.stringContaining('Your current deck has been kept.')
    )
  })
  it('retains long Unicode names without truncation and rejects names over the bound', () => {
    const deckName = '森'.repeat(1000)
    const url = buildShareUrl({ deckList: '1 Forest', deckName })
    window.history.replaceState({}, '', url)
    expect(parseShareParams()?.deckName).toBe(deckName)
    expect(buildShareUrl({ deckList: '1 Forest', deckName: deckName + 'a' })).toBe('')
  })
})
