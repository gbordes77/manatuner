# Sarah — La Régulière : 3,83/5, évolution +0,33

Réaudit simulé du 10 septembre 2026, persona canonique Sarah (Standard, FNM hebdomadaire, premier RCQ). Cible réellement parcourue : **http://127.0.0.1:4186/**, candidat local corrigé `dist-06` désigné par la coordination. Comparaison avec `docs/session/persona-audit-2026-09-09/sarah.md`, qui portait sur la production. Il ne s’agit donc pas d’une mesure de l’amélioration déjà publiée, ni d’un entretien utilisateur réel.

Le rapport `docs/engineering/persona-validation-mfydqnp5/FINAL.md` a été lu pour distinguer corrections annoncées et preuves historiques. Les notes ci-dessous reposent sur le parcours actuel ; les tests précédents ne sont pas présentés comme rejoués. Onglet propre dans le navigateur Codex intégré, stockage de l’origine partagé avec les autres agents : aucune première visite isolée prétendue, aucune analyse existante supprimée.

## Réaction simulée

« Je comprends mieux pourquoi le score est excellent alors que ma mana verte demande encore du travail. Je sais où regarder avant vendredi. Par contre, pour comparer mes deux listes avec ce terrain spécial, je reste bloquée : maintenant au moins je sais pourquoi. »

## Parcours réellement réalisé

1. **Accueil.** Lecture des modèles, de l’exemple, de la confidentialité et des parcours. Le site présente désormais des probabilités pour les cartes supportées, des estimations par défaut et des limites explicites du mode exact. Les appels Scryfall et les polices externes apparaissent dans le résumé de confidentialité. Le lien vers un exemple exact à terrains de base est visible ; je ne l’ai pas exécuté dans cette session.
2. **Try an example deck → Analyze Manabase.** Nature’s Rhythm produit 60 cartes, 23 terrains, Health Score 91/100. Le diagnostic écrit « 2 colors short » et donne immédiatement la priorité verte : **16 sources sur 23, déficit de 7**. Le bouton **Review mana sources** ouvre réellement Manabase, où figurent vert 16/23 et blanc 13/16. Ce passage d’un verdict à une action est la correction la plus concrète pour Sarah.
3. **Blueprint.** Le nom Nature’s Rhythm (Midrange Combo) est conservé. L’indice 92 est accompagné de sa définition, des poids, de la différence avec Health et Mulligan et du rappel qu’il ne mesure pas la castabilité. Le contexte du calcul enregistré et la limite du partage sont visibles : deck, nom et onglet transportés, paramètres à sélectionner à nouveau. Une capture du viewport a confirmé la lisibilité du diagnostic et de la navigation en thème clair ; le Blueprint a été lu dans l’arbre d’accessibilité, sans inspection d’un fichier exporté.
4. **My Analyses → Compare.** Deux entrées Nature’s Rhythm du jour étaient présentes dans l’historique partagé. Je les ai sélectionnées sans les modifier. La comparaison affiche les métriques globales égales, 14 sorts communs, **0/14 calculés dans chaque version**, et explique chaque indisponibilité par **Unsupported land restriction: Abandoned Air Temple**. Les hypothèses fixes et l’absence de sauvegarde des paramètres interactifs sont écrites ; Load A/B est proposé. Une comparaison de deux listes différentes compatibles n’a pas été réalisée ici.
5. **Bibliothèque.** Ouverture réelle de la fiche Sideboarding de Reid Duke puis du parcours RCQ : dix articles, dates et statuts visibles. La note corrigée reconnaît les FNM en best-of-three et recommande de vérifier le format de l’événement. Lecture de Privacy, qui distingue stockage, appels externes, effacement local et diffusion par lien.

## Notes comparables

| Axe           | 9 septembre | 10 septembre |     Delta | Justification actuelle                                                                                           |
| ------------- | ----------: | -----------: | --------: | ---------------------------------------------------------------------------------------------------------------- |
| Accessibilité |           4 |            4 |         0 | Exemple immédiat et promesse mieux cadrée ; quantité de vocabulaire et de texte toujours importante.             |
| Pertinence    |           3 |            3 |         0 | Mana et préparation RCQ utiles ; ni suivi des résultats ni matchups Standard récents constatés.                  |
| Profondeur    |           4 |            4 |         0 | Sources, objectifs et hypothèses détaillés ; couverture du comparateur toujours limitée sur l’exemple principal. |
| Utilisabilité |           3 |            4 |        +1 | Priorité chiffrée et accès Manabase fonctionnels ; nom préservé, absence de calcul expliquée.                    |
| Confiance     |           3 |            4 |        +1 | Accueil, Privacy, indices et note FNM beaucoup plus cohérents ; quelques formulations résiduelles empêchent 5.   |
| Partage       |           4 |            4 |         0 | Blueprint mieux contextualisé et nommé ; pas de nouveau lien réouvert ni de fichier inspecté dans ce parcours.   |
| **Moyenne**   |    **3,50** |     **3,83** | **+0,33** | **21/6 → 23/6 ; équivalent 14,00/20 → 15,33/20.**                                                                |

## Frictions résiduelles et recommandations

**P1 — Comparaison utile mais incomplète pour ce deck.** Expliquer une indisponibilité restaure la confiance, sans permettre de décider quelle version lancer au FNM. L’exemple principal demeure impropre à une comparaison par sort. Regrouper le motif commun aujourd’hui répété 28 fois, puis offrir une sortie directe vers un parcours compatible, allégerait fortement la lecture. La comparaison d’estimations sous paramètres identiques reste une piste produit à évaluer, sans fabriquer des deltas hors modèle.

**P2 — Nettoyage éditorial encore nécessaire.** My Analyses affiche encore « Nothing sent to servers ». Dans le contexte de l’historique local, l’intention se comprend ; isolée, cette formule reste plus absolue que Privacy. La bibliothèque annonce « Five short, welcoming reads » juste avant « 7 reads » : les compteurs structurés ont progressé, mais ce texte statique contredit encore leur total.

**P2 — Diagnostic à relier au coût d’un changement.** Sept sources vertes manquantes constituent une direction claire, pas sept terrains à ajouter automatiquement. Sarah doit encore choisir elle-même les swaps et arbitrer son plan de jeu. Un exemple pédagogique d’itération compatible serait plus utile qu’une nouvelle métrique globale.

## Verdict et limites

Sarah reviendrait plus volontiers pour contrôler sa mana et préparer une discussion avec sa team FNM. Elle pourrait envoyer une capture correctement nommée en expliquant le modèle. Le gain tient surtout à la compréhension et à la confiance ; il ne transforme pas l’outil en portail Standard complet.

Aucun test automatisé, oracle, simulation mulligan, export, partage de bout en bout, mobile effectif, thème sombre, lecteur écran, mesure de contraste ou lien externe n’a été validé par cet agent aujourd’hui. Aucun jugement juridique ni succès de production n’est déduit de cette visite locale. Les notes restent une évaluation persona argumentée, sans précision statistique ni causalité expérimentale revendiquée.
