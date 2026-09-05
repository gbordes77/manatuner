# Registre des fichiers de la seconde vague

Diff applicatif et preuves entre `e4ec1e3` et `54b3d4b`. Les changements antérieurs sont décrits dans les deux rapports historiques. La clôture ajoute ce registre et actualise REPORT.md et validation.json.

| Fichier                                                     | Motif                                                                                                |
| ----------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| `.github/workflows/browser-audit.yml`                       | Matrice Linux de six navigateurs/formats avec artefacts isolés.                                      |
| `docs/math/audit-2026-09-05/REPORT.md`                      | Preuves, inventaire, limites et renvois vers le rapport de clôture.                                  |
| `docs/math/completion-2026-09-05/INVENTORY.md`              | Preuves, inventaire, limites et renvois vers le rapport de clôture.                                  |
| `docs/math/completion-2026-09-05/REPORT.md`                 | Preuves, inventaire, limites et renvois vers le rapport de clôture.                                  |
| `docs/math/completion-2026-09-05/arithmetic-inventory.json` | Preuves, inventaire, limites et renvois vers le rapport de clôture.                                  |
| `docs/math/completion-2026-09-05/card-sources.json`         | Preuves, inventaire, limites et renvois vers le rapport de clôture.                                  |
| `docs/math/completion-2026-09-05/validation.json`           | Preuves, inventaire, limites et renvois vers le rapport de clôture.                                  |
| `docs/math/physical-engine-2026-09-05/MODEL.md`             | Preuves, inventaire, limites et renvois vers le rapport de clôture.                                  |
| `docs/math/physical-engine-2026-09-05/REPORT.md`            | Preuves, inventaire, limites et renvois vers le rapport de clôture.                                  |
| `index.html`                                                | Message visible quand JavaScript est désactivé.                                                      |
| `package-lock.json`                                         | Correctifs de sécurité de production et dépendances optionnelles multiplateformes.                   |
| `package.json`                                              | Versions de Playwright et Vercel CLI compatibles.                                                    |
| `playwright.config.js`                                      | Validation du build de production par serveur preview.                                               |
| `src/components/EnhancedCharts.tsx`                         | Affichage physique, pondération des exemplaires et distinction entre inconnus et valeurs numériques. |
| `src/components/EnhancedRecommendations.tsx`                | Affichage physique, pondération des exemplaires et distinction entre inconnus et valeurs numériques. |
| `src/components/EnhancedSpellAnalysis.tsx`                  | Affichage physique, pondération des exemplaires et distinction entre inconnus et valeurs numériques. |
| `src/components/ManaCostRow.tsx`                            | Ne pas bloquer un calcul de terrains seuls par un taux de destruction sans effet.                    |
| `src/components/Onboarding.tsx`                             | Empilement sous le menu mobile.                                                                      |
| `src/components/analyzer/AnalysisTab.tsx`                   | Affichage physique, pondération des exemplaires et distinction entre inconnus et valeurs numériques. |
| `src/components/analyzer/MulliganTab.tsx`                   | Mode multijoueur, libellés de précision et isolation des workers successifs.                         |
| `src/components/common/BetaBanner.tsx`                      | Empilement sous les drawers et modales.                                                              |
| `src/data/landSeed.ts`                                      | Cinq battle lands avec conditions et types physiques.                                                |
| `src/pages/HomePage.tsx`                                    | Suppression des promesses mathématiques dépassant le modèle.                                         |
| `src/pages/MyAnalysesPage.tsx`                              | Comparaisons refusées si données absentes ou modèles incompatibles.                                  |
| `src/services/__tests__/turnPlan.test.ts`                   | Régression ou oracle du comportement corrigé, exécuté dans la validation décrite au rapport.         |
| `src/services/castability/physicalManaEngine.ts`            | Conditions ETB physiques et cache borné isolant les résultats et paramètres.                         |
| `src/services/deckAnalyzer.ts`                              | Ordre des recommandations, résultats physiques, modèle versionné et inconnus explicites.             |
| `src/services/manaCalculator.test.ts`                       | Régression ou oracle du comportement corrigé, exécuté dans la validation décrite au rapport.         |
| `src/services/manaCalculator.ts`                            | Validation des entrées, lançabilité physique stricte et unions hybrides.                             |
| `src/services/mulliganSimulatorAdvanced.ts`                 | Reprise gratuite, pioche multijoueur, coûts et plans de mana stricts.                                |
| `src/services/mulliganStopping.ts`                          | Valeur de Bellman de la reprise gratuite.                                                            |
| `src/services/spellSummary.ts`                              | Risque pondéré par exemplaire et indisponibilité si données incomplètes.                             |
| `src/types/index.ts`                                        | Risque nullable lorsque les calculs sont incomplets.                                                 |
| `src/workers/mulliganArchetype.worker.ts`                   | Propagation de l’option multijoueur au simulateur.                                                   |
| `tests/e2e/performance/loading.spec.js`                     | Scénarios actualisés : navigation, vrais onglets, données déterministes et assertions pertinentes.   |
| `tests/e2e/responsive/mobile-desktop.spec.js`               | Scénarios actualisés : navigation, vrais onglets, données déterministes et assertions pertinentes.   |
| `tests/fixtures/audit-browser.js`                           | Données Scryfall reproductibles et navigation adaptée aux formats mobiles.                           |
| `tests/fixtures/scryfall-audit.json`                        | Données Scryfall reproductibles et navigation adaptée aux formats mobiles.                           |
| `tests/math-audit/bellman.test.ts`                          | Régression ou oracle du comportement corrigé, exécuté dans la validation décrite au rapport.         |
| `tests/math-audit/conditional-lands.test.ts`                | Régression ou oracle du comportement corrigé, exécuté dans la validation décrite au rapport.         |
| `tests/math-audit/mulligan-worker-ui.test.tsx`              | Régression ou oracle du comportement corrigé, exécuté dans la validation décrite au rapport.         |
| `tests/math-audit/multiplayer.test.ts`                      | Régression ou oracle du comportement corrigé, exécuté dans la validation décrite au rapport.         |
| `tests/math-audit/physical-engine.test.ts`                  | Régression ou oracle du comportement corrigé, exécuté dans la validation décrite au rapport.         |
| `tests/math-audit/physical-ui.test.tsx`                     | Régression ou oracle du comportement corrigé, exécuté dans la validation décrite au rapport.         |
| `tests/math-audit/populations.test.ts`                      | Régression ou oracle du comportement corrigé, exécuté dans la validation décrite au rapport.         |
| `tests/math-audit/regressions.test.ts`                      | Régression ou oracle du comportement corrigé, exécuté dans la validation décrite au rapport.         |
| `tests/math-audit/spell-summary.test.ts`                    | Régression ou oracle du comportement corrigé, exécuté dans la validation décrite au rapport.         |
| `tests/mtg-specific/card-types/special-lands.spec.js`       | Régression ou oracle du comportement corrigé, exécuté dans la validation décrite au rapport.         |
| `vitest.config.js`                                          | Réintégration des tests publics de terrains spéciaux.                                                |

Complément `13597e5` :

| Fichier                                                    | Motif                                                                |
| ---------------------------------------------------------- | -------------------------------------------------------------------- |
| `src/pages/AnalyzerPage.tsx`                               | Identifiants ARIA et relations des cinq onglets avec leurs panneaux. |
| `tests/e2e/accessibility/a11y.spec.js`                     | Vérifier le menu réellement affiché sur mobile ou bureau.            |
| `tests/e2e/core-flows/audit-wave-c-verify.spec.js`         | Vérifier le groupe Learn dans le drawer mobile ou le menu de bureau. |
| `tests/e2e/tabs/analyzer-tabs.spec.js`                     | Vérifier les relations ARIA et la visibilité du bon panneau.         |
| `tests/e2e/performance/loading.spec.js`                    | Mesurer la latence applicative, en conservant les seuils.            |
| `tests/fixtures/interaction-timing.js`                     | Horloge du navigateur entre clic réel et contenu prêt.               |
| `playwright.config.js`                                     | Profil iPad Pro 11 existant, avec WebKit.                            |
| `docs/math/completion-2026-09-05/browser-regressions.json` | Conservation des échecs historiques et preuves de leur diagnostic.   |

Complément `53917a8` : `src/services/castability/__tests__/acceleratedAnalytic.test.ts` — séparation des sept tours en cas distincts pour attribuer un délai individuel à chaque énumération exacte, sans modifier les assertions.

Compléments `d40fdb3`, `65d64d2`, `acfb37c` :

| Fichier                                            | Motif                                                                                             |
| -------------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| `.github/workflows/browser-audit.yml`              | Filtre facultatif pour reproduire un scénario ; vide conserve toute la campagne.                  |
| `tests/e2e/performance/loading.spec.js`            | Mesures sans enregistrement, contrôle indépendant à affichage retardé et attente du vrai contenu. |
| `tests/fixtures/interaction-timing.js`             | Mesure du clic réel au DOM visible ; suppression de l’attente artificielle de trois images.       |
| `src/components/analyzer/TabPanel.tsx`             | Affichage immédiat et conteneurs accessibles présents pendant le chargement différé.              |
| `src/pages/AnalyzerPage.tsx`                       | Chargement différé isolé dans chaque panneau, préservant ses relations ARIA.                      |
| `tests/math-audit/tab-panel-loading.test.tsx`      | Régression asynchrone des identifiants ARIA pendant et après le chargement.                       |
| `tests/fixtures/audit-browser.js`                  | Attendre le menu réellement rendu avant de sélectionner une branche responsive.                   |
| `tests/e2e/accessibility/a11y.spec.js`             | Attente du menu avant l’assertion d’unicité du lien.                                              |
| `tests/e2e/core-flows/audit-wave-c-verify.spec.js` | Attente du menu avant de vérifier le groupe Learn.                                                |
