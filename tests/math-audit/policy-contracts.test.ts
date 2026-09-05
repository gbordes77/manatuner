import { expect, it } from 'vitest'
import manifest from '../../src/data/paymentPolicyCards.json'
import { policyDeck } from '../../src/services/paymentPolicy/deck'
import { paymentPolicy } from '../../src/services/paymentPolicy/engine'
import { landService } from '../../src/services/landService'
import type { DeckCard } from '../../src/services/deckAnalyzer'
import type { PolicyCard } from '../../src/services/paymentPolicy/types'
const defaults = {
  cost: '{G}',
  turn: 1,
  playDraw: 'PLAY' as const,
  targetKind: 'other' as const,
  life: 20,
  lifeFloor: 1,
  x: 2,
}
function run(resources: PolicyCard[], options = {}) {
  return paymentPolicy({
    ...defaults,
    cards: [
      ...resources,
      { name: 'blank', count: 10 - resources.reduce((n, c) => n + c.count, 0) },
    ],
    ...options,
  })
}
function p(r: ReturnType<typeof run>) {
  expect(r.status).toBe('exact')
  return r.status === 'exact' ? r.probability : NaN
}
const fixture = (name: string): DeckCard => ({
  name,
  quantity: 1,
  manaCost: '',
  colors: [],
  cmc: 0,
  isLand: true,
  resolved: true,
  landMetadata: landService.getLandSync(name) ?? undefined,
})
it('every audited MDFC alias describes the same single physical card', () => {
  const contracts = manifest as Record<string, PolicyCard>
  for (const [name, card] of Object.entries(contracts)) {
    const result = policyDeck([fixture(name)])
    expect('cards' in result).toBe(true)
    if ('cards' in result) {
      expect(result.cards).toHaveLength(1)
      expect(result.cards[0].count).toBe(1)
      expect(result.cards[0].name).toBe(card.name)
    }
  }
})
it('spell/land MDFC choices cannot be duplicated or fetched by the back face', () => {
  const tangled = manifest['Tangled Florahedron'] as PolicyCard
  expect(tangled.searchable).toBe(false)
  expect(tangled.spell).toMatchObject({ cost: '{1}{G}', creature: true })
  expect(p(run([tangled], { turn: 1 }))).toBe(0)
  expect(p(run([tangled], { turn: 2 }))).toBeCloseTo(0.7, 12)
  expect(p(run([tangled], { turn: 2, cost: '{G}{G}' }))).toBe(0)
  const fetch = manifest['Windswept Heath'] as PolicyCard
  expect(p(run([tangled, fetch], { turn: 1 }))).toBe(0)
})
it('modal life lands require the stated life reserve', () => {
  const land = manifest["Agadeem's Awakening"] as PolicyCard
  expect(p(run([land], { cost: '{B}', life: 3 }))).toBe(0)
  expect(p(run([land], { cost: '{B}', life: 4 }))).toBeCloseTo(0.7, 12)
})
it('signets pay activation costs before producing both units', () => {
  const signet = manifest['Izzet Signet'] as PolicyCard
  expect(p(run([signet], { cost: '{U}{R}', turn: 2 }))).toBe(0)
  const forests = policyDeck([{ ...fixture('Forest'), quantity: 3 }])
  expect('cards' in forests).toBe(true)
  if ('cards' in forests)
    expect(p(run([...forests.cards, signet], { cost: '{U}{R}', turn: 3 }))).toBeGreaterThan(0)
})
it('Arcane Signet requires identity, and any color does not include C', () => {
  const card = { ...fixture('Arcane Signet'), isLand: false }
  expect(policyDeck([card])).toHaveProperty('reason')
  const deck = policyDeck([card], true, ['U', 'G'])
  if ('cards' in deck)
    expect(deck.cards[0].spell?.outputs).toEqual([[{ color: 'U' }], [{ color: 'G' }]])
  expect(policyDeck([card], true, ['C'])).toHaveProperty('reason')
})
it('unknown identified resources and MDFCs remain unavailable', () => {
  expect(policyDeck([{ ...fixture('Unknown'), isLand: false, producesMana: true }])).toHaveProperty(
    'reason'
  )
  expect(policyDeck([{ ...fixture('Unknown'), resolved: false }])).toHaveProperty('reason')
})
it('snow origin survives the metadata bridge', () => {
  const result = policyDeck([fixture('Snow-Covered Island')])
  expect('cards' in result).toBe(true)
  if ('cards' in result) expect(p(run(result.cards, { cost: '{S}' }))).toBeCloseTo(0.7, 12)
})
it('Fabled Passage untaps the searched basic only from the fourth land', () => {
  const deck = policyDeck([{ ...fixture('Forest'), quantity: 4 }])
  if (!('cards' in deck)) throw Error('metadata')
  const passage = manifest['Fabled Passage'] as PolicyCard,
    wilds = manifest['Evolving Wilds'] as PolicyCard
  for (const turn of [2, 3])
    expect(
      p(run([...deck.cards, passage], { cost: `{${turn}}`, turn, maxWork: 1000000 }))
    ).toBeCloseTo(p(run([...deck.cards, wilds], { cost: `{${turn}}`, turn, maxWork: 1000000 })), 12)
  const evaluate = (fetch: PolicyCard) =>
    p(
      run([], {
        cards: [...deck.cards, fetch, { name: 'blank', count: 7 }],
        cost: '{4}',
        turn: 4,
        maxWork: 1000000,
      })
    )
  expect(evaluate(passage)).toBeGreaterThan(evaluate(wilds))
})
it('Coldsteel Heart enters tapped and its mana has snow provenance', () => {
  const deck = policyDeck([{ ...fixture('Forest'), quantity: 2 }])
  if (!('cards' in deck)) throw Error('metadata')
  const heart = manifest['Coldsteel Heart'] as PolicyCard
  expect(heart.spell?.chooseOutput).toBe(true)
  expect(p(run([...deck.cards, heart], { cost: '{S}', turn: 2 }))).toBe(0)
  // Three specified resources must all be among the first eight cards.
  expect(p(run([...deck.cards, heart], { cost: '{S}', turn: 3 }))).toBeCloseTo(7 / 15, 12)
  expect(p(run([...deck.cards, heart], { cost: '{S}{S}', turn: 3 }))).toBe(0)
})
it('Strike It Rich can create a second treasure by paying flashback once', () => {
  const deck = policyDeck([{ ...fixture('Mountain'), quantity: 3 }])
  if (!('cards' in deck)) throw Error('metadata')
  const strike = manifest['Strike It Rich'] as PolicyCard
  const options = { cost: '{G}{G}', turn: 3, maxWork: 1000000 }
  expect(
    p(
      run(
        [...deck.cards, { ...strike, spell: { ...strike.spell!, flashbackCost: undefined } }],
        options
      )
    )
  ).toBe(0)
  // All four resources by T3, excluding Strike itself drawn on T3.
  expect(p(run([...deck.cards, strike], options))).toBeCloseTo(8 / 15, 12)
  expect(p(run([...deck.cards, strike], { ...options, cost: '{G}{G}{G}' }))).toBe(0)
})
it('Cultivate reserves a distinct remaining basic for hand, never a duplicate', () => {
  const deck = policyDeck([{ ...fixture('Forest'), quantity: 4 }])
  if (!('cards' in deck)) throw Error('metadata')
  const cultivate = manifest['Cultivate'] as PolicyCard
  expect(cultivate.spell?.search).toMatchObject({ basicOnly: true, tapped: true, toHand: 1 })
  expect(p(run([...deck.cards, cultivate], { cost: '{5}', turn: 4, maxWork: 1000000 }))).toBe(0)
  // No library target exists if all cards are in the opening hand (on play T1).
  expect(
    paymentPolicy({
      ...defaults,
      cost: '{4}',
      cards: [{ ...deck.cards[0], count: 3 }, cultivate, { name: 'blank', count: 3 }],
    })
  ).toMatchObject({ status: 'exact', probability: 0 })
})

it('Cultivate hand placement agrees with an independent hypergeometric case count', () => {
  const deck = policyDeck([{ ...fixture('Forest'), quantity: 5 }])
  if (!('cards' in deck)) throw Error('metadata')
  const cultivate = manifest['Cultivate'] as PolicyCard
  const evaluate = (ramp: PolicyCard) =>
    p(
      run([], {
        cards: [...deck.cards, ramp, { name: 'blank', count: 6 }],
        cost: '{5}',
        turn: 4,
        maxWork: 1000000,
      })
    )
  // First nine cards: Cultivate and 3 or 4 of five Forests. C(12,9)=220.
  // 3 Forests: C(5,3)*C(6,5)=60 hands; 4: C(5,4)*C(6,4)=75.
  // To-hand guarantees the next land drop. Without it, the 3-Forest case needs
  // the remaining Forest as next draw (one of two cards after the search).
  expect(evaluate(cultivate)).toBeCloseTo(135 / 220, 12)
  expect(
    evaluate({
      ...cultivate,
      spell: { ...cultivate.spell!, search: { ...cultivate.spell!.search!, toHand: undefined } },
    })
  ).toBeCloseTo(105 / 220, 12)
})
