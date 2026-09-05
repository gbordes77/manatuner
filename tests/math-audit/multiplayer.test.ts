import { expect, it } from 'vitest'
import {
  analyzeWithArchetype,
  prepareDeckForSimulation,
  _generateTurnPlanForTest,
} from '../../src/services/mulliganSimulatorAdvanced'
import type { DeckCard } from '../../src/services/deckAnalyzer'
const cards = [
  {
    name: 'Forest',
    quantity: 24,
    manaCost: '',
    cmc: 0,
    isLand: true,
    producedMana: ['G'],
    colors: [],
  },
  { name: 'Spell', quantity: 36, manaCost: '{G}', cmc: 1, isLand: false, colors: ['G'] },
] as DeckCard[]
it('free redraw improves or preserves EV and uses the paid-seven continuation threshold', () => {
  const paid = analyzeWithArchetype(cards, 'aggro', 100, { seed: 532 })
  const free = analyzeWithArchetype(cards, 'aggro', 100, { seed: 532, multiplayer: true })
  expect(free.expectedScores.hand7).toBeGreaterThanOrEqual(paid.expectedScores.hand7)
  expect(free.thresholds.keep7).toBe(paid.expectedScores.hand7)
  expect(free.paidSevenThreshold).toBe(paid.thresholds.keep7)
  expect(free.distributions).toEqual(paid.distributions)
})
it('multiplayer illustrative plans consume the first draw on turn one', () => {
  const deck = prepareDeckForSimulation(cards)
  const spell = deck[24],
    forest = deck[0]
  const hand = { cards: [spell], spells: [spell], lands: [], landCount: 0, totalCMC: 1 }
  expect(_generateTurnPlanForTest(hand, [forest])[0].plays).toEqual([])
  expect(_generateTurnPlanForTest(hand, [forest], true)[0].plays).toEqual(['Spell'])
})
it('illustrative payments honor hybrid choices and reject unsupported symbols', () => {
  const input = [
    cards[0],
    { ...cards[1], name: 'Hybrid', manaCost: '{G/U}' },
    { ...cards[1], name: 'Snow', manaCost: '{S}' },
  ]
  const deck = prepareDeckForSimulation(input)
  const forest = deck[0],
    hybrid = deck[24],
    snow = deck[60]
  const hand = {
    cards: [forest, hybrid, snow],
    spells: [hybrid, snow],
    lands: [forest],
    landCount: 1,
    totalCMC: 2,
  }
  expect(_generateTurnPlanForTest(hand, [])[0].plays).toEqual(['Hybrid'])
})
it('zero-cost spells can be played with no lands and X uses the explicit default two', () => {
  const zero = prepareDeckForSimulation([{ ...cards[1], manaCost: '{0}', cmc: 0, quantity: 1 }])[0]
  const hand = { cards: [zero], spells: [zero], lands: [], landCount: 0, totalCMC: 0 }
  expect(_generateTurnPlanForTest(hand, [])[0].plays).toEqual(['Spell'])
  expect(
    prepareDeckForSimulation([{ ...cards[1], manaCost: '{X}{G}', cmc: 1, quantity: 1 }])[0].cmc
  ).toBe(3)
})

it('mulligan scores do not use fabricated unresolved card costs or fractional quantities', () => {
  expect(() =>
    analyzeWithArchetype([{ ...cards[0], resolved: false }, cards[1]], 'aggro', 1)
  ).toThrow(/resolved/)
  expect(() =>
    analyzeWithArchetype([{ ...cards[0], quantity: 24.5 }, cards[1]], 'aggro', 1)
  ).toThrow(/quantities/)
})
