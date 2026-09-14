import { describe, expect, it } from 'vitest'
import type { AnalysisResult } from '../../services/deckAnalyzer'
import {
  csvDeckComment,
  analysisContextText,
  analysisDeckText,
  analysisTextReport,
  csvText,
} from '../analysisText'

const fixture = {
  totalCards: 99,
  totalLands: 40,
  landRatio: 40 / 99,
  averageCMC: 2.5,
  consistency: 0.91,
  manaRequirements: { W: 1 },
  probabilities: Object.fromEntries(
    ['turn1', 'turn2', 'turn3', 'turn4'].map((turn) => [
      turn,
      { anyColor: 0.9, specificColors: { W: 0.91 } },
    ])
  ),
  mulliganAnalysis: {
    perfectHand: 71,
    goodHand: 77,
    averageHand: 19,
    poorHand: 3,
    terribleHand: 1,
  },
  cards: [
    { name: 'Plains', quantity: 40, isLand: true },
    { name: 'Savannah Lions', quantity: 59, isLand: false },
    { name: 'Éowyn, Shieldmaiden', quantity: 1, isCommander: true },
    { name: 'Negate', quantity: 2, isSideboard: true },
  ],
  spellAnalysisModel: 'physical-v1',
  spellAnalysis: { 'Savannah Lions': { percentage: 91.2345 } },
  recommendations: ['Consider the local metagame.'],
} as unknown as AnalysisResult

describe('analysis text report', () => {
  it('retains percentage units, populations and all zones without changing the source', () => {
    const before = JSON.stringify(fixture)
    const text = analysisTextReport(fixture, 'Commander test')
    expect(text).toContain('Library: 99 cards; 40 lands. Commander: 1; sideboard: 2.')
    expect(text).toContain('Health: 91.00%')
    expect(text).toContain('Good (2–4 lands): 77.00%')
    expect(text).not.toContain('7700')
    expect(text).toContain('Poor (0 or 6 lands): 3.00%')
    expect(text).toContain('Terrible (7 lands, or 0 lands without an early play): 1.00%')
    expect(text).toContain('Savannah Lions: 91.23%')
    expect(text).toContain('Commander\n1 Éowyn, Shieldmaiden')
    expect(text).toContain('Sideboard\n2 Negate')
    expect(text).toContain('categories overlap')
    expect(JSON.stringify(fixture)).toBe(before)
  })
  it('does not assign the physical contract or numeric spell result to a legacy model', () => {
    const legacy = { ...fixture, spellAnalysisModel: undefined }
    expect(analysisContextText(legacy)).toContain('Saved comparison contract unavailable')
    expect(analysisContextText(legacy)).not.toContain('X=2')
    expect(analysisTextReport(legacy, 'Old')).toContain('Savannah Lions: Unavailable')
  })
  it('keeps ordinary deck text exact for sharing', () => {
    expect(analysisDeckText(fixture)).toBe(
      'Deck\n40 Plains\n59 Savannah Lions\n\nCommander\n1 Éowyn, Shieldmaiden\n\nSideboard\n2 Negate'
    )
  })
})

describe('CSV text cell protection', () => {
  it.each(['=1+1', '+1+1', '-1+1', '@SUM(A1)', '\t=1+1', '\r=1+1', '  =1+1'])(
    'neutralizes a leading formula marker in %j',
    (value) => {
      expect(csvText(value).replace(/^"/, '')).toMatch(/^'/)
    }
  )
  it('preserves ordinary Unicode names and RFC CSV escaping', () => {
    expect(csvText('Éclair ⚡')).toBe('Éclair ⚡')
    expect(csvText('Éowyn, Shieldmaiden')).toBe('"Éowyn, Shieldmaiden"')
    expect(csvText('A "quote"')).toBe('"A ""quote"""')
    expect(csvText('Forest')).toBe('Forest')
  })
})

describe('CSV deck metadata compatibility', () => {
  it('keeps # first and uses a quoted CSV field for a comma/quote name', () => {
    expect(csvDeckComment('Persona, "White"')).toBe('# Deck:,"Persona, ""White"""')
  })
  it('keeps multiline names on one physical comment line', () => {
    const comment = csvDeckComment('First\r\n=1+1')
    expect(comment.startsWith('#')).toBe(true)
    expect(comment).not.toMatch(/[\r\n]/)
    expect(comment).toContain('First\\r\\n=1+1')
  })
  it('protects formula metadata and preserves commas inside its CSV field', () => {
    expect(csvDeckComment('=1+1')).toBe("# Deck:,'=1+1")
    expect(csvDeckComment('Safe,=1+1')).toBe('# Deck:,"Safe,=1+1"')
  })
})
