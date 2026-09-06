import { describe, it, expect } from 'vitest'
import { writeFileSync } from 'node:fs'
import { hypergeom, cardsSeenByTurn } from '../../src/services/castability/hypergeom'
import { computeBaseCastabilityAtTurn } from '../../src/services/castability/acceleratedAnalyticEngine'
import { ManaCalculator, calculateHypergeometric } from '../../src/services/manaCalculator'
import {
  _shuffleDeckForTest,
  _scoreHandForTest,
  createSeededRng,
  type SimulatedCard,
  type SimulatedHand,
} from '../../src/services/mulliganSimulatorAdvanced'
import { exactPmf, exactTail, enumerateHands } from './oracle'
const ctx = { playDraw: 'PLAY' as const, removalRate: 0, defaultRockSurvival: 1 }
const rows: unknown[] = []
describe('Independent exact and exhaustive validation', () => {
  it('enumerates all subsets for every population N=0..10', () => {
    let checked = 0,
      maxError = 0
    for (let N = 0; N <= 10; N++)
      for (let n = 0; n <= N; n++) {
        const hands = enumerateHands(
          Array.from({ length: N }, (_, i) => i),
          n
        )
        for (let K = 0; K <= N; K++) {
          const histogram = Array(n + 1).fill(0)
          hands.forEach((h) => histogram[h.filter((i) => i < K).length]++)
          for (let k = 0; k <= n; k++) {
            const brute = histogram[k] / hands.length,
              exact = exactPmf(N, K, n, k),
              actual = hypergeom.pmf(N, K, n, k)
            maxError = Math.max(maxError, Math.abs(actual - exact))
            checked++
            expect(exact).toBeCloseTo(brute, 13)
            expect(actual).toBeCloseTo(brute, 12)
          }
        }
      }
    console.log('EXHAUSTIVE', JSON.stringify({ checked, maxError }))
  })
  it('validates PMF, normalization, tail and wrapper against integer combinations in every format', () => {
    for (const N of [40, 60, 80, 99, 100, 250, 1000])
      for (const K of [0, 1, Math.floor(0.4 * N), N])
        for (const n of [0, 7, 8, 10, 16]) {
          let sum = 0
          for (let k = 0; k <= n; k++) {
            const p = hypergeom.pmf(N, K, n, k)
            sum += p
            expect(p).toBeCloseTo(exactPmf(N, K, n, k), 10)
          }
          expect(sum).toBeCloseTo(1, 10)
          for (const k of [0, 1, 2, 3, 4, 17]) {
            const p = exactTail(N, K, n, k)
            expect(hypergeom.atLeast(N, K, n, k)).toBeCloseTo(p, 10)
            expect(hypergeom.atMost(N, K, n, k)).toBeCloseTo(1 - exactTail(N, K, n, k + 1), 10)
            expect(
              calculateHypergeometric({
                deckSize: N,
                successStates: K,
                sampleSize: n,
                successesWanted: k,
              })
            ).toBeCloseTo(p, 10)
            expect(new ManaCalculator().cumulativeHypergeometric(N, K, n, k)).toBeCloseTo(p, 10)
          }
        }
  })
  it('checks monotonicity in sources, draws and required successes', () => {
    for (const N of [40, 60, 99, 100])
      for (let n = 0; n < 17; n++)
        for (let K = 0; K < N; K++) {
          const p = hypergeom.atLeast(N, K, n, 2)
          expect(hypergeom.atLeast(N, K + 1, n, 2) + 1e-10).toBeGreaterThanOrEqual(p)
          expect(hypergeom.atLeast(N, K, n + 1, 2) + 1e-10).toBeGreaterThanOrEqual(p)
          expect(hypergeom.atLeast(N, K, n, 3)).toBeLessThanOrEqual(p + 1e-10)
        }
  })
  it.each(Array.from({ length: 10 }, (_, i) => i + 1))(
    'validates play/draw semantics T%i independently',
    (t) => {
      expect(cardsSeenByTurn(t, 'PLAY')).toBe(6 + t)
      expect(cardsSeenByTurn(t, 'DRAW')).toBe(7 + t)
      for (const N of [40, 60, 99, 100])
        for (const mode of ['PLAY', 'DRAW'] as const) {
          const actual = new ManaCalculator().calculateManaProbability(
            N,
            12,
            t,
            1,
            mode === 'PLAY'
          ).probability
          expect(actual).toBeCloseTo(exactTail(N, 12, 7 + t - (mode === 'PLAY' ? 1 : 0), 1), 11)
        }
    }
  )
  it('validates total mana and one-color pip requirements with a trivariate oracle', () => {
    for (const N of [40, 60, 99, 100])
      for (const [mv, pips] of [
        [1, 1],
        [2, 1],
        [2, 2],
        [3, 2],
        [3, 3],
        [4, 4],
        [4, 2],
      ]) {
        const L = Math.floor(N * 0.4),
          K = Math.floor(L * 0.6),
          n = 6 + mv
        let expected = 0
        for (let lands = mv; lands <= Math.min(n, L); lands++)
          expected += exactPmf(N, L, n, lands) * exactTail(L, K, lands, pips)
        const actual = computeBaseCastabilityAtTurn(
          { deckSize: N, totalLands: L, landColorSources: { R: K } },
          { mv, generic: mv - pips, pips: { R: pips } },
          mv,
          ctx
        ).p2
        rows.push({
          N,
          L,
          K,
          mv,
          pips,
          expected,
          actual,
          delta: actual - expected,
          status: Math.abs(actual - expected) < 1e-10 ? 'PASS' : 'FAIL',
        })
        expect(actual).toBeCloseTo(expected, 11)
      }
    writeFileSync(`${process.env.MANATUNER_MATH_EVIDENCE_DIR || '/tmp'}/mtg-audit-exact-results.json`, JSON.stringify(rows, null, 2))
  })
  it('compares one million production shuffles to exact hypergeometric, with an independent sampler', () => {
    const count = 1_000_000,
      N = 10,
      K = 4,
      n = 3,
      k = 2,
      expected = exactTail(N, K, n, k)
    const cards = Array.from(
      { length: N },
      (_, i) => ({ name: String(i), isLand: i < K }) as SimulatedCard
    )
    const rng = createSeededRng(20260905)
    // Park-Miller reference RNG, sequential urn draws, no shuffle or production helpers.
    let state = 74219,
      successes = 0,
      referenceSuccesses = 0
    const uniform = () => {
      state = (state * 16807) % 2147483647
      return state / 2147483647
    }
    for (let i = 0; i < count; i++) {
      if (
        _shuffleDeckForTest(cards, rng)
          .slice(0, n)
          .filter((c) => c.isLand).length >= k
      )
        successes++
      let remaining = K,
        hits = 0
      for (let j = 0; j < n; j++)
        if (uniform() < remaining / (N - j)) {
          hits++
          remaining--
        }
      if (hits >= k) referenceSuccesses++
    }
    const se = Math.sqrt((expected * (1 - expected)) / count)
    const result = {
      count,
      seed: 20260905,
      expected,
      production: successes / count,
      independent: referenceSuccesses / count,
      se,
      margin95: 1.96 * se,
    }
    console.log('MONTE_CARLO', JSON.stringify(result))
    writeFileSync(`${process.env.MANATUNER_MATH_EVIDENCE_DIR || '/tmp'}/mtg-audit-monte-carlo.json`, JSON.stringify(result, null, 2))
    // Six sigma deterministic guard; report the actual 95% interval separately.
    expect(Math.abs(result.production - expected)).toBeLessThan(6 * se)
    expect(Math.abs(result.independent - expected)).toBeLessThan(6 * se)
  }, 15000)
  it('keep reward depends on the visible hand, not future draws, and respects real source colors', () => {
    const land = {
      name: 'Unknown utility',
      cmc: 0,
      isLand: true,
      quantity: 1,
      producedMana: ['C'],
      manaCost: { colorless: 0, symbols: {} },
    } as SimulatedCard
    const spell = {
      name: 'R',
      cmc: 1,
      isLand: false,
      quantity: 1,
      manaCost: { colorless: 0, symbols: { R: 1 } },
    } as SimulatedCard
    const hand: SimulatedHand = {
      cards: [land, spell],
      lands: [land],
      spells: [spell],
      landCount: 1,
      totalCMC: 1,
    }
    const a = _scoreHandForTest(hand, 'aggro', [land, land, land])
    const b = _scoreHandForTest(hand, 'aggro', [spell, spell, spell])
    expect(a).toEqual(b)
    expect(a.colorAccess).toBe(0)
    expect(a.manaEfficiency).toBe(0)
  })
})
