import { expect, it } from 'vitest'
import { paymentPolicy } from '../../src/services/paymentPolicy/engine'
import type { PolicyCard, PolicyInput } from '../../src/services/paymentPolicy/types'
const forest: PolicyCard = {
  name: 'Forest',
  count: 1,
  searchable: true,
  lands: [{ name: 'Forest', basic: true, types: ['Forest'], outputs: [[{ color: 'G' }]] }],
}
const fetch: PolicyCard = {
  name: 'fetch',
  count: 1,
  searchable: true,
  lands: [{ name: 'fetch', outputs: [], search: { basicOnly: true, tapped: false, life: 1 } }],
}
const defaults = {
  cost: '{G}',
  turn: 1,
  playDraw: 'PLAY' as const,
  targetKind: 'other' as const,
  life: 20,
  lifeFloor: 1,
  x: 2,
}
function run(cards: PolicyCard[], changes: Partial<PolicyInput> = {}) {
  return paymentPolicy({
    ...defaults,
    cards: [...cards, { name: 'blank', count: 10 - cards.reduce((n, c) => n + c.count, 0) }],
    ...changes,
  })
}
function probability(result: ReturnType<typeof run>) {
  expect(result.status).toBe('exact')
  return result.status === 'exact' ? result.probability : NaN
}
it('an untapped fetch searches the remaining library, not an extra copy', () => {
  // Independent complement: neither of two useful identities in seven = C(8,7)/C(10,7).
  expect(probability(run([forest, fetch]))).toBeCloseTo(1 - 8 / 120, 12)
  expect(probability(run([fetch]))).toBe(0)
  expect(probability(run([forest, { ...fetch, count: 3 }], { cost: '{G}{G}', turn: 2 }))).toBe(0)
})
it('life is consumed and a tapped search cannot pay on the turn of activation', () => {
  expect(probability(run([forest, fetch], { life: 1 }))).toBeCloseTo(0.7, 12)
  const tapped = {
    ...fetch,
    lands: [{ ...fetch.lands![0], search: { basicOnly: true, tapped: true } }],
  }
  expect(probability(run([forest, tapped]))).toBeCloseTo(0.7, 12)
  expect(probability(run([forest, tapped], { turn: 2 }))).toBeGreaterThan(0.7)
})
it('typed nonbasic targets are eligible, basic-only targets are not', () => {
  const typed = { ...forest, lands: [{ ...forest.lands![0], basic: false }] }
  expect(probability(run([typed, fetch]))).toBeCloseTo(0.7, 12)
  const typedFetch = {
    ...fetch,
    lands: [{ ...fetch.lands![0], search: { types: ['Forest'], tapped: false } }],
  }
  expect(probability(run([typed, typedFetch]))).toBeCloseTo(1 - 8 / 120, 12)
})
it('a modal card is one physical resource; a fixed face cannot change for an elf', () => {
  const modal = {
    ...forest,
    searchable: false,
    lands: [forest.lands![0], { name: 'Red', outputs: [[{ color: 'R' }]] }],
  }
  const elf: PolicyCard = {
    name: 'elf',
    count: 1,
    spell: { kind: 'producer', cost: '{G}', creature: true, outputs: [[{ color: 'G' }]] },
  }
  expect(probability(run([modal, elf], { cost: '{R}{G}', turn: 2 }))).toBe(0)
  expect(probability(run([modal, elf], { cost: '{G}{G}', turn: 2 }))).toBeCloseTo(
    (7 * 6) / (10 * 9),
    12
  )
  expect(probability(run([modal], { cost: '{G}{R}', turn: 2 }))).toBe(0)
})
it('rituals pay installation, treasures and petal are consumed once', () => {
  const ritual: PolicyCard = {
    name: 'ritual',
    count: 1,
    spell: {
      kind: 'ritual',
      cost: '{G}',
      outputs: [[{ color: 'R' }, { color: 'R' }, { color: 'R' }]],
    },
  }
  expect(probability(run([forest, ritual], { cost: '{R}{R}{R}' }))).toBeCloseTo(
    (7 * 6) / (10 * 9),
    12
  )
  expect(probability(run([ritual], { cost: '{R}' }))).toBe(0)
  const petal: PolicyCard = {
    name: 'petal',
    count: 1,
    spell: { kind: 'producer', cost: '{0}', sacrifice: true, outputs: [[{ color: 'G' }]] },
  }
  expect(probability(run([petal]))).toBeCloseTo(0.7, 12)
  expect(probability(run([petal], { cost: '{G}{G}' }))).toBe(0)
  const treasure: PolicyCard = {
    name: 'treasure creator',
    count: 1,
    spell: { kind: 'treasure', cost: '{G}' },
  }
  expect(probability(run([forest, treasure], { cost: '{R}', turn: 1 }))).toBeCloseTo(
    (7 * 6) / (10 * 9),
    12
  )
})
it('ramp removes a remaining target, consumes its real cost, and puts it in play tapped', () => {
  const ramp: PolicyCard = {
    name: 'ramp',
    count: 1,
    spell: { kind: 'ramp', cost: '{G}', search: { basicOnly: true, tapped: true } },
  }
  expect(probability(run([{ ...forest, count: 2 }, ramp], { cost: '{G}{G}', turn: 1 }))).toBe(0)
  expect(probability(run([forest, ramp], { cost: '{G}{G}', turn: 2 }))).toBe(0)
  expect(
    probability(run([{ ...forest, count: 2 }, ramp], { cost: '{G}{G}', turn: 2 }))
  ).toBeGreaterThan(0)
})
it('entry life payments and mana restrictions are evaluated during real payment', () => {
  const shock = { ...forest, lands: [{ ...forest.lands![0], entryLife: 2 }] }
  expect(probability(run([shock], { life: 2 }))).toBe(0)
  expect(probability(run([shock], { life: 3 }))).toBeCloseTo(0.7, 12)
  const restricted = {
    ...forest,
    lands: [{ ...forest.lands![0], outputs: [[{ color: 'G', creatureOnly: true }]] }],
  }
  expect(probability(run([restricted]))).toBe(0)
  expect(probability(run([restricted], { targetKind: 'creature' }))).toBeCloseTo(0.7, 12)
})
it('grouping equivalent sources preserves results and reduces work', () => {
  const cards = [forest, { ...forest, name: 'same effect, different name' }, fetch]
  const grouped = run(cards, { turn: 2 })
  const ungrouped = run(cards, { turn: 2, optimize: false })
  expect(probability(grouped)).toBeCloseTo(probability(ungrouped), 12)
  if (grouped.status === 'exact' && ungrouped.status === 'exact')
    expect(grouped.work).toBeLessThan(ungrouped.work)
})
it('budget and invalid inputs never publish partial results', () => {
  const r = run([forest, fetch], { maxWork: 1 })
  expect(r).toMatchObject({ status: 'unsupported', code: 'budget' })
  expect(r).not.toHaveProperty('probability')
  expect(run([forest], { lifeFloor: 21 })).toMatchObject({
    status: 'unsupported',
    code: 'invalid-input',
  })
  expect(run([forest], { cost: '{Q}' })).toMatchObject({ status: 'unsupported', code: 'mechanic' })
})
