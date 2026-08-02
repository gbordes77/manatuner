/**
 * T15 — mulligan worker iteration clamp.
 */
import { describe, expect, it } from 'vitest'
import {
  clampMulliganIterations,
  MULLIGAN_ITERATIONS_MAX,
  MULLIGAN_ITERATIONS_MIN,
} from '../mulliganArchetype.worker'

describe('T15 clampMulliganIterations', () => {
  it('passes through in-range values', () => {
    expect(clampMulliganIterations(5000)).toEqual({ iterations: 5000 })
  })

  it('clamps below min', () => {
    const r = clampMulliganIterations(10)
    expect(r.iterations).toBe(MULLIGAN_ITERATIONS_MIN)
    expect(r.warning).toMatch(/clamped/i)
  })

  it('clamps above max', () => {
    const r = clampMulliganIterations(1_000_000)
    expect(r.iterations).toBe(MULLIGAN_ITERATIONS_MAX)
    expect(r.warning).toMatch(/clamped/i)
  })

  it('clamps non-finite to min', () => {
    expect(clampMulliganIterations(NaN).iterations).toBe(MULLIGAN_ITERATIONS_MIN)
    expect(clampMulliganIterations(Infinity).iterations).toBe(MULLIGAN_ITERATIONS_MIN)
  })
})
