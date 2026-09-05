# Extension B2 — dix pathways terrain/terrain

Extension de domaine, pas correction d’un bug de probabilité antérieur : ces cartes étaient explicitement refusées.

## Domaine fermé

Les dix paires de `card-sources.json`, récupérées le 5 septembre 2026 auprès de l’API Scryfall, ont deux faces terrain, chacune avec une unique capacité d’engagement produisant un mana, sans entrée engagée. Le nom des deux faces et les métadonnées doivent correspondre au contrat audité. Une carte dont la catégorie dit seulement « pathway » n’est pas suffisante. Les MDFC sort/terrain, les faces engagées, les noms inconnus et les capacités supplémentaires restent refusés.

Une carte physique possède deux choix de pose. La population contient la carte une seule fois. Une pose la retire de la main et crée exactement un permanent de la couleur choisie. Les emplacements des faces ont une population de bibliothèque nulle. La face ne change pas au dégagement. Les autres terrains conditionnels comptent ce permanent comme un terrain non basique sans type de base.

Le moteur utilise l’énumération des séquences ; le raccourci des terrains inconditionnels ne s’applique pas aux pathways. Les budgets existants restent identiques. Aucun pourcentage partiel n’est renvoyé après épuisement du budget.

L’événement reste celui de physical-v1 : potentiel de paiement avec connaissance possible des pioches futures, cible extérieure, sans mulligan. Ce n’est pas une probabilité de tirer puis lancer, ni une politique non clairvoyante. Les analyses déjà exactes restent comparables sous le même événement ; les anciens refus restent absents des nombres enregistrés. Aucun changement implicite d’événement ni migration de valeur sauvegardée.

## Oracle indépendant

`tests/math-audit/pathways.test.ts` énumère les identités de dix cartes, les sous-ensembles de sept et les pioches ordonnées. Son solveur pose un objet de couleur fixe et consomme directement un permanent vert pour installer un elfe ; il ne réutilise aucune fonction de paiement, de population, de regroupement ou de transition de production.

Six cas croisés : tours 1–3, play/draw, deux pathways R/G, un terrain vert engagé, un elfe et six cartes sans effet. L’oracle calcule séparément paiement RG et paiement de deux génériques pour contrôler p2 et p1. Les valeurs attendues et produites sont dans `oracle-results.json`.

Cas fermés supplémentaires : un pathway ne paie pas deux pips ; présence au T1 = 7/10 ; pathway + elfe disponibles dans la main initiale = 7×6/(10×9) ; impossibilité de passer de vert au T1 à rouge au T2. Les vingt noms de face sont vérifiés contre les textes Oracle conservés. Les refus de métadonnées, fetchs et budget sont testés. Le test UI vérifie le paiement par la face arrière.

Le test historique qui attendait un refus de Needleverge est actualisé : il prouve désormais exactement zéro pour U (ses faces sont R/W), et conserve un refus pour une face inconnue. Les assertions de paiement ne sont pas assouplies.

## Report de B1

Fetchlands restent prioritaires pour le prochain travail de domaine. Leur recherche modifie la bibliothèque et introduit un mélange après un choix : leur modèle et leur oracle demandent un chantier distinct. Aucun fetch n’est admis comme source directe par cette extension. Pas d’hypothèse de vie ajoutée.
