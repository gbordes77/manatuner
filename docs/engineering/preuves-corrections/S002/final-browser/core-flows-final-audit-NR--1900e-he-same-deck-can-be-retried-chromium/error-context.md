# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: core-flows/final-audit.spec.js >> NR-M24 global metadata outage reports an error and the same deck can be retried
- Location: tests/e2e/core-flows/final-audit.spec.js:110:5

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByRole('alert').filter({ hasText: /Failed to analyze deck/ })
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" getByRole('alert').filter({ hasText: /Failed to analyze deck/ }) with timeout 5000ms
  - waiting for getByRole('alert').filter({ hasText: /Failed to analyze deck/ })

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
  - paragraph: 60 cards • 24 lands
  - paragraph: Edit your deck or start a new analysis
  - button "Edit Deck"
  - heading "Analysis Results Share" [level=5]:
    - text: Analysis Results
    - button "Share"
  - status:
    - text: Health Score 99% · Excellent
    - paragraph: Your deck has a color access score of 99/100 — excellent; review actual opening hands in the Mulligan tab.
    - text: Top recommendations
    - list:
      - listitem: 1. 🏃 Very aggressive curve (1.0). Ensure sufficient early mana sources.
  - text: Engine v2.7.9 · Karsten tables · hypergeom + ramp K=3 · London mulligan / Bellman
  - tablist "Analysis results tabs":
    - tab "Castability - Spell casting probabilities" [selected]: Castability
    - tab "Analysis - Detailed spell analysis": Analysis
    - tab "Mulligan - Hand simulation and strategy": Mulligan
    - tab "Manabase - Land breakdown": Manabase ✓
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
      - paragraph: "Detected: Constructed — 24 lands in 60 · Priority horizon T1–T4"
      - text: Constructed priority curve is CMC 1–4 (on-curve threats and interaction). 1 spell line in range listed first. Format controls above set ramp/removal model. Change Format anytime; click the Auto chip if you locked a format and want detection again.
    - group "Probability model":
      - button "Mana estimates" [pressed]
      - button "Exact goldfish potential"
    - alert: Source-count estimates approximate mana availability with the selected ramp and removal settings. They do not model every legal payment sequence or source overlap exactly. Perfect land drops conditions on having enough lands. Neither number includes mulligans or drawing the target spell.
    - paragraph: "Mana availability: source-count estimates, not exact payment probabilities."
    - heading "Card" [level=6]
    - heading "Mana Cost" [level=6]
    - link "Probabilities":
      - /url: /mathematics#probabilities
    - link "Heuristic source-count estimates; no mulligan or drawing the target spell.":
      - /url: /mathematics#probabilities
    - paragraph: 36x Lightning BoltT1–T4
    - text: "Cost: — No cost"
    - paragraph: "CMC: 1"
    - status:
      - paragraph: Calculation unavailable
      - text: Physical land metadata is incomplete
    - text: Source-count estimates use the selected board. Missing metadata and costs outside this model remain unavailable.
  - heading "💾 Your Data" [level=2]
  - paragraph: 📱 All your analyses are stored locally in your browser
  - button "Export"
  - button "Import (merge)"
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
  16  |     const range = document.createRange()
  17  |     const node = [...el.childNodes].find(n => n.nodeType === Node.TEXT_NODE && n.textContent.includes('Full Deck List'))
  18  |     range.selectNode(node)
  19  |     const text = range.getBoundingClientRect()
  20  |     const scroller = el.closest('.MuiTabs-scroller').getBoundingClientRect()
  21  |     return { left: text.left, right: text.right, clipLeft: scroller.left, clipRight: scroller.right }
  22  |   })
  23  |   expect(bounds.left).toBeGreaterThanOrEqual(bounds.clipLeft)
  24  |   expect(bounds.right).toBeLessThanOrEqual(bounds.clipRight)
  25  |   await tab.click()
  26  |   await expect(tab).toHaveAttribute('aria-selected', 'true')
  27  |   await expect(page.getByText('Lightning Bolt', { exact: true }).first()).toBeVisible()
  28  |   await page.screenshot({ path: testInfo.outputPath('manabase-mobile.png') })
  29  | })
  30  | 
  31  | test('V05 blueprint JSON matches results and PNG/PDF retain the whole tall blueprint', async ({ page }, testInfo) => {
  32  |   test.setTimeout(90000)
  33  |   await page.setViewportSize({ width: 360, height: 900 })
  34  |   await analyze(page)
  35  |   await page.getByTestId('tab-blueprint').click()
  36  |   const card = page.getByTestId('blueprint-card')
  37  |   expect(await card.evaluate(el => el.scrollWidth <= el.clientWidth)).toBe(true)
  38  |   expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
  39  |   const downloads = {}
  40  |   for (const [kind, label] of [['json', 'JSON (Backup)'], ['png', 'PNG (Social Media)'], ['pdf', 'PDF (Documentation)']]) {
  41  |     await page.getByRole('button', { name: 'Export Blueprint', exact: true }).click()
  42  |     const pending = page.waitForEvent('download')
  43  |     await page.getByRole('menuitem', { name: label, exact: true }).click()
  44  |     const download = await pending
  45  |     const path = testInfo.outputPath(`blueprint.${kind}`)
  46  |     await download.saveAs(path)
  47  |     downloads[kind] = await (await import('node:fs/promises')).readFile(path)
  48  |   }
  49  |   const json = JSON.parse(downloads.json)
  50  |   expect(json.analysis.totalCards).toBe(60)
  51  |   expect(json.analysis.totalLands).toBe(24)
  52  |   expect(json.stabilityScore).toBe(Math.round(json.analysis.consistency * 100))
  53  |   expect(downloads.png.subarray(1, 4).toString()).toBe('PNG')
  54  |   const width = downloads.png.readUInt32BE(16)
  55  |   const height = downloads.png.readUInt32BE(20)
  56  |   const expectedPages = Math.ceil(height / Math.floor(width * 277 / 190))
  57  |   expect(expectedPages).toBeGreaterThan(1)
  58  |   const pageCount = [...downloads.pdf.toString('latin1').matchAll(/\/Type \/Page\b/g)].length
  59  |   expect(pageCount).toBe(expectedPages)
  60  |   await page.screenshot({ path: testInfo.outputPath('blueprint-display.png'), fullPage: true })
  61  | })
  62  | 
  63  | for (const width of [768, 1440]) {
  64  |   test(`NR-M21/M27 shared deck survives direct navigation and back at ${width}px`, async ({ page }, testInfo) => {
  65  |     await page.setViewportSize({ width, height: 1000 })
  66  |     await page.addInitScript(() => {
  67  |       Object.defineProperty(navigator, 'clipboard', { value: { writeText: async value => { window.__sharedLink = value } } })
  68  |     })
  69  |     await analyze(page)
  70  |     await page.getByTestId('tab-manabase').click()
  71  |     await page.getByRole('button', { name: 'Copy shareable link to this manabase analysis', exact: true }).click()
  72  |     const url = await page.evaluate(() => window.__sharedLink)
  73  |     expect(new URL(url).hash).toContain('d=')
  74  |     expect(new URL(url).search).toBe('')
  75  |     await page.goto('/library')
  76  |     await page.goBack()
  77  |     await page.goto(url)
  78  |     await expect(page.getByPlaceholder(/paste your decklist/i)).toHaveValue('24 Mountain\n36 Lightning Bolt')
  79  |     await page.reload()
  80  |     await expect(page.getByPlaceholder(/paste your decklist/i)).toHaveValue('24 Mountain\n36 Lightning Bolt')
  81  |     await page.getByRole('button', { name: /analyze manabase/i }).click()
  82  |     await expect(page.getByTestId('analysis-results')).toBeVisible()
  83  |     await page.getByTestId('tab-manabase').click()
  84  |     await expect(page.getByRole('tab', { name: 'Full Deck List', exact: true })).toBeVisible()
  85  |     expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
  86  |     await page.screenshot({ path: testInfo.outputPath(`manabase-${width}.png`) })
  87  |   })
  88  | }
  89  | 
  90  | test('NR-M02 actual Try Example resolves all twenty public card names and saves sixty cards', async ({ page }) => {
  91  |   const { default: sampleCards } = await import('../../fixtures/scryfall-sample-audit.json', { with: { type: 'json' } })
  92  |   await page.route('https://api.scryfall.com/**', async route => {
  93  |     if (route.request().url().includes('/cards/collection')) {
  94  |       const names = route.request().postDataJSON().identifiers.map(c => c.name)
  95  |       await route.fulfill({ json: { object: 'list', data: sampleCards.filter(c => names.includes(c.name)) } })
  96  |     } else await route.fallback()
  97  |   })
  98  |   await page.goto('/analyzer')
  99  |   await expect(page.getByRole('button', { name: /analyze manabase/i })).toBeDisabled()
  100 |   await page.getByRole('button', { name: 'Try Example', exact: true }).click()
  101 |   await expect(page.getByPlaceholder(/paste your decklist/i)).toHaveValue(/4 Llanowar Elves/)
  102 |   await page.getByRole('button', { name: /analyze manabase/i }).click()
  103 |   await expect(page.getByTestId('analysis-results')).toBeVisible()
  104 |   const record = await page.evaluate(() => JSON.parse(localStorage.getItem('manatuner_analyses'))[0])
  105 |   expect(record.analysis.totalCards).toBe(60)
  106 |   expect(record.analysis.cards).toHaveLength(20)
  107 |   expect(record.deckName).toBe("Nature's Rhythm (Midrange Combo)")
  108 | })
  109 | 
  110 | test('NR-M24 global metadata outage reports an error and the same deck can be retried', async ({ page }) => {
  111 |   const outage = async route => route.fulfill({ status: 503, json: { object: 'error', code: 'unavailable' } })
  112 |   await page.route('https://api.scryfall.com/**', outage)
  113 |   await page.goto('/analyzer')
  114 |   await page.getByPlaceholder(/paste your decklist/i).fill('24 Mountain\n36 Lightning Bolt')
  115 |   await page.getByRole('button', { name: /analyze manabase/i }).click()
> 116 |   await expect(page.getByRole('alert').filter({ hasText: /Failed to analyze deck/ })).toBeVisible()
      |                                                                                       ^ Error: expect(locator).toBeVisible() failed
  117 |   await expect(page.getByTestId('analysis-results')).toHaveCount(0)
  118 |   await page.unroute('https://api.scryfall.com/**', outage)
  119 |   await page.getByRole('button', { name: /analyze manabase/i }).click()
  120 |   await expect(page.getByTestId('analysis-results')).toBeVisible()
  121 |   expect(await page.evaluate(() => JSON.parse(localStorage.getItem('manatuner_analyses')).length)).toBe(1)
  122 | })
  123 | 
```