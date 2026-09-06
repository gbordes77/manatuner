import type { AnalysisResult } from '../../services/deckAnalyzer'

// Calculate overall mana stability score
export const calculateStabilityScore = (analysis: AnalysisResult): number | null => {
  if (analysis.consistencyUnavailable) return null
  const { consistency, landRatio, probabilities } = analysis

  // Weight factors
  const consistencyWeight = 0.4
  const landRatioWeight = 0.2
  const turn2Weight = 0.25
  const turn4Weight = 0.15

  // Land ratio score (optimal is 0.38-0.42)
  const optimalRatio = 0.4
  const ratioDeviation = Math.abs(landRatio - optimalRatio)
  const landRatioScore = Math.max(0, 1 - ratioDeviation * 5)

  // Average turn 2 probability across colors
  const turn2Colors = Object.entries(probabilities.turn2.specificColors)
    .filter(
      ([color]) =>
        (analysis.manaRequirements?.[color as keyof typeof analysis.manaRequirements] ?? 0) > 0
    )
    .map(([, value]) => value)
  const avgTurn2 =
    analysis.colorAccessByTurn?.turn2 ??
    (turn2Colors.length > 0
      ? turn2Colors.reduce((a, b) => a + b, 0) / turn2Colors.length
      : analysis.consistency)
  // Average turn 4 probability
  const turn4Colors = Object.entries(probabilities.turn4.specificColors)
    .filter(
      ([color]) =>
        (analysis.manaRequirements?.[color as keyof typeof analysis.manaRequirements] ?? 0) > 0
    )
    .map(([, value]) => value)
  const avgTurn4 =
    analysis.colorAccessByTurn?.turn4 ??
    (turn4Colors.length > 0
      ? turn4Colors.reduce((a, b) => a + b, 0) / turn4Colors.length
      : analysis.consistency)
  const score =
    (consistency * consistencyWeight +
      landRatioScore * landRatioWeight +
      avgTurn2 * turn2Weight +
      avgTurn4 * turn4Weight) *
    100

  return Math.round(Math.min(100, Math.max(0, score)))
}
