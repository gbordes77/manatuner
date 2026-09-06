import { afterEach, expect, it, vi } from 'vitest'
import { DeckAnalyzer, type DeckCard, type AnalysisResult } from '../../src/services/deckAnalyzer'
import { computeColorDeltas } from '../../src/components/analyzer/karstenDeltas'
import { landService } from '../../src/services/landService'
import { exactTail } from './oracle'
const land = (name: string, quantity: number): DeckCard => ({
  name,
  quantity,
  manaCost: '',
  cmc: 0,
  colors: [],
  isLand: true,
  producedMana: name === 'Forest' ? ['G'] : ['R'],
  resolved: true,
  landMetadata: landService.getLandSync(name)!,
})
const spell = (manaCost: string): DeckCard => ({
  name: 'Test Spell',
  quantity: 36,
  manaCost,
  cmc: 2,
  colors: ['R', 'G'],
  isLand: false,
  resolved: true,
})
const analyze = async (cards: DeckCard[]) => {
  vi.spyOn(DeckAnalyzer as any, 'parseDeckList').mockResolvedValue(cards)
  return DeckAnalyzer.analyzeDeck(cards.map((c) => `${c.quantity} ${c.name}`).join('\n'))
}
afterEach(() => vi.restoreAllMocks())
it('F03 hybrid green support has no mandatory red target or score penalty', async () => {
  const result = await analyze([land('Forest', 24), spell('{1}{R/G}')])
  expect(computeColorDeltas(result)).toEqual([])
  expect(result.manaRequirements.R).toBe(0)
  expect(result.consistency).toBeCloseTo(exactTail(60, 24, 8, 1), 12)
})
it('F03 strict multicolor retains both targets and missing-red access', async () => {
  const result = await analyze([land('Forest', 24), spell('{R}{G}')])
  expect(computeColorDeltas(result).map((d) => d.color)).toEqual(['R', 'G'])
  expect(result.consistency).toBeCloseTo(exactTail(60, 24, 8, 1) / 2, 12)
})
it('F03 hybrid union counts distinct physical land copies, including shared duals once', async () => {
  const dual = {
    ...land('Forest', 12),
    name: 'Dual',
    producedMana: ['R', 'G'] as DeckCard['producedMana'],
  }
  const result = await analyze([dual, land('Mountain', 12), spell('{1}{R/G}')])
  expect(result.consistency).toBeCloseTo(exactTail(60, 24, 8, 1), 12)
})
it('F03 phyrexian payment never creates mandatory color targets', async () => {
  const result = await analyze([land('Forest', 24), spell('{G/P}')])
  expect(computeColorDeltas(result)).toEqual([])
})
it('F04 principal targets invariant under blue sideboard and explicit command zone', () => {
  const base = {
    totalCards: 60,
    colorDistribution: { R: 24 },
    cards: [land('Mountain', 24), spell('{R}')],
  } as AnalysisResult
  const withZones = {
    ...base,
    cards: [
      ...base.cards,
      { ...spell('{U}{U}'), isSideboard: true },
      { ...spell('{B}'), isCommander: true },
    ],
  }
  expect(computeColorDeltas(withZones)).toEqual(computeColorDeltas(base))
})

it('F03 repeated hybrids require two physical sources, with independent exact oracle', async () => {
  const result = await analyze([land('Forest', 24), spell('{R/G}{R/G}')])
  expect(result.spellAnalysis['Test Spell'].percentage / 100).toBeCloseTo(
    exactTail(60, 24, 8, 2),
    12
  )
  vi.restoreAllMocks()
  const oneSource = await analyze([land('Forest', 1), { ...spell('{R/G}{R/G}'), quantity: 59 }])
  expect(oneSource.spellAnalysis['Test Spell'].percentage).toBe(0)
})
it('F03 unsupported payment marks score unavailable and never emits low-consistency fixing advice', async () => {
  const result = await analyze([land('Forest', 24), spell('{G/P}')])
  expect(result.consistencyUnavailable).toBe(true)
  expect(result.colorAccessNotes?.join(' ')).toMatch(/unavailable/)
  expect(result.recommendations.join(' ')).not.toMatch(/Low mana consistency/)
  expect(result.unsupportedSpellAnalysis?.['Test Spell']).toBeTruthy()
})
it('F04 effective post-board population adds target only after entering library, then restores', () => {
  const base = {
    totalCards: 60,
    colorDistribution: { R: 24 },
    cards: [land('Mountain', 24), spell('{R}')],
  } as AnalysisResult
  const post = {
    ...base,
    cards: [
      land('Mountain', 24),
      { ...spell('{R}'), quantity: 35 },
      { ...spell('{U}{U}'), quantity: 1, isSideboard: false },
    ],
  }
  expect(computeColorDeltas(post).find((d) => d.color === 'U')).toMatchObject({
    actual: 0,
    verdict: 'short',
  })
  expect(computeColorDeltas(base).some((d) => d.color === 'U')).toBe(false)
})

it('F03 blueprint shares hybrid access events at T2 and T4', async () => {
  const { calculateStabilityScore } = await import('../../src/components/export/manaStability')
  const result = await analyze([land('Forest', 24), spell('{1}{R/G}')])
  const expected = Math.round(65 * exactTail(60, 24, 8, 1) + 20 + 15 * exactTail(60, 24, 10, 1))
  expect(calculateStabilityScore(result)).toBe(expected)
})
