import { expect, it } from 'vitest'
import { parsePolicyCost, payments, unitIndex } from '../../src/services/paymentPolicy/cost'
import type { ManaOutput, PaymentKind } from '../../src/services/paymentPolicy/types'
function pay(cost: string, units: ManaOutput[], kind: PaymentKind = 'other', life = 20, floor = 1) {
  const pool = Array(24).fill(0)
  for (const u of units) pool[unitIndex(u)]++
  return payments(pool, life, parsePolicyCost(cost, 2)!, kind, floor)
}
it('snow consumes provenance and competes with colored demands', () => {
  expect(pay('{S}{U}', [{ color: 'U', snow: true }])).toHaveLength(0)
  expect(pay('{S}{U}', [{ color: 'U', snow: true }, { color: 'U' }])).toHaveLength(1)
  expect(pay('{S}', [{ color: 'U' }])).toHaveLength(0)
  expect(pay('{S}', [{ color: 'C', snow: true }])).toHaveLength(1)
})
it('creature-only mana cannot pay noncreatures or activated abilities', () => {
  const units = [{ color: 'G', creatureOnly: true }]
  expect(pay('{1}', units)).toHaveLength(0)
  expect(pay('{G}', units, 'creature')).toHaveLength(1)
  expect(pay('{1}', units, 'ability')).toHaveLength(0)
})
it('phyrexian payment consumes life, respecting the explicit reserve', () => {
  expect(pay('{U/P}', [], 'other', 3, 1)).toEqual([{ pool: Array(24).fill(0), life: 1 }])
  expect(pay('{U/P}', [], 'other', 2, 1)).toHaveLength(0)
  expect(pay('{U/P}{U/P}', [], 'other', 4, 1)).toHaveLength(0)
  expect(pay('{U/P}{U/P}', [{ color: 'U' }], 'other', 3, 1)).toHaveLength(1)
})
it('twobrid uses two generic units or one colored unit, never reuses either', () => {
  expect(pay('{2/W}', [{ color: 'C' }])).toHaveLength(0)
  expect(pay('{2/W}', [{ color: 'C' }, { color: 'C' }])).toHaveLength(1)
  expect(pay('{2/W}{W}', [{ color: 'W' }])).toHaveLength(0)
  expect(pay('{W/U/P}', [{ color: 'U' }], 'other', 1, 1)).toHaveLength(1)
})
it('strict cost parser preserves X and colorless and refuses unknown symbols', () => {
  expect(parsePolicyCost('{X}{X}{C}', 3)).toHaveLength(7)
  for (const cost of ['{Q}', '{T}', '{C/W/P}', '2G', '{U}garbage'])
    expect(parsePolicyCost(cost)).toBeNull()
  expect(pay('{C}', [{ color: 'G' }])).toHaveLength(0)
})
