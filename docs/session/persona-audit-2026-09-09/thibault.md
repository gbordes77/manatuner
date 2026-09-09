# Thibault — Le Capitaine de Table

Audit du 9 septembre 2026 · Persona 6 · Production https://www.manatuner.app · Engine v2.7.9 observé.

## Première impression simulée

« Ah, un exemple Atraxa, du 100 cartes et un horizon T4–T8 : je suis au bon endroit. Maintenant je veux savoir si mon commandant arrive avec mon ramp et mes terrains budget. Si vous me parlez de certitude mathématique, il faut que le guide et les résultats racontent la même chose. »

Cette réaction est une simulation de Thibault, 33 ans, exclusivement Commander depuis cinq ans, pod hebdomadaire et upgrades progressifs. Elle ne constitue pas un entretien utilisateur. Les observations ci-dessous proviennent d'un vrai parcours navigateur ; les préférences et intentions sont celles de la persona.

## Parcours réellement effectué

1. Ouverture directe de `/analyzer?sample=edh`. L'exemple Atraxa apparaît, avec la marque explicite `*CMDR*`. L'URL devient `/analyzer`. Clic **Analyze Manabase**, attente du résultat.
2. Résultat : **99 cartes et 43 terrains** au résumé ; **4 couleurs**. L'onglet Analysis alors sélectionné expose 56 sorts non calculables, principalement pour la restriction Command Tower. Cet état initial peut dépendre du stockage partagé entre auditeurs : il ne prouve pas l'onglet choisi dans un navigateur neuf.
3. Clic **Castability** : **Mana estimates sélectionné**, Commander/EDH détecté, 100 cartes au total et bibliothèque de 99 explicités. Atraxa est épinglée en premier avec **Command zone**, coût GWUB, estimation **75 %**, terrains seuls **67 %**, terrains parfaits **94 %**. Neuf ramp sont détectées ; les nombres sont des estimations affichées, pas des probabilités recalculées par cet audit. Le bref état intermédiaire « No ramp detected » disparaît une fois la vue stabilisée.
4. **Manabase** : 4 couleurs d'identité, cibles W18/26, U18/30, B21/26, G18/28 ; cartes classées fetch/shock/check/triome/utility/basic. Le graphique montre aussi quatre sources rouges, distinctes des quatre couleurs requises. Ce n'est pas la réapparition de l'ancien défaut « 6 couleurs ».
5. **Mulligan** : activation de Multiplayer puis **Quick (3k)**, résultat réellement obtenu. Seuil sept cartes 57, seuil après mulligan gratuit 54, exemples de mains et plans indiqués indisponibles. Case initialement décochée dans cet environnement partagé : aucun défaut d'autodétection par défaut n'est conclu.
6. **Guide: Commander**, puis **Library → Commander Pod** : ancre `/library#track-commander` fonctionnelle, cinq ressources dédiées. Enfin clic **Privacy** et lecture de la page publiée.

Aucun compte créé, aucune publication ni envoi à un pod. Ni tablette physique ni viewport mobile certifié. Le partage dispose d'une preuve commune du lead : toast de copie Discord observé, mais lecture clipboard vide et restitution du lien non validée ; ce n'est pas un échec de partage démontré.

## Points positifs

**Commander a une place réelle dans le produit.** La liste de 100 cartes est acceptée, Atraxa sort du paquet de pioche et son paiement est présenté séparément. L'ancien affichage six couleurs est résolu pour cet exemple. Le tri T4–T8 m'évite de commencer par vingt sorts qui ne déterminent pas mon tour de commandant.

**Les estimations de ramp apportent un point de discussion concret.** Voir 75 % avec ramp et 67 % terrains seuls répond partiellement à ma question de construction. Les réserves sur chevauchement des sources, séquençage, absence de mulligan et absence de probabilité de piocher le sort sont placées près des chiffres.

**Les limites ne sont pas silencieusement converties en résultats.** Tezzeret's Gambit est indisponible, le score global est suspendu et l'Analysis explique le terrain non représenté. Le guide reconnaît que N/60 est une approximation, pas une table EDH publiée. Ces garde-fous méritent d'être préservés.

**La bibliothèque donne une raison de revenir entre deux upgrades.** Karsten Commander, Brackets, Command Zone, Game Knights et EDHREC composent un parcours cohérent. Les statuts archived/live sont affichés ; les contenus externes n'ont pas été intégralement vérifiés ici.

## Frictions et manques

**P1 — Un exemple officiel met en échec une grande partie de son propre résumé.** Health Score indisponible et 56 lignes non calculables dans Analysis, alors que Castability fournit des estimations. Je peux utiliser l'outil, mais je dois comprendre seul cette séparation. Les compteurs « 0 risky » et « 0 critical » sous l'avertissement sont peu utiles : zéro calculé n'est pas un deck sans problèmes. Ce constat concerne le périmètre des modèles, pas une panne générale.

**P1 — Les explications se contredisent.** Le guide promet une probabilité exacte et assimile Health Score à une consistency %, alors que l'Analyzer parle d'heuristiques. Le bandeau et le guide mentionnent encore une détection du premier non-terrain ; le verdict dit explicitement marqué uniquement. La page Privacy affirme que les decklists ne quittent jamais l'appareil. Ces promesses publiques ne correspondent pas aux limites du produit et au contrat S002 lu ; aucune conformité juridique n'est certifiée.

**P1 — Le mulligan multijoueur fonctionne, mais son aide conserve une lecture duel.** Après activation du mulligan gratuit, l'aide décrit une nouvelle main avec une carte de moins et le tableau indique six cartes après un mulligan. Le modèle annonce honnêtement aucun ramp pour les plans, ce qui limite fortement sa pertinence pour Sol Ring/Signet. Les exemples affichent des plans indisponibles tout en parlant de mauvaise efficacité mana.

**P2 — L'upgrade path reste à ma charge.** « Plus de dual lands », coût en points de vie et quatre couleurs déficitaires n'indiquent pas quelle modification tester. Neuf ramp sont listées, mais Farseek, Nature's Lore et Three Visits sont absentes de cette liste malgré le guide les citant comme ajustant la courbe. Leur traitement doit être expliqué ; je n'en déduis pas un bug arithmétique sans audit ciblé.

Aucun P0 bloquant global démontré. Validation d'identité et partenaires non testée ; le guide dit faire confiance à la liste, donc ne pas présenter cela comme une validation complète. Les questions de politique de table restent légitimement hors périmètre.

## Notes commentées

| Axe           |       /5 | Justification                                                                                               |
| ------------- | -------: | ----------------------------------------------------------------------------------------------------------- |
| Accessibilité |        4 | Exemple Commander immédiatement utilisable, lexique familier ; bandeau dense et ambiguïté 99/100 au résumé. |
| Pertinence    |        4 | Command zone, horizon, ramp et multiplayer présents ; upgrades budgétaires sans réponse directe.            |
| Profondeur    |        3 | Estimations utiles et hypothèses lisibles, mais Analysis et plans limités sur le propre exemple EDH.        |
| Utilisabilité |        3 | Parcours terminé sans blocage ; plusieurs surfaces et explications à réconcilier, tablette non testée.      |
| Confiance     |        2 | Refus de faux calculs appréciable, mais promesses guide/privacy et aide multiplayer contradictoires.        |
| Partage       |        3 | Je partagerais la lecture Commander et une capture contextualisée ; roundtrip de l'analyse non certifié.    |
| **Moyenne**   | **3,17** | **19/6 ; moyenne simple des six axes.**                                                                     |

Baseline fournie : 4,05/5 ; écart −0,88. Il s'agit d'une appréciation plus sévère sur des parcours vérifiés et des contradictions observées, pas d'une mesure prouvant une régression logicielle.

## Verdict et recommandations

« Je reviendrais tester mes couleurs, et j'enverrais le parcours Commander au Discord de mon pod. Je ne dirais pas que cet outil décide mathématiquement de mes keeps ou de mon prochain achat. »

1. **P1 :** aligner guide, bandeau Commander et privacy sur les contrats réellement exécutés ; supprimer les promesses d'exactitude générale.
2. **P1 :** faire du parcours Atraxa une démonstration compréhensible des estimations, avec accès direct à celles-ci et compteur explicite des sorts calculés/indisponibles.
3. **P1 :** adapter aide et seuils affichés au mulligan gratuit ; distinguer score de main et plan non disponible sans diagnostiquer une inefficacité non simulée.
4. **P2 :** rendre le résumé « 100 cartes = 99 bibliothèque + 1 commandant » explicite et afficher la couverture ramp carte par carte.
5. **P2 :** proposer une comparaison avant/après d'une modification et un artefact pod compact contenant commandant, hypothèses, horizon et limites. Mesurer le succès par complétion du parcours EDH, compréhension du 99+1 et restitution du partage, sans collecte de decklists.
