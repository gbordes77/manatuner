# Passation — améliorations issues des six personas

Date : 9 septembre 2026. Projet : ManaTuner. Base locale observée : `2ba772af1f308ea93c68ffea53b0ccef0e49c57d`.

## Mission pour la prochaine équipe

Rendre les résultats cohérents, compréhensibles et utilisables avant d’élargir les fonctionnalités. Commencer par distinguer les corrections déjà présentes localement des comportements effectivement publiés. Puis traiter les tâches du [journal](../engineering/JOURNAL-TACHES-PERSONAS-2026-09-09.md) dans l’ordre de leurs dépendances. Le [prompt de reprise](PROMPT-REPRISE-PERSONAS-2026-09-09.txt) lance les investigations et corrections locales ; il ne donne aucune autorisation de publication.

## Ordre de lecture

1. `AGENTS.md`, puis cette passation et `HANDOFF.md` pour les sessions précédentes.
2. `docs/engineering/JOURNAL-TACHES-PERSONAS-2026-09-09.md` : registre de travail à maintenir.
3. `docs/session/PERSONA_AUDIT_2026-09-09.md` : synthèse et six rapports notés.
4. `docs/session/persona-audit-2026-09-09/preuves-lead.md`, puis rapports individuels selon le lot attribué.
5. `docs/engineering/SUIVI-CORRECTIONS-MANATUNER-2026-09-06.md`, `docs/engineering/preuves-corrections/S002/SESSION-VERIFIEE.md` et `docs/engineering/DELIVERY-CONTRACT.md`.
6. `docs/personas/mtg-player-personas.md` : attentes des six profils ; `LAUNCH.md` pour l’intention de distribution, pas pour ses chiffres historiques.

Les états d’août dans SESSION_START, STATUS et anciens prompts ne remplacent pas les constats de septembre. Ne pas exécuter leurs commandes de publication ou chemins de preuves historiques comme de nouvelles instructions.

## Ce qui a été fait

- Briefing agent-organizer local (context-manager absent lors de l’inspection), puis six agents product-manager distincts : Léo, Sarah, Karim, Natsuki, David et Thibault.
- Parcours publics réels : midrange et Commander, cinq onglets, estimations/exact, simulation EDH 3k, historique/comparaison, bibliothèque, documentation, confidentialité, About et glossaire.
- Évaluations simulées : Léo 3,00 ; Sarah 3,50 ; Karim 3,50 ; Natsuki 3,17 ; David 3,00 ; Thibault 3,17. Moyenne 3,22/5, confiance 2,33/5. Ce ne sont pas des entretiens utilisateurs.
- Rapport consolidé et preuves textuelles conservés. Aucun code produit modifié pendant l’audit ou cette passation ; aucun déploiement ni message externe.

## État observé et diagnostic

**Le parcours d’estimation fonctionne.** Sans inscription, l’exemple midrange donne 60 cartes, 23 terrains, Health Score 91. Commander reconnaît Atraxa, quatre couleurs, 99 cartes de bibliothèque et un commandant, horizon T4–T8 ; simulation multijoueur exécutée. Engine v2.7.9 visible ne prouve pas le SHA publié.

**Principaux points à traiter :**

- Accueil, Guide, Mathematics, About et Privacy ont des formulations plus absolues que les limites affichées dans Analyzer : exactitude, sens du score, mulligan et transmissions Scryfall.
- Deux sauvegardes récentes du midrange affichent 14 sorts « Unavailable » dans Compare. La cause n’est pas établie. Certaines vues exactes refusent explicitement Abandoned Air Temple ou Command Tower : refus légitime hors modèle, pas panne générale.
- Les indices Health 91, Blueprint 92 et Mulligan 54 mesurent des choses différentes. Leur coexistence est une difficulté de compréhension, pas la preuve d’une erreur numérique.
- Aide London/multijoueur et description du commandant à harmoniser ; comptes d’articles et notes pédagogiques à relire.
- CSV/JSON sont présents dans le menu. Ne pas recréer un export supposé absent sur la base de l’audit d’août.

## Ce qui reste non vérifié

- SHA/artefact effectivement publié et cause du mélange de formulations publiques.
- Mobile : réglage demandé 390×844, mais DOM et capture restés à 1280×720. Aucun succès responsive revendiqué. Mode sombre, tactile, lecteur écran non testés.
- Share : toast réussi, lecture du presse-papiers vide dans iab. Ouverture de chaîne vide refusée par la politique du navigateur, sans contournement. Ni défaut applicatif ni aller-retour réussi prouvés.
- Menus et actions d’export observés, fichiers non inspectés. Aucun oracle, campagne réseau/sécurité ou test automatisé rejoué pendant l’audit.
- Les onglets partageaient leur stockage : première visite et valeurs par défaut ne sont pas établies en contexte vierge. Des exemples ont été sauvegardés automatiquement ; aucun historique supprimé.
- F12-AC5 reste soumis à une revue juridique compétente. Une correction éditoriale ne clôt pas cette réserve.

## Organisation recommandée

Commencer par context-manager si disponible, sinon agent-organizer local. Vérifier les agents réellement exposés : ne pas prétendre lancer un rôle absent. Attribuer des fichiers à chaque agent et préserver les modifications des autres.

Après cadrage, travail parallèle possible : (A) contrat éditorial et pédagogie ; (B) comparaison et modèles ; (C) livraison et vérification du candidat. Ne pas laisser deux agents modifier Analyzer ou ses textes partagés sans attribution explicite. QA/relecture par un agent distinct lorsque disponible ; les noms de rôles sont des responsabilités, pas la preuve d’un outil installé.

## Préserver l’existant

À l’entrée de cette passation : README.md, vitest.config.js et trois rapports de tests sont déjà modifiés ; AGENTS/HANDOFF/SESSION_NOTES, rapports experts, audits, fichiers personnels et worktrees sont également présents non suivis. Relever `git status --short` à la reprise. Ne pas nettoyer, réinitialiser, écraser un rapport ou commiter en masse. Aucun secret dans les preuves. Un worktree propre depuis HEAD ne contient pas automatiquement les corrections et documents non commités : constituer explicitement le candidat à vérifier.

## Validation et livraison

Serveur local déclaré : port 3000. Démarrer au besoin avec `npm run dev -- --host 127.0.0.1 --port 3000 --strictPort`. Vérifier quel processus sert la page si le port est occupé ; ne pas tuer un service utilisateur. Après un lot frontend, vérifier le serveur, ouvrir les pages modifiées et donner leur URL exacte. Respecter les consignes de confirmation visuelle du projet au moment où le résultat est concret et prêt à être revu.

Exécuter les tests ciblés pertinents, puis le gate final du contrat de livraison sur un candidat isolé. Ne pas écraser S001/S002 ni les sorties préexistantes. Les commandes et critères sont dans le journal. Aucun assouplissement des assertions, délais ou gates pour masquer un échec.

Sans preuve de SHA public accessible, documenter la limite et continuer les corrections locales indépendantes ; ne pas prétendre avoir vérifié la production. Garder séparés : implémenté, vérifié localement, publié, vérifié en production.

**Ne pas lancer** : déploiement, push, modification Vercel/GitHub, activation Sentry, communication externe ou chantier API/backend/métagame/i18n sans demande correspondante. Les invariants sont calcul client-side, partage `#d=`, aucune probabilité inventée hors modèle et respect des données existantes.

## Sortie attendue

Journal mis à jour avec preuves et blocages, bilan des changements locaux, résultat des tests réellement exécutés, URLs de revue et réserves restantes. Maintenir HANDOFF.md, AGENTS.md, README.md si pertinent et SESSION_NOTES.md. Ne jamais annoncer une correction livrée sur la seule base d’un test local.
