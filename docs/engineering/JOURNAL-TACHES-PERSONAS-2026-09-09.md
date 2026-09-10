# Journal des tâches — suite de l’audit personas

Créé le 9 septembre 2026. État initial : toutes les tâches ouvertes au 9 septembre. Reprise du 10 septembre en cours, preuves dans `persona-validation-mfydqnp5/`.

Références : [passation](../handoff/HANDOFF-PERSONAS-2026-09-09.md), [audit](../session/PERSONA_AUDIT_2026-09-09.md), [suivi S002](SUIVI-CORRECTIONS-MANATUNER-2026-09-06.md), [contrat de livraison](DELIVERY-CONTRACT.md).

## Fonctionnement du registre

Pour chaque tâche, renseigner responsable, reproduction datée, fichiers attribués, décision, preuves et état. Statuts locaux : ouvert → investigation → en cours → vérifié localement ; bloqué si raison concrète. Publication séparée : non publiée → publiée à vérifier → vérifiée en production, avec SHA/URL/date. Ne pas marquer une tâche vérifiée parce qu’un texte a simplement été changé.

P1 : confiance ou parcours principal fortement affecté. P2 : amélioration ou validation complémentaire. Aucun P0 global démontré dans l’audit. Les responsables ci-dessous sont proposés, pas déjà mobilisés. Avant toute implémentation, comparer le constat à S002 et classifier : déjà corrigé localement / reproduit dans le candidat / observé seulement en production / vérification manquante.

## Tableau de pilotage

| ID  | Priorité       | Tâche                                 | Dépendances                             | Responsable proposé      | État local                                                        | Publication        |
| --- | -------------- | ------------------------------------- | --------------------------------------- | ------------------------ | ----------------------------------------------------------------- | ------------------ |
| T00 | P1             | État initial et candidat public/local | —                                       | coordination + livraison | Vérifié localement, SHA public inconnu                            | Non publiée        |
| T01 | P1             | Contrat commun et textes publics      | T00                                     | produit + éditorial      | Vérifié localement                                                | Non publiée        |
| T02 | P1             | Diagnostic et sens des indices        | T01                                     | produit + frontend       | Vérifié localement                                                | Non publiée        |
| T03 | P1             | Indisponibilités et comparaison       | T00, T01                                | moteur + frontend        | Vérifié localement                                                | Non publiée        |
| T04 | P1             | Exemples exact et Commander           | T01, T03                                | moteur + produit         | Vérifié localement                                                | Non publiée        |
| T05 | P1             | Aide London, multijoueur, commandant  | T01                                     | produit + frontend       | Vérifié localement                                                | Non publiée        |
| T06 | P1/P2          | Relecture pédagogique et compteurs    | T01                                     | éditorial MTG            | Vérifié localement                                                | Non publiée        |
| T07 | P2             | Exports et partage vérifiés           | T02, T03                                | frontend + QA            | Vérifié localement ; confirmation visuelle utilisateur en attente | Non publiée        |
| T08 | P2             | Mobile, clavier et apparence          | Lots UI stabilisés                      | QA                       | Vérifié localement ; confirmation visuelle utilisateur en attente | Non publiée        |
| T09 | P2             | Compréhension par de vrais joueurs    | T02, T04, T07                           | produit + utilisateur    | Bloqué : participants réels absents                               | Sans objet : étude |
| T10 | P1             | Gate final et dossier de livraison    | T01–T08 traitées ou réserves explicites | livraison + QA           | Gate complet vérifié                                              | Non publiée        |
| T11 | Conditionnelle | Publication et contrôle public        | T10 + autorisation actuelle             | livraison                | Commit/push conditionnels autorisés ; déploiement exclu           | Non publiée        |

T09 nécessite des participants réels ; son absence ne doit pas empêcher les corrections et tests techniques indépendants. Une limite d’accès aux métadonnées de production en T00 ne bloque pas les travaux locaux après comparaison aux sources et à S002 ; elle reste explicitement ouverte.

## T00 — établir l’état de départ

**Source :** tous profils, divergence public/local ; rapports experts du 9 septembre.

- [x] Relever branche/HEAD, `git status --short`, Node/npm, ports occupés et fichiers préexistants à protéger.
- [x] Vérifier `.nvmrc`, engines, CI, Vercel et compatibilité ; résoudre une incompatibilité nécessaire au candidat sans lancer une mise à jour générale de dépendances.
- [x] Établir le SHA/artefact public si accessible en lecture seule ; sinon consigner précisément la limite. Ne pas déduire le SHA du label Engine.
- [x] Construire une matrice constat persona → source locale → correction S002 → observation publique → travail restant.
- [x] Définir explicitement le candidat intégrant les modifications pertinentes non commitées ; ne pas perdre ces fichiers en créant un worktree depuis HEAD.

**Acceptation :** matrice datée et candidat identifiable, périmètre/fichiers attribués, aucun rapport ou changement utilisateur écrasé. **Preuve :** `baseline.md`, statut Git et matrice dans un nouveau dossier de campagne.

## T01 — contrat de vérité commun

**Source :** six profils, confiance moyenne 2,33/5. **Routes :** `/`, `/guide`, `/mathematics`, `/about`, `/privacy`, textes Analyzer et exports concernés.

- [x] Définir les événements calculés en estimation et en exact, hypothèses, exclusions et limites de couverture.
- [x] Définir séparément Health, Blueprint et Mulligan ; aucune assimilation à un taux de victoire ou proportion de sorts lancés.
- [x] Aligner les informations de traitement local, noms Scryfall et contenu des liens de partage sur les flux réellement documentés.
- [x] Réconcilier textes, aide, métadonnées et contenu prérendu ; réutiliser les corrections existantes.

**Acceptation :** aucun slogan absolu contredit par le contrat ; chaque page renvoie à la bonne définition du mode. Local et HTML construit inspectés séparément. F12-AC5 juridique reste ouvert. **Preuve :** matrice avant/après avec routes et captures/texte rendus.

## T02 — diagnostic → action → détails

**Source :** Léo/Sarah en priorité ; confusion Health 91 / Blueprint 92 / Mulligan 54.

- [x] Sous le diagnostic, montrer le déficit principal et une action existante à suivre (Manabase, paramètre, comparaison).
- [x] Expliquer pourquoi plusieurs indices diffèrent sans modifier leurs formules pour les rendre artificiellement identiques.
- [x] Garder hypothèses avancées accessibles ; réduire leur poids dans la première lecture sans cacher les réserves essentielles.

**Acceptation :** le cas midrange distingue score favorable et déficits de sources ; aucune recommandation de victoire ou keep non justifiée. Explication des indices accessible depuis les surfaces qui les affichent. **Preuve :** parcours avant/après et vérification de stabilité des valeurs pour les mêmes données/paramètres.

## T03 — indisponibilités et comparaison

**Source :** Sarah/Karim Compare 14 lignes indisponibles ; Natsuki/David exact Abandoned Air Temple ; Thibault Analysis Command Tower.

- [x] Reproduire dans un contexte de test isolé avec deux builds explicitement identifiés, dont une modification réelle de source.
- [x] Déterminer séparément : défaut de persistance/comparaison, incompatibilité de paramètres, limite du modèle.
- [x] Donner un motif exploitable et une action adaptée ; recalculer sous hypothèses communes lorsque possible.
- [x] Distinguer compteurs « aucune donnée calculée » et « aucun sort à risque ».

**Acceptation :** comparaison d’un couple compatible exploitable, cas incompatible expliqué ; aucune valeur de remplacement inventée ; identiques/différents et rechargement vérifiés. **Preuve :** données publiques de test, paramètres, attendu/obtenu, tests ciblés de régression si correction fonctionnelle.

## T04 — exemples démonstratifs

**Source :** parcours exact entièrement indisponible sur midrange, EDH partiellement couvert.

- [x] Proposer un exemple simple compatible avec le modèle exact et en vérifier les résultats contre une référence indépendante adaptée.
- [x] Présenter Atraxa comme démonstration d’estimation avec 99+1, quatre couleurs et horizon T4–T8 clairement expliqués.
- [x] Annoncer les mécaniques non couvertes avant une bascule de mode ; conserver les garde-fous.

**Acceptation :** depuis l’accueil, exemple exact produit des valeurs supportées ; exemple EDH produit des estimations interprétables avec couverture explicite. Aucun élargissement du moteur obligatoire pour faire passer l’exemple. **Preuve :** deux parcours complets, fixture et validation du cas exact.

## T05 — mulligan et commandant

**Source :** Léo/Natsuki/David/Thibault ; aide non adaptée au mode multijoueur.

- [x] Expliquer sept cartes puis bottoming London et le premier mulligan gratuit dans le mode correspondant.
- [x] Synchroniser libellés de seuils avec mode actif, sans diagnostiquer un défaut de valeur par défaut sur le stockage partagé de l’audit.
- [x] Unifier détection du commandant explicitement marqué, résumé 99+1 et documentation du ramp réellement pris en charge.
- [x] Distinguer score heuristique, plan tour par tour non supporté et probabilité de victoire.

**Acceptation :** duo/multijoueur, activation/désactivation et nouvelle session concordants ; pas de « six cartes après le premier mulligan » dans le cas gratuit ; aucun plan inventé hors modèle. **Preuve :** simulation ciblée, paramètres et captures des deux modes.

## T06 — contenu et bibliothèque

**Source :** note FNM/sideboard, compteur Home 54 / Library 65, parcours de lecture et glossaire.

- [x] P1 : corriger la généralisation FNM et relire les exemples de règles ; vérifier les textes de cartes sur une source primaire quand accessible, sinon expliciter la limite.
- [x] P2 : dériver compteurs accueil/Library/parcours du même inventaire.
- [x] P2 : faciliter l’entrée First FNM et conserver auteurs, archives, états lost et citations.

**Acceptation :** chaque chiffre affiché correspond à son inventaire ; description de terrain compatible avec exemples ; pas de promesse de validité de tous les liens externes sans contrôle. **Preuve :** inventaire des textes corrigés, références et routes vérifiées.

## T07 — artefact et partage

**Source :** Sarah/Karim/Natsuki/David/Thibault ; menus CSV/JSON déjà présents.

- [x] Conserver nom du deck, définition de chaque indice, version et hypothèses dans l’artefact ; documenter les champs existants avant de changer un schéma.
- [x] Tester un vrai lien `#d=` copié puis ouvert dans un contexte de test séparé, et comparer deck/paramètres effectivement transportés.
- [x] Télécharger et inspecter PNG, PDF, JSON et CSV ; contrôler totaux, lisibilité, pagination et import tabulaire.
- [x] Si l’outillage refuse une action, utiliser une autre méthode autorisée ou une vérification manuelle ; ne pas contourner un blocage de politique.

**Acceptation :** preuves de contenu et restitution, pas seulement un toast ; limite de portabilité des paramètres annoncée si pertinente. Aucun message envoyé. **Preuve :** artefacts publics de test, contrôles et captures, sans données personnelles.

## T08 — validation d’interface effective

**Source :** mobile, sombre, clavier non validés dans cet audit.

- [x] Vérifier largeur DOM réelle avant d’affirmer un test mobile (360/390, 768 et desktop).
- [x] Parcourir exemple → diagnostic → Manabase → comparaison → partage/export ; débordement, lisibilité et contrôles accessibles.
- [x] Tester clavier, dont Edit Deck, focus et onglets ; clair/sombre si pris en charge. Ne pas ajouter un thème pour satisfaire le test.
- [x] Pour chaque lot frontend : vérifier serveur, ouvrir la page, fournir URL et demander la confirmation visuelle prévue par les consignes du projet quand le lot est prêt.

**Acceptation :** dimension, navigateur et résultats documentés ; appareils physiques/lecteur écran marqués non testés s’ils ne le sont pas. **Preuve :** captures et compte rendu ; aucun label de conformité globale fondé sur ces seuls contrôles.

## T09 — compréhension réelle

**Source :** les six évaluations sont simulées.

- [ ] Organiser avec l’utilisateur des essais débutant, FNM/RCQ et Commander, sans contacter personne sans autorisation.
- [ ] Demander ce que mesure le score, la modification envisagée, les limites comprises et quel résultat serait partagé.
- [ ] Consigner erreurs de compréhension, temps de parcours et hésitations sans collecter les decklists personnelles.

**Acceptation :** observations de participants réels distinguées des simulations ; priorités ajustées selon les difficultés constatées. Participants manquants = bloqué, jamais inventé. **Preuve :** compte rendu anonymisé et critères établis avant essais.

## T10 — candidat prêt à livrer

**Source :** DELIVERY-CONTRACT. Aucun ancien chiffre de test n’est une preuve actuelle.

- [x] Lint/types et tests ciblés pertinents, puis gate complet sur le candidat final.
- [x] Dossier neuf avec chemins absolus ; conserver logs d’échec et de succès sans écraser S001/S002 ni les rapports existants.
- [x] Vérifier artefact, HTML/routes, budget, audit dépendances et scénarios Chromium du gate.
- [x] Relecture indépendante des modifications et journal ; séparer tâches vérifiées, réserves UX, étude utilisateurs et juridique.

**Acceptation :** `npm run build:vercel` réussi sans soft-fail sur le candidat identifié ; bilan honnête des réserves, URLs de revue et demande de publication seulement si souhaitée. **Preuve :** log complet, SHA + état du candidat, artefact et matrice de critères.

## T11 — seulement après autorisation de publication

- [ ] Obtenir une demande actuelle de publication, puis suivre le chemin de livraison prévu.
- [ ] Relier déploiement final à son SHA/artefact, vérifier pages publiques et parcours corrigés.
- [ ] Ne marquer « vérifiée en production » que les tâches contrôlées sur les URLs réellement servies.

**Acceptation :** preuve publique datée ; sinon conserver « vérifié localement ». Cette tâche n’autorise aucun push ou déploiement.

## Commandes de reprise et de validation

Depuis la racine du projet, exécuter d’abord les lectures de contexte. Commandes de diagnostic :

```sh
git status --short
git rev-parse HEAD
node --version
npm --version
```

Serveur, après avoir vérifié le port :

```sh
curl -I http://localhost:3000/
npm run dev -- --host 127.0.0.1 --port 3000 --strictPort
```

La commande dev lance un serveur durable : ne la relancer que si nécessaire. URLs principales de revue : `http://localhost:3000/`, `/analyzer`, `/guide`, `/mathematics`, `/privacy`, `/about`, `/library`, `/land-glossary`, `/my-analyses`. `curl` seul ne vérifie pas le rendu ni l’identité du candidat.

Créer un dossier neuf une fois pour la campagne, après vérification de Node compatible. Conserver le chemin retourné pour la reprise :

```sh
persona_evidence_dir="$(mktemp -d "$PWD/docs/engineering/persona-validation-XXXXXXXX")"
npm run lint
npm run type-check
```

Choisir les tests ciblés selon le changement. Pour le gate final, dans le même shell :

```sh
env -u SENTRY_AUTH_TOKEN -u SENTRY_ORG -u SENTRY_PROJECT   VITE_SENTRY_DSN=''   PRERENDER_DIST="$persona_evidence_dir/dist"   DELIVERY_TEST_OUTPUT="$persona_evidence_dir/browser"   MANATUNER_MATH_EVIDENCE_DIR="$persona_evidence_dir/math"   npm run build:vercel > "$persona_evidence_dir/delivery.log" 2>&1
```

Contrôler le code de sortie et lire le log, ne pas déclarer le gate réussi parce que la commande a démarré. Le gate exécute aussi les tests ; ne pas relancer toutes les suites sans nouvelle raison. Ports 4174/4175 réservés aux contrôles ; ne pas réutiliser un serveur préexistant. Aucun déploiement n’est lancé par ces instructions.

## Journal d’exécution à compléter

| Date       | ID             | Responsable | Avant / constat reproduit  | Action et fichiers                            | Validation exécutée                     | Preuve                          | État local             | État public / blocage        |
| ---------- | -------------- | ----------- | -------------------------- | --------------------------------------------- | --------------------------------------- | ------------------------------- | ---------------------- | ---------------------------- |
| 2026-09-09 | Initialisation | Codex       | Audit six personas terminé | Création du registre, sans correction produit | Lecture croisée des rapports et contrat | Passation et audit liés en tête | Toutes tâches ouvertes | Aucune publication autorisée |

Pour chaque nouvelle entrée, noter commandes, échecs, décisions, durée si mesurée et prochaine action. Maintenir le tableau de pilotage et les cases de la fiche concernée. Ne pas effacer les lignes précédentes.

## Reprise du 10 septembre 2026 — campagne mfydqnp5

Responsables mobilisés : agent-organizer (context-manager absent), product-manager (contrat/rédaction/revue), devops-engineer (état livraison/QA), lead (implémentation/intégration). Aucun rôle frontend/QA local inexistant présenté comme exécuté.

| Date       | ID      | Responsable            | Avant / constat reproduit                                                                                                                               | Action et fichiers                                                                                                                    | Validation exécutée                                                            | Preuve                                                                                            | État local                     | État public / blocage                                    |
| ---------- | ------- | ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------- | ------------------------------ | -------------------------------------------------------- |
| 2026-09-10 | T00     | livraison              | HEAD local/remote `2ba772a`, 50/50 fichiers S002 identiques; artefact public différent, même HTML pour routes et404 HTTP200; status Vercel HEAD failure | `.nvmrc`20→22; candidat HEAD + corrections explicites + exclusion Vitest préexistante pertinente                                      | Git/hash/HTTP en lecture seule                                                 | [rapport livraison](persona-validation-mfydqnp5/delivery/REPORT.md), baseline/status/preservation | Vérifié avec limite SHA public | SHA servi inconnu; aucun distant modifié                 |
| 2026-09-10 | T01/T06 | produit                | Résidus texte score, Commander, FNM, terrains; compteurs parcours statiques                                                                             | Home/Guide/LandGlossary/seed/glossary; contrat commun                                                                                 | 21 tests éditoriaux + lint passent; rendu final en cours                       | [contrat et matrice](persona-validation-mfydqnp5/product-contract.md)                             | Corrigé                        | Non publié; revue juridique F12-AC5 ouverte              |
| 2026-09-10 | T02     | lead                   | Blueprint poids40/20/25/15 distinct de Health; aucune erreur numérique démontrée                                                                        | définitions partagées, détail indices et priorité couleur/action Manabase, formules préservées                                        | navigateur local exact Health99/potentiel98; tests indépendants                | comparaison-tests-final.log; QA                                                                   | En validation                  | Non publié                                               |
| 2026-09-10 | T03     | lead + revue organizer | motifs conservés par moteur/persistance mais ignorés Compare; sideboard/commandant inclus à tort                                                        | helper résultat, motif/action, contrat snapshot, comptage calculés, filtrage populations                                              | 55 tests préexistants ciblés;2 nouveaux tests combinatoire/persistance passent | comparison-tests-final.log; QA                                                                    | En validation                  | Non publié                                               |
| 2026-09-10 | T04/T05 | lead                   | Pas d'exemple exact accessible; aide six cartes erronée pour premier mulligan gratuit                                                                   | sample exact24 Plains/36 Savannah Lions (fixture de démonstration); aide conditionnelle/indices heuristiques; choix archetype clavier | exemple exact CUA98%; oracle indépendant; parcours QA en cours                 | tests/comparison + QA                                                                             | En validation                  | Non publié                                               |
| 2026-09-10 | T07/T08 | lead + QA              | nom deck remplacé par date dans Blueprint; contexte exports insuffisant; paramètres partage non transportés                                             | nom conservé, version/définitions/hypothèses, flags CSV sideboard/commandant; comparaison défilable clavier                           | vrai clipboard/nouveau contexte; tailles360/390/768/1440 et thèmes; artefacts  | dossier QA                                                                                        | En validation                  | Non publié; appareils physiques/lecteur écran non testés |
| 2026-09-10 | T10     | lead                   | Gate01 erreur typage spy privé du test neuf; Gate02 dossier math explicite non créé                                                                     | Correction typage test, création répertoire neuf, aucune assertion affaiblie                                                          | gate03 relancé intégralement                                                   | gate-01/02/03.log                                                                                 | En cours                       | Publication non vérifiée                                 |

T09 : aucun participant réel ni contact externe. Protocole prévu : demander à un débutant, un joueur FNM/RCQ et un joueur Commander d'expliquer le score, le déficit prioritaire, le changement envisagé, la couverture et le contenu partagé ; relever erreurs/temps/hésitations sans decklists personnelles. Ne pas fabriquer observations ni notes.

Autorisation actuelle : la dernière phrase utilisateur permet commit et push après non-régression réussie. Elle ne demande pas de déploiement. L'intégration native Vercel peut réagir au push ; résolution de cette contrainte requise avant mutation distante. Aucune activation Sentry ou communication externe.

### Clôture technique du 10 septembre — candidat dist-06

[Bilan final](persona-validation-mfydqnp5/FINAL.md), [manifest](persona-validation-mfydqnp5/verified-manifest.json), [QA](persona-validation-mfydqnp5/qa/REPORT.md).

T00–T07 vérifiés localement selon les preuves finales ; T08 vérifié techniquement, confirmation visuelle utilisateur encore attendue ; T09 bloqué faute de participants ; T10 gate complet acquis avec réserves explicites. T11 publication applicative non autorisée ; commit/push sur branche dédiée exclue des déploiements automatiques, sans pushmain.

799tests/79fichiers +3tests du gate +101routes +61Chromium +8WebKit acquis. Firefox8cas bloqués avant navigation, y compris après installation isolée neuve ; ce n'est pas un succès ou un défaut applicatif prouvé. Voir FINAL pour les réserves juridiques/humaines et avis moderate de dépendances dev.

Revue exports : deux pages PDF rendues/inspectées, PNG complet, CSV lu par parseur indépendant ; flags commandant/sideboard et totaux vérifiés. Revue sombre : problèmes CSS découverts puis corrigés, axe ciblé aux quatre dimensions/deux thèmes. Trois rapports préexistants strictement préservés, vitest.config.js inclut sa seule exclusion préexistante pertinente.

## Résidus R01–R07 — campagne du10septembre2026

Corrections et nouvelle validation dans [FINAL](reaudit-fixes-szrp1r9w/FINAL.md). Gate04:801tests/79fichiers+3tests gate+101routes+16Chromium, audit33 et personas23. Motifs Compare, chiffres, modèle/FAQ, confidentialité, EDH/CSV et fixture vérifiés. Fond sombre/contrastes découverts pendant validation puis corrigés, traces des échecs conservées. Dernière autorisation de cette mission : uniquement branche codex/persona-followup-2026-09-10, pas main/merge/déploiement. Confirmation utilisateur et validations externes distinctes.
