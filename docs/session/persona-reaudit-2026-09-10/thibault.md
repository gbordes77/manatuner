# Thibault — réaudit du candidat corrigé

10 septembre 2026 · Candidat local `dist-06`, http://127.0.0.1:4186 · Persona Commander exclusive.

## Cadre et première impression simulée

« Je comprends enfin ce qui est une estimation et ce qui manque au modèle. Je peux montrer le résultat au pod en expliquant ses limites. Je veux encore savoir quelle modification de ma manabase mérite mon budget. »

Cette réaction incarne Thibault ; ce n'est pas un entretien réel. **Le navigateur CUA est indisponible pendant cette reprise. Aucun nouveau parcours cliqué n'est revendiqué.** J'ai consulté les réponses HTTP locales de Guide et Privacy, lu `FINAL.md` et les preuves QA attachées à dist-06, inspecté la capture Blueprint Atraxa, le JSON exporté et la capture du vrai worker multijoueur. Les interactions déjà exécutées par QA et les observations transmises par le lead sont attribuées comme telles. L'évaluation porte sur le candidat local, sans conclusion sur la production.

## Parcours et faits vérifiés

**Atraxa et les populations.** La campagne QA du candidat confirme l'exemple 99+1, quatre couleurs et priorité T4–T8. L'export consulté contient 99 cartes principales, 43 terrains, 56 non-terrains, et des zones distinctes dans les exports de la campagne. Son nom est conservé : « Public Atraxa zone validation ». Un sideboard public supplémentaire sert au test d'export ; ce n'est pas une nouvelle variante de deck recommandée. Le défaut six couleurs était déjà résolu le 9 septembre : aucun point supplémentaire pour cette correction ancienne.

**Estimation et Analysis.** L'exemple reste utilisable en estimation d'après les preuves et le lead. En revanche, le JSON conserve `consistencyUnavailable: true`, une stabilité nulle et les motifs Command Tower dans `unsupportedSpellAnalysis`. Le candidat ne prétend donc pas avoir étendu magiquement le moteur exact à cette manabase. La distinction « aucun calcul » versus « zéro risque » est corrigée selon la campagne ; c'est une amélioration de compréhension, pas de profondeur mathématique. Le succès exact à 98 % du deck de terrains de base rapporté par le lead ne prouve pas une prise en charge exacte d'Atraxa.

**Mulligan du pod.** Le vrai worker 3 000 échantillons a été exécuté par QA sur dist-06. La capture inspectée distingue le premier redraw gratuit, qui conserve sept cartes, du seuil suivant. L'aide explique sept cartes puis bottoming pour les mulligans comptés. Le journal QA confirme les descriptions après gratuit puis un/deux payants et le retour duel. La capture présente un deck Aggro : je ne transforme pas son seuil 65 en résultat Atraxa. Cette preuve résout néanmoins la contradiction générale de l'aide constatée par Thibault. Les plans sans ramp restent une limitation annoncée.

**Guide et confidentialité.** Le HTML local expose désormais une détection exclusivement par `*CMDR*` ou section Commander. Les listes non marquées n'ont pas de commandant inféré. Les partenaires sont séparés et les limites sur taxe du commandant, ramp et terrains conditionnels sont explicites. La mise à l'échelle Karsten N/60 reste qualifiée d'approximation. Privacy explique concrètement les requêtes Scryfall, les services externes, les caches, l'effacement et les liens partagés ; l'affirmation générale « decklists never leave » n'y figure plus.

**Bibliothèque et partage.** Le parcours Commander Pod était utile au premier audit ; aucune nouvelle richesse éditoriale n'est prouvée, donc pas de bonus de contenu. Le lead/Sarah signale encore « Five » face à sept lectures dans le parcours FNM, voisin du parcours Commander. Pour le partage, QA documente cette fois une véritable copie `#d=`, ouverture dans un contexte neuf puis rechargement. Nom, deck et onglet sont transportés ; paramètres de modèle non transportés sont annoncés. La capture Blueprint et le JSON montrent les définitions des indices et les hypothèses du snapshot, distinctes des réglages interactifs.

## Notes avant/après

| Axe           |    Avant | Candidat | Justification                                                                                                       |
| ------------- | -------: | -------: | ------------------------------------------------------------------------------------------------------------------- |
| Accessibilité |        4 |        4 | EDH déjà identifiable ; la clarification renforce cette bonne base sans démontrer un saut supplémentaire.           |
| Pertinence    |        4 |        4 | Commander, ramp et multijoueur répondent aux besoins centraux ; les arbitrages budgétaires restent manuels.         |
| Profondeur    |        3 |        3 | Modèles mieux expliqués, mais paiement exact conditionnel et plans avec ramp toujours limités.                      |
| Utilisabilité |        3 |        4 | Aide multijoueur cohérente, zones et absences de calcul mieux expliquées ; progression appuyée sur preuves QA.      |
| Confiance     |        2 |        3 | Guide/Privacy et indices nettement améliorés ; promesses résiduelles empêchent une confiance pleinement stabilisée. |
| Partage       |        3 |        4 | Restitution réelle désormais prouvée, exports contextualisés ; le lien ne transporte pas tous les réglages.         |
| **Moyenne**   | **3,17** | **3,67** | **19/6 → 22/6 ; delta exact +0,50/5.**                                                                              |

## Frictions restantes et verdict

**P1 : cohérence des promesses.** Sarah a observé « Nothing sent to servers » dans My Analyses ; ce résidu contredit la nouvelle politique. Le HTML Guide contient aussi encore des FAQ parlant de « single-draw probability » et d'une main spécifique. Les passages principaux sont corrigés, pas l'ensemble du discours. Le JSON-LD global conserve une promesse d'exactitude générale : problème éditorial supplémentaire, sans le confondre avec un texte nécessairement lu par Thibault.

**P2 : valeur de décision.** Quatre couleurs déficitaires et des recommandations générales n'indiquent toujours pas quel swap améliorerait le plus mon commandant. Le Blueprint conserve un badge « 99 cards » : compréhensible comme principal, mais un rappel 99+1 rendrait la capture autonome pour le pod.

Je reviendrais pour comparer mes sources et partager une estimation contextualisée. Je recommanderais un essai au pod, pas une validation automatique de nos keeps. Aucun P0 nouveau démontré.

Priorités : harmoniser les dernières promesses ; ajouter 99+1 aux artefacts Commander ; rendre la couverture ramp explicite carte par carte ; guider une comparaison avant/après d'un swap. La revue juridique, les appareils physiques et les entretiens joueurs restent hors preuve. Les résultats positifs de QA sont locaux ; aucun gain de conversion, compréhension réelle ou adoption n'est mesuré.

Sources : [bilan candidat](../../engineering/persona-validation-mfydqnp5/FINAL.md), [campagne QA](../../engineering/persona-validation-mfydqnp5/qa/REPORT.md), [audit initial](../persona-audit-2026-09-09/thibault.md). Les captures inspectées se trouvent dans `qa/candidate-06/` (Atraxa Blueprint) et `qa/candidate-06-multiplayer2/` (multijoueur 3k).
