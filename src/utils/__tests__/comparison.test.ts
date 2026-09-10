import { beforeEach, afterEach, expect, it, vi } from 'vitest'
import {
  savedSpellResult,
  formatComparisonPercentage,
  formatComparisonDelta,
  groupComparisonReasons,
} from '../comparison'
import { DeckAnalyzer } from '../../services/deckAnalyzer'
import { landService } from '../../services/landService'
import { PrivacyStorage, type AnalysisRecord } from '../../lib/privacy'
import { exactTail } from '../../../tests/math-audit/oracle'
import { calculateStabilityScore } from '../../components/export/manaStability'
beforeEach(() => {
  const memory = new Map<string, string>()
  vi.stubGlobal('localStorage', {
    getItem: (key: string) => memory.get(key) ?? null,
    setItem: (key: string, value: string) => memory.set(key, value),
    removeItem: (key: string) => memory.delete(key),
  })
})
afterEach(() => {
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
})
const record = (analysis: unknown): AnalysisRecord => ({
  id: 'test',
  deckName: 'Public example',
  deckList: '24 Plains\n36 Savannah Lions',
  analysis,
  timestamp: 0,
})
it('preserves zero and explains unknown, absent and unsupported snapshots', () => {
  expect(
    savedSpellResult(
      record({ spellAnalysisModel: 'physical-v1', spellAnalysis: { Lions: { percentage: 0 } } }),
      'Lions'
    )
  ).toEqual({ percentage: 0 })
  expect(
    savedSpellResult(record({ spellAnalysis: { Lions: { percentage: 95 } } }), 'Lions').reason
  ).toMatch(/Legacy/)
  expect(
    savedSpellResult(
      record({
        spellAnalysisModel: 'physical-v1',
        unsupportedSpellAnalysis: { Lions: 'Unsupported land restriction: Command Tower' },
      }),
      'Lions'
    ).reason
  ).toMatch(/Command Tower/)
  expect(
    savedSpellResult(
      record({ spellAnalysisModel: 'physical-v1', spellAnalysis: { Lions: { percentage: NaN } } }),
      'Lions'
    ).percentage
  ).toBeUndefined()
})
it('basic-land examples agree with independent combinatorics and survive history reload', async () => {
  const build = async (lands: number) => {
    vi.spyOn(DeckAnalyzer as any, 'parseDeckList').mockResolvedValue([
      {
        name: 'Plains',
        quantity: lands,
        cmc: 0,
        manaCost: '',
        colors: [],
        isLand: true,
        resolved: true,
        landMetadata: landService.getLandSync('Plains'),
      },
      {
        name: 'Savannah Lions',
        quantity: 60 - lands,
        cmc: 1,
        manaCost: '{W}',
        colors: ['W'],
        isLand: false,
        resolved: true,
      },
    ])
    return DeckAnalyzer.analyzeDeck(`${lands} Plains\n${60 - lands} Savannah Lions`)
  }
  const a = await build(24)
  const b = await build(20)
  expect(a.spellAnalysis['Savannah Lions'].percentage).toBeCloseTo(exactTail(60, 24, 7, 1) * 100, 1)
  expect(b.spellAnalysis['Savannah Lions'].percentage).toBeCloseTo(exactTail(60, 20, 7, 1) * 100, 1)
  expect(b.spellAnalysis['Savannah Lions'].percentage).toBeLessThan(
    a.spellAnalysis['Savannah Lions'].percentage
  )
  PrivacyStorage.saveAnalysis(record(a))
  PrivacyStorage.saveAnalysis(record(b))
  const before = localStorage.getItem('manatuner_analyses')
  const loaded = PrivacyStorage.readHistory().records
  expect(loaded).toHaveLength(2)
  expect(loaded.map((r) => savedSpellResult(r, 'Savannah Lions').percentage).sort()).toEqual(
    [
      a.spellAnalysis['Savannah Lions'].percentage,
      b.spellAnalysis['Savannah Lions'].percentage,
    ].sort()
  )
  expect(localStorage.getItem('manatuner_analyses')).toBe(before)
  // Existing deck indices stay distinct; editorial changes do not alter formulas.
  expect(calculateStabilityScore(a)).toBe(
    Math.round(
      (a.consistency * 0.4 +
        1 * 0.2 +
        a.colorAccessByTurn!.turn2 * 0.25 +
        a.colorAccessByTurn!.turn4 * 0.15) *
        100
    )
  )
})

it('formats comparison without changing saved values or hiding a signed difference', () => {
  const precise = 97.8385472740882
  expect(formatComparisonPercentage(precise)).toBe('97.8%')
  expect(formatComparisonPercentage(0)).toBe('0%')
  expect(formatComparisonPercentage(undefined)).toBe('Unavailable')
  expect(formatComparisonDelta(0, '%')).toBe('=')
  expect(formatComparisonDelta(-0.001, '%')).toBe('-<0.1%')
  expect(formatComparisonDelta(0.001, '%')).toBe('+<0.1%')
  expect(formatComparisonDelta(-2.125, '%')).toBe('-2.1%')
  const snapshot = record({
    spellAnalysisModel: 'physical-v1',
    spellAnalysis: { Lions: { percentage: precise } },
  })
  formatComparisonPercentage(savedSpellResult(snapshot, 'Lions').percentage)
  expect(savedSpellResult(snapshot, 'Lions').percentage).toBe(precise)
})
it('groups common reasons across versions and keeps distinct spell causes and real zero', () => {
  const a = record({
    spellAnalysisModel: 'physical-v1',
    spellAnalysis: { Zero: { percentage: 0 } },
    unsupportedSpellAnalysis: { Lions: 'Land restriction', Bear: 'Land restriction' },
  })
  const b = record({
    spellAnalysisModel: 'physical-v1',
    spellAnalysis: { Zero: { percentage: 0 } },
    unsupportedSpellAnalysis: { Lions: 'Land restriction', Bear: 'Search budget exceeded' },
  })
  const before = JSON.stringify([a, b])
  const groups = groupComparisonReasons(a, b, ['Lions', 'Bear', 'Zero'])
  expect(groups).toHaveLength(2)
  expect(groups[0]).toMatchObject({ a: ['Lions', 'Bear'], b: ['Lions'] })
  expect(groups[1]).toMatchObject({ a: [], b: ['Bear'] })
  expect(groups[1].reason).toContain('Search budget exceeded')
  expect(JSON.stringify([a, b])).toBe(before)
})
