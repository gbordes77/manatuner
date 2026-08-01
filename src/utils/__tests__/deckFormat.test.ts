import { describe, expect, it } from 'vitest'
import {
  detectDeckFormatFamily,
  formatFamilyLabel,
  landCountGuidance,
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
