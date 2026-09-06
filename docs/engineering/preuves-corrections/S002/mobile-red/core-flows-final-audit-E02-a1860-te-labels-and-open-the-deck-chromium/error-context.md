# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: core-flows/final-audit.spec.js >> E02 mobile manabase tabs show their complete labels and open the deck
- Location: tests/e2e/core-flows/final-audit.spec.js:10:5

# Error details

```
Error: expect(received).toBeLessThanOrEqual(expected)

Expected: <= 195.359375
Received:    214.296875
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
            - paragraph [ref=e66]: Your deck has a color access score of 99/100 — excellent; keep almost any 2–4-land opener.
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
            - tab "Manabase - Land breakdown" [active] [selected] [ref=e90] [cursor=pointer]:
              - generic [ref=e93]:
                - generic [ref=e94]: Manabase
                - generic "All colors meet Karsten targets" [ref=e95]: ✓
            - tab "Blueprint - Export analysis as PNG, PDF or JSON" [ref=e96] [cursor=pointer]: Blueprint
          - generic [ref=e100] [cursor=pointer]
        - tabpanel "Manabase - Land breakdown" [ref=e103]:
          - generic [ref=e105]:
            - generic [ref=e106]:
              - tablist [ref=e109]:
                - tab "Lands Analysis" [selected] [ref=e110] [cursor=pointer]
                - tab "Full Deck List" [ref=e113] [cursor=pointer]
              - button "Copy shareable link to this manabase analysis" [ref=e117] [cursor=pointer]: Copy
            - heading "Manabase Analysis" [level=6] [ref=e121]
            - paragraph [ref=e122]: Detailed analysis of your land base and mana production capabilities. Click on any land name to view it on Scryfall.
            - generic [ref=e123]:
              - generic [ref=e125]:
                - generic [ref=e126]:
                  - paragraph [ref=e127]: Land Breakdown
                  - link "Learn about land types and their power ranking" [ref=e128] [cursor=pointer]:
                    - /url: /land-glossary
                - list [ref=e131]:
                  - generic [ref=e132]:
                    - listitem [ref=e133]:
                      - heading "Basic Land (1 types)" [level=6] [ref=e138]
                    - listitem [ref=e139]:
                      - generic [ref=e143] [cursor=pointer]:
                        - generic [ref=e144]: "24"
                        - paragraph [ref=e146]: Mountain
                        - generic [ref=e147]: 🔗
                    - separator [ref=e148]
              - generic [ref=e150]:
                - paragraph [ref=e151]: Mana Production Distribution
                - generic [ref=e157]:
                  - text: "Color Requirements Summary:"
                  - generic [ref=e158]:
                    - generic [ref=e159]: R
                    - generic [ref=e160]: "Red: 24 sources (100.0%)"
              - generic [ref=e162]:
                - paragraph [ref=e163]: Manabase Statistics
                - generic [ref=e164]:
                  - generic [ref=e166]:
                    - heading "24" [level=5] [ref=e167]
                    - text: Total Lands
                  - generic [ref=e169]:
                    - heading "40.0%" [level=5] [ref=e170]
                    - text: Land Ratio
                  - generic [ref=e172]:
                    - heading "1" [level=5] [ref=e173]
                    - text: Spell Colors (Identity)
                  - generic [ref=e175]:
                    - heading "1.0" [level=5] [ref=e176]
                    - text: Average CMC
              - generic [ref=e178]:
                - paragraph [ref=e179]: Fixed Color Sources — Main Deck
                - generic [ref=e180]: "For each fixed color requirement in main-deck spells, we compare how many lands producing that color you have against Frank Karsten's published source guidelines for the strongest requirement in your spells. These assume sufficient lands after mulligans and a target of 89 + mana value percent. Green: you're fine. Orange: a few sources short. Red: well short — you'll miss a lot of casts."
                - generic [ref=e182]:
                  - generic [ref=e183]: R
                  - generic [ref=e184]:
                    - generic [ref=e185]: 24/14 sources
                    - generic [ref=e186]: Target met
            - generic [ref=e187]: This manabase analysis helps you understand your land distribution and mana production capabilities for optimal deck performance.
      - generic [ref=e190]:
        - heading "💾 Your Data" [level=2] [ref=e194]
        - paragraph [ref=e196]: 📱 All your analyses are stored locally in your browser
        - generic [ref=e197]:
          - button [ref=e198] [cursor=pointer]
          - button [ref=e202] [cursor=pointer]
          - button [ref=e206] [cursor=pointer]
          - button [ref=e210] [cursor=pointer]
  - contentinfo [ref=e214]:
    - generic [ref=e216]:
      - generic [ref=e217]:
        - generic [ref=e218]:
          - paragraph [ref=e219]: Crafted with
          - generic [ref=e220]: ❤️
          - paragraph [ref=e221]: for the MTG community
        - paragraph [ref=e222]: © 2025-2026 ManaTuner. Open source under MIT License.
        - generic [ref=e223]:
          - text: ManaTuner is unofficial Fan Content permitted under the
          - link "Fan Content Policy" [ref=e224] [cursor=pointer]:
            - /url: https://company.wizards.com/en/legal/fancontentpolicy
          - text: . Not approved/endorsed by Wizards. Portions of the materials used are property of Wizards of the Coast. ©Wizards of the Coast LLC.
      - generic [ref=e225]:
        - generic [ref=e226]:
          - link "Analyzer" [ref=e227] [cursor=pointer]:
            - /url: /analyzer
          - link "Guide" [ref=e228] [cursor=pointer]:
            - /url: /guide
          - link "Mathematics" [ref=e229] [cursor=pointer]:
            - /url: /mathematics
          - link "Land Glossary" [ref=e230] [cursor=pointer]:
            - /url: /land-glossary
          - link "About" [ref=e231] [cursor=pointer]:
            - /url: /about
          - link "Privacy" [ref=e232] [cursor=pointer]:
            - /url: /privacy
        - generic [ref=e233]:
          - link "Give Feedback" [ref=e234] [cursor=pointer]:
            - /url: https://tally.so/r/A7KRkN
          - separator [ref=e238]
          - link "GitHub" [ref=e239] [cursor=pointer]:
            - /url: https://github.com/gbordes77/manatuner
          - separator [ref=e242]
          - link "Scryfall API" [ref=e243] [cursor=pointer]:
            - /url: https://scryfall.com
          - separator [ref=e244]
          - link "Keyrune Icons" [ref=e245] [cursor=pointer]:
            - /url: https://andrewgioia.github.io/Keyrune/
        - generic [ref=e246]:
          - text: Probability mathematics based on
          - link "Frank Karsten's research" [ref=e247] [cursor=pointer]:
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
> 24 |   expect(bounds.right).toBeLessThanOrEqual(bounds.clipRight)
     |                        ^ Error: expect(received).toBeLessThanOrEqual(expected)
  25 |   await tab.click()
  26 |   await expect(tab).toHaveAttribute('aria-selected', 'true')
  27 |   await expect(page.getByText('36 Lightning Bolt', { exact: false }).first()).toBeVisible()
  28 |   await page.screenshot({ path: testInfo.outputPath('manabase-mobile.png') })
  29 | })
  30 | 
```