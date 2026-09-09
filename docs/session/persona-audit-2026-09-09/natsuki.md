# Natsuki — Grinder : audit du 9 septembre 2026

Évaluation simulée à partir de la persona 4 du référentiel, et non entretien avec une joueuse réelle. Parcours effectué sur https://www.manatuner.app dans un onglet dédié du navigateur intégré, à 1280 × 720. Aucun contrôle mobile revendiqué. Engine v2.7.9 constaté dans Analyzer. Les preuves historiques S002 décrivent un candidat local ; elles ne remplacent pas les constats de production ci-dessous.

## Première impression — voix simulée

« Le calcul de mana et le code public m'intéressent. Mais “Exact Probabilities” et “optimal thresholds” me font immédiatement chercher le modèle : quelle variable optimise-t-on, et quelles cartes sont réellement couvertes ? Je peux consacrer dix minutes à cet outil si les résultats ressortent dans un format exploitable par ma team. »

## Parcours constaté

1. **Accueil** : promesse mana, ramp et mulligans immédiatement identifiable ; accès GitHub, Analyzer, Library et Mathematics. Le site annonce un exemple de score 87 % interprété comme proportion de sorts lancés sur la courbe. Il affiche à la fois les noms de cartes envoyés à Scryfall et « 0 Data sent to servers ». La bibliothèque est annoncée à 54 articles.
2. **Mathematics** : lecture du bandeau goldfish et des hypothèses, puis des distinctions Karsten/castability. Bon point : les objectifs Karsten sont conditionnels, contrairement à la disponibilité sans mulligan. Friction : le bandeau nouveau, la description des anciennes approximations et « If I keep this hand » cohabitent ; il faut reconstruire le contrat actuel.
3. **Library → Pro Tour Preparation** : lien d'ancrage fonctionnel, neuf articles, lecture visuelle de trois cartes. Saito, Fortier, Dagen, Chapin et l'inventaire mathématique d'Anaël YAHI correspondent au niveau attendu. Bibliothèque réelle : 65 articles, 46 live, 13 archived et six lost. Le parcours Limited expose six ressources, dont 17Lands ; ce sont des références externes, pas un tableau interne de GIH WR.
4. **Privacy** : page courte déclarant ne transmettre aucune information personnelle ou de deck. Cette formulation est plus absolue que l'information Scryfall de l'accueil. Aucune analyse réseau exhaustive ni conclusion juridique dans cet audit.
5. **Analyzer** : l'exemple public Nature's Rhythm était prérempli dans le stockage partagé du navigateur ; clic Analyze, résultat 60 cartes/23 terrains. Je n'assimile donc pas ce parcours à une première visite sans données. Health Score 91/100, deux couleurs sous les objectifs Karsten, moteur 2.7.9.
6. **Mulligan** : Midrange sélectionné, 10 000 échantillons par taille, qualité 54/100, seuil à sept cartes 51. Le texte précise score heuristique, arrêt à quatre cartes, bottoming heuristique et plans sans ramp. L'aide explique néanmoins une nouvelle main d'une carte de moins, incohérente avec la règle London annoncée. Plusieurs plans d'exemples sont explicitement indisponibles.
7. **Castability → Exact Goldfish Potential** : le mode initial est MANA ESTIMATES, Modern/Pioneer, on the play, ramp activé, hypothèse de removal 35 %. Passer en exact retire les pourcentages de toutes les 14 lignes : restriction d'Abandoned Air Temple non supportée. Le mode précise 0 % removal, 100 % survie, information complète sur l'historique pioché : potentiel supérieur à une politique sans prescience.
8. **Blueprint → Export** : formats PNG, PDF, JSON et **CSV (Sheets / Pandas)** présents. Téléchargement et contenu CSV non vérifiés dans ce sous-audit. Le Blueprint affiche un autre indice heuristique, 92, et un nom générique daté. Le roundtrip d'un lien partagé n'est pas certifié ici.

## Points positifs

L'outil donne des hypothèses concrètes à discuter : play/draw, retrait de ramp, risque de removal, tailles d'échantillons. L'exclusion explicite des résultats non supportés est exactement ce que j'attends d'un outil sérieux : je peux identifier une limite au lieu d'emporter un faux chiffre dans ma feuille de testing.

Le modèle de mulligan indique qu'il optimise une qualité de main et non les victoires. Cette distinction évite de confondre 10 000 simulations avec 10 000 matches réels. L'accès au code et aux références mathématiques rend la discussion contradictoire possible. Les exports structurés constituent un vrai point d'entrée vers le travail d'équipe.

La bibliothèque apporte une valeur différente mais réelle : références datées, auteurs identifiables, liens d'archives, état lost annoncé, raccourci Pro Tour. Je peux recommander une lecture précise à mes coéquipiers sans leur demander d'adopter tout l'outil.

## Frictions et manques

- **P1 — Cohérence des chiffres et promesses.** Le bandeau conseille de garder presque toute main de deux à quatre terrains, alors que l'onglet Mulligan utilise un modèle heuristique distinct et plafonné. Blueprint 92, Health 91 et qualité 54 ne sont pas trois évaluations interchangeables ; leur articulation devrait être explicite dans l'artefact partagé.
- **P1 — Exemple exact inexploitable.** L'exemple mis en avant rend toutes les lignes indisponibles en exact. Le refus est correct, mais le premier essai ne démontre pas la valeur du moteur exact pour mon travail.
- **P1 — Documentation contradictoire.** L'aide de mulligan, les slogans exacts de l'accueil et les formulations mixtes de Mathematics empêchent de savoir rapidement quel résultat je peux citer. La promesse de confidentialité absolue ajoute un doute évitable.
- **P2 — Intégration limitée au parcours constaté.** CSV/JSON existent ; aucune API documentée, requête reproductible ou documentation de schéma versionnée n'a été rencontrée. Cela ne prouve pas leur inexistence dans tout le dépôt. Mon workflow reste manuel.
- **P2 — Écart de besoin.** Aucun feed MTGO, matchup matrix ou segmentation Limited n'est proposé dans les surfaces parcourues. C'est un écart avec cette persona, pas une obligation de transformer ManaTuner en plateforme de métagame.
- **P2 — Actualité éditoriale.** 54 articles annoncés contre 65 dans Library ; “What's new” ne donne pas une date d'ajout précise à chaque ressource. Le compteur fragilise inutilement la perception de maintenance.

Aucun P0 technique bloquant n'a été reproduit. Les P1 bloquent ma recommandation du calcul comme référence de préparation compétitive autonome.

## Notes

| Axe           |       /5 | Commentaire                                                                                                    |
| ------------- | -------: | -------------------------------------------------------------------------------------------------------------- |
| Accessibilité |        4 | Proposition claire et entrée directe ; l'anglais technique convient à Natsuki.                                 |
| Pertinence    |        3 | Utile pour le mana et les lectures ; besoins centraux de données compétitives non couverts.                    |
| Profondeur    |        3 | Hypothèses détaillées et deux modes ; couverture exacte insuffisante sur l'exemple, intégration non démontrée. |
| Utilisabilité |        4 | Navigation et ancre Pro Tour efficaces ; plusieurs lectures nécessaires pour réconcilier les modèles.          |
| Confiance     |        2 | Refus des résultats non supportés et code public appréciés, mais contradictions publiques trop importantes.    |
| Partage       |        3 | CSV/JSON et liens de lecture adaptés à la team ; adoption structurée encore à valider.                         |
| **Moyenne**   | **3,17** | **19/6 ; 12,67/20.**                                                                                           |

Baseline du 1er août : 3,33/5 ; écart arrondi −0,16. Évaluation qualitative différente et couverture live plus explicite : cet écart n'est pas une mesure statistique de régression.

## Verdict et recommandations

« Je reviens pour vérifier une hypothèse de mana et récupérer une référence Pro Tour. Je partagerais une lecture ou un CSV annoté dans le Notion de ma team ; je ne présenterais pas encore le score global comme une mesure de performance du deck. »

1. Unifier accueil, Mathematics et aide London avec les contrats réellement affichés par chaque mode.
2. Ajouter un exemple compatible exact et annoncer la couverture avant de lancer ce mode.
3. Expliquer côte à côte les indices Health/Blueprint/Mulligan ; conserver les hypothèses avec chaque export.
4. Documenter un schéma CSV/JSON versionné, moteur et paramètres inclus ; tester l'import dans une feuille de calcul de team avant d'envisager une API.
5. Fiabiliser les compteurs éditoriaux et l'information Scryfall ; rendre la maintenance datée facilement vérifiable.
