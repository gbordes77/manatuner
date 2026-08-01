/**
 * P0-1 regression: mulligan worker payload must be structured-clone safe.
 * DeckCard.etbTapped is a boolean (not a function) — still must clone cleanly.
 */
import { describe, expect, it } from 'vitest'
import type { DeckCard } from '../deckAnalyzer'
import {
  createSeededRng,
  prepareDeckForSimulation,
  toCloneableDeckCards,
} from '../mulliganSimulatorAdvanced'

function landCard(name: string, alwaysTapped = false): DeckCard {
  return {
    name,
    quantity: 4,
    manaCost: '',
    colors: ['G'],
    isLand: true,
    producedMana: ['G'],
    cmc: 0,
    etbTapped: alwaysTapped,
    landMetadata: {
      name,
      category: 'basic',
      produces: ['G'],
      producesAny: false,
      isFetch: false,
      isCreatureLand: false,
      hasChannel: false,
      confidence: 1,
      etbBehavior: { type: alwaysTapped ? 'always_tapped' : 'always_untapped' },
    } as DeckCard['landMetadata'],
  }
}

function spellCard(name: string): DeckCard {
  return {
    name,
    quantity: 4,
    manaCost: '{G}',
    colors: ['G'],
    isLand: false,
    cmc: 1,
  }
}

describe('toCloneableDeckCards (P0-1 worker payload)', () => {
  it('clones lands with boolean etbTapped via structuredClone', () => {
    const cards: DeckCard[] = [landCard('Forest'), spellCard('Llanowar Elves')]
    expect(() => structuredClone(cards)).not.toThrow()

    const plain = toCloneableDeckCards(cards)
    expect(() => structuredClone(plain)).not.toThrow()
    expect(plain[0].etbTapped).toBe(false)
    expect(plain[0].name).toBe('Forest')
    expect(plain[0].landMetadata?.etbBehavior).toBeDefined()
  })

  it('keeps enough data for prepareDeckForSimulation / ETB always_tapped', () => {
    const tappedLand: DeckCard = {
      name: 'Wind-Scarred Crag',
      quantity: 1,
      manaCost: '',
      colors: ['R', 'W'],
      isLand: true,
      producedMana: ['R', 'W'],
      cmc: 0,
      etbTapped: true,
      landMetadata: {
        name: 'Wind-Scarred Crag',
        category: 'utility',
        produces: ['R', 'W'],
        producesAny: false,
        isFetch: false,
        isCreatureLand: false,
        hasChannel: false,
        confidence: 1,
        etbBehavior: { type: 'always_tapped' },
      } as DeckCard['landMetadata'],
    }
    const plain = toCloneableDeckCards([tappedLand])
    const sim = prepareDeckForSimulation(plain)
    expect(sim).toHaveLength(1)
    expect(sim[0].etbTapped).toBe(true)
  })

  it('is safe for an empty deck', () => {
    expect(toCloneableDeckCards([])).toEqual([])
    expect(() => structuredClone(toCloneableDeckCards([]))).not.toThrow()
  })
})

describe('createSeededRng', () => {
  it('is deterministic for the same seed', () => {
    const a = createSeededRng(42)
    const b = createSeededRng(42)
    const seqA = Array.from({ length: 8 }, () => a())
    const seqB = Array.from({ length: 8 }, () => b())
    expect(seqA).toEqual(seqB)
  })

  it('differs across seeds', () => {
    const a = createSeededRng(1)
    const b = createSeededRng(2)
    expect(a()).not.toBe(b())
  })
})
