/**
 * Accessibility smoke (EN UI) — WCAG-oriented axe scans + keyboard basics.
 * Replaces stale FR selectors that broke after the English product copy ship.
 */
import { test, expect } from '../../fixtures/audit-browser.js'
import AxeBuilder from '@axe-core/playwright'

async function settleAnimations(page) {
  await page.evaluate(async () => {
    await document.fonts.ready
    await Promise.all(
      document
        .getAnimations()
        .filter((animation) => animation.effect?.getComputedTiming().iterations !== Infinity)
        .map((animation) => animation.finished.catch(() => {}))
    )
  })
}

test.describe('Accessibility smoke (EN)', () => {
  test.use({ reducedMotion: 'reduce' })
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      window.localStorage.setItem('manatuner-onboarding-completed', 'true')
    })
  })

  test('Home page — axe critical/serious clear', async ({ page }) => {
    await page.goto('/')
    await settleAnimations(page)
    const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze()
    const critical = results.violations.filter(
      (v) => v.impact === 'critical' || v.impact === 'serious'
    )
    expect(critical, JSON.stringify(critical, null, 2)).toEqual([])
  })

  test('Analyzer empty — axe critical/serious clear', async ({ page }) => {
    await page.goto('/analyzer')
    await expect(page.getByRole('button', { name: /try example|analyze/i }).first()).toBeVisible({
      timeout: 15000,
    })
    await settleAnimations(page)
    const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze()
    const critical = results.violations.filter(
      (v) => v.impact === 'critical' || v.impact === 'serious'
    )
    expect(critical, JSON.stringify(critical, null, 2)).toEqual([])
  })

  test('Analyzer with fixed card metadata — no critical/serious axe', async ({ page }) => {
    test.setTimeout(90000)
    await page.goto('/analyzer')
    await page
      .getByRole('textbox', { name: /Paste your decklist/ })
      .fill('24 Mountain\n36 Lightning Bolt')
    await page
      .getByRole('button', { name: /analyze manabase|analyze/i })
      .first()
      .click()
    await expect(page.getByTestId('analysis-results')).toBeVisible({ timeout: 60000 })

    await settleAnimations(page)
    const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze()
    const critical = results.violations.filter(
      (v) => v.impact === 'critical' || v.impact === 'serious'
    )
    expect(critical, JSON.stringify(critical, null, 2)).toEqual([])
  })

  test('Analyzer navigation is unique in the active desktop or mobile menu', async ({ page }) => {
    await page.goto('/')
    const menu = page.getByRole('button', { name: 'Open navigation menu' })
    await expect(
      menu.or(page.getByRole('banner').getByRole('link', { name: 'Analyzer', exact: true }))
    ).toBeVisible()
    const mobile = await menu.isVisible()
    if (mobile) await menu.click()
    const bannerAnalyzer = mobile
      ? page.getByRole('button', { name: 'Analyzer', exact: true })
      : page.getByRole('banner').getByRole('link', { name: /^Analyzer$/i })
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
    await settleAnimations(page)
    const results = await new AxeBuilder({ page })
      .include('footer')
      .withRules(['color-contrast'])
      .analyze()
    expect(results.violations, JSON.stringify(results.violations, null, 2)).toEqual([])
  })

  test('Home hero shows product preview (P2-2)', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByTestId('hero-product-preview')).toBeVisible()
    await expect(page.getByTestId('hero-product-preview')).toContainText(/Health Score/i)
  })

  test('Analyzer primary buttons use text + icons (no emoji-only)', async ({ page }) => {
    await page.goto('/analyzer')
    const tryExample = page.getByRole('button', { name: /try example/i })
    await expect(tryExample).toBeVisible({ timeout: 15000 })
    const label = (await tryExample.innerText()).replace(/\s+/g, ' ').trim()
    expect(label).toMatch(/Try Example/i)
    // Emoji-only would be short / symbol-heavy; require latin letters
    expect(label).toMatch(/[A-Za-z]{3,}/)
  })

  test('After analyze, focus lands on Health Score verdict (P2-11)', async ({ page }) => {
    test.setTimeout(90000)
    await page.goto('/analyzer')
    await page
      .getByRole('textbox', { name: /Paste your decklist/ })
      .fill('24 Mountain\n36 Lightning Bolt')
    await page
      .getByRole('button', { name: /analyze manabase|analyze/i })
      .first()
      .click()
    await expect(page.getByTestId('quick-verdict')).toBeVisible({ timeout: 60000 })
    // Focus should move to verdict region for keyboard users
    await expect
      .poll(async () => page.evaluate(() => document.activeElement?.id || ''), { timeout: 5000 })
      .toBe('quick-verdict')
    await expect(page.getByTestId('quick-verdict')).toHaveAttribute('aria-live', 'polite')
  })
})
