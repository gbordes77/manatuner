import type {
  Card,
  DeckCard,
  ManaColor,
  SimulationParams,
  SimulationResult,
  TurnAnalysis,
} from '@/types'
import { hypergeom } from '../services/castability/hypergeom'

// Karsten tables — unified from types/maths.ts (single source of truth)
import { KARSTEN_TABLES } from '../types/maths'

/** Lookup Karsten sources needed: intensity = 1/2/3 colored pips, turn = 1-10 */
function getKarstenSources(intensity: number, turn: number): number {
  return KARSTEN_TABLES[intensity]?.[turn] || 0
}

// Couleurs MTG (display names)
export const COLORS = {
  W: 'white',
  U: 'blue',
  B: 'black',
  R: 'red',
  G: 'green',
  C: 'colorless',
} as const

// ManaColor is now imported from @/types

/**
 * Parse un coût de mana MTG en symboles individuels
 */
export const parseManaCost = (cost: string): string[] => {
  if (!cost) return []

  // Regex pour capturer tous les symboles de mana
  const symbols = cost.match(/\{[^}]+\}/g) || []
  return symbols.map((symbol) => symbol.slice(1, -1))
}

/**
 * Extrait les couleurs requises d'un coût de mana
 */
export const extractColors = (cost: string): ManaColor[] => {
  const symbols = parseManaCost(cost)
  const colors = new Set<ManaColor>()

  symbols.forEach((symbol) => {
    // Couleurs simples
    if (symbol in COLORS) {
      colors.add(symbol as ManaColor)
    }
    // Coûts hybrides (ex: W/U, 2/W)
    else if (symbol.includes('/')) {
      const parts = symbol.split('/')
      parts.forEach((part) => {
        if (part in COLORS) {
          colors.add(part as ManaColor)
        }
      })
    }
    // Coûts Phyrexian (ex: W/P)
    else if (symbol.includes('P')) {
      const color = symbol.replace('/P', '')
      if (color in COLORS) {
        colors.add(color as ManaColor)
      }
    }
  })

  return Array.from(colors)
}

/**
 * Calcule le nombre de sources requises pour un coût donné au tour T
 */
export const calculateRequiredSources = (
  cost: string,
  turn: number,
  _colorIntensity: number = 1
): number => {
  const colors = extractColors(cost)
  if (colors.length === 0) return 0

  // Détermine l'intensité basée sur le nombre de symboles colorés
  const symbols = parseManaCost(cost)
  const colorCount = symbols.filter((s) => s in COLORS || s.includes('/')).length

  const intensity = Math.min(Math.max(colorCount, 1), 4)
  return getKarstenSources(intensity, turn)
}

/**
 * Distribution hypergéométrique — delegates to unified log-space engine
 */
export const hypergeometric = (
  population: number,
  successes: number,
  draws: number,
  target: number
): number => {
  return hypergeom.pmf(population, successes, draws, target)
}

/**
 * Calcule la probabilité de cast au tour donné
 */
export const calculateCastProbability = (
  requiredSources: number,
  availableSources: number,
  deckSize: number,
  cardsDrawn: number
): number => {
  return hypergeom.atLeast(deckSize, availableSources, cardsDrawn, requiredSources)
}

/**
 * Analyse une carte spécifique dans le contexte du deck
 */
/** @deprecated Retired: marginal source counts cannot certify physical payment. */
export const analyzeCard = (
  _card: Card,
  _quantity: number,
  _lands: DeckCard[],
  _deckSize: number = 60
): TurnAnalysis[] => {
  throw new Error(
    'Legacy castability API retired; use physicalManaProbability with physical source metadata'
  )
}

/**
 * Simule une main initiale avec stratégie de mulligan
 */
export const simulateHand = (
  deck: DeckCard[],
  strategy: 'none' | 'aggressive' | 'conservative' = 'conservative'
): { hand: Card[]; lands: number; spells: number; keepable: boolean } => {
  const cards = deck.flatMap((dc) => Array(dc.quantity).fill(dc.card))
  const shuffled = [...cards]
  // Fisher-Yates shuffle for unbiased randomization
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  const hand = shuffled.slice(0, 7)

  const lands = hand.filter((card) => card.type_line?.toLowerCase().includes('land')).length
  const spells = hand.length - lands

  let keepable = false

  switch (strategy) {
    case 'none':
      keepable = true
      break
    case 'aggressive':
      // Garde si 1-4 terrains et au moins 1 sort jouable
      keepable = lands >= 1 && lands <= 4 && spells >= 1
      break
    case 'conservative':
      // Garde si 2-5 terrains et courbe convenable
      keepable = lands >= 2 && lands <= 5
      break
  }

  return { hand, lands, spells, keepable }
}

/**
 * Simule de multiples parties pour obtenir des statistiques
 */
/** @deprecated Retired: this routine did not simulate legal draws or London mulligans. */
export const runManabaseSimulation = (
  _deck: DeckCard[],
  _params: SimulationParams
): SimulationResult => {
  throw new Error(
    'Legacy simulation API retired; use the explicitly modeled physical mana or mulligan services'
  )
}

/**
 * Identifie les terrains qui produisent une couleur donnée
 */
export const getLandsProducingColor = (lands: DeckCard[], color: ManaColor): DeckCard[] => {
  return lands.filter(
    (land) => land.card.color_identity?.includes(color) || land.card.colors.includes(COLORS[color])
  )
}

/**
 * Calcule la distribution de couleurs optimale
 */
export const calculateOptimalColorDistribution = (
  spells: DeckCard[],
  totalLands: number
): Record<string, number> => {
  const colorDemand: Record<string, number> = {}

  // Compte la demande pour chaque couleur
  spells.forEach((spell) => {
    const colors = extractColors(spell.card.mana_cost || '')
    colors.forEach((color) => {
      const symbols = parseManaCost(spell.card.mana_cost || '').filter(
        (s) => s === color || s.includes(color)
      )
      colorDemand[color] = (colorDemand[color] || 0) + symbols.length * spell.quantity
    })
  })

  const totalDemand = Object.values(colorDemand).reduce((sum, demand) => sum + demand, 0)

  if (!Number.isSafeInteger(totalLands) || totalLands < 0)
    throw new RangeError('Land count must be a nonnegative integer')
  if (!totalDemand) return {}
  // Largest-remainder allocation: integer counts sum exactly to totalLands.
  const shares = Object.entries(colorDemand).map(([color, demand]) => ({
    color,
    exact: (demand / totalDemand) * totalLands,
  }))
  const distribution: Record<string, number> = Object.fromEntries(
    shares.map((s) => [s.color, Math.floor(s.exact)])
  )
  let remaining = totalLands - Object.values(distribution).reduce((a, b) => a + b, 0)
  shares.sort(
    (a, b) =>
      b.exact - Math.floor(b.exact) - (a.exact - Math.floor(a.exact)) ||
      a.color.localeCompare(b.color)
  )
  for (const share of shares) {
    if (remaining-- <= 0) break
    distribution[share.color]++
  }

  return distribution
}
