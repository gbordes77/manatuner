# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: core-flows/input-contract-audit.spec.js >> F02 excluded sections: saved populations match input
- Location: tests/e2e/core-flows/input-contract-audit.spec.js:58:7

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByRole('alert').filter({ hasText: /Maybeboard/i })
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" getByRole('alert').filter({ hasText: /Maybeboard/i }) with timeout 5000ms
  - waiting for getByRole('alert').filter({ hasText: /Maybeboard/i })

```

```yaml
- link "Skip to main content":
  - /url: "#main-content"
- region "Feedback banner":
  - alert:
    - text: Help us improve ManaTuner! (dismiss = hide banner; feedback stays in the footer)
    - link "Give feedback — opens Tally form in a new tab":
      - /url: https://tally.so/r/A7KRkN
      - text: Give Feedback
  - button "Dismiss feedback banner"
- banner:
  - link "ManaTuner - Back to home":
    - /url: /
    - text: ManaTuner
  - link "Analyzer":
    - /url: /analyzer
  - link "My Analyses":
    - /url: /my-analyses
  - link "Library":
    - /url: /library
  - button "Learn"
  - link "Feedback":
    - /url: https://tally.so/r/A7KRkN
  - link "View source code on GitHub":
    - /url: https://github.com/gbordes77/manatuner
- main:
  - paragraph: Your Deck
  - paragraph: 60 cards • 60 lands
  - paragraph: Click to edit your deck or start a new analysis
  - text: ✏️ Edit Deck
  - heading "Analysis Results Share" [level=5]:
    - text: Analysis Results
    - button "Share"
  - status:
    - text: Health Score 100% · Excellent
    - paragraph: Your deck has a color access score of 100/100 — excellent; keep almost any 2–4-land opener.
    - text: Top recommendations
    - list:
      - listitem: "1. 🎯 Consider reducing lands (current: 100%, recommended: 35-40%)"
  - text: Engine v2.7.9 · Karsten tables · hypergeom + ramp K=3 · London mulligan / Bellman
  - tablist "Analysis results tabs":
    - tab "Castability - Spell casting probabilities" [selected]: Castability
    - tab "Analysis - Detailed spell analysis": Analysis
    - tab "Mulligan - Hand simulation and strategy": Mulligan
    - tab "Manabase - Land breakdown": Manabase
    - tab "Blueprint - Export analysis as PNG, PDF or JSON": Blueprint
  - tabpanel "Castability - Spell casting probabilities":
    - heading "Castability Analysis" [level=6]
    - paragraph: Real-time mana costs from Scryfall with probability calculations
    - button "Searches & special mana — policy model"
    - text: Format
    - combobox "Format": Modern / Pioneer
    - text: Starting player
    - group "On the play or on the draw":
      - button "On the play" [pressed]
      - button "On the draw"
    - checkbox "Count rocks & dorks" [disabled]
    - paragraph: Count rocks & dorks
    - text: "Auto: Constructed (60-card) 35% removal No ramp detected"
    - button "Reset analysis settings"
    - button "Advanced"
    - alert:
      - paragraph: "Detected: Constructed — 60 lands in 60 · Priority horizon T1–T4"
      - text: Constructed priority curve is CMC 1–4 (on-curve threats and interaction). Format controls above set ramp/removal model. Change Format anytime; click the Auto chip if you locked a format and want detection again.
    - group "Probability model":
      - button "Mana estimates" [pressed]
      - button "Exact goldfish potential"
    - alert: Source-count estimates approximate mana availability with the selected ramp and removal settings. They do not model every legal payment sequence or source overlap exactly. Perfect land drops conditions on having enough lands. Neither number includes mulligans or drawing the target spell.
    - paragraph: No deck list available. Please enter a deck list and analyze it first.
    - text: Source-count estimates use the selected board. Missing metadata and costs outside this model remain unavailable.
  - heading "💾 Your Data" [level=2]
  - paragraph: 📱 All your analyses are stored locally in your browser
  - button "Export"
  - button "Import"
  - button "Info"
  - button "Reset"
- contentinfo:
  - paragraph: Crafted with
  - text: ❤️
  - paragraph: for the MTG community
  - paragraph: © 2025-2026 ManaTuner. Open source under MIT License.
  - text: ManaTuner is unofficial Fan Content permitted under the
  - link "Fan Content Policy":
    - /url: https://company.wizards.com/en/legal/fancontentpolicy
  - text: . Not approved/endorsed by Wizards. Portions of the materials used are property of Wizards of the Coast. ©Wizards of the Coast LLC.
  - link "Analyzer":
    - /url: /analyzer
  - link "Guide":
    - /url: /guide
  - link "Mathematics":
    - /url: /mathematics
  - link "Land Glossary":
    - /url: /land-glossary
  - link "About":
    - /url: /about
  - link "Privacy":
    - /url: /privacy
  - link "Give Feedback":
    - /url: https://tally.so/r/A7KRkN
  - separator
  - link "GitHub":
    - /url: https://github.com/gbordes77/manatuner
  - separator
  - link "Scryfall API":
    - /url: https://scryfall.com
  - separator
  - link "Keyrune Icons":
    - /url: https://andrewgioia.github.io/Keyrune/
  - text: Probability mathematics based on
  - link "Frank Karsten's research":
    - /url: https://www.channelfireball.com/articles/how-many-lands-do-you-need-to-consistently-hit-your-land-drops/
```

# Test source

```ts
  1  | import { test, expect } from '../../fixtures/audit-browser.js'
  2  | 
  3  | const history = page => page.evaluate(() => JSON.parse(localStorage.getItem('manatuner_analyses') || '[]'))
  4  | const analyze = page => page.getByRole('button', { name: /analyze manabase/i }).click()
  5  | const editor = page => page.getByPlaceholder(/paste your decklist/i)
  6  | 
  7  | // Each test gets a fresh browser storage. Public card fixtures intercept Scryfall.
  8  | for (const entry of ['typing', 'share', 'restore']) {
  9  |   for (const deck of ['nonsense without quantities', '1000000 Forest']) {
  10 |     test(`F01 rejects ${JSON.stringify(deck)} via ${entry} without resolution or save`, async ({ page }) => {
  11 |       const calls = []
  12 |       page.on('request', request => {
  13 |         if (request.url().startsWith('https://api.scryfall.com/')) calls.push(request.url())
  14 |       })
  15 |       if (entry === 'share') {
  16 |         await page.goto(`/analyzer#d=${Buffer.from(deck).toString('base64url')}`)
  17 |       } else if (entry === 'restore') {
  18 |         await page.addInitScript(list => localStorage.setItem('manatuner_analyses', JSON.stringify([
  19 |           { id: 'public-fixture', deckName: 'Public recovery fixture', deckList: list, timestamp: 0, analysis: {} },
  20 |         ])), deck)
  21 |         await page.goto('/my-analyses')
  22 |         await page.getByRole('button', { name: 'Load in Analyzer' }).click()
  23 |       } else {
  24 |         await page.goto('/analyzer')
  25 |         await editor(page).fill(deck)
  26 |       }
  27 |       await expect(editor(page)).toHaveValue(deck)
  28 |       const before = await history(page)
  29 |       await analyze(page)
  30 |       await expect(page.getByRole('alert').filter({ hasText: /Failed to analyze deck/i })).toBeVisible()
  31 |       await expect(page.getByTestId('analysis-results')).toHaveCount(0)
  32 |       await expect(editor(page)).toHaveValue(deck)
  33 |       expect(await history(page)).toEqual(before)
  34 |       expect(calls).toEqual([])
  35 |       await expect(page.getByRole('button', { name: /analyze manabase/i })).toBeEnabled()
  36 |     })
  37 |   }
  38 | }
  39 | 
  40 | test('F01 reports the offending line and retains valid experimental decks', async ({ page }) => {
  41 |   await page.goto('/analyzer')
  42 |   await editor(page).fill('24 Forest\nthis is not a card line')
  43 |   await analyze(page)
  44 |   await expect(page.getByRole('alert').filter({ hasText: /line 2/i })).toBeVisible()
  45 |   expect(await history(page)).toEqual([])
  46 |   await editor(page).fill('1 Forest')
  47 |   await analyze(page)
  48 |   await expect(page.getByTestId('analysis-results')).toBeVisible()
  49 |   await expect.poll(async () => (await history(page)).length).toBe(1)
  50 |   expect((await history(page))[0].analysis.totalCards).toBe(1)
  51 | })
  52 | 
  53 | for (const [label, deck, totals] of [
  54 |   ['excluded sections', '24 Forest\n36 Island\nMaybeboard\n4 Mountain\nCompanion\n1 Counterspell', [60, 0, 0]],
  55 |   ['local SB prefix and transitions', 'SB: 1 Mountain\n24 Forest\nSideboard\n1 Mountain\nCommander\n1 Counterspell\nDeck\n36 Island', [60, 2, 1]],
  56 |   ['categories and blank lines', 'Creatures (4)\n4 Lightning Bolt\n\nLands (56)\n24 Forest\n32 Island', [60, 0, 0]],
  57 | ]) {
  58 |   test(`F02 ${label}: saved populations match input`, async ({ page }) => {
  59 |     const errors = []
  60 |     page.on('pageerror', error => errors.push(error.message))
  61 |     await page.goto('/analyzer')
  62 |     await editor(page).fill(deck)
  63 |     await analyze(page)
  64 |     await expect(page.getByTestId('analysis-results')).toBeVisible()
  65 |     await expect.poll(async () => (await history(page)).length).toBe(1)
  66 |     const result = (await history(page))[0].analysis
  67 |     const count = pred => result.cards.filter(pred).reduce((sum, card) => sum + card.quantity, 0)
  68 |     expect(result.totalCards).toBe(totals[0])
  69 |     expect(count(card => !card.isSideboard && !card.isCommander)).toBe(totals[0])
  70 |     expect(count(card => card.isSideboard)).toBe(totals[1])
  71 |     expect(count(card => card.isCommander)).toBe(totals[2])
  72 |     if (label === 'excluded sections') {
  73 |       expect(result.cards.some(card => card.name === 'Mountain' || card.name === 'Counterspell')).toBe(false)
> 74 |       await expect(page.getByRole('alert').filter({ hasText: /Maybeboard/i })).toBeVisible()
     |                                                                                ^ Error: expect(locator).toBeVisible() failed
  75 |     }
  76 |     expect(errors).toEqual([])
  77 |   })
  78 | }
  79 | 
```