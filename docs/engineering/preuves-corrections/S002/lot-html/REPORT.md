# S002 — F09 / F11, lot HTML et livraison

Code terminé localement ; aucun commit/push/déploiement par ce lot. Version finale intégrée et revue indépendante à consigner par le parent dans le bilan S002.

## Défauts établis et preuves rouges

- L'ancien `looksPrerendered` accepte un shell portant seulement la balise OG de l'accueil : nouveau test rouge avant correction, `red-unit.log`. La correction exige un h1 rendu : `green-unit.log`.
- `red-baseline-html.log` applique le contrat au build S001 existant sans le modifier : échec sur l'accueil non prérendu.
- Ancien script : soft-fail automatique Vercel, bibliothèque ignorée par défaut, HTML faible sauvegardé comme succès. Ancien routage : wildcard vers index.html. Ancienne a11y : critical seul et couleur CSS non vide.
- Premier candidat : 101 routes rendues, puis échec effectif du nouveau contrat sur six titres Saito identiques (`prerender.log`). Les subtitles distinguent désormais chaque partie dans le titre SEO.
- `browser-initial.log` : 12/16 passants, vrais contrastes serious détectés et deux parcours sample non couverts par la fixture Scryfall. `browser-round2.log` confirme correction des contrastes Home/Analyzer empty, mais conserve les deux échecs de fixtures. Les scans attendent désormais fin des animations finies et chargement des polices, avec reducedMotion. Les scans du résultat utilisent les métadonnées publiques fixes Mountain/Lightning Bolt.

## Corrections et résultats

- 101 routes entièrement prérendues, bibliothèque/article/auteur inclus ; plus aucun soft-fail ou skip.
- Métadonnées initiales gérées par Helmet ; exactement un titre, description, canonical et métadonnées sociales. Titres/descriptions uniques, canonical/OG propres à la route, assets locaux présents. `prerender-round2.log` et `strong-html.log` passent.
- `404.html` indépendant du JS, noindex, sans canonical accueil ; Vercel filesystem/cleanUrls sans wildcard, alias historiques préservés. Client NotFound noindex/h1.
- Snapshots : boutons/champs désactivés, remplacés par React au montage, pour éviter une saisie/clic perdus pendant le démarrage. Liens et contenu lisibles sans JS.
- Gate partagé CI/PR/Vercel : lint, types, régressions math incluses (preuves isolées), négatifs gate, build, budget, audit high, prérendu/HTML, Chromium candidat. Aucun chemin de publication supplémentaire.
- `gate-negative-positive.log` : chaque échec simulé arrête tous les contrôles ultérieurs, processus interrompu également bloquant, succès exactement dans l'ordre. Trois tests passent.
- `browser-round3.log` : **16/16 Chromium passent**, 18,7 s. Scans axe serious/critical accueil/analyseur vide/résultat, contraste footer, contrôle régression contraste réellement détecté, clavier réédition Enter/Espace/pointeur/tactile, HTTP initial accueil/analyseur/bibliothèque/article/auteur/privacy, 404 URL et asset, asset JS200/type, alias308, bibliothèque sans JS, accès direct analyseur avec query/hash et reload/chunks sans pageerror.
- Nightly ne tolère plus silencieusement les échecs, suites a11y et visual limitées explicitement au Chromium installé. Node22 partagé avec projet Vercel.

## Critères proposés à la revue

F09-AC1..AC5 : couverts localement par contrat artefact et tests HTTP/DOM ci-dessus. La politique Vercel suit documentation officielle ; HTTP réellement déployé n'est pas revendiqué.

F11-AC1 : preuve S001 conservée, rejouée dans gate. AC2 : vrais ratios rouges puis verts + fixture footer contrastée détectée. AC3 : commandes explicites Chromium. AC4 : même candidat checké dans build natif. AC5 : condition écrite dans `docs/engineering/DELIVERY-CONTRACT.md`, gate partagé bloquant, échecs contrôlés sans publication ; ajouter preuve read-only du point d'entrée Vercel et exécution complète finale avant clôture.

Les réglages privés GitHub/Vercel sont examinés par le parent ; aucune prétention de required checks GitHub, production ou conformité WCAG générale. La vérification d'un déploiement ultérieur reste distincte.

Confirmation read-only transmise par le parent : `../vercel-project-readonly.json` relève `buildCommand: null` (le projet suit donc `vercel.json`), framework Vite, Node22.x, branche native main et attribution automatique des domaines. `../github-ruleset.json` ne contient que suppression/non-fast-forward, pas de required checks. La condition F11 est assurée dans le build natif partagé, sans prétendre que GitHub bloque les pushes. L'exécution intégrée finale est `../verified-delivery.log` (en cours à la rédaction de ce lot).
