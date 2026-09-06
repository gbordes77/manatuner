# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: core-flows/final-audit.spec.js >> V05 blueprint JSON matches results and PNG/PDF retain the whole tall blueprint
- Location: tests/e2e/core-flows/final-audit.spec.js:31:5

# Error details

```
Error: expect(received).toBe(expected) // Object.is equality

Expected: 5
Received: 1
```

# Page snapshot

```yaml
- generic [ref=e3]:
  - link "Skip to main content" [ref=e4] [cursor=pointer]:
    - /url: "#main-content"
  - region "Feedback banner" [ref=e5]:
    - generic [ref=e7]:
      - alert [ref=e8]:
        - generic [ref=e10]:
          - generic [ref=e11]: Help us improve ManaTuner! (dismiss = hide banner; feedback stays in the footer)
          - link "Give feedback — opens Tally form in a new tab" [ref=e12] [cursor=pointer]:
            - /url: https://tally.so/r/A7KRkN
            - text: Give Feedback
      - button "Dismiss feedback banner" [ref=e16] [cursor=pointer]
  - banner [ref=e19]:
    - generic [ref=e20]:
      - link "ManaTuner - Back to home" [ref=e21] [cursor=pointer]:
        - /url: /
        - generic [ref=e22]:
          - generic [aria-hidden] [ref=e23]: 
          - generic [aria-hidden] [ref=e24]: 
          - generic [aria-hidden] [ref=e25]: 
          - generic [aria-hidden] [ref=e26]: 
          - generic [aria-hidden] [ref=e27]: 
        - generic [ref=e28]: ManaTuner
      - link "Give feedback" [ref=e29] [cursor=pointer]:
        - /url: https://tally.so/r/A7KRkN
      - link "View source code on GitHub" [ref=e32] [cursor=pointer]:
        - /url: https://github.com/gbordes77/manatuner
      - button "Open navigation menu" [ref=e35] [cursor=pointer]
  - main [ref=e38]:
    - generic [ref=e39]:
      - generic [aria-hidden]:
        - generic:
          - generic [aria-hidden]: 
        - generic:
          - generic [aria-hidden]: 
        - generic:
          - generic [aria-hidden]: 
        - generic:
          - generic [aria-hidden]: 
        - generic:
          - generic [aria-hidden]: 
        - generic:
          - generic [aria-hidden]: 
        - generic:
          - generic [aria-hidden]: 
      - generic [ref=e40]:
        - generic [ref=e45]:
          - paragraph [ref=e46]: Your Deck
          - paragraph [ref=e47]: 60 cards • 24 lands
        - button "Edit Deck" [ref=e48] [cursor=pointer]
      - generic [ref=e52]:
        - heading [level=6] [ref=e53]:
          - text: Analysis Results
          - button "Share" [ref=e54] [cursor=pointer]
        - status [ref=e58]:
          - generic [ref=e62]:
            - generic [ref=e63]: Health Score 99% · Excellent
            - paragraph [ref=e66]: Your deck has a color access score of 99/100 — excellent; review actual opening hands in the Mulligan tab.
            - generic [ref=e67]:
              - generic [ref=e68]: Top recommendations
              - list [ref=e69]:
                - listitem [ref=e70]:
                  - generic [ref=e71]: 1. 🏃 Very aggressive curve (1.0). Ensure sufficient early mana sources.
        - generic [ref=e73]: Engine v2.7.9 · Karsten tables · hypergeom + ramp K=3 · London mulligan / Bellman
        - generic [ref=e74]:
          - generic [ref=e75] [cursor=pointer]
          - tablist "Analysis results tabs" [ref=e80]:
            - tab "Castability - Spell casting probabilities" [ref=e81] [cursor=pointer]: Castability
            - tab "Analysis - Detailed spell analysis" [ref=e84] [cursor=pointer]: Analysis
            - tab "Mulligan - Hand simulation and strategy" [ref=e87] [cursor=pointer]: Mulligan
            - tab "Manabase - Land breakdown" [ref=e90] [cursor=pointer]:
              - generic [ref=e93]:
                - generic [ref=e94]: Manabase
                - generic "All colors meet Karsten targets" [ref=e95]: ✓
            - tab "Blueprint - Export analysis as PNG, PDF or JSON" [selected] [ref=e96] [cursor=pointer]: Blueprint
        - tabpanel "Blueprint - Export analysis as PNG, PDF or JSON" [ref=e100]:
          - generic [ref=e102]:
            - group [ref=e104]:
              - button [ref=e105] [cursor=pointer]
            - generic [ref=e109]:
              - generic [ref=e111]:
                - generic [ref=e112]:
                  - text: ◆ MANA BLUEPRINT
                  - heading "Deck 9/6/2026" [level=4] [ref=e113]
                  - generic [ref=e114]:
                    - generic [ref=e115]: Constructed
                    - generic [ref=e117]: 60 cards
                - paragraph [ref=e120]: ManaTuner
              - generic [ref=e121]:
                - text: DECK LIST
                - generic [ref=e122]:
                  - generic [ref=e123]:
                    - paragraph [ref=e124]: LANDS (24)
                    - paragraph [ref=e126]:
                      - generic [ref=e127]: 24x
                      - text: Mountain
                  - generic [ref=e128]:
                    - paragraph [ref=e129]: SPELLS (36)
                    - paragraph [ref=e131]:
                      - generic [ref=e132]: 36x
                      - text: Lightning Bolt
                      - generic [ref=e133]: "({R})"
              - generic [ref=e134]:
                - text: HEURISTIC MANA STABILITY INDEX
                - generic [ref=e135]:
                  - heading "99" [level=2] [ref=e136]
                  - generic [ref=e137]:
                    - generic [ref=e138]:
                      - paragraph [ref=e139]: Excellent
                      - paragraph [ref=e140]: Heuristic turn-two color access; not spell castability
                    - progressbar [ref=e141]
                    - generic [ref=e143]:
                      - paragraph [ref=e144]: UNSTABLE
                      - paragraph [ref=e145]: OPTIMAL
              - generic [ref=e146]:
                - text: HYPERGEOMETRIC PROBABILITY MATRIX
                - generic [ref=e147]:
                  - paragraph [ref=e149]: T1
                  - paragraph [ref=e150]: T2
                  - paragraph [ref=e151]: T3
                  - paragraph [ref=e152]: T4
                - generic [ref=e153]:
                  - generic [ref=e154]:
                    - generic [ref=e155]: 
                    - paragraph [ref=e156]: Red
                  - paragraph [ref=e157]: 98%
                  - paragraph [ref=e158]: 99%
                  - paragraph [ref=e159]: 99%
                  - paragraph [ref=e160]: 100%
              - generic [ref=e161]:
                - generic [ref=e162]:
                  - paragraph [ref=e163]: 🏔️
                  - paragraph [ref=e164]: "24"
                  - paragraph [ref=e165]: Lands
                - generic [ref=e166]:
                  - paragraph [ref=e167]: ⚡
                  - paragraph [ref=e168]: "36"
                  - paragraph [ref=e169]: Spells
                - generic [ref=e170]:
                  - paragraph [ref=e171]: 📊
                  - paragraph [ref=e172]: "1.0"
                  - paragraph [ref=e173]: Avg CMC
                - generic [ref=e174]:
                  - paragraph [ref=e175]: 🎯
                  - paragraph [ref=e176]: 40%
                  - paragraph [ref=e177]: Land %
              - generic [ref=e178]:
                - text: OPENING HAND ANALYSIS
                - generic [ref=e179]:
                  - generic [ref=e180]:
                    - paragraph [ref=e181]: Perfect Hand (2-4 lands + early play)
                    - paragraph [ref=e185]: 77%
                  - generic [ref=e186]:
                    - paragraph [ref=e187]: Good Hand (2-4 lands)
                    - paragraph [ref=e191]: 77%
                  - generic [ref=e192]:
                    - paragraph [ref=e193]: Borderline (1 or 5 lands)
                    - paragraph [ref=e197]: 19%
                  - generic [ref=e198]:
                    - paragraph [ref=e199]: Mulligan (0 or 6+ lands)
                    - paragraph [ref=e203]: 3%
              - generic [ref=e204]:
                - text: 💡 SUGGESTIONS
                - paragraph [ref=e205]: ⚠️ Heuristics only — not mathematical certainties. Your meta and playstyle matter.
                - paragraph [ref=e207]: 🏃 Very aggressive curve (1.0). Ensure sufficient early mana sources.
              - separator [ref=e208]
              - generic [ref=e209]:
                - paragraph [ref=e210]: Generated 9/6/2026 • manatuner.app
                - paragraph [ref=e211]: "#ManaTunerBlueprint"
      - generic [ref=e214]:
        - heading "💾 Your Data" [level=2] [ref=e218]
        - paragraph [ref=e220]: 📱 All your analyses are stored locally in your browser
        - generic [ref=e221]:
          - button [ref=e222] [cursor=pointer]
          - button [ref=e226] [cursor=pointer]
          - button [ref=e230] [cursor=pointer]
          - button [ref=e234] [cursor=pointer]
  - contentinfo [ref=e238]:
    - generic [ref=e240]:
      - generic [ref=e241]:
        - generic [ref=e242]:
          - paragraph [ref=e243]: Crafted with
          - generic [ref=e244]: ❤️
          - paragraph [ref=e245]: for the MTG community
        - paragraph [ref=e246]: © 2025-2026 ManaTuner. Open source under MIT License.
        - generic [ref=e247]:
          - text: ManaTuner is unofficial Fan Content permitted under the
          - link "Fan Content Policy" [ref=e248] [cursor=pointer]:
            - /url: https://company.wizards.com/en/legal/fancontentpolicy
          - text: . Not approved/endorsed by Wizards. Portions of the materials used are property of Wizards of the Coast. ©Wizards of the Coast LLC.
      - generic [ref=e249]:
        - generic [ref=e250]:
          - link "Analyzer" [ref=e251] [cursor=pointer]:
            - /url: /analyzer
          - link "Guide" [ref=e252] [cursor=pointer]:
            - /url: /guide
          - link "Mathematics" [ref=e253] [cursor=pointer]:
            - /url: /mathematics
          - link "Land Glossary" [ref=e254] [cursor=pointer]:
            - /url: /land-glossary
          - link "About" [ref=e255] [cursor=pointer]:
            - /url: /about
          - link "Privacy" [ref=e256] [cursor=pointer]:
            - /url: /privacy
        - generic [ref=e257]:
          - link "Give Feedback" [ref=e258] [cursor=pointer]:
            - /url: https://tally.so/r/A7KRkN
          - separator [ref=e262]
          - link "GitHub" [ref=e263] [cursor=pointer]:
            - /url: https://github.com/gbordes77/manatuner
          - separator [ref=e266]
          - link "Scryfall API" [ref=e267] [cursor=pointer]:
            - /url: https://scryfall.com
          - separator [ref=e268]
          - link "Keyrune Icons" [ref=e269] [cursor=pointer]:
            - /url: https://andrewgioia.github.io/Keyrune/
        - generic [ref=e270]:
          - text: Probability mathematics based on
          - link "Frank Karsten's research" [ref=e271] [cursor=pointer]:
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
  27 |   await expect(page.getByText('Lightning Bolt', { exact: true }).first()).toBeVisible()
  28 |   await page.screenshot({ path: testInfo.outputPath('manabase-mobile.png') })
  29 | })
  30 | 
  31 | test('V05 blueprint JSON matches results and PNG/PDF retain the whole tall blueprint', async ({ page }, testInfo) => {
  32 |   test.setTimeout(90000)
  33 |   await page.setViewportSize({ width: 360, height: 900 })
  34 |   await analyze(page)
  35 |   await page.getByTestId('tab-blueprint').click()
  36 |   const downloads = {}
  37 |   for (const [kind, label] of [['json', 'JSON (Backup)'], ['png', 'PNG (Social Media)'], ['pdf', 'PDF (Documentation)']]) {
  38 |     await page.getByRole('button', { name: 'Export Blueprint', exact: true }).click()
  39 |     const pending = page.waitForEvent('download')
  40 |     await page.getByRole('menuitem', { name: label, exact: true }).click()
  41 |     const download = await pending
  42 |     const path = testInfo.outputPath(`blueprint.${kind}`)
  43 |     await download.saveAs(path)
  44 |     downloads[kind] = await (await import('node:fs/promises')).readFile(path)
  45 |   }
  46 |   const json = JSON.parse(downloads.json)
  47 |   expect(json.analysis.totalCards).toBe(60)
  48 |   expect(json.analysis.totalLands).toBe(24)
  49 |   expect(json.stabilityScore).toBe(Math.round(json.analysis.consistency * 100))
  50 |   expect(downloads.png.subarray(1, 4).toString()).toBe('PNG')
  51 |   const width = downloads.png.readUInt32BE(16)
  52 |   const height = downloads.png.readUInt32BE(20)
  53 |   const expectedPages = Math.ceil(height / Math.floor(width * 277 / 190))
  54 |   expect(expectedPages).toBeGreaterThan(1)
  55 |   const pageCount = [...downloads.pdf.toString('latin1').matchAll(/\/Type \/Page\b/g)].length
> 56 |   expect(pageCount).toBe(expectedPages)
     |                     ^ Error: expect(received).toBe(expected) // Object.is equality
  57 |   await page.screenshot({ path: testInfo.outputPath('blueprint-display.png'), fullPage: true })
  58 | })
  59 | 
```