# David — L’Architecte : 3,00/5

Audit du 9 septembre 2026, persona 5 de `docs/personas/mtg-player-personas.md`. Évaluation simulée par agent, pas entretien avec un utilisateur réel. Navigation exécutée sur https://www.manatuner.app dans un onglet CUA dédié. Aucun audit numérique exhaustif ni preuve d’identité entre code local et production. Documents S002 et DELIVERY-CONTRACT lus comme contexte historique. Le navigateur expose Engine v2.7.9 ; ce libellé ne certifie pas le commit publié. Mobile non testé.

## Première impression simulée, 30 secondes

« Je vois un outil ouvert, une bibliothèque avec Karsten et des probabilités accessibles. Mais “Exact Probabilities” et un score de santé présenté comme la proportion de sorts lancés demandent une définition précise de l’événement. Avant d’intégrer ce résultat à mon notebook, je veux savoir ce qui est conditionné, approximé et exporté. »

## Parcours réellement effectué

1. **Accueil** : lecture de la promesse, du résultat d’exemple, de la référence Karsten et du lien GitHub. L’accroche explique les rocks/dorks ; la page annonce 54 articles, des probabilités exactes et zéro donnée envoyée, tout en signalant ailleurs les noms de cartes envoyés à Scryfall.
2. **Mathematics**, via le pied de page : lecture de la distinction Karsten/castabilité, puis ouverture des accordéons Hypergeometric et Bellman. Les formules et limites sont présentes. Le bandeau annonce le modèle goldfish physique, mais les sections suivantes décrivent encore Realistic/Perfect drops et des approximations de couleurs/séquençage. La frontière entre documentation actuelle et ancienne est trop coûteuse à reconstruire.
3. **Library** : lecture des compteurs (65 articles, 46 live, 13 archived, 6 lost), du parcours Pro Tour et des outils de citation. Activation du BibTeX pour Karsten 2022 : toast « BibTeX copied! » constaté ; lecture du presse-papiers vide avec cet environnement, donc contenu non validé et aucun défaut de copie affirmé.
4. **Analyzer** : analyse du deck public Nature’s Rhythm déjà présent. Résultat : 60 cartes, 23 terrains, Health Score 91/100 et deux couleurs sous les cibles Karsten. Lecture du Mulligan, puis Castability, passage de **MANA ESTIMATES** à **EXACT GOLDFISH POTENTIAL**. Les 14 lignes deviennent indisponibles pour la restriction Abandoned Air Temple, avec motif explicite. Aucun pourcentage de remplacement n’est inventé.
5. **Blueprint** : consultation de la matrice et ouverture du menu d’export : PNG, PDF, JSON et **CSV (Sheets / Pandas)**. Formats présents, contenu des fichiers non vérifié dans ce parcours.
6. **Privacy** : page directe relue après chargement ; promesses absolues sur l’absence de transmission d’informations de deck. Le lien GitHub est exposé et activé ; la destination n’a pas été inspectée, donc aucune revue du code public n’est revendiquée.

## Points positifs

- Le contrat de l’Analyzer est beaucoup plus précis que sa vitrine : absence de mulligans et de probabilité de piocher le sort cible, paiement par sources physiques distinctes, limites du modèle et refus des mécaniques non couvertes.
- Le mode exact explicite la connaissance complète de l’historique tiré, donc la borne supérieure pour un jeu sans prescience, ainsi que 0 % de removal et 100 % de survie du ramp. Cette précision me permet de comprendre ce que je pourrais citer.
- Bellman optimise explicitement un score heuristique, pas le win rate. La politique limitée à quatre cartes et le bottoming heuristique sont indiqués. Le choix 3k/10k/50k rend le coût de simulation compréhensible.
- La bibliothèque propose auteurs, années, statut de disponibilité, archives, parcours avancé et export bibliographique. L’inventaire Yahi, Chapin et les sources de théorie offrent une vraie valeur de recherche documentaire.
- CSV, JSON, fonctionnement sans compte et accès visible au code réduisent la dépendance à l’interface. Il serait incorrect de qualifier le produit de boîte noire sans export.

## Frictions et manques

**P0 : aucun défaut bloquant global démontré par David.** Une indisponibilité déclarée hors périmètre ne constitue pas une probabilité fausse. Les calculs n’ont pas été comparés ici à un oracle indépendant.

**P1 — Cohérence méthodologique.** La page Mathematics mélange l’ancien modèle et le nouveau ; l’accueil promet davantage que ce que les avertissements de l’Analyzer garantissent. David risque de citer une mauvaise définition en suivant le lien officiel « Probabilities ». L’exemple commercial de score 87 % comme proportion de sorts sur courbe est particulièrement trompeur face au score marginal d’accès aux couleurs effectivement défini dans les résultats.

**P1 — Démonstration exacte peu convaincante.** Le deck d’exemple produit 14 refus à cause d’un terrain. Le refus est sain, mais il empêche de découvrir une seule valeur exacte avec le parcours conseillé. Il manque un exemple entièrement compatible et une liste de couverture directement exploitable.

**P1 — Reproductibilité à compléter.** Aucun lien de documentation d’API ou schéma d’export n’a été rencontré dans les pages visitées. CSV existe ; sa complétude, les hypothèses conservées, la version du moteur, les paramètres et la possibilité de rejouer le calcul restent non établies. C’est une limite de vérification et de découverte, pas une preuve d’absence dans tout le dépôt.

**P1 — Contrat de confidentialité discordant.** Privacy et le compteur zéro de l’accueil contredisent l’explication Scryfall visible sur la même vitrine. Je ne peux pas défendre une promesse absolue sur la seule base du traitement local. Cette observation éditoriale ne constitue pas une qualification juridique.

**P2 — Bibliothèque à stabiliser.** Les compteurs 54/65 et le texte « Five » au-dessus de sept lectures affaiblissent le soin éditorial. Les références m’intéressent, mais leur contenu, leurs paywalls et leur disponibilité complète n’ont pas été certifiés. Le besoin de données métagame longitudinales est hors du périmètre actuel du produit ; il ne doit pas déclencher une refonte injustifiée.

## Notes officielles

| Axe           |  Note /5 | Justification                                                                                                |
| ------------- | -------: | ------------------------------------------------------------------------------------------------------------ |
| Accessibilité |        4 | Mission et chemins Analyzer/Math/Library immédiatement identifiables pour un expert anglophone.              |
| Pertinence    |        3 | Utile pour le mana et la bibliographie ; intégration au travail de recherche encore incomplète.              |
| Profondeur    |        3 | Contrats et modèles explicités, mais démonstration exacte bloquée sur l’exemple et schéma non découvert.     |
| Utilisabilité |        3 | Parcours exécutables et exports faciles à trouver ; documentation contradictoire oblige à interpréter.       |
| Confiance     |        2 | Bons avertissements au point de calcul, contrebalancés par les affirmations publiques excessives.            |
| Partage       |        3 | Je partagerais une référence de Library ; je ne publierais pas encore un résultat comme preuve scientifique. |
| **Moyenne**   | **3,00** | **18/6 ; comparaison descriptive avec 4,17 au 1er août : −1,17.**                                            |

## Verdict simulé

Je reviendrais pour les références et des vérifications exploratoires de mana. Je recommanderais la Library à un collègue de testing, avec un lien d’article ou une citation après contrôle. Je n’en ferais pas encore la source principale d’un article technique : il faut pouvoir associer chaque résultat à son contrat et à un export reproductible. La baisse par rapport à août décrit cette nouvelle évaluation du site public, sans prouver une régression précise du code.

## Recommandations propres à David

1. Unifier accueil, Mathematics et liens contextuels autour des deux modes actuels ; réserver « exact » à l’événement explicitement couvert.
2. Fournir un second exemple compatible avec le moteur exact et une couverture des mécaniques consultable avant calcul.
3. Documenter le CSV/JSON existant avec schéma versionné, paramètres, définition des champs et un petit notebook de reproduction ; mesurer un aller-retour export/relecture sans perte d’hypothèses.
4. Aligner Privacy et les résumés de confidentialité sur les transmissions effectivement documentées, puis faire vérifier la version publiée.
5. Conserver BibTeX, archives et auteurs ; dériver tous les compteurs du même inventaire et contrôler un échantillon de citations contre les sources primaires.
