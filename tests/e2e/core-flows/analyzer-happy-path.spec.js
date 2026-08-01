/**
 * P0-4 — Analyzer happy path (current UI, EN).
 *
 * Guards: tour dismiss, Try Example, analyze, verdict, every results tab
 * must render without ErrorBoundary / DataCloneError.
 */
import { test, expect } from '@playwright/test'

test.describe('Analyzer happy path (P0)', () => {
  test('Try Example → Analyze → all 5 result tabs without crash', async ({ page }) => {
    // Pre-dismiss onboarding so Joyride does not block the flow
    await page.addInitScript(() => {
      window.localStorage.setItem('manatuner-onboarding-completed', 'true')
    })

    await page.goto('/analyzer')

    // Dismiss Joyride skip if it still appears
    const skipTour = page.getByRole('button', { name: /skip tour/i })
    if (await skipTour.isVisible({ timeout: 2000 }).catch(() => false)) {
      await skipTour.click()
    }

    // Load sample deck
    await page.getByRole('button', { name: /try example/i }).click()

    // Analyze
    const analyzeBtn = page.getByRole('button', { name: /analyze manabase|analyze/i }).first()
    await analyzeBtn.click()

    // Results shell + verdict
    await expect(page.getByTestId('analysis-results')).toBeVisible({ timeout: 45000 })
    await expect(page.getByTestId('quick-verdict')).toBeVisible({ timeout: 15000 })
    await expect(page.getByText(/Health Score/i)).toBeVisible()

    // No fatal error UI on Castability (default tab)
    await expect(page.getByText(/Something went wrong|could not be cloned|DataCloneError/i)).toHaveCount(
      0
    )
    await expect(page.getByTestId('analyzer-tabpanel-0')).toBeVisible()

    const tabs = [
      { testId: 'tab-analysis', panel: 'analyzer-tabpanel-1', marker: /Spells & Tempo|Probabilities|Recommendations/i },
      { testId: 'tab-mulligan', panel: 'analyzer-tabpanel-2', marker: /Mulligan|Archetype|Re-run Analysis|Analyzing/i },
      { testId: 'tab-manabase', panel: 'analyzer-tabpanel-3', marker: /Lands Analysis|Full Deck List|Copy link|Karsten/i },
      { testId: 'tab-blueprint', panel: 'analyzer-tabpanel-4', marker: /Blueprint|Export|PNG|PDF|JSON|Mana Stability/i },
    ]

    for (const { testId, panel, marker } of tabs) {
      await page.getByTestId(testId).click()
      await expect(page.getByTestId(panel)).toBeVisible({ timeout: 20000 })
      // ErrorBoundary copy must not appear inside results
      await expect(
        page.getByText(/Something went wrong|could not be cloned|DataCloneError|Failed to execute 'postMessage'/i)
      ).toHaveCount(0)
      // Soft content marker — tab has real content
      await expect(page.getByTestId(panel).getByText(marker).first()).toBeVisible({
        timeout: 30000,
      })
    }

    // Analysis sub-tabs exist and are distinct from Castability
    await page.getByTestId('tab-analysis').click()
    await page.getByTestId('analysis-subtab-recommendations').click()
    await expect(page.getByTestId('analyzer-tabpanel-1')).toBeVisible()
  })
})
