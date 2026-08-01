# PROMPT — Engine QA Fixes (post Ultimate Engine QA)

> **Usage :** copier-coller le bloc « PROMPT À COLLER » dans une **nouvelle conversation**.  
> **Baseline QA :** `docs/session/ENGINE_QA_2026-08-01.md` + `docs/session/CAHIER_TESTS_ENGINE.md`  
> **Prod :** https://www.manatuner.app · **Dev :** http://localhost:3000 · **v2.7.8**  
> **Mode :** fix ciblé P1 + samples P2 · pas de refonte engine · pas de feature gratuite  
> **Créé :** 2026-08-01

---

## Phrase de lancement (courte)

```
Lis et exécute en entier docs/session/PROMPT_ENGINE_QA_FIXES.md
(section « PROMPT À COLLER »).

Mission = corriger les 3 findings P1/P2 du rapport ENGINE_QA_2026-08-01
(garbage hard-fail, banner sideboard N=main, samples 40/100/60).
Tests + re-run des cas FAIL du cahier. Rapport en français.
```

---

## Plan des fixes (référence créateur — ne pas coller)

### Priorité d’exécution

| Ordre | ID                                        | Sévérité   | Effort         | Impact user                                |
| ----: | ----------------------------------------- | ---------- | -------------- | ------------------------------------------ |
|     1 | **FIX-SAMPLES**                           | P2         | S (~15–30 min) | Demos / LAUNCH / Discord screenshots       |
|     2 | **FIX-SIDEBOARD-BANNER**                  | P1         | M (~30–60 min) | Confiance format + land % affiché          |
|     3 | **FIX-GARBAGE**                           | P1         | M–L (~1–2 h)   | Trust : ne plus valider une liste inventée |
|     4 | **TESTS**                                 | —          | M              | Non-régression                             |
|     — | Health score optimiste (14L Limited 100%) | P2 produit | L              | **Hors scope** sauf « go health »          |
|     — | type-check MyAnalysesPage                 | P3         | S              | **Hors scope** sauf mention                |

### FIX-SAMPLES — Card counts seed UI

|              |                                                                                                                                                                                      |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | --- | ----------------------------------------------------- | --- | ---------- |
| **Symptôme** | `?sample=limited` = **41** · `?sample=edh` = **101** · `?sample=control` = **59**                                                                                                    |
| **Attendu**  | limited **40** · edh **100** · control **60** (aggro/midrange déjà OK)                                                                                                               |
| **Fichier**  | `src/pages/AnalyzerPage.tsx` — objet `SAMPLE_DECKS`                                                                                                                                  |
| **Action**   | Compter chaque ligne `qty` ; retirer ou ajouter 1 carte pour coller le total légal. Préférer retirer un spell non-critique (pas le commander, pas un land de moins que la guidance). |
| **Oracle**   | Script ou test : `sum(qty) === 40                                                                                                                                                    | 60  | 100` pour chaque key. UI : banner « X lands in \*\*40 | 60  | 100\*\* ». |
| **Risque**   | Faible. e2e `sample=edh` / limited doivent toujours passer.                                                                                                                          |

**Comptage de référence (audit 2026-08-01) :**

```
limited  → 41  (retirer 1 non-land, ex. Giant Adephage ou 1 spell redondant)
edh      → 101 (retirer 1 non-land hors commander, ou 1 land si >38 lands)
control  → 59  (ajouter 1 carte cohérente UW)
```

### FIX-SIDEBOARD-BANNER — N affiché = main

|              |                                                                                                                                                                    |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Symptôme** | Scope odds : « 60 main · 15 side · maindeck only » ✅ mais banner « **20 lands in 75** » ❌                                                                        |
| **Attendu**  | Tout affichage format / land count / detect family pour castabilité utilise **N main** (et lands main), pas main+side.                                             |
| **Repro**    | Coller fixture `EDGE-SIDEBOARD` du cahier → Analyze → lire `format-family-banner`                                                                                  |
| **Suspects** | `CastabilityTab.tsx` (`format-family-banner`) · `landCountGuidance` · props `totalCards` / `analysisResult.totalCards` · `AccelerationContext.suggestFromDeckSize` |
| **Action**   | Brancher le banner (et auto-format si besoin) sur **main deck size** quand sideboard détecté + mode main only. Ne pas casser le toggle post-board.                 |
| **Oracle**   | Banner contient `lands in 60` (ou « 20 lands in 60 »), **pas** 75. `sideboard-scope` reste correct.                                                                |
| **Risque**   | Moyen : ne pas double-compter ; ne pas faire basculer un 60+15 en Limited.                                                                                         |

### FIX-GARBAGE — Hard-fail cartes introuvables

|                       |                                                                                                                                                                  |
| --------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Symptôme**          | Liste 100 % inventée → Health **100%**, Limited 28, 0 lands, lignes de sorts fantômes                                                                            |
| **Attendu**           | Message clair (snackbar / alert) type « could not resolve cards / cards not found » ; **pas** de QuickVerdict Health crédible ; pas de castabilité « Excellent » |
| **Repro**             | `EDGE-GARBAGE` du cahier                                                                                                                                         |
| **Suspects**          | `src/services/deckAnalyzer.ts` (résolution Scryfall exact/fuzzy) · `AnalyzerPage` post-analyze · `QuickVerdict` si 0 spells réels / 0 lands                      |
| **Action (minimale)** | Si **0 cartes résolues** (ou ratio résolues/total &lt; seuil, ex. 0) → abort analyze + erreur UI. Option soft : si &gt;50 % not found, warning bloquant.         |
| **Oracle**            | `EDGE-GARBAGE` : pas de Health 100 ; message d’erreur visible ; pas de crash.                                                                                    |
| **Risque**            | Moyen : ne pas bloquer les listes partielles légitimes (1 carte typo + 59 OK). Préférer fail si **aucune** carte résolue, et warning fort si majorité not found. |

### Tests à ajouter (avec les fixes)

| Fichier proposé                                                     | Contenu                                                              |
| ------------------------------------------------------------------- | -------------------------------------------------------------------- |
| `src/pages/__tests__/sampleDecks.counts.test.ts` _ou_ export counts | assert totals limited=40, edh=100, control=60, aggro=60, midrange=60 |
| `tests/e2e/core-flows/sideboard-banner-n.spec.js`                   | paste EDGE-SIDEBOARD → banner `in 60` not `in 75`                    |
| `tests/e2e/core-flows/garbage-deck.spec.js`                         | garbage → no Health Score 100 / error visible                        |
| Unit optionnel                                                      | analyze rejects empty resolution                                     |

### Hors scope (ne pas faire sans ordre)

- Refonte health score (malus 14 lands Limited)
- Features Library / SEO / Moxfield / i18n FR / Sentry DSN
- Refactor engine K=3 / hypergeom
- Bump version / push / prod sauf demande explicite

### Definition of Done

- [ ] 3 fixes codés + vérifiés manuellement sur localhost:3000
- [ ] `npm run test:unit` green (ou régression justifiée)
- [ ] Re-run cas FAIL du cahier : EDGE-GARBAGE, EDGE-SIDEBOARD, SAMPLE-\* counts
- [ ] e2e core chromium (happy-path + edh) toujours green
- [ ] Note courte dans rapport ou HANDOFF si demandé
- [ ] **Pas de push/prod** sans « go prod »

---

## PROMPT À COLLER (début)

```
# MISSION — Fix Engine QA findings (ManaTuner v2.7.8)

Tu es un **engineer senior** sur ManaTuner. Tu n’es PAS en mode exploration large :
tu **corriges uniquement** les findings du rapport QA engine du 2026-08-01.

## Lire d’abord (ordre strict)
1. `docs/session/ENGINE_QA_2026-08-01.md` — §0, §3 (F1 F2 F3), §8
2. `docs/session/CAHIER_TESTS_ENGINE.md` — fixtures EDGE-GARBAGE, EDGE-SIDEBOARD, samples
3. `docs/session/PROMPT_ENGINE_QA_FIXES.md` — plan détaillé (ce fichier, section « Plan des fixes »)
4. `Claude.md` — invariants (ne pas casser etbTapped, hypergeom SSOT, privacy, P1≥P2)

## Contexte produit
- Stack : React 18 + TS + Vite + MUI · port **3000**
- Engine stamp UI : Engine vX.Y.Z
- 100 % client-side · Scryfall pour resolve noms
- **Cœur math OK** (hypergeom, Karsten N/60, horizons 40/60/100, EDH cmd zone) — **ne pas refactorer le moteur**

## Scope FIX (3 items obligatoires)

### 1) FIX-SAMPLES (P2, faire en premier — facile / haute visibilité demos)
**Fichier :** `src/pages/AnalyzerPage.tsx` → `SAMPLE_DECKS`

| sample key | total actuel (audit) | cible |
|------------|----------------------|-------|
| limited    | 41                   | **40** |
| edh        | 101                  | **100** |
| control    | 59                   | **60** |
| aggro, midrange | 60              | 60 (ne pas casser) |

- Compter les quantités ligne par ligne.
- Ajuster en ±1 carte cohérente (ne pas retirer le `*CMDR*` Atraxa).
- Vérifier en UI : `/analyzer?sample=limited|edh|control` → banner « lands in 40|100|60 ».
- Ajouter un test unit qui assert les totals (export helper ou parse des listes).

### 2) FIX-SIDEBOARD-BANNER (P1)
**Repro :** fixture EDGE-SIDEBOARD du cahier (60 main + Sideboard 15).

**Bug :** `data-testid=sideboard-scope` dit correctement « 60 main · 15 side · maindeck only »,
mais `data-testid=format-family-banner` (ou équivalent) affiche encore **« lands in 75 »**.

**Fix :** le land count / N affiché pour format family + guidance doit utiliser la **taille main**
(quand sideboard détecté et scope main only). Odds déjà sur main — aligner l’UI.

**Fichiers suspects :** `CastabilityTab.tsx`, `deckFormat.ts` (`landCountGuidance`),
chaîne `analysisResult.totalCards`, `AccelerationContext` si suggestFromDeckSize reçoit 75.

**Oracle :** banner contient un total **60**, pas 75. Toggle post-board non cassé.

### 3) FIX-GARBAGE (P1)
**Repro :**
```

4 NotARealCardXYZ123
4 CompletelyFakeSpell99
20 ImaginaryLandFoo

````

**Bug :** Health Score **100%**, Limited 28, 0 lands — faux succès.

**Fix minimal acceptable :**
- Si **0 cartes résolues** via Scryfall → ne pas afficher une analyse « Excellent » ;
  snackbar/alert d’erreur claire (cards not found / could not resolve).
- Si **majorité** not found : warning fort (idéalement bloquant ou très visible).
- Ne pas bloquer une liste où 1 carte a un typo et le reste résout.

**Fichiers suspects :** `src/services/deckAnalyzer.ts`, flux analyze dans `AnalyzerPage.tsx`,
`QuickVerdict.tsx` (garde-fou si empty/unresolved).

**Oracle :** EDGE-GARBAGE → pas de Health 100 crédible ; message d’erreur ; pas de crash.

## Tests & validation (obligatoire)

```bash
npm run dev                    # http://localhost:3000
npm run test:unit
# e2e cœur (chromium) :
npx playwright test tests/e2e/core-flows/analyzer-happy-path.spec.js \
  tests/e2e/core-flows/p1-9-edh-verify.spec.js \
  tests/e2e/core-flows/audit-wave-c-verify.spec.js --project=chromium
````

**Re-run manuel (cahier) :**

1. EDGE-GARBAGE → FAIL→PASS
2. EDGE-SIDEBOARD → banner N=60
3. sample limited / edh / control → counts 40 / 100 / 60
4. Smoke : sample midrange + sample edh analyze OK (régression)

## Livrables

1. Code des 3 fixes
2. Tests auto (au minimum counts samples ; idéalement e2e garbage + sideboard banner)
3. Note courte `docs/session/ENGINE_QA_FIXES_YYYY-MM-DD.md` :
   - ce qui a changé (fichiers)
   - re-run PASS/FAIL
   - commandes lancées
   - self-score

## Interdits

- Pas de refactor engine « pour le plaisir »
- Pas de health-score redesign (P2 produit) sauf si le créateur dit « go health »
- Pas Moxfield / i18n FR / backend / Sentry DSN / analytics decklist
- Pas de push / prod / bump version sans demande explicite
- Pas de casser : etbTapped boolean, toCloneableDeckCards, hypergeom SSOT, P1≥P2, privacy

## Ordre de travail

1. FIX-SAMPLES + test counts
2. FIX-SIDEBOARD-BANNER + vérif manuelle EDGE-SIDEBOARD
3. FIX-GARBAGE + vérif manuelle EDGE-GARBAGE
4. unit + e2e core
5. Note de fin de session

## Barème

Refuser de clôturer si :

- un des 3 oracles manuels FAIL encore
- unit suite rouge pour une raison non justifiée
- e2e EDH/happy-path cassés

Go. Commence par lire le rapport QA + compter les SAMPLE_DECKS, puis fix samples.

```

## PROMPT À COLLER (fin)

---

## Phrase de relance post-fix (si besoin)

```

Relance docs/session/PROMPT*ENGINE_QA_FIXES.md.
Baseline : docs/session/ENGINE_QA_FIXES*<date>.md — re-run uniquement les cas encore FAIL.

```

---

## Checklist créateur (après la session fix)

- [ ] limited / edh / control samples = 40 / 100 / 60
- [ ] EDGE-SIDEBOARD banner = main N
- [ ] EDGE-GARBAGE = erreur, pas Health 100
- [ ] unit + e2e core green
- [ ] Décider : go prod ? go health score P2 ? mise à jour HANDOFF ?
```
