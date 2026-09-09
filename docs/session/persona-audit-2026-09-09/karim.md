# Karim — Le Tacticien · audit du 9 septembre 2026

**Note : 3,50/5 (21/30).** Persona simulée : grinder Pioneer/Modern, RCQ, données exportables et décisions reproductibles. Évaluation qualitative experte, aucun entretien réel. Production visitée dans un onglet CUA distinct ; Engine **v2.7.9** affiché. Stockage navigateur partagé préexistant conservé.

## Première impression simulée — 30 secondes

« Rocks et dorks inclus, Modern/Pioneer, export : ça peut me servir pour tuner avant mon prochain RCQ. Mais si vous annoncez des probabilités exactes, je veux connaître précisément l'événement mesuré et récupérer les chiffres. Le score seul ne me dit pas si mon triple vert passe. »

## Parcours réellement joué

1. [Accueil](https://www.manatuner.app/) → **Try an example deck** → exemple public Nature's Rhythm, puis **Analyze Manabase**. Résultat : 60 cartes, 23 terrains, score91, moteur2.7.9. Aucun onboarding bloquant rencontré ; ce n'est pas une preuve spécifique sur Joyride.
2. **Castability → Advanced** : mode par défaut « MANA ESTIMATES », exclusion explicite du mulligan et de la pioche du sort, taux de removal35% personnalisable. Archdruid's Charm : estimation75%, lands-only45%, perfect drops59% ; ces métriques mélangent des conditions différentes explicitement signalées. Mode exact visible, non exécuté.
3. **Manabase** : W13/16, G16/23 ; explication de la condition Karsten et traitement des alternatives hybrides. Identité3 couleurs affichée pour la présence hybride, sources physiques W/G : aucune assimilation automatique à un défaut.
4. **Blueprint → Export Blueprint → JSON** : menu offre PNG, PDF, JSON et **CSV (Sheets / Pandas)**. JSON cliqué ; contenu du fichier non récupéré/vérifié. Blueprint60/23/37, indice heuristique92, titre générique « Deck09/09/2026 » malgré le nom de la liste.
5. [My Analyses](https://www.manatuner.app/my-analyses) → Compare → deux sauvegardes publiques Nature's Rhythm du jour → comparaison : agrégats identiques,14 sorts communs, toutes leurs probabilités **Unavailable**. Aucun historique supprimé. Deux listes identiques permettent d'inspecter l'affichage, pas de valider le calcul d'un delta de modification.
6. [Mathematics](https://www.manatuner.app/mathematics), [Library](https://www.manatuner.app/library), [Privacy](https://www.manatuner.app/privacy) lus. Retour Analyzer : texte de deck conservé, résultats à relancer.

Limites : onglets Analysis et Mulligan non parcourus en profondeur ; aucune simulation nouvelle, aucun audit lecteur d'écran/mobile, aucun roundtrip de partage ni inspection du dépôt GitHub distant. Lien GitHub visible. Aucun résultat mathématique certifié par cet audit.

## Forces

- Les estimations expliquent leurs limites à proximité des pourcentages : suffisamment transparent pour un joueur qui refuse une boîte noire.
- Les déficits W3 et G7 orientent une investigation concrète malgré le score global excellent. Conditions Karsten lisibles.
- CSV/JSON proposés : alignement direct avec mon workflow Sheets/Pandas et mon groupe de testing.
- Bibliothèque riche :65 entrées affichées,46 live/13 archived/6 lost, parcours RCQ10 lectures, Pro Tour9, dates et auteurs visibles. Les ressources perdues sont identifiées.
- Sans compte, navigation et exemple fonctionnels ; textes de la liste préservés au retour.

## Frictions hiérarchisées

**P0 : aucun blocage général établi dans ce parcours.**

**P1 — Comparaison incomplète.** Les14 sorts communs deviennent Unavailable des deux côtés alors que l'Analyzer donne leurs estimations. Même si l'indisponibilité est volontaire pour éviter de comparer des modèles incompatibles, il manque une raison et une action : impossible de justifier à ma team le gain d'un changement de source depuis cette vue.

**P1 — Contrat scientifique incohérent.** Accueil : « Exact Probabilities » et exemple87% décrit comme sorts lancés sur la courbe. Analyzer : estimations de disponibilité du mana sans pioche du sort. Mathematics commence par dire que les lignes montrent désormais la castabilité physique, puis décrit encore les anciennes approximations comme modèle principal. Le périmètre réel exige une lecture contradictoire.

**P1 — Confidentialité contradictoire.** Accueil reconnaît les noms envoyés à Scryfall mais affiche aussi zéro donnée envoyée aux serveurs. Privacy dit ne transmettre aucune information de deck. Il s'agit d'une incohérence de communication constatée, pas d'une conclusion juridique ou d'une interception réseau.

**P2 — Artefact sans contexte suffisant.** Health91 et Blueprint92 portent des noms différents, donc pas de bug numérique prouvé ; leur relation n'est pas expliquée. Le titre générique nuit à l'archivage des builds.

**P2 — Crédibilité éditoriale.** Home54 articles vs Library65 ; parcours RCQ7 annoncé vs10 observé. La formule « FNM doesn't really use sideboards » choque ce compétiteur. La bibliothèque apporte de la théorie, pas les résultats hebdomadaires/matrices de matchups recherchés ; besoin persona hors périmètre, pas demande de construire un backend méta.

## Notes commentées

| Axe           |       /5 | Justification                                                                                   |
| ------------- | -------: | ----------------------------------------------------------------------------------------------- |
| Accessibilité |        4 | Positionnement compris immédiatement par Karim ; exemple accessible.                            |
| Pertinence    |        4 | Tuning des sources, formats et canon RCQ utiles ; pas de data de tournoi intégrée.              |
| Profondeur    |        4 | Hypothèses, removal, Karsten, modèle exact et exports visibles ; comparaison par sort limitée.  |
| Utilisabilité |        3 | Parcours simple mais comparatif indisponible et résultats à relancer après navigation.          |
| Confiance     |        3 | Limites détaillées appréciées, contredites par plusieurs pages publiques.                       |
| Partage       |        3 | CSV/JSON correspondent au canal compétitif ; artefact final et réouverture de lien non validés. |
| **Moyenne**   | **3,50** | **21÷6 ; baseline4,17, écart−0,67.**                                                            |

Cette baisse n'établit pas une régression logicielle : périmètre et preuves de l'ancien audit ne sont pas identiques.

## Verdict et recommandations

« Je reviens pour contrôler les sources et retrouver une lecture. Je recommande le canon à ma team Discord ; je n'envoie pas encore un Blueprint comme démonstration que mon build gagne en castabilité. »

1. Réconcilier immédiatement les formulations exact/estimation et privacy sur toutes les pages publiques.
2. Expliquer Unavailable en comparaison et proposer de recalculer les deux builds avec les mêmes hypothèses.
3. Conserver nom de build, version moteur, modèle et paramètres dans chaque artefact exporté ; documenter les deux scores.
4. Rendre CSV visible dans la présentation de Blueprint et vérifier son import dans Sheets sur un exemple public.
5. Synchroniser compteurs de bibliothèque et revoir les résumés compétitifs avant diffusion ciblée RCQ.

**Traçabilité :** profil canon et protocole lus, ainsi que suivi corrections, SESSION-VERIFIEE S002 et DELIVERY-CONTRACT. Les tests796/49 scénarios cités dans S002 restent des preuves historiques locales ; ils ne sont ni rejoués ni présentés comme validation de cette production. Aucun code modifié. Les constats ci-dessus proviennent des arbres d'accessibilité CUA observés pendant ce parcours.
