import { throwIfAborted, withTimeout } from './http'
import { MANA_COLORS, ManaColor, WUBRG_COLORS } from '../types'
import type { LandManaColor, LandMetadata } from '../types/lands'
import type { ScryfallCard } from '../types/scryfall'
import {
  batchFetchFromScryfall,
  fetchCardFromScryfall as resolveCardFromScryfall,
  fetchCardFromScryfallWithMeta as resolveCardFromScryfallWithMeta,
} from './cardResolver'
import { hypergeom } from './castability/hypergeom'
import { parsePhysicalCost } from './castability/parsePhysicalCost'
import { physicalManaProbability } from './castability/physicalManaEngine'
import {
  applyCommanderFallback as applyCommanderFallbackPure,
  cleanCardName as cleanCardNamePure,
  parseDecklist,
} from './deckParser'
import { landService } from './landService'
import { compareTempoImpact } from './manaCalculator'

// Re-export pure parser helpers so existing imports keep working (T08).
export {
  batchFetchFromScryfall,
  clearCardResolverCache,
  fetchCardFromScryfall,
  fetchCardFromScryfallWithMeta,
} from './cardResolver'
export { cleanCardName, detectSideboardStartLine, parseDecklistLine } from './deckParser'

/** How many spells between main-thread yields during tempo analysis (T06). */
export const TEMPO_YIELD_EVERY = 10

/**
 * Yield to the event loop so the UI can paint during long tempo loops (T06).
 * Prefer scheduler.yield when available; otherwise setTimeout(0).
 */
export async function yieldToMain(): Promise<void> {
  const sched = (globalThis as { scheduler?: { yield?: () => Promise<void> } }).scheduler
  if (sched?.yield) {
    await sched.yield()
    return
  }
  await new Promise<void>((resolve) => setTimeout(resolve, 0))
}

/** Error thrown when a newer analyzeDeck supersedes this run (T06). */
export class AnalysisCancelledError extends Error {
  constructor(message = 'Analysis cancelled') {
    super(message)
    this.name = 'AnalysisCancelledError'
  }
}

/** Monotonic generation so a new analyzeDeck aborts the previous tempo loop. */
let analysisGeneration = 0

/** Test / UI helper: cancel any in-flight analyzeDeck tempo phase. */
export function cancelInFlightAnalysis(): void {
  analysisGeneration += 1
}

/**
 * Count active WUBRG colors in a land colorDistribution map.
 * Colorless (C) is never a "color" for identity messaging (P0-EDH-1).
 */
export function countActiveWubrgColors(
  colorDistribution: Partial<Record<string, number>> | undefined | null
): number {
  if (!colorDistribution) return 0
  return WUBRG_COLORS.filter((color) => (colorDistribution[color] || 0) > 0).length
}

/**
 * Deck color identity from non-land spells (WUBRG only).
 * Prefer this over land production for multi-color recommendations:
 * any-color lands (Command Tower, City of Brass) would otherwise inflate
 * a 4c Atraxa list to 5 colors (P0-EDH-1).
 */
export function countActiveWubrgFromSpells(
  cards: Array<{ isLand?: boolean; colors?: string[] }> | undefined | null
): number {
  if (!cards?.length) return 0
  const active = new Set<string>()
  for (const card of cards) {
    if (card.isLand) continue
    for (const c of card.colors || []) {
      if ((WUBRG_COLORS as readonly string[]).includes(c)) active.add(c)
    }
  }
  return active.size
}

export interface DeckCard {
  name: string
  quantity: number
  manaCost: string
  colors: ManaColor[]
  isLand: boolean
  producedMana?: ManaColor[]
  cmc: number
  // Card type detection (from Scryfall type_line)
  isCreature?: boolean
  /**
   * EDH command zone: card sits outside the library; casting still requires legal mana payment.
   * Set only via an explicit *CMDR* marker or Commander section.
   */
  isCommander?: boolean
  // Sideboard detection
  isSideboard?: boolean
  /**
   * True when the card was resolved from LandService seed and/or Scryfall.
   * False when only heuristic/simulated fallback was used (name not found
   * or Scryfall unavailable). Used to hard-fail all-garbage decklists.
   */
  resolved?: boolean
  /**
   * How the card was obtained:
   * - ok: land seed or Scryfall hit
   * - not_found: definitive Scryfall 404 (exact+fuzzy)
   * - unavailable: network / rate-limit — simulated fallback, not a proven fake name
   */
  resolution?: 'ok' | 'not_found' | 'unavailable'
  /**
   * True when the land always enters tapped (clone-safe boolean).
   * Conditional ETB (checkland/fastland/shock) lives in `landMetadata.etbBehavior` —
   * never store a function here (breaks Worker postMessage).
   */
  etbTapped?: boolean
  fetchland?: string[]
  checkland?: boolean
  ravland?: boolean
  fastland?: boolean
  producesMana?: boolean
  // New: LandMetadata from LandService
  landMetadata?: LandMetadata
}

// Enhanced spell analysis with tempo consideration
export interface TempoSpellAnalysis {
  castable: number
  total: number
  percentage: number
  // New tempo-aware data
  tempoAdjustedPercentage: number
  tempoImpact: number
  scenarios: {
    aggressive: number
    conservative: number
    balanced: number
  }
  rating: 'excellent' | 'good' | 'average' | 'weak' | 'critical'
}

// Tempo impact summary per color
export interface TempoImpactSummary {
  /** Missing in older saved analyses: never infer exactness. */
  method?: 'exact' | 'heuristic'
  reason?: string
  color: LandManaColor
  rawSources: number
  effectiveSources: number
  rawProbability: number
  tempoAdjustedProbability: number
  impact: number
  impactPercent: string
}

export interface AnalysisResult {
  inputWarnings?: string[]
  totalCards: number
  totalLands: number
  totalNonLands: number
  colorDistribution: Record<ManaColor, number>
  manaRequirements: Record<ManaColor, number>
  recommendations: string[]
  probabilities: {
    turn1: { anyColor: number; specificColors: Record<ManaColor, number> }
    turn2: { anyColor: number; specificColors: Record<ManaColor, number> }
    turn3: { anyColor: number; specificColors: Record<ManaColor, number> }
    turn4: { anyColor: number; specificColors: Record<ManaColor, number> }
  }
  consistency: number
  /** Numeric zero retained for storage compatibility when the score is unavailable. */
  consistencyUnavailable?: boolean
  colorAccessNotes?: string[]
  colorAccessByTurn?: { turn2: number; turn4: number }
  rating: 'excellent' | 'good' | 'average' | 'poor'
  averageCMC: number
  landRatio: number
  // Mana curve distribution (CMC 0-6, 7+)
  manaCurve: Record<string, number>
  // Mulligan analysis - probability distribution of opening hand quality
  mulliganAnalysis: {
    perfectHand: number // 2-4 lands + early plays (keep%)
    goodHand: number // 2-4 lands (keep%)
    averageHand: number // 1 or 5 lands (keep%)
    poorHand: number // 0 or 6 lands (mulligan%)
    terribleHand: number // 0 or 7 lands (mulligan%)
  }
  // Enhanced analysis from reference project
  spellAnalysis: Record<string, { castable: number; total: number; percentage: number }>
  spellAnalysisModel?: 'physical-v1'
  unsupportedSpellAnalysis?: Record<string, string>
  // NEW: Tempo-aware analysis
  tempoSpellAnalysis?: Record<string, TempoSpellAnalysis>
  tempoImpactByColor?: Record<string, TempoImpactSummary>
  landMetadata?: LandMetadata[]
  // Cards for advanced analysis (mulligan simulator)
  cards: DeckCard[]
}

export class DeckAnalyzer {
  /** @deprecated Use cardResolver.fetchCardFromScryfall — kept as thin delegate (T08). */
  private static async fetchCardFromScryfall(cardName: string): Promise<ScryfallCard | null> {
    return resolveCardFromScryfall(cardName)
  }

  /** @deprecated Use cardResolver.fetchCardFromScryfallWithMeta — thin delegate (T08). */
  private static async fetchCardFromScryfallWithMeta(
    cardName: string,
    signal?: AbortSignal
  ): Promise<{ data: ScryfallCard | null; notFound: boolean }> {
    return resolveCardFromScryfallWithMeta(cardName, signal)
  }

  // Fonction améliorée pour détecter les terrains via Scryfall
  private static async isLandCardScryfall(name: string): Promise<boolean> {
    const scryfallData = await this.fetchCardFromScryfall(name)

    if (scryfallData) {
      // Vérification précise via Scryfall
      return scryfallData.type_line.toLowerCase().includes('land')
    }

    // Fallback vers la détection par mots-clés si Scryfall échoue
    return this.isLandCardFallback(name)
  }

  // Fonction de fallback pour la détection des terrains (ancienne méthode)
  private static isLandCardFallback(name: string): boolean {
    const landKeywords = [
      // Basic lands
      'island',
      'mountain',
      'forest',
      'plains',
      'swamp',
      // Land types
      'land',
      'terrain',
      // Fetchlands
      'strand',
      'tarn',
      'mesa',
      'foothills',
      'delta',
      'mire',
      'catacombs',
      'flats',
      // Other land indicators
      'temple',
      'sanctuary',
      'grove',
      'cavern',
      'spire',
      'foundry',
      'confluence',
      'command tower',
      'city of brass',
      'mana confluence',
      // Additional land types
      'courtyard',
      'vantage',
      'tower',
      'town',
      'shrine',
      'crypt',
      'heath',
      'rainforest',
      'garden',
      'pool',
      'ground',
      'fountain',
      // French translations
      'île',
      'montagne',
      'forêt',
      'plaine',
      'marais',
    ]

    const lowerName = name.toLowerCase()
    return (
      landKeywords.some((keyword) => lowerName.includes(keyword)) ||
      lowerName.includes('terrain') ||
      lowerName.endsWith('land') ||
      lowerName.endsWith('lands')
    )
  }
  private static parseManaCost(manaCost: string): {
    colors: ManaColor[]
    cmc: number
    cost: Record<string, number>
  } {
    const colors: ManaColor[] = []
    const cost: Record<string, number> = {}
    let cmc = 0

    if (!manaCost) {
      return { colors, cmc, cost }
    }

    // Parse mana cost like {2}{U}{R} or {W/U}{B}
    const matches = manaCost.match(/\{[^}]+\}/g) || []

    matches.forEach((match) => {
      const symbol = match.slice(1, -1) // Remove { }

      // Generic mana
      if (/^\d+$/.test(symbol)) {
        const num = parseInt(symbol)
        cost.generic = (cost.generic || 0) + num
        cmc += num
      }
      // Hybrid mana like W/U
      else if (symbol.includes('/')) {
        const hybridColors = symbol.split('/')
        hybridColors.forEach((color) => {
          if (MANA_COLORS.includes(color as ManaColor)) {
            colors.push(color as ManaColor)
          }
        })
        cost[symbol] = (cost[symbol] || 0) + 1
        cmc += 1
      }
      // Regular colored mana
      else if (MANA_COLORS.includes(symbol as ManaColor)) {
        colors.push(symbol as ManaColor)
        cost[symbol] = (cost[symbol] || 0) + 1
        cmc += 1
      }
      // X costs
      else if (symbol === 'X') {
        cost.X = (cost.X || 0) + 1
        // X doesn't add to CMC until resolved
      }
    })

    return { colors, cmc, cost }
  }

  // Enhanced land detection from reference project (kept for sync compatibility)
  private static isLandCard(name: string): boolean {
    return this.isLandCardFallback(name)
  }

  /**
   * Legacy name-heuristic land flags. `etbTapped` is a **boolean** only:
   * true = always enters tapped. Conditional ETB (check/fast/shock) is false
   * here; full rules live in `landMetadata.etbBehavior` from LandService.
   */
  private static evaluateLandProperties(name: string, _text?: string): Partial<DeckCard> {
    const lowerName = name.toLowerCase()
    const properties: Partial<DeckCard> = {
      etbTapped: false,
      producesMana: true,
    }

    // Starting Town et lands similaires (condition temporelle) — not always tapped
    if (lowerName.includes('starting town')) {
      return properties
    }

    // Fetchlands
    if (
      lowerName.includes('strand') ||
      lowerName.includes('tarn') ||
      lowerName.includes('mesa') ||
      lowerName.includes('foothills') ||
      lowerName.includes('delta') ||
      lowerName.includes('mire') ||
      lowerName.includes('catacombs') ||
      lowerName.includes('flats')
    ) {
      properties.fetchland = this.getFetchlandTargets(name)
      properties.etbTapped = false
    }

    // Checklands (conditional — details in landMetadata)
    else if (
      lowerName.includes('rootbound') ||
      lowerName.includes('sunpetal') ||
      lowerName.includes('dragonskull') ||
      lowerName.includes('drowned') ||
      lowerName.includes('glacial') ||
      lowerName.includes('hinterland') ||
      lowerName.includes('isolated') ||
      lowerName.includes('sulfur') ||
      lowerName.includes('woodland') ||
      lowerName.includes('clifftop')
    ) {
      properties.checkland = true
      properties.etbTapped = false
    }

    // Fastlands (conditional)
    else if (
      lowerName.includes('seachrome') ||
      lowerName.includes('darkslick') ||
      lowerName.includes('blackcleave') ||
      lowerName.includes('copperline') ||
      lowerName.includes('razorverge') ||
      lowerName.includes('botanical')
    ) {
      properties.fastland = true
      properties.etbTapped = false
    }

    // Shocklands/Ravlands (assume pay life → untapped)
    else if (
      lowerName.includes('temple garden') ||
      lowerName.includes('sacred foundry') ||
      lowerName.includes('steam vents') ||
      lowerName.includes('overgrown tomb') ||
      lowerName.includes('watery grave') ||
      lowerName.includes('godless shrine') ||
      lowerName.includes('stomping ground') ||
      lowerName.includes('breeding pool') ||
      lowerName.includes('blood crypt') ||
      lowerName.includes('hallowed fountain')
    ) {
      properties.ravland = true
      properties.etbTapped = false
    }

    // Always-tapped cycles / gates
    else if (
      lowerName.includes('temple') ||
      lowerName.includes('guildgate') ||
      lowerName.includes('tap land') ||
      lowerName.includes('enters tapped')
    ) {
      properties.etbTapped = true
    }

    return properties
  }

  /** Prefer LandService metadata for always-tapped; fall back to name heuristic. */
  private static resolveEtbTapped(
    landMetadata: LandMetadata | null,
    landProperties: Partial<DeckCard>
  ): boolean {
    if (landMetadata?.etbBehavior?.type === 'always_tapped') return true
    if (landMetadata?.etbBehavior?.type === 'always_untapped') return false
    return landProperties.etbTapped === true
  }

  private static getFetchlandTargets(name: string): string[] {
    const fetchlandMap: Record<string, string[]> = {
      'Flooded Strand': ['Plains', 'Island'],
      'Polluted Delta': ['Island', 'Swamp'],
      'Bloodstained Mire': ['Swamp', 'Mountain'],
      'Wooded Foothills': ['Mountain', 'Forest'],
      'Windswept Heath': ['Forest', 'Plains'],
      'Scalding Tarn': ['Island', 'Mountain'],
      'Verdant Catacombs': ['Swamp', 'Forest'],
      'Marsh Flats': ['Plains', 'Swamp'],
      'Misty Rainforest': ['Forest', 'Island'],
      'Arid Mesa': ['Mountain', 'Plains'],
    }
    return fetchlandMap[name] || []
  }

  private static hasRequiredBasicTypes(lands: DeckCard[], checklandName: string): boolean {
    const requirements: Record<string, string[]> = {
      'Rootbound Crag': ['Mountain', 'Forest'],
      'Sunpetal Grove': ['Forest', 'Plains'],
      'Dragonskull Summit': ['Swamp', 'Mountain'],
      'Drowned Catacomb': ['Island', 'Swamp'],
      'Glacial Fortress': ['Plains', 'Island'],
    }

    const required = requirements[checklandName] || []
    return required.some((type) =>
      lands.some((land) => land.name.toLowerCase().includes(type.toLowerCase()))
    )
  }

  // Enhanced card parsing with better mana cost handling and LandService integration
  private static async parseDeckList(deckList: string, signal?: AbortSignal): Promise<DeckCard[]> {
    const parsed = parseDecklist(deckList)
    const cards: DeckCard[] = []
    const entries = parsed.entries.filter(
      (entry) => entry.section !== 'maybeboard' && entry.section !== 'companion'
    )
    const cardNames = entries.map((entry) => entry.name)
    await batchFetchFromScryfall(cardNames, signal)
    await landService.prefetchUnknownLands(cardNames, signal)
    for (const entry of entries) {
      throwIfAborted(signal)
      const { name, quantity } = entry
      // Use LandService for precise land detection with ETB analysis
      const landMetadata = await landService.detectLand(name, signal)
      const isLand = landMetadata !== null

      let manaCost = ''
      let colors: ManaColor[] = []
      let cmc = 0

      let isCreature = false
      // resolved=true only when land seed or Scryfall found the card
      let resolved = false
      let resolution: 'ok' | 'not_found' | 'unavailable' = 'unavailable'

      if (isLand) {
        // Lands don't have mana costs
        manaCost = ''
        colors = []
        cmc = 0
        resolved = true
        resolution = 'ok'
      } else {
        // For spells, try to get mana cost from Scryfall first
        const { data: scryfallData, notFound } = await this.fetchCardFromScryfallWithMeta(name, signal)
        if (scryfallData) {
          resolved = true
          resolution = 'ok'
          const frontFace = scryfallData.card_faces?.[0]
          const resolvedCost = scryfallData.mana_cost || frontFace?.mana_cost
          const spellType = frontFace?.type_line ?? scryfallData.type_line
          if (resolvedCost) {
            manaCost = resolvedCost
            const parsed = this.parseManaCost(manaCost)
            colors = parsed.colors
            cmc = scryfallData.cmc ?? parsed.cmc
            // Detect creature type from Scryfall type_line
            isCreature = spellType?.toLowerCase().includes('creature') ?? false
          } else {
            // Resolved but no mana_cost (e.g. some special cards) — keep empty cost
            manaCost = ''
            colors = []
            cmc = scryfallData.cmc || 0
            isCreature = spellType?.toLowerCase().includes('creature') ?? false
          }
        } else {
          // Simulated fallback — track why for garbage hard-fail
          resolved = false
          resolution = notFound ? 'not_found' : 'unavailable'
          manaCost = this.getSimulatedManaCost(name)
          const parsed = this.parseManaCost(manaCost)
          colors = parsed.colors
          cmc = parsed.cmc
        }
      }

      // Use LandMetadata for produced mana if available
      const producedMana =
        isLand && landMetadata ? (landMetadata.produces as ManaColor[]) : undefined

      // Keep legacy land properties for compatibility, but enhance with LandMetadata
      const landProperties = isLand ? this.evaluateLandProperties(name) : {}
      const etbTapped = isLand ? this.resolveEtbTapped(landMetadata, landProperties) : undefined

      cards.push({
        name,
        quantity,
        manaCost,
        colors,
        isLand,
        isCreature: isCreature || undefined,
        isCommander: entry.section === 'commander' || undefined,
        producedMana,
        cmc,
        isSideboard: entry.section === 'sideboard',
        resolved,
        resolution,
        ...landProperties,
        // Override any legacy field with clone-safe boolean
        etbTapped,
        // NEW: Include full LandMetadata for tempo analysis
        landMetadata: landMetadata || undefined,
      })
    }

    // Compatibility delegate: preserves explicit command-zone assignments.
    return this.applyCommanderFallback(cards)
  }

  /** Thin delegate → deckParser.applyCommanderFallback (T08). */
  private static applyCommanderFallback(cards: DeckCard[]): DeckCard[] {
    return applyCommanderFallbackPure(cards)
  }

  /**
   * Thin delegate → deckParser.cleanCardName (T08).
   * Kept as private static for existing tests that bracket-access DeckAnalyzer.
   */
  private static cleanCardName(name: string): string {
    return cleanCardNamePure(name)
  }

  private static getSimulatedManaCost(name: string): string {
    // Enhanced simulation with more cards
    const costs: Record<string, string> = {
      // Red spells
      'Lightning Bolt': '{R}',
      'Monastery Swiftspear': '{R}',
      'Goblin Guide': '{R}',
      'Lava Spike': '{R}',
      'Young Pyromancer': '{1}{R}',
      Pyroclasm: '{1}{R}',
      'Claim the Firstborn': '{R}',
      'Unlucky Witness': '{R}',
      'Amped Raptor': '{1}{R}',
      'Stadium Headliner': '{1}{R}',
      'Goblin Trapfinder': '{R}',

      // Blue spells
      Counterspell: '{U}{U}',
      Brainstorm: '{U}',
      Ponder: '{U}',
      'Delver of Secrets': '{U}',
      'Force of Will': '{3}{U}{U}',
      'Jace, the Mind Sculptor': '{2}{U}{U}',

      // White spells
      'Swords to Plowshares': '{W}',
      'Path to Exile': '{W}',
      'Wrath of God': '{2}{W}{W}',
      'Guide of Souls': '{W}',
      'Voice of Victory': '{1}{W}',

      // Black spells
      'Dark Ritual': '{B}',
      Thoughtseize: '{B}',
      'Fatal Push': '{B}',
      'Liliana of the Veil': '{1}{B}{B}',
      'Village Rites': '{B}',
      'Corrupted Conviction': '{B}',
      'Marionette Apprentice': '{1}{B}',

      // Green spells
      'Llanowar Elves': '{G}',
      'Birds of Paradise': '{G}',
      Tarmogoyf: '{1}{G}',
      'Noble Hierarch': '{G}',

      // Multicolor
      'Lightning Helix': '{R}{W}',
      Terminate: '{B}{R}',
      'Abrupt Decay': '{B}{G}',
      'Ajani, Nacatl Pariah': '{1}{W}',
      'Sephiroth, Fabled SOLDIER': '{1}{W}{B}',

      // Artifacts and Colorless
      'Sol Ring': '{1}',
      'Mox Ruby': '{0}',
      'Black Lotus': '{0}',
      "Sensei's Divining Top": '{1}',
      'Goblin Bombardment': '{1}{R}',
      'Phyrexian Tower': '{0}',
      // Starting Town n'a pas de coût de mana (c'est un land)
    }

    // If we don't have the exact card, try to guess based on name patterns
    if (costs[name]) {
      return costs[name]
    }

    // Simple heuristics for unknown cards
    const lowerName = name.toLowerCase()
    if (lowerName.includes('bolt') || lowerName.includes('shock')) return '{R}'
    if (lowerName.includes('counter')) return '{U}{U}'
    if (lowerName.includes('swords') || lowerName.includes('path')) return '{W}'
    if (lowerName.includes('ritual') || lowerName.includes('dark')) return '{B}'
    if (lowerName.includes('elf') || lowerName.includes('birds')) return '{G}'

    // Default to 2 generic mana
    return '{2}'
  }

  // Fonction améliorée pour obtenir le mana produit via Scryfall
  private static async getProducedManaScryfall(name: string): Promise<ManaColor[]> {
    const scryfallData = await this.fetchCardFromScryfall(name)

    if (scryfallData && scryfallData.produced_mana) {
      return scryfallData.produced_mana as ManaColor[]
    }

    // Fallback vers la méthode existante
    return this.getProducedMana(name)
  }

  private static getProducedMana(name: string): ManaColor[] {
    // Enhanced land production mapping
    const landProduction: Record<string, ManaColor[]> = {
      // Basic lands
      Island: ['U'],
      Mountain: ['R'],
      Plains: ['W'],
      Swamp: ['B'],
      Forest: ['G'],

      // Fetchlands
      'Flooded Strand': ['W', 'U'],
      'Polluted Delta': ['U', 'B'],
      'Bloodstained Mire': ['B', 'R'],
      'Wooded Foothills': ['R', 'G'],
      'Windswept Heath': ['G', 'W'],
      'Scalding Tarn': ['U', 'R'],
      'Verdant Catacombs': ['B', 'G'],
      'Marsh Flats': ['W', 'B'],
      'Misty Rainforest': ['G', 'U'],
      'Arid Mesa': ['R', 'W'],

      // Dual lands
      'Volcanic Island': ['U', 'R'],
      Tundra: ['W', 'U'],
      'Underground Sea': ['U', 'B'],
      Badlands: ['B', 'R'],
      Taiga: ['R', 'G'],
      Savannah: ['G', 'W'],
      Scrubland: ['W', 'B'],
      'Tropical Island': ['G', 'U'],
      Bayou: ['B', 'G'],
      Plateau: ['R', 'W'],

      // Shocklands
      'Steam Vents': ['U', 'R'],
      'Hallowed Fountain': ['W', 'U'],
      'Watery Grave': ['U', 'B'],
      'Blood Crypt': ['B', 'R'],
      'Stomping Ground': ['R', 'G'],
      'Temple Garden': ['G', 'W'],
      'Godless Shrine': ['W', 'B'],
      'Breeding Pool': ['G', 'U'],
      'Overgrown Tomb': ['B', 'G'],
      'Sacred Foundry': ['R', 'W'],

      // Utility lands
      'Command Tower': ['W', 'U', 'B', 'R', 'G'],
      'City of Brass': ['W', 'U', 'B', 'R', 'G'],
      'Mana Confluence': ['W', 'U', 'B', 'R', 'G'],

      // Fastlands
      'Concealed Courtyard': ['W', 'B'],
      'Inspiring Vantage': ['R', 'W'],

      // Special lands
      'Phyrexian Tower': [], // Colorless but sacrifices creatures
      'Starting Town': ['W', 'U', 'B', 'R', 'G'], // Peut produire n'importe quelle couleur (+ incolore gratuit)
    }

    if (landProduction[name]) {
      return landProduction[name]
    }

    // Heuristics for unknown lands
    const lowerName = name.toLowerCase()
    if (lowerName.includes('island')) return ['U']
    if (lowerName.includes('mountain')) return ['R']
    if (lowerName.includes('plains')) return ['W']
    if (lowerName.includes('swamp')) return ['B']
    if (lowerName.includes('forest')) return ['G']

    // Default: produces colorless
    return []
  }

  /**
   * P(X >= observedSuccesses) via SSOT log-space hypergeom (T09).
   * Replaces the private float combination loop.
   */
  private static calculateHypergeometric(
    populationSize: number,
    successStates: number,
    sampleSize: number,
    observedSuccesses: number
  ): number {
    return hypergeom.atLeast(populationSize, successStates, sampleSize, observedSuccesses)
  }

  private static calculateColorProbabilities(
    cards: DeckCard[],
    colorRequirements: Record<ManaColor, number>,
    turn: number
  ): Record<ManaColor, number> {
    const totalCards = cards.reduce((sum, card) => sum + card.quantity, 0)
    const handSize = 7
    const cardsDrawn = Math.min(handSize + turn - 1, totalCards)

    const probabilities: Record<ManaColor, number> = {} as Record<ManaColor, number>

    MANA_COLORS.forEach((color) => {
      const sourcesForColor = cards
        .filter((card) => card.isLand && card.producedMana?.includes(color))
        .reduce((sum, card) => sum + card.quantity, 0)

      const requiredSources = colorRequirements[color] || 0

      if (requiredSources === 0) {
        probabilities[color] = 1
      } else {
        // Calculate probability of having at least 1 source of this color
        const minSources = Math.min(1, requiredSources)
        probabilities[color] = this.calculateHypergeometric(
          totalCards,
          sourcesForColor,
          cardsDrawn,
          minSources
        )
      }
    })

    return probabilities
  }

  private static generateRecommendations(
    cards: DeckCard[],
    analysis: Partial<AnalysisResult>
  ): string[] {
    const recommendations: string[] = []

    // Analyse des mécaniques complexes
    const complexAnalysis = this.analyzeComplexLandMechanics(cards)

    // Land ratio recommendations
    if (analysis.landRatio !== undefined && analysis.landRatio < 0.35) {
      recommendations.push(
        `🏔️ Consider adding more lands (current: ${Math.round(analysis.landRatio * 100)}%, recommended: 35-40%)`
      )
    } else if (analysis.landRatio !== undefined && analysis.landRatio > 0.45) {
      recommendations.push(
        `🎯 Consider reducing lands (current: ${Math.round(analysis.landRatio * 100)}%, recommended: 35-40%)`
      )
    }

    // Multi-color reco — identity from non-land spell colors (WUBRG only).
    // P0-EDH-1: do not use land colorDistribution (any-color lands + C inflated
    // Atraxa 4c to "5–6 colors"). Threshold ≥ 3 WUBRG.
    const activeWubrgCount = WUBRG_COLORS.filter(color => cards.some(card => {
      const cost = parsePhysicalCost(card.manaCost)
      return !card.isLand && !cost.unsupportedSymbols && (cost.pips[color] ?? 0) > 0
    })).length
    if (activeWubrgCount >= 3) {
      recommendations.push(
        `🌈 Multi-color deck detected (${activeWubrgCount} colors). Consider more dual lands and mana fixing.`
      )

      // Starting Town specific recommendation for multicolor decks
      if (complexAnalysis.flexibleManaLands < activeWubrgCount * 2) {
        recommendations.push(
          `✨ Starting Town would be excellent here - provides any color early game and remains useful late game.`
        )
      }
    }

    // Mana curve recommendations
    if (analysis.totalNonLands && analysis.averageCMC !== undefined && analysis.averageCMC > 3.5) {
      recommendations.push(
        `⚡ High mana curve (${analysis.averageCMC.toFixed(1)}). Consider more ramp or lower-cost spells.`
      )
    } else if (
      analysis.totalNonLands &&
      analysis.averageCMC !== undefined &&
      analysis.averageCMC < 2.0
    ) {
      recommendations.push(
        `🏃 Very aggressive curve (${analysis.averageCMC.toFixed(1)}). Ensure sufficient early mana sources.`
      )
    }

    // Complex land mechanics recommendations
    if (complexAnalysis.timingDependentLands.length > 0) {
      recommendations.push(
        `⏰ Timing-dependent lands detected: ${complexAnalysis.timingDependentLands.join(', ')}`
      )
    }

    if (complexAnalysis.lifeCostLands > 8) {
      recommendations.push(
        `❤️ High life cost from lands (${complexAnalysis.lifeCostLands} sources). Consider life gain or aggressive strategy.`
      )
    }

    if (complexAnalysis.flexibleManaLands >= 8) {
      recommendations.push(
        `🎨 Excellent mana flexibility (${complexAnalysis.flexibleManaLands} flexible sources). Great for multicolor strategies.`
      )
    }

    // Specific Starting Town analysis
    const startingTowns = cards.find((card) => card.name.toLowerCase().includes('starting town'))
    if (startingTowns && startingTowns.quantity >= 4) {
      recommendations.push(
        `🏘️ Starting Town (${startingTowns.quantity}x): Excellent early game mana base. Optimal in aggressive multicolor decks.`
      )
      recommendations.push(
        `💡 Starting Town tip: Prioritize playing it turns 1-3 for maximum value (enters untapped).`
      )
    }

    // Consistency recommendations
    if (!analysis.consistencyUnavailable && analysis.consistency !== undefined && analysis.consistency < 0.7) {
      recommendations.push(
        `🎲 Low mana consistency (${Math.round(analysis.consistency * 100)}%). Add more dual lands or mana fixing.`
      )
    }

    return recommendations
  }

  private static calculateIdealLandRatio(averageCMC: number): number {
    // Dynamic land ratio based on average CMC
    // Based on Frank Karsten's research and common deck building principles
    if (averageCMC <= 1.5) return 0.33 // Very aggressive (20/60)
    if (averageCMC <= 2.0) return 0.35 // Aggressive (21/60)
    if (averageCMC <= 2.5) return 0.37 // Midrange-low (22/60)
    if (averageCMC <= 3.0) return 0.4 // Midrange (24/60)
    if (averageCMC <= 3.5) return 0.42 // Midrange-high (25/60)
    if (averageCMC <= 4.0) return 0.43 // Control-low (26/60)
    return 0.45 // Control/Ramp (27/60)
  }

  /**
   * Hard-fail garbage / majority-not-found decklists so UI never shows
   * a fake Health 100% on invented names (EDGE-GARBAGE).
   *
   * Distinguishes definitive Scryfall 404 (`not_found`) from network/429
   * (`unavailable`) so rate-limit blips on a real 60-card list (with land
   * seed hits) do not abort analysis, while pure garbage still fails.
   */
  public static assertCardResolution(cards: DeckCard[]): void {
    if (!cards.length) throw new Error('No main-deck cards found.')

    const totalQty = cards.reduce((sum, c) => sum + (c.quantity || 1), 0)
    if (totalQty <= 0) return

    const qty = (list: DeckCard[]) => list.reduce((sum, c) => sum + (c.quantity || 1), 0)

    const okCards = cards.filter((c) => c.resolution === 'ok' || c.resolved === true)
    const notFoundCards = cards.filter(
      (c) =>
        c.resolution === 'not_found' || (c.resolved === false && c.resolution !== 'unavailable')
    )
    const unavailableCards = cards.filter((c) => c.resolution === 'unavailable')

    const okQty = qty(okCards)
    const notFoundQty = qty(notFoundCards)

    const sampleFrom = (list: DeckCard[]) =>
      [...new Set(list.map((c) => c.name))].slice(0, 6).join(', ')

    // Zero proven cards: refuse analysis (no fake Health 100%)
    if (okQty === 0) {
      if (notFoundQty > 0) {
        throw new Error(
          `Could not resolve any cards (cards not found on Scryfall). Check names${
            sampleFrom(notFoundCards) ? `: ${sampleFrom(notFoundCards)}` : ''
          }`
        )
      }
      // All unavailable (rate limit / offline) — still refuse empty trust signal
      throw new Error(
        `Could not resolve any cards (Scryfall unavailable or cards not found). Try again in a moment${
          sampleFrom(unavailableCards) ? ` — ${sampleFrom(unavailableCards)}` : ''
        }`
      )
    }

    // Majority definitive not-found (typos / garbage), ignore unavailable for this gate
    // so a land-seeded deck under 429 still analyzes.
    if (notFoundQty / totalQty > 0.5) {
      throw new Error(
        `Could not resolve most cards (${notFoundQty}/${totalQty} not found). Check names${
          sampleFrom(notFoundCards) ? `: ${sampleFrom(notFoundCards)}` : ''
        }`
      )
    }
  }

  public static async analyzeDeck(
    deckList: string,
    options?: { signal?: AbortSignal }
  ): Promise<AnalysisResult> {
    // Bump generation so any prior tempo loop aborts at its next yield (T06).
    const myGeneration = ++analysisGeneration
    const signal = options?.signal
    const throwIfCancelled = () => {
      if (signal?.aborted || myGeneration !== analysisGeneration) {
        throw new AnalysisCancelledError()
      }
    }
    throwIfCancelled()

    const inputWarnings = parseDecklist(deckList).warnings
    let importedCards: DeckCard[]
    try {
      // One total resolution budget spans collections, lands, fallbacks and JSON bodies.
      importedCards = await withTimeout(
        (resolutionSignal) => this.parseDeckList(deckList, resolutionSignal),
        30000,
        signal
      )
    } catch (error) {
      throwIfCancelled()
      throw error
    }
    const cards = importedCards.filter((card) => !card.isSideboard && !card.isCommander)
    throwIfCancelled()
    this.assertCardResolution(cards)

    const totalCards = cards.reduce((sum, card) => sum + card.quantity, 0)
    const lands = cards.filter((card) => card.isLand)
    const nonLands = cards.filter((card) => !card.isLand)

    const totalLands = lands.reduce((sum, card) => sum + card.quantity, 0)
    const totalNonLands = nonLands.reduce((sum, card) => sum + card.quantity, 0)

    // Calcul de la distribution des couleurs dans les terrains
    const colorDistribution: Record<ManaColor, number> = {} as Record<ManaColor, number>
    MANA_COLORS.forEach((color) => {
      colorDistribution[color] = lands
        .filter((card) => card.producedMana?.includes(color))
        .reduce((sum, card) => sum + card.quantity, 0)
    })

    // Fixed color requirements are not the same as hybrid payment alternatives.
    const parsedPayments = nonLands.map(card => ({ card, cost: parsePhysicalCost(card.manaCost) }))
    const manaRequirements = Object.fromEntries(MANA_COLORS.map(color => [color,
      Math.ceil(parsedPayments.filter(({ cost }) => !cost.unsupportedSymbols && (cost.pips[color] ?? 0) > 0)
        .reduce((sum, { card }) => sum + card.quantity, 0) * 0.6),
    ])) as Record<ManaColor, number>
    const probabilities = {
      turn1: this.calculateColorProbabilities(cards, manaRequirements, 1),
      turn2: this.calculateColorProbabilities(cards, manaRequirements, 2),
      turn3: this.calculateColorProbabilities(cards, manaRequirements, 3),
      turn4: this.calculateColorProbabilities(cards, manaRequirements, 4),
    }
    // Heuristic marginal events: one source from each distinct fixed/OR group.
    // Repeated pips and simultaneous payment belong to the physical castability engine.
    const masks = new Set<number>()
    for (const { cost } of parsedPayments) {
      if (cost.unsupportedSymbols) continue
      MANA_COLORS.forEach((color, index) => { if ((cost.pips[color] ?? 0) > 0) masks.add(1 << index) })
      cost.hybrid?.forEach(mask => masks.add(mask))
    }
    const consistencyUnavailable = parsedPayments.some(({ cost }) => cost.unsupportedSymbols)
    const colorAccessNotes = [
      ...(parsedPayments.some(({ cost }) => cost.hybrid?.length) ? ['Hybrid access counts each land once in the union of its payment colors. This marginal score does not measure repeated pips or simultaneous payment.'] : []),
      ...(consistencyUnavailable ? ['Color access score unavailable: a main-deck payment uses unrepresented symbols (such as phyrexian or snow). See individual castability limitations.'] : []),
    ]
    const accessAtTurn = (turn: number): number => {
      const access = [...masks].map(mask => {
        const sources = lands.filter(land => land.producedMana?.some(color => (mask & (1 << MANA_COLORS.indexOf(color))) !== 0))
          .reduce((sum, land) => sum + land.quantity, 0)
        return hypergeom.atLeast(totalCards, sources, Math.min(6 + turn, totalCards), 1)
      })
      return access.length > 0 ? access.reduce((sum, value) => sum + value, 0) / access.length
        : totalLands > 0 ? hypergeom.atLeast(totalCards, totalLands, Math.min(6 + turn, totalCards), 1) : 0
    }
    const colorAccessByTurn = consistencyUnavailable ? undefined : { turn2: accessAtTurn(2), turn4: accessAtTurn(4) }
    const consistency = colorAccessByTurn?.turn2 ?? 0

    // Détermination du rating
    let rating: 'excellent' | 'good' | 'average' | 'poor'
    if (consistency >= 0.9) rating = 'excellent'
    else if (consistency >= 0.8) rating = 'good'
    else if (consistency >= 0.7) rating = 'average'
    else rating = 'poor'

    const partialAnalysis = {
      totalCards,
      totalLands,
      totalNonLands,
      colorDistribution,
      manaRequirements,
      consistency,
      consistencyUnavailable,
      colorAccessNotes,
      colorAccessByTurn,
      rating,
    }

    const averageCMC =
      totalNonLands > 0
        ? nonLands.reduce((sum, card) => sum + card.cmc * card.quantity, 0) / totalNonLands
        : 0
    // NaN guard: empty decklist (totalCards === 0) would produce 0/0 = NaN
    // and propagate "NaN%" to ManabaseStats.
    const landRatio = totalCards > 0 ? totalLands / totalCards : 0

    const recommendations =
      totalCards > 0
        ? this.generateRecommendations(cards, { ...partialAnalysis, averageCMC, landRatio })
        : []

    // Calculate mana curve distribution
    const manaCurve: Record<string, number> = {
      '0': 0,
      '1': 0,
      '2': 0,
      '3': 0,
      '4': 0,
      '5': 0,
      '6': 0,
      '7+': 0,
    }
    nonLands.forEach((card) => {
      const cmc = Math.floor(card.cmc)
      if (cmc >= 7) {
        manaCurve['7+'] += card.quantity
      } else {
        manaCurve[cmc.toString()] += card.quantity
      }
    })

    // Calculate mulligan analysis using hypergeometric distribution
    // P(X = k) = C(K,k) * C(N-K, n-k) / C(N,n)
    // where N = deck size, K = lands, n = hand size (7), k = lands in hand
    const mulliganAnalysis = this.calculateMulliganAnalysis(totalCards, totalLands, manaCurve)

    // Summary and detailed rows share the same physical event. Unsupported
    // cards stay outside numeric summaries; they are never assigned 0 or 100%.
    const spellAnalysis: AnalysisResult['spellAnalysis'] = {}
    const unsupportedSpellAnalysis: Record<string, string> = {}
    const physicalLands = lands.flatMap((l) =>
      l.landMetadata ? Array(l.quantity).fill(l.landMetadata) : []
    )
    const completeMetadata =
      cards.every((c) => c.resolved === true) && physicalLands.length === totalLands
    let spellIndex = 0
    for (const spell of nonLands) {
      throwIfCancelled()
      const cost = parsePhysicalCost(spell.manaCost)
      const physical = completeMetadata
        ? physicalManaProbability(
            {
              deckSize: totalCards,
              totalLands,
              landColorSources: colorDistribution,
              physicalLands,
            },
            cost,
            Math.max(1, cost.mv),
            [],
            'PLAY',
            50_000
          )
        : {
            status: 'unsupported' as const,
            reason: 'Complete resolved card and land metadata is required',
          }
      if (physical.status === 'exact') {
        spellAnalysis[spell.name] = {
          castable: spell.quantity * physical.p2,
          total: spell.quantity,
          percentage: physical.p2 * 100,
        }
      } else unsupportedSpellAnalysis[spell.name] = physical.reason
      if (++spellIndex % TEMPO_YIELD_EVERY === 0) {
        await yieldToMain()
        throwIfCancelled()
      }
    }

    // NEW: Extract LandMetadata from cards for tempo analysis
    const landMetadataList: LandMetadata[] = []
    lands.forEach((land) => {
      if (land.landMetadata) {
        // Add one entry per quantity
        for (let i = 0; i < land.quantity; i++) {
          landMetadataList.push(land.landMetadata)
        }
      }
    })

    // Legacy tempo scenario estimates are not substituted for physical results.
    const tempoSpellAnalysis: Record<string, TempoSpellAnalysis> = {}

    // NEW: Calculate tempo impact by color
    let tempoImpactByColor: Record<string, TempoImpactSummary> | undefined

    if (landMetadataList.length > 0) {
      try {
        const tempoImpact = compareTempoImpact(landMetadataList, totalCards, 3)
        tempoImpactByColor = {}

        for (const [color, impact] of Object.entries(tempoImpact)) {
          tempoImpactByColor[color] = {
            color: color as LandManaColor,
            ...impact,
          }
        }
      } catch (error) {
        console.warn('[DeckAnalyzer] Error calculating tempo impact by color:', error)
      }
    }

    return {
      ...partialAnalysis,
      inputWarnings,
      recommendations,
      probabilities: {
        turn1: {
          anyColor: hypergeom.atLeast(
            totalCards,
            lands
              .filter((l) => (l.producedMana?.length ?? 0) > 0)
              .reduce((n, l) => n + l.quantity, 0),
            Math.min(7, totalCards),
            1
          ),
          specificColors: probabilities.turn1,
        },
        turn2: {
          anyColor: hypergeom.atLeast(
            totalCards,
            lands
              .filter((l) => (l.producedMana?.length ?? 0) > 0)
              .reduce((n, l) => n + l.quantity, 0),
            Math.min(8, totalCards),
            1
          ),
          specificColors: probabilities.turn2,
        },
        turn3: {
          anyColor: hypergeom.atLeast(
            totalCards,
            lands
              .filter((l) => (l.producedMana?.length ?? 0) > 0)
              .reduce((n, l) => n + l.quantity, 0),
            Math.min(9, totalCards),
            1
          ),
          specificColors: probabilities.turn3,
        },
        turn4: {
          anyColor: hypergeom.atLeast(
            totalCards,
            lands
              .filter((l) => (l.producedMana?.length ?? 0) > 0)
              .reduce((n, l) => n + l.quantity, 0),
            Math.min(10, totalCards),
            1
          ),
          specificColors: probabilities.turn4,
        },
      },
      averageCMC,
      landRatio,
      manaCurve,
      mulliganAnalysis,
      spellAnalysis,
      unsupportedSpellAnalysis,
      spellAnalysisModel: 'physical-v1',
      // NEW: Include tempo-aware analysis
      tempoSpellAnalysis:
        Object.keys(tempoSpellAnalysis).length > 0 ? tempoSpellAnalysis : undefined,
      tempoImpactByColor,
      landMetadata: landMetadataList.length > 0 ? landMetadataList : undefined,
      // Cards for advanced mulligan analysis
      cards: importedCards,
    }
  }

  private static getBasicLandColors(name: string): ManaColor[] {
    const lowerName = name.toLowerCase()

    // Basic lands
    if (lowerName.includes('island')) return ['U']
    if (lowerName.includes('mountain')) return ['R']
    if (lowerName.includes('plains')) return ['W']
    if (lowerName.includes('swamp')) return ['B']
    if (lowerName.includes('forest')) return ['G']

    // Default: produces colorless
    return []
  }

  /**
   * Calculate mulligan analysis using hypergeometric distribution
   * Determines probability distribution of opening hand quality
   */
  private static calculateMulliganAnalysis(
    deckSize: number,
    landCount: number,
    manaCurve: Record<string, number>
  ): {
    perfectHand: number
    goodHand: number
    averageHand: number
    poorHand: number
    terribleHand: number
  } {
    const handSize = 7

    // T09: SSOT hypergeom.pmf (log-space) — replaces local float binomial
    // Calculate probability of getting exactly k lands in opening hand
    const landProbs: number[] = []
    for (let k = 0; k <= handSize; k++) {
      landProbs[k] = hypergeom.pmf(deckSize, landCount, handSize, k)
    }

    // Count early game spells (CMC 0-2) for "perfect hand" calculation
    const earlySpells = (manaCurve['0'] || 0) + (manaCurve['1'] || 0) + (manaCurve['2'] || 0)
    const totalSpells = deckSize - landCount

    // Probability of having at least 1 early spell given we drew (7-k) spells
    const probEarlySpell = (spellsDrawn: number): number => {
      if (earlySpells === 0 || totalSpells === 0) return 0
      if (spellsDrawn <= 0) return 0
      // P(at least 1 early spell) = 1 - P(0 early spells)
      const probNoEarly = hypergeom.pmf(totalSpells, earlySpells, spellsDrawn, 0)
      return 1 - probNoEarly
    }

    // Perfect Hand: 2-4 lands AND at least one early game spell (CMC 0-2)
    let perfectHand = 0
    for (let k = 2; k <= 4; k++) {
      const spellsDrawn = handSize - k
      perfectHand += landProbs[k] * probEarlySpell(spellsDrawn)
    }

    // Good Hand: 2-4 lands (includes perfect, so we show total keepable)
    const goodHand = landProbs[2] + landProbs[3] + landProbs[4]

    // Average Hand: 1 or 5 lands (borderline keep/mulligan)
    const averageHand = landProbs[1] + landProbs[5]

    // Poor Hand: 0 or 6 lands (usually mulligan)
    const poorHand = landProbs[0] + landProbs[6]

    // Terrible Hand: 7 lands or 0 lands with no early plays
    const terribleHand = landProbs[7] + landProbs[0] * (1 - probEarlySpell(7))

    // Convert to percentages and ensure they make sense
    return {
      perfectHand: Math.round(perfectHand * 100),
      goodHand: Math.round(goodHand * 100),
      averageHand: Math.round(averageHand * 100),
      poorHand: Math.round(poorHand * 100),
      terribleHand: Math.round(terribleHand * 100), // Includes seven-land hands outside the poor category
    }
  }

  // Analyse des implications stratégiques des lands complexes
  private static analyzeComplexLandMechanics(cards: DeckCard[]): {
    earlyGameLands: number
    lateGameLands: number
    lifeCostLands: number
    flexibleManaLands: number
    timingDependentLands: string[]
  } {
    let earlyGameLands = 0
    let lateGameLands = 0
    let lifeCostLands = 0
    let flexibleManaLands = 0
    const timingDependentLands: string[] = []

    cards
      .filter((card) => card.isLand)
      .forEach((land) => {
        // Prefer Scryfall-attached metadata, else seed/cache sync lookup
        const meta = land.landMetadata ?? landService.getLandSync(land.name)
        const category = meta?.category
        const producesAny = meta?.producesAny === true
        const etbType = meta?.etbBehavior?.type
        const etbCondition = meta?.etbBehavior?.condition

        // Starting Town / turn-threshold ETB (optimal early turns)
        if (etbCondition?.type === 'turn_threshold') {
          earlyGameLands += land.quantity
          lateGameLands += land.quantity
          if (producesAny) {
            lifeCostLands += land.quantity
            flexibleManaLands += land.quantity
          }
          timingDependentLands.push(
            `${land.quantity}x ${land.name} (optimal turns 1-${etbCondition.threshold ?? 3})`
          )
        }

        // Shocklands: pay life to enter untapped
        else if (category === 'shock') {
          earlyGameLands += land.quantity
          lifeCostLands += land.quantity
          flexibleManaLands += land.quantity
        }

        // Fastlands: untapped with ≤2 other lands
        else if (category === 'fast') {
          earlyGameLands += land.quantity
          timingDependentLands.push(`${land.quantity}x ${land.name} (optimal with ≤2 other lands)`)
        }

        // Rainbow / any-color producers with life activation (Mana Confluence, City of Brass…)
        else if (producesAny && etbType === 'always_untapped') {
          flexibleManaLands += land.quantity
          lifeCostLands += land.quantity
        }
      })

    return {
      earlyGameLands,
      lateGameLands,
      lifeCostLands,
      flexibleManaLands,
      timingDependentLands,
    }
  }
}
