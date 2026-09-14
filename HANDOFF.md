> **Préférence permanente : travailler sur `main`, tous les pushes vers `origin/main`, aucune branche annexe.** Exception uniquement pour une justification majeure expliquée avant l’action et acceptée par l’utilisateur, ou une nouvelle instruction explicite de sa part. Préférence reconfirmée le 10 septembre 2026. Voir la règle prioritaire en tête de [AGENTS.md](AGENTS.md) ; les anciennes consignes de branche dédiée sont historiques.

# Point de reprise — audit avant communication, préparé le 13 septembre 2026

Le propriétaire demande un prompt pour une analyse approfondie du site, des cahiers de tests et des pistes d'amélioration avant sa communication. Le [prompt de lancement](docs/handoff/PROMPT-LANCEMENT-AUDIT-PRECOMMUNICATION-2026-09-13.txt) appelle la [mission complète](docs/handoff/PROMPT-AUDIT-PRECOMMUNICATION-2026-09-13.md). Le [kit](docs/quality/precommunication-2026-09-13/README.md) comprend huit cahiers et 48 cas NON EXÉCUTÉS, six fixtures synthétiques, une matrice CSV, un protocole humain et cinq concepts à évaluer.

État : préparation documentaire effectuée ; audit complet, tests applicatifs, prototypes et recherche utilisateurs restent à exécuter lors de la future mission. Aucun changement applicatif, commit, push ou déploiement dans cette préparation. Base locale lue : `a0a23519253751b9c98d6b93f73822f21e8191c0`. Ancien worktree préservé. Prochaine action : lancer le prompt dans une nouvelle session sur main et établir une base actuelle, sans recopier les succès historiques.

# Historique — améliorations personas

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

## Réaudit après R01–R07 — 10 septembre 2026

- Rapport courant : `docs/session/PERSONA_REAUDIT_POST_R01_R07_2026-09-10.md`, six rapports et preuves lead dans `docs/session/persona-reaudit-r01-r07-2026-09-10/`.
- Candidat dist-04 du HEAD e14f329 :3,78/5=15,11/20 ; précédent14,67/20, initial12,89/20. Six agents sans CUA : HTTP/sources/preuves attribuées ; lead réalise les nouveaux clics exact/Blueprint/sauvegarde/Compare20vs24.
- Push vérifié sur branche dédiée, origin/main reste2ba772a ; accueil public encore ancien. Aucune nouvelle note de production, aucun nouveau gate. Résidu20sources Guide vs21 Mathematics confirmé.
- Audit uniquement : aucun code produit, changement de branche, commit/push/déploiement. Rapports utilisateur existants préservés. Priorités : cohérence20/21, pédagogie première décision, partage des réglages, participants réels et publication distincte. Service de revue http://127.0.0.1:4187/.

## Publication sur main et Vercel — 10 septembre 2026

La demande utilisateur « si non fais le » autorise désormais main et la production Vercel. Main a été avancée sans divergence vers e14f329, puis le correctif runtime e206991 a été commité et poussé. Les ajouts postréaudit et rapports utilisateur sont préservés. Le premier déploiement a échoué faute de libnspr4.so ; setup-build-browser installe les bibliothèques natives uniquement sur Vercel/Linux, erreurs bloquantes, puis npm ci. Chromium, options et gate inchangés. Six tests ciblés acquis ; CI GitHub réussie et Vercel READY pour e2069916186737fedac3ae3cb58f4e7872d728ce. Gate natif complet acquis, dont101routes et16Chromium. Vérification publique :5routes200 avec textes actualisés, route inconnue404/noindex. SHA origin/main identique. Preuves de cette publication : docs/engineering/main-publication-kyj03ixa/ (local, non versionné).

## Audit précommunication exécuté — 13 septembre 2026

Campagne neuve : [docs/quality/audit-precommunication-2026-09-13-r7k2/00-SYNTHESE.md](docs/quality/audit-precommunication-2026-09-13-r7k2/00-SYNTHESE.md). Main et origin/main lus à a0a2351. Aucun changement applicatif, commit, push ou déploiement. Gate neuf réussi : 801 tests/79 fichiers, 101 routes, 16 Chromium ; suites audit 33 Chromium et 33 WebKit réussies. Suite persona : 22 réussites/1 échec de contraste Library390 sombre ; Firefox bloqué au lancement. Guide20/Mathematics21 et promesses JSON-LD reconfirmés. Deux prototypes isolés, 48 cas enrichis et 16 chantiers livrés ; étude humaine non exécutée. NO-GO communication large ; pilote accompagné conditionnel. Priorité : autoriser L0 confiance, puis L1 contraste et recrutement consenti. Les preuves anciennes et les modifications initiales sont préservées ; détails d’empreintes dans la campagne.

## 14 septembre 2026 — atelier évalué par six personas

Rapport : [docs/quality/personas-atelier-2026-09-14/00-SYNTHESE.md](docs/quality/personas-atelier-2026-09-14/00-SYNTHESE.md). Six évaluations simulées réparties entre trois agents disponibles après briefing ; aucune étude humaine. Proposition clarifiée : action facultative après analyse, original A conservé et variante B choisie par le joueur. Recommandation : réutiliser Compare, tester une préparation compacte pour les novices ; ne pas intégrer la page de démonstration telle quelle. Restaurer A et afficher B ont été revérifiés en CUA ; aucun nouveau gate ou test moteur. Main et code/prototypes inchangés, aucun commit/push/déploiement. Les462fichiers du manifeste de campagne précédent ont été contrôlés et sont intacts. Prochain travail éventuel : prototype du parcours complet, sur demande distincte.

## Préférence permanente ajoutée — 14 septembre 2026

Toute évolution proposée pour ManaTuner doit désormais être évaluée systématiquement par les six personas canoniques, sans nouvelle demande du propriétaire. Conserver les avis distincts, les désaccords et les adaptations ; distinguer cette validation simulée des tests techniques et des études humaines. Règle complète en tête de AGENTS.md.

## Choix Compare après les six personas — 14 septembre 2026

- Référence active B05/C-P01/L5 : `docs/product/EVOLUTION-COMPARE-2026-09-14.md` ; backlog courant : `docs/product/BACKLOG-ACTIF-2026-09-14.csv` (16 entrées, seul B05 révisé).
- Compare depuis les résultats, A prérempli, B choisi manuellement, aide facultative ; abandon de la page atelier autonome. Six avis simulés favorables avec réserves : `docs/quality/validation-compare-2026-09-14/VALIDATION.md`.
- Critères CMP-01–07 non exécutés, évolution non implémentée. Prototype et rapports historiques préservés ; priorités confiance/contraste et recommandation de lancement inchangées. Aucun commit, push ou déploiement.

## Mission suivante préparée — 14 septembre 2026

- Prompt complet : `docs/handoff/PROMPT-IMPLEMENTATION-PUBLICATION-2026-09-14.md` ; lancement court : `docs/handoff/PROMPT-LANCEMENT-IMPLEMENTATION-2026-09-14.txt`.
- Future équipe : audit complet et B01–B16, Compare révisé, six personas, tests candidat final, commit/push origin/main et publication Vercel autorisés lors de l’exécution de cette mission. Publication technique distincte de la communication large.
- Session présente limitée à préparer les prompts ; aucun changement applicatif, commit, push ou déploiement exécuté.

## Reprise prioritaire — implémentation du 14 septembre 2026

Lire `docs/engineering/implementation-publication-2026-09-14/00-SYNTHESE.md`, puis JOURNAL.md et RESULTATS.csv. Les développements et preuves sont réalisés sur main ; candidat final-08, serveur de revue http://127.0.0.1:4198/analyzer?sample=exact. Compare depuis les résultats, original préservé, variante manuelle ; Blueprint fournit PDF et texte structuré.

Prochaine action conditionnelle : obtenir la confirmation visuelle déjà demandée au propriétaire selon §4 de la mission, puis vérifier hooks/candidat/SHA origin/main, pousser main normalement et suivre le déploiement natif sur le projet Vercel existant. Ne pas redemander une autorisation générale ni annoncer une publication absente. Tant que cette confirmation manque, garder push et production en attente. Le registre PUBLICATION.md porte le statut Git exact.

Réserves : B07 différé, B08/CMP07 humains non exécutés, communication large réservée ; Firefox/environnement, appareils physiques, lecteur écran, tableur réel et juridique restent distincts. Les essais rouges de cette campagne sont conservés, dont collision clipboard de deux sondes et cadence initiale trop courte corrigée.
