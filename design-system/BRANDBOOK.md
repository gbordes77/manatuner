# ManaTuner — Brandbook

The visual & interaction laws of the ManaTuner family. Read this before adapting the system to a new project.

---

## 1. Brand voice

ManaTuner is **competitive MTG, technical, generous**. The visual language follows three rules:

1. **Authenticity over decoration.** Mana colors are the canonical Wizards palette (Plains warm cream, Island deep blue, Swamp near-black, Mountain vivid red, Forest forest green). Don't pastel them, don't desaturate them. They are signal, not flair.
2. **Knowledge as premium.** The Library experience uses gradients normally reserved for high-tier products. The math content carries its own visual weight — small monospace techTerm captions instead of corporate jargon.
3. **Quiet UI for a loud subject.** The chrome stays sober (Inter body, Cinzel headings, parchment or near-black surfaces). The mana symbols and the WUBRG hero gradient do the talking.

Avoid: generic SaaS purple-blue gradients, stock illustration, badges. The card art is the moodboard.

---

## 2. Color system

### Mana (canon — never change)

| Color      | Hex (light) | Hex (dark) | Use                                            |
| ---------- | ----------- | ---------- | ---------------------------------------------- |
| White      | `#F8F6D8`   | `#F5F0D0`  | Plains accents, info-light backgrounds         |
| Blue       | `#0E68AB`   | `#4A9EE8`  | Primary brand. Knowledge CTA. Info chips.      |
| Black      | `#150B00`   | `#3D3D3D`  | Surface dark, body text on dark mode           |
| Red        | `#D3202A`   | `#FF5252`  | Error, destructive, attention                  |
| Green      | `#00733E`   | `#4CAF50`  | Success, validated state                       |
| Colorless  | `#CBC5C0`   | `#9E9E9E`  | Disabled / neutral                             |
| Multicolor | `#E9B54C`   | `#FFD700`  | **Premium gold — single primary CTA per page** |

### CTA hierarchy (CRITICAL — don't invert)

Three tiers. Pages may carry **at most one** Tier 1.

| Tier | Treatment                         | Token                      | Meaning                                    |
| ---- | --------------------------------- | -------------------------- | ------------------------------------------ |
| 1    | Gold gradient `#E9B54C → #FFD700` | `--gradient-cta-premium`   | Primary action ("Analyze deck")            |
| 2    | Blue→purple `#0E68AB → #6A1B9A`   | `--gradient-cta-knowledge` | Knowledge / exploration ("Browse Library") |
| 3    | Solid brand primary or outline    | `--brand-primary`          | Default, listed actions                    |

**Why the two gradients are kept distinct:** Analyzer = action (gold). Library = knowledge (blue→purple). The user learns the association and it transfers between pages. Harmonizing them to a single color collapses the signal — tested and rejected.

**Do not** demote either CTA gradient to a "secondary" treatment. They are both primary-tier; they speak to different intents.

---

## 3. Typography

```
Heading    "Cinzel", "Playfair Display", serif        — H1-H4 only
Body       "Inter", "Roboto", system-ui              — H5/H6/body
Mono       "JetBrains Mono", "Fira Code"             — techTerm captions, code, math
```

### Scale

| Token | Size     | Weight | Family |
| ----- | -------- | ------ | ------ |
| H1    | 3rem     | 700    | Cinzel |
| H2    | 2.5rem   | 600    | Cinzel |
| H3    | 2rem     | 600    | Cinzel |
| H4    | 1.5rem   | 500    | Cinzel |
| H5    | 1.25rem  | 500    | Inter  |
| H6    | 1rem     | 500    | Inter  |
| body1 | 1rem     | 400    | Inter  |
| body2 | 0.875rem | 400    | Inter  |

**Hero H1** uses the WUBRG gradient as text fill (`background-clip: text`). Reserved for the home / landing H1 — not body content.

**techTerm captions** (e.g. "Hypergeometric · Frank Karsten") render in `font-mono` at body2 size, color `text.secondary`. They sit at the bottom of math cards as a discreet credit line. Do not promote to body weight.

---

## 4. Layout primitives

| Token           | Value  | Note                        |
| --------------- | ------ | --------------------------- |
| `--radius-lg`   | 12px   | Buttons, inputs, base cards |
| `--radius-xl`   | 16px   | Premium surfaces, modals    |
| `--radius-full` | 9999px | Chips, pills                |
| `--space-md`    | 1rem   | Default padding             |
| `--space-lg`    | 1.5rem | Card padding, section gap   |

### Surfaces

- **Light theme:** `#F5F3EE` parchment background, `#FFFFFF` paper. Subtle borders (`rgba(0,0,0,0.04)`).
- **Dark theme:** `#0D0D0F` near-black background, `#1A1A1E` paper. Glass cards: `rgba(255,255,255,0.03)` + `backdrop-filter: blur(10px)` + `1px solid rgba(255,255,255,0.08)`. **Don't replace with solid surfaces** — the glass effect is the dark theme identity.

---

## 5. Motion

- **Default easing:** `cubic-bezier(0.4, 0, 0.2, 1)` (Material standard).
- **Hover lifts:** cards `translateY(-4px)`, buttons `translateY(-2px)`. Always paired with a shadow upgrade (`var(--shadow-card-hover)` / `var(--shadow-button-hover)`).
- **Mount animations:** `ds-animate-fadeIn` (300ms) for above-the-fold, `ds-animate-slideInUp` (600ms) for cards entering. Cap at one mount animation per scroll viewport — chained animations feel cheap.
- **`prefers-reduced-motion`** is non-negotiable. Every animation must collapse to `0.01ms` or `none`. The CSS already enforces this — don't remove the guard.

---

## 6. Iconography

The mana-font (https://mana.andrewgioia.com) is the canonical icon set for color symbols. Class is `ms ms-cost ms-{w|u|b|r|g|c}` plus hybrid variants `ms-rg`, `ms-wu`, etc. Don't recreate them as SVG — the font is exhaustive (every printed symbol since Alpha) and deduplicates the work.

For non-mana icons, the project uses `lucide-react` and `@mui/icons-material` interchangeably. New projects can pick either; they share the same stroke vocabulary at 24px.

---

## 7. Don'ts (the short list)

| Don't                                                       | Why                                                                           |
| ----------------------------------------------------------- | ----------------------------------------------------------------------------- |
| Use Swamp `#150B00` as a text or button accent on dark mode | Unreadable. The Commander track even has a `#6B3FA0` override.                |
| Pastel-ize the WUBRG mana colors                            | They are signal. Pastels = generic.                                           |
| Add a third CTA gradient                                    | Two is the limit. A third dilutes the hierarchy.                              |
| Promote techTerm captions to body weight                    | They are discreet credits, not headlines.                                     |
| Use `.sort(() => Math.random() - 0.5)` for any shuffle      | Biased distribution. Use Fisher-Yates. (Code rule, included for consistency.) |
| Add backdrop-filter without `-webkit-backdrop-filter`       | Safari renders the dark glass cards as opaque blocks.                         |

---

## 8. Adapting to a new product

The system was designed around MTG mana colors. If you're forking it for a different product, you have two choices:

1. **Keep the structure, swap the canon.** Replace the `mana.*` tokens with your own 5-7 anchor colors and update the WUBRG hero gradient to match. Everything else (typography, motion, surfaces, CTA tiers) is product-agnostic.
2. **Keep the canon, swap the framing.** If your product is MTG-adjacent (deckbuilders, drafts, EDH tools), keep the mana palette but reset the brand primary (`#1565C0` blue) to whatever differentiates you. Mana colors then act as content tags rather than chrome.

The CTA tier rules are stack-agnostic and should survive both moves. The hover lifts, easing, and a11y guards too.
