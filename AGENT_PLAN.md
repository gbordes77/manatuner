# AGENT_PLAN.md — ManaTuner Phase 0

> **Date:** 2026-08-01  
> **Branch / version:** local workspace `manatuner@2.7.1`  
> **Ground truth:** source in this repo (not live site alone)  
> **External audit:** `MANATUNER_AUDIT_AND_IMPROVEMENT_BACKLOG.md` (2026-07-31 live QA) — treated as hypotheses

**Phase 0 status:** complete. Implementation starts only after this file exists (this document).

---

## A. Codebase summary (1 screen)

**ManaTuner** is a client-side MTG manabase analyzer (React 18 + TypeScript + Vite + MUI + Redux Toolkit + React Query). Dev port **3000**. Deploy: Vercel. No first-party backend for decks; Scryfall for card data; localStorage via privacy layer.

### Core flow

```
Deck paste (AnalyzerPage + DeckInputSection)
  → DeckAnalyzer.analyzeDeck()          // parse, Scryfall enrich, land props
  → analysisResult in Redux             // cards, castability, recommendations, mulligan summary
  → QuickVerdict                        // one-line health language above tabs
  → Tabs:
      0 Castability   (ManaCostRow + ramp K=3 engine)
      1 Analysis      (sub: Spell Breakdown / Probabilities / Recommendations)
      2 Mulligan      (Web Worker → analyzeWithArchetype Monte Carlo + Bellman)
      3 Manabase      (Karsten deltas + deck list; share link)
      4 Blueprint     (PNG/PDF/JSON export)
```

### Critical modules

| Area            | Path                                                                              |
| --------------- | --------------------------------------------------------------------------------- |
| Parse / enrich  | `src/services/deckAnalyzer.ts`                                                    |
| Hypergeom SSOT  | `src/services/castability/hypergeom.ts`                                           |
| Ramp / K=3      | `src/services/castability/acceleratedAnalyticEngine.ts`                           |
| Row UI probs    | `src/components/ManaCostRow.tsx` (`useProbabilityCalculation` + accelerated path) |
| Mulligan math   | `src/services/mulliganSimulatorAdvanced.ts`                                       |
| Mulligan worker | `src/workers/mulliganArchetype.worker.ts` ← `MulliganTab.tsx`                     |
| Share URLs      | `src/utils/urlCodec.ts` (`?d=` base64 deck)                                       |
| Library         | `src/pages/ReferenceArticlesPage.tsx`, `ArticleDetailPage.tsx`, seed data         |
| Tests           | Vitest `src/services/__tests__/*`; Playwright `tests/e2e/**` (largely stale)      |

### Product invariants (do not break)

- Analysis **client-side**; no decklist storage on first-party servers
- No mandatory accounts
- Privacy messaging must stay honest (Sentry DSN gated; no deck analytics)
- Unofficial fan project
- Prefer fix math/UX over rewrites

---

## B. Audit verification table

### P0 — Blockers

| ID       | Audit claim                                                                          | Status                                                                                | Evidence                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  | Revised action                                                                                                                                                                                                                                                                                                                                         | Effort | Risk                             |
| -------- | ------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------ | -------------------------------- |
| **P0-1** | Mulligan + Manabase crash: `postMessage` DataCloneError `()=>!0 could not be cloned` | **confirmed** (Mulligan); **false / outdated** for Manabase as worker path            | **Root cause:** every land gets `etbTapped: () => boolean` on `DeckCard` in `deckAnalyzer.ts:63`, `426–515`, attached at parse `687`. `MulliganTab.tsx:856–857` posts full `cards` to worker. Structured clone rejects functions (reproduced: `() => false could not be cloned`). Worker itself is fine (`mulliganArchetype.worker.ts`). **ManabaseFullTab / ManabaseTab** do **not** call Workers. Live QA may have mis-attributed Manabase, or saw a residual ErrorBoundary after Mulligan.                                                                                                                                                                                                             | **Keep.** Serialize clone-safe DTO before `postMessage` (strip/map `etbTapped` → boolean via existing landMetadata / simulated-card logic). Do **not** remove Worker. Add unit test: cloneable payload.                                                                                                                                                | S      | med (mulligan wrong if ETB lost) |
| **P0-2** | Analysis tab doesn’t show Analysis; missing subviews / Health Score                  | **partially true**                                                                    | **Routing works in code:** `AnalyzerPage.tsx:847–988` + `TabPanel.tsx` (hidden until active). **Subtabs exist:** `AnalysisTab.tsx:58–76` — Spell Breakdown / Probabilities / Recommendations (Guide says “Spells & Tempo” — label drift). **Health Score:** not a single branded “Health Score” on Analysis; `QuickVerdict` uses `consistency` above all tabs; `EnhancedCharts` shows “Overall Score” / “Consistency”; My Analyses has `HealthBadge`. Live “still Castability” is **not explained by broken tab indices** in this branch — more likely QA confusion, lazy-load lag, or production lag.                                                                                                    | **Change.** (1) Align Guide ↔ subtab labels. (2) Surface one **Health Score** label on QuickVerdict or Analysis Probabilities (map from existing `consistency`). (3) Optional: `data-testid` per tabpanel for E2E. No full rewrite of Analysis.                                                                                                        | S–M    | low                              |
| **P0-3** | Realistic % can exceed Best case (trust bug)                                         | **confirmed** (label/semantics / dual engines); not necessarily inverted pure formula | **Math (single engine):** `acceleratedAnalyticEngine.ts:249–291` — P1 = colors \| l=turn; P2 = sum over lands×colors×mana → P2 ≤ P1. **Inline path:** `ManaCostRow.tsx:412–447` — p2 = p1 × P(enough lands) → p2 ≤ p1. **Display bug when acceleration on:** Realistic bar uses `acceleratedResult.withAcceleration.p2`; “Best case” uses **`probabilities.p1` from the parallel inline hook** (`ManaCostRow.tsx:918–973`), not `acceleratedResult.base.p1`. Two engines + wrong pairing → Realistic can read **above** Best case (matches Llanowar 90% vs 70%). **Docs conflict:** `MathematicsPage.tsx:439` claims Best always ≥ Realistic; `glossary.ts:28–34` **inverts** meanings vs code/Math page. | **Keep, refined.** (1) Always pair Best/Realistic from **same** result object (`base.p1` / `base.p2` or accel equivalents). (2) Rename UX if clearer: **“Colors (perfect drops)”** vs **“On curve (lands + colors [+ ramp])”** — or keep labels but fix tooltips to match code. (3) Fix glossary. (4) Unit tests: ramp deck & no-ramp deck invariants. | M      | med (public metric meaning)      |
| **P0-4** | Missing E2E happy path                                                               | **partially true** — suite exists but **stale**                                       | Playwright specs under `tests/e2e/core-flows/`, `tests/e2e/tabs/`. They expect FR copy (`analyser`), old top-level tabs (Statistiques / Probabilités / Recommandations / Cartes), wrong selectors. Current UI: EN, tabs Castability / Analysis / Mulligan / Manabase / Blueprint, button **Try Example**. `data-testid="analysis-results"` **does** exist (`AnalyzerPage.tsx:800`). Specs would fail or miss worker crash.                                                                                                                                                                                                                                                                                | **Keep.** Rewrite one focused happy-path E2E: dismiss tour → Try Example → Analyze → assert verdict → click all 5 tabs → no ErrorBoundary / no DataCloneError.                                                                                                                                                                                         | M      | low                              |

### P1 — Core product loop

| ID       | Audit claim                         | Status                            | Evidence                                                                                                                                | Revised action                                                                                                                     | Effort | Risk |
| -------- | ----------------------------------- | --------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- | ------ | ---- |
| **P1-1** | Landing: paste above fold           | **partially true**                | Hero is CTA-forward (“Only Mana Calculator…”), dual product (Canon band). No in-hero deck paste mini-form.                              | Optional later; deep-link `?sample=` + Share already accelerate TTV. Prefer small hero “Paste deck →” → `/analyzer` focus if time. | M      | low  |
| **P1-2** | Nav ≤5 items                        | **confirmed** (still 8)           | `Header.tsx:97–107`: Home, Analyzer, My Analyses, Lands, Library, Guide, Mathematics, About.                                            | Group Learn dropdown; keep Analyzer + Library primary.                                                                             | S–M    | low  |
| **P1-3** | Decision first, Top 3 recs          | **partially true**                | QuickVerdict already decision-first (`QuickVerdict.tsx`). Recs buried in Analysis → Recommendations.                                    | Surface top 1–3 recommendations under QuickVerdict (reuse `analysisResult.recommendations`).                                       | M      | low  |
| **P1-4** | Format / play-draw controls clarity | **partially true**                | Acceleration / format chips exist in Castability path; audit jargon claim still fair.                                                   | Label polish; ensure format change visibly affects targets.                                                                        | M      | low  |
| **P1-5** | My Analyses empty + Compare         | **partially true**                | Compare **implemented** (`MyAnalysesPage.tsx` CompareView, Health Score deltas). Empty-state sample decks weak vs audit ask.            | Improve empty state CTAs (`?sample=aggro` etc.); Compare already OK.                                                               | S      | low  |
| **P1-6** | Shareable analysis                  | **already fixed**                 | `urlCodec.ts` + Share + Manabase “Copy link”; hash/query `d` + optional `name`/`tab`. Client-only.                                      | Keep; optional Discord markdown copy later (P3-5).                                                                                 | —      | —    |
| **P1-7** | Moxfield/Archidekt URL import       | **open**                          | Paste exports work; no URL fetch (CORS/ToS).                                                                                            | Defer unless public API clean; document paste path.                                                                                | L      | med  |
| **P1-8** | Sideboard clarity                   | **partially true / largely done** | `detectSideboardStartLine`, `SideboardSwapEditor` in Castability.                                                                       | UX copy/toggle polish only.                                                                                                        | S      | low  |
| **P1-9** | Commander / Limited defaults        | **partially true**                | `?sample=edh\|limited`, `?format=commander`, QuickVerdict format bands. Full EDH analyzer preset still incomplete (known CLAUDE.md P1). | Optional follow-up; not session blocker.                                                                                           | M–L    | med  |

### Notable P2 / P3

| ID                             | Claim                              | Status                          | Note                                                                                                       |
| ------------------------------ | ---------------------------------- | ------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| P2-3 Feedback banner           | dismissible                        | **confirmed** (not dismissible) | `BetaBanner.tsx` — sticky, no localStorage dismiss                                                         |
| P2-4 Copy consistency          | Load vs Try Example, double labels | **confirmed**                   | Guide “Load Example” vs UI “Try Example”; MUI `label` + visible headings feel duplicated on Deck Name/List |
| P2-7 Prerender                 | SPA loading shell                  | **partially fixed**             | `scripts/prerender.mjs`, `build:prerender` — confirm production uses it                                    |
| P2-8 Library article URLs      | `/library/[slug]`                  | **already fixed**               | `App.tsx` routes + `ArticleDetailPage`                                                                     |
| P3-1 Absolute marketing claim  | “The Only…”                        | product choice                  | Soften later; not trust-critical                                                                           |
| Manabase badge “3”             | unexplained                        | **false (intentional)**         | Short color count badge (`AnalyzerPage.tsx:906–933`); improve aria/tooltip only                            |
| Missing space “play.The canon” | live copy bug                      | **already fixed** in source     | `HomePage.tsx:501–504` has proper line break / space via Box                                               |

---

## C. Better-than-audit opportunities (missed by external audit)

1. **`DeckCard.etbTapped` as function is an architecture footgun**  
   Breaks Workers, Redux serializability, and any `postMessage` / `structuredClone`. Prefer **boolean + landMetadata** (mulligan sim already maps to boolean in `mulliganSimulatorAdvanced.ts:63–75`). Strip at worker boundary **and** consider deprecating function form long-term.

2. **Dual castability engines (known TODO)**  
   `useProbabilityCalculation` (inline hypergeom in `ManaCostRow`) vs `computeAcceleratedCastability` / SSOT engine. Causes P0-3 and long-term maintenance debt. Unifying display to one engine is higher leverage than renames alone.

3. **Glossary vs Mathematics vs UI disagree** on Best/Realistic — trust multi-channel failure.

4. **E2E suite is a false safety net** — gives green confidence if run against outdated selectors incorrectly, or fails CI noise. Rewrite over “add another flaky test.”

5. **Monte Carlo unseeded** (`Math.random` in mulligan) — tests for rates need seeded RNG or tolerance bands (audit asked; still open).

6. **`advancedMaths` monteCarlo worker** (`advancedMaths.ts:350–352`) — secondary path; ensure params stay DTO-only if still used from UI.

7. **Redux-persist of full `analysisResult`** may rehydrate without functions (JSON drops them) → inconsistent mulligan after reload until re-analyze. Strip or re-derive land flags on rehydrate.

8. **Product priority from LAUNCH.md:** distribution > features. After trust P0s, prefer share/copy polish and launch content over P2 visual rewrites.

---

## D. Execution plan (revised)

### Drop / deprioritize from audit for this session

| Item                                   | Why                          |
| -------------------------------------- | ---------------------------- |
| P1-7 URL scrape import                 | ToS/CORS; paste path works   |
| P2-1 full visual redesign              | Cosmetic; trust first        |
| P2-10 i18n                             | Large; out of scope          |
| P3 content/community loops             | Not engineering blockers     |
| “Fix Manabase Worker” as separate epic | No Manabase worker in source |

### Session order (dependency-aware)

| Step  | ID                       | Work                                                                                                                                                                                         | Done when                                                                              |
| ----- | ------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------- |
| **1** | P0-1                     | Clone-safe mulligan worker payload: map `DeckCard[]` → plain objects (`etbTapped: boolean`, no fns, no class instances). Prefer reuse of sim conversion. Guard + clear error if clone fails. | Unit test: payload structuredClone-safe; Mulligan tab no DataCloneError on sample deck |
| **2** | P0-3                     | Single-source Best/Realistic display in `ManaCostRow`; fix glossary; align Mathematics claim; tests for ramp / no-ramp invariants                                                            | No row shows Realistic ≫ Best under defined metrics; tooltips accurate                 |
| **3** | P0-2 light               | Guide/subtab label alignment; Health Score naming on QuickVerdict or Analysis summary; tabpanel test ids                                                                                     | Analysis panel distinct content; Guide matches UI                                      |
| **4** | P0-4                     | New Playwright happy path (EN, current tabs, worker tabs assert no crash)                                                                                                                    | Spec green locally                                                                     |
| **5** | P2-4 / polish            | Try Example ↔ Guide string; optional Manabase badge tooltip                                                                                                                                  | Copy consistent                                                                        |
| **6** | P1-3 light               | Top recommendations under QuickVerdict if cheap                                                                                                                                              | Recs visible without subtab                                                            |
| **7** | (stretch) P1-2 nav group | Learn dropdown                                                                                                                                                                               | ≤5 top-level                                                                           |

**After each step:** `npm run test:unit` (and targeted new tests). After step 4: `npx playwright test` on the new spec.

### Definition of done (this session)

- [x] Mulligan + Manabase + Analysis + Castability + Blueprint open on Try Example without fatal error
- [x] Realistic/Best case semantics consistent on UI + glossary
- [x] One modern E2E happy path
- [x] `AGENT_REPORT.md` at end with tests + leftovers
- [x] Privacy/client-side invariants untouched

**Phase 1 executed 2026-08-01** — see `AGENT_REPORT.md`.

---

## E. Invariants (will not break)

1. No first-party decklist storage / accounts
2. Scryfall-only for card oracle (existing pattern + timeouts)
3. No enabling Sentry DSN without privacy scrubber contract (`Claude.md`)
4. Hypergeom / Karsten SSOT — no ad-hoc probability in random components without tests
5. Workers remain for heavy Monte Carlo (fix payload, don’t delete workers)
6. No drive-by refactors outside this plan

---

## F. Phase 0 method notes

- Verified claims by **reading source**, not by trusting live QA alone.
- Confirmed DataCloneError mechanism with Node `structuredClone` on `etbTapped: () => false`.
- Did **not** implement backlog during Phase 0.

**Next:** Phase 1 — execute table D starting at step 1 (P0-1 worker DTO).
