# Contrat payment-policy-v2

Ce mode optionnel est distinct de `physical-v1`. Il ne remplace ni ses p1/p2, ni les scores heuristiques, ni les résumés sauvegardés. L'export propre au mode conserve son identifiant, toutes les entrées et le résultat discriminé. L'événement est **pouvoir payer une demande extérieure pendant la phase principale du tour cible**, après les seules actions de ressources représentées. La demande n'est pas une carte à piocher. Aucun mulligan, adversaire, combat, interaction, effet de pioche ou autre effet de sort n'est simulé.

## Politique et hasard

Bibliothèque physique de 7 à 1000 cartes ; main initiale de sept ; tirages uniformes sans remise ; premier tour avec/sans pioche explicite ; horizons T1–T10. Le moteur calcule la meilleure politique parmi les décisions représentées en ne connaissant que l'état présent : `max(action → valeur)` à chaque décision, puis `somme(probabilité de pioche × valeur)` au nœud aléatoire. Ce n'est pas le maximum calculé séparément après révélation de chaque future pioche. Un test de pathway chiffre cette différence à 7/360.

La bibliothèque est décrite par des quantités, pas un ordre observable. Une recherche retire sa cible réelle, puis le mélange rend la prochaine pioche uniforme dans la nouvelle population. Une recherche restreinte peut échouer volontairement. Une pioche dans une bibliothèque vide perd avant la phase principale cible. Pas d'effet qui empêche de perdre la partie ; vie minimale conservée >=1. Les effets à coût de vie réduisent le même total persistant.

Une carte modale ne peut être jouée qu'une fois et ne change plus de face sur le champ de bataille. Seule une face avant terrain peut être trouvée par les recherches représentées. Les productions multicolores alternatives consomment un seul engagement ; les signets produisent deux unités après paiement de leur activation. Le mana neigeux conserve la provenance du permanent ; la neige n'est pas une couleur. La restriction de Ziggurat s'applique aux sorts de créature, jamais aux capacités ni aux autres sorts.

## Périmètre des contrats de cartes

Le manifeste fermé contient 102 cartes canoniques / 222 alias issus de textes Oracle archivés, auxquels s'ajoutent Arcane Signet avec identité explicite et les catégories de terrains déjà documentées dans le pont de métadonnées. `build-contracts.py` le régénère. Les 60 MDFC incluent les dix pathways et 50 cartes sort/terrain ; les effets non-mana de leur face sort restent exclus. Tangled Florahedron est jouable soit comme terrain engagé, soit comme producteur créature payé et soumis au mal d'invocation.

- Recherches : les dix fetchs à deux types et un point de vie, Prismatic Vista, Evolving Wilds, Terramorphic Expanse, Fabled Passage (quatrième terrain compté après l'arrivée).
- Permanents : Llanowar Elves, Elvish Mystic, Fyndhorn Elves, Birds of Paradise, Boreal Druid, Sol Ring, Mind Stone (seule production de mana), Coldsteel Heart (couleur fixée à l'entrée, engagé, neigeux), Lotus Petal (sacrifice), les dix signets bicolores. Arcane Signet demande explicitement l'identité du commandant ; « n'importe quelle couleur » ne comprend jamais C.
- Rituels : Dark Ritual, Pyretic Ritual. Strike It Rich crée un trésor et son flashback est payé une seule fois ; les trésors sont consommés par sacrifice. Les autres effets de rituels, notamment splice de Desperate Ritual, ne sont pas admis.
- Ramp : Rampant Growth, Farseek, Nature's Lore, Three Visits, Cultivate (au plus une cible sur le champ de bataille et une autre distincte en main). Les cibles doivent encore être présentes et satisfaire les types ; l'arrivée applique le texte de la cible et la contrainte du sort.
- Coûts : générique, WUBRGC, X explicite, S, hybrides bicolores, 2/couleur, C/couleur et phyrexian couleur/P ou deux couleurs/P. Les tokens inconnus sont refusés, jamais convertis arbitrairement en générique.

Les terrains de base (dont neigeux), duaux, triomes, fastlands, slowlands, checklands, battlelands et shocklands sont compilés depuis les métadonnées existantes. Les conditions admises sont contrôles de terrains, de basiques, de types de base et paiement de vie. Les autres catégories ou conditions ne sont pas devinées. Un producteur identifié mais non audité fait refuser le calcul lorsque les sorts ressources sont activés ; les autres sorts sont inertes dans ce modèle de ressources. Désactiver ces sorts est un changement explicite d'hypothèse.

## Budget et interface

Le résultat est `exact` seulement si toute l'énumération termine ; les calculs utilisent des nombres flottants. La limite UI est 250 000 unités de travail, incluant états, tirages et paiements. Le programme peut choisir un budget borné jusqu'à 10 millions. Le regroupement ne fusionne que des contrats identiques à leurs noms près ; une seconde mémoïsation partage les tirages après vidage de la réserve. Les tests comparent avec le regroupement désactivé et un produit hypergéométrique indépendant à 60 cartes.

Le worker garde le fil UI disponible ; annuler, modifier une entrée ou démonter le panneau termine le worker et invalide les réponses tardives. Un dépassement de budget ou un échec du worker ne contient **aucune probabilité partielle**. La limite ne garantit pas que toute liste de 60/100 cartes termine : plusieurs familles de ressources et horizons longs restent coûteux. Pas de fallback Monte-Carlo automatique.

## Preuves indépendantes

`fetch-oracle.py` énumère des identités physiques, utilise `fractions.Fraction`, des combinaisons de mains et un appariement distinct des sources aux pips. Il n'importe aucun code TypeScript ni fonction de production. Douze cas couvrent recherches engagées/non engagées, play/draw, T1–T3. `fetch-oracle.json` conserve les fractions.

Les cas fermés supplémentaires emploient des comptages directs : fetch + Forest au T1 = 14/15 dans dix cartes ; deux ressources précises parmi sept = 7×6/(10×9) ; Coldsteel Heart avec deux Forests installés avant T3 = 7/15 ; deux trésors avec flashback dans le cas documenté = 8/15. Cultivate sur douze cartes donne 135/220, contre 105/220 si la mise en main est retirée du contrat : les commentaires des tests détaillent les combinatoires. Ces oracles ne prouvent pas tous les mélanges de contrats possibles.

Sources de règles : [règles officielles](https://magic.wizards.com/en/rules), [notes Zendikar Rising : MDFC](https://magic.wizards.com/en/news/feature/zendikar-rising-release-notes-2020-09-10), [mise à jour neige](https://magic.wizards.com/en/news/announcements/comprehensive-rules-changes-2021-02-02). Les textes Oracle et URL propres aux cartes sont dans `card-sources.json`.
