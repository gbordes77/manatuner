# David — L’Architecte : 3,67/5 sur le candidat R01–R07

10 septembre 2026. Persona 5 du canon, expert Modern/Legacy, auteur technique et utilisateur de notebooks. Référence : précédent réaudit David, notes **4/4/3/3/3/4**, soit **3,50/5**. Candidat **dist-04**, servi sur http://127.0.0.1:4187 ; HEAD `e14f329` et push sur branche dédiée rapportés par le lead. **La production n’est pas évaluée ici.**

## Première impression simulée

« Cette fois, je peux expliquer à un collègue quel événement chaque mode mesure, puis importer le CSV sans deviner sa structure. Je reste attentif aux tableaux de référence : le Guide et Mathematics doivent recommander le même nombre de sources pour le même cas. » Cette appréciation incarne David ; elle ne provient pas d’un participant réel.

## Parcours et preuves réellement acquis

Mon inventaire CUA retourne encore `browsers:[]`. **Aucun clic ni nouveau parcours visuel personnel n’est revendiqué.** Cette indisponibilité d’outil ne constitue pas un défaut du candidat.

J’ai personnellement récupéré le HTML servi sur `/mathematics`, `/guide`, `/my-analyses`, `/privacy` et `/`. Les contenus ci-dessous sont donc constatés par HTTP, sans validation de l’apparence après hydratation. J’ai lu FINAL.md et REVIEW.md de `reaudit-fixes-szrp1r9w`, puis la documentation `BLUEPRINT-CSV.md`.

Vérification supplémentaire exécutée : lancement de `scripts/read-blueprint-csv.py` sur les **deux CSV téléchargés pendant la livraison dist-04**, en lecture seule. Leurs SHA-256 correspondent au rapport de campagne. Résultats : bibliothèque **60 / 24 terrains / 0 commandant / 0 réserve**, puis **99 / 43 terrains / 1 commandant / 1 réserve**. C’est une nouvelle vérification du lecteur sur des artefacts existants, pas un nouveau téléchargement navigateur.

Les résultats 801 tests et 72 scénarios Chromium appartiennent à la campagne de livraison lue ; je ne les ai pas rejoués. L’exemple exact est présent dans les liens et documenté comme fixture 24 Plains/36 Savannah Lions. Sa réussite interactive relève des preuves de livraison, pas d’une interaction personnelle de ce réaudit.

## Ce qui change réellement pour David

**La documentation distingue maintenant les événements.** L’introduction de Mathematics nomme l’estimation par défaut, le mode exact séparé et le snapshot sauvegardé. Elle exclut explicitement mulligans, pioche du sort cible et conditionnement sur une main saisie. Realistic/Perfect drops sont enfin décrits comme deux vues internes au mode estimation. Le mode exact indique la prescience, la survie complète du ramp, l’absence de removal et le refus des cas hors périmètre ou budget. La FAQ du Guide concorde. Mon précédent P1 majeur sur le mélange des modèles est résolu dans le contenu servi inspecté.

**La garantie de bonnes pioches disparaît.** Mathematics explique désormais qu’aucun nombre de terrains ne garantit les bonnes pioches à chaque partie. Bellman reste relié au score heuristique et aux redraws London, y compris le premier gratuit multijoueur. L’exemple exact est explicitement synthétique et non légal en tournoi : il sert de démonstration mathématique, sans suggérer un build compétitif.

**La recette d’import est utilisable.** Elle identifie les commentaires, la table des cartes et celle des métriques, déconseille un `pandas.read_csv` global, puis fournit un lecteur Python et la conversion des cartes en DataFrame. Mon exécution confirme les deux populations attendues, sans arrondir les valeurs exportées. Ce progrès augmente la profondeur utile du produit pour mon workflow.

**L’historique respecte mieux la promesse de confidentialité.** Le HTML vide de My Analyses annonce stockage local, requêtes Scryfall et accès Privacy. La politique détaillée conserve les destinataires, durées, limites d’effacement et portée du partage. Aucun compte ni backend supplémentaire n’est nécessaire pour ce parcours documentaire. Aucune conformité juridique n’est déduite.

## Frictions restantes

**P0 : aucun démontré.** Je n’ai identifié aucune preuve nouvelle de calcul faux.

**P1 — Référence Karsten incohérente.** Le Guide servi affiche encore, dans « Karsten Standards », **20 sources pour deux pips au tour deux**. Mathematics donne **21** dans sa table et son rappel. Cette contradiction interne est directement constatée, sans avoir besoin de qualifier la justesse du moteur. Elle concerne précisément un ajustement de deck que David pourrait publier ; elle empêche de relever la confiance à 4/5.

**P2 — Reproduction interactive volontairement limitée.** Les snapshots restent lands-only/PLAY/sans ramp ni mulligan/X=2. Le partage transporte deck, nom et onglet, pas tous les réglages. Le contrat est désormais clair ; cette limite reste pertinente pour publier une expérience paramétrée. Une recette CSV réussie ne prouve pas une API de recherche ni la reproduction complète d’une simulation.

**P2 — Découvrabilité de la recette non établie.** Le document existe dans le dépôt et fonctionne, mais mon parcours HTTP n’établit pas un accès contextuel à cette recette depuis le menu d’export. CSV est maintenant annoncé sur l’accueil et le Guide. Quelques slogans « optimal » demeurent ; ils méritent un vocabulaire cohérent avec l’objectif heuristique expliqué ailleurs.

## Notes comparées

| Axe           |    Avant |    Après | Justification                                                                                 |
| ------------- | -------: | -------: | --------------------------------------------------------------------------------------------- |
| Accessibilité |        4 |        4 | Mission et entrée exacte compréhensibles ; pas de nouvelle preuve justifiant 5.               |
| Pertinence    |        4 |        4 | Mana et exports répondent au besoin ciblé, sans devenir une plateforme générale de recherche. |
| Profondeur    |        3 |        4 | Événements clairement définis et recette CSV personnellement exécutée sur deux populations.   |
| Utilisabilité |        3 |        3 | Documentation plus actionnable, mais aucune nouvelle interaction personnelle validée.         |
| Confiance     |        3 |        3 | Contrats améliorés ; contradiction 20/21 encore significative pour un auteur technique.       |
| Partage       |        4 |        4 | Exports contextualisés et importables ; paramètres interactifs toujours non transportés.      |
| **Moyenne**   | **3,50** | **3,67** | **22/6 ; progression exacte +1/6, affichée +0,17/5.**                                         |

## Verdict

Je considérerais ce candidat comme utile pour explorer une manabase, importer ses données et partager une analyse sous hypothèses explicites. Je corrigerais la contradiction 20/21 avant de citer les recommandations du Guide. Priorités : harmoniser cette référence, rendre la recette visible depuis l’export, puis proposer un exemple de reproduction des paramètres pour les utilisateurs techniques. La progression est réelle mais limitée aux preuves acquises ; elle ne valide ni production, ni mobile, ni participant réel.
