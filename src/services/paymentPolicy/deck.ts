import contracts from '../../data/paymentPolicyCards.json'
import type { DeckCard } from '../deckAnalyzer'
import type { LandFace, PolicyCard } from './types'
const audited = contracts as Record<string, PolicyCard>
/** Compile physical library cards, never flatten MDFC faces into separate copies. */
export function policyDeck(
  cards: DeckCard[],
  includeResources = true,
  commanderIdentity?: string[]
): { cards: PolicyCard[]; ignoredEffects: string[] } | { reason: string } {
  const result: PolicyCard[] = []
  const ignoredEffects: string[] = []
  for (const card of cards) {
    if (card.isSideboard || card.isCommander) continue
    if (!card.resolved) return { reason: `Missing card metadata: ${card.name}` }
    if (card.name === 'Arcane Signet' && includeResources) {
      if (
        !commanderIdentity ||
        commanderIdentity.some((c) => !'WUBRG'.includes(c) || c.length !== 1)
      )
        return { reason: 'Arcane Signet requires an explicit commander color identity' }
      result.push({
        name: card.name,
        count: card.quantity,
        spell: {
          kind: 'producer',
          cost: '{2}',
          outputs: [...new Set(commanderIdentity)].map((color) => [{ color }]),
        },
      })
      continue
    }
    const contract = audited[card.name]
    if (contract) {
      result.push({
        ...contract,
        count: card.quantity,
        spell: includeResources ? contract.spell : undefined,
      })
      if (contract.lands && !contract.searchable)
        ignoredEffects.push(`${card.name}: non-mana spell face effects excluded`)
      continue
    }
    if (!card.isLand) {
      // Detected unsupported resource cards must not silently become blanks.
      if (
        includeResources &&
        (card.producesMana || card.name === 'Arcane Signet' || card.name === 'Desperate Ritual')
      )
        return { reason: `Resource contract not represented: ${card.name}` }
      result.push({ name: card.name, count: card.quantity })
      continue
    }
    const land = card.landMetadata
    if (
      !land ||
      land.isFetch ||
      land.isMDFC ||
      land.producesAnyForCreaturesOnly ||
      !['basic', 'dual', 'triome', 'fast', 'slow', 'check', 'battle', 'shock'].includes(
        land.category
      )
    )
      return { reason: `Land contract not represented: ${card.name}` }
    const colors = land.producesAny ? Array.from('WUBRG') : land.produces
    if (!colors.length || (land.producesAmount ?? 1) !== 1)
      return { reason: `Land production not represented: ${card.name}` }
    const face: LandFace = {
      name: land.name,
      basic: land.category === 'basic',
      types: land.basicLandTypes,
      outputs: colors.map((color) => [{ color, snow: land.name.startsWith('Snow-Covered ') }]),
      tapped: land.etbBehavior.type === 'always_tapped',
    }
    if (land.etbBehavior.type === 'conditional') {
      const condition = land.etbBehavior.condition
      if (!condition) return { reason: `Missing entry condition: ${card.name}` }
      if (condition.type === 'pay_life') {
        face.entryLife = condition.amount
      } else face.entry = condition
    }
    result.push({ name: card.name, count: card.quantity, lands: [face], searchable: true })
  }
  return { cards: result, ignoredEffects }
}
