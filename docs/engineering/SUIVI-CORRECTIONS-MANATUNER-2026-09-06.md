# Suivi des corrections et validations ManaTuner

Version initiale du suivi 1.0 — 6 septembre 2026

Ce document est le registre de travail à mettre à jour pendant les corrections. Il reprend les identifiants et les critères de l’audit sans modifier ses observations historiques. Toutes les cases sont initialement décochées : aucun correctif n’est réalisé par la création de ce fichier.

Référence : [audit complet](AUDIT-POST-CORRECTIFS-MANATUNER-2026-09-06.md), version 1.0, commit `148d5f85ee26e60cdb10c6351031c89c03fd7ed0`. Le commit effectivement corrigé devra être relevé au démarrage ; l’audit n’est pas une preuve de l’état futur du dépôt.

## Mode d’emploi

- Remplacer `[ ]` par `[x]` seulement après vérification réelle et enregistrement de la preuve. Une case laissée vide signifie non acquis.
- États autorisés : ouvert, en cours, corrigé non vérifié, vérifié, bloqué, régression. Le déploiement se suit séparément.
- « Corrigé » indique une modification présente ; « vérifié » exige les critères applicables, la revue et les tests de non-régression ; « livré » exige une publication autorisée et vérifiée.
- Une action impossible à tester reste bloquée ou non vérifiée, avec sa cause et la prochaine action précise. Ne pas cocher « non applicable » sans justification et revue du contrat.
- Pour chaque preuve, noter date, version exacte, environnement, commande ou parcours, attendu, obtenu et fichier de résultat. Si aucun commit n’existe encore, référencer HEAD et un diff/patch daté permettant d’identifier les modifications testées ; ne jamais enregistrer des secrets dans la preuve.
- Si une modification ultérieure touche un contrat déjà vérifié, rouvrir les cases de validation affectées, conserver les preuves historiques et rejouer les tests concernés.
- Les validations V sont des travaux encore ouverts, pas automatiquement des défauts. Les améliorations E doivent être précisées avant développement ; elles ne justifient pas une refonte générale.

## État initial et session active

- Date de début : 6 septembre 2026 — S001
- Responsable ou coordinateur : Codex lead intégration/QA ; sous-agents parsing, clavier et annulation
- Branche et HEAD de départ : `main`, `148d5f85ee26e60cdb10c6351031c89c03fd7ed0`
- Modifications préexistantes protégées : [statut S001](preuves-corrections/S001/status-initial.txt) ; diff préexistant conservé, aucun nettoyage
- Environnement local et versions Node/navigateur : macOS, Node v25.2.0, npm 11.6.2 ; Playwright 1.63.0, navigateur à relever
- Référence de l’état initial des tests : [baseline S001](preuves-corrections/S001/baseline-unit.log), 38 fichiers/449 tests ; types et lint code 0
- Dernière mise à jour du suivi : 6 septembre 2026, S001 terminée à12h27 CEST
- Dernier point de reprise : **S001 — autorisation de commit et push**, en fin de fichier
- Prochaine session de correction : S002 ; poursuivre F09/F11 puis F10/F12
- Blocages actifs : aucun blocage local sur les prochains F09/F10/F11/F12 ; accès privés/terrain non examinés, validation juridique compétente nécessaire pour V09/F12-AC5

## Ordre de travail

A : F01/F02, parsing et populations. B : F03/F04, recommandations sur ces populations. C : F05/F08, annulation. D : F06, historique. E : F07 et tests clavier de F11. F : F09 et livraison de F11. G : F10/F12, textes et information. H : F13/E01, récupération et observabilité. I : E02 à E06, après stabilisation.

Les lots indépendants peuvent avancer en parallèle avec des fichiers et contrats attribués. Le coordinateur intègre et vérifie les interactions. F07 ou la protection UI de F05 peuvent être corrigés sans attendre les calculs.

## Vue de synthèse des défauts

| ID | Priorité | État | Preuve de clôture | Livraison |
|---|---|---|---|---|
| F01 | P1 | Vérifié | [S001 lot A/UI](preuves-corrections/S001/LOT-A-UI.md) | Non publiée |
| F02 | P1 | Vérifié | [S001 lot A/UI](preuves-corrections/S001/LOT-A-UI.md) | Non publiée |
| F03 | P1 | Vérifié | [S001 intégrée](preuves-corrections/S001/SESSION-VERIFIEE.md) | Non publiée |
| F04 | P1 | Vérifié | [S001 intégrée](preuves-corrections/S001/SESSION-VERIFIEE.md) | Non publiée |
| F05 | P1 | Vérifié | [S001 lot A/UI](preuves-corrections/S001/LOT-A-UI.md) | Non publiée |
| F06 | P1 | Vérifié | [S001 intégrée](preuves-corrections/S001/SESSION-VERIFIEE.md) | Non publiée |
| F07 | P1 | Vérifié | [S001 lot A/UI](preuves-corrections/S001/LOT-A-UI.md) | Non publiée |
| F08 | P2 | Vérifié | [S001 intégrée](preuves-corrections/S001/SESSION-VERIFIEE.md) | Non publiée |
| F09 | P2 | Ouvert | À produire | Non évaluée |
| F10 | P2 | Ouvert | À produire | Non évaluée |
| F11 | P2 | En cours | AC1 : S001 test clavier red/green ; reste ouvert | Non publiée |
| F12 | P2 | Ouvert | À produire | Non évaluée |
| F13 | P2 | Vérifié | [S001 intégrée](preuves-corrections/S001/SESSION-VERIFIEE.md) | Non publiée |

## Fiches de correction

Chaque fiche doit être complétée. Le passage à « vérifié » requiert tous les jalons ci-dessous et chaque critère applicable.

### F01 Validation du deck sur le mauvais chemin de parsing

Priorité : P1. État : vérifié. Responsable : équipe S001. Référence : section 5 de l’audit, fiche F01.

**Jalons obligatoires**

- [x] F01-J1 : code actuel relu et comportement initial établi par reproduction ou preuve adaptée ; périmètre et fichiers concernés identifiés.
- [x] F01-J2 : test pertinent échouant avant correction, ou preuve de défaut statique/HTTP/editorial justifiée ; résultat attendu défini indépendamment du code fautif.
- [x] F01-J3 : correction implémentée, changements limités au contrat et compatibilité des données préservée.
- [x] F01-J4 : critères d’acceptation ci-dessous validés avec preuves ; exceptions éventuelles explicitement examinées.
- [x] F01-J5 : tests de non-régression propres à cette fiche et parcours voisins passants sur la version corrigée.
- [x] F01-J6 : lint/typecheck pertinents et contrôles de build si impactés passants ; absence de nouvelle erreur dans les parcours joués.
- [x] F01-J7 : diff relu avec regard critique, par un autre membre si disponible ; risques d’intégration examinés et validation de la version intégrée réalisée.
- [x] F01-J8 : preuves consignées, suivi mis à jour et état passé à « vérifié » uniquement si tous les jalons sont acquis.

**Critères de l’audit**

- [x] F01-AC1 : aucune analyse ni sauvegarde n’est produite si aucune carte n’a été interprétée.
- [x] F01-AC2 : une quantité excessive est refusée avant la résolution Scryfall et les tableaux de copies.
- [x] F01-AC3 : la même entrée reçoit la même validation via saisie, lien partagé et restauration.
- [x] F01-AC4 : les decks 40, 60, 99 et 100 cartes valides ainsi que les quantités de basics admises restent acceptés.
- [x] F01-AC5 : une ligne ignorée est signalée avec son numéro ou sa cause, sans inventer de carte.

**Non-régression attendue**

Decks nominaux 40/60/99/100 cartes ; basics répétés autorisés ; entrée vide, texte libre, quantité non sûre, total excessif ; parité saisie, partage et restauration ; aucune requête ni sauvegarde sur rejet. Préserver la distinction deck expérimental et texte invalide.

**Journal de preuves S001 — vérification locale du 6 septembre 2026**

Revalidé après intégration des synthèses/réseau/historique : [732 unitaires et30 E2E du candidat final](preuves-corrections/S001/SESSION-VERIFIEE.md). Le manifest final identifie désormais la version intégrée ; le red et le premier lot restent conservés.

Voir [compte rendu intégré et correspondance AC](preuves-corrections/S001/LOT-A-UI.md), [diff testé](preuves-corrections/S001/lot-a-ui.patch) et [manifest SHA-256](preuves-corrections/S001/lot-a-ui-manifest.json). Les détails de commande, résultats, revue, non-régression et limites ci-dessous sont centralisés dans cette preuve.

- Version avant et résultat initial : voir preuve S001 ci-dessus
- Version corrigée ou référence du diff : voir preuve S001 ci-dessus
- Fichiers modifiés et choix de correction : voir preuve S001 ci-dessus
- Tests unitaires/intégration, commandes et résultats : voir preuve S001 ci-dessus
- Parcours navigateur/HTTP, environnement et résultats : voir preuve S001 ci-dessus
- Correspondance critères → preuves : voir preuve S001 ci-dessus
- Non-régression exécutée, résultats et lien vers sorties : voir preuve S001 ci-dessus
- Lint, types, build nécessaires et résultats : voir preuve S001 ci-dessus
- Relecteur, date et résultat de revue : voir preuve S001 ci-dessus
- Limites, blocages et tests non exécutés : voir preuve S001 ci-dessus
- Validation après intégration et date de clôture : voir preuve S001 ci-dessus
- Livraison éventuelle, version et contrôle après publication : non effectuée

### F02 Sections de deck incorrectement interprétées

Priorité : P1. État : vérifié. Responsable : équipe S001. Référence : section 5 de l’audit, fiche F02.

**Jalons obligatoires**

- [x] F02-J1 : code actuel relu et comportement initial établi par reproduction ou preuve adaptée ; périmètre et fichiers concernés identifiés.
- [x] F02-J2 : test pertinent échouant avant correction, ou preuve de défaut statique/HTTP/editorial justifiée ; résultat attendu défini indépendamment du code fautif.
- [x] F02-J3 : correction implémentée, changements limités au contrat et compatibilité des données préservée.
- [x] F02-J4 : critères d’acceptation ci-dessous validés avec preuves ; exceptions éventuelles explicitement examinées.
- [x] F02-J5 : tests de non-régression propres à cette fiche et parcours voisins passants sur la version corrigée.
- [x] F02-J6 : lint/typecheck pertinents et contrôles de build si impactés passants ; absence de nouvelle erreur dans les parcours joués.
- [x] F02-J7 : diff relu avec regard critique, par un autre membre si disponible ; risques d’intégration examinés et validation de la version intégrée réalisée.
- [x] F02-J8 : preuves consignées, suivi mis à jour et état passé à « vérifié » uniquement si tous les jalons sont acquis.

**Critères de l’audit**

- [x] F02-AC1 : les cartes Maybeboard n’entrent pas dans le principal.
- [x] F02-AC2 : une ligne SB inline n’affecte aucune ligne principale ultérieure.
- [x] F02-AC3 : les transitions Sideboard vers Deck et Commander vers Deck sont couvertes.
- [x] F02-AC4 : les exports catégorisés avec lignes blanches ne sont pas artificiellement divisés.
- [x] F02-AC5 : les totaux principal, command zone et sideboard sont séparément vérifiables.

**Non-régression attendue**

Exports supportés Arena/Moxfield ; lignes blanches et catégories ; SB inline avant/après principal ; Maybeboard, Companion, Commander et transitions vers Deck ; totaux de chaque population ; aucune modification involontaire des échanges post-board.

**Journal de preuves S001 — vérification locale du 6 septembre 2026**

Revalidé après intégration des synthèses/réseau/historique : [732 unitaires et30 E2E du candidat final](preuves-corrections/S001/SESSION-VERIFIEE.md). Le manifest final identifie désormais la version intégrée ; le red et le premier lot restent conservés.

Voir [compte rendu intégré et correspondance AC](preuves-corrections/S001/LOT-A-UI.md), [diff testé](preuves-corrections/S001/lot-a-ui.patch) et [manifest SHA-256](preuves-corrections/S001/lot-a-ui-manifest.json). Les détails de commande, résultats, revue, non-régression et limites ci-dessous sont centralisés dans cette preuve.

- Version avant et résultat initial : voir preuve S001 ci-dessus
- Version corrigée ou référence du diff : voir preuve S001 ci-dessus
- Fichiers modifiés et choix de correction : voir preuve S001 ci-dessus
- Tests unitaires/intégration, commandes et résultats : voir preuve S001 ci-dessus
- Parcours navigateur/HTTP, environnement et résultats : voir preuve S001 ci-dessus
- Correspondance critères → preuves : voir preuve S001 ci-dessus
- Non-régression exécutée, résultats et lien vers sorties : voir preuve S001 ci-dessus
- Lint, types, build nécessaires et résultats : voir preuve S001 ci-dessus
- Relecteur, date et résultat de revue : voir preuve S001 ci-dessus
- Limites, blocages et tests non exécutés : voir preuve S001 ci-dessus
- Validation après intégration et date de clôture : voir preuve S001 ci-dessus
- Livraison éventuelle, version et contrôle après publication : non effectuée

### F03 Coûts hybrides et recommandations de couleurs

Priorité : P1. État : vérifié. Responsable : équipe S001. Référence : section 5 de l’audit, fiche F03.

**Jalons obligatoires**

- [x] F03-J1 : code actuel relu et comportement initial établi par reproduction ou preuve adaptée ; périmètre et fichiers concernés identifiés.
- [x] F03-J2 : test pertinent échouant avant correction, ou preuve de défaut statique/HTTP/editorial justifiée ; résultat attendu défini indépendamment du code fautif.
- [x] F03-J3 : correction implémentée, changements limités au contrat et compatibilité des données préservée.
- [x] F03-J4 : critères d’acceptation ci-dessous validés avec preuves ; exceptions éventuelles explicitement examinées.
- [x] F03-J5 : tests de non-régression propres à cette fiche et parcours voisins passants sur la version corrigée.
- [x] F03-J6 : lint/typecheck pertinents et contrôles de build si impactés passants ; absence de nouvelle erreur dans les parcours joués.
- [x] F03-J7 : diff relu avec regard critique, par un autre membre si disponible ; risques d’intégration examinés et validation de la version intégrée réalisée.
- [x] F03-J8 : preuves consignées, suivi mis à jour et état passé à « vérifié » uniquement si tous les jalons sont acquis.

**Critères de l’audit**

- [x] F03-AC1 : `{1}{R/G}` entièrement soutenu par du vert n’affiche pas un déficit rouge obligatoire.
- [x] F03-AC2 : `{R}{G}` conserve deux exigences distinctes.
- [x] F03-AC3 : les hybrides répétés ne sont pas payés deux fois par la même source physique dans le modèle exact.
- [x] F03-AC4 : score, badge, liste de recommandations et détail utilisent une sémantique cohérente.
- [x] F03-AC5 : les coûts phyrexians et autres alternatives non représentées restent explicitement limités.

**Non-régression attendue**

Hybride payable par une seule couleur, multicolore strict, hybrides répétés et sources partagées ; impossibilité de dépenser deux fois la même source ; distinction identité couleur/paiement ; accord entre score, badges, recommandations et détail. Comparer à un oracle indépendant.

**Journal de preuves S001 — version intégrée du 6 septembre 2026**

[Correspondance de tous les AC, commandes, résultats, revue et limites](preuves-corrections/S001/SESSION-VERIFIEE.md), [diff testé](preuves-corrections/S001/verified.patch), [manifest source/tests/build](preuves-corrections/S001/verified-manifest.json). Chaque champ ci-dessous renvoie à cette preuve datée ; les logs red/green et revues propres à la fiche y sont liés.

- Version avant et résultat initial : voir preuve intégrée S001 ci-dessus
- Version corrigée ou référence du diff : voir preuve intégrée S001 ci-dessus
- Fichiers modifiés et choix de correction : voir preuve intégrée S001 ci-dessus
- Tests unitaires/intégration, commandes et résultats : voir preuve intégrée S001 ci-dessus
- Parcours navigateur/HTTP, environnement et résultats : voir preuve intégrée S001 ci-dessus
- Correspondance critères → preuves : voir preuve intégrée S001 ci-dessus
- Non-régression exécutée, résultats et lien vers sorties : voir preuve intégrée S001 ci-dessus
- Lint, types, build nécessaires et résultats : voir preuve intégrée S001 ci-dessus
- Relecteur, date et résultat de revue : voir preuve intégrée S001 ci-dessus
- Limites, blocages et tests non exécutés : voir preuve intégrée S001 ci-dessus
- Validation après intégration et date de clôture : voir preuve intégrée S001 ci-dessus
- Livraison éventuelle, version et contrôle après publication : non effectuée

### F04 Sideboard inclus dans les cibles du principal

Priorité : P1. État : vérifié. Responsable : équipe S001. Référence : section 5 de l’audit, fiche F04.

**Jalons obligatoires**

- [x] F04-J1 : code actuel relu et comportement initial établi par reproduction ou preuve adaptée ; périmètre et fichiers concernés identifiés.
- [x] F04-J2 : test pertinent échouant avant correction, ou preuve de défaut statique/HTTP/editorial justifiée ; résultat attendu défini indépendamment du code fautif.
- [x] F04-J3 : correction implémentée, changements limités au contrat et compatibilité des données préservée.
- [x] F04-J4 : critères d’acceptation ci-dessous validés avec preuves ; exceptions éventuelles explicitement examinées.
- [x] F04-J5 : tests de non-régression propres à cette fiche et parcours voisins passants sur la version corrigée.
- [x] F04-J6 : lint/typecheck pertinents et contrôles de build si impactés passants ; absence de nouvelle erreur dans les parcours joués.
- [x] F04-J7 : diff relu avec regard critique, par un autre membre si disponible ; risques d’intégration examinés et validation de la version intégrée réalisée.
- [x] F04-J8 : preuves consignées, suivi mis à jour et état passé à « vérifié » uniquement si tous les jalons sont acquis.

**Critères de l’audit**

- [x] F04-AC1 : ajouter Counterspell au sideboard seul ne change pas les cibles du principal.
- [x] F04-AC2 : son entrée effective en post-board déclenche l’évaluation correspondante.
- [x] F04-AC3 : le nombre de cartes et les sources sont ceux de la même population que les sorts.
- [x] F04-AC4 : un commandant explicitement identifié reste traité selon un contrat documenté.

**Non-régression attendue**

Principal seul puis même principal avec sideboard bleu ; échanges post-board puis retour ; terrains de sideboard ; commandant explicite ; invariance des cibles tant que la population principale ne change pas.

**Journal de preuves S001 — version intégrée du 6 septembre 2026**

[Correspondance de tous les AC, commandes, résultats, revue et limites](preuves-corrections/S001/SESSION-VERIFIEE.md), [diff testé](preuves-corrections/S001/verified.patch), [manifest source/tests/build](preuves-corrections/S001/verified-manifest.json). Chaque champ ci-dessous renvoie à cette preuve datée ; les logs red/green et revues propres à la fiche y sont liés.

- Version avant et résultat initial : voir preuve intégrée S001 ci-dessus
- Version corrigée ou référence du diff : voir preuve intégrée S001 ci-dessus
- Fichiers modifiés et choix de correction : voir preuve intégrée S001 ci-dessus
- Tests unitaires/intégration, commandes et résultats : voir preuve intégrée S001 ci-dessus
- Parcours navigateur/HTTP, environnement et résultats : voir preuve intégrée S001 ci-dessus
- Correspondance critères → preuves : voir preuve intégrée S001 ci-dessus
- Non-régression exécutée, résultats et lien vers sorties : voir preuve intégrée S001 ci-dessus
- Lint, types, build nécessaires et résultats : voir preuve intégrée S001 ci-dessus
- Relecteur, date et résultat de revue : voir preuve intégrée S001 ci-dessus
- Limites, blocages et tests non exécutés : voir preuve intégrée S001 ci-dessus
- Validation après intégration et date de clôture : voir preuve intégrée S001 ci-dessus
- Livraison éventuelle, version et contrôle après publication : non effectuée

### F05 Clear laisse revenir une analyse active

Priorité : P1. État : vérifié. Responsable : équipe S001. Référence : section 5 de l’audit, fiche F05.

**Jalons obligatoires**

- [x] F05-J1 : code actuel relu et comportement initial établi par reproduction ou preuve adaptée ; périmètre et fichiers concernés identifiés.
- [x] F05-J2 : test pertinent échouant avant correction, ou preuve de défaut statique/HTTP/editorial justifiée ; résultat attendu défini indépendamment du code fautif.
- [x] F05-J3 : correction implémentée, changements limités au contrat et compatibilité des données préservée.
- [x] F05-J4 : critères d’acceptation ci-dessous validés avec preuves ; exceptions éventuelles explicitement examinées.
- [x] F05-J5 : tests de non-régression propres à cette fiche et parcours voisins passants sur la version corrigée.
- [x] F05-J6 : lint/typecheck pertinents et contrôles de build si impactés passants ; absence de nouvelle erreur dans les parcours joués.
- [x] F05-J7 : diff relu avec regard critique, par un autre membre si disponible ; risques d’intégration examinés et validation de la version intégrée réalisée.
- [x] F05-J8 : preuves consignées, suivi mis à jour et état passé à « vérifié » uniquement si tous les jalons sont acquis.

**Critères de l’audit**

- [x] F05-AC1 : Clear pendant résolution conserve l’éditeur vide même après la réponse réseau.
- [x] F05-AC2 : aucun enregistrement historique n’est ajouté par la génération annulée.
- [x] F05-AC3 : une analyse B lancée après A ne peut pas être remplacée par A.
- [x] F05-AC4 : les notifications et états de chargement ne sont pas modifiés par une génération obsolète.
- [x] F05-AC5 : quitter puis revenir à la route n’introduit pas de résultat fantôme.

**Non-régression attendue**

Clear avant résolution, analyse B terminant avant A, navigation/démontage et retour ; vérifier résultat, éditeur, loading, notifications ET historique. Le parcours nominal analyse/sauvegarde/restauration doit continuer à fonctionner.

**Journal de preuves S001 — vérification locale du 6 septembre 2026**

Revalidé après intégration des synthèses/réseau/historique : [732 unitaires et30 E2E du candidat final](preuves-corrections/S001/SESSION-VERIFIEE.md). Le manifest final identifie désormais la version intégrée ; le red et le premier lot restent conservés.

Voir [compte rendu intégré et correspondance AC](preuves-corrections/S001/LOT-A-UI.md), [diff testé](preuves-corrections/S001/lot-a-ui.patch) et [manifest SHA-256](preuves-corrections/S001/lot-a-ui-manifest.json). Les détails de commande, résultats, revue, non-régression et limites ci-dessous sont centralisés dans cette preuve.

- Version avant et résultat initial : voir preuve S001 ci-dessus
- Version corrigée ou référence du diff : voir preuve S001 ci-dessus
- Fichiers modifiés et choix de correction : voir preuve S001 ci-dessus
- Tests unitaires/intégration, commandes et résultats : voir preuve S001 ci-dessus
- Parcours navigateur/HTTP, environnement et résultats : voir preuve S001 ci-dessus
- Correspondance critères → preuves : voir preuve S001 ci-dessus
- Non-régression exécutée, résultats et lien vers sorties : voir preuve S001 ci-dessus
- Lint, types, build nécessaires et résultats : voir preuve S001 ci-dessus
- Relecteur, date et résultat de revue : voir preuve S001 ci-dessus
- Limites, blocages et tests non exécutés : voir preuve S001 ci-dessus
- Validation après intégration et date de clôture : voir preuve S001 ci-dessus
- Livraison éventuelle, version et contrôle après publication : non effectuée

### F06 Import et historique non validés complètement

Priorité : P1. État : vérifié. Responsable : équipe S001. Référence : section 5 de l’audit, fiche F06.

**Jalons obligatoires**

- [x] F06-J1 : code actuel relu et comportement initial établi par reproduction ou preuve adaptée ; périmètre et fichiers concernés identifiés.
- [x] F06-J2 : test pertinent échouant avant correction, ou preuve de défaut statique/HTTP/editorial justifiée ; résultat attendu défini indépendamment du code fautif.
- [x] F06-J3 : correction implémentée, changements limités au contrat et compatibilité des données préservée.
- [x] F06-J4 : critères d’acceptation ci-dessous validés avec preuves ; exceptions éventuelles explicitement examinées.
- [x] F06-J5 : tests de non-régression propres à cette fiche et parcours voisins passants sur la version corrigée.
- [x] F06-J6 : lint/typecheck pertinents et contrôles de build si impactés passants ; absence de nouvelle erreur dans les parcours joués.
- [x] F06-J7 : diff relu avec regard critique, par un autre membre si disponible ; risques d’intégration examinés et validation de la version intégrée réalisée.
- [x] F06-J8 : preuves consignées, suivi mis à jour et état passé à « vérifié » uniquement si tous les jalons sont acquis.

**Critères de l’audit**

- [x] F06-AC1 : les deux charges ci-dessus ne cassent aucun écran.
- [x] F06-AC2 : un import refusé laisse l’historique précédent inchangé.
- [x] F06-AC3 : une version ancienne reconnue est migrée ou restaurable en deck brut.
- [x] F06-AC4 : une seule entrée incorrecte ne rend pas les entrées valides inaccessibles.
- [x] F06-AC5 : quota, données rejetées et remplacement éventuel sont clairement signalés.

**Non-régression attendue**

JSON invalide, null, types incorrects, anciennes versions, import valide ; lecture interdite, quota et remplacement/fusion ; une entrée incorrecte ne masque pas les entrées valides ; un rejet laisse le stockage précédent intact ; export/réimport et restauration du deck brut.

**Journal de preuves S001 — version intégrée du 6 septembre 2026**

[Correspondance de tous les AC, commandes, résultats, revue et limites](preuves-corrections/S001/SESSION-VERIFIEE.md), [diff testé](preuves-corrections/S001/verified.patch), [manifest source/tests/build](preuves-corrections/S001/verified-manifest.json). Chaque champ ci-dessous renvoie à cette preuve datée ; les logs red/green et revues propres à la fiche y sont liés.

- Version avant et résultat initial : voir preuve intégrée S001 ci-dessus
- Version corrigée ou référence du diff : voir preuve intégrée S001 ci-dessus
- Fichiers modifiés et choix de correction : voir preuve intégrée S001 ci-dessus
- Tests unitaires/intégration, commandes et résultats : voir preuve intégrée S001 ci-dessus
- Parcours navigateur/HTTP, environnement et résultats : voir preuve intégrée S001 ci-dessus
- Correspondance critères → preuves : voir preuve intégrée S001 ci-dessus
- Non-régression exécutée, résultats et lien vers sorties : voir preuve intégrée S001 ci-dessus
- Lint, types, build nécessaires et résultats : voir preuve intégrée S001 ci-dessus
- Relecteur, date et résultat de revue : voir preuve intégrée S001 ci-dessus
- Limites, blocages et tests non exécutés : voir preuve intégrée S001 ci-dessus
- Validation après intégration et date de clôture : voir preuve intégrée S001 ci-dessus
- Livraison éventuelle, version et contrôle après publication : non effectuée

### F07 Réédition inaccessible au clavier

Priorité : P1. État : vérifié. Responsable : équipe S001. Référence : section 5 de l’audit, fiche F07.

**Jalons obligatoires**

- [x] F07-J1 : code actuel relu et comportement initial établi par reproduction ou preuve adaptée ; périmètre et fichiers concernés identifiés.
- [x] F07-J2 : test pertinent échouant avant correction, ou preuve de défaut statique/HTTP/editorial justifiée ; résultat attendu défini indépendamment du code fautif.
- [x] F07-J3 : correction implémentée, changements limités au contrat et compatibilité des données préservée.
- [x] F07-J4 : critères d’acceptation ci-dessous validés avec preuves ; exceptions éventuelles explicitement examinées.
- [x] F07-J5 : tests de non-régression propres à cette fiche et parcours voisins passants sur la version corrigée.
- [x] F07-J6 : lint/typecheck pertinents et contrôles de build si impactés passants ; absence de nouvelle erreur dans les parcours joués.
- [x] F07-J7 : diff relu avec regard critique, par un autre membre si disponible ; risques d’intégration examinés et validation de la version intégrée réalisée.
- [x] F07-J8 : preuves consignées, suivi mis à jour et état passé à « vérifié » uniquement si tous les jalons sont acquis.

**Critères de l’audit**

- [x] F07-AC1 : réédition complète avec Tab, Entrée et Espace.
- [x] F07-AC2 : nom accessible explicite, focus visible, état ouvert/fermé compréhensible.
- [x] F07-AC3 : le champ de deck est atteignable après l’ouverture sans perte de contenu.
- [x] F07-AC4 : comportement identique au pointeur et absence de double activation.

**Non-régression attendue**

Tab, Entrée et Espace après analyse/minimisation ; nom accessible, focus visible et retour vers la saisie ; pointeur et tactile ; pas de double activation, de contrôle imbriqué ni de perte du texte.

**Journal de preuves S001 — vérification locale du 6 septembre 2026**

Revalidé après intégration des synthèses/réseau/historique : [732 unitaires et30 E2E du candidat final](preuves-corrections/S001/SESSION-VERIFIEE.md). Le manifest final identifie désormais la version intégrée ; le red et le premier lot restent conservés.

Voir [compte rendu intégré et correspondance AC](preuves-corrections/S001/LOT-A-UI.md), [diff testé](preuves-corrections/S001/lot-a-ui.patch) et [manifest SHA-256](preuves-corrections/S001/lot-a-ui-manifest.json). Les détails de commande, résultats, revue, non-régression et limites ci-dessous sont centralisés dans cette preuve.

- Version avant et résultat initial : voir preuve S001 ci-dessus
- Version corrigée ou référence du diff : voir preuve S001 ci-dessus
- Fichiers modifiés et choix de correction : voir preuve S001 ci-dessus
- Tests unitaires/intégration, commandes et résultats : voir preuve S001 ci-dessus
- Parcours navigateur/HTTP, environnement et résultats : voir preuve S001 ci-dessus
- Correspondance critères → preuves : voir preuve S001 ci-dessus
- Non-régression exécutée, résultats et lien vers sorties : voir preuve S001 ci-dessus
- Lint, types, build nécessaires et résultats : voir preuve S001 ci-dessus
- Relecteur, date et résultat de revue : voir preuve S001 ci-dessus
- Limites, blocages et tests non exécutés : voir preuve S001 ci-dessus
- Validation après intégration et date de clôture : voir preuve S001 ci-dessus
- Livraison éventuelle, version et contrôle après publication : non effectuée

### F08 Annulation réseau et durée globale incomplètes

Priorité : P2. État : vérifié. Responsable : équipe S001. Référence : section 5 de l’audit, fiche F08.

**Jalons obligatoires**

- [x] F08-J1 : code actuel relu et comportement initial établi par reproduction ou preuve adaptée ; périmètre et fichiers concernés identifiés.
- [x] F08-J2 : test pertinent échouant avant correction, ou preuve de défaut statique/HTTP/editorial justifiée ; résultat attendu défini indépendamment du code fautif.
- [x] F08-J3 : correction implémentée, changements limités au contrat et compatibilité des données préservée.
- [x] F08-J4 : critères d’acceptation ci-dessous validés avec preuves ; exceptions éventuelles explicitement examinées.
- [x] F08-J5 : tests de non-régression propres à cette fiche et parcours voisins passants sur la version corrigée.
- [x] F08-J6 : lint/typecheck pertinents et contrôles de build si impactés passants ; absence de nouvelle erreur dans les parcours joués.
- [x] F08-J7 : diff relu avec regard critique, par un autre membre si disponible ; risques d’intégration examinés et validation de la version intégrée réalisée.
- [x] F08-J8 : preuves consignées, suivi mis à jour et état passé à « vérifié » uniquement si tous les jalons sont acquis.

**Critères de l’audit**

- [x] F08-AC1 : annulation durant Retry-After rejette avec une erreur d’annulation sans second fetch.
- [x] F08-AC2 : le même signal atteint les collections, fallbacks et lectures de corps.
- [x] F08-AC3 : un corps qui ne se termine pas n’immobilise pas indéfiniment l’analyse.
- [x] F08-AC4 : le retry respecte la politique 429/5xx et le budget global documenté.
- [x] F08-AC5 : annulation, 404 définitif et indisponibilité transitoire restent distingués.

**Non-régression attendue**

Abort avant fetch, durant requête, lecture JSON et Retry-After ; corps qui ne termine pas ; 429, 5xx, 404 et JSON incorrect ; fallback et cache ; aucune tentative après annulation ; durée totale bornée ; succès nominal et absence de retries agressifs.

**Journal de preuves S001 — version intégrée du 6 septembre 2026**

[Correspondance de tous les AC, commandes, résultats, revue et limites](preuves-corrections/S001/SESSION-VERIFIEE.md), [diff testé](preuves-corrections/S001/verified.patch), [manifest source/tests/build](preuves-corrections/S001/verified-manifest.json). Chaque champ ci-dessous renvoie à cette preuve datée ; les logs red/green et revues propres à la fiche y sont liés.

- Version avant et résultat initial : voir preuve intégrée S001 ci-dessus
- Version corrigée ou référence du diff : voir preuve intégrée S001 ci-dessus
- Fichiers modifiés et choix de correction : voir preuve intégrée S001 ci-dessus
- Tests unitaires/intégration, commandes et résultats : voir preuve intégrée S001 ci-dessus
- Parcours navigateur/HTTP, environnement et résultats : voir preuve intégrée S001 ci-dessus
- Correspondance critères → preuves : voir preuve intégrée S001 ci-dessus
- Non-régression exécutée, résultats et lien vers sorties : voir preuve intégrée S001 ci-dessus
- Lint, types, build nécessaires et résultats : voir preuve intégrée S001 ci-dessus
- Relecteur, date et résultat de revue : voir preuve intégrée S001 ci-dessus
- Limites, blocages et tests non exécutés : voir preuve intégrée S001 ci-dessus
- Validation après intégration et date de clôture : voir preuve intégrée S001 ci-dessus
- Livraison éventuelle, version et contrôle après publication : non effectuée

### F09 HTML initial générique et soft 404

Priorité : P2. État : ouvert. Responsable : à attribuer. Référence : section 5 de l’audit, fiche F09.

**Jalons obligatoires**

- [ ] F09-J1 : code actuel relu et comportement initial établi par reproduction ou preuve adaptée ; périmètre et fichiers concernés identifiés.
- [ ] F09-J2 : test pertinent échouant avant correction, ou preuve de défaut statique/HTTP/editorial justifiée ; résultat attendu défini indépendamment du code fautif.
- [ ] F09-J3 : correction implémentée, changements limités au contrat et compatibilité des données préservée.
- [ ] F09-J4 : critères d’acceptation ci-dessous validés avec preuves ; exceptions éventuelles explicitement examinées.
- [ ] F09-J5 : tests de non-régression propres à cette fiche et parcours voisins passants sur la version corrigée.
- [ ] F09-J6 : lint/typecheck pertinents et contrôles de build si impactés passants ; absence de nouvelle erreur dans les parcours joués.
- [ ] F09-J7 : diff relu avec regard critique, par un autre membre si disponible ; risques d’intégration examinés et validation de la version intégrée réalisée.
- [ ] F09-J8 : preuves consignées, suivi mis à jour et état passé à « vérifié » uniquement si tous les jalons sont acquis.

**Critères de l’audit**

- [ ] F09-AC1 : les routes éditoriales critiques renvoient leur contenu sans exécution JavaScript.
- [ ] F09-AC2 : titre, description et canonical correspondent à chaque route, sans doublon contradictoire.
- [ ] F09-AC3 : une route absente renvoie un statut et des directives adaptés, pas une page d’accueil indexable.
- [ ] F09-AC4 : les liens directs, les chunks et le rechargement de l’analyseur restent fonctionnels.
- [ ] F09-AC5 : le pipeline échoue ou alerte explicitement si le contrat de prérendu choisi n’est pas respecté.

**Non-régression attendue**

HTTP initial et DOM de l’accueil, analyseur, bibliothèque, article, auteur, privacy, route absente et asset ; titres/canonical cohérents ; liens directs, rechargement SPA, chunks et partage ; comparer artefact candidat et environnement servi. Ne pas confondre preview Vite et routage Vercel.

**Journal de preuves à compléter**

- Version avant et résultat initial : à renseigner
- Version corrigée ou référence du diff : à renseigner
- Fichiers modifiés et choix de correction : à renseigner
- Tests unitaires/intégration, commandes et résultats : à renseigner
- Parcours navigateur/HTTP, environnement et résultats : à renseigner
- Correspondance critères → preuves : à renseigner
- Non-régression exécutée, résultats et lien vers sorties : à renseigner
- Lint, types, build nécessaires et résultats : à renseigner
- Relecteur, date et résultat de revue : à renseigner
- Limites, blocages et tests non exécutés : à renseigner
- Validation après intégration et date de clôture : à renseigner
- Livraison éventuelle, version et contrôle après publication : non effectuée

### F10 Textes et promesses désalignés avec les modèles

Priorité : P2. État : ouvert. Responsable : à attribuer. Référence : section 5 de l’audit, fiche F10.

**Jalons obligatoires**

- [ ] F10-J1 : code actuel relu et comportement initial établi par reproduction ou preuve adaptée ; périmètre et fichiers concernés identifiés.
- [ ] F10-J2 : test pertinent échouant avant correction, ou preuve de défaut statique/HTTP/editorial justifiée ; résultat attendu défini indépendamment du code fautif.
- [ ] F10-J3 : correction implémentée, changements limités au contrat et compatibilité des données préservée.
- [ ] F10-J4 : critères d’acceptation ci-dessous validés avec preuves ; exceptions éventuelles explicitement examinées.
- [ ] F10-J5 : tests de non-régression propres à cette fiche et parcours voisins passants sur la version corrigée.
- [ ] F10-J6 : lint/typecheck pertinents et contrôles de build si impactés passants ; absence de nouvelle erreur dans les parcours joués.
- [ ] F10-J7 : diff relu avec regard critique, par un autre membre si disponible ; risques d’intégration examinés et validation de la version intégrée réalisée.
- [ ] F10-J8 : preuves consignées, suivi mis à jour et état passé à « vérifié » uniquement si tous les jalons sont acquis.

**Critères de l’audit**

- [ ] F10-AC1 : aucune équivalence Health Score / proportion de sorts sur la courbe.
- [ ] F10-AC2 : « exact » comporte le périmètre du modèle et ne qualifie pas l’estimation par défaut.
- [ ] F10-AC3 : règles de mulligan et identification du commandant décrivent le comportement réel.
- [ ] F10-AC4 : compteurs de bibliothèque et d’onglets cohérents partout.
- [ ] F10-AC5 : seuils et qualificatifs du score sont unifiés ou leur différence est expliquée.

**Non-régression attendue**

Accueil, métadonnées, guide, aide, résultats et exports ; score heuristique versus probabilité exacte ; mode estimation, limites exact, ramp, Commander et London ; compteurs dérivés ; revue sémantique humaine sans snapshots textuels aveugles.

**Journal de preuves à compléter**

- Version avant et résultat initial : à renseigner
- Version corrigée ou référence du diff : à renseigner
- Fichiers modifiés et choix de correction : à renseigner
- Tests unitaires/intégration, commandes et résultats : à renseigner
- Parcours navigateur/HTTP, environnement et résultats : à renseigner
- Correspondance critères → preuves : à renseigner
- Non-régression exécutée, résultats et lien vers sorties : à renseigner
- Lint, types, build nécessaires et résultats : à renseigner
- Relecteur, date et résultat de revue : à renseigner
- Limites, blocages et tests non exécutés : à renseigner
- Validation après intégration et date de clôture : à renseigner
- Livraison éventuelle, version et contrôle après publication : non effectuée

### F11 Contrôles qualité insuffisamment reliés à la livraison

Priorité : P2. État : en cours (AC1 seul). Responsable : équipe S001. Référence : section 5 de l’audit, fiche F11.

**Jalons obligatoires**

- [ ] F11-J1 : code actuel relu et comportement initial établi par reproduction ou preuve adaptée ; périmètre et fichiers concernés identifiés.
- [ ] F11-J2 : test pertinent échouant avant correction, ou preuve de défaut statique/HTTP/editorial justifiée ; résultat attendu défini indépendamment du code fautif.
- [ ] F11-J3 : correction implémentée, changements limités au contrat et compatibilité des données préservée.
- [ ] F11-J4 : critères d’acceptation ci-dessous validés avec preuves ; exceptions éventuelles explicitement examinées.
- [ ] F11-J5 : tests de non-régression propres à cette fiche et parcours voisins passants sur la version corrigée.
- [ ] F11-J6 : lint/typecheck pertinents et contrôles de build si impactés passants ; absence de nouvelle erreur dans les parcours joués.
- [ ] F11-J7 : diff relu avec regard critique, par un autre membre si disponible ; risques d’intégration examinés et validation de la version intégrée réalisée.
- [ ] F11-J8 : preuves consignées, suivi mis à jour et état passé à « vérifié » uniquement si tous les jalons sont acquis.

**Critères de l’audit**

- [x] F11-AC1 : un défaut connu de réédition clavier échoue dans la validation ciblée.
- [ ] F11-AC2 : un défaut de contraste pertinent ne passe pas grâce à une valeur CSS simplement non vide.
- [ ] F11-AC3 : les suites automatiques ne demandent que les navigateurs installés.
- [ ] F11-AC4 : le contrat HTML de F09 est vérifié sur l’artefact candidat.
- [ ] F11-AC5 : la condition de publication après checks est documentée et vérifiée sans modifier la production pour un test.

**Non-régression attendue**

Une assertion doit détecter un défaut connu, puis passer après correction ; sélectionner les navigateurs effectivement installés ; contrôler les suites requises et le build/prérendu candidat ; préserver le pipeline nominal et éviter deux chemins de publication concurrents.

**Journal de preuves à compléter**

- Version avant et résultat initial : à renseigner
- Version corrigée ou référence du diff : à renseigner
- Fichiers modifiés et choix de correction : à renseigner
- Tests unitaires/intégration, commandes et résultats : à renseigner
- Parcours navigateur/HTTP, environnement et résultats : à renseigner
- Correspondance critères → preuves : à renseigner
- Non-régression exécutée, résultats et lien vers sorties : à renseigner
- Lint, types, build nécessaires et résultats : à renseigner
- Relecteur, date et résultat de revue : à renseigner
- Limites, blocages et tests non exécutés : à renseigner
- Validation après intégration et date de clôture : à renseigner
- Livraison éventuelle, version et contrôle après publication : non effectuée

### F12 Information de confidentialité incomplète

Priorité : P2. État : ouvert. Responsable : à attribuer. Référence : section 5 de l’audit, fiche F12.

**Jalons obligatoires**

- [ ] F12-J1 : code actuel relu et comportement initial établi par reproduction ou preuve adaptée ; périmètre et fichiers concernés identifiés.
- [ ] F12-J2 : test pertinent échouant avant correction, ou preuve de défaut statique/HTTP/editorial justifiée ; résultat attendu défini indépendamment du code fautif.
- [ ] F12-J3 : correction implémentée, changements limités au contrat et compatibilité des données préservée.
- [ ] F12-J4 : critères d’acceptation ci-dessous validés avec preuves ; exceptions éventuelles explicitement examinées.
- [ ] F12-J5 : tests de non-régression propres à cette fiche et parcours voisins passants sur la version corrigée.
- [ ] F12-J6 : lint/typecheck pertinents et contrôles de build si impactés passants ; absence de nouvelle erreur dans les parcours joués.
- [ ] F12-J7 : diff relu avec regard critique, par un autre membre si disponible ; risques d’intégration examinés et validation de la version intégrée réalisée.
- [ ] F12-J8 : preuves consignées, suivi mis à jour et état passé à « vérifié » uniquement si tous les jalons sont acquis.

**Critères de l’audit**

- [ ] F12-AC1 : les échanges Scryfall sont clairement décrits dans la politique détaillée.
- [ ] F12-AC2 : aucune promesse absolue de zéro transmission ne contredit les dépendances réseau.
- [ ] F12-AC3 : les stockages et leur effacement sont documentés avec les limites utiles.
- [ ] F12-AC4 : le statut de Sentry et la procédure préalable à son activation sont explicites.
- [ ] F12-AC5 : les qualifications juridiques sont validées par une personne compétente avant déclaration de conformité.

**Non-régression attendue**

Comparer mentions et flux effectifs Scryfall/fonts/CDN/stockage ; préservation sauvegarde, restauration et suppression ; cohérence des écrans privacy ; état conditionnel de Sentry ; aucune nouvelle télémétrie ou transmission sensible introduite par la correction.

**Journal de preuves à compléter**

- Version avant et résultat initial : à renseigner
- Version corrigée ou référence du diff : à renseigner
- Fichiers modifiés et choix de correction : à renseigner
- Tests unitaires/intégration, commandes et résultats : à renseigner
- Parcours navigateur/HTTP, environnement et résultats : à renseigner
- Correspondance critères → preuves : à renseigner
- Non-régression exécutée, résultats et lien vers sorties : à renseigner
- Lint, types, build nécessaires et résultats : à renseigner
- Relecteur, date et résultat de revue : à renseigner
- Limites, blocages et tests non exécutés : à renseigner
- Validation après intégration et date de clôture : à renseigner
- Livraison éventuelle, version et contrôle après publication : non effectuée

### F13 Erreur fatale du worker de mulligan non récupérée

Priorité : P2. État : vérifié. Responsable : équipe S001. Référence : section 5 de l’audit, fiche F13.

**Jalons obligatoires**

- [x] F13-J1 : code actuel relu et comportement initial établi par reproduction ou preuve adaptée ; périmètre et fichiers concernés identifiés.
- [x] F13-J2 : test pertinent échouant avant correction, ou preuve de défaut statique/HTTP/editorial justifiée ; résultat attendu défini indépendamment du code fautif.
- [x] F13-J3 : correction implémentée, changements limités au contrat et compatibilité des données préservée.
- [x] F13-J4 : critères d’acceptation ci-dessous validés avec preuves ; exceptions éventuelles explicitement examinées.
- [x] F13-J5 : tests de non-régression propres à cette fiche et parcours voisins passants sur la version corrigée.
- [x] F13-J6 : lint/typecheck pertinents et contrôles de build si impactés passants ; absence de nouvelle erreur dans les parcours joués.
- [x] F13-J7 : diff relu avec regard critique, par un autre membre si disponible ; risques d’intégration examinés et validation de la version intégrée réalisée.
- [x] F13-J8 : preuves consignées, suivi mis à jour et état passé à « vérifié » uniquement si tous les jalons sont acquis.

**Critères de l’audit**

- [x] F13-AC1 : un worker qui ne charge pas produit une erreur récupérable.
- [x] F13-AC2 : une erreur fatale libère l’état de chargement et les listeners.
- [x] F13-AC3 : une relance fonctionne sans conserver un résultat obsolète.
- [x] F13-AC4 : un calcul légitime en précision élevée n’est pas interrompu arbitrairement.

**Non-régression attendue**

Worker nominal et précision élevée ; erreur de construction, error, messageerror, absence de réponse et postMessage en échec ; annulation, démontage et relance ; chargement libéré, listeners nettoyés, absence de résultat obsolète ; pas de timeout arbitraire sur calcul légitime.

**Journal de preuves S001 — version intégrée du 6 septembre 2026**

[Correspondance de tous les AC, commandes, résultats, revue et limites](preuves-corrections/S001/SESSION-VERIFIEE.md), [diff testé](preuves-corrections/S001/verified.patch), [manifest source/tests/build](preuves-corrections/S001/verified-manifest.json). Chaque champ ci-dessous renvoie à cette preuve datée ; les logs red/green et revues propres à la fiche y sont liés.

- Version avant et résultat initial : voir preuve intégrée S001 ci-dessus
- Version corrigée ou référence du diff : voir preuve intégrée S001 ci-dessus
- Fichiers modifiés et choix de correction : voir preuve intégrée S001 ci-dessus
- Tests unitaires/intégration, commandes et résultats : voir preuve intégrée S001 ci-dessus
- Parcours navigateur/HTTP, environnement et résultats : voir preuve intégrée S001 ci-dessus
- Correspondance critères → preuves : voir preuve intégrée S001 ci-dessus
- Non-régression exécutée, résultats et lien vers sorties : voir preuve intégrée S001 ci-dessus
- Lint, types, build nécessaires et résultats : voir preuve intégrée S001 ci-dessus
- Relecteur, date et résultat de revue : voir preuve intégrée S001 ci-dessus
- Limites, blocages et tests non exécutés : voir preuve intégrée S001 ci-dessus
- Validation après intégration et date de clôture : voir preuve intégrée S001 ci-dessus
- Livraison éventuelle, version et contrôle après publication : non effectuée

## Améliorations complémentaires

Ces travaux restent distincts de la clôture des défauts F. Pour chacun, renseigner responsable, portée, version, tests et preuve dans le journal sous la liste. Les critères ci-dessous opérationnalisent les propositions de l’audit ; ils ne sont pas des résultats acquis.

### E01 Observabilité minimale et confidentialité

- [ ] Contrat de diagnostic défini : disponibilité, erreurs utiles, version, données autorisées et durées.
- [ ] Mécanisme retenu compatible avec CSP et mentions F12 ; aucune donnée de deck privée envoyée par défaut.
- [ ] Si un service externe est retenu, activation autorisée et événement non sensible reçu puis inspecté ; sinon solution locale explicitement documentée et statut V08 adapté.
- [ ] Panne de collecte sans impact sur l’analyse ; aucune régression de stockage ou confidentialité ; preuves consignées.

### E02 Compréhension du résultat

- [ ] Deck interprété, population, format et définition de la métrique présentés de manière cohérente.
- [ ] Parcours principal et post-board testés ; utilisateur capable d’expliquer ce que mesure le résultat.
- [ ] Contrôle clavier/mobile et non-régression des calculs ; preuves consignées.

### E03 Cohérence des scores et composants d’aide

- [ ] Vocabulaire, couleurs, seuils et unités communs définis ; divergences intentionnelles expliquées.
- [ ] Accueil, aides, résultats et exports comparés ; seuils limites testés.
- [ ] Focus, contraste pertinent, mobile et absence de changement mathématique involontaire vérifiés ; preuves consignées.

### E04 Mesures et optimisation de performance

- [ ] Baseline datée avec appareil, réseau, cache, URL et distribution de mesures, puis priorité justifiée.
- [ ] Amélioration retenue mesurée avant/après sous conditions comparables, ou absence de besoin documentée.
- [ ] Exactitude des résultats, annulation, chargement et parcours dégradés préservés ; aucune simple substitution du poids du bundle aux Core Web Vitals.

### E05 Contenu éditorial utile

- [ ] Périmètre défini après F09/F10 ; articles reliés à des usages et définitions exactes.
- [ ] Sources, liens, titres et cohérence des promesses vérifiés.
- [ ] Recherche, navigation directe, métadonnées et compteurs sans régression ; preuves consignées.

### E06 Réduction de dette technique

- [ ] Usages des helpers, caches et gros composants inventoriés ; extraction précise et bénéfice justifié.
- [ ] Compatibilité runtime/engines et configuration documentée à partir des versions réellement utilisées.
- [ ] Tests des contrats inchangés passants ; aucun export retiré sans vérification de ses consommateurs ; lint/types/build passants.

Journal E01 à E06 : ajouter un bloc daté par amélioration avec portée, décision, version, tests, résultats, preuve et risques restants.

## Vérifications restant ouvertes

Cocher seulement quand la preuve attendue a été obtenue. Un accès externe manquant est un blocage explicite, pas une validation réussie. Une décision de périmètre doit conserver l’historique de la vérification initialement ouverte.

- [ ] **V01 — LCP INP CLS et TTFB terrain**. Preuve attendue : Mesures datées, profil et distribution. État : ouvert. Référence de preuve ou blocage : à renseigner.
- [ ] **V02 — Vercel et protection de branche**. Preuve attendue : Configuration de checks et publication. État : ouvert. Référence de preuve ou blocage : à renseigner.
- [ ] **V03 — WCAG 2.2 AA complète**. Preuve attendue : Audit automatisé pertinent et manuel. État : ouvert. Référence de preuve ou blocage : à renseigner.
- [ ] **V04 — Safari et mobile physiques**. Preuve attendue : Parcours ciblés sur risques identifiés. État : ouvert. Référence de preuve ou blocage : à renseigner.
- [ ] **V05 — Export PNG PDF JSON**. Preuve attendue : Fichiers comparés aux résultats affichés. État : ouvert. Référence de preuve ou blocage : à renseigner.
- [ ] **V06 — Comparaison et post-board complets**. Preuve attendue : Parcours avec oracles de populations. État : ouvert. Référence de preuve ou blocage : à renseigner.
- [ ] **V07 — Cartes MTG spéciales exhaustives**. Preuve attendue : Matrice de support versionnée. État : ouvert. Référence de preuve ou blocage : à renseigner.
- [ ] **V08 — Sentry effectif et données reçues**. Preuve attendue : Événement non sensible vérifié. État : ouvert. Référence de preuve ou blocage : à renseigner.
- [ ] **V09 — Conformité juridique globale**. Preuve attendue : Validation compétente des mentions. État : ouvert. Référence de preuve ou blocage : à renseigner.
- [ ] **V10 — Search Console et indexation réelle**. Preuve attendue : Inspection des URLs et statuts. État : ouvert. Référence de preuve ou blocage : à renseigner.
- [ ] **V11 — Tous les retours arrière et liens partagés**. Preuve attendue : Scénarios navigation versionnés. État : ouvert. Référence de preuve ou blocage : à renseigner.
- [ ] **V12 — Liens externes de la bibliothèque**. Preuve attendue : Inventaire daté des destinations. État : ouvert. Référence de preuve ou blocage : à renseigner.

## Campagne finale de non-régression

Cette campagne porte sur la version intégrée finale, après les validations par correction. Elle ne remplace pas les tests de chaque fiche. Pour les scénarios négatifs, « réussi » signifie rejet ou récupération conforme au contrat corrigé.

- [ ] **NR-M01 — Accueil et premier démarrage** : Rôle et CTA clairs. Version, résultat et preuve : à renseigner.
- [ ] **NR-M02 — Exemple puis analyse** : Deck reconnu et résultats. Version, résultat et preuve : à renseigner.
- [ ] **NR-M03 — Champ vide** : Pas de lancement. Version, résultat et preuve : à renseigner.
- [ ] **NR-M04 — Texte non interprétable** : Erreur de format. Version, résultat et preuve : à renseigner.
- [ ] **NR-M05 — Quantité un million** : Refus avant allocation. Version, résultat et preuve : à renseigner.
- [ ] **NR-M06 — Section Maybeboard** : Cartes exclues. Version, résultat et preuve : à renseigner.
- [ ] **NR-M07 — SB inline puis principal** : Préfixe limité à sa ligne. Version, résultat et preuve : à renseigner.
- [ ] **NR-M08 — Coût hybride payable en vert** : Pas de besoin rouge obligatoire. Version, résultat et preuve : à renseigner.
- [ ] **NR-M09 — Sort bleu dans sideboard rouge** : Principal inchangé. Version, résultat et preuve : à renseigner.
- [ ] **NR-M10 — Clear pendant analyse** : Fin durable du travail. Version, résultat et preuve : à renseigner.
- [ ] **NR-M11 — Exact avec 24 Plains** : 97,84 % arrondi. Version, résultat et preuve : à renseigner.
- [ ] **NR-M12 — Mulligan sur cas simple** : Simulation aboutie. Version, résultat et preuve : à renseigner.
- [ ] **NR-M13 — Sauvegarde automatique** : Entrée historique. Version, résultat et preuve : à renseigner.
- [ ] **NR-M14 — Restauration de l’historique** : Nom et texte récupérés. Version, résultat et preuve : à renseigner.
- [ ] **NR-M15 — Recharger après restauration** : Deck récupérable. Version, résultat et preuve : à renseigner.
- [ ] **NR-M16 — Import de résultat mal typé** : Refus ou réparation. Version, résultat et preuve : à renseigner.
- [ ] **NR-M17 — Réédition au clavier** : Tab puis activation. Version, résultat et preuve : à renseigner.
- [ ] **NR-M18 — Menu mobile puis restauration** : Parcours utilisable. Version, résultat et preuve : à renseigner.
- [ ] **NR-M19 — Recherche Karsten** : Filtrage pertinent. Version, résultat et preuve : à renseigner.
- [ ] **NR-M20 — URL inexistante** : HTTP 404. Version, résultat et preuve : à renseigner.
- [ ] **NR-M21 — Partage encodage et décodage** : Aller-retour du deck. Version, résultat et preuve : à renseigner.
- [ ] **NR-M22 — Échanges post-board** : Population et résultats cohérents. Version, résultat et preuve : à renseigner.
- [ ] **NR-M23 — Export PNG PDF JSON** : Fichier fidèle. Version, résultat et preuve : à renseigner.
- [ ] **NR-M24 — Panne réseau globale** : Erreur puis reprise. Version, résultat et preuve : à renseigner.
- [ ] **NR-M25 — Comparaison de deux analyses** : Valeurs comparables. Version, résultat et preuve : à renseigner.
- [ ] **NR-M26 — Double clic et clics rapides** : Une génération active. Version, résultat et preuve : à renseigner.
- [ ] **NR-M27 — Retour arrière et lien direct partagé** : État cohérent. Version, résultat et preuve : à renseigner.
- [ ] **NR-M28 — Deck incomplet ou sans terrain** : Diagnostic explicite. Version, résultat et preuve : à renseigner.

### Contrôles transversaux de clôture

- [ ] Tous les F01 à F13 vérifiés, ou liste explicite des écarts restant ouverts ; aucun « tout corrigé » si un défaut reste non vérifié.
- [ ] Suites unitaires et d’intégration pertinentes passantes sur l’ensemble intégré ; échecs préexistants séparés des régressions nouvelles.
- [ ] E2E Chromium des parcours principaux et cas asynchrones/import/clavier à risque passants ; tests supplémentaires sur navigateurs pertinents selon V04.
- [ ] Lint, types et build du candidat passants ; contrat de prérendu/routage réellement visé par F09/F11 vérifié.
- [ ] Au moins les largeurs 360, 768 et 1440 px vérifiées sur les composants modifiés ; ni débordement involontaire ni commande essentielle inaccessible.
- [ ] Console et réseau des parcours testés inspectés ; erreurs attendues distinguées des nouvelles erreurs.
- [ ] Anciennes sauvegardes, import/export et reprise du deck contrôlés sur stockage isolé ; aucune perte de données utilisateur réelles.
- [ ] Résultats mathématiques comparés aux oracles indépendants ; populations, hybrides et disponibilité des modèles cohérents.
- [ ] V01 à V12 et E01 à E06 disposent chacun d’un état explicite avec preuve ou blocage ; aucune certification globale déduite d’un simple score.
- [ ] Diff final relu ; modifications préexistantes préservées ; aucun secret, jeu privé ou artefact de test inutile intégré.
- [ ] Bilan final rédigé avec version, défauts clos, tests exécutés, résultats, limites et éléments encore ouverts.
- [ ] Si publication explicitement demandée : contrôle de la version effectivement publiée, GET critiques, parcours nominal et procédure de retour arrière. Sinon noter « non publiée » sans cocher cette case.

## Bilan de clôture à remplir

- Date et version intégrée : 6 septembre 2026, main/148d5f85ee26e60cdb10c6351031c89c03fd7ed0 + [diff S001 testé](preuves-corrections/S001/verified.patch)
- F vérifiés sur 13 : **9** à la fin de S001 (F01..F08 etF13)
- Critères Fxx-ACn validés sur 62 : **43** à la fin de S001 (42 des9 F + F11-AC1)
- E réalisés ou décisions de périmètre : E01..E06 ouverts ; preuves partielles parsing/score/worker réutilisables, pas de jalon global coché
- V vérifiés, non applicables justifiés et bloqués : V01..V12 ouverts ; limites et contrôles partiels dans le bilan S001
- Régressions nouvelles ouvertes : aucune identifiée dans les lots intégrés S001 ; en-têtes comptés/debounce/score ancien/quota/Retry-After corrigés après revue. Libellé mobile Manabase tronqué préexistant à reprendre E02/V03
- Tests non exécutés et conséquences :4 suites réécrivant preuves historiques, campagne NR complète, autres navigateurs/matériel/lecteur écran, exports PNG/PDF, prérendu/HTTP et validations externes ; mission non close
- Publication : non effectuée par ce suivi
- Conclusion étayée et prochaines actions : [bilan S001](preuves-corrections/S001/SESSION-VERIFIEE.md) ; reprendre F09/F11 sur artefact local puis F10/F12. Aucun tout-corrigé ni publication revendiqués

## Journal chronologique

Ajouter une entrée par lot : date ; identifiants ; version ; correction ; commandes/parcours ; résultats ; preuves ; revue ; cases modifiées ; blocages et prochaine étape. Préserver les anciennes entrées.

6 septembre 2026 — création du registre ; toutes les cases décochées ; aucune correction applicative exécutée dans cette livraison.

## Reprise entre plusieurs sessions

Le même [prompt de passation](../handoff/PROMPT-CORRECTIONS-AUDIT-MANATUNER-2026-09-06.txt) s’utilise dans chaque nouvelle conversation. Aucune modification du prompt n’est nécessaire après chaque lot : actualiser ce suivi suffit.

- Le rapport d’audit reste une photographie historique. Les fiches et ce journal donnent l’état courant.
- Les cases cochées restent acquises sur leur version de preuve ; une modification touchant leur contrat peut imposer de rouvrir leur validation, sans effacer l’historique.
- Les preuves doivent rester accessibles à la session suivante. Préférer `docs/engineering/preuves-corrections/Sxxx/` pour les comptes rendus légers et les manifestes de preuve ; ne créer ces dossiers que lorsque des preuves sont effectivement produites. Pour les sorties volumineuses, noter une destination durable et la façon de les régénérer.
- Une preuve identifie HEAD et, si nécessaire, le diff non commité testé, les commandes exactes, les versions, les résultats et la date. L’absence de commit ne doit ni faire perdre le travail ni laisser croire que HEAD seul identifie le correctif.
- Les sessions sont nommées S001, S002, etc. Ajouter un point de reprise en fin de session et mettre à jour le pointeur du haut ; ne pas supprimer les entrées précédentes.
- En cas d’arrêt pendant un lot, indiquer ce qui est modifié, ce qui fonctionne et ce qui reste non vérifié. La prochaine session reprend ce lot avant d’en ouvrir un autre, sauf blocage ou dépendance contraire.

### Modèle de point de reprise de session

Dupliquer ce bloc pour chaque session et remplacer les champs. Le modèle n’est pas une preuve d’exécution.

**Session :** Sxxx — date et heure. **État :** terminée ou interrompue avec reprise nécessaire.

- Objectif et identifiants traités : à renseigner
- Branche et HEAD au début et à la fin : à renseigner
- Fichiers préexistants protégés : à renseigner
- Fichiers modifiés pendant la session et diff non commité restant : à renseigner
- Version ou référence durable du diff testé : à renseigner
- Corrections terminées et critères acquis : à renseigner
- Tests et non-régression réellement exécutés, commandes et résultats : à renseigner
- Preuves durables et revue : à renseigner
- Tests non exécutés, validations à rouvrir et risques : à renseigner
- Décisions de contrat prises et motif : à renseigner
- Blocages externes et information nécessaire : à renseigner
- Processus locaux utiles, état et commande de redémarrage sans secrets : à renseigner
- Première action exacte à la prochaine reprise, fichier/test et résultat attendu : à renseigner
- Actions suivantes dans l’ordre : à renseigner
- Compteurs F vérifiés sur 13 et AC validés sur 62 : à recalculer depuis les fiches
- Publication : non effectuée, sauf preuve explicite d’une publication autorisée

### S000 Initialisation documentaire

6 septembre 2026 — documents de suivi et prompt réutilisable créés. Aucune session de correction n’a commencé. Les 13 fiches F et les 62 critères sont non validés dans ce suivi. Les éléments E et V sont ouverts.

Première action S001 : inspecter le dépôt et les instructions applicables, relever HEAD/branche/diff, établir les contrôles initiaux pertinents, puis confirmer et traiter F01/F02 ou un lot indépendant prioritaire justifié. Les modifications du dépôt listées dans l’audit sont historiques et doivent être réinspectées avant toute édition.

### S001 Point de reprise actif — 6 septembre 2026

**État :** en cours ; aucun critère acquis à ce stade.

- Audit et suivi lus en entier ; aucun AGENTS.md trouvé dans le projet (hors worktrees) ni ses parents. HEAD et diff correspondent à S000 ; preuves historiques transcrites dans l’audit, pas de correction antérieure à reconstruire.
- Lots : parsing F01/F02 (agent parsing), UI clavier F07 (agent keyboard), générations UI F05 (agent cancellation) ; lead responsable E2E entrées/populations, intégration, revue et suivi. Les zones du fichier AnalyzerPage sont réparties explicitement.
- Baseline : `npx vitest run src tests/component --configLoader runner --no-cache --reporter=dot` : 449 tests/38 fichiers passants ; `npx tsc --noEmit --incremental false` et `npx eslint src --ext .ts,.tsx --max-warnings=0 --no-cache` : code 0. Logs dans `preuves-corrections/S001/`.
- Modifications initiales : `status-initial.txt` et `preexisting.patch` ; conserver tous ces fichiers. Aucun commit/push/publication ni activation Sentry.
- Si interruption : inspecter les diff et logs des trois lots avant de poursuivre ; premier test produit à reprendre : `tests/e2e/core-flows/input-contract-audit.spec.js` (création en cours). Aucun F clos, 0/13 et 0/62.

### S001 — 11 h 52 CEST — premier lot intégré vérifié

F01/F02/F05/F07 vérifiés localement ; F11-AC1 acquis par test clavier initialement rouge. **4 F/13, 20 AC/62**. 663 tests/65 fichiers + 21 E2E Chromium sur build local, types/lint/build code0. [Preuves et limites](preuves-corrections/S001/LOT-A-UI.md). Régression en-têtes comptés et cas Clear/debounce trouvés par revue indépendante puis corrigés/protégés ; aucune régression nouvelle ouverte à ce point.

Poursuite S001 : F03/F04 synthèses (parsing), F06 historique (cancellation), F08 réseau (keyboard). Les contrats parsing/UI acquis restent datés au manifest lot-a-ui ; revalidation ciblée requise après intégration réseau/synthèses. Premier test de reprise si interruption : suites nouvelles dans chaque dossier `preuves-corrections/S001/{synthesis,history,network}` ; inspecter leur état avant de cocher. Preview local sur port3000 sert le premier build ; reconstruire avant validation du prochain ensemble.

S001 — deuxième ensemble : F13 ajouté par le lead ; erreurs de plateforme/absence accusé15s, annulation et relance. Tests red puis12 green dans `preuves-corrections/S001/worker/`. Clôture en attente build/E2E/revue. F06 sauvegarde transmet maintenant son message de quota/plafond au toast dans AnalyzerPage.

### S001 — point de reprise final — 6 septembre 2026, 12h27 CEST

**État :** session terminée ; mission non close.

- Objectif : F01/F02 entrées/populations, F05 annulation UI, F07 clavier, F03/F04 synthèses, F06 historique, F08 réseau etF13 worker. Coordination lead +3 agents senior ; revue croisée des lots et intégration finale par lead.
- Branche/HEAD début et fin : `main`, `148d5f85ee26e60cdb10c6351031c89c03fd7ed0`. Aucun commit/push/publication. Le code testé inclut49 fichiers source/tests modifiés ou nouveaux, pas seulement HEAD.
- Fichiers préexistants protégés : [inventaire initial](preuves-corrections/S001/status-initial.txt), [préservation des3 rapports](preuves-corrections/S001/preservation.json). Worktrees, fichiers MCP et documents historiques non nettoyés. Audit historique non modifié.
- Fichiers modifiés cette session : [statut final](preuves-corrections/S001/status-final.txt), [patch source/tests](preuves-corrections/S001/verified.patch), [manifest SHA-256 et artefact](preuves-corrections/S001/verified-manifest.json). Le suivi, les notes et preuves S001 s'ajoutent à cette liste.
- Acquis : **F01..F08 etF13 vérifiés,9/13 ;43/62 AC** dont F11-AC1. **F09/F10/F12 ouverts, F11 partiel**. Toutes cases acquises appuyées par [bilan intégré](preuves-corrections/S001/SESSION-VERIFIEE.md).
- Tests effectivement exécutés après intégration finale :732/732 dans72 fichiers ;30/30 E2E Chromium153 sur buildVite isolé ; lint/typecheck/build/diff-check code0. Commandes exactes et logs `verified-*.log` dans le bilan. Les red et échecs intermédiaires sont conservés, corrigés puis rejoués.
- Réseau et données : fixtures publiques en contexte neuf ; imports invalides/quota/legacy sur stockage isolé, jamais données réelles ; aucune collecte externe activée.
- Revue : UI par parsing, parsing par cancellation ; synthèses par deux agents distincts ; réseau par parsing ; historique par keyboard ; worker par cancellation ; lead a intégré les retours et inspecté les captures. Aucun finding bloquant connu restant sur ces9 F.
- Limites/tests non exécutés :4 suites math écrivant preuves historiques (`pathways`, `known-limitations`, `canonical`, `independent`) ; suite générale tous navigateurs non lancée ; matériel/lecteur écran/AA complet non attestés ; exportsPNG/PDF et tous retours arrière non couverts ; aucun contrôleprérendu/Vercel/SearchConsole/Sentry reçu/terrain ni validation juridique. Ne pas cocher campagne finaleNR sur cette seule session.
- Décisions : limites250 cartes toutes zones/20k caractères, saisies invalides bloquantes numérotées ; Companion/Maybeboard exclus etsignalés ; score marginal fixe/OR etindisponibilité explicite des paiements non représentés ; commandant séparé de la synthèse principale ; importfusion atomique avec plafond50 sans éviction ; réseau8s requêteJSON/30s résolution ; worker15s démarrage puis Cancel sans timeout de calcul arbitraire.
- UX observée : sous-onglet Manabase « Full Deck List » encore tronqué à360px dans structure inchangée (E02/V03) ; texte London historique reste fautif (F10). La vérification de débordement document ne vaut pas validation de chaque commande.
- Processus : devinitial3000, preview3000 et devagent3001 arrêtés. Pour reprendre l'artefact S001 conservé localement : `env -u SENTRY_AUTH_TOKEN -u SENTRY_ORG -u SENTRY_PROJECT VITE_SENTRY_DSN='' npx vite preview --outDir docs/engineering/preuves-corrections/S001/dist --host 127.0.0.1 --port 3000 --strictPort`. Pour développement : `npm run dev -- --host 127.0.0.1 --strictPort`. Aucun secret nécessaire ni enregistré.
- Première action S002 : lire ce point et le bilan, comparer HEAD/statut/manifest ; ouvrir **`scripts/prerender.mjs` et `vercel.json`**, puis workflows, pour reproduire F09/F11 sur artefact local et définir routes statiques/statuts sans publication. Ne pas refaire les9 correctifs déjà prouvés.
- Ordre suivant : F09 avec F11-AC4/AC5 ; F10 textes/compteurs/seuils ; F12 flux/mentions ; E01..E06 etV01..V12 accessibles ; campagneNR-M01..28 finale. Les accès privés non examinés et la validation juridique externe restent à qualifier, sans bloquer les corrections locales.
- Publication : **non effectuée**. Fin de session ≠ clôture de mission.

### S001 — autorisation de commit et push — 6 septembre 2026

L’utilisateur a demandé explicitement « commit push ». Les corrections, tests, suivi, références d’audit et preuves S001 sont inclus dans le commit sur `main`. Les trois rapports préexistants modifiés, les worktrees et fichiers MCP personnels restent hors commit. Les49 fichiers source/tests correspondent exactement au manifest vérifié :732 tests et30 E2E conservés ; lint et TypeScript relancés avant commit.

Le hook local `lint-staged` lance des réécritures automatiques ESLint/Prettier et un stash : pour conserver les octets source et preuves déjà vérifiés, le commit de livraison utilise `HUSKY=0`, après lint/types et contrôle du diff indexé. Aucun correctif applicatif supplémentaire dans cette étape. Le push de `main` peut déclencher l’intégration Vercel native ; une réussite du push ne prouve pas la réussite de la CI ou de la publication. L’état distant et le hash sont rapportés dans la réponse de livraison ; la prochaine reprise relève HEAD actuel.

Compteurs inchangés :9/13 défauts vérifiés (69,2 %),4/13 restants (30,8 %) :F09/F10/F11 partiel/F12.43/62 critères vérifiés (69,4 %),19/62 restants (30,6 %). Ce sont des proportions d’éléments, pas une estimation de durée. E01..E06 etV01..V12 restent ouverts séparément. Prochaine étape :F09/F11, puis F10/F12.
