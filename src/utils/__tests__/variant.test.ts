import { expect, it } from 'vitest'
import { variantChanges } from '../variant'
import { analysisDeckText } from '../analysisText'
import { comparisonBlockReason, sameHealthQuestion } from '../comparison'
import type { AnalysisResult } from '../../services/deckAnalyzer'
import type { AnalysisRecord } from '../../lib/privacy'

it('keeps duplicate counts and identical names in different zones distinct', () => {
  const a =
    "Deck\n24 Plains\n36 Savannah Lions\nSideboard\n1 Plains\nCommander\n1 Atraxa, Praetors' Voice"
  const b =
    "Deck\n10 Plains\n13 Plains\n37 Savannah Lions\nSideboard\n1 Plains\nCommander\n1 Atraxa, Praetors' Voice"
  expect(variantChanges(a, b)).toMatchObject({
    commanderChanged: false,
    changes: [
      { name: 'Plains', section: 'main', quantity: -1 },
      { name: 'Savannah Lions', section: 'main', quantity: 1 },
    ],
  })
  expect(
    variantChanges(a, b.replace("1 Atraxa, Praetors' Voice", '1 Kenrith, the Returned King'))
      .commanderChanged
  ).toBe(true)
  expect(() => variantChanges(a, 'bad entry')).toThrow()
})
it('serializes the analyzed snapshot, retaining quantities and Commander zones', () => {
  const result = {
    cards: [
      { name: 'Plains', quantity: 99 },
      { name: 'Isamaru, Hound of Konda', quantity: 1, isCommander: true },
      { name: 'Forest', quantity: 1, isSideboard: true },
    ],
  } as AnalysisResult
  const text = analysisDeckText(result)
  expect(text).toBe(
    'Deck\n99 Plains\n\nCommander\n1 Isamaru, Hound of Konda\n\nSideboard\n1 Forest'
  )
  expect(variantChanges(text, text).changes).toEqual([])
  expect(result.cards[0].quantity).toBe(99)
})
it('refuses population, legacy-model and commander deltas instead of inventing comparability', () => {
  const record = (
    totalCards: number,
    model = 'physical-v1',
    commander = 'Isamaru'
  ): AnalysisRecord => ({
    id: 'test',
    timestamp: 0,
    deckName: 'Test',
    deckList: '',
    analysis: {
      totalCards,
      spellAnalysisModel: model,
      cards: [{ name: commander, quantity: 1, isCommander: true }],
    },
  })
  expect(comparisonBlockReason(record(99), record(99))).toBeUndefined()
  expect(comparisonBlockReason(record(99), record(60))).toMatch(/populations differ/)
  expect(comparisonBlockReason(record(99), record(99, 'legacy'))).toMatch(/models differ/)
  expect(comparisonBlockReason(record(99), record(99, 'physical-v1', 'Atraxa'))).toMatch(
    /commanders differ/
  )
})

it('does not compare Health when the spell costs change its color-access question', () => {
  const r = (cost: string): AnalysisRecord => ({
    id: 'test',
    timestamp: 0,
    deckName: '',
    deckList: '',
    analysis: { cards: [{ name: 'Spell', manaCost: cost }] },
  })
  expect(sameHealthQuestion(r('{U}'), r('{R}'))).toBe(false)
  expect(sameHealthQuestion(r('{U}'), r('{U}'))).toBe(true)
})
