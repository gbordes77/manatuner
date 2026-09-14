# Six avis avant implémentation — 14 septembre 2026

Évaluation documentaire simulée par un agent product-manager des six profils canoniques. Aucun joueur réel, entretien, clic navigateur, succès fonctionnel ou score de désirabilité n'est revendiqué. Les avis portent sur le périmètre ci-dessous ; les réserves techniques doivent être vérifiées par les agents d'implémentation et QA. B05 nécessite encore la revue du prototype réellement fourni. Chaque ligne est un avis distinct, pas un vote global. Les profils historiques orientent les besoins, jamais les règles MTG actuelles ni une estimation de marché.

Sources : AGENTS.md, mission active, backlog B01–B16, EVOLUTION-COMPARE, profils canoniques, audit 02/04/05/06/07, synthèse atelier et ses six rapports, validation-compare et ses six avis. Couverture technique : matrice et cahiers de l'audit ; leurs résultats historiques ne sont pas des exécutions de cette mission.

## B01 — référence Guide/Mathematics sous hypothèses explicites

Proposition examinée : conserver une référence vérifiable décrivant événement, population, play/draw, mulligan, conditionnement et seuil ; distinguer les nombres si les événements diffèrent. Aucun remplacement arbitraire.

| Persona  | Entrée → besoin → sortie                                        | Avis, utilité et friction/contresens                                                            | Adaptation et alternative minimale                                                                              |
| -------- | --------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| Léo      | Accueil → Guide → exemple Analyzer pour comprendre ses couleurs | Modifier : la cohérence rassure, mais une règle de sources peut devenir une recette universelle | Une phrase concrète explique ce qui est compté et exclu ; minimum : exemple borné avec lien détails             |
| Sarah    | Guide → liste Standard → essai FNM                              | Accepter sous réserve : repère utile, pas preuve qu'un terrain remplace avantageusement un sort | Rappeler le compromis de slots ; minimum : qualifier le repère existant                                         |
| Karim    | Mathematics → référence → comparaison                           | Modifier : il doit vérifier la même question, pas deux seuils portant le même nom               | Afficher conditionnement et population avec la valeur ; minimum : note précise source unique                    |
| Natsuki  | Accès direct Mathematics → testing                              | Accepter : correction sans détour ; risque de retarder l'accès aux données                      | Garder détails consultables directement ; minimum : corriger seulement les occurrences concernées               |
| David    | Référence → formule → vérification indépendante                 | Modifier : valeur harmonisée seule insuffisante si méthode inconnue                             | Justifier événement et oracle ; minimum : expliciter que le tableau est un repère distinct du calcul affiché    |
| Thibault | Guide → Commander → population 99+1                             | Modifier : rejeter transposition 60 cartes à Commander                                          | Marquer Constructed lorsque concerné et zones Commander ; minimum : avertissement adjacent de non-transposition |

## B03 — promesses, mulligan, JSON-LD et métadonnées

Proposition : anglais cohérent, estimations par défaut, mode exact borné, seuils keep/mull qualifiés d'heuristiques selon politique ; aucune victoire, optimalité universelle ou exclusivité non démontrée.

| Persona  | Entrée → besoin → sortie                | Avis, utilité et friction/contresens                                                           | Adaptation et alternative minimale                                                                                |
| -------- | --------------------------------------- | ---------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| Léo      | Recherche → accueil → première analyse  | Modifier : comprend mieux sans promesse de meilleur deck ; jargon heuristique seul opaque      | Dire que le score aide à examiner une main et ne choisit pas toujours la bonne décision ; minimum : phrase courte |
| Sarah    | Accueil → mulligan → choix de testing   | Accepter : cadre attendu plus réaliste ; risque d'assimiler seuil à résultat de match          | Qualifier politique et limites près du seuil ; minimum : remplacer optimal par model-based                        |
| Karim    | Résultat partagé → modèle → export      | Accepter sous réserve : promesse et sortie doivent décrire le même événement                   | Même terminologie dans partage, métadonnées et résultats ; minimum : alignement lexical ciblé                     |
| Natsuki  | Accès direct mulligan → paramètres      | Modifier : avertissements répétitifs ralentissent                                              | Portée concise visible, détails facultatifs ; minimum : une qualification persistante sans modal                  |
| David    | HTML structuré → code/modèle → contrôle | Accepter : retirer exact universel/exclusivité non prouvée ; risque de confondre deux méthodes | Distinguer exact dans domaine supporté et estimation ; minimum : description techniquement bornée                 |
| Thibault | Accueil Commander → modèle multijoueur  | Modifier : ne pas promettre politique Commander universelle                                    | Décrire seulement options réellement prises en charge ; minimum : limites explicites sans nouvelles règles        |

## B11 — Commander Brackets, date et provenance

Proposition : vérifier source Wizards, distinguer introduction et mise à jour, conserver slug/liens existants ; retirer affirmation que le système résout universellement les discussions.

| Persona  | Entrée → besoin → sortie              | Avis, utilité et friction/contresens                                    | Adaptation et alternative minimale                                                                 |
| -------- | ------------------------------------- | ----------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| Léo      | Library → lecture d'introduction      | Accepter : date compréhensible ; risque de croire à une règle éternelle | Étiqueter introduction ; minimum : année correcte liée à source                                    |
| Sarah    | Library → référence → retour Analyzer | Accepter : fiabilité éditoriale ; faible utilité pour Standard          | Changement local, aucune nouvelle étape ; minimum : corriger carte seulement si corps déjà exact   |
| Karim    | Library → source citée                | Accepter : provenance vérifiable ; ancienne édition prise pour actuelle | Séparer dates de publication et révision ; minimum : lien source daté                              |
| Natsuki  | Recherche ponctuelle → article        | Accepter : accès immédiat à la source ; éviter exposé obligatoire       | Garder lien direct ; minimum : métadonnée corrigée                                                 |
| David    | Library → historique primaire         | Modifier : une nouvelle date ne valide pas le contenu courant           | Décrire document historique, sans prétendre audit complet des règles ; minimum : provenance exacte |
| Thibault | Library Commander → discussion de pod | Modifier : Brackets n'est pas garantie d'équilibre de table             | Retirer « résout » universel et rappeler objet de discussion ; minimum : introduction datée        |

## B02 — migration du lien legacy

Proposition : helper produit un fragment unique après reproduction, conserve deck/nom/onglet et liens courants ; pas de nouvelle donnée partagée.

| Persona  | Entrée → besoin → sortie                 | Avis, utilité et friction/contresens                                                    | Adaptation et alternative minimale                                                       |
| -------- | ---------------------------------------- | --------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| Léo      | Ancien message ami → Analyzer → analyse  | Accepter : lien ouvre son deck ; une erreur technique incompréhensible le ferait partir | Réparation transparente ; minimum : helper sans écran supplémentaire                     |
| Sarah    | Favori FNM → liste → recharge            | Accepter : retrouver nom et onglet ; risque de perdre contexte après reload             | Tester recharge identique ; minimum : fragment correctement normalisé                    |
| Karim    | Discord → plusieurs onglets → export     | Accepter sous réserve : workflow cross-window préservé                                  | Vérifier vieux et nouveaux liens séparément ; minimum : correction sans modifier contrat |
| Natsuki  | Favori testing → résultat                | Accepter : zéro clic supplémentaire ; risque de migration invasive                      | Pas de migration de stockage annexe ; minimum : retirer le # surnuméraire                |
| David    | URL legacy → inspection contenu → calcul | Accepter : invariant inspectable ; ne pas annoncer bug de calcul corrigé                | Rapport helper distinct du parcours déjà réussi ; minimum : régression du helper         |
| Thibault | Message pod → Commander → zones          | Modifier : ouvrir 100 cartes ne suffit pas si commandant perdu                          | Contrôler population et zone après recharge ; minimum : préserver contenu contractuel    |

## B04 — limitation réseau, Retry-After, annulation et réponses périmées

Proposition : politique Scryfall vérifiée, queue/espacement sur tous chemins exact/fuzzy/fallback, attente et annulation récupérables ; simulations locales uniquement.

| Persona  | Entrée → besoin → sortie                     | Avis, utilité et friction/contresens                                | Adaptation et alternative minimale                                                                        |
| -------- | -------------------------------------------- | ------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| Léo      | Coller liste → chargement → résultat         | Modifier : attente opaque ressemble à panne                         | Statut existant lisible, erreur récupérable avec liste conservée ; minimum : limiter sans nouveau réglage |
| Sarah    | Import avant FNM → correction nom → relancer | Accepter : reprend sans ressaisie ; attente longue reste friction   | Conserver saisie après 429 ; minimum : message + nouvelle tentative sûre                                  |
| Karim    | Changer liste durant import → comparer       | Modifier : un ancien résultat peut polluer le testing               | Ignorer réponse périmée et rattacher au bon deck ; minimum : identifiant de requête courant               |
| Natsuki  | Imports répétés → annuler → nouvelle liste   | Modifier : la limite ne doit pas bloquer un calcul annulé           | Annulation propage au travail en attente ; minimum : sortie sûre de la queue                              |
| David    | Données carte → modèle → vérification        | Accepter : fraîcheur cohérente ; mock n'établit pas capacité réelle | Distinguer test local et débit tiers ; minimum : ordonnanceur partagé prouvé                              |
| Thibault | Grande liste singleton → Analyzer            | Accepter sous réserve : besoin plus exposé aux requêtes multiples   | Tester grande liste sans perdre zones ; minimum : limiter tous chemins sans plafond 60 cartes             |

## B12 — borne avant décodage

Proposition : limite justifiée avant décodage, Unicode et liens ordinaires préservés, message récupérable ; aucun déni de service démontré par le seul payload historique.

| Persona  | Entrée → besoin → sortie                       | Avis, utilité et friction/contresens                                  | Adaptation et alternative minimale                                                                   |
| -------- | ---------------------------------------------- | --------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| Léo      | Lien reçu → erreur éventuelle → collage manuel | Modifier : doit savoir quoi faire                                     | Message invitant à coller la liste ; minimum : rejet contrôlé sans jargon base64                     |
| Sarah    | Nom accentué → partager → rouvrir              | Accepter sous réserve : aucune régression Unicode                     | Tester accents/emoji et limite ; minimum : borne avant allocation                                    |
| Karim    | Lien complet → onglet partagé                  | Accepter : pas de blocage durable ; troncature silencieuse dangereuse | Rejeter entièrement, jamais analyser un sous-ensemble ; minimum : erreur explicite                   |
| Natsuki  | Copie inter-outils → reprise rapide            | Accepter : lien légal garde accès direct                              | Pas de confirmation supplémentaire sur liens ordinaires ; minimum : garde invisible hors dépassement |
| David    | Payload → contrat format → contrôle            | Modifier : taille encodée et texte décodé ne sont pas équivalents     | Documenter unités et bornes exactes ; minimum : tests juste-dessous/au-dessus                        |
| Thibault | Singleton avec noms longs → partage            | Modifier : plafond doit admettre son deck ordinaire                   | Cas Commander Unicode ; minimum : borne compatible population réelle                                 |

## B10 — contraste Library

Proposition : palette minimale du badge lost, texte conservé, ratio texte ≥4,5:1, clair/sombre et 320/390/largeurs voisines.

| Persona  | Entrée → besoin → sortie                       | Avis, utilité et friction/contresens                                              | Adaptation et alternative minimale                                    |
| -------- | ---------------------------------------------- | --------------------------------------------------------------------------------- | --------------------------------------------------------------------- |
| Léo      | Mobile Library → choisir lecture               | Accepter : badge lisible évite clic sans destination ; couleur seule insuffisante | Garder lost écrit ; minimum : modifier couleur texte/fond             |
| Sarah    | Tablette → statut référence → lecture          | Accepter : retrouve disponibilité ; effet de bord de palette possible             | Contrôler clair aussi ; minimum : variante sombre locale              |
| Karim    | Library → vérifier source perdue               | Accepter : statut conserve information ; pas de filtre cachant références         | Garder l'article et sa provenance ; minimum : contraste du badge      |
| Natsuki  | Recherche directe → source                     | Accepter : aucun clic ajouté ; légende inutile imposée ralentirait                | Texte déjà explicite, changement visuel seulement ; minimum : palette |
| David    | Référence → disponibilité → source alternative | Accepter : distinction statut/disponibilité reste ; badge vert trompeur à éviter  | Couleur cohérente avec statut lost ; minimum : éclaircir texte        |
| Thibault | Tablette sombre → lectures Commander           | Accepter sous réserve : reflow et intitulés longs lisibles                        | Contrôler 320/390 et clavier ; minimum : badge non tronqué            |

## B15 — CSV, correction conditionnelle au vecteur

Proposition : établir origine contrôlable ; neutraliser uniquement cellules textuelles susceptibles de devenir des formules si confirmé, conserver chiffres, zones et export brut structuré. Aucun tableur réputé testé sans ouverture réelle isolée.

| Persona  | Entrée → besoin → sortie                    | Avis, utilité et friction/contresens                                                   | Adaptation et alternative minimale                                                                                |
| -------- | ------------------------------------------- | -------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| Léo      | Export occasionnel → fichier                | Accepter si risque établi : doit ouvrir en texte sans surprise ; peu de besoin tableur | Aucun avertissement alarmiste non démontré ; minimum : protection textuelle ciblée                                |
| Sarah    | CSV → feuille FNM                           | Modifier : noms et quantités doivent rester utilisables                                | Conserver Unicode/guillemets et nombres ; minimum : neutraliser préfixes dangereux seulement                      |
| Karim    | Export → Sheet testing → calcul indépendant | Modifier : altération silencieuse nuit aux jointures                                   | Documenter convention de neutralisation ; garder JSON pour données brutes ; minimum : cellules textuelles ciblées |
| Natsuki  | CSV automatisé → pipeline équipe            | Réserve : préfixer toutes valeurs casse ses outils                                     | Ne pas toucher numériques ni noms ordinaires ; minimum : correction du seul vecteur confirmé                      |
| David    | Export → parseur → audit                    | Modifier : guillemets CSV ne neutralisent pas formule                                  | Séparer conformité CSV et exécution tableur, preuves distinctes ; minimum : test fixture + limite déclarée        |
| Thibault | CSV Commander → comptage 99+1               | Accepter sous réserve : zones restent exploitées                                       | Vérifier is_commander/is_sideboard et totaux ; minimum : protection sans changer colonnes                         |

## B16 — PDF et alternative texte structurée

Proposition : titre et valeurs Opening Hand restent ensemble, pagination lisible ; sortie texte téléchargeable/consultable avec résultats réellement disponibles, unités, hypothèses, limites et zones. Un PDF raster reste annoncé comme image ; aucun OCR présenté comme texte natif.

| Persona  | Entrée → besoin → sortie             | Avis, utilité et friction/contresens                              | Adaptation et alternative minimale                                                                |
| -------- | ------------------------------------ | ----------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| Léo      | Résultat → export → message ami      | Modifier : titre séparé empêche de comprendre les nombres         | Titre et première valeur groupés ; minimum : texte court structuré parallèle                      |
| Sarah    | PDF → tablette → discussion FNM      | Accepter : lecture continue ; plusieurs formats peuvent distraire | Libellés PDF et Text report clairs ; minimum : option texte dans menu existant                    |
| Karim    | Rapport → équipe → vérification      | Modifier : chiffre sans événement devient trompeur                | Inclure unités et méthode, pas seulement screenshot ; minimum : texte des valeurs exportées       |
| Natsuki  | Export → feuille testing             | Accepter sous réserve : texte ne remplace pas CSV/JSON            | Garder exports structurés ; minimum : alternative facultative sans écran de préparation           |
| David    | PDF → extraction → contrôle          | Modifier : alternative accessible doit contenir même sens         | Vérifier valeurs/arrondis/population et champs absents explicités ; minimum : fichier texte natif |
| Thibault | Rapport Commander → pod sur tablette | Modifier : bibliothèque et commandant distincts dans fichier      | Tester 99+1 et noms longs ; minimum : sections zones lisibles avec limitations du modèle          |

## B05 — cadrage avant prototype (pas encore validation du prototype)

Proposition : Compare existant depuis résultat, A prérempli immutable, B choisie librement, diff avant recalcul, hypothèses communes, sauvegarde distincte confirmée et abandon sûr. Aucune étape obligatoire d'aide ni nouvelle route atelier.

| Persona  | Entrée → besoin → sortie                           | Avis et risque                                                             | Adaptation / alternative minimale                                                                           |
| -------- | -------------------------------------------------- | -------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| Léo      | Résultat → Compare a change → modifier → revenir A | Modifier : choix des cartes difficile, risque que B soit pris pour conseil | Your original is preserved. You choose the change. ; minimum Compare prérempli + aide facultative           |
| Sarah    | Analyse FNM → B → conserver                        | Modifier : brouillon confondu avec sauvegarde                              | Save variant seulement après calcul et écriture confirmée ; minimum dupliquer dans Compare                  |
| Karim    | Analyse → remplacement → diff → testing            | Accepter sous réserve : cartes changées et événement exact visibles        | Diff retrait/ajout et delta en points ; minimum Compare prérempli                                           |
| Natsuki  | Résultat → accès direct Compare → B                | Rejeter tout détour pédagogique imposé                                     | Édition directe sans assistant ; minimum zéro action de sélection A                                         |
| David    | Résultat → hypothèses → B comparable/incomparable  | Modifier : nom de métrique identique ne garantit pas comparabilité         | Contrôler paramètres/population/couverture, supprimer faux delta ; minimum Compare prérempli avec refus sûr |
| Thibault | Résultat Commander → B → retour A                  | Modifier : 99+1 et commandant fixe indispensables                          | Zones distinctes et refus mécanique hors couverture ; minimum édition de bibliothèque seulement             |

Statut : FAVORABLE AU PROTOTYPE sous ces adaptations. Aucun CMP réussi par ce tableau. La revue du prototype réel doit compléter cette section avant implémentation.

## B06 — décision de version minimale à côté du partage

Proposition relue : conserver le bouton et codec deck/name/tab. Ajouter facultativement un aperçu de texte de contexte, copiable manuellement ou via action explicite, à côté du partage existant. Un contrôle permet de choisir d'inclure le nom/la liste si disponibles. Le corps obligatoire indique question, population, méthode et limites réellement connues ; toute hypothèse absente est marquée non disponible. Ne jamais appeler le texte une reproduction complète, ni partager une B inexistante.

| Persona  | Entrée → besoin → sortie                 | Avis et friction/contresens                                                | Adaptation / alternative minimale                                                                               |
| -------- | ---------------------------------------- | -------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| Léo      | Résultat → lien copié → ami              | Réserve : il copie l'URL brute, le reçu peut rester ignoré                 | Phrase visible «Link includes deck, name and tab, not model settings» ; minimum cette phrase, aperçu facultatif |
| Sarah    | Résultat → aperçu → Discord FNM          | Accepter sous réserve : veut texte bref compatible capture                 | Résultat avec événement/limite ensemble, nom optionnel ; minimum copier texte explicatif                        |
| Karim    | Compare → aperçu → équipe                | Modifier : reçu sans paramètres ne reconstitue pas scénario                | Mentionner précisément manquants ; minimum contexte humain sans codec enrichi                                   |
| Natsuki  | Compare → sortie vers feuille            | Réserve : texte moins utile que JSON, étape ne doit pas bloquer            | Option facultative, CSV/JSON inchangés ; minimum simple notice du partage                                       |
| David    | Aperçu → vérifier méthode → destinataire | Modifier : rejeter des valeurs ou hypothèses reconstruites par supposition | Générer uniquement depuis données présentes ; minimum liste explicite de ce que le lien transporte              |
| Thibault | Analyse Commander → aperçu → pod         | Accepter sous réserve : population 99+commandant et limites essentielles   | Montrer zones et absence de règles transmises ; minimum contexte court Commander                                |

Arbitrage : intégrer seulement une version brève inspectable si les données existent ; sinon limiter à la notice de portée et différer le reçu complet. Aucune nouvelle page ni extension codec. Léo/Natsuki restent réservés sur l'utilité ; étude des trois binômes NON EXÉCUTÉE. Validation simulée du principe conditionnée au texte effectivement généré ; tout changement substantiel doit être relu.

## Désaccords et réserves transversales

Les novices demandent une phrase compréhensible ; les experts refusent l'étape didactique imposée. Retenir aide facultative et accès direct. David/Karim privilégient provenance et données ; Thibault impose zones explicites ; les corrections ne promettent aucune extension du moteur. Natsuki reste réservée sur reçu texte et aucune correction CSV globale n'est validée. Ces avis ne remplacent ni vérification technique, ni revue du prototype, ni confirmation visuelle du propriétaire, ni recherche humaine.

## Relecture des précisions finales B01/B03/B06/B16

B01 primaire effectivement chargée le 14 septembre :21 sources,25 terrains,91% conditionnel après London. Guide et Mathematics emploient la même constante ; badge91% désigne UU T2 explicitement. B03 métadonnées Home/HTML et deux descriptions JSON-LD bornées, badge Mulligan «Heuristic». Relecture simulée : Léo accepte badge lié à question ; Sarah accepte distinction testing/match ; Karim accepte politique explicite ; Natsuki accepte absence de nouvelle étape ; David accepte source primaire et unités ; Thibault accepte distinction table99 publiée vs approximationN/60 de l'application. Aucun élargissement moteur.

B06 source réelle ShareContext.tsx et analysisText.ts lue : aperçu replié, nom et liste décochés, texte séparé du lien, champs issus snapshot, résultats comparés seulement pour sorts communs. Léo demande notice de portée visible même repliée ; Sarah accepte contrôle nom/liste ; Karim accepte delta en points avec limites ; Natsuki garde réserve d'utilité mais accepte option non imposée ; David demande absence de contrat modèle attribué à un snapshot legacy non renseigné ; Thibault accepte décompte zones. Ces deux adaptations envoyées au lead avant clôture. Aucune copie de clipboard réelle de ce candidat par l'agent produit à ce stade.

B16 précision de classification examinée avant correction : «Poor» décrit0ou6 terrains, «Terrible»7 séparément, classification heuristique et non conseil keep. Léo accepte libellé compréhensible ; Sarah accepte distinction des catégories ; Karim exige valeurs/units conservées ; Natsuki exige même convention dans texte et fichier ; David exige que classes ne se recouvrent pas artificiellement et que pourcentages ne soient pas multipliés deux fois ; Thibault exige zones99+1. Six avis favorables à cette correction de sens, sous vérification des valeurs réelles par QA. Ce complément ne prétend pas ouvrir un PDF ou tableur.
