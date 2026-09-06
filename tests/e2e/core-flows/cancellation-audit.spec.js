import { test, expect } from '../../fixtures/audit-browser.js'

test('F05 Clear during metadata resolution aborts the pending request and remains empty after reload', async ({
  page,
}) => {
  let release
  const gate = new Promise((resolve) => {
    release = resolve
  })
  let started
  const seen = new Promise((resolve) => {
    started = resolve
  })
  await page.route('https://api.scryfall.com/cards/collection', async (route) => {
    started()
    await gate
    await route.fallback()
  })
  await page.goto('/analyzer')
  const editor = page.getByPlaceholder(/paste your decklist/i)
  await editor.fill('24 Mountain\n36 Lightning Bolt')
  await page.getByRole('button', { name: /analyze manabase/i }).click()
  await seen
  // Queue the editor's 300 ms persistence debounce while A is in flight.
  await editor.fill('24 Mountain\n35 Lightning Bolt')
  const cancelled = page.waitForEvent('requestfailed', request => request.url().includes('/cards/collection'))
  await page.getByRole('button', { name: /clear/i, exact: true }).click()
  await expect(editor).toHaveValue('')
  await expect(page.getByRole('button', { name: /analyze manabase/i })).toBeDisabled()
  await cancelled
  release()
  await page.evaluate(
    () => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)))
  )
  // Cross the pending 300 ms draft debounce before asserting durable Clear.
  await page.waitForTimeout(350)
  // The real request is aborted; component tests separately cover a service ignoring abort.
  await expect
    .poll(() =>
      page.evaluate(() => {
        const root = localStorage.getItem('persist:root')
        return root ? JSON.parse(JSON.parse(root).analyzer).deckList : null
      })
    )
    .toBe('')
  await expect(page.getByTestId('analysis-results')).toHaveCount(0)
  await expect
    .poll(() =>
      page.evaluate(() => JSON.parse(localStorage.getItem('manatuner_analyses') || '[]').length)
    )
    .toBe(0)
  await page.reload()
  await expect(editor).toHaveValue('')
  await expect(page.getByTestId('analysis-results')).toHaveCount(0)
})
