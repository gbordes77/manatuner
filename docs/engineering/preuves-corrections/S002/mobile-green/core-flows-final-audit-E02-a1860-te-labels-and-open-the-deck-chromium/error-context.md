# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: core-flows/final-audit.spec.js >> E02 mobile manabase tabs show their complete labels and open the deck
- Location: tests/e2e/core-flows/final-audit.spec.js:10:5

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByText('36 Lightning Bolt').first()
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" getByText('36 Lightning Bolt').first() with timeout 5000ms
  - waiting for getByText('36 Lightning Bolt').first()

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
  - link "Give feedback":
    - /url: https://tally.so/r/A7KRkN
  - link "View source code on GitHub":
    - /url: https://github.com/gbordes77/manatuner
  - button "Open navigation menu"
- main:
  - paragraph: Your Deck
  - paragraph: 60 cards • 24 lands
  - button "Edit Deck"
  - heading "Analysis Results Share" [level=6]:
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
    - tab "Castability - Spell casting probabilities": Castability
    - tab "Analysis - Detailed spell analysis": Analysis
    - tab "Mulligan - Hand simulation and strategy": Mulligan
    - tab "Manabase - Land breakdown" [selected]: Manabase ✓
    - tab "Blueprint - Export analysis as PNG, PDF or JSON": Blueprint
  - tabpanel "Manabase - Land breakdown":
    - tablist:
      - tab "Lands Analysis"
      - tab "Full Deck List" [selected]
    - button "Copy shareable link to this manabase analysis": Copy
    - heading "📜 Deck List" [level=6]
    - paragraph: Click on any card name to view it on Scryfall
    - text: "24"
    - paragraph: Mountain
    - text: 🔗 36
    - paragraph: Lightning Bolt
    - text: 🔗
    - paragraph: 🔍 Cards are automatically linked to Scryfall for detailed information and pricing.
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
  1  | import { test, expect } from '../../fixtures/audit-browser.js'
  2  | 
  3  | async function analyze(page) {
  4  |   await page.goto('/analyzer')
  5  |   await page.getByPlaceholder(/paste your decklist/i).fill('24 Mountain\n36 Lightning Bolt')
  6  |   await page.getByRole('button', { name: /analyze manabase/i }).click()
  7  |   await expect(page.getByTestId('analysis-results')).toBeVisible()
  8  | }
  9  | 
  10 | test('E02 mobile manabase tabs show their complete labels and open the deck', async ({ page }, testInfo) => {
  11 |   await page.setViewportSize({ width: 360, height: 900 })
  12 |   await analyze(page)
  13 |   await page.getByTestId('tab-manabase').click()
  14 |   const tab = page.getByRole('tab', { name: 'Full Deck List', exact: true })
  15 |   const bounds = await tab.evaluate(el => {
  16 |     const range = document.createRange()
  17 |     const node = [...el.childNodes].find(n => n.nodeType === Node.TEXT_NODE && n.textContent.includes('Full Deck List'))
  18 |     range.selectNode(node)
  19 |     const text = range.getBoundingClientRect()
  20 |     const scroller = el.closest('.MuiTabs-scroller').getBoundingClientRect()
  21 |     return { left: text.left, right: text.right, clipLeft: scroller.left, clipRight: scroller.right }
  22 |   })
  23 |   expect(bounds.left).toBeGreaterThanOrEqual(bounds.clipLeft)
  24 |   expect(bounds.right).toBeLessThanOrEqual(bounds.clipRight)
  25 |   await tab.click()
  26 |   await expect(tab).toHaveAttribute('aria-selected', 'true')
> 27 |   await expect(page.getByText('36 Lightning Bolt', { exact: false }).first()).toBeVisible()
     |                                                                               ^ Error: expect(locator).toBeVisible() failed
  28 |   await page.screenshot({ path: testInfo.outputPath('manabase-mobile.png') })
  29 | })
  30 | 
```