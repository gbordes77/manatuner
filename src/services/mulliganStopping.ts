/** Finite-horizon stopping values for an observable, scalar hand reward.
 * Each redraw is independent. Four cards is the forced-keep terminal state.
 * This optimizes the supplied reward and bottoming policy, not MTG win rate.
 */
export function mulliganStoppingValues(
  samples: Record<4 | 5 | 6 | 7, number[]>
): Record<4 | 5 | 6 | 7, number> {
  const values = { 4: 0, 5: 0, 6: 0, 7: 0 }
  for (const size of [4, 5, 6, 7] as const) {
    const rewards = samples[size]
    if (!rewards.length || rewards.some((value) => !Number.isFinite(value))) {
      throw new RangeError('Each hand size needs finite reward samples')
    }
    values[size] =
      rewards.reduce(
        (sum, reward) =>
          sum + (size === 4 ? reward : Math.max(reward, values[(size - 1) as 4 | 5 | 6])),
        0
      ) / rewards.length
  }
  return values
}

/** One free redraw of seven, followed by the ordinary paid-mulligan chain. */
export function freeMulliganValue(rewards: number[], paidSevenValue: number): number {
  if (
    !rewards.length ||
    !Number.isFinite(paidSevenValue) ||
    rewards.some((r) => !Number.isFinite(r))
  )
    throw new RangeError('Finite rewards and continuation value are required')
  return rewards.reduce((sum, reward) => sum + Math.max(reward, paidSevenValue), 0) / rewards.length
}
