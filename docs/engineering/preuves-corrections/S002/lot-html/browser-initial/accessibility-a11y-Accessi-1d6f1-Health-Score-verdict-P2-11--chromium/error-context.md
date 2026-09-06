# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: accessibility/a11y.spec.js >> Accessibility smoke (EN) >> After analyze, focus lands on Health Score verdict (P2-11)
- Location: tests/e2e/accessibility/a11y.spec.js:96:7

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByTestId('quick-verdict')
Expected: visible
Timeout: 60000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" getByTestId('quick-verdict') with timeout 60000ms
  - waiting for getByTestId('quick-verdict')

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
  8   | async function settleAnimations(page) {
  9   |   await page.evaluate(async () => {
  10  |     await document.fonts.ready
  11  |     await Promise.all(document.getAnimations().filter(animation => animation.effect?.getComputedTiming().iterations !== Infinity).map(animation => animation.finished.catch(() => {})))
  12  |   })
  13  | }
  14  | 
  15  | test.describe('Accessibility smoke (EN)', () => {
  16  |   test.use({ reducedMotion: 'reduce' })
  17  |   test.beforeEach(async ({ page }) => {
  18  |     await page.addInitScript(() => {
  19  |       window.localStorage.setItem('manatuner-onboarding-completed', 'true')
  20  |     })
  21  |   })
  22  | 
  23  |   test('Home page — axe critical/serious clear', async ({ page }) => {
  24  |     await page.goto('/')
  25  |     await settleAnimations(page)
  26  |     const results = await new AxeBuilder({ page })
  27  |       .withTags(['wcag2a', 'wcag2aa'])
  28  |       .analyze()
  29  |     const critical = results.violations.filter((v) => v.impact === 'critical' || v.impact === 'serious')
  30  |     expect(critical, JSON.stringify(critical, null, 2)).toEqual([])
  31  |   })
  32  | 
  33  |   test('Analyzer empty — axe critical/serious clear', async ({ page }) => {
  34  |     await page.goto('/analyzer')
  35  |     await expect(page.getByRole('button', { name: /try example|analyze/i }).first()).toBeVisible({
  36  |       timeout: 15000,
  37  |     })
  38  |     await settleAnimations(page)
  39  |     const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze()
  40  |     const critical = results.violations.filter((v) => v.impact === 'critical' || v.impact === 'serious')
  41  |     expect(critical, JSON.stringify(critical, null, 2)).toEqual([])
  42  |   })
  43  | 
  44  |   test('Analyzer after Try Example — no critical/serious axe', async ({ page }) => {
  45  |     test.setTimeout(90000)
  46  |     await page.goto('/analyzer')
  47  |     await page.getByRole('button', { name: /try example/i }).click()
  48  |     await page.getByRole('button', { name: /analyze manabase|analyze/i }).first().click()
  49  |     await expect(page.getByTestId('analysis-results')).toBeVisible({ timeout: 60000 })
  50  | 
  51  |     await settleAnimations(page)
  52  |     const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze()
  53  |     const critical = results.violations.filter((v) => v.impact === 'critical' || v.impact === 'serious')
  54  |     expect(critical, JSON.stringify(critical, null, 2)).toEqual([])
  55  |   })
  56  | 
  57  |   test('Analyzer navigation is unique in the active desktop or mobile menu', async ({ page }) => {
  58  |     await page.goto('/')
  59  |     const menu = page.getByRole('button', { name: 'Open navigation menu' })
  60  |     await expect(menu.or(page.getByRole('banner').getByRole('link', { name: 'Analyzer', exact: true }))).toBeVisible()
  61  |     const mobile = await menu.isVisible()
  62  |     if (mobile) await menu.click()
  63  |     const bannerAnalyzer = mobile
  64  |       ? page.getByRole('button', { name: 'Analyzer', exact: true })
  65  |       : page.getByRole('banner').getByRole('link', { name: /^Analyzer$/i })
  66  |     await expect(bannerAnalyzer).toHaveCount(1)
  67  |     await bannerAnalyzer.click()
  68  |     await expect(page).toHaveURL(/\/analyzer/)
  69  |   })
  70  | 
  71  |   test('Keyboard: tab reaches primary actions on home', async ({ page }) => {
  72  |     await page.goto('/')
  73  |     await page.keyboard.press('Tab')
  74  |     // After a few tabs something focusable should be active
  75  |     for (let i = 0; i < 8; i++) {
  76  |       await page.keyboard.press('Tab')
  77  |     }
  78  |     const tag = await page.evaluate(() => document.activeElement?.tagName ?? '')
  79  |     expect(['A', 'BUTTON', 'INPUT', 'TEXTAREA', 'SELECT']).toContain(tag)
  80  |   })
  81  | 
  82  |   test('Footer contrast text is readable (grey.800 / grey.300)', async ({ page }) => {
  83  |     await page.goto('/')
  84  |     const footer = page.locator('footer')
  85  |     await expect(footer).toBeVisible()
  86  |     await expect(footer.getByText(/Fan Content Policy/i)).toBeVisible()
  87  |     await settleAnimations(page)
  88  |     const results = await new AxeBuilder({ page }).include('footer').withRules(['color-contrast']).analyze()
  89  |     expect(results.violations, JSON.stringify(results.violations, null, 2)).toEqual([])
  90  |   })
  91  | 
  92  |   test('Home hero shows product preview (P2-2)', async ({ page }) => {
  93  |     await page.goto('/')
  94  |     await expect(page.getByTestId('hero-product-preview')).toBeVisible()
  95  |     await expect(page.getByTestId('hero-product-preview')).toContainText(/Health Score/i)
  96  |   })
  97  | 
  98  |   test('Analyzer primary buttons use text + icons (no emoji-only)', async ({ page }) => {
  99  |     await page.goto('/analyzer')
  100 |     const tryExample = page.getByRole('button', { name: /try example/i })
> 101 |     await expect(tryExample).toBeVisible({ timeout: 15000 })
      |                                                     ^ Error: expect(locator).toBeVisible() failed
  102 |     const label = (await tryExample.innerText()).replace(/\s+/g, ' ').trim()
  103 |     expect(label).toMatch(/Try Example/i)
  104 |     // Emoji-only would be short / symbol-heavy; require latin letters
  105 |     expect(label).toMatch(/[A-Za-z]{3,}/)
  106 |   })
  107 | 
  108 |   test('After analyze, focus lands on Health Score verdict (P2-11)', async ({ page }) => {
  109 |     test.setTimeout(90000)
  110 |     await page.goto('/analyzer')
  111 |     await page.getByRole('button', { name: /try example/i }).click()
  112 |     await page.getByRole('button', { name: /analyze manabase|analyze/i }).first().click()
  113 |     await expect(page.getByTestId('quick-verdict')).toBeVisible({ timeout: 60000 })
  114 |     // Focus should move to verdict region for keyboard users
  115 |     await expect
  116 |       .poll(async () => page.evaluate(() => document.activeElement?.id || ''), { timeout: 5000 })
  117 |       .toBe('quick-verdict')
  118 |     await expect(page.getByTestId('quick-verdict')).toHaveAttribute('aria-live', 'polite')
  119 |   })
  120 | })
  121 | 
```