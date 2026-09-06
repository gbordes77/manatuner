/**
 * T10 — parseDecklistText bounds + formats non-regression.
 */
import { describe, expect, it } from 'vitest'
import { DECKLIST_NAME_MAX, DECKLIST_QTY_MAX, parseDecklistText } from '../scryfall'
import { persistedAnalyzerSchema } from '../../lib/validations'

describe('T10 parseDecklistText bounds', () => {
  it('parses Arena-style qty + name', () => {
    const cards = parseDecklistText('4 Lightning Bolt\n20 Mountain')
    expect(cards).toEqual([
      { name: 'Lightning Bolt', quantity: 4 },
      { name: 'Mountain', quantity: 20 },
    ])
  })

  it('parses Moxfield-style 4x Name', () => {
    const cards = parseDecklistText('4x Counterspell\n1x Sol Ring')
    expect(cards.find((c) => c.name === 'Counterspell')?.quantity).toBe(4)
    expect(cards.find((c) => c.name === 'Sol Ring')?.quantity).toBe(1)
  })

  it('rejects invalid quantities without silently dropping lines', () => {
    expect(() => parseDecklistText('0 Lightning Bolt\n100 Forest')).toThrow(/Line 1/)
    expect(parseDecklistText('100 Forest')).toEqual([{ name: 'Forest', quantity: 100 }])
    expect(() => parseDecklistText('251 Forest')).toThrow(/quantity/)
  })

  it('rejects overlong names', () => {
    const long = 'A'.repeat(DECKLIST_NAME_MAX + 1)
    expect(() => parseDecklistText(`1 ${long}\n1 Valid Card`)).toThrow(/Line 1/)
  })

  it('uses the documented product total limit and main-library sections', () => {
    expect(DECKLIST_QTY_MAX).toBe(250)
    expect(() => parseDecklistText('250 Forest\n1 Island')).toThrow(/total/)
    expect(parseDecklistText('60 Forest\nMaybeboard\n4 Island')).toEqual([
      { name: 'Forest', quantity: 60 },
    ])
  })
})

describe('T10 persistedAnalyzerSchema', () => {
  it('accepts slim rehydrate shape', () => {
    const r = persistedAnalyzerSchema.safeParse({
      deckList: '4 Bolt',
      deckName: 'x',
      activeTab: 1,
      isDeckMinimized: true,
      analysisResult: null,
    })
    expect(r.success).toBe(true)
  })

  it('rejects corrupt activeTab string', () => {
    const r = persistedAnalyzerSchema.safeParse({
      deckList: '4 Bolt',
      deckName: 'x',
      activeTab: 'nope',
      isDeckMinimized: false,
    })
    expect(r.success).toBe(false)
  })
})
