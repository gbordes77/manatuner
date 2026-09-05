/** Regression cases discovered by the 2026-09-05 audit.
 * Physical metadata is now supplied where marginal source counts were insufficient.
 * These are ordinary assertions: no expected-failure exemption remains.
 */
import { it, expect, afterAll } from 'vitest'
import { writeFileSync } from 'node:fs'
import { hypergeom } from '../../src/services/castability/hypergeom'
import {
  computeAcceleratedCastabilityAtTurn as cast,
  producerOnlineProbByTurn,
} from '../../src/services/castability/acceleratedAnalyticEngine'
import {
  calculateTempoAwareProbability,
  analyzeSpellCastability,
} from '../../src/services/manaCalculator'
import { getProducerFromSeed } from '../../src/data/manaProducerSeed'
import { landService } from '../../src/services/landService'
import { exactTail, enumerateHands, canPay } from './oracle'
const ctx = { playDraw: 'PLAY' as const, removalRate: 0, defaultRockSurvival: 1 }
const finding = it
const rows: unknown[] = []
function compare(id: string, actual: number, expected: number) {
  rows.push({
    id,
    actual,
    expected,
    delta: actual - expected,
    status: Math.abs(actual - expected) < 1e-10 ? 'PASS' : 'FAIL',
  })
  expect(actual).toBeCloseTo(expected, 10)
}
afterAll(() =>
  writeFileSync('/tmp/mtg-audit-known-limitations.json', JSON.stringify(rows, null, 2))
)
finding('M01: min of marginal color probabilities overstates joint WU', () => {
  const cards = [['W'], ['W'], ['U'], ['U'], [], [], [], [], [], []]
  const hands = enumerateHands(cards, 8)
  const expected =
    hands.filter((h) =>
      canPay(
        h.filter((s) => s.length > 0),
        ['W', 'U']
      )
    ).length / hands.length
  const actual = cast(
    hypergeom,
    {
      deckSize: 10,
      totalLands: 4,
      landColorSources: { W: 2, U: 2 },
      physicalLands: ['Plains', 'Plains', 'Island', 'Island'].map(
        (name) => landService.getLandSync(name)!
      ),
    },
    { mv: 2, generic: 0, pips: { W: 1, U: 1 } },
    2,
    [],
    ctx
  ).p2
  compare('M01', actual, expected)
})
finding('M02: a single WU dual is not two independent lands', () => {
  const actual = cast(
    hypergeom,
    {
      deckSize: 10,
      totalLands: 4,
      landColorSources: { W: 1, U: 1, G: 3 },
      physicalLands: [
        { ...landService.getLandSync('Plains')!, produces: ['W', 'U'] },
        ...Array(3).fill(landService.getLandSync('Forest')!),
      ],
    },
    { mv: 2, generic: 0, pips: { W: 1, U: 1 } },
    2,
    [],
    ctx
  ).p2
  compare('M02', actual, 0)
})
finding('M03: taplands played on turn one untap on turn two', () => {
  const tap = {
    ...landService.getLandSync('Island')!,
    etbBehavior: { type: 'always_tapped' as const },
  }
  const actual = calculateTempoAwareProbability({
    deck: { lands: Array(24).fill(tap), totalCards: 60 },
    targetTurn: 2,
    colorNeeded: 'U',
    symbolsNeeded: 1,
    strategy: 'balanced',
  }).tempoAdjusted
  compare('M03', actual, exactTail(60, 24, 7, 1))
})
finding('M04: drawing a producer and its casting land are dependent', () => {
  const elf = getProducerFromSeed('Llanowar Elves')!
  const actual = producerOnlineProbByTurn(
    hypergeom,
    {
      deckSize: 10,
      totalLands: 1,
      landColorSources: { G: 1 },
      physicalLands: [landService.getLandSync('Forest')!],
    },
    { def: elf, copies: 1 },
    2,
    ctx
  )
  compare('M04', actual, (7 * 6) / (10 * 9))
})
finding('M05: turn-one Sol Ring can cast a two-mana generic spell', () => {
  const actual = cast(
    hypergeom,
    {
      deckSize: 10,
      totalLands: 1,
      landColorSources: { G: 1 },
      physicalLands: [landService.getLandSync('Forest')!],
    },
    { mv: 2, generic: 2, pips: {} },
    1,
    [{ def: getProducerFromSeed('Sol Ring')!, copies: 1 }],
    ctx
  ).p2
  compare('M05', actual, (7 * 6) / (10 * 9))
})
finding('M06: two copies of one dork type can both be online', () => {
  const actual = cast(
    hypergeom,
    {
      deckSize: 10,
      totalLands: 1,
      landColorSources: { G: 1 },
      physicalLands: [landService.getLandSync('Forest')!],
    },
    { mv: 3, generic: 3, pips: {} },
    3,
    [{ def: getProducerFromSeed('Llanowar Elves')!, copies: 2 }],
    ctx
  ).p2
  // Enumerate 120 opening hands and each of their 3 possible next draws.
  const hands = enumerateHands(
    Array.from({ length: 10 }, (_, i) => i),
    7
  )
  let wins = 0,
    total = 0
  for (const h of hands)
    for (let next = 0; next < 10; next++)
      if (!h.includes(next)) {
        total++
        if (
          h.includes(0) &&
          h.some((i) => i === 1 || i === 2) &&
          [...h, next].includes(1) &&
          [...h, next].includes(2)
        )
          wins++
      }
  compare('M06', actual, wins / total)
})
finding('M07: tempo castability must include the generic cost', () => {
  const lands = Array(1).fill(landService.getLandSync('Island')!)
  const actual = analyzeSpellCastability(
    { name: '1U', manaCost: '{1}{U}', cmc: 2 },
    lands,
    60
  ).overallCastability
  compare('M07', actual, 0)
})
finding('M08: hybrid payment is a union, not the better marginal', () => {
  const lands = [
    ...Array(12).fill(landService.getLandSync('Island')!),
    ...Array(12).fill(landService.getLandSync('Plains')!),
  ]
  const actual = analyzeSpellCastability(
    { name: 'W/U', manaCost: '{W/U}', cmc: 1 },
    lands,
    60
  ).overallCastability
  compare('M08', actual, exactTail(60, 24, 7, 1))
})
