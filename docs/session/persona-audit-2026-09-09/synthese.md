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
