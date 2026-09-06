const { chromium, expect } = require('@playwright/test')
const fs = require('fs')
const cards = JSON.parse(
  require('node:zlib').gunzipSync(fs.readFileSync(__dirname + '/proofs/sample-cards.json.gz'))
)
const input = JSON.parse(fs.readFileSync(__dirname + '/proofs/sample-input.json'))
const matches = (c, n) =>
  c.name.toLowerCase() === n.toLowerCase() ||
  c.name.split(' // ')[0].toLowerCase() === n.toLowerCase()
;(async () => {
  const browser = await chromium.launch()
  const results = []
  try {
    for (const [key, deck] of Object.entries(input.decks)) {
      const page = await browser.newPage()
      await page.addInitScript(() => localStorage.setItem('manatuner-onboarding-completed', 'true'))
      await page.route('https://api.scryfall.com/cards/**', async (route) => {
        const req = route.request(),
          u = new URL(req.url())
        const col = u.pathname.endsWith('/collection')
        const c = cards.find((c) =>
          matches(c, u.searchParams.get('exact') || u.searchParams.get('fuzzy') || '')
        )
        await route.fulfill({
          status: col || c ? 200 : 404,
          json: col
            ? {
                object: 'list',
                data: cards.filter((c) =>
                  req.postDataJSON().identifiers.some((x) => matches(c, x.name))
                ),
                not_found: [],
              }
            : c || { object: 'error', details: 'Fixture absent' },
        })
      })
      await page.goto((process.env.BASE_URL || 'http://127.0.0.1:3002') + '/analyzer?sample=' + key)
      await expect(page.getByPlaceholder(/paste your decklist/i)).toHaveValue(deck)
      await page.getByRole('button', { name: 'Analyze Manabase' }).click()
      await page.getByTestId('analysis-results').waitFor()
      await expect(page.getByTestId('mana-estimate').first()).toBeVisible()
      results.push({
        sample: key,
        estimates: await page.getByTestId('mana-estimate').count(),
        unavailable: await page.getByText('Calculation unavailable', { exact: true }).count(),
        text: await page.getByTestId('analyzer-tabpanel-0').innerText(),
      })
      fs.writeFileSync(
        process.env.REVIEW_OUTPUT || '/tmp/manatuner-samples-results.json',
        JSON.stringify(results, null, 2)
      )
      await page.close()
    }
  } finally {
    await browser.close()
  }
})().catch((e) => {
  console.error(e)
  process.exitCode = 1
})
