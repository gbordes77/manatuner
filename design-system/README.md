# ManaTuner Design System

**Edition 2.7 · Mirror of `manatuner.app` production state · 2026-05-15**

A descriptive snapshot of the design system as it currently ships at `https://manatuner.app`. Values were extracted from `src/theme/index.ts`, `src/styles/index.css`, `src/pages/HomePage.tsx`, `src/components/layout/Header.tsx`, and `index.html`. This is **not** a target spec.

## What's in here

| File                 | Purpose                                                     |
| -------------------- | ----------------------------------------------------------- |
| `BRANDBOOK.md`       | Prose source of truth — the design system explained         |
| `tokens.json`        | W3C-DTCG design tokens, machine-readable                    |
| `tokens.css`         | CSS custom properties, ready to `@import`                   |
| `tokens.ts`          | TypeScript export (typed; default = light, named = dark)    |
| `mui-theme.ts`       | MUI `createTheme()` reproduction (both light and dark)      |
| `components.css`     | Reference component styles in plain CSS                     |
| `index.html`         | Minimal landing showcase                                    |
| `design-system.html` | Full scrollable showcase (colours, typo, components, icons) |
| `brand-book-a4.html` | Printable A4 portrait poster (5 sections)                   |
| `brand-book-a4.pdf`  | Pre-rendered PDF of the A4 poster                           |
| `GENERATED.md`       | How to regenerate the PDF and any future build outputs      |

> No `tailwind.preset.js` — Tailwind is not part of the production stack.

## Quick start

### Plain HTML / CSS

```html
<link rel="stylesheet" href="./tokens.css" />
<link rel="stylesheet" href="./components.css" />

<button class="btn btn-contained">Analyze deck</button>
<button class="btn btn-library">Browse the Library</button>
```

### React + MUI

```ts
import { ThemeProvider, CssBaseline } from '@mui/material'
import { lightTheme, darkTheme } from './mui-theme'

<ThemeProvider theme={lightTheme}>
  <CssBaseline />
  {children}
</ThemeProvider>
```

### TypeScript token access

```ts
import tokens, { darkTokens } from './tokens'

const heroGradient = tokens.gradient.heroWubrg
const darkBlue = darkTokens.color.mana.blue
```

## Themes

Two themes ship in production. The light theme is the default. The dark theme is exported as `darkTheme` from `mui-theme.ts` and is wired through a runtime `ThemeContext` in the production app.

In CSS, switch palettes with `[data-theme="dark"]` on the document root.

## Companion to the live site

This package is a **mirror**. If `manatuner.app` changes, regenerate by re-running the audit-and-export workflow: re-read the truth sources, re-derive the tokens, re-emit each file in this folder, then commit at edition `2.8`, `2.9`, etc. The edition number is a sequence, not a roadmap.

## License

See project root `LICENSE`.
