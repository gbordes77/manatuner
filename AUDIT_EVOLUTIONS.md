# AUDIT_EVOLUTIONS.md — ManaTuner v2.7.9

> Audit technique exhaustif réalisé en lecture seule sur `src/`, `scripts/`, `public/` et les configurations racine (~48 000 lignes TS/TSX). `node_modules`, `dist/`, `coverage/`, `playwright-report/` exclus du périmètre. Chaque constat est adossé à des références `fichier:ligne` vérifiables.

---

## 1. État des Lieux de l'Architecture

### Stack & Patterns

**Stack** : React 18.3 + TypeScript 5.9 + Vite 7, MUI 5.11/Emotion, Redux Toolkit + redux-persist, @tanstack/react-query 5 (configuré mais inutilisé), zod 3, Sentry 10 (désactivé par défaut), Vitest 4 + Playwright. Déploiement Vercel avec prerender Playwright.

**Cohérence globale — bonne.** La séparation des dossiers est nette (`components/`, `pages/`, `services/`, `store/`, `hooks/`, `contexts/`, `utils/`, `types/`, `workers/`). Le lazy loading est discipliné (routes en `React.lazy` dans `src/App.tsx:76-104`, onglets de l'analyzer lazy dans `src/pages/AnalyzerPage.tsx:40-52`), le Monte Carlo mulligan tourne réellement dans un Web Worker avec pattern request-id anti-race (`src/workers/mulliganArchetype.worker.ts`, `src/components/analyzer/MulliganTab.tsx:876-945`), et la memoïsation est appliquée sur les composants chauds (`CastabilityTab`, `ManaCostRow`, `AccelerationContext.tsx:248-275`).

**DRY — c'est là que la dette se concentre.** Le projet souffre d'une dette _archéologique_ : couches d'itérations successives jamais nettoyées.

- **React Query : infrastructure morte.** `src/main.tsx:98-119` configure un `QueryClient` complet (staleTime, gcTime, retries) et monte le provider (`main.tsx:175,181`), mais **aucun `useQuery`/`useMutation` n'existe dans `src/`**. Toute la donnée Scryfall passe par des caches maison triplés : `BoundedMap` LRU dans `scryfall.ts:26-54`, un second cache mémoire dans `deckAnalyzer.ts:43`, et `landCacheService` (localStorage). ~40 KB de dépendance morte dans le chunk principal et une source de confusion permanente sur « où vont les données ».
- **Code mort massif (~2 000 lignes + fichiers publics).** `src/utils/landDetectionComplete.ts` (133 l., zéro import), `src/utils/hybridLandDetection.ts` (271 l.) + `src/utils/intelligentLandAnalysis.ts` (225 l.) en chaîne morte — contenant en prime un `scryfallCache` **non borné** (`hybridLandDetection.ts:6`) et un fetch Scryfall dupliqué —, `src/services/advancedMaths.ts` (566 l., utilisé uniquement par les tests), `src/components/analysis/MonteCarloResults.tsx`, `TurnByTurnAnalysis.tsx`, `src/components/performance/OptimizedComponents.tsx` (385 l., zéro import), `src/services/mulliganSimulator.ts` (119 l., couche compat pour deux fichiers de tests), `public/workers/*.js` (jamais référencés), `public/sw.js` (jamais enregistré — `main.tsx:77-95` désenregistre tous les SW). Conséquences collatérales : `@mui/lab`, `react-window` et `react-virtualized-auto-sizer` sont des dépendances mortes (`package.json:59,76-77`).
- **Quatre copies codées en dur des listes de terrains.** `src/utils/landDetection.ts:2`, `src/components/analyzer/landUtils.ts:43`, listes inline dans `src/services/deckAnalyzer.ts:1660-1702` et `src/services/manaCalculator.ts:53-60` — alors qu'une vraie source de vérité existe (`src/data/landSeed.ts`, 2 536 l. + `landService.ts`). Le commentaire « Synchronisée avec landDetection.ts » (`landDetectionComplete.ts:3`) avoue une synchronisation manuelle déjà désynchronisée.
- **Hypergéométrique implémentée/wrappée 4 fois.** Source déclarée : `src/services/castability/hypergeom.ts`. Mais `deckAnalyzer.ts:1059` ré-implémente un `private static calculateHypergeometric`, `manaCalculator.ts:20-33` wrappe via une classe instanciée à chaque appel, `advancedMaths.ts:66,537` re-wrappe encore.
- **Heuristiques cassées dans du code exporté.** `manaCalculator.ts:53-60` détecte les terrains par `name.includes('Vents') || name.includes('Tarn')` ; `analyzeDeckConsistency` (`manaCalculator.ts:96`) filtre sur `'Mountain'`/`'Island'`. Ce code n'est appelé que par les tests — qui donc **verrouillent un comportement faux**.

**Couplage — modéré mais mal outillé.** `src/services/deckAnalyzer.ts` est une god class de 1 713 lignes (classe statique `DeckAnalyzer`, `:284`) mêlant parsing, réseau Scryfall dupliqué (`batchFetchFromScryfall:46-79`, `fetchCardFromScryfallWithMeta:305` — cache mémoire séparé qui ne bénéficie pas du cache IDB persistant), détection de terrains et analyses tempo. Plusieurs composants dépassent 1 000 lignes (`ManaCostRow.tsx` 1146, `MulliganTab.tsx` 1192, `HomePage.tsx` 1390, `ReferenceArticlesPage.tsx` 1695). Trois mécanismes de persistance coexistent sans convention écrite (redux-persist, persistance manuelle dans `AccelerationContext.tsx:113-143`, persistance services/hooks). Enfin, le typage est globalement sérieux (22 `any` sur 48k lignes, zéro `@ts-ignore`) mais l'outillage laisse passer la dette : `tsconfig.json:11` en `moduleResolution: "node"` au lieu de `"bundler"`, `noUnusedLocals/noUnusedParameters: false` (`:21-22`), ESLint 8 EOL en config legacy avec `no-explicit-any: off` et `no-console: off` (`.eslintrc.cjs:22`). Point notable : `esbuild.drop: ['console','debugger']` (`vite.config.ts:85-87`) s'applique aussi en dev, rendant les 48 `console.warn/error` du codebase factuellement morts.

### Sécurité

**Verdict : posture solide, aucun P1.** Points forts vérifiés dans le code :

- **Secrets** : `.env` gitignoré et non tracké ; aucun DSN/token en clair ; plugin Sentry conditionnel (`vite.config.ts:10-28`) ; sourcemaps générées uniquement si token et supprimées après upload (`vite.config.ts:23,48`).
- **Headers** : CSP stricte `script-src 'self'` sans unsafe-inline, `frame-ancestors 'none'`, HSTS preload, Permissions-Policy, `nosniff` (`vercel.json:11-40`) ; police externe pinnée avec SRI (`index.html:80-87`).
- **Injection** : aucun `dangerouslySetInnerHTML`/`eval`/`new Function` dans `src/` ; `encodeURIComponent` systématique sur les paramètres Scryfall ; les 21 `target="_blank"` portent `rel="noopener noreferrer"`.
- **Privacy** : partage par hash (`src/utils/urlCodec.ts:6-77`), Sentry off par défaut avec `sendDefaultPii: false` et scrubber `beforeSend` (`main.tsx:21-69`), wipe localStorage testé (`src/lib/__tests__/privacy.clearAll.test.ts`).

**Failles et incohérences identifiées :**

- **Zod : ~95 % de dead code, validation réelle quasi absente.** `src/lib/validations.ts` définit ~15 schémas — seul `sanitizeString` est importé (`scryfall.ts:3`). `parseDecklistText` (`scryfall.ts:220-258`) accepte des quantités non bornées (`999999999 Island`, `:239-242`). Le fichier donne un faux sentiment de validation en revue de code.
- **Réhydratation redux-persist sans validation de schéma** (`src/store/index.ts:53-66`) : un localStorage modifié injecte un état arbitraire dans le store (plantages/NaN possibles ; XSS improbable car React échappe).
- **CSP incompatible avec Sentry — bug latent.** `connect-src 'self' https://api.scryfall.com` (`vercel.json:37`) bloquera tous les événements Sentry le jour où `VITE_SENTRY_DSN` est posé (`main.tsx:59`) : monitoring mort en silence.
- **`public/presentation.html` non tracké, déployé, cassé par la CSP.** Fichier non commité mais copié dans `dist/` au build, avec un `<script>` inline (`:1226`) que `script-src 'self'` bloquera. Un artefact non relu part en prod.
- **Le « full privacy wipe » ne purge pas IndexedDB** (`src/lib/privacy.ts:207-239`) : le cache `manatuner-scryfall` (`scryfallPersistentCache.ts:27`) survit au wipe, contredisant la promesse affichée.
- **Appels Scryfall sans timeout ni abort sur la majorité des chemins** (`scryfall.ts:111,184,404,408,495`, `manaProducerService.ts:422`, `deckAnalyzer.ts:58`) alors que le pattern existe et fonctionne (`deckAnalyzer.ts:318-349`, timeout 8 s + retry 429/5xx).
- **Divers P3** : liens de partage legacy `?d=` encore honorés (`urlCodec.ts:93` — la decklist transite dans les logs edge Vercel) ; COEP/COOP posés sur `/workers/*` sans effet (`vercel.json:95-106` — ces headers doivent être sur le document HTML) ; worker mulligan sans borne d'itérations (`mulliganArchetype.worker.ts:46-49`) ; `sanitizeString` regex-based contournable en théorie (acceptable, rien n'est rendu en HTML brut — à documenter comme défense en profondeur) ; fraîcheur des dépendances non vérifiée (`npm audit` à exécuter : ESLint 8 EOL, `html2canvas` non maintenu depuis 2023, CLI `vercel ^32` très en retard, MUI 5.11 daté de fév. 2023).

### Performances

**Constat global : bien optimisé, deux vrais chantiers.** Libs lourdes en import dynamique (`jspdf` 385 KB + `html2canvas` 200 KB chargés uniquement à l'export, `src/components/export/ManaBlueprint.tsx:150,177-179`), icônes MUI importées par chemin individuel, batch Scryfall chunké à 75 avec rate-limit 100 ms, `manualChunks` raisonnables (`vite.config.ts:51-61`).

**Goulets d'étranglement identifiés :**

- **[P1] redux-persist : sérialisation complète à chaque frappe clavier.** `DeckInputSection.tsx:95` dispatche `setDeckList` à chaque caractère ; la whitelist `['analyzer']` (`src/store/index.ts:53-60`) inclut `analysisResult` (`src/store/slices/analyzerSlice.ts:13`), soit 100–500 KB de JSON pour un deck EDH réécrits en synchrone dans `localStorage` à **chaque action Redux** (frappe, onglet, snackbar). Double persistance redondante : l'analyse est déjà sauvegardée via `PrivacyStorage.saveAnalysis` (`src/pages/AnalyzerPage.tsx:288-293`). Corollaire : `PersistGate` (`main.tsx:177`) bloque le premier rendu sur la lecture/parse synchrone de ce blob.
- **[P2] `landCacheService` : O(n²) synchrone au chargement de l'Analyzer.** Chaque `set()` fait parse complet + stringify complet + `setItem` (`landCacheService.ts:97-124`) ; `preloadFromSeed()` (`:212-245`) boucle sur ~200 terrains → ~400 opérations disque synchrones et du jank au premier paint de `/analyzer`.
- **[P2] Boucle tempo bloquante sur le main thread.** `deckAnalyzer.ts:1422-1488` boucle `await analyzeSpellCastability(...)` — or cette fonction (`manaCalculator.ts:672-782`) est `async` sans aucun `await` : tout le calcul hypergéométrique s'exécute en un seul long task.
- **[P2] Détection des terrains inconnus : fetches séquentiels.** `deckAnalyzer.ts:761` appelle `landService.detectLand(name)` en boucle → 1 requête `/cards/named` rate-limitée par terrain (~250–400 ms chacun). `fetchLandDataBatch` (`scryfall.ts:470-534`) existe mais n'est appelée nulle part.
- **[P2] Payload eager ~710 KB raw.** `vendor-mui` (518 KB) embarque `@mui/icons-material` dans le chunk eager (`vite.config.ts:53-58`) ; 3 CSS cross-origin render-blocking (`index.html:76-92`).
- **[P3] Gestion mémoire.** Caches non bornés : `landDataCache` (`scryfall.ts:383` — Map plain alors que `BoundedMap` existe dans le même fichier) et `imageCache` (`src/hooks/useCardImage.ts:10`, avec en prime un setState post-unmount, timeout de 300 ms non annulé). `NotificationProvider` recrée son context value à chaque render (`src/components/common/NotificationProvider.tsx:84-88`). Keyframes `float` dupliqués 7× via Emotion + animations infinies sans `prefers-reduced-motion` (`FloatingManaSymbols.tsx:59-62`, `HomePage.tsx:79+`).
- **[P3] Build/assets.** `dist/og-image-v3.jpg` (140 KB) obsolète encore référencé (`LandGlossaryPage.tsx:282`) ; attente fixe de 800 ms/route dans le prerender (`scripts/prerender.mjs:189`).

---

## 2. Matrice des Priorités (Correctifs & Évolutions)

| Priorité (P1/P2/P3) | Type (Sec/Perf/Archi) | Description du problème                                                                                                                                                                                                                              | Fichiers cibles                                                                                                                                                                                                                                                                                                                                                                                                    | Impact attendu                                                                                                 |
| ------------------- | --------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------- |
| P1                  | Perf/Archi            | redux-persist sérialise l'état analyzer complet (incl. `analysisResult`, 100–500 KB) à chaque action ; dispatch `setDeckList` à chaque frappe ; `PersistGate` bloque le boot sur ce blob                                                             | `src/store/index.ts`, `src/components/analyzer/DeckInputSection.tsx`, `src/pages/AnalyzerPage.tsx`, `src/main.tsx`                                                                                                                                                                                                                                                                                                 | Suppression du blocage main-thread à la saisie et au boot (mobile surtout) ; fin de la double persistance      |
| P1                  | Archi/Perf            | ~2 000 lignes de code mort + 3 dépendances mortes (`@mui/lab`, `react-window`, `react-virtualized-auto-sizer`) + react-query jamais utilisé + workers/SW legacy livrés en prod                                                                       | `src/utils/landDetectionComplete.ts`, `src/utils/hybridLandDetection.ts`, `src/utils/intelligentLandAnalysis.ts`, `src/services/advancedMaths.ts`, `src/services/mulliganSimulator.ts`, `src/components/analysis/MonteCarloResults.tsx`, `src/components/analysis/TurnByTurnAnalysis.tsx`, `src/components/performance/OptimizedComponents.tsx`, `src/main.tsx`, `public/workers/`, `public/sw.js`, `package.json` | −40 KB+ de bundle eager, −10-15 % de surface de code, confusion « où vont les données » éliminée               |
| P1                  | Archi                 | 4 copies hardcodées des listes de terrains désynchronisées ; heuristiques `name.includes('Tarn')` cassées mais exportées et verrouillées par des tests                                                                                               | `src/utils/landDetection.ts`, `src/components/analyzer/landUtils.ts`, `src/services/deckAnalyzer.ts:1660-1702`, `src/services/manaCalculator.ts:53-60,96`, `src/data/landSeed.ts`, `src/services/landService.ts`                                                                                                                                                                                                   | Source de vérité unique (`landSeed` + `landService`) ; correction de bugs de détection garantis                |
| P2                  | Perf                  | `landCacheService` : O(n²) synchrone — parse+stringify+setItem complets par insertion ; `preloadFromSeed` = ~400 écritures localStorage au premier chargement de l'Analyzer                                                                          | `src/services/landCacheService.ts:97-124,212-245`, `src/services/landService.ts:191-206`                                                                                                                                                                                                                                                                                                                           | Jank d'entrée dans `/analyzer` supprimé ; ~400 I/O synchrones → 1 flush                                        |
| P2                  | Sec/Perf              | Appels Scryfall sans timeout/abort sur la majorité des chemins (fetch pendant = spinner bloqué indéfiniment) alors que le pattern existe (`deckAnalyzer.ts:318-349`)                                                                                 | `src/services/scryfall.ts:111,184,404,408,495`, `src/services/manaProducerService.ts:422`, `src/services/deckAnalyzer.ts:58`                                                                                                                                                                                                                                                                                       | Fiabilité perçue, cohérence ; un `fetchWithTimeout` unique factorisé                                           |
| P2                  | Perf                  | Boucle d'analyse tempo : `analyzeSpellCastability` déclarée `async` sans `await` → calcul hypergéométrique complet en un seul long task bloquant                                                                                                     | `src/services/deckAnalyzer.ts:1422-1488`, `src/services/manaCalculator.ts:672-782`                                                                                                                                                                                                                                                                                                                                 | UI réactive pendant l'analyse ; honnêteté de l'API (sync réel ou chunking)                                     |
| P2                  | Perf                  | Détection des terrains inconnus : fetches `/cards/named` séquentiels rate-limités (~250-400 ms/carte) ; `fetchLandDataBatch` existant jamais appelé                                                                                                  | `src/services/deckAnalyzer.ts:761`, `src/services/scryfall.ts:470-534`, `src/services/landService.ts`                                                                                                                                                                                                                                                                                                              | 10 terrains exotiques : −2 à 3 s sur l'analyse ; un seul POST batch                                            |
| P2                  | Archi                 | `deckAnalyzer.ts` : god class de 1 713 lignes mêlant parsing, réseau Scryfall dupliqué (cache mémoire séparé sans IDB), détection terrains, analyses                                                                                                 | `src/services/deckAnalyzer.ts`, `src/services/scryfall.ts`                                                                                                                                                                                                                                                                                                                                                         | Testabilité, réutilisation du cache persistant (moins de requêtes inter-sessions), lisibilité                  |
| P2                  | Archi                 | Hypergéométrique implémentée/wrappée 4 fois (source déclarée `hypergeom.ts` contournée par 3 wrappers/réimplémentations)                                                                                                                             | `src/services/castability/hypergeom.ts`, `src/services/deckAnalyzer.ts:1059`, `src/services/manaCalculator.ts:20-33`, `src/services/advancedMaths.ts:66,537`                                                                                                                                                                                                                                                       | Un seul module importé partout ; risque de divergence numérique éliminé                                        |
| P2                  | Sec                   | Zod : ~15 schémas définis, seul `sanitizeString` utilisé ; parsing decklist sans bornes ; réhydratation redux-persist sans validation de schéma                                                                                                      | `src/lib/validations.ts`, `src/services/scryfall.ts:220-258`, `src/store/index.ts:53-66`                                                                                                                                                                                                                                                                                                                           | Fin de l'illusion de validation ; classe de bugs « storage corrompu » éliminée                                 |
| P2                  | Sec                   | Incohérences périmètre déployé : CSP bloquera Sentry si réactivé ; `presentation.html` non tracké part en prod avec script inline bloqué ; wipe privacy ne purge pas IndexedDB ; COEP/COOP inefficaces sur `/workers/*`                              | `vercel.json:37,95-106`, `src/main.tsx:59`, `public/presentation.html`, `src/lib/privacy.ts:207-239`                                                                                                                                                                                                                                                                                                               | Monitoring non muet, périmètre déployé maîtrisé, promesse privacy tenue                                        |
| P2                  | Perf                  | Payload eager ~710 KB raw : `@mui/icons-material` dans `vendor-mui` chargé dès la Home ; 3 CSS cross-origin render-blocking                                                                                                                          | `vite.config.ts:51-61`, `index.html:76-92`                                                                                                                                                                                                                                                                                                                                                                         | Gain LCP mobile mesurable ; icônes servies avec leurs chunks lazy                                              |
| P3                  | Perf                  | Caches non bornés (`landDataCache`, `imageCache`) ; setState post-unmount dans `useCardImage` ; context `NotificationProvider` non memoïsé ; keyframes `float` dupliqués 7× sans `prefers-reduced-motion`                                            | `src/services/scryfall.ts:383`, `src/hooks/useCardImage.ts:10,39-44`, `src/components/common/NotificationProvider.tsx:84-88`, `src/components/common/FloatingManaSymbols.tsx:59-62`                                                                                                                                                                                                                                | Fuites mémoire bornées, warnings React éliminés, re-renders parasite réduits, coût compositeur/batterie réduit |
| P3                  | Archi                 | Outillage permissif : `moduleResolution: "node"`, `noUnusedLocals: false`, ESLint 8 EOL config legacy (`no-explicit-any: off`), tests éclatés en doublons (`src/services/manaCalculator.test.ts` vs `src/services/__tests__/manaCalculator.test.ts`) | `tsconfig.json:11,21-22`, `.eslintrc.cjs:22`, `src/services/__tests__/`, `tests/`                                                                                                                                                                                                                                                                                                                                  | Le compilateur et le linter détectent la dette au lieu de la laisser passer                                    |
| P3                  | Sec/Archi             | Hygiène dépendances et durcissements : `npm audit` jamais vérifié (ESLint 8 EOL, `html2canvas` non maintenu, CLI vercel ^32), pas de Dependabot ; worker mulligan sans clamp d'itérations ; liens legacy `?d=` encore honorés                        | `package.json`, `.github/` (dependabot.yml), `src/workers/mulliganArchetype.worker.ts:46-49`, `src/utils/urlCodec.ts:93`                                                                                                                                                                                                                                                                                           | Surface CVE surveillée en continu ; DoS auto-infligé et exposition logs CDN réduits                            |

---

## 3. Plan d'Implémentation (Prompts Grok 4.5)

> Chaque tâche est atomique et exécutable indépendamment. Ordre conseillé : T01 → T02 → T03, puis les P2 dans l'ordre, puis les P3. Après chaque tâche : `npm run test:unit`, `npm run type-check`, `npm run lint` doivent rester verts.

### T01 (P1 — Perf/Archi) : Assainir redux-persist et la saisie decklist

```text
RÔLE : Tu es un développeur React/Redux senior spécialisé en performance front-end.

FICHIERS À MODIFIER :
- src/store/index.ts
- src/components/analyzer/DeckInputSection.tsx
- src/pages/AnalyzerPage.tsx (uniquement si nécessaire pour la cohérence de sauvegarde)

CONTEXTE : La whitelist redux-persist `['analyzer']` (src/store/index.ts:53-60) inclut
`analysisResult` (src/store/slices/analyzerSlice.ts:13), soit 100-500 KB de JSON réécrits
en synchrone dans localStorage à CHAQUE action Redux. DeckInputSection.tsx:95 dispatche
setDeckList à chaque frappe. L'analyse est DÉJÀ persistée séparément via
PrivacyStorage.saveAnalysis (src/pages/AnalyzerPage.tsx:288-293) : double persistance.

LOGIQUE À IMPLÉMENTER :
1. Exclure `analysisResult` de la persistance : ajouter un transform redux-persist
   (createTransform) sur le slice analyzer qui retire `analysisResult` à la sérialisation
   et le réinjecte à `null`/initialState à la désérialisation. Incrémenter la version de
   migration persistée et ajouter une migration qui purge l'ancien champ.
2. Debouncer la propagation de la saisie : dans DeckInputSection.tsx, conserver un état
   local immédiat pour l'input et ne dispatcher setDeckList qu'après 300 ms d'inactivité
   (annuler le timer au unmount et à chaque nouvelle frappe). Le bouton « Analyser » doit
   utiliser la valeur la plus récente (flush du debounce avant analyse).
3. Vérifier que le rehydrate initial (PersistGate, src/main.tsx:177) reste fonctionnel
   avec un persist:root allégé.

CONTRAINTES :
- Aucune régression fonctionnelle : la decklist saisie doit survivre au rechargement ;
  l'analyse en cours d'affichage ne doit jamais être perdue par le debounce.
- Gestion des erreurs requise : JSON.parse/setItem en try/catch silencieux (quota),
  cohérent avec le fallback existant dans src/lib/privacy.ts:55-75.
- Ne pas toucher aux autres slices persistés ni à lib/privacy.ts.
- Ajouter/adapter un test unitaire couvrant : transform (analysisResult exclu),
  migration depuis l'ancienne version, flush du debounce avant analyse.
- npm run test:unit et npm run type-check doivent passer.
```

### T02 (P1 — Archi/Perf) : Purger le code mort et les dépendances orphelines

```text
RÔLE : Tu es un tech lead spécialisé en hygiène de codebase et tree-shaking.

FICHIERS À SUPPRIMER (vérifier d'abord par grep qu'aucun import ne pointe vers eux
hors tests, et adapter les tests concernés) :
- src/utils/landDetectionComplete.ts
- src/utils/hybridLandDetection.ts
- src/utils/intelligentLandAnalysis.ts
- src/services/advancedMaths.ts
- src/services/mulliganSimulator.ts
- src/components/analysis/MonteCarloResults.tsx
- src/components/analysis/TurnByTurnAnalysis.tsx
- src/components/performance/OptimizedComponents.tsx
- public/workers/manaCalculator.worker.js et public/workers/monteCarlo.worker.js
- public/sw.js (et retirer ses headers dédiés dans vercel.json:60-71)

FICHIERS À MODIFIER :
- package.json : retirer @tanstack/react-query, @tanstack/react-query-devtools,
  @mui/lab, react-window, react-virtualized-auto-sizer, @types/react-window.
- src/main.tsx : retirer QueryClient, QueryClientProvider, ReactQueryDevtools et
  leurs imports (lignes ~4, 98-119, 175, 181).
- src/services/manaCalculator.ts : supprimer calculateProbabilityByTurn (:42) et
  analyzeDeckConsistency (:82) si uniquement consommés par les tests.
- src/utils/index.ts : retirer l'export de detectLand si son seul consommateur
  était le code supprimé.
- Tests : src/services/__tests__/maths.critical.test.ts et les tests important
  mulliganSimulator doivent être migrés vers mulliganSimulatorAdvanced (imports
  directs) ou supprimés s'ils ne testaient que du code mort. Les deux suites en
  doublon sur manaCalculator (src/services/manaCalculator.test.ts vs
  src/services/__tests__/manaCalculator.test.ts) doivent être fusionnées en une
  seule, au format du projet (prettier : sans point-virgule, guillemets simples).

LOGIQUE À IMPLÉMENTER : suppression pure + mise à jour des imports/tests. Aucune
logique nouvelle. Pour chaque fichier supprimé, un grep exhaustif (`rg`) doit
confirmer zéro référence restante (y compris dans scripts/ et index.html).

CONTRAINTES :
- Ne supprimer QUE ce qui est prouvé non référencé ; tout doute = conserver et
  le signaler dans le rapport final.
- npm run build, npm run test:unit, npm run type-check et npm run lint doivent
  passer après la purge.
- Vérifier après build que dist/ ne contient plus les workers JS ni sw.js.
- Rapporter la taille du bundle principal avant/après (dist/assets).
```

### T03 (P1 — Archi) : Consolider la détection de terrains sur une source de vérité unique

```text
RÔLE : Tu es un développeur TypeScript senior, domaine Magic: The Gathering.

FICHIERS À MODIFIER :
- src/utils/landDetection.ts (Set KNOWN_LANDS, ligne 2)
- src/components/analyzer/landUtils.ts (liste, ligne 43)
- src/services/deckAnalyzer.ts (listes inline shocklands/fastlands, lignes 1660-1702)
- src/services/manaCalculator.ts (heuristiques name.includes, lignes 53-60 et 96)
- src/data/landSeed.ts et src/services/landService.ts (sources de vérité, lecture
  principalement ; extension seulement si un cas n'y est pas couvrable)

CONTEXTE : Quatre copies codées en dur des listes de terrains coexistent et sont
déjà désynchronisées. manaCalculator.ts:53-60 détecte les terrains par
name.includes('Vents')/('Tarn') : comportement faux mais verrouillé par des tests.

LOGIQUE À IMPLÉMENTER :
1. Faire de landService (appuyé sur data/landSeed.ts) l'unique point d'entrée de
   détection/classification des terrains. Exposer si besoin une API synchrone de
   lookup par nom (le seed est local) pour remplacer les Set en dur.
2. Remplacer les 4 listes par des appels à cette API. Supprimer les heuristiques
   par sous-chaîne de manaCalculator.ts ou les réécrire via landService.
3. Réécrire les tests qui verrouillaient le comportement faux pour tester le
   comportement correct (jeu de cartes réelles : shocklands, fetchlands, triomes,
   basics, terrains non-seedés).

CONTRAINTES :
- Pas de régression : la détection doit reconnaître au minimum tout ce que les
  anciennes listes reconnaissaient (test de non-régression sur la liste complète
  des noms présents dans les 4 anciennes copies).
- Gestion des erreurs requise : un nom inconnu hors seed doit retomber sur le
  chemin de fetch Scryfall existant (landService.detectLand), jamais planter.
- Aucun fetch réseau nouveau au chargement : le lookup seed reste synchrone.
- npm run test:unit, npm run test:mtg-logic et npm run type-check doivent passer.
```

### T04 (P2 — Perf) : Batcher les écritures de landCacheService

```text
RÔLE : Tu es un développeur front-end spécialisé en performance et stockage navigateur.

FICHIERS À MODIFIER :
- src/services/landCacheService.ts (set/getStorage/saveStorage lignes 97-124,
  preloadFromSeed lignes 212-245)
- src/services/landService.ts (constructeur du singleton, lignes 191-206) —
  uniquement si le point d'appel du preload doit bouger.

CONTEXTE : Chaque set() fait JSON.parse complet + JSON.stringify complet +
localStorage.setItem. preloadFromSeed() enchaîne ~200 has() + ~200 set() au
premier chargement de /analyzer : ~400 opérations disque synchrones.

LOGIQUE À IMPLÉMENTER :
1. Charger le storage UNE FOIS en mémoire (Map) à l'initialisation du service ;
  has()/get() deviennent des lectures O(1) en mémoire.
2. set() écrit en mémoire et marque le cache « dirty » ; le flush vers localStorage
   est batché : un seul stringify+setItem à la fin de preloadFromSeed(), et pour
   les écritures ultérieures un flush différé (requestIdleCallback avec fallback
   setTimeout, ou debounce ~500 ms) + flush synchrone sur l'événement
   'beforeunload'/'visibilitychange' (hidden).
3. Conserver le TTL et la politique d'éviction existants.

CONTRAINTES :
- Pas de régression : les données seedées doivent persister entre sessions ;
  comportement identique après rechargement.
- Gestion des erreurs requise : try/catch sur JSON.parse (donnée corrompue →
  repartir d'un cache vide) et sur setItem (QuotaExceededError → éviction des
  entrées les plus anciennes puis retry une fois, sinon abandon silencieux),
  cohérent avec src/lib/privacy.ts:55-75.
- Tests unitaires : batch flush (1 seul setItem pour N set), récupération sur
  storage corrompu, quota dépassé.
- npm run test:unit et npm run type-check doivent passer.
```

### T05 (P2 — Sec/Perf) : Factoriser un fetchWithTimeout unique pour tous les appels Scryfall

```text
RÔLE : Tu es un développeur TypeScript senior spécialisé en robustesse réseau.

FICHIERS À MODIFIER :
- src/services/scryfall.ts (fetchs lignes 111, 184, 404, 408, 495)
- src/services/manaProducerService.ts (fetch ligne 422)
- src/services/deckAnalyzer.ts (fetch ligne 58 ; conserver/harmoniser le pattern
  existant lignes 318-349)
- Créer src/services/http.ts (ou src/utils/http.ts selon les conventions du projet).

CONTEXTE : La majorité des appels Scryfall n'ont ni AbortController ni timeout ;
un fetch pendant bloque l'UI indéfiniment. Le pattern timeout 8 s + retry 429/5xx
existe déjà dans deckAnalyzer.ts:318-349 et useCardImage.ts:39-44.

LOGIQUE À IMPLÉMENTER :
1. Créer `fetchWithTimeout(url, options?, { timeoutMs = 8000, retries = 1 })` :
   AbortController + setTimeout, clearTimeout systématique, retry uniquement sur
   429 et 5xx avec backoff simple (ex. 500 ms × tentative), respect du header
   Retry-After si présent. Erreur typée (classe HttpTimeoutError / HttpError avec
   status) pour permettre aux appelants de distinguer timeout / HTTP / réseau.
2. Remplacer tous les fetch directs listés par ce helper. Conserver le rate-limit
   100 ms existant (scryfall.ts:63-72) et encodeURIComponent sur les paramètres.
3. Propager l'abort : les chemins d'analyse doivent pouvoir être annulés si
   l'utilisateur relance une analyse (signal optionnel en paramètre).

CONTRAINTES :
- Pas de régression : les délais actuels du chemin principal (8 s) sont conservés ;
  le comportement de cache (BoundedMap + IDB) est inchangé.
- Gestion des erreurs requise : tout échec doit produire le même type de rejet
  qu'aujourd'hui pour les appelants existants (messages d'erreur UI conservés) ;
  aucun unhandled rejection ; cleanup du timer dans tous les chemins (succès,
  erreur, abort).
- Tests unitaires : timeout déclenché, retry sur 429 puis succès, pas de retry
  sur 404, abort propagé.
- npm run test:unit et npm run type-check doivent passer.
```

### T06 (P2 — Perf) : Rendre l'analyse tempo non bloquante

```text
RÔLE : Tu es un développeur front-end spécialisé en performance JavaScript (main thread).

FICHIERS À MODIFIER :
- src/services/deckAnalyzer.ts (boucle tempo lignes 1422-1488)
- src/services/manaCalculator.ts (analyzeSpellCastability lignes 672-782)

CONTEXTE : analyzeSpellCastability est déclarée async mais ne contient aucun await :
la boucle `for (const spell of nonLands) { await analyzeSpellCastability(...) }`
exécute tout le calcul hypergéométrique en un seul long task. Pour un deck EDH
(~60 sorts uniques), l'onglet est figé pendant l'analyse.

LOGIQUE À IMPLÉMENTER :
1. Rendre analyzeSpellCastability synchrone (supprimer async/await, ajuster les
   signatures et appelants) : le code est de fait synchrone, l'API doit le dire.
2. Dans la boucle de deckAnalyzer.ts, découper le travail : yield explicite au
   navigateur tous les N sorts (N=10) via `scheduler.yield()` si disponible,
   fallback `await new Promise(r => setTimeout(r, 0))`.
3. Ajouter un token d'annulation : si une nouvelle analyse démarre, la boucle en
   cours s'arrête proprement au prochain yield.

CONTRAINTES :
- Pas de régression : résultats d'analyse strictement identiques (mêmes entrées →
  mêmes sorties) ; l'ordre des résultats par sort est préservé.
- Gestion des erreurs requise : une erreur sur un sort ne doit pas interrompre
  les autres (comportement actuel à vérifier et conserver) ; annulation sans
  unhandled rejection.
- Tests : non-régression numérique sur un deck fixture existant
  (tests/fixtures/competitive-decklists.js), test d'annulation.
- npm run test:unit et npm run test:mtg-logic doivent passer.
```

### T07 (P2 — Perf) : Batcher la détection des terrains inconnus

```text
RÔLE : Tu es un développeur TypeScript senior, intégration API Scryfall.

FICHIERS À MODIFIER :
- src/services/deckAnalyzer.ts (boucle de parsing, appel ligne 761)
- src/services/landService.ts (API de détection)
- src/services/scryfall.ts (fetchLandDataBatch lignes 470-534 — actuellement morte,
  à corriger si nécessaire et brancher)

CONTEXTE : deckAnalyzer.ts:761 appelle `await landService.detectLand(name)` en
boucle : 1 requête /cards/named rate-limitée par terrain non seedé (~250-400 ms
chacune). fetchLandDataBatch (POST /cards/collection) existe mais n'est jamais
appelée.

LOGIQUE À IMPLÉMENTER :
1. En amont de la boucle de parsing : collecter les noms de terrains absents du
   seed et des caches (mémoire + IDB), dédupliquer.
2. Résoudre ces noms en UN appel batch (POST /cards/collection, chunks de 75
   identifiants max, rate-limit 100 ms entre chunks) via fetchLandDataBatch,
   peupler les caches, puis exécuter la boucle de parsing en synchrone sur les
   données résolues.
3. Gérer le champ `not_found` de la réponse collection : fallback /cards/named
   individuel uniquement pour ces cartes, puis marquage négatif en cache.

CONTRAINTES :
- Pas de régression : un deck sans terrain hors seed ne déclenche AUCUNE requête
  supplémentaire ; les résultats de détection sont identiques à l'implémentation
  actuelle.
- Gestion des erreurs requise : échec du batch → fallback séquentiel actuel ;
  réponse partielle → fallback par carte ; utiliser le fetchWithTimeout de T05
  si déjà mergé, sinon le pattern timeout existant.
- Ne pas muter les tableaux passés en argument (cf. le sort() en place de
  searchCardsByCollection, scryfall.ts:175 — à corriger au passage si touché).
- Tests : batch groupé (1 requête pour N noms), chunking à 75, not_found, fallback.
- npm run test:unit et npm run type-check doivent passer.
```

### T08 (P2 — Archi) : Découper la god class deckAnalyzer

```text
RÔLE : Tu es un architecte logiciel TypeScript spécialisé en refactoring à
comportement constant.

FICHIERS À MODIFIER :
- src/services/deckAnalyzer.ts (1 713 lignes, classe statique DeckAnalyzer :284)
- Créer : src/services/deckParser.ts, src/services/cardResolver.ts (ou noms
  cohérents avec src/services/castability/ existant)
- src/services/scryfall.ts (réutilisation, pas de duplication)

CONTEXTE : DeckAnalyzer mêle parsing de decklist, fetchs Scryfall dupliqués
(batchFetchFromScryfall:46-79, fetchCardFromScryfallWithMeta:305 — cache mémoire
séparé sans bénéficier du cache IDB persistant), détection de terrains et analyses
tempo/timing.

LOGIQUE À IMPLÉMENTER (refactoring par extraction, sans changement de comportement) :
1. Extraire le parsing texte → deckParser.ts (fonction pure, entièrement testable).
2. Extraire la résolution de cartes → cardResolver.ts, déléguée à scryfall.ts :
   supprimer les fetchs dupliqués et le cache mémoire local au profit du cache
   BoundedMap + IDB persistant existants.
3. deckAnalyzer.ts ne garde que l'orchestration des analyses. Conserver les
   signatures publiques utilisées par les appelants (src/pages/AnalyzerPage.tsx,
   composants analyzer) ou les faire suivre avec leurs imports.
4. Respecter le périmètre : ne PAS toucher à l'hypergéométrique (tâche T09) ni
   aux listes de terrains (tâche T03) — coordonner si exécution parallèle.

CONTRAINTES :
- Refactoring strictement à comportement constant : mêmes entrées → mêmes sorties
  sur les fixtures existantes (tests/fixtures/).
- Gestion des erreurs requise : les erreurs réseau/parsing doivent remonter avec
  les mêmes types/messages qu'aujourd'hui.
- Les tests existants doivent passer sans modification de leurs assertions ;
  ajouter des tests pour deckParser (pur) et cardResolver (cache partagé).
- npm run test:unit, npm run test:mtg-logic, npm run type-check, npm run lint OK.
```

### T09 (P2 — Archi) : Unifier l'implémentation hypergéométrique

```text
RÔLE : Tu es un développeur TypeScript senior, spécialiste calcul probabiliste.

FICHIERS À MODIFIER :
- src/services/castability/hypergeom.ts (source de vérité, à conserver)
- src/services/deckAnalyzer.ts (supprimer private static calculateHypergeometric,
  ligne 1059)
- src/services/manaCalculator.ts (supprimer le wrapper classe lignes 20-33)
- src/services/advancedMaths.ts (si non supprimé par T02 : retirer les re-wrappers
  lignes 66 et 537 ; si T02 est mergée, ce fichier n'existe plus)

CONTEXTE : Le calcul hypergéométrique est implémenté ou wrappé 4 fois. La source
déclarée est castability/hypergeom.ts ; les autres divergent potentiellement.

LOGIQUE À IMPLÉMENTER :
1. Vérifier la parité numérique entre hypergeom.ts et la réimplémentation de
   deckAnalyzer.ts:1059 sur une grille de cas (N, K, n, k) incluant bords
   (k=0, k=n, K=0, n>N) ; documenter toute divergence trouvée.
2. Remplacer tous les appels par des imports directs de castability/hypergeom.ts ;
   supprimer les wrappers et la réimplémentation.
3. Si la précision diffère, conserver la version la plus précise (factorielles en
   log pour la stabilité numérique) et reporter ses tests.

CONTRAINTES :
- Pas de régression : écart numérique nul (ou < 1e-12 justifié) sur la suite de
  tests existante tests/mtg-specific/mana-calculations/.
- Gestion des erreurs requise : paramètres invalides (n>N, K<0, etc.) → comportement
  unique documenté (throw ou clamp), testé.
- npm run test:unit et npm run test:mana-calc doivent passer.
```

### T10 (P2 — Sec) : Brancher la validation zod sur le parsing et la réhydratation

```text
RÔLE : Tu es un développeur TypeScript senior spécialisé en validation et sécurité front.

FICHIERS À MODIFIER :
- src/lib/validations.ts (compléter/ajuster les schémas existants)
- src/services/scryfall.ts (parseDecklistText lignes 220-258)
- src/store/index.ts (réhydratation lignes 53-66)

CONTEXTE : ~15 schémas zod sont définis mais seul sanitizeString est utilisé.
parseDecklistText accepte des quantités non bornées (`999999999 Island`). L'état
redux-persist est désérialisé sans validation : un localStorage modifié injecte
un état arbitraire.

LOGIQUE À IMPLÉMENTER :
1. Parsing decklist : valider chaque ligne via un schéma DeckLineSchema (quantité
   entière bornée 1-99, nom 1-200 chars après sanitizeString) ; lignes invalides
   rejetées avec comptage rapporté à l'UI (ne pas planter l'import).
2. Réhydratation : définir PersistedAnalyzerSchema (version allégée alignée sur
   T01 si mergée) ; au rehydrate (migration ou transform IN), safeParse ; en cas
   d'échec, fallback sur initialState + purge de la clé persist:root corrompue.
3. Supprimer ou marquer @deprecated les schémas réellement inutilisables après
   branchement (fin du dead code donnant une illusion de validation).

CONTRAINTES :
- Pas de régression : les decklists valides actuelles (y compris formats Arena
  « 4 Island », « 4x Island », sideboard) doivent continuer à parser à l'identique ;
  l'import d'analyses existant (lib/privacy.ts:269, déjà validé) est inchangé.
- Gestion des erreurs requise : aucun throw non rattrapé au rehydrate ni au
  parsing ; messages d'erreur utilisateur existants conservés.
- Tests : quantité hors bornes rejetée, storage corrompu → fallback propre,
  parsing des formats historiques non régressif.
- npm run test:unit et npm run test:deck-parser doivent passer.
```

### T11 (P2 — Sec) : Aligner CSP, périmètre déployé et wipe privacy

```text
RÔLE : Tu es un ingénieur sécurité front-end / plateforme de déploiement Vercel.

FICHIERS À MODIFIER :
- vercel.json (CSP ligne 37, headers /workers/* lignes 95-106)
- src/main.tsx (commentaire d'activation Sentry lignes 19 et 59)
- public/presentation.html (décision à prendre, voir ci-dessous)
- src/lib/privacy.ts (clearAllLocalData lignes 207-239)

LOGIQUE À IMPLÉMENTER :
1. CSP/Sentry : documenter dans main.tsx (à côté du commentaire ligne 19) que
   l'activation de VITE_SENTRY_DSN impose d'ajouter `https://*.ingest.sentry.io`
   à connect-src dans vercel.json ; préparer cet ajout en commentaire dans
   vercel.json (ne PAS l'activer tant que Sentry est off).
2. presentation.html : ce fichier non tracké est copié dans dist/ au build et son
   script inline (:1226) est bloqué par script-src 'self'. Décider et appliquer :
   soit le tracker en git ET externaliser son script dans un fichier .js, soit le
   déplacer hors de public/ (ex. tools/) pour qu'il ne soit plus déployé.
   Recommandation : le déplacer hors de public/.
3. Wipe : clearAllLocalData doit aussi appeler clearPersistentScryfallCache()
   (déjà exporté par src/services/scryfallPersistentCache.ts) pour purger
   IndexedDB ; gérer l'asynchrone (la fonction de wipe devient async ou chaîne
   la promesse) et mettre à jour ses appelants.
4. COEP/COOP : retirer les headers Cross-Origin-Embedder-Policy/Opener-Policy de
   /workers/* (inefficaces hors document HTML) sauf si une isolation cross-origin
   est réellement visée — dans ce cas, les déplacer sur le document et vérifier
   le chargement de Scryfall/Google Fonts.

CONTRAINTES :
- Pas de régression : la CSP actuelle ne doit être ni assouplie ni durcie au-delà
  des points listés ; vérifier que le build preview (npm run build && npm run
  preview) sert des pages fonctionnelles.
- Gestion des erreurs requise : l'échec de purge IndexedDB ne doit pas empêcher
  le wipe localStorage ni faire échouer la promesse globale (Promise.allSettled).
- Mettre à jour le test src/lib/__tests__/privacy.clearAll.test.ts pour couvrir
  la purge IndexedDB (mock idb-keyval).
- npm run test:unit et npm run type-check doivent passer.
```

### T12 (P2 — Perf) : Alléger le payload eager (~710 KB raw)

```text
RÔLE : Tu es un développeur front-end spécialisé en optimisation de bundle Vite.

FICHIERS À MODIFIER :
- vite.config.ts (manualChunks lignes 51-61)
- index.html (CSS cross-origin lignes 76-92)

CONTEXTE : vendor-mui (518 KB) embarque @mui/icons-material dans le chunk eager
chargé dès la HomePage. Trois CSS render-blocking cross-origin (Roboto, mana.css
jsDelivr, Cinzel). @mui/lab est une dépendance morte (retirée par T02 si mergée).

LOGIQUE À IMPLÉMENTER :
1. Sortir @mui/icons-material de vendor-mui : le laisser suivre les chunks lazy
   qui l'importent (les imports sont déjà par chemin individuel) ou créer un chunk
   séparé chargé à la demande. Mesurer avant/après (tailles dist/assets).
2. Fonts décoratives : charger Cinzel (et mana.css si non critique au premier
   rendu) en non-bloquant (pattern media="print" onload swap, ou preload +
   swap), en conservant le SRI existant pour mana-font et un fallback <noscript>.
3. Vérifier que Roboto (police de corps MUI) reste prioritaire mais ne bloque
   pas inutilement (font-display: swap déjà présent ? le vérifier).

CONTRAINTES :
- Pas de régression visuelle : pas de FOUC cassant la Home ; vérifier manuellement
  (ou via les tests Playwright existants, npm run test:e2e sur core-flows) que la
  Home et /analyzer s'affichent correctement.
- Gestion des erreurs requise : échec de chargement d'une font → fallback système
  propre (déjà assuré par les font-family de secours du thème, à vérifier).
- Rapporter les tailles de chunks et le poids eager avant/après dans le rapport.
- npm run build doit passer ; les tests e2e core-flows doivent rester verts.
```

### T13 (P3 — Perf) : Borner les caches et nettoyer les effets React

```text
RÔLE : Tu es un développeur React senior spécialisé en gestion mémoire et re-renders.

FICHIERS À MODIFIER :
- src/services/scryfall.ts (landDataCache ligne 383)
- src/hooks/useCardImage.ts (imageCache ligne 10, timeout lignes 39-44)
- src/components/common/NotificationProvider.tsx (contextValue lignes 84-88)
- src/components/common/FloatingManaSymbols.tsx (keyframes lignes 59-62)
- src/pages/HomePage.tsx (doublon de keyframes ~ligne 79)

LOGIQUE À IMPLÉMENTER :
1. Remplacer landDataCache (Map plain) par la BoundedMap existante du même fichier.
2. useCardImage : borner imageCache (réutiliser BoundedMap ou un cap équivalent) ;
   annuler le timeout de 300 ms et tout setState au démontage (cleanup useEffect) ;
   si possible, déléguer au cache LRU de scryfall.ts au lieu d'un second système.
3. NotificationProvider : memoïser contextValue (useMemo) et les callbacks
   (useCallback) pour ne re-rendre les consommateurs qu'à changement réel.
4. Keyframes float : un seul keyframe global (styles/ ou thème) partagé ; ajouter
   @media (prefers-reduced-motion: reduce) désactivant l'animation infinie.

CONTRAINTES :
- Pas de régression : comportement visible identique (hors reduced-motion) ;
  aucune éviction de cache ne doit provoquer de re-fetch en boucle (cap ≥ 200).
- Gestion des erreurs requise : les fetchs d'images en échec doivent rester
  cachés négativement comme aujourd'hui ; aucun setState après unmount
  (vérifier l'absence de warning React en dev).
- Tests : cleanup au unmount (fake timers), memoïsation du context.
- npm run test:unit et npm run type-check doivent passer.
```

### T14 (P3 — Archi) : Resserrer l'outillage (tsconfig, ESLint, structure des tests)

```text
RÔLE : Tu es un tech lead spécialisé en tooling TypeScript/ESLint.

FICHIERS À MODIFIER :
- tsconfig.json (moduleResolution ligne 11, noUnusedLocals/noUnusedParameters
  lignes 21-22)
- .eslintrc.cjs (ligne 22 : règles no-explicit-any, no-console)
- src/services/manaCalculator.test.ts et src/services/__tests__/ (doublons)

LOGIQUE À IMPLÉMENTER :
1. tsconfig : passer moduleResolution à "bundler" (Vite 7) ; activer
   noUnusedLocals et noUnusedParameters, corriger les erreurs remontées (le code
   mort restant après T02 devrait être minimal ; préfixe _ pour les paramètres
   intentionnellement inutilisés).
2. ESLint : passer no-explicit-any à "warn" (les 22 any existants sont listés,
   aucun nouveau ne doit apparaître sans justification) ; envisager la migration
   vers la flat config typescript-eslint v8 (déjà installé) — si migration trop
   risquée, documenter un ticket et rester en config legacy.
3. Tests : fusionner les doublons manaCalculator (cf. T02) et documenter la
   convention unique d'emplacement des tests dans le README ou AGENTS.md.
4. Vite dev : évaluer esbuild.drop console/debugger (vite.config.ts:85-87) —
   le restreindre à la production pour que les console.warn/error de dev
   redeviennent visibles, OU nettoyer les 48 appels si le drop est assumé.

CONTRAINTES :
- Pas de régression : npm run type-check, npm run lint, npm run test:unit et
  npm run build doivent passer après chaque resserrement.
- Aucune suppression de code fonctionnel sous prétexte de noUnusedLocals : tout
  symbole « inutilisé » encore référencé dynamiquement doit être prouvé mort
  avant retrait.
- Gestion des erreurs requise : ne pas masquer d'erreurs TS par des casts ou
  des @ts-ignore ; corriger proprement ou documenter.
```

### T15 (P3 — Sec/Archi) : Hygiène dépendances et durcissements résiduels

```text
RÔLE : Tu es un ingénieur sécurité / DevOps front-end.

FICHIERS À MODIFIER :
- package.json (versions : audit ciblé, pas de big bang)
- .github/dependabot.yml (à créer)
- src/workers/mulliganArchetype.worker.ts (clamp lignes 46-49)
- src/utils/urlCodec.ts (liens legacy ?d= ligne 93)

LOGIQUE À IMPLÉMENTER :
1. Exécuter `npm audit` et trier : corriger les vulnérabilités high/critical par
   mises à jour mineures/patch compatibles ; documenter celles exigeant un major
   (ESLint 8 EOL, html2canvas non maintenu, CLI vercel ^32) sans les forcer.
2. Créer .github/dependabot.yml : npm hebdomadaire, groupement des mineures/patch,
   ignore des majors sur les dépendances sensibles (react, @mui/*).
3. Worker mulligan : clamper `iterations` (ex. min 1 000, max 200 000) à
   l'entrée du worker ; valeur hors bornes → clamp silencieux + avertissement
   dans le message de retour.
4. urlCodec : après lecture d'un lien legacy ?d=, réécrire l'URL en #d= via
   history.replaceState et purger le paramètre query (la decklist ne doit plus
   figurer dans les requêtes/logs edge après la première lecture).

CONTRAINTES :
- Pas de régression : chaque mise à jour de dépendance est validée par
  npm run test:unit + npm run build ; aucune mise à jour major sans validation
  e2e (npm run test:core-flows).
- Gestion des erreurs requise : URL legacy malformée → comportement actuel
  conservé (ignore gracieux) ; worker recevant un payload invalide → erreur
  typée renvoyée au thread principal, jamais d'exception non gérée.
- Tests : clamp des itérations, réécriture d'URL legacy, non-régression du
  décodage de liens partagés existants (hash ET query).
- npm run test:unit et npm run type-check doivent passer.
```

---

_Ordre d'exécution recommandé : T01 (saisie/boot) et T02 (purge) en premier — ils simplifient toutes les tâches suivantes — puis T03, T04-T07 (perf), T08-T09 (archi), T10-T11 (sec), T12, puis les P3 (T13-T15). T03 et T08 touchent tous deux `deckAnalyzer.ts` : les exécuter séquentiellement._

---

## 4. Synthèse & Feuille de Route Technique (pont)

L'audit technique conclut à un socle sain (sécurité, lazy loading, worker réel) portant une dette archéologique maîtrisable sans refonte : purge du code mort (T02), consolidation des sources de vérité (T03, T09), assainissement de la persistance (T01) et branchement de la validation existante (T10). Aucun chantier ne bloque l'évolution produit — au contraire : **T02 et T03 doivent précéder les développements produit**, car toute fonctionnalité touchant la détection de terrains ou le bundle hériterait sinon de la dette existante. Les sections qui suivent partent donc du principe que les P1/P2 sont traités ou en cours.

---

## 5. Analyse Marketing, Positionnement & Viabilité

> Objectif produit : faire de ManaTuner l'outil de référence sur la mana base pour **tous** les profils de joueurs MTG — débutants, casual « kitchen table », Commander/EDH, compétitifs — sans sacrifier la précision statistique qui fait sa crédibilité.

### Benchmark de l'existant

| Solution                                                                                                                                                   | Forces                                                                      | Faiblesses exploitables par ManaTuner                                                                                                                                                                                       |
| ---------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Calculateurs stricts** (tables de Frank Karsten, feuilles de calcul hypergéométriques, Project Manabase de Charles Wickham — l'inspiration de ManaTuner) | Rigueur mathématique reconnue par les compétitifs                           | Statiques, génériques (pas d'analyse _par sort, par tour_ de votre deck), aucune pédagogie, aucune simulation de mulligan, aucune recommandation actionnable. L'utilisateur doit interpréter seul des tableaux.             |
| **Moxfield**                                                                                                                                               | Deckbuilding + partage social de référence, API Scryfall propre             | La mana base est un sous-produit de la liste : statistiques sommaires (pip counts, curve), pas d'analyse probabiliste de castabilité au tour N. L'utilisateur _construit_ sur Moxfield mais ne _comprend_ pas sa mana base. |
| **EDHREC**                                                                                                                                                 | Données agrégées de milliers de decks Commander, recommandations populaires | Prescrit « ce que les autres jouent », pas « ce dont VOTRE deck a besoin ». Aucune simulation, aucune prise en compte de votre curve réelle. Approche collective vs. analyse individuelle.                                  |
| **Untapped.gg**                                                                                                                                            | Analytics Arena en jeu, winrates réels, overlay                             | Dépendant de MTG Arena (exclut le papier et les autres clients), freemium avec paywall sur les stats avancées, tracking invasif, aucune analyse prospective de mana base (constat de parties, pas de conception).           |

**Conclusion du benchmark** : le marché est polarisé entre des outils _rigoureux mais austères_ (calculateurs) et des plateformes _sociales mais superficielles_ sur la mana base. **Personne n'occupe la case « analyse probabiliste approfondie, pédagogique et actionnable, appliquée à votre deck ».** C'est exactement ce que ManaTuner fait déjà techniquement (castabilité par sort/tour, simulateur de mulligan en Web Worker, recommandations, blueprint exportable) — l'écart n'est pas fonctionnel, il est d'**emballage et d'accessibilité**.

### Analyse des Besoins par Profil

| Profil                     | Attentes                                                                                                                             | Ce que ManaTuner a déjà                                                                   | Ce qui manque                                                                                                                                                             |
| -------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Débutant**               | Comprendre _pourquoi_ « 24 lands » ; vulgarisation ; ne pas être noyé sous les probabilités ; langage simple, glossaire              | Pages guides, glossaire des terrains, onboarding (react-joyride), page Mathématiques      | Un **mode guidé** : résultats traduits en phrases (« Vous pourrez lancer ce sort au tour 3 dans 7 parties sur 10 »), jargon masqué par défaut, glossaire inline au survol |
| **Casual / kitchen table** | Rapidité, zéro compte, zéro friction, fun visuel, partage avec les amis du samedi soir                                               | Aucun compte requis, partage par URL hash, export visuel (ManaBlueprint PDF/PNG)          | Exports « carte de stats » optimisés réseaux sociaux/Discord, presets de formats casual, comparaison avant/après modification                                             |
| **Commander/EDH**          | Singleton 100 cartes, multijoueur (rythme plus lent, tours 1-4 critiques pour la ramp), gestion des commandants et du color identity | Le moteur gère les gros decks (l'audit confirme des analyses EDH)                         | Détection explicite du format Commander, métriques dédiées (ramp au tour 2, accès aux couleurs du commandant, « sol ring hands »), seuils adaptés au rythme multijoueur   |
| **Compétitif**             | Précision, transparence méthodologique, mulligan, données exportables, reproductibilité                                              | Hypergéométrique exacte, Monte Carlo en worker, page Mathématiques documentant la méthode | Paramétrage fin (nombre d'itérations, intervalles de confiance affichés), export CSV/JSON des résultats, comparaison de variantes de mana base A/B                        |

**Constat transversal** : les quatre profils utiliseraient **le même moteur** — seule la couche de présentation et les seuils de recommandation diffèrent. C'est une excellente nouvelle architecturale : un système de profils en façade, zéro duplication de logique.

### Proposition de Valeur Unique (USP) & Différenciation

> **« ManaTuner ne vous dit pas quoi jouer. Il vous montre, chiffres à l'appui, pourquoi votre mana base fonctionne — ou pas — et comment la réparer. »**

Trois piliers de différenciation défendables :

1. **Analyse individuelle probabiliste, pas statistique de foule.** Là où EDHREC agrège ce que les autres jouent, ManaTuner simule _votre_ deck : castabilité de chaque sort à chaque tour, mulligans réels en Monte Carlo. Différenciation nette face à Moxfield/EDHREC.
2. **Pédagogie intégrée.** Là où Karsten donne des tables à interpréter, ManaTuner traduit en langage joueur, avec guides et glossaire dans le parcours. C'est ce qui rend l'outil accessible aux débutants sans « dumber down » le moteur.
3. **Privacy by design + éco-conception.** Aucun compte, aucune donnée deck envoyée à un serveur (tout est calculé côté client, le partage passe par l'URL), Sentry désactivé par défaut, pas de tracker publicitaire. À l'heure où Untapped.gg monétise la donnée de jeu, c'est un positionnement marketing à part entière — et un argument crédible dans la communauté MTG, historiquement méfiante envers les apps intrusives.

**Le défi UX — fédérer sans surcharger** : la réponse est une **UX adaptative par profil** (détaillée en tâche P01 ci-dessous) : un choix de profil à l'onboarding qui règle trois curseurs — _densité d'information_ (phrases vulgarisées vs. tableaux bruts), _métriques affichées_ (ramp EDH vs. seuils Karsten compétitifs), _onboarding_ (visite guidée complète vs. skip direct). L'interface reste unique ; seule sa profondeur varie. Ce mécanisme évite le piège classique des « modes » qui forkent l'UI et doublent la maintenance.

### Stratégie d'Acquisition & Viralité

**Leviers organiques (prioritaires, coût quasi nul) :**

- **SEO éditorial déjà amorcé** : la bibliothèque d'articles, le glossaire des terrains et le prerender (avec sitemap généré) sont des assets existants — c'est le canal d'acquisition long terme des débutants (« combien de terrains commander », « mana base 3 couleurs »). À renforcer par du contenu ciblé par profil.
- **Exports visuels viraux** : la « mana stats card » — image PNG compacte (curve + répartition des couleurs + verdict de consistance) générée via l'infrastructure html2canvas **déjà présente** (`ManaBlueprint.tsx`) — pensée pour être postée sur Discord/X/Reddit avec le lien de partage. Chaque export est une publicité native. C'est la mécanique virale n°1 (tâche P03).
- **Partage par URL** : le partage par hash existe (`urlCodec.ts`) ; le rendre visible (bouton « Partager l'analyse » avec preview Open Graph dynamique) transforme chaque analyse en point d'entrée SEO/social. Les OG images dynamiques (`scripts/generate-og.mjs` existe) doivent être branchées sur les liens d'analyse.
- **Intégration Discord** : la communauté MTG vit sur Discord. Un embed riche (via les meta OG du lien partagé) affichant la stats card dans les serveurs EDH/compétitifs = boucle de viralité. Pas de bot à maintenir dans un premier temps : les unfurl d'embed suffisent.

**Canaux communautaires (effort modéré) :**

- Présence ciblée : r/edh, r/magicTCG, serveurs Discord Commander et compétitifs, réponses pédagogiques avec analyse d'exemple — jamais de spam.
- Contenu « preuve par l'analyse » : décortiquer la mana base d'un deck connu (liste de Pro Tour, préconstruit Commander populaire) et publier l'analyse — format réplicable en série, idéal pour le SEO et les réseaux.
- Communautés francophones (l'auteur est francophone, le site est bilingue FR/EN) : avantage différenciant sur un marché des outils quasi 100 % anglophone.

**Anti-leviers (à ne pas faire)** : pas de pubs tierces, pas de paywall sur les fonctionnalités cœur, pas de dark patterns de rétention — incohérents avec le pilier privacy et contre-productifs auprès de cette communauté.

### Viabilité & Modèle Éthique

**Structure de coûts — naturellement frugale.** L'architecture actuelle est un atout économique majeur : SPA statique sur CDN (Vercel), calculs 100 % côté client, aucune base de données utilisateurs, seule dépendance externe l'API Scryfall (gratuite, déjà cachée et rate-limitée). Le coût marginal par utilisateur est proche de zéro — l'outil peut croître en audience sans que la facture suive. L'éco-conception n'est pas une contrainte ici, elle est déjà la réalité de l'architecture ; la purge du code mort (T02) et l'allègement du bundle (T12) la renforcent encore.

**Modèle économique recommandé — contributif et transparent, par ordre de préférence :**

1. **Don / mécénat** (Ko-fi, GitHub Sponsors, Patreon) : cohérent avec l'esprit communautaire MTG et le positionnement privacy. Revenu modeste mais sans friction ni dette d'attente.
2. **Supporter tier éthique** : fonctionnalités « confort » sans enfermer le cœur — thèmes visuels, exports HD/personnalisés, historique d'analyses étendu (déjà local, donc sans coût serveur). Jamais de statistiques derrière un paywall : ce serait trahir l'USP face à Untapped.gg.
3. **Affiliation éditoriale douce** : liens vers des boutiques de cartes (Cardmarket/TCGplayer) depuis les recommandations de terrains — pertinent contextuellement, non intrusif, à divulguer clairement.

**Red lines éthiques (à graver dans le README) :** pas de revente de données (il n'y en a de toute façon pas), pas de tracker tiers, Sentry toujours opt-in, le modèle ne doit jamais financer la croissance par la captation d'attention. La confiance communautaire est l'actif principal du projet ; elle se perd une fois.

**Risques de viabilité à surveiller :** dépendance à l'API Scryfall (gratuité et ToS — WotC peut changer les règles ; le cache IDB et le seed local sont déjà des amortisseurs), politique WotC sur le contenu de fans (respecter le Fan Content Policy : pas d'usage commercial des illustrations), et charge de maintenance d'un projet d'auteur unique (d'où l'importance des tâches de purge T02/T14 pour réduire la surface).

### Plan d'Implémentation Produit (Prompts Grok 4.5)

> Trois fonctionnalités majeures, atomiques et exécutables indépendamment. Prérequis : T01–T03 de la section 3 traitées ou coordonnées (P01 et P03 touchent des fichiers proches de T01/T02). Après chaque tâche : `npm run test:unit`, `npm run type-check`, `npm run lint` doivent rester verts.

#### P01 — UX adaptative par profil joueur (débutant / casual / commander / compétitif)

```text
RÔLE : Tu es un développeur React/TypeScript senior spécialisé en UX adaptative
et design systems MUI.

OBJECTIF PRODUIT : Un choix de profil joueur (beginner | casual | commander |
competitive) à l'onboarding qui ajuste la densité d'information, les métriques
mises en avant et le niveau de vulgarisation — SANS forker l'interface ni
dupliquer la logique d'analyse.

FICHIERS À CRÉER :
- src/contexts/PlayerProfileContext.tsx (contexte + provider + hook usePlayerProfile)
- src/constants/playerProfiles.ts (définition des 4 profils : labels FR/EN,
  seuils de recommandation, métriques prioritaires, flags de vulgarisation)
- src/components/ProfileSelector.tsx (choix à l'onboarding + modification
  ultérieure depuis les réglages)

FICHIERS À MODIFIER :
- src/components/Onboarding.tsx (intégrer le ProfileSelector comme première
  étape du parcours react-joyride existant ; profil "casual" par défaut si skip)
- src/main.tsx (monter le PlayerProfileProvider ; persister le choix via le
  mécanisme de persistance existant — respecter la convention qui aura émergé
  de la tâche d'audit T01, clé localStorage "manatuner_player_profile")
- src/components/analysis/EnhancedRecommendations.tsx (rendu adaptatif :
  en mode beginner, chaque recommandation est précédée d'une phrase vulgarisée
  et le jargon est masqué derrière un tooltip glossaire ; en mode competitive,
  afficher les valeurs brutes et les intervalles)
- src/components/analyzer/CastabilityTab.tsx (ordre et visibilité des métriques
  selon profil : commander → ramp tours 1-4 et accès couleurs en tête ;
  competitive → tableaux complets par tour)
- src/pages/LandGlossaryPage.tsx (liens contextuels depuis les tooltips)

LOGIQUE À IMPLÉMENTER :
1. PlayerProfileContext expose : profil courant, setProfile, et un objet
   `profileConfig` dérivé (memoïsé) contenant verbosity ('simple'|'full'),
   highlightedMetrics (liste ordonnée de clés), showAdvancedStats (booléen).
2. Aucun calcul d'analyse ne dépend du profil : le moteur (services/) est
   strictement inchangé ; seule la présentation consomme profileConfig.
3. Vulgarisation beginner : dictionnaire de traduction dans
   src/constants/playerProfiles.ts (ex. probabilité 0.87 tour 3 →
   « Vous lancerez ce sort à temps dans environ 9 parties sur 10 ») ;
   helper formatProbabilityForProfile() testable, placé dans src/utils/.
4. Le profil commander active l'affichage des métriques multijoueur (tâche
   P02 si livrée ; sinon masquage gracieux).

CONTRAINTES :
- Pas de régression : sans choix de profil (utilisateur existant), l'interface
  est STRICTEMENT identique à l'actuelle (profil par défaut = affichage actuel).
- Gestion des erreurs requise : valeur de profil inconnue en storage → fallback
  défaut silencieux ; i18n FR/EN complète pour tout nouveau libellé (respecter
  le bilinguisme existant du site).
- Accessibilité : le sélecteur est navigable au clavier et annoncé aux lecteurs
  d'écran (suivre les patterns ARIA déjà présents dans le projet).
- Tests : helper de vulgarisation (bornes, arrondis), fallback profil inconnu,
  non-régression du rendu par défaut (snapshot ou assertions existantes).
- npm run test:unit, npm run type-check, npm run lint doivent passer.
```

#### P02 — Mode Commander/EDH : détection de format et métriques multijoueur

```text
RÔLE : Tu es un développeur TypeScript senior, expert Magic: The Gathering
(règles Commander : 100 cartes singleton, color identity, rythme multijoueur).

OBJECTIF PRODUIT : Détecter automatiquement un deck Commander à l'import et
adapter les métriques et seuils d'analyse au rythme multijoueur, sans alourdir
l'expérience des autres formats.

FICHIERS À MODIFIER :
- src/services/deckAnalyzer.ts (détection de format : 99-100 cartes, singleton
  hors terrains de base, présence d'un commandant déclaré ou détecté ; NOTE :
  coordonner avec la tâche d'audit T08 si le fichier est en cours de découpage —
  la logique de détection ira alors dans le module parser)
- src/services/mulliganSimulatorAdvanced.ts (stratégie de mulligan EDH :
  free mulligan + règle du "Paris partial" non applicable en Commander actuel —
  appliquer la règle officielle : premier mulligan gratuit, puis draw-7-put-1
  par mulligan suivant)
- src/components/analyzer/ (onglet ou section "Commander" affiché
  conditionnellement à la détection : accès aux couleurs du commandant,
  castabilité de la ramp tours 1-4, consistance des 3+ couleurs)
- src/constants/ (seuils de recommandation EDH : les seuils Karsten compétitifs
  ne s'appliquent pas au multijoueur ; définir des seuils documentés, ex.
  cible ramp au tour 2-3, 36-38 terrains de référence avec justification)
- src/types/ (type Format = 'commander' | 'constructed' | 'unknown' propagé
  dans AnalysisResult)

LOGIQUE À IMPLÉMENTER :
1. Détection heuristique documentée : 100 cartes + singleton (hors basics) →
   'commander' avec niveau de confiance ; l'utilisateur peut corriger via un
   sélecteur de format (ne jamais écraser son choix manuel).
2. Métriques EDH : pour chaque couleur du commandant, probabilité d'y avoir
   accès aux tours 1, 2, 3 ; probabilité d'une ramp jouable tour ≤3 (les
   artefacts/ramp détectés via les métadonnées Scryfall déjà disponibles) ;
   alerte si une couleur de pip faible (<5 sources) est requise tôt.
3. Réutiliser EXCLUSIVEMENT le module hypergéométrique unifié (tâche T09) —
   aucune réimplémentation de probabilités.

CONTRAINTES :
- Pas de régression : un deck non-Commander (60 cartes, 4-ex) produit une
  analyse STRICTEMENT identique à l'actuelle ; la section Commander reste
  masquée.
- Gestion des erreurs requise : deck hybride/ambigu (ex. 100 cartes non
  singleton) → format 'unknown' + affichage standard, jamais de crash ;
  commandant non résolu par Scryfall → métriques couleur calculées sur la
  main deck uniquement, avec mention explicite.
- Tests : détection (100 singleton, 60 constructed, cas ambigus), règle de
  mulligan Commander (premier gratuit), non-régression des fixtures
  tests/fixtures/competitive-decklists.js.
- npm run test:unit, npm run test:mtg-logic, npm run type-check OK.
```

#### P03 — Viralité : « Mana Stats Card » exportable + partage Discord-ready

```text
RÔLE : Tu es un développeur front-end senior spécialisé en génération d'images
côté client (canvas) et en intégrations Open Graph.

OBJECTIF PRODUIT : Transformer chaque analyse en contenu partageable : une
image PNG "Mana Stats Card" (curve, répartition des couleurs, verdict de
consistance, branding ManaTuner) + un lien de partage dont l'aperçu Discord/X
affiche cette image via les meta Open Graph.

FICHIERS À MODIFIER :
- src/components/export/ManaBlueprint.tsx (ajouter un format d'export compact
  "Stats Card" 1200×630 — dimension OG standard — à côté du PDF existant ;
  réutiliser l'import dynamique html2canvas DÉJÀ en place lignes 150,177-179)
- src/components/export/ (créer StatsCardExport.tsx : rendu dédié, hors-écran,
  stylé via le design system du projet — ne PAS copier-coller le blueprint)
- src/utils/urlCodec.ts (s'assurer que le lien de partage hash encode tout ce
  que la Stats Card affiche ; si un champ manque, l'ajouter au codec en
  versionnant le format — ne pas casser les liens existants)
- src/pages/AnalyzerPage.tsx (bouton "Partager" visible en fin d'analyse :
  copie du lien + téléchargement PNG en un clic chacun)
- scripts/generate-og.mjs et/ou scripts/prerender.mjs (pour les pages
  éditoriales : vérifier que les meta og:image pointent sur l'asset courant —
  l'audit a relevé une référence obsolète og-image-v3 dans
  src/pages/LandGlossaryPage.tsx:282 à corriger au passage)

LOGIQUE À IMPLÉMENTER :
1. StatsCardExport : composant rendu en offscreen, capturé en PNG via
   html2canvas (scale 2 pour la netteté retina), contenu : nom du deck,
   format, curve condensée, sources par couleur (symboles mana du projet),
   2-3 métriques clés selon le profil actif (P01), watermark manatuner.app.
2. Génération entièrement côté client (cohérent privacy : aucune donnée deck
   ne transite par un serveur) ; le téléchargement utilise un object URL
   révoqué après usage.
3. Partage : le lien hash existant suffit pour les données ; pour l'aperçu
   OG sur les liens d'analyse dynamiques, documenter la limite (SPA statique :
   l'og:image ne peut pas être dynamique par deck sans fonction serverless) et
   implémenter la solution maximale côté statique : og:image générique Stats
   Card + titre/description parlants. NE PAS introduire de fonction serverless
   dans cette tâche.

CONTRAINTES :
- Pas de régression : l'export PDF blueprint existant est inchangé ; les liens
  de partage déjà en circulation (format hash actuel) doivent continuer à
  s'ouvrir — versioning du codec avec rétrocompatibilité testée.
- Gestion des erreurs requise : échec html2canvas (polices/canvas tainted) →
  message utilisateur explicite + fallback "copier le lien seul" ; clipboard
  API indisponible (permissions) → fallback sélection manuelle du lien ;
  mémoire : révoquer les object URLs et nettoyer le nœud offscreen dans tous
  les chemins (succès/erreur).
- Performance : html2canvas et la génération ne doivent JAMAIS être dans le
  bundle eager (dynamic import conservé) ; capture < 2 s sur mobile milieu
  de gamme pour une analyse EDH.
- Tests : versioning/rétrocompat du codec, fallback clipboard, présence des
  meta OG corrigées ; test e2e du flux Partager si la suite Playwright le
  permet (tests/e2e/core-flows/).
- npm run test:unit, npm run type-check, npm run build OK.
```

_Ordre recommandé : P01 (socle profils) → P02 (exploite le profil commander) → P03 (exploite les profils pour le contenu des exports). P03 est indépendant et peut démarrer en parallèle si les ressources le permettent._

---

## 6. Innovations & Angles Morts (Blind Spots)

> **Erratum préalable (honnêteté d'audit).** L'exploration de `.github/` — non couverte par l'audit initial — révèle que le projet dispose **déjà** d'une CI/CD GitHub Actions (`.github/workflows/ci.yml` : lint, type-check, tests unitaires, build, `npm audit` ; `.github/workflows/pr-validation.yml` : idem + couverture + rapport de taille de bundle) **et** d'un `.github/dependabot.yml` configuré (npm + github-actions, hebdomadaire). Deux corrections s'imposent donc :
>
> 1. La tâche **T15** (section 3) doit être amendée : ne pas _créer_ `dependabot.yml` (il existe) mais le _durcir_ (groupement mineures/patch, ignore des majors sensibles).
> 2. La CI/CD et Dependabot ne figurent **pas** dans les angles morts ci-dessous — ils existent. Les vrais angles morts CI sont ailleurs : les tests **e2e Playwright ne tournent pas en CI** (seuls les tests unitaires y sont), aucun **seuil de couverture** n'est enforcé (`test:coverage` tourne sans gate), aucun **budget de bundle** bloquant (le rapport de taille est informatif, jamais sanctionné), et `npm audit` est en `continue-on-error: true` (`ci.yml:42-43`) — c'est-à-dire décoratif.

### Angles Morts Techniques

| #   | Angle mort                                              | État actuel (preuve)                                                                                                                                  | Ce que ça coûte                                                                                                                              | Recommandation                                                                                                                                                                                                                                                                                                                                 |
| --- | ------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| AM1 | **CI : gates absents** (e2e, couverture, bundle, audit) | `ci.yml` ne lance pas Playwright ; `pr-validation.yml:40` couvre sans seuil ; `npm audit` en `continue-on-error`                                      | Les régressions visuelles/e2e et les CVE « high » passent en prod sans signal                                                                | Exécuter `test:core-flows` en CI (chromium only), seuil de couverture minimal sur `src/services/`, budget bundle bloquant sur le poids eager (cf. T12), `npm audit` non contournable en `critical`                                                                                                                                             |
| AM2 | **Observabilité runtime quasi nulle**                   | Sentry off par défaut (choix privacy assumé, `main.tsx:59`) mais **aucun** fallback : pas de Web Vitals, pas de télémétrie d'erreurs auto-hébergée    | L'auteur est aveugle sur les erreurs et perfs réelles des utilisateurs — les P1 de l'audit (redux-persist) auraient été détectés par du RUM  | Web Vitals côté client (`web-vitals`, ~2 KB) + endpoint collecte minimal auto-hébergé ou Sentry self-hosted, toujours opt-in via `PrivacySettings.tsx` — la privacy est un choix de destination des données, pas une raison de ne rien mesurer                                                                                                 |
| AM3 | **PWA / mode hors-ligne non activé**                    | `public/manifest.json` existe, `public/sw.js` existe mais n'est **jamais enregistré** — `main.tsx:77-95` désenregistre même tous les SW               | L'app est inutilisable en FNM/tournoi sans réseau (cas d'usage réel : salle de tournoi au sous-sol), alors que tout le calcul est déjà local | `vite-plugin-pwa` (Workbox) : app shell + `landSeed` + cache Scryfall IDB déjà présent → offline complet. À coordonner avec T02 qui supprime le `sw.js` legacy mort                                                                                                                                                                            |
| AM4 | **Pas de cache edge pour les données**                  | Seuls les assets statiques ont `immutable` (`vercel.json`) ; `public/library.json` et les données d'articles sont servies sans stratégie différenciée | Bande passante Vercel gaspillée sur des données quasi immuables ; latence inutile hors d'Europe                                              | Headers `Cache-Control: s-maxage` + `stale-while-revalidate` sur `library.json`, feeds et sitemap ; envisager l'ISR/edge config pour les articles                                                                                                                                                                                              |
| AM5 | **Collaboration temps réel absente**                    | Partage = URL hash statique à sens unique (`urlCodec.ts`)                                                                                             | Un playgroup Commander ne peut pas annoter/itérer une mana base ensemble — usage communautaire fort (cf. section 5)                          | Différé volontairement : WebSockets/SSE impliquent un serveur, rompant le modèle « zéro backend, coût marginal nul ». Alternative frugale documentée : collaboration **asynchrone** (commentaires encodés dans l'URL, itérations versionnées) ou CRDT pair-à-pair (Yjs + WebRTC) sans serveur d'état. À ne faire qu'avec un cas d'usage prouvé |
| AM6 | **Tests visuels et accessibilité hors CI**              | Suites Playwright `@visual`, `accessibility/`, `performance/` existent (`package.json:37-38`) mais aucune ne tourne en CI                             | Investissement test déjà payé mais zéro retour : ces suites pourrissent localement                                                           | Ajouter un job CI nightly (non bloquant sur PR) pour e2e accessibilité + visuel                                                                                                                                                                                                                                                                |

### Innovations Fonctionnelles

| #   | Innovation                                                                                                                                                                                               | Disruptivité                                                                                                               | Faisabilité / cohérence projet                                                                                                                                        | Verdict                                                               |
| --- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------- |
| IN1 | **Scan de decklist physique par Computer Vision** (photo d'une liste papier/proxy → decklist parsée, OCR **on-device** via Tesseract.js en Web Worker)                                                   | Élevée : aucun concurrent manabase ne le fait ; transforme l'entrée de données (point de friction n°1, surtout casual/EDH) | Bonne : 100 % client → cohérent privacy ; worker déjà maîtrisé dans le projet ; dynamic import (Tesseract.js ~2-4 MB, lazy)                                           | **★ Choisi pour le plan d'implémentation**                            |
| IN2 | **Moteur de suggestions de substitution de terrains** (« remplacer X par Y améliore la castabilité de vos sorts à 2 pips de +6 % au tour 3 ») — optimisation par recherche locale sur le moteur existant | Très élevée : c'est LE passage de « diagnostic » à « prescription » que ni Moxfield ni EDHREC ne font sur votre deck       | Excellente : pure extension algorithmique de `manaCalculator`/`hypergeom`, zéro dépendance externe, testable numériquement                                            | **Recommandé en P04 bis** (suite naturelle de P01/P02)                |
| IN3 | **Prédiction de meta** (tendances archétypes via données publiques MTGGoldfish/MTGTop8 → pondération des recommandations)                                                                                | Moyenne-élevée                                                                                                             | Faible à court terme : scraping fragile, ToS, nécessite un pipeline de données (premier vrai backend)                                                                 | Différer — contredit le modèle frugal sans revenu associé             |
| IN4 | **LLM local (WebLLM) pour explications en langage naturel** de l'analyse                                                                                                                                 | Spectaculaire en démo                                                                                                      | Faible : 1-4 GB de poids de modèle à télécharger, incompatible éco-conception et mobile ; la vulgarisation par templates (P01) couvre 90 % du besoin pour 0 % du coût | Rejeter pour l'instant ; réévaluer quand les SLM navigateur mûrissent |
| IN5 | **Import direct Moxfield/Archidekt** (coller une URL de deck → import via leur API/publique)                                                                                                             | Moyenne : commodité réelle, pas disruptive                                                                                 | Bonne : endpoints publics, côté client, déjà le pattern Scryfall                                                                                                      | Quick win produit à glisser dans P01                                  |

### Quick Wins (Perf/Coût)

Trois ajouts mineurs (< 1 journée chacun), ROI massif :

1. **QW1 — Headers de cache sur les données publiques** (`vercel.json` uniquement) : `Cache-Control: public, s-maxage=86400, stale-while-revalidate=604800` sur `/library.json`, `/llms*.txt`, `/changelog.json`, `/sitemap.xml`. Ces fichiers ne changent qu'au build (régénérés par `generate-library-feeds.mjs`) → réduction directe de la bande passante Vercel facturée et de la latence perçue. _Aucune ligne de code applicatif._
2. **QW2 — Préchargement des chunks lazy à l'idle/hover** : sur la Home, `requestIdleCallback` (fallback `setTimeout`) déclenchant l'`import()` des chunks des routes les plus probables (`/analyzer` en premier), et prefetch au hover/focus des liens de navigation. Le lazy loading (T12) a un coût au premier clic — le prefetch idle l'annule sans toucher au poids eager. Pattern : `<Link onMouseEnter={() => import('...')}>` ou un petit `usePrefetchRoute()`. Gain : navigation quasi instantanée perçue.
3. **QW3 — Budget de bundle bloquant en CI** : faire évoluer le « Bundle size report » existant (`pr-validation.yml:46-56`, aujourd'hui purement informatif) en assertion : échec de la PR si le poids eager (index + vendors préchargés listés dans `dist/index.html`) dépasse un seuil (ex. 750 KB raw, à ajuster après T12) ou si un chunk > 600 KB apparaît. ~20 lignes de shell/node dans la CI existante. C'est le verrou qui empêche définitivement la re-croissance du bundle après les purges T02/T12 — sans lui, la dette revient en six mois.

### Plan d'Implémentation (Prompts Grok 4.5)

**Innovation retenue : IN1 — Scan de decklist physique par Computer Vision on-device.** Justification : c'est l'innovation à la fois la plus disruptive (personne ne le fait sur ce segment), la plus alignée avec le positionnement privacy (OCR 100 % local, aucune image ne quitte l'appareil), la plus cohérente avec l'existant technique (pattern Web Worker déjà éprouvé pour le Monte Carlo, dynamic import déjà la norme pour les libs lourdes), et celle qui attaque le point de friction n°1 de l'outil : la saisie de la decklist.

#### P04 — Scan de decklist physique (OCR on-device en Web Worker)

```text
RÔLE : Tu es un développeur front-end senior spécialisé en Web Workers,
computer vision embarquée (Tesseract.js) et UX de capture mobile.

OBJECTIF PRODUIT : Permettre à l'utilisateur de photographier (ou d'importer
l'image d') une decklist physique/imprimée et d'obtenir la decklist texte
parsée, prête pour l'analyse — intégralement côté client, aucune image ni
donnée ne quittant l'appareil (cohérence stricte avec le positionnement
privacy de ManaTuner).

FICHIERS À CRÉER :
- src/workers/decklistOcr.worker.ts (worker OCR : chargement paresseux de
  Tesseract.js, progression reportée par messages, annulation par
  terminate())
- src/components/analyzer/DecklistScanner.tsx (UI : bouton "Scanner une
  liste", input capture caméra mobile + upload image, prévisualisation,
  état de progression, édition du texte reconnu AVANT injection)
- src/utils/ocrPostProcess.ts (nettoyage du texte OCR → lignes decklist :
  tolérance aux confusions OCR classiques 0/O, 1/l, artefacts de colonnes)

FICHIERS À MODIFIER :
- src/components/analyzer/DeckInputSection.tsx (ajouter l'entrée
  "Scanner une liste" à côté de la zone de texte ; injecter le texte
  confirmé dans le state decklist EXACTEMENT comme une saisie manuelle —
  respecter le debounce de la tâche T01 si mergée)
- src/services/scryfall.ts (réutiliser parseDecklistText existant pour la
  validation des lignes reconnues ; AUCUNE duplication du parsing)
- package.json (ajouter tesseract.js — vérifier la licence Apache-2.0 et
  l'absence d'alternative déjà présente avant toute installation)
- vite.config.ts (s'assurer que tesseract.js et ses fichiers de langue ne
  sont JAMAIS dans le bundle eager : dynamic import uniquement ; vérifier
  le fonctionnement du worker Vite `?worker` déjà utilisé par
  src/workers/mulliganArchetype.worker.ts)

LOGIQUE À IMPLÉMENTER :
1. Flux : capture/import image → prévisualisation avec recadrage simple
   (optionnel mais recommandé : rotation 90° pour photos de listes
   verticales) → envoi de l'ImageBitmap au worker → OCR (langue eng,
   whitelist de caractères : alphanumérique, espaces, apostrophes, tirets,
   chiffres — les noms de cartes Magic n'utilisent que ça) → post-
   traitement lignes → textarea éditable pré-remplie → bouton "Utiliser
   cette liste" → parseDecklistText → decklist.
2. Pattern worker IDENTIQUE à celui de MulliganTab (request-id anti-race,
   un seul worker vivant, terminate() au unmount, progression en %).
3. Pré-traitement image côté client avant OCR (canvas 2D : niveaux de gris
   + normalisation de contraste) pour fiabiliser les photos de listes
   imprimées ; PAS de filtre agressif qui dégraderait les captures écran.
4. Messages d'état honnêtes : l'OCR est probabiliste — toujours afficher le
   texte reconnu éditable avant validation, et signaler les lignes non
   reconnues comme decklist (rejetées par parseDecklistText).

CONTRAINTES :
- Privacy non négociable : AUCUN appel réseau ne doit transporter l'image
  ni le texte reconnu ; les fichiers de langue Tesseract sont téléchargés
  depuis le CDN par défaut — les auto-héberger dans public/ (ou documenter
  explicitement cette exception à la politique "aucune donnée sortante",
  car le CDN reçoit l'IP). Vérifier l'absence de télémétrie Tesseract.
- Pas de régression : le flux de saisie manuelle est strictement inchangé ;
  le scanner est une entrée additionnelle ; build eager inchangé
  (tesseract.js lazy — vérifier via le rapport de bundle QW3).
- Gestion des erreurs requise : échec de chargement du worker ou des
  fichiers de langue (hors-ligne avant mise en cache) → message clair +
  fallback saisie manuelle ; image illisible/OCR vide → état explicite,
  jamais d'injection de texte vide silencieuse ; annulation en cours
  d'OCR → terminate() propre sans unhandled rejection ; mémoire :
  révoquer object URLs, libérer ImageBitmap, terminate le worker dans
  TOUS les chemins (succès/erreur/annulation/unmount).
- Performance : première utilisation (téléchargement langue) affichée avec
  progression ; OCR d'une liste imprimée < 10 s sur mobile milieu de gamme ;
  l'UI reste réactive pendant tout le traitement (tout le lourd est dans
  le worker).
- Tests : ocrPostProcess (confusions 0/O, colonnes, lignes parasites),
  intégration avec parseDecklistText sur fixtures de texte OCR simulé,
  cycle de vie du worker (annulation, terminate). Test e2e Playwright du
  flux upload si la suite le permet (tests/e2e/core-flows/).
- npm run test:unit, npm run type-check, npm run lint, npm run build OK.
```

_Si P04 n'est pas priorisé, l'alternative recommandée est IN2 (moteur de suggestions de substitution) : moins spectaculaire mais 100 % algorithmique sur le moteur existant, sans nouvelle dépendance — un prompt équivalent peut être généré sur demande._

---

## 7. État d'Avancement & Consignes d'Exécution

> **Mis à jour :** 2026-08-02 · **Ship tech** `10845c7` (T01+T06–T15+QW/AM) · Dependabot **off** `0ae8295`.  
> Prod Vercel a déployé `10845c7`. Priorité business = `LAUNCH.md`.  
> **Reste ouvert = produit / angles morts AM2–AM3–AM5 + résidus CI optionnels** — voir prompt  
> `docs/session/PROMPT_AUDIT_RESTE_PRIORISATION.md`.

### 7.0 Verdict exécution — **T01–T15 + QW + AM1/AM4/AM6 = FAIT (ship `10845c7`)**

| Tâche                                                     | Statut                                       | Validation                                                          |
| --------------------------------------------------------- | -------------------------------------------- | ------------------------------------------------------------------- |
| **T02** purge code mort + deps                            | ✅ **FAIT** (commit `332501d`)               | type-check · lint · test:unit · **build**                           |
| **T03** SSOT terrains landService/landSeed                | ✅ **FAIT** (commit `332501d`)               | type-check · lint · test:unit                                       |
| **T04** batch landCacheService                            | ✅ **FAIT** (commit `332501d`)               | type-check · lint · test:unit                                       |
| **T05** fetchWithTimeout Scryfall                         | ✅ **FAIT** (commit `332501d`)               | type-check · lint · test:unit                                       |
| **T01** redux-persist + debounce decklist                 | ✅ **FAIT** (`10845c7`)                      | type-check · lint · test:unit + tests transform/debounce            |
| **QW1 / AM4** cache headers library/feeds                 | ✅ **FAIT**                                  | `vercel.json` only                                                  |
| **T06** tempo non bloquant                                | ✅ **FAIT**                                  | type-check · lint · test:unit · mtg-logic · mana-calc               |
| **T07** batch lands inconnus                              | ✅ **FAIT**                                  | type-check · lint · test:unit                                       |
| **T09** hypergeom SSOT                                    | ✅ **FAIT**                                  | type-check · lint · test:unit · mtg-logic · mana-calc               |
| **T08** split deckParser/cardResolver                     | ✅ **FAIT**                                  | type-check · lint · test:unit                                       |
| **T10** zod safe EDH + rehydrate                          | ✅ **FAIT**                                  | type-check · lint · test:unit                                       |
| **T11** presentation hors public, wipe IDB, COEP, CSP doc | ✅ **FAIT**                                  | type-check · lint · test:unit                                       |
| **T15** audit, dependabot, clamp worker, `?d=`→`#d=`      | ✅ **FAIT**                                  | type-check · lint · test:unit · build budget                        |
| **T12** icons chunk + fonts CSP                           | ✅ **FAIT**                                  | type-check · lint · test:unit · **build** + tailles                 |
| **T13** BoundedMap caches + React memo/cleanup            | ✅ **FAIT**                                  | type-check · lint · test:unit                                       |
| **T14** esbuild drop prod-only + notes tsconfig           | ✅ **FAIT**                                  | type-check · lint · test:unit · build                               |
| **QW2** prefetch idle/hover Analyzer                      | ✅ **FAIT**                                  | type-check · lint · test:unit                                       |
| **QW3** budget bundle CI                                  | ✅ **FAIT**                                  | `scripts/check-bundle-budget.mjs` + workflows                       |
| **AM1** audit critical prod + e2e nightly                 | ✅ **FAIT** (partiel vs brief max)           | budget + audit critical prod ; e2e/a11y **nightly** non bloquant PR |
| **AM6** nightly a11y/visual                               | ✅ **FAIT**                                  | `.github/workflows/nightly-quality.yml`                             |
| **Dependabot**                                            | ⛔ **OFF** (`0ae8295`)                       | `dependabot.yml` supprimé — updates manuelles                       |
| P01–P04 · IN\* · AM2/AM3/AM5                              | ⏸ **NON FAIT** (produit / out of scope tech) | priorisation : prompt expert                                        |

**Arbre ship :** unit **440** pass / 2 skip · lint **0 err** · type-check ✓ · build ✓ · budget ✓ · prod `10845c7`.

### 7.7 Session tech T01 + T06–T15 (2026-08-02) — **SHIP `10845c7`**

**Gate non-régression :** type-check + lint + test:unit après **chaque** ID (mtg-logic/mana-calc quand moteur touché ; build pour vite/chunks).

**Highlights :**

- Persist v2 : `analysisResult` jamais sérialisé ; debounce 300 ms saisie + flush analyze
- Tempo : `analyzeSpellCastability` sync ; yield tous les 10 sorts ; AbortSignal + génération
- Lands : `prefetchUnknownLands` + `fetchLandDataBatch` chunks 75
- Hypergeom : deckAnalyzer délègue à `hypergeom` SSOT
- Archi : `deckParser.ts` + `cardResolver.ts` ; réexports stables
- Privacy wipe appelle IDB Scryfall ; `presentation.html` → `tools/` ; COEP `/workers/*` retiré
- Bundle : `vendor-mui` ~365 KB · `vendor-mui-icons` ~37 KB (séparé)
- npm audit prod : **0 critical** (`--omit=dev`) ; high `react-router` (RSC, N/A SPA — pas de downgrade force)

**Suite :** business = `LAUNCH.md` ; reste audit = priorisation expert  
(`docs/session/PROMPT_AUDIT_RESTE_PRIORISATION.md`) — pas d’impl auto.

---

### 7.1 T02 — Purge code mort — phase 1 (déjà appliquée avant session 7.2)

Fichiers supprimés (références vérifiées par grep exhaustif avant suppression) :

- `src/utils/landDetectionComplete.ts`, `src/utils/hybridLandDetection.ts`, `src/utils/intelligentLandAnalysis.ts`, `src/utils/landDetection.ts`, `src/utils/index.ts` (barrel mort ; `countPipsInCost` est importé directement depuis `utils/manaCostParser` par ses consommateurs)
- `src/services/advancedMaths.ts` + `src/services/__tests__/maths.critical.test.ts` (ne testait que lui)
- `src/services/mulliganSimulator.ts` + `src/services/__tests__/mulliganSimulator.test.ts` (ne testait que la couche compat)
- `src/components/analysis/MonteCarloResults.tsx`, `src/components/analysis/TurnByTurnAnalysis.tsx` (dossier `analysis/` supprimé, vide)
- `src/components/performance/OptimizedComponents.tsx` (dossier `performance/` supprimé, vide)
- `public/workers/manaCalculator.worker.js`, `public/workers/monteCarlo.worker.js` (dossier `public/workers/` supprimé)

**Correction à l'audit (sections 1-3) : `public/sw.js` et ses headers `vercel.json:60-71` ont été CONSERVÉS.** Ce n'est pas du code mort : c'est le « SW killer » volontaire (désenregistre les anciens service workers et purge les caches — documenté dans `CLAUDE.md` et `docs/security/SECURITY_AUDIT_REPORT.md`). Le retirer casserait l'éviction de cache chez les utilisateurs ayant un ancien SW enregistré. La tâche T02 de la section 3 est donc amendée sur ce point.

---

### 7.2 T02 — Phase 2 — **FAIT (2026-08-02)** · commit `332501d`

⚠️ Historique : l'arbre était cassé (`londonMulligan.test.ts` → `../mulliganSimulator` supprimé). **Réparé.** Les 5 actions sont **toutes appliquées** :

| #   | Action                                     | Statut | Détail livré                                                                                                                                                                                                                                                                                          |
| --- | ------------------------------------------ | ------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Purge fonctions mortes `manaCalculator.ts` | ✅     | Supprimé `calculateProbabilityByTurn`, `analyzeDeckConsistency`, `calculateOptimalLandCount` + interfaces `DeckCardForProbability`, `ColorBalance`. Conservé `calculateHypergeometric`, `ManaCalculator`, `KARSTEN_TABLES`. Heuristiques `name.includes('Tarn'/'Vents')` disparues avec le code mort. |
| 2   | Migrer `londonMulligan.test.ts`            | ✅     | Imports → `mulliganSimulatorAdvanced` (`chooseBottom`, `prepareDeckForSimulation`, `analyzeWithArchetype`). Test strategy → `analyzeWithArchetype(..., 'midrange', 100)` + assertions `expectedScores` / `distributions` / `thresholds`.                                                              |
| 3   | Fusion suites `manaCalculator`             | ✅     | `calculateHypergeometric` + Karsten methodology mergés dans `src/services/manaCalculator.test.ts` (format projet). Supprimé `src/services/__tests__/manaCalculator.test.ts`.                                                                                                                          |
| 4   | Retirer React Query de `main.tsx`          | ✅     | Plus de `QueryClient` / `QueryClientProvider` / `ReactQueryDevtools` / `isDevelopment` lié RQ.                                                                                                                                                                                                        |
| 5   | Deps mortes `package.json` + lockfile      | ✅     | Retiré `@tanstack/react-query`, `@tanstack/react-query-devtools`, `@mui/lab`, `react-window`, `react-virtualized-auto-sizer`, `@types/react-window`. `npm install` → −14 packages.                                                                                                                    |

**Fixes type-check collatéraux (bloquants, hors prompt mais nécessaires pour arbre vert) :**

- `src/pages/MyAnalysesPage.tsx` — `colorFilter` typé `Array<'W'\|'U'\|'B'\|'R'\|'G'>` + `toggleColor`
- `src/services/__tests__/assertCardResolution.test.ts` — clés dupliquées `resolved`/`resolution` dans le helper `card()`

**Validation T02 :** type-check ✓ · lint ✓ (0 err) · test:unit ✓ (368→ puis croît) · **build ✓** · `dist/workers/` **absent** · chunks deps retirées **NONE** dans `dist/assets` · `public/sw.js` **conservé** (amendement 7.1).

**Tailles `dist/assets` avant → après T02 build :**

| Chunk                |       Avant |       Après |                                                 Δ |
| -------------------- | ----------: | ----------: | ------------------------------------------------: |
| `index-*.js`         |   140 935 B |   116 897 B |                             **−24 038 B (−17 %)** |
| `vendor-mui-*.js`    |   518 614 B |   518 605 B |                                                ~0 |
| `vendor-react-*.js`  |    20 750 B |    37 707 B | +16 957 B (répartition chunks Vite post-purge RQ) |
| `vendor-redux-*.js`  |    31 314 B |    31 314 B |                                                 0 |
| `vendor-charts-*.js` |   430 916 B |   430 916 B |                                                 0 |
| **Total assets**     | 2 589 155 B | 2 599 367 B |                       +~10 KB (artefacts/hashing) |

Gain principal : chunk eager `index` allégé (React Query hors chemin critique).

---

### 7.3 T03 · T04 · T05 — **FAIT (2026-08-02)** · même commit `332501d` (+ docs session à suivre)

Notes de coordination issues de 7.1 **respectées** à l'exécution.

#### T03 (P1 Archi) — SSOT détection terrains — ✅ FAIT

**Périmètre réel :** 3 copies restantes (pas 4 — `landDetection.ts` déjà parti en 7.1).

| Fichier                                                | Action livrée                                                                                              |
| ------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------- |
| `src/services/landService.ts`                          | API sync : `getLandSync`, `isLandSync`, `getCategoryLabelSync` + index seed case-insensitive               |
| `src/components/analyzer/landUtils.ts`                 | Réécrit en wrappers fins sur `landService` (listes hardcodées + keywords **supprimés**)                    |
| `src/services/deckAnalyzer.ts`                         | Shock / fast / turn-threshold / rainbow via `category` + `etbBehavior` seed (listes inline **supprimées**) |
| `src/services/manaCalculator.ts`                       | Heuristiques `name.includes` déjà absentes post-T02.1 (vérifié grep)                                       |
| `src/data/landSeed.ts`                                 | **+49** terrains manquants legacy → **259** entrées seed                                                   |
| `src/components/analyzer/__tests__/landUtils.test.ts`  | « Rainbow Land » → « Utility Land » (label seed correct)                                                   |
| `src/services/__tests__/landDetection.ssot.test.ts`    | **Créé** — non-régression 179 noms uniques                                                                 |
| `src/services/__tests__/fixtures/legacyLandNames.json` | **Créé** — dump listes legacy                                                                              |

**Validation T03 :** type-check ✓ · test:unit ✓ · lint ✓ (0 err).

**Écarts vs prompt §3 :** label UI « Rainbow Land » abandonné au profit de **Utility Land** (catégorie seed SSOT) — tests réécrits volontairement.

#### T04 (P2 Perf) — Batch landCacheService — ✅ FAIT

| Fichier                                           | Action livrée                                                                                                                                                                                                                                                                      |
| ------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `src/services/landCacheService.ts`                | Load 1× en mémoire (`entries` Map) ; `set` → dirty ; flush batch fin `preloadFromSeed` / debounce 500 ms + `requestIdleCallback` / `beforeunload` + `visibilitychange` ; TTL + éviction conservés ; try/catch JSON.parse (cache vide) + QuotaExceeded (éviction oldest + retry 1×) |
| `src/services/__tests__/landCacheService.test.ts` | **Créé** — batch 1 setItem, deferred set, corrupt JSON, quota, persistance inter-instances                                                                                                                                                                                         |

**Validation T04 :** type-check ✓ · test:unit ✓ · lint ✓.

**Écarts :** tests installent un backend mémoire car `tests/setup.js` mocke `localStorage` avec des `vi.fn()` sans store (sinon aucun `setItem` réel).

#### T05 (P2 Sec/Perf) — fetchWithTimeout unifié — ✅ FAIT

| Fichier                               | Action livrée                                                                                                                                               |
| ------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `src/services/http.ts`                | **Créé** — `fetchWithTimeout`, `HttpTimeoutError`, `HttpError` ; timeout 8 s ; retry 429/5xx ; `Retry-After` ; signal externe ; cleanup timers tous chemins |
| `src/services/scryfall.ts`            | 5 chemins `fetch` → helper                                                                                                                                  |
| `src/services/deckAnalyzer.ts`        | batch collection + `fetchCardFromScryfallWithMeta`                                                                                                          |
| `src/services/manaProducerService.ts` | 1 fetch fuzzy                                                                                                                                               |
| `src/services/__tests__/http.test.ts` | **Créé** — timeout, 429→OK, no retry 404, abort, Retry-After                                                                                                |

**Périmètre réel §7.3 :** `hybridLandDetection.ts` absent → non touché. Zéro `fetch(` restant dans `src/services/` hors `http.ts`.

**Validation T05 :** type-check ✓ · test:unit ✓ (**384** pass / 2 skip) · lint ✓ (0 err).

**Écarts :** retry réseau générique (hors 429/5xx) du vieux `tryFetch` deckAnalyzer **non** repris — aligné prompt « retry uniquement sur 429 et 5xx ».

---

### 7.4 Historique consignes d'exécution (session 2026-08-01 → 02)

**Périmètre strict respecté :** uniquement T02–T05. **Non démarré :** T06–T15, P01–P04, quick wins §6.

**Interdictions respectées pendant l'implémentation code :** pas de touch `.env` / `.vercel` / secrets ; pas de nouvelles deps hors purge T02. Commit/push code **`332501d`** fait **sur demande explicite** utilisateur (2026-08-01 soir / session exécution).

**Commit code de référence :**

| SHA              | Message                                                                                   |
| ---------------- | ----------------------------------------------------------------------------------------- |
| **`332501d`**    | `refactor: T02–T05 purge dead code, SSOT lands, batch cache, fetchWithTimeout`            |
| parent prod live | **`fdef163`** · v2.7.9 (sécu) — **pas encore** de deploy de `332501d` sauf décision owner |

**Suite logique (hors session sauf ordre) :** T06 (tempo non bloquant) → T07 (batch lands inconnus) → … ou **P0-DIST** `LAUNCH.md` (priorité business).

### 7.5 Interdictions permanentes (rappel)

- Ne pas faire de `git commit` / `git push` sans demande explicite.
- Ne pas toucher à `.env`, `.vercel/`, ni aux secrets.
- Ne pas démarrer T06-T15 / P01-P04 sans ordre.
- Ne pas « corriger » d'erreurs lint préexistantes hors scope (les lister en rapport).

### 7.6 Warnings lint préexistants (hors scope — non corrigés)

~27 warnings stables, **0 errors**. Exemples : `react-refresh/only-export-components` (`main.tsx`, SEO, NotificationProvider…) ; unused vars (`EnhancedCharts.cards`, `SideboardSwapEditor.theme`, `AnalyzerPage.formatFamilyLabel/landCountGuidance`, `deckAnalyzer.unavailableQty`, `store` snackbar destructure, `londonMulligan.londonScore`, `turnPlan.TurnPlan`, `MyAnalysesPage.onClose`).
