import { describe, expect, it } from 'vitest'
import { countActiveWubrgColors, countActiveWubrgFromSpells } from '../deckAnalyzer'

describe('countActiveWubrgColors (land map, P0-EDH-1)', () => {
  it('counts only WUBRG — ignores C even with many colorless sources', () => {
    const dist = { W: 12, U: 14, B: 13, R: 0, G: 15, C: 40 }
    expect(countActiveWubrgColors(dist)).toBe(4)
  })

  it('never reports 6 for a 4-color map with C', () => {
    const dist = { W: 10, U: 10, B: 10, R: 0, G: 10, C: 25 }
    const n = countActiveWubrgColors(dist)
    expect(n).toBe(4)
    expect(n).not.toBe(6)
  })

  it('counts five-color when all WUBRG present (still ignores C)', () => {
    expect(countActiveWubrgColors({ W: 1, U: 1, B: 1, R: 1, G: 1, C: 99 })).toBe(5)
  })

  it('mono and two-color stay below multi-color threshold (≥3)', () => {
    expect(countActiveWubrgColors({ W: 20, U: 0, B: 0, R: 0, G: 0, C: 5 })).toBe(1)
    expect(countActiveWubrgColors({ W: 10, U: 10, B: 0, R: 0, G: 0, C: 8 })).toBe(2)
  })

  it('returns 0 for empty / missing maps', () => {
    expect(countActiveWubrgColors(undefined)).toBe(0)
    expect(countActiveWubrgColors(null)).toBe(0)
    expect(countActiveWubrgColors({ C: 40 })).toBe(0)
  })
})

describe('countActiveWubrgFromSpells (identity, P0-EDH-1)', () => {
  it('Atraxa-shaped WUBG spells + any-color lands → still 4 (not 5/6)', () => {
    const cards = [
      { isLand: false, colors: ['W', 'U', 'B', 'G'] }, // Atraxa
      { isLand: false, colors: ['W'] },
      { isLand: false, colors: ['U', 'B'] },
      { isLand: false, colors: ['G'] },
      { isLand: false, colors: [] }, // Sol Ring
      // Lands that produce all 5 would pollute land-based counting:
      { isLand: true, colors: ['W', 'U', 'B', 'R', 'G'] }, // Command Tower
      { isLand: true, colors: ['C'] },
    ]
    expect(countActiveWubrgFromSpells(cards)).toBe(4)
  })

  it('ignores C on spells', () => {
    expect(
      countActiveWubrgFromSpells([
        { isLand: false, colors: ['W', 'U', 'C'] },
        { isLand: false, colors: ['B'] },
      ])
    ).toBe(3)
  })

  it('mono / 2c do not trip multi-color threshold', () => {
    expect(countActiveWubrgFromSpells([{ isLand: false, colors: ['R'] }])).toBe(1)
    expect(
      countActiveWubrgFromSpells([
        { isLand: false, colors: ['W'] },
        { isLand: false, colors: ['U'] },
      ])
    ).toBe(2)
  })

  it('handles empty input', () => {
    expect(countActiveWubrgFromSpells([])).toBe(0)
    expect(countActiveWubrgFromSpells(null)).toBe(0)
  })
})
