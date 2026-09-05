import { AnalysisResult } from '../../services/deckAnalyzer'
import { KARSTEN_PUBLISHED_TABLES, KARSTEN_TABLES } from '../../types/maths'
import {
  detectDeckFormatFamily,
  KARSTEN_REFERENCE_DECK_SIZE,
  scaleKarstenSources,
} from '../../utils/deckFormat'
import { countPipsInCost, type KarstenColor } from '../../utils/manaCostParser'

const COLORS: readonly KarstenColor[] = ['W', 'U', 'B', 'R', 'G']

export interface ColorDelta {
  color: KarstenColor
  maxPips: number
  pivotTurn: number
  /** Sources needed after deck-size scaling (P1-9). */
  required: number
  /** Raw Karsten-2022 value for 60-card before scaling. */
  requiredUnscaled: number
  actual: number
  delta: number
  verdict: 'ok' | 'warn' | 'short'
  /**
   * True when the raw (pips, pivotTurn) pair fell outside Karsten's published
   * table and had to be clamped. Consumers can flag these entries explicitly
   * — Emrakul ({U}{U}{U}{U} = 4 pips) and some EDH Commanders exceed the
   * 1-3 pip range, and legendary cascade shells can blow past turn 10.
   */
  wasClamped: boolean
  /** True when required ≠ requiredUnscaled (Limited / EDH deck sizes). */
  wasScaled: boolean
}

/**
 * For each color used by non-land spells, compute:
 *   - maxPips: max count of this color in a single spell's cost
 *   - pivotTurn: CMC of the spell that set maxPips (proxy for when you need it)
 *   - requiredUnscaled: KARSTEN_TABLES[maxPips][pivotTurn] (60-card)
 *   - required: scaleKarstenSources(..., totalCards)  // P1-9
 *   - actual: analysisResult.colorDistribution[color]
 *   - delta = actual - required
 *   - verdict: ok | warn | short
 *
 * Exported so `AnalyzerPage` can surface a compact "N colors short"
 * badge on the Manabase tab label without duplicating the logic.
 */
export function computeColorDeltas(analysisResult: AnalysisResult): ColorDelta[] {
  const result: ColorDelta[] = []
  const spells = analysisResult.cards.filter((c) => !c.isLand)
  const deckSize = analysisResult.totalCards || KARSTEN_REFERENCE_DECK_SIZE

  for (const color of COLORS) {
    let maxPips = 0
    let pivotTurn = 0
    let requiredUnscaled = 0
    let wasClamped = false
    let required = 0
    let wasScaled = false
    for (const card of spells) {
      const pips = countPipsInCost(card.manaCost, color)
      if (pips === 0) continue
      const turn = Math.max(1, card.cmc)
      const tablePips = Math.min(pips, 4)
      const tableTurn = Math.min(Math.max(turn, tablePips), 10)
      const target = KARSTEN_TABLES[tablePips]?.[tableTurn] ?? 0
      const published = KARSTEN_PUBLISHED_TABLES[deckSize]?.[pips]?.[turn]
      const candidate = published ?? scaleKarstenSources(target, deckSize)
      if (candidate > required || (candidate === required && turn < pivotTurn)) {
        required = candidate
        wasScaled = published === undefined && deckSize !== 60
        maxPips = pips
        pivotTurn = turn
        requiredUnscaled = target
        wasClamped = published === undefined
      }
    }
    if (maxPips === 0) continue

    const actual = analysisResult.colorDistribution[color] || 0
    const delta = actual - required
    // EDH/Limited: wider "warn" band (±3) because scaled targets are approximate
    const family = detectDeckFormatFamily(deckSize)
    const warnSlack = family === 'constructed' ? -2 : -3
    const verdict: ColorDelta['verdict'] = delta >= 0 ? 'ok' : delta >= warnSlack ? 'warn' : 'short'

    result.push({
      color,
      maxPips,
      pivotTurn,
      required,
      requiredUnscaled,
      actual,
      delta,
      verdict,
      wasClamped,
      wasScaled,
    })
  }

  return result
}

/**
 * Rollup of per-color deltas into a single verdict for the Manabase tab
 * badge. Worst verdict wins (short > warn > ok).
 */
export function summarizeColorDeltas(deltas: ColorDelta[]): {
  verdict: 'ok' | 'warn' | 'short'
  shortCount: number
  warnCount: number
} {
  let shortCount = 0
  let warnCount = 0
  for (const d of deltas) {
    if (d.verdict === 'short') shortCount++
    else if (d.verdict === 'warn') warnCount++
  }
  const verdict: 'ok' | 'warn' | 'short' = shortCount > 0 ? 'short' : warnCount > 0 ? 'warn' : 'ok'
  return { verdict, shortCount, warnCount }
}
