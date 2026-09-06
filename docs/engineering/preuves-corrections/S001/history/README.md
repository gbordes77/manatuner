# F06 — Historique, imports et récupération

Date : 2026-09-06. Fichiers : `src/lib/privacy.ts`, `src/pages/MyAnalysesPage.tsx`, `src/components/PrivacySettings.tsx`, nouveaux tests `privacy.history.test.ts` et `history-audit.spec.js`.

## Contrat livré

Les nouvelles sauvegardes portent `schemaVersion: 1`. Les anciennes enveloppes sans version restent reconnues. Les champs consommés par les cartes d'historique et la comparaison sont validés : scores et statistiques numériques finies, distribution, tableaux de cartes/leurs champs affichés, probabilités par tour et synthèses de sorts. Les champs supplémentaires restent préservés pour le backup. La restauration passe toujours par le texte du deck et une nouvelle analyse, sans injecter le résultat historique dans l'analyseur.

La lecture est non destructive, traite les entrées séparément et retourne des diagnostics visibles. Une entrée `null` est masquée sans rendre les autres inaccessibles. Une enveloppe reconnue dont le résultat est absent, vide, mal typé ou dont le score supérieur est invalide devient une carte « Saved result unavailable » : nom et texte restent restaurables, aucun faux zéro de résultat n'est affiché, la comparaison de cette entrée est désactivée. Les données originales demeurent dans le stockage et l'export JSON. L'ancien score supérieur `consistency: 87`, précédemment accepté par le schéma non borné, est traité de cette manière ; un nouvel import avec ce score est refusé.

L'import est maintenant une **fusion par identifiant**, annoncée par le bouton `Import (merge)` et le message de résultat. Les identifiants déjà présents gardent leur version existante ; les doublons du fichier sont aussi comptés. Un fichier mal formé ou comportant une seule entrée invalide est rejeté entièrement avant toute écriture. Les résultats absents/null/vides des anciennes enveloppes sont admis comme decks bruts. Limites : fichier 10 000 000 caractères et 10 MB au sélecteur, 50 entrées au plus, fusion <=50 entrées. Les anciens textes jusqu'à 1 000 000 caractères peuvent être récupérés ; la réanalyse applique indépendamment la limite actuelle F01.

Le quota ne déclenche plus de suppression automatique. La sauvegarde au plafond de 50 et l'import dépassant le plafond échouent avec un message demandant d'exporter un backup et de supprimer des entrées choisies. Les données existantes restent identiques. Une source locale illisible bloque les écritures ; elle n'est jamais remplacée par un tableau vide. Les sources legacy sont fusionnées dans la vue ; après écriture explicite réussie, le contenu complet est conservé dans la clé canonique avant retrait de l'ancienne clé. Si le retrait legacy échoue après une suppression choisie, le message signale que la clé canonique a déjà changé et qu'une copie legacy peut rester.

La comparaison et les cartes d'historique honorent aussi les métadonnées F03 `consistencyUnavailable` / `colorAccessNotes` : score affiché indisponible, aucune différence numérique de score pour cette comparaison.

## Preuves

- `red.log` : 10/10 tests initiaux échouaient avant correction (imports mal typés acceptés, `[null]` non isolé, fusion remplaçant, quota supprimant, limite absente, lecture interdite lançant).
- `green.log` : `npx vitest run src/lib/__tests__/privacy.history.test.ts src/lib/__tests__/privacy.clearAll.test.ts tests/math-audit/legacy-contract.test.ts`, **27/27**. Vérifie aussi les octets initiaux après refus/quota, conservation des sources invalides et legacy, résultat opérationnel fusion, plafond de sauvegarde, récupération de score supérieur ancien et roundtrip des métadonnées inconnues.
- `browser-dev.log` : **5/5 Chromium** sur serveur Vite isolé `127.0.0.1:3001`, commande `npx playwright test --config=docs/engineering/preuves-corrections/S001/history/playwright.config.mjs`. Contexte navigateur neuf par test, données publiques Mountain/Bolt, aucun stockage personnel. Scénarios : affichage mixte et restauration ; import invalide ; quota simulé par Storage.setItem limité à la clé historique ; fusion ; comparaison avec score F03 indisponible.
- `lint.log` : ESLint des trois fichiers produit, code 0.
- `typecheck.log` : `npx tsc --noEmit`, code 0.

## Correspondance AC et limites

AC1 : tests types invalides et mixed history navigateur. AC2 : comparaison exacte du texte JSON avant/après refus en unitaire et navigateur. AC3 : anciennes enveloppes sans résultats et score ancien récupérables, restauration UI du texte. AC4 : `null` et résultat corrompu entourant carte valide, toutes les cartes récupérables restent visibles. AC5 : tests/messages quota, refus et compte de fusion ; aucune troncature silencieuse.

La première tentative navigateur utilisait par erreur le preview3000 du lot précédent ; ces sorties ne sont pas des preuves du candidat F06. La preuve retenue est le serveur dev3001 précisé ci-dessus. La campagne de build/preview commune et la revue indépendante restent à effectuer par le coordinateur. Les migrations de versions explicites autres que v1 ne sont pas inventées ; elles restent conservées en source et signalées comme enveloppes non reconnues.

## Revue et rectifications de preuve

La première annonce intermédiaire de « 27/27 » a été prématurée : le test nouvellement ajouté pour `consistency:87` était rouge, car une substitution textuelle du schéma avait raté après formatage. La campagne intégrée `second-unit.log` a révélé cet échec ; il ne s'agissait pas d'une contamination du stockage. La ligne de schéma a ensuite été corrigée et le test est resté inchangé. La sortie finale `green.log` est la preuve retenue, et cette erreur de compte rendu reste explicitement documentée ici.

La revue indépendante a ensuite reproduit deux écarts supplémentaires (`review-red.log`, 2 échecs/22 tests) : objet résultat avec seulement des champs inconnus et DOMException quota mal classée dans jsdom. Le quota est désormais reconnu par Error ou DOMException ; la récupération brute est sélectionnée quand les statistiques minimales de comparaison (totalCards, totalLands, averageCMC, landRatio, consistency) manquent, même si des métadonnées inconnues existent. Ces métadonnées restent conservées. Les compteurs d'import signalent ces decks bruts. Le schéma accepte/valide aussi `colorAccessByTurn` de F03. Dernière suite ciblée : **29/29**, sous réserve de lire le log final associé ; E2E fixtures complétées avec leur ratio explicite.

Validation ciblée finale après revue : **32/32** tests dans 3 fichiers (`green.log`, 12:08:34), lint et typecheck code 0 ; **5/5** E2E dev3001 (`browser-dev.log`). Les trois derniers cas testent `{cards:[]}`, `{averageCMC:2}` comme récupérations brutes et des statistiques anciennes complètes sans nouveau modèle comme comparables. Les métadonnées de modèle actuel ne sont donc pas exigées pour conserver les anciennes statistiques complètes.
