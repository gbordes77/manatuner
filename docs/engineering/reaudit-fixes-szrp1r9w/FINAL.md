# R01–R07 — bilan de correction et validation

Campagne du10septembre2026, base `251731694b2a0b6b74102a73d50e56fae8ce2750`. Destination autorisée exclusive : `origin/codex/persona-followup-2026-09-10`. Aucun main, merge, force-push ou déploiement. L'exclusion Vercel de cette branche demeure false.

## Corrections réalisées

- R01 : Mathematics, accordéons et FAQ distinguent Mana estimates par défaut, exact goldfish sous conditions, snapshot lands-only et mulligan heuristique.
- R02 : MyAnalyses et progression Library décrivent stockage local et requêtes externes, avec accès Privacy.
- R03 : Compare regroupe les motifs communs, expose les sorts concernés au clavier, conserve couverture et actions Analyzer/exemple exact. Cas compatibles20/24, identiques, midrange et zéro/indisponible testés séparément.
- R04 : résultat sous85% invite à vérifier mode/coût/tour/limites avant changement.
- R05 : compteur Library dérivé ; probabilités arrondies à une décimale, zéro explicite, delta nul=égalité et petits deltas signés. Précision persistée/exportée intacte.
- R06 : Blueprint affiche bibliothèque99 + commandant1 ; CSV visible dans les surfaces exports ; recette multi-tables Python vérifiée, flags et `#d=` inchangés.
- R07 : contradictions voisines supprimées ; fixture24Plains/36SavannahLions explicitement synthétique et non légale en tournoi.
- Vérification visuelle : fond global sombre rétabli, contrastes encadrés/badges/titres Mathematics/Guide/Library corrigés. Aucun calcul changé.

Relecture indépendante : [REVIEW.md](REVIEW.md). Commandes et isolation : [COMMANDS.md](COMMANDS.md). Le runtime local Node25.2.0 satisfait engines ; aucune prétention de run Node22 local.

## Validation finale

Candidat **dist-04**, mêmes sources et artefact pour tous les contrôles finaux :

| Contrôle                      | Résultat                                                                                     | Preuve                    |
| ----------------------------- | -------------------------------------------------------------------------------------------- | ------------------------- |
| Gate obligatoire              | PASS,801tests/79fichiers,3tests gate,lint/types,build,budget,audit high,101routes,16Chromium | gate-04.log               |
| Audit Chromium                | 33/33                                                                                        | audit-04.log              |
| Personas Chromium             | 23/23,1,4min                                                                                 | persona-04.log            |
| Comparaison ciblée            | 4/4, dont zéro/indisponible, petits deltas signés et raisons distinctes                      | targeted.log              |
| CSV téléchargés du candidat04 | bibliothèque60/24terrains et99/43terrains+1commandant+1réserve                               | csv-import.json           |
| Visuel/contraste              | 4routes×2largeurs×2thèmes, axe strict main et fond sombre mesuré ; Analyzer360/390/768/1440  | persona-04.log, captures/ |
| Préservation                  | 3rapports identiques SHA-256                                                                 | preservation-final.json   |

Total navigateur du candidat final : **72scénarios Chromium** (16+33+23). Aucun cumul des itérations antérieures. Captures MyAnalyses390sombre et Mathematics1440sombre inspectées par le lead ; page Mathematics candidate rechargée dans CUA. Revue indépendante source dans REVIEW.md. Les builds/traces/exports bruts restent locaux, hors commit.

## Échecs et itérations conservés

Gate01 et gate-final ont réussi mais précèdent la correction du thème sombre et la correction effective du texte CSV (un premier remplacement ne correspondait pas au texte formaté). Gate03 a réussi mais précède les dernières couleurs éditoriales. Ils ne sont pas la preuve du candidat final.

Persona initial :16pass/1timeout,8parcours dans un seul test30s. Réorganisation par route et largeur, même délai. Axe seul n'identifie pas le mauvais gradient clair : test réel image/fond/luminance ajouté, rouge sur l'ancien candidat (`background-red.log`). Persona03 :17pass/6échecs contraste ; les rapports indiquent les éléments et ratios. Diagnostics dev isolés conservés, non assimilés aux validations du candidat statique final.

## Limites et préservation

- Confirmation visuelle utilisateur demandée, en attente sauf réponse explicite. URLs du candidat : http://127.0.0.1:4311/mathematics, /guide, /library, /my-analyses et /analyzer?sample=exact.
- Firefox, appareils physiques, lecteurs d'écran, WCAG complet, revue juridique et participants réels restent hors des validations acquises. Les anciens tests WebKit/Firefox ne sont pas rejoués dans cette campagne.
- Audit dépendances : quatre avis moderate dev, aucun high/critical bloquant au gate ; aucune assertion ou seuil affaibli.
- Trois rapports utilisateur identiques à l'entrée par SHA-256 ; anciens worktrees, backups, rapports et fichiers personnels exclus du commit ciblé. Les ajouts documentaires pertinents du réaudit sont conservés.
- Pas de score persona simulé recalculé ni publication revendiquée. La CI principale ne se déclenche que sur main ; push branche dédiée ne constitue pas un succès CI.

## Identification et Git

Manifest SHA-256 sources/artefact : verified-manifest.json. Après hooks ESLint/Prettier : aucune source/config du manifest modifiée. Rebuild Vite indépendant : les 37 assets ont les mêmes noms et SHA-256 (posthook-equivalence.json). Les preuves restent rattachées au code exécutable commité. L'égalité SHA local/distant sera contrôlée après push normal autorisé.
