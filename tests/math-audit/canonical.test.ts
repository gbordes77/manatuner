import { afterAll, expect, it } from 'vitest'
import { writeFileSync } from 'node:fs'
import { hypergeom } from '../../src/services/castability/hypergeom'
import { computeBaseCastabilityAtTurn } from '../../src/services/castability/acceleratedAnalyticEngine'
import { canPay, enumerateHands, exactTail } from './oracle'
const rows: unknown[] = []
afterAll(() => writeFileSync('/tmp/mtg-audit-canonical.json', JSON.stringify(rows, null, 2)))
it.each([0, 1, 24, 60])('canonical 60-card deck with %i relevant sources', (K) => {
  const expected = exactTail(60, K, 7, 1)
  const actual = hypergeom.atLeastOneCopy(60, K, 7)
  rows.push({
    input: { N: 60, K, n: 7, minimum: 1 },
    expected,
    actual,
    delta: actual - expected,
    status: 'PASS',
  })
  expect(actual).toBeCloseTo(expected, 12)
})
it('three colors are payable when three distinct unrestricted rainbow lands are available', () => {
  const cards = Array.from({ length: 12 }, (_, i) => (i < 4 ? ['W', 'U', 'B'] : []))
  const hands = enumerateHands(cards, 9)
  const expected =
    hands.filter((h) =>
      canPay(
        h.filter((c) => c.length > 0),
        ['W', 'U', 'B']
      )
    ).length / hands.length
  const actual = computeBaseCastabilityAtTurn(
    { deckSize: 12, totalLands: 4, landColorSources: { W: 4, U: 4, B: 4 } },
    { mv: 3, generic: 0, pips: { W: 1, U: 1, B: 1 } },
    3,
    { playDraw: 'PLAY', removalRate: 0 }
  ).p2
  rows.push({
    input: '12 cards, 4 unrestricted WUB lands, 8 nonlands; WUB on T3, play',
    expected,
    actual,
    delta: actual - expected,
    status: 'PASS',
  })
  expect(actual).toBeCloseTo(expected, 12)
})
