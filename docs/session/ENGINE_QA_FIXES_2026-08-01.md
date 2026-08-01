# Engine QA Fixes — 2026-08-01

|              |                                            |
| ------------ | ------------------------------------------ |
| **Baseline** | `docs/session/ENGINE_QA_2026-08-01.md`     |
| **Prompt**   | `docs/session/PROMPT_ENGINE_QA_FIXES.md`   |
| **App**      | v2.7.8 (pas de bump version / pas de push) |
| **Mode**     | Fix ciblé F1 + F2 + F3 uniquement          |

## Résumé

Les 3 findings P1/P2 du QA engine sont **corrigés** et re-validés (unit + e2e).

| ID                | Finding                           | Statut                                     |
| ----------------- | --------------------------------- | ------------------------------------------ |
| F1 EDGE-GARBAGE   | Health 100% sur noms inventés     | **PASS** — hard-fail + snackbar erreur     |
| F2 EDGE-SIDEBOARD | Banner « lands in 75 »            | **PASS** — banner / odds / format = N main |
| F3 Samples        | limited 41 / edh 101 / control 59 | **PASS** — 40 / 100 / 60                   |

## Changements (fichiers)

### FIX-SAMPLES (P2)

- **Nouveau** `src/data/sampleDecks.ts` — `SAMPLE_DECKS` extrait de `AnalyzerPage`
  - limited : retiré `Giant Adephage` → **40**
  - edh : retiré `Leyline Binding` (hors commander) → **100**
  - control : ajouté `1 Deduce` → **60**
- `src/pages/AnalyzerPage.tsx` — import `SAMPLE_DECKS`
- **Test** `src/data/__tests__/sampleDecks.counts.test.ts`

### FIX-SIDEBOARD-BANNER (P1)

- `src/components/analyzer/CastabilityTab.tsx`
  - `mainCount` / `effectiveDeckSize` / `effectiveLands` pour banner + odds
  - `landCountGuidance(..., effectiveLands, listSize)` → **« X lands in 60 »**
  - `suggestFromDeckSize(mainCount)` (plus `totalCards` = 75)
  - `ManaCostRow totalCards` / `totalLands` sur le board effectif (main, pas main+side)
- `src/pages/AnalyzerPage.tsx` — auto-format post-analyze sur taille **main**
- **E2E** `tests/e2e/core-flows/sideboard-banner-n.spec.js`

### FIX-GARBAGE (P1)

- `src/services/deckAnalyzer.ts`
  - `DeckCard.resolved` + `resolution: 'ok' | 'not_found' | 'unavailable'`
  - `fetchCardFromScryfallWithMeta` — distingue **404** vs **429/réseau**
  - `assertCardResolution()` avant le calcul d’analyse :
    - 0 cartes `ok` → throw (pas de QuickVerdict crédible)
    - majorité `not_found` → throw
    - majorité seulement `unavailable` avec land seed OK → **pas** de hard-fail (évite faux positif rate-limit)
  - snackbar existant dans `handleAnalyze` affiche le message
- **Unit** `src/services/__tests__/assertCardResolution.test.ts`
- **E2E** `tests/e2e/core-flows/garbage-deck.spec.js`

## Re-run cas FAIL du cahier

| Cas                   | Avant              | Après                                            |
| --------------------- | ------------------ | ------------------------------------------------ |
| EDGE-GARBAGE          | FAIL (Health 100)  | **PASS** (erreur resolve, pas Health 100)        |
| EDGE-SIDEBOARD banner | FAIL (lands in 75) | **PASS** (lands in 60 + scope 60 main · 15 side) |
| SAMPLE-LIMITED        | FAIL 41            | **PASS** 40                                      |
| SAMPLE-EDH            | FAIL 101           | **PASS** 100                                     |
| SAMPLE-CONTROL        | FAIL 59            | **PASS** 60                                      |

## Commandes lancées

```bash
npm run test:unit
# → 396 passed | 2 skipped (27 files)

npx playwright test \
  tests/e2e/core-flows/garbage-deck.spec.js \
  tests/e2e/core-flows/sideboard-banner-n.spec.js \
  --project=chromium --workers=1 --retries=0
# → 2 passed (~7 s)

npx playwright test \
  tests/e2e/core-flows/analyzer-happy-path.spec.js \
  tests/e2e/core-flows/p1-9-edh-verify.spec.js \
  tests/e2e/core-flows/audit-wave-c-verify.spec.js \
  --project=chromium --workers=1 --retries=0
# → 8 passed (~2 min)
```

## Hors scope (inchangé)

- Health score optimiste (14L Limited → 100%)
- type-check `MyAnalysesPage.tsx:584`
- Refactor engine K=3 / hypergeom
- Push / prod / bump version

## Self-score

| Critère                   | Note                                |
| ------------------------- | ----------------------------------- |
| Oracles manuels F1–F3     | 5/5                                 |
| Tests unit non-régression | 5/5                                 |
| E2E garbage + sideboard   | 5/5                                 |
| Robustesse Scryfall 429   | 4/5 (gate `unavailable` documentée) |
| Scope respecté            | 5/5                                 |
| **Global**                | **4.8 / 5**                         |

## Vérif manuelle recommandée (créateur)

1. http://localhost:3000/analyzer?sample=limited → banner lands in **40**
2. http://localhost:3000/analyzer?sample=edh → lands in **100**
3. http://localhost:3000/analyzer?sample=control → lands in **60**
4. EDGE-SIDEBOARD du cahier → banner **in 60**, pas 75
5. EDGE-GARBAGE → snackbar erreur, pas Health 100

**Pas de go prod** sans demande explicite.
