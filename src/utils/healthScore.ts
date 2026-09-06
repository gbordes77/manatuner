/** Shared editorial bands for the heuristic color-access score, in every format. */
export const HEALTH_SCORE_BANDS = '85+ Excellent · 70–84 Good · 55–69 Average · below 55 Needs work'
export function healthScoreBand(percent: number) {
  if (percent >= 85) return { label: 'Excellent', severity: 'success' as const }
  if (percent >= 70) return { label: 'Good', severity: 'info' as const }
  if (percent >= 55) return { label: 'Average', severity: 'warning' as const }
  return { label: 'Needs work', severity: 'error' as const }
}
