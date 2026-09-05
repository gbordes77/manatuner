import type { AnalysisResult } from './deckAnalyzer'

/** Fraction of physical card copies below 80%; missing calculations are unknown. */
export function computeAtRiskSpells(analysis: AnalysisResult): number | null {
  if (Object.keys(analysis.unsupportedSpellAnalysis ?? {}).length) return null
  const entries = Object.values(analysis.spellAnalysis ?? {})
  const total = entries.reduce((n, s) => n + s.total, 0)
  if (!total) return null
  return entries.reduce((n, s) => n + (s.percentage < 80 ? s.total : 0), 0) / total
}
