import { expect, it, vi, afterEach } from 'vitest'
import { DeckAnalyzer, type DeckCard } from '../../src/services/deckAnalyzer'
import { prepareDeckForSimulation } from '../../src/services/mulliganSimulatorAdvanced'
import { applyCommanderFallback } from '../../src/services/deckParser'
afterEach(() => vi.restoreAllMocks())
const cards = (): DeckCard[] =>
  [
    {
      name: 'Forest',
      quantity: 24,
      cmc: 0,
      isLand: true,
      colors: [],
      producedMana: ['G'],
      manaCost: '',
      resolved: true,
    },
    {
      name: 'Spell',
      quantity: 36,
      cmc: 1,
      isLand: false,
      colors: ['G'],
      manaCost: '{G}',
      resolved: true,
    },
    {
      name: 'Sideboard spell',
      quantity: 15,
      cmc: 1,
      isLand: false,
      colors: ['R'],
      manaCost: '{R}',
      resolved: true,
      isSideboard: true,
    },
    {
      name: 'Commander',
      quantity: 1,
      cmc: 4,
      isLand: false,
      colors: ['U'],
      manaCost: '{3}{U}',
      resolved: true,
      isCommander: true,
    },
  ] as DeckCard[]
it('global analysis excludes sideboard and command zone from the library but retains the imported cards', async () => {
  vi.spyOn(DeckAnalyzer as any, 'parseDeckList').mockResolvedValue(cards())
  const result = await DeckAnalyzer.analyzeDeck(
    '24 Forest\n36 Spell\nSideboard\n15 Sideboard spell\nCommander\n1 Commander'
  )
  expect(result.totalCards).toBe(60)
  expect(result.totalLands).toBe(24)
  expect(result.cards).toHaveLength(4)
})
it('mulligan draws never include sideboard or command zone cards', () => {
  const simulated = prepareDeckForSimulation(cards())
  expect(simulated).toHaveLength(60)
  expect(simulated.some((c) => c.name === 'Commander' || c.name === 'Sideboard spell')).toBe(false)
})
it('a large list alone does not identify a commander', () => {
  const input = [
    { name: 'First spell', quantity: 1, isLand: false },
    { name: 'Land', quantity: 99, isLand: true },
  ]
  expect(applyCommanderFallback(input)).toEqual(input)
})
it('colorless identity does not hide an explicit C requirement', async () => {
  const input = cards().slice(0, 2)
  input[1] = { ...input[1], name: 'Colorless demand', colors: [], manaCost: '{C}' }
  vi.spyOn(DeckAnalyzer as any, 'parseDeckList').mockResolvedValue(input)
  const result = await DeckAnalyzer.analyzeDeck(
    input.map((c) => `${c.quantity} ${c.name}`).join('\n')
  )
  expect(result.consistency).toBe(0)
})

it('recommendations use computed land ratio and curve, including zero consistency', async () => {
  const input = cards()
    .slice(1, 2)
    .map((c) => ({ ...c, cmc: 5, manaCost: '{4}{G}' }))
  vi.spyOn(DeckAnalyzer as any, 'parseDeckList').mockResolvedValue(input)
  const result = await DeckAnalyzer.analyzeDeck(
    input.map((c) => `${c.quantity} ${c.name}`).join('\n')
  )
  expect(result.recommendations.join(' ')).toContain('current: 0%')
  expect(result.recommendations.join(' ')).toContain('High mana curve (5.0)')
  expect(result.recommendations.join(' ')).toContain('Low mana consistency (0%)')
})
