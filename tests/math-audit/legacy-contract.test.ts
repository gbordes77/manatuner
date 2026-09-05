import { PrivacyStorage } from '../../src/lib/privacy'
import { afterEach, expect, it, vi } from 'vitest'
import { compareTempoImpact } from '../../src/services/manaCalculator'
import {
  computeAcceleratedCastabilityAtTurn,
  computeAcceleratedCastability,
  computeCastabilityByTurn,
} from '../../src/services/castability'
import { hypergeom } from '../../src/services/castability/hypergeom'
import { landService } from '../../src/services/landService'
const land = { ...landService.getLandSync('Island')!, category: 'fetch' as const, isFetch: true }
const deck = { deckSize: 10, totalLands: 1, landColorSources: { U: 1 }, physicalLands: [land] }
const cost = { mv: 1, generic: 0, pips: { U: 1 } }
const ctx = { playDraw: 'PLAY' as const, removalRate: 0, defaultRockSurvival: 1 }
it('tempo comparison retains the heuristic method and exact refusal through JSON export', () => {
  const result = JSON.parse(JSON.stringify(compareTempoImpact([land], 10, 1))).U
  expect(result.method).toBe('heuristic')
  expect(result.reason).toMatch(/Unsupported/)
})
it('legacy acceleration APIs identify estimates after physical refusal', () => {
  const result = computeAcceleratedCastabilityAtTurn(hypergeom, deck, cost, 1, [], ctx)
  expect(result.method).toBe('heuristic')
  expect(result.assumptions).toMatch(/aggregate/i)
  const full = computeAcceleratedCastability(deck, cost, [], ctx)
  expect(full.base.method).toBe('heuristic')
  expect(full.withAcceleration.method).toBe('heuristic')
  expect(full.method).toBe('heuristic')
  for (const row of computeCastabilityByTurn(deck, cost, [], ctx, 2)) {
    expect(row.base.method).toBe('heuristic')
    expect(row.withAcceleration.method).toBe('heuristic')
  }
})
it('represented physical results retain their distinct event', () => {
  const result = computeAcceleratedCastabilityAtTurn(
    hypergeom,
    { ...deck, physicalLands: [landService.getLandSync('Island')!] },
    cost,
    1,
    [],
    ctx
  )
  expect(result.method).toBe('exact')
  expect(result.assumptions).toMatch(/potential/i)
})

afterEach(() => vi.unstubAllGlobals())
it('native saved-analysis export/import preserves methods and unknown risk', () => {
  const stored = new Map<string, string>()
  vi.stubGlobal('localStorage', {
    getItem: (key: string) => stored.get(key) ?? null,
    setItem: (key: string, value: string) => stored.set(key, value),
    removeItem: (key: string) => stored.delete(key),
    clear: () => stored.clear(),
  })
  const analysis = { atRiskSpells: null, tempoImpactByColor: compareTempoImpact([land], 10, 1) }
  PrivacyStorage.saveAnalysis({ deckName: 'Contract', deckList: '1 fetch', analysis })
  const exported = PrivacyStorage.exportAnalyses()
  localStorage.clear()
  PrivacyStorage.importAnalyses(exported)
  expect(PrivacyStorage.getMyAnalyses()[0].analysis).toEqual(analysis)
  localStorage.clear()
})
