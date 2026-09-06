import { beforeEach, describe, expect, it, vi } from 'vitest'
import { DeckAnalyzer } from '../deckAnalyzer'
import { parseDecklist } from '../deckParser'
import { batchFetchFromScryfall } from '../cardResolver'
vi.mock('../cardResolver', () => ({
  batchFetchFromScryfall: vi.fn(async () => {}),
  fetchCardFromScryfall: vi.fn(async () => null),
  fetchCardFromScryfallWithMeta: vi.fn(async () => ({ data: null, notFound: true })),
  clearCardResolverCache: vi.fn(),
}))
vi.mock('../landService', () => ({
  landService: {
    prefetchUnknownLands: vi.fn(async () => {}),
    detectLand: vi.fn(async () => null),
    getLandSync: vi.fn(() => null),
  },
}))
const parse = (text: string) => DeckAnalyzer['parseDeckList'](text)
beforeEach(() => vi.clearAllMocks())
describe('F01 product input boundary before network', () => {
  it.each([
    '',
    'nonsense without quantities',
    '0 Forest',
    '-1 Forest',
    '1.5 Forest',
    '1000000 Forest',
    '9007199254740993 Forest',
    `${'9'.repeat(320)} Forest`,
    '125 Forest\n126 Island',
    '1 Forest\ninvalid line',
  ])('rejects %s before resolution', async (text) => {
    await expect(DeckAnalyzer.analyzeDeck(text)).rejects.toThrow()
    expect(batchFetchFromScryfall).not.toHaveBeenCalled()
  })
  it('identifies a rejected line', async () => {
    await expect(parse('24 Forest\ninvalid line')).rejects.toThrow(/line 2/i)
  })
  it.each([1, 40, 60, 99, 100, 250])('accepts experimental and canonical size %i', async (qty) => {
    expect((await parse(`${qty} Forest`))[0].quantity).toBe(qty)
  })
})
describe('F02 product section populations', () => {
  it('excludes Maybeboard and Companion from resolved analysis cards', async () => {
    const cards = await parse('24 Forest\n36 Island\nMaybeboard\n4 Mountain\nCompanion\n1 Plains')
    expect(cards.map((c) => c.name)).toEqual(['Forest', 'Island'])
    expect(batchFetchFromScryfall).toHaveBeenCalledWith(['Forest', 'Island'], undefined)
  })
  it('keeps inline SB local and resets explicit section transitions', async () => {
    const cards = await parse(
      'SB: 1 Mountain\n24 Forest\nSideboard\n2 Swamp\nDeck\n36 Island\nCommander\n1 Plains\nMainboard\n1 Wastes'
    )
    expect(cards.map((c) => [c.name, !!c.isSideboard, !!c.isCommander])).toEqual([
      ['Mountain', true, false],
      ['Forest', false, false],
      ['Swamp', true, false],
      ['Island', false, false],
      ['Plains', false, true],
      ['Wastes', false, false],
    ])
  })
  it('preserves categorized noncanonical main with blank lines', async () => {
    const cards = await parse('Lands (50)\n50 Forest\n\nCreatures (5)\n5 Island')
    expect(cards.every((c) => !c.isSideboard)).toBe(true)
  })
})

describe('F01/F02 pure canonical metadata', () => {
  it('keeps quantities for every zone, emits numbered exclusion diagnostics, and bounds all zones', () => {
    const parsed = parseDecklist(
      'Commander\n1 Plains\nDeck\n60 Forest\nSideboard\n15 Island\nMaybeboard\n4 Mountain\nCompanion\n1 Swamp'
    )
    const totals = Object.fromEntries(
      ['main', 'commander', 'sideboard', 'maybeboard', 'companion'].map((section) => [
        section,
        parsed.entries.filter((e) => e.section === section).reduce((sum, e) => sum + e.quantity, 0),
      ])
    )
    expect(totals).toEqual({ main: 60, commander: 1, sideboard: 15, maybeboard: 4, companion: 1 })
    expect(parsed.warnings).toEqual([
      expect.stringMatching(/Line 8.*maybeboard/),
      expect.stringMatching(/Line 10.*companion/),
    ])
    expect(() => parseDecklist('250 Forest\nMaybeboard\n1 Island')).toThrow(/total/)
  })
  it('preserves Arena names, inline markers, CRLF and Moxfield quantity forms', () => {
    expect(
      parseDecklist(
        '1 Plains *CMDR*\r\nDeck\r\n24x Forest (M21) 274\r\nIsland x36\r\n1 Swamp *CMP*'
      ).entries.map((e) => [e.name, e.quantity, e.section])
    ).toEqual([
      ['Plains', 1, 'commander'],
      ['Forest', 24, 'main'],
      ['Island', 36, 'main'],
      ['Swamp', 1, 'companion'],
    ])
  })
  it('warns when legacy 60+15 blank-line inference is used', () => {
    const parsed = parseDecklist('60 Forest\n\n15 Island')
    expect(parsed.entries.map((e) => e.section)).toEqual(['main', 'sideboard'])
    expect(parsed.warnings[0]).toMatch(/Line 2.*Sideboard/)
  })
  it('handles empty sections and main transition after excluded sections', () => {
    expect(
      parseDecklist('Sideboard\nCommander\nMaybeboard\nCompanion\nDeck\n60 Forest').entries[0]
        .section
    ).toBe('main')
  })
})

describe('counted export section headers', () => {
  it.each(['// Sideboard (15)', '# Sideboard (15)', 'Sideboard (15)'])(
    'preserves %s and counted Deck transition',
    async (header) => {
      const cards = await parse(`60 Forest\n${header}\n15 Island\n// Deck (99)\n1 Plains`)
      expect(cards.map((c) => [c.name, !!c.isSideboard])).toEqual([
        ['Forest', false],
        ['Island', true],
        ['Plains', false],
      ])
    }
  )
})
