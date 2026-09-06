# Revue indépendante F03/F04 — 2026-09-06

Relecteur : agent cancellation, non auteur du calcul F03/F04. Lecture du diff de `deckAnalyzer.ts`, `manaCostParser.ts`, `karstenDeltas.ts`, `KarstenTargetDelta`, `QuickVerdict`, `AnalysisTab`, `EnhancedRecommendations`, `EnhancedCharts`, `ManabaseTab` et `manaStability.ts`, ainsi que des tests synthesis.f03-f04 / synthesis-ui.f03.

Aucun finding bloquant identifié sur le périmètre relu.

Le parseur de paiement physique fournit les pips fixes, masques alternatifs et symboles non représentés aux synthèses. Les cibles Karsten ne décomposent plus les hybrides en obligations de chaque couleur ; les cartes omises pour alternatives/symboles unsupported sont explicitement listées, sans badge de déficit inventé. Un coût strict rouge+vert continue à exiger chaque couleur. Pour le score marginal, les sources d'un groupe hybride sont une union de copies physiques de terrains, et non une somme qui compterait deux fois les duals. La pondération reste volontairement un résumé d'événements marginaux (un accès par groupe distinct), ce que les textes expliquent ; le paiement simultané et les hybrides répétés relèvent du moteur physique, avec oracle indépendant dans les tests.

Les terrains et sorts hors principal sont retirés des cibles et du détail Manabase. L'introduction d'une carte sideboard dans une bibliothèque post-board recrée une demande uniquement dans cette population effective. Les commandants explicitement marqués sont exclus de cette synthèse principale et leur paiement est annoncé séparément.

Les symboles non représentés rendent le score indisponible ; les consommateurs inspectés transmettent le drapeau et évitent une note nulle interprétée comme échec de manabase. Le blueprint utilise `colorAccessByTurn` pour conserver les mêmes groupes alternatifs aux deux horizons. Les tests couvrent aussi cet index, les graphiques et les libellés. L'intégration historique F06 a été écrite par ce relecteur et ne constitue donc pas une revue indépendante de cette partie : elle doit être couverte par le coordinateur.

Commande de revue exécutée : `npx vitest run tests/math-audit/synthesis.f03-f04.test.ts tests/math-audit/synthesis-ui.f03.test.tsx`, sortie `review-synthesis-tests.log`.

Limites : pas de nouvelle campagne exhaustive de tous les symboles MTG ni de règles de jeu ; ce serait hors portée du correctif. La revue ne convertit pas le score heuristique en probabilité de lancement et ne valide pas les coefficients historiques de l'index export. Le navigateur réel, typecheck et build restent couverts par la campagne intégrée du coordinateur. Les autres consommateurs non modifiés et les exports d'anciennes versions n'ont pas été parcourus exhaustivement.

Résultat effectivement lu : **69/69** dans 6 fichiers (les imports de fixtures entraînent aussi des suites d'oracles), `review-synthesis-tests.log`.
