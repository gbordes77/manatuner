# 1 Verdict global

**OUI AVEC LIMITATIONS pour le domaine mathématique décrit ; aucune certification universelle.** Les corrections sont publiées sur Git (`main`) et Vercel. Le code de cette clôture correspond à `acfb37c6c551a5cc2cc370ecaacd2549a090f01b`, déployé en production sous `dpl_6uBQYYvgN7AtNwfgWCVSkuBySY6g`, READY, alias www.manatuner.app, HTTP 200 vérifié. La publication initiale demandée a précédé les corrections complémentaires ; les deux rapports historiques et les campagnes échouées restent conservés.

# 2 Résumé exécutif

Les résumés de sorts utilisent désormais le moteur physique et signalent les calculs indisponibles, sans substituer une approximation numérique. Quatre familles de terrains conditionnels sont prises en charge. Les recommandations utilisent leurs entrées effectivement calculées, y compris zéro. Le mulligan dispose d'un mode multijoueur explicite et de paiements illustratifs plus stricts. Les anciennes suites de tests sont réparées pour exercer les contrats actuels.

# 3 Architecture mathématique découverte

`physicalManaEngine.ts` est la source des probabilités potentielles par sort et des résumés. `spellSummary.ts` pondère le risque par les exemplaires physiques et retourne null si les calculs sont incomplets. Les anciennes API agrégées restent présentes pour compatibilité et certains indicateurs de sources ; elles ne constituent pas une preuve de lançabilité conjointe.

# 4 Modèles mathématiques utilisés

Le moteur énumère les mains et tirages sans remise et cherche l'existence d'une séquence légale. Un terrain par tour, mana dépensé une seule fois, engagement, dégagement et coûts des cinq accélérateurs audités sont représentés. Le sort cible reste une demande externe, sans condition de présence en main. L'existence d'une séquence peut utiliser la connaissance des tirages futurs : cette probabilité potentielle est une borne supérieure pour une politique qui ne les connaît pas.

# 5 Comparaison avec ManaTuner / références

Les références Karsten, hypergéométriques et réglementaires sont conservées dans les rapports précédents. Les textes Oracle des cinq battle lands ont été récupérés auprès de Scryfall et conservés dans `card-sources.json`. Deux terrains possédant des types de base ne sont pas nécessairement deux terrains de base. Les données Scryfall des tests navigateur sont figées dans `tests/fixtures/scryfall-audit.json` pour isoler la latence de l'application de celle du fournisseur.

# 6 Bugs trouvés

| Défaut                                                     | Correction                                                          | Vérification                                  |
| ---------------------------------------------------------- | ------------------------------------------------------------------- | --------------------------------------------- |
| Recommandations appelées avant ratio/CMC                   | Calcul préalable des entrées                                        | Deck sans terrain, courbe 5, cohérence 0      |
| Valeurs nulles ignorées par truthiness                     | Tests explicites contre undefined                                   | Avertissements à 0 %                          |
| Résumé retombant sur des marges approximatives             | Uniquement résultat physique ou motif d'indisponibilité             | Coût neige absent des valeurs numériques      |
| Taux de risque par nom, pas par exemplaire                 | Pondération par quantité, null si incomplet                         | 4 exemplaires à risque + 1 sûr = 80 %         |
| Absence de calcul assimilée à 0 % en comparaison           | Affichage indisponible, aucun delta inventé                         | Vérification TypeScript et interface          |
| Conditions d'arrivée non modélisées                        | Comptes et types des permanents déjà présents                       | 20 cas exhaustifs                             |
| Battle lands absents du seed                               | Ajout du cycle de cinq cartes                                       | Textes Oracle conservés                       |
| Premier mulligan multijoueur payant                        | Étage gratuit de sept cartes avant la chaîne payante                | 32 chemins indépendants                       |
| Pioche multijoueur T1 absente                              | Option explicite propagée au worker et aux exemples                 | Plan avec terrain pioché T1                   |
| Hybride ignoré, X omis, sort gratuit ignoré                | Parseur strict et paiement alternatif                               | Régressions de plans                          |
| Terrain inconnu considéré comme un mana                    | Aucune production inventée                                          | Régression existante corrigée                 |
| Fetchland traité comme mana direct dans les plans          | Plan indisponible hors modèle                                       | Garde sur les mécaniques non prises en charge |
| Ancien worker susceptible de publier un résultat périmé    | Annulation du worker précédent et contrôle de l'identifiant courant | Validation UI/worker                          |
| Marges de précision injustifiées                           | Nombre d'échantillons affiché sans promesse sur le score            | Relecture des libellés                        |
| Tests de cartes exclus, API inexistante                    | 12 tests publics réécrits et inclus                                 | Suite unitaire normale                        |
| Bannière recouvrant le bouton de fermeture mobile          | Empilement sous les drawers et modales                              | Test de fermeture mobile                      |
| Taux de destruction bloquant les calculs sans accélérateur | Paramètre ignoré quand il est sans effet sur le modèle              | Test de la ligne de sort                      |
| Panneaux ARIA absents pendant le chargement                | Conteneurs stables et Suspense interne                              | Régression asynchrone + axe navigateur        |
| Choix du menu avant son rendu                              | Attente du menu desktop ou mobile visible                           | Campagne six environnements                   |
| Tests E2E obsolètes                                        | Libellés actuels, menu mobile, vrais onglets, données fixes         | Campagne navigateur                           |

# 7 Tests indépendants

L'oracle des terrains conditionnels énumère les identités de cartes, les sous-ensembles de sept cartes, les tirages ordonnés et tous les ordres de pose. Il ne réutilise ni le moteur de probabilité ni son algorithme de paiement. Les cinq compositions sont testées aux tours 1 à 4 : fast, slow, check avec dual typé, battle avec basics, battle avec nonbasics typés.

Les [huit contre-exemples physiques](../physical-engine-2026-09-05/counterexamples-after.json) restent tous réussis. Par exemple M01 : référence 0,9555555555555556, moteur 0,9555555555555555 ; M02 : 0 contre 0 ; M08 : référence 0,9783854727408821, moteur 0,9783854727408823. Les erreurs résiduelles sont celles de l’arithmétique flottante, pas une preuve symbolique. Les [références exactes](../audit-2026-09-05/exact-results.json), [cas canoniques](../audit-2026-09-05/canonical.json) et [oracle Karsten](../audit-2026-09-05/karsten-oracle.json) donnent les autres valeurs attendues et produites.

# 8 Mulligan / Monte-Carlo

Pour les récompenses 4=[10,20], 5=[0,30], 6=[20,40], 7=[0,50], les valeurs payantes restent 15 ; 22,5 ; 31,25 ; 40,625. Une première reprise gratuite donne 45,3125, vérifiée sur 32 chemins. Les résultats de l'application restent des estimations de récompense heuristique, avec bottoming heuristique et arrêt volontaire à quatre cartes. Ce n'est ni une politique complète jusqu'à zéro carte, ni une probabilité de gagner.

Le contrôle statistique du tirage conservé dans [monte-carlo.json](../audit-2026-09-05/monte-carlo.json) utilise 1 000 000 simulations de production et 1 000 000 tirages indépendants, graine 20260905 : référence 1/3, production 0,333285, oracle simulé 0,333345. Erreur type attendue 0,000471405 ; demi-largeur normale à 95 % : 0,000923953. Les deux résultats sont compatibles avec cette référence. Ce contrôle valide ce cas d’échantillonnage, pas la pertinence stratégique du score de mulligan.

# 9 Mana rocks / dorks / ramp

Le modèle exact conserve les cinq contrats déjà audités : Llanowar Elves, Elvish Mystic, Fyndhorn Elves, Birds of Paradise, Sol Ring. Les plans du mulligan ne simulent pas le ramp. Les sources à sacrifice, restrictions, activation complexe, doublage ou recherche demandent encore un autre modèle ; elles ne sont pas admises comme sources exactes.

# 10 Sources colorées / Karsten

Les tables publiées restent des cibles conditionnelles distinctes de la probabilité brute sans mulligan. Le service d'accès aux sources rejette désormais les tours inexistants et les tailles d'échantillon invalides. Les scores de cohérence et recommandations restent des heuristiques, explicitement distinctes des probabilités par sort.

# 11 Cas limites

Coût nul, X=2, mana hybride, mana C, neige/phyrexian non pris en charge, sources inconnues, terrain sans production, zéro terrain, zéro cohérence, sideboard et zone de commandement, absence de métadonnées, dépassement du budget exact, types de base versus surtype basic, et premier tirage multijoueur sont distingués.

# 12 Modifications effectuées

Le [registre exhaustif des fichiers de cette vague](CHANGES.md) précise le motif de chaque modification.

Services de calcul et mulligan, worker, données de terrains, résumés et comparaisons UI, recommandations, libellés d'accueil, message sans JavaScript et suites de tests. Les fichiers utilisateur préexistants de rapports Playwright et répertoires locaux sont préservés et exclus des commits de correction.

Les analyses sauvegardées portent une version du modèle ; les anciennes estimations sont signalées et ne servent pas à des deltas entre modèles différents. Le service autonome de lançabilité refuse maintenant les mécaniques non prises en charge et calcule les marges hybrides comme unions. Un cache borné évite les évaluations exactes répétées, sans partager des résultats mutables.

Les correctifs compatibles de nanoid, DOMPurify et fflate suppriment les trois alertes npm de production identifiées. Playwright 1.63.0 et Vercel CLI 59.11.7 remplacent les outils obsolètes. L'audit des dépendances de développement peut encore signaler des alertes ; aucune certification de sécurité exhaustive n'est revendiquée.

Le verrouillage npm a également été régénéré dans un répertoire vierge : les dépendances optionnelles `@emnapi/core` et `@emnapi/runtime` manquaient lors de l’installation Linux. Une installation simulée propre avec npm 10, puis `npm ci` sur GitHub Actions, passent.

La campagne Linux a ensuite révélé trois défauts de tests : sélecteurs de bureau sur mobile, ancien profil iPad inexistant, chronométrage incluant les attentes du robot avant le clic. Les seuils de performance restent identiques, mesurés du clic réel au DOM visible ; les panneaux doivent désormais correspondre à l’onglet sélectionné. Les attributs ARIA des cinq onglets ont été reliés à leurs panneaux dans l’application. Ces ajustements sont publiés dans `13597e5` ; 12 scénarios ciblés passent localement avant relance Linux complète. Les résultats antérieurs restent dans `browser-regressions.json`.

Les relations ARIA restent désormais valides pendant le chargement différé : le conteneur du panneau demeure présent, avec un statut d’attente. Un test asynchrone reproduit cet état puis la résolution du composant. Les tests attendent également que le menu responsive soit rendu avant de choisir une branche.

Les mesures de réponse UI correspondent à la présence du DOM visible, comme les assertions `toBeVisible`. Un `MutationObserver` mesure depuis le clic réel et un contrôle indépendant retarde l’affichage de 200 ms pour exclure une résolution prématurée. L’attente artificielle de trois images a été retirée ; ces mesures ne sont pas une garantie de délai de peinture matérielle. Les essais sans vidéo et sans fondu n’avaient pas suffi à expliquer les anciens dépassements ; ils restent archivés.

# 13 Tests exécutés

Validation du commit `acfb37c6c551a5cc2cc370ecaacd2549a090f01b` : [CI Linux réussie](https://github.com/gbordes77/manatuner/actions/runs/33990476247). Commandes : `npm ci`, `npm run lint`, `npm run type-check`, `npm run test:unit`, `npm run build`, `node scripts/check-bundle-budget.mjs`, `npm audit --omit=dev`. Résultats : **593 tests réussis, 2 ignorés, 54 fichiers** ; types, build et budget réussis ; lint sans erreur avec 27 avertissements ; zéro vulnérabilité de production détectée.

Un ancien test enchaînait sept énumérations exactes sous une seule limite de cinq secondes et dépassait parfois ce délai sur Linux. Les sept tours sont maintenant des cas distincts : assertions et délai par cas inchangés. Une régression supplémentaire couvre le chargement asynchrone des panneaux.

Campagne navigateur : `gh workflow run browser-audit.yml --ref main`, puis, pour chacun des six projets, `npx playwright install --with-deps <browser>` et `PLAYWRIGHT_USE_PREVIEW=1 npx playwright test --project="<project>" --workers=1` après compilation. [Exécution Linux finale](https://github.com/gbordes77/manatuner/actions/runs/33990476313). **438 scénarios réussis, 6 ignorés, zéro échec et zéro reprise.** Les résultats machine sont consignés dans `validation.json`.

| Projet        | Réussis | Ignorés | Échecs | Réussis après reprise |
| ------------- | ------- | ------- | ------ | --------------------- |
| chromium      | 73      | 1       | 0      | 0                     |
| firefox       | 73      | 1       | 0      | 0                     |
| webkit        | 73      | 1       | 0      | 0                     |
| Mobile Chrome | 73      | 1       | 0      | 0                     |
| Mobile Safari | 73      | 1       | 0      | 0                     |
| iPad          | 73      | 1       | 0      | 0                     |

Le lancement direct de Firefox est bloqué sur cette machine macOS 27 par le [bug Mozilla 2060476](https://bugzilla.mozilla.org/show_bug.cgi?id=2060476), reproduit avec deux versions de navigateur. La validation Firefox a donc été exécutée sous Linux, sans modifier les permissions macOS. Les tests locaux ciblés WebKit et Safari mobile réussissent également. Les échecs antérieurs et les diagnostics de chronométrage restent dans `browser-regressions.json`.

# 14 Risques restant connus

Pas de certification universelle. Fetchlands, MDFC/pathways, paiement de vie, restrictions de dépense, activation complexe et accélérateurs non audités restent hors du domaine exact. Le moteur a un budget fini et peut refuser une composition pourtant simple. Les métadonnées sont une précondition. Les tableaux Karsten extrapolés et scores heuristiques ne sont pas des probabilités exactes. Le mulligan reste limité à quatre cartes et ne modélise ni adversaire, ni gain de partie, ni toutes les interactions.

# 15 Matrice de traçabilité

La [matrice complète initiale](../audit-2026-09-05/TRACEABILITY.md) et la [spécification indépendante](../audit-2026-09-05/SPECIFICATION.md) sont complétées par les domaines suivants :

| Domaine                     | Code                             | Preuve                                        |
| --------------------------- | -------------------------------- | --------------------------------------------- |
| ETB conditionnel            | physicalManaEngine.ts            | conditional-lands.test.ts, oracle indépendant |
| Résumés et inconnus         | deckAnalyzer.ts, spellSummary.ts | populations.test.ts, spell-summary.test.ts    |
| Reprise gratuite            | mulliganStopping.ts              | bellman.test.ts, 32 chemins                   |
| Multijoueur et coûts        | mulliganSimulatorAdvanced.ts     | multiplayer.test.ts, turnPlan.test.ts         |
| Terrains spéciaux           | landSeed.ts, landService.ts      | special-lands.spec.js, sources Oracle         |
| UI responsive / performance | tests/e2e                        | rapports Playwright isolés                    |

# 16 Verdict final

**Puis-je considérer les calculs mathématiques de cette application comme fiables ? OUI AVEC LIMITATIONS.** Les résultats du domaine physique explicitement pris en charge disposent de validations indépendantes et les cas refusés sont signalés. Les estimations de score, de sources conditionnelles et de mulligan ont leurs limites propres. Il serait faux de présenter toute l'application et toutes les cartes de Magic comme fiables à 100 %.
