# Réaudit personas après R01–R07 — 10 septembre 2026

**Candidat corrigé : 15,11/20, contre14,67/20 au réaudit précédent et12,89/20 initialement. Gain récent+0,44/20 ; gain cumulé+2,22/20.** Les progrès concernent surtout la confiance et la documentation. Ils ne démontrent pas une hausse de performance du moteur.

## Ce qui est évalué

Les six mêmes personas ont été réévalués par six agents distincts, avec la même grille entière1–5 et pondération égale. Ce sont des appréciations simulées, pas une étude auprès de participants réels. L’accessibilité désigne ici la compréhension du propos, pas un score WCAG. Les notes n’ont pas de précision statistique : les décimales proviennent uniquement des moyennes.

Candidat : `docs/engineering/reaudit-fixes-szrp1r9w/dist-04`, sources du HEAD `e14f32924a6d4fb2eaf425e0681e421c06c98b9e`, testé sur http://127.0.0.1:4187/.

**Le push est sur `codex/persona-followup-2026-09-10`, pas sur main.** La référence distante main reste `2ba772a`. La branche dédiée est exclue de l’auto-déploiement dans vercel.json. Le site public visité affiche encore les anciens textes : cette note concerne donc le candidat poussé, pas une mise à jour publiée. Aucun changement de branche, intégration, commit, push ou déploiement effectué pendant cet audit. La préférence permanente main reste applicable aux prochaines interventions.

## Évolution des notes

| Persona  | Initial /5 | Précédent /5 | Maintenant /5 | Gain récent /5 | Commentaire                                                              |
| -------- | ---------: | -----------: | ------------: | -------------: | ------------------------------------------------------------------------ |
| Léo      |       3,00 |         3,50 |      **3,50** |          +0,00 | Textes corrigés ; première décision encore trop peu guidée.              |
| Sarah    |       3,50 |         3,83 |      **3,83** |          +0,00 | Comparaison plus lisible ; progrès consolidant les 4 existants.          |
| Karim    |       3,50 |         3,83 |      **4,00** |          +0,17 | Confiance accrue grâce aux limites des modes et à la confidentialité.    |
| Natsuki  |       3,17 |         3,67 |      **3,83** |          +0,17 | Contrats des modèles mieux définis ; couverture moteur inchangée.        |
| David    |       3,00 |         3,50 |      **3,67** |          +0,17 | Documentation et CSV plus exploitables ; contradiction20/21 pénalisante. |
| Thibault |       3,17 |         3,67 |      **3,83** |          +0,17 | Confiance renforcée ; réglages toujours absents des liens partagés.      |

Moyennes exactes avant arrondi :116/36 →132/36 →136/36, soit3,2222 →3,6667 →3,7778/5. Le dernier gain est4/36 de point sur5. Une note stable n’annule pas les corrections : Léo et Sarah les jugent utiles sans franchir un palier entier de leur grille.

| Persona  | Accessibilité | Pertinence | Profondeur | Utilisabilité | Confiance | Partage |
| -------- | ------------: | ---------: | ---------: | ------------: | --------: | ------: |
| Léo      |             3 |          4 |          3 |             4 |         4 |       3 |
| Sarah    |             4 |          3 |          4 |             4 |         4 |       4 |
| Karim    |             4 |          4 |          4 |             4 |         4 |       4 |
| Natsuki  |             4 |          3 |          4 |             4 |         4 |       4 |
| David    |             4 |          4 |          4 |             3 |         3 |       4 |
| Thibault |             4 |          4 |          3 |             4 |         4 |       4 |

## Progrès confirmés

- **Promesses plus justes** : distinction entre indices heuristiques, estimations et potentiel exact ; exemple synthétique explicitement non légal en tournoi. Le parcours lead arrive à98% de potentiel avec un Health99 distinct, limites affichées.
- **Confidentialité plus cohérente** : My Analyses annonce le stockage local et renvoie aux requêtes externes ; les formulations absolues signalées dans le réaudit ont été corrigées sur le candidat.
- **Compare plus lisible** : nouveau parcours lead20contre24terrains réussi ; probabilités à une décimale, hypothèses et couverture1/1 visibles. Groupement des motifs non supportés étayé par les preuves de la campagne antérieure, sans le présenter comme nouveau scénario rejoué.
- **Documentation et exports plus exploitables** : modèles clarifiés, recette CSV exécutée par David sur deux artefacts attribués ; Blueprint expose CSV et ses tables. Cela fait progresser la profondeur pour David.
- **Pédagogie corrigée** : seuil85% conditionnel et compteurs dérivés ; ces corrections consolident l’expérience sans ajouter de nouveau modèle de calcul.

## Améliorations suivantes, par priorité

1. **Supprimer la contradiction20/21 sources.** Le Guide indique20 pour deux symboles colorés au tour2, Mathematics21. Harmoniser avec la référence et les hypothèses choisies, puis vérifier les occurrences. C’est une incohérence éditoriale reproduite, pas une panne mathématique démontrée.
2. **Faire réussir une première décision à Léo.** Un exemple guidé montrant une modification, son effet et sa limite serait plus utile qu’ajouter des paragraphes techniques. Tester la compréhension des trois scores auprès d’un débutant réel.
3. **Rendre le partage reproductible.** Les liens contiennent deck/nom/onglet ; les réglages interactifs restent à transmettre séparément. Rendre cette limite immédiate dans l’action Share, puis décider si leur transport appartient au contrat produit.
4. **Alléger la lecture des hypothèses.** Garder une synthèse courte avec détails accessibles pour Blueprint et les modes, sans cacher les limites. « Optimal » reste trop général dans certaines accroches de l’accueil.
5. **Distinguer livraison et audit.** Pour bénéficier des améliorations sur le site public, une mission d’intégration/publication devra être explicitement menée et son artefact contrôlé. Le présent audit n’autorise ni n’exécute cette opération.

Les besoins de matchups, métagame, upgrades budgétaires ou couverture moteur élargie expliquent certains plafonds ; ils ne constituent pas automatiquement des défauts à corriger ni une demande d’élargir le produit.

## Preuves et limites

Les six agents n’avaient pas de navigateur utilisable. Ils ont lu HTTP/sources et les preuves attribuées de dist-04. Le lead a personnellement visité public/local et rejoué exemple exact → analyse → Blueprint → My Analyses → seconde liste → Compare. Aucun des rapports n’équivaut à six parcours utilisateurs autonomes.

Les801tests/79fichiers et72Chromium appartiennent à la validation précédente. Aucun gate automatisé n’a été relancé ici. Pas de nouveau téléchargement d’export, test du clipboard en contexte vierge, validation physique mobile ou étude utilisateurs. Les réserves juridiques et de publication restent distinctes.

- [Observations du lead](persona-reaudit-r01-r07-2026-09-10/preuves-lead.md)
- [Léo](persona-reaudit-r01-r07-2026-09-10/leo.md) · [Sarah](persona-reaudit-r01-r07-2026-09-10/sarah.md) · [Karim](persona-reaudit-r01-r07-2026-09-10/karim.md) · [Natsuki](persona-reaudit-r01-r07-2026-09-10/natsuki.md) · [David](persona-reaudit-r01-r07-2026-09-10/david.md) · [Thibault](persona-reaudit-r01-r07-2026-09-10/thibault.md)
- [Réaudit précédent](PERSONA_REAUDIT_2026-09-10.md) · [Audit initial](PERSONA_AUDIT_2026-09-09.md)
- [Validation de la campagne de corrections](../engineering/reaudit-fixes-szrp1r9w/FINAL.md)
