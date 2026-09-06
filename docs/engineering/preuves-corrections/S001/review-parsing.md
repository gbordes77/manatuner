# Revue indépendante F01/F02 — 2026-09-06

Relecteur : agent cancellation, sans participation aux modifications du parseur. Inspection du diff `deckParser.ts`, `deckAnalyzer.ts`, `scryfall.ts`, des tests `inputContract.f01-f02.test.ts`, `parseDecklist.t10.test.ts` et du parcours navigateur `input-contract-audit.spec.js`. Aucun code produit modifié par cette revue.

## Finding R-PARSE-1 — P1, régression de population sur sections commentées avec compte

Localisation : `src/services/deckParser.ts:182` (`sectionHeader`) et ligne 230 (commentaire ignoré).

Le nouveau recognizer exige un nom de section exact. L'ancien parseur produit reconnaissait `// Sideboard…`, `# Sideboard…`, `// Deck…` par préfixe. Des comptes usuels dans ces marqueurs ne sont plus reconnus et passent pour commentaires ordinaires, sans avertissement.

Reproduction exécutée sur le code TypeScript courant, transpilation en mémoire via TypeScript puis appel direct `parseDecklist` :

- `60 Forest\n// Sideboard (15)\n15 Island` → entrées Forest 60 main, Island 15 main, warnings vides.
- `60 Forest\n# Sideboard (15)\n15 Island` → même erreur.
- `Commander\n1 Plains\n// Deck (99)\n99 Forest` → « No main-deck cards found », les Forest restant dans Commander.

Le premier cas contamine directement totaux et résolution principale et constitue une régression d'un export auparavant accepté, dans le périmètre F02. La détection historique retourne bien l'index du marqueur mais le nouveau parseur ne traite `split` que pour une ligne vide, ce qui ne répare pas ce cas.

Correction bornée suggérée : reconnaître un suffixe de compte optionnel sur les sections explicites, comme pour les catégories, avec les préfixes déjà supportés. Ajouter les exemples au niveau parseur produit, contrôler les transitions vers Deck et les populations sauvées. Ne pas rendre tous les commentaires sémantiques.

## Contrats et couverture examinés

- F01 : quantité sûre 1..250, total de toutes zones <=250, limite texte avant split, nom normalisé borné ; validation produit `analyzeDeck` précède batch, détection terrain et allocation. Le helper historique délègue au canonique. Pas de bypass trouvé parmi ses consommateurs.
- F01-AC1/2/5 : cas invalides produits, absence de batch et numéros de ligne pertinents ; exclusion et ambiguïté représentées par warnings. Absence de sauvegarde couverte par E2E des trois voies.
- F01-AC3/4 : E2E saisi/partagé/restauré partage le handler ; listes 40/60/99/100 et restauration réelle sont couvertes. Les unitaires de quantités acceptées passent par le parseur privé ; les E2E compensent ce niveau limité en utilisant l'analyse réelle.
- F02 : Maybeboard/Companion exclus avant réseau ; SB local et transitions exactes cohérents ; main, command zone et sideboard conservés séparément dans les flags. Les tests de sections vides, catégories, CRLF, marqueurs Arena et heuristique 60+15 sont pertinents. R-PARSE-1 reste à résoudre avant validation complète.
- Le retour de toutes les cartes importées dans AnalysisResult est intentionnel pour sideboard/command zone ; les filtres du résumé principal et le parcours post-board ont été lus. La correction des consommateurs secondaires (F03/F04) reste hors revue.

## Vérification exécutée et limites

`npx vitest run src/services/__tests__/inputContract.f01-f02.test.ts src/services/__tests__/parseDecklist.t10.test.ts` : succès, sortie `review-parsing-tests.log`. Les tests passants actuels n'incluent pas R-PARSE-1.

Le parcours E2E du coordinateur a été relu, non rejoué par cette revue ; build et typecheck restent ceux de la validation intégrée. Ce document ne certifie pas tous les formats tiers ni les règles de légalité de tournoi. Aucune autre anomalie bloquante identifiée dans le périmètre lu.

## Addendum — R-PARSE-1 clôturé après correction

Le relecteur a inspecté le correctif ajoutant le retrait d'un suffixe `(nombre)` dans `sectionHeader`, avant comparaison des sections. La reconnaissance demeure bornée aux noms de section connus ; les commentaires ordinaires restent ordinaires. Les nouveaux tests passent par `DeckAnalyzer.parseDeckList` pour les variantes `// Sideboard (15)`, `# Sideboard (15)` et `Sideboard (15)`, puis retour `// Deck (99)`.

Les trois reproductions exactes du finding ont été rejouées indépendamment : les deux listes Sideboard produisent maintenant 60 main + 15 sideboard, et la transition Commander/Deck produit 1 commander + 99 main. Sortie structurée : `review-parsing-repros-after.json`. Les tests inputContract + T10 ont été rejoués : **34/34**, `review-parsing-tests-after.log`.

R-PARSE-1 est donc résolu dans la portée reproduite. Aucun autre finding bloquant sur le diff F01/F02 relu ; les limites générales de revue ci-dessus restent applicables.
