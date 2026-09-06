# Réparation du mode Exact goldfish — 6 septembre 2026

Suite à la capture utilisateur après la réparation des estimations. Aucun nouveau test multi-navigateurs exhaustif : instruction utilisateur respectée.

## Défauts reproduits

Le sélecteur conservait le taux de retrait Limited de 15 %, bloquant 17 lignes. Après suppression de ce blocage, Selesnya Guildgate était refusée comme terrain utilitaire. Son texte Oracle récent « This land enters tapped. » était en outre interprété comme une arrivée dégagée. Enfin, les calculs complets avec accélérateurs dépassaient le budget du tableau. Les preuves rouges distinguent ces causes ; les anciens tests qui attendaient simplement le refus ne prouvaient pas l’utilisabilité du mode goldfish.

## Corrections

Le mode exact applique explicitement retrait nul et survie des accélérateurs certaine, sans modifier les réglages des estimations. L’avertissement explique cette hypothèse. Le moteur garde son refus lorsqu’un appel direct demande des interactions.

Les terrains utilitaires admis ici ont un contrat Oracle entier de deux lignes : arrivée engagée, puis production sans condition d’un mana parmi une ou deux couleurs indiquées. Les métadonnées doivent correspondre. Les capacités supplémentaires, restrictions et métadonnées incohérentes restent refusées. Le parseur reconnaît aussi « enters tapped » ; le cache terrains passe à 2.2 pour recalculer les anciennes entrées.

Le moteur mémorise les fermetures d’états identiques, regroupe les producteurs de même fonctionnement pour les seules requêtes sans identité nominative et évite de produire du mana inutile avant le tour cible lorsqu’aucun accélérateur n’est en main. Le budget du tableau passe de 50 000 à 1 000 000 opérations, toujours fini. Aucun résultat partiel n’est transformé en pourcentage.

## Vérifications

695 tests unitaires, 68 fichiers, zéro échec/ignoré. Lint, types, build et budget du bundle réussis. Quatre parcours ciblés Chromium réussis, sans reprise : probabilités, onglets/export/historique, sideboard, coût de face avant. Le parcours goldfish vérifie 17 résultats numériques en play et draw, ainsi que le retour aux estimations et la conservation du retrait à 15 %.

Oracles indépendants : Path to Exile T1, 8 Plains dégagées sur 40 cartes, vaut 81,946281 % en play et 86,322940 % en draw. Les deux Guildgates ne paient pas au premier tour. Tests supplémentaires de terrain engagé au tour suivant, refus des contrats modifiés et énumération de mains physiques avec deux elfes distincts ; requête nominative préservée. Les tests historiques de chaînes d’accélérateurs et de dépassement de budget passent toujours.

## Publication et limites

Ce rapport accompagne le correctif sur main. Vérifier le SHA et le déploiement Vercel natif après push ; aucun déploiement CLI. La vérification publique ciblée sera indiquée dans le bilan de conversation. Les campagnes historiques 486 navigateurs sont antérieures à ce correctif et ne sont pas revendiquées ici.

Ce potentiel exact reste limité aux contrats supportés et au budget. Il ne modélise ni adversaire, ni mulligan, ni probabilité de tirer le sort cible, ni politique sans connaissance des pioches futures. Certaines autres bases de mana ou ramp restent indisponibles. Le correctif ne promet pas des pourcentages exacts pour tous les decks.
