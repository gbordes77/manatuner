# Natsuki — réaudit du candidat corrigé, 10 septembre 2026

## Périmètre et méthode

J’incarne exclusivement Natsuki, persona 4 du [référentiel canonique](../../personas/mtg-player-personas.md) : compétitrice Pioneer/Modern, travail de testing méthodique, données structurées partagées avec sa team. Ce jugement simulé ne constitue pas un entretien. La référence précédente est [son audit du 9 septembre](../persona-audit-2026-09-09/natsuki.md), noté 19/6.

Cible : **candidat local dist-06, http://127.0.0.1:4186**, identifié par le [bilan vérifié](../../engineering/persona-validation-mfydqnp5/FINAL.md) et son manifeste. Ce rapport n’attribue aucune amélioration à la production. L’ouverture d’un onglet CUA dédié a échoué : « Browser is not available: iab ». J’ai donc lu directement par HTTP le HTML prérendu de `/`, `/mathematics`, `/privacy` et `/my-analyses` (quatre réponses 200), puis inspecté les JSON/CSV réellement téléchargés par QA. Je n’ai pas exécuté personnellement les interactions JavaScript.

Les preuves actuelles partagées du coordinateur et de QA complètent ces lectures. Elles sont distinguées des constats personnels et des tests historiques du 9 septembre. Le périmètre moins interactif que la baseline limite la comparaison des notes.

## Première impression simulée

« Je peux maintenant récupérer un résultat dont les hypothèses voyagent avec les données. L’exemple exact m’offre un contrôle simple avant de brancher mon spreadsheet. Mais si Mathematics décrit encore plusieurs modèles sous les mêmes intitulés, je dois vérifier chaque colonne avant de la citer à ma team. »

## Avant/après et progrès utiles

**La promesse devient plus précise.** L’accueil HTTP décrit le score illustratif 87 % comme accès aux couleurs au tour deux et exclut explicitement pourcentage de sorts sur la courbe et conseil de keep. Il présente les estimations par défaut et les limites du mode exact. Les 65 références et les nombres des parcours remplacent le compteur 54 de la baseline. Pour moi, cela réduit le risque d’introduire un faux indicateur de performance dans le document de préparation.

**Le premier résultat exact est démontrable.** Le coordinateur observe 98 % sur le nouvel exemple 24 Plains/36 Savannah Lions ; QA documente la comparaison à un oracle indépendant. Le JSON inspecté contient 97,8385472740882 % pour Savannah Lions. La baseline refusait les 14 lignes exactes du midrange. Cette fixture synthétique démontre un événement simple ; ses 36 exemplaires ne forment pas une liste de tournoi légale et ne prouvent pas la couverture d’une manabase compétitive complexe.

**Les exports deviennent exploitables.** J’ai ouvert `persona.json` et `persona.csv` sous `qa/candidate-06/`. Le nom `Persona, "White"`, Engine 2.7.9, les totaux 60/24 et les définitions Health/Blueprint/Mulligan sont présents. Le JSON annonce `physical-v1`, PLAY, sans mulligans ni ramp, X=2 et exclusion de la pioche du sort cible. Il précise que ce snapshot ne reproduit pas les réglages interactifs de Castability. C’est un progrès tangible sur la baseline, qui avait seulement constaté un menu d’export. Le CSV distingue aussi commandant et sideboard.

**La comparaison dispose de preuves nouvelles.** Le coordinateur a comparé deux exemples identiques : une ligne calculée de chaque côté et 97,8385472740882 % des deux côtés. Cela vérifie l’affichage symétrique, pas un effet de modification. Séparément, le rapport QA final atteste une comparaison 20/24 Plains avec probabilité descendante. Je prends cette preuve attribuée en compte sans prétendre avoir refait ce parcours.

**Les explications sont plus transportables.** L’aide des trois scores est confirmée par le coordinateur ; leurs définitions sont personnellement vérifiées dans les exports. QA atteste une simulation réelle 3k multijoueur puis duel et les textes London adaptés. Ces améliorations concernent la compréhension du modèle, pas une démonstration de meilleurs keeps en tournoi.

## Frictions restantes

**P1 — Documentation du modèle.** Dans `/mathematics`, le bandeau décrit les sources physiques et les anciennes estimations secondaires, mais les sections « Castability Tab », « Realistic (primary) » et « If I keep this hand » restent mélangées. L’intitulé peut encore faire passer une disponibilité depuis une main aléatoire pour une probabilité conditionnée à ma main observée. Ce résidu suffit à empêcher une recommandation sans commentaire méthodologique.

**P1 — Confidentialité encore contradictoire dans le parcours.** `/privacy` décrit précisément Scryfall, les polices externes et les limites du stockage local. Cependant `/my-analyses` affiche toujours « Nothing sent to servers » et « nothing leaves your browser ». Une lecture limitée aux analyses sauvegardées est possible, mais la formulation absolue reste évitable. Je ne conclus ni à une fuite supplémentaire ni à une conformité juridique.

**P2 — Intégration et représentativité.** Le CSV assemble commentaires, tableau de cartes et tableau de synthèse : un import naïf comme table unique demande une adaptation. Aucun contrat d’API ou schéma public versionné n’est établi par cette revue. Le lien partagé conserve deck/nom/onglet, pas les paramètres interactifs ; cette limite est annoncée, mais reste importante pour une préparation reproductible. Les besoins métagame et Limited de Natsuki restent peu couverts ; cela ne justifie pas de transformer le produit.

## Notes indépendantes

| Axe           | Avant | Après /5 | Justification                                                                |
| ------------- | ----: | -------: | ---------------------------------------------------------------------------- |
| Accessibilité |     4 |        4 | Proposition et scores clarifiés ; documentation encore ambiguë.              |
| Pertinence    |     3 |        3 | Utile au mana, couverture inchangée des besoins compétitifs globaux.         |
| Profondeur    |     3 |        4 | Exemple exact vérifiable et hypothèses inspectables dans les données.        |
| Utilisabilité |     4 |        4 | Parcours mieux documentés, sans nouvelle navigation personnelle complète.    |
| Confiance     |     2 |        3 | Contrats et preuves améliorés ; deux contradictions directement reproduites. |
| Partage       |     3 |        4 | JSON/CSV réellement inspectés et contextualisés, adaptés à une team.         |

**Total : 22/30 ; moyenne 3,67/5, soit 14,67/20. Delta : +0,50/5 (+2/20)** par rapport à 19/6. Ce gain exprime un jugement sur le candidat corrigé, pas une mesure statistique ni une amélioration publiée.

## Verdict et suites

Je partagerais un JSON annoté dans le Notion de ma team pour vérifier une hypothèse de mana. Je ne présenterais toujours pas un indice comme win rate. Priorités restantes : séparer les modèles dans Mathematics, enlever les absolus de My Analyses, documenter le schéma et tester une modification de manabase réaliste à paramètres fixés.

Preuves complémentaires : [QA final](../../engineering/persona-validation-mfydqnp5/qa/REPORT.md), [revue exports](../../engineering/persona-validation-mfydqnp5/export-review/REVIEW.md). Les captures 360/390/768/1440 clair/sombre et le roundtrip réel proviennent de QA, pas d’une manipulation personnelle. Aucun nouveau test automatisé, appareil physique, oracle exhaustif, entretien ou contrôle production réalisé dans ce sous-audit.
