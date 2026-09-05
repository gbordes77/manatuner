import { chromium, expect } from '@playwright/test'
import { readFileSync, writeFileSync } from 'node:fs'
const records = JSON.parse(
  readFileSync(new URL('../../../tests/fixtures/scryfall-audit.json', import.meta.url))
)
const browser = await chromium.launch()
const results = []
try {
  for (const [land, expected] of [
    ['Riverglide Pathway', 'Potential castability: 40%'],
    ['Scalding Tarn', 'Calculation unavailable'],
  ]) {
    const context = await browser.newContext()
    const page = await context.newPage()
    await page.addInitScript(() => localStorage.setItem('manatuner-onboarding-completed', 'true'))
    await page.route('https://api.scryfall.com/**', async (route) => {
      const req = route.request()
      if (req.url().includes('/cards/collection')) {
        const names = req.postDataJSON().identifiers.map((i) => i.name.toLowerCase())
        await route.fulfill({
          json: {
            object: 'list',
            data: records.filter((c) => names.includes(c.name.toLowerCase())),
          },
        })
      } else {
        const url = new URL(req.url())
        const name = url.searchParams.get('exact') ?? url.searchParams.get('fuzzy')
        const card = records.find((c) => c.name.toLowerCase() === name?.toLowerCase())
        await route.fulfill({
          status: card ? 200 : 404,
          json: card ?? { object: 'error', code: 'not_found' },
        })
      }
    })
    const response = await page.goto('https://www.manatuner.app/analyzer')
    expect(response.status()).toBe(200)
    await page
      .getByRole('textbox', { name: /Paste your decklist in MTGA/ })
      .fill(`4 ${land}\n56 Lightning Bolt`)
    await page
      .getByRole('button', { name: /analyze manabase|analyze/i })
      .first()
      .click()
    await expect(page.getByTestId('analysis-results')).toBeVisible({ timeout: 45000 })
    await expect(page.getByText(expected, { exact: true }).first()).toBeVisible({ timeout: 15000 })
    if (land === 'Scalding Tarn') {
      await page.getByTestId('tab-analysis').click()
      await page.getByRole('tab', { name: 'Recommendations', exact: true }).click()
      await expect(page.getByText('Incomplete data', { exact: true })).toBeVisible()
      await expect(page.getByText(/Spell risk is unavailable/)).toBeVisible()
    }
    results.push({ land, expected, status: 'PASS', httpStatus: response.status() })
    await context.close()
  }
  // Independent closed-form check for the displayed rounded back-face probability.
  const p = 1 - Array.from({ length: 7 }, (_, i) => (56 - i) / (60 - i)).reduce((a, b) => a * b, 1)
  expect(Math.round(100 * p)).toBe(40)
  writeFileSync(
    new URL('./production-smoke.json', import.meta.url),
    JSON.stringify(
      {
        at: new Date().toISOString(),
        target: 'https://www.manatuner.app',
        scryfall: 'fixed repository fixtures',
        probabilityReference: p,
        results,
      },
      null,
      2
    )
  )
} finally {
  await browser.close()
}
