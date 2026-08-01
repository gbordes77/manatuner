import { describe, expect, it } from 'vitest'
import {
  castabilityHorizon,
  detectDeckFormatFamily,
  findSingletonViolations,
  formatFamilyLabel,
  isBasicLandName,
  isInCastabilityHorizon,
  landCountGuidance,
  scaleKarstenSources,
  suggestedFormatPreset,
} from '../deckFormat'

describe('detectDeckFormatFamily', () => {
  it('detects Limited for 40-card decks', () => {
    expect(detectDeckFormatFamily(40)).toBe('limited')
    expect(detectDeckFormatFamily(45)).toBe('limited')
  })

  it('detects EDH for 99–100+ cards', () => {
    expect(detectDeckFormatFamily(99)).toBe('edh')
    expect(detectDeckFormatFamily(100)).toBe('edh')
  })

  it('detects Constructed for 60-card decks', () => {
    expect(detectDeckFormatFamily(60)).toBe('constructed')
    expect(detectDeckFormatFamily(75)).toBe('constructed')
  })
})

describe('suggestedFormatPreset', () => {
  it('maps families to removal presets', () => {
    expect(suggestedFormatPreset('edh')).toBe('casual_edh')
    expect(suggestedFormatPreset('limited')).toBe('limited')
    expect(suggestedFormatPreset('constructed')).toBe('modern')
  })
})

describe('labels & guidance', () => {
  it('returns human labels', () => {
    expect(formatFamilyLabel('edh')).toMatch(/Commander/i)
    expect(formatFamilyLabel('limited')).toMatch(/Limited/i)
  })

  it('mentions land guidance for EDH', () => {
    expect(landCountGuidance('edh', 37, 100)).toMatch(/37 lands/)
  })
})

describe('castabilityHorizon (P1-9)', () => {
  it('uses T5–T8 for Commander', () => {
    const h = castabilityHorizon('edh')
    expect(h.minTurn).toBe(5)
    expect(h.maxTurn).toBe(8)
    expect(h.label).toMatch(/T5/)
  })

  it('uses T1–T4 for Constructed and Limited', () => {
    expect(castabilityHorizon('constructed')).toMatchObject({ minTurn: 1, maxTurn: 4 })
    expect(castabilityHorizon('limited')).toMatchObject({ minTurn: 1, maxTurn: 4 })
  })

  it('classifies CMC into horizon', () => {
    expect(isInCastabilityHorizon(6, 'edh')).toBe(true)
    expect(isInCastabilityHorizon(2, 'edh')).toBe(false)
    expect(isInCastabilityHorizon(2, 'constructed')).toBe(true)
    expect(isInCastabilityHorizon(7, 'constructed')).toBe(false)
  })
})

describe('scaleKarstenSources (P1-9)', () => {
  it('leaves 60-card targets unchanged', () => {
    expect(scaleKarstenSources(14, 60)).toBe(14)
    expect(scaleKarstenSources(20, 60)).toBe(20)
  })

  it('scales up for 100-card Commander', () => {
    // 14 * 100/60 ≈ 23.33 → 23
    expect(scaleKarstenSources(14, 100)).toBe(23)
    // 20 * 100/60 ≈ 33.33 → 33
    expect(scaleKarstenSources(20, 100)).toBe(33)
  })

  it('scales down for 40-card Limited', () => {
    // 14 * 40/60 ≈ 9.33 → 9
    expect(scaleKarstenSources(14, 40)).toBe(9)
  })

  it('handles edge cases', () => {
    expect(scaleKarstenSources(0, 100)).toBe(0)
    expect(scaleKarstenSources(14, 0)).toBe(14)
    expect(scaleKarstenSources(50, 40)).toBeLessThanOrEqual(40)
  })
})

describe('singleton helpers', () => {
  it('recognizes basic lands', () => {
    expect(isBasicLandName('Forest')).toBe(true)
    expect(isBasicLandName('Snow-Covered Island')).toBe(true)
    expect(isBasicLandName('Breeding Pool')).toBe(false)
  })

  it('flags non-basic duplicates', () => {
    const v = findSingletonViolations([
      { name: 'Sol Ring', quantity: 1 },
      { name: 'Arcane Signet', quantity: 2 },
      { name: 'Forest', quantity: 10 },
      { name: 'Command Tower', quantity: 1 },
    ])
    expect(v).toEqual(['Arcane Signet'])
  })
})
