import { describe, expect, it } from 'vitest'
import { SAMPLE_DECKS, SAMPLE_DECK_EXPECTED_TOTALS, countDeckListCards } from '../sampleDecks'

describe('SAMPLE_DECKS card counts (legal format sizes)', () => {
  it.each(Object.keys(SAMPLE_DECK_EXPECTED_TOTALS))(
    '%s total matches expected legal size',
    (key) => {
      const sample = SAMPLE_DECKS[key]
      expect(sample, `missing SAMPLE_DECKS.${key}`).toBeDefined()
      const total = countDeckListCards(sample.list)
      expect(total).toBe(SAMPLE_DECK_EXPECTED_TOTALS[key])
    }
  )

  it('limited is 40, edh is 100, constructed samples are 60', () => {
    expect(countDeckListCards(SAMPLE_DECKS.limited.list)).toBe(40)
    expect(countDeckListCards(SAMPLE_DECKS.edh.list)).toBe(100)
    expect(countDeckListCards(SAMPLE_DECKS.control.list)).toBe(60)
    expect(countDeckListCards(SAMPLE_DECKS.aggro.list)).toBe(60)
    expect(countDeckListCards(SAMPLE_DECKS.midrange.list)).toBe(60)
  })

  it('edh sample keeps *CMDR* on Atraxa', () => {
    expect(SAMPLE_DECKS.edh.list).toMatch(/Atraxa.*\*CMDR\*/i)
  })
})
