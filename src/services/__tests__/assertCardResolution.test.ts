import { describe, expect, it } from 'vitest'
import { DeckAnalyzer, type DeckCard } from '../deckAnalyzer'

function card(partial: Partial<DeckCard> & { name: string; quantity: number }): DeckCard {
  const resolution = partial.resolution ?? (partial.resolved === false ? 'not_found' : 'ok')
  const resolved = partial.resolved ?? resolution === 'ok'
  return {
    manaCost: '{2}',
    colors: [],
    isLand: false,
    cmc: 2,
    ...partial,
    resolved: partial.resolved ?? resolved,
    resolution: partial.resolution ?? resolution,
  }
}

describe('DeckAnalyzer.assertCardResolution (EDGE-GARBAGE)', () => {
  it('allows empty card list (no throw)', () => {
    expect(() => DeckAnalyzer.assertCardResolution([])).not.toThrow()
  })

  it('allows fully resolved deck', () => {
    const cards = [
      card({ name: 'Lightning Bolt', quantity: 4, resolution: 'ok' }),
      card({ name: 'Mountain', quantity: 20, isLand: true, resolution: 'ok' }),
    ]
    expect(() => DeckAnalyzer.assertCardResolution(cards)).not.toThrow()
  })

  it('allows one typo among mostly resolved cards', () => {
    const cards = [
      card({ name: 'Lightning Bolt', quantity: 4, resolution: 'ok' }),
      card({ name: 'TypoCardNameXYZ', quantity: 1, resolution: 'not_found' }),
      card({ name: 'Mountain', quantity: 20, isLand: true, resolution: 'ok' }),
    ]
    expect(() => DeckAnalyzer.assertCardResolution(cards)).not.toThrow()
  })

  it('throws when zero cards resolved — all not_found (garbage)', () => {
    const cards = [
      card({ name: 'NotARealCardXYZ123', quantity: 4, resolution: 'not_found' }),
      card({ name: 'CompletelyFakeSpell99', quantity: 4, resolution: 'not_found' }),
      card({ name: 'ImaginaryLandFoo', quantity: 20, resolution: 'not_found' }),
    ]
    expect(() => DeckAnalyzer.assertCardResolution(cards)).toThrow(/could not resolve any cards/i)
  })

  it('throws when zero cards resolved — all unavailable (rate limit / offline)', () => {
    const cards = [
      card({ name: 'NotARealCardXYZ123', quantity: 4, resolution: 'unavailable' }),
      card({ name: 'CompletelyFakeSpell99', quantity: 4, resolution: 'unavailable' }),
    ]
    expect(() => DeckAnalyzer.assertCardResolution(cards)).toThrow(
      /could not resolve any cards|scryfall unavailable/i
    )
  })

  it('throws when majority of quantity is not_found', () => {
    const cards = [
      card({ name: 'Lightning Bolt', quantity: 4, resolution: 'ok' }),
      card({ name: 'FakeA', quantity: 10, resolution: 'not_found' }),
      card({ name: 'FakeB', quantity: 10, resolution: 'not_found' }),
    ]
    // 20/24 not_found > 50%
    expect(() => DeckAnalyzer.assertCardResolution(cards)).toThrow(/could not resolve most cards/i)
  })

  it('does not throw when majority is only unavailable (rate limit) if land seed resolved some', () => {
    // 20 Mountains ok from seed, 40 spells unavailable under 429 — must still analyze
    const cards = [
      card({ name: 'Mountain', quantity: 20, isLand: true, resolution: 'ok' }),
      card({ name: 'Lightning Bolt', quantity: 40, resolution: 'unavailable' }),
    ]
    expect(() => DeckAnalyzer.assertCardResolution(cards)).not.toThrow()
  })

  it('does not throw at exactly 50% not_found', () => {
    const cards = [
      card({ name: 'Real', quantity: 10, resolution: 'ok' }),
      card({ name: 'Fake', quantity: 10, resolution: 'not_found' }),
    ]
    expect(() => DeckAnalyzer.assertCardResolution(cards)).not.toThrow()
  })
})
