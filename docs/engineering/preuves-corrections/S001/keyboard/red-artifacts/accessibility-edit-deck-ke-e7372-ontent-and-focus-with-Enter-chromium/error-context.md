# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: accessibility/edit-deck-keyboard.spec.js >> Edit Deck restores content and focus with Enter
- Location: tests/e2e/accessibility/edit-deck-keyboard.spec.js:6:7

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: expect(locator).toBeVisible() failed

Locator: getByRole('button', { name: 'Edit Deck', exact: true })
Expected: visible
Error: element(s) not found

Call log:
  - Expect "toBeVisible" getByRole('button', { name: 'Edit Deck', exact: true }) with timeout 30000ms
  - waiting for getByRole('button', { name: 'Edit Deck', exact: true })
  - Test timeout of 30000ms exceeded.

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
  - paragraph: Click to edit your deck or start a new analysis
  - text: ✏️ Edit Deck
  - heading "Analysis Results Share" [level=5]:
    - text: Analysis Results
    - button "Share"
  - status:
    - text: Health Score 99% · Excellent
    - paragraph: Your deck has a color access score of 99/100 — excellent; keep almost any 2–4-land opener.
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
    - text: "Cost: {R} "
    - paragraph: "CMC: 1"
    - progressbar "Estimated mana availability"
    - paragraph: "Mana availability estimate: 98%"
    - text: "Lands only: 98% · Perfect land drops: 100% Source-count heuristic. Lands only. No mulligan or chance of drawing this spell. Source overlap and sequencing are approximated. Source-count estimates use the selected board. Missing metadata and costs outside this model remain unavailable."
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
  3  | const deck = '24 Mountain\n36 Lightning Bolt'
  4  | 
  5  | for (const activation of ['Enter', 'Space', 'pointer']) {
  6  |   test(`Edit Deck restores content and focus with ${activation}`, async ({ page }, testInfo) => {
  7  |     const errors = []
  8  |     page.on('pageerror', error => errors.push(error.message))
  9  |     await page.goto('/analyzer')
  10 |     const editor = page.getByRole('textbox', { name: /Paste your decklist/ })
  11 |     await editor.fill(deck)
  12 |     await page.getByRole('button', { name: 'Analyze Manabase', exact: true }).click()
  13 |     const edit = page.getByRole('button', { name: 'Edit Deck', exact: true })
> 14 |     await expect(edit).toBeVisible({ timeout: 30000 })
     |                        ^ Error: expect(locator).toBeVisible() failed
  15 |     await expect(edit).toHaveAttribute('aria-expanded', 'false')
  16 |     const controlledId = await edit.getAttribute('aria-controls')
  17 |     await expect(page.locator(`[id="${controlledId}"]`)).toBeAttached()
  18 |     // Traverse the real document order rather than programmatically focusing Edit.
  19 |     await page.evaluate(() => document.activeElement?.blur())
  20 |     await page.keyboard.press('Control+Home')
  21 |     for (let i = 0; i < 80; i++) {
  22 |       await page.keyboard.press('Tab')
  23 |       if (await edit.evaluate(element => element === document.activeElement)) break
  24 |     }
  25 |     await expect(edit).toBeFocused()
  26 |     const outline = await edit.evaluate(element => {
  27 |       const style = getComputedStyle(element)
  28 |       return { style: style.outlineStyle, width: style.outlineWidth }
  29 |     })
  30 |     expect(outline.style).not.toBe('none')
  31 |     expect(parseFloat(outline.width)).toBeGreaterThanOrEqual(2)
  32 |     await page.screenshot({ path: testInfo.outputPath('edit-focused.png') })
  33 |     await edit.evaluate(element => {
  34 |       window.__editActivations = 0
  35 |       element.addEventListener('click', () => window.__editActivations++)
  36 |     })
  37 |     if (activation === 'pointer') await edit.click()
  38 |     else await page.keyboard.press(activation)
  39 |     await expect(editor).toBeVisible()
  40 |     await expect(editor).toBeFocused()
  41 |     await expect(editor).toHaveValue(deck)
  42 |     expect(await page.evaluate(() => window.__editActivations)).toBe(1)
  43 |     await editor.press('End')
  44 |     await editor.press('Enter')
  45 |     await editor.press('1')
  46 |     await expect(editor).toHaveValue(`${deck}\n1`)
  47 |     expect(errors).toEqual([])
  48 |   })
  49 | }
  50 | 
```