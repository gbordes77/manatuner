import { test, expect } from '../../fixtures/audit-browser.js'

test('F12 detailed policy discloses third parties, deletion limits and disabled candidate monitoring', async ({ page }) => {
  const monitoringRequests = []
  page.on('request', (request) => {
    if (/sentry\.io|\/api\/\d+\/envelope\//.test(request.url())) monitoringRequests.push(request.url())
  })
  await page.goto('/privacy')
  await expect(page.getByRole('heading', { name: 'Privacy Policy', exact: true })).toBeVisible()
  await expect(page.getByText(/Card lookups send card names/)).toContainText('api.scryfall.com')
  await expect(page.getByText(/Google Fonts \(/)).toContainText('jsDelivr')
  await expect(page.getByText(/Reset requests deletion/)).toContainText('best effort')
  await expect(page.getByText(/Error monitoring is disabled in this build/)).toBeVisible()
  await expect(page.getByText(/Before enabling Sentry/)).toBeVisible()
  await page.goto('/analyzer')
  await page.getByRole('button', { name: 'Info', exact: true }).click()
  const dialog = page.getByRole('dialog')
  await expect(dialog.getByText(/Sentry error monitoring is disabled/)).toBeVisible()
  await expect(dialog.getByText(/External services receive connection metadata/)).toBeVisible()
  await dialog.getByRole('link', { name: 'privacy policy' }).click()
  await expect(page).toHaveURL(/\/privacy$/)
  expect(monitoringRequests).toEqual([])
})
