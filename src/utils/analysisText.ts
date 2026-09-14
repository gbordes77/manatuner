import { calculateStabilityScore } from '../components/export/manaStability'
import type { AnalysisResult } from '../services/deckAnalyzer'
import { COMPARISON_MODEL } from './comparison'
import { SCORE_DEFINITIONS } from '../data/scoreDefinitions'
import { version } from '../../package.json'

export function analysisDeckText(result: AnalysisResult): string {
  return (['main', 'commander', 'sideboard'] as const)
    .map((zone) => {
      const cards = result.cards.filter(
        (c) => (c.isSideboard ? 'sideboard' : c.isCommander ? 'commander' : 'main') === zone
      )
      return cards.length
        ? `${zone === 'main' ? 'Deck' : zone === 'commander' ? 'Commander' : 'Sideboard'}\n${cards.map((c) => `${c.quantity} ${c.name}`).join('\n')}`
        : ''
    })
    .filter(Boolean)
    .join('\n\n')
}

export function analysisContextText(result: AnalysisResult, name?: string): string {
  const count = (zone: 'commander' | 'sideboard') =>
    result.cards
      .filter((c) => (zone === 'sideboard' ? c.isSideboard : c.isCommander && !c.isSideboard))
      .reduce((n, c) => n + c.quantity, 0)
  return [
    'ManaTuner analysis context',
    name ? `Deck: ${name}` : '',
    `Library: ${result.totalCards} cards; ${result.totalLands} lands. Commander: ${count('commander')}; sideboard: ${count('sideboard')}.`,
    `Question: potential to cast a listed spell by its mana-value turn, excluding the chance of drawing that spell.`,
    `Model: ${result.spellAnalysisModel || 'Unavailable'}; report engine ${version}. ${result.spellAnalysisModel === 'physical-v1' ? COMPARISON_MODEL : 'Saved comparison contract unavailable. Reanalyze this deck under the current snapshot model.'}`,
    'Limits: supported payment mechanics only; unavailable results are not zero. These results do not measure win rate or overall deck quality.',
    'Share links contain deck, name and tab only. Interactive model settings are not transported. This text provides context, not a complete interactive scenario.',
  ]
    .filter(Boolean)
    .join('\n')
}

export function analysisTextReport(result: AnalysisResult, name: string): string {
  const percent = (n: number | undefined) =>
    typeof n === 'number' && Number.isFinite(n) ? `${n.toFixed(2)}%` : 'Unavailable'
  const pct = (n: number | undefined) => (typeof n === 'number' ? percent(n * 100) : 'Unavailable')
  const lines = [
    analysisContextText(result, name),
    '',
    'SCORES (HEURISTICS)',
    ...Object.values(SCORE_DEFINITIONS),
    `Health: ${result.consistencyUnavailable ? 'Unavailable' : pct(result.consistency)}`,
    `Blueprint Stability: ${calculateStabilityScore(result) ?? 'Unavailable'} / 100 (index)`,
    `Average mana value: ${result.averageCMC.toFixed(2)}; land ratio: ${pct(result.landRatio)}`,
    '',
    'OPENING HAND ANALYSIS — classification heuristic, not a keep recommendation',
    `Perfect (2–4 lands + early play): ${percent(result.mulliganAnalysis.perfectHand)}`,
    `Good (2–4 lands): ${percent(result.mulliganAnalysis.goodHand)}`,
    `Borderline (1 or 5 lands): ${percent(result.mulliganAnalysis.averageHand)}`,
    `Poor (0 or 6 lands): ${percent(result.mulliganAnalysis.poorHand)}`,
    `Terrible (7 lands, or 0 lands without an early play): ${percent(result.mulliganAnalysis.terribleHand)}`,
    'These categories overlap; they do not sum to 100%. Seven-card starting hand, no mulligans.',
    '',
    'COLOR SOURCE PROBABILITIES — at least one required-color source, on the play, no mulligans',
    'T1–T4 see 7–10 cards. Colors not required by the deck use a 100% convention, not evidence of a source.',
  ]
  for (const [turn, probability] of Object.entries(result.probabilities)) {
    lines.push(
      `${turn}: any color ${pct(probability.anyColor)}; ${Object.entries(probability.specificColors)
        .map(([color, n]) => `${color} ${pct(n)}`)
        .join('; ')}`
    )
  }
  lines.push('', 'SAVED SPELL POTENTIAL — percentage, under the model above')
  for (const card of result.cards.filter((c) => !c.isLand && !c.isCommander && !c.isSideboard)) {
    const n =
      result.spellAnalysisModel === 'physical-v1'
        ? result.spellAnalysis?.[card.name]?.percentage
        : undefined
    lines.push(
      `${card.name}: ${typeof n === 'number' && Number.isFinite(n) ? `${n.toFixed(2)}%` : `Unavailable — ${result.unsupportedSpellAnalysis?.[card.name] || 'No saved result'}`}`
    )
  }
  lines.push(
    '',
    'SUGGESTIONS — heuristics only, not mathematical certainties',
    ...result.recommendations
  )
  lines.push('', 'DECK BY ZONE', analysisDeckText(result))
  return lines.join('\n')
}

/** Text cells only: retain numeric fields and ordinary card names unchanged. */
export function csvText(value: unknown): string {
  const raw = String(value ?? '')
  const text = /^[\s]*[=+\-@]/.test(raw) ? `'${raw}` : raw
  return /[",\n\r]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text
}

/** Keep metadata a single physical comment line, with its value in a real CSV cell. */
export function csvDeckComment(name: string): string {
  const singleLine = name.replace(/\r/g, '\\r').replace(/\n/g, '\\n')
  return `# Deck:,${csvText(singleLine)}`
}
