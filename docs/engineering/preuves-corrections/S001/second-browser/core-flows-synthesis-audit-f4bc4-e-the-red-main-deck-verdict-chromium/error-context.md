# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: core-flows/synthesis-audit.spec.js >> F04 adding a blue sideboard does not change the red main-deck verdict
- Location: tests/e2e/core-flows/synthesis-audit.spec.js:56:5

# Error details

```
Error: expect(locator).toHaveText(expected) failed

Locator: getByTestId('quick-verdict')
Timeout: 5000ms
- Expected  - 6
+ Received  + 1

- Health Score 99% · Excellent
-
- Your deck has a color access score of 99/100 — excellent; keep almost any 2–4-land opener.
-
- Top recommendations
- 1. 🏃 Very aggressive curve (1.0). Ensure sufficient early mana sources.
+ Health Score 99% · ExcellentYour deck has a color access score of 99/100 — excellent; keep almost any 2–4-land opener.Top recommendations1. 🏃 Very aggressive curve (1.0). Ensure sufficient early mana sources.

Call log:
  - Expect "toHaveText" getByTestId('quick-verdict') with timeout 5000ms
  - waiting for getByTestId('quick-verdict')
    13 × locator resolved to <div role="status" tabindex="-1" id="quick-verdict" aria-live="polite" aria-atomic="true" data-testid="quick-verdict" class="MuiPaper-root MuiPaper-elevation MuiPaper-rounded MuiPaper-elevation0 MuiAlert-root MuiAlert-colorSuccess MuiAlert-outlinedSuccess MuiAlert-outlined css-ql3018">…</div>
       - unexpected value "Health Score 99% · ExcellentYour deck has a color access score of 99/100 — excellent; keep almost any 2–4-land opener.Top recommendations1. 🏃 Very aggressive curve (1.0). Ensure sufficient early mana sources."

```

```yaml
- status:
  - text: Health Score 99% · Excellent
  - paragraph: Your deck has a color access score of 99/100 — excellent; keep almost any 2–4-land opener.
  - text: Top recommendations
  - list:
    - listitem: 1. 🏃 Very aggressive curve (1.0). Ensure sufficient early mana sources.
```

# Test source

```ts
  1  | import { test, expect } from '../../fixtures/audit-browser.js'
  2  | 
  3  | const extraCards = [
  4  |   { name: 'Manamorphose', mana_cost: '{1}{R/G}', cmc: 2, type_line: 'Instant', colors: ['G', 'R'], color_identity: ['G', 'R'], layout: 'normal' },
  5  |   { name: 'Gitaxian Probe', mana_cost: '{U/P}', cmc: 1, type_line: 'Sorcery', colors: ['U'], color_identity: ['U'], layout: 'normal' },
  6  | ]
  7  | test.beforeEach(async ({ page }) => {
  8  |   // Public minimal test metadata. All other requests use the shared fixed fixture.
  9  |   await page.route('https://api.scryfall.com/**', async route => {
  10 |     const request = route.request()
  11 |     if (request.url().includes('/cards/collection')) {
  12 |       const names = request.postDataJSON().identifiers.map(card => card.name)
  13 |       const extra = extraCards.filter(card => names.includes(card.name))
  14 |       if (extra.length) {
  15 |         await route.fulfill({ json: { object: 'list', data: extra } })
  16 |         return
  17 |       }
  18 |     } else {
  19 |       const url = new URL(request.url())
  20 |       const card = extraCards.find(card => card.name === (url.searchParams.get('exact') || url.searchParams.get('fuzzy')))
  21 |       if (card) { await route.fulfill({ json: card }); return }
  22 |     }
  23 |     await route.fallback()
  24 |   })
  25 | })
  26 | const analyze = async (page, deck) => {
  27 |   await page.goto('/analyzer')
  28 |   await page.getByPlaceholder(/paste your decklist/i).fill(deck)
  29 |   await page.getByRole('button', { name: /analyze manabase/i }).click()
  30 |   await expect(page.getByTestId('analysis-results')).toBeVisible()
  31 | }
  32 | 
  33 | test('F03 hybrid can be supported by green, with honest target limitation and exact detail', async ({ page }) => {
  34 |   await analyze(page, '24 Forest\n36 Manamorphose')
  35 |   await expect(page.getByTestId('quick-verdict')).not.toContainText(/colors? short/)
  36 |   await page.getByRole('button', { name: 'Exact goldfish potential', exact: true }).click()
  37 |   await expect(page.getByText(/Potential castability: \d+%/)).toBeVisible()
  38 |   await page.getByTestId('tab-manabase').click()
  39 |   await expect(page.getByText(/hybrid alternatives have no independent per-color Karsten target/)).toBeVisible()
  40 |   await expect(page.getByText(/\d+ sources? short/, { exact: true })).toHaveCount(0)
  41 | })
  42 | 
  43 | test('F03 strict RG still reports missing red and phyrexian score is unavailable', async ({ page }) => {
  44 |   await analyze(page, "24 Forest\n36 Atarka's Command")
  45 |   await expect(page.getByTestId('quick-verdict')).toContainText(/color short/)
  46 |   await page.getByTestId('tab-manabase').click()
  47 |   await expect(page.getByText(/\d+ sources? short/, { exact: true })).toBeVisible()
  48 |   await page.getByRole('button', { name: 'Edit Deck', exact: true }).click()
  49 |   await page.getByPlaceholder(/paste your decklist/i).fill('24 Island\n36 Gitaxian Probe')
  50 |   await page.getByRole('button', { name: /analyze manabase/i }).click()
  51 |   await expect(page.getByTestId('quick-verdict')).toContainText(/Health Score unavailable/i)
  52 |   await page.getByTestId('tab-blueprint').click()
  53 |   await expect(page.getByText('Unavailable', { exact: true }).first()).toBeVisible()
  54 | })
  55 | 
  56 | test('F04 adding a blue sideboard does not change the red main-deck verdict', async ({ page }) => {
  57 |   await analyze(page, '24 Mountain\n36 Lightning Bolt')
  58 |   const initial = await page.getByTestId('quick-verdict').innerText()
  59 |   await page.getByRole('button', { name: 'Edit Deck', exact: true }).click()
  60 |   await page.getByPlaceholder(/paste your decklist/i).fill('24 Mountain\n36 Lightning Bolt\nSideboard\n1 Counterspell')
  61 |   await page.getByRole('button', { name: /analyze manabase/i }).click()
> 62 |   await expect(page.getByTestId('quick-verdict')).toHaveText(initial)
     |                                                   ^ Error: expect(locator).toHaveText(expected) failed
  63 |   await page.getByTestId('tab-manabase').click()
  64 |   await expect(page.getByText(/\d+ sources? short/, { exact: true })).toHaveCount(0)
  65 | })
  66 | 
```