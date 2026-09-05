# Commandes et résultats

Répertoire courant : `/Volumes/DataDisk/_Projects/Project Mana base V2`. Snapshot initial : `/tmp/mtg-audit-baseline`, créé par archive Git, sans changer le checkout utilisateur. Les rapports navigateur sont isolés, car leurs chemins habituels contenaient déjà des modifications utilisateur.

| Validation                                                          | Commande exécutée                                                                       | Initial                                           | Après corrections                                   |
| ------------------------------------------------------------------- | --------------------------------------------------------------------------------------- | ------------------------------------------------- | --------------------------------------------------- |
| Suite Vitest habituelle, composants/intégration inclus selon config | `npm run test:unit`                                                                     | 440 PASS, 2 skipped ; 37 fichiers                 | 496 PASS, 8 expected fail, 2 skipped ; 44 fichiers  |
| Régressions math et table, appliquées au snapshot                   | `npx vitest run tests/math-audit/regressions.test.ts tests/math-audit/karsten.test.ts`  | 29 FAIL sur 29                                    | 29 PASS dans la suite finale                        |
| Audit math ciblé                                                    | `npx vitest run tests/math-audit`                                                       | Non applicable                                    | 56 PASS, 8 expected fail                            |
| Contre-exemples en mode strict                                      | `MTG_AUDIT_STRICT=1 npx vitest run tests/math-audit/known-limitations.test.ts`          | Non nécessaire au verdict initial                 | 8 FAIL sur 8, exit 1                                |
| Types                                                               | `npm run type-check`                                                                    | PASS                                              | PASS                                                |
| Lint                                                                | `npm run lint`                                                                          | 0 erreur, 25 avertissements                       | 0 erreur, 27 avertissements                         |
| Build                                                               | `npm run build -- --outDir /tmp/mtg-audit-build`                                        | PASS (snapshot : commande de build, voir journal) | PASS                                                |
| Oracle Karsten exact                                                | `python3 scripts/math-audit-oracle.py > docs/math/audit-2026-09-05/karsten-oracle.json` | Sans production importée                          | 8 probabilités rationnelles, 4 frontières vérifiées |
| Inventaire AST                                                      | `node scripts/math-audit-inventory.cjs`                                                 | Sans verdict implicite                            | 579 sites, 58 fichiers                              |
| Diff                                                                | `git diff --check`                                                                      | —                                                 | PASS                                                |

Les huit expected fail sont de vrais défauts mathématiques non réparés, déclarés explicitement avec `it.fails`. Ils ne comptent pas parmi les 496 PASS. Le mode strict expose les assertions en échec afin que cette convention ne puisse pas servir de preuve d'exactitude.

Deux avertissements lint nouveaux concernent `react-refresh/only-export-components`, dus aux exports des hooks de test de `ManaCostRow.tsx`. Aucun avertissement préexistant n'a été masqué ou désactivé.

## Playwright complet

Commandes exactes :

```
npx playwright test --config=/tmp/mtg-audit-baseline/audit-playwright.config.js --workers=4
npx playwright test --config=/tmp/mtg-audit-final/audit-playwright.config.js --workers=4
```

Ces configurations reprennent les six projets et les tests du dépôt ; seules les destinations des rapports, le port et le répertoire du serveur changent. Elles sont conservées dans `baseline-playwright.config.txt` et `final-playwright.config.txt`.

Initial : **365 FAIL, 67 PASS, 6 skipped** en 14,3 minutes. Après modifications principales : **365 FAIL, 67 PASS, 6 skipped** en 14,4 minutes. Comparaison par identité projet/fichier/titre : **365 échecs communs, zéro nouvel échec, zéro échec résolu**. Le run navigateur a été lancé avant la toute dernière correction de la catégorie sept terrains ; cette correction est couverte par la suite Vitest complète relancée et par le build final, pas par un nouveau run des 438 scénarios navigateur.

Répartition finale des 365 échecs : 216 exécutables de navigateur absents ; 35 sélecteurs ambigus ; 114 délais/assertions, comprenant des sélecteurs/libellés obsolètes. Les dernières catégories ne doivent pas être réduites automatiquement à des problèmes d'environnement : leurs détails sont conservés dans `e2e-errors.json`. La liste des identités et la comparaison sont dans `e2e-comparison.json`.

## Tests exclus de la configuration courante

La configuration Vitest exclut `tests/mtg-specific/card-types/**`. Une configuration temporaire identique sauf cette exclusion a permis de les exécuter sans modifier celle du projet :

```
# Depuis le répertoire courant
npx vitest run tests/mtg-specific/card-types/special-lands.spec.js --config=/tmp/mtg-audit-final/audit-edge.config.mjs

# Depuis /tmp/mtg-audit-baseline
npx vitest run tests/mtg-specific/card-types/special-lands.spec.js --config=/tmp/mtg-audit-baseline/audit-edge.config.mjs
```

Résultat : **12 FAIL avant et après**, `TypeError: parseDeckList is not a function`. Le test importe une fonction qui n'est plus exportée. Cela ne vérifie aucune propriété des terrains et ne constitue pas une nouvelle régression. Les configurations et journaux sont conservés ici.

## Limites de la campagne

Aucune couverture exhaustive carte par carte ni certification du RNG complet. Les suites navigateur et de cartes spéciales ne passent pas ; aucune affirmation de build « entièrement validé » n'est fondée sur leurs résultats. Les scripts de package ciblant les mêmes répertoires ne constituent pas des suites indépendantes et n'ont pas été comptés une seconde fois.
