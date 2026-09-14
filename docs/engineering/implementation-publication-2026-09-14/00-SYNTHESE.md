# ManaTuner — bilan du 14 septembre 2026

**Candidat final : final-08, sur main.** Les changements sont implémentés et les validations finales ci-dessous sont acquises. Aucun push ni déploiement de cette mission à la rédaction. La confirmation visuelle du propriétaire, demandée selon le §4 de la mission, reste en attente. L’autorisation générale de publication est déjà acquise.

## Changements pour les joueurs

Analyzer propose **Compare a change** après une analyse : original A préservé, variante B choisie manuellement, différences de liste avant calcul et sauvegarde distincte. Les écarts sont exprimés en points ; les populations, commandants, coûts ou questions incompatibles ne produisent pas de faux delta. L’aide reste facultative et aucune recommandation automatique de deck n’est ajoutée.

À côté du partage, un aperçu facultatif fournit un texte de contexte avec choix du nom et de la liste. Les liens restent limités à deck/nom/onglet et ne transportent pas les réglages interactifs. Blueprint propose un rapport texte structuré, un PDF regroupant les titres et valeurs et un CSV protégeant les champs textuels susceptibles de devenir des formules.

Les références et promesses éditoriales sont clarifiées. Les anciens liens, les bornes d’entrée et la cadence Scryfall sont corrigés. La saisie quittée avant la fin des 300 ms de temporisation est désormais transmise avant le départ ; aucune analyse ni sauvegarde historique implicite n’est créée.

## Les seize chantiers

| ID  | État local                        | Résultat et réserve                                                                                                                                                                          |
| --- | --------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| B01 | Réalisé                           | Référence commune Guide/Mathematics : 21 sources bleues pour UU tour 2, 60 cartes et 25 terrains, cible conditionnelle 91 % avec la politique de mulligan de la source. Formules inchangées. |
| B02 | Réalisé                           | Helper legacy réparé ; liens courants et anciens conservés, rechargement vérifié.                                                                                                            |
| B03 | Réalisé                           | Accueil, métadonnées, JSON-LD et manifeste PWA qualifient estimation, heuristique et portée exacte.                                                                                          |
| B04 | Réalisé                           | File Scryfall commune, cadence de départ, Retry-After, annulation et repli exact après timeout local dans le budget global de 30 s.                                                          |
| B05 | Réalisé techniquement             | Compare contextualisé, original intact, B manuel, différences et sauvegarde distincte. CMP-07 humain reste ouvert.                                                                           |
| B06 | Minimum réalisé                   | Aperçu et copie du contexte choisis ; codec conservé. Compréhension du destinataire non mesurée.                                                                                             |
| B07 | Différé                           | Besoin d’un carnet à J+7 non observé. Le correctif du brouillon existant n’introduit pas ce carnet.                                                                                          |
| B08 | Non exécuté                       | Protocole humain préparé, aucun participant ni recrutement.                                                                                                                                  |
| B09 | Communication réservée            | Publication technique distincte d’un lancement large ; aucun message externe envoyé.                                                                                                         |
| B10 | Non reproduit après stabilisation | Badge Library sombre à 390 px : seuil conservé, attente du chargement/animations corrigée. Aucune palette modifiée inutilement. Nouveaux dialogues corrigés séparément.                      |
| B11 | Réalisé                           | Commander Brackets daté du 11 février 2025 selon la source primaire ; identifiant historique conservé.                                                                                       |
| B12 | Réalisé                           | Bornes avant décodage, Unicode ordinaire préservé, erreur récupérable sans substitution du deck.                                                                                             |
| B13 | Corrigé localement                | Causes nightly identifiées, sélection et attente du rendu corrigées, couverture visuelle effective. Nouvelle exécution Linux distante à acquérir après push.                                 |
| B14 | Réalisé                           | Mise à jour ciblée de Vitest 4.1.11 ; audit dépendances à zéro.                                                                                                                              |
| B15 | Durcissement réalisé              | Texte CSV et metadata protégés, valeurs numériques et recette officielle conservées. Exécution dans un tableur installé non réalisée.                                                        |
| B16 | Réalisé                           | PDF paginé et rapport TXT, fichiers téléchargés et inspectés. PDF raster et volumineux, pas un document sémantique natif.                                                                    |

Détails : [journal B01–B16](JOURNAL.md), [48 cas](RESULTATS.csv), [matrice](MATRICE-TESTS.csv). Les cas composites partiels ne sont pas annoncés entièrement réussis.

## Validation finale

Le gate intact `npm run build:vercel` sur **final-08** passe : **846 tests dans 85 fichiers**, lint et types, **101 routes HTML**, **16 tests Chromium**, audit dépendances **0**. Les dossiers candidat, livraison et math sont absolus et propres à cette exécution. [Log du gate](final-08/gate.log).

Les oracles indépendants source passent **57/57**, dont 45 événements combinatoires, populations/zones, codec et cadence locale mockée. Intervalle minimal mesuré : **109,75 ms**, au-dessus du seuil de 100 ms ; le délai configuré est de 110 ms. Aucun test de charge sur Scryfall. [Résultats bruts](final-08/oracles/independent-results-final.json).

**UX-005 : trois contrôles réussis sur le candidat immuable** : résultat conservé après Guide/retour, deck conservé après rechargement, brouillon non analysé conservé après Guide/retour immédiat puis rechargement. Le résultat calculé reste volontairement volatil au rechargement. [Preuve](final-08/matrix-ux/results.json).

Compléments réellement exécutés sur final-08 : **33/33 Chromium + 33/33 WebKit** pour l’audit ; **23/23 Chromium** pour les parcours personas techniques ; **15/15 Chromium + 15/15 WebKit** pour Compare ; **3/3 parcours d’export**, avec les trois CSV traités par la recette officielle ; **4/4 contrôles de partage**, dont presse-papiers réel et second contexte. [Exports](final-08/exports/README.md.txt) · [Partage](final-08/sharing/README.md) · [Contrôle visible du lead](final-08/CUA.md).

La matrice des 48 cas compte **20 réussites, 27 cas non exécutés intégralement et 1 blocage**. Les 27 incluent des couvertures techniques partielles et des validations humaines non réalisées ; ils ne sont pas transformés en succès globaux par les suites vertes.

## Six personas et QA

Les six profils canoniques ont évalué séparément les évolutions, le prototype et les adaptations : Léo, Sarah, Karim, Natsuki, David et Thibault. Les désaccords et conditions sont conservés ; le correctif de brouillon a également été relu avant implémentation. Ce sont des **évaluations simulées**, pas des entretiens avec six joueurs.

[Avant implémentation](product/PREIMPLEMENTATION-PERSONAS.md) · [Prototype contextualisé](product/PROTOTYPE-REVIEW.md) · [Avis finaux et adaptations](product/FINAL-PERSONAS.md) · [QA indépendante](COMPARE-QA.md).

## Incidents conservés et limites

Les essais rouges n’ont pas été supprimés : contraste des nouveaux dialogues ; format metadata CSV ; POST collection temporairement expiré puis rétabli ; cadence initiale de 88,966 ms avant préparation Headers ; interférence entre sondes de partage simultanées, dont le mécanisme exact n’est pas établi ; saisie perdue avant 300 ms ; option de typage invalide dans un test du gate06. Aucun seuil ni assertion n’a été réduit pour obtenir du vert.

Le premier correctif de brouillon, limité au démontage React, ne couvrait pas l’aller-retour SPA rapide avant démontage. La reproduction instrumentée a rejeté l’hypothèse de navigation native. La transmission à la sortie du champ corrige le parcours réellement observé ; les preuves rouges05/07 et positives08 restent distinctes.

Firefox est bloqué avant navigation dans cet environnement. Chromium/WebKit et leurs émulations ne prouvent ni appareils physiques ni lecteur d’écran humain. Certains protocoles composites de performance, de mémoire, d’offline et de refus global de Storage restent partiels ; leurs sous-cas sont détaillés dans la matrice. La validation juridique compétente reste ouverte. Pas de nouvelle télémétrie, Sentry reste désactivé.

Les PDF inspectés pèsent environ 12 à 23 Mo selon fixture et restent raster ; le TXT apporte le contenu structuré. Les quatre PNG/PDF Commander clair/sombre supplémentaires sont des preuves05, avec sources d’export inchangées ensuite. La communication large reste réservée jusqu’à la recherche humaine : [conditions de reprise](product/RESEARCH-AND-LAUNCH.md).

## Préservation et disponibilité des preuves

Les 482 fichiers présents en début de mission ont été contrôlés intacts avant mise à jour des quatre suivis. Leurs anciennes informations sont conservées. Les rapports historiques, prototypes et worktrees ne sont pas ajoutés globalement. L’incident de reporters propres écrasés par `--list` a été documenté et leurs octets restaurés depuis HEAD après vérification de leur état initial propre.

Les builds, PDF, images et traces lourdes restent locaux avec manifestes. Les preuves JSON sélectionnées ont des copies identiques `.json.txt` dans Git pour éviter leur reformatage par les hooks. [Disponibilité et sélection](PREUVES-VERSIONNEES.md) · [Commandes et essais](COMMANDES.md) · [Sources primaires](product/PRIMARY-SOURCES.md).

## Git et publication

[État détaillé](PUBLICATION.md). Base et origin/main avant livraison : `a0a23519253751b9c98d6b93f73822f21e8191c0`. Le déploiement Vercel READY de cette base est **antérieur** et ne contient pas les changements de cette mission. Nouvelle CI distante et smoke public ne sont pas revendiqués en l’absence de push.

Candidat à confirmer : http://127.0.0.1:4198/analyzer?sample=exact → Analyze Manabase → Compare a change ; Blueprint → Text report. Autres pages : /guide, /mathematics et /library.

Le §4 de la mission exige : « Si cette confirmation reste absente, termine les validations indépendantes et garde la publication en attente ». Le push déclenchant potentiellement Vercel, il reste en attente de cette confirmation visuelle. L’autorisation générale n’est pas redemandée. Après confirmation : push normal origin/main, observation du circuit natif existant, contrôle des SHA et de READY, puis smoke public ; aucun second déploiement manuel.
