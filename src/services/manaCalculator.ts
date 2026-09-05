import { physicalManaProbability } from './castability/physicalManaEngine'
import { parsePhysicalCost } from './castability/parsePhysicalCost'
// manaCalculator.ts - Implémentation correcte selon Frank Karsten

import type { ParsedManaCost } from '@/types'
import { hypergeom } from './castability/hypergeom'

// Local alias for backward compatibility within this file
type ManaCost = ParsedManaCost

interface ProbabilityResult {
  probability: number
  meetsThreshold: boolean
  sourcesNeeded: number
  sourcesAvailable: number
  recommendation: string
}

// Karsten tables — unified from types/maths.ts (single source of truth)
import { KARSTEN_TABLES, KARSTEN_PUBLISHED_TABLES } from '../types/maths'

/** Cumulative P(X >= successesWanted) — direct SSOT hypergeom (T09). */
export const calculateHypergeometric = (params: {
  deckSize: number
  successStates: number
  sampleSize: number
  successesWanted: number
}): number => {
  return hypergeom.atLeast(
    params.deckSize,
    params.successStates,
    params.sampleSize,
    params.successesWanted
  )
}

export class ManaCalculator {
  // Distribution hypergeométrique — delegates to unified log-space engine
  hypergeometric(N: number, K: number, n: number, k: number): number {
    return hypergeom.pmf(N, K, n, k)
  }

  // Probabilité cumulative (au moins k succès)
  cumulativeHypergeometric(N: number, K: number, n: number, minK: number): number {
    return hypergeom.atLeast(N, K, n, minK)
  }

  // Calcul principal selon Karsten
  calculateManaProbability(
    deckSize: number,
    sourcesInDeck: number,
    turn: number,
    symbolsNeeded: number,
    onThePlay: boolean = true,
    handSize: number = 7 // Uniform sample only; does not model London hand selection
  ): ProbabilityResult {
    if (
      !Number.isSafeInteger(turn) ||
      turn < 1 ||
      !Number.isSafeInteger(handSize) ||
      handSize < 0 ||
      handSize > 7
    ) {
      throw new RangeError(
        'A positive integer turn and opening sample size from 0 to 7 are required'
      )
    }
    // Cards seen by turn T:
    // On the play: no draw on T1, so seen = handSize + (turn - 1)
    // On the draw: draw on T1, so seen = handSize + turn
    const cardsSeen = onThePlay ? handSize + turn - 1 : handSize + turn

    // Calcul de la probabilité
    const probability = this.cumulativeHypergeometric(
      deckSize,
      sourcesInDeck,
      cardsSeen,
      symbolsNeeded
    )

    // Récupération de la recommandation Karsten
    const karstenRequirement =
      KARSTEN_PUBLISHED_TABLES[deckSize]?.[symbolsNeeded]?.[turn] ??
      Math.ceil(((KARSTEN_TABLES[symbolsNeeded]?.[turn] ?? 0) * deckSize) / 60)

    return {
      probability,
      meetsThreshold: probability >= 0.9,
      sourcesNeeded: karstenRequirement,
      sourcesAvailable: sourcesInDeck,
      recommendation: this.getRecommendation(probability, sourcesInDeck, karstenRequirement),
    }
  }

  // Analyse complète d'une carte
  analyzeCard(
    card: { name: string; manaCost: ManaCost; cmc: number },
    deck: { size: number; sources: { [color: string]: number } }
  ): {
    [color: string]: ProbabilityResult
  } {
    const results: { [color: string]: ProbabilityResult } = {}

    // Analyser chaque couleur dans le coût
    for (const [color, count] of Object.entries(card.manaCost.symbols)) {
      if (count > 0) {
        const sourcesAvailable = deck.sources[color] || 0
        results[color] = this.calculateManaProbability(
          deck.size,
          sourcesAvailable,
          card.cmc, // On veut lancer la carte à son CMC
          count,
          true
        )
      }
    }

    return results
  }

  // Recommandations textuelles
  private getRecommendation(
    probability: number,
    sourcesAvailable: number,
    sourcesNeeded: number
  ): string {
    if (probability >= 0.95) {
      return 'Excellent - Probabilité très élevée'
    } else if (probability >= 0.9) {
      return 'Bon - Atteint le seuil recommandé de 90%'
    } else if (probability >= 0.85) {
      return `Acceptable - Écart à la table conditionnelle : ${Math.max(0, sourcesNeeded - sourcesAvailable)} sources`
    } else if (probability >= 0.8) {
      return `Risqué - Écart à la table conditionnelle : ${Math.max(0, sourcesNeeded - sourcesAvailable)} sources (ne garantit pas 90% sans mulligan)`
    } else {
      return `Accès aux sources faible — écart à la table conditionnelle : ${Math.max(0, sourcesNeeded - sourcesAvailable)} (modèles distincts)`
    }
  }

  // Analyser un deck complet
  analyzeDeck(deck: {
    cards: Array<{ name: string; manaCost: ManaCost; cmc: number; quantity: number }>
    lands: Array<{ name: string; produces: string[]; quantity: number }>
  }): {
    deckSize: number
    sources: { [color: string]: number }
    analysis: Array<{
      card: string
      results: { [color: string]: ProbabilityResult }
    }>
    overallHealth: string
  } {
    // Calculer le nombre total de cartes
    const deckSize =
      deck.cards.reduce((sum, card) => sum + card.quantity, 0) +
      deck.lands.reduce((sum, land) => sum + land.quantity, 0)

    // CORRECTION CRITIQUE: Méthode Frank Karsten pour compter les sources
    // Selon l'article TCGPlayer : "I usually consider Verdant Catacombs, Flooded Strand
    // and the like as a full mana source for any color they might be able to fetch"
    const sources: { [color: string]: number } = {}

    for (const land of deck.lands) {
      for (const color of land.produces) {
        // Chaque terrain compte comme UNE source pour chaque couleur qu'il peut produire
        // Un fetchland bicolore compte comme 1 source pour chaque couleur, pas 2 au total
        sources[color] = (sources[color] || 0) + land.quantity
      }
    }

    // Analyser chaque carte
    const analysis = deck.cards
      .filter((card) => Object.keys(card.manaCost.symbols).length > 0)
      .map((card) => ({
        card: card.name,
        results: this.analyzeCard(card, { size: deckSize, sources }),
      }))

    // Évaluation globale
    const allProbabilities = analysis.flatMap((a) =>
      Object.values(a.results).map((r) => r.probability)
    )
    const avgProbability = allProbabilities.reduce((sum, p) => sum + p, 0) / allProbabilities.length

    let overallHealth: string
    if (avgProbability >= 0.9) {
      overallHealth = 'Excellente - Manabase très stable'
    } else if (avgProbability >= 0.85) {
      overallHealth = 'Bonne - Quelques ajustements mineurs recommandés'
    } else if (avgProbability >= 0.8) {
      overallHealth = 'Moyenne - Des améliorations significatives sont nécessaires'
    } else {
      overallHealth = 'Faible - Reconstruction majeure de la manabase requise'
    }

    return {
      deckSize,
      sources,
      analysis,
      overallHealth,
    }
  }

  // Optimiseur de manabase
  optimizeManabase(deck: {
    cards: Array<{ name: string; manaCost: ManaCost; cmc: number; quantity: number }>
    totalLands: number
  }): {
    [color: string]: number
  } {
    // Calculer les besoins en mana pour chaque couleur
    const requirements: { [color: string]: number } = {}

    for (const card of deck.cards) {
      for (const [color, count] of Object.entries(card.manaCost.symbols)) {
        if (count > 0) {
          const needed = KARSTEN_TABLES[count]?.[card.cmc] || 0
          requirements[color] = Math.max(requirements[color] || 0, needed)
        }
      }
    }

    if (Object.keys(requirements).length === 0) return {}

    // Distribuer les terres proportionnellement
    const totalRequired = Object.values(requirements).reduce((sum, r) => sum + r, 0)
    if (totalRequired === 0) return {}
    const distribution: { [color: string]: number } = {}

    for (const [color, required] of Object.entries(requirements)) {
      distribution[color] = Math.round((required / totalRequired) * deck.totalLands)
    }

    // Ajuster pour atteindre exactement totalLands
    const currentTotal = Object.values(distribution).reduce((sum, d) => sum + d, 0)
    if (currentTotal !== deck.totalLands) {
      const mostNeeded = Object.entries(requirements).sort((a, b) => b[1] - a[1])[0][0]
      distribution[mostNeeded] += deck.totalLands - currentTotal
    }

    return distribution
  }
}

// Instance singleton pour l'utilisation dans l'application
export const manaCalculator = new ManaCalculator()

// =============================================================================
// TEMPO-AWARE PROBABILITY CALCULATIONS
// =============================================================================

import type {
  LandManaColor,
  LandMetadata,
  PlayStrategy,
  TempoAwareProbability,
  TempoCalculationParams,
} from '@/types/lands'
import { createDeckContext, landService } from './landService'

/**
 * Calculate tempo-aware probability for casting a spell.
 * Takes into account which lands enter tapped/untapped at each turn.
 *
 * @param params - Calculation parameters
 * @returns Tempo-aware probability result
 */
/**
 * Check if a land can produce a given color for a specific spell.
 * Lands with producesAnyForCreaturesOnly only count as colored sources for creature spells.
 */
function landProducesColorForSpell(
  land: LandMetadata,
  colorNeeded: LandManaColor,
  isCreatureSpell?: boolean
): boolean {
  // Direct color production always counts
  if (land.produces.includes(colorNeeded)) return true

  // producesAny lands: check creature-only restriction
  if (land.producesAny && colorNeeded !== 'C') {
    if (land.producesAnyForCreaturesOnly && isCreatureSpell === false) {
      return false // Cavern of Souls can't help cast Bitter Triumph
    }
    return true
  }

  return false
}

export function calculateTempoAwareProbability(
  params: TempoCalculationParams
): TempoAwareProbability {
  const { deck, targetTurn, colorNeeded, symbolsNeeded, strategy, isCreatureSpell } = params
  const calculator = new ManaCalculator()
  const exact = physicalManaProbability(
    {
      deckSize: deck.totalCards,
      totalLands: deck.lands.length,
      landColorSources: {},
      physicalLands: deck.lands,
    },
    { mv: symbolsNeeded, generic: 0, pips: { [colorNeeded]: symbolsNeeded } },
    targetTurn
  )
  if (exact.status === 'exact') {
    const rawSources = deck.lands.filter((l) =>
      landProducesColorForSpell(l, colorNeeded, isCreatureSpell)
    ).length
    const raw = hypergeom.atLeast(deck.totalCards, rawSources, 6 + targetTurn, symbolsNeeded)
    return {
      raw,
      tempoAdjusted: exact.p2,
      scenarios: { aggressive: exact.p2, conservative: exact.p2, balanced: exact.p2 },
      // Eligibility counts are descriptive, not the distribution used by the solver.
      effectiveSourcesByTurn: Array.from({ length: Math.max(targetTurn, 6) }, (_, i) =>
        i === 0
          ? deck.lands.filter(
              (l) =>
                landProducesColorForSpell(l, colorNeeded, isCreatureSpell) &&
                l.etbBehavior.type === 'always_untapped'
            ).length
          : rawSources
      ),
      tempoImpact: raw - exact.p2,
      method: 'exact',
    }
  }

  // Create deck context for condition evaluation
  const context = createDeckContext(deck.lands, strategy === 'aggressive')

  // Calculate effective sources (weighted by untapped probability)
  let effectiveSources = 0
  const effectiveSourcesByTurn: number[] = []

  for (let turn = 1; turn <= Math.max(targetTurn, 6); turn++) {
    let sourcesThisTurn = 0

    for (const land of deck.lands) {
      // Check if this land produces the needed color for this spell type
      if (!landProducesColorForSpell(land, colorNeeded, isCreatureSpell)) {
        continue
      }

      // Get probability of entering untapped at this turn
      const untappedProb = landService.getUntappedProbability(land, turn, context)

      // Fetchlands: slight penalty because they delay by a turn
      const fetchPenalty = land.isFetch ? 0.9 : 1.0

      sourcesThisTurn += untappedProb * fetchPenalty
    }

    effectiveSourcesByTurn.push(sourcesThisTurn)

    if (turn === targetTurn) {
      effectiveSources = sourcesThisTurn
    }
  }

  // Calculate cards seen by target turn
  const cardsSeen = 7 + targetTurn - 1

  // Calculate tempo-adjusted probability
  const tempoAdjusted = calculator.cumulativeHypergeometric(
    deck.totalCards,
    Math.round(effectiveSources),
    cardsSeen,
    symbolsNeeded
  )

  // Calculate raw probability (ignoring tempo)
  const rawSources = deck.lands.filter((l) =>
    landProducesColorForSpell(l, colorNeeded, isCreatureSpell)
  ).length

  const raw = calculator.cumulativeHypergeometric(
    deck.totalCards,
    rawSources,
    cardsSeen,
    symbolsNeeded
  )

  // Calculate all three scenarios
  const scenarios = {
    aggressive: calculateWithStrategy(params, 'aggressive', calculator),
    conservative: calculateWithStrategy(params, 'conservative', calculator),
    balanced: 0, // Will be calculated below
  }

  // Balanced is weighted average
  scenarios.balanced = scenarios.aggressive * 0.6 + scenarios.conservative * 0.4

  return {
    raw,
    tempoAdjusted,
    scenarios,
    effectiveSourcesByTurn,
    tempoImpact: raw - tempoAdjusted,
    method: 'heuristic',
  }
}

/**
 * Calculate probability with a specific strategy.
 */
function calculateWithStrategy(
  params: TempoCalculationParams,
  strategy: PlayStrategy,
  calculator: ManaCalculator
): number {
  const { deck, targetTurn, colorNeeded, symbolsNeeded, isCreatureSpell } = params
  const context = createDeckContext(deck.lands, strategy === 'aggressive')

  let effectiveSources = 0

  for (const land of deck.lands) {
    if (!landProducesColorForSpell(land, colorNeeded, isCreatureSpell)) {
      continue
    }

    const untappedProb = landService.getUntappedProbability(land, targetTurn, context)
    const fetchPenalty = land.isFetch ? 0.9 : 1.0

    effectiveSources += untappedProb * fetchPenalty
  }

  const cardsSeen = 7 + targetTurn - 1

  return calculator.cumulativeHypergeometric(
    deck.totalCards,
    Math.round(effectiveSources),
    cardsSeen,
    symbolsNeeded
  )
}

/**
 * Analyze a spell's castability with tempo considerations.
 * Synchronous (T06): no I/O — pure hypergeometric over land metadata.
 *
 * @param spell - The spell to analyze
 * @param lands - Array of land metadata in the deck
 * @param totalCards - Total cards in deck
 * @returns Analysis result for each color required
 */
export function analyzeSpellCastability(
  spell: {
    name: string
    manaCost: string
    cmc: number
  },
  lands: LandMetadata[],
  totalCards: number
): {
  spell: string
  cmc: number
  colorRequirements: Array<{
    alternatives?: LandManaColor[]
    color: LandManaColor
    symbolsNeeded: number
    rawProbability: number
    tempoAdjustedProbability: number
    tempoImpact: number
    scenarios: {
      aggressive: number
      conservative: number
      balanced: number
    }
  }>
  overallCastability: number
  rating: 'excellent' | 'good' | 'average' | 'weak' | 'critical'
} {
  const cost = parsePhysicalCost(spell.manaCost)
  const targetTurn = Math.max(1, cost.mv)
  const profile = {
    deckSize: totalCards,
    totalLands: lands.length,
    landColorSources: {},
    physicalLands: lands,
  }
  const physical = physicalManaProbability(profile, cost, targetTurn)
  if (physical.status !== 'exact')
    throw new RangeError(`Castability unavailable: ${physical.reason}`)
  const results = parseManaCostColors(spell.manaCost).map(
    ({ color, count, isHybrid, altColor }) => {
      const options = isHybrid && altColor ? [color, altColor] : [color]
      const marginalCost =
        options.length > 1
          ? {
              mv: count,
              generic: 0,
              pips: {},
              hybrid: Array(count).fill(
                options.reduce((m, c) => m | (1 << 'WUBRGC'.indexOf(c)), 0)
              ),
            }
          : { mv: count, generic: 0, pips: { [color]: count } }
      const marginal = physicalManaProbability(profile, marginalCost, targetTurn)
      if (marginal.status !== 'exact')
        throw new RangeError(`Marginal unavailable: ${marginal.reason}`)
      const sourceCount = lands.filter((l) =>
        options.some((c) => landProducesColorForSpell(l, c, false))
      ).length
      const raw = hypergeom.atLeast(totalCards, sourceCount, 6 + targetTurn, count)
      return {
        color,
        alternatives: options,
        symbolsNeeded: count,
        rawProbability: raw,
        tempoAdjustedProbability: marginal.p2,
        tempoImpact: raw - marginal.p2,
        scenarios: { aggressive: marginal.p2, conservative: marginal.p2, balanced: marginal.p2 },
      }
    }
  )
  const overallCastability = physical.p2

  // Rate the spell
  let rating: 'excellent' | 'good' | 'average' | 'weak' | 'critical'
  if (overallCastability >= 0.9) {
    rating = 'excellent'
  } else if (overallCastability >= 0.8) {
    rating = 'good'
  } else if (overallCastability >= 0.7) {
    rating = 'average'
  } else if (overallCastability >= 0.6) {
    rating = 'weak'
  } else {
    rating = 'critical'
  }

  return {
    spell: spell.name,
    cmc: spell.cmc,
    colorRequirements: results,
    overallCastability,
    rating,
  }
}

/**
 * Hybrid mana requirement - can be paid by either color
 */
interface HybridManaRequirement {
  color1: LandManaColor
  color2: LandManaColor
  count: number
}

/**
 * Parse a mana cost string to extract color requirements.
 * Now properly handles hybrid mana by returning it separately.
 */
function parseManaCostColors(
  manaCost: string
): Array<{ color: LandManaColor; count: number; isHybrid?: boolean; altColor?: LandManaColor }> {
  const colors: Record<LandManaColor, number> = {
    W: 0,
    U: 0,
    B: 0,
    R: 0,
    G: 0,
    C: 0,
  }
  const hybridRequirements: HybridManaRequirement[] = []

  // Match mana symbols like {W}, {U}, {B}, {R}, {G}, {C}
  const symbolPattern = /\{([WUBRGC])\}/g
  let match

  while ((match = symbolPattern.exec(manaCost)) !== null) {
    const color = match[1] as LandManaColor
    colors[color]++
  }

  // Handle hybrid mana like {W/U}, {W/R}, etc.
  // These can be paid by EITHER color, so we track them separately
  const hybridPattern = /\{([WUBRGC])\/([WUBRGC])\}/g
  while ((match = hybridPattern.exec(manaCost)) !== null) {
    const color1 = match[1] as LandManaColor
    const color2 = match[2] as LandManaColor
    hybridRequirements.push({ color1, color2, count: 1 })
  }

  // Build result array
  const result: Array<{
    color: LandManaColor
    count: number
    isHybrid?: boolean
    altColor?: LandManaColor
  }> = []

  // Add regular color requirements
  for (const [color, count] of Object.entries(colors)) {
    if (count > 0) {
      result.push({ color: color as LandManaColor, count })
    }
  }

  // Add hybrid requirements - mark them so probability calculation can use best option
  for (const hybrid of hybridRequirements) {
    result.push({
      color: hybrid.color1,
      count: hybrid.count,
      isHybrid: true,
      altColor: hybrid.color2,
    })
  }

  return result
}

/**
 * Compare raw vs tempo-adjusted probabilities for a deck.
 * Useful for showing users the impact of their land choices.
 *
 * @param lands - Array of land metadata
 * @param totalCards - Total cards in deck
 * @param targetTurn - Turn to analyze
 * @returns Comparison results for each color
 */
export function compareTempoImpact(
  lands: LandMetadata[],
  totalCards: number,
  targetTurn: number = 3
): Record<
  LandManaColor,
  {
    rawSources: number
    effectiveSources: number
    rawProbability: number
    tempoAdjustedProbability: number
    impact: number
    impactPercent: string
  }
> {
  const colors: LandManaColor[] = ['W', 'U', 'B', 'R', 'G']
  const results: Record<string, any> = {}

  for (const color of colors) {
    // Count raw sources
    const rawSources = lands.filter((l) => l.produces.includes(color) || l.producesAny).length

    if (rawSources === 0) continue

    // Calculate tempo-aware
    const tempoResult = calculateTempoAwareProbability({
      deck: { lands, totalCards },
      targetTurn,
      colorNeeded: color,
      symbolsNeeded: 1,
      strategy: 'balanced',
    })

    const effectiveSources = tempoResult.effectiveSourcesByTurn[targetTurn - 1] || 0

    results[color] = {
      rawSources,
      effectiveSources: Math.round(effectiveSources * 10) / 10,
      rawProbability: Math.round(tempoResult.raw * 1000) / 1000,
      tempoAdjustedProbability: Math.round(tempoResult.tempoAdjusted * 1000) / 1000,
      impact: Math.round(tempoResult.tempoImpact * 1000) / 1000,
      impactPercent: `${Math.round(tempoResult.tempoImpact * 100)}%`,
    }
  }

  return results as Record<LandManaColor, any>
}
