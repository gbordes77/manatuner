# F12 — correction locale de l’information, 6 septembre 2026

État : implémentation locale et validation ciblée terminées ; intégration/browser et revue lead attendues. AC1–AC4 sont couverts techniquement ; AC5 reste ouvert faute de validation juridique compétente. Aucune certification de conformité ni contrôle des variables de production revendiqués.

Défaut initial : `before-static-pages.txt` et `before-privacy-settings.txt` conservent les sources HEAD avec absence générale de transmission et de collecte, omission des fournisseurs de polices, du stockage IndexedDB et du caractère conditionnel de Sentry. `red.log` montre 2 tests échouant avant correction : mentions de flux et statut de monitoring absents.

La politique détaille noms/identifiants transmis à Scryfall, images, Google Fonts/jsDelivr et métadonnées de connexion ; stockage local/session/IndexedDB, durées de fraîcheur7/30jours, limites de Reset (best effort, asynchrone, mémoire jusqu’au reload), partage et anciennes URL query. Elle affiche le statut Sentry selon la même condition que le code d’initialisation, puis les prérequis avant activation. Le dialogue Info renvoie à cette politique, retire les promesses absolues et précise les limites de Reset, y compris son message de résultat. Aucune fonction de sauvegarde/restauration/suppression ni configuration télémétrie modifiée. `.env.example` et commentaires source n’affirment plus offline total ou absence de toute implication juridique.

Inventaire durable et prérequis : `docs/privacy/DATA-FLOWS.md`. Home et Guide mis en cohérence par le lot editorial, relus ici : aucune promesse zéro transmission, mentions Scryfall/polices, lien de politique depuis Home. Badge About changé en Local calculations.

Validation ciblée : `green.log` 30 tests passants sur 3 fichiers (2 nouveaux contrats policy plus 28 tests de sauvegarde/import/suppression existants). `lint.log` : ESLint ciblé code0. `git diff --check` ciblé code0. `types.log` : TypeScript intégré code0 après résolution par editorial de son import node:fs. `tests/e2e/core-flows/privacy-audit.spec.js` ajouté pour le candidat sans DSN ; exécution par le lead.

La condition Sentry activé est testée par remplacement de variables Vitest sans importer main ni initialiser SDK, sans requête réelle. Pas d’activation, d’événement, ni de nouvelle dépendance réseau. V08 (événement réellement reçu), V09/F12-AC5 (qualification juridique), configuration déployée et pratiques de rétention externes non validées.

## Renfort F11 : contrastes détectés par le nouveau garde-fou

Après demande du lead, correction des quatre paires réelles Analyzer signalées par `../lot-html/browser-initial.log` : Karsten Math et chips de l’état vide Castability/Mulligan/Manabase. `contrast-pairs.json` consigne les rapports sRGB calculés des couleurs finales, tous supérieurs à4,5 (5,03à7,00). ESLint ciblé incluant AnalyzerPage code0. Les contrôles navigateur intégrés restent requis : le lot HTML relance axe serious/critical sans affaiblissement. Les couleurs très délavées Home du premier axe coïncidaient avec l’animation d’apparition ; le lot HTML attend maintenant polices et animations avant la mesure. Aucun changement Home effectué dans ce renfort.

Revue croisée F10 : helper85/70/55 cohérent QuickVerdict/history/Blueprint ; groupes sampleHands vérifiés dans moteur85/70/55 ; deckQuality80/65/50 distingué. Un résidu Guide «Your real chance...» signalé et corrigé par editorial. Pas de régression bloquante observée dans London/commander ni Home/Guide privacy.

Revue lead F12 intégrée : DSN ne garantit pas de transmission, car la CSP source ne permet actuellement aucun destinataire Sentry. La branche publique DSN dit désormais SDK configuré, réception non confirmée ; procédure documentaire de vérification CSP avant toute activation autorisée, sans modifier cette CSP. Tests ciblés30 passants de nouveau après correction.

## Revue indépendante E02 / V05 (code root)

Diff ManabaseFullTab : passage en colonne sur mobile, largeur complète des tabs et bouton de partage séparé. Cela supprime la compétition horizontale à360px, sans modifier les rôles ou la sélection des onglets. Test mobile vert vérifie les bornes du libellé complet et ouvre réellement le contenu.

Diff ManaBlueprint : minWidth720 sur le seul contenu exporté, conteneur de défilement nommé et focusable, instructions visibles sur petits écrans. L’outline global `*:focus` s’applique. Aucun blocage de clavier introduit repéré ; compléter par ArrowRight/scrollLeft si une preuve clavier explicite de cette nouvelle zone est exigée. Le test vérifie que le document ne déborde pas horizontalement et que le contenu capturé ne dépasse pas sa propre largeur.

PDF : les tranches de canvas couvrent les rangées source contiguës `[0,height)` sans omission ni chevauchement. La hauteur maximale277mm plus marges10mm tient sur A4. Même largeur190mm sur toutes les pages, dernière tranche à sa hauteur effective. Le PNG `exports-layout-green/.../blueprint.png` a été inspecté visuellement : en-tête, liste, score, matrice, statistiques, mains et pied présents ; image1440×2504. Le test final exige2 pages pour cette image et passe avec le contrôle JSON etPNG. Aucune régression bloquante repérée.

Limites de portée : la découpe est raster, pas une mise en page sémantique ; une ligne peut être séparée entre deux pages sans perdre ses pixels. PDF non balisé/sans texte sélectionnable préexistant, pas de certification d’accessibilité du document. Le test de nombre de pages ne prouve pas à lui seul le contenu de chacune. Limites de taille mémoire du canvas et erreurs export seulement console préexistantes ; non démontrées dans les fixtures testées. Les données variées, très longues et périphériques physiques restent hors preuve actuelle.
