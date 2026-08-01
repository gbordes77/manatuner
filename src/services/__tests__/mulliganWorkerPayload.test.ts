/**
 * P0-1 regression: mulligan worker payload must be structured-clone safe.
 * DeckCard.etbTapped is a function on land cards after parse — that must
 * never be posted to a Worker.
 */
import { describe, expect, it } from 'vitest'
import type { DeckCard } from '../deckAnalyzer'
import { prepareDeckForSimulation, toCloneableDeckCards } from '../mulliganSimulatorAdvanced'

function landWithFn(name: string): DeckCard {
  return {
    name,
    quantity: 4,
    manaCost: '',
    colors: ['G'],
    isLand: true,
    producedMana: ['G'],
    cmc: 0,
    etbTapped: () => false,
    landMetadata: {
      name,
      category: 'basic',
      produces: ['G'],
      producesAny: false,
      isFetch: false,
      isCreatureLand: false,
      hasChannel: false,
      confidence: 1,
      etbBehavior: { type: 'always_untapped' },
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
  it('strips etbTapped functions so structuredClone succeeds', () => {
    const cards: DeckCard[] = [landWithFn('Forest'), spellCard('Llanowar Elves')]
    // Raw cards with functions must fail clone (documents the bug)
    expect(() => structuredClone(cards)).toThrow()

    const plain = toCloneableDeckCards(cards)
    expect(() => structuredClone(plain)).not.toThrow()
    expect(plain[0].etbTapped).toBeUndefined()
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
      etbTapped: () => true,
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
