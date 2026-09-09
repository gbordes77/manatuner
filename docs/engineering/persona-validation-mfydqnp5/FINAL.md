# Reprise personas — bilan vérifié du 10 septembre 2026

Base : `2ba772a`. Branche de livraison Git : `codex/persona-followup-2026-09-10`. Candidat final : `dist-06`, identifié par `verified-manifest.json`. Les sources applicatives et tests sont identifiés par le manifest ; aucun chiffre moteur ne sert de preuve du SHA public.

## Corrections

- T00 : 50/50 sources S002 identiques au départ. L'artefact public est différent, six routes renvoient le même HTML, dont une404 en200. Statut Vercel du HEAD en échec; SHA effectivement servi non établi. `.nvmrc` aligne Node22 avec engines/CI.
- T01/T06 : contrat partagé des indices; formulations Guide/Home/Commander/FNM/terrains corrigées, inventaire des parcours utilisé pour les compteurs. JSON-LD Guide distingue correctement modèle et starting player. Les grandes corrections S002 ne sont pas réimplémentées.
- T02 : déficit de couleur prioritaire chiffré, cible indicative signalée si scalée/extrapolée, action Manabase; aide Health/Blueprint/Mulligan accessible. Aucune formule modifiée pour aligner artificiellement les valeurs.
- T03 : Compare conserve les motifs déjà persistés, explique modèle fixe/legacy/métadonnées/budget, exclut sideboard et commandant, conserve0% numérique et ne crée aucun delta manquant. Deux builds20/24Plains réellement calculés donnent des résultats exploitables; reload ne réécrit pas l'historique. Analysis distingue absence de calcul et zéro risque.
- T04 : exemple exact24Plains/36SavannahLions depuis Home, vérifié contre oracle indépendant et98% affiché. C'est une fixture synthétique, pas une decklist tournoi légale. Atraxa reconnu99+1/quatre couleurs/horizonT4–T8; limites du modèle conservées.
- T05 : aide London et labels conditionnels, vrai worker3k multijoueur puis duel, sept cartes après gratuit/seuil après-gratuit, bottoming pour mulligans payants. Choix d'archetype utilisables au clavier.
- T07 : nom du deck conservé, version/définitions/hypothèses dans JSON/CSV/PNG/PDF. CSV ajoute deux colonnes en fin (`is_sideboard`, `is_commander`) sans retirer les champs existants. Partage réel `#d=` copié puis rouvert dans un autre contexte, deck/name/tab uniquement ; paramètres de modèle non transportés annoncés. PNG/PDF téléchargés, deux pages PDF rendues et inspectées; CSV parsé séparément avec Python.
- T08 : largeur DOM réelle360/390/768/1440, clair/sombre, clavier. La revue visuelle a découvert du texte sombre sur sombre et un bouton Clear à3,31:1 ; overrides CSS fixes retirés, palette adaptée, tests axe ciblés rouges puis verts conservés.

## Validations acquises sur le candidat final

| Validation                                                   | Résultat                                                                                                                         | Preuve                                   |
| ------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------- |
| Gate obligatoire complet                                     | PASS :799 tests /79 fichiers, lint, TypeScript,3 tests négatifs/positifs du gate, build, budget, audit high,101routes,16Chromium | gate-06.log                              |
| Audit fonctionnel complet                                    | 33/33Chromium                                                                                                                    | audit-06.log                             |
| Personas / partage / CSV-JSON / EDH / responsive / contraste | 11/11Chromium                                                                                                                    | qa/candidate-06.log                      |
| Simulation réelle3k multijoueur puis duel                    | 1/1Chromium                                                                                                                      | qa/candidate-06-multiplayer2.log         |
| Contrôles moteur WebKit                                      | 8/8                                                                                                                              | cross-06.log                             |
| Préservation                                                 | Trois rapports utilisateur et vitest.config.js identiques à l'entrée                                                             | preservation-final.json                  |
| Revue exports                                                | 2pages PDF et PNG complets, CSV totaux60/24 et EDH99+1+sideboard1                                                                | export-review/REVIEW.md, csv-import.json |

Total : **799 tests de source/composants/math,61scénarios Chromium et8WebKit acquis**. Ne pas additionner les nombreux rejeux intermédiaires à ces résultats.

Les échecs antérieurs restent consultables : gate01 typage du spy dans le test neuf; gate02 répertoire math non créé; gate03 js-yaml4.3.1 vulnérable. Le correctif verrouille js-yaml4.3.2, seule dépendance modifiée. Advisory primaire : https://github.com/advisories/GHSA-2883-xcg3-v3hh. Audit final :0high/critical, quatre avis moderate de dépendances Vitest de développement restent signalés. Aucun seuil assoupli. Gate04/05 étaient verts mais antérieurs aux derniers textes : la référence finale est06.

## Réserves explicites

- Firefox :8scénarios bloqués avant navigation par « Could not find profile folder ». Une installation Firefox Playwright neuve dans un dossier isolé reproduit le problème : firefox-install.log et firefox-fresh-06.log. Aucun succès Firefox revendiqué, aucun échec applicatif déduit de ce démarrage impossible. Cette réserve de moteur supplémentaire ne transforme pas le gate obligatoire Chromium en échec.
- T09 : participants réels absents ; protocole dans le journal, aucun entretien inventé ou contact externe.
- F12-AC5 : revue juridique compétente absente. Appareils physiques, lecteur écran, WCAG complet et mesures terrain non certifiés. Le PDF reste une image non balisée et une rupture de page peut couper une ligne sans supprimer de pixels.
- Confirmation visuelle utilisateur demandée pendant les validations, sans réponse reçue à la rédaction. Les contrôles visuels du lead et QA sont acquis; ils ne sont pas présentés comme cette confirmation.
- Production non modifiée ni validée. Le commit/push demandé porte uniquement sur la branche `codex/persona-followup-2026-09-10`, dont `git.deploymentEnabled` vautfalse dans vercel.json. La documentation officielle prévoit qu'une branche ainsi désactivée ne déclenche pas de déploiement : https://vercel.com/docs/project-configuration/git-configuration. Aucun changement de dashboard, pushmain, activation Sentry ou message externe.

## Reproduction

Créer de nouveaux dossiers absolus, notamment le répertoire math explicite. Lancer `npm run build:vercel` avec `PRERENDER_DIST`, `DELIVERY_TEST_OUTPUT`, `MANATUNER_MATH_EVIDENCE_DIR` et Sentry désactivé. Puis `playwright.audit.config.js` (port3000) et `playwright.persona.config.js` (port3001) sur le même candidat. Ne pas réutiliser un serveur existant. Les commandes exactes et leurs résultats sont dans les logs et le journal.

Les sources, fixtures publiques, manifest, logs, captures finales et preuves compactes sont versionnés. Les builds, runtimes, PDF bruts et traces volumineuses restent conservés localement dans ce dossier et exclus du commit par son .gitignore. Les sources publiques de test et scripts permettent de les régénérer. Les anciens worktrees, backups et rapports personnels restent hors du commit.

Après le hook de formatage, reconstruction Vite indépendante : les37assets ont exactement les mêmes noms et SHA-256 que dist-06 (`postformat-equivalence.json`). Les validations restent attachées au même code exécutable.
