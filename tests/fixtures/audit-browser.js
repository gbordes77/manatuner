import { test as base, expect } from '@playwright/test'
import records from './scryfall-audit.json' with { type: 'json' }
// Performance/responsive tests measure the app against fixed real card metadata,
// independent of live Scryfall latency and rate limits. Core flow suites retain live coverage.
export const test = base.extend({
  page: async ({ page }, use) => {
    await page.addInitScript(() => localStorage.setItem('manatuner-onboarding-completed', 'true'))
    await page.route('https://api.scryfall.com/**', async route => {
      const request = route.request()
      if (request.url().includes('/cards/collection')) {
        const names = request.postDataJSON().identifiers.map(i => i.name.toLowerCase())
        await route.fulfill({ json: { object: 'list', data: records.filter(c => names.includes(c.name.toLowerCase())) } })
      } else {
        const url = new URL(request.url())
        const name = url.searchParams.get('exact') ?? url.searchParams.get('fuzzy')
        const card = records.find(c => c.name.toLowerCase() === name?.toLowerCase())
        await route.fulfill({ status: card ? 200 : 404, json: card ?? { object: 'error', code: 'not_found' } })
      }
    })
    await use(page)
  }
})
export { expect }
export async function navigateAnalyzer(page) {
  const menu = page.getByRole('button', { name: 'Open navigation menu' })
  await expect(menu.or(page.getByRole('banner').getByRole('link', { name: 'Analyzer', exact: true }))).toBeVisible()
  if (await menu.isVisible()) {
    await menu.click()
    await page.getByRole('button', { name: 'Analyzer', exact: true }).click()
  } else await page.getByRole('banner').getByRole('link', { name: 'Analyzer', exact: true }).click()
  await expect(page).toHaveURL(/\/analyzer/)
}
