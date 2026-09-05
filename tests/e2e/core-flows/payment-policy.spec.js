import { test, expect } from '@playwright/test'

const cards = [
  {
    name: 'Forest',
    type_line: 'Basic Land — Forest',
    mana_cost: '',
    cmc: 0,
    colors: [],
    oracle_text: '{T}: Add {G}.',
  },
  {
    name: 'Windswept Heath',
    type_line: 'Land',
    mana_cost: '',
    cmc: 0,
    colors: [],
    oracle_text:
      '{T}, Pay 1 life, Sacrifice this land: Search your library for a Forest or Plains card, put it onto the battlefield, then shuffle.',
  },
  {
    name: 'Lightning Bolt',
    type_line: 'Instant',
    mana_cost: '{R}',
    cmc: 1,
    colors: ['R'],
    oracle_text: 'Lightning Bolt deals 3 damage to any target.',
  },
].map((c, i) => ({
  object: 'card',
  id: `policy-fixture-${i}`,
  set: 'test',
  rarity: 'common',
  layout: 'normal',
  color_identity: c.colors,
  ...c,
}))

test('Policy worker: physical fetch target, life reserve, export and stale result clearing', async ({
  page,
}) => {
  await page.addInitScript(() => localStorage.setItem('manatuner-onboarding-completed', 'true'))
  await page.route('https://api.scryfall.com/cards/**', async (route) => {
    const request = route.request()
    if (request.url().includes('/collection')) {
      const names = request.postDataJSON().identifiers.map((x) => x.name)
      return route.fulfill({
        json: { object: 'list', data: cards.filter((c) => names.includes(c.name)), not_found: [] },
      })
    }
    const url = new URL(request.url())
    const name = url.searchParams.get('exact') || url.searchParams.get('fuzzy')
    const card = cards.find((c) => c.name === name)
    return route.fulfill({
      status: card ? 200 : 404,
      json: card || { object: 'error', details: 'Fixture absent' },
    })
  })
  await page.goto('/analyzer')
  await page
    .getByPlaceholder(/paste your decklist/i)
    .fill('1 Forest\n1 Windswept Heath\n8 Lightning Bolt')
  await page.getByRole('button', { name: /analyze manabase/i }).click()
  await expect(page.getByTestId('analysis-results')).toBeVisible()
  await page.getByRole('button', { name: 'Searches & special mana — policy model' }).click()
  const panel = page.getByTestId('payment-policy-panel')
  await panel.getByLabel('Target turn', { exact: true }).fill('1')
  await panel.getByRole('button', { name: 'Calculate payment strategy' }).click()
  await expect(panel.getByText('Policy payment probability: 93.33%')).toBeVisible()
  const downloadPromise = page.waitForEvent('download')
  await panel.getByRole('button', { name: 'Export policy JSON' }).click()
  const download = await downloadPromise
  const stream = await download.createReadStream()
  let text = ''
  for await (const chunk of stream) text += chunk
  const exported = JSON.parse(text)
  expect(exported.model).toBe('payment-policy-v2')
  expect(exported.input.cards.reduce((n, c) => n + c.count, 0)).toBe(10)
  expect(exported.result.probability).toBeCloseTo(14 / 15, 12)
  await panel.getByLabel('Starting life', { exact: true }).fill('1')
  await expect(panel.getByText(/Policy payment probability/)).toHaveCount(0)
  await panel.getByRole('button', { name: 'Calculate payment strategy' }).click()
  await expect(panel.getByText('Policy payment probability: 70.00%')).toBeVisible()
  await panel.getByLabel('Target mana cost', { exact: true }).fill('{Q}')
  await panel.getByRole('button', { name: 'Calculate payment strategy' }).click()
  await expect(panel.getByText(/Calculation unavailable/)).toBeVisible()
  await expect(panel.getByText(/Policy payment probability/)).toHaveCount(0)
})
