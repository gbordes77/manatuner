# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: accessibility/a11y.spec.js >> Accessibility smoke (EN) >> Analyzer empty — axe critical/serious clear
- Location: tests/e2e/accessibility/a11y.spec.js:24:7

# Error details

```
Error: [
  {
    "id": "color-contrast",
    "impact": "serious",
    "tags": [
      "cat.color",
      "wcag2aa",
      "wcag143",
      "TTv5",
      "TT13.c",
      "EN-301-549",
      "EN-9.1.4.3",
      "ACT",
      "RGAAv4",
      "RGAA-3.2.1"
    ],
    "description": "Ensure the contrast between foreground and background colors meets WCAG 2 AA minimum contrast ratio thresholds",
    "help": "Elements must meet minimum color contrast ratio thresholds",
    "helpUrl": "https://dequeuniversity.com/rules/axe/4.11/color-contrast?application=playwright",
    "nodes": [
      {
        "any": [
          {
            "id": "color-contrast",
            "data": {
              "fgColor": "#e65100",
              "bgColor": "#fff3e0",
              "contrastRatio": 3.45,
              "fontSize": "9.8pt (13px)",
              "fontWeight": "normal",
              "messageKey": null,
              "expectedContrastRatio": "4.5:1"
            },
            "relatedNodes": [
              {
                "html": "<div class=\"MuiChip-root MuiChip-filled MuiChip-sizeSmall MuiChip-colorDefault MuiChip-filledDefault css-296x5v\">",
                "target": [
                  ".css-296x5v"
                ]
              }
            ],
            "impact": "serious",
            "message": "Element has insufficient color contrast of 3.45 (foreground color: #e65100, background color: #fff3e0, font size: 9.8pt (13px), font weight: normal). Expected contrast ratio of 4.5:1"
          }
        ],
        "all": [],
        "none": [],
        "impact": "serious",
        "html": "<span class=\"MuiChip-label MuiChip-labelSmall css-tavflp\">Karsten Math</span>",
        "target": [
          ".css-296x5v > .css-tavflp.MuiChip-label.MuiChip-labelSmall"
        ],
        "failureSummary": "Fix any of the following:\n  Element has insufficient color contrast of 3.45 (foreground color: #e65100, background color: #fff3e0, font size: 9.8pt (13px), font weight: normal). Expected contrast ratio of 4.5:1"
      },
      {
        "any": [
          {
            "id": "color-contrast",
            "data": {
              "fgColor": "#ffffff",
              "bgColor": "#3e86bb",
              "contrastRatio": 3.93,
              "fontSize": "9.8pt (13px)",
              "fontWeight": "normal",
              "messageKey": null,
              "expectedContrastRatio": "4.5:1"
            },
            "relatedNodes": [
              {
                "html": "<div class=\"MuiChip-root MuiChip-filled MuiChip-sizeSmall MuiChip-colorDefault MuiChip-filledDefault css-12zxxiy\"><span class=\"MuiChip-label MuiChip-labelSmall css-tavflp\">Castability</span></div>",
                "target": [
                  ".css-12zxxiy"
                ]
              }
            ],
            "impact": "serious",
            "message": "Element has insufficient color contrast of 3.93 (foreground color: #ffffff, background color: #3e86bb, font size: 9.8pt (13px), font weight: normal). Expected contrast ratio of 4.5:1"
          }
        ],
        "all": [],
        "none": [],
        "impact": "serious",
        "html": "<span class=\"MuiChip-label MuiChip-labelSmall css-tavflp\">Castability</span>",
        "target": [
          ".css-12zxxiy > .css-tavflp.MuiChip-label.MuiChip-labelSmall"
        ],
        "failureSummary": "Fix any of the following:\n  Element has insufficient color contrast of 3.93 (foreground color: #ffffff, background color: #3e86bb, font size: 9.8pt (13px), font weight: normal). Expected contrast ratio of 4.5:1"
      },
      {
        "any": [
          {
            "id": "color-contrast",
            "data": {
              "fgColor": "#ffffff",
              "bgColor": "#ba68c8",
              "contrastRatio": 3.55,
              "fontSize": "9.8pt (13px)",
              "fontWeight": "normal",
              "messageKey": null,
              "expectedContrastRatio": "4.5:1"
            },
            "relatedNodes": [
              {
                "html": "<div class=\"MuiChip-root MuiChip-filled MuiChip-sizeSmall MuiChip-colorDefault MuiChip-filledDefault css-1o0k340\"><span class=\"MuiChip-label MuiChip-labelSmall css-tavflp\">Mulligan</span></div>",
                "target": [
                  ".css-1o0k340"
                ]
              }
            ],
            "impact": "serious",
            "message": "Element has insufficient color contrast of 3.55 (foreground color: #ffffff, background color: #ba68c8, font size: 9.8pt (13px), font weight: normal). Expected contrast ratio of 4.5:1"
          }
        ],
        "all": [],
        "none": [],
        "impact": "serious",
        "html": "<span class=\"MuiChip-label MuiChip-labelSmall css-tavflp\">Mulligan</span>",
        "target": [
          ".css-1o0k340 > .css-tavflp.MuiChip-label.MuiChip-labelSmall"
        ],
        "failureSummary": "Fix any of the following:\n  Element has insufficient color contrast of 3.55 (foreground color: #ffffff, background color: #ba68c8, font size: 9.8pt (13px), font weight: normal). Expected contrast ratio of 4.5:1"
      },
      {
        "any": [
          {
            "id": "color-contrast",
            "data": {
              "fgColor": "#ffffff",
              "bgColor": "#338f64",
              "contrastRatio": 3.99,
              "fontSize": "9.8pt (13px)",
              "fontWeight": "normal",
              "messageKey": null,
              "expectedContrastRatio": "4.5:1"
            },
            "relatedNodes": [
              {
                "html": "<div class=\"MuiChip-root MuiChip-filled MuiChip-sizeSmall MuiChip-colorDefault MuiChip-filledDefault css-7ul5w4\"><span class=\"MuiChip-label MuiChip-labelSmall css-tavflp\">Manabase</span></div>",
                "target": [
                  ".css-7ul5w4"
                ]
              }
            ],
            "impact": "serious",
            "message": "Element has insufficient color contrast of 3.99 (foreground color: #ffffff, background color: #338f64, font size: 9.8pt (13px), font weight: normal). Expected contrast ratio of 4.5:1"
          }
        ],
        "all": [],
        "none": [],
        "impact": "serious",
        "html": "<span class=\"MuiChip-label MuiChip-labelSmall css-tavflp\">Manabase</span>",
        "target": [
          ".css-7ul5w4 > .css-tavflp.MuiChip-label.MuiChip-labelSmall"
        ],
        "failureSummary": "Fix any of the following:\n  Element has insufficient color contrast of 3.99 (foreground color: #ffffff, background color: #338f64, font size: 9.8pt (13px), font weight: normal). Expected contrast ratio of 4.5:1"
      }
    ]
  }
]

expect(received).toEqual(expected) // deep equality

- Expected  -   1
+ Received  + 163

- Array []
+ Array [
+   Object {
+     "description": "Ensure the contrast between foreground and background colors meets WCAG 2 AA minimum contrast ratio thresholds",
+     "help": "Elements must meet minimum color contrast ratio thresholds",
+     "helpUrl": "https://dequeuniversity.com/rules/axe/4.11/color-contrast?application=playwright",
+     "id": "color-contrast",
+     "impact": "serious",
+     "nodes": Array [
+       Object {
+         "all": Array [],
+         "any": Array [
+           Object {
+             "data": Object {
+               "bgColor": "#fff3e0",
+               "contrastRatio": 3.45,
+               "expectedContrastRatio": "4.5:1",
+               "fgColor": "#e65100",
+               "fontSize": "9.8pt (13px)",
+               "fontWeight": "normal",
+               "messageKey": null,
+             },
+             "id": "color-contrast",
+             "impact": "serious",
+             "message": "Element has insufficient color contrast of 3.45 (foreground color: #e65100, background color: #fff3e0, font size: 9.8pt (13px), font weight: normal). Expected contrast ratio of 4.5:1",
+             "relatedNodes": Array [
+               Object {
+                 "html": "<div class=\"MuiChip-root MuiChip-filled MuiChip-sizeSmall MuiChip-colorDefault MuiChip-filledDefault css-296x5v\">",
+                 "target": Array [
+                   ".css-296x5v",
+                 ],
+               },
+             ],
+           },
+         ],
+         "failureSummary": "Fix any of the following:
+   Element has insufficient color contrast of 3.45 (foreground color: #e65100, background color: #fff3e0, font size: 9.8pt (13px), font weight: normal). Expected contrast ratio of 4.5:1",
+         "html": "<span class=\"MuiChip-label MuiChip-labelSmall css-tavflp\">Karsten Math</span>",
+         "impact": "serious",
+         "none": Array [],
+         "target": Array [
+           ".css-296x5v > .css-tavflp.MuiChip-label.MuiChip-labelSmall",
+         ],
+       },
+       Object {
+         "all": Array [],
+         "any": Array [
+           Object {
+             "data": Object {
+               "bgColor": "#3e86bb",
+               "contrastRatio": 3.93,
+               "expectedContrastRatio": "4.5:1",
+               "fgColor": "#ffffff",
+               "fontSize": "9.8pt (13px)",
+               "fontWeight": "normal",
+               "messageKey": null,
+             },
+             "id": "color-contrast",
+             "impact": "serious",
+             "message": "Element has insufficient color contrast of 3.93 (foreground color: #ffffff, background color: #3e86bb, font size: 9.8pt (13px), font weight: normal). Expected contrast ratio of 4.5:1",
+             "relatedNodes": Array [
+               Object {
+                 "html": "<div class=\"MuiChip-root MuiChip-filled MuiChip-sizeSmall MuiChip-colorDefault MuiChip-filledDefault css-12zxxiy\"><span class=\"MuiChip-label MuiChip-labelSmall css-tavflp\">Castability</span></div>",
+                 "target": Array [
+                   ".css-12zxxiy",
+                 ],
+               },
+             ],
+           },
+         ],
+         "failureSummary": "Fix any of the following:
+   Element has insufficient color contrast of 3.93 (foreground color: #ffffff, background color: #3e86bb, font size: 9.8pt (13px), font weight: normal). Expected contrast ratio of 4.5:1",
+         "html": "<span class=\"MuiChip-label MuiChip-labelSmall css-tavflp\">Castability</span>",
+         "impact": "serious",
+         "none": Array [],
+         "target": Array [
+           ".css-12zxxiy > .css-tavflp.MuiChip-label.MuiChip-labelSmall",
+         ],
+       },
+       Object {
+         "all": Array [],
+         "any": Array [
+           Object {
+             "data": Object {
+               "bgColor": "#ba68c8",
+               "contrastRatio": 3.55,
+               "expectedContrastRatio": "4.5:1",
+               "fgColor": "#ffffff",
+               "fontSize": "9.8pt (13px)",
+               "fontWeight": "normal",
+               "messageKey": null,
+             },
+             "id": "color-contrast",
+             "impact": "serious",
+             "message": "Element has insufficient color contrast of 3.55 (foreground color: #ffffff, background color: #ba68c8, font size: 9.8pt (13px), font weight: normal). Expected contrast ratio of 4.5:1",
+             "relatedNodes": Array [
+               Object {
+                 "html": "<div class=\"MuiChip-root MuiChip-filled MuiChip-sizeSmall MuiChip-colorDefault MuiChip-filledDefault css-1o0k340\"><span class=\"MuiChip-label MuiChip-labelSmall css-tavflp\">Mulligan</span></div>",
+                 "target": Array [
+                   ".css-1o0k340",
+                 ],
+               },
+             ],
+           },
+         ],
+         "failureSummary": "Fix any of the following:
+   Element has insufficient color contrast of 3.55 (foreground color: #ffffff, background color: #ba68c8, font size: 9.8pt (13px), font weight: normal). Expected contrast ratio of 4.5:1",
+         "html": "<span class=\"MuiChip-label MuiChip-labelSmall css-tavflp\">Mulligan</span>",
+         "impact": "serious",
+         "none": Array [],
+         "target": Array [
+           ".css-1o0k340 > .css-tavflp.MuiChip-label.MuiChip-labelSmall",
+         ],
+       },
+       Object {
+         "all": Array [],
+         "any": Array [
+           Object {
+             "data": Object {
+               "bgColor": "#338f64",
+               "contrastRatio": 3.99,
+               "expectedContrastRatio": "4.5:1",
+               "fgColor": "#ffffff",
+               "fontSize": "9.8pt (13px)",
+               "fontWeight": "normal",
+               "messageKey": null,
+             },
+             "id": "color-contrast",
+             "impact": "serious",
+             "message": "Element has insufficient color contrast of 3.99 (foreground color: #ffffff, background color: #338f64, font size: 9.8pt (13px), font weight: normal). Expected contrast ratio of 4.5:1",
+             "relatedNodes": Array [
+               Object {
+                 "html": "<div class=\"MuiChip-root MuiChip-filled MuiChip-sizeSmall MuiChip-colorDefault MuiChip-filledDefault css-7ul5w4\"><span class=\"MuiChip-label MuiChip-labelSmall css-tavflp\">Manabase</span></div>",
+                 "target": Array [
+                   ".css-7ul5w4",
+                 ],
+               },
+             ],
+           },
+         ],
+         "failureSummary": "Fix any of the following:
+   Element has insufficient color contrast of 3.99 (foreground color: #ffffff, background color: #338f64, font size: 9.8pt (13px), font weight: normal). Expected contrast ratio of 4.5:1",
+         "html": "<span class=\"MuiChip-label MuiChip-labelSmall css-tavflp\">Manabase</span>",
+         "impact": "serious",
+         "none": Array [],
+         "target": Array [
+           ".css-7ul5w4 > .css-tavflp.MuiChip-label.MuiChip-labelSmall",
+         ],
+       },
+     ],
+     "tags": Array [
+       "cat.color",
+       "wcag2aa",
+       "wcag143",
+       "TTv5",
+       "TT13.c",
+       "EN-301-549",
+       "EN-9.1.4.3",
+       "ACT",
+       "RGAAv4",
+       "RGAA-3.2.1",
+     ],
+   },
+ ]
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
      - generic [ref=e29]:
        - link [ref=e30] [cursor=pointer]:
          - /url: /analyzer
        - link [ref=e34] [cursor=pointer]:
          - /url: /my-analyses
        - link [ref=e38] [cursor=pointer]:
          - /url: /library
        - button [ref=e42] [cursor=pointer]
      - link "Feedback" [ref=e49] [cursor=pointer]:
        - /url: https://tally.so/r/A7KRkN
      - link "View source code on GitHub" [ref=e53] [cursor=pointer]:
        - /url: https://github.com/gbordes77/manatuner
  - main [ref=e56]:
    - generic [ref=e57]:
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
      - generic [ref=e58]:
        - heading "ManaTuner" [level=1] [ref=e59]
        - heading "Analyze your manabase with proven mathematical precision" [level=6] [ref=e62]
        - generic [ref=e63]:
          - generic [ref=e64]: Castability
          - generic [ref=e68]: Mulligan Sim
          - generic [ref=e72]: Karsten Math
      - generic [ref=e76]:
        - generic [ref=e78]:
          - heading "Your Deck" [level=5] [ref=e79]
          - generic [ref=e83]:
            - generic [ref=e84]:
              - generic: Deck Name (optional)
              - generic [ref=e85]:
                - textbox "Deck Name (optional)" [ref=e86]:
                  - /placeholder: e.g. Rakdos Midrange, Mono-Red Aggro...
                - group [aria-hidden]:
                  - generic: Deck Name (optional)
            - generic [ref=e87]:
              - generic: Deck List
              - generic [ref=e88]:
                - textbox "Paste your decklist in MTGA, Moxfield, Archidekt, or plain text format. Each line should be quantity followed by card name, e.g. \"4 Lightning Bolt\"." [ref=e89]:
                  - /placeholder: "Paste your decklist here...\nFormat: 4 Lightning Bolt\n3 Counterspell\n..."
                - group [aria-hidden]:
                  - generic: Deck List
              - paragraph [ref=e90]: "Supported: MTGA, Moxfield, Archidekt, MTGGoldfish. Sideboard auto-detected."
            - generic [ref=e91]:
              - button "Analyze Manabase" [disabled]
              - generic [ref=e92]:
                - button [ref=e93] [cursor=pointer]
                - button [ref=e97] [cursor=pointer]
        - generic [ref=e103]:
          - heading [level=6] [ref=e107]:
            - text: Paste a decklist and hit
            - strong [ref=e108]: Analyze
            - text: .
          - generic [ref=e109]:
            - generic [ref=e110]: Castability
            - generic [ref=e112]: Mulligan
            - generic [ref=e114]: Manabase
      - generic [ref=e118]:
        - heading "💾 Your Data" [level=2] [ref=e122]
        - paragraph [ref=e124]: 📱 All your analyses are stored locally in your browser
        - generic [ref=e125]:
          - button [ref=e126] [cursor=pointer]
          - button [ref=e130] [cursor=pointer]
          - button [ref=e134] [cursor=pointer]
          - button [ref=e138] [cursor=pointer]
  - contentinfo [ref=e142]:
    - generic [ref=e144]:
      - generic [ref=e145]:
        - generic [ref=e146]:
          - paragraph [ref=e147]: Crafted with
          - generic [ref=e148]: ❤️
          - paragraph [ref=e149]: for the MTG community
        - paragraph [ref=e150]: © 2025-2026 ManaTuner. Open source under MIT License.
        - generic [ref=e151]:
          - text: ManaTuner is unofficial Fan Content permitted under the
          - link "Fan Content Policy" [ref=e152] [cursor=pointer]:
            - /url: https://company.wizards.com/en/legal/fancontentpolicy
          - text: . Not approved/endorsed by Wizards. Portions of the materials used are property of Wizards of the Coast. ©Wizards of the Coast LLC.
      - generic [ref=e153]:
        - generic [ref=e154]:
          - link "Analyzer" [ref=e155] [cursor=pointer]:
            - /url: /analyzer
          - link "Guide" [ref=e156] [cursor=pointer]:
            - /url: /guide
          - link "Mathematics" [ref=e157] [cursor=pointer]:
            - /url: /mathematics
          - link "Land Glossary" [ref=e158] [cursor=pointer]:
            - /url: /land-glossary
          - link "About" [ref=e159] [cursor=pointer]:
            - /url: /about
          - link "Privacy" [ref=e160] [cursor=pointer]:
            - /url: /privacy
        - generic [ref=e161]:
          - link "Give Feedback" [ref=e162] [cursor=pointer]:
            - /url: https://tally.so/r/A7KRkN
          - separator [ref=e166]
          - link "GitHub" [ref=e167] [cursor=pointer]:
            - /url: https://github.com/gbordes77/manatuner
          - separator [ref=e170]
          - link "Scryfall API" [ref=e171] [cursor=pointer]:
            - /url: https://scryfall.com
          - separator [ref=e172]
          - link "Keyrune Icons" [ref=e173] [cursor=pointer]:
            - /url: https://andrewgioia.github.io/Keyrune/
        - generic [ref=e174]:
          - text: Probability mathematics based on
          - link "Frank Karsten's research" [ref=e175] [cursor=pointer]:
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
> 31  |     expect(critical, JSON.stringify(critical, null, 2)).toEqual([])
      |                                                         ^ Error: [
  32  |   })
  33  | 
  34  |   test('Analyzer after Try Example — no critical/serious axe', async ({ page }) => {
  35  |     test.setTimeout(90000)
  36  |     await page.goto('/analyzer')
  37  |     await page.getByRole('button', { name: /try example/i }).click()
  38  |     await page.getByRole('button', { name: /analyze manabase|analyze/i }).first().click()
  39  |     await expect(page.getByTestId('analysis-results')).toBeVisible({ timeout: 60000 })
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