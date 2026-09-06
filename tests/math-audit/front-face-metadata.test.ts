import { afterEach, expect, it, vi } from 'vitest'
import { DeckAnalyzer } from '../../src/services/deckAnalyzer'
import { landService } from '../../src/services/landService'
import * as resolver from '../../src/services/cardResolver'
afterEach(() => vi.restoreAllMocks())
it.each([
  ['Wedding Announcement', '{2}{W}', 3, 'Enchantment', false],
  ['Delver of Secrets', '{U}', 1, 'Creature — Human Wizard', true],
])(
  'the analyzer keeps the actual front-face cost of %s',
  async (name, cost, cmc, type, creature) => {
    vi.spyOn(landService, 'detectLand').mockResolvedValue(null)
    vi.spyOn(resolver, 'batchFetchFromScryfall').mockResolvedValue(undefined)
    vi.spyOn(resolver, 'fetchCardFromScryfallWithMeta').mockResolvedValue({
      notFound: false,
      data: {
        name,
        cmc,
        layout: 'transform',
        type_line: `${type} // Enchantment`,
        card_faces: [
          { name, mana_cost: cost, type_line: type },
          { name: 'Back face', mana_cost: '', type_line: 'Enchantment' },
        ],
      } as any,
    })
    const [card] = await (DeckAnalyzer as any).parseDeckList(`1 ${name}`)
    expect(card.manaCost).toBe(cost)
    expect(card.cmc).toBe(cmc)
    expect(Boolean(card.isCreature)).toBe(creature)
    expect(card.resolved).toBe(true)
    expect(card.colors).toEqual(cost.includes('W') ? ['W'] : ['U'])
  }
)
it('a genuinely absent mana cost remains absent instead of becoming zero cost', async () => {
  vi.spyOn(landService, 'detectLand').mockResolvedValue(null)
  vi.spyOn(resolver, 'batchFetchFromScryfall').mockResolvedValue(undefined)
  vi.spyOn(resolver, 'fetchCardFromScryfallWithMeta').mockResolvedValue({
    notFound: false,
    data: {
      name: 'Ancestral Vision',
      mana_cost: '',
      cmc: 0,
      type_line: 'Sorcery',
    } as any,
  })
  const [card] = await (DeckAnalyzer as any).parseDeckList('1 Ancestral Vision')
  expect(card.manaCost).toBe('')
})
