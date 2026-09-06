# F10 — éditorial et seuils partagés

2026-09-06. Base HEAD `c8bdb8f5416562a2e7715fad54e2eb6f2aa342c3`, arbre S002 local non commité; aucune publication. Preuve initiale extraite avant modification : `initial-editorial.txt`. La sonde `red-static.log` compare quatre promesses publiques fautives dans HEAD au texte corrigé sans modifier le checkout. Une preuve statique est adaptée à ces contradictions sémantiques; ce n'est pas une simulation du moteur.

## Contrats corrigés

- AC1 : exemple fictif Home clairement identifié, score d'accès couleur T2 distinct d'une proportion de sorts lancés; aucune recommandation de keep déduite arbitrairement du seul score dans QuickVerdict. Les définitions S001 restent intactes.
- AC2 : Home, métadonnées Analyzer, Guide et Mathematics distinguent calcul de pioche hypergéométrique exact, estimation agrégée par défaut, et modes exacts limités à leur modèle représenté. Ramp général et simulation n'acquièrent aucune promesse d'exactitude.
- AC3 : commandant seulement par marqueur/section explicite. London : repioche sept, bottom après keep; simulateur quatre à sept, option premier mulligan gratuit en multijoueur. Vérifié sur boucle `analyzeWithArchetype` et option multiplayer réelle. Étiquettes échantillons corrigées85/70/55 selon moteur.
- AC4 : Home compte les références dans `articlesReferenceSeed` et les onglets via `ANALYZER_TABS`, partagé avec les libellés réels. Test compare aussi la longueur aux cinq commandes accessibles du JSX.
- AC5 : `healthScoreBand` partage85/70/55 et Excellent/Good/Average/Needs work entre verdict, historique et Blueprint; `HEALTH_SCORE_BANDS` guide. Suppression bandes différentes par format du même score. Les seuils80/65/50 de qualité globale des mains, qui utilisent une autre grandeur, sont explicitement distingués dans leur aide.

## Validation locale

`npx vitest run src/utils/__tests__/editorialContract.test.js --configLoader runner --no-cache --reporter=verbose` :11 tests passent (`green.log`). Assertions ciblées sur fausses promesses historiques, conditions de score aux frontières, consommateurs du helper et compteurs; pas de snapshots intégralement figés.

`npx tsc --noEmit --incremental false` :code0 (`types.log`). ESLint ciblé pages/composants/helper/test modifiés :code0 (`lint.log`). Le test éditorial utilise node:fs en JavaScript uniquement côté Vitest; aucune dépendance Node ajoutée au bundle client.

Relecture par agent privacy : cohérence bandes, London et commande explicite vérifiée; résidu Guide Draw Math trop général identifié puis corrigé. Relecture réciproque F12 sur politique, paramètres, inventaire, effacement et Sentry :aucun défaut bloquant identifié; AC5 juridique reste externe.

Home et les deux FAQ Guide contiennent aussi la précision des flux demandée par agent privacy. Aucun moteur mathématique, format de sauvegarde ou algorithme de mulligan modifié. Intégration navigateur et vérifications de la version totale à effectuer par le responsable S002 avant coche définitive J7/J8.

## Complément public/llms (relecture lead)

Les deux références publiques pour agents contenaient encore des promesses « exact per-spell », « no data ever sent », 54 ressources, une certification tournament-ready et des bandes divergentes. Les versions initiales sont conservées dans `before-llms.txt` et `before-llms-full.txt`. Documents réécrits autour des contrats actuels : estimation par défaut, exact limité au modèle, score heuristique 85/70/55, London et commandant explicite, flux externes, Sentry conditionnel et effacement limité. Les compteurs de bibliothèque renvoient au compteur dérivé du site au lieu de dupliquer une constante statique. Aucun générateur ne référence ces fichiers dans scripts/package/workflows ; ce sont des assets publics copiés par Vite.

Test ciblé ajouté sur les deux documents (modèle, score, confidentialité). Les 12 tests éditoriaux passent ; ESLint du test code 0 (`llms-lint.log`). Un rebuild est nécessaire pour les inclure dans l’artefact final. Aucun changement de moteur ni de fichier historique d’audit.
