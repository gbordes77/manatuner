# ManaTuner — Brandbook

**Edition 2.7 · Mirror of manatuner.app production state · 2026-05-15**

This edition is a **descriptive snapshot**, not a target spec. It documents the design system as it currently ships on `https://manatuner.app`. Values were extracted from `src/theme/index.ts`, `src/styles/index.css`, `src/pages/HomePage.tsx`, `src/components/layout/Header.tsx`, and `index.html`.

A rendered companion lives at [`./design-system.html`](./design-system.html) — open it in a browser to see the system applied. A printable A4 poster is at [`./brand-book-a4.html`](./brand-book-a4.html) (PDF: [`./brand-book-a4.pdf`](./brand-book-a4.pdf)).

---

## 1. Overview

ManaTuner is a Magic: The Gathering manabase calculator. The visible interface today combines a Material-UI v5 component layer with a parallel CSS variables layer.

**Themes — light is the only one users see.** Both `lightTheme` and `darkTheme` are defined in `src/theme/index.ts` and the dark theme is wired to the `ThemeProvider` in `src/components/common/NotificationProvider.tsx:92`. However, **no UI control calls `toggleTheme()` in production** — the toggle exists in the context API but no button, switch, or shortcut activates it. `isDark` defaults to `false` and stays `false`. The dark tokens are documented in this brandbook because they live in the codebase, but the visual production experience is **light-only**.

**Stack as deployed:**

- React 18 + TypeScript + Vite
- Material-UI v5 (`@mui/material` + `@mui/icons-material`)
- `lucide-react` for non-mana icons
- `mana-font@1.18.0` for mana symbols (CDN, SRI-pinned)
- No Tailwind (no `tailwind.config.*` in repo, no `tailwind` in `package.json`)

**Three coexisting palette layers:**

The codebase maintains three different palette declarations that coexist at runtime:

1. **MUI palette** — `palette.mana.*` and the standard MUI palette tokens.
2. **`.mana-symbol` CSS classes** — fallback mana glyphs in `src/styles/index.css:30-86`. Hexes drift slightly from the MUI palette (e.g. `.mana-w` is `#fffbd5`, MUI mana white is `#F8F6D8`).
3. **`--mtg-*` CSS variables** — a third set in `src/styles/index.css:462-484` used by ad-hoc components.

This brandbook documents all three rather than reconciling them.

---

## 2. Colour system

### Mana — light theme (MUI `palette.mana`)

| Colour     | Hex       | MUI key                   |
| ---------- | --------- | ------------------------- |
| White      | `#F8F6D8` | `palette.mana.white`      |
| Blue       | `#0E68AB` | `palette.mana.blue`       |
| Black      | `#150B00` | `palette.mana.black`      |
| Red        | `#D3202A` | `palette.mana.red`        |
| Green      | `#00733E` | `palette.mana.green`      |
| Colorless  | `#CBC5C0` | `palette.mana.colorless`  |
| Multicolor | `#E9B54C` | `palette.mana.multicolor` |

Glow rgba variants (`whiteGlow`, `blueGlow`, `blackGlow`, `redGlow`, `greenGlow`) at α=0.6 are exposed on the same object for hover/animation effects.

### Mana — dark theme (defined in code, not active in production)

| Colour     | Hex (dark) |
| ---------- | ---------- |
| White      | `#F5F0D0`  |
| Blue       | `#4A9EE8`  |
| Black      | `#3D3D3D`  |
| Red        | `#FF5252`  |
| Green      | `#4CAF50`  |
| Colorless  | `#9E9E9E`  |
| Multicolor | `#FFD700`  |

Dark-theme glow variants drop to α=0.5.

### Brand · primary + secondary

| Token                       | Hex (light) | Hex (dark) |
| --------------------------- | ----------- | ---------- |
| `palette.primary.main`      | `#1565C0`   | `#64B5F6`  |
| `palette.primary.light`     | `#42A5F5`   | `#90CAF9`  |
| `palette.primary.dark`      | `#0D47A1`   | `#42A5F5`  |
| `palette.secondary.main`    | `#7B1FA2`   | `#CE93D8`  |
| `palette.secondary.light`   | `#BA68C8`   | `#E1BEE7`  |
| `palette.secondary.dark`    | `#4A148C`   | `#BA68C8`  |
| `<meta name="theme-color">` | `#1976d2`   | `#0D0D0F`  |
| Focus-visible outline       | `#1976d2`   | `#1976d2`  |

Note that `#1976d2` (focus, theme-color, critical-CSS loading text) is a fourth blue, distinct from `palette.primary.main` `#1565C0`.

### Surfaces & ink — light

| Token                        | Value     |
| ---------------------------- | --------- |
| `palette.background.default` | `#F5F3EE` |
| `palette.background.paper`   | `#FFFFFF` |
| Raw `body` background-color  | `#fafafa` |
| `palette.text.primary`       | `#1A1A1A` |
| `palette.text.secondary`     | `#555555` |

The raw `#fafafa` is set in `src/styles/index.css:20` and is briefly visible before MUI's `CssBaseline` overwrites `body` with `#F5F3EE`. The visible ground at steady state is the parchment.

### Surfaces & ink — dark

| Token                        | Value     |
| ---------------------------- | --------- |
| `palette.background.default` | `#0D0D0F` |
| `palette.background.paper`   | `#1A1A1E` |
| `palette.text.primary`       | `#F5F5F5` |
| `palette.text.secondary`     | `#AAAAAA` |

### Glass

| Token             | Light                   | Dark                     |
| ----------------- | ----------------------- | ------------------------ |
| `glass.primary`   | `rgba(255,255,255,0.8)` | `rgba(255,255,255,0.05)` |
| `glass.secondary` | `rgba(255,255,255,0.6)` | `rgba(255,255,255,0.02)` |
| `glass.border`    | `rgba(255,255,255,0.2)` | `rgba(255,255,255,0.10)` |

Used by `MuiAppBar` (`backdrop-filter: blur(10px)`) and the dark `MuiCard` override.

### `--mtg-*` CSS variables (third palette)

Defined in `src/styles/index.css:462-484`. Includes light/dark variants for each colour (`--mtg-blue-light`, `--mtg-blue-dark`, …) plus `--mtg-gold #DAA520`, `--mtg-silver #C0C0C0`, `--mtg-bronze #CD7F32`. Used by ad-hoc components that don't read the MUI palette.

---

## 3. Gradients

| Name                     | Value                                                                                      | Source                 |
| ------------------------ | ------------------------------------------------------------------------------------------ | ---------------------- |
| Hero WUBRG (homepage H1) | `linear-gradient(135deg, #E9B54C 0%, #0E68AB 25%, #9c27b0 50%, #D3202A 75%, #00733E 100%)` | `HomePage.tsx:230-235` |
| CTA Knowledge (Library)  | `linear-gradient(135deg, #0E68AB 0%, #6A1B9A 100%)`                                        | `Header.tsx:211`       |
| CTA Knowledge hover      | `linear-gradient(135deg, #1976D2 0%, #7B1FA2 100%)`                                        | `Header.tsx:220`       |
| `--bg-primary`           | `linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)`                                        | `index.css:487`        |
| `--bg-secondary`         | `linear-gradient(135deg, #667eea 0%, #764ba2 100%)`                                        | `index.css:488`        |
| `--bg-card`              | `linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)`                                        | `index.css:489`        |
| `.gradient-text`         | `linear-gradient(45deg, #667eea, #764ba2)`                                                 | `index.css:363`        |
| `.loading-skeleton`      | `linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)`                            | `index.css:213`        |

The Hero WUBRG uses the multicolor gold `#E9B54C` in place of mana white, and a hardcoded `#9c27b0` in place of mana black — five bands total, four of which are mana colours.

---

## 4. Typography

### Font families

| Layer                       | Cascade                                                              |
| --------------------------- | -------------------------------------------------------------------- |
| MUI `typography.fontFamily` | `"Inter", "Roboto", "Helvetica", "Arial", sans-serif`                |
| MUI heading H1–H4           | `"Cinzel", "Playfair Display", serif`                                |
| Raw `body` font-family      | `'Roboto', -apple-system, BlinkMacSystemFont, 'Segoe UI', …`         |
| `--font-primary`            | `'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif` |
| `--font-heading`            | `'Poppins', 'Inter', sans-serif`                                     |
| `--font-mono`               | `'JetBrains Mono', 'Fira Code', monospace`                           |

### Fonts loaded from the network

| Family    | Weights            | Source                   |
| --------- | ------------------ | ------------------------ |
| Roboto    | 300, 400, 500, 700 | Google Fonts             |
| Cinzel    | 400, 600, 700      | Google Fonts             |
| Mana Font | 1.18.0             | jsdelivr CDN, SRI-pinned |

**Referenced but not loaded:** Inter, Poppins, JetBrains Mono, Fira Code, Playfair Display. Each falls back to the next item in its cascade. Body text resolves to Roboto (the first loaded font in the MUI cascade); `--font-heading` references Poppins → Inter → system sans, none of which are loaded → resolves to system sans.

### Scale (MUI `typography`)

| Variant | Size     | Weight | Family        | Line-height | Letter-spacing |
| ------- | -------- | ------ | ------------- | ----------- | -------------- |
| H1      | 3rem     | 700    | Cinzel        | 1.2         | 0.02em         |
| H2      | 2.5rem   | 600    | Cinzel        | 1.3         | 0.01em         |
| H3      | 2rem     | 600    | Cinzel        | 1.4         | —              |
| H4      | 1.5rem   | 500    | Cinzel        | 1.4         | —              |
| H5      | 1.25rem  | 500    | Inter cascade | 1.5         | —              |
| H6      | 1rem     | 500    | Inter cascade | 1.6         | —              |
| body1   | 1rem     | 400    | Inter cascade | 1.6         | —              |
| body2   | 0.875rem | 400    | Inter cascade | 1.5         | —              |

### Hero override (homepage)

`src/pages/HomePage.tsx:226-227` overrides the H1 variant with:

- `fontWeight: 800`
- `fontSize: { xs: '2.5rem', md: '3.5rem' }`
- WUBRG text-fill gradient

This is the dominant typographic moment on the site.

---

## 5. Layout primitives

### Radii

| Token           | Value  | MUI usage                               |
| --------------- | ------ | --------------------------------------- |
| `--radius-sm`   | 4 px   | —                                       |
| `--radius-md`   | 8 px   | `MuiChip.borderRadius`                  |
| `--radius-lg`   | 12 px  | `MUI shape.borderRadius`, Button, Input |
| `--radius-xl`   | 16 px  | `MuiCard.borderRadius`                  |
| `--radius-full` | 9999px | —                                       |

### Spacing

| Token           | Value   |
| --------------- | ------- |
| `--spacing-xs`  | 0.25rem |
| `--spacing-sm`  | 0.5rem  |
| `--spacing-md`  | 1rem    |
| `--spacing-lg`  | 1.5rem  |
| `--spacing-xl`  | 2rem    |
| `--spacing-2xl` | 3rem    |

### Shadows

| Token                         | Value                                                               | Usage                 |
| ----------------------------- | ------------------------------------------------------------------- | --------------------- |
| `--shadow-sm` … `--shadow-xl` | 0 2px 4px → 0 12px 24px, alpha 0.10 → 0.18                          | utility               |
| Button base                   | `0 4px 12px rgba(0,0,0,0.10)`                                       | `MuiButton.contained` |
| Button hover                  | `0 8px 24px rgba(0,0,0,0.15)`                                       | `MuiButton :hover`    |
| Card hover                    | `0 12px 32px rgba(0,0,0,0.15)` (light) / `0.4` (dark)               | `MuiCard :hover`      |
| Library CTA base              | `0 2px 14px rgba(14,104,171,0.65), 0 0 18px rgba(125,180,255,0.35)` | `Header.tsx:218`      |
| Library CTA hover             | `0 4px 22px rgba(14,104,171,0.85), 0 0 28px rgba(125,180,255,0.65)` | `Header.tsx:222`      |
| Library CTA pulse             | `0 2px 14px rgba(14,104,171,0.9), 0 0 34px rgba(180,120,255,0.8)`   | keyframe 50%          |

---

## 6. Motion

### Transitions

| Token                      | Value                                                     |
| -------------------------- | --------------------------------------------------------- |
| `--transition-fast`        | `0.15s ease-out`                                          |
| `--transition-normal`      | `0.25s ease-out`                                          |
| `--transition-slow`        | `0.35s ease-out`                                          |
| MuiButton root             | `all 0.3s cubic-bezier(0.4, 0, 0.2, 1)`                   |
| MuiCard root               | `all 0.3s cubic-bezier(0.4, 0, 0.2, 1)`                   |
| MuiTextField OutlinedInput | `all 0.2s ease-in-out`                                    |
| Header Library CTA         | `all 0.3s ease`                                           |
| `.card-hover` utility      | `transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out` |

Two easing systems coexist: Material standard (`cubic-bezier(0.4, 0, 0.2, 1)`) on MUI components, `ease-out` / `ease-in-out` / `ease` on CSS variables and utility classes.

### Hover transforms

- Button → `translateY(-2px)`
- Card → `translateY(-4px)`
- Library CTA → `translateY(-1px)`

### Backdrop filters

- `MuiAppBar.root` — `backdrop-filter: blur(10px)`
- `MuiCard` (dark theme) — `backdrop-filter: blur(10px)`

### Keyframes that ship in production

| Name           | Where            | Usage                                   |
| -------------- | ---------------- | --------------------------------------- |
| `libraryPulse` | `Header.tsx:230` | One-shot mount pulse on the Library CTA |
| `loading`      | `index.css:218`  | `.loading-skeleton` background sweep    |
| `fadeIn`       | `index.css:137`  | `.fade-in` utility                      |
| `fadeInUp`     | `index.css:148`  | reserved                                |
| `slideIn`      | `index.css:159`  | `.slide-in` utility                     |
| `slideInLeft`  | `index.css:168`  | reserved                                |
| `scaleIn`      | `index.css:179`  | reserved                                |
| `pulse`        | `index.css:190`  | `.pulse` utility                        |

### Reduced motion

A global `@media (prefers-reduced-motion: reduce)` guard (`src/styles/index.css:452-458`) collapses all animations to `0.01ms`. The Library CTA (`Header.tsx:241-244`) carries an inline override that strips its mount animation and transition under the same media query.

---

## 7. Iconography

| Source                | Usage                                                              |
| --------------------- | ------------------------------------------------------------------ |
| `mana-font@1.18.0`    | All mana symbols (`.ms .ms-cost .ms-w` …). CDN-loaded, SRI-pinned. |
| `@mui/icons-material` | UI icons (search, settings, navigation, …)                         |
| `lucide-react`        | Decorative and content icons; coexists with the MUI set            |

A second mana glyph implementation exists as plain CSS `.mana-symbol` classes (`src/styles/index.css:30-86`) used as fallback in places where mana-font isn't included.

---

## 8. Companion files

| File                 | Role                                                        |
| -------------------- | ----------------------------------------------------------- |
| `tokens.json`        | W3C-DTCG tokens, machine-readable mirror                    |
| `tokens.css`         | CSS custom properties, ready to `@import`                   |
| `tokens.ts`          | TypeScript export                                           |
| `mui-theme.ts`       | MUI `createTheme()` reproduction (light + dark)             |
| `components.css`     | Reference component styles                                  |
| `index.html`         | Minimal showcase                                            |
| `design-system.html` | Full scrollable showcase (colours, typo, components, icons) |
| `brand-book-a4.html` | Printable A4 portrait poster (5 sections)                   |
| `brand-book-a4.pdf`  | Generated PDF of the A4 poster                              |

---

## 9. Edition notes

- **Edition 2.7 — Mirror** is intentionally descriptive. It records what the production build ships today.
- **Both light and dark themes are documented, but only light is active.** Both are exported from `src/theme/index.ts` and the dark theme is wired to the `ThemeProvider`, but no UI control calls the `toggleTheme()` function. `isDark` defaults to `false` and stays `false` in production. The dark theme implementation is incomplete (surface system unfinished, `#150B00` accent readability issues, Safari glass inconsistencies, glow palette failing WCAG AA on body text). Treat the dark tokens as inventory, not as a shipped theme.
- **Three palette layers coexist** (MUI palette, `.mana-symbol` classes, `--mtg-*` variables) and are documented in parallel rather than reconciled.
- **Inter, Poppins, JetBrains Mono are referenced in cascades but not loaded.** Body text effectively resolves to Roboto; `--font-heading` resolves to the system sans-serif.
- **Tailwind is not present.** A previous edition shipped a `tailwind.preset.js`; it has been removed because no Tailwind config exists in the production repo.
- **No noise overlay or grain texture is applied to the parchment ground.** The visible texture is the gradient stack only.
- **Two easing systems coexist** on MUI components (Material standard cubic-bezier) vs. CSS variable utilities (`ease-out` family). Both are reproduced verbatim.

---

_Generated 2026-05-15 from manatuner.app. License: see project root `LICENSE`._
