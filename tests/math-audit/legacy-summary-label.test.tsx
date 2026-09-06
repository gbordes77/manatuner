import { afterEach, expect, it } from 'vitest'
import { cleanup, render, screen } from '@testing-library/react'
import EnhancedSpellAnalysis from '../../src/components/EnhancedSpellAnalysis'
afterEach(cleanup)
it('old saved estimates are never introduced as the current physical model', () => {
  render(
    <EnhancedSpellAnalysis spellAnalysis={{ Bolt: { castable: 1, total: 1, percentage: 90 } }} />
  )
  expect(screen.getByText(/Saved legacy estimates/)).toBeTruthy()
  expect(screen.queryByText(/Current model: potential castability/)).toBeNull()
})
