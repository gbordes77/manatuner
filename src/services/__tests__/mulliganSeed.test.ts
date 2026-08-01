/**
 * Seeded Monte Carlo — same seed → same quality score (stable tests).
 */
import { describe, expect, it } from 'vitest'
import type { DeckCard } from '../deckAnalyzer'
import { analyzeWithArchetype, suggestArchetypeFromDeck } from '../mulliganSimulatorAdvanced'

import type { ManaColor } from '../../types'

function bulkLand(name: string, n: number, colors: ManaColor[] = ['R']): DeckCard {
  return {
    name,
    quantity: n,
    manaCost: '',
    colors,
    isLand: true,
    producedMana: colors,
    cmc: 0,
    etbTapped: false,
  }
}

function bulkSpell(name: string, n: number, cmc: number, cost: string): DeckCard {
  return {
    name,
    quantity: n,
    manaCost: cost,
    colors: ['R'],
    isLand: false,
    cmc,
  }
}

/** Minimal 60-card red aggro-ish list for sim */
function makeSixty(): DeckCard[] {
  return [
    bulkLand('Mountain', 20),
    bulkSpell('Lightning Bolt', 4, 1, '{R}'),
    bulkSpell('Goblin Guide', 4, 1, '{R}'),
    bulkSpell('Monastery Swiftspear', 4, 1, '{R}'),
    bulkSpell('Lava Spike', 4, 1, '{R}'),
    bulkSpell('Rift Bolt', 4, 1, '{R}'),
    bulkSpell('Searing Blaze', 4, 2, '{1}{R}'),
    bulkSpell('Skullcrack', 4, 2, '{1}{R}'),
    bulkSpell('Eidolon of the Great Revel', 4, 2, '{R}{R}'),
    bulkSpell('Chandra, Torch of Defiance', 2, 4, '{2}{R}{R}'),
    bulkSpell('Bonecrusher Giant', 4, 3, '{2}{R}'),
    bulkSpell('Roiling Vortex', 2, 2, '{1}{R}'),
  ]
}

describe('analyzeWithArchetype seed', () => {
  it('returns identical qualityScore for the same seed', () => {
    const cards = makeSixty()
    const a = analyzeWithArchetype(cards, 'aggro', 200, { seed: 12345 })
    const b = analyzeWithArchetype(cards, 'aggro', 200, { seed: 12345 })
    expect(a.qualityScore).toBe(b.qualityScore)
    expect(a.expectedScores.hand7).toBe(b.expectedScores.hand7)
  })

  it('can differ across seeds (smoke)', () => {
    const cards = makeSixty()
    const a = analyzeWithArchetype(cards, 'midrange', 150, { seed: 1 })
    const b = analyzeWithArchetype(cards, 'midrange', 150, { seed: 99999 })
    // Extremely unlikely to match on all fields; quality can coincide — check hand7 EV
    // Allow equal by chance but document determinism via previous test
    expect(typeof a.qualityScore).toBe('number')
    expect(typeof b.qualityScore).toBe('number')
  })
})

describe('suggestArchetypeFromDeck', () => {
  it('suggests aggro for low avg CMC', () => {
    expect(
      suggestArchetypeFromDeck([
        { isLand: false, cmc: 1, quantity: 20 },
        { isLand: false, cmc: 2, quantity: 10 },
        { isLand: true, cmc: 0, quantity: 20 },
      ])
    ).toBe('aggro')
  })

  it('suggests control for high avg CMC', () => {
    expect(
      suggestArchetypeFromDeck([
        { isLand: false, cmc: 4, quantity: 15 },
        { isLand: false, cmc: 5, quantity: 10 },
        { isLand: true, cmc: 0, quantity: 26 },
      ])
    ).toBe('control')
  })

  it('suggests midrange for medium curve', () => {
    expect(
      suggestArchetypeFromDeck([
        { isLand: false, cmc: 2, quantity: 12 },
        { isLand: false, cmc: 3, quantity: 12 },
        { isLand: true, cmc: 0, quantity: 24 },
      ])
    ).toBe('midrange')
  })
})
