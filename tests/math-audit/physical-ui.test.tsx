import { it, expect, vi, afterEach } from 'vitest'
import { render, screen, cleanup } from '@testing-library/react'
import ManaCostRow from '../../src/components/ManaCostRow'
import { landService } from '../../src/services/landService'
vi.mock('../../src/components/CardImageTooltip', () => ({
  CardImageTooltip: ({ children }: { children: unknown }) => children,
}))
afterEach(cleanup)
const base = {
  cardName: 'WU',
  quantity: 1,
  totalCards: 10,
  totalLands: 4,
  deckSources: { W: 1, U: 1, G: 3 },
  initialCardData: { name: 'WU', mana_cost: '{W}{U}', cmc: 2 } as any,
  accelContext: { playDraw: 'PLAY' as const, removalRate: 0, defaultRockSurvival: 1 },
}
it('the actual row displays the exact physical zero, not the old 80 percent', () => {
  render(
    <ManaCostRow
      {...base}
      physicalLands={[
        { ...landService.getLandSync('Plains')!, produces: ['W', 'U'] },
        ...Array(3).fill(landService.getLandSync('Forest')!),
      ]}
    />
  )
  expect(screen.getByText('Potential castability: 0%')).toBeTruthy()
  expect(screen.queryByText('80%')).toBeNull()
})
it('missing source metadata never falls back to a fabricated percentage', () => {
  render(<ManaCostRow {...base} physicalLands={null} />)
  expect(screen.getByText('Calculation unavailable')).toBeTruthy()
  expect(screen.queryByText(/Potential castability:/)).toBeNull()
})
it('an unsupported cost never silently drops its special symbol', () => {
  render(
    <ManaCostRow
      {...base}
      initialCardData={{ name: 'Snow', mana_cost: '{S}', cmc: 1 } as any}
      physicalLands={Array(4).fill(landService.getLandSync('Island')!)}
    />
  )
  expect(screen.getByText('Calculation unavailable')).toBeTruthy()
})
it('creature-removal settings do not disable a lands-only calculation', () => {
  render(
    <ManaCostRow
      {...base}
      showAcceleration={false}
      accelContext={{ ...base.accelContext, removalRate: 0.35 }}
      physicalLands={Array(4).fill(landService.getLandSync('Forest')!)}
    />
  )
  expect(screen.getByText('Potential castability: 0%')).toBeTruthy()
})
