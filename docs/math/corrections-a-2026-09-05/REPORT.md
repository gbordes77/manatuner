# Lot A1 → A2 → A3

Base vérifiée : ac790fda71426dae2b135802f637d0dcb105af43, main = origin/main ; aucune consigne AGENTS.md trouvée dans le projet ou ses parents. Fichiers utilisateur annexes préservés.

## Défauts reproduits et corrigés

- A1 : risque 0,8 → null à cohérence 0,9 et ratio 0,4 : score 80/Good → 100/Excellent avant correction. Deux régressions rouges, une verte. Désormais score indisponible, badge Incomplete data, avertissement sur les conseils restants. Zéro risque conserve un score complet. JSON conserve null ; le score est dérivé, non sauvegardé.
- A2 : trois régressions rouges reproduisaient la perte de méthode dans la comparaison tempo et les sorties p1/p2 historiques. `method` et hypothèses sont maintenant requis sur ces dernières ; les résumés tempo conservent méthode et motif du refus physique, y compris après JSON.
- A3 : contrat vivant MODEL.md harmonisé : sept catégories de terrains sous préconditions, événement du potentiel, distinction des deux p1, score incomplet et estimations historiques.

## Carte des consommateurs

`calculateTempoAwareProbability` → `compareTempoImpact` → `DeckAnalyzer.tempoImpactByColor` → stockage intégral / export JSON. `EnhancedSpellAnalysis` reçoit ce champ mais ne l’affiche pas. Les anciens champs sans méthode ne permettent pas d’inférer l’exactitude.

`computeAcceleratedCastabilityAtTurn` → résultat complet / courbes / recherche du premier tour → méthodes publiques `manaProducerService`, sans consommateur UI direct supplémentaire trouvé. Chaque p1/p2 indique sa méthode. L’impact et le classement du résultat complet restent explicitement heuristiques, même si une sous-valeur est physique. Le scalaire historique `producerOnlineProbByTurn` alimente ces estimations et leurs tests ; il n’est pas une API exacte d’activation.

`ManaCostRow` appelle encore le calcul historique, mais son union physique est toujours définie et prioritaire, y compris en cas de refus : les branches de repli sont inaccessibles dans l’état actuel. Le libellé du repli historique est néanmoins explicite. Les tests physical-ui garantissent absence de pourcentage pour données absentes ou coût exclu.

Les analyses enregistrées conservent leur modèle ; la comparaison existante refuse les anciens modèles. Aucun événement physique changé, aucune migration implicite.

## Validation locale du code de ce lot

6 nouvelles régressions réussies ; suite complète : 599 réussies, 2 ignorées, 56 fichiers. Types PASS ; lint 0 erreur / 27 avertissements ; build PASS, budget PASS, audit production sans vulnérabilité. Les fichiers de feed générés par le build ont été restaurés seuls (propres avant commande).

La validation Linux et la publication sont consignées dans validation.json après exécution effective. Les 438 scénarios historiques ne sont pas des résultats de ce lot.

## Limites

Aucun ajout au domaine exact dans ce lot. Fetchs, MDFC, coûts spéciaux et producteurs non audités restent refusés. Les estimations historiques restent disponibles et explicitement nommées, pas certifiées par cette correction. Scores et conseils non calibrés en probabilités.
