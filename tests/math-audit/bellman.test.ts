import { it, expect } from 'vitest'
import { mulliganStoppingValues } from '../../src/services/mulliganStopping'
it('matches hand-calculated stopping values and exhaustive path rewards', () => {
  const values = mulliganStoppingValues({ 4: [10, 20], 5: [0, 30], 6: [20, 40], 7: [0, 50] })
  expect(values).toEqual({ 4: 15, 5: 22.5, 6: 31.25, 7: 40.625 })
  // 16 equally likely four-attempt paths; decision thresholds derived above.
  let sum = 0
  for (const h7 of [0, 50])
    for (const h6 of [20, 40])
      for (const h5 of [0, 30])
        for (const h4 of [10, 20]) sum += h7 >= 31.25 ? h7 : h6 >= 22.5 ? h6 : h5 >= 15 ? h5 : h4
  expect(values[7]).toBe(sum / 16)
})
it('does not round small differences before the stopping decision', () => {
  const values = mulliganStoppingValues({ 4: [0.49], 5: [0.48, 0.51], 6: [0], 7: [0] })
  expect(values[7]).toBe(0.5)
})
