# ManaTuner — audit noté par six personas

**9 septembre 2026 · Production : https://www.manatuner.app/ · Engine v2.7.9 observé.**

Un agent distinct a incarné chacun des six profils de [la référence canonique](../personas/mtg-player-personas.md), après briefing par l’agent-organizer local, en remplacement du context-manager absent. Les six incarnations utilisent le rôle local product-manager. Ce sont des jugements experts simulés, pas six entretiens utilisateurs ni une mesure de satisfaction réelle.

## Méthode et portée

- Six critères de1 à5 : accessibilité du propos, pertinence, profondeur, utilisabilité, confiance, partage. Moyenne simple des six critères pour chaque persona, puis moyenne des six personas. 1 = très insuffisant ; 3 = utile avec frictions importantes ; 5 = excellente adéquation sur le périmètre observé. L’accessibilité du propos ne vaut pas audit WCAG.
- Navigation réelle sur le site public, exemples publics uniquement. Les agents ont chacun un parcours et un rapport attribués. Le stockage navigateur est commun : ces parcours ne simulent pas six nouveaux comptes ou six contextes vierges indépendants.
- Les notes portent sur les attentes du profil. L’absence de statistiques de métagame peut réduire l’adéquation à Natsuki sans constituer un défaut à développer dans un analyseur de mana.
- Preuves : observations CUA décrites dans chaque section et [journal du coordinateur](persona-audit-2026-09-09/preuves-lead.md). Les rapports individuels restent conservés dans le même dossier.
- Base locale relevée `2ba772af1f308ea93c68ffea53b0ccef0e49c57d`. Le label Engine ne prouve pas le SHA publié. Des textes publics divergent des corrections S002, tandis que l’Analyzer expose des améliorations récentes ; la cause de cette coexistence n’est pas établie.
- Les chiffres historiques de S002 et des sessions précédentes ne sont pas des tests rejoués ici. Aucun code produit modifié, aucune publication, aucun message envoyé à un tiers.

**Limites :** le viewport mobile demandé390×844 n’a pas été appliqué (1280×720 mesuré) ; mobile, tactile, mode sombre et lecteur écran restent non validés. Le toast Share est observé mais le presse-papiers accessible est vide : contenu copié et réouverture non acquis. Les menus d’export sont inspectés, pas la conformité des fichiers téléchargés. Aucun oracle mathématique, audit juridique, mesure de performance terrain ou campagne sécurité n’a été exécuté. « Complet » désigne ici les six profils et les principaux parcours couverts collectivement, pas une certification exhaustive.

## Notes et appréciation générale

**Note moyenne : 3,22/5, soit 12,89/20.** La confiance est le critère le plus faible (2,33/5).

| Persona  | Accessibilité | Pertinence | Profondeur | Utilisabilité | Confiance | Partage | Moyenne /5 |   /20 |
| -------- | ------------: | ---------: | ---------: | ------------: | --------: | ------: | ---------: | ----: |
| Léo      |             3 |          4 |          3 |             3 |         2 |       3 |   **3,00** | 12,00 |
| Sarah    |             4 |          3 |          4 |             3 |         3 |       4 |   **3,50** | 14,00 |
| Karim    |             4 |          4 |          4 |             3 |         3 |       3 |   **3,50** | 14,00 |
| Natsuki  |             4 |          3 |          3 |             4 |         2 |       3 |   **3,17** | 12,67 |
| David    |             4 |          3 |          3 |             3 |         2 |       3 |   **3,00** | 12,00 |
| Thibault |             4 |          4 |          3 |             3 |         2 |       3 |   **3,17** | 12,67 |

### Comparaison avec le rapport du 1er août

| Persona  | Août /5 | Aujourd’hui /5 | Écart descriptif |
| -------- | ------: | -------------: | ---------------: |
| Léo      |    3,67 |           3,00 |            -0,67 |
| Sarah    |    4,50 |           3,50 |            -1,00 |
| Karim    |    4,17 |           3,50 |            -0,67 |
| Natsuki  |    3,33 |           3,17 |            -0,16 |
| David    |    4,17 |           3,00 |            -1,17 |
| Thibault |    4,05 |           3,17 |            -0,88 |

La baseline publiée annonce **4,00/5**, mais la moyenne de ses six notes affichées est **3,98/5**. L’écart global est donc **−0,78** contre le chiffre publié, ou **−0,76** contre la moyenne recalculée. Les écarts individuels utilisent les notes affichées à deux décimales. Ce changement de jugement, dans des conditions et une couverture différentes, **ne démontre pas une régression logicielle ou une baisse réelle de satisfaction**.

## Diagnostic transversal

**Le parcours d’analyse apporte une valeur réelle ; la cohérence de l’explication est le principal frein à la recommandation.** Le site permet d’essayer sans compte, expose ses hypothèses et refuse certains calculs non supportés. Mais les promesses d’exactitude, de confidentialité et de mulligan changent entre accueil, documentation, résultats et export. Les joueurs compétents peuvent reconstruire ces nuances ; les débutants risquent de repartir avec une interprétation erronée.

### Les cinq frictions prioritaires

| Rang | Constat                                                                                 | Impact                                                                                                     | Profils concernés                      |
| ---- | --------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- | -------------------------------------- |
| 1    | Exactitude, score et confidentialité décrits différemment selon les pages               | Confiance et compréhension de ce qui peut être affirmé                                                     | 6/6                                    |
| 2    | Exemples donnant des estimations mais des vues exactes/comparatives indisponibles       | Première démonstration et comparaison de builds incomplètes ; indisponibilité préférable à un faux chiffre | Sarah, Karim, Natsuki, David, Thibault |
| 3    | Health91, Blueprint92 et Mulligan54 sur le midrange, avec sens distincts peu reliés     | Confusion sur la décision à prendre et sur la capture partagée ; aucune erreur numérique démontrée         | 6/6, surtout Léo et Sarah              |
| 4    | Aide mulligan simplifiée, règles Commander et textes de ramp insuffisamment harmonisés  | Difficulté à appliquer le conseil à une vraie main ou à une partie multijoueur                             | Léo, Natsuki, David, Thibault          |
| 5    | Éditorial visiblement disparate : compteurs54/65, note FNM, généralisation du glossaire | Petites contradictions qui affaiblissent la crédibilité de tout le site                                    | 6/6 selon les parcours                 |

Le deuxième constat couvre des situations différentes : comparaison sans motif visible pour Sarah/Karim, calcul exact refusé avec motif explicite pour Natsuki/Thibault. Il ne faut pas les fusionner en une panne unique sans investigation.

### Cinq acquis à préserver

1. **Exemple accessible sans inscription**, calcul effectif et sauvegarde locale des essais.
2. **Transparence dans Analyzer** : heuristiques, exclusions et limites affichées ; absence de probabilité inventée hors couverture.
3. **Commander reconnu** : zone de commandement, quatre couleurs d’Atraxa, horizon T4–T8 et option multijoueur.
4. **Bibliothèque utile et organisée par niveau**, références identifiables, états live/archived/lost visibles.
5. **Partage et formats structurés proposés**, avec avertissement que le lien contient le deck ; CSV existe désormais dans le menu observé.

### Vérification des quatre correctifs historiques d’août

| Sujet                          | État constaté aujourd’hui                             | Portée de la preuve                                                                               |
| ------------------------------ | ----------------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| Joyride bloquant               | Non reproduit sur les parcours d’exemple réussis      | Pas de contexte navigateur vierge isolé ni test mobile ; correction globale non certifiée         |
| Atraxa annoncée à six couleurs | Résolu sur l’exemple testé : quatre couleurs          | Constat Thibault, sans prétendre couvrir tous les decks EDH                                       |
| Légende Perfect/Realistic      | Améliorée dans Castability, partielle entre les pages | Mode estimations clairement nommé ; guide et Mathematics conservent des formulations différentes  |
| Toast Share Discord            | Résolu pour l’affichage du toast                      | Presse-papiers et réouverture non vérifiés ; ne vaut pas validation de toute la chaîne de partage |

### Backlog actionnable

P0 = blocage critique général constaté ; aucun établi sur cette campagne. P1 = gêne forte sur un parcours ou confiance ; P2 = amélioration ciblée. Ces niveaux reflètent la gravité observée, pas une estimation de coût.

| Priorité | Action proposée                                                                      | Responsable suggéré       | Critère d’acceptation                                                                                                                                       |
| -------- | ------------------------------------------------------------------------------------ | ------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| P1       | Identifier le candidat réellement servi et harmoniser toutes les promesses publiques | Livraison + produit       | Version/SHA reliés à un artefact ; accueil, guide, mathématiques, About et Privacy cohérents avec les modèles actifs, vérifiés sur les URL publiques        |
| P1       | Expliquer les indisponibilités dans Analysis et Compare                              | Produit + frontend/moteur | Chaque indisponibilité a un motif et une action ; zéros de synthèse distingués d’une absence de calcul ; deux builds comparables sous paramètres identiques |
| P1       | Préparer un exemple compatible avec le mode exact                                    | Moteur + produit          | Exemple public produit des valeurs vérifiées dans le modèle documenté ; cartes hors couverture annoncées avant la bascule                                   |
| P1       | Réconcilier aide London, règle multijoueur et détection du commandant                | Produit + QA              | Libellés compatibles avec le mode actif ; premier mulligan gratuit expliqué ; pas d’ambiguïté entre détection implicite et marqueur explicite               |
| P1       | Rendre le résultat interprétable en une décision                                     | Produit + UX              | Un lecteur explique le sens du score, le déficit prioritaire et la prochaine action sans confondre score, probabilité et victoire                           |
| P1       | Relire les notes pédagogiques factuelles                                             | Éditorial MTG             | Note FNM contextualisée ; exemples du glossaire compatibles avec leurs descriptions ; aucune généralisation de règle erronée                                |
| P2       | Renforcer le contexte des exports                                                    | Frontend + produit        | Nom de deck conservé ; définition des indices, modèle, paramètres et version présents ; CSV/JSON ouverts et contrôlés dans un outil tiers                   |
| P2       | Synchroniser les compteurs et parcours Library                                       | Éditorial + frontend      | Accueil, Library et parcours affichent les nombres issus du même inventaire                                                                                 |
| P2       | Valider mobile et partage de bout en bout                                            | QA                        | Vrai viewport mobile confirmé, exemple et lecture praticables ; lien copié, rouvert et résultat comparé ; PNG/PDF/CSV/JSON effectivement inspectés          |

Les corrections S002 déjà documentées doivent être examinées avant de réimplémenter quoi que ce soit. Le premier travail est de comprendre ce qui est publié, ce qui reste seulement local et quels textes nécessitent encore une correction. Aucun de ces correctifs n’a été exécuté pendant l’audit.

### Verdict pour la distribution

**Le site peut soutenir des essais accompagnés et le partage de ressources, mais une recommandation large fondée sur ses promesses de précision mérite d’attendre la remise en cohérence des P1.** Cela n’impose ni refonte, ni API, ni plateforme de métagame : la priorité reste un petit parcours démontrable — un deck public, une question de mana, un résultat correctement expliqué, une comparaison lisible, un artefact partageable vérifié. La stratégie de distribution de LAUNCH.md reste pertinente comme intention historique ; aucun message promotionnel n’a été envoyé et aucun chiffre d’audience ancien n’est considéré comme actuel.

### Couverture et prochaines validations

Collectivement parcourus : accueil, analyseur et ses cinq onglets, exemple midrange, exemple Commander, paramètres estimations/exact et mulligan, historique/comparaison, bibliothèque et fiches, guide, mathématiques, confidentialité, About et glossaire. Feedback visible, formulaire non soumis. Limited et les autres exemples n’ont pas tous été exécutés. Aucune validation exhaustive des articles externes, navigateurs, réseau, performances, données invalides ou imports personnels.

Le refus d’ouvrir une URL vide issue du presse-papiers est une limite de l’outillage d’audit : il ne prouve pas un défaut du bouton Share. De même, le redimensionnement mobile non appliqué ne prouve pas un défaut responsive du site. Ces éléments doivent rester ouverts jusqu’à un essai effectif.

## Les six analyses détaillées

## Léo — Le Curieux : 3,00/5

Audit du 9 septembre 2026. Persona canon : joueur Arena casual, six mois de pratique, priorité à la compréhension, refus de créer un compte. **Simulation experte d’un persona, pas entretien avec un utilisateur réel.**

### Première impression simulée, 30 secondes

« Ça a l’air joli et c’est gratuit. Je peux essayer sans donner mon mail, cool. Mais “Rocks & Dorks”, “on curve”, tous ces pourcentages… je veux juste comprendre pourquoi je n’arrive pas à jouer mes cartes. »

### Parcours réellement réalisé

Navigation CUA sur la production, onglet dédié, écran de bureau : [accueil](https://www.manatuner.app/) → bouton “Try an example deck” → `/analyzer?sample=midrange`, puis `/analyzer` → bouton “Analyze Manabase” → résultats de Nature’s Rhythm (60 cartes, 23 terrains, Health Score 91%, Engine v2.7.9) → [Guide](https://www.manatuner.app/guide) → [Privacy](https://www.manatuner.app/privacy) → [Library](https://www.manatuner.app/library), lecture du parcours First FNM dans la page.

L’exemple préremplit le formulaire ; il faut encore lancer l’analyse. Aucun tutoriel bloquant observé. Le résultat s’affiche sans inscription. Captures visuelles de l’accueil et du formulaire examinées ; contenus suivants lus par arbre d’accessibilité. Aucun article externe ouvert, aucune simulation Mulligan ni export exécutés par cet agent. Mobile confié au lead : cette note d’utilisabilité ne certifie pas l’expérience mobile. Le décrochage supposé de Léo se situe au résultat, lorsque plusieurs paragraphes de modèle précèdent les lignes de cartes.

Documents S002, DELIVERY-CONTRACT, profil complet de Léo et protocole historique consultés. Leurs tests locaux restent des preuves historiques, non des tests de production rejoués ici.

### Points positifs

- Entrée visuellement accueillante, grand bouton d’action et exemple public : Léo n’a pas besoin de connaître un format d’import pour essayer.
- Gratuité et absence de compte très explicites : son principal veto est levé.
- Le verdict résume immédiatement le résultat ; le nombre de cartes et de terrains permet de reconnaître ce qui a été analysé.
- Library propose réellement “New to MTG?” et “Your First FNM”, avec Reid Duke et un article sur la malchance : adéquation directe à ses questions.
- Dans Analyzer, les limites des estimations sont réellement écrites, notamment exclusion du mulligan et de la probabilité de piocher le sort. Le vocabulaire est plus honnête que la promesse simplifiée de l’accueil.

### Frictions et manques

**P0 : aucun blocage fonctionnel critique observé sur le parcours testé.**

**P1 — Comprendre le résultat reste trop difficile.** “Excellent” et “2 colors short” coexistent dans le verdict. Puis arrivent hybrid access, marginal score, source overlap, K=3, Bellman et deux modes de probabilité. Léo ne sait pas quelle information doit guider sa première modification. C’est une friction cognitive, pas une preuve que le calcul est faux.

**P1 — Le guide contredit le résultat.** Le guide qualifie Castability d’exacte et le score de critère “tournament-ready”, alors qu’Analyzer parle d’estimations et de score d’accès aux couleurs. Léo risque d’apprendre une mauvaise interprétation ; il ne saura pas corriger seul cette confusion.

**P1 — Confidentialité incohérente entre les pages.** L’accueil indique que les noms de cartes vont à Scryfall, mais affiche aussi zéro donnée envoyée aux serveurs. Privacy affirme ne transmettre aucune information de deck. Ces textes ont été vus en production ; aucune conclusion sur les flux réseau réels ou la conformité juridique n’est tirée ici.

**P2 — Parcours débutant noyé dans la bibliothèque.** Le raccourci “Start Here” aide, mais les nouveautés précèdent les lectures d’initiation. La page annonce cinq lectures puis affiche sept articles ; l’accueil annonce 54 articles, Library 65. Ce bruit nuit à la sensation d’un petit parcours simple.

**P2 — Langue et identité compétitive.** Interface anglaise, nombreuses références aux pros, peu d’explications visuelles immédiatement accessibles. La friction est notée ; une traduction générale n’est pas nécessaire pour améliorer d’abord les libellés et la pédagogie.

### Notes officielles

| Axe           |       /5 | Justification                                                                                               |
| ------------- | -------: | ----------------------------------------------------------------------------------------------------------- |
| Accessibilité |        3 | CTA clair, mais vocabulaire du titre et des résultats supérieur au niveau de Léo.                           |
| Pertinence    |        4 | Mana screw, terrains, mulligans et First FNM répondent à ses besoins de progression.                        |
| Profondeur    |        3 | Contenu utile mais insuffisamment gradué ; trop de modèle avant l’explication concrète.                     |
| Utilisabilité |        3 | Exemple réussi sans compte ; deuxième clic et hiérarchie pédagogique ralentissent. Mobile non testé ici.    |
| Confiance     |        2 | Absence de compte rassurante, mais promesses de précision et de confidentialité contradictoires.            |
| Partage       |        3 | Enverrait éventuellement l’URL de Library à un ami qui l’aide ; résultat encore difficile à expliquer seul. |
| **Moyenne**   | **3,00** | **18/6 ; baseline historique 3,67 : écart −0,67.**                                                          |

L’écart exprime cette nouvelle évaluation, pas une dégradation mesurée auprès des mêmes personnes.

### Verdict et recommandations

**Retour plausible pour First FNM, retour autonome moins probable pour Analyzer.** Partage simulé : copier l’URL de Library dans un DM Discord à un ami, avec « tu peux m’expliquer lequel lire ? ». Aucun message envoyé ni partage réel prétendu. Léo copie naturellement l’adresse ; ici l’adresse Analyzer observée n’inclut pas la liste, donc ce geste ne transporte pas son résultat.

1. **P1 :** harmoniser accueil, guide et confidentialité avec les limites affichées dans Analyzer ; vérifier le rendu publié de chaque page.
2. **P1 :** placer juste sous le score une explication simple du signal prioritaire : quelles couleurs manquent, pourquoi, et où regarder ensuite, sans conseil de victoire ni probabilité inventée.
3. **P1 :** transformer l’exemple en mini-parcours pédagogique : lire un résultat, comprendre une limite, comparer une modification.
4. **P2 :** rendre First FNM immédiatement accessible et accorder tous ses compteurs ; montrer la première lecture avant les nouveautés.
5. **P2 :** expliquer près du résultat que l’adresse courante ne contient pas le deck et que “Share” fabrique le lien complet ; garder cette aide discrète et sans obligation de compte.

---

## Sarah — La Régulière : 3,50/5

Audit du 9 septembre 2026, production https://www.manatuner.app, navigateur Codex intégré, onglet propre. **Engine v2.7.9 observé**. Incarnation simulée du profil canonique, pas entretien avec une utilisatrice. Les preuves historiques S002 et le contrat de livraison ont été lus ; leurs tests locaux ne prouvent pas la publication. Aucun code corrigé, aucune donnée privée saisie, aucun message envoyé.

### Première impression simulée, 30 secondes

« Ça peut m'aider à décider si je garde 23 terrains avant vendredi. Le parcours RCQ me parle ; j'aimerais surtout comparer mes deux builds. Mais si le deck est “Excellent” alors que les deux couleurs manquent de sources, quelle décision je prends ? »

### Parcours réellement visité

1. Accueil `/` : promesse, formats, exemple, bibliothèque et confidentialité affichée.
2. Bouton Try an example deck → `/analyzer?sample=midrange` → Analyze Manabase → `/analyzer`. Exemple public Nature's Rhythm : 60 cartes, 23 terrains, résultat 91/100, Engine v2.7.9. Lecture Castability puis Blueprint, capture visuelle 1280×720.
3. Share : toast réellement observé « Share link copied — paste in Discord (link includes your deck) ». Aucun envoi et pas de test du lien réouvert.
4. `/my-analyses` : exemple enregistré ; Compare → deux entrées publiques Nature's Rhythm du jour → modal comparative. Historique partagé avec d'autres essais ; aucune entrée ancienne supprimée et aucun problème ancien attribué à ce test.
5. `/library` : parcours RCQ et Limited, catégories, dates, états live/archived/lost ; ouverture de `/library/reid-duke-level-one-sideboarding`.
6. `/privacy` : lecture des promesses visibles.

Limites : pas de test mobile effectif, lecteur écran, contraste mesuré, export téléchargé, restauration après fermeture, ni visite Learn/About et contenus externes. Analyse et Mulligan non parcourus dans cette session Sarah. Cela borne l'exhaustivité du score.

### Points positifs constatés

- Aucun compte requis ; l'exemple fournit immédiatement une vraie base d'analyse, puis se retrouve dans l'historique.
- Castability distingue les estimations, terrains seuls et terrains parfaits ; les limites sur mulligan, pioche du sort et séquençage sont écrites. C'est utile pour corriger mes attentes.
- Le parcours RCQ compte dix articles, avec Reid Duke, Karsten, préparation, sideboard et décisions. Les dates, langues et états des ressources sont visibles. Les fondamentaux anciens restent pertinents pour progresser entre deux FNM.
- Le Blueprint présente listes, matrice par couleur, ratios et mains d'ouverture dans une mise en page partageable. Le toast Discord annonce clairement que le lien contient le deck.
- Les métriques globales A/B et leurs deltas sont effectivement accessibles dans Compare.

### Frictions et manques

**P1 — Promesses contradictoires, constat live.** L'accueil parle de sorts lancés sur la courbe et de probabilités exactes, alors que l'analyse dit explicitement estimation heuristique. L'accueil admet les noms de cartes envoyés à Scryfall mais affiche aussi zéro donnée envoyée. Privacy affirme ne transmettre aucune information de deck et que les decklists ne quittent jamais l'appareil, sans précision visible sur Scryfall ou le partage. Cette incohérence suffit à réduire ma confiance ; aucun audit réseau ou verdict juridique n'en est déduit.

**P1 — Comparaison peu utile pour mon ajustement, constat live.** Les deux exemples du jour montrent quatorze sorts communs avec « Unavailable » des deux côtés. Les chiffres globaux fonctionnent, mais je ne peux pas comparer les sorts ici. Cause et compatibilité des paramètres non établies : ce n'est pas une preuve de régression du moteur.

**P1 — Conseil éditorial éloigné de ma pratique.** La fiche Sideboarding affirme « FNM doesn't really use sideboards. RCQ does. » Sarah joue justement avec un sideboard au FNM selon son profil. Cette généralisation invalide son expérience et fragilise la crédibilité du parcours.

**P2 — Décision difficile.** Verdict 91/100 Excellent malgré deux couleurs sous les objectifs ; Blueprint annonce un autre indice heuristique à 92. Les deux métriques peuvent être légitimes, mais leur différence n'aide pas à choisir une modification. Le Blueprint perd aussi le nom visible de l'exemple au profit de « Deck 09/09/2026 ».

**P2 — Couverture partielle de mes besoins, inférence persona.** Aucun résultat de tournoi récent, matchup spécifique, suivi de mes victoires ni tier list du set rencontré. La curation apporte des méthodes, pas ma préparation Standard hebdomadaire. Cela ne justifie pas de transformer ManaTuner en portail de métagame. L'exemple détecte Constructed mais choisit Modern/Pioneer ; Sarah doit repérer et adapter le format.

### Notes

| Axe           |       /5 | Justification                                                                                              |
| ------------- | -------: | ---------------------------------------------------------------------------------------------------------- |
| Accessibilité |        4 | Promesse comprise, exemple sans compte ; décisions demandant plusieurs notions.                            |
| Pertinence    |        3 | Mana et parcours RCQ utiles ; besoins Standard/matchups et suivi de résultats partiellement couverts.      |
| Profondeur    |        4 | Estimations documentées, sources, lectures et données par sort ; comparaison indisponible.                 |
| Utilisabilité |        3 | Parcours principal réussi ; comparaison ne répond pas au besoin, informations longues, mobile non vérifié. |
| Confiance     |        3 | Transparence dans l'analyse et source ouverte, mais claims contradictoires et note FNM maladroite.         |
| Partage       |        4 | Blueprint et toast Discord adaptés ; lien réouvert et exports non validés ici.                             |
| **Moyenne**   | **3,50** | **21/6**                                                                                                   |

Baseline documentaire août : 4,50 ; **delta −1,00**, jugement renouvelé avec constats supplémentaires, pas mesure causale d'une régression.

### Verdict et recommandations

« Je reviens pour contrôler ma mana et lire avant un RCQ. Je peux partager une capture à ma team FNM, en précisant les limites ; je garde un autre outil pour le méta et mes résultats. » Aucun P0 constaté dans ce parcours.

1. **P1** Aligner accueil et Privacy sur les limites déjà visibles dans Analyzer, puis vérifier les pages effectivement servies.
2. **P1** Expliquer pourquoi une comparaison est indisponible et proposer de recalculer les deux builds sous les mêmes paramètres.
3. **P1** Corriger la note FNM/sideboard ; contextualiser les articles historiques sans généraliser les pratiques des boutiques.
4. **P2** Rendre le verdict actionnable : une priorité de source manquante, sens des deux indices, nom du deck conservé sur le Blueprint.
5. **P2** Mesurer sur tests utilisateurs le temps jusqu'à un ajustement compris et un artefact Discord exploitable ; privilégier ces parcours avant d'élargir le produit au métagame.

---

## Karim — Le Tacticien · audit du 9 septembre 2026

**Note : 3,50/5 (21/30).** Persona simulée : grinder Pioneer/Modern, RCQ, données exportables et décisions reproductibles. Évaluation qualitative experte, aucun entretien réel. Production visitée dans un onglet CUA distinct ; Engine **v2.7.9** affiché. Stockage navigateur partagé préexistant conservé.

### Première impression simulée — 30 secondes

« Rocks et dorks inclus, Modern/Pioneer, export : ça peut me servir pour tuner avant mon prochain RCQ. Mais si vous annoncez des probabilités exactes, je veux connaître précisément l'événement mesuré et récupérer les chiffres. Le score seul ne me dit pas si mon triple vert passe. »

### Parcours réellement joué

1. [Accueil](https://www.manatuner.app/) → **Try an example deck** → exemple public Nature's Rhythm, puis **Analyze Manabase**. Résultat : 60 cartes, 23 terrains, score91, moteur2.7.9. Aucun onboarding bloquant rencontré ; ce n'est pas une preuve spécifique sur Joyride.
2. **Castability → Advanced** : mode par défaut « MANA ESTIMATES », exclusion explicite du mulligan et de la pioche du sort, taux de removal35% personnalisable. Archdruid's Charm : estimation75%, lands-only45%, perfect drops59% ; ces métriques mélangent des conditions différentes explicitement signalées. Mode exact visible, non exécuté.
3. **Manabase** : W13/16, G16/23 ; explication de la condition Karsten et traitement des alternatives hybrides. Identité3 couleurs affichée pour la présence hybride, sources physiques W/G : aucune assimilation automatique à un défaut.
4. **Blueprint → Export Blueprint → JSON** : menu offre PNG, PDF, JSON et **CSV (Sheets / Pandas)**. JSON cliqué ; contenu du fichier non récupéré/vérifié. Blueprint60/23/37, indice heuristique92, titre générique « Deck09/09/2026 » malgré le nom de la liste.
5. [My Analyses](https://www.manatuner.app/my-analyses) → Compare → deux sauvegardes publiques Nature's Rhythm du jour → comparaison : agrégats identiques,14 sorts communs, toutes leurs probabilités **Unavailable**. Aucun historique supprimé. Deux listes identiques permettent d'inspecter l'affichage, pas de valider le calcul d'un delta de modification.
6. [Mathematics](https://www.manatuner.app/mathematics), [Library](https://www.manatuner.app/library), [Privacy](https://www.manatuner.app/privacy) lus. Retour Analyzer : texte de deck conservé, résultats à relancer.

Limites : onglets Analysis et Mulligan non parcourus en profondeur ; aucune simulation nouvelle, aucun audit lecteur d'écran/mobile, aucun roundtrip de partage ni inspection du dépôt GitHub distant. Lien GitHub visible. Aucun résultat mathématique certifié par cet audit.

### Forces

- Les estimations expliquent leurs limites à proximité des pourcentages : suffisamment transparent pour un joueur qui refuse une boîte noire.
- Les déficits W3 et G7 orientent une investigation concrète malgré le score global excellent. Conditions Karsten lisibles.
- CSV/JSON proposés : alignement direct avec mon workflow Sheets/Pandas et mon groupe de testing.
- Bibliothèque riche :65 entrées affichées,46 live/13 archived/6 lost, parcours RCQ10 lectures, Pro Tour9, dates et auteurs visibles. Les ressources perdues sont identifiées.
- Sans compte, navigation et exemple fonctionnels ; textes de la liste préservés au retour.

### Frictions hiérarchisées

**P0 : aucun blocage général établi dans ce parcours.**

**P1 — Comparaison incomplète.** Les14 sorts communs deviennent Unavailable des deux côtés alors que l'Analyzer donne leurs estimations. Même si l'indisponibilité est volontaire pour éviter de comparer des modèles incompatibles, il manque une raison et une action : impossible de justifier à ma team le gain d'un changement de source depuis cette vue.

**P1 — Contrat scientifique incohérent.** Accueil : « Exact Probabilities » et exemple87% décrit comme sorts lancés sur la courbe. Analyzer : estimations de disponibilité du mana sans pioche du sort. Mathematics commence par dire que les lignes montrent désormais la castabilité physique, puis décrit encore les anciennes approximations comme modèle principal. Le périmètre réel exige une lecture contradictoire.

**P1 — Confidentialité contradictoire.** Accueil reconnaît les noms envoyés à Scryfall mais affiche aussi zéro donnée envoyée aux serveurs. Privacy dit ne transmettre aucune information de deck. Il s'agit d'une incohérence de communication constatée, pas d'une conclusion juridique ou d'une interception réseau.

**P2 — Artefact sans contexte suffisant.** Health91 et Blueprint92 portent des noms différents, donc pas de bug numérique prouvé ; leur relation n'est pas expliquée. Le titre générique nuit à l'archivage des builds.

**P2 — Crédibilité éditoriale.** Home54 articles vs Library65 ; parcours RCQ7 annoncé vs10 observé. La formule « FNM doesn't really use sideboards » choque ce compétiteur. La bibliothèque apporte de la théorie, pas les résultats hebdomadaires/matrices de matchups recherchés ; besoin persona hors périmètre, pas demande de construire un backend méta.

### Notes commentées

| Axe           |       /5 | Justification                                                                                   |
| ------------- | -------: | ----------------------------------------------------------------------------------------------- |
| Accessibilité |        4 | Positionnement compris immédiatement par Karim ; exemple accessible.                            |
| Pertinence    |        4 | Tuning des sources, formats et canon RCQ utiles ; pas de data de tournoi intégrée.              |
| Profondeur    |        4 | Hypothèses, removal, Karsten, modèle exact et exports visibles ; comparaison par sort limitée.  |
| Utilisabilité |        3 | Parcours simple mais comparatif indisponible et résultats à relancer après navigation.          |
| Confiance     |        3 | Limites détaillées appréciées, contredites par plusieurs pages publiques.                       |
| Partage       |        3 | CSV/JSON correspondent au canal compétitif ; artefact final et réouverture de lien non validés. |
| **Moyenne**   | **3,50** | **21÷6 ; baseline4,17, écart−0,67.**                                                            |

Cette baisse n'établit pas une régression logicielle : périmètre et preuves de l'ancien audit ne sont pas identiques.

### Verdict et recommandations

« Je reviens pour contrôler les sources et retrouver une lecture. Je recommande le canon à ma team Discord ; je n'envoie pas encore un Blueprint comme démonstration que mon build gagne en castabilité. »

1. Réconcilier immédiatement les formulations exact/estimation et privacy sur toutes les pages publiques.
2. Expliquer Unavailable en comparaison et proposer de recalculer les deux builds avec les mêmes hypothèses.
3. Conserver nom de build, version moteur, modèle et paramètres dans chaque artefact exporté ; documenter les deux scores.
4. Rendre CSV visible dans la présentation de Blueprint et vérifier son import dans Sheets sur un exemple public.
5. Synchroniser compteurs de bibliothèque et revoir les résumés compétitifs avant diffusion ciblée RCQ.

**Traçabilité :** profil canon et protocole lus, ainsi que suivi corrections, SESSION-VERIFIEE S002 et DELIVERY-CONTRACT. Les tests796/49 scénarios cités dans S002 restent des preuves historiques locales ; ils ne sont ni rejoués ni présentés comme validation de cette production. Aucun code modifié. Les constats ci-dessus proviennent des arbres d'accessibilité CUA observés pendant ce parcours.

---

## Natsuki — Grinder : audit du 9 septembre 2026

Évaluation simulée à partir de la persona 4 du référentiel, et non entretien avec une joueuse réelle. Parcours effectué sur https://www.manatuner.app dans un onglet dédié du navigateur intégré, à 1280 × 720. Aucun contrôle mobile revendiqué. Engine v2.7.9 constaté dans Analyzer. Les preuves historiques S002 décrivent un candidat local ; elles ne remplacent pas les constats de production ci-dessous.

### Première impression — voix simulée

« Le calcul de mana et le code public m'intéressent. Mais “Exact Probabilities” et “optimal thresholds” me font immédiatement chercher le modèle : quelle variable optimise-t-on, et quelles cartes sont réellement couvertes ? Je peux consacrer dix minutes à cet outil si les résultats ressortent dans un format exploitable par ma team. »

### Parcours constaté

1. **Accueil** : promesse mana, ramp et mulligans immédiatement identifiable ; accès GitHub, Analyzer, Library et Mathematics. Le site annonce un exemple de score 87 % interprété comme proportion de sorts lancés sur la courbe. Il affiche à la fois les noms de cartes envoyés à Scryfall et « 0 Data sent to servers ». La bibliothèque est annoncée à 54 articles.
2. **Mathematics** : lecture du bandeau goldfish et des hypothèses, puis des distinctions Karsten/castability. Bon point : les objectifs Karsten sont conditionnels, contrairement à la disponibilité sans mulligan. Friction : le bandeau nouveau, la description des anciennes approximations et « If I keep this hand » cohabitent ; il faut reconstruire le contrat actuel.
3. **Library → Pro Tour Preparation** : lien d'ancrage fonctionnel, neuf articles, lecture visuelle de trois cartes. Saito, Fortier, Dagen, Chapin et l'inventaire mathématique d'Anaël YAHI correspondent au niveau attendu. Bibliothèque réelle : 65 articles, 46 live, 13 archived et six lost. Le parcours Limited expose six ressources, dont 17Lands ; ce sont des références externes, pas un tableau interne de GIH WR.
4. **Privacy** : page courte déclarant ne transmettre aucune information personnelle ou de deck. Cette formulation est plus absolue que l'information Scryfall de l'accueil. Aucune analyse réseau exhaustive ni conclusion juridique dans cet audit.
5. **Analyzer** : l'exemple public Nature's Rhythm était prérempli dans le stockage partagé du navigateur ; clic Analyze, résultat 60 cartes/23 terrains. Je n'assimile donc pas ce parcours à une première visite sans données. Health Score 91/100, deux couleurs sous les objectifs Karsten, moteur 2.7.9.
6. **Mulligan** : Midrange sélectionné, 10 000 échantillons par taille, qualité 54/100, seuil à sept cartes 51. Le texte précise score heuristique, arrêt à quatre cartes, bottoming heuristique et plans sans ramp. L'aide explique néanmoins une nouvelle main d'une carte de moins, incohérente avec la règle London annoncée. Plusieurs plans d'exemples sont explicitement indisponibles.
7. **Castability → Exact Goldfish Potential** : le mode initial est MANA ESTIMATES, Modern/Pioneer, on the play, ramp activé, hypothèse de removal 35 %. Passer en exact retire les pourcentages de toutes les 14 lignes : restriction d'Abandoned Air Temple non supportée. Le mode précise 0 % removal, 100 % survie, information complète sur l'historique pioché : potentiel supérieur à une politique sans prescience.
8. **Blueprint → Export** : formats PNG, PDF, JSON et **CSV (Sheets / Pandas)** présents. Téléchargement et contenu CSV non vérifiés dans ce sous-audit. Le Blueprint affiche un autre indice heuristique, 92, et un nom générique daté. Le roundtrip d'un lien partagé n'est pas certifié ici.

### Points positifs

L'outil donne des hypothèses concrètes à discuter : play/draw, retrait de ramp, risque de removal, tailles d'échantillons. L'exclusion explicite des résultats non supportés est exactement ce que j'attends d'un outil sérieux : je peux identifier une limite au lieu d'emporter un faux chiffre dans ma feuille de testing.

Le modèle de mulligan indique qu'il optimise une qualité de main et non les victoires. Cette distinction évite de confondre 10 000 simulations avec 10 000 matches réels. L'accès au code et aux références mathématiques rend la discussion contradictoire possible. Les exports structurés constituent un vrai point d'entrée vers le travail d'équipe.

La bibliothèque apporte une valeur différente mais réelle : références datées, auteurs identifiables, liens d'archives, état lost annoncé, raccourci Pro Tour. Je peux recommander une lecture précise à mes coéquipiers sans leur demander d'adopter tout l'outil.

### Frictions et manques

- **P1 — Cohérence des chiffres et promesses.** Le bandeau conseille de garder presque toute main de deux à quatre terrains, alors que l'onglet Mulligan utilise un modèle heuristique distinct et plafonné. Blueprint 92, Health 91 et qualité 54 ne sont pas trois évaluations interchangeables ; leur articulation devrait être explicite dans l'artefact partagé.
- **P1 — Exemple exact inexploitable.** L'exemple mis en avant rend toutes les lignes indisponibles en exact. Le refus est correct, mais le premier essai ne démontre pas la valeur du moteur exact pour mon travail.
- **P1 — Documentation contradictoire.** L'aide de mulligan, les slogans exacts de l'accueil et les formulations mixtes de Mathematics empêchent de savoir rapidement quel résultat je peux citer. La promesse de confidentialité absolue ajoute un doute évitable.
- **P2 — Intégration limitée au parcours constaté.** CSV/JSON existent ; aucune API documentée, requête reproductible ou documentation de schéma versionnée n'a été rencontrée. Cela ne prouve pas leur inexistence dans tout le dépôt. Mon workflow reste manuel.
- **P2 — Écart de besoin.** Aucun feed MTGO, matchup matrix ou segmentation Limited n'est proposé dans les surfaces parcourues. C'est un écart avec cette persona, pas une obligation de transformer ManaTuner en plateforme de métagame.
- **P2 — Actualité éditoriale.** 54 articles annoncés contre 65 dans Library ; “What's new” ne donne pas une date d'ajout précise à chaque ressource. Le compteur fragilise inutilement la perception de maintenance.

Aucun P0 technique bloquant n'a été reproduit. Les P1 bloquent ma recommandation du calcul comme référence de préparation compétitive autonome.

### Notes

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

### Verdict et recommandations

« Je reviens pour vérifier une hypothèse de mana et récupérer une référence Pro Tour. Je partagerais une lecture ou un CSV annoté dans le Notion de ma team ; je ne présenterais pas encore le score global comme une mesure de performance du deck. »

1. Unifier accueil, Mathematics et aide London avec les contrats réellement affichés par chaque mode.
2. Ajouter un exemple compatible exact et annoncer la couverture avant de lancer ce mode.
3. Expliquer côte à côte les indices Health/Blueprint/Mulligan ; conserver les hypothèses avec chaque export.
4. Documenter un schéma CSV/JSON versionné, moteur et paramètres inclus ; tester l'import dans une feuille de calcul de team avant d'envisager une API.
5. Fiabiliser les compteurs éditoriaux et l'information Scryfall ; rendre la maintenance datée facilement vérifiable.

---

## David — L’Architecte : 3,00/5

Audit du 9 septembre 2026, persona 5 de `docs/personas/mtg-player-personas.md`. Évaluation simulée par agent, pas entretien avec un utilisateur réel. Navigation exécutée sur https://www.manatuner.app dans un onglet CUA dédié. Aucun audit numérique exhaustif ni preuve d’identité entre code local et production. Documents S002 et DELIVERY-CONTRACT lus comme contexte historique. Le navigateur expose Engine v2.7.9 ; ce libellé ne certifie pas le commit publié. Mobile non testé.

### Première impression simulée, 30 secondes

« Je vois un outil ouvert, une bibliothèque avec Karsten et des probabilités accessibles. Mais “Exact Probabilities” et un score de santé présenté comme la proportion de sorts lancés demandent une définition précise de l’événement. Avant d’intégrer ce résultat à mon notebook, je veux savoir ce qui est conditionné, approximé et exporté. »

### Parcours réellement effectué

1. **Accueil** : lecture de la promesse, du résultat d’exemple, de la référence Karsten et du lien GitHub. L’accroche explique les rocks/dorks ; la page annonce 54 articles, des probabilités exactes et zéro donnée envoyée, tout en signalant ailleurs les noms de cartes envoyés à Scryfall.
2. **Mathematics**, via le pied de page : lecture de la distinction Karsten/castabilité, puis ouverture des accordéons Hypergeometric et Bellman. Les formules et limites sont présentes. Le bandeau annonce le modèle goldfish physique, mais les sections suivantes décrivent encore Realistic/Perfect drops et des approximations de couleurs/séquençage. La frontière entre documentation actuelle et ancienne est trop coûteuse à reconstruire.
3. **Library** : lecture des compteurs (65 articles, 46 live, 13 archived, 6 lost), du parcours Pro Tour et des outils de citation. Activation du BibTeX pour Karsten 2022 : toast « BibTeX copied! » constaté ; lecture du presse-papiers vide avec cet environnement, donc contenu non validé et aucun défaut de copie affirmé.
4. **Analyzer** : analyse du deck public Nature’s Rhythm déjà présent. Résultat : 60 cartes, 23 terrains, Health Score 91/100 et deux couleurs sous les cibles Karsten. Lecture du Mulligan, puis Castability, passage de **MANA ESTIMATES** à **EXACT GOLDFISH POTENTIAL**. Les 14 lignes deviennent indisponibles pour la restriction Abandoned Air Temple, avec motif explicite. Aucun pourcentage de remplacement n’est inventé.
5. **Blueprint** : consultation de la matrice et ouverture du menu d’export : PNG, PDF, JSON et **CSV (Sheets / Pandas)**. Formats présents, contenu des fichiers non vérifié dans ce parcours.
6. **Privacy** : page directe relue après chargement ; promesses absolues sur l’absence de transmission d’informations de deck. Le lien GitHub est exposé et activé ; la destination n’a pas été inspectée, donc aucune revue du code public n’est revendiquée.

### Points positifs

- Le contrat de l’Analyzer est beaucoup plus précis que sa vitrine : absence de mulligans et de probabilité de piocher le sort cible, paiement par sources physiques distinctes, limites du modèle et refus des mécaniques non couvertes.
- Le mode exact explicite la connaissance complète de l’historique tiré, donc la borne supérieure pour un jeu sans prescience, ainsi que 0 % de removal et 100 % de survie du ramp. Cette précision me permet de comprendre ce que je pourrais citer.
- Bellman optimise explicitement un score heuristique, pas le win rate. La politique limitée à quatre cartes et le bottoming heuristique sont indiqués. Le choix 3k/10k/50k rend le coût de simulation compréhensible.
- La bibliothèque propose auteurs, années, statut de disponibilité, archives, parcours avancé et export bibliographique. L’inventaire Yahi, Chapin et les sources de théorie offrent une vraie valeur de recherche documentaire.
- CSV, JSON, fonctionnement sans compte et accès visible au code réduisent la dépendance à l’interface. Il serait incorrect de qualifier le produit de boîte noire sans export.

### Frictions et manques

**P0 : aucun défaut bloquant global démontré par David.** Une indisponibilité déclarée hors périmètre ne constitue pas une probabilité fausse. Les calculs n’ont pas été comparés ici à un oracle indépendant.

**P1 — Cohérence méthodologique.** La page Mathematics mélange l’ancien modèle et le nouveau ; l’accueil promet davantage que ce que les avertissements de l’Analyzer garantissent. David risque de citer une mauvaise définition en suivant le lien officiel « Probabilities ». L’exemple commercial de score 87 % comme proportion de sorts sur courbe est particulièrement trompeur face au score marginal d’accès aux couleurs effectivement défini dans les résultats.

**P1 — Démonstration exacte peu convaincante.** Le deck d’exemple produit 14 refus à cause d’un terrain. Le refus est sain, mais il empêche de découvrir une seule valeur exacte avec le parcours conseillé. Il manque un exemple entièrement compatible et une liste de couverture directement exploitable.

**P1 — Reproductibilité à compléter.** Aucun lien de documentation d’API ou schéma d’export n’a été rencontré dans les pages visitées. CSV existe ; sa complétude, les hypothèses conservées, la version du moteur, les paramètres et la possibilité de rejouer le calcul restent non établies. C’est une limite de vérification et de découverte, pas une preuve d’absence dans tout le dépôt.

**P1 — Contrat de confidentialité discordant.** Privacy et le compteur zéro de l’accueil contredisent l’explication Scryfall visible sur la même vitrine. Je ne peux pas défendre une promesse absolue sur la seule base du traitement local. Cette observation éditoriale ne constitue pas une qualification juridique.

**P2 — Bibliothèque à stabiliser.** Les compteurs 54/65 et le texte « Five » au-dessus de sept lectures affaiblissent le soin éditorial. Les références m’intéressent, mais leur contenu, leurs paywalls et leur disponibilité complète n’ont pas été certifiés. Le besoin de données métagame longitudinales est hors du périmètre actuel du produit ; il ne doit pas déclencher une refonte injustifiée.

### Notes officielles

| Axe           |  Note /5 | Justification                                                                                                |
| ------------- | -------: | ------------------------------------------------------------------------------------------------------------ |
| Accessibilité |        4 | Mission et chemins Analyzer/Math/Library immédiatement identifiables pour un expert anglophone.              |
| Pertinence    |        3 | Utile pour le mana et la bibliographie ; intégration au travail de recherche encore incomplète.              |
| Profondeur    |        3 | Contrats et modèles explicités, mais démonstration exacte bloquée sur l’exemple et schéma non découvert.     |
| Utilisabilité |        3 | Parcours exécutables et exports faciles à trouver ; documentation contradictoire oblige à interpréter.       |
| Confiance     |        2 | Bons avertissements au point de calcul, contrebalancés par les affirmations publiques excessives.            |
| Partage       |        3 | Je partagerais une référence de Library ; je ne publierais pas encore un résultat comme preuve scientifique. |
| **Moyenne**   | **3,00** | **18/6 ; comparaison descriptive avec 4,17 au 1er août : −1,17.**                                            |

### Verdict simulé

Je reviendrais pour les références et des vérifications exploratoires de mana. Je recommanderais la Library à un collègue de testing, avec un lien d’article ou une citation après contrôle. Je n’en ferais pas encore la source principale d’un article technique : il faut pouvoir associer chaque résultat à son contrat et à un export reproductible. La baisse par rapport à août décrit cette nouvelle évaluation du site public, sans prouver une régression précise du code.

### Recommandations propres à David

1. Unifier accueil, Mathematics et liens contextuels autour des deux modes actuels ; réserver « exact » à l’événement explicitement couvert.
2. Fournir un second exemple compatible avec le moteur exact et une couverture des mécaniques consultable avant calcul.
3. Documenter le CSV/JSON existant avec schéma versionné, paramètres, définition des champs et un petit notebook de reproduction ; mesurer un aller-retour export/relecture sans perte d’hypothèses.
4. Aligner Privacy et les résumés de confidentialité sur les transmissions effectivement documentées, puis faire vérifier la version publiée.
5. Conserver BibTeX, archives et auteurs ; dériver tous les compteurs du même inventaire et contrôler un échantillon de citations contre les sources primaires.

---

## Thibault — Le Capitaine de Table

Audit du 9 septembre 2026 · Persona 6 · Production https://www.manatuner.app · Engine v2.7.9 observé.

### Première impression simulée

« Ah, un exemple Atraxa, du 100 cartes et un horizon T4–T8 : je suis au bon endroit. Maintenant je veux savoir si mon commandant arrive avec mon ramp et mes terrains budget. Si vous me parlez de certitude mathématique, il faut que le guide et les résultats racontent la même chose. »

Cette réaction est une simulation de Thibault, 33 ans, exclusivement Commander depuis cinq ans, pod hebdomadaire et upgrades progressifs. Elle ne constitue pas un entretien utilisateur. Les observations ci-dessous proviennent d'un vrai parcours navigateur ; les préférences et intentions sont celles de la persona.

### Parcours réellement effectué

1. Ouverture directe de `/analyzer?sample=edh`. L'exemple Atraxa apparaît, avec la marque explicite `*CMDR*`. L'URL devient `/analyzer`. Clic **Analyze Manabase**, attente du résultat.
2. Résultat : **99 cartes et 43 terrains** au résumé ; **4 couleurs**. L'onglet Analysis alors sélectionné expose 56 sorts non calculables, principalement pour la restriction Command Tower. Cet état initial peut dépendre du stockage partagé entre auditeurs : il ne prouve pas l'onglet choisi dans un navigateur neuf.
3. Clic **Castability** : **Mana estimates sélectionné**, Commander/EDH détecté, 100 cartes au total et bibliothèque de 99 explicités. Atraxa est épinglée en premier avec **Command zone**, coût GWUB, estimation **75 %**, terrains seuls **67 %**, terrains parfaits **94 %**. Neuf ramp sont détectées ; les nombres sont des estimations affichées, pas des probabilités recalculées par cet audit. Le bref état intermédiaire « No ramp detected » disparaît une fois la vue stabilisée.
4. **Manabase** : 4 couleurs d'identité, cibles W18/26, U18/30, B21/26, G18/28 ; cartes classées fetch/shock/check/triome/utility/basic. Le graphique montre aussi quatre sources rouges, distinctes des quatre couleurs requises. Ce n'est pas la réapparition de l'ancien défaut « 6 couleurs ».
5. **Mulligan** : activation de Multiplayer puis **Quick (3k)**, résultat réellement obtenu. Seuil sept cartes 57, seuil après mulligan gratuit 54, exemples de mains et plans indiqués indisponibles. Case initialement décochée dans cet environnement partagé : aucun défaut d'autodétection par défaut n'est conclu.
6. **Guide: Commander**, puis **Library → Commander Pod** : ancre `/library#track-commander` fonctionnelle, cinq ressources dédiées. Enfin clic **Privacy** et lecture de la page publiée.

Aucun compte créé, aucune publication ni envoi à un pod. Ni tablette physique ni viewport mobile certifié. Le partage dispose d'une preuve commune du lead : toast de copie Discord observé, mais lecture clipboard vide et restitution du lien non validée ; ce n'est pas un échec de partage démontré.

### Points positifs

**Commander a une place réelle dans le produit.** La liste de 100 cartes est acceptée, Atraxa sort du paquet de pioche et son paiement est présenté séparément. L'ancien affichage six couleurs est résolu pour cet exemple. Le tri T4–T8 m'évite de commencer par vingt sorts qui ne déterminent pas mon tour de commandant.

**Les estimations de ramp apportent un point de discussion concret.** Voir 75 % avec ramp et 67 % terrains seuls répond partiellement à ma question de construction. Les réserves sur chevauchement des sources, séquençage, absence de mulligan et absence de probabilité de piocher le sort sont placées près des chiffres.

**Les limites ne sont pas silencieusement converties en résultats.** Tezzeret's Gambit est indisponible, le score global est suspendu et l'Analysis explique le terrain non représenté. Le guide reconnaît que N/60 est une approximation, pas une table EDH publiée. Ces garde-fous méritent d'être préservés.

**La bibliothèque donne une raison de revenir entre deux upgrades.** Karsten Commander, Brackets, Command Zone, Game Knights et EDHREC composent un parcours cohérent. Les statuts archived/live sont affichés ; les contenus externes n'ont pas été intégralement vérifiés ici.

### Frictions et manques

**P1 — Un exemple officiel met en échec une grande partie de son propre résumé.** Health Score indisponible et 56 lignes non calculables dans Analysis, alors que Castability fournit des estimations. Je peux utiliser l'outil, mais je dois comprendre seul cette séparation. Les compteurs « 0 risky » et « 0 critical » sous l'avertissement sont peu utiles : zéro calculé n'est pas un deck sans problèmes. Ce constat concerne le périmètre des modèles, pas une panne générale.

**P1 — Les explications se contredisent.** Le guide promet une probabilité exacte et assimile Health Score à une consistency %, alors que l'Analyzer parle d'heuristiques. Le bandeau et le guide mentionnent encore une détection du premier non-terrain ; le verdict dit explicitement marqué uniquement. La page Privacy affirme que les decklists ne quittent jamais l'appareil. Ces promesses publiques ne correspondent pas aux limites du produit et au contrat S002 lu ; aucune conformité juridique n'est certifiée.

**P1 — Le mulligan multijoueur fonctionne, mais son aide conserve une lecture duel.** Après activation du mulligan gratuit, l'aide décrit une nouvelle main avec une carte de moins et le tableau indique six cartes après un mulligan. Le modèle annonce honnêtement aucun ramp pour les plans, ce qui limite fortement sa pertinence pour Sol Ring/Signet. Les exemples affichent des plans indisponibles tout en parlant de mauvaise efficacité mana.

**P2 — L'upgrade path reste à ma charge.** « Plus de dual lands », coût en points de vie et quatre couleurs déficitaires n'indiquent pas quelle modification tester. Neuf ramp sont listées, mais Farseek, Nature's Lore et Three Visits sont absentes de cette liste malgré le guide les citant comme ajustant la courbe. Leur traitement doit être expliqué ; je n'en déduis pas un bug arithmétique sans audit ciblé.

Aucun P0 bloquant global démontré. Validation d'identité et partenaires non testée ; le guide dit faire confiance à la liste, donc ne pas présenter cela comme une validation complète. Les questions de politique de table restent légitimement hors périmètre.

### Notes commentées

| Axe           |       /5 | Justification                                                                                               |
| ------------- | -------: | ----------------------------------------------------------------------------------------------------------- |
| Accessibilité |        4 | Exemple Commander immédiatement utilisable, lexique familier ; bandeau dense et ambiguïté 99/100 au résumé. |
| Pertinence    |        4 | Command zone, horizon, ramp et multiplayer présents ; upgrades budgétaires sans réponse directe.            |
| Profondeur    |        3 | Estimations utiles et hypothèses lisibles, mais Analysis et plans limités sur le propre exemple EDH.        |
| Utilisabilité |        3 | Parcours terminé sans blocage ; plusieurs surfaces et explications à réconcilier, tablette non testée.      |
| Confiance     |        2 | Refus de faux calculs appréciable, mais promesses guide/privacy et aide multiplayer contradictoires.        |
| Partage       |        3 | Je partagerais la lecture Commander et une capture contextualisée ; roundtrip de l'analyse non certifié.    |
| **Moyenne**   | **3,17** | **19/6 ; moyenne simple des six axes.**                                                                     |

Baseline fournie : 4,05/5 ; écart −0,88. Il s'agit d'une appréciation plus sévère sur des parcours vérifiés et des contradictions observées, pas d'une mesure prouvant une régression logicielle.

### Verdict et recommandations

« Je reviendrais tester mes couleurs, et j'enverrais le parcours Commander au Discord de mon pod. Je ne dirais pas que cet outil décide mathématiquement de mes keeps ou de mon prochain achat. »

1. **P1 :** aligner guide, bandeau Commander et privacy sur les contrats réellement exécutés ; supprimer les promesses d'exactitude générale.
2. **P1 :** faire du parcours Atraxa une démonstration compréhensible des estimations, avec accès direct à celles-ci et compteur explicite des sorts calculés/indisponibles.
3. **P1 :** adapter aide et seuils affichés au mulligan gratuit ; distinguer score de main et plan non disponible sans diagnostiquer une inefficacité non simulée.
4. **P2 :** rendre le résumé « 100 cartes = 99 bibliothèque + 1 commandant » explicite et afficher la couverture ramp carte par carte.
5. **P2 :** proposer une comparaison avant/après d'une modification et un artefact pod compact contenant commandant, hypothèses, horizon et limites. Mesurer le succès par complétion du parcours EDH, compréhension du 99+1 et restitution du partage, sans collecte de decklists.

---
