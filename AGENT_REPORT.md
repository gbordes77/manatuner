# AGENT_REPORT.md — ManaTuner session 2026-08-01

## 1. External audit vs code (Phase 0)

| ID                                   | Verdict                                                        | Outcome             |
| ------------------------------------ | -------------------------------------------------------------- | ------------------- |
| **P0-1** Worker DataCloneError       | **Confirmed** (Mulligan). Manabase has no worker.              | Fixed               |
| **P0-2** Analysis tab / Health Score | **Partially true** — routing OK; labels / Health Score UX weak | Improved            |
| **P0-3** Realistic > Best case       | **Confirmed** — dual engines + wrong P1 def (colors\|l=turn)   | Fixed               |
| **P0-4** Missing E2E happy path      | **Partially true** — stale FR specs only                       | New EN spec green   |
| P1-6 Share links                     | Already in code (`urlCodec`)                                   | No change           |
| P1-5 Compare                         | Already in My Analyses                                         | No change           |
| P2-8 Library `/library/:slug`        | Already exists                                                 | No change           |
| Manabase badge “3”                   | Intentional short-color count                                  | Tooltip title added |
| “play.The canon”                     | Already fixed in source                                        | —                   |

Full verification table: `AGENT_PLAN.md`.

## 2. Implemented (this session)

### P0-1 — Mulligan worker clone safety

- `toCloneableDeckCards()` in `mulliganSimulatorAdvanced.ts` (JSON strip of `etbTapped` functions)
- `MulliganTab.tsx` posts cloneable DTO + try/catch around `postMessage`
- Tests: `src/services/__tests__/mulliganWorkerPayload.test.ts` (3)

### P0-3 — Realistic / Perfect drops semantics

- Engine P1 redefined as **P(castable \| lands ≥ turn)** so **P1 ≥ P2** always for lands-only  
  (`acceleratedAnalyticEngine.ts`)
- UI: same engine for pair; accel path shows Perfect drops = `base.p1`, Realistic = ramp `p2`
- Glossary, Mathematics, Guide, Castability footnotes aligned
- Inline `ManaCostRow` path matched to same mixture definition

### P0-2 (light)

- QuickVerdict: **Health Score N% · band**
- Analysis subtab label restored to **Spells & Tempo**
- Guide: Health Score + Try Example wording
- `data-testid` on tabs / tabpanels / verdict

### P0-4

- `tests/e2e/core-flows/analyzer-happy-path.spec.js` — Try Example → all 5 tabs, no clone/error UI  
  **Chromium: passed (12.3s)**

### Polish

- Top 3 recommendations under QuickVerdict (`data-testid="top-recommendations"`)
- Manabase badge `title` for short/warn counts

## 3. Tests

| Suite                            | Result                    |
| -------------------------------- | ------------------------- |
| `npm run test:unit`              | **336 passed**, 2 skipped |
| Playwright happy path (chromium) | **1 passed**              |

## 4b. Follow-up wave (post-prod, same day)

| ID   | Work                                                          | Status |
| ---- | ------------------------------------------------------------- | ------ |
| P1-2 | Header: Analyzer · My Analyses · Library · **Learn** dropdown | Done   |
| P2-3 | BetaBanner dismissible + `localStorage` key                   | Done   |
| P1-5 | My Analyses empty state → sample CTAs (`?sample=`)            | Done   |
| P1-1 | Hero CTAs: “Paste a deck & analyze” + “Try an example deck”   | Done   |
| P3-7 | Engine stamp under QuickVerdict                               | Done   |
| P3-1 | Soften absolute H1 marketing claim                            | Done   |
| CI   | type-check fix on mulliganWorkerPayload test fixtures         | Done   |

## 4. Remaining backlog (not done)

- P1-7 Moxfield URL import (defer — ToS/CORS)
- P1-9 full EDH analyzer preset
- Unify dual castability engines fully (inline vs SSOT — improved but hooks still dual)
- Seeded Monte Carlo RNG for deterministic mulligan tests
- Long-term: replace `etbTapped` function type on `DeckCard` with boolean + metadata only
- Stale French E2E specs still in tree (`main-user-flows`, old `analyzer-tabs`) — rewrite or delete later

## 5. Risks / follow-ups

- **Public numbers shifted** for Perfect drops (P1) because definition corrected — screenshots/comparisons vs older builds will differ; engine version stamp (P3-7) would help.
- Accelerated-path `withAcceleration.p1` can still behave oddly; UI intentionally uses **lands-only `base.p1`** as secondary caption when ramp is on.
- E2E needs `npx playwright install chromium` on fresh machines.

## 6. Questions for product owner

None blocking. Optional: whether to keep the absolute marketing H1 (“The Only Mana Calculator…”) after trust work (P3-1).

## Privacy

No backend, no deck analytics, no Sentry enablement. Share links remain client-side `?d=` encoding only.
