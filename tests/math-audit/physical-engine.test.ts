import { calculateTempoAwareProbability } from '../../src/services/manaCalculator'
import { expect, it } from 'vitest'
import { physicalManaProbability as probability } from '../../src/services/castability/physicalManaEngine'
import { landService } from '../../src/services/landService'
import { getProducerFromSeed } from '../../src/data/manaProducerSeed'
import type { LandMetadata } from '../../src/types/lands'
import type { DeckManaProfile, ProducerManaCost } from '../../src/types/manaProducers'
import { exactTail, exactPmf, enumerateHands, canPay } from './oracle'
const land = (name: string) => landService.getLandSync(name)!
const profile = (N: number, lands: LandMetadata[]): DeckManaProfile => ({
  deckSize: N,
  totalLands: lands.length,
  landColorSources: {},
  physicalLands: lands,
})
function check(
  deck: DeckManaProfile,
  cost: ProducerManaCost,
  turn: number,
  expected: number,
  producer?: string,
  copies = 1
) {
  const result = probability(
    deck,
    cost,
    turn,
    producer ? [{ def: getProducerFromSeed(producer)!, copies }] : []
  )
  expect(result.status, JSON.stringify(result)).toBe('exact')
  if (result.status === 'exact') expect(result.p2).toBeCloseTo(expected, 11)
}
it('M01: joint WU matches exhaustive physical payments', () => {
  const lands = [land('Plains'), land('Plains'), land('Island'), land('Island')]
  const hands = enumerateHands([...lands.map((l) => l.produces), [], [], [], [], [], []], 8)
  const expected =
    hands.filter((h) =>
      canPay(
        h.filter((x) => x.length),
        ['W', 'U']
      )
    ).length / hands.length
  check(profile(10, lands), { mv: 2, generic: 0, pips: { W: 1, U: 1 } }, 2, expected)
})
it('M02: one dual cannot pay two different pips', () =>
  check(
    profile(10, [{ ...land('Plains'), produces: ['W', 'U'] }, ...Array(3).fill(land('Forest'))]),
    { mv: 2, generic: 0, pips: { W: 1, U: 1 } },
    2,
    0
  ))
it('M03: a turn-one tapland untaps on turn two', () =>
  check(
    profile(60, Array(24).fill({ ...land('Island'), etbBehavior: { type: 'always_tapped' } })),
    { mv: 1, generic: 0, pips: { U: 1 } },
    2,
    exactTail(60, 24, 7, 1)
  ))
it('M04: one elf and one Forest are jointly required', () =>
  check(
    profile(10, [land('Forest')]),
    { mv: 2, generic: 2, pips: {} },
    2,
    (7 * 6) / 90,
    'Llanowar Elves'
  ))
it('M05: Sol Ring can be cast and activated turn one', () =>
  check(
    profile(10, [land('Forest')]),
    { mv: 2, generic: 2, pips: {} },
    1,
    (7 * 6) / 90,
    'Sol Ring'
  ))
it('M06: two copies of the same elf can both be used', () =>
  check(
    profile(10, [land('Forest')]),
    { mv: 3, generic: 3, pips: {} },
    3,
    49 / 120,
    'Llanowar Elves',
    2
  ))
it('M07: generic mana is part of the payment', () =>
  check(profile(60, [land('Island')]), { mv: 2, generic: 1, pips: { U: 1 } }, 2, 0))
it('M08: hybrid is a union of physical sources', () =>
  check(
    profile(60, [...Array(12).fill(land('Plains')), ...Array(12).fill(land('Island'))]),
    { mv: 1, generic: 0, pips: {}, hybrid: [3] },
    1,
    exactTail(60, 24, 7, 1)
  ))
it('never treats any color as colorless', () =>
  check(
    profile(60, Array(24).fill({ ...land('Plains'), producesAny: true })),
    { mv: 1, generic: 0, pips: { C: 1 } },
    1,
    0
  ))
it('rejects missing physical overlap instead of inventing a joint probability', () => {
  expect(
    probability(
      { deckSize: 60, totalLands: 24, landColorSources: { W: 12, U: 12 } },
      { mv: 2, generic: 0, pips: { W: 1, U: 1 } },
      2
    ).status
  ).toBe('unsupported')
})
it('a resource limit returns no numeric partial result', () => {
  const r = probability(
    profile(60, Array(24).fill(land('Island'))),
    { mv: 2, generic: 0, pips: { U: 2 } },
    2,
    [],
    'PLAY',
    1
  )
  expect(r.status).toBe('unsupported')
  expect('p2' in r).toBe(false)
})
it('a dork cannot activate on the turn it is cast', () =>
  check(profile(10, [land('Forest')]), { mv: 2, generic: 2, pips: {} }, 1, 0, 'Llanowar Elves'))
it.each([40, 60, 99, 100])(
  'physical mono cases in a %i-card library agree with the independent trivariate oracle',
  (N) => {
    const L = Math.floor(N * 0.4),
      K = Math.floor(L * 0.6)
    const lands = [...Array(K).fill(land('Mountain')), ...Array(L - K).fill(land('Forest'))]
    for (const [mv, pips] of [
      [1, 1],
      [2, 1],
      [2, 2],
      [3, 2],
      [3, 3],
      [4, 4],
      [4, 2],
    ]) {
      // Enumerate exact counts of red sources and other lands independently.
      let expected = 0
      for (let r = pips; r <= Math.min(K, 6 + mv); r++)
        for (let other = Math.max(0, mv - r); other <= Math.min(L - K, 6 + mv - r); other++)
          expected += exactPmf(N, K, 6 + mv, r) * exactPmf(N - K, L - K, 6 + mv - r, other)
      check(profile(N, lands), { mv, generic: mv - pips, pips: { R: pips } }, mv, expected)
    }
  }
)
it('varied dual overlaps agree with exhaustive physical assignment', () => {
  const masks = [['W'], ['U'], ['W', 'U'], ['G']]
  for (let offset = 0; offset < 16; offset++) {
    const lands = Array.from({ length: 5 }, (_, i) => ({
      ...land('Plains'),
      produces: masks[
        (i * i + offset + i * Math.floor(offset / 4)) % 4
      ] as LandMetadata['produces'],
    }))
    for (const needed of [
      ['W', 'U'],
      ['W', 'W'],
      ['W', 'W', 'U'],
    ]) {
      const mv = needed.length
      const cards = [...lands.map((l) => l.produces), [], [], [], [], []]
      const hands = enumerateHands(cards, 6 + mv)
      const expected =
        hands.filter((h) =>
          canPay(
            h.filter((c) => c.length),
            needed
          )
        ).length / hands.length
      const pips = Object.fromEntries(
        ['W', 'U'].map((c) => [c, needed.filter((n) => n === c).length])
      )
      check(profile(10, lands), { mv, generic: 0, pips }, mv, expected)
    }
  }
})
it('unverified producer conditions are rejected, including superficially simple rocks', () => {
  const stone = { ...getProducerFromSeed('Sol Ring')!, name: 'Fellwar Stone' }
  expect(
    probability(profile(60, Array(24).fill(land('Forest'))), { mv: 2, generic: 2, pips: {} }, 2, [
      { def: stone, copies: 1 },
    ]).status
  ).toBe('unsupported')
})
it('Sol Ring mana cannot retroactively pay for an elf on turn one', () => {
  const producers = ['Llanowar Elves', 'Sol Ring'].map((name) => ({
    def: getProducerFromSeed(name)!,
    copies: 1,
  }))
  const result = probability(
    profile(10, [land('Forest')]),
    { mv: 4, generic: 4, pips: {} },
    2,
    producers
  )
  expect(result.status).toBe('exact')
  if (result.status === 'exact') expect(result.p2).toBe(0)
})
it('play/draw timing includes the turn-one draw without removing summoning sickness', () => {
  const producer = [{ def: getProducerFromSeed('Llanowar Elves')!, copies: 1 }]
  const result = probability(
    profile(10, [land('Forest')]),
    { mv: 2, generic: 2, pips: {} },
    2,
    producer,
    'DRAW'
  )
  expect(result.status).toBe('exact')
  if (result.status === 'exact') expect(result.p2).toBeCloseTo((8 * 7) / 90, 12)
})
it('opening and next draw exhaustive oracle validates a two-producer chain', () => {
  const hands = enumerateHands(
    Array.from({ length: 10 }, (_, i) => i),
    7
  )
  let wins = 0,
    total = 0
  for (const h of hands)
    for (let draw = 0; draw < 10; draw++)
      if (!h.includes(draw)) {
        total++
        if (h.includes(0) && [...h, draw].includes(1) && [...h, draw].includes(2)) wins++
      }
  // 0 = Forest, 1 = Elf, 2 = Sol Ring. At least one accelerator is in the opener.
  const result = probability(
    profile(10, [land('Forest')]),
    { mv: 4, generic: 4, pips: {} },
    3,
    ['Llanowar Elves', 'Sol Ring'].map((name) => ({ def: getProducerFromSeed(name)!, copies: 1 }))
  )
  expect(result.status).toBe('exact')
  if (result.status === 'exact') expect(result.p2).toBeCloseTo(wins / total, 12)
})
it('unrepresented enormous pip counts are rejected before allocating a symbol array', () => {
  expect(
    probability(
      profile(60, Array(24).fill(land('Forest'))),
      { mv: 1_000_000_000, generic: 0, pips: { G: 1_000_000_000 } },
      1
    ).status
  ).toBe('unsupported')
})

it('raw tempo sources also distinguish any color from C', () => {
  const result = calculateTempoAwareProbability({
    deck: { totalCards: 60, lands: Array(24).fill({ ...land('Plains'), producesAny: true }) },
    targetTurn: 1,
    colorNeeded: 'C',
    symbolsNeeded: 1,
    strategy: 'balanced',
  })
  expect(result.raw).toBe(0)
  expect(result.tempoAdjusted).toBe(0)
})
it('cached probabilities remain independent of caller mutation and budget changes', () => {
  const deck = profile(10, [land('Forest')])
  const cost = { mv: 1, generic: 0, pips: { G: 1 } }
  const first = probability(deck, cost, 1)
  expect(first.status).toBe('exact')
  if (first.status === 'exact') first.p2 = 999
  const second = probability(deck, cost, 1)
  expect(second.status).toBe('exact')
  if (second.status === 'exact') expect(second.p2).toBeCloseTo(0.7, 12)
  expect(probability(deck, cost, 1, [], 'PLAY', 1).status).toBe('unsupported')
  const draw = probability(deck, cost, 1, [], 'DRAW')
  if (draw.status === 'exact') expect(draw.p2).toBeCloseTo(0.8, 12)
})
