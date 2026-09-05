import { expect, it } from 'vitest'
import rows from '../../docs/math/extensions-2026-09-06/fetch-oracle.json'
import { paymentPolicy } from '../../src/services/paymentPolicy/engine'
import { physicalManaProbability } from '../../src/services/castability/physicalManaEngine'
import { landService } from '../../src/services/landService'
import type { PolicyCard } from '../../src/services/paymentPolicy/types'
for (const row of rows)
  it(`independent rational search oracle: tapped=${row.fetchTapped} T${row.turn} draw=${row.draw}`, () => {
    const cards: PolicyCard[] = [
      {
        name: 'fetch',
        count: 2,
        lands: [
          { name: 'fetch', outputs: [], search: { basicOnly: true, tapped: row.fetchTapped } },
        ],
      },
      ...[
        ['G', 'Forest'],
        ['W', 'Plains'],
      ].map(([color, name]) => ({
        name,
        count: 1,
        searchable: true,
        lands: [{ name, basic: true, types: [name], outputs: [[{ color }]] }],
      })),
      { name: 'blank', count: 6 },
    ]
    const result = paymentPolicy({
      cards,
      cost: '{G}{W}',
      turn: row.turn,
      playDraw: row.draw ? 'DRAW' : 'PLAY',
      targetKind: 'other',
      life: 20,
      lifeFloor: 1,
      x: 2,
    })
    expect(result.status).toBe('exact')
    if (result.status === 'exact')
      expect(result.probability).toBeCloseTo(row.numerator / row.denominator, 12)
  })
it('decisions cannot select a pathway face using next turn’s unseen draw', () => {
  const cards: PolicyCard[] = [
    {
      name: 'pathway',
      count: 1,
      lands: [
        { name: 'red', outputs: [[{ color: 'R' }]] },
        { name: 'green', outputs: [[{ color: 'G' }]] },
      ],
    },
    ...[
      ['G', 'Forest'],
      ['R', 'Mountain'],
    ].map(([color, name]) => ({ name, count: 1, lands: [{ name, outputs: [[{ color }]] }] })),
    { name: 'blank', count: 7 },
  ]
  const policy = paymentPolicy({
    cards,
    cost: '{G}{R}',
    turn: 2,
    playDraw: 'PLAY',
    targetKind: 'other',
    life: 20,
    lifeFloor: 1,
    x: 2,
  })
  const potential = physicalManaProbability(
    {
      deckSize: 10,
      totalLands: 3,
      landColorSources: {},
      physicalLands: ['Cragcrown Pathway', 'Forest', 'Mountain'].map(
        (n) => landService.getLandSync(n)!
      ),
    },
    { mv: 2, generic: 0, pips: { G: 1, R: 1 } },
    2
  )
  expect(policy.status).toBe('exact')
  expect(potential.status).toBe('exact')
  if (policy.status === 'exact' && potential.status === 'exact') {
    // Seven openings contain only the pathway and six blanks: 7/C(10,7).
    // Future Forest / Mountain / blank: policy 1/3, hindsight 2/3.
    expect(potential.p2 - policy.probability).toBeCloseTo(7 / 360, 12)
  }
})
