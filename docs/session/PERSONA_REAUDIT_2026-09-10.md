# ManaTuner — évolution des notes après correctifs

10 septembre 2026. **Comparaison : production auditée le 9 septembre → candidat local corrigé dist-06.** Les nouvelles notes ne constituent pas une validation de la version publique.

## Méthode conservée et limites de comparaison

Les six profils canoniques sont repris : Léo, Sarah, Karim, Natsuki, David et Thibault, chacun confié à un agent distinct. Même grille : accessibilité du propos, pertinence, profondeur, utilisabilité, confiance, partage ; notes entières de1à5. Moyenne simple des six axes, puis moyenne simple des six profils. Les écarts sont calculés sur les valeurs exactes avant arrondi. Ce sont des évaluations simulées, sans entretiens ni mesure d’adoption.

Le candidat est identifié par HEAD `251731694b2a0b6b74102a73d50e56fae8ce2750` et `docs/engineering/persona-validation-mfydqnp5/verified-manifest.json`. Contrôle indépendant du briefing :270sources/configs et154fichiers dist-06 conformes. Le serveur strict est `http://127.0.0.1:4186/`. Aucun rebuild, modification applicative, push ou déploiement pendant cet audit.

**La grille est identique, mais le protocole n’est pas strictement identique.** Léo et Sarah ont rejoué des parcours navigateur, complétés par le coordinateur. Quatre agents réutilisés n’avaient plus de navigateur accessible dans leur contexte : leurs évaluations reposent sur lectures HTTP du candidat, artefacts, observations actuelles partagées et preuves QA du même candidat. Ils signalent cette limite dans leur rapport. Les notes correspondantes restent indicatives, particulièrement pour l’utilisabilité. La campagne n’est pas présentée comme six sessions navigateur autonomes.

Les preuves antérieures799tests/61Chromium/8WebKit, mobile et exports du dossier FINAL sont reconsultées, pas rejouées ici. Leur existence renforce la base factuelle par rapport au9septembre : une partie du gain reflète une vérification désormais disponible, pas seulement une nouvelle fonctionnalité. Aucun gain statistique de satisfaction ou causalité expérimentale n’est établi.

Références : [baseline du9septembre](PERSONA_AUDIT_2026-09-09.md), [preuves actuelles du lead](persona-reaudit-2026-09-10/preuves-lead.md), [bilan de livraison du candidat](../engineering/persona-validation-mfydqnp5/FINAL.md).

## Résultat global

**3,22/5 → 3,67/5 : +0,44/5. Sur20 : 12,89 → 14,67, soit +1,78point.**

| Persona  | Avant /5 | Candidat /5 | Évolution /5 | Candidat /20 |
| -------- | -------: | ----------: | -----------: | -----------: |
| Léo      |     3,00 |    **3,50** |        +0,50 |        14,00 |
| Sarah    |     3,50 |    **3,83** |        +0,33 |        15,33 |
| Karim    |     3,50 |    **3,83** |        +0,33 |        15,33 |
| Natsuki  |     3,17 |    **3,67** |        +0,50 |        14,67 |
| David    |     3,00 |    **3,50** |        +0,50 |        14,00 |
| Thibault |     3,17 |    **3,67** |        +0,50 |        14,67 |

Les deltas utilisent les moyennes non arrondies : la différence entre deux nombres affichés peut varier de0,01. Baseline116/36, candidat132/36.

### Évolution par critère

| Critère       | Avant /5 | Candidat /5 |  Gain |
| ------------- | -------: | ----------: | ----: |
| Accessibilité |     3,83 |        3,83 | +0,00 |
| Pertinence    |     3,50 |        3,67 | +0,17 |
| Profondeur    |     3,33 |        3,50 | +0,17 |
| Utilisabilité |     3,17 |        3,83 | +0,67 |
| Confiance     |     2,33 |        3,33 | +1,00 |
| Partage       |     3,17 |        3,83 | +0,67 |

## Ce qui explique la progression

**Le gain principal est la confiance : +1point sur5.** L’accueil et Privacy expliquent mieux les flux externes et les limites du calcul. L’explication des trois indices réduit le risque de prendre Health, Blueprint et Mulligan pour trois versions d’une même probabilité.

**Utilisabilité et partage gagnent chacun environ0,67point sur5.** Le diagnostic indique désormais un déficit chiffré et ouvre Manabase. Les indisponibilités de Compare ont un motif ; le lead a confirmé1/1sort calculé sur deux essais compatibles identiques. Les exports vérifiés du candidat conservent nom, définitions et hypothèses. La preuve antérieure d’ouverture du lien dans un autre contexte est désormais disponible, sans prétendre qu’elle a été rejouée par chaque persona.

**Profondeur et pertinence progressent peu ; l’accessibilité reste stable.** Les corrections clarifient le produit plus qu’elles n’élargissent sa couverture. Le nouvel exemple exact fonctionne, mais les terrains complexes d’Atraxa et du midrange restent hors modèle dans certaines vues. Le site conserve aussi sa densité et son vocabulaire technique. Aucun bonus de fonctionnalité fictive n’est ajouté aux notes.

## Ce qui empêche encore une note supérieure

| Priorité | Résidu                                          | Preuve et effet                                                                                                                                           |
| -------- | ----------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| P1       | Mathematics mêle encore descriptions de modes   | HTTP local lu par Karim/David/Natsuki : bandeau potentiel physique et corps Realistic/Perfect. La définition à citer reste ambiguë pour un expert.        |
| P1       | Promesse absolue dans My Analyses               | « Nothing sent to servers » confirmé en navigation par Sarah et le lead ; la politique détaillée améliorée ne suffit pas à supprimer cette contradiction. |
| P1/P2    | Exemple principal peu démonstratif pour Compare | Midrange toujours0/14 dans cette vue, cause désormais expliquée mais répétée. L’exemple exact fonctionne ; accès à une comparaison utile à simplifier.    |
| P2       | Pédagogie résiduelle                            | Léo retrouve dans Guide un conseil général sous85%; les indices sont mieux expliqués mais restent techniques.                                             |
| P2       | Finitions éditoriales et numériques             | Library dit encore Five pour7lectures ; Compare affiche97.8385472740882% au lieu d’un arrondi lisible.                                                    |
| P2       | Artefact autonome et paramètres                 | Partage transporte deck/nom/onglet, pas paramètres ; limite annoncée mais workflow expert encore manuel. Le rappel99+1 peut améliorer le Blueprint EDH.   |

Aucun nouveau P0 général établi. Ne pas corriger les limites du modèle en fabriquant des chiffres. Les slogans restants doivent être relus dans leur contexte plutôt que remplacés par une promesse d’exhaustivité nouvelle.

## Avis du coordinateur

**Les correctifs ont eu un effet positif réel sur les parcours observés et sur les preuves disponibles. Le candidat est plus compréhensible et plus défendable, sans être encore totalement cohérent.** La hausse reste mesurée : six profils gagnent entre0,33et0,50point, plutôt qu’un saut automatique à4,5/5 parce que les tâches sont cochées.

Je terminerais par une petite passe sur Mathematics, My Analyses et les derniers textes pédagogiques, puis un parcours de comparaison guidée. L’étape suivante pour valider l’adéquation n’est pas un troisième tour de notes simulées : ce sont quelques essais avec de vrais joueurs. Aucun participant, gain de conversion ou adoption n’est inventé ici. La publication et sa vérification restent séparées ; cet audit ne les autorise pas.

## Analyses détaillées des six profils

## Léo — Le Curieux : 3,50/5, progression de +0,50

Ré-audit du 10 septembre 2026, sur le candidat local `dist-06` servi à `http://127.0.0.1:4186`. Comparaison avec le rapport Léo du 9 septembre, réalisé sur la production. **Simulation experte du persona canon, pas entretien ni mesure de satisfaction réelle.** Cette progression juge les deux expériences observées ; elle ne prouve pas que la production s’est améliorée.

### Première impression simulée

« Je peux toujours essayer gratuitement sans compte. Maintenant le site explique un peu mieux ce que les chiffres veulent dire, et il me dit quelle couleur regarder. Mais quand je demande pourquoi, j’arrive encore sur une explication de spécialiste. »

Léo a six mois de pratique et cherche surtout à comprendre pourquoi il ne peut pas jouer ses cartes. Son veto sur l’inscription reste levé. L’amélioration principale est une prochaine action identifiable, davantage qu’une simplification générale du produit.

### Parcours personnel réellement réalisé

Onglet CUA dédié, stockage du navigateur partagé avec la campagne : accueil → « Try an example deck » → formulaire Nature’s Rhythm → « Analyze Manabase » → résultat 60 cartes, 23 terrains, Health 91 → ouverture « Why the three scores differ » → « Review mana sources » → Manabase → Guide et ouverture « Read Your Results » → Privacy → Library et clic « Jump to Start Here ». Lecture des sept références First FNM dans le DOM, sans ouvrir leurs destinations externes.

Ensuite, navigation vers le lien d’exemple exact observé dans l’interface, `/analyzer?sample=exact` : formulaire 24 Plains / 36 Savannah Lions → analyse → mode Exact Goldfish Potential sélectionné, Health 99 et potential castability 98 %. Clic Share, observation du toast puis lecture du presse-papiers : texte vide dans cet environnement iab. Le lien n’a donc pas été rouvert personnellement. Une capture du résultat simple en thème clair a été inspectée ; le reste du parcours a été lu dans les arbres d’accessibilité et le DOM.

Un tutoriel est apparu brièvement pendant le premier calcul ; son bouton Skip était déjà détaché au clic suivant, puis les résultats étaient disponibles. Avec le stockage partagé, je n’attribue pas ce comportement à une première visite isolée reproductible. Aucun effacement d’historique effectué.

### Notes comparables

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

### Progrès et frictions résiduelles

**Progrès concret :** « G a 16 sources pour une cible Karsten de 23, soit 7 manquantes » donne enfin une priorité. Le bouton ouvre les sources vertes et blanches, dont les déficits correspondent. Léo peut demander une aide ciblée à son ami au lieu de montrer uniquement un score « Excellent ».

**Confiance retrouvée :** l’accueil ne promet plus zéro transmission ; Privacy précise les noms de cartes envoyés à Scryfall, les images et les polices externes. Le guide qualifie le score d’indice heuristique et distingue les modèles. Ce sont des textes personnellement lus, pas un audit réseau ou juridique.

**P1 — Le diagnostic demeure une étape intermédiaire.** Manabase montre les déficits mais ne guide pas Léo dans un premier remplacement expliqué. « Excellent » et « 7 sources short » restent émotionnellement contradictoires pour lui, même avec une définition techniquement cohérente.

**P1 — Simplification encore trop absolue dans le guide.** L’accordéon « Read Your Results » dit encore qu’en dessous de 85 % de castability il faut davantage de sources de cette couleur. Une phrase conditionnelle et un exemple expliqueraient mieux la décision, sans transformer tout pourcentage faible en recette universelle.

**P2 — Parcours débutant encore encombré.** Les nouveautés précèdent Start Here. Celui-ci annonce toujours « Five short, welcoming reads », puis affiche « 7 reads » et sept articles. Les 65 références de l’accueil et de Library sont désormais cohérentes, mais ce résidu est visible. L’exemple de 36 Savannah Lions porte un nom de démonstration, sans avertissement évident dans le formulaire qu’il ne constitue pas une liste de tournoi à copier.

### Verdict et limites

Retour plus plausible vers Analyzer, surtout accompagné d’un ami. Partage simulé privilégié : URL Library dans un DM privé, puis capture du déficit vert avec une question concrète. Aucun message envoyé. Priorités : mini-explication avant les formules, premier changement guidé, guide moins prescriptif, compteur First FNM corrigé et indication près de Share que l’adresse courante ne contient pas le deck.

Le bilan `persona-validation-mfydqnp5/FINAL.md` rapporte des validations antérieures du partage, des exports et de largeurs mobiles effectives ; je ne les présente pas comme mes propres tests. Aucun test automatisé, oracle, export, mode sombre ou viewport mobile effectif rejoué ici. Le presse-papiers vide est une limite de vérification, pas une panne générale démontrée. Aucun code produit modifié.

---

## Sarah — La Régulière : 3,83/5, évolution +0,33

Réaudit simulé du 10 septembre 2026, persona canonique Sarah (Standard, FNM hebdomadaire, premier RCQ). Cible réellement parcourue : **http://127.0.0.1:4186/**, candidat local corrigé `dist-06` désigné par la coordination. Comparaison avec `docs/session/persona-audit-2026-09-09/sarah.md`, qui portait sur la production. Il ne s’agit donc pas d’une mesure de l’amélioration déjà publiée, ni d’un entretien utilisateur réel.

Le rapport `docs/engineering/persona-validation-mfydqnp5/FINAL.md` a été lu pour distinguer corrections annoncées et preuves historiques. Les notes ci-dessous reposent sur le parcours actuel ; les tests précédents ne sont pas présentés comme rejoués. Onglet propre dans le navigateur Codex intégré, stockage de l’origine partagé avec les autres agents : aucune première visite isolée prétendue, aucune analyse existante supprimée.

### Réaction simulée

« Je comprends mieux pourquoi le score est excellent alors que ma mana verte demande encore du travail. Je sais où regarder avant vendredi. Par contre, pour comparer mes deux listes avec ce terrain spécial, je reste bloquée : maintenant au moins je sais pourquoi. »

### Parcours réellement réalisé

1. **Accueil.** Lecture des modèles, de l’exemple, de la confidentialité et des parcours. Le site présente désormais des probabilités pour les cartes supportées, des estimations par défaut et des limites explicites du mode exact. Les appels Scryfall et les polices externes apparaissent dans le résumé de confidentialité. Le lien vers un exemple exact à terrains de base est visible ; je ne l’ai pas exécuté dans cette session.
2. **Try an example deck → Analyze Manabase.** Nature’s Rhythm produit 60 cartes, 23 terrains, Health Score 91/100. Le diagnostic écrit « 2 colors short » et donne immédiatement la priorité verte : **16 sources sur 23, déficit de 7**. Le bouton **Review mana sources** ouvre réellement Manabase, où figurent vert 16/23 et blanc 13/16. Ce passage d’un verdict à une action est la correction la plus concrète pour Sarah.
3. **Blueprint.** Le nom Nature’s Rhythm (Midrange Combo) est conservé. L’indice 92 est accompagné de sa définition, des poids, de la différence avec Health et Mulligan et du rappel qu’il ne mesure pas la castabilité. Le contexte du calcul enregistré et la limite du partage sont visibles : deck, nom et onglet transportés, paramètres à sélectionner à nouveau. Une capture du viewport a confirmé la lisibilité du diagnostic et de la navigation en thème clair ; le Blueprint a été lu dans l’arbre d’accessibilité, sans inspection d’un fichier exporté.
4. **My Analyses → Compare.** Deux entrées Nature’s Rhythm du jour étaient présentes dans l’historique partagé. Je les ai sélectionnées sans les modifier. La comparaison affiche les métriques globales égales, 14 sorts communs, **0/14 calculés dans chaque version**, et explique chaque indisponibilité par **Unsupported land restriction: Abandoned Air Temple**. Les hypothèses fixes et l’absence de sauvegarde des paramètres interactifs sont écrites ; Load A/B est proposé. Une comparaison de deux listes différentes compatibles n’a pas été réalisée ici.
5. **Bibliothèque.** Ouverture réelle de la fiche Sideboarding de Reid Duke puis du parcours RCQ : dix articles, dates et statuts visibles. La note corrigée reconnaît les FNM en best-of-three et recommande de vérifier le format de l’événement. Lecture de Privacy, qui distingue stockage, appels externes, effacement local et diffusion par lien.

### Notes comparables

| Axe           | 9 septembre | 10 septembre |     Delta | Justification actuelle                                                                                           |
| ------------- | ----------: | -----------: | --------: | ---------------------------------------------------------------------------------------------------------------- |
| Accessibilité |           4 |            4 |         0 | Exemple immédiat et promesse mieux cadrée ; quantité de vocabulaire et de texte toujours importante.             |
| Pertinence    |           3 |            3 |         0 | Mana et préparation RCQ utiles ; ni suivi des résultats ni matchups Standard récents constatés.                  |
| Profondeur    |           4 |            4 |         0 | Sources, objectifs et hypothèses détaillés ; couverture du comparateur toujours limitée sur l’exemple principal. |
| Utilisabilité |           3 |            4 |        +1 | Priorité chiffrée et accès Manabase fonctionnels ; nom préservé, absence de calcul expliquée.                    |
| Confiance     |           3 |            4 |        +1 | Accueil, Privacy, indices et note FNM beaucoup plus cohérents ; quelques formulations résiduelles empêchent 5.   |
| Partage       |           4 |            4 |         0 | Blueprint mieux contextualisé et nommé ; pas de nouveau lien réouvert ni de fichier inspecté dans ce parcours.   |
| **Moyenne**   |    **3,50** |     **3,83** | **+0,33** | **21/6 → 23/6 ; équivalent 14,00/20 → 15,33/20.**                                                                |

### Frictions résiduelles et recommandations

**P1 — Comparaison utile mais incomplète pour ce deck.** Expliquer une indisponibilité restaure la confiance, sans permettre de décider quelle version lancer au FNM. L’exemple principal demeure impropre à une comparaison par sort. Regrouper le motif commun aujourd’hui répété 28 fois, puis offrir une sortie directe vers un parcours compatible, allégerait fortement la lecture. La comparaison d’estimations sous paramètres identiques reste une piste produit à évaluer, sans fabriquer des deltas hors modèle.

**P2 — Nettoyage éditorial encore nécessaire.** My Analyses affiche encore « Nothing sent to servers ». Dans le contexte de l’historique local, l’intention se comprend ; isolée, cette formule reste plus absolue que Privacy. La bibliothèque annonce « Five short, welcoming reads » juste avant « 7 reads » : les compteurs structurés ont progressé, mais ce texte statique contredit encore leur total.

**P2 — Diagnostic à relier au coût d’un changement.** Sept sources vertes manquantes constituent une direction claire, pas sept terrains à ajouter automatiquement. Sarah doit encore choisir elle-même les swaps et arbitrer son plan de jeu. Un exemple pédagogique d’itération compatible serait plus utile qu’une nouvelle métrique globale.

### Verdict et limites

Sarah reviendrait plus volontiers pour contrôler sa mana et préparer une discussion avec sa team FNM. Elle pourrait envoyer une capture correctement nommée en expliquant le modèle. Le gain tient surtout à la compréhension et à la confiance ; il ne transforme pas l’outil en portail Standard complet.

Aucun test automatisé, oracle, simulation mulligan, export, partage de bout en bout, mobile effectif, thème sombre, lecteur écran, mesure de contraste ou lien externe n’a été validé par cet agent aujourd’hui. Aucun jugement juridique ni succès de production n’est déduit de cette visite locale. Les notes restent une évaluation persona argumentée, sans précision statistique ni causalité expérimentale revendiquée.

---

## Karim — Le Tacticien : 3,83/5, évolution +0,33

Réaudit expert simulé du 10 septembre 2026. Karim joue Pioneer/Modern et prépare des RCQ. Il cherche des décisions reproductibles : identifier un déficit, comparer et transmettre les hypothèses. Aucun entretien réel n’a eu lieu.

**Comparaison : production du 9 septembre → candidat local corrigé `dist-06`, servi sur http://127.0.0.1:4186/.** Ce rapport ne démontre aucune amélioration déjà publiée. Le profil canonique et le rapport individuel du 9 septembre ont été relus. La grille conserve les six axes, notes entières de 1 à 5 et moyenne simple.

### Méthode et provenance des preuves

Cet agent n’a pas pu ouvrir son propre onglet : CUA a répondu « Browser is not available: iab ». Il a donc inspecté les réponses HTTP locales de Mathematics, Privacy, Library, My Analyses et Home, toutes en statut 200. Le texte analysé est celui du HTML pré-rendu ; il ne prouve ni clic, ni calcul, ni état après hydratation.

Les interactions actuelles sont explicitement empruntées au rapport Sarah de cette campagne et aux observations communiquées par le coordinateur. Sarah a joué le diagnostic, Manabase, Blueprint et Compare ; le coordinateur a joué l’exemple exact, obtenu 98 % et vérifié l’aide des trois indices. Ce parcours collectif fournit des preuves utiles sans constituer une nouvelle navigation indépendante de Karim.

Enfin, le briefing de cet agent a vérifié les empreintes : les 270 fichiers source/configuration et les 154 fichiers du candidat correspondent au manifeste, sans différence. Les validations d’export décrites dans `export-review/REVIEW.md` sont donc attachées au même candidat, mais restent des validations antérieures, non rejouées ici. Aucun stockage partagé n’a été modifié.

### Réaction simulée

« Je peux mieux expliquer à ma team ce que mesure chaque chiffre. Le diagnostic me dit où commencer et l’export porte enfin le contexte du build. Mais la comparaison de mon midrange reste sans probabilités utilisables ; une raison technique répétée sur chaque ligne ne remplace pas mon test avant/après. »

### Ce qui progresse concrètement

**Accueil et confidentialité.** Home indique maintenant des estimations par défaut, les limites des modes exacts et le rôle des recherches Scryfall. L’exemple Health 87 est défini comme accès aux couleurs au tour deux, distinct d’une fréquence de sorts joués sur la courbe. Privacy décrit les appels externes, les caches et la diffusion des liens. Karim peut présenter le fonctionnement plus fidèlement à son groupe sans reconstituer toutes les nuances lui-même.

**Diagnostic et indices.** Le parcours actuel de Sarah montre vert 16/23, déficit de sept, et un bouton réellement fonctionnel vers Manabase. Le nom Nature’s Rhythm est conservé dans Blueprint ; définitions et différences Health/Blueprint/Mulligan sont accessibles. La correction facilite l’investigation, sans prouver qu’ajouter sept terrains serait la bonne décision ni modifier les formules pour rapprocher artificiellement les indices.

**Comparaison.** Sarah observe toujours 0/14 probabilités calculées de chaque côté sur deux sauvegardes midrange. Toutefois, le motif « Unsupported land restriction: Abandoned Air Temple », les hypothèses fixes et Load A/B sont désormais visibles. L’indisponibilité est explicable. Le coordinateur a aussi comparé deux exemples identiques à 24 Plains : 1/1 sort calculé, Savannah Lions à 97,8385472740882 % des deux côtés, delta nul. Les hypothèses fixes sont affichées. Cela valide une comparaison compatible, sans démontrer un gain entre deux builds différents ; la précision affichée est excessive.

**Transmission et bibliothèque.** La revue d’export antérieure décrit CSV/JSON parsés, nom préservé, zones identifiables et PNG/PDF inspectés avec définitions du modèle. Le partage transporte deck, nom et onglet ; les paramètres doivent être resélectionnés. Le HTML actuel affiche dix lectures RCQ et corrige la note Sideboarding pour les FNM en best-of-three. Ces améliorations correspondent au travail de préparation de Karim.

### Notes et évolution

| Axe                     |    Avant |    Après |     Delta | Commentaire                                                                                                   |
| ----------------------- | -------: | -------: | --------: | ------------------------------------------------------------------------------------------------------------- |
| Accessibilité du propos |        4 |        4 |         0 | Promesse mieux définie ; densité et vocabulaire toujours adaptés surtout aux initiés.                         |
| Pertinence              |        4 |        4 |         0 | Sources, RCQ et exports répondent au tuning ; pas de données de métagame nouvelles, hors périmètre principal. |
| Profondeur              |        4 |        4 |         0 | Modèles et hypothèses riches ; couverture exacte toujours limitée sur l’exemple midrange.                     |
| Utilisabilité           |        3 |        4 |        +1 | Diagnostic actionnable, nom conservé et motifs visibles ; comparaison utile encore partielle.                 |
| Confiance               |        3 |        3 |         0 | Progrès réels, mais contradictions persistantes précisément sur les pages que Karim consulte.                 |
| Partage                 |        3 |        4 |        +1 | Artefacts documentés et validés sur ce candidat, limites du lien explicites ; paramètres non transportés.     |
| **Moyenne**             | **3,50** | **3,83** | **+0,33** | **21/6 → 23/6 ; 14,00/20 → 15,33/20.**                                                                        |

### Réserves prioritaires

**P1 — Documentation mathématique encore ambiguë.** Mathematics commence par décrire les lignes Castability comme une castabilité physique, tandis que Home précise les estimations par défaut. Plus bas, la section Castability présente encore Realistic/Perfect et les approximations d’accélération. Le lecteur doit reconstruire quelle description concerne quelle vue et quel mode. Ce constat porte sur les formulations, pas sur une erreur numérique démontrée.

**P1 — Comparatif inexploitable sur le midrange observé.** Le motif commun est répété 28 fois selon Sarah. Regrouper les motifs et proposer une démonstration avant/après compatible serait plus efficace. Ne pas remplacer l’indisponibilité par une probabilité inventée.

**P2 — Confidentialité absolue résiduelle.** My Analyses conserve « nothing leaves your browser » et « Nothing sent to servers ». Le contexte est l’historique local, mais ces phrases isolées restent plus larges que Privacy. Home ne cite toujours pas CSV dans sa présentation courte des exports.

### Verdict

Karim recommande davantage l’outil pour examiner les sources et discuter un build documenté. Il ne présenterait toujours pas un Blueprint comme preuve de gain compétitif ou de win rate. L’amélioration est modérée et crédible, surtout opérationnelle. Mobile, thème sombre, nouveau téléchargement, partage rouvert et calcul comparatif de deux listes différentes n’ont pas été exécutés par cet agent. Ces incarnations ne sont pas six tests utilisateurs indépendants ni une mesure statistique.

---

## Natsuki — réaudit du candidat corrigé, 10 septembre 2026

### Périmètre et méthode

J’incarne exclusivement Natsuki, persona 4 du [référentiel canonique](../personas/mtg-player-personas.md) : compétitrice Pioneer/Modern, travail de testing méthodique, données structurées partagées avec sa team. Ce jugement simulé ne constitue pas un entretien. La référence précédente est [son audit du 9 septembre](persona-audit-2026-09-09/natsuki.md), noté 19/6.

Cible : **candidat local dist-06, http://127.0.0.1:4186**, identifié par le [bilan vérifié](../engineering/persona-validation-mfydqnp5/FINAL.md) et son manifeste. Ce rapport n’attribue aucune amélioration à la production. L’ouverture d’un onglet CUA dédié a échoué : « Browser is not available: iab ». J’ai donc lu directement par HTTP le HTML prérendu de `/`, `/mathematics`, `/privacy` et `/my-analyses` (quatre réponses 200), puis inspecté les JSON/CSV réellement téléchargés par QA. Je n’ai pas exécuté personnellement les interactions JavaScript.

Les preuves actuelles partagées du coordinateur et de QA complètent ces lectures. Elles sont distinguées des constats personnels et des tests historiques du 9 septembre. Le périmètre moins interactif que la baseline limite la comparaison des notes.

### Première impression simulée

« Je peux maintenant récupérer un résultat dont les hypothèses voyagent avec les données. L’exemple exact m’offre un contrôle simple avant de brancher mon spreadsheet. Mais si Mathematics décrit encore plusieurs modèles sous les mêmes intitulés, je dois vérifier chaque colonne avant de la citer à ma team. »

### Avant/après et progrès utiles

**La promesse devient plus précise.** L’accueil HTTP décrit le score illustratif 87 % comme accès aux couleurs au tour deux et exclut explicitement pourcentage de sorts sur la courbe et conseil de keep. Il présente les estimations par défaut et les limites du mode exact. Les 65 références et les nombres des parcours remplacent le compteur 54 de la baseline. Pour moi, cela réduit le risque d’introduire un faux indicateur de performance dans le document de préparation.

**Le premier résultat exact est démontrable.** Le coordinateur observe 98 % sur le nouvel exemple 24 Plains/36 Savannah Lions ; QA documente la comparaison à un oracle indépendant. Le JSON inspecté contient 97,8385472740882 % pour Savannah Lions. La baseline refusait les 14 lignes exactes du midrange. Cette fixture synthétique démontre un événement simple ; ses 36 exemplaires ne forment pas une liste de tournoi légale et ne prouvent pas la couverture d’une manabase compétitive complexe.

**Les exports deviennent exploitables.** J’ai ouvert `persona.json` et `persona.csv` sous `qa/candidate-06/`. Le nom `Persona, "White"`, Engine 2.7.9, les totaux 60/24 et les définitions Health/Blueprint/Mulligan sont présents. Le JSON annonce `physical-v1`, PLAY, sans mulligans ni ramp, X=2 et exclusion de la pioche du sort cible. Il précise que ce snapshot ne reproduit pas les réglages interactifs de Castability. C’est un progrès tangible sur la baseline, qui avait seulement constaté un menu d’export. Le CSV distingue aussi commandant et sideboard.

**La comparaison dispose de preuves nouvelles.** Le coordinateur a comparé deux exemples identiques : une ligne calculée de chaque côté et 97,8385472740882 % des deux côtés. Cela vérifie l’affichage symétrique, pas un effet de modification. Séparément, le rapport QA final atteste une comparaison 20/24 Plains avec probabilité descendante. Je prends cette preuve attribuée en compte sans prétendre avoir refait ce parcours.

**Les explications sont plus transportables.** L’aide des trois scores est confirmée par le coordinateur ; leurs définitions sont personnellement vérifiées dans les exports. QA atteste une simulation réelle 3k multijoueur puis duel et les textes London adaptés. Ces améliorations concernent la compréhension du modèle, pas une démonstration de meilleurs keeps en tournoi.

### Frictions restantes

**P1 — Documentation du modèle.** Dans `/mathematics`, le bandeau décrit les sources physiques et les anciennes estimations secondaires, mais les sections « Castability Tab », « Realistic (primary) » et « If I keep this hand » restent mélangées. L’intitulé peut encore faire passer une disponibilité depuis une main aléatoire pour une probabilité conditionnée à ma main observée. Ce résidu suffit à empêcher une recommandation sans commentaire méthodologique.

**P1 — Confidentialité encore contradictoire dans le parcours.** `/privacy` décrit précisément Scryfall, les polices externes et les limites du stockage local. Cependant `/my-analyses` affiche toujours « Nothing sent to servers » et « nothing leaves your browser ». Une lecture limitée aux analyses sauvegardées est possible, mais la formulation absolue reste évitable. Je ne conclus ni à une fuite supplémentaire ni à une conformité juridique.

**P2 — Intégration et représentativité.** Le CSV assemble commentaires, tableau de cartes et tableau de synthèse : un import naïf comme table unique demande une adaptation. Aucun contrat d’API ou schéma public versionné n’est établi par cette revue. Le lien partagé conserve deck/nom/onglet, pas les paramètres interactifs ; cette limite est annoncée, mais reste importante pour une préparation reproductible. Les besoins métagame et Limited de Natsuki restent peu couverts ; cela ne justifie pas de transformer le produit.

### Notes indépendantes

| Axe           | Avant | Après /5 | Justification                                                                |
| ------------- | ----: | -------: | ---------------------------------------------------------------------------- |
| Accessibilité |     4 |        4 | Proposition et scores clarifiés ; documentation encore ambiguë.              |
| Pertinence    |     3 |        3 | Utile au mana, couverture inchangée des besoins compétitifs globaux.         |
| Profondeur    |     3 |        4 | Exemple exact vérifiable et hypothèses inspectables dans les données.        |
| Utilisabilité |     4 |        4 | Parcours mieux documentés, sans nouvelle navigation personnelle complète.    |
| Confiance     |     2 |        3 | Contrats et preuves améliorés ; deux contradictions directement reproduites. |
| Partage       |     3 |        4 | JSON/CSV réellement inspectés et contextualisés, adaptés à une team.         |

**Total : 22/30 ; moyenne 3,67/5, soit 14,67/20. Delta : +0,50/5 (+2/20)** par rapport à 19/6. Ce gain exprime un jugement sur le candidat corrigé, pas une mesure statistique ni une amélioration publiée.

### Verdict et suites

Je partagerais un JSON annoté dans le Notion de ma team pour vérifier une hypothèse de mana. Je ne présenterais toujours pas un indice comme win rate. Priorités restantes : séparer les modèles dans Mathematics, enlever les absolus de My Analyses, documenter le schéma et tester une modification de manabase réaliste à paramètres fixés.

Preuves complémentaires : [QA final](../engineering/persona-validation-mfydqnp5/qa/REPORT.md), [revue exports](../engineering/persona-validation-mfydqnp5/export-review/REVIEW.md). Les captures 360/390/768/1440 clair/sombre et le roundtrip réel proviennent de QA, pas d’une manipulation personnelle. Aucun nouveau test automatisé, appareil physique, oracle exhaustif, entretien ou contrôle production réalisé dans ce sous-audit.

---

## David — L’Architecte : réaudit du candidat, 3,50/5

10 septembre 2026. Persona 5 du canon `docs/personas/mtg-player-personas.md`, expert Modern/Legacy, utilisateur de notebooks et auteur technique. **Candidat local dist-06 sur http://127.0.0.1:4186, pas production.** Le lead rapporte la conformité du manifest à HEAD `2517316` ; je n’ai pas refait ce contrôle. Référence : audit David du 9 septembre, 4/3/3/3/2/3 = 3,00/5.

### Portée et parcours réellement accompli

Mon contexte CUA ne dispose d’aucun navigateur : création d’onglet refusée, inventaire `browsers:[]`, puis nouvelle tentative avec l’URL locale également refusée. **Je n’ai donc pas exécuté personnellement de clics sur ce candidat.** Cela limite la solidité de la note d’utilisabilité ; ce n’est pas un défaut du site.

Travail exécuté : lecture de `persona-validation-mfydqnp5/FINAL.md`, puis récupération HTTP des pages locales `/`, `/mathematics`, `/privacy` et `/library`, avec extraction du texte HTML. Lecture directe des fichiers JSON et CSV déjà téléchargés lors de la validation dist-06, ainsi que du rapport de revue des exports. Cette extraction confirme le contenu prérendu servi, pas son apparence après hydratation ni l’interaction clavier.

Preuve actuelle partagée : le lead a joué le parcours **accueil → exemple exact → Analyze**, constaté Savannah Lions à **98 %**, Health à **99**, puis ouvert l’explication des trois scores. Les captures mobiles et les 799 tests cités dans FINAL.md appartiennent à la validation précédente ; je ne les présente pas comme des vérifications rejouées aujourd’hui. Aucun stockage partagé n’a été modifié par moi.

### Première impression simulée

« Je peux enfin distinguer la promesse du calcul, et conserver les hypothèses avec les données. Le petit exemple exact donne une entrée vérifiable dans le moteur. En revanche, pour citer le site dans un article, j’ai toujours besoin d’une documentation mathématique qui décrit sans ambiguïté le mode affiché. »

Cette réaction est une interprétation de persona fondée sur les preuves ci-dessus, pas le verbatim d’un participant réel.

### Progrès utiles à David

**Le score ne se fait plus passer pour une fréquence de sorts lancés.** L’accueil servi précise que 87 % illustre un score d’accès aux couleurs au tour deux, sans représenter la proportion de sorts joués sur courbe ni une consigne de keep. L’aide observée par le lead sépare Health, Blueprint et Mulligan. C’est une amélioration directe de mon interprétation des nombres, sans attendre une correction artificielle des formules.

**L’exemple exact débloque la démonstration.** Le bouton distinct est présent dans le HTML ; le lead obtient réellement 98 %. La fixture 24 Plains/36 Savannah Lions est un exercice synthétique, pas un deck de tournoi légal. Elle permet d’illustrer un cas simple sans prétendre couvrir les interactions complexes qui faisaient refuser les quatorze lignes de l’exemple précédent. Je n’ai pas recalculé l’oracle ici.

**Les exports gagnent un contexte exploitable.** Le JSON existant contient `engineVersion`, les définitions des trois scores et `assumptions`, avec modèle `physical-v1`, PLAY, absence de mulligans/ramp, X=2 et exclusion de la pioche du sort cible. Il précise que le snapshot sauvegardé ne correspond pas aux réglages interactifs de Castability. Le CSV consulté conserve nom, quantités et indicateurs sideboard/commandant ; ses commentaires rappellent également la portée du partage. Ce sont des informations effectivement lues dans les fichiers, pas simplement annoncées dans un changelog.

**La confidentialité devient défendable sur le plan descriptif.** La page locale détaille Scryfall, images, polices, métadonnées de connexion, caches et durées, partage, effacement best effort et monitoring désactivé. L’accueil renvoie à cette réalité. Je ne déduis aucune conformité juridique de cette amélioration.

### Frictions restantes

**P0 : aucun démontré.** Ni la restriction d’un modèle exact, ni un indice heuristique correctement nommé ne constituent en soi une erreur mathématique.

**P1 — Documentation mathématique encore ambiguë.** Le HTML `/mathematics` commence toujours par un bandeau affirmant que les lignes Castability utilisent le modèle goldfish physique, tandis que le corps décrit Realistic/Perfect drops, approximations de séquençage et bonus ramp. L’utilisateur doit reconstruire la correspondance avec les deux modes actuels. La formule « every game, not just sometimes » reste également trop absolue pour un problème probabiliste. La clarification du Monte Carlo en mains échantillonnées est réelle, mais elle ne résout pas cette ambiguïté générale.

**P1 — Reproductibilité partielle.** Les exports sont mieux définis, mais décrivent un snapshot lands-only fixe. Un lien deck/name/tab ne reproduit pas les réglages interactifs, limitation désormais explicitée. Je peux exploiter ces données à condition de respecter ce contrat ; je ne peux pas traiter le partage comme un protocole complet d’expérience. Aucun schéma public versionné ni notebook de référence n’a été établi par ce réaudit.

**P2 — CSV à documenter pour Pandas.** Le fichier comporte des commentaires puis une table deck à dix colonnes et une table summary à trois colonnes. C’est exploitable, mais demande une lecture par sections pour un traitement propre ; le label Sheets/Pandas ne remplace pas une recette d’import. Aucun échec d’import n’est affirmé.

**P2 — Résidus éditoriaux.** Les 65 références sont désormais cohérentes entre accueil et Library. « Five short » demeure à côté de sept lectures ; quelques slogans « optimal » persistent. L’incohérence de quantité touche peu mon travail, mais rappelle que les résumés éditoriaux méritent encore une vérification avant citation.

### Notes avant/après

| Axe           |  9 sept. | Candidat | Justification du changement ou maintien                                                                  |
| ------------- | -------: | -------: | -------------------------------------------------------------------------------------------------------- |
| Accessibilité |        4 |        4 | Positionnement lisible et second exemple explicite ; pas de motif pour une note maximale.                |
| Pertinence    |        3 |        4 | Démonstration exacte exploitable et exports contextualisés répondent mieux au travail de recherche.      |
| Profondeur    |        3 |        3 | Hypothèses plus riches, mais méthode publique ambiguë et absence de protocole complet établi.            |
| Utilisabilité |        3 |        3 | Parcours du lead positif ; aucune nouvelle interaction personnelle permettant une hausse indépendante.   |
| Confiance     |        2 |        3 | Score et confidentialité clarifiés ; documentation mathématique empêche encore une confiance forte.      |
| Partage       |        3 |        4 | Les fichiers portent désormais définitions et limites ; citation conditionnelle possible après contrôle. |
| **Moyenne**   | **3,00** | **3,50** | **21/6, delta +0,50/5. Notes provisoires sous les limites indiquées.**                                   |

### Verdict et priorités

Je testerais ce candidat dans mon travail exploratoire et partagerais des références ou exports contextualisés avec ma team. Je n’en ferais pas encore une référence générale d’exactitude pour tout deck. Cette amélioration concerne le candidat local et ne change pas le verdict sur la production non revue.

1. Réécrire Mathematics autour des deux modes actuels, avec événement, hypothèses et exemple distinct pour chacun.
2. Publier un schéma JSON/CSV et une recette Python minimale séparant deck et summary.
3. Fournir une fiche de reproduction indiquant les paramètres transportés ou exclus, sans confondre snapshot et calcul interactif.
4. Retirer les garanties probabilistes absolues résiduelles et terminer l’alignement des compteurs éditoriaux.

---

## Thibault — réaudit du candidat corrigé

10 septembre 2026 · Candidat local `dist-06`, http://127.0.0.1:4186 · Persona Commander exclusive.

### Cadre et première impression simulée

« Je comprends enfin ce qui est une estimation et ce qui manque au modèle. Je peux montrer le résultat au pod en expliquant ses limites. Je veux encore savoir quelle modification de ma manabase mérite mon budget. »

Cette réaction incarne Thibault ; ce n'est pas un entretien réel. **Le navigateur CUA est indisponible pendant cette reprise. Aucun nouveau parcours cliqué n'est revendiqué.** J'ai consulté les réponses HTTP locales de Guide et Privacy, lu `FINAL.md` et les preuves QA attachées à dist-06, inspecté la capture Blueprint Atraxa, le JSON exporté et la capture du vrai worker multijoueur. Les interactions déjà exécutées par QA et les observations transmises par le lead sont attribuées comme telles. L'évaluation porte sur le candidat local, sans conclusion sur la production.

### Parcours et faits vérifiés

**Atraxa et les populations.** La campagne QA du candidat confirme l'exemple 99+1, quatre couleurs et priorité T4–T8. L'export consulté contient 99 cartes principales, 43 terrains, 56 non-terrains, et des zones distinctes dans les exports de la campagne. Son nom est conservé : « Public Atraxa zone validation ». Un sideboard public supplémentaire sert au test d'export ; ce n'est pas une nouvelle variante de deck recommandée. Le défaut six couleurs était déjà résolu le 9 septembre : aucun point supplémentaire pour cette correction ancienne.

**Estimation et Analysis.** L'exemple reste utilisable en estimation d'après les preuves et le lead. En revanche, le JSON conserve `consistencyUnavailable: true`, une stabilité nulle et les motifs Command Tower dans `unsupportedSpellAnalysis`. Le candidat ne prétend donc pas avoir étendu magiquement le moteur exact à cette manabase. La distinction « aucun calcul » versus « zéro risque » est corrigée selon la campagne ; c'est une amélioration de compréhension, pas de profondeur mathématique. Le succès exact à 98 % du deck de terrains de base rapporté par le lead ne prouve pas une prise en charge exacte d'Atraxa.

**Mulligan du pod.** Le vrai worker 3 000 échantillons a été exécuté par QA sur dist-06. La capture inspectée distingue le premier redraw gratuit, qui conserve sept cartes, du seuil suivant. L'aide explique sept cartes puis bottoming pour les mulligans comptés. Le journal QA confirme les descriptions après gratuit puis un/deux payants et le retour duel. La capture présente un deck Aggro : je ne transforme pas son seuil 65 en résultat Atraxa. Cette preuve résout néanmoins la contradiction générale de l'aide constatée par Thibault. Les plans sans ramp restent une limitation annoncée.

**Guide et confidentialité.** Le HTML local expose désormais une détection exclusivement par `*CMDR*` ou section Commander. Les listes non marquées n'ont pas de commandant inféré. Les partenaires sont séparés et les limites sur taxe du commandant, ramp et terrains conditionnels sont explicites. La mise à l'échelle Karsten N/60 reste qualifiée d'approximation. Privacy explique concrètement les requêtes Scryfall, les services externes, les caches, l'effacement et les liens partagés ; l'affirmation générale « decklists never leave » n'y figure plus.

**Bibliothèque et partage.** Le parcours Commander Pod était utile au premier audit ; aucune nouvelle richesse éditoriale n'est prouvée, donc pas de bonus de contenu. Le lead/Sarah signale encore « Five » face à sept lectures dans le parcours FNM, voisin du parcours Commander. Pour le partage, QA documente cette fois une véritable copie `#d=`, ouverture dans un contexte neuf puis rechargement. Nom, deck et onglet sont transportés ; paramètres de modèle non transportés sont annoncés. La capture Blueprint et le JSON montrent les définitions des indices et les hypothèses du snapshot, distinctes des réglages interactifs.

### Notes avant/après

| Axe           |    Avant | Candidat | Justification                                                                                                       |
| ------------- | -------: | -------: | ------------------------------------------------------------------------------------------------------------------- |
| Accessibilité |        4 |        4 | EDH déjà identifiable ; la clarification renforce cette bonne base sans démontrer un saut supplémentaire.           |
| Pertinence    |        4 |        4 | Commander, ramp et multijoueur répondent aux besoins centraux ; les arbitrages budgétaires restent manuels.         |
| Profondeur    |        3 |        3 | Modèles mieux expliqués, mais paiement exact conditionnel et plans avec ramp toujours limités.                      |
| Utilisabilité |        3 |        4 | Aide multijoueur cohérente, zones et absences de calcul mieux expliquées ; progression appuyée sur preuves QA.      |
| Confiance     |        2 |        3 | Guide/Privacy et indices nettement améliorés ; promesses résiduelles empêchent une confiance pleinement stabilisée. |
| Partage       |        3 |        4 | Restitution réelle désormais prouvée, exports contextualisés ; le lien ne transporte pas tous les réglages.         |
| **Moyenne**   | **3,17** | **3,67** | **19/6 → 22/6 ; delta exact +0,50/5.**                                                                              |

### Frictions restantes et verdict

**P1 : cohérence des promesses.** Sarah a observé « Nothing sent to servers » dans My Analyses ; ce résidu contredit la nouvelle politique. Le HTML Guide contient aussi encore des FAQ parlant de « single-draw probability » et d'une main spécifique. Les passages principaux sont corrigés, pas l'ensemble du discours. Le JSON-LD global conserve une promesse d'exactitude générale : problème éditorial supplémentaire, sans le confondre avec un texte nécessairement lu par Thibault.

**P2 : valeur de décision.** Quatre couleurs déficitaires et des recommandations générales n'indiquent toujours pas quel swap améliorerait le plus mon commandant. Le Blueprint conserve un badge « 99 cards » : compréhensible comme principal, mais un rappel 99+1 rendrait la capture autonome pour le pod.

Je reviendrais pour comparer mes sources et partager une estimation contextualisée. Je recommanderais un essai au pod, pas une validation automatique de nos keeps. Aucun P0 nouveau démontré.

Priorités : harmoniser les dernières promesses ; ajouter 99+1 aux artefacts Commander ; rendre la couverture ramp explicite carte par carte ; guider une comparaison avant/après d'un swap. La revue juridique, les appareils physiques et les entretiens joueurs restent hors preuve. Les résultats positifs de QA sont locaux ; aucun gain de conversion, compréhension réelle ou adoption n'est mesuré.

Sources : [bilan candidat](../engineering/persona-validation-mfydqnp5/FINAL.md), [campagne QA](../engineering/persona-validation-mfydqnp5/qa/REPORT.md), [audit initial](persona-audit-2026-09-09/thibault.md). Les captures inspectées se trouvent dans `qa/candidate-06/` (Atraxa Blueprint) et `qa/candidate-06-multiplayer2/` (multijoueur 3k).

---
