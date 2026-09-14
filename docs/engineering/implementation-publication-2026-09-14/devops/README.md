# B13 / B14 — livraison et dépendances, 14 septembre 2026

Travail sur main partagé ; aucun commit, push, déploiement, modification Vercel ou code produit par cet agent. Le candidat ici est intermédiaire et ne remplace pas le gate final du lead.

## B13 : constats actuels et corrections

Lecture actuelle via `gh run list` puis `gh run view 34747989787 --log-failed` : dernier nightly disponible du 13 septembre sur a0a23519253751b9c98d6b93f73822f21e8191c0. Les trois derniers sont failure. Logs intégraux dans nightly-before.log ; résumé JSON github-runs-before.json.

Le log complet révèle six échecs finaux, et pas seulement les quatre cités par la synthèse historique : deux sélecteurs Health Score ambigus (label + explication), récupération worker, contraste Library 1440, et deux scénarios contraste Mathematics/Guide 390 intermittents. Le job visual ne collectait aucun test : `@visual` absent du dépôt. L'accessibilité nightly séparée était réussie.

Reproduction locale avant correction en serveur Vite dev : 2 échecs (Health Score et worker), six scénarios de contraste réussis. Les couleurs nocturnes ne sont donc PAS reproduites comme défaut statique actuel. Les logs et traces avant sont préservés. Première tentative de config ne découvrait aucun projet : erreur du harness de campagne, conservée séparément ; corrigée en config explicite, pas en modifiant un test produit.

Corrections :

- Health Score : assertion sur le label existant #health-score-label dans quick-verdict, garde visibilité.
- Nightly construit et sert désormais le build preview ; récupération worker est vérifiée sur l'asset compilé comme en production. Aucune assertion du test worker changée. L'injection d'erreur du worker sous Vite dev ne reproduisait pas la panne attendue.
- Les huit parcours existants (4 routes × 2 largeurs, chaque scénario contrôlant clair/sombre) portent @visual : contraste, reflow, clavier et capture. Nom de job précis « Visual contrast and reflow » ; aucune prétention de comparaison pixel à une baseline inexistante.
- Attente du h1 de la page avant les observations : main est fourni par le shell avant le lazy mount ; l'attente d'animations déjà présente peut sinon voir seulement le shell. Aucun seuil axe diminué, aucune règle désactivée. Cette synchronisation est un durcissement justifié, pas une preuve que toute divergence Linux provient de cette seule course.
- Artefacts nightly conservés sept jours même en échec ; options de dossiers Playwright pour protéger les anciens rapports locaux.

## B14 : avis actuel

`npm audit --json` avant : quatre modérées, toutes liées à GHSA-82fw-gwwq-j7x9 ; aucun high/critical. L'avis primaire du mainteneur a été consulté le 14 septembre : https://github.com/vitest-dev/vitest/security/advisories/GHSA-82fw-gwwq-j7x9 . Versions 2.1.0 à <4.1.11 affectées, correction 4.1.11. Risque de lecture de fichiers par le serveur de développement via redirect mock ; l'exploitation non authentifiée suppose les plugins publics et un serveur joignable. Le mode browser propre à Vitest utilise une RPC authentifiée. Ces plugins ne figurent pas dans la configuration ManaTuner. Aucun lien établi avec exploitation du bundle statique public, aucune exploitation tentée.

Mise à jour ciblée de vitest, @vitest/ui, @vitest/coverage-v8 vers 4.1.11 dans le lock, exigences ^4.1.11 ; pas d'audit fix ni montée majeure. `npm audit` après : zéro vulnérabilité déclarée (npm-audit-after.json), ce qui ne constitue pas un audit complet de sécurité.

L'exécution Vitest a aussi révélé une collecte indue des anciens scripts Playwright docs/**/\*.spec.mjs. Exclusion docs/** dans vitest.config.js : ces preuves historiques conservent leurs runners dédiés, aucun test unitaire retiré. Les tests nouveaux B02/B04/B12 en rédaction concurrente restaient rouges lors des exécutions intermédiaires ; ces logs ne constituent pas un gate final. Validation globale finale à attribuer au lead.

## Publication : état de départ seulement

NATIVE-DEPLOYMENT.md et vercel.json lus. Intégration native GitHub → Vercel, build:vercel, install setup-build-browser puis npm ci. Ancien job deploy CI reste désactivé. Projet local existant prj_qvKxLp2oC64vryiQUl11EuFAkEO8. Status GitHub main avant : Vercel success pour a0a23519253751b9c98d6b93f73822f21e8191c0, https://vercel.com/gbordes77s-projects/manatuner-pro/FrXSX1hkdC3b57fqcUnTErfLZdTs . Cette lecture ne prouve pas l'identité actuelle de l'alias public. Publication et vérification SHA finale relèvent du lead ; rien publié par cet agent.

## Commandes et preuves

- npm audit --json avant/après ; npm install --save-dev vitest@4.1.11 @vitest/ui@4.1.11 @vitest/coverage-v8@4.1.11 : npm-update.log et npm-audit-\*.json.
- npm run test:unit : vitest-after.log (822 assertions passent,2 anciennes suites Playwright collectées), vitest-after-discovery.log et vitest-final.log (travail concurrent, détails bruts).
- npx playwright test --grep '@visual' --project=chromium --list : visual-discovery-before.log échec, visual-discovery-after.log 8 tests.
- npx playwright test --config=docs/engineering/implementation-publication-2026-09-14/devops/repro.config.mjs --project=chromium ... : repro-before-run2.log, 2 échecs/6 réussites.
- npx vite build --outDir docs/engineering/implementation-publication-2026-09-14/devops/candidate : build.log, réussi ; build intermédiaire simple, pas gate ni prerender complet.
- Reprise preview ciblée : after.config.mjs, repro-after.log (résultat ajouté après fin).

Reprise ciblée terminée : **11/11 Chromium réussis en 1,1 minute**, y compris récupération du worker à 50 000 et les huit scénarios @visual. Deux thèmes par scénario visuel, soit seize observations. Le nom de job n'annonce plus une régression pixel inexistante. Candidate-manifest.json identifie le build intermédiaire utilisé. Les tests complémentaires restants du nightly sont lancés dans rest.config.mjs, dossier nightly-rest distinct ; ils ne remplacent pas la vérification Linux distante.

Source de timings pertinents : ArticleCard transition all 0.25s, boutons thème 0.3s ; AnimatedContainer fadeInUp dure par défaut0.6s avec délai par index. Le test attend la page puis les animations finies au lieu d'un sleep arbitraire.

Contrats natifs : `node --test scripts/setup-build-browser.node-test.mjs scripts/delivery-gate.test.mjs` : **6/6 réussis**, code0 (native-gate-contract.log). Diff check des fichiers détenus : code0. Ce test local des scripts ne certifie pas une nouvelle exécution Amazon Linux/Vercel.

## Résultat final de cet agent

Complément nightly terminé : **73/73 Chromium réussis**, code0 (`nightly-rest.log`), sans relancer les onze tests précédents. Au total **84/84 scénarios core + accessibilité** sur ce build intermédiaire, répartis entre les deux exécutions complémentaires. Les huit tests visuels sont inclus dans ces84, pas ajoutés une deuxième fois. Validation Linux distante, candidat final après les modifications des autres agents, gate complet et publication restent à acquérir par le lead. Les logs unitaires de l'agent ont volontairement conservé les rouges de TDD simultané ; ne pas les transformer en réussite finale.

Rejeu exact complément : `npx playwright test --config=docs/engineering/implementation-publication-2026-09-14/devops/rest.config.mjs --project=chromium tests/e2e/core-flows/ tests/e2e/accessibility/ --grep-invert 'Try Example|F13|health score|@visual'`. Le config sert le dossier candidate figé sur4313 et sort dans nightly-rest, sans toucher les anciens rapports.

Incident de préservation : commandes --list ont écrit les deux reporters par défaut, initialement propres. Outputs déplacés dans discovery-reports-incident, puis playwright-report/index.html et test-results.json restaurés exactement via git show HEAD sur instruction du lead qui avait établi leur état initial propre. Aucune ancienne preuve sale rétablie. Configs de toutes les exécutions navigateur effectives utilisent reporter line et sorties propres.
