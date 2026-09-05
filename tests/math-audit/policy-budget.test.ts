import { expect, it } from 'vitest'
import { paymentPolicy } from '../../src/services/paymentPolicy/engine'
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
const forest: PolicyCard = {
  name: 'Forest',
  count: 24,
  searchable: true,
  lands: [{ name: 'Forest', basic: true, types: ['Forest'], outputs: [[{ color: 'G' }]] }],
}
it('handles a full-sized monocolor population against an independent product complement', () => {
  const cards = [forest, { name: 'blank', count: 36 }]
  const r = paymentPolicy({ ...defaults, cards })
  expect(r.status).toBe('exact')
  if (r.status === 'exact') {
    let miss = 1
    for (let i = 0; i < 7; i++) miss *= (36 - i) / (60 - i)
    expect(r.probability).toBeCloseTo(1 - miss, 12)
    expect(r.work).toBeLessThan(1000)
  }
})
it('keeps the resource budget finite for a heterogeneous full-size deck', () => {
  const cards: PolicyCard[] = [
    { ...forest, count: 8 },
    {
      ...forest,
      name: 'Island',
      count: 8,
      lands: [{ name: 'Island', basic: true, types: ['Island'], outputs: [[{ color: 'U' }]] }],
    },
    {
      name: 'fetch',
      count: 8,
      lands: [{ name: 'fetch', outputs: [], search: { basicOnly: true, tapped: false, life: 1 } }],
    },
    { name: 'blank', count: 36 },
  ]
  const r = paymentPolicy({ ...defaults, cards, turn: 4, cost: '{G}{G}{U}{U}', maxWork: 10000 })
  expect(r).toMatchObject({ status: 'unsupported', code: 'budget', work: 10001 })
  expect(r).not.toHaveProperty('probability')
  // A refused invocation must not contaminate a subsequent simpler call.
  expect(paymentPolicy({ ...defaults, cards: [forest, { name: 'blank', count: 36 }] }).status).toBe(
    'exact'
  )
})
it('rejects zero life reserves and malformed restricted searches', () => {
  expect(paymentPolicy({ ...defaults, cards: [forest], lifeFloor: 0 })).toMatchObject({
    status: 'unsupported',
    code: 'invalid-input',
  })
  const bad = {
    ...forest,
    lands: [{ ...forest.lands![0], outputs: [], search: { tapped: false } }],
  }
  expect(paymentPolicy({ ...defaults, cards: [bad] })).toMatchObject({
    status: 'unsupported',
    code: 'invalid-input',
  })
})

it('malformed land metadata is unavailable instead of throwing or fabricating mana', () => {
  const cards = [{ name: 'bad', count: 10, lands: [{ name: 'bad' }] }] as PolicyCard[]
  expect(paymentPolicy({ ...defaults, cards })).toMatchObject({
    status: 'unsupported',
    code: 'invalid-input',
  })
})
