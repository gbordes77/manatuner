import { it, expect } from 'vitest'
import {
  analyzeCard,
  runManabaseSimulation,
  calculateOptimalColorDistribution,
} from '../../src/utils/manabase'
import { analyzeWithArchetype } from '../../src/services/mulliganSimulatorAdvanced'
it('the retired castability API refuses to return unsupported probabilities', () =>
  expect(() => analyzeCard({ mana_cost: '{R}' } as any, 1, [], 60)).toThrow(/retired/i))
it('the retired simulation API refuses to return pseudo-game statistics', () =>
  expect(() =>
    runManabaseSimulation([], { iterations: 1, maxMulligans: 0, mulliganStrategy: 'none' } as any)
  ).toThrow(/retired/i))
it('integer color allocation conserves the requested land total', () => {
  const result = calculateOptimalColorDistribution(
    ['W', 'U', 'B'].map((c) => ({ quantity: 1, card: { mana_cost: `{${c}}` } })) as any,
    20
  )
  expect(Object.values(result).reduce((a, b) => a + b, 0)).toBe(20)
})
it('mulligan histogram labels stay in the 0–100 score domain', () => {
  const result = analyzeWithArchetype(
    [
      {
        name: 'Forest',
        quantity: 40,
        cmc: 0,
        isLand: true,
        colors: [],
        manaCost: '',
        producedMana: ['G'],
      },
    ] as any,
    'midrange',
    1,
    { seed: 1 }
  )
  expect(
    Object.values(result.distributions)
      .flat()
      .every((row) => row.score >= 0 && row.score <= 100)
  ).toBe(true)
})
