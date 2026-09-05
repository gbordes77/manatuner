# Spécification mathématique indépendante

Audit du 5 septembre 2026. Ce document définit les événements avant de juger les implémentations. Une égalité avec un oracle ne vaut que sous les hypothèses indiquées. Les heuristiques ne constituent pas des probabilités calibrées.

## 1. Population et tirage

N est le nombre de cartes physiques de la bibliothèque au début du tirage ; K le nombre de succès ; n les cartes observées ; X le nombre de succès observés. N, K et n sont des entiers avec 0 ≤ K ≤ N et 0 ≤ n ≤ N. Chaque sous-ensemble de n cartes a la même probabilité : tirage sans remise, sans décision de mulligan ni connaissance préalable.

P(X=k) = C(K,k) C(N-K,n-k) / C(N,n).

Le support est max(0,n-(N-K)) ≤ k ≤ min(n,K). Hors support, la masse est nulle. C(0,0)=1. P(X≥a) somme les masses à partir de ceil(a), P(X≤a) jusqu'à floor(a). Pour une population invalide, l'API du projet choisit de renvoyer 0 ; cette convention de robustesse n'est pas une distribution mathématique.

P(X≥1)=1−C(N-K,n)/C(N,n). K=0 donne 0 ; K=N et n≥1 donne 1 ; n=0 donne 0. La somme des masses vaut 1 et les probabilités restent dans [0,1]. Ajouter un succès ou une observation ne diminue pas P(X≥k). Augmenter k ne l'augmente pas.

Oracle : combinaisons entières BigInt et enumeration des sous-ensembles, sans log-factorielle ni import de production. Comparaison jusqu'à N=1000, tolérance absolue 10⁻¹⁰ ; cela ne certifie pas des populations arbitrairement grandes.

## 2. Tours, formats et zones

Avant la phase principale du tour t≥1, en duel et sans effets supplémentaires : n_play=7+t−1, n_draw=7+t. Tours 1 à 10 : play 7..16, draw 8..17. Après London, une main gardée de six n'est pas un échantillon uniforme de six : elle résulte d'un choix parmi sept, et les cartes écartées sont sous la bibliothèque.

Limited utilise une liste de 40 cartes ou plus ; le construit habituel 60 ou plus. Un deck Commander de 100 cartes avec un commandant dans la zone de commandement a une bibliothèque de 99 cartes ; avec deux commandants elle peut être de 98. Le sideboard n'en fait pas partie. En multijoueur ordinaire, le premier joueur pioche au premier tour et le premier mulligan est gratuit. Les tailles de bibliothèque et les règles de départ sont deux paramètres distincts.

Les cartes connues changent la population et l'échantillon : pour un sort précis déjà en main, retirer sa carte de N et une place des cartes aléatoires observées. « Probabilité d'avoir le mana », « probabilité conditionnelle sachant que le sort est en main » et « probabilité de piocher puis lancer ce sort » ne sont pas interchangeables.

## 3. Mana total et une couleur, sans accélération

L terrains dégagés inconditionnels, S d'entre eux capables de produire la couleur demandée, coût de mana M dont c pips de cette couleur. Chaque terrain produit une unité une fois par tour. Le sort est une demande extérieure à l'événement de tirage. Sous ces hypothèses, pour M≤t :

P_mana = somme pour l≥M de HG(N,L,n,l) × P(HG(L,S,l)≥c).

P_mana=0 si M>t ; un coût nul est payable sans terrain. Cette formule inclut le coût générique. Elle est équivalente à une somme hypergéométrique multivariée sur terrains de la couleur, autres terrains et non-terrains.

La valeur conditionnelle P_couleur=P_mana/P(assez de terrains) existe seulement si le dénominateur est positif. Le choix informatique de renvoyer zéro sinon ne rend pas cette conditionnelle définie. Aucun de ces événements n'inclut le tirage du sort lui-même.

## 4. Plusieurs couleurs et sources physiques

Pour un coût WU, il faut un appariement entre les pips et des sources physiques distinctes. Une source W/U peut payer W ou U ; elle ne paie pas les deux simultanément. Les sources produisant plusieurs unités demandent un modèle de capacité et d'activation.

Pour des catégories disjointes de cartes de tailles N_i et un état tiré x_i :

P(x)=produit_i C(N_i,x_i)/C(N,n), avec somme_i x_i=n.

P(payable)=somme_x P(x) × indicatrice(existence d'un paiement légal).

L'oracle énumère les mains puis cherche par retour arrière un paiement sans réutiliser une source. min(P(W),P(U)) est une borne supérieure de l'intersection, pas son calcul exact. Le produit des probabilités n'est valable que sous indépendance, absente en général dans une bibliothèque finie.

Un hybride W/U représente l'union des paiements possibles, avec élimination des doubles comptages. C exige du mana incolore et ne signifie pas générique. « Une couleur quelconque » ne fournit pas C. Deux hybrides nécessitent deux unités. X doit être fixé avant le calcul. Neige dépend de l'origine du mana ; phyrexian dépend du paiement en points de vie ; twobrid offre une branche à deux manas ; ils exigent des états supplémentaires.

## 5. Tempo des terrains et ramp

L'état minimal comprend la main, la bibliothèque restante, les permanents présents, engagé/dégagé, le mal d'invocation, les restrictions, le terrain joué ce tour, le mana flottant et les permanents consommés. Une action doit être légale avant de modifier cet état.

Un terrain joué engagé au T1 est normalement dégagé au T2. Remplacer chaque terrain par une fraction fixe de source ne reproduit pas ce comportement. Les conditions fast/slow/check/filter/fetch dépendent du champ de bataille, des choix antérieurs et des cibles restantes.

Un dork sans célérité lancé au T1 peut normalement s'engager au T2, pas au T1. Un rock sans restriction peut être utilisé le tour de son lancement, si son coût a été payé. Sol Ring transforme un mana en deux pendant ce même tour. Une chaîne terrain→dork→rock doit payer chaque étape et ne pas engager deux fois le même permanent. Deux exemplaires du même dork sont deux objets.

P(producteur tiré ET lançable ET disponible) est une probabilité jointe. Multiplier les deux premières marginales n'est pas exact. Un facteur de survie (1−r)^e est seulement un modèle sous risque constant indépendant ; r doit être déclaré, jamais présenté comme une propriété universelle de MTG. Un rituel ou trésor consommé ne revient pas au tour suivant. Un doubleur dépend du nombre et du type des permanents affectés.

Une validation exacte du ramp demande un arbre de séquences légales sur petits decks, puis une simulation d'états légaux pour les grands decks. L'actuel moteur de Bernoulli agrégées ne satisfait pas cette spécification.

## 6. London et arrêt optimal

Chaque tentative mélange la bibliothèque et repioche sept ; après la dernière décision, le joueur met sous la bibliothèque le nombre prévu par les règles. Une politique de sélection des cartes à écarter fait partie du modèle et doit être spécifiée. Elle peut être heuristique sans être optimale.

Pour un score observable R_k de la main gardée à k cartes, un arrêt forcé à quatre, des nouveaux tirages indépendants et une politique d'écart fixée :

V*4=E[R_4], V_k=E[max(R_k,V*(k−1))] pour k=5,6,7.

Après avoir observé la main, garder si R*k≥V*(k−1). L'état de continuation est k ; les états observés incluent la main et son score. Les transitions sont les tirages suivis de la politique d'écart. L'horizon fini suffit à garantir la terminaison ; aucune convergence infinie n'est nécessaire.

La récurrence peut être exacte pour des distributions empiriques et pourtant optimiser un mauvais score. Elle ne prouve aucune optimalité de taux de victoire. Elle ne doit pas utiliser la future bibliothèque échantillonnée pour juger une main que le joueur doit évaluer maintenant. Les cartes sous la bibliothèque ne peuvent pas être repiochées pendant les quelques tours de l'horizon si toutes les autres cartes ne sont pas épuisées.

## 7. Monte-Carlo et numérique

Pour m tirages indépendants d'un événement indicateur, estimateur p̂=s/m ; erreur type approximative sqrt(p(1−p)/m). Intervalle normal 95 % : p̂±1,96 sqrt(p̂(1−p̂)/m), adapté ici aux effectifs très grands et aux probabilités éloignées de 0/1. Utiliser Wilson/exact près des limites.

À 10 000 tirages, la marge maximale est 0,98 point de pourcentage, pas 0,01. Cette formule ne s'applique pas directement à un score Bellman ; il faut sa variance et l'incertitude de sa récursion, par exemple par réplications indépendantes. Le score arrondi ne doit pas alimenter une prétendue probabilité précise.

Test différentiel : 1 000 000 de mélanges Fisher–Yates de production avec seed 20260905 ; second million par urne séquentielle et RNG Park–Miller seed 74219 ; référence exacte 1/3. Le garde CI automatique utilise six erreurs types pour éviter une fragilité arbitraire ; le rapport donne également l'écart réellement observé à 95 %. Un seul événement ne certifie pas tout le RNG ni le simulateur de mulligan complet.

## 8. Karsten et scores

Les tables publiées sont des sorties d'un modèle et d'une politique définis, distinctes d'une formule hypergéométrique brute. Le script Python indépendant reconstruit la distribution London en fractions rationnelles puis conditionne sur assez de terrains. Les quatre couples de seuils voisins testés sont documentés dans karsten-oracle.json. Les autres entrées sont contrôlées par transcription de la table, pas intégralement recalculées.

Les recommandations agrégées (moyennes de couleurs, poids d'archétype, pénalités de terrains, stabilité) sont des heuristiques. Pour les qualifier de probabilités de victoire ou de sorts lancés, une variable événement et une calibration indépendante seraient nécessaires. En leur absence, leur affichage doit rester un score, avec sa formule et ses limites.

## Sources primaires consultées

- [Règles complètes Wizards, version du 19 août 2026](https://media.wizards.com/2026/downloads/MagicCompRules%2020260819.txt) : 103.5, 103.8, 107.4, 302.6, 305.2.
- [Article Karsten : How Many Sources Do You Need… 2022 Update](https://www.tcgplayer.com/content/article/How-Many-Sources-Do-You-Need-to-Consistently-Cast-Your-Spells-A-2022-Update/dc23a7d2-0a16-4c0b-ad36-586fcca03ad8/) et [code de l'auteur](https://github.com/frankkarsten/MTG-Math/blob/master/HowManySources2022Update.py).
- [Mathématiques de ManaTuner](https://www.manatuner.app/mathematics) : description du produit, pas oracle indépendant, puisque le dépôt audité est ManaTuner.
