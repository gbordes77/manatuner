import type { AnalysisRecord } from '../lib/privacy'

/** Saved snapshots have one fixed contract, independent of interactive estimates. */
export const COMPARISON_MODEL =
  'Saved lands-only potential: on the play, no mulligans or ramp, X=2, target turn=max(1, mana value). Target spell draw is excluded; a legal sequence may use future draws. Interactive Castability settings are not saved here.'

export function savedSpellResult(
  record: AnalysisRecord,
  name: string
): { percentage?: number; reason?: string } {
  const analysis = record.analysis
  if (analysis?.spellAnalysisModel !== 'physical-v1') {
    return {
      reason:
        'Legacy or unknown model. Load this deck in Analyzer and analyze again under the current snapshot model.',
    }
  }
  const value = analysis.spellAnalysis?.[name]?.percentage
  if (typeof value === 'number' && Number.isFinite(value) && value >= 0 && value <= 100)
    return { percentage: value }
  const reason = analysis.unsupportedSpellAnalysis?.[name]
  return {
    reason:
      typeof reason === 'string'
        ? `${reason}. This result is unavailable under the saved lands-only model; use Mana estimates for an approximation or the basic-land exact example.`
        : 'No saved calculation for this spell. Load the deck and analyze again; model limits may still apply.',
  }
}
