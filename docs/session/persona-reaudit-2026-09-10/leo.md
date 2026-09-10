# Léo — Le Curieux : 3,50/5, progression de +0,50

Ré-audit du 10 septembre 2026, sur le candidat local `dist-06` servi à `http://127.0.0.1:4186`. Comparaison avec le rapport Léo du 9 septembre, réalisé sur la production. **Simulation experte du persona canon, pas entretien ni mesure de satisfaction réelle.** Cette progression juge les deux expériences observées ; elle ne prouve pas que la production s’est améliorée.

## Première impression simulée

« Je peux toujours essayer gratuitement sans compte. Maintenant le site explique un peu mieux ce que les chiffres veulent dire, et il me dit quelle couleur regarder. Mais quand je demande pourquoi, j’arrive encore sur une explication de spécialiste. »

Léo a six mois de pratique et cherche surtout à comprendre pourquoi il ne peut pas jouer ses cartes. Son veto sur l’inscription reste levé. L’amélioration principale est une prochaine action identifiable, davantage qu’une simplification générale du produit.

## Parcours personnel réellement réalisé

Onglet CUA dédié, stockage du navigateur partagé avec la campagne : accueil → « Try an example deck » → formulaire Nature’s Rhythm → « Analyze Manabase » → résultat 60 cartes, 23 terrains, Health 91 → ouverture « Why the three scores differ » → « Review mana sources » → Manabase → Guide et ouverture « Read Your Results » → Privacy → Library et clic « Jump to Start Here ». Lecture des sept références First FNM dans le DOM, sans ouvrir leurs destinations externes.

Ensuite, navigation vers le lien d’exemple exact observé dans l’interface, `/analyzer?sample=exact` : formulaire 24 Plains / 36 Savannah Lions → analyse → mode Exact Goldfish Potential sélectionné, Health 99 et potential castability 98 %. Clic Share, observation du toast puis lecture du presse-papiers : texte vide dans cet environnement iab. Le lien n’a donc pas été rouvert personnellement. Une capture du résultat simple en thème clair a été inspectée ; le reste du parcours a été lu dans les arbres d’accessibilité et le DOM.

Un tutoriel est apparu brièvement pendant le premier calcul ; son bouton Skip était déjà détaché au clic suivant, puis les résultats étaient disponibles. Avec le stockage partagé, je n’attribue pas ce comportement à une première visite isolée reproductible. Aucun effacement d’historique effectué.

## Notes comparables

Même grille de six axes entiers de 1 à 5, moyenne simple : 1 très insuffisant, 3 utile avec frictions importantes, 5 excellente adéquation au périmètre observé. L’accessibilité désigne ici la compréhension du propos.

| Axe           | 9 septembre | 10 septembre | Évolution | Justification                                                                                                                                                                                           |
| ------------- | ----------: | -----------: | --------: | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Accessibilité |           3 |            3 |         0 | Entrée gratuite claire, mais « goldfish », « hybrid », « heuristic » et symboles de modèle restent très présents. Le diagnostic améliore la compréhension locale sans rendre tout le parcours débutant. |
| Pertinence    |           4 |            4 |         0 | Mana, sources et First FNM répondent toujours directement à ses besoins ; l’exemple technique n’ajoute pas un nouveau besoin satisfait.                                                                 |
| Profondeur    |           3 |            3 |         0 | Les explications sont plus honnêtes mais peu graduées : ouvrir les trois scores expose immédiatement formules, pourcentages de pondération et hypothèses.                                               |
| Utilisabilité |           3 |            4 |        +1 | La priorité chiffrée et son bouton conduisent effectivement à Manabase. L’exemple exact produit une ligne lisible sans résultat indisponible. Deuxième clic d’analyse conservé.                         |
| Confiance     |           2 |            4 |        +2 | Accueil, Guide et Privacy distinguent désormais estimation, calcul local et requêtes externes. Quelques conseils trop absolus subsistent ; pas de certification des calculs par cet agent.              |
| Partage       |           3 |            3 |         0 | Library reste recommandable à un ami, mais copier naturellement l’URL Analyzer ne transporte toujours pas le deck. Le toast Share ne constitue pas une réouverture vérifiée ici.                        |
| **Moyenne**   |    **3,00** |     **3,50** | **+0,50** | **21/6 contre 18/6 ; 14,00/20 contre 12,00/20.**                                                                                                                                                        |

## Progrès et frictions résiduelles

**Progrès concret :** « G a 16 sources pour une cible Karsten de 23, soit 7 manquantes » donne enfin une priorité. Le bouton ouvre les sources vertes et blanches, dont les déficits correspondent. Léo peut demander une aide ciblée à son ami au lieu de montrer uniquement un score « Excellent ».

**Confiance retrouvée :** l’accueil ne promet plus zéro transmission ; Privacy précise les noms de cartes envoyés à Scryfall, les images et les polices externes. Le guide qualifie le score d’indice heuristique et distingue les modèles. Ce sont des textes personnellement lus, pas un audit réseau ou juridique.

**P1 — Le diagnostic demeure une étape intermédiaire.** Manabase montre les déficits mais ne guide pas Léo dans un premier remplacement expliqué. « Excellent » et « 7 sources short » restent émotionnellement contradictoires pour lui, même avec une définition techniquement cohérente.

**P1 — Simplification encore trop absolue dans le guide.** L’accordéon « Read Your Results » dit encore qu’en dessous de 85 % de castability il faut davantage de sources de cette couleur. Une phrase conditionnelle et un exemple expliqueraient mieux la décision, sans transformer tout pourcentage faible en recette universelle.

**P2 — Parcours débutant encore encombré.** Les nouveautés précèdent Start Here. Celui-ci annonce toujours « Five short, welcoming reads », puis affiche « 7 reads » et sept articles. Les 65 références de l’accueil et de Library sont désormais cohérentes, mais ce résidu est visible. L’exemple de 36 Savannah Lions porte un nom de démonstration, sans avertissement évident dans le formulaire qu’il ne constitue pas une liste de tournoi à copier.

## Verdict et limites

Retour plus plausible vers Analyzer, surtout accompagné d’un ami. Partage simulé privilégié : URL Library dans un DM privé, puis capture du déficit vert avec une question concrète. Aucun message envoyé. Priorités : mini-explication avant les formules, premier changement guidé, guide moins prescriptif, compteur First FNM corrigé et indication près de Share que l’adresse courante ne contient pas le deck.

Le bilan `persona-validation-mfydqnp5/FINAL.md` rapporte des validations antérieures du partage, des exports et de largeurs mobiles effectives ; je ne les présente pas comme mes propres tests. Aucun test automatisé, oracle, export, mode sombre ou viewport mobile effectif rejoué ici. Le presse-papiers vide est une limite de vérification, pas une panne générale démontrée. Aucun code produit modifié.
