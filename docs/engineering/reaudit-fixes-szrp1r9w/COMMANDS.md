# Reproduction de cette campagne

Racine : `/Volumes/DataDisk/_Projects/Project Mana base V2`. Runtime observé Node25.2.0/npm11.6.2, compatible avec engines>=22.12/>=10 ; CI utilise Node22. Aucun service préexistant arrêté.

Chaque gate utilise un nouveau chemin absolu `PRERENDER_DIST`, `DELIVERY_TEST_OUTPUT` et `MANATUNER_MATH_EVIDENCE_DIR` précréé. Sentry neutralisé par `env -u SENTRY_AUTH_TOKEN -u SENTRY_ORG -u SENTRY_PROJECT VITE_SENTRY_DSN=''`. Commande : `npm run build:vercel`. Le gate inclut lint/types/unit/math, tests du gate, build, budget, audit high,101routes et16Chromium.

Les suites complémentaires utilisent le même `PRERENDER_DIST` :

```sh
AUDIT_PORT=4300 AUDIT_TEST_OUTPUT=/chemin/absolu/audit npx playwright test --config=playwright.audit.config.js --project=chromium
PERSONA_TEST_OUTPUT=/chemin/absolu/persona npx playwright test --config=playwright.persona.config.js --project=chromium
```

Les serveurs restent stricts, `reuseExistingServer:false`. Ports4174/4175 pour gate,4300audit,3001personas,4311revue finale. Le service3000 et l'ancien artefact4186 sont intacts.

Tests ciblés : `npx vitest run src/utils/__tests__/comparison.test.ts` (4/4). CSV : `python3 scripts/read-blueprint-csv.py <export.csv>`, résultats compacts dans csv-import.json.

Les logs01/final/03 sont des étapes antérieures conservées, pas la validation finale du candidat après toutes corrections. Persona initial :16pass/1timeout sur test agrégé8routes; séparation par route sans augmenter30s. Fond clair du thème sombre détecté visuellement : axe seul donne un faux négatif sur le gradient; background-red.log échoue avant correction GlobalStyles. Contrastes éditoriaux supplémentaires détectés après retrait du gradient : voir persona-03.log.

Git : fetch et vérification divergence autorisés. Staging par chemins explicites, aucune commande add globale. Hooks conservés. Push uniquement `git push origin HEAD:refs/heads/codex/persona-followup-2026-09-10`, puis comparaison `git rev-parse HEAD`/`git ls-remote --heads origin refs/heads/codex/persona-followup-2026-09-10`.

Les logs versionnés retirent uniquement les espaces en fin de ligne ; leurs originaux restent dans raw-logs/ hors commit. Aucun échec ni assertion supprimé.
