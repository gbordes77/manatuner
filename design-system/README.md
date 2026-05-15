# ManaTuner Design System

**Edition 2.6 · Light theme · Reference manual**

This folder is the portable, self-contained design system for ManaTuner. It documents the visual & interaction laws and exports them in every format a consumer might need: machine-readable tokens, CSS variables, typed TypeScript, a Material UI theme, a Tailwind preset, reference component styles, and a rendered showcase.

> **Dark theme is intentionally excluded** from this edition. See [`BRANDBOOK.md` §10](./BRANDBOOK.md#10-edition-notes) for the reason and the path forward.

---

## Folder contents

| File                 | Purpose                                                                   |
| -------------------- | ------------------------------------------------------------------------- |
| `BRANDBOOK.md`       | Prose source of truth — voice, laws, rules, don'ts                        |
| `index.html`         | Rendered showcase — open in a browser to see the system applied           |
| `tokens.json`        | Cross-platform design tokens (W3C-DTCG-style, machine-readable)           |
| `tokens.css`         | CSS custom properties — drop-in `:root` variables                         |
| `tokens.ts`          | Typed token export for React/TypeScript code                              |
| `components.css`     | Reference component styles (buttons, cards, chips, ribbon, type, motion)  |
| `mui-theme.ts`       | Material UI `createTheme()` — light only, drops the legacy `darkTheme`    |
| `tailwind.preset.js` | Tailwind preset — extends `colors.mana.*`, fonts, radii, animations, CTAs |
| `README.md`          | This file                                                                 |

---

## Quick start by stack

### Plain HTML / vanilla CSS

```html
<link rel="stylesheet" href="./design-system/tokens.css" />
<link rel="stylesheet" href="./design-system/components.css" />
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link
  href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400..700&family=Inter:wght@300..700&family=JetBrains+Mono:wght@400..700&display=swap"
  rel="stylesheet"
/>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/mana-font@1.15.7/css/mana.min.css" />

<body class="ds-page">
  <button class="ds-btn ds-btn--action">Analyze deck <span class="ds-btn-arrow">→</span></button>
</body>
```

### React + Material UI

```tsx
// main.tsx
import { ThemeProvider, CssBaseline } from '@mui/material'
import { theme } from './design-system/mui-theme'
import './design-system/tokens.css'

export const App = () => (
  <ThemeProvider theme={theme}>
    <CssBaseline />
    {/* … */}
  </ThemeProvider>
)
```

### React + Tailwind

```js
// tailwind.config.js
module.exports = {
  presets: [require('./design-system/tailwind.preset.js')],
  content: ['./src/**/*.{ts,tsx,html}'],
}
```

```tsx
<button className="btn-action px-7 py-3.5 rounded-lg font-body font-semibold shadow-button hover:shadow-button-hover hover:-translate-y-0.5 transition-all duration-base ease-standard">
  Analyze deck →
</button>
```

### TypeScript — typed access

```ts
import { tokens, ctaBackground } from './design-system/tokens'

const hero = {
  fontFamily: tokens.typography.fontFamily.display,
  background: tokens.gradient.heroWubrg,
}

const cta = { background: ctaBackground('premium') }
```

### Style Dictionary / token consumers

`tokens.json` follows the W3C Design Tokens Community Group format conventions (with `value` and `type` fields). It is consumable by Style Dictionary, Tokens Studio, Specify, and similar pipelines for cross-platform export (iOS, Android, Figma).

---

## What's in scope

This edition documents:

- **Mana canon** — the seven authentic Wizards-of-the-Coast colours
- **Three-tier CTA hierarchy** — gold action, blue→purple knowledge, solid brand default
- **Type system** — Cinzel display + Inter body + JetBrains Mono techTerm
- **Surfaces** — parchment ground + paper card, with a subtle SVG noise grain
- **Radii, spacing, shadows** — the layout primitives
- **Motion** — Material standard easing, 4px / 2px hover lifts, `prefers-reduced-motion` guard
- **Iconography** — the `mana-font` package (Andrew Gioia, MIT)
- **Don'ts** — eight constraints learned the hard way

## What's out of scope

- **Dark theme** — pulled from this edition (see BRANDBOOK §10)
- **Marketing illustration set** — handled separately
- **Animated mana-symbol set** — handled separately
- **Product copy / voice & tone guide** — see the main repo `LAUNCH.md` and `mtg-player-personas.md`

---

## Adapting to a different product

The system was designed around the WUBRG canon. To fork it for a non-MTG product, two paths exist:

1. **Keep the structure, swap the canon.** Replace the `mana.*` tokens with 5–7 of your own anchor colours and update `--gradient-hero-wubrg`. Everything else is product-agnostic.
2. **Keep the canon, swap the framing.** If your product is MTG-adjacent (deckbuilders, drafts, EDH), keep the palette but change `--brand-primary` to differentiate. The mana colours then act as content tags rather than chrome.

The CTA tier rules, hover-lift mechanics, easing curve, and accessibility guards survive both moves unchanged.

---

## Versioning

| Edition | Surface | Notes                                                               |
| ------- | ------- | ------------------------------------------------------------------- |
| 2.6     | Light   | Current. Single-surface delivery. Dark intentionally excluded.      |
| 2.5     | Dual    | Last dual-surface edition; archived. Dark surface had known issues. |

Future editions should preserve `tokens.json` as the canonical machine-readable source and treat the other exports as generated derivatives.

---

## Accessibility

- All hover transitions and mount animations collapse to `0.01ms` under `prefers-reduced-motion: reduce`. The guard is replicated in `tokens.css`, `components.css`, and `tailwind.preset.js`. **Do not remove it.**
- The brand primary `#1565C0` on parchment `#F5F3EE` passes WCAG AA at 14pt+; verify with a contrast checker when mixing colours.
- The CTA gold (`#E9B54C → #FFD700`) is used on top of a dark ink (`#5A3E00`) for readable contrast — never invert.

---

## Credits

- **Mana-font** — Andrew Gioia · [mana.andrewgioia.com](https://mana.andrewgioia.com) · MIT
- **Cinzel** — Natanael Gama · SIL Open Font License
- **Inter** — Rasmus Andersson · SIL Open Font License
- **JetBrains Mono** — JetBrains · SIL Open Font License

Maintained by the ManaTuner team. License: see the main repo `LICENSE`.
