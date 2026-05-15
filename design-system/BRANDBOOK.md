# ManaTuner — Brandbook

**Edition 2.6 · Light theme · Reference manual**

The visual & interaction laws of ManaTuner. This edition documents the light theme only. The dark theme is deliberately excluded from this revision and will be re-cut once its surface system has been rebuilt from the ground up.

A rendered companion lives at [`./index.html`](./index.html) — open it in a browser to see the system applied.

---

## 1. Brand voice

ManaTuner is **competitive Magic the Gathering, technical, generous**. Three rules govern the visual language:

1. **Authenticity over decoration.** The mana palette is the canonical Wizards colour set (Plains warm cream, Island deep blue, Swamp near-black, Mountain vivid red, Forest forest green). Never pastel-ize. Never desaturate. They are signal, not flair.
2. **Knowledge as premium.** The Library uses gradients normally reserved for high-tier products. Math content carries its own visual weight — small monospace techTerm captions credit Karsten, Bellman, Frank Karsten's tables instead of corporate jargon.
3. **Quiet UI for a loud subject.** The chrome stays sober (Inter body, Cinzel headings, parchment surfaces). The mana symbols and the WUBRG hero gradient do the talking.

**Avoid:** generic SaaS purple-blue gradients on white, stock illustration, decorative badges. The card art is the moodboard.

---

## 2. Colour system

### Mana — canon (never change)

| Colour     | Hex       | Use                                                                                            |
| ---------- | --------- | ---------------------------------------------------------------------------------------------- |
| White      | `#F8F6D8` | Plains accents, info-light backgrounds                                                         |
| Blue       | `#0E68AB` | Primary brand. Knowledge CTA. Info chips.                                                      |
| Black      | `#150B00` | Body text. **Do not use as accent on surfaces darker than parchment** — readability collapses. |
| Red        | `#D3202A` | Error, destructive, attention                                                                  |
| Green      | `#00733E` | Success, validated state                                                                       |
| Colorless  | `#CBC5C0` | Disabled, neutral                                                                              |
| Multicolor | `#E9B54C` | **Premium gold — single primary CTA per page**                                                 |

### Surfaces & ink (light)

| Token         | Hex                  | Use                                 |
| ------------- | -------------------- | ----------------------------------- |
| `--bg`        | `#F5F3EE`            | Parchment background, page ground   |
| `--bg-deep`   | `#EDE9E0`            | Inset wells, token-line backgrounds |
| `--paper`     | `#FFFFFF`            | Card surface, raised content        |
| `--ink`       | `#1A1A1A`            | Body text                           |
| `--ink-2`     | `#555555`            | Secondary text                      |
| `--ink-3`     | `#9A958C`            | Tertiary, captions, mono labels     |
| `--rule`      | `rgba(26,26,26,.08)` | Hairline rules, card borders        |
| `--rule-soft` | `rgba(26,26,26,.04)` | Within-card dividers                |

### Brand primary

| Token          | Hex       | Use                          |
| -------------- | --------- | ---------------------------- |
| `--brand`      | `#1565C0` | Tier 3 default solid buttons |
| `--brand-deep` | `#0D47A1` | Hover state for `--brand`    |

### CTA hierarchy — three tiers, never invert

A page carries **at most one Tier 1**. The two gradients are deliberate, not redundant; they encode the user's intent (doing vs. reading).

| Tier | Treatment                              | Token                      | Meaning                                    |
| ---- | -------------------------------------- | -------------------------- | ------------------------------------------ |
| 1    | Gold gradient `#E9B54C → #FFD700` 135° | `--gradient-cta-premium`   | Primary action ("Analyze deck")            |
| 2    | Blue → purple `#0E68AB → #6A1B9A` 135° | `--gradient-cta-knowledge` | Knowledge / exploration ("Browse Library") |
| 3    | Solid `--brand` or outline             | `--brand`                  | Default, listed actions                    |

**Why two distinct gradients are kept.** Analyzer = action (gold). Library = knowledge (blue → purple). The user learns the association and it transfers between pages. Harmonizing them to a single colour collapses the signal — tested and rejected. **Do not** demote either CTA gradient to a "secondary" treatment; they are both primary-tier, addressing different intents.

---

## 3. Typography

```
Heading    "Cinzel", "Playfair Display", Georgia, serif    — H1–H4 only
Body       "Inter", system-ui                              — H5/H6, body, UI
Mono       "JetBrains Mono", "SF Mono", Menlo, monospace   — techTerm captions, tokens, math
```

### Scale

| Token | Size     | Weight | Family         | Line-height |
| ----- | -------- | ------ | -------------- | ----------- |
| H1    | 3rem     | 700    | Cinzel         | 1.1         |
| H2    | 2.5rem   | 600    | Cinzel         | 1.15        |
| H3    | 2rem     | 600    | Cinzel         | 1.2         |
| H4    | 1.5rem   | 500    | Cinzel         | 1.3         |
| H5    | 1.25rem  | 500    | Inter          | 1.4         |
| H6    | 1rem     | 500    | Inter          | 1.5         |
| body1 | 1rem     | 400    | Inter          | 1.65        |
| body2 | 0.875rem | 400    | Inter          | 1.55        |
| tech  | 0.75rem  | 400    | JetBrains Mono | 1.4         |

**Hero H1** uses the WUBRG gradient as text fill (`background-clip: text`). Reserved for the home / landing H1 — never for body content, never for inline emphasis.

**techTerm captions** (e.g. _"Hypergeometric · Frank Karsten"_) render in mono at body2 size with `color: var(--ink-3)`. They sit at the bottom of math cards as a discreet credit line. **Do not** promote to body weight; they are footnotes, not headlines.

---

## 4. Layout primitives

### Radii

| Token      | Value  | Use                            |
| ---------- | ------ | ------------------------------ |
| `--r-sm`   | 6 px   | Tags, inline code, micro-pills |
| `--r-md`   | 8 px   | Toolbar chips, compact inputs  |
| `--r-lg`   | 12 px  | Buttons, inputs, base cards    |
| `--r-xl`   | 16 px  | Premium surfaces, modals       |
| `--r-full` | 9999px | Chips, pills, avatars          |

### Spacing

| Token         | Value   | Use                        |
| ------------- | ------- | -------------------------- |
| `--space-xs`  | 0.25rem | Inline gaps                |
| `--space-sm`  | 0.5rem  | Compact stacks             |
| `--space-md`  | 1rem    | Default padding            |
| `--space-lg`  | 1.5rem  | Card padding, section gaps |
| `--space-xl`  | 2.5rem  | Major section padding      |
| `--space-2xl` | 4rem    | Hero / band separation     |

### Shadows

| Token                   | Value                                                         | Use            |
| ----------------------- | ------------------------------------------------------------- | -------------- |
| `--shadow-card`         | `0 1px 2px rgba(20,11,0,.04), 0 4px 16px rgba(20,11,0,.04)`   | Resting card   |
| `--shadow-card-hover`   | `0 4px 12px rgba(20,11,0,.08), 0 16px 40px rgba(20,11,0,.10)` | Lifted card    |
| `--shadow-button`       | `0 2px 8px rgba(20,11,0,.10)`                                 | Resting button |
| `--shadow-button-hover` | `0 8px 24px rgba(20,11,0,.18)`                                | Lifted button  |

### Surfaces

- **Parchment** (`--bg` `#F5F3EE`): the base of every page. Warm, slightly aged, never pure white. Pair with subtle radial mana glows at the corners of the viewport for atmosphere without weight.
- **Paper** (`--paper` `#FFFFFF`): the container for content. Pure white with a hairline rule (`--rule`), raised one micro-step above parchment via `--shadow-card`. Generous padding (`--space-lg` minimum) lets the type breathe.

A SVG noise overlay at 0.35 opacity with `mix-blend-mode: multiply` gives the parchment its grain. Keep it; the texture is what separates ManaTuner from generic light-mode SaaS.

---

## 5. Motion

- **Default easing:** `cubic-bezier(0.4, 0, 0.2, 1)` (Material standard).
- **Durations:** `--d-fast` 180ms (micro-states), `--d-base` 320ms (hover / transitions), `--d-slow` 600ms (mount animations).
- **Hover lifts:** cards `translateY(-4px)`, buttons `translateY(-2px)`. Always paired with a shadow upgrade (`--shadow-card-hover` / `--shadow-button-hover`).
- **CTA arrow nudge:** the `→` inside a button translates 4px on hover, same easing.
- **Mount choreography:** one orchestrated fade-up per scroll viewport — staggered children at 60–90ms intervals over 800ms. Cap at one mount animation per viewport; chained reveals feel cheap.
- **`prefers-reduced-motion`** is non-negotiable. Every animation must collapse to `0.01ms` or `none`. The CSS guard is at the bottom of every stylesheet — never strip it. Motion is hospitality, not entitlement.

---

## 6. Iconography

The **mana-font** (Andrew Gioia, MIT — `mana-font@1.15.x`) is the canonical icon set for colour symbols. Class signature: `ms ms-cost ms-{w|u|b|r|g|c}` plus hybrid variants `ms-rg`, `ms-wu`, `ms-ub`, `ms-br`, `ms-gw`, etc., and phyrexian variants `ms-wp`, `ms-up`, `ms-bp`, `ms-rp`, `ms-gp`. Never recreate them as bespoke SVG — the font is exhaustive (every printed symbol since Alpha) and deduplicates the work.

For non-mana icons, the project uses `lucide-react` and `@mui/icons-material` interchangeably; both ship a 24px stroke vocabulary that coexists.

---

## 7. Don'ts — the short list

| Don't                                                              | Why                                                                             |
| ------------------------------------------------------------------ | ------------------------------------------------------------------------------- |
| Pastel-ize the WUBRG mana colours                                  | They are signal. Pastels = generic.                                             |
| Add a third CTA gradient                                           | Two is the limit. A third dilutes the hierarchy.                                |
| Promote techTerm captions to body weight                           | They are discreet credits, not headlines.                                       |
| Default to generic purple gradients on a white surface             | AI-slop aesthetic. Reserve blue → purple for the Knowledge CTA only.            |
| Use `.sort(() => Math.random() - 0.5)` for any shuffle             | Biased distribution. Use Fisher-Yates. (Code rule, included for consistency.)   |
| Drop the parchment noise overlay because "it looks busy"           | The grain is what separates the brand from default Material light surfaces.     |
| Strip the `prefers-reduced-motion` guard from any stylesheet       | Accessibility outranks every transition in this document.                       |
| Use `#150B00` as a button accent on surfaces darker than parchment | Readability collapses. Reserve Swamp for body ink on the parchment ground only. |

---

## 8. Adapting to a new product

The system was designed around MTG mana colours. To fork it for a different product, two paths:

1. **Keep the structure, swap the canon.** Replace the `mana-*` tokens with your own 5–7 anchor colours and update the WUBRG hero gradient to match. Everything else — typography pairing, motion, surfaces, CTA tiers, radii — is product-agnostic.
2. **Keep the canon, swap the framing.** If your product is MTG-adjacent (deckbuilders, drafts, EDH tools), keep the mana palette but reset the brand primary (`#1565C0` blue) to whatever differentiates you. Mana colours then act as content tags rather than chrome.

The CTA tier rules, hover-lift mechanics, easing curve, and a11y guards survive both moves unchanged.

---

## 9. Companion files

This brandbook is the prose source of truth. The system is also exported as:

| File                 | Purpose                                                    |
| -------------------- | ---------------------------------------------------------- |
| `index.html`         | Rendered showcase — open in a browser to verify the system |
| `tokens.json`        | Cross-platform design tokens, machine-readable             |
| `tokens.css`         | CSS custom properties, ready to `@import`                  |
| `tokens.ts`          | Typed token export for the React app                       |
| `components.css`     | Reference component styles (buttons, cards, surfaces)      |
| `mui-theme.ts`       | Material UI `createTheme()` configuration                  |
| `tailwind.preset.js` | Tailwind preset for projects on that stack                 |

> The companion files listed above are part of the design-system delivery scope. This edition of the brandbook is complete on its own; the export files are generated separately when a stack-specific integration is needed.

---

## 10. Edition notes

- **Edition 2.6 — Light** is intentionally narrow in scope.
- **The dark theme is excluded.** The previous dark surface (`#0D0D0F` near-black + glass cards) and the dark-mode mana variants (`#F5F0D0`, `#4A9EE8`, `#3D3D3D`, `#FF5252`, `#4CAF50`, `#FFD700`) have been removed from this revision because the dark surface system was not load-bearing — readability on `#150B00` accents, inconsistent glass effects across Safari, and a glow palette that didn't survive WCAG AA on body text. A dark edition will be re-issued once those issues are resolved structurally rather than patched.
- Until the dark edition lands, products forking this system should ship **light-only** and respect the user's OS preference by serving the same parchment surface across light and dark OS settings, not by faking a dark mode.

---

_Maintained by the ManaTuner team. License: see project root `LICENSE`._
