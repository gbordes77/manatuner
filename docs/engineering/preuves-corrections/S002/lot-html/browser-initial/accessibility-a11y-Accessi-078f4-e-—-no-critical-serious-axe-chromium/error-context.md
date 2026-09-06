# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: accessibility/a11y.spec.js >> Accessibility smoke (EN) >> Analyzer after Try Example — no critical/serious axe
- Location: tests/e2e/accessibility/a11y.spec.js:34:7

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByTestId('analysis-results')
Expected: visible
Timeout: 60000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" getByTestId('analysis-results') with timeout 60000ms
  - waiting for getByTestId('analysis-results')

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
  - heading "ManaTuner" [level=1]
  - heading "Analyze your manabase with proven mathematical precision" [level=6]
  - text: Castability Mulligan Sim Karsten Math
  - heading "Your Deck" [level=5]
  - text: Deck Name (optional)
  - textbox "Deck Name (optional)":
    - /placeholder: e.g. Rakdos Midrange, Mono-Red Aggro...
    - text: Nature's Rhythm (Midrange Combo)
  - text: Deck List
  - textbox "Paste your decklist in MTGA, Moxfield, Archidekt, or plain text format. Each line should be quantity followed by card name, e.g. \"4 Lightning Bolt\".":
    - /placeholder: "Paste your decklist here...\nFormat: 4 Lightning Bolt\n3 Counterspell\n..."
    - text: 4 Llanowar Elves (FDN) 227 4 Gene Pollinator (EOE) 186 4 Spider Manifestation (SPM) 148 4 Badgermole Cub (TLA) 167 4 Nature's Rhythm (TDM) 150 4 Ouroboroid (EOE) 201 4 Brightglass Gearhulk (DFT) 191 2 Archdruid's Charm (MKM) 151 1 Craterhoof Behemoth (TDM) 138 1 Insidious Fungus (DSK) 186 1 Nurturing Pixie (OTJ) 20 1 Meltstrider's Resolve (EOE) 199 2 Seam Rip (EOE) 34 1 Soul-Guide Lantern (EOC) 143 3 Abandoned Air Temple (TLA) 263 4 Hushwood Verge (DSK) 261 4 Temple Garden (ECL) 268 2 Multiversal Passage (SPM) 180 2 Plains (FDN) 295 8 Forest (FDN) 291
  - paragraph: "Supported: MTGA, Moxfield, Archidekt, MTGGoldfish. Sideboard auto-detected."
  - button "Analyze Manabase"
  - button "Clear"
  - button "Try Example"
  - heading "Paste a decklist and hit Analyze." [level=6]:
    - text: Paste a decklist and hit
    - strong: Analyze
    - text: .
  - text: Castability Mulligan Manabase
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
  1   | /**
  2   |  * Accessibility smoke (EN UI) — WCAG-oriented axe scans + keyboard basics.
  3   |  * Replaces stale FR selectors that broke after the English product copy ship.
  4   |  */
  5   | import { test, expect } from '../../fixtures/audit-browser.js'
  6   | import AxeBuilder from '@axe-core/playwright'
  7   | 
  8   | test.describe('Accessibility smoke (EN)', () => {
  9   |   test.beforeEach(async ({ page }) => {
  10  |     await page.addInitScript(() => {
  11  |       window.localStorage.setItem('manatuner-onboarding-completed', 'true')
  12  |     })
  13  |   })
  14  | 
  15  |   test('Home page — axe critical/serious clear', async ({ page }) => {
  16  |     await page.goto('/')
  17  |     const results = await new AxeBuilder({ page })
  18  |       .withTags(['wcag2a', 'wcag2aa'])
  19  |       .analyze()
  20  |     const critical = results.violations.filter((v) => v.impact === 'critical' || v.impact === 'serious')
  21  |     expect(critical, JSON.stringify(critical, null, 2)).toEqual([])
  22  |   })
  23  | 
  24  |   test('Analyzer empty — axe critical/serious clear', async ({ page }) => {
  25  |     await page.goto('/analyzer')
  26  |     await expect(page.getByRole('button', { name: /try example|analyze/i }).first()).toBeVisible({
  27  |       timeout: 15000,
  28  |     })
  29  |     const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze()
  30  |     const critical = results.violations.filter((v) => v.impact === 'critical' || v.impact === 'serious')
  31  |     expect(critical, JSON.stringify(critical, null, 2)).toEqual([])
  32  |   })
  33  | 
  34  |   test('Analyzer after Try Example — no critical/serious axe', async ({ page }) => {
  35  |     test.setTimeout(90000)
  36  |     await page.goto('/analyzer')
  37  |     await page.getByRole('button', { name: /try example/i }).click()
  38  |     await page.getByRole('button', { name: /analyze manabase|analyze/i }).first().click()
> 39  |     await expect(page.getByTestId('analysis-results')).toBeVisible({ timeout: 60000 })
      |                                                        ^ Error: expect(locator).toBeVisible() failed
  40  | 
  41  |     const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze()
  42  |     const critical = results.violations.filter((v) => v.impact === 'critical' || v.impact === 'serious')
  43  |     expect(critical, JSON.stringify(critical, null, 2)).toEqual([])
  44  |   })
  45  | 
  46  |   test('Analyzer navigation is unique in the active desktop or mobile menu', async ({ page }) => {
  47  |     await page.goto('/')
  48  |     const menu = page.getByRole('button', { name: 'Open navigation menu' })
  49  |     await expect(menu.or(page.getByRole('banner').getByRole('link', { name: 'Analyzer', exact: true }))).toBeVisible()
  50  |     const mobile = await menu.isVisible()
  51  |     if (mobile) await menu.click()
  52  |     const bannerAnalyzer = mobile
  53  |       ? page.getByRole('button', { name: 'Analyzer', exact: true })
  54  |       : page.getByRole('banner').getByRole('link', { name: /^Analyzer$/i })
  55  |     await expect(bannerAnalyzer).toHaveCount(1)
  56  |     await bannerAnalyzer.click()
  57  |     await expect(page).toHaveURL(/\/analyzer/)
  58  |   })
  59  | 
  60  |   test('Keyboard: tab reaches primary actions on home', async ({ page }) => {
  61  |     await page.goto('/')
  62  |     await page.keyboard.press('Tab')
  63  |     // After a few tabs something focusable should be active
  64  |     for (let i = 0; i < 8; i++) {
  65  |       await page.keyboard.press('Tab')
  66  |     }
  67  |     const tag = await page.evaluate(() => document.activeElement?.tagName ?? '')
  68  |     expect(['A', 'BUTTON', 'INPUT', 'TEXTAREA', 'SELECT']).toContain(tag)
  69  |   })
  70  | 
  71  |   test('Footer contrast text is readable (grey.800 / grey.300)', async ({ page }) => {
  72  |     await page.goto('/')
  73  |     const footer = page.locator('footer')
  74  |     await expect(footer).toBeVisible()
  75  |     await expect(footer.getByText(/Fan Content Policy/i)).toBeVisible()
  76  |     const results = await new AxeBuilder({ page }).include('footer').withRules(['color-contrast']).analyze()
  77  |     expect(results.violations, JSON.stringify(results.violations, null, 2)).toEqual([])
  78  |   })
  79  | 
  80  |   test('Home hero shows product preview (P2-2)', async ({ page }) => {
  81  |     await page.goto('/')
  82  |     await expect(page.getByTestId('hero-product-preview')).toBeVisible()
  83  |     await expect(page.getByTestId('hero-product-preview')).toContainText(/Health Score/i)
  84  |   })
  85  | 
  86  |   test('Analyzer primary buttons use text + icons (no emoji-only)', async ({ page }) => {
  87  |     await page.goto('/analyzer')
  88  |     const tryExample = page.getByRole('button', { name: /try example/i })
  89  |     await expect(tryExample).toBeVisible({ timeout: 15000 })
  90  |     const label = (await tryExample.innerText()).replace(/\s+/g, ' ').trim()
  91  |     expect(label).toMatch(/Try Example/i)
  92  |     // Emoji-only would be short / symbol-heavy; require latin letters
  93  |     expect(label).toMatch(/[A-Za-z]{3,}/)
  94  |   })
  95  | 
  96  |   test('After analyze, focus lands on Health Score verdict (P2-11)', async ({ page }) => {
  97  |     test.setTimeout(90000)
  98  |     await page.goto('/analyzer')
  99  |     await page.getByRole('button', { name: /try example/i }).click()
  100 |     await page.getByRole('button', { name: /analyze manabase|analyze/i }).first().click()
  101 |     await expect(page.getByTestId('quick-verdict')).toBeVisible({ timeout: 60000 })
  102 |     // Focus should move to verdict region for keyboard users
  103 |     await expect
  104 |       .poll(async () => page.evaluate(() => document.activeElement?.id || ''), { timeout: 5000 })
  105 |       .toBe('quick-verdict')
  106 |     await expect(page.getByTestId('quick-verdict')).toHaveAttribute('aria-live', 'polite')
  107 |   })
  108 | })
  109 | 
```