# Parcours personas — QA complémentaire

**Résultat final : 11/11 scénarios Chromium acquis sur dist-06, voir candidate-06.log et la dernière section.**

Historique : 11 scénarios nouveaux acquis sur le serveur de développement local du coordinateur, Chromium. Résultats : dev-run3.log (9/10), dev-compare-final.log (cas restant passant), dev-edh2.log (11e cas passant). Réexécution complète sur artefact final encore attendue.

- Home vers exemple exact : 24 Plains + 36 Savannah Lions, mode exact initial, oracle indépendant `1 - produit((36-i)/(60-i), i=0..6)` et 98% affiché.
- Export JSON/CSV : nom avec virgule/guillemets correctement conservé, version, totaux60/24, définitions Health/Blueprint/Mulligan/limitation, hypothèses et lignes de cartes inspectées.
- Copie réelle du presse-papiers (pas de mock clipboard), URL #d= sans query, ouverture dans un nouveau contexte sans historique, reload et analyse identique.
- Largeurs réelles360/390/768/1440 : tab Manabase activé au clavier, absence de débordement document, captures en thème light et dark réels. Stockage thème configuré avant reload puisque la préférence OS est volontairement ignorée par défaut. Huit captures sous dev-run3.
- Midrange métadonnées publiques fixture existante : motifs hors modèle sauvegardés, persistance inchangée après reload.
- Deux analyses réellement calculées séparément24/20Plains : probabilité descendante, comparaison exploitable et aucune cellule Unavailable.
- Mulligan : texte premier redraw gratuit/turn-one draw visible, commutateur multijoueur activable/désactivable. Pas de nouvelle simulation dans cette suite ; suites existantes dédiées.
- EDH :90 noms publics Scryfall résolus sur90 (provenance conservée), fixture réutilisable ; Atraxa99+1, quatre couleurs, horizonT4–T8 ; exports CSV et JSON conservent zones commander et sideboard ajouté pour validation. Aucune donnée utilisateur employée.

## Échecs conservés et corrections des tests

Aucun bug produit découvert dans ce lot. dev-run1 attendait3 définitions et omettait la4e limitation ; corrigé pour exiger les quatre clés. dev-run2 attendait un résultat après reload du lien ?sample=exact (qui recharge intentionnellement un nouvel exemple) ; le test relance l'analyse. Compare attendait un nom sans suffixe alors que la cellule comporte « (1 CMC) » ; sélecteur corrigé. dev-edh.log contient un échec de chargement import.meta sous la transformation CommonJS Playwright ; lecture fixture corrigée. Aucun délai augmenté, assertion produit retirée ou soft-fail ajouté.

## Rejeu artefact

`playwright.persona.config.js` sert strictement le candidat `PRERENDER_DIST` sur3001, sans réutiliser un serveur. Définir `PERSONA_TEST_OUTPUT` absolu neuf avant `npx playwright test --config=playwright.persona.config.js`. Le dev.config.js sous ce dossier est réservé aux essais déjà réalisés sur3000.

Réserves : captures à faire relire (coordinateur), ni lecteur écran ni appareil physique ni étude joueurs. Ces scénarios ne constituent pas une certification WCAG. Aucun déploiement ou modification distante.

## Complément contraste issu de la revue visuelle

La revue visuelle du coordinateur a trouvé des textes sombres peu lisibles en thème sombre, que les premiers tests de débordement ne contrôlaient pas. Les quatre scénarios responsive comprennent désormais axe color-contrast sur QuickVerdict, titre Analysis Results et éditeur déplié, pour les deux thèmes. L'ancien candidat dist-final échoue comme attendu (`contrast-before.log`). Le correctif initial du coordinateur restaure QuickVerdict et le titre ; `contrast-dev.log` révèle encore le bouton Clear rouge #d3202a sur fond #1a1a1e, ratio3.31 au lieu de4.5. Défaut transmis, validation finale attendue. Les premiers11 tests verts ne constituaient donc pas une validation de contraste.

Les fixtures EDH pérennes sont copiées dans tests/fixtures/scryfall-persona-edh.json et persona-edh-deck.txt ; la suite ne dépend plus du chemin de campagne.

Le correctif Clear est désormais validé : `contrast-dev2.log` **5/5 passent** (23,3s), quatre dimensions × deux thèmes avec axe QuickVerdict/titre/éditeur, plus midrange enrichi. Ce dernier exige déficit prioritaire chiffré Karsten, ouverture des explications Blueprint/Mulligan et activation Manabase par « Review mana sources ». Les captures light/dark actualisées sont dans `contrast-dev2/`. Les preuves rouges sont conservées.

## Validation intermédiaire acquise — candidat dist-05

Après succès complet du gate05, **11/11 scénarios Chromium passent** sur `dist-05` servi strictement sur3001, avec les mêmes fixtures et les assertions axe ciblées. Preuve : `candidate-05.log`, sorties/captures/exports/rapports axe sous `candidate-05/`. La suite couvre les parcours et limites explicités ci-dessus ; aucune attribution du résultat à la production. Les preuves antérieures `candidate-final` correspondent au candidat obsolète avant correction sombre et ne sont pas le résultat final. Le coordinateur a ensuite corrigé trois formulations Home/Guide ; dist-06 devra être rejoué pour la validation finale.

## Validation finale — dist-06

**11/11 Chromium passent en32,4s**, après gate06 acquis, sur l'artefact final `dist-06` servi strictement à http://127.0.0.1:3001. Preuve définitive du lot : `candidate-06.log` et `candidate-06/` (captures8 light/dark, exports JSON/CSV, lien réel partagé, rapports de contraste ciblés). Aucun serveur de ce lot conservé. Aucun fichier source modifié après gel du candidat.

Restent hors portée : publication/contrôle production, appareils physiques, lecteur écran et audit WCAG global, étude avec participants réels, validation juridique. Ces limites ne sont pas transformées en tests passants.

## Complément T05 final — vrai worker3k, gratuit puis duel

Un12e scénario passe sur le même dist-06 : `candidate-06-multiplayer2.log`, **1/1 en2,7s**. Vraie simulation3k, mode multijoueur : aide avant premier redraw gratuit, seuil keep-seven after-free numérique, descriptions keep-six/keep-five après free puis1/2 paid. Désactivation et recalcul duel : keep-six après bottoming, description après premier paid, disparition seuil after-free. Captures deux modes conservées. Première tentative rouge conserve l'attente exacte qui omettait les parenthèses affichées autour des descriptions ; corrigée sans changement applicatif ni augmentation de délai. Total complément personas final : **12 scénarios acquis (11+1)**.
