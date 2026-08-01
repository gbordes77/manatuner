# SESSION_START — ManaTuner (lire en premier)

> **Date de cut-over :** 2026-08-01  
> **Branche live :** `main` (vague D P1-9 EDH → push en cours / v2.7.4)  
> **Version app :** **2.7.4**  
> **Prod :** https://www.manatuner.app/  
> **Repo :** https://github.com/gbordes77/manatuner

Ce fichier est le **point d’entrée d’une nouvelle session agent**.  
Lis-le entièrement avant de coder. Détails d’historique : `JOURNAL_AUDIT_IMPLEMENTATION.md`, `AGENT_PLAN.md`, `AGENT_REPORT.md`.

---

## 0. Règles owner (OBLIGATOIRES)

1. **Local d’abord** — implémenter, vérifier sur `http://localhost:3000`.
2. **Montrer / faire valider** l’utilisateur.
3. **Prod uniquement si l’utilisateur dit explicitement « go prod »** (ou équivalent).  
   ⚠️ Une ancienne approbation de push **n’est pas** un chèque en blanc pour les vagues suivantes.
4. **Privacy / client-side** : pas de backend decklists, pas de Sentry DSN sans contrat scrubber, pas d’analytics decklist.
5. **LAUNCH.md** : le produit est déjà shippable ; prioriser ce qui aide les utilisateurs, pas les refactors gratuits.

---

## 1. Qu’est-ce que ManaTuner (1 écran)

- **Stack :** React 18 + TS + Vite + MUI + Redux Toolkit · port **3000** · Vercel.
- **Cœur :** paste deck → parse (Scryfall) → castabilité hypergeom + ramp K=3 → mulligan Monte Carlo/Bellman (worker) → manabase Karsten → Blueprint export.
- **Diff :** compte **rocks & dorks**, pas seulement les lands. 100 % local.
- **Routes clés :** `/`, `/analyzer`, `/my-analyses`, `/library`, `/guide`, `/mathematics`, `/land-glossary`.

```bash
cd "/Volumes/DataDisk/_Projects/Project Mana base V2"
npm run dev          # http://localhost:3000
npm run test:unit
npm run type-check
npx playwright test tests/e2e/core-flows/analyzer-happy-path.spec.js \
  tests/e2e/core-flows/audit-wave-c-verify.spec.js \
  tests/e2e/core-flows/p1-9-edh-verify.spec.js \
  tests/e2e/tabs/analyzer-tabs.spec.js --project=chromium
```

---

## 2. Mémoire — ce qui a été fait (audit 2026-08-01)

### Phase 0 → Vague A/B/C → **prod**

| Vague | Contenu                                             | Ship                |
| ----- | --------------------------------------------------- | ------------------- |
| A     | Worker Mulligan, P1/P2 cast, Health Score, E2E      | `25598c6`           |
| B     | Learn nav, feedback permanent, empty states, hero   | `9eef000`…`08b80a5` |
| C     | Auto-format EDH/Limited, play/draw, sideboard scope | `83efe90` (v2.7.3)  |

### Vague D — P1-9 EDH plus profond → **prod v2.7.4** (go prod owner)

| Item      | Détail                                                                 |
| --------- | ---------------------------------------------------------------------- |
| Horizon   | EDH **T5–T8** sort + chip + highlight ; Constructed/Limited T1–T4      |
| Karsten   | `scaleKarstenSources(K, N)` = round(K × N/60) sur Manabase color check |
| Caveats   | Command zone **non** modélisée ; Rule 0 / multiplayer out of scope     |
| Singleton | Heads-up non-basics qty > 1                                            |
| Tests     | unit deckFormat 15 ; E2E `p1-9-edh-verify.spec.js`                     |

**Nuance connue :** Atraxa est CMC 4 → hors chip T5–T8 (option future T4–T8).

### Commits `main` (ordre récent attendu)

```
(HEAD)  feat: EDH horizon T5–T8, Karsten N/60 scaling, command-zone caveats   ← v2.7.4
83efe90  feat: EDH/Limited auto-format, clear play-draw, sideboard scope
08b80a5  feat: Feedback CTA header + footer
…
```

---

## 3. Architecture — fichiers critiques

| Domaine                          | Fichiers                                                         |
| -------------------------------- | ---------------------------------------------------------------- |
| Format / horizon / Karsten scale | `src/utils/deckFormat.ts`                                        |
| Parse / enrich                   | `src/services/deckAnalyzer.ts` (`etbTapped` encore **fonction**) |
| Hypergeom SSOT                   | `src/services/castability/hypergeom.ts`                          |
| Ramp K=3                         | `src/services/castability/acceleratedAnalyticEngine.ts`          |
| UI cast %                        | `src/components/ManaCostRow.tsx`                                 |
| Manabase Karsten deltas          | `src/components/analyzer/KarstenTargetDelta.tsx`                 |
| Format / play-draw               | `AccelerationContext.tsx`, `AccelerationSettings.tsx`            |
| Mulligan worker                  | `mulliganArchetype.worker.ts` + `toCloneableDeckCards`           |

**Invariants math :** Perfect drops (P1) ≥ Realistic lands-only (P2) **même moteur**.

---

## 4. Backlog restant

### Priorité haute

| ID                     | Travail                                                    |
| ---------------------- | ---------------------------------------------------------- |
| **Command zone model** | Inclure commander dans les odds (pas seulement disclaimer) |
| **Horizon T4–T8?**     | Capturer CMC-4 commanders (Atraxa)                         |
| **Dette `etbTapped`**  | `() => boolean` → bool + landMetadata                      |
| **Monte Carlo seed**   | RNG seedable pour tests stables                            |
| **P1-4 suite**         | Archetype aggro/mid/control plus lisible                   |

### Priorité moyenne

| ID          | Travail                       |
| ----------- | ----------------------------- |
| P2-5        | Castability mobile            |
| P2-6 / a11y | Tooltips jargon + live region |
| P2-7        | Prerender / SSG marketing     |
| P2-1        | Polish visuel                 |

### Différé

| ID                    | Pourquoi        |
| --------------------- | --------------- |
| P1-7 Moxfield URL     | ToS / CORS      |
| i18n FR               | Gros            |
| Backend / Sentry prod | Owner + privacy |
| Analytics decklist    | Interdit        |

### Process de session type

```
1. Lire SESSION_START.md (+ LAUNCH.md si lancement)
2. git pull / vérifier main
3. npm run dev + tests
4. Implémenter UNE tranche claire
5. Montrer URL locale exacte
6. Attendre “go prod” avant push main
7. Mettre à jour SESSION_START.md + JOURNAL en fin de session
```

---

## 5. Smoke prod

1. `/analyzer` → Try Example → Analyze → 5 tabs, Mulligan OK
2. `/analyzer?sample=edh` → Commander banner, Castability T5–T8 first, Manabase targets scaled
3. `/analyzer?format=commander` → Atraxa + banner
4. `/analyzer?sample=limited` → Limited
5. Feedback header + footer

---

## 6. Message d’ouverture pour l’agent

```
Lis SESSION_START.md à la racine ManaTuner.
Respecte local → validation → go prod.
Ne re-fixe pas les vagues A–D déjà en prod sauf régression.
Propose 1–2 items du backlog §4, ou continue la priorité haute.
Mets à jour SESSION_START.md + JOURNAL en fin de session.
```

---

_Fin du point de départ. Toute nouvelle vague doit laisser une empreinte ici (date, commit, ce qui reste)._
