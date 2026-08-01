// @ts-check
/**
 * EDGE-GARBAGE — invented names must not produce a credible Health 100 analysis.
 */
const { test, expect } = require('@playwright/test')

const EDGE_GARBAGE = `4 NotARealCardXYZ123
4 CompletelyFakeSpell99
20 ImaginaryLandFoo`

test.describe('EDGE-GARBAGE hard-fail', () => {
  test('shows error and no Health Score 100 on invented cards', async ({ page }) => {
    test.setTimeout(120_000)

    await page.addInitScript(() => {
      window.localStorage.setItem('manatuner-onboarding-completed', 'true')
    })

    await page.goto('/analyzer')

    const skipTour = page.getByRole('button', { name: /skip tour/i })
    if (await skipTour.isVisible({ timeout: 2000 }).catch(() => false)) {
      await skipTour.click()
    }

    const deckBox = page.getByPlaceholder(/paste your decklist/i)
    await expect(deckBox).toBeVisible({ timeout: 15000 })
    await deckBox.fill(EDGE_GARBAGE)

    await page.getByRole('button', { name: /analyze manabase|analyze/i }).first().click()

    // Snackbar / MUI alert with resolve error
    const snack = page.locator('.MuiSnackbar-root, [role="alert"]').filter({
      hasText: /could not resolve|not found|Failed to analyze/i,
    })
    await expect(snack.first()).toBeVisible({ timeout: 90000 })

    // Must not show a credible perfect health verdict
    const health = page.getByText(/Health Score/i)
    if (await health.isVisible({ timeout: 2000 }).catch(() => false)) {
      const verdict = page.getByTestId('quick-verdict')
      const t = await verdict.innerText().catch(() => '')
      expect(t).not.toMatch(/100\s*%/)
    } else {
      // No results shell — preferred hard-fail path
      await expect(page.getByTestId('analysis-results')).toHaveCount(0)
    }
  })
})
