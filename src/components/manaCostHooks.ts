import { useMemo } from 'react'
import { computeAcceleratedCastability } from '../services/castability'
import { cardsSeenByTurn, hypergeom } from '../services/castability/hypergeom'
import type { Card as MTGCard } from '../types'
import type { LandMetadata } from '../types/lands'
import type {
  AccelContext,
  DeckManaProfile,
  ProducerInDeck,
  ProducerManaCost,
} from '../types/manaProducers'
export interface UnconditionalMultiManaGroup {
  count: number
  delta: number
  producesMask?: number
}

export interface ManaCostRowProps {
  probabilityModel?: 'exact' | 'estimate'
  /** Null means physical source metadata is incomplete: show no percentage. */
  physicalLands?: LandMetadata[] | null
  cardName: string
  quantity: number
  deckSources?: Record<string, number>
  totalLands?: number
  totalCards?: number
  /** Mana producers in the deck */
  producers?: ProducerInDeck[]
  /** Acceleration context settings */
  accelContext?: {
    playDraw: 'PLAY' | 'DRAW'
    removalRate: number
    defaultRockSurvival: number
  }
  /** Whether to show acceleration data */
  showAcceleration?: boolean
  /** v1.1: Unconditional multi-mana lands (Ancient Tomb, Bounce lands, etc.) */
  unconditionalMultiMana?: UnconditionalMultiManaGroup
  /** Pre-fetched card data to avoid N+1 Scryfall calls */
  initialCardData?: MTGCard | null
  /**
   * Whether this card is a creature spell.
   * When true, lands like Cavern of Souls count as colored sources (via creatureOnlyExtraSources).
   */
  isCreature?: boolean
  /**
   * Extra colored sources available only for creature spells (from lands like Cavern of Souls).
   * Added to deckSources when isCreature is true.
   */
  creatureOnlyExtraSources?: Record<string, number>
  /** P1-9: spell CMC is in the format priority horizon (e.g. T4–T8 EDH). */
  inFormatHorizon?: boolean
  /** Short horizon label for chip (e.g. "T4–T8" or "Command zone"). */
  horizonLabel?: string
  /** EDH: card lives in the command zone (always available). */
  isCommander?: boolean
}

export const getManaCostFromCard = (cardData: MTGCard | null): string | null => {
  if (!cardData) return null

  // If card has a direct mana_cost, use it
  if (cardData.mana_cost) return cardData.mana_cost

  // For DFCs (transform, modal_dfc, etc.), get mana cost from front face
  if (cardData.card_faces && cardData.card_faces.length > 0) {
    const frontFace = cardData.card_faces[0]
    if (frontFace.mana_cost) return frontFace.mana_cost
  }

  return null
}

// Helper to get CMC from card data, handling DFCs
export const getCmcFromCard = (cardData: MTGCard | null): number => {
  if (!cardData) return 0

  // CMC is usually at root level even for DFCs
  if (cardData.cmc !== undefined) return cardData.cmc

  // Fallback: calculate from mana cost if needed
  const manaCost = getManaCostFromCard(cardData)
  if (manaCost) {
    let cmc = 0
    const symbols = manaCost.match(/\{[^}]+\}/g) || []
    symbols.forEach((symbol) => {
      const clean = symbol.replace(/[{}]/g, '')
      if (/^\d+$/.test(clean)) {
        cmc += parseInt(clean)
      } else if (clean !== 'X') {
        cmc += 1 // Each colored/hybrid symbol adds 1
      }
    })
    return cmc
  }

  return 0
}

// Check if card has X in mana cost and return X count
export const getXCountFromManaCost = (manaCost: string | null): number => {
  if (!manaCost) return 0
  const xMatches = manaCost.match(/\{X\}/g) || []
  return xMatches.length
}

// Get the fixed (non-X) portion of CMC
export const getFixedCmcFromManaCost = (manaCost: string | null): number => {
  if (!manaCost) return 0
  let cmc = 0
  const symbols = manaCost.match(/\{[^}]+\}/g) || []
  symbols.forEach((symbol) => {
    const clean = symbol.replace(/[{}]/g, '')
    if (/^\d+$/.test(clean)) {
      cmc += parseInt(clean)
    } else if (clean !== 'X') {
      cmc += 1 // Each colored/hybrid symbol adds 1
    }
  })
  return cmc
}

// Calculate effective X value based on target turn
export const calculateEffectiveX = (
  fixedCmc: number,
  xCount: number
): { xValue: number; targetTurn: number } => {
  // We want X to be at least 1 to make the spell worthwhile
  // Target turn = fixed CMC + X (we use X=2 as a reasonable default for "useful" X spells)
  const minUsefulX = 1
  const reasonableX = 2
  const xValue = Math.max(minUsefulX, reasonableX)
  const targetTurn = fixedCmc + xValue * xCount
  return { xValue, targetTurn }
}

// Probability calculation hook
export const useProbabilityCalculation = (
  cardData: MTGCard | null,
  cardName: string,
  deckSources?: Record<string, number>,
  totalLands?: number,
  totalCards?: number,
  playDraw: 'PLAY' | 'DRAW' = 'PLAY'
) => {
  return useMemo(() => {
    if (!cardData?.mana_cost && !cardData?.card_faces && !cardName) {
      return { p1: 95, p2: 90, hasX: false, xInfo: null }
    }

    const actualManaCost = getManaCostFromCard(cardData) || getSimulatedManaCost(cardName)

    if (!actualManaCost) return { p1: 95, p2: 90, hasX: false, xInfo: null }

    try {
      // Check for X in mana cost
      const xCount = getXCountFromManaCost(actualManaCost)
      const hasX = xCount > 0
      const fixedCmc = getFixedCmcFromManaCost(actualManaCost)

      let xInfo: { xValue: number; targetTurn: number; fixedCost: string } | null = null
      if (hasX) {
        const { xValue, targetTurn } = calculateEffectiveX(fixedCmc, xCount)
        // Extract the fixed colored portion for the tooltip
        const colorSymbols = actualManaCost
          .replace(/\{X\}/g, '')
          .replace(/\{\d+\}/g, '')
          .trim()
        xInfo = { xValue, targetTurn, fixedCost: colorSymbols || 'colorless' }
      }

      // Match regular colored symbols {W}/{U}/{B}/{R}/{G}
      const manaCostSymbols = actualManaCost.match(/\{[WUBRG]\}/g) || []
      // Match hybrid mana: pure hybrid {W/U}, twobrid {2/W}, and Phyrexian {W/P}
      // - pure hybrid: either color pays the pip
      // - twobrid: 2 generic OR 1 colored — treat as hybrid-colored-or-generic
      // - phyrexian: 2 life OR 1 colored — always payable, treat as colored if
      //   the color is available, otherwise as life (effectively colorless)
      const hybridSymbols = actualManaCost.match(/\{[^}]+\/[^}]+\}/g) || []
      // Match colorless {C} (Eldrazi, Tron, Post, Kozilek). Different from
      // generic {2}: {C} REQUIRES a colorless mana source (usually a wastes
      // or utility land), it cannot be paid with any colored mana.
      const colorlessSymbols = actualManaCost.match(/\{C\}/g) || []

      const colorCounts: { [color: string]: number } = {}
      // Track hybrid mana separately - each hybrid can be paid by either color
      const hybridMana: Array<{ color1: string; color2: string }> = []

      manaCostSymbols.forEach((symbol) => {
        const color = symbol.replace(/[{}]/g, '')
        colorCounts[color] = (colorCounts[color] || 0) + 1
      })

      // Parse hybrid symbols (pure hybrid, twobrid, phyrexian)
      hybridSymbols.forEach((symbol) => {
        const inner = symbol.slice(1, -1) // strip braces
        const parts = inner.split('/')
        if (parts.length !== 2) return
        const [left, right] = parts

        // Phyrexian {X/P}: colored left, 'P' right — always payable with life,
        // so only demand the color if present. Treat as hybrid with a "phantom"
        // always-available right side.
        if (right === 'P' && /^[WUBRG]$/.test(left)) {
          hybridMana.push({ color1: left, color2: left }) // pip is fulfillable even with no sources (life)
          return
        }
        // Twobrid {2/X}: 2 generic OR 1 colored — the colored side is the
        // expensive-but-efficient option. For probability, treat it as pure
        // hybrid between the colored option and an always-payable generic.
        if (left === '2' && /^[WUBRG]$/.test(right)) {
          hybridMana.push({ color1: right, color2: right }) // treat as fulfillable
          return
        }
        // Pure hybrid {W/U}
        if (/^[WUBRG]$/.test(left) && /^[WUBRG]$/.test(right)) {
          hybridMana.push({ color1: left, color2: right })
        }
      })

      // If no regular colors AND no hybrid AND no colorless {C}, it's pure
      // generic — always payable at the matching turn.
      if (
        Object.keys(colorCounts).length === 0 &&
        hybridMana.length === 0 &&
        colorlessSymbols.length === 0
      ) {
        const mv = hasX && xInfo ? xInfo.targetTurn : getCmcFromCard(cardData)
        const turn = Math.max(1, mv)
        const p = hypergeom.atLeast(
          totalCards ?? 60,
          totalLands ?? 24,
          cardsSeenByTurn(turn, playDraw),
          mv
        )
        return { p1: p > 0 ? 100 : 0, p2: Math.round(p * 100), hasX, xInfo }
      }

      const deckSize = totalCards ?? 60
      const landsInDeck = totalLands ?? 24

      // For X spells, use the effective turn (fixed cost + X value)
      // For regular spells, use CMC
      const baseCmc = getCmcFromCard(cardData) || 2
      const effectiveCmc = hasX && xInfo ? xInfo.targetTurn : baseCmc

      const turn = Math.max(1, Math.min(effectiveCmc, 10))
      const cardsSeen = cardsSeenByTurn(turn, playDraw)

      // P2 (realistic): mixture over land counts — colors × mana given l lands.
      // P1 (perfect drops): P(castable | lands ≥ turn) so P1 ≥ P2 always.
      // (P0-3: old p1 = colors|l=turn under-counted extra-land draws → Realistic > Best.)
      let p2Probability = 0
      let pCastGivenEnough = 0
      let pEnoughLands = 0
      const maxLands = Math.min(landsInDeck, cardsSeen)

      const colorsOkGivenL = (l: number): number => {
        if (l <= 0) return 0
        let p = 1
        for (const [color, pipsNeeded] of Object.entries(colorCounts)) {
          const colorSources = deckSources?.[color] || 0
          if (colorSources === 0) return 0
          p = Math.min(p, hypergeom.atLeast(landsInDeck, colorSources, l, pipsNeeded))
        }
        if (colorlessSymbols.length > 0) {
          p = Math.min(
            p,
            hypergeom.atLeast(landsInDeck, deckSources?.C ?? 0, l, colorlessSymbols.length)
          )
        }
        for (const hybrid of hybridMana) {
          const sources1 = deckSources?.[hybrid.color1] || 0
          const sources2 = deckSources?.[hybrid.color2] || 0
          const p1c = sources1 > 0 ? hypergeom.atLeast(landsInDeck, sources1, l, 1) : 0
          const p2c = sources2 > 0 ? hypergeom.atLeast(landsInDeck, sources2, l, 1) : 0
          p = Math.min(p, Math.max(p1c, p2c))
        }
        return p
      }

      for (let l = 0; l <= maxLands; l++) {
        const pL = hypergeom.pmf(deckSize, landsInDeck, cardsSeen, l)
        if (pL <= 0) continue
        if (l >= turn) pEnoughLands += pL
        // Need at least `turn` lands to cast an on-curve spell of CMC=turn
        if (l < turn) continue
        const pColors = colorsOkGivenL(l)
        if (pColors <= 0) continue
        const joint = pL * pColors
        p2Probability += joint
        pCastGivenEnough += joint
      }

      const p1Probability = pEnoughLands > 0 ? pCastGivenEnough / pEnoughLands : 0

      // NaN-safe rounding with a 100% ceiling. The previous 99% cap suggested
      // "nothing is ever certain" which eroded user trust when a perfectly
      // built deck returned 99% instead of 100%.
      const safePct = (p: number) =>
        !Number.isFinite(p) ? 0 : Math.round(Math.max(0, Math.min(1, p)) * 100)
      const finalP1 = safePct(p1Probability)
      const finalP2 = safePct(p2Probability)

      return {
        p1: finalP1,
        p2: finalP2,
        hasX,
        xInfo,
      }
    } catch (error) {
      console.error('Error calculating probabilities:', error)
      return { p1: 85, p2: 75, hasX: false, xInfo: null }
    }
  }, [cardData, cardName, deckSources, totalLands, totalCards, playDraw])
}

// Helper function for simulated mana costs
export const getSimulatedManaCost = (cardName: string): string => {
  const commonCosts: { [key: string]: string } = {
    'Lightning Bolt': '{R}',
    Counterspell: '{U}{U}',
    'Dark Ritual': '{B}',
    'Swords to Plowshares': '{W}',
    'Giant Growth': '{G}',
    Shock: '{R}',
    Duress: '{B}',
    Brainstorm: '{U}',
    'Path to Exile': '{W}',
    'Llanowar Elves': '{G}',
    'Lightning Strike': '{1}{R}',
    Cancel: '{1}{U}{U}',
    Murder: '{1}{B}{B}',
    Pacifism: '{1}{W}',
    'Rampant Growth': '{1}{G}',
    'Mana Leak': '{1}{U}',
    'Doom Blade': '{1}{B}',
    Disenchant: '{1}{W}',
    Naturalize: '{1}{G}',
    'Lightning Helix': '{R}{W}',
    Terminate: '{B}{R}',
    'Abrupt Decay': '{B}{G}',
    'Boros Charm': '{R}{W}',
    Dreadbore: '{B}{R}',
    'Supreme Verdict': '{1}{W}{W}{U}',
    'Cryptic Command': '{1}{U}{U}{U}',
    'Force of Will': '{3}{U}{U}',
    Tarmogoyf: '{1}{G}',
    'Snapcaster Mage': '{1}{U}',
    'Dark Confidant': '{1}{B}',
    'Noble Hierarch': '{G}',
    'Deathrite Shaman': '{B/G}',
    Thoughtseize: '{B}',
    'Inquisition of Kozilek': '{B}',
    'Spell Pierce': '{U}',
    'Fatal Push': '{B}',
    Opt: '{U}',
    'Serum Visions': '{U}',
    Preordain: '{U}',
    Ponder: '{U}',
    "Mishra's Bauble": '{0}',
    Ornithopter: '{0}',
    'Mox Opal': '{0}',
    'Chrome Mox': '{0}',
    'Lotus Petal': '{0}',
    'Ancestral Recall': '{U}',
    'Black Lotus': '{0}',
    'Time Walk': '{1}{U}',
    'Sol Ring': '{1}',
    'Mana Crypt': '{0}',
    'Birds of Paradise': '{G}',
    'Elvish Mystic': '{G}',
  }

  return commonCosts[cardName] || '{2}'
}

export const useAcceleratedCastability = (
  cardData: MTGCard | null,
  _cardName: string,
  deckSources?: Record<string, number>,
  totalLands?: number,
  totalCards?: number,
  producers?: ProducerInDeck[],
  accelContext?: ManaCostRowProps['accelContext'],
  showAcceleration?: boolean,
  unconditionalMultiMana?: UnconditionalMultiManaGroup
) => {
  return useMemo(() => {
    // Always compute SSOT base path when we have context (unifies dual engines).
    // Ramp path only differs when producers exist and showAcceleration is on.
    if (!accelContext) return null

    const manaCost = getManaCostFromCard(cardData)
    // Closed aggregate-cost domain. Never guess missing metadata or drop special symbols.
    if (!manaCost || !/^(\{(?:\d+|[WUBRGCX]|[WUBRG]\/[WUBRG])\})+$/.test(manaCost)) return null
    if (
      !deckSources ||
      !Number.isInteger(totalCards) ||
      !Number.isInteger(totalLands) ||
      totalCards! < 1 ||
      totalLands! < 0 ||
      totalLands! > totalCards!
    )
      return null
    if (Object.values(deckSources).some((n) => !Number.isFinite(n) || n < 0 || n > totalLands!))
      return null

    try {
      const colorCounts: Record<string, number> = { W: 0, U: 0, B: 0, R: 0, G: 0, C: 0 }
      let generic = 0

      const symbols = manaCost.match(/\{[^}]+\}/g) || []
      symbols.forEach((symbol) => {
        const clean = symbol.replace(/[{}]/g, '')
        if (/^\d+$/.test(clean)) {
          generic += parseInt(clean)
        } else if (clean === 'X') {
          generic += 2
        } else if (['W', 'U', 'B', 'R', 'G', 'C'].includes(clean)) {
          colorCounts[clean]++
        } else if (clean.includes('/')) {
          const parts = clean.split('/')
          const colorParts = parts.filter((p): p is 'W' | 'U' | 'B' | 'R' | 'G' =>
            ['W', 'U', 'B', 'R', 'G'].includes(p)
          )
          if (colorParts.length >= 2 && deckSources) {
            const best = colorParts.reduce((a, b) =>
              (deckSources[a] || 0) >= (deckSources[b] || 0) ? a : b
            )
            colorCounts[best]++
          } else if (colorParts.length > 0) {
            colorCounts[colorParts[0]]++
          }
        }
      })

      const totalPips = Object.values(colorCounts).reduce((a, b) => a + b, 0)
      const spellCost: ProducerManaCost = {
        mv: manaCost.includes('{X}') ? generic + totalPips : (cardData?.cmc ?? generic + totalPips),
        generic,
        pips: {
          W: colorCounts.W || undefined,
          U: colorCounts.U || undefined,
          B: colorCounts.B || undefined,
          R: colorCounts.R || undefined,
          G: colorCounts.G || undefined,
          C: colorCounts.C || undefined,
        },
      }

      const deckProfile: DeckManaProfile = {
        deckSize: totalCards ?? 60,
        totalLands: totalLands ?? 24,
        landColorSources: {
          W: deckSources?.W || 0,
          U: deckSources?.U || 0,
          B: deckSources?.B || 0,
          R: deckSources?.R || 0,
          G: deckSources?.G || 0,
          C: deckSources?.C || 0,
        },
        unconditionalMultiMana: unconditionalMultiMana,
      }

      const ctx: AccelContext = {
        playDraw: accelContext.playDraw,
        removalRate: accelContext.removalRate,
        defaultRockSurvival: accelContext.defaultRockSurvival,
      }

      const producersForEngine =
        showAcceleration && producers && producers.length > 0 ? producers : []

      return computeAcceleratedCastability(deckProfile, spellCost, producersForEngine, ctx)
    } catch (error) {
      console.error('Error calculating accelerated castability:', error)
      return null
    }
  }, [
    cardData,
    deckSources,
    totalLands,
    totalCards,
    producers,
    accelContext,
    showAcceleration,
    unconditionalMultiMana,
  ])
}

export {
  useAcceleratedCastability as _useAcceleratedCastabilityForTest,
  useProbabilityCalculation as _useProbabilityCalculationForTest,
}
