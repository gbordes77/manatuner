# Journal d’implémentation — Audit ManaTuner

> **Projet :** ManaTuner (manatuner.app)  
> **Période :** 2026-08-01  
> **Sources de demande :** `MANATUNER_AUDIT_AND_IMPROVEMENT_BACKLOG.md` + `MANATUNER_CURSOR_MASTER_PROMPT.md`  
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

### Prod

- **Non poussé** tant que l’owner n’a pas dit “go prod” pour cette vague (après relecture locale).

---

## 6. Invariants respectés

- Analyse **client-side**, pas de backend decklists
- Feedback = Tally externe, pas de deck envoyé
- Workers mulligan conservés (payload clone-safe)
- Privacy banner / localStorage uniquement

---

## 7. Encore ouvert (hors points 1–4)

- P1-7 URL Moxfield (ToS/CORS)
- Preset EDH encore plus profond (command zone, horizon T5–T8 hardcodé dans math)
- Remplacer type `etbTapped: function` par boolean structurel
- RNG seedé Monte Carlo
- P2 design (table mobile, screenshot hero, a11y axe)
- P2-7 prerender marketing
- P3 suggestions de lands, analytics privacy-friendly

---

## 8. Commits GitHub (prod connus)

| SHA       | Résumé                                                |
| --------- | ----------------------------------------------------- |
| `25598c6` | P0 trust (worker, P1/P2 math, E2E, Health Score)      |
| `9eef000` | P1/P2 UX wave (Learn, banner, empty, hero, stamp, H1) |
| `3ff9b99` | Feedback footer après dismiss                         |
| `08b80a5` | Feedback chips header + footer                        |

Vague C : **implémentée en local** (version package **2.7.3**).  
Commits / prod : **uniquement après “go prod”** de l’owner.

---

## 9. Comment revalider en local (vague C)

```bash
npm run dev
# http://localhost:3000/analyzer
# - Format + On the play / draw visibles sans “Configure”
# - ?sample=edh → Auto Commander + format casual_edh
# - ?sample=limited → Auto Limited
# - Deck avec Sideboard → Main only / Post-board
npm run test:unit
npx playwright test tests/e2e/core-flows/analyzer-happy-path.spec.js tests/e2e/tabs/analyzer-tabs.spec.js --project=chromium
```

---

_Journal maintenu pour handoff humain / agents suivants. Mettre à jour ce fichier à chaque vague livrée._
