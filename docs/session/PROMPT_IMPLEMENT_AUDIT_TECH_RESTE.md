# PROMPT — Implémenter le reste TECH de AUDIT_EVOLUTIONS.md

> **Usage :** coller le bloc « PROMPT EXÉCUTABLE » ci-dessous dans une **nouvelle conversation** agent (Grok / Claude / etc.).  
> **Date de rédaction :** 2026-08-02  
> **Source :** `AUDIT_EVOLUTIONS.md` + re-audit code (vérité 2026-08-02)  
> **Ce fichier n’est pas encore commité** sauf ordre owner.

---

## Périmètre

### INCLUS (tout le tech restant)

| ID      | Contenu                                                                                          |
| ------- | ------------------------------------------------------------------------------------------------ |
| **T01** | redux-persist + saisie decklist                                                                  |
| **T06** | analyse tempo non bloquante (yield)                                                              |
| **T07** | batch détection terrains inconnus                                                                |
| **T08** | découpe god class `deckAnalyzer`                                                                 |
| **T09** | unifier hypergéométrique (scope recalculé post-T02)                                              |
| **T10** | zod parsing + rehydrate (reframe safe EDH)                                                       |
| **T11** | presentation hors public, wipe IDB, COEP morts, doc CSP                                          |
| **T12** | payload eager MUI icons + fonts                                                                  |
| **T13** | bornes caches + effets React                                                                     |
| **T14** | tsconfig/ESLint + convention tests (sans big-bang ESLint flat)                                   |
| **T15** | npm audit ciblé, **durcir** Dependabot (existe), clamp worker, rewrite `?d=`→`#d=`               |
| **QW1** | headers cache `library.json` / feeds / sitemap                                                   |
| **QW2** | prefetch idle/hover chunks lazy                                                                  |
| **QW3** | budget bundle bloquant en CI (seuil mesuré post-T12)                                             |
| **AM1** | gates CI : e2e core chromium + audit critical non contournable (prudent)                         |
| **AM4** | = QW1 (ne pas doubler)                                                                           |
| **AM6** | job nightly non bloquant a11y/visual **si** les scripts existent et restent non bloquants sur PR |

### EXCLUS (nouvelles fonctionnalités produit / innovations)

- **P01** UX profils joueur
- **P02** mode Commander monolithe (déjà largement livré en v2.7.x — ne pas re-coder)
- **P03** Mana Stats Card / OG dynamique
- **P04 / IN1** OCR decklist
- **IN2–IN5** suggestions lands, meta, WebLLM, Moxfield URL
- **AM2** observabilité / Sentry DSN live
- **AM3** PWA offline (garder SW killer)
- **AM5** collab temps réel
- Moxfield URL, i18n FR, backend, analytics decklist, `VITE_SENTRY_DSN`

### DÉJÀ FAIT — NE PAS REFAIRE

| ID             | Preuve                                                     |
| -------------- | ---------------------------------------------------------- |
| T02            | purge code mort + deps · commit `332501d`                  |
| T03            | SSOT landService + landSeed                                |
| T04            | landCache batch                                            |
| T05            | `fetchWithTimeout` · `src/services/http.ts`                |
| `public/sw.js` | SW killer **conservé**                                     |
| Dependabot     | `.github/dependabot.yml` **existe** — durcir, ne pas créer |
| Sécu 2.7.9     | share `#d=`, wipe localStorage, CSP docs                   |

---

## PROMPT EXÉCUTABLE (coller tel quel)

```text
RÔLE
Tu es un staff engineer TypeScript/React senior. Tu IMPLÉMENTES le reste TECHNIQUE
de AUDIT_EVOLUTIONS.md pour ManaTuner. Tu n’ajoutes AUCUNE feature produit
(P01–P04, IN*, profils, OCR, Moxfield, backend, Sentry DSN).

CONTEXTE PRODUIT
- SPA MTG manabase, 100 % client-side, privacy-first.
- Prod live : v2.7.9 @ fdef163 · https://www.manatuner.app
- Code main hygiène : 332501d (T02–T05 FAIT) — peut ne pas être en prod.
- Boot : SESSION_START.md · STATUS : docs/product/STATUS.md
- SSOT audit journal : AUDIT_EVOLUTIONS.md §7
- Brief re-audit : docs/session/PROMPT_IMPLEMENT_AUDIT_TECH_RESTE.md (ce fichier)
- Priorité business = LAUNCH.md (distribution) — mais ICI l’owner a demandé
  d’implémenter TOUT le tech restant hors nouvelles fonctionnalités.

ÉTAT DÉJÀ FAIT (ne pas re-proposer, ne pas refaire)
- T02 purge dead code + deps orphelines
- T03 SSOT terrains landService + landSeed
- T04 landCache mémoire + flush batch
- T05 fetchWithTimeout unifié Scryfall (src/services/http.ts)
- public/sw.js conservé volontairement (SW killer) — NE PAS supprimer
- Dependabot + CI unit existent (erratum AUDIT §6)
- Sécu 2.7.9 : share #d=, wipe localStorage, CSP

HORS SCOPE FORCÉ
- P01, P02 (rebuild), P03, P04, IN1–IN5
- AM2 (télémétrie), AM3 (PWA offline), AM5 (collab)
- Moxfield URL, i18n FR, backend, VITE_SENTRY_DSN, analytics decklist
- Aucun commit / push / deploy / « go prod » sans ordre explicite de l’owner

RÈGLES D’EXÉCUTION
1. Lecture d’abord : SESSION_START.md, AUDIT_EVOLUTIONS.md §7 + prompts T01/T06–T15,
   docs/session/HANDOFF_NEXT.md, SECURITY.md. Puis croiser le CODE réel (grep).
2. Comportement constant sauf où l’audit demande un correctif explicite
   (privacy wipe IDB, rewrite URL, clamp, validation, perf yield).
3. OBLIGATOIRE — non-régression après CHAQUE correctif (pas seulement en fin de vague) :
   a) Avant de coder le correctif N+1, le correctif N doit être validé.
   b) Suite de non-régression minimale à chaque correctif (dans cet ordre) :
      - npm run type-check
      - npm run lint
      - npm run test:unit
      - Si le correctif touche moteur/parse/lands/hypergeom/mulligan :
        npm run test:mtg-logic et/ou npm run test:mana-calc SI ces scripts existent
        (sinon les suites Vitest équivalentes déjà dans test:unit).
      - Si le correctif touche UI critique (Analyzer saisie, share URL, privacy wipe,
        bundle/fonts Home) : smoke manuel ou e2e ciblé SI disponible
        (npm run test:core-flows ou test e2e fichier concerné) — noter SKIP + raison
        si Playwright indisponible, sans inventer un vert.
   c) Ajouter ou adapter des tests unitaires de NON-RÉGRESSION pour le correctif :
      - cas nominal (comportement actuel conservé)
      - cas bord / échec (timeout, storage corrompu, qty invalide, annulation, etc.)
      - fixture deck réelle si math/parse (constructed + EDH si pertinent)
   d) Interdit d’enchaîner le correctif suivant tant que (b)+(c) ne sont pas verts.
   e) Dans le rapport final, chaque ID doit lister : tests ajoutés + commande(s)
      de non-régression exécutées + résultat.
4. Après T12 (et avant QW3) : npm run build et noter les tailles dist/assets
   (eager / vendor-mui / index) pour fixer le seuil budget. Build = aussi
   non-régression pour tout correctif touchant vite.config / index.html / chunks.
5. Ne pas casser les invariants STATUS :
   etbTapped boolean · toCloneableDeckCards · hypergeom SSOT log-space ·
   Karsten N/60 · EDH T4–T8 · P1≥P2 · share hash · wipe · land SSOT ·
   Scryfall via http.ts · SW killer conservé.
6. Docs en fin de vague (pas au milieu) : mettre à jour AUDIT_EVOLUTIONS.md §7,
   docs/session/HANDOFF_NEXT.md, docs/product/STATUS.md, CHANGELOG.md (Unreleased).
7. INTERDIT : commit, push, git tags, deploy Vercel, npm publish — jusqu’à
   « commit » / « push » / « go prod » explicite de l’owner.
8. Rapport final en français : tableau ID | statut | fichiers | tests non-régression | notes.

ORDRE D’IMPLÉMENTATION (strict — séquentiel sauf notes)

═══════════════════════════════════════════════════════════════
VAGUE A — Persistance & saisie (T01) + quick win cache (QW1)
═══════════════════════════════════════════════════════════════

### A1 — T01 (P1 Perf/Archi) : redux-persist + saisie decklist

Fichiers :
- src/store/index.ts
- src/store/slices/analyzerSlice.ts (lecture)
- src/components/analyzer/DeckInputSection.tsx
- src/pages/AnalyzerPage.tsx (flush si besoin)
- tests unit store / debounce

Constat code actuel (2026-08-02) :
- createTransform strip snackbar + isAnalyzing SEULEMENT — analysisResult EST encore persisté
- DeckInputSection onChange → setDeckList à chaque frappe (pas de debounce)
- PrivacyStorage.saveAnalysis double-persiste l’analyse (OK, à conserver)

À faire :
1. createTransform : EXCLURE analysisResult à la sérialisation ; à la rehydrate
   forcer analysisResult: null (ou initial).
2. version persist : 1 → 2 + migration qui purge analysisResult des anciens blobs.
3. Debounce 300 ms sur setDeckList dans DeckInputSection :
   - state local immédiat pour le TextField
   - dispatch setDeckList après 300 ms d’inactivité
   - cleanup timer unmount
   - bouton Analyser / handleAnalyze : FLUSH synchrone de la valeur locale
     avant analyse (ne jamais analyser une decklist stalle)
4. Conserver survie de deckList + deckName + activeTab + isDeckMinimized au reload.
5. Tests : transform exclut analysisResult ; migration v2 ; flush avant analyze.

Validation : type-check + lint + test:unit.

### A2 — QW1 (+ AM4) : headers cache données publiques

Fichier : vercel.json UNIQUEMENT.

Ajouter Cache-Control pour (sources exactes à matcher sur dist/) :
- /library.json
- /library/feed.xml (et autres feeds générés si présents)
- /llms.txt /llms-full.txt si servis
- /changelog.json si présent
- /sitemap.xml

Valeur recommandée :
  public, s-maxage=86400, stale-while-revalidate=604800

NE PAS assouplir no-cache sur /index.html ni /sw.js.
Ne pas toucher CSP.

Validation : relecture vercel.json ; build non requis mais souhaitable.

═══════════════════════════════════════════════════════════════
VAGUE B — Perf analyse (T06, T07)
═══════════════════════════════════════════════════════════════

### B1 — T06 : analyse tempo non bloquante

Fichiers :
- src/services/manaCalculator.ts (analyzeSpellCastability)
- src/services/deckAnalyzer.ts (boucle tempo ~1410+)
- tests non-régression fixtures si existants

À faire :
1. Rendre analyzeSpellCastability SYNCHRONE (retirer async/Promise) — aucun await
   dans le corps aujourd’hui.
2. Boucle sorts : yield tous les N=10 sorts via scheduler.yield() si dispo,
   sinon await new Promise(r => setTimeout(r, 0)).
3. Token d’annulation (AbortSignal ou génération incrémentale) : une nouvelle
   analyse stoppe la boucle au prochain yield sans unhandled rejection.
4. Résultats numériques identiques (mêmes entrées → mêmes sorties, même ordre).
5. Erreur sur un sort : continuer les autres (comportement actuel try/catch).

Validation : type-check + test:unit (+ test:mtg-logic si script existe).

### B2 — T07 : batch terrains inconnus

Fichiers :
- src/services/deckAnalyzer.ts (parse loop landService.detectLand)
- src/services/landService.ts
- src/services/scryfall.ts (fetchLandDataBatch — déjà exporté, jamais appelé)

À faire :
1. Avant boucle parsing : collecter noms absents du seed/cache sync, dédupliquer.
2. UN batch POST /cards/collection via fetchLandDataBatch (chunks 75, rate-limit
   existant, fetchWithTimeout de http.ts).
3. Peupler caches ; parsing ensuite synchrone/sync path autant que possible.
4. not_found → fallback /cards/named individuel + cache négatif.
5. Échec batch → fallback séquentiel actuel (pas de régression).
6. Deck 100 % seed : ZERO requête land supplémentaire.

Tests : batch groupé, chunk 75, not_found, fallback.

═══════════════════════════════════════════════════════════════
VAGUE C — Archi (T09 puis T08)
═══════════════════════════════════════════════════════════════

### C1 — T09 (scope RECALCULÉ — advancedMaths EST MORT)

NE PAS chercher advancedMaths.ts.

Fichiers :
- src/services/castability/hypergeom.ts (SSOT — garder)
- src/services/deckAnalyzer.ts : private static calculateHypergeometric + combination
  (~1051–1094) → REMPLACER par hypergeom.atLeast / hypergeom.pmf
- src/services/manaCalculator.ts : calculateHypergeometric wrapper — soit
  simplifier en délégation directe hypergeom (OK), soit laisser si déjà correct
  (il délègue déjà via ManaCalculator → hypergeom). Préférer un import direct
  unique pour les call sites simples.
- Tests parité : grille N,K,n,k bords + fixture EDH 100c

Contrainte : écart < 1e-12 ou documenter si l’ancienne combination float diverge
(dans ce cas GARDER hypergeom log-space et adapter les tests).

### C2 — T08 : découpe deckAnalyzer (comportement constant)

Fichiers :
- src/services/deckAnalyzer.ts (~1688 lignes aujourd’hui)
- Créer : src/services/deckParser.ts (parsing pur)
- Créer : src/services/cardResolver.ts (résolution Scryfall → réutiliser
  scryfall.ts BoundedMap + IDB ; supprimer fetchs/caches mémoire dupliqués
  dans DeckAnalyzer si possible sans changer le contrat public)
- deckAnalyzer.ts = orchestration analyses uniquement
- Mettre à jour imports AnalyzerPage / tests

Contraintes :
- Mêmes entrées → mêmes sorties (fixtures tests/fixtures/)
- NE PAS re-toucher land lists (T03 FAIT) ni hypergeom (T09 déjà fait)
- Signatures publiques utilisées par l’UI : conserver ou adapter tous les imports
- test:unit + type-check + lint verts

Si trop risqué en un seul PR logique : livrer d’abord deckParser pur + tests,
puis cardResolver, puis slim orchestration — toujours sans commit tant qu’owner
n’a pas dit commit.

═══════════════════════════════════════════════════════════════
VAGUE D — Sécu / privacy (T10, T11, T15 partiel)
═══════════════════════════════════════════════════════════════

### D1 — T10 : validation zod (REFRAME SAFE)

PIÈGE : src/lib/validations.ts cardSchema max(4) casse EDH/singleton.
NE PAS brancher deckSchema/cardSchema naïvement sur le parser principal.

À faire :
1. parseDecklistText (scryfall.ts) : bornes qty 1–99 (ou 1–250 pour EDH bulk),
   nom 1–200 après sanitizeString ; lignes invalides skip + compteur optionnel.
2. Rehydrate redux-persist : schema SLIM (deckList string, deckName string,
   activeTab number, isDeckMinimized bool, analysisResult always null) —
   safeParse ; échec → initialState + purge clé corrompue.
3. Marquer @deprecated ou supprimer schémas vraiment inutilisables qui donnent
   une illusion de validation (userProfile email, etc. si zéro import) — grep
   d’abord, ne supprimer que si 0 refs.
4. privacy.ts import analyses : déjà zod — ne pas casser.

Tests : qty hors bornes ; storage corrompu ; formats Arena/Moxfield non régressifs.

### D2 — T11 : aligner CSP docs, presentation, wipe IDB, COEP

1. CSP/Sentry : vérifier SECURITY.md + commentaire main.tsx — documenter que
   activer VITE_SENTRY_DSN exige connect-src *.ingest.sentry.io. NE PAS activer
   Sentry ni élargir CSP en prod tant que DSN unset.
2. public/presentation.html : fichier UNTRACKED avec <script> inline cassé par CSP.
   ACTION : déplacer hors de public/ (ex. tools/presentation.html ou docs/)
   pour qu’il ne parte PLUS en dist/. Ne pas le « fixer » pour prod sauf owner.
3. privacy clearAllLocalData : appeler clearPersistentScryfallCache()
   (scryfallPersistentCache.ts) via Promise.allSettled — wipe localStorage
   continue même si IDB échoue. Adapter appelants (async si besoin) + test
   privacy.clearAll.test.ts mock idb.
4. vercel.json : retirer headers COEP/COOP sur /workers/* (dossier workers public
   supprimé en T02 — headers morts).

### D3 — T15 (reframe) : hygiène + durcissements

1. npm audit : corriger high/critical patch/minor SAFE uniquement ; documenter
   majors (ESLint 8, html2canvas, vercel CLI) SANS forcer major.
2. .github/dependabot.yml : DURCIR (groups patch/minor, ignore majors react/@mui)
   — NE PAS recréer le fichier from scratch.
3. mulliganArchetype.worker.ts : clamp iterations (ex. min 1000, max 200000) ;
   hors bornes → clamp + message warning dans response si le type le permet.
4. urlCodec parseShareParams : si lecture legacy ?d= réussit, history.replaceState
   vers #d= et strip query d= (decklist hors logs edge après 1ère lecture).
   Liens hash existants inchangés.

Tests : clamp iterations ; rewrite URL legacy ; décodage hash + query.

═══════════════════════════════════════════════════════════════
VAGUE E — Perf payload & mémoire (T12, T13)
═══════════════════════════════════════════════════════════════

### E1 — T12 : alléger payload eager

Fichiers : vite.config.ts manualChunks, index.html fonts.

1. Sortir @mui/icons-material de vendor-mui eager (chunk séparé ou follow lazy).
2. Fonts : ne pas casser CSP — Cinzel a déjà un historique onload bloqué par CSP
   (commentaire index.html). Préférer preload + font-display=swap via Google
   CSS existant ; mana.css : évaluer non-bloquant SANS inline onload interdit CSP.
3. Mesurer dist/assets avant/après ; reporter tailles.

Validation : build + e2e core-flows SI disponibles localement (sinon noter skip).

### E2 — T13 : caches & effets React

1. landDataCache (scryfall.ts) → BoundedMap (même fichier, cap raisonnable ≥200).
2. useCardImage : borner imageCache ; cleanup timeout + abort à unmount
   (useEffect return) ; pas de setState post-unmount.
3. NotificationProvider : useMemo contextValue + useCallback handlers.
4. keyframes float : un seul partage + prefers-reduced-motion: reduce.

═══════════════════════════════════════════════════════════════
VAGUE F — Tooling & CI (T14, QW2, QW3, AM1, AM6)
═══════════════════════════════════════════════════════════════

### F1 — T14 : outillage (prudent)

1. tsconfig : moduleResolution "bundler" ; activer noUnusedLocals /
   noUnusedParameters ; corriger erreurs (préfixe _ params intentionnels).
2. ESLint : no-explicit-any → "warn" (pas error) ; PAS de migration flat config
   forcée si risquée — documenter ticket si reporté.
3. Convention tests : documenter dans CLAUDE.md ou docs (src/services/*.test.ts
   vs __tests__/) — fusion manaCalculator DÉJÀ faite en T02, ne pas re-fusionner.
4. vite esbuild.drop console : restreindre à production si actuellement aussi en
   dev (vérifier vite.config.ts) pour que warn/error reviennent en dev.

Chaque resserrement = type-check + lint + test:unit verts.

### F2 — QW2 : prefetch idle/hover

- Home / Header : requestIdleCallback (fallback setTimeout) import() AnalyzerPage
  et/ou hover sur liens nav vers /analyzer.
- Ne pas gonfler eager bundle.

### F3 — QW3 : budget bundle CI

- Après T12 : noter poids eager (index + vendors dans dist/index.html).
- pr-validation.yml : assertion échec si eager > seuil (ex. baseline_post_T12 + 5 %)
  ou chunk monstre > 600 KB.
- Script shell/node minimal, pas de nouvelle infra.

### F4 — AM1 (prudent) + AM6

AM1 :
- Ajouter job CI optionnel ou step : npm run test:core-flows (chromium only)
  SI stable et < 10 min ; sinon documenter flaky et job nightly non bloquant.
- npm audit : continue-on-error false UNIQUEMENT pour severity critical
  (garder flexibility sur moderate) — ne pas bloquer le repo sur noise.
- Couverture : seuil soft sur src/services/ SEULEMENT si déjà proche ; sinon
  documenter sans inventer un % irréaliste.

AM6 :
- Nightly non bloquant a11y/visual SI scripts package.json existent.
- Ne jamais bloquer PR main sur visual flaky.

═══════════════════════════════════════════════════════════════
VAGUE G — Docs session (sans commit)
═══════════════════════════════════════════════════════════════

Mettre à jour (fichiers uniquement, pas de git commit) :
1. AUDIT_EVOLUTIONS.md §7 — journal T01, T06–T15, QW*, AM* traités
2. docs/session/HANDOFF_NEXT.md — état post-implémentation
3. docs/product/STATUS.md — tests count, SHA local si commit plus tard
4. CHANGELOG.md — section Unreleased technique
5. SESSION_START.md si commandes/tests count changent

GATE NON-RÉGRESSION (après CHAQUE ID : T01, QW1, T06, T07, …) — OBLIGATOIRE
  [ ] Tests unit de non-régression ajoutés/adaptés (nominal + bord)
  [ ] npm run type-check  → vert
  [ ] npm run lint        → vert
  [ ] npm run test:unit   → vert
  [ ] Scripts mtg/mana-calc si moteur touché → vert
  [ ] e2e/smoke si UI critique touchée → vert ou SKIP documenté
  [ ] SEULEMENT ALORS passer à l’ID suivant

RAPPORT FINAL (obligatoire)
Tableau :
| ID | Statut | Fichiers clés | Tests NR ajoutés | Commandes NR + résultat | Notes |

Puis :
- Tailles bundle avant/après T12
- Liste des décisions owner encore ouvertes (deploy, PWA, etc.)
- Confirmation : AUCUN commit/push effectué
- Confirmation : aucun correctif n’a sauté la gate non-régression

VALIDATION GLOBALE FINALE (en plus des gates par correctif)
  npm run type-check
  npm run lint
  npm run test:unit
  npm run build
  (optionnel) npm run test:core-flows si Playwright OK.

COMMENCE
1. Confirmer lecture §7 + inventaire exclus/inclus
2. Vérifier T02–T05 toujours verts (smoke non-régression baseline)
3. Enchaîner Vague A → G — gate NR après CHAQUE correctif
4. Stop avant commit ; attendre ordre owner
```

---

## Comment l’owner lance

1. Ouvrir une **nouvelle** session agent.
2. Coller le bloc **PROMPT EXÉCUTABLE**.
3. Laisser finir jusqu’au rapport final.
4. Review manuelle / smoke local `http://localhost:3000`.
5. Seulement ensuite : « commit » puis éventuellement « push » / « go prod ».

## Ordre de commit suggéré (plus tard, pas maintenant)

Si l’implémentation est trop grosse pour un seul commit, découper après coup :

1. `fix(perf): T01 persist + QW1 cache headers`
2. `fix(perf): T06 yield tempo + T07 batch lands`
3. `refactor: T09 hypergeom + T08 split deckAnalyzer`
4. `fix(security): T10 validation + T11 wipe/IDB + T15 url/worker`
5. `perf: T12 bundle + T13 caches`
6. `chore: T14 tooling + CI QW2/QW3/AM1`

---

## Rappel business

Implémenter ce backlog **ne remplace pas** `LAUNCH.md`.  
Après merge/ship hygiène : **distribution** reste P0.
