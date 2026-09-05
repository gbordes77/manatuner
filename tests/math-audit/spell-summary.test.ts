import { expect, it, vi, afterEach } from 'vitest'
import { computeAtRiskSpells } from '../../src/services/spellSummary'
import { DeckAnalyzer, type AnalysisResult } from '../../src/services/deckAnalyzer'
import { landService } from '../../src/services/landService'
afterEach(() => vi.restoreAllMocks())
it('weights physical copies rather than distinct names', () => {
  expect(
    computeAtRiskSpells({
      spellAnalysis: {
        a: { total: 4, percentage: 0, castable: 0 },
        b: { total: 1, percentage: 100, castable: 1 },
      },
    } as AnalysisResult)
  ).toBe(0.8)
})
it('does not interpret uncomputed spells or an empty sample as zero risk', () => {
  expect(computeAtRiskSpells({ spellAnalysis: {} } as AnalysisResult)).toBeNull()
  expect(
    computeAtRiskSpells({
      spellAnalysis: {},
      unsupportedSpellAnalysis: { a: 'Unknown' },
    } as AnalysisResult)
  ).toBeNull()
})
it('unsupported costs never acquire a numerical summary probability', async () => {
  vi.spyOn(DeckAnalyzer as any, 'parseDeckList').mockResolvedValue([
    {
      name: 'Forest',
      quantity: 24,
      cmc: 0,
      manaCost: '',
      colors: [],
      isLand: true,
      resolved: true,
      producedMana: ['G'],
      landMetadata: landService.getLandSync('Forest'),
    },
    {
      name: 'Snow demand',
      quantity: 36,
      cmc: 1,
      manaCost: '{S}',
      colors: [],
      isLand: false,
      resolved: true,
    },
  ])
  const result = await DeckAnalyzer.analyzeDeck('fixture')
  expect(result.spellAnalysis['Snow demand']).toBeUndefined()
  expect(result.unsupportedSpellAnalysis?.['Snow demand']).toBeTruthy()
  expect(result.tempoSpellAnalysis?.['Snow demand']).toBeUndefined()
})
it('the standalone spell API also refuses unsupported mechanics', async () => {
  const { analyzeSpellCastability } = await import('../../src/services/manaCalculator')
  expect(() =>
    analyzeSpellCastability(
      { name: 'Snow', manaCost: '{S}', cmc: 1 },
      Array(24).fill(landService.getLandSync('Forest')),
      60
    )
  ).toThrow(/unavailable/)
})
it('hybrid marginal access counts the union, not the larger color marginal', async () => {
  const { analyzeSpellCastability } = await import('../../src/services/manaCalculator')
  const { exactTail } = await import('./oracle')
  const lands = [
    ...Array(12).fill(landService.getLandSync('Plains')),
    ...Array(12).fill(landService.getLandSync('Island')),
  ]
  const result = analyzeSpellCastability({ name: 'Hybrid', manaCost: '{W/U}', cmc: 1 }, lands, 60)
  expect(result.colorRequirements[0].alternatives).toEqual(['W', 'U'])
  expect(result.colorRequirements[0].tempoAdjustedProbability).toBeCloseTo(
    exactTail(60, 24, 7, 1),
    12
  )
})
