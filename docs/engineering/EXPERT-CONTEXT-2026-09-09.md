# Briefing experts ManaTuner — 9 septembre 2026

## 1. Analyse du projet

ManaTuner analyse les bases de mana Magic: The Gathering dans le navigateur.
Stack constatée dans `package.json` : React 18, TypeScript, Vite 7, Material UI,
Redux Toolkit/Persist, Vitest et Playwright. Stockages locaux : localStorage et
IndexedDB. Hébergement prévu : Vercel ; aucun backend de decklists.

HEAD relevé pendant le briefing : `2ba772a`,
`fix: complete audit corrections and enforce delivery checks`.
La présence de ce commit ne prouve pas sa publication effective.

### Sources à privilégier

- [Suivi opérationnel des corrections](SUIVI-CORRECTIONS-MANATUNER-2026-09-06.md).
- [Bilan et preuves S002](preuves-corrections/S002/SESSION-VERIFIEE.md).
- [Contrat de livraison actuel](DELIVERY-CONTRACT.md).
- [Audit historique](AUDIT-POST-CORRECTIFS-MANATUNER-2026-09-06.md), photographie du commit `148d5f8`.
- [Plan de lancement](../../LAUNCH.md), pour la priorité distribution.

Le suivi S002 indique **12/13 défauts vérifiés et 61/62 critères acquis**.
F12-AC5 reste bloqué par une validation juridique compétente. Ne pas rouvrir
les treize corrections sur la seule lecture de l'audit historique.

Résultats historiques S002, **non rejoués pendant ce briefing** : 796 tests,
49 scénarios Chromium, 8 WebKit et 101 routes HTML. Firefox ne démarrait pas
dans l'environnement local de cette session.

Le contrat actuel impose lint, types, tests, budget de bundle, audit des
dépendances, prérendu obligatoire et vérifications Chromium avant réussite
du build de livraison. Il conserve un seul chemin de publication natif Vercel.
Les réponses HTTP de production exigent une vérification distincte.

### Documentation et préservation

Aucun `AGENTS.md` trouvé par la recherche de fichiers du briefing ; S001
consignait aussi son absence dans le projet hors worktrees et ses parents.
`CLAUDE.md`, `SESSION_START.md`, `docs/product/STATUS.md` et `LAUNCH.md`
contiennent des références techniques d'août dépassées, notamment les SHA,
compteurs de tests et le prérendu soft-fail. Leur réconciliation est nécessaire.
Les affirmations concurrentielles de `LAUNCH.md` ne constituent pas des preuves.

Le statut initial comporte trois rapports de tests modifiés et des fichiers
personnels non suivis : worktrees, fichiers MCP et documents. Les préserver.
Ce briefing n'a exécuté aucun test, push, déploiement ou changement de réglage.

## 2. Équipe recommandée

### `product-manager`

- **Rôle :** prioriser acquisition et compréhension des résultats.
- **Justification :** distribution prioritaire dans le plan de lancement ; E02
  reste partiel faute d'étude utilisateur, E05 faute de revue sémantique complète.
- **Livrable :** trois priorités maximum, critères d'acceptation et métriques
  sans collecte de decklists ; test utilisateur et brief de lancement préparés.
- Distinguer estimation de mana, potentiel de paiement, exact goldfish et
  score heuristique ; aucun message externe ni publication.

### `devops-engineer`

- **Rôle :** vérifier en lecture seule la livraison effective de `2ba772a` et V02.
- **Justification :** commit/push historique et gate local ne prouvent pas la prod.
- **Livrable :** SHA livré, état CI/build natif, HTTP et métadonnées des routes,
  risques et limites vérifiés ; aucune modification de réglage ou publication.

### Expertise QA complémentaire

- **Rôle :** compléter une matrice ciblée V06 comparaison/post-board ou V11
  navigation/partage après les diagnostics produit et DevOps.
- **Justification :** ces validations restent partielles ; réutiliser les preuves
  existantes et éviter une campagne exhaustive répétée sans risque identifié.

## 3. Stratégie de délégation et validations

1. Lancer les missions produit et DevOps en parallèle, avec périmètres distincts.
2. Réconcilier les pointeurs documentaires avec HEAD et les preuves S002.
3. Choisir un lot réversible à bénéfice utilisateur établi ; protéger son contrat
   par les contrôles pertinents, puis vérifier l'état intégré.
4. Garder les validations externes ouvertes : revue juridique, CWV terrain,
   appareils physiques, lecteur d'écran complet, Search Console et Sentry reçu.

E03 est vérifié dans son périmètre de cohérence du score ; E01/E02/E05/E06
restent partiels et E04 ouvert. V05 exports et V12 disponibilité des liens sont
vérifiés dans leurs périmètres, sans certification PDF accessible ni contenu
externe intégralement validé.

Préserver confidentialité client-side, partage `#d=`, Sentry désactivé sans
décision explicite et absence de double déploiement. Une mécanique hors modèle
doit rester indisponible explicitement, jamais remplacée par un chiffre inventé.
