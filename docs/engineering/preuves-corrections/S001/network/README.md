# S001 — F08 réseau, annulation et budgets

6 septembre 2026, HEAD `148d5f85ee26e60cdb10c6351031c89c03fd7ed0` + diff local S001. Le manifeste intégré de session identifie les modifications non commitées ; aucune requête Scryfall réelle n’est utilisée par cette campagne.

## Contrat

- Une requête logique JSON dispose de **8 000 ms au total**, depuis le premier fetch jusqu’à la fin JSON, en incluant attente Retry-After et tentative suivante. Un seul retry par défaut, uniquement HTTP 429 et 500–599. Pas de retry transport, 400/404 ou JSON invalide.
- Retry-After numérique et HTTP-date sont respectés. Si le délai dépasse le budget restant, l’opération expire ; aucun retry anticipé pour contourner le serveur.
- La résolution du deck réel `DeckAnalyzer.analyzeDeck` dispose de **30 000 ms au total**, couvrant préchargement collections, terrains, noms exact/fuzzy, attentes et corps JSON. Ce budget ne prétend pas borner les calculs CPU suivants, traités ailleurs.
- `AbortError` désigne l’annulation ; `HttpTimeoutError` l’expiration. Le point d’entrée analyse conserve `AnalysisCancelledError` pour l’annulation utilisateur. CardResolveResult conserve `notFound=true` seulement après deux 404 définitifs ; les erreurs transitoires restent `notFound=false`.
- Les caches ne reçoivent pas de réponse annulée ; une panne transitoire terrain ne devient plus une entrée négative permanente. Une nouvelle résolution peut réussir.

## Implémentation

`http.ts` possède une échéance et une chaîne de signaux par opération, une attente annulable et une course de promesse qui rejette même si le fetch/JSON simulé ignore l’annulation. `fetchWithTimeout` reste une API compatible renvoyant Response aux en-têtes ; tous ses consommateurs JSON applicatifs ont été migrés vers `fetchJsonWithTimeout` qui inclut le corps dans le budget. Cette distinction est explicitée dans les commentaires publics.

Le signal externe atteint les contrôleurs dérivés utilisés par fetch, retries et JSON via cardResolver, scryfall, landService et le parseur produit. Les catches de fallback relancent annulation/expiration. Les corps HTTP non consommés sont annulés avant retry ou résultat d’erreur.

`useCardImage` utilise le même helper JSON ; le changement de nom et le démontage annulent l’ancienne demande, dont un résultat tardif ne peut plus remplacer l’image courante. `manaProducerService` a reçu uniquement la migration de son dernier appel JSON vers le helper borné.

## Preuves

- `red.log` : les deux reproductions historiques échouent avant correction. Le 429 annulé à 5 ms résout pourtant 200 ; l’analyse annulée à sa première collection lance 4 fetch au lieu d’un. Le premier échec provoque aussi un avertissement Vitest d’assertion rejetée consommée tardivement ; les campagnes vertes n’ont aucune erreur non gérée.
- `targeted.log` : **69 tests passants dans 7 fichiers**. HTTP T05 et échéances ; annulation réseau réelle des résolveurs ; T07 collections terrains ; T08 compatibilité parseur/résolveur ; contrat F01/F02 ; hook images.
- `types.log` : `npx tsc --noEmit` passant.
- `lint.log` : lint ciblé passant.

Correspondance :

| Critère | Cas exécutés |
|---|---|
| F08-AC1 | Retry-After annulé à 5 ms : AbortError, un seul fetch ; attente nettoyée |
| F08-AC2 | analyzeDeck annulé à collection ; body collection terrain annulé sans fallback/cache ; exact→fuzzy annulé, signal fetch interrompu |
| F08-AC3 | JSON jamais résolu ignorant abort : rejet à échéance ; hook image sort de loading ; budget global parse |
| F08-AC4 | 429/500/503, Retry-After numérique/date, seuil avant/après, budget non renouvelé entre retry/body, long Retry-After sans second fetch |
| F08-AC5 | AbortError vs HttpTimeoutError ; deux 404 définitifs vs 503 ; JSON invalide/transport sans retry ; reprise terrain après panne et cache chaud |

Le test de budget global utilise 76 noms synthétiques et des réponses séparées de 6 s (chacune admissible sous 8 s). L’analyse rejette à 30 s avec HttpTimeoutError, le dernier signal est annulé, aucun fetch supplémentaire après progression de l’horloge. Aucun calcul massif de production.

## Commandes

```sh
npx vitest run src/services/__tests__/networkCancellation.test.ts src/services/__tests__/http.deadline.test.ts src/services/__tests__/http.test.ts src/services/__tests__/landBatch.t07.test.ts src/services/__tests__/deckSplit.t08.test.ts src/services/__tests__/inputContract.f01-f02.test.ts src/hooks/__tests__/useCardImage.network.test.ts
npx tsc --noEmit
npx eslint src/services/http.ts src/services/cardResolver.ts src/services/scryfall.ts src/services/landService.ts src/services/deckAnalyzer.ts src/services/manaProducerService.ts src/hooks/useCardImage.ts src/hooks/__tests__/useCardImage.network.test.ts src/services/__tests__/http.deadline.test.ts src/services/__tests__/networkCancellation.test.ts --max-warnings=0
```

Avant correction : `npx vitest run src/services/__tests__/networkCancellation.test.ts` (2 cas red). Les cas supplémentaires ont ensuite étendu la couverture négative et nominale.

## Limites et intégration

La validation navigateur sur artefact intégré, la revue indépendante et les NR transversales sont coordonnées par le lead. Ces tests réseau simulés ne sont pas des captures Scryfall réelles. Les échéances JS restent sujettes à la suspension de l’onglet et à un blocage synchrone du fil principal ; aucune prétention de délai temps réel lorsque le navigateur est suspendu. Pas de publication.

## Retour de revue indépendante réseau

Le relecteur parsing a signalé un Retry-After énorme (> entier signé 32 bits) susceptible de faire déborder setTimeout et déclencher le retry prématurément. L’attente est maintenant plafonnée à la limite du timer (l’échéance de 8s gagne avant), avec un test Retry-After de 31 536 000 secondes : expiration à 1000 ms dans le test, un seul fetch. Des gardes d’annulation ont aussi été ajoutées aux frontières microtâches après exact/fuzzy et avant écriture du cache. Relance finale ciblée : 69/69 ; types passants.

Le contrôle du hook image inclut aussi cancelFetch explicite : loading repasse à false et la minuterie est nettoyée, même si fetch ignore son signal.
