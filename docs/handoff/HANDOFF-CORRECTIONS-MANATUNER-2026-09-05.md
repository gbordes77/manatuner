> **Priorité de reprise : réparation du mode Exact goldfish (6 septembre).** Lire [le rapport](../math/goldfish-recovery-2026-09-06/REPORT.md). Retrait nul appliqué par ce mode, Guildgates simples admises avec contrat vérifié, texte moderne d’arrivée engagée reconnu, cache terrains 2.2, explorations répétées réduites et budget du tableau borné à un million. 695 unitaires ; seuls des parcours Chromium ciblés exécutés. L’utilisateur a demandé l’arrêt des campagnes multi-navigateurs exhaustives : ne pas les relancer. Retrouver le HEAD et le SHA Vercel réels ; les chiffres et publications ci-dessous sont historiques.

> **Reprise prioritaire — 6 septembre 2026, réparation de l'analyseur et revue des régressions.** Lire d'abord [le rapport des incidents et de la revue complète](../math/probability-recovery-2026-09-06/REPORT.md), [les validations et preuves](../math/probability-recovery-2026-09-06/validation.json) et [la réparation du formulaire](../math/editor-recovery-2026-09-06/REPORT.md). Les blocs suivants sont historiques.
>
> **Code publié : `b15d74075b346b34a0088493e46c74074b3da7ec`**, correctifs applicatifs jusqu'à `ee828cc` après `6f736c6`, formulaire en `2250f12`. Vercel natif `dpl_CU7GUxyaJrE3UpyoUoP9V4YUgi43`, READY, alias publics vérifiés ; six parcours publics et cinq exemples vérifiés. La clôture documentaire vient ensuite : retrouver le HEAD réel, origin/main et le SHA Vercel, sans supposer que b15d740 est encore HEAD. L'application reste 2.7.9.
>
> **Changement de contrat d'interface important :** Castability propose par défaut **Mana estimates**, estimation agrégée explicitement heuristique, et un choix distinct **Exact goldfish potential**. L'ancien moteur exact obligatoire rendait toutes les lignes indisponibles avec les réglages courants de retrait. Ne pas réintroduire ce blocage. Un refus exact ne déclenche jamais une estimation silencieuse. Le modèle de politique non clairvoyante reste séparé. Les analyses détaillées/sauvegardées gardent leur contrat `physical-v1` ; le choix du tableau ne change pas implicitement leurs scores.
>
> **Réparations acquises :** formulaire récupérable après reload sans effacer le deck ; probabilités visibles avec paramètres normaux ; chargement d'un autre deck sans anciens résultats ; sources recalculées après sideboard ; Path to Exile exclu de notre ramp et cache de producteurs v3 ; coût réel de la face avant des cartes transformables ; ancien résultat non présenté comme modèle physique actuel. Aucun coût générique ni pourcentage de secours inventé dans le tableau. Les cinq exemples : 14/14, 11/11, 12/12, 17/17 et EDH 56 résultats + un refus phyrexian explicite.
>
> **Validation de ce lot :** 688 tests unitaires / 67 fichiers, zéro ignoré ; lint zéro erreur/avertissement ; types/build/budget PASS ; audit npm toutes dépendances zéro vulnérabilité. Douze parcours ciblés desktop et douze mobiles réussis ; exports PNG/PDF/CSV, sauvegarde/import/comparaison aussi vérifiés. Campagne Linux finale `34013469156` : **486 réussis, 81 par profil, zéro ignoré/échec/reprise** ; six rapports bruts archivés avec empreintes. CI main `34013468685` : SUCCESS. Les campagnes intermédiaires avec erreurs de préparation/navigation des tests ne sont pas comptées comme réussites. Les références historiques 593/438 et suivantes restent attachées à leurs commits.
>
> **Limites conservées :** chevauchement des sources, séquençage et ramp approximatifs dans l'estimateur ; coûts spéciaux non admis laissés indisponibles ; potentiel exact limité au goldfish et à son budget ; politique à manifeste fermé, sans mulligan/adversaire/non-mana. Pas de probabilité de tirer puis lancer le sort, pas de fiabilité universelle à 100 %. Préserver les annexes utilisateur ci-dessous et ne pas lancer de déploiement CLI en double.

> **Mise à jour de reprise — 6 septembre 2026.** Lire d'abord [le rapport des cinq points, en 16 sections](../math/extensions-2026-09-06/REPORT.md), [le contrat payment-policy-v2](../math/extensions-2026-09-06/MODEL.md) et [les validations](../math/extensions-2026-09-06/validation.json). Les blocs suivants décrivent les étapes historiques ; leurs priorités et compteurs ne sont plus l'état courant.
>
> **Code applicatif validé et publié : `0bb387aa903c8360107db889fe8c874e256d8c2b`**, après `7e66007` (extension) et correction de sa dépendance implicite de build. La clôture documentaire vient ensuite : retrouver son SHA avec `git log`, vérifier `git status`, `origin/main` et la version réelle, sans supposer que 0bb387a est encore HEAD. L'application reste version 2.7.9 ; le nouveau contrat porte son propre identifiant.
>
> **Les cinq points sont implémentés dans un domaine fermé :** 14 fetchs physiques ; 60 MDFC dont 50 sort/terrain ; neige, coûts hybrides/phyrexian/vie, restriction créature, signets, rituels/trésors/flashback et cinq sorts de ramp audités ; regroupement/mémoïsation et worker annulable avec budget ; suppression des 27 avertissements lint et remplacement des huit tests ignorés. Le manifeste contient 102 cartes canoniques / 222 alias, plus Arcane Signet à identité explicite et le pont des terrains documentés. Ce mode optionnel est accessible dans Castability. Il optimise les décisions de ressources sans voir les futures pioches. La cible est extérieure : ce n'est ni la probabilité de tirer puis lancer, ni le potentiel historique p1/p2, ni un score heuristique. Ne pas fusionner ces résultats.
>
> **Validations actuelles :** 669 unitaires réussis, 0 ignoré, 63 fichiers ; 450 scénarios Linux réussis (75 par profil), 0 ignoré, 0 échec, 0 reprise ; lint 0/0, types/build/budget PASS, audit npm de toutes les dépendances 0 vulnérabilité. Installation/build dans une copie propre et pré-rendu Vercel : 101 pages réussies, 0 échec. [Campagne Linux](https://github.com/gbordes77/manatuner/actions/runs/33994988310), [CI main](https://github.com/gbordes77/manatuner/actions/runs/33995665745). Six rapports bruts compressés et empreintes sont conservés dans `proofs/linux/`.
>
> **Publication applicative vérifiée :** Vercel natif `dpl_5Xm73hbGBveAS2XY6p6qt3UBBrSr`, READY, SHA 0bb387a et alias `www.manatuner.app`, HTTP 200 et deux parcours publics réussis. La clôture documentaire conserve le code testé ; vérifier son propre déploiement à la reprise. Ne pas lancer de déploiement CLI supplémentaire. Le CLI Vercel n'est plus une dépendance ; `esbuild` est déclaré directement et le pré-rendu importe `@playwright/test`. `npm run deploy` rappelle la procédure native ; rollback via le tableau de bord, voir [le parcours de publication](../deployment/NATIVE-DEPLOYMENT.md).
>
> **Reste hors modèle :** autres contrats non audités, capacités non-mana (dont pioche), interactions/adversaire, combat, mulligan dans cette politique, stratégies plus générales et certains decks trop coûteux. Les résultats dépassant le budget restent indisponibles, sans probabilité partielle ni fallback inventé. Étendre une famille à la fois avec oracle indépendant. A1–A3 et les anciens pathways restent acquis. Préserver les fichiers annexes utilisateur listés plus bas : ils n'ont pas été incorporés aux lots publiés.

> **Mise à jour de reprise — 5 septembre 2026, soirée.** Lire d’abord [le nouveau rapport en 16 sections](../math/corrections-2026-09-05/REPORT.md) et [ses validations](../math/corrections-2026-09-05/validation.json). A1–A3 sont implémentés en `3d2730d` ; les dix pathways terrain/terrain sont ajoutés en `fcf566a`, avec oracle indépendant. Le corps ci-dessous décrit le point de départ historique, notamment ses anciens nombres et priorités. B1 fetchlands reste à traiter ; aucun élargissement aux MDFC sort/terrain ni à la vie. Validations de fcf566a : 621 unitaires réussis / 2 ignorés, 438 navigateurs Linux réussis / 6 ignorés, aucun échec ni reprise ; types, build et budget PASS, lint 0 erreur / 27 avertissements, audit production 0 vulnérabilité. CI et déploiement natif READY vérifiés, ainsi que deux parcours sur www.manatuner.app. Le commit de clôture qui contient cette mise à jour est documentaire ; retrouver son SHA avec git log. Préserver les fichiers annexes listés ci-dessous. La prochaine reprise doit encore vérifier HEAD et les SHA des validations, sans inférer l’état publié.

# Passation — poursuite des corrections ManaTuner

Date : 5 septembre 2026. Ce document permet de reprendre dans une nouvelle discussion sans relire toute la conversation. Les constats décrivent la version ci-dessous ; commencer par vérifier si le dépôt a évolué.

## 1. Objectif et état de départ

L’utilisateur veut poursuivre les corrections pour maximiser la fiabilité mathématique et fonctionnelle de ManaTuner. Il a demandé de publier le travail existant sur Git et Vercel avant de poursuivre : cela a été fait. Il attend des corrections mises en œuvre et vérifiées, pas une simple liste de recommandations.

**État acquis : OUI AVEC LIMITATIONS.** Aucun échec ne restait dans les campagnes finales exécutées. Cela ne certifie ni toutes les mécaniques de Magic, ni une stratégie optimale de jeu. Ne pas transformer les limites connues en promesse de fiabilité universelle, et ne pas présenter les extensions ci-dessous comme des bugs déjà démontrés.

- Projet local : `/Volumes/DataDisk/_Projects/Project Mana base V2`.
- Dépôt : https://github.com/gbordes77/manatuner ; branche `main`.
- Dernier commit de la discussion précédente : `ac790fda71426dae2b135802f637d0dcb105af43` — clôture documentaire.
- Dernier commit applicatif validé : `acfb37c6c551a5cc2cc370ecaacd2549a090f01b`.
- Production : https://www.manatuner.app.
- Déploiement du commit de clôture : `dpl_B1wemb4nY5AoTR5bugBBDYxZyuHZ`, production READY et HTTP 200 vérifiés à la fin de la discussion précédente.
- Vercel déploie automatiquement les pushes sur `main` via son intégration GitHub. Le job de déploiement GitHub Actions est volontairement désactivé pour éviter les déploiements en double.

Les deux fichiers de cette passation sont créés localement après `ac790fd`. Ils ne font pas partie des commits applicatifs et des campagnes cités ici. Leur présence locale ne prouve pas leur inclusion dans une autre branche ou un nouveau worktree.

## 2. Lectures indispensables

Tous les chemins suivants sont relatifs à la racine du projet.

| Document                                                          | Utilité                                                                                                                                                                                                        |
| ----------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `docs/math/completion-2026-09-05/REPORT.md`                       | Rapport final actuel, exactement 16 sections ; lire en premier.                                                                                                                                                |
| `docs/math/completion-2026-09-05/validation.json`                 | Résultats machine, SHA du code testé et empreintes SHA-256.                                                                                                                                                    |
| `docs/math/completion-2026-09-05/CHANGES.md`                      | Registre des fichiers corrigés et motifs.                                                                                                                                                                      |
| `docs/math/completion-2026-09-05/browser-regressions.json`        | Échecs historiques, diagnostics et corrections ; ces anciennes campagnes rouges ne sont pas l’état final.                                                                                                      |
| `docs/math/physical-engine-2026-09-05/MODEL.md`                   | Événement probabiliste, états physiques, p1/p2 et limites. Le paragraphe initial sur les catégories de terrains est historique : lire son avertissement et le rapport final pour les quatre familles ajoutées. |
| `docs/math/physical-engine-2026-09-05/counterexamples-after.json` | Huit contre-exemples corrigés, valeurs attendues et produites.                                                                                                                                                 |
| `docs/math/audit-2026-09-05/SPECIFICATION.md`                     | Spécification indépendante initiale.                                                                                                                                                                           |
| `docs/math/audit-2026-09-05/TRACEABILITY.md`                      | Matrice complète initiale.                                                                                                                                                                                     |
| `docs/math/audit-2026-09-05/REPORT.md`                            | Audit historique ; son verdict ancien n’annule pas les corrections ultérieures.                                                                                                                                |
| `docs/math/completion-2026-09-05/INVENTORY.md`                    | Inventaire de 598 sites arithmétiques ; filet syntaxique, pas preuve de validation de chacun.                                                                                                                  |

La demande d’audit originale est aussi disponible localement dans `/Users/guillaumebordes/.codex/attachments/b60cc05c-cbab-438d-b2a2-61966eb0b83c/pasted-text.txt`. Ne pas dépendre exclusivement de cette pièce jointe pour reprendre : les spécifications et preuves sont dans le dépôt.

## 3. Validations à préserver

| Contrôle                  | Dernier résultat vérifié                        |
| ------------------------- | ----------------------------------------------- |
| Tests unitaires           | **593 réussis, 2 ignorés, 54 fichiers**.        |
| Types                     | PASS.                                           |
| ESLint                    | 0 erreur, 27 avertissements.                    |
| Build et budget de bundle | PASS.                                           |
| Audit npm de production   | 0 vulnérabilité détectée à cette date.          |
| Navigateurs Linux         | **438 réussis, 6 ignorés, 0 échec, 0 reprise**. |

Les six projets Playwright sont `chromium`, `firefox`, `webkit`, `Mobile Chrome`, `Mobile Safari`, `iPad` : 73 scénarios réussis et un ignoré par projet. Ces profils émulent des appareils ; ils ne constituent pas des essais sur six appareils physiques.

Preuves GitHub :

- Code applicatif, CI : https://github.com/gbordes77/manatuner/actions/runs/33990476247.
- Code applicatif, campagne navigateur complète : https://github.com/gbordes77/manatuner/actions/runs/33990476313.
- Commit documentaire final, CI : https://github.com/gbordes77/manatuner/actions/runs/33991114059.

Ne pas republier ces chiffres comme ceux d’une nouvelle version sans l’avoir testée. Les artefacts navigateur GitHub ont une rétention de sept jours ; les synthèses et empreintes restent dans le dépôt. Ne pas présumer qu’un fichier temporaire `/tmp` de l’ancienne discussion existe encore.

Preuves mathématiques existantes : oracle BigInt hypergéométrique, énumérations exhaustives de petits decks, 20 cas de terrains conditionnels avec oracle distinct, huit contre-exemples physiques, 76 cellules de référence Karsten, contrôle du tirage par deux séries d’un million de simulations, Bellman avec reprise gratuite vérifié sur 32 chemins. Voir les fichiers de résultats pour les hypothèses et valeurs exactes.

## 4. Contrat mathématique actuel — ne pas le modifier implicitement

Le moteur calcule le **potentiel de paiement** : existence d’au moins une séquence légale pour une histoire de cartes tirées. La recherche peut choisir des actions en connaissant les futures pioches de cette histoire. C’est donc une borne supérieure pour une politique non clairvoyante, et non sa probabilité de réussite.

Le sort cible est une **demande extérieure** au tirage. Le résultat n’est pas la probabilité de tirer le sort puis de le lancer. Le modèle principal n’applique pas de mulligan à sa distribution initiale.

- Bibliothèque uniforme sans remise ; main initiale de sept ; play/draw explicite.
- Tours 1 à 10, bibliothèque jusqu’à 1 000 cartes, sous réserve d’entrées valides.
- Budget fini : 250 000 unités de travail par défaut dans l’API, 50 000 dans les lignes de l’interface.
- Coûts génériques, W/U/B/R/G/C, hybrides pris en charge par le parseur strict ; X fixé à 2 dans l’interface actuelle.
- Un terrain posé par tour ; engagements, dégagements, ETB, paiements de producteurs et consommation unique du mana représentés ; aucun mana flottant conservé entre tours.
- Catégories admises sous leurs contrats de métadonnées : basic, dual, triome, fast, slow, check, battle. Un nom de catégorie n’autorise pas toutes les règles de toutes les cartes de cette famille.
- Cinq accélérateurs audités : Llanowar Elves, Elvish Mystic, Fyndhorn Elves, Birds of Paradise, Sol Ring.
- Pas d’adversaire, de politique de vie, de recherche en bibliothèque ou de mécanique non modélisée implicitement.
- `p2` : probabilité de paiement dans ce modèle. `p1` : conditionnement sur le paiement d’un coût générique de même valeur ; ne pas l’assimiler à l’ancienne notion « perfect land drops ».
- « Exact » signifie événement et énumération exacts, avec calcul numérique en virgule flottante et tolérances validées ; pas une preuve en arithmétique rationnelle infinie.

Le résultat est une union explicite : `{ status: 'exact', ... }` ou `{ status: 'unsupported', reason }`. Un refus, un dépassement de budget ou des métadonnées insuffisantes ne doivent jamais devenir 0 %, 100 %, une probabilité partielle ou un ancien pourcentage silencieux.

Les scores de santé, recommandations, indicateurs secondaires de sources et récompenses de mulligan restent heuristiques. Les anciennes analyses sauvegardées sont signalées et les comparaisons entre modèles incompatibles sont refusées.

## 5. Carte du code

| Zone                          | Fichiers de départ                                                                                                                                                                                         |
| ----------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Calcul physique               | `src/services/castability/physicalManaEngine.ts`                                                                                                                                                           |
| Coûts stricts                 | `src/services/castability/parsePhysicalCost.ts`                                                                                                                                                            |
| Ancienne approximation        | `src/services/castability/acceleratedAnalyticEngine.ts` ; rechercher ses appelants avant toute suppression.                                                                                                |
| Analyse et données manquantes | `src/services/deckAnalyzer.ts`, `src/services/spellSummary.ts`, `src/services/manaCalculator.ts`                                                                                                           |
| Données des terrains          | `src/data/landSeed.ts`, `src/services/landService.ts`, `src/services/scryfall.ts`                                                                                                                          |
| Accélérateurs                 | `src/services/manaProducerService.ts`, `src/types/manaProducers.ts`                                                                                                                                        |
| Mulligan                      | `src/services/mulliganSimulatorAdvanced.ts`, `src/services/mulliganStopping.ts`, `src/workers/mulliganArchetype.worker.ts`                                                                                 |
| UI des probabilités et scores | `src/components/ManaCostRow.tsx`, `src/components/EnhancedSpellAnalysis.tsx`, `src/components/EnhancedRecommendations.tsx`, `src/components/EnhancedCharts.tsx`, `src/components/analyzer/AnalysisTab.tsx` |
| Persistance et comparaisons   | `src/pages/MyAnalysesPage.tsx` ; retrouver le schéma sauvegardé et ses producteurs.                                                                                                                        |
| UI du mulligan                | `src/components/analyzer/MulliganTab.tsx`                                                                                                                                                                  |
| Accessibilité et chargement   | `src/pages/AnalyzerPage.tsx`, `src/components/analyzer/TabPanel.tsx`                                                                                                                                       |
| Preuves et régressions        | `tests/math-audit/`, `src/services/castability/__tests__/`, `src/services/__tests__/`                                                                                                                      |

## 6. Travaux restants, classés et actionnables

Les priorités sont un ordre de travail proposé, pas une déclaration que tous ces sujets sont des erreurs mathématiques prouvées.

### A — À examiner et corriger d’abord : résultats incomplets et cohérence des contrats

**A1. Score de santé incomplet potentiellement trop favorable — observation à qualifier par une régression.**

Dans `EnhancedRecommendations.tsx`, `getHealthScore()` ne déduit aucune pénalité de sorts à risque si `atRiskSpells === null`, tout en produisant un score numérique. Le taux de risque lui-même est correctement affiché comme indisponible. Vérifier si le score composite et ses conseils signalent suffisamment cette absence ; ne pas affirmer sans test qu’il y a un bug de probabilité.

Action : reproduire deux analyses comparables, l’une avec risque connu élevé, l’autre avec risque inconnu. Définir un contrat explicite de score complet/partiel/indisponible. Une perte de données ne doit pas produire une amélioration présentée comme certaine. Ne pas inventer arbitrairement une pénalité pour remplacer l’inconnu.

Acceptation : régression couvrant `null`, 0 et une valeur positive ; cohérence entre score, badge, recommandations et sauvegarde ; aucune confusion entre une heuristique partielle et une probabilité validée.

**A2. Anciennes approximations encore accessibles — audit des appelants.**

`acceleratedAnalyticEngine.ts` conserve des chemins agrégés après refus du moteur physique. `calculateTempoAwareProbability` dans `manaCalculator.ts` peut retourner `method: 'heuristic'`. Les chemins principaux ont été sécurisés, mais il reste à cartographier précisément tous les consommateurs, exports et types.

Action : rechercher les appels et vérifier que le statut/méthode/hypothèses survivent jusqu’à chaque affichage et export. Éliminer les replis silencieux qui seraient encore démontrés ; conserver une estimation utile uniquement si elle est clairement nommée. Ne pas supprimer globalement l’ancien moteur avant d’avoir identifié ses dépendances.

Acceptation : test d’un coût ou terrain hors modèle pour chaque chemin réellement utilisé ; aucune approximation renommée « exacte », aucun inconnu transformé en succès ; tests de compatibilité des analyses sauvegardées.

**A3. Documentation et sémantique des API.**

Harmoniser les documents vivants, notamment le paragraphe de catégories devenu historique dans `physical-engine-2026-09-05/MODEL.md`, sans réécrire les preuves historiques. Vérifier les libellés du potentiel, de p1/p2, de X, des scores et des formats. Une future modification de l’événement probabiliste exige une version de modèle et une migration explicites.

Acceptation : un contrat actuel non contradictoire, liens vers les versions historiques, tests pertinents des libellés ou schémas si modifiés.

### B — Étendre le domaine exact, une famille à la fois

**B1. Fetchlands — extension majeure, actuellement refusée.**

Modéliser sacrifice, activation, conditions de recherche par types, cibles réellement restantes, arrivée engagée/dégagée, retrait du fetch du champ de bataille, retrait de la cible de la bibliothèque et mélange. Si une activation demande de la vie, définir une hypothèse explicite ou un état de vie avant de prétendre la couvrir. Ne pas représenter un fetch comme un terrain produisant toutes ses couleurs possibles simultanément.

Preuves requises : minuscules bibliothèques énumérées indépendamment ; cible absente ou épuisée, plusieurs fetchs partageant une cible, terrains typés non basiques, cible engagée, séquençage et changement de population après recherche. Commencer par un sous-ensemble nommé et borné.

**B2. MDFC et pathways — extension distincte.**

Une carte physique, un choix légal de face, aucune duplication dans les populations ou sources. Distinguer face terrain/face sort et terrain/terrain ; le choix peut devenir irréversible. Les ETB et coûts doivent appartenir à la face effectivement choisie.

Preuves requises : carte comptée une seule fois, impossibilité d’utiliser les deux faces simultanément, couleurs concurrentes, face engagée, interaction avec l’événement « sort cible » s’il devient une carte du deck.

**B3. Mana et coûts actuellement exclus.**

Neige, phyrexian, hybrides à deux génériques, choix de X, paiements de vie, filtres et restrictions de dépense demandent des contrats séparés. « Any color » ne doit pas inclure C ; du mana utilisable seulement pour des créatures ne doit pas payer n’importe quel sort. La neige demande de suivre l’origine du mana, pas une couleur supplémentaire inventée.

Preuves requises : paiements concurrents, mauvaise catégorie de sort, mana suffisant mais inutilisable, coûts d’activation, interdiction de réutiliser le même mana. Les familles non implémentées restent refusées.

**B4. Accélérateurs supplémentaires, trésors, rituels, auras et ramp.**

Chaque carte ou famille doit avoir un contrat basé sur son texte Oracle : coût réel, production, engagement, mal d’invocation, sacrifice, moment d’utilisation, restrictions et durée des effets. Un trésor n’est pas une source renouvelable ; un rituel dépense du mana avant d’en produire ; le ramp modifie la bibliothèque et le champ de bataille. Ne pas étendre une whitelist sur la seule base d’une étiquette « mana producer ».

Preuves requises : oracle d’états indépendant, coût d’installation, délai des créatures, ressources consommables, recherche sans cible et synergies concurrentes. Conserver les régressions des cinq producteurs déjà audités.

### C — Modèles supplémentaires à concevoir explicitement

**C1. Politique non clairvoyante et événement « tirer puis lancer ».**

Ce sont deux extensions, pas des erreurs cachées à corriger dans la définition actuelle. Pour une politique réaliste, un état de décision ne peut dépendre des pioches futures ; regrouper les histoires indiscernables. Pour « tirer puis lancer », intégrer les exemplaires du sort cible dans la bibliothèque, sa présence en main et son identité physique. Ne pas multiplier naïvement deux probabilités dépendantes.

Acceptation : contre-exemple où le potentiel actuel dépasse une politique non clairvoyante ; preuve que la politique ne voit pas l’avenir ; énumération conjointe tirage/paiement. Conserver le potentiel actuel sous son nom ou versionner le remplacement.

**C2. Mulligan complet et bottoming.**

Le moteur actuel utilise une récompense et un bottoming heuristiques, avec arrêt volontaire à quatre cartes. La reprise gratuite multijoueur et la pioche T1 sont déjà corrigées. Pour aller plus loin : distinguer règles de mulligan, recherche du sous-ensemble remis sous la bibliothèque, information disponible et objectif optimisé. Une politique optimale pour une récompense définie n’est pas automatiquement optimale pour gagner une partie.

Acceptation : Bellman indépendant sur des petits decks, règles et valeur jusqu’à zéro carte si cette extension est revendiquée, bottoming exhaustif sur petits cas, aucune fuite de tirages futurs, tests du mode multijoueur et des choix réels. Ne pas retirer le plancher de quatre sans adapter tout le modèle et ses libellés.

**C3. Budget, complexité et métadonnées.**

Mesurer les refus par budget sur des decks représentatifs. Optimiser les états équivalents, le cache et les chemins spécialisés à événement constant ; ne pas simplement augmenter le plafond et bloquer l’interface. Séparer à terme les raisons structurées : entrée invalide, métadonnée absente, mécanique exclue, limite de ressources. Vérifier provenance, fraîcheur et cohérence des métadonnées utilisées.

Acceptation : résultats identiques à l’oracle avant/après optimisation ; cache borné et isolé par tous les paramètres ; annulation et réactivité ; aucune probabilité partielle publiée. Vérifier l’interface et les exports si les statuts sont enrichis.

### D — Dette technique et couverture, après les priorités de fiabilité

- Traiter les **27 avertissements ESLint** avec diagnostic ; ne pas ajouter des désactivations globales pour obtenir zéro.
- Réexécuter l’audit complet des dépendances de développement. Des alertes subsistaient historiquement malgré zéro alerte de production ; leur nombre doit être vérifié au moment de la reprise. Éviter `npm audit fix --force` sans analyse de compatibilité.
- Les deux tests unitaires ignorés sont dans `tests/component/AnalyzerPage.test.jsx` : gestion des erreurs d’analyse et sauvegarde de la decklist. Vérifier la couverture actuelle équivalente, puis réécrire/réactiver ou retirer explicitement les doublons obsolètes.
- La suite française retirée `tests/e2e/core-flows/main-user-flows.spec.js` explique un scénario ignoré par projet navigateur. Ne pas la réactiver avec des sélecteurs périmés ; comparer ses intentions avec les scénarios anglais actuels.
- Les versions de runtime des workflows et actions doivent être réévaluées lors d’une mise à jour d’outillage, avec installation Linux propre. Ce chantier ne justifie pas de modifier simultanément les moteurs mathématiques.

## 7. Méthode impérative pour le prochain lot

1. Lire cette passation, le rapport actuel, les consignes locales éventuelles et `git status`. Ne pas réinitialiser le dépôt.
2. Reproduire A1, puis cartographier A2. Construire un registre : constat, statut prouvé/à vérifier/hors modèle, exemple minimal, fichier, priorité, critère d’acceptation.
3. Pour chaque défaut démontré, écrire une régression pertinente avant ou avec sa correction. Pour une extension mathématique, dériver d’abord un oracle indépendant.
4. Ne pas réutiliser le paiement ou la probabilité de production dans l’oracle qui prétend les valider.
5. Progresser par lots cohérents. Une mécanique est prise en charge seulement quand son contrat, ses données, son calcul, son affichage et ses preuves concordent.
6. Vérifier les assertions ; ne pas relever les tolérances, supprimer les tests ou masquer des statuts pour obtenir du vert.
7. Publier les modifications validées conformément aux instructions de l’utilisateur et vérifier le commit réellement déployé. Une intention de déploiement n’est pas une preuve de succès.
8. Actualiser le rapport et la passation avec le SHA testé, les résultats et les limites restantes.

Critère de validation mathématique hérité de la demande initiale : comparaison avec une formulation exacte dérivée indépendamment, ou énumération exhaustive, ou comparaison statistique justifiée pour une simulation. Quand c’est possible, utiliser à la fois formulation indépendante et énumération. Le simple passage des tests existants n’est pas suffisant.

## 8. Commandes et environnement

Commandes de validation depuis la racine du projet :

```sh
npm run type-check
npm run lint
npm run test:unit
npm run build
node scripts/check-bundle-budget.mjs
npm audit --omit=dev
```

Adapter les tests ciblés au changement, puis exécuter les contrôles requis. Les nombres de tests peuvent augmenter : préserver les assertions et les invariants, pas un chiffre artificiellement constant.

Campagne complète Linux, après publication d’une révision à tester :

```sh
gh workflow run browser-audit.yml --ref main
```

Un filtre facultatif `grep` existe pour reproduire un scénario. Ne pas présenter un lancement filtré comme la campagne complète. Suivre l’exécution effective et lire les artefacts de tout échec.

- Playwright 1.63.0, Vercel CLI 59.11.7 à la clôture.
- Workflow navigateur : Node 24, `npm ci`, navigateurs installés avec dépendances, build puis preview de production, un worker par projet.
- Profil tablette : `devices['iPad Pro 11']`, pas `devices['iPad Pro']` qui était inexistant.
- Firefox lancé directement est bloqué sur le macOS 27 de cette machine : https://bugzilla.mozilla.org/show_bug.cgi?id=2060476. Les tests Firefox passent sous Linux. Ne pas modifier les permissions macOS ni fermer les navigateurs de l’utilisateur pour contourner ce problème.
- Le fichier de verrouillage a été réparé pour l’installation Linux et ses dépendances optionnelles. Toute mise à jour doit être vérifiée par une installation propre ; un simple succès local sur Mac ne suffit pas.
- Les mesures de réponse UI portent sur clic réel → DOM visible, pas sur un délai garanti de peinture matérielle. Le contrôle à affichage retardé protège le chronomètre ; conserver ce contrôle.

## 9. Fichiers utilisateur à préserver et effets de bord connus

État local non commité déjà présent avant cette passation :

```text
 M playwright-report/index.html
 M test-results.json
 M test-results/.last-run.json
?? .claude/worktrees/
?? .mcp.json.bak.20260801-140417
?? .playwright-mcp/
```

Ces éléments n’appartiennent pas aux corrections à commiter. Ne pas faire `git add .`, `git reset --hard`, `git clean` ou une restauration globale. Vérifier l’état réel à la reprise : l’utilisateur peut avoir travaillé depuis cette capture.

Les tests Playwright locaux doivent écrire leurs rapports et résultats dans un emplacement isolé, via une configuration dédiée, pour ne pas écraser ces rapports préexistants. Les workflows Linux produisent leurs propres artefacts.

`npm run build` exécute un prebuild susceptible de modifier `public/library.json`, `public/library/feed.xml` et `public/sitemap.xml`. Comparer leur état avant/après. Restaurer uniquement les modifications générées par sa propre commande si elles sont hors du lot ; ne jamais écraser une modification utilisateur.

Les anciens répertoires `/tmp/mtg-*` ne constituent pas un stockage durable. Conserver les nouvelles preuves utiles dans le dépôt ou dans un artefact livré explicitement.

## 10. Publication

L’utilisateur a déjà demandé commit/push et publication Vercel des corrections. Le prompt de reprise fourni avec ce document rend cette instruction explicite pour la nouvelle discussion. Éviter les demandes de confirmation répétitives pour les actions déjà autorisées.

- Commits ciblés, messages décrivant le comportement corrigé ; pas de fichiers utilisateur annexes.
- `git push origin main` dans le flux autorisé, après vérifications ; respecter d’éventuelles nouvelles consignes de branche.
- Vérifier la CI et le déploiement Vercel natif correspondant au SHA poussé, puis l’alias de production.
- Ne pas réactiver le second job de déploiement ni lancer systématiquement un déploiement manuel en plus du natif.
- Ne pas envoyer d’e-mails, commentaires GitHub ou autres messages externes au nom de l’utilisateur sans instruction explicite.

## 11. Livrables attendus de la prochaine discussion

Code corrigé et tests indépendants/régressions, registre des changements, résultats reproductibles, SHA testé et déployé, rapport français mis à jour. Si un nouveau rapport d’audit complet est produit, conserver les 16 sections définies par la demande initiale. Cette passation n’est pas elle-même ce rapport d’audit.

Le bilan doit séparer : corrigé et vérifié ; amélioration du modèle implémentée ; reste hors modèle ; constat encore non résolu. Expliquer les limites matérielles au lieu de promettre « tout est fiable à 100 % ».

**Premier lot concret recommandé : A1 → A2 → A3.** Passer ensuite à une seule famille de B avec un domaine fermé et des preuves. C contient des changements de définition plus profonds à traiter explicitement ; D ne doit pas détourner la reprise des défauts mathématiques prioritaires.
