> Contrat vivant, harmonisé lors du lot A3. Les preuves historiques restent dans [le rapport de clôture](../completion-2026-09-05/REPORT.md).

# Périmètre du moteur physique

Ce moteur calcule la probabilité que les cartes tirées admettent **au moins une séquence légale de production de mana** dans le modèle ci-dessous. Ce résultat mesure un potentiel. Il est une borne supérieure pour une politique de jeu qui ne connaît pas les futures pioches ; il n'est pas une probabilité de victoire, ni une probabilité de tirer puis lancer le sort.

## Contrat

- Bibliothèque finie uniforme sans remise, sans mulligan ; main initiale de sept ; mode play/draw explicite.
- Tours 1 à 10, bibliothèque jusqu'à 1 000 cartes. Le sort est une demande de mana extérieure au tirage, pas une carte retirée de la bibliothèque ni conditionnée comme déjà en main.
- Coûts génériques, W/U/B/R/G/C, hybrides de deux couleurs, X fixé explicitement (2 dans l'interface). Les autres symboles produisent un statut non pris en charge.
- Terrains physiques avec leurs couleurs communes et leur entrée engagée/dégagée. Le chemin exact admet actuellement les catégories basic, dual, triome, fast, slow, check et battle, sous leurs contrats de métadonnées, sans fetch ni restriction supplémentaire ; seul le cycle fermé des dix pathways terrain/terrain est ajouté parmi les MDFC (voir [son contrat](../pathways-2026-09-05/MODEL.md)) ; une classification correcte en amont reste une hypothèse.
- Producteurs dont le contrat d'activation a été vérifié : Llanowar Elves, Elvish Mystic, Fyndhorn Elves, Birds of Paradise et Sol Ring. Les coûts, sorties, délais et restrictions sont contrôlés ; le nom seul ne suffit pas. Leurs textes ont été consultés via l'API Scryfall et sont conservés dans card-sources.json.
- Aucun retrait adverse, aucun autre effet de carte, aucune règle de remplacement, aucun effet de pioche supplémentaire ou de vie. Une probabilité de retrait non nulle n'est pas prise en charge dans les lignes exactes de l'interface.
- Une seule pose de terrain par tour ; les sources utilisées sont engagées ; le mana dépensé disparaît ; le mana flottant restant peut payer une autre action pendant le même tour, mais ne passe pas au suivant ; les dorks ont leur délai et les terrains engagés se dégagent au tour suivant.

## Calcul

Chaque catégorie physique contient un nombre de cartes identiques pour les actions représentées. Les mains initiales sont énumérées avec un poids multivarié `produit C(N_i,x_i) / C(N,7)`. Chaque pioche suivante a une probabilité `cartes restantes de la catégorie / total restant`.

Pour une histoire de tirage donnée, l'algorithme conserve l'ensemble des états atteignables par des actions légales. Un état contient la main, les permanents, les sources encore disponibles, le mana flottant et l'indicateur de terrain déjà posé. Les paiements explorent les alternatives de couleur et consomment chaque unité une seule fois. Les états identiques sont fusionnés. À la fin du tour, le mana est vidé et les permanents deviennent disponibles au prochain dégagement.

Pour un modèle contenant uniquement des terrains inconditionnels dégagés produisant chacun une unité, l'ordre des tirages peut être éliminé : une pioche nouvelle par tour permet de poser le sous-ensemble requis de taille au plus t. Une énumération multivariée des cartes vues, suivie d'un appariement des pips avec les sources distinctes, calcule alors exactement le même événement plus rapidement.

Les combinaisons de production utilisent des produits en virgule flottante ; les oracles indépendants utilisent BigInt et l'énumération de cartes physiques. « Exact » désigne l'événement et l'énumération, avec une tolérance numérique vérifiée ; cela ne signifie pas arithmétique rationnelle infinie en JavaScript.

Le champ p2 est la probabilité de paiement. Le champ p1 conditionne sur la possibilité de payer le même nombre de manas en générique, dans le même modèle. Ce p1 n'est pas la définition historique de « perfect land drops ». L'interface affiche p2 avec son intitulé de potentiel pour éviter cette confusion.

## Limite de ressources et absence de données

Le calcul s'interrompt après un budget de travail fini (250 000 par défaut dans l'API, 50 000 dans les lignes de l'interface). Un dépassement, une restriction non représentée ou des données insuffisantes renvoie `{status: 'unsupported', reason: ...}` **sans probabilité partielle**. L'interface affiche « Calculation unavailable » et la raison ; elle n'utilise pas un ancien pourcentage de repli.

Des nombres agrégés de sources ne permettent pas de reconstruire les recouvrements multicolores. Le moteur les accepte seulement quand les couleurs pertinentes permettent une reconstruction non ambiguë pour le problème considéré ; sinon il exige les terrains physiques.

## Ce qui ne devient pas exact

Les graphiques secondaires conservent des estimations explicitement nommées. Les scores de santé, de stabilité et de mulligan sont des heuristiques. Le simulateur avancé n'est pas un moteur complet de parties Commander ni un optimiseur du taux de victoire. L'ancien moteur analytique reste utilisé par certains chemins d'estimation ; ses résultats ne deviennent pas exacts du seul fait de l'existence de ce nouveau module.

La certification de toutes les interactions MTG n'est donc pas acquise. Le changement remplace les valeurs trompeuses de l'onglet principal par un calcul à domaine explicite, avec refus des cas non représentés.

## Contrats des estimations historiques et du score

Les API de `acceleratedAnalyticEngine` exposent maintenant `method` et `assumptions` sur les résultats p1/p2. Leurs agrégats et classements restent heuristiques, même lorsqu’un sous-calcul utilise le moteur physique. `producerOnlineProbByTurn`, API scalaire historique, reste une estimation à usage interne du classement ; elle ne certifie pas une activation. `calculateTempoAwareProbability` et `compareTempoImpact` conservent la méthode et le motif du refus physique jusqu’à la sérialisation des résumés. Les valeurs de scénarios égales en mode physique désignent le même potentiel, pas trois politiques optimisées.

Le score composite de recommandations a deux états : complet (nombre heuristique sur 100) ou indisponible (risque inconnu, aucun nombre ni badge de qualité). Zéro risque mesuré est une entrée complète. Les indicateurs disponibles et les recommandations restent consultables avec un avertissement de données incomplètes. Le score est dérivé à l’affichage ; aucun nouveau score numérique n’est enregistré lorsque le risque manque. Les sauvegardes historiques sans version de modèle ne deviennent pas des analyses exactes.
