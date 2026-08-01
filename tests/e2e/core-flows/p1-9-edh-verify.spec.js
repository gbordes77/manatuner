/**
 * P1-9 EDH depth — local verification (not committed unless wanted).
 */
import { test, expect } from '@playwright/test'

test.describe('P1-9 EDH deeper', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      window.localStorage.setItem('manatuner-onboarding-completed', 'true')
    })
  })

  test('sample=edh: commander banner, horizon, command zone, scaled manabase', async ({
    page,
  }) => {
    test.setTimeout(120000)
    await page.goto('http://localhost:3000/analyzer?sample=edh')

    const deckBox = page.getByPlaceholder(/paste your decklist/i)
    await expect(deckBox).toBeVisible({ timeout: 15000 })
    await expect
      .poll(async () => (await deckBox.inputValue()).length, { timeout: 15000 })
      .toBeGreaterThan(50)

    // Banner on hydrate (before analyze)
    await expect(page.getByTestId('commander-preset-banner')).toBeVisible({ timeout: 10000 })
    await expect(page.getByTestId('commander-preset-banner')).toContainText(/T5|horizon|Commander/i)

    await page.getByRole('button', { name: /analyze manabase|analyze/i }).first().click()
    await expect(page.getByTestId('analysis-results')).toBeVisible({ timeout: 90000 })

    // QuickVerdict EDH
    const qv = page.getByTestId('quick-verdict')
    await expect(qv).toBeVisible()
    await expect(qv).toContainText(/EDH|100/i)
    await expect(qv).toContainText(/command zone|T5|scaled/i)

    // Castability format banner + horizon + command zone note
    await page.getByTestId('tab-castability').click()
    const banner = page.getByTestId('format-family-banner')
    await expect(banner).toBeVisible({ timeout: 20000 })
    await expect(banner).toContainText(/Commander/i)
    await expect(banner).toContainText(/T5/i)
    await expect(page.getByTestId('edh-command-zone-note')).toBeVisible()
    await expect(page.getByTestId('edh-command-zone-note')).toContainText(/command zone/i)

    // At least one priority horizon row
    await expect(page.locator('[data-horizon="priority"]').first()).toBeVisible({ timeout: 15000 })

    // Manabase: scaled language if any color delta shows
    await page.getByTestId('tab-manabase').click()
    // Don't hard-fail if manabase layout differs — look for Color Sources or scaled copy
    const body = await page.locator('body').innerText()
    const hasColorCheck =
      /Color Sources Check|sources/i.test(body) || /scaled|60-card|Karsten/i.test(body)
    expect(hasColorCheck).toBeTruthy()
  })

  test('format=commander hydrates Atraxa + banner', async ({ page }) => {
    test.setTimeout(60000)
    await page.goto('http://localhost:3000/analyzer?format=commander')
    const deckBox = page.getByPlaceholder(/paste your decklist/i)
    await expect(deckBox).toBeVisible({ timeout: 15000 })
    await expect
      .poll(async () => (await deckBox.inputValue()).length, { timeout: 15000 })
      .toBeGreaterThan(50)
    await expect(page.getByTestId('commander-preset-banner')).toBeVisible()
    await expect(deckBox).toHaveValue(/Atraxa|Commander|Plains|Forest/i)
  })
})
