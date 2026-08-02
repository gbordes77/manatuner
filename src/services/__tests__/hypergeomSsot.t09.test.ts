/**
 * T09 — hypergeom SSOT parity + EDH 100c edges.
 */
import { describe, expect, it } from 'vitest'
import { hypergeom } from '../castability/hypergeom'
import { calculateHypergeometric } from '../manaCalculator'

/** Legacy float combination (pre-T09 deckAnalyzer) for parity documentation. */
function legacyCombination(n: number, k: number): number {
  if (k > n || k < 0) return 0
  if (k === 0 || k === n) return 1
  k = Math.min(k, n - k)
  let result = 1
  for (let i = 0; i < k; i++) {
    result = (result * (n - i)) / (i + 1)
  }
  return Math.round(result)
}

function legacyAtLeast(N: number, K: number, n: number, minK: number): number {
  if (K === 0 || N === 0) return 0
  if (minK === 0) return 1
  if (minK > n || minK > K) return 0
  if (n > N) return 0
  let probability = 0
  for (let k = minK; k <= Math.min(n, K); k++) {
    const num = legacyCombination(K, k) * legacyCombination(N - K, n - k)
    const den = legacyCombination(N, n)
    if (den > 0) probability += num / den
  }
  return Math.min(1, Math.max(0, probability))
}

describe('T09 hypergeom SSOT', () => {
  const cases: Array<[number, number, number, number]> = [
    [60, 24, 7, 2],
    [60, 24, 8, 3],
    [60, 0, 7, 1],
    [60, 24, 7, 0],
    [40, 17, 7, 2],
    [99, 36, 7, 3], // EDH-ish
    [100, 38, 7, 3], // EDH 100c
    [100, 38, 10, 4],
    [1, 1, 1, 1],
    [60, 24, 7, 8], // impossible min
  ]

  it.each(cases)(
    'atLeast(N=%i,K=%i,n=%i,kMin=%i) finite in [0,1] and close to legacy',
    (N, K, n, kMin) => {
      const ssot = hypergeom.atLeast(N, K, n, kMin)
      const legacy = legacyAtLeast(N, K, n, kMin)
      expect(Number.isFinite(ssot)).toBe(true)
      expect(ssot).toBeGreaterThanOrEqual(0)
      expect(ssot).toBeLessThanOrEqual(1)
      // log-space may diverge slightly from rounded float combo on large N —
      // allow 1e-6 absolute; document if wider
      expect(Math.abs(ssot - legacy)).toBeLessThan(1e-6)
    }
  )

  it('pmf sums to ~1 over support for 60c / 24 lands / 7 card hand', () => {
    let sum = 0
    for (let k = 0; k <= 7; k++) {
      sum += hypergeom.pmf(60, 24, 7, k)
    }
    expect(Math.abs(sum - 1)).toBeLessThan(1e-9)
  })

  it('pmf sums to ~1 for EDH 100c / 38 lands / 7 hand', () => {
    let sum = 0
    for (let k = 0; k <= 7; k++) {
      sum += hypergeom.pmf(100, 38, 7, k)
    }
    expect(Math.abs(sum - 1)).toBeLessThan(1e-9)
  })

  it('manaCalculator.calculateHypergeometric delegates to hypergeom.atLeast', () => {
    const a = calculateHypergeometric({
      deckSize: 60,
      successStates: 24,
      sampleSize: 9,
      successesWanted: 3,
    })
    const b = hypergeom.atLeast(60, 24, 9, 3)
    expect(a).toBe(b)
  })

  it('edge: empty population / zero successes', () => {
    expect(hypergeom.atLeast(0, 0, 0, 1)).toBe(0)
    expect(hypergeom.atLeast(60, 0, 7, 1)).toBe(0)
    expect(hypergeom.atLeast(60, 24, 7, 0)).toBe(1)
  })
})
