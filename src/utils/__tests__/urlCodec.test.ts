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
