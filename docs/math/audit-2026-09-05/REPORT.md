# AUDIT MATHÉMATIQUE MTG

> **État historique du premier audit.** Une série ultérieure de corrections fait désormais passer les huit contre-exemples. Voir le [compte rendu de fiabilisation](../physical-engine-2026-09-05/REPORT.md). Les valeurs et lignes ci-dessous décrivent la version auditée avant cette deuxième série.

## 1. Verdict global

**❌ NON VALIDÉ**

L'application entière ne peut pas être certifiée. Le noyau hypergéométrique et plusieurs cas restreints ont des preuves indépendantes solides après correction. En revanche, huit contre-exemples reproductibles réfutent encore des probabilités centrales de castabilité, de tempo et de ramp. Les scores de mulligan restent des heuristiques, même lorsque leur récursion de Bellman est correcte.

Audit réalisé le 5 septembre 2026 sur le répertoire de travail, sans commit ni déploiement. Les changements utilisateur présents avant l'audit ont été conservés. Le verdict porte sur les calculs, pas sur la qualité générale du produit.

## 2. Résumé exécutif

Vous pouvez vous fier aux tirages hypergéométriques simples dans le domaine testé, avec une population correctement définie. Vous ne devez pas traiter tous les pourcentages de l'application comme des probabilités exactes de lancer un sort ni les conseils de mulligan comme des décisions optimales de victoire.

Les réparations couvrent les entrées invalides, les coûts nuls et incolores, X=2, des land drops impossibles, le retard supplémentaire des dorks, le paiement physique dans le plan de mulligan, la dépendance du score à des pioches futures, des valeurs fictives d'affichage et neuf lignes Karsten. **29 régressions ciblées échouent sur le code initial et passent après correction.** Ce nombre compte des tests, pas 29 bugs indépendants.

Le problème principal est structurel : un profil contenant seulement les nombres de sources par couleur ne décrit pas leurs recouvrements physiques. De même, des probabilités indépendantes de producteurs « disponibles » ne décrivent pas le paiement et le séquençage d'une partie. Corriger localement une constante ne suffirait pas à certifier ces moteurs ; leur remplacement reste nécessaire et n'a pas été effectué dans cet audit.

## 3. Architecture mathématique découverte

Application ManaTuner 2.7.9 : React, TypeScript, Vite, MUI, Redux ; Vitest et Playwright. Le dépôt correspond lui-même au site donné comme référence : ce dernier n'est donc pas un second calculateur indépendant.

| Couche              | Modules principaux                                                                                  | Responsabilité                                                  |
| ------------------- | --------------------------------------------------------------------------------------------------- | --------------------------------------------------------------- |
| Population / cartes | `src/services/deckParser.ts`, `deckAnalyzer.ts`, `scryfall.ts`, `scryfallPersistentCache.ts`        | Quantités, zones, coût, résolution des cartes                   |
| Terrains            | `src/services/landService.ts`, données de terrains et cache                                         | Couleurs produites, ETB, conditions, fetch, MDFC                |
| Producteurs         | `src/services/manaProducerService.ts`, `src/data/manaProducerSeed.ts`, `src/types/manaProducers.ts` | Classification, coût, délai, activation, quantité produite      |
| Probabilités        | `src/services/castability/hypergeom.ts`                                                             | Masses et queues hypergéométriques, cartes vues                 |
| Castabilité         | `src/services/castability/acceleratedAnalyticEngine.ts`                                             | Mana total, couleurs, accélérateurs, modes P1/P2                |
| Tempo / sources     | `src/services/manaCalculator.ts`, `src/types/maths.ts`                                              | Sources effectives, tables et recommandations                   |
| Mulligan            | `src/services/mulliganSimulatorAdvanced.ts`, `mulliganStopping.ts`                                  | Mélange, London, score, arrêt optimal fini, exemples            |
| Agrégations         | `src/services/deckAnalyzer.ts`                                                                      | Courbe, accès aux couleurs, ratios, résumé des mains            |
| Présentation        | `ManaCostRow.tsx`, `analyzer/*`, `Enhanced*`, `export/ManaBlueprint.tsx`                            | Pourcentages, scores, seuils, exports                           |
| Ancien moteur       | `src/utils/manabase.ts`                                                                             | Autre analyse et simulation ; aucun import de production trouvé |

L'[inventaire syntaxique](INVENTORY.md) relève **579 sites dans 58 fichiers**, y compris de l'arithmétique de présentation/cache sans enjeu MTG. Il est complété par la matrice sémantique de la section 15 ; la présence dans l'inventaire ne signifie jamais PASS.

## 4. Modèles mathématiques utilisés

La [spécification indépendante](SPECIFICATION.md) détaille les objectifs, variables, hypothèses, domaines et limites de chaque modèle.

- **Hypergéométrique** : `P(X=k)=C(K,k)C(N-K,n-k)/C(N,n)` ; tirage uniforme sans remise. La production emploie les log-factorielles ; l'oracle emploie des combinaisons entières et l'énumération.
- **Mana d'une seule couleur** : somme sur le nombre l de terrains de `P(L_t=l) × P(au moins c sources parmi l)`, avec assez de mana total. Exact dans les cas testés sans tempo, restriction ou accélération.
- **Paiement multicolore** : doit être une somme multivariée avec appariement de sources physiques. La production utilise notamment le minimum des marginales : ce n'est pas l'intersection.
- **Tempo** : remplace les terrains par un nombre arrondi de sources effectives, calculé avec des coefficients d'arrivée dégagée. Heuristique, pas loi exacte de l'état du champ de bataille.
- **Accélération** : pondère des ensembles de producteurs par des Bernoulli supposées indépendantes ; plafonne les candidats et agrège les scénarios. Les dépendances de tirage et de paiement invalident l'exactitude générale.
- **Monte-Carlo** : fréquences de mains issues de Fisher–Yates ; reproductibilité avec seed explicite. Le test d'un million porte sur un événement de tirage, pas sur un million de parties MTG complètes.
- **Bellman** : `V4=E[R4]`, puis `Vk=E[max(Rk,V(k−1))]`, k=5..7. Exact pour les distributions empiriques fournies, la politique d'écart fixée et un arrêt forcé à quatre. R est un score heuristique observable, pas une probabilité de victoire.
- **Karsten** : tables d'un modèle conditionnel après politique London ; les extrapolations hors des lignes publiées restent heuristiques.
- **Scores** : moyennes, sommes pondérées et pénalités. La cohérence principale est désormais la moyenne d'accès aux couleurs requises à T2. Le score de recommandation vaut 100 moins une pénalité de cohérence (30/15/5), de sorts à risque (20/10) et de ratio de terrains (10 hors 35–45 %). Blueprint vaut `100×(0,4 cohérence + 0,2 max(0,1−5|ratio−0,4|) + 0,25 moyenneT2 + 0,15 moyenneT4)`, arrondi. Ces scores ne sont pas calibrés statistiquement.

Les poids des scores de mulligan, dans l'ordre efficacité/courbe/couleurs/début de partie/terrains, sont : Aggro 20/30/15/25/10 %, Midrange 25/25/20/15/15 %, Control 15/15/30/10/30 %, Combo 15/10/25/20/30 %. Les nombres de terrains min/optimal/max sont respectivement 1/2/3, 2/3/4, 3/4/5 et 2/3/4. Le score intermédiaire reste quantifié ; les valeurs Bellman ne sont arrondies qu'à leur sortie.

## 5. Comparaison avec ManaTuner / références

Les pages [Mathématiques](https://www.manatuner.app/mathematics) et [description complète](https://www.manatuner.app/llms-full.txt) ont été consultées. Elles contenaient des promesses d'exactitude, un mélange entre P1/P2 et play/draw, et des valeurs de tables incohérentes. Les fichiers locaux correspondants sont corrigés partiellement ; le site public n'a pas été redéployé.

La [table primaire de Frank Karsten](https://www.tcgplayer.com/content/article/How-Many-Sources-Do-You-Need-to-Consistently-Cast-Your-Spells-A-2022-Update/dc23a7d2-0a16-4c0b-ad36-586fcca03ad8/) recommande notamment **21 sources pour CC au T2 en 60 cartes**, et **24 pour CCCC au T4**. La cible dépend de la mana value et la mesure est conditionnelle après mulligan. Les valeurs 40/60/80/99 ont été transcrites séparément ; une règle de trois ne les reproduit pas toujours.

Le [code publié par l'auteur](https://github.com/frankkarsten/MTG-Math/blob/master/HowManySources2022Update.py) a été inspecté et sa politique reconstruite avec des fractions exactes, sans réutiliser le moteur du dépôt. Une différence mineure entre prose et code pour l'écart à six cartes a été conservée comme deux variantes d'oracle ; elle ne modifie pas les quatre seuils vérifiés ici.

Les [règles complètes Wizards du 19 août 2026](https://media.wizards.com/2026/downloads/MagicCompRules%2020260819.txt), notamment 103.5, 103.8, 107.4, 302.6 et 305.2, fondent les vérifications de London, pioche initiale, symboles de mana, mal d'invocation et terrain par tour.

## 6. Bugs trouvés

Dans les tableaux, « avant » désigne le code initial et « actuel » la version après audit. Les écarts sont exprimés en **points de pourcentage**. Les lignes référencent les fichiers après correction.

### Défauts centraux non corrigés

| ID / sévérité | Fichier:ligne                                               | Actuel → attendu ; preuve et exemple                                                                                                                                              | Statut      |
| ------------- | ----------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------- |
| M01 ÉLEVÉ     | `src/services/castability/acceleratedAnalyticEngine.ts:168` | WU, N=10, deux plaines, deux îles, six non-terrains, T2/play : 97,777778 % → 43/45=95,555556 %. Minimum des marginales ≠ intersection. Écart +2,222222 points.                    | NON CORRIGÉ |
| M02 CRITIQUE  | même fichier:168                                            | WU, N=10, un biland W/U, trois forêts, six non-terrains, T2/play : 80 % → 0 %. Un seul terrain ne paie pas deux pips simultanés.                                                  | NON CORRIGÉ |
| M03 ÉLEVÉ     | `src/services/manaCalculator.ts:278`                        | 24 terrains bleus toujours engagés, N=60, accès à U au T2 : 0 % → 97,838547 %. Il suffit d'en avoir un dans les sept initiales et de le poser T1 ; il se dégage T2.               | NON CORRIGÉ |
| M04 ÉLEVÉ     | `src/services/castability/acceleratedAnalyticEngine.ts:342` | N=10, une forêt, un Llanowar Elves, huit non-sources, dork disponible T2, aucune interaction : 49 % → 7×6/(10×9)=46,666667 %. Le produit des marginales ignore la dépendance.     | NON CORRIGÉ |
| M05 ÉLEVÉ     | même fichier:342                                            | N=10, une forêt, un Sol Ring ; demande générique de deux manas T1 : 0 % → 46,666667 %. On peut payer puis engager Sol Ring pendant le même tour.                                  | NON CORRIGÉ |
| M06 CRITIQUE  | même fichier:558                                            | N=10, une forêt, deux Elves ; trois manas T3 : 0 % → 49/120=40,833333 %. Les deux exemplaires peuvent être lancés T1/T2 et produire T3 ; le moteur réduit le type à une présence. | NON CORRIGÉ |
| M07 ÉLEVÉ     | `src/services/manaCalculator.ts:487`                        | `{1}{U}`, N=60, une île seulement : 13,333333 % → 0 %. Le résumé tempo ne vérifie pas le coût générique total.                                                                    | NON CORRIGÉ |
| M08 ÉLEVÉ     | `src/services/manaCalculator.ts:460`                        | `{W/U}`, N=60, 12 plaines et 12 îles, T1 : 80,935331 % → 97,838547 %. L'union des sources n'est pas le maximum de leurs probabilités séparées.                                    | NON CORRIGÉ |

Les huit résultats proviennent de [tests stricts reproductibles](../../../tests/math-audit/known-limitations.test.ts) et de [mesures enregistrées](known-limitations.json). Leur maintien comme échecs attendus dans la suite ordinaire ne vaut pas validation ; le mode strict échoue huit fois.

### Défauts corrigés

| ID / sévérité      | Fichier:ligne                                                                         | Avant → attendu/actuel ; raison mathématique                                                                                                                                                                          | Statut                                                          |
| ------------------ | ------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- | ----------------------------------- |
| C01 MOYEN          | `src/services/castability/hypergeom.ts:60`                                            | K>N, n>N, NaN ou populations fractionnaires pouvaient donner 100 %. Validation du domaine avant les cas triviaux ; convention actuelle 0. Seuil 1,5 pour une variable entière : ancien 0 → P(X≥2)=1/3 dans N10/K4/n3. | CORRIGÉ                                                         |
| C02 ÉLEVÉ          | `src/services/castability/acceleratedAnalyticEngine.ts:262`                           | Quatre manas de terrains au T1, N60/L24 : 27,922524 % → 0 %. Les terrains vus ne sont pas tous posables ce tour.                                                                                                      | CORRIGÉ pour terrains ordinaires                                |
| C03 MOYEN          | même fichier:168 et 766                                                               | Coût nul, aucun terrain : 0 % → 100 %. Zéro obligation n'exige aucune source ; le tour naturel minimal est T1.                                                                                                        | CORRIGÉ                                                         |
| C04 ÉLEVÉ          | même fichier:342                                                                      | Elves lancé T1 annoncé indisponible T2. Le délai comptait deux fois le mal d'invocation ; retiré. La probabilité jointe reste M04.                                                                                    | CORRIGÉ pour le décalage                                        |
| C05 CRITIQUE       | `src/services/mulliganSimulatorAdvanced.ts:582`                                       | Un biland + forêt payaient WU, ou un biland payait W puis U durant le même tour. Recherche d'un paiement avec chaque source utilisable une seule fois, y compris pour le générique.                                   | CORRIGÉ dans le plan de mulligan                                |
| C06 CRITIQUE       | même fichier:464 et 512                                                               | Score de keep influencé par la bibliothèque future ; terrains non basiques supposés produire toutes les couleurs. Score désormais fondé sur la main observable et les couleurs réellement déclarées.                  | CORRIGÉ dans ce score                                           |
| C07 ÉLEVÉ          | même fichier:126 ; `src/components/ManaCostRow.tsx:567`                               | `{C}` pouvait disparaître du coût. Il reste un pip incolore obligatoire, distinct du générique.                                                                                                                       | CORRIGÉ dans ces parseurs                                       |
| C08 CRITIQUE       | `src/services/deckAnalyzer.ts:1126`                                                   | 24 forêts et 36 sorts rouges : cohérence 83,333333 % → 0 %. Les couleurs inutilisées ne contribuent plus artificiellement 100 % à la moyenne.                                                                         | CORRIGÉ dans la cohérence principale                            |
| C09 ÉLEVÉ          | même fichier:1188 et 1341                                                             | Pourcentages par sort tirés d'un score global arrondi ; accès à une couleur fixé à 95/98/99/99,5 %. Remplacés par les calculs correspondant au coût et au tirage. Le moteur sous-jacent conserve M01/M02.             | CORRIGÉ pour les valeurs fabriquées                             |
| C10 ÉLEVÉ          | `src/components/ManaCostRow.tsx:318` et 421                                           | Zéro terrain remplacé par 24 ; coût X affiché avec X=2 mais calcul différent ; générique traité par constantes. Zéro préservé, X effectif transmis, générique calculé.                                                | CORRIGÉ pour ces chemins                                        |
| C11 CRITIQUE       | `src/types/maths.ts:134` et 272                                                       | Neuf cellules 60 cartes différentes de la publication, dont CC/T2 20→21 et CCCC/T4 25→24. Ajout des formats publiés 40/80/99.                                                                                         | CORRIGÉ pour les lignes publiées                                |
| C12 CRITIQUE       | `src/components/analyzer/KarstenTargetDelta.tsx:55`                                   | `{R}` T1 et `{8}{R}{R}` T10 : cible 11→14. Quatre pips abaissés à trois : cible 20→24 au T4. Sélection du besoin maximal en sources.                                                                                  | CORRIGÉ                                                         |
| C13 MOYEN          | `src/services/manaCalculator.ts:192` ; `mulliganSimulatorAdvanced.ts:1045`            | Optimisation sans demande : exception/valeur invalide → objet vide ; zéro simulation : division par zéro → rejet explicite.                                                                                           | CORRIGÉ                                                         |
| C14 MOYEN          | `src/components/EnhancedCharts.tsx` ; `EnhancedSpellAnalysis.tsx` ; `deckAnalyzer.ts` | Plusieurs `                                                                                                                                                                                                           |                                                                 | ` remplaçaient un résultat nul par un résultat favorable. Utilisation de valeurs nulles distinctes de zéro. | CORRIGÉ dans les chemins identifiés |
| C15 MOYEN          | `src/services/mulliganSimulatorAdvanced.ts:1125`                                      | Exemples de mains accompagnés d'une bibliothèque reconstruite dans un autre ordre. Conservation de la bibliothèque réellement simulée et de ses cartes écartées.                                                      | CORRIGÉ                                                         |
| C16 MOYEN          | `src/services/deckAnalyzer.ts:1476`                                                   | Deck de 40 terrains : 0 % de mains « terrible » → 100 %. La catégorie sept terrains était plafonnée par la catégorie zéro/six terrains.                                                                               | CORRIGÉ                                                         |
| C17 FAIBLE à MOYEN | `src/pages/MathematicsPage.tsx`, `public/llms-full.txt`, composants d'analyse         | P1/P2 confondus avec play/draw ; score présenté comme taux de sorts lancés ; promesses d'exactitude générales. Libellés et avertissements corrigés localement.                                                        | CORRIGÉ dans les surfaces listées ; autres textes non certifiés |

### Autres défauts ou limites établis par lecture, sans validation exhaustive

| ID / sévérité            | Emplacement                                                                | Comportement / attendu / exemple                                                                                                                                                              | Statut                                           |
| ------------------------ | -------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------ |
| R01 CRITIQUE             | `src/services/deckAnalyzer.ts:1093`                                        | Agrège les cartes sans filtrer les zones à ce niveau, contrairement à CastabilityTab. Une réserve ne doit pas changer N de la bibliothèque jouée.                                             | NON CORRIGÉ ; intégration par zone non certifiée |
| R02 MOYEN                | `src/services/manaCalculator.ts:109`                                       | Compare une probabilité brute à 90 % mais calcule le nombre à ajouter depuis une table conditionnelle ; peut recommander un nombre négatif. Atteindre la table ne garantit pas le seuil brut. | NON CORRIGÉ                                      |
| R03 ÉLEVÉ                | `src/components/ManaCostRow.tsx:324`                                       | Si les métadonnées nécessaires manquent, certains chemins renvoient encore 95/90 ou 85/75. Une absence de donnée devrait être une absence d'estimation.                                       | NON CORRIGÉ ; chemins de repli                   |
| R04 MOYEN                | `src/components/export/ManaBlueprint.tsx:71`                               | Moyennes T2/T4 incluant les couleurs inutilisées, plus replis 0,8/0,9. Le score peut rester flatteur ; aucune calibration externe.                                                            | NON CORRIGÉ                                      |
| R05 ÉLEVÉ, chemin ancien | `src/utils/manabase.ts:122` et 226                                         | Utilise le nombre Karsten comme nombre de succès à piocher ; mulligans sans écart London ; pioche simulée par floor((t−1)×0,4) ; compteur keep cumulatif pouvant dépasser 1.                  | NON CORRIGÉ ; aucun appel actif trouvé           |
| R06 ÉLEVÉ                | `src/services/landService.ts:464`, 586, 773 ; `manaProducerService.ts:211` | Conditions et MDFC approximées, couleurs de fetch sans vérifier les cibles physiques disponibles, restrictions de production incomplètes. L'événement légal dépend d'informations absentes.   | NON CORRIGÉ ; carte par carte non certifié       |

Ces observations sont séparées des huit réfutations numériques ; aucune couverture exhaustive de toutes les cartes Scryfall n'est revendiquée.

## 7. Tests indépendants

Trois méthodes indépendantes ont été utilisées : combinaisons entières, énumération exhaustive avec paiement physique et second échantillonneur stochastique. L'oracle TypeScript n'importe aucune fonction mathématique de production.

- **2 431 comparaisons de masses** avec tous les sous-ensembles pour N=0..10, tous K et toutes tailles de main possibles.
- Masses, queues et normalisation pour N=40,60,80,99,100,250,1000 ; invariants de monotonie et domaine.
- **28 configurations monochromes** : coûts R, 1R, RR, 1RR, RRR, RRRR et 2RR dans quatre populations 40/60/99/100. Écart absolu maximal : **9,34×10⁻¹⁴**. Les permutations de noms de couleur sont symétriques dans ce modèle.
- Cinq autres configurations canoniques, dont zéro source, une source, toutes les sources et trois couleurs fournies par des terrains arc-en-ciel distincts.
- Huit cas multicolores/tempo/ramp échoués, explicités en section 6.

| Configuration                                      |    Référence exacte | Production après audit |        Écart | Résultat            |
| -------------------------------------------------- | ------------------: | ---------------------: | -----------: | ------------------- |
| N60/K0, ≥1 dans sept                               |                 0 % |                    0 % |            0 | PASS                |
| N60/K1, ≥1 dans sept                               |  7/60 = 11,666667 % |            11,666667 % | <10⁻¹⁰ point | PASS                |
| N60/K24, ≥1 dans sept                              |         97,838547 % |            97,838547 % | <10⁻¹⁰ point | PASS                |
| N60/K60, ≥1 dans sept                              |               100 % |                  100 % |            0 | PASS                |
| N12, quatre terrains WUB sans restriction ; WUB/T3 | 42/55 = 76,363636 % |            76,363636 % | <10⁻¹⁰ point | PASS, cas restreint |
| N40/L16/S9 ; R/T1                                  |         85,895532 % |            85,895532 % | <10⁻¹⁰ point | PASS                |
| N40/L16/S9 ; RR/T2                                 |         58,968820 % |            58,968820 % | <10⁻¹⁰ point | PASS                |
| Coût nul, zéro terrain                             |               100 % |                  100 % |            0 | PASS                |
| Quatre manas de terrains ordinaires T1             |                 0 % |                    0 % |            0 | PASS                |

Les entrées, valeurs exactes converties en décimal, résultats de production et écarts sont enregistrés dans [exact-results.json](exact-results.json), [canonical.json](canonical.json) et [known-limitations.json](known-limitations.json). Le cas WUB réussi ne valide pas les autres configurations tricolores ; M01 et M02 réfutent déjà l'algorithme général.

## 8. Mulligan / Monte-Carlo

Le test différentiel utilise N=10, K=4, n=3, X≥2 : vérité exacte **1/3**, également obtenue sur les 120 mains possibles. Sur **1 000 000** de mélanges de production : **33,3285 %** ; second échantillonneur indépendant : **33,3345 %**. Les écarts à la vérité sont −0,004833 et +0,001167 point. La marge normale à 95 % attendue est **±0,092395 point** ; les deux observations sont compatibles avec elle. Seeds : 20260905 et 74219.

La simulation avancée accepte un nombre configurable de tirages par taille de main, avec quatre tailles 4/5/6/7 ; sa valeur par défaut dans le service est 5 000 par taille. Sans seed explicite, Math.random empêche la reproductibilité exacte. Avec seed, la suite est reproductible ; ce test ne constitue pas une batterie de certification du RNG.

À 10 000 observations Bernoulli, la marge maximale à 95 % est ±0,98 point ; pour 72,43 %, environ ±0,876 point. Deux décimales ne signifient donc pas deux décimales de précision. L'intervalle des fréquences de mains n'est pas un intervalle pour les scores Bellman.

L'écart London remet bien les cartes physiques sous la bibliothèque après sept cartes tirées. En revanche, le choix des cartes est glouton et heuristique, l'arrêt est forcé à quatre, le mulligan Commander gratuit et les règles multijoueurs ne sont pas intégrés au simulateur avancé, et le plan ne modélise pas le ramp.

Bellman a été isolé dans une fonction pure, sans changer la récurrence. Sur des lois à deux récompenses, l'oracle donne V4=15, V5=22,5, V6=31,25, V7=40,625 ; production identique, également comparée aux 16 chemins de tirage. La récursion est validée pour ce problème d'arrêt ; la pertinence stratégique des récompenses et l'optimalité de l'écart ne le sont pas.

## 9. Mana rocks / dorks / ramp

**Le séquençage complet n'est pas mathématiquement correct.** Le décalage supplémentaire du dork est réparé, mais M04–M06 restent ouverts. Le moteur ne paie pas réellement une succession d'actions sur des sources physiques partagées.

En plus des contre-exemples mesurés : candidats limités à 18 types, scénarios de multiplicité tronqués/agrégés, indépendance supposée, traitement fragile des probabilités égales à 1, couleurs attribuées sans état complet, consommables et doubleurs approximés. Les coûts d'activation, cibles de ramp, terrain supplémentaire disponible en main, sacrifice et host d'une aura demandent une modélisation propre.

Le taux de survie est une hypothèse réglable, pas une probabilité universelle de MTG. La correction du plan de mulligan ne corrige pas le moteur analytique de ramp : ce sont deux chemins distincts.

## 10. Sources colorées / Karsten

**Les multi-pips d'une seule couleur sont corrects dans le modèle simple testé. Les coûts multicolores généraux ne le sont pas.**

Neuf valeurs 60 cartes sont corrigées : (pips,tour) 1/4 : 11→10 ; 1/5 : 10→9 ; 2/2 : 20→21 ; 2/6 : 14→13 ; 2/7 : 13→12 ; 3/4 : 20→21 ; 3/6 : 18→17 ; 3/7 : 17→16 ; 4/4 : 25→24. Les autres lignes publiées ont été conservées ou ajoutées par format.

L'oracle London rationnel vérifie les frontières suivantes :

| Bibliothèque / terrains | Coût et cible | Sources sous le seuil → P exacte | Sources suffisantes → P exacte |
| ----------------------- | ------------- | -------------------------------- | ------------------------------ |
| 60 / 25                 | CC T2, 91 %   | 20 → 90,300724 %                 | 21 → 92,896095 %               |
| 60 / 25                 | CCCC T4, 93 % | 23 → 86,668054 %                 | 24 → 93,515105 %               |
| 40 / 17                 | CC T2, 91 %   | 13 → 88,688126 %                 | 14 → 92,632035 %               |
| 99 / 41                 | CC T2, 91 %   | 29 → 90,771348 %                 | 30 → 92,295246 %               |

Ces résultats correspondent à la variante « code publié ». Les deux variantes et fractions exactes figurent dans [karsten-oracle.json](karsten-oracle.json). Les 76 cellules publiées ne sont pas toutes recalculées par l'oracle : distinguer transcription vérifiée et validation numérique des quatre frontières.

Les extrapolations hors table, les sources conditionnelles, les objectifs à plusieurs couleurs et les calculs avec une bibliothèque Commander mal identifiée restent non certifiés. Une bibliothèque de 100 cartes dans les tests numériques n'est pas une validation du format Commander complet.

## 11. Cas limites

PASS sur les cas testés : N=0, K=0, K=N, n=0, seuil supérieur aux cartes vues/disponibles, population invalide, NaN, seuil fractionnaire, distributions normalisées, absence de sources, une source, coût nul, `{C}`, X=2 dans le hook public, zéro terrain conservé, absence de demande dans l'optimiseur, zéro simulation rejeté, main de sept terrains classée à 100 % dans sa catégorie.

Tours 1 à 10 vérifiés séparément play/draw, sur populations 40/60/99/100. Pour les coûts génériques/couleurs simples, les erreurs numériques mesurées sont très inférieures à la précision affichée. La log-factorielle évite les débordements de factorielles usuels ; elle n'élimine pas toute perte de précision pour des tailles arbitraires. Des entrées entières énormes pourraient également poser un problème d'allocation mémoire.

FAIL sur les huit cas centraux détaillés. Non certifiés : interactions de symboles hybrides répétés, phyrexian, neige, twobrid, faces multiples, choix irréversibles de pathways, règles Commander et combinaisons complexes de sources conditionnelles.

## 12. Modifications effectuées

Les fichiers modifiés avant le début de l'audit (`playwright-report/index.html`, `test-results.json`, `test-results/.last-run.json` et les fichiers non suivis préexistants) n'ont pas été réécrits par l'audit. Les sorties Playwright sont isolées dans `/tmp`. Les trois fichiers de feeds/sitemap régénérés par le build, initialement propres, ont été remis à leur contenu initial. Aucun commit, reset, checkout ou déploiement.

| Fichiers modifiés par l'audit                                                                                                                                                                              | Motif                                                                                   |
| ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------- |
| `src/services/castability/hypergeom.ts`                                                                                                                                                                    | Domaine, queues et entrées invalides                                                    |
| `src/services/castability/acceleratedAnalyticEngine.ts`                                                                                                                                                    | Coût nul, terrain par tour, délai dork, limites explicites                              |
| `src/services/manaCalculator.ts`                                                                                                                                                                           | Formats Karsten, demande vide                                                           |
| `src/services/deckAnalyzer.ts`                                                                                                                                                                             | Cohérence, calculs par sort, probabilités réelles, zéros, catégorie sept terrains       |
| `src/services/mulliganSimulatorAdvanced.ts`                                                                                                                                                                | Paiement physique, main observable, C, bibliothèque des exemples, validation itérations |
| `src/services/mulliganStopping.ts` (nouveau)                                                                                                                                                               | Récurrence pure testable indépendamment                                                 |
| `src/types/maths.ts`                                                                                                                                                                                       | Neuf corrections et tables publiées par format                                          |
| `src/components/ManaCostRow.tsx`                                                                                                                                                                           | C, X, zéro terrain, générique et accès aux hooks testés                                 |
| `src/components/analyzer/KarstenTargetDelta.tsx`                                                                                                                                                           | Choix de la demande maximale, quatre pips, format                                       |
| `src/components/EnhancedCharts.tsx`, `EnhancedSpellAnalysis.tsx`                                                                                                                                           | Préservation des probabilités nulles et libellés                                        |
| `src/components/analyzer/QuickVerdict.tsx`, `CastabilityTab.tsx`, `MulliganTab.tsx`                                                                                                                        | Scores et limites explicités                                                            |
| `src/pages/MathematicsPage.tsx`, `src/data/glossary.ts`, `public/llms-full.txt`                                                                                                                            | Correction d'énoncés mathématiques et de promesses excessives                           |
| `src/services/manaCalculator.test.ts`, `src/services/castability/__tests__/acceleratedAnalytic.test.ts`                                                                                                    | Attentes existantes corrigées sur preuves                                               |
| `tests/math-audit/oracle.ts`, `regressions.test.ts`, `karsten.test.ts`, `independent.test.ts`, `ui-probabilities.test.tsx`, `bellman.test.ts`, `canonical.test.ts`, `known-limitations.test.ts` (nouveaux) | Oracles, contre-exemples, non-régression et limites explicites                          |
| `scripts/math-audit-oracle.py`, `scripts/math-audit-inventory.cjs` (nouveaux)                                                                                                                              | Recalcul rationnel et inventaire reproductible                                          |
| `docs/math/audit-2026-09-05/*` (nouveaux)                                                                                                                                                                  | Spécification, rapport, résultats, traçabilité, journaux                                |

## 13. Tests exécutés

Répertoire courant : `/Volumes/DataDisk/_Projects/Project Mana base V2`. Snapshot initial : `/tmp/mtg-audit-baseline`, créé par archive Git, sans changer le checkout utilisateur. Les rapports navigateur sont isolés, car leurs chemins habituels contenaient déjà des modifications utilisateur.

| Validation                                                          | Commande exécutée                                                                       | Initial                                           | Après corrections                                   |
| ------------------------------------------------------------------- | --------------------------------------------------------------------------------------- | ------------------------------------------------- | --------------------------------------------------- |
| Suite Vitest habituelle, composants/intégration inclus selon config | `npm run test:unit`                                                                     | 440 PASS, 2 skipped ; 37 fichiers                 | 496 PASS, 8 expected fail, 2 skipped ; 44 fichiers  |
| Régressions math et table, appliquées au snapshot                   | `npx vitest run tests/math-audit/regressions.test.ts tests/math-audit/karsten.test.ts`  | 29 FAIL sur 29                                    | 29 PASS dans la suite finale                        |
| Audit math ciblé                                                    | `npx vitest run tests/math-audit`                                                       | Non applicable                                    | 56 PASS, 8 expected fail                            |
| Contre-exemples en mode strict                                      | `MTG_AUDIT_STRICT=1 npx vitest run tests/math-audit/known-limitations.test.ts`          | Non nécessaire au verdict initial                 | 8 FAIL sur 8, exit 1                                |
| Types                                                               | `npm run type-check`                                                                    | PASS                                              | PASS                                                |
| Lint                                                                | `npm run lint`                                                                          | 0 erreur, 25 avertissements                       | 0 erreur, 27 avertissements                         |
| Build                                                               | `npm run build -- --outDir /tmp/mtg-audit-build`                                        | PASS (snapshot : commande de build, voir journal) | PASS                                                |
| Oracle Karsten exact                                                | `python3 scripts/math-audit-oracle.py > docs/math/audit-2026-09-05/karsten-oracle.json` | Sans production importée                          | 8 probabilités rationnelles, 4 frontières vérifiées |
| Inventaire AST                                                      | `node scripts/math-audit-inventory.cjs`                                                 | Sans verdict implicite                            | 579 sites, 58 fichiers                              |
| Diff                                                                | `git diff --check`                                                                      | —                                                 | PASS                                                |

Les huit expected fail sont de vrais défauts mathématiques non réparés, déclarés explicitement avec `it.fails`. Ils ne comptent pas parmi les 496 PASS. Le mode strict expose les assertions en échec afin que cette convention ne puisse pas servir de preuve d'exactitude.

Deux avertissements lint nouveaux concernent `react-refresh/only-export-components`, dus aux exports des hooks de test de `ManaCostRow.tsx`. Aucun avertissement préexistant n'a été masqué ou désactivé.

### Playwright complet

Commandes exactes :

```
npx playwright test --config=/tmp/mtg-audit-baseline/audit-playwright.config.js --workers=4
npx playwright test --config=/tmp/mtg-audit-final/audit-playwright.config.js --workers=4
```

Ces configurations reprennent les six projets et les tests du dépôt ; seules les destinations des rapports, le port et le répertoire du serveur changent. Elles sont conservées dans `baseline-playwright.config.txt` et `final-playwright.config.txt`.

Initial : **365 FAIL, 67 PASS, 6 skipped** en 14,3 minutes. Après modifications principales : **365 FAIL, 67 PASS, 6 skipped** en 14,4 minutes. Comparaison par identité projet/fichier/titre : **365 échecs communs, zéro nouvel échec, zéro échec résolu**. Le run navigateur a été lancé avant la toute dernière correction de la catégorie sept terrains ; cette correction est couverte par la suite Vitest complète relancée et par le build final, pas par un nouveau run des 438 scénarios navigateur.

Répartition finale des 365 échecs : 216 exécutables de navigateur absents ; 35 sélecteurs ambigus ; 114 délais/assertions, comprenant des sélecteurs/libellés obsolètes. Les dernières catégories ne doivent pas être réduites automatiquement à des problèmes d'environnement : leurs détails sont conservés dans `e2e-errors.json`. La liste des identités et la comparaison sont dans `e2e-comparison.json`.

### Tests exclus de la configuration courante

La configuration Vitest exclut `tests/mtg-specific/card-types/**`. Une configuration temporaire identique sauf cette exclusion a permis de les exécuter sans modifier celle du projet :

```
# Depuis le répertoire courant
npx vitest run tests/mtg-specific/card-types/special-lands.spec.js --config=/tmp/mtg-audit-final/audit-edge.config.mjs

# Depuis /tmp/mtg-audit-baseline
npx vitest run tests/mtg-specific/card-types/special-lands.spec.js --config=/tmp/mtg-audit-baseline/audit-edge.config.mjs
```

Résultat : **12 FAIL avant et après**, `TypeError: parseDeckList is not a function`. Le test importe une fonction qui n'est plus exportée. Cela ne vérifie aucune propriété des terrains et ne constitue pas une nouvelle régression. Les configurations et journaux sont conservés ici.

### Limites de la campagne

Aucune couverture exhaustive carte par carte ni certification du RNG complet. Les suites navigateur et de cartes spéciales ne passent pas ; aucune affirmation de build « entièrement validé » n'est fondée sur leurs résultats. Les scripts de package ciblant les mêmes répertoires ne constituent pas des suites indépendantes et n'ont pas été comptés une seconde fois.

## 14. Risques restant connus

- Les huit défauts M01–M08 interdisent une certification globale ; les annotations d'interface ne les réparent pas.
- Les métadonnées Scryfall et les listes seed ont été inspectées, pas vérifiées exhaustivement carte par carte. Le texte oracle est interprété par motifs, avec restrictions et dépendances manquantes. Identité couleur et mana réellement produit restent confondus dans certains chemins anciens.
- Bases et bilands inconditionnels peuvent être exacts pour un coût monochrome ; bilands/tricolores avec exigences simultanées échouent en général. Triomes/taplands exigent le séquençage ; fetchlands exigent des cibles restantes ; pain lands supposent le paiement de vie possible ; fast/slow/check/battle/filter sont heuristiques. Pathways/MDFC exigent un choix de face et ne sont pas deux cartes.
- Restrictions de type de créature, légendaire, trésors, rituels, auras, doubleurs et autres productions temporaires ne sont pas généralement représentés de façon exacte. Une source « any color » ne devrait jamais créer C, mais certains masques amont l'incluent.
- Les parsing de coûts spéciaux et des faces multiples restent incomplets. Les cartes non résolues peuvent encore déclencher des pourcentages constants dans des replis.
- Le comptage global du deck et les filtres de zones divergent entre chemins. Une liste de 99/100 cartes ne suffit pas à déduire toutes les règles Commander, les partenaires ou la zone de commandement.
- Le score Blueprint reste influencé par les couleurs inutilisées ; les ratios de sorts à risque peuvent compter des entrées distinctes plutôt que des exemplaires. Les catégories « perfect/good » de main se recouvrent : elles ne constituent pas toutes les parts d'une partition à sommer.
- La sélection des cartes à écarter, les poids d'archétype et les seuils de santé ne sont pas calibrés sur des parties. La classe supérieure d'histogramme est centrée par une règle pouvant afficher 105 pour un score maximal de 100 ; non corrigé ici.
- Les bibliothèques après mulligan, tirages supplémentaires, scry/surveil, interactions adverses et effets de remplacement ne sont pas intégralement modélisés.
- Le code ancien `utils/manabase.ts` reste dangereux à réactiver. Les constantes historiques de multiplicateurs fetch/dual n'ont pas de justification probabiliste générale.
- Le PASS du noyau n'est pas transférable automatiquement à toute fonction qui l'appelle : définir la mauvaise population ou le mauvais événement suffit à produire une valeur fausse avec une formule exacte.

## 15. Matrice de traçabilité

Les chemins de services abrégés sont relatifs à `src/services/` ; « moteur de base », « moteur analytique » et « moteur accéléré » désignent `src/services/castability/acceleratedAnalyticEngine.ts` ; « mulligan » désigne `src/services/mulliganSimulatorAdvanced.ts`. Les composants sont dans `src/components/`, les types dans `src/types/`, les utilitaires dans `src/utils/`.

PASS signifie seulement le domaine et l'événement effectivement testés. PARTIEL = certains sous-problèmes prouvés ; HEURISTIQUE = non calibré ; NV = non validé indépendamment ; FAIL = réfutation ou test en échec. Tests abrégés : tous les fichiers nommés sont dans `tests/math-audit/`, sauf indication contraire. HG = hypergéométrique, CR = règles Wizards.

| Fonctionnalité                                 | Modèle / référence                           | Emplacement code                                                      | Validation indépendante                                   | Tests / preuve                                  | Statut                                |
| ---------------------------------------------- | -------------------------------------------- | --------------------------------------------------------------------- | --------------------------------------------------------- | ----------------------------------------------- | ------------------------------------- |
| Masse exacte X=k                               | HG sans remise                               | `src/services/castability/hypergeom.ts:103`                           | BigInt + tous sous-ensembles N≤10                         | `independent.test.ts`, 2 431 comparaisons       | PASS                                  |
| Queues ≥k, ≤k, ≥1                              | Somme de masses HG                           | `castability/hypergeom.ts`                                            | Combinaisons exactes, cas extrêmes                        | `independent`, `canonical`, `regressions`       | PASS, domaine testé                   |
| Domaine / NaN / seuil réel                     | Support d'une loi discrète                   | `castability/hypergeom.ts:60`                                         | Contre-exemples puis correction                           | `regressions`                                   | PASS corrigé                          |
| Stabilité / normalisation                      | Log-factorielle vs entiers                   | `castability/hypergeom.ts:44`                                         | N jusqu'à 1000, somme 1                                   | `independent`                                   | PASS, pas toute taille JS             |
| Wrappers de probabilités                       | Même événement HG                            | `manaCalculator.ts:21`, `utils/manabase.ts:98`, `deckAnalyzer.ts:872` | Wrappers publics comparés à BigInt ; delegation inspectée | `independent`                                   | PASS pour noyau transmis correctement |
| Cartes vues T1..T10                            | 6+t ou 7+t ; CR103.8                         | `castability/hypergeom.ts:27`, `manaCalculator.ts:47`                 | Calcul direct par tour et format                          | `independent`                                   | PASS en duel                          |
| Nombre de terrains vus                         | HG(N,L,n)                                    | `deckAnalyzer.ts:1418`, moteur de base                                | Énumération des masses                                    | `independent`                                   | PASS sous population correcte         |
| Terrain par tour / coût nul                    | CR305.2 ; paiement vide                      | moteur de base:262                                                    | Impossibilité T1 et vacuité du coût                       | `regressions`                                   | PASS corrigé pour terrains ordinaires |
| Coût générique, mana total                     | Somme trivariée                              | moteur de base:262                                                    | Oracle séparé, 28 lignes                                  | `independent`, `ui-probabilities`               | PASS sans restrictions                |
| Une couleur, 1–4 pips                          | HG conditionnelle aux terrains               | moteur de base:168                                                    | Combinaisons exactes, quatre formats                      | `independent`                                   | PASS sans tempo/ramp                  |
| Deux couleurs simultanées                      | Intersection + appariement                   | moteur de base:168                                                    | Toutes mains et paiement physique                         | M01, M02                                        | FAIL                                  |
| Trois couleurs                                 | Appariement de sources                       | moteur de base:168                                                    | N12/quatre terrains WUB ; 220 mains                       | `canonical`                                     | PARTIEL, un cas spécial PASS          |
| Sources multicolores partagées                 | Une source utilisée une fois                 | moteur analytique:168 ; mulligan:582                                  | Biland + forêt ; deux sorts séparés                       | M02 ; `regressions`                             | FAIL analytique ; plan corrigé        |
| Hybride W/U                                    | Union des paiements                          | `manaCalculator.ts:460`                                               | Union exacte de 24 sources                                | M08                                             | FAIL                                  |
| Pip C                                          | Incolore ≠ générique ; CR107.4               | mulligan:126 ; `ManaCostRow.tsx:567`                                  | Cas C sans source C et inspection du coût                 | `regressions`, `ui-probabilities`               | PARTIEL corrigé ; masques amont NV    |
| Coût X                                         | X fixé avant calcul                          | `ManaCostRow.tsx:567`                                                 | Hook public X=2 vs coût effectivement transmis            | `ui-probabilities`                              | PASS pour ce chemin                   |
| Neige / phyrexian / twobrid / hybrides répétés | Branches légales de paiement                 | parseurs de coût multiples                                            | Lecture des branches seulement                            | SPECIFICATION §4                                | NV                                    |
| P1, conditionnelle d'accès                     | Quotient de probabilités                     | moteur de base:262                                                    | Inspection du conditionnement sur terrains du tour        | Tests existants, pas oracle général P1 accéléré | PARTIEL                               |
| P2, mana disponible                            | Événement non conditionnel de sources        | moteur de base:262                                                    | Oracle monochrome ; M01/M02                               | `independent`, M01/M02                          | PARTIEL, FAIL général                 |
| Tirer ET lancer le sort                        | Probabilité jointe du sort et des ressources | Pas de moteur complet identifié                                       | Événement absent de la formule courante                   | Spécification §2                                | NON PRIS EN CHARGE                    |
| Tables Karsten 60                              | Table primaire 2022                          | `types/maths.ts:134`                                                  | Transcription + quatre frontières London                  | `karsten.test.ts`, oracle Python                | PARTIEL : lignes publiées corrigées   |
| Tables 40/80/99                                | Modèles de format publiés                    | `types/maths.ts:272`                                                  | Transcription ; frontières 40/99 recalculées              | `math-audit-oracle.py`                          | PARTIEL ; 80 non recalculé            |
| Adaptation hors table                          | Arrondi proportionnel / table historique     | `manaCalculator.ts:69`, `KarstenTargetDelta.tsx:55`                   | Écart avec modèles publiés constaté                       | Limites documentées                             | HEURISTIQUE                           |
| Pivot de demande / quatre pips                 | Maximum du besoin de sources                 | `KarstenTargetDelta.tsx:55`                                           | R/T1 vs 8RR/T10 ; BBBB/T4                                 | `regressions`                                   | PASS corrigé                          |
| Conseil « ajouter X pour 90 % »                | Mélange table conditionnelle et HG brute     | `manaCalculator.ts:109`                                               | Événements incompatibles identifiés                       | R02                                             | FAIL conceptuel                       |
| Allocation de terrains optimisée               | Proportion de besoins et arrondis            | `manaCalculator.ts:192`                                               | Cas vide corrigé ; pas d'oracle d'optimalité              | `regressions`                                   | HEURISTIQUE, pas optimiseur prouvé    |
| Bases / bilands dégagés                        | Sources physiques sans condition             | `landService.ts`, seed ; moteur                                       | Oracle mono et cas biland                                 | `independent`, M02                              | PARTIEL                               |
| Triomes / taplands                             | Arrivée engagée puis dégagement              | `manaCalculator.ts:278`, `landService.ts`                             | Terrain T1 disponible T2                                  | M03                                             | FAIL                                  |
| Fast / slow / check / battle                   | Conditions de champ de bataille              | `landService.ts:586`                                                  | Coefficients inspectés, pas arbre d'états                 | SPECIFICATION §5                                | HEURISTIQUE                           |
| Fetchlands                                     | Cible légale restante                        | `landService.ts:746`, 773                                             | Couleurs déduites du texte, bibliothèque cible absente    | R06                                             | NV / incomplet                        |
| Pathways / MDFC                                | Choix de face irréversible                   | `landService.ts:464`, parseurs                                        | Classification inspectée                                  | R06 ; tests cartes exclus en échec              | NV                                    |
| Pain / filter / utilitaires                    | Vie, mana d'entrée, restrictions             | `landService.ts`, seed                                                | Hypothèses seulement, pas séquence exhaustive             | SPECIFICATION §5                                | NV                                    |
| Production limitée au type de sort             | Restriction de paiement                      | `manaCalculator.ts:259`                                               | Filtrage créature partiel inspecté                        | R06                                             | HEURISTIQUE                           |
| Sources effectives / stratégies tempo          | Somme pondérée puis arrondi                  | `manaCalculator.ts:278`, 361                                          | M03 démontre non-équivalence à une loi                    | M03                                             | FAIL comme probabilité exacte         |
| Résumé tempo d'un sort                         | Minimum des marges de couleur                | `manaCalculator.ts:401`                                               | Coût 1U avec une seule île                                | M07                                             | FAIL                                  |
| Détection des rocks/dorks                      | Texte oracle + seed                          | `manaProducerService.ts:211`, `manaProducerSeed.ts`                   | Lecture des motifs et exemples                            | Pas de recensement indépendant de toutes cartes | NV                                    |
| Dork : premier tour disponible                 | Délai ; CR302.6                              | moteur accéléré:342                                                   | Elves T1 disponible T2                                    | `regressions`                                   | PASS pour le décalage corrigé         |
| Dork : probabilité disponible                  | Tirage ET paiement                           | moteur accéléré:342                                                   | Deux cartes requises dans sept                            | M04                                             | FAIL                                  |
| Rock disponible le même tour                   | Séquence coût puis activation                | moteur accéléré:342                                                   | Sol Ring T1 ; deux cartes dans sept                       | M05                                             | FAIL                                  |
| Plusieurs exemplaires de ramp                  | États distincts de permanents                | moteur accéléré:558                                                   | 120 mains × 3 pioches                                     | M06                                             | FAIL                                  |
| Ensembles de producteurs                       | Bernoulli, candidats≤18, scénarios agrégés   | moteur accéléré:558                                                   | Dépendances et multiplicité réfutées                      | M04, M06                                        | FAIL comme calcul exact               |
| Couleurs d'accélérateurs                       | Affectation de pips et capacité              | moteur accéléré:388, 469                                              | Lecture seulement, jointure non représentée               | Limites §9                                      | NV                                    |
| Survie / retrait                               | (1−r)^exposition                             | moteur accéléré:142                                                   | Formule correcte sous risque indépendant supposé          | r non calibré                                   | HEURISTIQUE                           |
| Multi-mana lands / doubleurs                   | Mélanges de groupes et bonus                 | moteur accéléré:210 ; types producteurs                               | Pas d'oracle exhaustif d'activation                       | Limites §9                                      | NV                                    |
| Rituels / trésors / auras / ramp de terrains   | Actions consommables / cibles / états        | moteur accéléré ; service producteurs                                 | État complet absent                                       | Limites §9                                      | NV / incomplet                        |
| Courbe / moyenne CMC / ratios                  | Sommes pondérées par quantité                | `deckAnalyzer.ts:1074`                                                | Lecture du calcul, dépend du parsing et des zones         | Tests existants seulement                       | NV global ; arithmétique élémentaire  |
| Cohérence colorée principale                   | Moyenne T2 couleurs requises                 | `deckAnalyzer.ts:1126`                                                | Zéro rouge dans deck rouge donne zéro                     | `regressions`                                   | Corrigé ; HEURISTIQUE                 |
| Accès à au moins une source                    | HG des terrains producteurs                  | `deckAnalyzer.ts:1341`                                                | N60/L24 vs BigInt                                         | `regressions`                                   | PASS sous classification correcte     |
| Résumé par sort                                | Estimation du moteur selon coût              | `deckAnalyzer.ts:1188`                                                | Sort sans source : zéro ; formules remplacées             | `regressions`, M01/M02                          | PARTIEL                               |
| Résumé des mains par terrains                  | HG + probabilité de sort précoce             | `deckAnalyzer.ts:1418`                                                | Sept terrains 100 % ; masses vérifiées                    | `regressions`, `independent`                    | PARTIEL ; catégories se recouvrent    |
| Zones et taille de bibliothèque                | Conservation des cartes jouables             | `deckParser.ts:162`, `deckAnalyzer.ts:1093`, `CastabilityTab.tsx`     | Divergence de filtres constatée                           | R01                                             | NV global                             |
| Commander multijoueur                          | 99 cartes, pioche T1, mulligan gratuit       | filtres UI et simulateur avancé                                       | Oracle indépendant les représente, production incomplète  | Oracle Python vs règles                         | NON PRIS EN CHARGE complètement       |
| London : redraw/écart                          | Sept cartes et remise sous bibliothèque      | mulligan:1045                                                         | Identités physiques et ordre inspectés                    | Tests existants ; régressions de bibliothèque   | PARTIEL                               |
| Politique d'écart                              | Classement par archétype                     | mulligan:960 ; `chooseBottom:146`                                     | Aucun oracle d'optimalité générale                        | SPECIFICATION §6                                | HEURISTIQUE                           |
| Paiement du plan de main                       | Appariement sans double engagement           | mulligan:582, 663                                                     | Contre-exemples physiques corrigés                        | `regressions`                                   | PARTIEL ; ramp absent                 |
| Score observable de keep                       | Récompense de la main connue                 | mulligan:417, 464, 512                                                | Invariance envers futures pioches                         | `independent`                                   | Corrigé ; HEURISTIQUE                 |
| RNG et mélange                                 | Fisher–Yates, seed explicite                 | mulligan:68, 937                                                      | Million de tirages, urne indépendante                     | `independent`                                   | PASS statistique sur événement testé  |
| Nombre d'itérations / fréquences               | s/m                                          | mulligan:1045                                                         | m=0 rejeté, normalisation                                 | `regressions`, tests existants                  | PARTIEL                               |
| Erreur Monte-Carlo                             | sqrt(p(1−p)/m)                               | `MulliganTab.tsx`, résultats audit                                    | IC95 de Bernoulli calculé séparément                      | `monte-carlo.json`                              | PASS pour fréquences, pas scores      |
| Arrêt Bellman                                  | Récursion finie V4..V7                       | `mulliganStopping.ts:5`                                               | Arbre 16 chemins et calcul exact                          | `bellman.test.ts`                               | PASS pour récompense fournie          |
| Optimalité stratégique du mulligan             | Taux de victoire hypothétique                | Pas de récompense de victoire calibrée                                | Aucune preuve de victoire                                 | Poids documentés §4                             | NON VALIDÉ                            |
| Score santé / recommandations                  | Pénalités et seuils                          | `EnhancedRecommendations.tsx:108`                                     | Formule et poids relevés                                  | Aucun calibrage indépendant                     | HEURISTIQUE                           |
| Score Blueprint                                | Somme pondérée .4/.2/.25/.15                 | `export/ManaBlueprint.tsx:71`                                         | Formule relevée, couleurs inutilisées conservées          | R04                                             | HEURISTIQUE                           |
| Taux de sorts à risque                         | Comptage sous seuil / entrées                | `EnhancedSpellAnalysis.tsx`                                           | Risque quantité vs entrée identifié                       | Pas d'oracle complet                            | NV                                    |
| Arrondis / zéro / replis UI                    | Conversion 0..1 vers 0..100                  | `ManaCostRow`, `EnhancedCharts`, `EnhancedSpellAnalysis`              | Hooks C/X/0 ; contre-exemples zéro                        | `ui-probabilities`, R03                         | PARTIEL corrigé, replis restants      |
| Texte mathématique / P1/P2                     | Sémantique de l'événement affiché            | `MathematicsPage`, `llms-full`, `QuickVerdict`                        | Comparaison avec implémentation et primaires              | Relecture ciblée                                | PARTIEL corrigé                       |
| Ancienne castabilité / recommandations         | Mauvais seuil HG / identité couleur          | `utils/manabase.ts:122`                                               | Analyse de l'événement                                    | R05                                             | FAIL ; chemin inactif                 |
| Ancienne simulation / keepRate                 | Pseudo-pioches et cumul sur tours            | `utils/manabase.ts:226`                                               | Compteur peut dépasser 1                                  | R05                                             | FAIL ; chemin inactif                 |
| Source de vérité Scryfall / caches             | Classification avant probabilité             | `scryfall.ts`, caches, `landService`, producteurs                     | Chaîne inspectée sans corpus oracle complet               | Tests cartes exclus : 12 échecs préexistants    | NV global                             |

## 16. Verdict final

### Puis-je considérer les calculs mathématiques de cette application comme fiables ?

**NON, pas globalement.** Les tirages simples et la castabilité monochrome sous hypothèses restreintes ont été comparés à des références indépendantes et passent. Des corrections démontrées ont été livrées avec leurs régressions. Mais les contre-exemples multicolores, tempo et ramp restent dans le code, et le mulligan optimise une récompense heuristique plutôt qu'un résultat de partie vérifié.

Le prochain travail nécessaire pour une certification est un modèle de sources physiques et d'actions légales partagé entre les calculs, avec oracle exhaustif sur petits decks, politique London explicite par format et nouvelles comparaisons statistiques. Le présent audit constitue une preuve de non-validité globale et un socle de validation, pas un certificat de fiabilité de tous les résultats.
