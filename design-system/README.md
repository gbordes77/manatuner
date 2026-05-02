# ManaTuner Design System — Portable Export

Self-contained design system extracted from ManaTuner v2.6+. Copy this whole folder into any new project and pick the bridge that matches your stack.

```
design-system/
├── README.md            ← you are here
├── BRANDBOOK.md         ← the rules (read first if adapting)
├── tokens.json          ← W3C Design Tokens — universal source of truth
├── tokens.css           ← CSS custom properties — drop-in for any web stack
├── tokens.ts            ← TypeScript export — for JS/TS apps
├── mui-theme.ts         ← React + MUI bridge (light + dark)
├── tailwind.preset.js   ← Tailwind v3+ preset
└── components.css       ← signature classes (.ds-btn, .ds-card, .mana-symbol, …)
```

---

## Quick start by stack

### Any HTML / Vue / Svelte / vanilla CSS

```html
<link rel="stylesheet" href="/design-system/tokens.css" />
<link rel="stylesheet" href="/design-system/components.css" />
<!-- optional: <link rel="preconnect" href="https://fonts.googleapis.com"> -->
<link
  href="https://fonts.googleapis.com/css2?family=Cinzel:wght@500;600;700&family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono&display=swap"
  rel="stylesheet"
/>
```

Then use tokens directly:

```css
.my-card {
  background: var(--surface-paper);
  border-radius: var(--radius-xl);
  padding: var(--space-lg);
  box-shadow: var(--shadow-md);
}

.my-cta {
  background: var(--gradient-cta-premium);
  color: var(--mana-black);
}
```

Toggle dark mode via `<html data-theme="dark">` or rely on `prefers-color-scheme`.

---

### React + MUI

```ts
// 1. Copy `tokens.ts` and `mui-theme.ts` somewhere in your src
import { ThemeProvider, CssBaseline } from "@mui/material";
import { lightTheme, darkTheme } from "./design-system/mui-theme";

export function App() {
  const isDark = /* your hook */;
  return (
    <ThemeProvider theme={isDark ? darkTheme : lightTheme}>
      <CssBaseline />
      {/* … */}
    </ThemeProvider>
  );
}
```

Optional: also import `tokens.css` + `components.css` if you want the `.ds-*` utility classes alongside MUI components.

---

### React/Next + Tailwind

```js
// tailwind.config.js
import preset from './design-system/tailwind.preset.js'

export default {
  presets: [preset],
  content: ['./src/**/*.{ts,tsx,js,jsx}'],
  // …extend as needed
}
```

```tsx
<button className="bg-cta-premium text-mana-black rounded-lg px-6 py-2.5 font-semibold transition-normal ease-brand hover:-translate-y-0.5 hover:shadow-btn-hover">
  Analyze deck
</button>
```

Dark mode: `<html class="dark">`.

---

### Figma / Tokens Studio / Style Dictionary

Import `tokens.json` directly — it follows the [W3C Design Tokens Format](https://tr.designtokens.org/format/). Compatible with Tokens Studio, Specify, Style Dictionary, and the upcoming Figma Variables sync.

For Style Dictionary:

```js
// build.js
const StyleDictionary = require('style-dictionary')
StyleDictionary.extend({
  source: ['design-system/tokens.json'],
  platforms: {
    /* your targets */
  },
}).buildAllPlatforms()
```

---

## What's in here

| File                 | Format                | Use for                                                                          |
| -------------------- | --------------------- | -------------------------------------------------------------------------------- |
| `tokens.json`        | W3C Design Tokens     | Figma sync, Style Dictionary, Specify, source-of-truth handoff to designers      |
| `tokens.css`         | CSS custom properties | Any web stack, runtime themeable                                                 |
| `tokens.ts`          | TypeScript const      | JS/TS apps without CSS-in-JS opinions                                            |
| `mui-theme.ts`       | MUI `Theme` object    | React + MUI projects                                                             |
| `tailwind.preset.js` | Tailwind preset       | React/Next/Vue + Tailwind                                                        |
| `components.css`     | CSS utility classes   | `.ds-btn`, `.ds-card`, `.mana-symbol`, hero gradient — works alongside any stack |
| `BRANDBOOK.md`       | Markdown              | The rules — palette, CTA hierarchy, do/don'ts                                    |

---

## Fonts

Required Google Fonts:

- **Cinzel** (500, 600, 700) — display headings
- **Inter** (400, 500, 600, 700, 800) — body
- **JetBrains Mono** (regular) — techTerm captions, code

```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link
  href="https://fonts.googleapis.com/css2?family=Cinzel:wght@500;600;700&family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono&display=swap"
  rel="stylesheet"
/>
```

For mana symbols, install [`mana-font`](https://mana.andrewgioia.com):

```bash
npm install mana-font
```

```ts
import 'mana-font/css/mana.css'
// then: <i class="ms ms-cost ms-w" />
```

---

## Versioning

Follow semver on the brand level:

- **MAJOR** — palette change, CTA hierarchy change, breaking token rename
- **MINOR** — new tokens, new components, new gradient
- **PATCH** — value tweaks within a token (e.g. shadow weight)

Update `tokens.json $version` and `BRANDBOOK.md` when you bump.

---

## Adapting for a different product

See `BRANDBOOK.md` § 8. Two paths: keep structure & swap canon, or keep canon & swap framing. The CTA tier rules, motion, and a11y guards survive both.
