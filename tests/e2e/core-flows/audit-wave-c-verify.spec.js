/**
 * Automated verification of audit wave C + prior P0/P1 smoke checks.
 */
import { test, expect } from '@playwright/test'

test.describe('Audit verification (automated)', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      window.localStorage.setItem('manatuner-onboarding-completed', 'true')
      window.localStorage.removeItem('manatuner-feedback-banner-dismissed-v1')
    })
  })

  test('shell: Learn nav + Feedback entry points', async ({ page }) => {
    await page.goto('/')

    const menu = page.getByRole('button', { name: 'Open navigation menu' })
    await expect(menu.or(page.getByRole('button', { name: 'Learn', exact: true }))).toBeVisible()
    if (await menu.isVisible()) {
      await menu.click()
      await expect(page.getByRole('button', { name: 'Guide', exact: true })).toBeVisible()
      await expect(page.getByRole('button', { name: 'Mathematics', exact: true })).toBeVisible()
      await page.getByRole('button', { name: 'Close navigation menu' }).click()
    } else {
      const learnNav = page.getByRole('button', { name: 'Learn', exact: true })
      await expect(learnNav).toBeVisible()
      await learnNav.click()
      await expect(page.getByRole('menuitem', { name: /guide/i })).toBeVisible()
      await expect(page.getByRole('menuitem', { name: /mathematics/i })).toBeVisible()
      await page.keyboard.press('Escape')
    }

    // Header + footer both link to Tally (Chip renders as <a>)
    const tallyLinks = page.locator('a[href*="tally.so"]')
    await expect(tallyLinks.first()).toBeVisible()
    expect(await tallyLinks.count()).toBeGreaterThanOrEqual(2)
    const footerFeedback = page.locator('footer a[href*="tally.so"]')
    await expect(footerFeedback.first()).toBeVisible()

    await expect(page.getByRole('button', { name: /paste a deck/i })).toBeVisible()
    await expect(page.getByRole('button', { name: /try an example/i })).toBeVisible()
    await expect(page.getByRole('heading', { level: 1 })).toContainText(/Rocks|Dorks|Lands/i)
  })

  test('analyzer happy path + format controls + health score', async ({ page }) => {
    test.setTimeout(90000)
    await page.goto('/analyzer')

    await page.getByRole('button', { name: /try example/i }).click()
    await page.getByRole('button', { name: /analyze manabase|analyze/i }).first().click()
    await expect(page.getByTestId('analysis-results')).toBeVisible({ timeout: 60000 })
    await expect(page.getByTestId('quick-verdict')).toBeVisible()
    await expect(page.getByText(/Health Score/i)).toBeVisible()
    await expect(page.getByTestId('engine-stamp')).toContainText(/Engine v2\.7/)

    await expect(page.getByTestId('analysis-settings')).toBeVisible({ timeout: 20000 })
    await expect(page.getByTestId('play-draw-toggle')).toBeVisible()
    await expect(page.getByTestId('format-select')).toBeVisible()

    for (const id of [
      'tab-castability',
      'tab-analysis',
      'tab-mulligan',
      'tab-manabase',
      'tab-blueprint',
    ]) {
      await page.getByTestId(id).click()
      await expect(
        page.getByText(/Something went wrong|could not be cloned|DataCloneError/i)
      ).toHaveCount(0)
    }
  })

  test('EDH sample auto-detects Commander format family', async ({ page }) => {
    test.setTimeout(120000)
    await page.addInitScript(() => {
      try {
        sessionStorage.removeItem('manatuner-commander-preset')
      } catch {
        /* ignore */
      }
    })
    await page.goto('/analyzer?sample=edh')

    // Wait for sample hydrate into textarea
    const deckBox = page.getByPlaceholder(/paste your decklist/i)
    await expect(deckBox).toBeVisible({ timeout: 15000 })
    await expect
      .poll(async () => (await deckBox.inputValue()).length, { timeout: 20000 })
      .toBeGreaterThan(50)

    // Ensure analyze is enabled only after deck is present
    const analyzeBtn = page.getByRole('button', { name: /analyze manabase|analyze/i }).first()
    await expect(analyzeBtn).toBeEnabled({ timeout: 10000 })
    await analyzeBtn.click()
    await expect(page.getByTestId('analysis-results')).toBeVisible({ timeout: 90000 })

    await page.getByTestId('tab-castability').click()
    await expect(page.getByTestId('tab-castability')).toHaveAttribute('aria-selected', 'true')
    await expect(page.getByTestId('format-family-banner')).toBeVisible({ timeout: 20000 })
    await expect(page.getByTestId('format-family-banner')).toContainText(/Commander/i)
  })

  test('Limited sample auto-detects Limited', async ({ page }) => {
    test.setTimeout(120000)
    await page.goto('/analyzer?sample=limited')
    const deckBox = page.getByPlaceholder(/paste your decklist/i)
    await expect(deckBox).toBeVisible({ timeout: 15000 })
    await expect
      .poll(async () => (await deckBox.inputValue()).length, { timeout: 15000 })
      .toBeGreaterThan(20)

    await page.getByRole('button', { name: /analyze manabase|analyze/i }).first().click()
    await expect(page.getByTestId('analysis-results')).toBeVisible({ timeout: 90000 })
    await page.getByTestId('tab-castability').click()
    await expect(page.getByTestId('format-family-banner')).toBeVisible({ timeout: 20000 })
    await expect(page.getByTestId('format-family-banner')).toContainText(/Limited/i)
  })

  test('sideboard main/post-board toggle when SB present', async ({ page }) => {
    test.setTimeout(120000)
    await page.goto('/analyzer')

    const deck = `4 Lightning Bolt
4 Island
20 Mountain
4 Counterspell
4 Shock
4 Goblin Guide
4 Monastery Swiftspear
4 Lava Spike
4 Rift Bolt
4 Eidolon of the Great Revel
4 Skullcrack

Sideboard
2 Rest in Peace
2 Surgical Extraction
2 Path to Exile
1 Wear // Tear
2 Damping Sphere
2 Leyline of the Void
2 Grafdigger's Cage
2 Relic of Progenitus
`

    const deckBox = page.getByPlaceholder(/paste your decklist/i)
    await expect(deckBox).toBeVisible({ timeout: 15000 })
    await deckBox.fill(deck)
    await page.getByRole('button', { name: /analyze manabase|analyze/i }).first().click()
    await expect(page.getByTestId('analysis-results')).toBeVisible({ timeout: 90000 })
    await page.getByTestId('tab-castability').click()

    const scope = page.getByTestId('sideboard-scope')
    await expect(scope).toBeVisible({ timeout: 30000 })
    await expect(scope.getByRole('button', { name: /main only/i })).toBeVisible()
    await expect(scope.getByRole('button', { name: /post-board/i })).toBeVisible()
    await scope.getByRole('button', { name: /post-board/i }).click()
    await expect(page.getByText(/IN from Sideboard|Post-board|swaps/i).first()).toBeVisible({
      timeout: 15000,
    })
  })
})
