import { landService } from '../../src/services/landService'
import { describe, it, expect, vi, afterEach } from 'vitest'
import { hypergeom, cardsSeenByTurn } from '../../src/services/castability/hypergeom'
import {
  computeAcceleratedCastabilityAtTurn,
  producerOnlineProbByTurn,
} from '../../src/services/castability/acceleratedAnalyticEngine'
import { computeColorDeltas } from '../../src/components/analyzer/karstenDeltas'
import { DeckAnalyzer, type DeckCard, type AnalysisResult } from '../../src/services/deckAnalyzer'
import {
  _generateTurnPlanForTest as plan,
  prepareDeckForSimulation,
  analyzeWithArchetype,
  type SimulatedCard,
  type SimulatedHand,
} from '../../src/services/mulliganSimulatorAdvanced'
import { ManaCalculator } from '../../src/services/manaCalculator'
import { exactTail } from './oracle'
import type { DeckManaProfile, ProducerInDeck } from '../../src/types/manaProducers'
const ctx = { playDraw: 'PLAY' as const, removalRate: 0 }
const deck: DeckManaProfile = { deckSize: 60, totalLands: 24, landColorSources: { G: 24 } }
const elf: ProducerInDeck = {
  copies: 4,
  def: {
    name: 'Llanowar Elves',
    type: 'DORK',
    castCostGeneric: 0,
    castCostColors: { G: 1 },
    delay: 1,
    isCreature: true,
    producesAmount: 1,
    activationTax: 0,
    producesMask: 16,
    producesAny: false,
    oneShot: false,
  },
}
function land(name: string, colors: string[]): SimulatedCard {
  return {
    name,
    cmc: 0,
    isLand: true,
    quantity: 1,
    producedMana: colors,
    manaCost: { colorless: 0, symbols: {} },
  }
}
function spell(name: string, symbols: Record<string, number>): SimulatedCard {
  return {
    name,
    cmc: Object.values(symbols).reduce((a, b) => a + b, 0),
    isLand: false,
    quantity: 1,
    manaCost: { colorless: 0, symbols },
  }
}
function hand(lands: SimulatedCard[], spells: SimulatedCard[]): SimulatedHand {
  return {
    cards: [...lands, ...spells],
    lands,
    spells,
    landCount: lands.length,
    totalCMC: spells.reduce((s, c) => s + c.cmc, 0),
  }
}
afterEach(() => vi.restoreAllMocks())
describe('Audit regressions — first-principle counterexamples', () => {
  it.each([
    [60, 61, 7, 0],
    [60, -1, 7, 0],
    [60, 20, 61, 0],
    [60.5, 20, 7, 0],
  ])('rejects invalid tail population %j %j %j %j', (N, K, n, k) =>
    expect(hypergeom.atLeast(N, K, n, k)).toBe(0)
  )
  it.each([
    [60, NaN, 7],
    [60, 2, 61],
    [60, 61, 7],
  ])('invalid draw-one inputs never become certainty %j %j %j', (N, K, n) =>
    expect(hypergeom.atLeastOneCopy(N, K, n)).toBe(0)
  )
  it('real-valued tail threshold uses ceil for an integer random variable', () =>
    expect(hypergeom.atLeast(10, 4, 3, 1.5)).toBeCloseTo(exactTail(10, 4, 3, 2), 12))
  it('no four land drops on turn one', () =>
    expect(
      computeAcceleratedCastabilityAtTurn(
        hypergeom,
        deck,
        { mv: 4, generic: 4, pips: {} },
        1,
        [],
        ctx
      ).p2
    ).toBe(0))
  it('a zero mana cost needs no land', () =>
    expect(
      computeAcceleratedCastabilityAtTurn(
        hypergeom,
        { deckSize: 60, totalLands: 0, landColorSources: {} },
        { mv: 0, generic: 0, pips: {} },
        1,
        [],
        ctx
      ).p2
    ).toBe(1))
  it('turn-one elf is available on turn two', () =>
    expect(producerOnlineProbByTurn(hypergeom, deck, elf, 2, ctx)).toBeGreaterThan(0))
  it('a dual and a Forest cannot pay WU', () => {
    const result = plan(
      hand([land('dual', ['W', 'U']), land('Forest', ['G'])], [spell('WU', { W: 1, U: 1 })]),
      []
    )
    expect(result.flatMap((t) => t.plays)).not.toContain('WU')
  })
  it('a dual cannot pay W and U in two different spells on the same turn', () => {
    const tappedDual = { ...land('dual', ['W', 'U']), etbTapped: true }
    const result = plan(hand([tappedDual], [spell('W', { W: 1 }), spell('U', { U: 1 })]), [
      land('Forest', ['G']),
    ])
    expect(result[1].plays).toHaveLength(1)
  })
  it('the mulligan parser preserves required colorless mana', () => {
    const parsed = prepareDeckForSimulation([
      {
        name: 'Eldrazi',
        quantity: 1,
        manaCost: '{1}{C}',
        cmc: 2,
        isLand: false,
        colors: [],
      } as DeckCard,
    ])
    expect(parsed[0].manaCost.symbols.C).toBe(1)
  })
  it('Karsten pivot selects the largest source target, not the largest pip count', () => {
    const analysis = {
      totalCards: 60,
      colorDistribution: { R: 10 },
      cards: [
        { manaCost: '{R}', cmc: 1, isLand: false },
        { manaCost: '{8}{R}{R}', cmc: 10, isLand: false },
      ],
    } as AnalysisResult
    expect(computeColorDeltas(analysis)[0].required).toBe(14)
  })
  it('four pips use the existing four-pip table', () => {
    const analysis = {
      totalCards: 60,
      colorDistribution: { B: 20 },
      cards: [{ manaCost: '{B}{B}{B}{B}', cmc: 4, isLand: false }],
    } as AnalysisResult
    expect(computeColorDeltas(analysis)[0].required).toBe(24)
  })
  it('missing all required sources gives no color consistency', async () => {
    const cards = [
      {
        name: 'Forest',
        quantity: 24,
        cmc: 0,
        isLand: true,
        colors: [],
        producedMana: ['G'],
        manaCost: '',
      },
      {
        name: 'Lightning Bolt',
        quantity: 36,
        cmc: 1,
        isLand: false,
        colors: ['R'],
        manaCost: '{R}',
      },
    ] as DeckCard[]
    cards.forEach((c) => {
      c.resolved = true
    })
    cards[0].landMetadata = landService.getLandSync('Forest')!
    vi.spyOn(DeckAnalyzer as any, 'parseDeckList').mockResolvedValue(cards)
    const result = await DeckAnalyzer.analyzeDeck('24 Forest\n36 Lightning Bolt')
    expect(result.consistency).toBe(0)
    expect(result.probabilities.turn1.anyColor).toBeCloseTo(exactTail(60, 24, 7, 1), 12)
    expect(result.spellAnalysis['Lightning Bolt'].percentage).toBe(0)
  })
  it('empty color demand does not crash the optimizer', () =>
    expect(new ManaCalculator().optimizeManabase({ cards: [], totalLands: 24 })).toEqual({}))
  it('an all-land opening hand belongs to the terrible category', () => {
    const result = (DeckAnalyzer as any).calculateMulliganAnalysis(40, 40, {})
    expect(result.terribleHand).toBe(100)
  })
  it('rejects zero simulations before dividing by zero', () => {
    const cards = [
      {
        name: 'Forest',
        quantity: 40,
        cmc: 0,
        isLand: true,
        colors: [],
        producedMana: ['G'],
        manaCost: '',
      },
    ] as DeckCard[]
    expect(() => analyzeWithArchetype(cards, 'midrange', 0, { seed: 1 })).toThrow()
  })
})

it('the source-access API rejects a nonexistent turn or invalid opening sample', () => {
  const calculator = new ManaCalculator()
  expect(() => calculator.calculateManaProbability(60, 24, 0, 1)).toThrow(RangeError)
  expect(() => calculator.calculateManaProbability(60, 24, 2, 1, true, 7.5)).toThrow(RangeError)
})
