import { test, expect } from '../../fixtures/audit-browser.js'
const key = 'manatuner_analyses'
const record = (
  id,
  analysis = {
    averageCMC: 2,
    totalCards: 60,
    totalLands: 24,
    landRatio: 0.4,
    cards: [],
    consistency: 0.8,
  }
) => ({ id, deckName: id, deckList: '24 Mountain\n36 Lightning Bolt', timestamp: 0, analysis })
const stored = (page) => page.evaluate((key) => localStorage.getItem(key), key)
async function importFile(page, value) {
  const chooser = page.waitForEvent('filechooser')
  await page.getByRole('button', { name: 'Import (merge)', exact: true }).click()
  await (
    await chooser
  ).setFiles({
    name: 'public-history.json',
    mimeType: 'application/json',
    buffer: Buffer.from(JSON.stringify(value)),
  })
}

test('F06 mixed damaged history retains valid cards and old raw deck without rewriting source', async ({
  page,
}) => {
  const raw = JSON.stringify([
    null,
    record('Valid deck'),
    record('Old deck', { averageCMC: 'oops' }),
  ])
  await page.addInitScript(({ key, raw }) => localStorage.setItem(key, raw), { key, raw })
  const errors = []
  page.on('pageerror', (error) => errors.push(error.message))
  await page.goto('/my-analyses')
  await expect(page.getByText('Valid deck', { exact: true })).toBeVisible()
  await expect(page.getByText('Old deck', { exact: true })).toBeVisible()
  await expect(page.getByText(/History entry 1 is invalid and hidden/)).toBeVisible()
  await expect(page.getByText(/Saved result unavailable. Load the original deck/)).toBeVisible()
  expect(await stored(page)).toBe(raw)
  await page.getByRole('button', { name: 'Load in Analyzer' }).nth(1).click()
  await expect(page.getByPlaceholder(/paste your decklist/i)).toHaveValue(
    '24 Mountain\n36 Lightning Bolt'
  )
  expect(errors).toEqual([])
})
for (const mode of ['invalid', 'quota', 'merge']) {
  test(`F06 ${mode} import preserves existing history and reports outcome`, async ({ page }) => {
    const raw = JSON.stringify([record('Existing')])
    await page.addInitScript(({ key, raw }) => localStorage.setItem(key, raw), { key, raw })
    await page.goto('/analyzer')
    if (mode === 'quota')
      await page.evaluate((key) => {
        const original = Storage.prototype.setItem
        Storage.prototype.setItem = function (k, v) {
          if (k === key) throw new DOMException('Full', 'QuotaExceededError')
          return original.call(this, k, v)
        }
      }, key)
    await importFile(page, [
      record('New', mode === 'invalid' ? { averageCMC: 'oops' } : { averageCMC: 3, cards: [] }),
    ])
    if (mode === 'merge') {
      await expect(
        page.getByText(/Imported 1 analyses; 0 duplicate IDs kept unchanged/)
      ).toBeVisible()
      expect(JSON.parse(await stored(page)).map((r) => r.id)).toEqual(['Existing', 'New'])
    } else {
      await expect(
        page.getByText(
          mode === 'invalid'
            ? /Invalid result in history entry 1/
            : /Browser storage full. No history was changed/
        )
      ).toBeVisible()
      expect(await stored(page)).toBe(raw)
    }
  })
}

test('F06 comparison handles validated results and F03 unavailable score', async ({ page }) => {
  const values = [
    record('Known'),
    record('Unsupported', {
      averageCMC: 3,
      totalCards: 60,
      totalLands: 24,
      landRatio: 0.4,
      cards: [],
      consistency: 0,
      consistencyUnavailable: true,
      colorAccessNotes: ['Life payment is not modeled.'],
    }),
  ]
  await page.addInitScript(({ key, values }) => localStorage.setItem(key, JSON.stringify(values)), {
    key,
    values,
  })
  const errors = []
  page.on('pageerror', (error) => errors.push(error.message))
  await page.goto('/my-analyses')
  await expect(page.getByText('Health Score unavailable', { exact: true })).toBeVisible()
  await page.getByRole('button', { name: 'Compare', exact: true }).click()
  await page.getByText('Known', { exact: true }).click()
  await page.getByText('Unsupported', { exact: true }).click()
  await page.getByRole('button', { name: 'Compare Selected (2/2)', exact: true }).click()
  const dialog = page.getByRole('dialog')
  await expect(dialog.getByText('Health Score unavailable', { exact: true })).toBeVisible()
  await expect(dialog.getByText('Unavailable', { exact: true })).toBeVisible()
  expect(errors).toEqual([])
})
