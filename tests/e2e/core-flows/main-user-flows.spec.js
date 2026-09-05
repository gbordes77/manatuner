import { test, expect } from '@playwright/test'

// Replaces the retired empty FR placeholder with the persistence behavior it lacked.
test('Deck draft survives a real browser reload without analysis', async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('manatuner-onboarding-completed', 'true'))
  await page.goto('/analyzer')
  const draft = '12 Forest\n12 Island'
  await page.getByPlaceholder(/paste your decklist/i).fill(draft)
  await expect
    .poll(() =>
      page.evaluate(() => {
        const root = localStorage.getItem('persist:root')
        return root ? JSON.parse(JSON.parse(root).analyzer).deckList : null
      })
    )
    .toBe(draft)
  await page.reload()
  await expect(page.getByPlaceholder(/paste your decklist/i)).toHaveValue(draft)
  await expect(page.getByTestId('analysis-results')).toHaveCount(0)
})
