# Audit global post correctifs ManaTuner

Rapport de référence pour les corrections et les évolutions du site

Version documentaire 1.0 — 6 septembre 2026

**Destinataire :** propriétaire du projet et futurs intervenants produit, développement et qualité.
**Auteur :** Codex, à partir de l’audit technique et fonctionnel réalisé dans cette conversation.
**Verdict :** problèmes importants. Le niveau d’un excellent site de production n’est pas encore démontré.
**Référence du code :** `148d5f85ee26e60cdb10c6351031c89c03fd7ed0`, branche `main`.
**Site inspecté :** https://www.manatuner.app/

Ce document sert à transformer les constats en travaux vérifiables. Il décrit les comportements observés, leurs impacts, les emplacements du code, les corrections recommandées et les critères permettant de clôturer chaque problème. Il ne donne pas d’autorisation de modifier ou de déployer l’application. La demande ultérieure de l’utilisateur autorise uniquement la création de ce rapport et de sa version Word.

L’analyse a identifié une base technique sérieuse et des correctifs opérationnels, mais aussi des erreurs dans les populations analysées, les recommandations de couleurs, l’annulation, les imports et l’accès clavier. Les points non vérifiés restent explicitement ouverts. Le mot « exhaustif » désigne ici la restitution complète du périmètre audité, et non une certification de toutes les situations possibles.

## Guide de lecture et règles de traçabilité

Les sections 1 à 4 donnent le contexte et la matrice fonctionnelle. La section 5 contient le registre F01 à F13. Les sections 6 à 22 détaillent les domaines techniques et produit. Les sections 23 à 26 constituent le plan de remédiation et la décision de préparation à la production. Les annexes fournissent les preuves, les jeux d’entrée, le protocole de validation et le modèle de ticket.

Les identifiants F01 à F13 correspondent au rapport conversationnel initial. Ils sont stables : ne pas les réutiliser pour un autre sujet. Les critères Fxx-ACn sont des propositions de validation, **pas des tests déjà réussis**. Les améliorations E01 à E06 sont distinctes des défauts démontrés. Les vérifications V01 à V12 ne doivent pas être converties en succès par défaut.

**Niveaux de preuve :**

- **B — Navigateur public :** comportement observé sur le site pendant l’audit.
- **R — Reproduction en mémoire :** fonction du dépôt exécutée avec entrées contrôlées et, si nécessaire, stockage ou réseau simulé.
- **S — Statique :** lecture identifiable du code ou de la configuration ; pas nécessairement de panne injectée.
- **H — HTTP :** réponse du site obtenue directement, avant rendu JavaScript.
- **T — Tests :** résultat des tests exécutés pendant l’audit.
- **C — CI :** résultat d’un workflow existant consulté sans le déclencher.
- **NV — Non vérifié :** preuve insuffisante dans cet audit.

Les chemins de source sont relatifs à la racine `/Volumes/DataDisk/_Projects/Project Mana base V2`. Les numéros de ligne se rapportent au commit de référence. Après une correction, utiliser aussi le nom de fonction pour retrouver le code. Pour un lien immuable, utiliser `https://github.com/gbordes77/manatuner/blob/148d5f85ee26e60cdb10c6351031c89c03fd7ed0/` suivi du chemin et de `#L` suivi de la ligne.

## 1 Verdict global

**PROBLÈMES IMPORTANTS — aucun problème critique P0 démontré.**

ManaTuner est utilisable pour explorer une manabase, à condition de contrôler les cartes reconnues et les hypothèses de calcul. La fiabilité générale des synthèses, l’intégrité des parcours dégradés et l’accessibilité ne permettent pas encore de qualifier le produit d’excellent.

La gravité technique et la priorité sont distinctes. Un défaut P1 n’est pas automatiquement une vulnérabilité critique. P1 signifie qu’il faut le traiter avant une communication de fiabilisation générale ; P2 concerne une robustesse ou une qualité de production importante ; P3 concerne l’amélioration progressive.

## 2 Résumé exécutif

**Peut-on faire confiance à la version actuelle ? Avec des réserves importantes.** Le produit possède des fondations et des résultats valides, mais ses recommandations ne doivent pas être considérées comme systématiquement fiables sans vérification du deck interprété.

Les contrôles exécutés ont donné 625 tests passants dans 62 fichiers, un contrôle TypeScript passant et un lint passant. La CI du commit courant est verte. Le parcours exemple, analyse, sauvegarde, restauration et rechargement fonctionne. Un cas simple du mode exact donne 98 %, conformément à un résultat indépendant de 97,84 %. Le worker de mulligan termine son calcul sur le cas testé. Les principaux en-têtes de sécurité sont présents et les avis npm interrogés n’ont signalé aucune vulnérabilité pour les versions du lockfile.

Les réserves sont concrètes : une saisie sans cartes reconnues produit une analyse de zéro carte ; Maybeboard et certains préfixes SB sont mal interprétés ; les coûts hybrides et le sideboard perturbent les recommandations de couleurs ; Clear ne neutralise pas une analyse active ; un import invalide peut casser l’historique ; Edit Deck n’est pas utilisable au clavier. Le HTML initial de plusieurs routes publiques est identique à celui de l’accueil.

**État du dépôt avant l’audit :** modifications de `playwright-report/index.html`, `test-results.json` et `test-results/.last-run.json` ; éléments non suivis `.claude/worktrees/`, `.mcp.json.bak.20260801-140417`, `.playwright-mcp/` et `docs/handoff/PROMPT-REPRISE-MANATUNER.txt`. Le statut final de l’audit présentait les mêmes entrées. Aucun de ces éléments n’a été corrigé, nettoyé ou supprimé. Les documents de cette livraison sont ajoutés après l’audit, sur demande explicite.

**Limite de rattachement à la production :** le fichier principal public `index-Dyq_TViQ.js` porte le même nom que celui du dist local existant et du build CI consulté. Cette concordance est un indice fort, pas une preuve cryptographique du commit complet déployé. Aucun build local n’a été exécuté pour renouveler cet artefact.

## 3 Architecture et cartographie

### 3.1 Stack et responsabilités

| Couche | Technologie et emplacement | Responsabilité |
|---|---|---|
| Démarrage | React 18, `src/main.tsx` | Initialisation, providers, persistance, Sentry conditionnel |
| Routage | React Router, `src/App.tsx` | Routes, chargement différé, fallback et page absente |
| Interface | Material UI 5, Emotion, `src/theme`, `src/styles` | Design, composants, responsive et thèmes |
| État | Redux Toolkit, `src/store` | Deck, nom, résultat, onglet, notifications |
| Paramètres | `src/contexts/AccelerationContext.tsx` | Format, ramp, survie et préférences de calcul |
| Parsing | `deckParser.ts`, `deckAnalyzer.ts`, `scryfall.ts` | Normalisation, quantités et sections |
| Résolution | `cardResolver.ts`, `scryfall.ts`, `landService.ts` | Scryfall, métadonnées et classification des terrains |
| Calcul | `src/services/castability`, `paymentPolicy`, mulligan | Probabilités, estimations et politique de décision |
| Workers | `src/workers` | Mulligan et politique de paiement hors du fil principal |
| Stockage | `src/lib/privacy.ts`, Redux Persist, caches | Historique, reprise, préférences et données publiques |
| Export | `src/components/export/ManaBlueprint.tsx` | PNG, PDF et JSON |
| Contenu | `src/data/articlesReferenceSeed.ts`, pages Library | Bibliothèque, parcours et références |
| Livraison | Vite, Vercel, `.github/workflows` | Build, contrôles, hébergement et prérendu prévu |

Aucun backend applicatif, compte utilisateur ou base serveur métier n’a été identifié. Les requêtes POST vers Scryfall sont des lectures de collections de cartes. Aucun endpoint métier d’écriture serveur n’a été établi.

### 3.2 Routes et fonctions

| Route | Fonction | Chargement et éléments associés |
|---|---|---|
| `/` | Accueil et entrée dans le produit | HomePage chargée immédiatement |
| `/analyzer` | Saisie, analyse, modes, sauvegarde, export | AnalyzerPage et onglets différés |
| `/my-analyses` | Historique, recherche, comparaison, restauration | PrivacyStorage |
| `/guide` | Utilisation et onboarding éditorial | GuidePage |
| `/mathematics` | Explications et références mathématiques | MathematicsPage |
| `/land-glossary` | Types de terrains et terminologie | LandGlossaryPage |
| `/library` | Recherche et parcours de lecture | ReferenceArticlesPage |
| `/library/:slug` | Fiche de référence | ArticleDetailPage |
| `/library/author/:slug` | Index par auteur | AuthorPage |
| `/about`, `/privacy` | Présentation et confidentialité | StaticPages |
| `/mes-analyses`, `/reading-list` | Alias historiques | Redirection client |
| Toute autre route | Page introuvable | React affiche une 404 ; statut HTTP 200 observé |

### 3.3 Flux de données

Le texte saisi est conservé localement dans l’éditeur puis transmis au store avec un debounce de 300 ms. Le clic Analyze transmet la valeur locale immédiatement afin de ne pas calculer une ancienne version. Le service extrait les noms, précharge Scryfall et les métadonnées des terrains, construit les DeckCard, exclut le sideboard et la zone de commandement pour certains calculs, puis produit les statistiques et les synthèses. Les cartes importées restent disponibles pour les autres vues, ce qui impose à chaque consommateur de choisir explicitement sa population.

Le résultat est affiché puis sauvegardé automatiquement dans un historique séparé. Redux Persist conserve un état allégé sans le résultat lourd ; le rechargement doit donc restaurer le deck et permettre de recalculer. Les paramètres d’accélération disposent de leur propre stockage.

### 3.4 Décisions de conception à préserver

Le calcul local, l’absence de compte obligatoire, les résultats non disponibles quand le moteur exact ne supporte pas une mécanique, les workers pour les simulations, les caches bornés et les métadonnées de modèle sont des choix utiles. Les corrections proposées ne nécessitent ni une migration générale vers un backend, ni une réécriture du frontend.

## 4 Matrice fonctionnelle de référence

OK signifie « vérifié pour ce scénario », pas « fonctionnalité certifiée dans tous les cas ». Les decks synthétiques servent à isoler un calcul ; leur légalité en tournoi n’est pas présumée.

| ID | Fonction et scénario | Attendu | Obtenu et preuve | Statut |
|---|---|---|---|---|
| M01 | Accueil et premier démarrage | Rôle et CTA clairs | Saisie et exemple visibles, B | OK |
| M02 | Exemple puis analyse | Deck reconnu et résultats | 60 cartes, 23 terrains, B | OK |
| M03 | Champ vide | Pas de lancement | Bouton désactivé, B | OK |
| M04 | Texte non interprétable | Erreur de format | Analyse zéro carte, B/R, F01 | ÉCHEC |
| M05 | Quantité un million | Refus avant allocation | Parseur accepte, R, F01 | ÉCHEC |
| M06 | Section Maybeboard | Cartes exclues | Ajout au principal, R, F02 | ÉCHEC |
| M07 | SB inline puis principal | Préfixe limité à sa ligne | Lignes suivantes en sideboard, R, F02 | ÉCHEC |
| M08 | Coût hybride payable en vert | Pas de besoin rouge obligatoire | Déficit rouge, R, F03 | ÉCHEC |
| M09 | Sort bleu dans sideboard rouge | Principal inchangé | Cible bleue ajoutée, R, F04 | ÉCHEC |
| M10 | Clear pendant analyse | Fin durable du travail | Résultats réapparus, B, F05 | ÉCHEC |
| M11 | Exact avec 24 Plains | 97,84 % arrondi | 98 % pour Savannah Lions, B/R | OK |
| M12 | Mulligan sur cas simple | Simulation aboutie | Score et seuils visibles, B | OK |
| M13 | Sauvegarde automatique | Entrée historique | Exemple présent, B | OK |
| M14 | Restauration de l’historique | Nom et texte récupérés | Éditeur renseigné, B | OK |
| M15 | Recharger après restauration | Deck récupérable | Texte conservé, B | OK |
| M16 | Import de résultat mal typé | Refus ou réparation | Acceptation puis TypeError, R, F06 | ÉCHEC |
| M17 | Réédition au clavier | Tab puis activation | Contrôle non focalisable, B/S, F07 | ÉCHEC |
| M18 | Menu mobile puis restauration | Parcours utilisable | Réalisé à 360 px, B | OK |
| M19 | Recherche Karsten | Filtrage pertinent | 6 sur 65, B | OK |
| M20 | URL inexistante | HTTP 404 | HTTP 200, H, F09 | ÉCHEC |
| M21 | Partage encodage et décodage | Aller-retour du deck | Unitaires passent ; parcours complet non exécuté, T | PARTIEL |
| M22 | Échanges post-board | Population et résultats cohérents | Lecture du code et couverture existante, S/T | PARTIEL |
| M23 | Export PNG PDF JSON | Fichier fidèle | Code seulement ; aucun export généré, S | NON VÉRIFIÉ |
| M24 | Panne réseau globale | Erreur puis reprise | Réponses simulées et lecture, R/S | PARTIEL |
| M25 | Comparaison de deux analyses | Valeurs comparables | Code inspecté, S | NON VÉRIFIÉ |
| M26 | Double clic et clics rapides | Une génération active | Bouton nominal désactivé ; campagne de concurrence non complète | PARTIEL |
| M27 | Retour arrière et lien direct partagé | État cohérent | Routage et codecs inspectés ; tous les enchaînements non joués | PARTIEL |
| M28 | Deck incomplet ou sans terrain | Diagnostic explicite | Contrats non validés exhaustivement en UI | NON VÉRIFIÉ |

## 5 Registre détaillé des défauts

### F01 Validation du deck sur le mauvais chemin de parsing

**Sévérité et priorité :** ÉLEVÉ, P1. **Preuves :** B/R/S/T, EVD-03. **Statut :** ouvert, reproduit.

**Localisation :** `src/services/deckAnalyzer.ts:602`, `parseDeckList` ; ligne 1038, `assertCardResolution` ; ligne 1214, développement des terrains en copies physiques. Tests associés : `src/services/__tests__/parseDecklist.t10.test.ts`.

**Problème et comportement actuel :** le chemin de l’interface accepte une quantité positive sans borne métier, et l’absence de carte interprétée ne déclenche pas de rejet. Les tests T10 des quantités portent sur `parseDecklistText`, pas sur ce chemin. Les deux contrats peuvent donc diverger avec des tests verts.

**Reproduction A :** saisir `nonsense without quantities` dans l’éditeur puis Analyze. Le site affiche zéro carte, zéro terrain, un Health Score de zéro et des conseils Limited. **Reproduction B :** appeler le parseur réel avec `1000000 Forest` en environnement mémoire. La quantité retournée est 1000000. Le calcul lourd n’a pas été lancé pour cette entrée.

**Attendu :** une saisie non interprétable doit rester dans l’éditeur avec un message utile ; une quantité et une taille totales excessives doivent être refusées avant réseau et allocation. Un deck expérimental incomplet doit être distingué d’un texte invalide, sans supposer qu’un minimum de tournoi s’applique à tous les usages.

**Impact :** faux succès, historique pollué et risque de ressources excessives côté client. Un gel ou une exploitation distante n’a pas été démontré. La limite de 20 000 caractères de l’éditeur ne borne pas une quantité numérique courte.

**Cause probable :** validateurs multiples, garde `quantity > 0`, et retour immédiat sans erreur lorsque `cards.length === 0`.

**Correction recommandée :** choisir un parseur canonique et une validation commune à la saisie, au partage et à la restauration. Valider les nombres sûrs, les quantités, le total et les lignes non interprétées. Définir explicitement les limites produit au lieu de recopier arbitrairement la limite 99 d’un ancien helper.

**Fichiers concernés :** `deckAnalyzer.ts`, `deckParser.ts`, `scryfall.ts`, `DeckInputSection.tsx`, codecs/imports si leurs entrées contournent le formulaire.

**Critères d’acceptation :**
- F01-AC1 : aucune analyse ni sauvegarde n’est produite si aucune carte n’a été interprétée.
- F01-AC2 : une quantité excessive est refusée avant la résolution Scryfall et les tableaux de copies.
- F01-AC3 : la même entrée reçoit la même validation via saisie, lien partagé et restauration.
- F01-AC4 : les decks 40, 60, 99 et 100 cartes valides ainsi que les quantités de basics admises restent acceptés.
- F01-AC5 : une ligne ignorée est signalée avec son numéro ou sa cause, sans inventer de carte.

**Tests nécessaires :** tests du point d’entrée `analyzeDeck`, limites numériques et de taille, absence de réseau en cas d’échec, fixture UI invalide. **Effort :** moyen. **Risque :** rejet d’exports auparavant tolérés. **Bénéfice :** contrat d’entrée fiable. **Dépendances :** coordonner F02 avant recalibration des scores.

### F02 Sections de deck incorrectement interprétées

**Sévérité et priorité :** ÉLEVÉ, P1. **Preuves :** R/S, EVD-04. **Statut :** ouvert, reproduit.

**Localisation :** `src/services/deckAnalyzer.ts:550` et `:575`, `parseDeckList` ; `src/services/deckParser.ts`, `detectSideboardStartLine`.

**Problème et comportement actuel :** les en-têtes Maybeboard et Companion sont sautés sans définir un état d’exclusion ; l’index global calculé pour une ligne SB peut classer toutes les lignes suivantes en sideboard. Un en-tête Deck/Main ne remet pas systématiquement toutes les dimensions de section à leur état attendu.

**Reproduction A :** `24 Forest`, `36 Island`, `Maybeboard`, `4 Mountain`, chacun sur sa ligne. Le parseur marque les Mountain comme principales. **Reproduction B :** `SB: 1 Mountain`, `24 Forest`, `36 Island`. Les trois entrées deviennent sideboard.

**Attendu :** préserver la signification des sections ; traiter le préfixe SB comme une portée locale ; gérer explicitement les transitions vers le principal. Le traitement exact de Companion et des exports particuliers doit être documenté par format.

**Impact :** nombre de cartes, terrains, couleurs, probabilités et historique peuvent porter sur une population différente de celle voulue par le joueur. C’est une erreur en amont, susceptible de contaminer plusieurs résultats pourtant mathématiquement corrects pour leurs mauvaises entrées.

**Cause probable :** mélange d’heuristiques de lignes blanches, d’un index de départ global et de booléens incomplets.

**Correction recommandée :** état de section explicite avec transitions déterministes. Préserver les sections dans la représentation parsée, puis sélectionner la population pour chaque usage. N’utiliser une heuristique implicite qu’en l’absence de marqueurs et exposer les cas ambigus.

**Fichiers concernés :** `deckParser.ts`, `deckAnalyzer.ts`, tests de sideboard et de deck split.

**Critères d’acceptation :**
- F02-AC1 : les cartes Maybeboard n’entrent pas dans le principal.
- F02-AC2 : une ligne SB inline n’affecte aucune ligne principale ultérieure.
- F02-AC3 : les transitions Sideboard vers Deck et Commander vers Deck sont couvertes.
- F02-AC4 : les exports catégorisés avec lignes blanches ne sont pas artificiellement divisés.
- F02-AC5 : les totaux principal, command zone et sideboard sont séparément vérifiables.

**Tests nécessaires :** fixtures Arena/Moxfield et formats supportés, permutations de sections, section vide, préfixes intercalés, tailles canoniques. **Effort :** moyen. **Risque :** régression de l’heuristique historique. **Bénéfice :** exactitude des populations. **Dépendances :** F01 ; validation de F04 et des échanges post-board après correction.

### F03 Coûts hybrides et recommandations de couleurs

**Sévérité et priorité :** ÉLEVÉ, P1. **Preuves :** R/B/S, EVD-05. **Statut :** ouvert, reproduit pour les cibles ; incohérence visible sur l’exemple.

**Localisation :** `src/utils/manaCostParser.ts:13`, `countPipsInCost` ; `src/components/analyzer/karstenDeltas.ts:60`, `computeColorDeltas` ; `src/services/deckAnalyzer.ts:1132` et `:1145`, besoins et score d’accès.

**Problème et comportement actuel :** la présence d’une couleur dans une alternative hybride est utilisée comme obligation indépendante. Pour un coût `{1}{R/G}`, 24 sources vertes et zéro rouge, `computeColorDeltas` exige 13 sources rouges et indique un déficit de 13, malgré le paiement possible en vert.

**Reproduction :** calculer les deltas d’un résultat de 60 cartes contenant une ligne de sort `{1}{R/G}` avec `colorDistribution.G = 24` et `R = 0`. Observer la ligne rouge `required: 13`, `actual: 0`, `verdict: short`. L’exemple public incluant Spider Manifestation est également qualifié de tricolore ; ne pas confondre identité couleur et besoin de paiement.

**Attendu :** une alternative ne doit pas devenir deux obligations simultanées. Les couleurs de l’identité et celles indispensables pour payer doivent être présentées comme des notions distinctes.

**Impact :** score pénalisé et recommandations de modification de la manabase injustifiées. La ligne de probabilité du moteur peut être correcte alors que le résumé conseille une mauvaise correction.

**Cause probable :** helper de comptage de présence de pips utilisé dans des calculs qui supposent des exigences fixes.

**Correction recommandée :** introduire une représentation commune des alternatives de paiement ; définir un contrat de synthèse compatible. Si une cible Karsten ne peut pas être résumée honnêtement par couleur, la présenter comme approximation ou comme non disponible plutôt que comme obligation.

**Fichiers concernés :** parseurs de mana, deltas Karsten, synthèse de couleurs, QuickVerdict et recommandations.

**Critères d’acceptation :**
- F03-AC1 : `{1}{R/G}` entièrement soutenu par du vert n’affiche pas un déficit rouge obligatoire.
- F03-AC2 : `{R}{G}` conserve deux exigences distinctes.
- F03-AC3 : les hybrides répétés ne sont pas payés deux fois par la même source physique dans le modèle exact.
- F03-AC4 : score, badge, liste de recommandations et détail utilisent une sémantique cohérente.
- F03-AC5 : les coûts phyrexians et autres alternatives non représentées restent explicitement limités.

**Tests nécessaires :** alternatives monocolores, sources mixtes, contraste hybride/multicolore strict, contrôle de tous les consommateurs du score. **Effort :** moyen. **Risque :** variation des scores et de leur interprétation. **Bénéfice :** recommandations utiles au joueur. **Dépendances :** F01/F02 pour les entrées ; F10 pour les textes.

### F04 Sideboard inclus dans les cibles du principal

**Sévérité et priorité :** ÉLEVÉ, P1. **Preuves :** R/S, EVD-06. **Statut :** ouvert, reproduit.

**Localisation :** `src/components/analyzer/karstenDeltas.ts:49`, filtre de `computeColorDeltas`.

**Problème et comportement actuel :** le filtre conserve toutes les cartes non-terrains, sans exclure `isSideboard`. Le tableau de cartes importées contient pourtant ces cartes alors que le nombre total et les sources utilisés peuvent représenter le principal.

**Reproduction :** résultat contenant Lightning Bolt dans le principal et Counterspell avec `isSideboard: true`, total principal 60, sources rouges 24 et bleues zéro. Le calcul ajoute une cible de 21 sources bleues et un verdict court.

**Attendu :** le diagnostic principal ne change pas quand on ajoute un sort de sideboard hors de sa population. Le diagnostic post-board doit changer uniquement après sélection et application des échanges.

**Impact :** faux badge de couleur insuffisante et conseil de modifier inutilement la manabase principale.

**Cause probable :** contrat de population implicite entre AnalysisResult et la fonction de recommandation.

**Correction recommandée :** transmettre explicitement les cartes et sources du périmètre à évaluer. Conserver séparément la prise en compte du commandant lorsqu’elle est pertinente pour le diagnostic.

**Fichiers concernés :** `karstenDeltas.ts`, AnalyzerPage, affichage des cibles, intégration du post-board.

**Critères d’acceptation :**
- F04-AC1 : ajouter Counterspell au sideboard seul ne change pas les cibles du principal.
- F04-AC2 : son entrée effective en post-board déclenche l’évaluation correspondante.
- F04-AC3 : le nombre de cartes et les sources sont ceux de la même population que les sorts.
- F04-AC4 : un commandant explicitement identifié reste traité selon un contrat documenté.

**Tests nécessaires :** principal rouge/sideboard bleu, échanges aller-retour, commandant, sideboard contenant un terrain. **Effort :** faible. **Risque :** exclusion abusive de la command zone. **Bénéfice :** cohérence du verdict. **Dépendances :** F02.

### F05 Clear laisse revenir une analyse active

**Sévérité et priorité :** ÉLEVÉ, P1. **Preuves :** B/S, EVD-07. **Statut :** ouvert, reproduit publiquement.

**Localisation :** `src/pages/AnalyzerPage.tsx:346`, `handleClear` ; `handleAnalyze` et sauvegarde automatique ; `src/store/slices/analyzerSlice.ts`, `clearAnalyzer`.

**Problème et comportement actuel :** Clear efface l’état visible sans invalider le travail asynchrone en cours. Le contrôleur est utilisé pour remplacer une analyse par une autre, pas pour l’effacement.

**Reproduction :** saisir `24 Plains\n36 Silvercoat Lion`, cliquer Analyze puis Clear avant la résolution. Le toast annonce « Interface cleared. Ready for a new deck analysis. » mais le chargement continue. Les résultats réapparaissent ensuite : 60 cartes, 24 terrains, Health Score 99 %. La chaîne de succès contient aussi une sauvegarde automatique ; son absence après annulation doit être testée explicitement.

**Attendu :** après Clear, ni résultat tardif ni sauvegarde de cette génération. Une navigation hors de l’analyseur doit également disposer d’une politique explicite d’annulation.

**Impact :** interface contradictoire, impossibilité de terminer proprement le parcours et risque d’associer visuellement une saisie à un ancien résultat.

**Cause probable :** absence d’abort dans `handleClear` et de garde de génération appliquée à toutes les mutations finales.

**Correction recommandée :** une génération propriétaire du résultat, invalidée par Clear et démontage. Ne publier ni sauvegarder un résultat qui n’appartient plus à la génération active. Remettre le chargement dans un état cohérent.

**Fichiers concernés :** AnalyzerPage, reducer d’analyse, éventuellement contrat d’annulation du service.

**Critères d’acceptation :**
- F05-AC1 : Clear pendant résolution conserve l’éditeur vide même après la réponse réseau.
- F05-AC2 : aucun enregistrement historique n’est ajouté par la génération annulée.
- F05-AC3 : une analyse B lancée après A ne peut pas être remplacée par A.
- F05-AC4 : les notifications et états de chargement ne sont pas modifiés par une génération obsolète.
- F05-AC5 : quitter puis revenir à la route n’introduit pas de résultat fantôme.

**Tests nécessaires :** promesses contrôlées pour inverser l’ordre des réponses ; un E2E Chromium ciblé avec réponse retardée. **Effort :** faible à moyen. **Risque :** chargement bloqué si la terminaison n’a plus de propriétaire. **Bénéfice :** actions utilisateur fiables. **Dépendances :** F08 pour arrêter aussi le coût réseau ; l’UI doit être protégée même si un appel ne peut pas être annulé.

### F06 Import et historique non validés complètement

**Sévérité et priorité :** ÉLEVÉ, P1. **Preuves :** R/S, EVD-08. **Statut :** ouvert, reproduction en mémoire.

**Localisation :** `src/lib/privacy.ts:28`, `analysisRecordSchema` ; `:108`, `getMyAnalyses` ; `:270`, `importAnalyses` ; `src/pages/MyAnalysesPage.tsx:374`, formatage de la moyenne.

**Problème et comportement actuel :** l’import valide l’enveloppe mais accepte `analysis` comme valeur inconnue. La lecture du stockage accepte n’importe quel tableau JSON. Une assertion de type ne protège pas le rendu.

**Reproduction A :** importer un tableau contenant `{id:"audit", deckName:"Bad", deckList:"24 Forest", timestamp:0, analysis:{averageCMC:"oops"}}` dans un stockage mémoire. L’import passe. L’opération utilisée au rendu `averageCMC?.toFixed(2)` déclenche une TypeError. **Reproduction B :** la valeur `[null]` de `manatuner_analyses` est retournée sans filtrage.

**Attendu :** refus avant modification du stockage, migration ou mise à l’écart des enregistrements incorrects. L’utilisateur doit pouvoir récupérer ses decks valides et les textes bruts des sauvegardes anciennes.

**Impact :** historique susceptible de ne plus s’afficher après import ou corruption locale. Le crash complet du navigateur public après import n’a pas été provoqué ; le chemin fautif et l’exception au point d’utilisation sont démontrés.

**Cause probable :** enveloppe Zod permissive et confiance dans des assertions TypeScript.

**Correction recommandée :** format versionné, validation des champs réellement consommés, tolérance contrôlée aux anciennes versions et gestion des erreurs par enregistrement. Définir explicitement le comportement d’import fusion/remplacement et le plafonnement ; l’implémentation actuelle remplace les analyses persistées. Le mécanisme de quota peut réduire l’historique sans détailler les pertes ; prévoir un résultat d’opération informatif.

**Fichiers concernés :** privacy.ts, MyAnalysesPage, PrivacySettings et tests d’import/migration/quota.

**Critères d’acceptation :**
- F06-AC1 : les deux charges ci-dessus ne cassent aucun écran.
- F06-AC2 : un import refusé laisse l’historique précédent inchangé.
- F06-AC3 : une version ancienne reconnue est migrée ou restaurable en deck brut.
- F06-AC4 : une seule entrée incorrecte ne rend pas les entrées valides inaccessibles.
- F06-AC5 : quota, données rejetées et remplacement éventuel sont clairement signalés.

**Tests nécessaires :** JSON malformé, null, mauvais types, résultat absent, tailles excessives, versions anciennes, quota et lecture interdite. **Effort :** moyen. **Risque :** perte de compatibilité ou suppression involontaire ; interdire une purge générale comme réparation automatique. **Bénéfice :** conservation des données utilisateur. **Dépendances :** F01 pour la restauration du texte, sans imposer que tout ancien résultat ait exactement le schéma courant.

### F07 Réédition inaccessible au clavier

**Sévérité et priorité :** ÉLEVÉ, P1. **Preuves :** B/S, EVD-09. **Statut :** ouvert, confirmé dans le DOM public.

**Localisation :** `src/pages/AnalyzerPage.tsx:549`, barre compacte ; `:570`, `onClick` ; `:604`, Chip Edit Deck.

**Problème et comportement actuel :** le seul contrôle visible de réouverture après minimisation est un ensemble span/div cliquable. Aucun bouton natif, rôle clavier ni tabIndex permettant l’accès n’est présent.

**Reproduction :** analyser un deck, laisser la barre compacte s’afficher, rechercher Edit Deck au clavier. L’inspection DOM du libellé et de ses parents retourne des éléments non focalisables, `tabIndex: -1`. La source ne définit qu’un onClick sur Paper.

**Attendu :** Tab atteint une commande nommée, Entrée et Espace ouvrent l’éditeur ; le focus est visible et retrouve une position utile.

**Impact :** parcours essentiel indisponible au clavier ; critère WCAG 2.1.1 concerné. Un utilisateur ne doit pas devoir recharger la page pour contourner ce blocage.

**Cause probable :** sémantique visuelle substituée à la sémantique interactive.

**Correction recommandée :** bouton natif ou composant accessible adapté ; éviter les contrôles imbriqués. Établir le focus de sortie et de retour et conserver la surface tactile utile.

**Fichiers concernés :** AnalyzerPage et autres états réduits de DeckInputSection.

**Critères d’acceptation :**
- F07-AC1 : réédition complète avec Tab, Entrée et Espace.
- F07-AC2 : nom accessible explicite, focus visible, état ouvert/fermé compréhensible.
- F07-AC3 : le champ de deck est atteignable après l’ouverture sans perte de contenu.
- F07-AC4 : comportement identique au pointeur et absence de double activation.

**Tests nécessaires :** test de composant orienté rôles et clavier, E2E du parcours analyse puis réédition, contrôle lecteur d’écran. **Effort :** faible. **Risque :** faible. **Bénéfice :** accès à la fonction pour tous. **Dépendances :** indépendant ; F11 doit empêcher une nouvelle régression.

### F08 Annulation réseau et durée globale incomplètes

**Sévérité et priorité :** MOYEN, P2. **Preuves :** R/S, EVD-10. **Statut :** ouvert, deux cas reproduits.

**Localisation :** `src/services/http.ts:83`, vérification initiale ; `:113`, retrait du timeout ; `:118`, retry ; `src/services/cardResolver.ts:27` et `src/services/deckAnalyzer.ts:1100`, résolution sans propagation du signal.

**Problème et comportement actuel :** le signal de l’analyse n’est pas transmis à l’ensemble de la résolution. Une annulation durant Retry-After n’est pas revérifiée au début de la tentative suivante. La minuterie du fetch est retirée à la réception des en-têtes, avant la lecture JSON effectuée ailleurs.

**Reproduction A :** réseau simulé qui annule le contrôleur à la première collection ; plusieurs appels supplémentaires partent avant AnalysisCancelledError. **Reproduction B :** réponse 429, Retry-After 0,02 seconde, annulation à 5 ms ; une deuxième tentative renvoie 200 et le helper résout malgré le signal annulé. Ce test isole le contrat ; il ne mesure pas Scryfall en production.

**Attendu :** aucune tentative supplémentaire après annulation, temporisation annulable et durée totale maîtrisée, y compris corps de réponse et fallback.

**Impact :** requêtes inutiles, attente prolongée et chargement persistant en réseau dégradé. La borne 8 s par fetch ne constitue pas une borne de l’analyse complète.

**Cause probable :** signatures de résolveur sans signal, garde uniquement avant la boucle, sleep non annulable et contrôle du timeout trop local.

**Correction recommandée :** propager un contexte d’opération, vérifier chaque phase, rendre l’attente annulable, borner la résolution complète. Respecter Retry-After tout en permettant d’abandonner l’opération ; ne pas remplacer ce défaut par des retries agressifs.

**Fichiers concernés :** http.ts, cardResolver.ts, scryfall.ts, landService.ts, deckAnalyzer.ts ; useCardImage pour harmoniser le timeout des images.

**Critères d’acceptation :**
- F08-AC1 : annulation durant Retry-After rejette avec une erreur d’annulation sans second fetch.
- F08-AC2 : le même signal atteint les collections, fallbacks et lectures de corps.
- F08-AC3 : un corps qui ne se termine pas n’immobilise pas indéfiniment l’analyse.
- F08-AC4 : le retry respecte la politique 429/5xx et le budget global documenté.
- F08-AC5 : annulation, 404 définitif et indisponibilité transitoire restent distingués.

**Tests nécessaires :** horloge simulée, fetch contrôlé, abort avant/pendant chaque phase, corps lent et reprise utilisateur. **Effort :** moyen. **Risque :** transformer une annulation en message d’erreur inutile. **Bénéfice :** maîtrise du réseau. **Dépendances :** F05 reste nécessaire même avec un réseau correctement annulé.

### F09 HTML initial générique et soft 404

**Sévérité et priorité :** MOYEN, P2. **Preuves :** H/S, EVD-11. **Statut :** ouvert ; symptôme confirmé, cause exacte du déploiement à confirmer.

**Localisation :** `vercel.json:5`, rewrites ; `scripts/prerender.mjs:37`, SOFT_FAIL et :42, SKIP_LIBRARY ; `src/App.tsx:106`, NotFoundPage ; `index.html:32`, canonical initiale.

**Problème et comportement actuel :** les GET sur `/`, `/analyzer`, `/library`, `/privacy` et `/audit-nonexistent-20260906` renvoient un HTML de 12 452 octets, même titre initial, canonical vers `/`, aucun h1 et statut 200. Le contenu racine est un chargement. React met ensuite à jour les pages et certaines métadonnées.

**Attendu :** réponses et métadonnées correspondant aux routes publiques ; page inexistante identifiable par son statut et son contenu.

**Reproduction :** obtenir les réponses HTTP sans JavaScript, relever statut, titre, canonical et h1 ; comparer avec le DOM après chargement. Ne pas confondre le rendu client correct avec le contenu livré initialement.

**Impact :** indexation et aperçus dépendant du rendu JavaScript, diagnostics SEO ambigus et soft 404. Cela ne démontre pas que Google ne peut pas indexer le site.

**Cause probable :** prérendu pouvant échouer sans bloquer sur Vercel, bibliothèque exclue par défaut et routage générique. Sans logs Vercel ni inventaire de l’artefact déployé, ne pas attribuer le symptôme à une seule de ces causes.

**Correction recommandée :** vérifier d’abord l’artefact et les règles de service ; choisir les routes à rendre statiquement ; contrôler le contrat HTML dans le pipeline réellement publié ; établir la gestion des pages absentes et des métadonnées sociales.

**Fichiers concernés :** vercel.json, scripts de prérendu, configuration de build, pages 404 et SEO.

**Critères d’acceptation :**
- F09-AC1 : les routes éditoriales critiques renvoient leur contenu sans exécution JavaScript.
- F09-AC2 : titre, description et canonical correspondent à chaque route, sans doublon contradictoire.
- F09-AC3 : une route absente renvoie un statut et des directives adaptés, pas une page d’accueil indexable.
- F09-AC4 : les liens directs, les chunks et le rechargement de l’analyseur restent fonctionnels.
- F09-AC5 : le pipeline échoue ou alerte explicitement si le contrat de prérendu choisi n’est pas respecté.

**Tests nécessaires :** HTTP sur accueil, analyseur, article, auteur, privacy, URL absente et asset ; validation de preview puis production autorisée. **Effort :** moyen. **Risque :** casser les accès directs SPA. **Bénéfice :** contenu découvrable et partage cohérent. **Dépendances :** F11.

### F10 Textes et promesses désalignés avec les modèles

**Sévérité et priorité :** MOYEN, P2. **Preuves :** B/S, EVD-12. **Statut :** ouvert.

**Localisation :** `src/pages/HomePage.tsx:114`, :473, :658, :699 et :1322 ; `src/pages/AnalyzerPage.tsx:383` et :451 ; `src/components/analyzer/MulliganTab.tsx:1142` ; QuickVerdict et GuidePage.

**Problème et comportement actuel :** l’accueil assimile un Health Score de 87 % à une proportion de sorts lancés sur la courbe. Des métadonnées promettent des probabilités exactes incluant généralement le ramp, alors que le mode par défaut annonce à juste titre des estimations. Le texte Commander mentionne encore le premier non-terrain comme détection, retirée du code. Le mulligan est expliqué comme une nouvelle pioche avec une carte de moins, formulation qui ne décrit pas la pioche puis le bottoming London.

**Preuve éditoriale complémentaire :** 54 articles et 6 onglets annoncés à l’accueil, contre 65 articles et 5 onglets observés. Les qualificatifs de score utilisent plusieurs bandes : « Average » peut coexister avec « rough ».

**Attendu :** même définition des résultats dans l’accueil, les aides, les scores, les exports et les métadonnées. Les exemples fictifs doivent être identifiables et ne pas enseigner une équivalence mathématique incorrecte.

**Impact :** confiance excessive chez les débutants, confusion des joueurs experts et maintenance éditoriale fragile.

**Cause probable :** revue de copy incomplète après les corrections des moteurs.

**Correction recommandée :** dictionnaire produit des termes, provenance de chaque score, revue transversale des promesses ; compteurs dérivés des données ; explication London et command zone mise à jour. Ne pas prétendre qu’un score d’accès T2 est une probabilité de victoire ou de lancer tous les sorts.

**Fichiers concernés :** HomePage, AnalyzerPage, GuidePage, MathematicsPage, QuickVerdict, MulliganTab, SEO et exports.

**Critères d’acceptation :**
- F10-AC1 : aucune équivalence Health Score / proportion de sorts sur la courbe.
- F10-AC2 : « exact » comporte le périmètre du modèle et ne qualifie pas l’estimation par défaut.
- F10-AC3 : règles de mulligan et identification du commandant décrivent le comportement réel.
- F10-AC4 : compteurs de bibliothèque et d’onglets cohérents partout.
- F10-AC5 : seuils et qualificatifs du score sont unifiés ou leur différence est expliquée.

**Tests nécessaires :** revue éditoriale métier, contrôle des métadonnées et des principaux états UI ; assertions ciblées sur les promesses essentielles, sans figer chaque phrase. **Effort :** faible à moyen. **Risque :** texte trop technique. **Bénéfice :** confiance fondée sur des limites compréhensibles. **Dépendances :** F03/F04 et décisions de modèle.

### F11 Contrôles qualité insuffisamment reliés à la livraison

**Sévérité et priorité :** MOYEN, P2. **Preuves :** S/C, EVD-13. **Statut :** ouvert ; politique privée de livraison non vérifiée.

**Localisation :** `.github/workflows/ci.yml:55`, déploiement désactivé ; `nightly-quality.yml:31`, :46 et :61 ; `tests/e2e/accessibility/a11y.spec.js:20`, :30, :42 et :80 ; scripts de package.json.

**Problème et comportement actuel :** les nightly tolèrent les échecs. Les scans axe ne bloquent que les violations « critical », bien qu’ils évoquent un objectif AA ; un test de contraste vérifie seulement qu’une couleur existe. Les jobs nightly a11y/visual installent Chromium sans limiter leurs commandes au projet Chromium. La CI construit avec `build`, Vercel avec `build:vercel`.

**Attendu :** contrôles déterministes, interprétables et appliqués à l’artefact publié ; politique d’échec explicite. La conformité d’accessibilité ne se résume pas à une catégorie de sévérité axe.

**Preuve :** lecture des workflows et tests. CI courante réussie. Le dépôt décrit l’intégration GitHub native Vercel ; l’attente effective des checks et les protections de branche n’ont pas été inspectées dans leurs réglages privés. Aucun déploiement malgré échec n’a été déclenché pour démonstration.

**Impact :** faux sentiment de validation et risque de bruit d’échec sur navigateurs non installés.

**Cause probable :** accumulation de suites et scripts historiques non harmonisés avec l’objectif de qualité.

**Correction recommandée :** sélectionner un noyau Chromium bloquant sur parcours et erreurs prioritaires ; revoir les assertions d’accessibilité ; sélectionner explicitement le navigateur des nightly ; valider le même contrat de build et de prérendu que celui livré. Vérifier séparément la politique Vercel.

**Fichiers concernés :** workflows, package.json, tests axe/clavier/contraste, scripts de budget et de prérendu.

**Critères d’acceptation :**
- F11-AC1 : un défaut connu de réédition clavier échoue dans la validation ciblée.
- F11-AC2 : un défaut de contraste pertinent ne passe pas grâce à une valeur CSS simplement non vide.
- F11-AC3 : les suites automatiques ne demandent que les navigateurs installés.
- F11-AC4 : le contrat HTML de F09 est vérifié sur l’artefact candidat.
- F11-AC5 : la condition de publication après checks est documentée et vérifiée sans modifier la production pour un test.

**Tests nécessaires :** inspection des commandes résolues, exécution ciblée en preview et vérification contrôlée d’échecs attendus. **Effort :** moyen. **Risque :** CI instable si elle dépend du Scryfall live pour chaque scénario. **Bénéfice :** prévention des régressions. **Dépendances :** fixtures des P1 et F09.

### F12 Information de confidentialité incomplète

**Sévérité et priorité :** MOYEN, P2. **Preuves :** B/S/H, EVD-14. **Statut :** ouvert ; conclusion juridique globale non formulée.

**Localisation :** `src/components/layout/StaticPages.tsx:395`, PrivacyPage ; `src/pages/HomePage.tsx:1323` ; `index.html:73` ; PrivacySettings et résolveurs Scryfall.

**Problème et comportement actuel :** « 0 Data sent to servers » et l’absence générale de transmission d’informations de deck ne décrivent pas les noms de cartes envoyés à Scryfall. Des polices et ressources sont chargées depuis Google Fonts et jsDelivr. L’accueil contient ailleurs une précision plus juste sur Scryfall, créant une contradiction interne.

**Attendu :** distinguer traitement et sauvegarde locaux, noms recherchés auprès d’un tiers, ressources externes et données techniques de connexion. Ne pas déduire de l’absence d’analytics l’absence de tout échange.

**Impact :** information utilisateur incomplète ; conformité des mentions à qualifier. Aucune collecte clandestine ni infraction juridique générale n’a été démontrée.

**Cause probable :** promesse de confidentialité formulée de manière absolue puis seulement partiellement corrigée.

**Correction recommandée :** inventaire des destinataires, finalités, clés et durées ; politique cohérente avec le réseau réel ; distinction des données d’analyse et des métadonnées publiques. Prévoir les mentions nécessaires avant toute activation de Sentry.

**Fichiers concernés :** PrivacyPage, PrivacySettings, HomePage, documentation confidentialité et configuration des ressources.

**Critères d’acceptation :**
- F12-AC1 : les échanges Scryfall sont clairement décrits dans la politique détaillée.
- F12-AC2 : aucune promesse absolue de zéro transmission ne contredit les dépendances réseau.
- F12-AC3 : les stockages et leur effacement sont documentés avec les limites utiles.
- F12-AC4 : le statut de Sentry et la procédure préalable à son activation sont explicites.
- F12-AC5 : les qualifications juridiques sont validées par une personne compétente avant déclaration de conformité.

**Tests nécessaires :** comparaison entre inventaire du code, capture réseau et mentions publiques ; revue du mécanisme de suppression. **Effort :** faible à moyen, hors conseil juridique. **Risque :** surpromesse ou mentions inexactes. **Bénéfice :** transparence. **Dépendances :** décision d’observabilité E01.

### F13 Erreur fatale du worker de mulligan non récupérée

**Sévérité et priorité :** MOYEN, P2. **Preuves :** S, EVD-15. **Statut :** ouvert ; scénario de panne non injecté sur le site public.

**Localisation :** `src/components/analyzer/MulliganTab.tsx:904`, création du worker ; :925, écoute de message ; bloc de postMessage.

**Problème et comportement actuel :** les réponses métier positives ou négatives sont gérées, de même que certaines erreurs de postMessage. L’événement error du worker et une absence définitive de réponse ne disposent pas d’une récupération explicite dans ce cycle.

**Scénario à reproduire :** en environnement isolé, faire échouer le chargement du worker ou provoquer une erreur fatale avant l’émission du message de résultat. Ce scénario est dérivé du code ; il n’a pas été exécuté sur la production. Le parcours nominal avec 10 000 échantillons par taille de main a abouti.

**Attendu :** chargement terminé par une erreur utile et possibilité de relancer sans recharger l’ensemble de l’application.

**Impact :** état de calcul potentiellement permanent sur réseau ou runtime défaillant.

**Cause probable :** contrat centré sur le message `{ok: false}`, qui ne couvre pas tous les échecs de plateforme.

**Correction recommandée :** gérer construction, error, messageerror et nettoyage ; décider d’une garde de durée ou d’un suivi de progression adapté à la précision, avec possibilité d’annuler et de relancer.

**Fichiers concernés :** MulliganTab et protocole du worker de mulligan.

**Critères d’acceptation :**
- F13-AC1 : un worker qui ne charge pas produit une erreur récupérable.
- F13-AC2 : une erreur fatale libère l’état de chargement et les listeners.
- F13-AC3 : une relance fonctionne sans conserver un résultat obsolète.
- F13-AC4 : un calcul légitime en précision élevée n’est pas interrompu arbitrairement.

**Tests nécessaires :** événements d’erreur contrôlés, nouvelle génération, démontage et relance. **Effort :** faible. **Risque :** timeout trop court sur appareil lent. **Bénéfice :** récupération robuste. **Dépendances :** conventions d’annulation de F05/F08.

## 6 Expérience utilisateur

La proposition de valeur est identifiable et le démarrage sans compte constitue un atout. Les CTA « Paste a deck & analyze » et « Try an example deck » fournissent deux entrées utiles. L’exemple se charge et la sauvegarde automatique évite une action supplémentaire. La restauration ouvre correctement l’éditeur sans imposer l’affichage d’un ancien résultat lourd.

Les résultats exigent néanmoins un effort de compréhension : plusieurs métriques ressemblent à des probabilités comparables alors qu’elles n’évaluent pas le même événement. Le mode exact est explicitement limité et peut afficher une indisponibilité ; ce choix doit rester lisible et ne pas être masqué par des promesses générales ailleurs.

La priorité UX est la fiabilité des actions et messages F01, F05 et F10. Un message de Clear réussi suivi du retour d’un résultat est plus dommageable qu’un manque d’animation. Le conseil de conserver presque toute main de deux à quatre terrains doit rester une heuristique contextualisée : les bonnes couleurs, la courbe et le plan de jeu ne sont pas déduits du seul nombre de terrains.

**Amélioration E02 proposée :** regrouper au-dessus des résultats le deck interprété, le périmètre principal/post-board, le format sélectionné et la définition de la métrique. Effort moyen ; bénéfice élevé pour débutants et experts. Validation : un utilisateur doit pouvoir expliquer ce que mesure un nombre et ce qu’il ne mesure pas sans consulter le code.

## 7 Interface visuelle et textes

L’identité MTG est cohérente : symboles de mana, palette par couleur et CTA dominants. L’usage de Material UI réduit les variations de composants. Les états de chargement et les résultats sont visibles. Aucun défaut global d’alignement n’a été démontré dans les vues consultées.

Les problèmes restants concernent la densité des messages, les qualificatifs de score divergents, les chiffres d’accueil périmés et l’utilisation des niveaux de titres comme tailles visuelles. Les libellés « mana availability estimate », « potential castability » et « Health Score » doivent rester distincts. La description mobile évoquant un pourcentage de sorts sur la courbe doit être revue avec F10.

**Non vérifié :** audit exhaustif du thème sombre, de tous les hover/disabled/focus, de tous les tableaux et exports. **Amélioration E03 :** petite nomenclature de scores et de composants d’aide, avec couleurs, seuils, unités et vocabulaire communs ; ne pas entreprendre une refonte graphique avant les P1.

## 8 Responsive et mobile

Des contrôles ciblés ont utilisé des largeurs de 360, 768 et 1440 pixels dans un seul navigateur. Le document n’a pas présenté de débordement horizontal global dans les vues mesurées. Les éléments situés hors du viewport dans la barre d’onglets appartiennent à une zone défilante ; leur position seule ne démontre pas une régression responsive.

À 360 pixels, le menu a été ouvert et le parcours historique puis restauration a été exécuté. L’éditeur s’adapte à la largeur. Ces observations ne certifient pas les cibles tactiles, l’expérience avec clavier virtuel ni le comportement Safari.

**À vérifier avant clôture générale :** comparaison de deux analyses, panneaux post-board, longues listes et modales ; zoom 200 % et 400 % ; libellés longs ; clavier virtuel ; actions importantes restant visibles après analyse. Contrôler un représentant de chaque famille de composant plutôt que répéter tous les parcours à chaque largeur.

## 9 Accessibilité

La conformité WCAG 2.2 AA n’est pas acquise. Le blocage F07 concerne une action essentielle. Les points positifs sont le lien d’évitement, les landmarks, les labels de saisie, les onglets reliés à leurs panneaux et le focus vers le verdict. Ces éléments constituent des preuves ponctuelles, pas une conformité générale.

Les aides portées par des icônes sans focus natif, les boutons uniquement iconographiques, la structure des titres, les noms de progressbars et les modales nécessitent une vérification ciblée. L’analyseur masque son titre h1 dans certains états de résultat ; établir une hiérarchie stable plutôt que dépendante de la taille visuelle.

Les scans axe existants n’examinent pas toute la WCAG 2.2 et n’échouent que sur la catégorie « critical ». La réussite d’un test qui vérifie simplement qu’une couleur CSS existe ne valide aucun rapport de contraste. Référence : https://www.w3.org/WAI/WCAG22/Understanding/keyboard et https://www.w3.org/TR/WCAG22/.

**Critère de clôture de domaine :** parcours principal entièrement au clavier, règles automatisables pertinentes sans violations non acceptées, contrôles manuels documentés des modales/focus/zoom, et vérification lecteur d’écran. La conformité complète reste V03, non vérifiée.

## 10 Performance

### 10.1 Éléments mesurés

| Asset public contrôlé | Octets bruts | Estimation gzip |
|---|---:|---:|
| index-Dyq_TViQ.js | 153862 | 43006 |
| vendor-react-YPwVjS-F.js | 191952 | 62815 |
| vendor-mui-CPNqbaNh.js | 370110 | 111225 |
| vendor-redux-Bc1t3V2X.js | 46954 | 15711 |
| vendor-mui-icons-CXd-WJEu.js | 37329 | 11304 |
| index-qsdYYaTe.css | 16394 | 4155 |

Les cinq fichiers JS représentent environ 800 ko décimaux bruts et 244 ko d’estimation gzip. Il s’agit de fichiers référencés par le HTML et téléchargés pour inspection, pas d’un total réseau exhaustif ni du poids transféré mesuré sur mobile. Le CSS ajoute environ 16 ko bruts. Les assets portent `public, max-age=31536000, immutable`.

La CI vérifie un budget de bundle passant. Recharts et les bibliothèques d’export forment des chunks importants mais différés ; ne pas additionner leur poids au chargement initial sans examiner le graphe de requêtes. Les imports différés et workers sont des mesures utiles.

### 10.2 Risques et mesures manquantes

F01 expose des allocations liées aux quantités ; F08 laisse poursuivre des requêtes obsolètes. La séparation des résolveurs cartes et terrains entraîne des résolutions répétées. Les polices sont externes. Une partie du moteur physique reste dans le fil principal avec budgets de calcul ; son effet sur INP n’a pas été mesuré.

**LCP, INP, CLS et TTFB représentatif : NON VÉRIFIÉS.** L’interface d’inspection du navigateur ne donnait pas accès aux entrées Performance attendues ; aucune mesure de terrain ni campagne Lighthouse n’a été effectuée. Ne pas remplacer ces métriques par le temps d’un téléchargement ponctuel.

**Amélioration E04 :** mesurer d’abord accueil et analyseur sur profil mobile représentatif, puis cibler le coût dominant. Documenter appareil, réseau, cache, URL, version et dispersion des mesures. Le bénéfice d’une optimisation devra être démontré avant refonte des dépendances ou micro-optimisation de hooks.

## 11 Sécurité et dépendances

Les réponses publiques contrôlées fournissent CSP, HSTS, X-Content-Type-Options, X-Frame-Options, Referrer-Policy et Permissions-Policy. La CSP inclut `frame-ancestors 'none'`, `object-src 'none'`, `base-uri 'none'`, `form-action 'self'` et limite les scripts à self. Les styles inline restent autorisés, cohérents avec la stack mais à distinguer des scripts inline.

Le sérialiseur JSON-LD échappe les caractères `<`. Aucun chemin XSS exploitable n’a été démontré dans les composants inspectés. Les champs React textuels et l’absence de backend réduisent certaines surfaces sans prouver l’absence de toute faille. Pas de compte/session métier identifié : CSRF, SSRF et injection SQL ne correspondent pas à une surface établie ici.

L’interrogation de `https://registry.npmjs.org/-/npm/v1/security/advisories/bulk` avec les noms et versions du lockfile a renvoyé `{}`. La CI consultée indique également zéro vulnérabilité. Ce résultat est daté du 6 septembre 2026 ; il ne couvre pas les vulnérabilités inconnues, les erreurs applicatives ou les permissions privées de livraison.

Les risques concrets de cette revue sont la robustesse d’entrée F01 et d’import F06. Aucun secret exploitable n’a été identifié ; les valeurs de `.env` n’ont pas été exposées dans les sorties du rapport. `.env` n’est pas listé parmi les fichiers suivis contrôlés. Les sources privées, règles de projet Vercel et historique complet des secrets n’ont pas fait l’objet d’une certification.

**Dépendances anciennes ou inutiles :** aucune suppression n’est recommandée sur la seule ancienneté d’un numéro majeur. Démontrer l’absence d’usage et le coût avant intervention. Vérifier les avis à nouveau lors de chaque livraison plutôt que figer ce résultat d’audit.

## 12 SEO technique et contenu

Les fondations sont présentes : titre, description, canonical, Open Graph, Twitter Cards, favicon, manifest, robots, sitemap, JSON-LD et flux éditorial. `robots.txt`, `sitemap.xml` et `/library/feed.xml` ont été servis avec des types adaptés ; le flux n’était pas réécrit en HTML lors du contrôle.

F09 est le frein principal : plusieurs routes partagent l’HTML de chargement et la canonical initiale de l’accueil. Le rendu JavaScript corrige les métadonnées observées dans le navigateur. Google peut rendre JavaScript ; ne pas conclure à une non-indexabilité générale. Search Console et les aperçus de réseaux sociaux réels restent non vérifiés.

Le contenu est pertinent pour les recherches autour des bases de mana MTG, sources colorées, probabilités, Commander, Limited, Karsten et mulligan. La bibliothèque offre une entrée éditoriale utile. La correction prioritaire est l’exactitude des promesses et du contenu servi, avant d’ajouter des pages ou des mots-clés.

**Amélioration E05 :** après F09/F10, relier chaque article original interne à un scénario utilisateur et à une définition mathématique claire. Éviter de promettre des classements ou du trafic sans données. Les liens externes archivés/perdus sont signalés ; leur disponibilité n’a pas été revérifiée exhaustivement.

## 13 API et réseau

| Consommateur | Requête | Timeout et retry | Cache et fallback | Point de vigilance |
|---|---|---|---|---|
| Résolveur général | POST api.scryfall.com/cards/collection | 8 s, un retry 429/5xx | LRU mémoire, named ensuite | Signal absent, validation de réponse faible |
| Résolveur par nom | GET cards/named exact puis fuzzy | Helper partagé | LRU mémoire | Erreur transitoire et fallback peuvent multiplier l’attente |
| Métadonnées terrains | Collection puis named | Helper partagé | Seed, mémoire, localStorage | Chemin distinct du résolveur général |
| Recherche générique | Named fuzzy et variantes | Timeout par tentative | LRU, IndexedDB 30 jours | Variantes parfois identiques ; usage à clarifier |
| Image au survol | Named exact puis image Scryfall | Abort, pas de timeout explicite | LRU d’URL, première face | Cadence et durée à harmoniser |
| Producteurs | Named fuzzy | Helper réseau du service | Seed et cache local | Ne pas supposer une capacité arbitraire exacte |
| Fonts et symboles | Google Fonts et jsDelivr | Navigateur | Cache HTTP | Réseau tiers et chemin de chargement |
| Sentry conditionnel | Destination du DSN | SDK | Sans objet | CSP actuelle incompatible avec une destination externe |

Les collections du résolveur principal sont découpées par lots de 75 ; la prélecture des terrains possède également un découpage. Des délais de 100 ms existent dans certains chemins, mais il n’y a pas de file de cadence unique pour tous les consommateurs. L’ensemble des résolveurs ne partage pas un cache canonique de réponse.

Le TTL IndexedDB de 30 jours décrit le cache utilisé derrière la recherche générique, pas une garantie que toute analyse principale soit disponible hors ligne. Le code d’exemple d’environnement promettant un fonctionnement intégralement hors ligne ne correspond pas à la dépendance effective à Scryfall.

**Validation de réponse :** les interfaces TypeScript et conversions ne constituent pas une validation à l’exécution. Les JSON 200 incorrects et incomplets doivent être testés sans être interprétés comme des métadonnées exactes.

## 14 Données Magic et contrats mathématiques

### 14.1 Définitions à conserver

**Health Score :** heuristique fondée sur l’accès aux couleurs requises au tour deux dans la synthèse ; pas une probabilité de victoire ni une fraction de sorts lancés sur la courbe. **Mana estimates :** approximations de disponibilité avec hypothèses de ramp et de survie ; chevauchement et séquencement approximés. **Exact goldfish potential :** existence d’au moins une séquence légale dans le modèle supporté, avec accès à l’historique tiré ; borne de potentiel, pas politique sans connaissance du futur. **Mulligan :** optimisation d’un score de main heuristique, pas des chances de gagner la partie.

Le mode exact fixe notamment 0 % de retrait et 100 % de survie du ramp dans son contexte. Ses limites et refus sont visibles. Les résultats ne comprennent pas automatiquement la probabilité de piocher le sort cible, ni les mulligans. L’option « Perfect land drops » est conditionnelle à une hypothèse distincte et ne doit pas être confondue avec une probabilité inconditionnelle.

### 14.2 Couverture des types de cartes

| Type | État établi | Limite de conclusion |
|---|---|---|
| Basics et cartes normales | Seed et parcours contrôlés | Pas une validation de toutes les impressions |
| Transform | Tests Wedding Announcement et Delver passants | Ne couvre pas toutes les cartes à plusieurs faces |
| Terrains engagés | Correctif courant et tests goldfish passants | Modèle exact limité aux contrats admis |
| Hybrides | Représentation du paiement présente | Synthèses fautives F03 |
| Sideboard | Modèle de cartes et échanges présent | Parsing/cibles fautifs F02/F04 |
| Commander | Marquage explicite et exclusion de bibliothèque | Texte de fallback périmé ; toutes les variantes non contrôlées |
| MDFC | Métadonnées dédiées et refus exact possibles | Pas de certification générale des deux modes |
| Split et aventures | Nom normalisé vers la première partie | Chaque choix de lancement non démontré |
| Coût absent et symboles inconnus | Refus dans le parseur physique | Préserver la distinction absence de coût et coût zéro |
| Tokens | Pas de validation exhaustive | V07 ouvert |
| Éditions | Codes retirés par normalisation | Impression d’origine non garantie |
| Légalités | Pas de validateur complet identifié | « Format supporté » ne vaut pas deck légal |
| Images DFC | Repli première face présent | Navigation entre faces non certifiée |

### 14.3 Invariants recommandés pour les évolutions

- Un calcul doit expliciter sa bibliothèque, sa command zone, son principal et son sideboard.
- Un symbole hybride est une alternative ; un coût bicolore strict contient deux exigences.
- Une source physique ne peut pas être dépensée deux fois pour la même séquence.
- Une métadonnée manquante ne doit pas devenir silencieusement une certitude numérique.
- Une carte sans coût n’équivaut pas à un coût de zéro mana.
- Un score heuristique ne doit pas recevoir un libellé de probabilité exacte.
- Un coût de mana, une valeur de mana et un coût choisi pour X doivent rester séparés.
- Les résultats sauvegardés doivent identifier le modèle et la version nécessaires à leur interprétation.

Ces invariants sont des exigences proposées ; ils ne sont pas tous certifiés par la couverture actuelle.

## 15 Qualité du frontend

La modularisation des moteurs, les types dédiés, les caches bornés et les migrations constituent de bonnes fondations. Le lint et les types passent. Les divergences restantes montrent toutefois que les frontières entre parsing, modèle et affichage ne sont pas assez contraignantes.

Les fichiers les plus volumineux hors données incluent ReferenceArticlesPage à 1 695 lignes, deckAnalyzer à 1 497, HomePage à 1 406, mulliganSimulatorAdvanced à 1 303, MulliganTab à 1 221 et ManaBlueprint à 1 130. La taille est un indicateur de coût de maintenance, pas la preuve autonome d’un bug.

Le stockage conserve des `any` et valeurs inconnues consommées sans garde. Certaines fonctions exportées constituent des chemins historiques distincts du chemin produit ; les retirer ne doit être envisagé qu’après inventaire des usages et des tests. Les commentaires peuvent être périmés même lorsque le code corrigé est juste, notamment le fallback Commander.

**Orientation d’évolution :** extraire les règles métier et contrats stables avant de multiplier useMemo ou de réécrire la gestion d’état. Une optimisation de rendu doit être justifiée par mesure, pas par présence d’un composant long.

## 16 Gestion des erreurs et backend

Des ErrorBoundaries existent au niveau de l’application et de plusieurs vues ; des erreurs de résolution et de sauvegarde sont affichées. Redux Persist allège le résultat et réinitialise des champs volatils au rechargement, ce qui évite plusieurs anciennes incohérences.

Une ErrorBoundary protège l’affichage mais ne répare pas une donnée persistée incorrecte ; « Try again » peut reproduire la même erreur. Les erreurs de session, de réseau, de parsing et de modèle non supporté doivent avoir des chemins de récupération distincts. Une annulation normale ne doit pas être journalisée comme un crash utilisateur.

Le backend applicatif est non applicable dans le périmètre identifié. Transactions et concurrence de base de données ne sont donc pas des axes testés. En revanche, l’intégrité des écritures localStorage, le quota et les interactions entre générations asynchrones sont pertinents.

**Pannes prioritaires :** F05, F06, F08 et F13. **Autres limites à tester :** lecture localStorage interdite, réponse JSON incorrecte, chunk manquant après déploiement, erreur d’export, reprise après perte réseau et versions anciennes de sauvegarde.

## 17 Tests et qualité des preuves

### 17.1 Contrôles exécutés

TypeScript a été exécuté avec `--noEmit --incremental false`, ESLint avec `--no-cache` et sans fix. Vitest a utilisé `--configLoader runner --no-cache --reporter=dot` pour éviter les sorties de rapport et le bundling de configuration habituel.

La première sélection couvrait `src`, `tests/component` et cinq régressions mathématiques ciblées ; elle a donné **43 fichiers et 499 tests passants en 5,19 s**. Le complément mathématique a donné **19 fichiers et 126 tests passants en 2,17 s**. Ces durées sont celles de la machine de l’audit, pas un engagement de performance CI.

Les fichiers `pathways.test.ts`, `known-limitations.test.ts`, `canonical.test.ts` et `independent.test.ts` n’ont pas été exécutés dans le complément car ils écrivent explicitement des preuves sur disque. Les cinq tests déjà sélectionnés ont également été exclus du complément pour éviter leur répétition. Aucun nouveau fichier de test n’a été créé pendant l’audit.

### 17.2 Couverture favorable et fausses assurances

Les calculs hypergéométriques, moteurs physiques, populations, contrats de politique, reprise d’estimation et front-face disposent de tests utiles. Les mocks de stockage et d’observers facilitent les unitaires, mais ne reproduisent pas tous les comportements de navigateur. Certains avertissements attendus de fallback et de dimensions de graphiques apparaissent en jsdom ; ils n’ont pas été présentés comme des erreurs de production.

Le principal faux sentiment de sécurité est F01 : des tests précis des bornes d’un helper qui n’est pas le point d’entrée du produit. Autres limites : axe critical seulement, contraste non calculé et commandes nightly insuffisamment ciblées. Il faut tester les contrats visibles et leurs entrées, pas uniquement les helpers.

### 17.3 Stratégie future sobre

Privilégier unitaires du chemin métier, intégrations à promesses contrôlées et quelques E2E Chromium. Réutiliser les jeux de régression existants. Ne pas relancer une campagne six navigateurs pour chaque correction. Réserver Safari à IndexedDB, quota, clipboard, export ou à un écart effectivement suspecté. Une campagne lourde supplémentaire reste soumise à autorisation.

## 18 Compatibilité des navigateurs

Les interactions de cet audit ont utilisé le navigateur intégré Codex, disponible dans la session. L’ouverture d’un profil Chrome connecté a échoué car cette connexion n’était pas disponible. Le moteur et sa version n’ont pas été certifiés dans les preuves ; les observations ne doivent donc pas être renommées « campagne Chrome Desktop complète ».

Les variations 360, 768 et 1440 pixels ont eu lieu dans le même navigateur. Aucun scénario n’a été répété sur six profils. Un ancien workflow Browser audit vert sur `b15d740` a été consulté ; il n’est pas une validation complète du commit `148d5f8` et n’a pas été redéclenché.

Les navigateurs physiques, Safari/WebKit, Firefox et clavier virtuel sont non vérifiés pour la version courante. La cible de build moderne déclarée doit rester cohérente avec les navigateurs officiellement annoncés au public.

## 19 Confidentialité et qualification RGPD

### 19.1 Inventaire des stockages et destinataires

Le stockage local couvre l’historique `manatuner_analyses`, son ancienne clé migrée, `persist:root`, caches terrains/producteurs, paramètres d’accélération, thème, progression Library et préférences d’onboarding/bannière. sessionStorage conserve notamment le preset Commander et le marqueur de nettoyage du service worker. IndexedDB contient le cache Scryfall à durée définie.

Les destinataires techniques identifiés sont l’hébergement Vercel, Scryfall pour les noms et images, Google Fonts et jsDelivr pour les ressources, puis Tally uniquement via l’ouverture du formulaire externe. Sentry dépend du DSN ; aucun reçu d’événement de production n’a été vérifié. Les noms de cartes sont publics en tant que métadonnées, mais la sélection des noms recherchés peut révéler une partie du deck ; ne pas confondre ces deux dimensions.

### 19.2 Exigence certaine

Le périmètre des règles sur les traceurs ne se limite pas aux cookies HTTP. localStorage peut être concerné. Certains usages strictement nécessaires à un service demandé sont susceptibles d’exemption de consentement. L’absence de compte ne suffit pas à conclure à l’absence de toute obligation. Référence CNIL : https://www.cnil.fr/fr/cookies-et-autres-traceurs/que-dit-la-loi.

### 19.3 Bonne pratique

Afficher une information honnête sur les flux et les stockages, expliquer l’export et l’effacement, éviter les logs de deck complets, conserver les fragments de partage pour les nouveaux liens et avertir des limitations de sauvegarde/quota. Une durée de cache n’est pas une durée de conservation d’historique utilisateur.

### 19.4 Validation juridique nécessaire

Valider les bases et finalités de traitement, les mentions d’identité/contact, les destinataires, les transferts éventuels et les durées des logs d’hébergement. Les réglages des tiers et contrats de sous-traitance ne sont pas établis par cet audit frontend. Il n’est pas démontré qu’une bannière générale de consentement soit requise pour tous les stockages observés.

## 20 CI et déploiement

Le workflow principal sur main lance npm ci, lint, typecheck, unitaires, build, budget de bundle et audit npm. La dernière exécution observée pour `148d5f8` est réussie. Le pipeline de PR a des contrôles comparables avec couverture, mais la couverture ne dispose pas ici d’une attestation complète de seuils fonctionnels.

Le job deploy dépendant du test est désactivé ; les commentaires expliquent que l’intégration GitHub native Vercel publie déjà. La présence de `needs: test` dans un job désactivé ne démontre pas que la publication native attend la CI. L’écart `build` versus `build:vercel` inclut le prérendu et doit être traité dans F09/F11.

Aucun workflow, push ou déploiement n’a été déclenché. Protections de branche, paramètres Vercel, environnement de production effectif, procédure de rollback et alertes opérateur restent non vérifiés. Ne pas réactiver le second chemin de déploiement sans comprendre le risque documenté de double publication.

## 21 Observabilité

Sentry est initialisé seulement en production avec DSN. Le code retire notamment query/hash de certaines URL, utilisateur et données supplémentaires de certains événements ; les messages et contextes ne doivent pas pour autant être considérés comme un anonymiseur universel. Aucune preuve d’événement reçu n’a été consultée.

La CSP `connect-src` publique limite les destinations à self et Scryfall. Une activation d’un DSN externe sans changement cohérent serait bloquée. Les console sont supprimées en production, ce qui réduit les diagnostics locaux quand Sentry est désactivé. Aucun RUM des Core Web Vitals n’a été établi.

**Amélioration E01, P2 :** définir une observabilité minimale et respectueuse de la confidentialité : disponibilité du site et des routes essentielles, erreurs de résolution agrégées si autorisées, échec de worker et informations de version. Effort moyen. Dépendance F12. Acceptation : événement de test non sensible reçu en environnement autorisé, champs inspectés, CSP compatible et documentation publique à jour. Ne pas activer de télémétrie sur la seule base de ce rapport.

## 22 Dette technique et configuration

**Amélioration E06, P3 :** réduire les chemins historiques après les corrections métier. Le contrat de parsing partagé est prioritaire ; vient ensuite la clarification des caches et la séparation des très gros composants par domaine stable. Ne pas supprimer un export sans vérifier ses usages et les tests.

Le package annonce Node ≥18, tandis que Vite 7 et les environnements récents demandent un minimum à aligner avec le runtime effectivement supporté. Les workflows utilisent Node 20 ou 24 selon leur rôle. La compatibilité exacte à annoncer doit être vérifiée avant de modifier engines et documentation ; ce rapport ne transforme pas une plage générique en panne actuelle démontrée.

Les noms de variables `.env` inspectés concernent mode dev, niveau de logs, analytics, error reporting, performance monitoring et cache. Leur présence dans `.env` ne prouve pas leur prise en compte : les usages effectifs relevés dans le code concernent surtout VITE_SENTRY_DSN et les flags Vite. Les valeurs privées ne figurent pas ici. `.env.example` contient encore des affirmations hors ligne à revoir.

La dette éditoriale (compteurs, anciennes règles de détection, promesses mathématiques) doit être traitée comme un problème de cohérence produit, pas uniquement comme un nettoyage de commentaires.

## 23 Plan de remédiation et dépendances

### 23.1 Ordre recommandé

| Lot | Travaux | Sortie vérifiable | Risque et dépendance |
|---|---|---|---|
| A | F01 et F02 | Deck canonique et populations fiables | Compatibilité des exports ; base des autres calculs |
| B | F03 et F04 | Synthèses et cibles cohérentes | Variation des scores ; après A |
| C | F05 et F08 | Annulation de bout en bout | Résultats obsolètes et distinction erreurs/abort |
| D | F06 | Import et historique récupérables | Anciennes sauvegardes ; aucune purge automatique générale |
| E | F07 et partie F11 | Parcours clavier protégé | Faible ; indépendant des calculs |
| F | F09 et reste F11 | Artefact livré et contrôlé | Routage et prérendu ; réglages privés à vérifier |
| G | F10 et F12 | Promesses et information alignées | Après décisions de modèle et de télémétrie |
| H | F13 et E01 | Récupération et diagnostic des pannes | Respect de la confidentialité |
| I | E02 à E06 | UX, mesures et maintenabilité | Améliorer après stabilisation |

Il s’agit d’un ordre de dépendances, pas d’un calendrier contractuel. Une correction clavier ou de Clear peut être livrée séparément si ses tests sont satisfaisants. Les efforts sont relatifs et n’intègrent pas les décisions juridiques ni les accès externes manquants.

### 23.2 Critères communs de clôture

Un problème n’est clos que si la reproduction échoue sur la version initiale, réussit après correction au bon point d’entrée, et que les critères d’acceptation applicables disposent de preuves identifiées. La revue doit couvrir le comportement utilisateur, pas seulement le diff. Mentionner explicitement le commit et l’environnement de la preuve.

Le passage des tests ne suffit pas pour SEO sans GET sur l’artefact livré, pour accessibilité sans clavier, pour confidentialité sans comparaison réseau/mentions, ni pour performance sans mesure. Les résultats antérieurs ne sont pas une validation automatique d’un nouveau commit.

### 23.3 Matrice des priorités

P0 : aucun démontré. P1 : F01 à F07. P2 : F08 à F13 et E01. P3 : améliorations de structure, cohérence et contenu E02 à E06, à prioriser selon bénéfice constaté. Les travaux E02/E03 peuvent être partiellement intégrés à F10 s’ils aident à lever une ambiguïté, sans élargir inutilement le lot.

## 24 Dix améliorations à plus fort impact

| Rang | Action | Impact | Effort | Priorité |
|---|---|---|---|---|
| 1 | Validation du vrai point d’entrée | Évite les faux résultats et entrées excessives | Moyen | P1 |
| 2 | Sections explicites du deck | Corrige la population analysée | Moyen | P1 |
| 3 | Hybrides et cibles du principal | Évite les mauvais conseils de manabase | Moyen | P1 |
| 4 | Clear annulant et résultats versionnés | Rétablit la maîtrise utilisateur | Faible à moyen | P1 |
| 5 | Sauvegardes validées et récupérables | Protège l’historique | Moyen | P1 |
| 6 | Réédition accessible | Débloque le clavier | Faible | P1 |
| 7 | Réseau unifié et annulable | Améliore les situations dégradées | Moyen | P2 |
| 8 | HTML initial pertinent et vraies 404 | Améliore découverte et partage | Moyen | P2 |
| 9 | Dictionnaire des résultats et promesses | Réduit la surconfiance | Faible à moyen | P2 |
| 10 | Contrôle de l’artefact candidat | Prévient les régressions livrées | Moyen | P2 |

## 25 Scores et limites de notation

| Domaine | Note sur 10 | Motif principal |
|---|---:|---|
| Fonctionnel | 6 | Parcours nominal bon ; parsing et Clear fautifs |
| UX | 6 | Démarrage facile ; interprétation et erreurs ambiguës |
| UI | 7 | Identité cohérente ; cohérence de scores à revoir |
| Responsive | 7 | Contrôles ciblés favorables ; composants complexes non certifiés |
| Accessibilité | 4 | Réédition clavier bloquée ; tests insuffisants |
| Performance | 6 | Lazy loading et workers ; Core Web Vitals non mesurés |
| Sécurité | 8 | Headers et avis favorables ; entrées/imports à durcir |
| SEO | 4 | Fondations présentes ; HTML initial générique |
| Qualité du code | 6 | Modules utiles ; contrats et gros composants à améliorer |
| Tests et robustesse | 7 | 625 tests passent ; angles morts démontrés |
| Total | 61 sur 100 | Indicateur de préparation, pas certification |

Les notes sont celles du rapport initial, conservées pour éviter un déplacement arbitraire de la référence. Les domaines partiellement vérifiés restent provisoires. Ne pas utiliser le total pour autoriser une publication : les P1 et les critères d’acceptation prévalent.

## 26 Décision finale et utilisation future

**ManaTuner possède-t-il le niveau d’un excellent site moderne prêt pour une utilisation réelle en production ? NON, au sens de ce niveau d’exigence.** L’application est utilisable, mais pas entièrement fiabilisée. Cette conclusion n’implique ni une panne générale ni l’absence de valeur des corrections récentes.

Le produit pourra être réévalué après correction des P1, contrôle du contrat livré et traitement des ambiguïtés de présentation. Les V01 à V12 doivent rester visibles dans le dossier de préparation à la production tant qu’ils ne disposent pas de preuves. Une fonctionnalité non supportée honnêtement signalée est préférable à un pourcentage fabriqué.

Pour les évolutions, préserver les identifiants du registre, ouvrir un ticket par contrat à corriger, rattacher chaque PR aux critères concernés, puis ajouter les preuves datées dans un document de validation séparé. Ne pas réécrire les observations historiques pour faire apparaître le défaut comme ayant toujours été corrigé.

L’audit n’a effectué aucune correction du site. Cette livraison ajoute uniquement les documents demandés. Aucun commit, push, migration, changement de configuration applicative ou déploiement n’est autorisé par le rapport lui-même.

## Annexe A Registre des preuves

Les extraits ci-dessous sont des transcriptions des sorties obtenues pendant l’audit dans la conversation. Ils ne prétendent pas être des fichiers de logs bruts nouvellement générés. Les scripts de reproduction en mémoire n’ont pas été conservés dans le dépôt. Les données suffisantes pour refaire des tests déterministes figurent en annexe B.

| Preuve | Source et résultat | Constats liés |
|---|---|---|
| EVD-01 | Git initial/final : mêmes entrées modifiées et non suivies ; commit 148d5f8 | Périmètre et intégrité |
| EVD-02 | TypeScript et lint code retour 0 ; 499 puis 126 tests passants | Validation partielle |
| EVD-03 | Parse un million accepté ; entrée texte libre total 0 ; UI zéro carte | F01 |
| EVD-04 | Maybeboard intégré ; SB inline propage le flag | F02 |
| EVD-05 | Hybride : rouge required 13 actual 0 short | F03 |
| EVD-06 | Counterspell sideboard : bleu required 21 actual 0 short | F04 |
| EVD-07 | Clear puis retour de 60 cartes et 24 terrains | F05 |
| EVD-08 | Import accepté puis TypeError sur toFixed ; stockage retourne null | F06 |
| EVD-09 | Edit Deck : span/div, rôle absent, tabIndex moins un | F07 |
| EVD-10 | Appels après abort ; retry résout 200 avec signal annulé | F08 |
| EVD-11 | Cinq routes : HTTP 200, 12452 octets, même titre et canonical | F09 |
| EVD-12 | Texte 87 %, exact généralisé, 54 articles/6 onglets | F10 |
| EVD-13 | CI verte ; configuration nightly et assertions a11y | F11 |
| EVD-14 | Textes privacy opposés aux appels Scryfall et ressources externes | F12 |
| EVD-15 | Cycle worker sans écoute error ni garde de réponse | F13 |
| EVD-16 | Cas exact : 98 % public, 97,8385472740882 % indépendant | Point favorable |
| EVD-17 | Historique et restauration mobile réussis ; recherche Karsten 6/65 | Points favorables |
| EVD-18 | Headers présents, avis npm vide, tailles des assets | Sécurité et performance |

Extraits techniques représentatifs :

```text
Test Files 43 passed (43)
Tests      499 passed (499)
Duration   5.19s

Test Files 19 passed (19)
Tests      126 passed (126)
Duration   2.17s

EMPTY {"total":0,"score":0}
IMPORT TypeError: record.analysis.averageCMC?.toFixed is not a function
STORAGE [null]
RETRY_ABORT { status: 200, calls: 2, aborted: true }
```

Pour l’annulation de l’analyse simulée, la sortie a indiqué AnalysisCancelledError après deux collections et deux appels named exact Lightning Bolt, chacun avec un signal de requête non annulé au moment relevé. Les réponses simulées minimales servaient à isoler la propagation de l’annulation ; elles ne sont pas des réponses Scryfall capturées.

Références consultées :

- CI du commit courant : https://github.com/gbordes77/manatuner/actions/runs/34014538748
- Audit navigateur antérieur, commit b15d740 : https://github.com/gbordes77/manatuner/actions/runs/34013469156
- Site public : https://www.manatuner.app/
- Référentiel clavier : https://www.w3.org/WAI/WCAG22/Understanding/keyboard
- WCAG 2.2 : https://www.w3.org/TR/WCAG22/
- CNIL traceurs : https://www.cnil.fr/fr/cookies-et-autres-traceurs/que-dit-la-loi
- Endpoint d’avis npm interrogé : https://registry.npmjs.org/-/npm/v1/security/advisories/bulk

## Annexe B Jeux de reproduction et oracles

### B1 Entrées de parsing

**F01 texte invalide :**
```text
nonsense without quantities
```
Oracle après correction : aucune analyse créée ; message de parsing ; texte conservé pour correction.

**F01 quantité excessive :**
```text
1000000 Forest
```
Oracle après correction : rejet rapide avant réseau et allocation. Ne pas lancer une expansion physique massive en production pour tester cette garde.

**F02 Maybeboard :**
```text
24 Forest
36 Island
Maybeboard
4 Mountain
```
Oracle de population : principal 60 cartes, Mountain exclues. Ce jeu est synthétique et n’a pas vocation à être un deck de tournoi.

**F02 préfixe local :**
```text
SB: 1 Mountain
24 Forest
36 Island
```
Oracle de population : principal 60 cartes, sideboard une Mountain. L’ordre atypique sert à démontrer la portée locale du préfixe.

### B2 Entrées de synthèse

Pour F03, créer un résultat de test avec `totalCards = 60`, un sort de coût `{1}{R/G}`, `cmc = 2`, quatre copies, `isLand = false`, et sources vertes 24/rouges zéro. Le défaut initial est une cible rouge de 13. Le critère futur n’impose pas une nouvelle valeur de Health Score arbitraire : il impose l’absence d’obligation rouge injustifiée.

Pour F04, utiliser un principal avec Lightning Bolt et 24 sources rouges, plus Counterspell marqué `isSideboard = true`. Le défaut initial est une cible bleue 21. Oracle : aucun besoin bleu du principal ; réévaluation séparée seulement si Counterspell est effectivement échangé.

### B3 Cas exact simple

```text
24 Plains
36 Savannah Lions
```

Ce deck synthétique isole une demande blanche au tour un et n’est pas légal comme liste construite ordinaire. Le sort cible est une demande externe au modèle. Sans mulligan, sur le play, avec 24 sources blanches disponibles dans 60 cartes et sept cartes observées, l’oracle est `1 - C(36,7) / C(60,7) = 0.978385472740882`. L’affichage arrondi attendu et observé est 98 %. Cela ne valide pas les chemins de plusieurs terrains conditionnels ou producteurs.

### B4 Import incorrect

```json
[{"id":"audit","deckName":"Bad","deckList":"24 Forest","timestamp":0,"analysis":{"averageCMC":"oops"}}]
```

Utiliser un stockage isolé. Oracle : refus ou récupération contrôlée sans perte d’historique antérieur. Tester aussi `[null]` en lecture de l’ancienne clé canonique. Aucun import corrompant des données réelles n’est demandé.

### B5 Ordre des opérations asynchrones

F05 : lancer une analyse A dont le résolveur attend une promesse contrôlée ; exécuter Clear ; résoudre A. Vérifier éditeur, résultat, notifications et historique. Refaire avec une analyse B terminant avant A, et avec démontage de la page. Le résultat ancien doit rester inopérant même si son appel réseau n’a pas pu être interrompu.

F08 : fetch 1 renvoie 429 avec Retry-After 20 ms ; le contrôleur est annulé à 5 ms ; avancer l’horloge. Oracle : erreur d’annulation et nombre de fetch égal à un. Ajouter un cas où les en-têtes arrivent mais le corps JSON ne termine pas, pour vérifier la portée du délai.

F13 : simuler séparément erreur de construction, événement error, messageerror et absence de message. Les tests doivent distinguer erreur de plateforme et réponse métier `ok: false`.

## Annexe C Protocole de validation des futures corrections

### C1 Préparation

Relever HEAD, git status, fichiers déjà modifiés et portée autorisée. Associer le travail aux identifiants F concernés. Relire la fonction au commit actuel et la comparer à la référence historique ; si le défaut a déjà été corrigé, produire une preuve au lieu de réimplémenter. Ne pas utiliser les anciens rapports de test comme état courant.

### C2 Ordre des vérifications

Analyse statique, tests unitaires du point d’entrée, intégration contrôlée, puis E2E ciblé du parcours réellement modifié. Utiliser un stockage jetable et des fixtures réseau publiques. Les tests ordinaires peuvent produire des fichiers : vérifier et annoncer leurs sorties lorsqu’un mode lecture seule est demandé. La procédure de cet audit n’autorise pas automatiquement les scripts de build dans une future session.

### C3 Acceptation d’un correctif

Pour chaque AC : indiquer commande ou parcours, version, environnement, attendu, obtenu et preuve conservée. Un test qui accepte le comportement fautif n’est pas une correction. Les snapshots doivent être revus, pas mis à jour pour obtenir du vert. Les moteurs ont besoin d’oracles indépendants ou de cas calculables, pas uniquement de comparaisons à leur propre ancienne sortie.

### C4 Critères spécifiques de livraison

Avant toute publication autorisée : vérifier que l’artefact contrôlé est celui livré, que les chemins de déploiement ne se concurrencent pas, et qu’un rollback connu existe. Contrôler les GET critiques après livraison. Ne pas ajouter de télémétrie ou partager des decks privés comme effet secondaire d’une correction technique.

### C5 Conditions de réévaluation du verdict

Tous les P1 doivent être corrigés et protégés, les limites de modèle cohérentes dans l’UI et les textes, les défauts P2 restants explicitement acceptés, et les validations manquantes importantes traitées ou assumées. Une note globale plus élevée ne remplace pas cette revue. Documenter le nouveau verdict dans une version datée sans altérer les observations de 2026-09-06.

## Annexe D Validations restant ouvertes

| ID | Sujet non vérifié | Pourquoi ouvert | Preuve attendue |
|---|---|---|---|
| V01 | LCP INP CLS et TTFB terrain | Pas de mesure normalisée accessible | Mesures datées, profil et distribution |
| V02 | Vercel et protection de branche | Réglages privés non inspectés | Configuration de checks et publication |
| V03 | WCAG 2.2 AA complète | Contrôles partiels, F07 démontré | Audit automatisé pertinent et manuel |
| V04 | Safari et mobile physiques | Navigateur intégré uniquement | Parcours ciblés sur risques identifiés |
| V05 | Export PNG PDF JSON | Aucun fichier généré durant l’audit | Fichiers comparés aux résultats affichés |
| V06 | Comparaison et post-board complets | Code et tests seulement sur plusieurs aspects | Parcours avec oracles de populations |
| V07 | Cartes MTG spéciales exhaustives | Couverture ciblée, modèle limité | Matrice de support versionnée |
| V08 | Sentry effectif et données reçues | Pas de reçu d’événement consulté | Événement non sensible vérifié |
| V09 | Conformité juridique globale | Pas de revue des contrats/logs tiers | Validation compétente des mentions |
| V10 | Search Console et indexation réelle | Accès non consulté | Inspection des URLs et statuts |
| V11 | Tous les retours arrière et liens partagés | Tests de codec, pas tous les enchaînements UI | Scénarios navigation versionnés |
| V12 | Liens externes de la bibliothèque | Pas de contrôle intégral des 65 références | Inventaire daté des destinations |

## Annexe E Modèle de ticket et suivi

**Titre :** identifiant Fxx et comportement à corriger. **Référence :** version 1.0 du présent rapport et commit initial. **Portée :** fonctions et parcours concernés, exclusions explicites si nécessaires. **Problème :** attendu, obtenu, entrée minimale et niveau de preuve. **Priorité :** P1/P2/P3 avec impact utilisateur.

**Proposition :** contrat visé, fichiers susceptibles de changer, compatibilité des sauvegardes et données, dépendances avec les autres tickets. **Validation :** liste Fxx-ACn, oracles, tests à exécuter et preuves à conserver. **Risques :** régression possible, données à préserver, conditions de rollback. **Clôture :** commit, PR, date, environnement, résultat de chaque AC et validations encore ouvertes.

États recommandés : ouvert ; reproduction confirmée ; solution revue ; corrigé ; vérifié ; livré ; régression. « Corrigé » ne signifie pas « vérifié », et « vérifié » ne signifie pas « déployé ». Aucun ticket externe n’a été créé par cette livraison.
