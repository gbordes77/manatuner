# S001 — F01/F02 parsing — 6 septembre 2026

Version testée : HEAD `148d5f85ee26e60cdb10c6351031c89c03fd7ed0`, branche `main`, diff local non commité des fichiers listés ci-dessous. Node v25.2.0, Vitest 4.1.10. Réseau simulé dans les nouveaux tests ; aucune affirmation de requêtes Scryfall réelles.

## Contrat produit

Le point canonique `parseDecklist` dans `src/services/deckParser.ts` exige des quantités entières sûres 1..250, au maximum 250 cartes **sur l'ensemble des sections importées**, des noms normalisés de 1..200 caractères et un texte de 20 000 caractères maximum. Ces limites bornent ressources/réseau/copies physiques, sans contrôle de légalité de tournoi. Des decks expérimentaux de 1 carte et de 250 cartes sont acceptés ; 40/60/99/100 et de grandes quantités de basics restent admis. Une entrée invalide est rejetée intégralement avant préchargement réseau, avec le numéro de ligne fautive. Aucun nom sans quantité n'est inventé. Le helper historique `parseDecklistText` délègue maintenant au même contrat ; son ancienne suppression silencieuse et sa borne arbitraire 99 sont intentionnellement supprimées.

Le parseur conserve chaque entrée avec section et numéro de ligne. `Deck`, `Main`, `Mainboard`, `Main Board`, `Sideboard`/`SB`, `Commander(s)`, `Maybeboard` et `Companion` changent explicitement l'état (également avec préfixes `//` et `#`). Un `SB:` inline ne concerne que sa ligne. Les marqueurs Arena `*CMDR*`, `*CMP*`, `*COMPANION*` sont reconnus avant nettoyage. Les sections Maybeboard et Companion sont conservées dans la représentation pure puis exclues de la résolution et des cartes d'analyse ; un diagnostic par ligne est transmis via `AnalysisResult.inputWarnings`. Le texte original reste conservé pour restauration. Companion n'est pas incorporé au principal ou au sideboard éditable ; cela n'affirme aucun support du paiement/usage de compagnon.

Les catégories usuelles (Lands, Creatures, Instants, Sorceries, Spells, Artifacts, Enchantments, Planeswalkers, Battles, avec compte optionnel) ne changent pas la population. Une présence d'en-tête explicite, de catégorie ou de préfixe SB désactive la déduction globale par lignes blanches. Pour les anciens exports sans marqueurs, l'heuristique historique 40..100 avant séparateur / 1..15 après reste présente, sauf totaux canoniques 40/60/80/99/100. Tout usage de cette heuristique produit maintenant un avertissement demandant de préciser les sections. Le helper historique `detectSideboardStartLine` garde son export compatible ; son index n'est jamais utilisé comme portée globale quand un marqueur explicite existe.

## Preuves

- `red.log` : `npx vitest run src/services/__tests__/inputContract.f01-f02.test.ts` avant correctif, **14 échecs / 6 succès**. Entrées vides/sans quantité, quantités excessives, mixte invalide, contamination Maybeboard et SB reproduites sur `analyzeDeck` / parseur produit.
- `green.log` : même fichier initial + `sideboardDetection.test.ts`, **37 tests passants**.
- `services-tests.log` : première non-régression, **202 succès / 1 échec** de l'ancien test qui autorisait expressément une population vide. Assertion remplacée par rejet attendu (F01), sans suppression du test.
- `services-tests-green.log` : `npx vitest run src/services/__tests__`, **207 tests passants dans 19 fichiers**. Comprend nouveaux tests explicites de totaux par zone, diagnostics numérotés, limite globale incluant Maybeboard, CRLF/Arena/Moxfield, transitions de sections vides, déduction avec avertissement.
- `math-green.log` : `npx vitest run tests/math-audit --exclude tests/math-audit/pathways.test.ts --exclude tests/math-audit/known-limitations.test.ts --exclude tests/math-audit/canonical.test.ts --exclude tests/math-audit/independent.test.ts`, **176 tests passants dans 24 fichiers**. Les quatre tests exclus écrivent leurs preuves historiques ; exclusion demandée par le lead. Les fixtures `analyzeDeck('fixture')` devenues invalides sont remplacées par du texte cohérent avec leurs cartes mockées ; les assertions mathématiques restent inchangées.
- `lint.log` : lint ciblé des six fichiers parsing/test modifiés, zéro avertissement.
- `types.log` : typecheck intégré ; consulter son résultat actuel, une erreur temporaire issue de l'édition UI parallèle a été signalée au responsable UI.

## Correspondance AC et reste à valider

F01-AC1 : rejet `analyzeDeck` vide/sans carte prouvé en unitaire ; absence de sauvegarde et interface à vérifier par E2E lead. AC2 : aucune résolution batch pour quantités invalides/total excessif prouvée ; vérification préalable également avant détection des terrains. AC3 : point produit commun en place, canaux saisie/partage/restauration à vérifier par E2E lead. AC4 : 1/40/60/99/100/250 cartes testées. AC5 : erreurs de lignes mal formées et diagnostics d'exclusion/heuristique numérotés testés ; visibilité UI à vérifier.

F02-AC1..AC5 : couverts sur parseur produit et représentation pure ; tests historiques sideboard/découpage conservés. Revue intégration, navigateur, post-board et validation finale pris en charge par lead ; cette note ne clôture pas elle-même les fiches.

Fichiers : `src/services/deckParser.ts`, `deckAnalyzer.ts`, `scryfall.ts` ; tests `inputContract.f01-f02.test.ts`, `parseDecklist.t10.test.ts`, `assertCardResolution.test.ts` ; adaptation des textes mockés `tests/math-audit/populations.test.ts`, `regressions.test.ts`, `spell-summary.test.ts`.

## Retour de revue et validation finale parsing

La revue par le responsable annulation a identifié une régression des en-têtes commentés avec compte (`// Sideboard (15)`, `# Sideboard (15)`, `// Deck (99)`). Correction ciblée : les en-têtes de section acceptent un compte indicatif optionnel entre parenthèses ; le nombre réel reste celui des lignes de cartes (le compte annoncé n'est pas une quantité importée). `counted-headers-red.log` conserve les trois échecs avant cette correction ; `services-final-green.log` conserve **210 tests passants / 19 fichiers** après correction. `lint-final.log` est vide (code 0). Le dernier `types-final.log` a intercepté une erreur temporaire de test debounce en édition parallèle, signalée au responsable UI ; le typecheck intégré du coordinateur sera la preuve finale. Les commentaires périmés concernant une déduction automatique de commandant ont été corrigés dans les fichiers touchés.
