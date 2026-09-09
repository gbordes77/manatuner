# T00 — état public/local et préparation livraison

Observation : 10 septembre 2026 Europe/Paris (HTTP daté 9 septembre 22:12 UTC).

## Candidat et préservation

Branche `main`, HEAD et `git ls-remote origin refs/heads/main` : `2ba772af1f308ea93c68ffea53b0ccef0e49c57d`. Les 50 fichiers source/tests/contrats de `S002/verified-manifest.json` correspondent SHA256 pour SHA256 au contenu local avant corrections personas. Voir `s002-comparison.json`. S002 est donc déjà présent localement. Son HEAD historique désigne sa base avant correction, pas la source locale actuelle.

`status.txt` conserve les changements préexistants. Aucun nettoyage, reset, modification de rapport historique, commit ni mutation distante effectué par cet agent. Le candidat final devra inclure explicitement les changements pertinents non commités (dont vitest.config.js existant), puis être identifié par manifest ; HEAD seul ne suffit pas.

## Runtime

Node local 25.2.0/npm 11.6.2 ; engines package.json >=22.12/npm>=10 ; CI et PR Node22 ; réglage Vercel S002 historique 22.x. `.nvmrc` déclarait 20, incompatible avec engines. Correction bornée `.nvmrc` vers 22, sans dépendance modifiée. Runtime installé Node22 non trouvé à /opt/homebrew/opt/node@22/bin/node. Le runtime local satisfait engines mais n'est pas la même majeure que CI.

Ports 3000/4174/4175 sans listener au moment de la capture `ports.txt`. Revérifier avant gate/campagne : d'autres agents peuvent démarrer un serveur ensuite.

## Preuve publique HTTP

`public-http.json`, `public-assets.json` et corps téléchargés : /, /guide, /about, /privacy, /analyzer et /mathematics répondent 200 avec les mêmes 12452 octets SHA256 `92a5a9cdceeb8bc04f3ae1dc0ab909d53edf6feae582d16fcd46dd72173623be`. Une première erreur DNS isolée sur /mathematics est conservée ; la seconde requête réussit. L'URL inconnue `/__persona_probe_missing_20260910` répond également 200 avec ce même HTML. Ce comportement ne satisfait pas le contrat S002 des routes statiques et 404.

Bundle public `/assets/index-DFp0hwDC.js` : SHA256 `38c0edfbcef1f9f7b699c18504ba11ad250cbd923cb17ecfe2ada5829828f69a`, 154797 octets. Le manifest S002 référence `assets/index-CJwtl9pP.js`. Les noms d'assets et HTML établissent une différence d'artefact ; ils ne révèlent pas le SHA Git public. Aucun marqueur commit identifié dans l'entrée JS publique. Lecture HTTP seulement : aucune prétention de validation du rendu interactif.

GitHub read-only (`github-checks.jsonl`, `github-status.json`) : Test & Build de HEAD a réussi ; statut Vercel de ce SHA en échec, URL https://vercel.com/gbordes77s-projects/manatuner-pro/GSUbqhYWrJLucwZJ3hWHzhEoWVia. Des campagnes nightly E2E et visual sont aussi en échec, accessibility en succès. Ces résultats historiques ne constituent ni validation actuelle ni preuve du SHA effectivement servi. Cause du build Vercel inaccessible dans ce sous-lot ; ne pas l'inventer.

## Matrice de triage avant code

| Constat persona                                     | Source locale/S002                                          | État public établi                                                            | Travail restant                                                    |
| --------------------------------------------------- | ----------------------------------------------------------- | ----------------------------------------------------------------------------- | ------------------------------------------------------------------ |
| Formulations absolues Home/Guide/Math/About/Privacy | F10/F12 corrigés, 50/50 fichiers manifest identiques        | Artefact différent, ancien constat personas ; HTML public identique par route | Relire rendu candidat, corriger seulement résidus reproduits       |
| Prérendu/404                                        | F09 + gate déjà présents                                    | 6 routes et URL inexistante même HTML/200                                     | Valider nouveau candidat ; publication distincte                   |
| Compare 14 indisponibles                            | Gardes S002 existants ; cause actuelle non déduite          | Observation audit, non reproduite par HTTP                                    | T03 reproduire état/support/paramètres                             |
| Scores Health/Blueprint/Mulligan                    | Contrat heuristique F10 présent                             | Audit signale confusion                                                       | T02 clarifier action/définition sans changer formule               |
| Exemple exact/EDH                                   | Garde hors modèle présente                                  | Audit modèles non supportés                                                   | T04 exemple compatible + oracle ; conserver refus                  |
| London gratuit/commandant                           | Textes S002 présents                                        | Audit demande précision selon mode                                            | T05 vérifier cas multijoueur puis résidus                          |
| Exports/partage/mobile                              | Corrections E02/V05 + campagne S002 acquises historiquement | Audit septembre incomplet                                                     | T07/T08 rejouer sur candidat final, ne pas recréer fonctionnalités |
| Runtime                                             | engines/CI22 présents                                       | Réglage Vercel22 historique                                                   | .nvmrc20 corrigé22                                                 |

## Exécution préparée

Après stabilisation des lots, utiliser un dossier neuf sous la campagne et des chemins absolus :

```sh
persona_gate_dir="/Volumes/DataDisk/_Projects/Project Mana base V2/docs/engineering/persona-validation-mfydqnp5/delivery/final"
mkdir -p "$persona_gate_dir"
env -u SENTRY_AUTH_TOKEN -u SENTRY_ORG -u SENTRY_PROJECT VITE_SENTRY_DSN='' PRERENDER_DIST="$persona_gate_dir/dist" DELIVERY_TEST_OUTPUT="$persona_gate_dir/browser" MANATUNER_MATH_EVIDENCE_DIR="$persona_gate_dir/math" npm run build:vercel > "$persona_gate_dir/gate.log" 2>&1
```

Contrôler le code de sortie ; ne jamais réutiliser ce dossier pour écraser un échec. Le gate passe lint, types, Vitest source/component/math, tests négatifs du gate, build, budget, audit high, prérendu/HTML et Chromium. Ensuite la campagne complémentaire `playwright.audit.config.js` exige le port3000 libre (reuseExistingServer=false) et `AUDIT_TEST_OUTPUT` neuf ; elle doit servir le même `PRERENDER_DIST` final. La suite audit réserve 3000, livraison4175, prérendu4174. Aucun gate exécuté dans ce sous-lot avant signal coordinateur.

## Commit/push et déploiement

La demande utilisateur finale autorise commit/push conditionné aux validations. Cependant `docs/deployment/NATIVE-DEPLOYMENT.md`, `.github/workflows/ci.yml` et `scripts/native-deployment.mjs` confirment qu'un push main déclenche normalement la publication native Vercel. Le dépôt ne définit aucun mécanisme existant garantissant un push sans déploiement. Une nouvelle branche peut aussi déclencher un preview selon les réglages privés. Ne pas déduire qu'elle évite toute publication, et ne pas modifier un réglage distant sans autorisation. Le coordinateur doit expliciter cette conséquence si l'interdiction de déploiement est maintenue. Aucun push effectué ici.
