/**
 * T08 — deckParser / cardResolver split non-regression.
 */
import { describe, expect, it } from 'vitest'
import {
  applyCommanderFallback,
  cleanCardName,
  detectSideboardStartLine,
  parseDecklistLine,
} from '../deckParser'
import { clearCardResolverCache, getCardResolverCacheSize } from '../cardResolver'
import { detectSideboardStartLine as reexportedSb } from '../deckAnalyzer'

describe('T08 deckParser pure', () => {
  it('parseDecklistLine handles Arena / Moxfield qty forms', () => {
    expect(parseDecklistLine('4 Lightning Bolt')).toEqual({
      quantity: 4,
      name: 'Lightning Bolt',
    })
    expect(parseDecklistLine('4x Counterspell')).toEqual({
      quantity: 4,
      name: 'Counterspell',
    })
    expect(parseDecklistLine('Mountain x20')).toEqual({
      quantity: 20,
      name: 'Mountain',
    })
    expect(parseDecklistLine('Sideboard:')).toBeNull()
    expect(parseDecklistLine('')).toBeNull()
  })

  it('detectSideboardStartLine matches re-export from deckAnalyzer', () => {
    const lines = [
      '4 Lightning Bolt',
      '20 Mountain',
      ...Array.from({ length: 36 }, () => '1 Filler Spell'),
      '',
      '2 Rest in Peace',
      '2 Surgical Extraction',
    ]
    // pad to 40+ main
    const main = Array.from({ length: 40 }, (_, i) => `1 Spell ${i}`)
    const side = ['2 Rest in Peace', '2 Surgical Extraction']
    const full = [...main, '', ...side]
    expect(detectSideboardStartLine(full)).toBe(reexportedSb(full))
    expect(detectSideboardStartLine(full)).toBe(40)
    void lines
  })

  it('applyCommanderFallback does not infer a command zone from 99 cards', () => {
    const cards: Array<{
      name: string
      quantity: number
      isLand: boolean
      isCommander?: boolean
    }> = [
      { name: 'Atraxa', quantity: 1, isLand: false },
      { name: 'Forest', quantity: 98, isLand: true },
    ]
    const out = applyCommanderFallback(cards)
    expect(out[0].isCommander).toBeUndefined()
    expect(out[1].isCommander).toBeUndefined()
  })

  it('cleanCardName still normalizes MTGA codes', () => {
    expect(cleanCardName('Bolt (M21) 1')).toBe('Bolt')
  })
})

describe('T08 cardResolver cache surface', () => {
  it('clearCardResolverCache empties cache', () => {
    clearCardResolverCache()
    expect(getCardResolverCacheSize()).toBe(0)
  })
})
