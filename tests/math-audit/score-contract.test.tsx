import { afterEach, expect, it } from 'vitest'
import { cleanup, render, screen } from '@testing-library/react'
import EnhancedRecommendations from '../../src/components/EnhancedRecommendations'
afterEach(cleanup)
const analysis = { consistency: 0.9, landRatio: 0.4, avgCMC: 3, atRiskSpells: 0.8 }
it('missing risk cannot upgrade a known high-risk score to Excellent', () => {
  const view = render(<EnhancedRecommendations analysis={analysis} recommendations={[]} />)
  expect(screen.getByRole('heading', { level: 2 }).textContent).toBe('80')
  expect(screen.getByText('Good')).toBeTruthy()
  view.rerender(
    <EnhancedRecommendations analysis={{ ...analysis, atRiskSpells: null }} recommendations={[]} />
  )
  expect(screen.getByRole('heading', { level: 2 }).textContent).toBe('Unavailable')
  expect(screen.queryByText('Excellent')).toBeNull()
  expect(screen.getByText('Incomplete data')).toBeTruthy()
  expect(screen.getByText(/Spell risk is unavailable/)).toBeTruthy()
})
it('zero measured risk is complete, including after JSON persistence', () => {
  render(
    <EnhancedRecommendations
      analysis={JSON.parse(JSON.stringify({ ...analysis, atRiskSpells: 0 }))}
      recommendations={[]}
    />
  )
  expect(screen.getByRole('heading', { level: 2 }).textContent).toBe('100')
  expect(screen.getByText('Excellent')).toBeTruthy()
})
it('persisted missing risk stays unavailable', () => {
  render(
    <EnhancedRecommendations
      analysis={JSON.parse(JSON.stringify({ ...analysis, atRiskSpells: null }))}
      recommendations={[]}
    />
  )
  expect(screen.getByRole('heading', { level: 2 }).textContent).toBe('Unavailable')
})
