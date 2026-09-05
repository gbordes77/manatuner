import { it, expect } from 'vitest'
import { renderHook } from '@testing-library/react'
import {
  _useAcceleratedCastabilityForTest as useAccel,
  _useProbabilityCalculationForTest as useBase,
} from '../../src/components/ManaCostRow'
import { exactTail } from './oracle'
import type { Card } from '../../src/types'
const ctx = { playDraw: 'PLAY' as const, removalRate: 0, defaultRockSurvival: 1 }
it('C requires a colorless source in the actual UI engine', () => {
  const card = { name: 'Eldrazi', mana_cost: '{1}{C}', cmc: 2 } as Card
  const { result } = renderHook(() =>
    useAccel(card, card.name, { G: 24, C: 0 }, 24, 60, [], ctx, false)
  )
  expect(result.current?.base.p2).toBe(0)
})
it('X=2 affects both mana value and target turn in the UI engine', () => {
  const card = { name: 'Fireball', mana_cost: '{X}{R}', cmc: 1 } as Card
  const { result } = renderHook(() => useAccel(card, card.name, { R: 24 }, 24, 60, [], ctx, false))
  expect(result.current?.base.p2).toBeCloseTo(exactTail(60, 24, 9, 3), 11)
})
it('zero lands is not replaced by 24 in either UI engine', () => {
  const card = { name: 'Rock', mana_cost: '{2}', cmc: 2 } as Card
  const { result } = renderHook(() => [
    useAccel(card, card.name, {}, 0, 60, [], ctx, false),
    useBase(card, card.name, {}, 0, 60),
  ])
  expect((result.current[0] as any).base.p2).toBe(0)
  expect((result.current[1] as any).p2).toBe(0)
})
it('zero cost is payable without mana in the UI engine', () => {
  const card = { name: 'Ornithopter', mana_cost: '{0}', cmc: 0 } as Card
  const { result } = renderHook(() => useAccel(card, card.name, {}, 0, 60, [], ctx, false))
  expect(result.current?.base.p2).toBe(1)
})
