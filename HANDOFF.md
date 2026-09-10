> **Préférence permanente : travailler sur `main`, aucune branche annexe.** Exception uniquement pour une justification majeure expliquée avant l’action et acceptée par l’utilisateur. Voir la règle prioritaire en tête de [AGENTS.md](AGENTS.md) ; les anciennes consignes de branche dédiée sont historiques.

# Point de reprise actuel — améliorations personas

Lire en priorité la [passation du 9 septembre](docs/handoff/HANDOFF-PERSONAS-2026-09-09.md), puis le [journal des tâches T00–T11](docs/engineering/JOURNAL-TACHES-PERSONAS-2026-09-09.md). Le [prompt prêt à copier](docs/handoff/PROMPT-REPRISE-PERSONAS-2026-09-09.txt) précise les lectures, agents et validations à lancer. Toutes les tâches de correction restent ouvertes ; documents préparés, aucun correctif produit exécuté dans cette session.

Les bilans ci-dessous sont conservés comme historique ; leurs tests ne sont pas de nouvelles validations.

---

# Passation — 9 septembre 2026

## Mission

Mobiliser les experts nécessaires à l’évolution de ManaTuner. Base : `2ba772a`.

## Réalisé

- `agent-organizer` a assuré le briefing ; `context-manager` absent des agents locaux disponibles.
- `product-manager` a établi cinq priorités avec preuves et critères d’acceptation.
- `devops-engineer` a examiné la livraison et corrigé la découverte d’un test Node par Vitest : exclusion ciblée de `scripts/delivery-gate.test.mjs`, toujours exécuté séparément par le gate.
- Rapports : [contexte](docs/engineering/EXPERT-CONTEXT-2026-09-09.md), [produit](docs/engineering/EXPERT-PRODUCT-2026-09-09.md), [livraison](docs/engineering/EXPERT-DELIVERY-2026-09-09.md).

## État et limites

- Aucun changement fonctionnel de l’interface ; aucune publication ou modification de réglages externes.
- Les fichiers utilisateur préexistants restent hors périmètre.
- Lint et TypeScript réussis. Tests indépendants du gate : 3/3.
- Première suite unitaire : 813 réussites, 4 dépassements du délai de 5 secondes et une erreur de découverte du test Node.
- Rejeu isolé des trois fichiers concernés avec un seul worker : 67/67 réussites, sans changement des assertions ni des délais.
- Rejeu complet après correction : **817/817 tests, 80/80 fichiers réussis**, avec `npm run test:unit -- --maxWorkers=1` (134,87 s). La sensibilité du passage concurrent aux délais reste à caractériser ; aucun délai ni assertion modifié.

## Prochaines priorités

1. Harmoniser les versions Node : `.nvmrc`, package, CI et environnement local divergent.
2. Relier le SHA réellement publié aux preuves de livraison ; la lecture locale ne valide pas la production.
3. Tester la compréhension des résultats auprès des joueurs et préparer un cas de distribution reproductible.
4. Garder F12-AC5 et les validations externes ouvertes tant que leurs preuves manquent.

Référence des corrections de septembre : [suivi](docs/engineering/SUIVI-CORRECTIONS-MANATUNER-2026-09-06.md). Les chiffres d’août sont historiques.

## Audit multi-personas — 9 septembre 2026

- Six agents product-manager distincts ont incarné Léo, Sarah, Karim, Natsuki, David et Thibault après briefing agent-organizer (context-manager absent).
- Rapport : [audit noté complet](docs/session/PERSONA_AUDIT_2026-09-09.md), moyenne3,22/5 (12,89/20), confiance2,33/5. Évaluations simulées, pas entretiens.
- Production visitée, Engine v2.7.9 observé ; SHA publié non identifié. Exemple midrange et Commander joués, simulation EDH3k effectuée.
- Priorités : cohérence des promesses publiques, motifs des résultats indisponibles/comparaisons, aide mulligan, contextualisation des indices et relecture éditoriale. Quatre couleurs Atraxa confirmées.
- Limites : mobile non appliqué (1280×720 effectif), exports non inspectés, roundtrip Share non validé (clipboard vide), aucun oracle ou test automatisé rejoué. Le stockage des onglets est partagé ; exemples automatiquement sauvegardés, aucun historique supprimé.
- Aucun code produit changé, déploiement ou message externe. Prochaine étape : relier production/artefact avant de reprendre les corrections déjà documentées en S002.

## Session du 10 septembre 2026 — reprise personas (en validation)

- Base `2ba772a`, sources S00250/50 intactes à l'entrée ; artefact public différent, SHA servi inaccessible. Échec Vercel du HEAD relevé en lecture seule.
- Corrections : contrat indices partagé et déficit/action Manabase, Compare motifs et populations, exemple exact simple, aide London multijoueur, compteurs/règles pédagogiques, exports identité/version/hypothèses/flags CSV.
- Revue visuelle a identifié des overrides CSS clairs illisibles en sombre : palette MUI rétablie pour texte et barre deck, bouton Clear corrigé en sombre. Assertions de contraste ciblées ajoutées.
- `.nvmrc`22 ; js-yaml4.3.1→4.3.2 uniquement dans lock (vulnérabilité high détectée par gate). Advisory : https://github.com/advisories/GHSA-2883-xcg3-v3hh. Les avis Vitest moderate restent à distinguer d'un audit zéro vulnérabilité.
- Gate04 complet acquis799 tests/79 fichiers +16Chromium avant dernier correctif sombre ; candidat final doit être reconstruit et revérifié. Gate01/02/03 rouges préservés (typage nouveau test, répertoire de preuves manquant, audit high).
- QA11 nouveaux parcours acquis avant assertions contraste supplémentaires : share vrai clipboard/contexte vierge, EDH99+1/quatre couleurs, comparaison, export CSV/JSON et dimensions360/390/768/1440.
- Fichiers préexistants et rapports conservés; preuves fraîches : `docs/engineering/persona-validation-mfydqnp5/`. Journal principal mis à jour.
- Commit/push autorisés après validation. Branche locale `codex/persona-followup-2026-09-10` préparée avec `vercel.json git.deploymentEnabled` false pour cette branche uniquement afin de ne pas déployer (documentation officielle https://vercel.com/docs/project-configuration/git-configuration). Aucune mutation du dashboard. Main inchangée.
- T09 participants réels, F12-AC5 juridique, appareils physiques/lecteur écran et preuve production restent ouverts. Confirmation visuelle utilisateur demandée pendant les tests.

### Validation finale — 10 septembre 2026

Référence : `docs/engineering/persona-validation-mfydqnp5/FINAL.md`, candidat `dist-06` et manifest SHA-256. Gate complet799tests/79fichiers +16Chromium +101routes; audit33Chromium; personas12Chromium;8WebKit acquis. Firefox reste bloqué avant navigation même en installation isolée neuve. Sombre corrigé et contrôlé quantitativement. Trois rapports préexistants préservés. T09/juridique/appareils physiques/confirmation visuelle utilisateur restent distincts des validations techniques. Publication applicative non autorisée ; branche de commit/push dédiée désactivée côté auto-déploiement via vercel.json.

## Réaudit des personas — 10 septembre 2026

- [Rapport comparatif](docs/session/PERSONA_REAUDIT_2026-09-10.md) : production du9septembre → candidat local dist-06 ; moyenne3,22→3,67/5, soit12,89→14,67/20 (+1,78).
- Six évaluations distinctes, grille inchangée. Léo3,50 ; Sarah3,83 ; Karim3,83 ; Natsuki3,67 ; David3,50 ; Thibault3,67. Notes indicatives : quatre agents sans navigateur personnel utilisent HTTP, preuves actuelles partagées et artefacts QA attribués.
- Identité du candidat contrôlée :270sources/configs et154artefacts conformes au manifest, HEAD2517316. Aucun nouveau gate ni déploiement.
- Résidus : Mathematics mélange des descriptions de modèles ; My Analyses affirme encore Nothing sent to servers ; Library Five/7 ; comparaison compatible fonctionne mais précision affichée excessive, exemple midrange encore0/14 expliqué.
- Preuves/rapports : `docs/session/persona-reaudit-2026-09-10/`. Serveur strict créé pour revue sur http://127.0.0.1:4186/ ; serveur3000 préexistant intact. Aucun code produit modifié.

## Prochaine mission — résidus, tests et push

À la demande de l’utilisateur, [mission R01–R07](docs/handoff/MISSION-CORRECTIONS-REAUDIT-TESTS-PUSH-2026-09-10.md) et [prompt exécutable](docs/handoff/PROMPT-CORRECTIONS-REAUDIT-TESTS-PUSH-2026-09-10.txt) préparés. Ils couvrent corrections, nouveau candidat/tests, commit ciblé et push sur `codex/persona-followup-2026-09-10`, dont l’auto-déploiement reste désactivé. Aucun correctif ni commit/push exécuté lors de la préparation de ces documents.

## Instruction utilisateur prioritaire — destination main

L’utilisateur demande désormais que tous les correctifs de la mission soient intégrés, commités et poussés sur **main**, sans branche annexe. Mission et prompt corrections/tests/push actualisés. Cette instruction remplace leur ancienne destination de branche dédiée. Inclure les correctifs pertinents déjà commités sur la branche existante ; préserver le travail local et les fichiers personnels. Le push main peut déclencher le déploiement natif : suivre son état, ne pas promettre qu’il est désactivé. Aucune mutation Git effectuée lors de cette mise à jour documentaire.

## Reprise R01–R07 exécutée — 10 septembre 2026

La dernière demande autorise uniquement le commit/push sur `codex/persona-followup-2026-09-10` et interdit main/merge/force-push/déploiement. Cette exception remplace la destination historique de cette mission. Le [bilan courant](docs/engineering/reaudit-fixes-szrp1r9w/FINAL.md) décrit corrections, candidat, preuves, réserves et vérification après hooks. Priorités restantes : confirmation utilisateur, participants réels, revue juridique et appareils physiques ; aucune publication demandée.
