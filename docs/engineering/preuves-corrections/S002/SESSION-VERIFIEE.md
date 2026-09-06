# S002 — corrections finales de l’audit du 6 septembre 2026

État : corrections techniques terminées et vérifiées localement. **12/13 fiches clôturées, 61/62 critères acquis (98,4 %). F12-AC5 juridique reste bloqué.** Base `main/c8bdb8f5416562a2e7715fad54e2eb6f2aa342c3`, correctifs locaux non commités. La version sera identifiée par `verified.patch` et `verified-manifest.json`. Aucun réglage distant, push ou déploiement modifié pendant S002.

## Contrats corrigés

- **F09** : toutes les 101 routes publiques sont prérendues ; contenu sans JavaScript, titres/descriptions/canonical et métadonnées sociales propres à chaque route. HTML manquant, ambigu ou référence locale absente bloque le build. Le routage statique conserve les alias et sert un `404.html` noindex. Les contrôles HTTP locaux utilisent un serveur strict, jamais le fallback SPA de Vite comme preuve de 404 Vercel. [Lot HTML](lot-html/REPORT.md).
- **F10** : définition heuristique du score, estimation par défaut, limites du modèle exact, London sept cartes puis bottoming, commandant explicitement marqué, compteurs dérivés et bandes 85/70/55 partagées. Relecture accueil, guide, mathématiques, métadonnées, aide, historique, export et fichiers publics llms. [Lot éditorial](lot-editorial/REPORT.md).
- **F11** : même gate bloquant dans CI, PR et build Vercel : lint, types, tous tests math sans écraser les preuves historiques, tests négatifs du gate, build, budget, audit high, contrat HTML et Chromium sur le candidat. Axe serious/critical et contraste quantitatif ; quatre contrastes Analyzer réellement corrigés. Le test clavier S001 est rejoué. [Contrat de livraison](../../DELIVERY-CONTRACT.md).
- **F12 technique** : noms envoyés à Scryfall et autres destinations exposés, stockage/durées/effacement best effort expliqués, absence de promesse zéro transmission, SDK Sentry configuré distingué de réception effective et prérequis CSP documentés. Aucune télémétrie activée. **AC5 reste non acquis : validation juridique compétente absente.** [Inventaire](../../../privacy/DATA-FLOWS.md), [lot confidentialité](lot-privacy/REPORT.md).

## Compléments corrigés et vérifiés

- **E02 mobile** : à 360 px, « Full Deck List » dépassait de 19 px la zone rognée. Le bouton de partage passe sur une ligne distincte. La mesure géométrique échouait avant et passe après ; activation et restitution des cartes vérifiées à 360/768/1440 px.
- **V05 exports** : le PDF original n’émettait qu’une page alors que l’image mobile en nécessitait cinq. Le PDF découpe maintenant des lignes contiguës du canvas sur plusieurs pages A4 avec marges. Une largeur lisible minimale de 720 px, défilable au clavier sur mobile, protège aussi de la coupure horizontale. PNG et JSON contrôlés contre les totaux/score ; deux pages PDF finales rendues et inspectées. Le PDF reste une image, pas un PDF accessible avec structure textuelle ; les sauts peuvent couper une ligne, sans supprimer de pixels.
- **E03/E06 périmètre précis** : vocabulaire et seuils de score extraits dans une source commune ; labels d’onglets partagés et compteurs de seed dérivés. Le runtime déclaré passe de Node18 incompatible avec Vite7 à Node>=22.12/npm>=10 ; CI22 et projet Vercel22 cohérents. Les métadonnées des dépendances verrouillées restent inchangées. Pas de refonte générale des caches/composants.
- **V12 disponibilité** : 65 URLs primaires inspectées. 59 destinations HTTP200, cinq redirections vers une rubrique générique et un404 ; les six dernières étaient déjà marquées lost dans le seed. L’inventaire HTTP est acquis ; contenu/paywalls/vidéos ne sont pas certifiés. [Inventaire et réponses](links/REPORT.md).

## Preuves et revue

Les logs rouges restent conservés dans chaque lot. Le lead a relu le routage/gate, les contrats de score et les fichiers publics, et trouvé/corrigé le PDF mobile et les résidus llms. Confidentialité et éditorial se sont relus mutuellement ; l’agent confidentialité a relu les modifications mobile/PDF. Le lead a complété la distinction Sentry/CSP. Le test privacy initial visait par erreur Info dans My Analyses ; le contrôle corrigé vise Analyzer, où ce bouton existe réellement.

[Réglages Vercel en lecture seule](vercel-project-readonly.json) : buildCommand nul, donc entrée de `vercel.json`, Vite, Node22, branche native main. [Ruleset GitHub](github-ruleset.json) : empêche suppression et force-push, aucun required check. F11 est corrigé en conditionnant le build natif lui-même ; aucune attente de GitHub ni publication réelle n’est inventée.

[Baseline](baseline.json) : 49 fichiers source/tests de HEAD identiques au manifest S001. Les rapports préexistants et fichiers personnels restent hors du travail ; aucune donnée réelle importée/effacée. Métadonnées Scryfall publiques en fixtures ; seul le nouvel exemple public a été résolu une fois pour constituer la fixture datée (20 cartes, toutes trouvées).

## Environnement et limites

macOS, Node25.2.0/npm11.6.2 locaux, Vite7.3.6, Vitest4.1.10, Playwright1.63.0. Artefact sans DSN ni upload Sentry. Les quatre suites math auparavant écartées acceptent maintenant `MANATUNER_MATH_EVIDENCE_DIR` : 49 tests passent avec nouvelles preuves isolées, y compris oracle exhaustif et million de mélanges locaux simulés ; aucune allocation/analyse massive en production.

Firefox installé ne démarre pas (« Could not find profile folder »), y compris avec TMPDIR=/tmp : huit scénarios bloqués avant ouverture de l’application, pas des échecs applicatifs. WebKit est une vérification de moteur, pas un Safari/iPhone physique.

Restent distincts : conformité juridique (F12-AC5/V09), mesures terrain/V01, audit WCAG complet/lecteur écran V03, appareils physiques V04, événement Sentry reçu V08, Search Console V10, couverture exhaustive V06/V07/V11 et contenu externe complet V12. La configuration privée V02 a été lue, mais la publication du nouveau candidat n’a pas eu lieu. E01 observabilité locale et E04 performance restent partiels : aucune collecte ou optimisation non mesurée ajoutée. La mission d’audit étendue ne devient pas une certification globale.

## Validation intégrée finale — résultats acquis

- [Gate final complet](final-delivery.log) : **796 tests dans 78 fichiers**, lint, TypeScript, trois tests du gate (échec de chaque étape, processus tué, succès ordonné), build, budget, `npm audit --audit-level=high` (zéro vulnérabilité), 101 routes et **16 Chromium**, tous passants.
- [Campagne finale](final-e2e.log) : 32 scénarios passants, une attente de test incorrecte sur la panne réseau. Le cas initial conservait des terrains résolus dans le seed ; le contrat existant autorise alors le mode partiellement résolu. Le test a été corrigé pour une entrée sans aucune carte résoluble hors réseau (60 Lightning Bolt) : erreur sans résultat/sauvegarde, puis relance réussie. [Cas corrigé passant](network-final.log). **33 scénarios de campagne acquis**, sans modifier le comportement réseau S001 pour forcer le test.
- Au total **49 scénarios Chromium acquis** (16 livraison +33 campagne), dont 360/768/1440 px, JSON/PNG/PDF, liens partagés, restaurations, moteur exact avec oracle24 Plains, annulation et worker à50k échantillons locaux.
- [Contrôles croisés](cross-browser.log) : **8 WebKit passent**, sur les mêmes sources applicatives ; la dernière reconstruction ne change que les fichiers publics llms et le test de contrat associé. Firefox échoue avant navigation ; [essai TMPDIR distinct](firefox-retry.log), même erreur de profil. Aucun succès Firefox, matériel physique ou conformité Safari revendiqué.
- [Préservation](preservation.json) : diff des trois rapports préexistants strictement identique à l’entrée S002. `git diff --check` passe. Le [manifest](verified-manifest.json) contient les empreintes des 50 fichiers corrigés/nouveaux source, tests et contrats ainsi que les 154 fichiers de l’artefact.

### Commandes reproductibles

Depuis la racine du projet, avec Node compatible et Chromium installé :

```sh
env -u SENTRY_AUTH_TOKEN -u SENTRY_ORG -u SENTRY_PROJECT VITE_SENTRY_DSN='' PRERENDER_DIST="$PWD/docs/engineering/preuves-corrections/S002/dist" DELIVERY_TEST_OUTPUT="$PWD/docs/engineering/preuves-corrections/S002/final-delivery-browser" MANATUNER_MATH_EVIDENCE_DIR="$PWD/docs/engineering/preuves-corrections/S002/math" npm run build:vercel
PRERENDER_DIST="$PWD/docs/engineering/preuves-corrections/S002/dist" AUDIT_TEST_OUTPUT="$PWD/docs/engineering/preuves-corrections/S002/final-browser" npx playwright test --config=playwright.audit.config.js --project=chromium
PRERENDER_DIST="$PWD/docs/engineering/preuves-corrections/S002/dist" AUDIT_TEST_OUTPUT="$PWD/docs/engineering/preuves-corrections/S002/network-final" npx playwright test --config=playwright.audit.config.js --project=chromium --grep 'NR-M24'
PRERENDER_DIST="$PWD/docs/engineering/preuves-corrections/S002/dist" AUDIT_TEST_OUTPUT="$PWD/docs/engineering/preuves-corrections/S002/cross-browser" npx playwright test --config=playwright.audit.config.js --project=firefox --project=webkit --grep 'E02 mobile|V05 blueprint|NR-M21|NR-M02 actual|F12 detailed|NR-M11|F13 failed'
```

Ne pas relancer ces chemins sur des preuves historiques à conserver : utiliser un nouveau dossier Sxxx pour une future validation. Le gate crée un dossier temporaire privé de preuve math s’il n’est pas fourni. Le serveur strict de chaque configuration refuse un port déjà occupé et se termine avec Playwright.

### Correspondance de campagne

| Scénarios acquis | Preuve exécutée |
| --- | --- |
| NR-M02/M03 | `final-audit`: Try Example réel, entrée vide désactivée, 20 cartes résolues/60 copies |
| NR-M04/M05/M06/M07/M13/M14/M15 | `input-contract-audit`: saisie/partage/restore invalides, populations, persistance et reload |
| NR-M08/M09 | `synthesis-audit`: hybride vert, principal indépendant du sideboard |
| NR-M10 | `cancellation-audit`: Clear interrompt le réseau et persiste vide après reload |
| NR-M11 | `input-contract-audit`: exact 24 Plains, oracle indépendant (arrondi écran98 %) |
| NR-M12 | `mulligan-worker-recovery`: vraie simulation et relance à50k |
| NR-M16/M25 | `history-audit`: import/quota/legacy et comparaison validée |
| NR-M17 | gate `edit-deck-keyboard`: Enter/Espace/pointeur/tactile |
| NR-M20 | gate `html-contract`: 404 HTTP initial, noindex sans canonical accueil |
| NR-M21/M27 | `final-audit`: copie du vrai lien, décodage, reload/retour et mêmes cartes à768/1440 |
| NR-M22 | `input-contract-audit`: swap Counterspell/Bolt, population principale inchangée, retour main |
| NR-M23 | `final-audit`: JSON/totaux/score, PNG complet, nombre de pages PDF ; inspection visuelle des rendus |
| NR-M24 | `network-final.log`: aucune carte résoluble hors réseau, erreur puis reprise |

NR-M01/M18/M19/M26/M28 restent non cochés dans la campagne globale : certains contrôles techniques voisins sont acquis, mais le parcours précis n’a pas été entièrement rejoué. Aucun de ces contrôles non exécutés n’est transformé en preuve de réussite.

## Reprise

Aucun serveur de test conservé, aucun commit/push S002. Commiter/pousser seulement à la demande explicite, puis vérifier le build natif et les URLs effectivement publiées. La revue juridique de F12 doit être réalisée par une personne compétente. Les compléments E/V ouverts ne sont pas présentés comme des défauts supplémentaires tous corrigés.
