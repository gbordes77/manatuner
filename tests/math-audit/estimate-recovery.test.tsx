import { afterEach, expect, it, vi } from 'vitest'
import { cleanup, render, screen } from '@testing-library/react'
import ManaCostRow from '../../src/components/ManaCostRow'
import { landService } from '../../src/services/landService'
import { getProducerFromSeed } from '../../src/data/manaProducerSeed'
import { exactTail } from './oracle'
vi.mock('../../src/components/CardImageTooltip', () => ({
  CardImageTooltip: ({ children }: any) => children,
}))
afterEach(cleanup)
const props = {
  cardName: 'Path to Exile',
  quantity: 1,
  totalCards: 40,
  totalLands: 17,
  deckSources: { W: 10, G: 9 },
  physicalLands: [
    ...Array(8).fill(landService.getLandSync('Plains')!),
    ...Array(7).fill(landService.getLandSync('Forest')!),
    ...Array(2).fill(landService.getLandSync('Selesnya Guildgate')!),
  ],
  initialCardData: { name: 'Path to Exile', mana_cost: '{W}', cmc: 1 } as any,
  producers: [{ def: getProducerFromSeed('Llanowar Elves')!, copies: 1 }],
  accelContext: { playDraw: 'PLAY' as const, removalRate: 0.15, defaultRockSurvival: 0.95 },
  showAcceleration: true,
  probabilityModel: 'estimate' as const,
}
it('an explicit estimate remains numeric with default Limited removal, with an independent T1 source-count oracle', () => {
  render(<ManaCostRow {...props} />)
  expect(
    screen.getByText(`Mana availability estimate: ${Math.round(exactTail(40, 10, 7, 1) * 100)}%`)
  ).toBeTruthy()
  expect(screen.getByText(/Source-count heuristic/)).toBeTruthy()
  expect(screen.queryByText('Calculation unavailable')).toBeNull()
})
it('exact mode keeps its refusal instead of silently substituting an estimate', () => {
  render(<ManaCostRow {...props} probabilityModel="exact" />)
  expect(screen.getByText('Calculation unavailable')).toBeTruthy()
  expect(screen.queryByText(/Mana availability estimate:/)).toBeNull()
})
it.each(['{S}', '{W/P}', '{2/W}', 'invalid'])(
  'estimate does not discard unsupported cost %s',
  (mana_cost) => {
    render(
      <ManaCostRow {...props} initialCardData={{ name: 'Unknown', mana_cost, cmc: 1 } as any} />
    )
    expect(screen.getByText('Calculation unavailable')).toBeTruthy()
    expect(screen.queryByText(/\d+%/)).toBeNull()
  }
)
it('estimate requires actual source metadata', () => {
  render(<ManaCostRow {...props} physicalLands={null} />)
  expect(screen.getByText('Calculation unavailable')).toBeTruthy()
  expect(screen.queryByText(/\d+%/)).toBeNull()
})
