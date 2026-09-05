> **Rapport historique A1–A3 et pathways.** La suite des cinq points est documentée dans [le rapport du 6 septembre](../extensions-2026-09-06/REPORT.md) et [ses preuves](../extensions-2026-09-06/validation.json). Les résultats ci-dessous restent attachés à leurs anciens commits.

# 1 Verdict global

Corrections A1–A3 implémentées ; extension fermée des dix pathways terrain/terrain implémentée. Fiabilité limitée au modèle et aux cas vérifiés, sans certification universelle. Le code applicatif fcf566a est publié sur main et Vercel (dpl_27sX3V9r3YcAE7muGqhSCojfXZ67, READY, HTTP 200). CI et campagne Linux complète réussies. Les preuves sont consignées dans validation.json.

# 2 Résumé exécutif

Un risque inconnu ne produit plus un score de santé favorable : le nombre et le badge de qualité sont remplacés par un état indisponible. Les sorties historiques conservent leurs méthodes et hypothèses. Les pathways comptent comme une carte et imposent une face fixe après la pose.

# 3 Architecture mathématique découverte

Le dépôt réel était main = origin/main = ac790fd à la reprise, application 2.7.9. Aucune consigne AGENTS.md supplémentaire trouvée. La carte des appelants est dans [le rapport A](../corrections-a-2026-09-05/REPORT.md). Les résultats physiques restent prioritaires dans l’interface ; les estimations tempo secondaires sont conservées dans les résumés et exports avec leur méthode.

# 4 Modèles mathématiques utilisés

Potentiel de paiement d’une demande extérieure, tirage uniforme sans remise, sept cartes, play/draw explicite, sans mulligan. La recherche peut exploiter les futures pioches de l’histoire. p2 mesure l’existence d’un paiement ; p1 conditionne sur le paiement générique de même valeur. Les scores et anciennes estimations ne deviennent pas des probabilités exactes. [Contrat vivant](../physical-engine-2026-09-05/MODEL.md).

# 5 Comparaison avec les références

Les preuves historiques sont conservées dans [la clôture précédente](../completion-2026-09-05/REPORT.md). Les textes Oracle des vingt faces de pathways sont récupérés auprès de Scryfall et conservés avec les identifiants et URL dans [card-sources.json](../pathways-2026-09-05/card-sources.json). Les seules capacités admises dans ce cycle sont les productions par engagement d’une unité, sans ETB engagé.

# 6 Bugs trouvés

A1 reproduit : risque 0,8 → null, autres indicateurs inchangés, score 80/Good → 100/Excellent. Deux régressions rouges avant correction. A2 reproduit : méthodes absentes des sorties p1/p2 historiques et perdues dans compareTempoImpact ; trois régressions rouges. Corrections documentées dans le rapport A. Le refus antérieur des pathways était une limite explicite, pas un bug de probabilité.

# 7 Tests indépendants

Oracle indépendant des pathways : cartes par identité, mains de sept, pioches ordonnées, choix irréversible des faces, paiement par permanents individuels. Six compositions/horizons play/draw contrôlent p1 et p2, plus cas fermés de population, paiement concurrent et séquençage. Les [résultats](../pathways-2026-09-05/oracle-results.json) et [hypothèses](../pathways-2026-09-05/MODEL.md) sont conservés. Aucune fonction de paiement ou de probabilité de production importée dans l’oracle.

# 8 Mulligan / Monte-Carlo

Aucune extension de ces modèles dans cette session. Les régressions existantes sont réexécutées dans la suite complète. La récompense, le bottoming et l’arrêt à quatre restent heuristiques/limités. Le million de simulations historique n’est pas une nouvelle validation stratégique.

# 9 Mana rocks / dorks / ramp

Cinq producteurs audités inchangés. Nouveau contrôle d’interaction pathway + elfe : la face verte utilisée pour l’installation ne devient pas rouge après dégagement. Ramp avec recherche, trésors, rituels et restrictions supplémentaires restent exclus.

# 10 Sources colorées / Karsten

Aucune nouvelle prétention d’exactitude pour les comptages secondaires ou les recommandations Karsten. Les méthodes historiques sont étiquetées. Un pathway produit une seule couleur choisie, sans doublage de population ; les estimations secondaires de sources ne remplacent pas le moteur physique.

# 11 Cas limites

Risque null versus zéro et risque positif ; stockage/export/import natif ; coût ou terrain hors domaine ; faces connues versus inconnues ; un pathway face arrière au T1 ; deux pips concurrents ; installation d’elfe ; terrain partenaire engagé ; play/draw ; dépassement de budget sans p2. Une face pathway engagée modifiée est refusée, pas prétendue prise en charge.

# 12 Modifications effectuées

Lot A : EnhancedRecommendations, types et résultats des moteurs historiques, comparaison tempo, libellé de secours historique, contrat MODEL et nouvelles régressions. Lot B2 : contrat fermé auditedPathways, choix de face physique, oracle et tests UI. Les preuves historiques ne sont pas réécrites. Les fichiers annexes utilisateur restent exclus. Les fichiers de feed modifiés par le prebuild ont été restaurés seuls, après vérification de leur propreté initiale.

# 13 Tests exécutés

Lot A local : 599 réussis, 2 ignorés, 56 fichiers ; CI Linux réussie sur 3d2730d. Lot B2 local : 621 réussis, 2 ignorés, 57 fichiers. Types, build et budget PASS ; lint 0 erreur / 27 avertissements ; audit npm production 0 vulnérabilité détectée. La CI Linux a réussi sur fcf566a. Campagne navigateur Linux finale sur fcf566a : **438 réussis, 6 ignorés, zéro échec et zéro reprise**, 73 réussis et un ignoré dans chacun des six projets. Les deux tests unitaires ignorés portent le total à huit tests ignorés. Résultats et empreintes des rapports dans validation.json. Deux parcours Chromium supplémentaires passent sur la production native : face arrière de Riverglide (40 %, référence indépendante 0,3994996257446656) et fetch Scalding Tarn refusé avec badge Incomplete data. Script et résultats sont conservés dans ce répertoire. Les compteurs historiques 593/438 ne sont pas extrapolés à cette version.

Un test de stockage a d’abord échoué parce que le setup global remplace localStorage par des fonctions sans mémoire ; il utilise maintenant un stockage en mémoire isolé en conservant les vrais chemins de sérialisation/export/import. Le hook de commit a révélé une déclaration de fonction interdite par ESLint dans l’oracle : correction de forme, assertions inchangées. Un dispatch navigateur redondant sur le lot A a été annulé ; il n’est pas compté comme validation. Aucun déploiement Vercel manuel ajouté.

# 14 Risques restant connus

Fetchlands B1 non implémentés ; MDFC sort/terrain, autres faces et capacités non auditées refusées. Neige, phyrexian, twobrid, vie, restrictions et accélérateurs supplémentaires restent hors modèle. Budgets finis, métadonnées nécessaires. Les pathways ont été traités avant B1 car ils conservent la population de tirage ; les fetchlands demandent une formulation distincte de recherche et mélange. Pas de politique non clairvoyante, pas d’événement « tirer puis lancer » ajouté.

# 15 Matrice de traçabilité

| Domaine                 | Preuve                                                                         |
| ----------------------- | ------------------------------------------------------------------------------ |
| Score incomplet         | score-contract.test.tsx : risque inconnu, nul, élevé, JSON et avertissement UI |
| Méthodes historiques    | legacy-contract.test.ts : API, comparaison, JSON, stockage natif               |
| Pathways et p1/p2       | pathways.test.ts : oracle indépendant et cas fermés                            |
| Affichage physique      | physical-ui.test.tsx : face arrière, refus, zéro physique                      |
| Terrains hors domaine   | special-lands.spec.js : contrats actualisés sans retrait des refus utiles      |
| Non-régression générale | Suites unitaires et campagnes Linux, validation.json                           |

# 16 Verdict final

Les défauts reproduits de score et de propagation des méthodes sont corrigés. Le cycle fermé des pathways dispose d’une représentation physique et de preuves indépendantes. Les limites restantes sont explicites ; il serait faux de promettre 100 % de fiabilité pour toutes les mécaniques de Magic.
