# ManaTuner — Full Product Audit & Improvement Backlog

> **Source site:** https://www.manatuner.app/  
> **Repo:** https://github.com/gbordes77/manatuner  
> **Audit date:** 2026-07-31  
> **Purpose of this document:** Feed this file to an AI coding agent (Cursor + Grok 4.5 or similar) as the single source of truth for product analysis, bugs found in live QA, and a prioritized improvement backlog.  
> **Stack (from public repo/README):** React 18, TypeScript, Vite, Material-UI, Redux Toolkit, React Query, Vitest, Playwright, client-side only, Vercel, Scryfall API, MIT license.

---

## How an agent should use this document

1. Treat **P0** as blockers — fix before any cosmetic work.
2. Prefer **minimal, correct fixes** over refactors. Do not rewrite the whole app unless asked.
3. After each fix: run existing unit tests + add/adjust Playwright E2E for the path that was broken.
4. Respect product invariants:
   - **100% client-side** analysis (no decklists to a backend).
   - **No account required.**
   - **Privacy:** only card names may hit Scryfall for oracle text.
   - **Fan Content Policy** compliance (no official Wizards branding claims).
5. Do not invent math. Keep Frank Karsten / hypergeometric / Monte Carlo / Bellman models; fix bugs and UX around them.
6. Match existing code style in the repo. Read `docs/ARCHITECTURE.md` if present before large changes.

---

## 1. Product summary (context)

**ManaTuner** is a free, open-source Magic: The Gathering manabase analyzer.

### Core value proposition

- Not land-count only: factors **mana dorks, rocks, rituals, and other ramp**.
- Exact-ish cast probabilities per spell / turn (hypergeometric + ramp model).
- Monte Carlo mulligan simulation (default ~10,000 hands) + Bellman-style keep/mull thresholds.
- Secondary product: **Competitive Reading Library** (~54 curated articles, 5 skill tracks, dead links via archive.org).

### Formats claimed

Standard · Pioneer · Modern · Pauper · Commander · Limited (40 / 60 / 100 card decks).

### Primary surfaces

| Route                | Role                             |
| -------------------- | -------------------------------- |
| `/`                  | Marketing landing                |
| `/analyzer`          | Core tool (paste deck → analyze) |
| `/my-analyses`       | Local history (localStorage)     |
| `/library`           | Curated competitive reading      |
| `/guide`             | How to use + format tips         |
| `/mathematics`       | Math explainer                   |
| `/land-glossary`     | Land types glossary              |
| `/about`, `/privacy` | Meta / legal                     |

### Positioning strengths (do not destroy)

- Differentiator “counts dorks & rocks” is real and demoable.
- Local-first + free + MIT is a trust advantage.
- Library + archive.org is a content moat.
- Blueprint export (PNG/PDF/JSON) is a strong shareable artifact.
- Natural-language verdict after analyze is good product sense.

---

## 2. Live QA findings (2026-07-31)

Automated browser pass (desktop 1440×900 + mobile 390×844) against production.

### 2.1 Critical bugs reproduced

#### BUG-A — Mulligan tab crashes after successful analyze

- **Steps:** `/analyzer` → Skip tour → Try Example → Analyze Manabase → open **Mulligan** tab.
- **Result:** Error UI:  
  `Failed to execute 'postMessage' on 'Worker': ()=>!0 could not be cloned.`
- **Impact:** Hero sells “Smart Mulligan Advice”; feature is broken on happy path.
- **Likely cause:** Non-cloneable value (arrow function, class instance, Proxy) passed into `Worker.postMessage`. Serialize a plain DTO only.

#### BUG-B — Manabase tab crashes (same Worker error)

- **Steps:** Same as above → **Manabase** tab.
- **Result:** Same `postMessage` clone error.
- **Impact:** Second pillar of results broken.

#### BUG-C — Analysis tab does not show Analysis content

- **Steps:** After analyze → click **Analysis**.
- **Result:** UI still showed Castability content. Guide documents 3 sub-tabs (Spells & Tempo / Probabilities / Recommendations) not visible in QA.
- **Impact:** Doc/product mismatch; Health Score story incomplete.

#### BUG-D — Realistic % > Best case % (trust-breaking)

- Example from Try Example deck: **Llanowar Elves** Realistic **90%**, Best case **70%**.
- Same pattern on other 1-drops.
- **Impact:** Users conclude the model is wrong even if labels mean something subtle.
- **Fix direction (pick one and document in UI):**
  - If inverted: swap calculations/labels.
  - If “Best case” actually means “lands only / no ramp”: **rename** to `Lands only` or `No ramp` and ensure lands-only ≤ realistic when ramp helps.
  - Tooltip definitions at point of use, not only footer.

### 2.2 Copy / polish defects

- Missing space: `The math tells you what to play.The canon tells you why.`
- Guide says **“Load Example”**; Analyzer button is **“Try Example”**.
- Duplicate visible labels: “Deck Name (optional)” and “Deck List” appear twice (likely MUI label + custom label).
- Unexplained badge **“3”** on Manabase tab.
- Emoji-heavy controls (📝 🗑️ 📋) clash with “rigorous math / pro tool” tone.

### 2.3 What worked

- Landing loads; mobile no horizontal overflow on home/analyzer.
- Try Example + Analyze produces castability table + natural language verdict.
- Blueprint tab works and renders exportable summary (Mana Stability Index, matrices, opening hand %).
- Skip-to-content, feedback banner, local storage messaging present.
- Meta: title/description/OG image present (`og-image-v4.jpg`).
- Basic a11y: few empty controls; `lang="en-US"`.

### 2.4 Sample verdict (example deck)

> Your deck casts 80% of spells on curve — solid, but 3 colors short of Karsten target; keep almost any 2–4-land opener.

Ramp detection listed ~19 rocks/dorks; castability showed ramp contribution on high CMC spells (e.g. Craterhoof lands 9% → realistic 43%). Differentiator is real when Castability works.

---

## 3. Architecture / product invariants (for implementers)

From public README / live behavior:

- Hypergeometric land-drop / cast model (Karsten-oriented 90% targets).
- Cards seen: on play `7 + turn - 1`; on draw `7 + turn` (verify in code).
- Monte Carlo mulligan simulations (configurable; default 10k).
- Detect multiple ramp types (README claims ~13 categories).
- Deck parsers: MTGA, Moxfield, Archidekt, MTGGoldfish, plain text; sideboard auto-detect.
- Persistence: browser localStorage; export/import.
- Hosting: Vercel; processing client-side.

**Agent note:** Prefer fixing Worker message contracts in services like `manaCalculator` / mulligan workers rather than removing Workers (they protect UI during 10k sims).

---

## 4. Prioritized improvement backlog

### Priority legend

- **P0** — Broken / trust-destroying — ship immediately
- **P1** — High leverage UX / conversion / core loop
- **P2** — Design, content, SEO, polish
- **P3** — Growth, extras, longer-term

Each item has: **Why**, **Suggested work**, **Acceptance criteria**.

---

## P0 — Blockers

### P0-1 Fix Worker `postMessage` clone errors (Mulligan + Manabase)

- **Why:** Core promised features crash on example deck.
- **Suggested work:**
  - Find all `new Worker` / `postMessage` call sites.
  - Ensure payload is structured-clone-safe (no functions, no React elements, no class instances).
  - Map domain objects → plain JSON DTOs before post; revive on return if needed.
  - Add error boundary copy that is human-readable if workers fail; retry button already exists.
- **Acceptance:**
  - [ ] Try Example → Analyze → **every** results tab renders without error (Castability, Analysis, Mulligan, Manabase, Blueprint).
  - [ ] Playwright E2E covers this path.
  - [ ] No `postMessage` / DataCloneError in console.

### P0-2 Fix Analysis tab routing / content

- **Why:** Tab click does not show Analysis; Guide promises sub-views.
- **Suggested work:**
  - Fix tab state (MUI Tabs `value` / controlled state / wrong panel id).
  - Implement or wire sub-tabs: Spells & Tempo, Probabilities, Recommendations if they exist but are hidden; otherwise implement MVP Recommendations.
  - Surface **Health Score (0–100)** as documented in Guide.
- **Acceptance:**
  - [ ] Analysis tab shows distinct content from Castability.
  - [ ] Health Score visible with band labels (85+ excellent, 70–84 good, etc. per Guide — confirm thresholds in code).
  - [ ] Guide wording matches UI labels.

### P0-3 Fix Realistic vs Best case semantics + display

- **Why:** Realistic > Best case destroys trust.
- **Suggested work:**
  - Audit formulas for both series.
  - Either correct inversion or rename labels to true meaning.
  - Add inline tooltips: e.g. Realistic = lands + ramp + mana screw model; Lands-only = all lands on curve without ramp credit (define precisely in code comments + UI).
  - Invariant to enforce in tests: when ramp is detected and helps a spell, `realistic >= landsOnly` (or document the rare exceptions).
- **Acceptance:**
  - [ ] No 1-drop shows Realistic meaningfully above “best” under the final definitions.
  - [ ] Unit tests for a known ramp deck and a no-ramp deck.
  - [ ] Tooltip/help text present on headers.

### P0-4 E2E regression suite for analyzer happy path

- **Why:** Prevent P0-1/2/3 from returning.
- **Suggested work:** Playwright spec:
  1. Open analyzer
  2. Dismiss tour
  3. Try Example
  4. Analyze
  5. Assert verdict text visible
  6. Visit each tab; assert no “Something went wrong”
  7. Optional: export blueprint control visible
- **Acceptance:**
  - [ ] CI (or local `npx playwright test`) green on this spec.

---

## P1 — Core product loop

### P1-1 Landing: time-to-value (deck paste above the fold)

- **Why:** Landing sells Canon/Library/Math before the tool; competitive users bounce.
- **Suggested work:**
  - Hero primary action = paste decklist mini-form OR strong CTA that deep-links to `/analyzer` with focus on textarea.
  - Optional: accept `?deck=` / hash payload to prefill analyzer.
  - Move long Canon sections below first tool CTA.
- **Acceptance:**
  - [ ] Within first viewport: headline + one-line value + path to paste/analyze without scrolling past library essays.
  - [ ] Secondary CTA to Library remains available but not dominant.

### P1-2 Simplify navigation IA

- **Why:** 8 top-level items dilute Analyzer conversion.
- **Suggested structure:**
  - Primary: `Analyzer` · `My Analyses` · `Library`
  - Dropdown `Learn`: Guide, Mathematics, Land Glossary, About
  - Utility: GitHub icon, theme if any
- **Acceptance:**
  - [ ] ≤5 top-level nav items on desktop.
  - [ ] Mobile menu groups Learn items.
  - [ ] All old routes still work (no broken links).

### P1-3 Results hierarchy: decision first, table second

- **Why:** Castability table is a data dump; users want actions.
- **Suggested layout after analyze:**
  1. Health Score + natural language verdict (keep/improve)
  2. **Top 3 recommendations** (e.g. “+2 white sources for T2 WW”, “land count OK for curve”, “mull if <2 lands”)
  3. Format / on play|draw / archetype chips (editable)
  4. Detailed tabs (Castability, …)
- **Acceptance:**
  - [ ] Recommendations visible without opening a buried sub-tab.
  - [ ] Recommendations are deterministic for a fixture deck (snapshot test).

### P1-4 Rename / expose format & starting player controls

- **Why:** Defaults wrong ⇒ wrong advice; controls currently feel jargon-y (`modern | 35% removal | Configure`).
- **Suggested work:** Clear controls: Format, On the play / On the draw, Archetype (aggro/midrange/control/combo/limited/commander).
- **Acceptance:**
  - [ ] Changing format updates land targets / scoring weights visibly.
  - [ ] Labels understandable without reading Mathematics page.

### P1-5 My Analyses empty state + Compare

- **Why:** Empty page with Compare/Export/Clear is dead end.
- **Suggested work:**
  - Empty state: 2–3 example decks (Constructed ramp, 3-color midrange, Commander sample), Import JSON, CTA Analyze.
  - Disable Compare until ≥2 saved analyses; implement meaningful diff (health score, land count, bottleneck colors, avg cast %).
- **Acceptance:**
  - [ ] New user can reach a full analysis in one click from My Analyses.
  - [ ] Compare shows side-by-side deltas, not a no-op.

### P1-6 Shareable analysis (privacy-preserving)

- **Why:** Discord/Reddit virality needs a link, not only PNG.
- **Suggested work:**
  - Encode decklist + options in URL hash (compressed) **or** export “Copy share link” that only contains client state.
  - Still no server storage of decks.
  - “Copy Discord summary” markdown: verdict + health + top 3 issues + link.
- **Acceptance:**
  - [ ] Paste share URL in new browser session restores analysis inputs (and re-runs or hydrates results).
  - [ ] No decklist POST to first-party backend.

### P1-7 Import by Moxfield/Archidekt URL (if legally/technically feasible)

- **Why:** Real workflow is URL, not re-copy list.
- **Suggested work:** If public APIs/CORS allow; else “paste export” helper with deep link instructions. Do not scrape in violation of ToS.
- **Acceptance:**
  - [ ] Documented path from Moxfield → Analyzer under 30 seconds.
  - [ ] Failures show clear error (private deck, CORS, rate limit).

### P1-8 Sideboard / 75-card analysis clarity

- **Why:** README mentions post-board; UI under-communicates.
- **Suggested work:** Toggle Main / Side / Main+Side; show when SB cards affect manabase (e.g. extra basics, blood moon packages).
- **Acceptance:**
  - [ ] Sideboard detected from example lists with `Sideboard` separator.
  - [ ] Toggle changes totals and scores predictably.

### P1-9 Commander & Limited first-class defaults

- **Why:** Landing claims all formats; wrong 60-card defaults alienate EDH/Limited.
- **Suggested work:** Auto-detect deck size → set format defaults (40 → Limited 16–18 lands guidance; 100 → Commander 36–38, singleton rules).
- **Acceptance:**
  - [ ] 100-card paste does not use 60-card land targets.
  - [ ] UI shows detected format and allows override.

---

## P2 — Design, UX polish, content

### P2-1 Visual identity beyond default MUI

- **Why:** Functional but generic; Blueprint look is stronger than the rest.
- **Suggested work:** Align result cards with Blueprint aesthetic; reduce stacked paper density; consistent mana pip rendering; fewer emoji buttons → icon components.
- **Acceptance:**
  - [ ] Analyzer primary buttons use icons + text, not emoji-only labels.
  - [ ] Typography scale consistent (Cinzel for display only; body Roboto/system).

### P2-2 Hero social proof + product screenshot

- **Why:** Claims need visual proof.
- **Suggested work:** Static screenshot or stylized sample result in hero; optional quote; “Built on Frank Karsten’s research” badge with link.
- **Acceptance:**
  - [ ] Above-the-fold includes a visual of real output (not only bullets).

### P2-3 Feedback banner behavior

- **Why:** Permanent banner signals permanent beta and steals space.
- **Suggested work:** Dismissible; remember in localStorage; show again after major version only.
- **Acceptance:**
  - [ ] Dismiss persists across reloads.

### P2-4 Copy consistency pass

- **Why:** Small inconsistencies add up (Load vs Try Example, double labels, missing spaces).
- **Suggested work:** Single source of strings; fix missing spaces; align Guide ↔ UI.
- **Acceptance:**
  - [ ] No duplicate field labels.
  - [ ] Guide button names match Analyzer.

### P2-5 Castability table mobile UX

- **Why:** Dense tables on 390px.
- **Suggested work:** Card layout per spell on small screens; sticky analyze/verdict; horizontal tab scroll with snap.
- **Acceptance:**
  - [ ] No clipped columns; primary metrics readable without horizontal page overflow.

### P2-6 Tooltips & glossary on jargon

- **Why:** Dorks/rocks explained on landing; not everywhere in results.
- **Suggested work:** First-run coach marks optional; info icons on Health Score, Karsten target, Realistic, Monte Carlo.
- **Acceptance:**
  - [ ] Every primary metric has accessible description (`aria-describedby` or tooltip).

### P2-7 Prerender / SSR for marketing & library SEO

- **Why:** Raw HTML often only “Loading ManaTuner”; crawlers/previews weak.
- **Suggested work:** Vite SSG or Vercel prerender for `/`, `/guide`, `/mathematics`, `/library`, `/about`, article pages if split.
- **Acceptance:**
  - [ ] `curl` of `/` without JS execution contains real H1 text in HTML.
  - [ ] OG tags remain correct.

### P2-8 Library as indexable article pages

- **Why:** 54 articles are SEO gold if each has a URL.
- **Suggested work:** `/library/[slug]` with summary, authors, topics, archive link, CTA “Related: open Analyzer”.
- **Acceptance:**
  - [ ] At least start-here track items have unique shareable URLs.
  - [ ] 404 for unknown slug.

### P2-9 About page humanization

- **Why:** Trust in fan tools is personal.
- **Suggested work:** Short creator story, contact/Discord, changelog link, acknowledgements (Karsten, Project Manabase / Charles Wickham — already thanked).
- **Acceptance:**
  - [ ] About answers who/why in <1 screen.

### P2-10 Optional i18n (FR/EN)

- **Why:** FR community underserved for this niche; site is en-US only.
- **Suggested work:** i18n for shell + Analyzer + Guide first; Library can stay EN initially.
- **Acceptance:**
  - [ ] Language toggle persists; no mixed strings on critical paths.

### P2-11 Accessibility hardening

- **Why:** Baseline OK; results density risks focus traps/contrast issues.
- **Suggested work:** Live region “Analysis complete”; focus move to verdict; contrast check on % chips; tour keyboard-only.
- **Acceptance:**
  - [ ] Keyboard-only complete analyze flow.
  - [ ] axe/Playwright a11y scan no critical violations on analyzer results.

---

## P3 — Growth & advanced features

### P3-1 Soften absolute marketing claim

- Consider replacing “The Only Mana Calculator…” with defensible “Built to count rocks & dorks — not just lands.”
- **Why:** Absolute claims age poorly and invite pedantry.

### P3-2 Outcome-oriented landing stats

- Prefer “Ramp-aware cast odds” / “10k hands in ~2s” over “6 analysis tabs”.

### P3-3 Concrete land suggestions

- From “short 3 white sources” → candidate cards by format budget (fetches, shocks, triomes, basics).
- **Why:** Diagnosis → prescription loop.

### P3-4 Deck version history

- Same deck name → versions v1..n with diff.
- **Why:** Brewing is iterative.

### P3-5 Discord-oriented export

- One-click copy of Blueprint summary as markdown + image.
- Hashtag already on Blueprint (`#ManaTunerBlueprint`) — lean into it.

### P3-6 Privacy-friendly analytics

- Plausible/Umami events only: `analyze_ok`, `analyze_fail`, `tab_mulligan`, `export_png` — never deck text.
- **Why:** Otherwise product decisions are blind while staying local-first.

### P3-7 Engine version stamp on results

- e.g. `Engine v1.4 · Karsten 2022 tables · ramp model r3`
- **Why:** Public debates when numbers change; screenshots need provenance.

### P3-8 Scryfall cache in IndexedDB

- Cache oracle bulk or per-card responses.
- **Why:** Faster second analysis; softer rate limits; partial offline.

### P3-9 Bundle / font budget

- Subset Cinzel/Roboto; audit MUI imports; mana-font subset if possible.
- **Why:** Venue Wi‑Fi / mobile.

### P3-10 Open-source contribution funnel

- “6 lost articles — help us find” is great — link to GitHub issues templates.
- Good first issues: parsers, translations, land type metadata, library links.
- **Why:** 1 star growth problem is distribution + contribution path.

### P3-11 Content loop

- Weekly “meta manabase” post using the tool (Modern/Standard deck of the week).
- **Why:** Tools + editorial compound (17Lands-style).

### P3-12 Community surface

- Discord or dedicated channel; Reddit post templates; flair for exports.

---

## 5. Suggested 2-week sprint (for agents / humans)

### Week 1 — Trust

1. P0-1 Worker clone fix
2. P0-2 Analysis tab + Health Score
3. P0-3 Realistic / Best case
4. P0-4 Playwright happy path
5. P2-4 Copy consistency
6. P2-3 Dismissible feedback banner

### Week 2 — Loop

1. P1-3 Results hierarchy + Top 3 recommendations
2. P1-4 Format / play-draw controls clarity
3. P1-5 My Analyses empty state + Compare MVP
4. P1-1 Landing time-to-value
5. P1-2 Nav IA simplify
6. P1-6 Share link or Discord copy

Defer P2 SEO prerender and P3 growth until P0 green.

---

## 6. Explicit non-goals (unless user asks)

- Do **not** require user accounts.
- Do **not** upload decklists to a first-party server “for convenience” without explicit product decision.
- Do **not** replace the math engine with hand-wavy heuristics.
- Do **not** add multiplayer/social feeds.
- Do **not** rebrand as official Wizards product.
- Do **not** big-bang rewrite to another framework without cause (stack is fine).

---

## 7. Test fixtures to add

Create stable fixture decklists under something like `tests/fixtures/`:

| Fixture                    | Purpose                             |
| -------------------------- | ----------------------------------- |
| `modern-ramp-gw.txt`       | Many dorks; ramp credit must matter |
| `mono-red-aggro.txt`       | Simple manabase; high cast %        |
| `three-color-midrange.txt` | Color source shortages              |
| `commander-100.txt`        | Singleton + 100-card defaults       |
| `limited-40.txt`           | 17 lands style                      |
| `with-sideboard.txt`       | SB detection                        |

For each: expected band for health score, no worker errors, deterministic recommendations snapshot where possible (seed Monte Carlo).

**Monte Carlo note:** Seed the RNG in tests for stable mulligan thresholds.

---

## 8. UX copy bank (suggested)

### Verdict patterns

- `{castOnCurve}% of spells on curve — {adj}. {bottleneck}. Mulligan: {mullAdvice}.`
- Adjectives: excellent / solid / playable / shaky / rebuild

### Metric renames (candidates)

| Avoid        | Prefer if accurate    |
| ------------ | --------------------- |
| Best case    | Lands only (on curve) |
| Realistic    | Ramp-aware (expected) |
| Health Score | Manabase health       |
| Configure    | Settings              |

### Error copy

- Worker failure: “Mulligan simulation failed to start. Retry. If it persists, try fewer iterations in Settings.”
- Scryfall failure: “Couldn’t fetch card data for {name}. Check spelling or retry.”

---

## 9. Files / areas likely involved (repo hints)

Agent should discover actual paths in repo; README suggests roughly:

- `src/components/**` — UI (Analyzer, tabs, landing)
- `src/services/**` — `manaCalculator`, deck analyzer, parsers
- `src/workers/**` or similar — Monte Carlo / heavy compute (P0-1)
- `src/store/**` — Redux state for analyses / localStorage sync
- `src/hooks/**`
- `docs/ARCHITECTURE.md`
- Playwright under `e2e/` or `tests/`

Search keywords for agents:

- `postMessage`
- `Worker`
- `Best case` / `bestCase` / `realistic`
- `HealthScore` / `health score`
- `Try Example` / `exampleDeck`
- `localStorage`
- `Sideboard`

---

## 10. Definition of done (release quality bar)

A release is “done” when:

1. Example deck analysis completes with **all tabs** working.
2. No Realistic/Best-case trust inversion under documented definitions.
3. New Playwright happy-path E2E green.
4. Unit tests cover ramp vs no-ramp castability ordering.
5. Landing can reach analyze in one clear action.
6. `npm run build` / typecheck / tests pass for Vercel deploy.
7. Privacy story unchanged (no accidental deck telemetry).

---

## 11. One-line strategy

> **Make the promised math trustworthy and visible (fix crashes + metrics), then shorten the path from “paste deck” to “three concrete manabase actions,” then make those results shareable — without abandoning local-first.**

---

## 12. Appendix — Live sitemap & CTAs (reference)

### Nav

Home, Analyzer, My Analyses, Lands (`/land-glossary`), Library, Guide, Mathematics, About · GitHub

### Landing CTAs

- Analyze My Deck → `/analyzer`
- Browse the Library → `/library`
- Learn the Math → `/mathematics`
- Start Now — Free → `/analyzer`
- Give Feedback → external Tally form

### Analyzer actions

Analyze Manabase · Clear · Try Example · Export/Import/Info/Reset (local data) · Share · Expand full width · Tabs: Castability, Analysis, Mulligan, Manabase, Blueprint

### Legal footer (keep)

Unofficial Fan Content under Wizards Fan Content Policy; not endorsed by Wizards; MIT; © 2025–2026 ManaTuner.

---

## 13. Appendix — Original audit narrative (condensed)

**Strengths:** Real differentiator (ramp-aware), credible math branding, local/privacy, library moat, blueprint export, example deck, natural language verdict.

**Weaknesses:** Broken mulligan/manabase workers, confusing probability labels, analysis tab issues, dense MUI UI, long landing, heavy nav, weak social proof, SPA loader SEO, limited share loop, EN-only.

**Market note:** Competes with mental Karsten tables and generic probability toys; wins if ramp-aware results stay correct and actionable. Content library supports SEO/education flywheel.

---

_End of document. Agents: start at §4 P0; do not skip acceptance criteria._
