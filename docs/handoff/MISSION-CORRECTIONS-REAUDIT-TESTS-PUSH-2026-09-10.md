# Mission — résidus du réaudit, tests, commit et push

> **Autorisation courante, 10 septembre 2026, reprise exécutée :** le dernier message utilisateur remplace les instructions `main` conservées ci-dessous comme historique. Destination exclusive `origin/codex/persona-followup-2026-09-10`. Aucun push main, merge, force-push ou déploiement. Auto-déploiement de cette branche maintenu désactivé. Le commit ciblé et le push sont autorisés après validation technique. Preuves actuelles : `docs/engineering/reaudit-fixes-szrp1r9w/FINAL.md`.

Préparée le 10 septembre 2026 à la demande de l’utilisateur. **Ce fichier prépare la prochaine exécution ; aucune correction, aucun commit ni push n’a été exécuté lors de sa rédaction.**

## Résultat attendu et autorisation de reprise

À l’exécution du prompt associé : corriger les résidus du réaudit, vérifier les parcours, exécuter les tests, créer un commit ciblé et pousser sur **`main`** vers **`origin`**, actuellement `https://github.com/gbordes77/manatuner.git`. Le prompt autorise explicitement ce commit/push après validations ; pas de nouvelle confirmation de principe nécessaire.

**Instruction utilisateur actualisée : tout le travail de cette mission doit être intégré, commité et poussé sur `main`. Aucune branche annexe à créer ni à utiliser comme destination finale.** Cette instruction remplace les anciennes consignes de push sur branche dédiée. Intégrer aussi les correctifs pertinents déjà commités sur la branche existante, pas seulement les nouveaux résidus. Le push sur main peut déclencher le déploiement natif configuré : inspecter puis suivre son état, sans modifier les réglages pour le contourner. Aucun force-push, déploiement manuel supplémentaire ou activation Sentry demandé.

## Lectures obligatoires, dans l’ordre

1. `AGENTS.md`, ce fichier, puis `HANDOFF.md`.
2. `docs/session/PERSONA_REAUDIT_2026-09-10.md`, surtout méthode, résultats et résidus ; rapports individuels selon le lot attribué.
3. `docs/session/persona-reaudit-2026-09-10/preuves-lead.md`.
4. `docs/engineering/persona-validation-mfydqnp5/FINAL.md` et son manifest.
5. `docs/engineering/DELIVERY-CONTRACT.md`.
6. `docs/engineering/JOURNAL-TACHES-PERSONAS-2026-09-09.md` pour les travaux précédents ; S002 seulement pour les corrections connexes, sans réimplémentation inutile.

## État de départ et protection des fichiers

HEAD observé au réaudit : `251731694b2a0b6b74102a73d50e56fae8ce2750`. Le candidat dist-06 correspondait à son manifest. Les notes sont passées de12,89à14,67/20 ; quatre personas reposaient en partie sur HTTP/preuves partagées faute de CUA. Ce n’est pas une étude utilisateurs ni une validation de publication.

Relever l’état courant, car il peut évoluer : branche, HEAD, upstream, changements, Node/npm. Les rapports `playwright-report/index.html`, `test-results.json`, `test-results/.last-run.json`, les worktrees, backups et fichiers personnels préexistent et restent hors commit. Les ajouts documentaires du réaudit et de cette mission, ainsi que leurs mises à jour de suivi, peuvent être inclus après relecture ciblée. Éviter `git add .`, les nettoyages et les commandes de réinitialisation destructrices.

Distinguer l’artefact historique dist-06 et le nouveau candidat : toute modification demande un nouveau dossier de preuves et un build nouveau. Ne pas utiliser le serveur4186 de l’ancien artefact comme preuve des nouveaux changements. Un service3000 préexistait aussi : vérifier son propriétaire avant intervention.

## Organisation

Commencer par context-manager local s’il est réellement disponible, sinon agent-organizer. Puis attribuer des fichiers à des agents spécialisés disponibles : éditorial/méthode, comparaison/interface, QA/livraison. Si un rôle annoncé n’est pas exposé, utiliser un rôle local approprié en précisant la responsabilité. Ne pas multiplier les écritures concurrentes dans MyAnalysesPage. Préserver le travail des autres agents.

## Lots à exécuter

| ID  | Priorité     | Travail                                                         | Critères d’acceptation                                                                                                                                                                                                                                                                                                                                                  |
| --- | ------------ | --------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| R01 | P1           | Unifier Mathematics et ses descriptions des modes               | Estimations par défaut, exact goldfish sous conditions, tableau de comparaison sauvegardé et mulligan décrivent chacun le bon événement. Aucune phrase de l’ancien modèle ne présente une règle générale fausse. Contrôler aussi accordéons, FAQ et métadonnées pertinentes.                                                                                            |
| R02 | P1           | Supprimer les promesses absolues résiduelles de confidentialité | My Analyses et les surfaces liées restent cohérentes avec Privacy : stockage des analyses local, requêtes externes documentées. Pas de promesse générale zéro transmission. La revue juridique demeure distincte.                                                                                                                                                       |
| R03 | P1/P2        | Simplifier les résultats indisponibles de Compare               | Motif commun regroupé, couverture calculée visible, pas de28répétitions inutiles ; motif par sort accessible si différent. Offrir une action utile vers Analyzer ou exemple compatible, sans ajouter de faux résultat ni élargir le moteur.                                                                                                                             |
| R04 | P2           | Corriger la règle pédagogique sous85%                           | Expliquer qu’un résultat demande une investigation selon le mode, coût, tour et limites, sans conclure automatiquement « ajouter des sources de cette couleur ».                                                                                                                                                                                                        |
| R05 | P2           | Nettoyer les compteurs et arrondis                              | Plus de « Five » pour7lectures ; dériver le texte du nombre de références. Probabilités/deltas de Compare affichés avec précision lisible cohérente, sans altérer les valeurs calculées ou exportées. Préserver0%, valeurs indisponibles et signe des écarts.                                                                                                           |
| R06 | P2           | Rendre le contexte de partage/EDH autonome                      | Maintenir l’avertissement deck/nom/onglet sans paramètres ; afficher clairement bibliothèque99 + commandant1 pour EDH dans le résumé/Blueprint pertinent. Ne pas modifier le protocole de partage pour transporter les paramètres dans ce lot. Documenter la lecture du CSV multi-sections existant avec une recette vérifiée ; montrer CSV parmi les exports proposés. |
| R07 | Vérification | Relire les slogans et textes voisins                            | Rechercher les formulations optimal/exact/zero/local et FAQ liées ; corriger seulement les contradictions établies avec le contrat, sans refonte marketing générale. Signaler clairement que24Plains/36SavannahLions est une fixture synthétique, pas une liste légale de tournoi.                                                                                      |

Points d’entrée confirmés lors de la préparation (lignes susceptibles de bouger) :

- `src/pages/MathematicsPage.tsx` : introduction potentiel physique et corps explicatif.
- `src/pages/MyAnalysesPage.tsx` : comparaison et badge « Nothing sent to servers » ; `src/utils/comparison.ts` pour le contrat commun.
- `src/pages/GuidePage.tsx` : conseil sous85% et FAQ.
- `src/pages/ReferenceArticlesPage.tsx` : « Five short, welcoming reads ».
- `src/components/export/ManaBlueprint.tsx` : contexte/export/EDH.

Ne pas modifier les formules pour augmenter les notes. Préserver calculs client-side, refus hors modèle, scoreDefinitions, colonnesCSV, flags sideboard/commander et liens `#d=`. API, backend, métagame, i18n et refonte graphique hors périmètre.

## Tests et preuves

1. Reproduire chaque résidu sur le candidat actuel, définir attendu/obtenu. Écrire des tests utiles pour les changements comportementaux (comparaison, arrondis/0%, zones EDH), sans tests tautologiques pour chaque mot corrigé.
2. Valider l’interface sur un nouveau candidat : routes modifiées, clair/sombre si disponible, clavier, dimension mobile réellement mesurée. Donner les URLs exactes ; demander la confirmation visuelle prévue par AGENTS lorsque le résultat est prêt, sans présenter son absence comme un test technique échoué. Si aucune réponse n’arrive, garder cette réserve distincte ; elle ne bloque pas artificiellement le commit/push explicitement demandé après validations techniques.
3. Tests ciblés, puis gate complet `build:vercel`. Rejouer les suites audit et persona Chromium sur ce même candidat. Aucune baisse d’exigence ou soft-fail. Les799tests historiques ne sont pas le résultat de ce lot.
4. Vérifier des builds compatibles distincts (20vs24Plains), identiques, et midrange non supporté ; distinction0%/indisponible, source du motif, arrondis. Vérifier EDH99+1 et export/partage si touchés.
5. Relecture indépendante des fichiers modifiés, inventaire des preuves compactes à versionner ; gros builds, traces, exports bruts et données personnelles exclus. Réserver les limites Firefox, juridique, appareils physiques et vrais participants comme telles.

### Commandes de référence

Depuis la racine, utiliser un Node compatible. Créer un dossier neuf et **créer le dossier math explicite** :

```sh
residual_evidence_dir="$(mktemp -d "$PWD/docs/engineering/reaudit-fixes-XXXXXXXX")"
mkdir -p "$residual_evidence_dir/math"
npm run lint
npm run type-check
```

Gate final (contrôler le code de sortie et le log) :

```sh
env -u SENTRY_AUTH_TOKEN -u SENTRY_ORG -u SENTRY_PROJECT VITE_SENTRY_DSN='' PRERENDER_DIST="$residual_evidence_dir/dist" DELIVERY_TEST_OUTPUT="$residual_evidence_dir/delivery" MANATUNER_MATH_EVIDENCE_DIR="$residual_evidence_dir/math" npm run build:vercel > "$residual_evidence_dir/gate.log" 2>&1
```

Après succès, mêmes sources et artefact :

```sh
PRERENDER_DIST="$residual_evidence_dir/dist" AUDIT_TEST_OUTPUT="$residual_evidence_dir/audit" npx playwright test --config=playwright.audit.config.js --project=chromium > "$residual_evidence_dir/audit.log" 2>&1
PRERENDER_DIST="$residual_evidence_dir/dist" PERSONA_TEST_OUTPUT="$residual_evidence_dir/persona" npx playwright test --config=playwright.persona.config.js --project=chromium > "$residual_evidence_dir/persona.log" 2>&1
```

Les configurations utilisent3000/3001 avec `reuseExistingServer:false`, et le gate4174/4175. Libérer seulement les serveurs appartenant à la campagne ; pour un service utilisateur, choisir une isolation adaptée sans le tuer. Ne pas utiliser un serveur existant pour contourner les contrôles. Maintenir un manifeste/identifiant du nouveau candidat. Conserver échecs et corrections, pas uniquement la dernière ligne verte.

## Commit et push après validation

- Actualiser journalR01–R07, HANDOFF/AGENTS/SESSION_NOTES et README si pertinent avant le commit ; conserver les états antérieurs comme historique.
- Vérifier origin, main local/distant et la divergence avec la branche de correctifs existante. Fetch autorisé. Préserver les modifications non commitées avant de passer sur main ; intégrer sans perte les commits pertinents existants par fast-forward ou intégration normale selon le graphe. Ne pas créer de nouvelle branche, ne pas forcer une bascule qui écraserait des fichiers. Lire les workflows et suivre le déploiement natif éventuellement déclenché par main. La désactivation propre à l’ancienne branche ne protège pas main et ne doit pas servir à promettre une absence de déploiement.
- Revoir les fichiers/hunks explicitement ; staging ciblé des corrections, tests, documents de mission/réaudit et preuves compactes. Vérifier `git diff --cached --check` et `git diff --cached --stat`.
- Vérifier que la branche de travail finale est bien `main`, puis créer un commit descriptif. Respecter les hooks ; pas de `--no-verify`. Si un hook change du code/du contenu servi, vérifier le candidat final ou démontrer une équivalence d’artefact selon le contrat. Les tests doivent rester rattachés au code réellement commité.
- Pousser normalement, sans force, uniquement sur `main`. En cas de non-fast-forward, inspecter et intégrer les changements distants sans perdre l’existant ; revalider ce qui est affecté. Si conflit d’intention non résoluble, le décrire plutôt que forcer.

```sh
git branch --show-current
git push origin main:main
git rev-parse HEAD
git ls-remote --heads origin refs/heads/main
```

**Succès du push = branche locale main, tous les correctifs attendus intégrés, SHA origin/main identique au SHA main local attendu.** Un push n’est pas une publication. Observer les checks distants déclenchés et rendre leur état réel ; ne pas annoncer un succès CI parce que le push a réussi. Si une authentification requiert une intervention utilisateur, expliquer le blocage précis, sans demander de secret dans le chat.

## Journal de cette mission, à maintenir

| ID  | Responsable       | État    | Reproduction                       | Changements                            | Tests/preuves                         | Réserves                 |
| --- | ----------------- | ------- | ---------------------------------- | -------------------------------------- | ------------------------------------- | ------------------------ |
| R01 | Éditorial         | Corrigé | Modes mélangés                     | Mathematics/Guide FAQ                  | Gate04 et personas finaux, voir FINAL | Modèles bornés           |
| R02 | Lead/éditorial    | Corrigé | Nothing sent to servers et Library | Stockage local, Privacy                | Parcours MyAnalyses/Library           | Juridique distinct       |
| R03 | Lead/QA           | Corrigé | Motifs répétés                     | Groupes, details clavier, action exact | 20/24, identiques, midrange, zéro     | Moteur inchangé          |
| R04 | Éditorial         | Corrigé | Conseil85% automatique             | Diagnostic contextualisé               | Relecture et parcours Guide           | Pas de garantie          |
| R05 | Lead/éditorial/QA | Corrigé | Five/7 et précision excessive      | Compteur dérivé, affichage arrondi     | Tests4/4, Compare                     | Données non arrondies    |
| R06 | Lead/QA           | Corrigé | EDH99 seul, CSV peu visible        | Blueprint99+1, recette CSV             | Exports réels, share                  | Paramètres non partagés  |
| R07 | Éditorial/lead    | Corrigé | Slogans/fixture ambiguës           | Contrats, fixture synthétique          | Relecture indépendante                | Pas de refonte marketing |

## Livrable final attendu

Bilan des lots réellement terminés, tests et captures, réserves, chemins des preuves, SHA du commit, branche et SHA distant confirmé, étatCI disponible. Distinguer correction locale vérifiée, commit/push réussi, confirmation visuelle utilisateur et production. Ne pas reprendre les moyennes persona comme preuve d’un nouveau score après ce lot sans nouveau protocole.
