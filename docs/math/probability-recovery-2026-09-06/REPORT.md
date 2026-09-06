# 1. Objet et versions comparées

Signalement du 6 septembre : l'analyse démarre mais toutes les probabilités affichent « Exact sequencing currently supports goldfish only (removal rate 0) ». Le deck de la capture est l'exemple intégré **Selesnya Limited**, 40 cartes, 17 terrains, 17 sorts distincts.

Le dernier commit antérieur au 5 septembre est `b87579a46b936e2b3192c9a5f1ceca3de97c4f50` (2 août). Ce point de comparaison est déterminé par git, et non supposé à partir de la version applicative 2.7.9, inchangée. La production reproduite est `2250f12`, qui contient déjà la réparation du formulaire. Nouveau code : **`ee828ccef4ada609e8d3cb545e7238a5aef423c9`**, après `6f736c6` et deux renforcements des préconditions navigateur. Consulter `validation.json` pour l'état final des campagnes et de la publication ; les anciens résultats 593/438, 621/438, 669/450 et 674/462 restent attachés à leurs propres commits.

# 2. Reproduction du défaut principal

Avant correction : la reproduction publique avec les métadonnées Scryfall contrôlées montre la colonne entièrement indisponible. Un nouveau test de ligne attend la valeur calculée par un oracle hypergéométrique indépendant : il échoue. Les six autres assertions de refus explicite passent déjà.

Le code de `b87579a` a été extrait dans un dossier temporaire distinct, construit puis ouvert dans Chromium : **17 lignes « Realistic », zéro indisponibilité**, les cinq onglets accessibles. Les dépendances verrouillées actuelles ont été réutilisées pour cette comparaison de sources : ce n'est pas une reproduction de l'environnement de déploiement d'août. Rapport brut et capture : `proofs/baseline-comparison.json`, `baseline-limited.png`.

# 3. Cause et responsabilité des validations

L'introduction de `physicalResult` en `e4ec1e3` a rendu les branches d'estimation inaccessibles. Le mode exact refuse l'accélération dès que le taux de retrait des créatures n'est pas nul. Or les préréglages courants (dont Limited à 15 %) incluent ce taux et l'accélération est activée. Le refus du moteur décrit correctement sa limite ; l'imposer comme seul résultat à l'interface par défaut casse l'usage principal.

Les suites précédentes vérifiaient surtout le chargement de l'analyseur et des onglets. Elles acceptaient une page sans erreur React mais sans probabilités. Les grands compteurs de tests ne prouvaient pas que ce résultat utilisateur avait été vérifié. Les nouveaux scénarios exigent les **17 lignes numériques**, des valeurs déterminées et leur évolution après changement de réglages.

# 4. Correction du contrat d'interface

Le tableau propose **Mana estimates** (mode par défaut) et **Exact goldfish potential**. Ce choix est affiché avant les résultats. Il n'existe aucun basculement automatique après un échec exact. Le mode exact conserve son refus explicite ; le modèle de politique non clairvoyante reste séparé et optionnel.

Les estimations retrouvent leur indicateur graphique, une valeur principale, la référence terrains seuls et la référence conditionnée aux sorties de terrains. Elles sont étiquetées « Source-count heuristic » ; les hypothèses de ramp, retrait, chevauchement des sources et séquençage sont visibles. Les anciens libellés ambigus « Realistic » et « On-curve cast chance » ne sont pas réintroduits.

# 5. Pas de pourcentages inventés

L'estimateur visible exige un coût réel et des métadonnées de sources présentes, des effectifs valides et un coût dans son domaine. Les coûts supposés d'après le nom et le fallback générique `{2}` ne sont plus utilisés par ce chemin. La branche graphique qui pouvait afficher les anciens pourcentages de secours est retirée.

Coûts agrégés admis : générique, W/U/B/R/G/C, X fixé à 2, hybrides bicolores avec choix fixe de la couleur la plus représentée, explicitement signalé. Neige, phyrexian, twobrid et symboles inconnus ne sont pas silencieusement supprimés. Le panneau de politique a son propre domaine pour certaines de ces demandes ; ses résultats ne remplacent pas les estimations du tableau.

# 6. Autres défauts reproduits et corrigés

| Défaut                                                                               | Origine par comparaison des sources                                             | Reproduction et correction                                                                                                                                                                                                  |
| ------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Formulaire « Your Deck » vide après reload                                           | Préexistant à septembre, persistance `10845c7`                                  | Réparation publiée en `2250f12`, rapport séparé `../editor-recovery-2026-09-06/REPORT.md` ; conservation du deck et du nom.                                                                                                 |
| Toutes les probabilités indisponibles avec les réglages courants                     | Régression de septembre, introduction du résultat exact obligatoire             | Reproduction publique + ancien code reconstruit + oracle indépendant ; choix de modèle explicite.                                                                                                                           |
| Path to Exile détecté comme notre ramp                                               | Service inchangé depuis la référence d'août                                     | Test rouge sur son vrai texte Oracle. Une recherche doit être dans **your library** pour entrer dans cette détection ; cache de producteurs version 3, ancienne version invalidée sans effacer les decks.                   |
| Charger un autre deck sauvegardé garde le résultat précédent et le formulaire replié | Préexistant à septembre                                                         | Parcours navigateur rouge après navigation SPA. `clearAnalyzer()` avant de charger le nom et la liste sélectionnés, résultat invalidé et formulaire rouvert.                                                                |
| Terrain entrant après sideboard ignoré dans les sources agrégées                     | Préexistant dans l'ancien chemin d'estimation                                   | Parcours rouge après entrée d'une Plains et sortie d'Oath of Nissa. Sources recalculées sur le board effectif ; retour « Main only » restaure les sources initiales. Zéro terrain n'est plus remplacé par le total initial. |
| Face avant des cartes transformables : coût perdu à la résolution                    | Préexistant à septembre ; les anciens chiffres pouvaient masquer le coût absent | Wedding Announcement reproduit dans le sample Control ; deux tests rouges (Wedding et Delver), puis conservation du coût réel de la face avant. Un vrai coût absent reste absent.                                           |
| Ancienne analyse annoncée à la fois comme legacy et comme modèle physique courant    | Régression d'étiquetage de septembre                                            | Test de composant rouge ; l'explication du modèle physique n'est affichée que lorsque le contrat sauvegardé le déclare.                                                                                                     |

Les boutons du planificateur sideboard ont aussi des noms accessibles, utilisés par le parcours navigateur. L'essai initial cliquait l'icône SVG ; le test final clique le bouton et exige l'état « Balanced: 1 in / 1 out » avant application, puis la valeur numérique attendue. Aucune assertion numérique n'a été réduite. La première campagne Linux a révélé que le test lisait parfois le champ avant hydratation du sample : il vérifie maintenant la liste complète avant de la modifier. Sous WebKit il attend aussi la fin d'ouverture du panneau avant de faire défiler un bouton situé en bas de liste. Cinq répétitions consécutives passent ; le parcours de chargement ouvre également le menu réel sur mobile, au lieu de chercher le lien du header desktop ; les anciens essais ne sont pas comptés comme validation finale.

# 7. Oracle et régressions numériques

Pour Path to Exile dans le modèle de comptage, 10 sources W sur 40 cartes : `1 − C(30,7)/C(40,7)` donne 89 % après arrondi au play ; avec huit cartes vues, 92 % au draw. Après sideboard, 11 sources W : `1 − C(29,7)/C(40,7)` donne 92 %. Retour main : 89 %. Il s'agit du marginal **de sources**, pas du paiement physique tour un : les Guildgates engagées montrent justement pourquoi ce mode reste une estimation.

Les tests physiques antérieurs restent inchangés, notamment le contre-exemple WU à une seule source duale dont le résultat exact doit être zéro, les coûts non reconnus et l'absence de métadonnées. Les tests des moteurs physiques/politique, de leurs budgets et de leurs oracles restent exécutés. Ce lot n'étend aucun domaine exact.

Les cinq exemples ont aussi été ouverts avec 156 métadonnées Scryfall résolues et contrôlées : Midrange 14/14 lignes numériques ; Aggro 11/11 ; Control 12/12 après réparation de Wedding Announcement ; Limited 17/17 ; EDH 56 numériques et Tezzeret's Gambit explicitement indisponible dans l'estimation agrégée (phyrexian). Les métadonnées et refus ne sont pas remplacés par une valeur arbitraire. Preuve : `sample-decks-review.json`.

# 8. Revue complète des surfaces modifiées depuis la référence

L'inventaire versionné de tous les fichiers applicatifs modifiés est dans `proofs/source-inventory.txt`. La revue regroupe ces fichiers par comportement utilisateur ; elle ne prétend pas énumérer toutes les listes et actions possibles.

| Surface                                                        | Résultat de la revue / vérification                                                                                                                                                                                                 |
| -------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Collage, édition, exemple, analyse, nom, reload                | Défaut de persistance réparé ; parcours complets sur sauvegardes anciennes vides/remplies.                                                                                                                                          |
| Castability, play/draw, retrait, activation ramp               | Régression principale réparée ; 17 résultats et changements de valeurs exigés.                                                                                                                                                      |
| Main/sideboard/Commander                                       | Source post-board réparée ; scénarios existants de taille main, famille Limited/EDH, zone de commandement et horizons conservés.                                                                                                    |
| Analyse détaillée, graphiques, recommandations, risque         | Ouverture des sous-onglets testée ; les indisponibilités partielles sont intentionnelles pour ne pas inventer un score. Aucun score heuristique renommé probabilité exacte.                                                         |
| Mulligan et worker                                             | Parcours d'onglet, tests de simulation, arrêt fini, reprise gratuite et clonage conservés. Scores et seuils restent heuristiques.                                                                                                   |
| Manabase, sources, Karsten                                     | Parcours dédié et oracles de référence conservés. Aucun retrait de l'onglet.                                                                                                                                                        |
| Blueprint JSON                                                 | Export réel, contenu analysé : 40 cartes, 17 terrains, contrat `physical-v1`.                                                                                                                                                       |
| Blueprint PNG/PDF/CSV                                          | Revue supplémentaire par exports réels, signature des fichiers et présence de l'en-tête CSV ; voir `extra-review.json`. Cela ne certifie pas chaque pixel ou chaque lecteur PDF.                                                    |
| Historique et chargement                                       | Sauvegarde réelle, correction du résultat périmé au chargement d'un autre deck.                                                                                                                                                     |
| Import/export des sauvegardes et comparaison                   | Revue supplémentaire dans des contextes navigateur isolés. L'import remplace la sauvegarde par le contenu fourni, comportement préexistant ; ce n'est pas une fusion. Comparaison ouverte sur deux enregistrements du même contrat. |
| Anciennes analyses                                             | Conservation et étiquetage legacy ; bandeau contradictoire réparé. Refus de soustraire des résultats de contrats incompatibles conservé.                                                                                            |
| Navigation, Library/Learn, feedback, responsive, accessibilité | Campagne Linux existante intégrale, sans retrait de scénario ; extractions de hooks/helpers et liens relus. Aucun message à un tiers envoyé.                                                                                        |
| Démarrage, chargement différé et erreurs                       | Suspense par onglet et reprise du formulaire conservés ; contrôles d'absence de crash dans les parcours.                                                                                                                            |
| Publication et dépendances                                     | Build, budget, lint strict, types, audit npm et campagne Linux. Vercel natif seulement, aucun déploiement CLI.                                                                                                                      |

# 9. Changements de septembre volontairement conservés

Certains résultats autrefois numériques restent indisponibles dans les vues physiques : métadonnées inconnues, coûts ou terrains hors contrat, budget dépassé. Les scores globaux fondés sur un risque incomplet ne sont pas remplacés par un score favorable. Les anciennes comparaisons sans contrat compatible restent refusées. Les corrections sur le double comptage, la couleur C, les terrains engagés, les quantités, les commandants explicitement identifiés et le mulligan ne sont pas annulées pour retrouver d'anciens chiffres erronés.

# 10. Validation locale

Code `ee828cc` : **688 tests unitaires, 67 fichiers, zéro ignoré** ; lint zéro erreur/avertissement ; types, build et budget PASS ; audit npm toutes dépendances : zéro vulnérabilité. Douze parcours ciblés Chromium/WebKit réussis, zéro reprise, couvrant les six scénarios nouveaux/récupération. Rapports bruts conservés. Les preuves rouges sont conservées séparément des preuves finales.

# 11. Linux

Campagne intégrale `34013469156`, sur le commit `b15d740` (code applicatif de `ee828cc`, parcours de test mobile corrigé) : **486 scénarios réussis, 81 par profil, zéro ignoré, échec, flaky ou reprise**. Chaque résultat individuel a été vérifié (une seule exécution, réussie, retry 0). Les six rapports compressés, leurs empreintes et les digests GitHub sont conservés dans `proofs/linux/`. Aucun nouveau résultat n'est déduit des anciens 462 scénarios du correctif formulaire. Les profils émulent des appareils, ils ne constituent pas des essais matériels sur six appareils physiques.

# 12. Publication

La correction du formulaire `2250f12` est déjà publiée via Vercel natif et vérifiée par deux parcours publics. Pour `ee828cc`, la validation a d'abord été lancée sur `codex/probability-recovery`, puis le code validé localement et sur les trois profils de bureau a été poussé sur main (`b15d740`) après les douze parcours mobiles ciblés, sans déploiement manuel. La campagne complète finale a réussi sur ce même commit. Vercel natif `dpl_CU7GUxyaJrE3UpyoUoP9V4YUgi43` est READY pour `b15d740`, avec les alias `www.manatuner.app` et `manatuner.app`. Les six scénarios ciblés passent sur le site public (zéro reprise) ; la revue des cinq exemples donne les mêmes résultats qu'en local. Ces parcours utilisent le bundle public réel et des métadonnées de cartes contrôlées. CI `34013468685` et campagne Linux finale `34013469156` : SUCCESS, preuves consignées dans `validation.json`. Une clôture documentaire suit le code validé ; retrouver son SHA par git et vérifier son propre déploiement natif à la reprise.

# 13. Données utilisateur

Aucune remise à zéro du dépôt. Les fichiers utilisateur préexistants `playwright-report/index.html`, `test-results.json`, `test-results/.last-run.json`, `.claude/worktrees/`, `.mcp.json.bak.20260801-140417`, `.playwright-mcp/` et `docs/handoff/PROMPT-REPRISE-MANATUNER.txt` restent exclus. Les preuves nouvelles résident dans des dossiers dédiés. Les fichiers publics générés par le build sont restaurés à leur état propre initial. Les vérifications publiques utilisent des contextes de navigateur isolés.

# 14. Limites résiduelles

Les estimations agrégées peuvent surestimer ou sous-estimer le paiement réel, surtout avec sources multicolores partagées, entrées engagées, ramp conditionnel et choix hybrides. Le taux de retrait est une hypothèse du modèle historique, pas un modèle complet de l'adversaire. La détection Oracle par motifs reste imparfaite pour les mécaniques non auditées ; corriger Path to Exile ne certifie pas toutes les cartes.

Le potentiel exact demeure limité au goldfish et à ses terrains/producteurs audités, avec une borne de travail. La politique non clairvoyante a son manifeste fermé ; elle ne calcule pas la chance de tirer puis lancer la cible et exclut notamment mulligan, adversaire et effets non-mana. L'analyse détaillée et les scores sauvegardés utilisent leur contrat propre et ne changent pas de modèle lorsque l'on sélectionne l'estimation dans Castability.

# 15. Conclusion de la revue

Une régression fonctionnelle majeure récente est confirmée et corrigée : le remplacement de toutes les estimations par des refus du modèle exact. Une régression récente d'étiquetage est également corrigée. Quatre défauts plus anciens dans les parcours voisins ont été reproduits et réparés dans ce lot, en plus de la réparation du formulaire déjà publiée. Les suites et parcours examinés ne montrent pas d'autre régression démontrée à la clôture ; cela n'est pas une garantie universelle.

# 16. Reprise

Lire ce rapport, `validation.json` et la passation principale ; vérifier HEAD réel et origin/main. Garder les trois contrats distincts : estimation agrégée, potentiel exact et politique non clairvoyante. La priorité suivante est d'améliorer progressivement la couverture et l'ergonomie du modèle exact avec oracles indépendants, sans rendre de nouveau l'outil principal inutilisable aux réglages normaux. Ne pas annoncer les compteurs de ce lot pour un futur code non testé.

Commandes de reproduction complémentaires depuis la racine (après build et démarrage d'un preview sur le port 3002) : `node docs/math/probability-recovery-2026-09-06/browser-review.cjs` et `node docs/math/probability-recovery-2026-09-06/sample-review.cjs`. `BASE_URL` permet de vérifier le même parcours sur le site publié ; sorties dans `/tmp` par défaut, sans écraser les rapports utilisateur. Les 156 métadonnées contrôlées sont archivées dans `proofs/sample-cards.json.gz`.
