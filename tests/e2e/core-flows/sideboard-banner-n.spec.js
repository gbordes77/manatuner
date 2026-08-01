// @ts-check
/**
 * EDGE-SIDEBOARD — format banner must use main deck N (60), not main+side (75).
 */
const { test, expect } = require('@playwright/test')

const EDGE_SIDEBOARD = `4 Lightning Bolt
4 Monastery Swiftspear
4 Goblin Guide
4 Lava Spike
4 Rift Bolt
4 Searing Blaze
4 Skullcrack
4 Boros Charm
4 Eidolon of the Great Revel
4 Lightning Helix
20 Mountain
Sideboard
3 Abrade
2 Roiling Vortex
2 Smash to Smithereens
4 Dragon's Claw
4 Leyline of Combustion`

test.describe('EDGE-SIDEBOARD banner N=main', () => {
  test('format-family-banner shows lands in 60, not 75', async ({ page }) => {
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
    await deckBox.fill(EDGE_SIDEBOARD)

    await page.getByRole('button', { name: /analyze manabase|analyze/i }).first().click()
    await expect(page.getByTestId('analysis-results')).toBeVisible({ timeout: 90000 })

    await page.getByTestId('tab-castability').click()
    const banner = page.getByTestId('format-family-banner')
    await expect(banner).toBeVisible({ timeout: 30000 })

    const text = await banner.innerText()
    expect(text).toMatch(/lands in 60/i)
    expect(text).not.toMatch(/lands in 75/i)

    const scope = page.getByTestId('sideboard-scope')
    await expect(scope).toBeVisible()
    await expect(scope).toContainText(/60 main/i)
    await expect(scope).toContainText(/15 side/i)
  })
})
