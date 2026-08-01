# Journal d’implémentation — Audit ManaTuner

> **Projet :** ManaTuner (manatuner.app)  
> **Période :** 2026-08-01  
> **Fin journée produit :** **v2.7.7** · SHA **`f0e5d7f`** · vagues **A–G** (SSOT : `docs/session/HANDOFF_2026-08-01.md`)  
> **Audit docs :** `docs/session/DOCS_AUDIT_REPORT_2026-08-01.md` (alignement fait ; §7 ci-dessous purgé des faux “ouverts”)  
> **Sources de demande (phase 0) :** `MANATUNER_AUDIT_AND_IMPROVEMENT_BACKLOG.md` + `MANATUNER_CURSOR_MASTER_PROMPT.md` (**historiques** post-ship)  
> **Règle process (owner) :** **local d’abord → validation → “go prod” uniquement** (une approbation prod n’est pas un chèque en blanc).

---

## 1. Mission reçue

1. Ne **pas** coder le backlog à l’aveugle.
2. **Phase 0 :** analyser le repo, vérifier/infirmer chaque claim P0 (et P1 importants), écrire `AGENT_PLAN.md`.
3. Ensuite exécuter le plan révisé, privacy client-side, tests après chaque fix.
4. Vague suivante (owner) : points 1–4 prioritaires + **journal complet** de tout ce qui a été demandé/fait.

---

## 2. Phase 0 — Verdict audit vs code

| ID                 | Claim audit                             | Verdict                                      | Preuve / action                                      |
| ------------------ | --------------------------------------- | -------------------------------------------- | ---------------------------------------------------- |
| P0-1               | Worker DataCloneError Mulligan/Manabase | **Confirmé** Mulligan ; Manabase sans worker | `DeckCard.etbTapped` = fonction → `postMessage` fail |
| P0-2               | Analysis tab / Health Score             | **Partiel**                                  | Routing OK ; labels/score UX faibles                 |
| P0-3               | Realistic > Best case                   | **Confirmé**                                 | Dual engines + P1 = colors\|l=turn trop pessimiste   |
| P0-4               | E2E happy path manquant                 | **Partiel**                                  | Specs FR obsolètes                                   |
| P1-6 Share         | Demandé                                 | **Déjà en place**                            | `urlCodec`                                           |
| P1-5 Compare       | Demandé                                 | **Déjà en place**                            | My Analyses                                          |
| P2-8 Library slugs | Demandé                                 | **Déjà en place**                            | `/library/:slug`                                     |
| Badge Manabase “3” | “inexpliqué”                            | **Intentionnel**                             | couleurs short Karsten                               |

Livrable : **`AGENT_PLAN.md`**, **`AGENT_REPORT.md`**.

---

## 3. Vague A — Trust P0 (implémenté + déployé avec accord initial “go github/prod”)

### P0-1 Mulligan worker

- `toCloneableDeckCards()` dans `mulliganSimulatorAdvanced.ts`
- `MulliganTab` : DTO clone-safe + try/catch `postMessage`
- Tests : `mulliganWorkerPayload.test.ts`
- **Commit :** `25598c6`

### P0-3 Perfect drops / Realistic

- Engine : P1 = P(cast \| lands ≥ turn)
- UI/glossary/Guide/Mathematics alignés
- **Commit :** inclus dans `25598c6`

### P0-2 Health Score + Analysis

- QuickVerdict : Health Score + top 3 recos
- Subtabs Spells & Tempo, test ids
- **Commit :** `25598c6`

### P0-4 E2E happy path

- `tests/e2e/core-flows/analyzer-happy-path.spec.js` (EN, 5 tabs)
- **Commit :** `25598c6`

### Prod

- Push `main` → Vercel Ready (après demande “mettre à jour github et live”)

---

## 4. Vague B — UX P1/P2 (implémenté ; 1er push trop tôt sans revalidation locale — **leçon process**)

| Item                        | Fichiers                   | Commit                                          |
| --------------------------- | -------------------------- | ----------------------------------------------- |
| P1-2 Learn nav              | `Header.tsx`               | `9eef000`                                       |
| P2-3 Banner dismissible     | `BetaBanner.tsx`           | `9eef000`                                       |
| P1-5 Empty My Analyses      | `MyAnalysesPage.tsx`       | `9eef000`                                       |
| P1-1 Hero CTAs              | `HomePage.tsx`             | `9eef000`                                       |
| P3-7 Engine stamp           | `AnalyzerPage.tsx`         | `9eef000`                                       |
| P3-1 H1 adouci              | `HomePage.tsx`             | `9eef000`                                       |
| Feedback permanent footer   | `Footer.tsx`               | `3ff9b99`                                       |
| Feedback chip header+footer | `Header.tsx`, `Footer.tsx` | `08b80a5` (après validation locale + “go prod”) |

**Feedback lesson :** croix seule = mauvais UX → lien/chip permanent (owner validé).

---

## 5. Vague C — Points 1–4 prioritaires (2026-08-01, **local first**)

Demandé explicitement : _“go pour les points 1 2 3 4 et surtout alimente bien un journal…”_

### Point 1 — P1-9 Commander / Limited first-class

| Changement                                                              | Fichier                                                               |
| ----------------------------------------------------------------------- | --------------------------------------------------------------------- |
| `detectDeckFormatFamily`, `suggestedFormatPreset`, land guidance        | `src/utils/deckFormat.ts`                                             |
| Preset `limited` dans removal rates                                     | `types/manaProducers.ts`                                              |
| Auto-format si `formatSource === 'auto'`                                | `AccelerationContext.tsx` (`suggestFromDeckSize`, `unlockFormatAuto`) |
| `?format=commander` + samples `edh`/`limited` débloquent auto + suggest | `AnalyzerPage.tsx`                                                    |
| Après `analyzeDeck`, suggest depuis `totalCards`                        | `AnalyzerPage.tsx`                                                    |
| Banner “Detected: …” sur Castability                                    | `CastabilityTab.tsx`                                                  |

### Point 2 — P1-4 Format / Play-Draw lisibles

| Changement                                                      | Fichier                              |
| --------------------------------------------------------------- | ------------------------------------ |
| Format select + **On the play / On the draw** toujours visibles | `AccelerationSettings.tsx` (rewrite) |
| Labels plain language (Commander, Limited, Modern…)             | idem                                 |
| Chip Auto / locked + Advanced removal                           | idem                                 |
| `data-testid="analysis-settings"`, `play-draw-toggle`           | idem                                 |

### Point 3 — P1-8 Sideboard clair

| Changement                                                               | Fichier              |
| ------------------------------------------------------------------------ | -------------------- |
| Toggle **Main only** / **Post-board**                                    | `CastabilityTab.tsx` |
| Compteurs main · side auto-détectés                                      | idem                 |
| Swap editor seulement en post-board                                      | idem                 |
| Producers / multi-mana / Cavern basés sur `effectiveCards` (board scope) | idem                 |

### Point 4 — E2E stale + unification moteurs

| Changement                                                                                   | Fichier                                        |
| -------------------------------------------------------------------------------------------- | ---------------------------------------------- |
| Spec tabs modernisée EN                                                                      | `tests/e2e/tabs/analyzer-tabs.spec.js`         |
| Ancien FR suite **skipped** (placeholder)                                                    | `tests/e2e/core-flows/main-user-flows.spec.js` |
| Castability **toujours** via SSOT `computeAcceleratedCastability` (base) ; ramp si switch on | `ManaCostRow.tsx`                              |

### Tests unitaires ajoutés

- `src/utils/__tests__/deckFormat.test.ts`

### Prod (vague C)

- Ship **`83efe90`** (v2.7.3) après “go prod” owner.

---

## 5b. Vague D — P1-9 suite EDH plus profond (2026-08-01)

Owner : local → tests → **“go prod”**.

| Changement                                                             | Fichier                                        |
| ---------------------------------------------------------------------- | ---------------------------------------------- |
| `castabilityHorizon` T5–T8 EDH / T1–T4 60c & Limited                   | `src/utils/deckFormat.ts`                      |
| `scaleKarstenSources` (N/60), caveats command zone, singleton heads-up | idem                                           |
| Manabase color targets scalés + tooltip                                | `KarstenTargetDelta.tsx`                       |
| Sort + highlight horizon + note EDH                                    | `CastabilityTab.tsx`, `ManaCostRow.tsx`        |
| Banner Commander honnête                                               | `AnalyzerPage.tsx`                             |
| QuickVerdict + Guide caveats                                           | `QuickVerdict.tsx`, `GuidePage.tsx`            |
| E2E P1-9                                                               | `tests/e2e/core-flows/p1-9-edh-verify.spec.js` |
| Unit deckFormat +15                                                    | `src/utils/__tests__/deckFormat.test.ts`       |

**Vérif vague D :** unit 351 pass · tsc OK · Playwright audit 6/6 · P1-9 E2E 2/2. Ship **2.7.4**.

---

## 5c. Vague E — Command zone + horizon T4–T8 (2026-08-01)

Owner : local → tests complets → **“go prod”**.

| Changement                                                               | Fichier                                                 |
| ------------------------------------------------------------------------ | ------------------------------------------------------- |
| Horizon EDH **T4–T8**                                                    | `deckFormat.ts`                                         |
| `isCommander` parse (_CMDR_, section Commander, fallback first non-land) | `deckAnalyzer.ts`                                       |
| `effectiveLibrarySize` N−cmd pour castabilité                            | `deckFormat.ts`, `CastabilityTab.tsx`                   |
| Chip Command zone + pin first                                            | `ManaCostRow.tsx`, `CastabilityTab.tsx`                 |
| Sample Atraxa `*CMDR*` + copy banner/Guide                               | `AnalyzerPage.tsx`, `GuidePage.tsx`, `QuickVerdict.tsx` |
| E2E + unit                                                               | `p1-9-edh-verify.spec.js`, `deckFormat.test.ts`         |

**Vérif :** unit 355 · tsc OK · E2E core+tabs 9 pass · build OK.  
A11y suite 16 fails = dette specs FR (hors scope E).

**Version :** **2.7.5**

---

## 5d. Vague F — backlog restant (2026-08-01, **local → attendre go prod**)

| Item      | Changement                                                            |
| --------- | --------------------------------------------------------------------- |
| etbTapped | `boolean` + resolve via landMetadata ; plus de fonctions sur DeckCard |
| MC seed   | `createSeededRng` / `analyzeWithArchetype(..., { seed })`             |
| P1-4      | Archetype selector lisible + `suggestArchetypeFromDeck`               |
| P2-6      | Footer contraste ; a11y.spec.js EN smoke (6 tests)                    |
| P2-5      | Castability / ManaCostRow mobile                                      |

**Tests :** unit 362 · tsc OK · E2E core+tabs+a11y 15 pass · build OK  
**Version :** **2.7.6**  
**Handoff :** `docs/session/HANDOFF_NEXT.md` (phrase coller nouvelle conversation)

---

## 5e. Vague G — prerender + polish + harden (2026-08-01, **v2.7.7**)

| Item                 | Changement                                                                                               |
| -------------------- | -------------------------------------------------------------------------------------------------------- |
| **P2-7 prerender**   | `prerenderLib.ts` + `scripts/prerender.mjs` (concurrency, skip library) ; `vercel.json` → `build:vercel` |
| **Soft-fail Vercel** | Sur `VERCEL=1` : si Chromium/libs absents → **exit 0**, SPA déployée (`f0e5d7f`)                         |
| **P2-1 polish**      | Emoji → icônes MUI ; theme Card/Paper                                                                    |
| **P2-2 hero**        | `data-testid="hero-product-preview"` (Health Score preview)                                              |
| **P2-11 a11y**       | Focus `#quick-verdict` post-analyze ; tooltip Health Score ; aria-live                                   |
| **Mobile**           | ManaCostRow full-width pips sur xs ; tabs scroll-snap                                                    |
| **Commander banner** | `sessionStorage` key survit Strict Mode + `replaceState`                                                 |
| **E2E**              | Timeouts 120s happy-path ; retries 1 ; a11y +3 tests EN                                                  |

**Tests fin G :** unit **369** pass / 2 skip · E2E chromium core/tabs/a11y verts  
**Version :** **2.7.7**  
**SHA feature :** `ac8371e` · **SHA fix deploy :** **`f0e5d7f`**  
**Note prod :** HTML pré-rendu crawler **pas** actif en prod tant que deps Chromium Vercel manquent — app live en SPA, stamp **Engine v2.7.7**.

**SSOT journée :** `docs/session/HANDOFF_2026-08-01.md` · **Audit docs :** `docs/session/DOCS_AUDIT_REPORT_2026-08-01.md`

---

## 6. Invariants respectés

- Analyse **client-side**, pas de backend decklists
- Feedback = Tally externe, pas de deck envoyé
- Workers mulligan conservés (payload clone-safe ; `etbTapped` **boolean**)
- Privacy banner / localStorage uniquement
- P1 ≥ P2 ; Karsten scale N/60 ; horizon EDH T4–T8 ; Fisher-Yates

---

## 7. Encore ouvert (post-G — honnête, 2026-08-01 audit docs)

### Déjà shippé le 2026-08-01 — **ne plus lister comme ouvert**

| Item                                      | Ship    |
| ----------------------------------------- | ------- |
| P0-1…P0-4 trust                           | Vague A |
| etbTapped **boolean** structurel          | Vague F |
| RNG seedé Monte Carlo (`createSeededRng`) | Vague F |
| P1-4 archetype lisible + auto-suggest     | Vague F |
| P2-6 a11y smoke EN + footer contraste     | Vague F |
| P2-1/2 polish base + hero preview         | Vague G |
| P2-5 mobile cast base                     | F/G     |
| Code prerender + soft-fail deploy         | Vague G |

### Réellement ouvert / optionnel

| Item                                                | État                                          |
| --------------------------------------------------- | --------------------------------------------- |
| **P0 business**                                     | Distribution — `LAUNCH.md`                    |
| P2-7 HTML prerendered **en prod**                   | Code OK ; crawler HTML absent (soft-fail SPA) |
| Polish UI plus large / a11y axe full site           | Optionnel                                     |
| Dual engines ManaCostRow (SSOT full unify)          | Dette math connue                             |
| P1-7 URL Moxfield                                   | Différé ToS/CORS **sans owner**               |
| i18n FR / backend / Sentry DSN / analytics decklist | Différé **sans owner**                        |
| P3 suggestions de lands                             | Non shippé                                    |

---

## 8. Commits GitHub (prod connus — journée 2026-08-01)

| SHA           | Résumé                                                         |
| ------------- | -------------------------------------------------------------- |
| `25598c6`     | P0 trust (worker, P1/P2 math, E2E, Health Score)               |
| `9eef000`     | P1/P2 UX wave (Learn, banner, empty, hero, stamp, H1)          |
| `3ff9b99`     | Feedback footer après dismiss                                  |
| `08b80a5`     | Feedback chips header + footer                                 |
| `83efe90`     | Vague C — EDH/Limited format, play-draw, sideboard (**2.7.3**) |
| `7d05d5c`     | Vague D — Karsten N/60, horizon, caveats (**2.7.4**)           |
| `9e90ffb`     | Vague E — command zone + T4–T8 (**2.7.5**)                     |
| `7febc34`     | Vague F — etbTapped bool, MC seed, archetype, a11y (**2.7.6**) |
| `ac8371e`     | Vague G — prerender, polish, a11y, E2E (**2.7.7**)             |
| **`f0e5d7f`** | fix soft-fail prerender Vercel (prod Ready)                    |
| `3fdc0e4`     | docs handoff journée + prompt audit                            |

---

## 9. Comment revalider en local (A–G)

```bash
npm run dev
# http://localhost:3000/analyzer
# - Format + On the play / draw visibles
# - ?sample=edh → Commander banner, T4–T8, command zone
# - Engine v2.7.7 sous résultats
# - Feedback header + footer
npm run test:unit
npx playwright test tests/e2e/core-flows/ tests/e2e/tabs/ \
  tests/e2e/accessibility/a11y.spec.js --project=chromium
```

---

_Journal maintenu pour handoff humain / agents suivants. Mettre à jour ce fichier à chaque vague livrée. SSOT journée : HANDOFF_2026-08-01.md._
