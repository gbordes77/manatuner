import { describe, expect, it } from 'vitest'
import { landService } from '../../../src/services/landService'
import { parseDecklistLine, cleanCardName, applyCommanderFallback, detectSideboardStartLine } from '../../../src/services/deckParser'
import { parsePhysicalCost } from '../../../src/services/castability/parsePhysicalCost'
import { physicalManaProbability } from '../../../src/services/castability/physicalManaEngine'

// Replaces tests against a nonexistent parseDeckList export and invented result
// fields. These exercise public contracts. Full import/population behavior is
// independently covered in tests/math-audit/populations.test.ts.
const land = name => {
  const value = landService.getLandSync(name)
  expect(value, name).not.toBeNull()
  return value
}
const result = l => physicalManaProbability({ deckSize: 60, totalLands: 24, landColorSources: {}, physicalLands: Array(24).fill(l) }, parsePhysicalCost('{U}'), 1)
describe('Special card contracts', () => {
  it('fetchlands have target types and are not treated as direct exact sources', () => {
    const fetch = land('Flooded Strand')
    expect(fetch.isFetch).toBe(true)
    expect(fetch.fetchTargets).toEqual(expect.arrayContaining(['Plains', 'Island']))
    expect(result(fetch).status).toBe('unsupported')
  })
  it('shocklands retain their payment-dependent entry', () => {
    const shock = land('Hallowed Fountain')
    expect(shock.basicLandTypes).toEqual(['Plains', 'Island'])
    expect(shock.etbBehavior.condition).toEqual({ type: 'pay_life', amount: 2 })
    expect(result(shock).status).toBe('unsupported')
  })
  it('pathways retain a face choice, not freely switching dual mana', () => {
    const pathway = land('Needleverge Pathway')
    expect(pathway.category).toBe('pathway')
    expect(result(pathway).status).toBe('unsupported')
  })
  it('a spell/land double face is not silently accepted as an ordinary land', () => {
    expect(result({ ...land('Mountain'), name: 'Valakut Awakening // Valakut Stoneforge', isMDFC: true }).status).toBe('unsupported')
  })
  it('phyrexian life payment remains explicit unsupported, never a free cost', () => {
    expect(parsePhysicalCost('{U/P}').unsupportedSymbols).toBe(true)
  })
  it('X is explicitly chosen for every X symbol', () => {
    expect(parsePhysicalCost('{X}{X}', 3)).toMatchObject({ mv: 6, generic: 6 })
    expect(parsePhysicalCost('{X}{R}', 0)).toMatchObject({ mv: 1, generic: 0, pips: { R: 1 } })
  })
  it('land destruction utility lands still produce colorless mana', () => {
    for (const name of ['Ghost Quarter', 'Tectonic Edge', 'Wasteland', 'Strip Mine']) expect(land(name).produces).toEqual(['C'])
  })
  it('Mutavault is colorless, not any color', () => {
    expect(land('Mutavault').produces).toEqual(['C'])
    expect(land('Mutavault').producesAny).toBe(false)
  })
  it('Commander cannot be inferred from the first card or library size', () => {
    const cards = [{ name: 'Atraxa', quantity: 1, isLand: false }, { name: 'Forest', quantity: 99, isLand: true }]
    expect(applyCommanderFallback(cards)).toEqual(cards)
  })
  it('the deck line parser does not claim format legality or rarity', () => {
    expect(parseDecklistLine('4 Lightning Bolt')).toEqual({ name: 'Lightning Bolt', quantity: 4 })
  })
  it('Arena set decorations are stripped from the card resolution name', () => {
    expect(cleanCardName('Lightning Bolt (M11) 146')).toBe('Lightning Bolt')
  })
  it('explicit sideboard headers delimit the library zone', () => {
    expect(detectSideboardStartLine(['4 Lightning Bolt', '4 Counterspell', 'Sideboard:', '3 Pyroblast'])).toBe(2)
  })
})
