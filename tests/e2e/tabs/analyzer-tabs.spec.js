/**
 * Modern tab navigation smoke (EN UI).
 * Replaces the old FR/legacy-tab suite that no longer matched Castability / Analysis / Mulligan / Manabase / Blueprint.
 */
import { test, expect } from '@playwright/test'

test.describe('Analyzer result tabs', () => {
  test('navigates all 5 result tabs after Try Example', async ({ page }) => {
    await page.addInitScript(() => {
      window.localStorage.setItem('manatuner-onboarding-completed', 'true')
    })

    await page.goto('/analyzer')
    const skip = page.getByRole('button', { name: /skip tour/i })
    if (await skip.isVisible({ timeout: 1500 }).catch(() => false)) await skip.click()

    await page.getByRole('button', { name: /try example/i }).click()
    await page.getByRole('button', { name: /analyze manabase|analyze/i }).first().click()
    await expect(page.getByTestId('analysis-results')).toBeVisible({ timeout: 45000 })

    for (const id of ['tab-castability', 'tab-analysis', 'tab-mulligan', 'tab-manabase', 'tab-blueprint']) {
      await page.getByTestId(id).click()
      await expect(page.getByText(/Something went wrong|could not be cloned/i)).toHaveCount(0)
    }

    // Format / play-draw controls visible on Castability
    await page.getByTestId('tab-castability').click()
    await expect(page.getByTestId('analysis-settings')).toBeVisible({ timeout: 15000 })
    await expect(page.getByTestId('play-draw-toggle')).toBeVisible()
  })
})
