# Audit documentaire total — 2026-08-01

> **Mission :** inventaire exhaustif + classification + croisement doc ↔ code ↔ prod.  
> **Réalité produit de référence :** `package.json` **2.7.7** · feature G `ac8371e` · fix deploy **`f0e5d7f`** · HEAD docs `3fdc0e4` · live **Engine v2.7.7** (SPA ; prerender HTML crawler soft-fail).  
> **Handoff journée :** `docs/session/HANDOFF_2026-08-01.md`  
> **Exclusions inventaire :** `node_modules/`, `.git/`, `dist/`, `coverage/`, `playwright-report/`, `test-results/`, `.claude/worktrees/`

---

## 0. Preuves croisées (vérité)

| Source                         | Valeur mesurée 2026-08-01                                                        |
| ------------------------------ | -------------------------------------------------------------------------------- |
| `package.json` version         | **2.7.7**                                                                        |
| `git log origin/main`          | `3fdc0e4` (docs handoff) ⊃ `f0e5d7f` (fix soft-fail) ⊃ `ac8371e` (wave G)        |
| Unit tests                     | **369 passed \| 2 skipped** (`npm run test:unit`)                                |
| Code Engine stamp              | `AnalyzerPage.tsx` → `Engine v2.7.7`                                             |
| `DeckCard.etbTapped`           | **`boolean`** (`deckAnalyzer.ts:72`, vague F)                                    |
| Karsten scale / horizon        | `scaleKarstenSources`, `castabilityHorizon` T4–T8 EDH (`deckFormat.ts`)          |
| Mulligan clone-safe            | `toCloneableDeckCards` + seed `createSeededRng`                                  |
| Prerender                      | `scripts/prerender.mjs` soft-fail si `VERCEL=1` ; `vercel.json` → `build:vercel` |
| Live HTML                      | `https://www.manatuner.app/` HTTP 200 ; **0** marqueur `prerendered` (SPA)       |
| Live JSON-LD (avant fix audit) | `softwareVersion: "2.7.1"` **stale** dans `index.html`                           |

---

## 1. Inventaire exhaustif

**Total :** **396** fichiers `*.md` / `*.mdx` / `*.txt` (hors exclusions).

| Zone                          | Count | Classe dominante                               |
| ----------------------------- | ----: | ---------------------------------------------- |
| `_bmad/**`                    |   216 | **C** tooling BMAD générique                   |
| `.claude/**` (hors worktrees) |   105 | **C** commands / personalities / TTS           |
| `docs/**`                     |    42 | **A** technique + **B** audits datés + archive |
| **Racine** `*.md`             |    24 | **A/B/D** produit / session / légal            |
| `public/*.txt`                |     4 | **A** SEO bots (`llms.txt`, `robots.txt`, …)   |
| `design-system/**`            |     3 | **B/C** export design                          |
| `_bmad-output/**`             |     1 | **C** artefact planning                        |
| `.vercel/README.txt`          |     1 | **C** tooling deploy                           |

### 1.1 Racine (24) — classification fichier par fichier

| Fichier                                        | Classe  | Rôle                               | Action audit                                 |
| ---------------------------------------------- | ------- | ---------------------------------- | -------------------------------------------- |
| `docs/session/HANDOFF_2026-08-01.md`           | **A**   | SSOT journée A→G                   | Référence ; checklist docs à cocher          |
| `docs/session/HANDOFF_NEXT.md`                 | **A**   | Phrase coller + priorités          | Déjà 2.7.7 ; pointer audit done              |
| `SESSION_START.md`                             | **A**   | Boot session                       | **Corrigé → 2.7.7 / f0e5d7f / A–G**          |
| `docs/session/JOURNAL_AUDIT_IMPLEMENTATION.md` | **A**   | Journal vagues                     | **Vague G + purge §Encore ouvert**           |
| `LAUNCH.md`                                    | **A**   | Priorité business distribution     | **Métriques rafraîchies ; message inchangé** |
| `README.md`                                    | **A**   | Public                             | **Badge/version/tests → 2.7.7 / 369**        |
| `CHANGELOG.md`                                 | **A**   | Semver public                      | **Entrées 2.7.3–2.7.7**                      |
| `Claude.md` / `CLAUDE.md`                      | **A**   | AI conventions (doublon identique) | **Bloc 2026-08-01 + pointer handoff**        |
| `docs/session/DOCS_AUDIT_REPORT_2026-08-01.md` | **A**   | Ce rapport                         | Créé                                         |
| `MANATUNER_AUDIT_AND_IMPROVEMENT_BACKLOG.md`   | **B**   | Backlog audit pré-impl             | **Bannière historique** (P0 shippés)         |
| `MANATUNER_CURSOR_MASTER_PROMPT.md`            | **B**   | Prompt phase 0                     | Bannière historique                          |
| `AGENT_PLAN.md`                                | **B**   | Plan phase 0                       | Bannière historique                          |
| `AGENT_REPORT.md`                              | **B**   | Rapport early session              | Bannière + remaining outdated                |
| `HANDOFF.md`                                   | **B**   | Log sessions long (→2.7.1)         | **Bannière → lire HANDOFF_2026-08-01**       |
| `TEAM_HANDOFF.md`                              | **B**   | Passation ancienne (v2.6.0)        | Bannière historique                          |
| `ACTION_TRACKER.md`                            | **B**   | Sprint avril                       | Bannière historique                          |
| `FEEDBACK_TRACKER.md`                          | **B**   | Feedback v2.0                      | Bannière historique                          |
| `AUDIT_REPORT.md`                              | **B**   | Audit ancien                       | Bannière historique                          |
| `QA_AUDIT_REPORT.md`                           | **B**   | QA daté                            | Bannière historique                          |
| `docs/personas/mtg-player-personas.md`         | **A**   | Personas UX                        | OK (méthode ; scores datés = snapshot)       |
| `mtg-player-personas-portable.md`              | **B/E** | Export portable                    | Bannière snapshot                            |
| `LEGAL_NOTICE.md`                              | **D**   | Légal                              | OK                                           |
| `SECURITY.md`                                  | **D**   | Security policy                    | OK (client-side claim vrai)                  |
| `CONTRIBUTING.md`                              | **D**   | Contrib                            | OK                                           |
| `CODE_OF_CONDUCT.md`                           | **D**   | CoC                                | OK                                           |

### 1.2 `docs/**` (42)

| Sous-ensemble                                                                                                                                                                                                                                | Classe  | Notes                                                                                           |
| -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------- | ----------------------------------------------------------------------------------------------- |
| `docs/ARCHITECTURE*.md`, `CASTABILITY_*`, `MULLIGAN_*`, `MANA_ACCELERATION_*`, `MATHEMATICAL_*`, `MATH_*`, `P1_P2_*`, `development-guide`, `technology-stack`, `project-overview`, `component-inventory`, `source-tree-analysis`, `index.md` | **A/B** | Specs techniques utiles ; versions parfois pré-2.7.7 — **pas de claim “encore ouvert P0”**      |
| `docs/LAND_SYSTEM_REDESIGN.md`, `COMPARISON_ORIGINAL_PROJECT.md`, `P3_SIMULATION_ENGINE_SPEC.md`                                                                                                                                             | **B**   | Décrivent `etbTapped` **function** (design historique) — **banner** : runtime = boolean v2.7.6+ |
| `docs/AUDIT_*`, `SEO_AEO_*`, `SESSION_2025*`, `ux-accessibility-audit*`, `performance/*`                                                                                                                                                     | **B**   | Snapshots datés                                                                                 |
| `docs/archive/*`                                                                                                                                                                                                                             | **B/E** | Déjà archive                                                                                    |
| `docs/launch/*`, `MARKETING_CONTENT`, `PRODUCT_STRATEGY`, `FUTURE_IDEAS`                                                                                                                                                                     | **A/B** | Stratégie ; ne contredisent pas 2.7.7 ship                                                      |
| `docs/sample-decks/*.txt`                                                                                                                                                                                                                    | **A**   | Données sample (pas prose)                                                                      |

### 1.3 Tooling (321 fichiers) — classe **C**

- `.claude/commands/**`, `.claude/personalities/**`, `.claude/config/**`, TTS txt
- `_bmad/**` (agents, workflows, knowledge)
- `_bmad-output/planning-artifacts/prd.md`
- `design-system/*` (brand book export)
- `.vercel/README.txt`

**Règle :** ne pas “corriger produit” dans ces fichiers sauf s’ils affirment un état ManaTuner faux comme vérité actuelle. Aucun n’est SSOT produit.

### 1.4 `public/` SEO txt

| Fichier                     | Classe | Note                                                                              |
| --------------------------- | ------ | --------------------------------------------------------------------------------- |
| `llms.txt`, `llms-full.txt` | **A**  | Contenu produit pour bots — revalider counts si besoin (hors scope claim version) |
| `robots.txt`                | **A**  | Crawl rules                                                                       |
| `565fa3…txt`                | **A**  | IndexNow key file                                                                 |

---

## 2. Rapport d’écarts (claims → vérité)

### 2.1 Classe A — corrections prioritaires

| Doc                                  | Claim faux / stale                                          | Vérité                                | Preuve                         | Action               |
| ------------------------------------ | ----------------------------------------------------------- | ------------------------------------- | ------------------------------ | -------------------- |
| `SESSION_START.md`                   | live **v2.7.6** / SHA `7febc34` ; vagues A–F only           | **2.7.7** / `f0e5d7f` ; A–G           | package + git + Analyzer stamp | **Mis à jour**       |
| `JOURNAL` §7 Encore ouvert           | etbTapped fn, MC seed, archetype, a11y, prerender “ouverts” | Shipés F/G (prerender = soft SPA)     | code + commits                 | **Purge + §G**       |
| `JOURNAL` §8 commits                 | s’arrête à E                                                | + F `7febc34` + G `ac8371e`/`f0e5d7f` | git log                        | **Mis à jour**       |
| `CHANGELOG.md`                       | s’arrête à **2.7.1**                                        | 2.7.3–2.7.7 shippés                   | git                            | **Entrées ajoutées** |
| `README.md`                          | badge **2.7.1**, Tests **332**                              | **2.7.7**, **369**                    | package + vitest               | **Mis à jour**       |
| `LAUNCH.md`                          | 315 tests, library 47, date 04-18                           | 369 unit ; 54 library ; prod 2.7.7    | handoff + seed                 | **Header metrics**   |
| `Claude.md`/`CLAUDE.md`              | pas de vague A–G / SHA jour                                 | pointer handoff 2.7.7                 | —                              | **Bloc Latest**      |
| `docs/session/HANDOFF_NEXT.md`       | OK 2.7.7                                                    | OK                                    | —                              | Audit done note      |
| `docs/session/HANDOFF_2026-08-01.md` | checklist docs ouvertes                                     | cette mission                         | —                              | checklist cochée     |
| `index.html`                         | `softwareVersion` **2.7.1**                                 | **2.7.7**                             | live curl                      | **Fix triad**        |
| `public/changelog.json`              | `current` **2.7.0**                                         | aligner **2.7.7**                     | file                           | **Mis à jour**       |

### 2.2 Classe B — bannières (pas de réécriture totale)

| Doc                                                             | Claim                                        | Vérité                         | Action                                                   |
| --------------------------------------------------------------- | -------------------------------------------- | ------------------------------ | -------------------------------------------------------- |
| `AGENT_REPORT.md` §Remaining                                    | P1-9 EDH, etbTapped fn, MC seed **not done** | Shipés C–F                     | Bannière + remaining rewrite                             |
| `AGENT_PLAN.md`                                                 | plan “next = P0-1”                           | P0 shippés                     | Bannière historique                                      |
| `MANATUNER_AUDIT_*`                                             | P0-1… comme travail à faire                  | Shipés 2026-08-01              | Bannière                                                 |
| `MANATUNER_CURSOR_MASTER_PROMPT.md`                             | phase 0 instructions                         | Done                           | Bannière                                                 |
| `HANDOFF.md`                                                    | PRODUCTION v2.7.1                            | v2.7.7                         | Bannière → handoff jour                                  |
| `TEAM_HANDOFF.md`                                               | Version 2.6.0                                | 2.7.7                          | Bannière                                                 |
| `ACTION_TRACKER` / `FEEDBACK_TRACKER` / `QA_*` / `AUDIT_REPORT` | états datés                                  | historique                     | Bannière                                                 |
| `docs/*` etbTapped function                                     | design spec                                  | runtime boolean                | Bannière sur 3 specs clés                                |
| `docs/SEO_AEO_*` P0-1 robots…                                   | SEO backlog daté avril                       | partiellement shippé hors jour | Bannière snapshot (ne confondre pas avec P0 trust 08-01) |

### 2.3 Claims encore vrais (ne pas “fermer” à tort)

| Item                                                               | État réel                                                                    |
| ------------------------------------------------------------------ | ---------------------------------------------------------------------------- |
| P2-7 prerender HTML crawler en prod                                | **Code + soft-fail OK** ; **HTML prerendered absent** (Chromium deps Vercel) |
| SSOT dual engines ManaCostRow                                      | **Toujours dual** (inline + accel) — dette math connue                       |
| Moxfield URL / i18n FR / backend / Sentry DSN / analytics decklist | **Différé sans owner**                                                       |
| P3 land suggestions                                                | Non shippé                                                                   |
| Distribution / utilisateurs                                        | Priorité `LAUNCH.md`                                                         |

### 2.4 Classe C/D

| Zone                                  | Écart produit ?                      | Action |
| ------------------------------------- | ------------------------------------ | ------ |
| `_bmad/**`, `.claude/**`              | Non (tooling)                        | Aucune |
| LEGAL / SECURITY / CoC / CONTRIBUTING | Claims privacy client-side **vrais** | Aucune |

---

## 3. Alignement post-audit (checklist)

- [x] Inventaire find 396 fichiers
- [x] Classification A–E
- [x] Croisement git / package / code / live
- [x] SESSION_START → 2.7.7 / f0e5d7f / vague G
- [x] JOURNAL vague G + §ouvert honnête
- [x] CHANGELOG 2.7.3–2.7.7
- [x] README badges
- [x] Bannières archives / agent reports
- [x] LAUNCH metrics + Claude Latest
- [x] index.html + changelog.json version triad
- [x] HANDOFF_NEXT + HANDOFF_2026-08-01 checklist
- [x] Aucune promesse “prerender 100 % crawler en prod”

---

## 4. Priorité après ce rapport

1. **Distribution** — `LAUNCH.md` (pas de feature gratuite)
2. Optionnel tech : Chromium deps Vercel pour prerender réel ; polish ; a11y deep
3. **Ne pas** rouvrir sans owner : Moxfield URL, i18n FR, backend, Sentry DSN, analytics decklist

---

_Fin audit documentaire 2026-08-01._
