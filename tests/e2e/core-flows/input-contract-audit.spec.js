import { test, expect } from '../../fixtures/audit-browser.js'

const history = (page) =>
  page.evaluate(() => JSON.parse(localStorage.getItem('manatuner_analyses') || '[]'))
const analyze = (page) => page.getByRole('button', { name: /analyze manabase/i }).click()
const editor = (page) => page.getByPlaceholder(/paste your decklist/i)

// Each test gets a fresh browser storage. Public card fixtures intercept Scryfall.
for (const entry of ['typing', 'share', 'restore']) {
  for (const deck of ['nonsense without quantities', '1000000 Forest']) {
    test(`F01 rejects ${JSON.stringify(deck)} via ${entry} without resolution or save`, async ({
      page,
    }) => {
      const calls = []
      page.on('request', (request) => {
        if (request.url().startsWith('https://api.scryfall.com/')) calls.push(request.url())
      })
      if (entry === 'share') {
        await page.goto(`/analyzer#d=${Buffer.from(deck).toString('base64url')}`)
      } else if (entry === 'restore') {
        await page.addInitScript(
          (list) =>
            localStorage.setItem(
              'manatuner_analyses',
              JSON.stringify([
                {
                  id: 'public-fixture',
                  deckName: 'Public recovery fixture',
                  deckList: list,
                  timestamp: 0,
                  analysis: {},
                },
              ])
            ),
          deck
        )
        await page.goto('/my-analyses')
        await page.getByRole('button', { name: 'Load in Analyzer' }).click()
      } else {
        await page.goto('/analyzer')
        await editor(page).fill(deck)
      }
      await expect(editor(page)).toHaveValue(deck)
      const before = await history(page)
      await analyze(page)
      await expect(
        page.getByRole('alert').filter({ hasText: /Failed to analyze deck/i })
      ).toBeVisible()
      await expect(page.getByTestId('analysis-results')).toHaveCount(0)
      await expect(editor(page)).toHaveValue(deck)
      expect(await history(page)).toEqual(before)
      expect(calls).toEqual([])
      await expect(page.getByRole('button', { name: /analyze manabase/i })).toBeEnabled()
    })
  }
}

test('F01 reports the offending line and retains valid experimental decks', async ({ page }) => {
  await page.goto('/analyzer')
  await editor(page).fill('24 Forest\nthis is not a card line')
  await analyze(page)
  await expect(page.getByRole('alert').filter({ hasText: /line 2/i })).toBeVisible()
  expect(await history(page)).toEqual([])
  await editor(page).fill('1 Forest')
  await analyze(page)
  await expect(page.getByTestId('analysis-results')).toBeVisible()
  await expect.poll(async () => (await history(page)).length).toBe(1)
  expect((await history(page))[0].analysis.totalCards).toBe(1)
})

for (const [label, deck, totals] of [
  [
    'excluded sections',
    '24 Forest\n36 Island\nMaybeboard\n4 Mountain\nCompanion\n1 Counterspell',
    [60, 0, 0],
  ],
  [
    'local SB prefix and transitions',
    'SB: 1 Mountain\n24 Forest\nSideboard\n1 Mountain\nCommander\n1 Counterspell\nDeck\n36 Island',
    [60, 2, 1],
  ],
  [
    'categories and blank lines',
    'Creatures (4)\n4 Lightning Bolt\n\nLands (56)\n24 Forest\n32 Island',
    [60, 0, 0],
  ],
]) {
  test(`F02 ${label}: saved populations match input`, async ({ page }) => {
    const errors = []
    page.on('pageerror', (error) => errors.push(error.message))
    await page.goto('/analyzer')
    await editor(page).fill(deck)
    await analyze(page)
    await expect(page.getByTestId('analysis-results')).toBeVisible()
    await expect.poll(async () => (await history(page)).length).toBe(1)
    const result = (await history(page))[0].analysis
    const count = (pred) => result.cards.filter(pred).reduce((sum, card) => sum + card.quantity, 0)
    expect(result.totalCards).toBe(totals[0])
    expect(count((card) => !card.isSideboard && !card.isCommander)).toBe(totals[0])
    expect(count((card) => card.isSideboard)).toBe(totals[1])
    expect(count((card) => card.isCommander)).toBe(totals[2])
    if (label === 'excluded sections') {
      expect(
        result.cards.some((card) => card.name === 'Mountain' || card.name === 'Counterspell')
      ).toBe(false)
      await expect(page.getByRole('alert').filter({ hasText: /Maybeboard/i })).toBeVisible()
    }
    expect(errors).toEqual([])
  })
}

for (const size of [40, 60, 99, 100]) {
  test(`F01 accepts ${size} basics through analyzeDeck and persists the correct population`, async ({
    page,
  }) => {
    await page.goto('/analyzer')
    await editor(page).fill(`${size} Forest`)
    await analyze(page)
    await expect(page.getByTestId('analysis-results')).toBeVisible()
    await expect.poll(async () => (await history(page)).length).toBe(1)
    const saved = (await history(page))[0]
    expect(saved.analysis.totalCards).toBe(size)
    expect(saved.analysis.totalLands).toBe(size)
    // Restore the actual generated history through the UI and reload the slim persisted state.
    await page.goto('/my-analyses')
    await page.getByRole('button', { name: 'Load in Analyzer' }).click()
    await expect(editor(page)).toHaveValue(`${size} Forest`)
    await page.reload()
    await expect(editor(page)).toHaveValue(`${size} Forest`)
    expect((await history(page))[0].id).toBe(saved.id)
  })
}

test('F02 preserves post-board swaps and returning to the main population', async ({ page }) => {
  await page.goto('/analyzer')
  await editor(page).fill('24 Mountain\n36 Lightning Bolt\nSideboard\n1 Counterspell')
  await analyze(page)
  await expect(page.getByTestId('analysis-results')).toBeVisible()
  const scope = page.getByTestId('sideboard-scope')
  await expect(scope).toContainText('60 main · 1 side')
  await expect(page.getByTestId('format-family-banner')).toContainText(/lands in 60/i)
  await scope.getByRole('button', { name: 'Post-board', exact: true }).click()
  await page.getByText('Post-Board Analysis', { exact: true }).click()
  await page.getByRole('button', { name: 'Increase sideboard Counterspell', exact: true }).click()
  await page.getByRole('button', { name: 'Increase maindeck Lightning Bolt', exact: true }).click()
  await page.getByRole('button', { name: 'Apply Swaps', exact: true }).click()
  await expect(page.getByText(/Post-board castability — 1 card/)).toBeVisible()
  await expect(page.getByText('1x Counterspell', { exact: false })).toBeVisible()
  await expect(page.getByText('Mana availability estimate: 0%', { exact: true })).toBeVisible()
  await expect(page.getByTestId('format-family-banner')).toContainText(/lands in 60/i)
  await scope.getByRole('button', { name: 'Main only', exact: true }).click()
  await expect(page.getByText(/Post-board castability —/)).toHaveCount(0)
  await expect(scope).toContainText('60 main · 1 side')
  const saved = (await history(page))[0].analysis
  expect(saved.cards.find((card) => card.name === 'Counterspell').isSideboard).toBe(true)
  expect(saved.cards.find((card) => card.name === 'Lightning Bolt').quantity).toBe(36)
})

test('NR-M11 independent white T1 demand: 24 Plains / 36 Savannah Lions rounds to 98% in exact mode', async ({
  page,
}) => {
  // Minimal public metadata assembled for this synthetic, non-tournament deck;
  // these responses are fixtures, not a live Scryfall capture.
  const records = [
    {
      name: 'Plains',
      mana_cost: '',
      cmc: 0,
      type_line: 'Basic Land — Plains',
      oracle_text: '({T}: Add {W}.)',
      colors: [],
      color_identity: ['W'],
      produced_mana: ['W'],
      layout: 'normal',
    },
    {
      name: 'Savannah Lions',
      mana_cost: '{W}',
      cmc: 1,
      type_line: 'Creature — Cat',
      oracle_text: '',
      colors: ['W'],
      color_identity: ['W'],
      layout: 'normal',
    },
  ]
  await page.route('https://api.scryfall.com/**', async (route) => {
    const request = route.request()
    if (request.url().includes('/cards/collection')) {
      const names = request.postDataJSON().identifiers.map((card) => card.name)
      await route.fulfill({
        json: { object: 'list', data: records.filter((card) => names.includes(card.name)) },
      })
    } else {
      const url = new URL(request.url())
      const card = records.find(
        (card) => card.name === (url.searchParams.get('exact') || url.searchParams.get('fuzzy'))
      )
      if (card) await route.fulfill({ json: card })
      else await route.fallback()
    }
  })
  await page.goto('/analyzer')
  await editor(page).fill('24 Plains\n36 Savannah Lions')
  await analyze(page)
  await expect(page.getByTestId('analysis-results')).toBeVisible()
  const saved = (await history(page))[0].analysis
  // Independent product of probabilities of seven non-sources, external spell demand.
  const expected =
    1 - Array.from({ length: 7 }, (_, i) => (36 - i) / (60 - i)).reduce((a, b) => a * b, 1)
  expect(expected).toBeCloseTo(0.978385472740882, 12)
  expect(saved.totalCards).toBe(60)
  expect(saved.totalLands).toBe(24)
  expect(saved.probabilities.turn1.anyColor).toBeCloseTo(expected, 12)
  await page.getByRole('button', { name: 'Exact goldfish potential', exact: true }).click()
  await expect(page.getByText('Potential castability: 98%', { exact: true })).toBeVisible()
  await expect(page.getByText(/No mulligans or chance of drawing the target spell/)).toBeVisible()
})
