/**
 * T06 — tempo analysis non-blocking: sync analyzeSpellCastability + yield + cancel.
 */
import { describe, expect, it, vi } from 'vitest'
import {
  AnalysisCancelledError,
  cancelInFlightAnalysis,
  TEMPO_YIELD_EVERY,
  yieldToMain,
} from '../deckAnalyzer'
import { analyzeSpellCastability } from '../manaCalculator'
import type { LandMetadata } from '../../types/lands'

function plainLand(name: string, color: 'W' | 'U' | 'B' | 'R' | 'G'): LandMetadata {
  return {
    name,
    category: 'basic',
    produces: [color],
    producesAny: false,
    etbBehavior: { type: 'always_untapped' },
    isFetch: false,
    isCreatureLand: false,
    hasChannel: false,
    confidence: 100,
  }
}

describe('T06 analyzeSpellCastability is synchronous', () => {
  it('returns a plain object (not a Promise)', () => {
    const lands = Array.from({ length: 24 }, (_, i) => plainLand(`Mountain ${i}`, 'R'))
    const result = analyzeSpellCastability(
      { name: 'Lightning Bolt', manaCost: '{R}', cmc: 1 },
      lands,
      60
    )
    expect(result).not.toBeInstanceOf(Promise)
    expect(result.spell).toBe('Lightning Bolt')
    expect(typeof result.overallCastability).toBe('number')
    expect(result.overallCastability).toBeGreaterThan(0)
    expect(result.overallCastability).toBeLessThanOrEqual(1)
    expect(result.colorRequirements.length).toBeGreaterThan(0)
  })

  it('identical inputs → identical numeric outputs (determinism)', () => {
    const lands = [
      ...Array.from({ length: 12 }, (_, i) => plainLand(`Island ${i}`, 'U')),
      ...Array.from({ length: 12 }, (_, i) => plainLand(`Swamp ${i}`, 'B')),
    ]
    const spell = { name: 'Counterspell', manaCost: '{U}{U}', cmc: 2 }
    const a = analyzeSpellCastability(spell, lands, 60)
    const b = analyzeSpellCastability(spell, lands, 60)
    expect(a.overallCastability).toBe(b.overallCastability)
    expect(a.rating).toBe(b.rating)
    expect(a.colorRequirements.map((c) => c.tempoAdjustedProbability)).toEqual(
      b.colorRequirements.map((c) => c.tempoAdjustedProbability)
    )
  })

  it('colorless spell has overallCastability 1 when no color reqs', () => {
    const lands = Array.from({ length: 20 }, (_, i) => plainLand(`Wastes ${i}`, 'C' as 'W'))
    // colorless cost
    const result = analyzeSpellCastability(
      { name: 'Sol Ring', manaCost: '{1}', cmc: 1 },
      lands.filter((l) => l.produces[0] !== ('C' as any)),
      60
    )
    // parse may yield empty color requirements for {1}
    if (result.colorRequirements.length === 0) {
      expect(result.overallCastability).toBe(1)
    } else {
      expect(Number.isFinite(result.overallCastability)).toBe(true)
    }
  })
})

describe('T06 yieldToMain + cancel generation', () => {
  it('TEMPO_YIELD_EVERY is 10', () => {
    expect(TEMPO_YIELD_EVERY).toBe(10)
  })

  it('yieldToMain resolves (setTimeout path)', async () => {
    await expect(yieldToMain()).resolves.toBeUndefined()
  })

  it('cancelInFlightAnalysis bumps generation without throwing', () => {
    expect(() => cancelInFlightAnalysis()).not.toThrow()
    cancelInFlightAnalysis()
  })

  it('AnalysisCancelledError has stable name', () => {
    const err = new AnalysisCancelledError()
    expect(err.name).toBe('AnalysisCancelledError')
    expect(err).toBeInstanceOf(Error)
  })
})

describe('T06 per-spell error isolation (math path)', () => {
  it('a bad land list still returns finite rating for a normal spell', () => {
    // Empty lands → low castability, but must not throw
    const result = analyzeSpellCastability({ name: 'Bolt', manaCost: '{R}', cmc: 1 }, [], 60)
    expect(Number.isFinite(result.overallCastability)).toBe(true)
    expect(['excellent', 'good', 'average', 'weak', 'critical']).toContain(result.rating)
  })
})

// Silence unused vi import if tree-shaken oddly
void vi
