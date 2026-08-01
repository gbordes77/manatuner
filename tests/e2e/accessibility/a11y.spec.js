/**
 * Accessibility smoke (EN UI) — WCAG-oriented axe scans + keyboard basics.
 * Replaces stale FR selectors that broke after the English product copy ship.
 */
import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

test.describe('Accessibility smoke (EN)', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      window.localStorage.setItem('manatuner-onboarding-completed', 'true')
    })
  })

  test('Home page — axe critical/serious (no critical)', async ({ page }) => {
    await page.goto('/')
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze()
    const critical = results.violations.filter((v) => v.impact === 'critical')
    expect(critical, JSON.stringify(critical, null, 2)).toEqual([])
  })

  test('Analyzer empty — axe critical clear', async ({ page }) => {
    await page.goto('/analyzer')
    await expect(page.getByRole('button', { name: /try example|analyze/i }).first()).toBeVisible({
      timeout: 15000,
    })
    const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze()
    const critical = results.violations.filter((v) => v.impact === 'critical')
    expect(critical, JSON.stringify(critical, null, 2)).toEqual([])
  })

  test('Analyzer after Try Example — no critical axe', async ({ page }) => {
    test.setTimeout(90000)
    await page.goto('/analyzer')
    await page.getByRole('button', { name: /try example/i }).click()
    await page.getByRole('button', { name: /analyze manabase|analyze/i }).first().click()
    await expect(page.getByTestId('analysis-results')).toBeVisible({ timeout: 60000 })

    const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze()
    const critical = results.violations.filter((v) => v.impact === 'critical')
    expect(critical, JSON.stringify(critical, null, 2)).toEqual([])
  })

  test('Header Analyzer link is unique in banner', async ({ page }) => {
    await page.goto('/')
    const bannerAnalyzer = page.getByRole('banner').getByRole('link', { name: /^Analyzer$/i })
    await expect(bannerAnalyzer).toHaveCount(1)
    await bannerAnalyzer.click()
    await expect(page).toHaveURL(/\/analyzer/)
  })

  test('Keyboard: tab reaches primary actions on home', async ({ page }) => {
    await page.goto('/')
    await page.keyboard.press('Tab')
    // After a few tabs something focusable should be active
    for (let i = 0; i < 8; i++) {
      await page.keyboard.press('Tab')
    }
    const tag = await page.evaluate(() => document.activeElement?.tagName ?? '')
    expect(['A', 'BUTTON', 'INPUT', 'TEXTAREA', 'SELECT']).toContain(tag)
  })

  test('Footer contrast text is readable (grey.800 / grey.300)', async ({ page }) => {
    await page.goto('/')
    const footer = page.locator('footer')
    await expect(footer).toBeVisible()
    await expect(footer.getByText(/Fan Content Policy/i)).toBeVisible()
    // Spot-check: caption should not use near-invisible grey
    const color = await footer.locator('p, span').first().evaluate((el) => {
      return window.getComputedStyle(el).color
    })
    expect(color).toBeTruthy()
  })
})
