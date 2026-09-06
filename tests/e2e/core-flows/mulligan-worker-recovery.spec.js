import { test, expect } from '../../fixtures/audit-browser.js'

test('F13 failed worker asset is recoverable; real worker runs again at 50k precision', async ({ page }, testInfo) => {
  test.setTimeout(60000)
  const errors = []
  page.on('pageerror', error => errors.push(error.message))
  let failFirstWorker = true
  let workerRequests = 0
  // Vite build asset and development worker entry, both restricted to this worker.
  await page.route(/mulliganArchetype\.worker/, async route => {
    workerRequests++
    if (failFirstWorker) {
      failFirstWorker = false
      await route.abort('failed')
    } else await route.continue()
  })
  await page.goto('/analyzer')
  await page.getByPlaceholder(/paste your decklist/i).fill('24 Mountain\n36 Lightning Bolt')
  await page.getByRole('button', { name: /analyze manabase/i }).click()
  await expect(page.getByTestId('analysis-results')).toBeVisible()
  await page.getByTestId('tab-mulligan').click()
  await expect(page.getByRole('alert').filter({ hasText: /worker stopped|worker did not respond/i })).toBeVisible({ timeout: 20000 })
  await expect(page.getByRole('button', { name: 'Re-run Analysis', exact: true })).toBeEnabled()
  // A new precision selection triggers a fresh worker after the platform failure.
  await page.getByText('Precise (50k)', { exact: true }).click()
  await expect(page.getByText('How to use this analysis', { exact: true })).toBeVisible({ timeout: 30000 })
  await expect(page.getByText(/Based on 50,000 samples per hand size/)).toBeVisible()
  await expect(page.getByRole('button', { name: 'Re-run Analysis', exact: true })).toBeEnabled()
  expect(workerRequests).toBeGreaterThanOrEqual(2)
  expect(errors).toEqual([])
  await page.screenshot({ path: testInfo.outputPath('worker-precise-recovered.png') })
})
