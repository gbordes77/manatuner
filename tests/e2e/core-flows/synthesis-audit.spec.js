import { test, expect } from '../../fixtures/audit-browser.js'

const extraCards = [
  { name: 'Manamorphose', mana_cost: '{1}{R/G}', cmc: 2, type_line: 'Instant', colors: ['G', 'R'], color_identity: ['G', 'R'], layout: 'normal' },
  { name: 'Gitaxian Probe', mana_cost: '{U/P}', cmc: 1, type_line: 'Sorcery', colors: ['U'], color_identity: ['U'], layout: 'normal' },
]
test.beforeEach(async ({ page }) => {
  // Public minimal test metadata. All other requests use the shared fixed fixture.
  await page.route('https://api.scryfall.com/**', async route => {
    const request = route.request()
    if (request.url().includes('/cards/collection')) {
      const names = request.postDataJSON().identifiers.map(card => card.name)
      const extra = extraCards.filter(card => names.includes(card.name))
      if (extra.length) {
        await route.fulfill({ json: { object: 'list', data: extra } })
        return
      }
    } else {
      const url = new URL(request.url())
      const card = extraCards.find(card => card.name === (url.searchParams.get('exact') || url.searchParams.get('fuzzy')))
      if (card) { await route.fulfill({ json: card }); return }
    }
    await route.fallback()
  })
})
const analyze = async (page, deck) => {
  await page.goto('/analyzer')
  await page.getByPlaceholder(/paste your decklist/i).fill(deck)
  await page.getByRole('button', { name: /analyze manabase/i }).click()
  await expect(page.getByTestId('analysis-results')).toBeVisible()
}

test('F03 hybrid can be supported by green, with honest target limitation and exact detail', async ({ page }, testInfo) => {
  await page.setViewportSize({ width: 360, height: 900 })
  await analyze(page, '24 Forest\n36 Manamorphose')
  await expect(page.getByTestId('quick-verdict')).not.toContainText(/colors? short/)
  await page.getByRole('button', { name: 'Exact goldfish potential', exact: true }).click()
  await expect(page.getByText(/Potential castability: \d+%/)).toBeVisible()
  await page.getByTestId('tab-manabase').click()
  await expect(page.getByText(/hybrid alternatives have no independent per-color Karsten target/)).toBeVisible()
  await expect(page.getByText(/\d+ sources? short/, { exact: true })).toHaveCount(0)
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
  await page.screenshot({ path: testInfo.outputPath('hybrid-manabase-360.png') })
})

test('F03 strict RG still reports missing red and phyrexian score is unavailable', async ({ page }) => {
  await analyze(page, "24 Forest\n36 Atarka's Command")
  await expect(page.getByTestId('quick-verdict')).toContainText(/color short/)
  await page.getByTestId('tab-manabase').click()
  await expect(page.getByText(/\d+ sources? short/, { exact: true })).toBeVisible()
  await page.getByRole('button', { name: 'Edit Deck', exact: true }).click()
  await page.getByPlaceholder(/paste your decklist/i).fill('24 Island\n36 Gitaxian Probe')
  await page.getByRole('button', { name: /analyze manabase/i }).click()
  await expect(page.getByTestId('quick-verdict')).toContainText(/Health Score unavailable/i)
  await page.getByTestId('tab-blueprint').click()
  await expect(page.getByText('Unavailable', { exact: true }).first()).toBeVisible()
})

test('F04 adding a blue sideboard does not change the red main-deck verdict', async ({ page }) => {
  await analyze(page, '24 Mountain\n36 Lightning Bolt')
  const initial = await page.getByTestId('quick-verdict').textContent()
  await page.getByRole('button', { name: 'Edit Deck', exact: true }).click()
  await page.getByPlaceholder(/paste your decklist/i).fill('24 Mountain\n36 Lightning Bolt\nSideboard\n1 Counterspell')
  await page.getByRole('button', { name: /analyze manabase/i }).click()
  await expect(page.getByTestId('quick-verdict')).toHaveText(initial)
  await page.getByTestId('tab-manabase').click()
  await expect(page.getByText(/\d+ sources? short/, { exact: true })).toHaveCount(0)
})
