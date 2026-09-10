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

/** Presentation only: persisted/exported probabilities retain full precision. */
export function formatComparisonPercentage(value: number | undefined): string {
  return value === undefined ? 'Unavailable' : value === 0 ? '0%' : `${value.toFixed(1)}%`
}

export function formatComparisonDelta(value: number, suffix = ''): string {
  if (value === 0) return '='
  const sign = value > 0 ? '+' : '-'
  return `${sign}${Math.abs(value) < 0.05 ? '<0.1' : Math.abs(value).toFixed(1)}${suffix}`
}

export function groupComparisonReasons(a: AnalysisRecord, b: AnalysisRecord, names: string[]) {
  const groups = new Map<string, { reason: string; a: string[]; b: string[] }>()
  for (const name of names) {
    for (const [version, record] of [
      ['a', a],
      ['b', b],
    ] as const) {
      const { reason } = savedSpellResult(record, name)
      if (!reason) continue
      const group = groups.get(reason) ?? { reason, a: [], b: [] }
      group[version].push(name)
      groups.set(reason, group)
    }
  }
  return [...groups.values()]
}
