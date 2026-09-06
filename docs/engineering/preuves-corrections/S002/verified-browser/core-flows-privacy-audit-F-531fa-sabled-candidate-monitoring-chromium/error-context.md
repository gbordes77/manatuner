# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: core-flows/privacy-audit.spec.js >> F12 detailed policy discloses third parties, deletion limits and disabled candidate monitoring
- Location: tests/e2e/core-flows/privacy-audit.spec.js:3:5

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: locator.click: Test timeout of 30000ms exceeded.
Call log:
  - waiting for getByRole('button', { name: 'Info', exact: true })

```

# Page snapshot

```yaml
- generic [ref=f1e3]:
  - link "Skip to main content" [ref=f1e4] [cursor=pointer]:
    - /url: "#main-content"
  - region "Feedback banner" [ref=f1e5]:
    - generic [ref=f1e7]:
      - alert [ref=f1e8]:
        - generic [ref=f1e10]:
          - generic [ref=f1e11]: Help us improve ManaTuner! (dismiss = hide banner; feedback stays in the footer)
          - link "Give feedback — opens Tally form in a new tab" [ref=f1e12] [cursor=pointer]:
            - /url: https://tally.so/r/A7KRkN
            - text: Give Feedback
      - button "Dismiss feedback banner" [ref=f1e16] [cursor=pointer]
  - banner [ref=f1e19]:
    - generic [ref=f1e20]:
      - link "ManaTuner - Back to home" [ref=f1e21] [cursor=pointer]:
        - /url: /
        - generic [ref=f1e22]:
          - generic [aria-hidden] [ref=f1e23]: 
          - generic [aria-hidden] [ref=f1e24]: 
          - generic [aria-hidden] [ref=f1e25]: 
          - generic [aria-hidden] [ref=f1e26]: 
          - generic [aria-hidden] [ref=f1e27]: 
        - generic [ref=f1e28]: ManaTuner
      - generic [ref=f1e29]:
        - link [ref=f1e30] [cursor=pointer]:
          - /url: /analyzer
        - link [ref=f1e34] [cursor=pointer]:
          - /url: /my-analyses
        - link [ref=f1e38] [cursor=pointer]:
          - /url: /library
        - button [ref=f1e42] [cursor=pointer]
      - link "Feedback" [ref=f1e49] [cursor=pointer]:
        - /url: https://tally.so/r/A7KRkN
      - link "View source code on GitHub" [ref=f1e53] [cursor=pointer]:
        - /url: https://github.com/gbordes77/manatuner
  - main [ref=f1e56]:
    - generic [ref=f1e57]:
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
      - generic [ref=f1e59]:
        - heading "My Analyses" [level=1] [ref=f1e60]
        - heading "Your saved deck analyses, stored locally in your browser" [level=6] [ref=f1e63]
      - generic [ref=f1e65]:
        - heading "0 analyses saved" [level=6] [ref=f1e69]
        - generic [ref=f1e70]:
          - button "Compare" [disabled]
          - button "Export" [disabled]
          - button "Clear All" [disabled]
      - generic [ref=f1e72]:
        - heading "No saved analyses yet" [level=6] [ref=f1e75]
        - paragraph [ref=f1e76]: "Analyze a deck and it will appear here automatically (local only — nothing leaves your browser). Or open a sample in one click:"
        - generic [ref=f1e77]:
          - button "Constructed midrange" [ref=f1e78] [cursor=pointer]
          - button "Aggro ramp sample" [ref=f1e79] [cursor=pointer]
          - button "Commander (100c)" [ref=f1e80] [cursor=pointer]
        - button [ref=f1e81] [cursor=pointer]
        - generic [ref=f1e85]: "Tip: use Export / Import JSON here once you have at least one saved analysis."
      - generic [ref=f1e86]:
        - generic [ref=f1e87]: Data stays on your device
        - generic [ref=f1e89]: Nothing sent to servers
        - generic [ref=f1e91]: Full control of your data
  - contentinfo [ref=f1e93]:
    - generic [ref=f1e95]:
      - generic [ref=f1e96]:
        - generic [ref=f1e97]:
          - paragraph [ref=f1e98]: Crafted with
          - generic [ref=f1e99]: ❤️
          - paragraph [ref=f1e100]: for the MTG community
        - paragraph [ref=f1e101]: © 2025-2026 ManaTuner. Open source under MIT License.
        - generic [ref=f1e102]:
          - text: ManaTuner is unofficial Fan Content permitted under the
          - link "Fan Content Policy" [ref=f1e103] [cursor=pointer]:
            - /url: https://company.wizards.com/en/legal/fancontentpolicy
          - text: . Not approved/endorsed by Wizards. Portions of the materials used are property of Wizards of the Coast. ©Wizards of the Coast LLC.
      - generic [ref=f1e104]:
        - generic [ref=f1e105]:
          - link "Analyzer" [ref=f1e106] [cursor=pointer]:
            - /url: /analyzer
          - link "Guide" [ref=f1e107] [cursor=pointer]:
            - /url: /guide
          - link "Mathematics" [ref=f1e108] [cursor=pointer]:
            - /url: /mathematics
          - link "Land Glossary" [ref=f1e109] [cursor=pointer]:
            - /url: /land-glossary
          - link "About" [ref=f1e110] [cursor=pointer]:
            - /url: /about
          - link "Privacy" [ref=f1e111] [cursor=pointer]:
            - /url: /privacy
        - generic [ref=f1e112]:
          - link "Give Feedback" [ref=f1e113] [cursor=pointer]:
            - /url: https://tally.so/r/A7KRkN
          - separator [ref=f1e117]
          - link "GitHub" [ref=f1e118] [cursor=pointer]:
            - /url: https://github.com/gbordes77/manatuner
          - separator [ref=f1e121]
          - link "Scryfall API" [ref=f1e122] [cursor=pointer]:
            - /url: https://scryfall.com
          - separator [ref=f1e123]
          - link "Keyrune Icons" [ref=f1e124] [cursor=pointer]:
            - /url: https://andrewgioia.github.io/Keyrune/
        - generic [ref=f1e125]:
          - text: Probability mathematics based on
          - link "Frank Karsten's research" [ref=f1e126] [cursor=pointer]:
            - /url: https://www.channelfireball.com/articles/how-many-lands-do-you-need-to-consistently-hit-your-land-drops/
```

# Test source

```ts
  1  | import { test, expect } from '../../fixtures/audit-browser.js'
  2  | 
  3  | test('F12 detailed policy discloses third parties, deletion limits and disabled candidate monitoring', async ({ page }) => {
  4  |   const monitoringRequests = []
  5  |   page.on('request', (request) => {
  6  |     if (/sentry\.io|\/api\/\d+\/envelope\//.test(request.url())) monitoringRequests.push(request.url())
  7  |   })
  8  |   await page.goto('/privacy')
  9  |   await expect(page.getByRole('heading', { name: 'Privacy Policy', exact: true })).toBeVisible()
  10 |   await expect(page.getByText(/Card lookups send card names/)).toContainText('api.scryfall.com')
  11 |   await expect(page.getByText(/Google Fonts \(/)).toContainText('jsDelivr')
  12 |   await expect(page.getByText(/Reset requests deletion/)).toContainText('best effort')
  13 |   await expect(page.getByText(/Error monitoring is disabled in this build/)).toBeVisible()
  14 |   await expect(page.getByText(/Before enabling Sentry/)).toBeVisible()
  15 |   await page.goto('/my-analyses')
> 16 |   await page.getByRole('button', { name: 'Info', exact: true }).click()
     |                                                                 ^ Error: locator.click: Test timeout of 30000ms exceeded.
  17 |   const dialog = page.getByRole('dialog')
  18 |   await expect(dialog.getByText(/Sentry error monitoring is disabled/)).toBeVisible()
  19 |   await expect(dialog.getByText(/External services receive connection metadata/)).toBeVisible()
  20 |   await dialog.getByRole('link', { name: 'privacy policy' }).click()
  21 |   await expect(page).toHaveURL(/\/privacy$/)
  22 |   expect(monitoringRequests).toEqual([])
  23 | })
  24 | 
```