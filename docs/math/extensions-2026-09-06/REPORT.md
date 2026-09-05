# 1 Verdict global

Les cinq points demandés ont des implémentations et des régressions, dans un domaine fermé. Le mode `payment-policy-v2` est une politique de ressources non clairvoyante, accessible dans Castability. Ce n'est pas une certification universelle ni une extension silencieuse des scores historiques. Les résultats de validation et de publication sont suivis dans `validation.json` ; ne pas attribuer à un SHA des tests d'un autre code.

# 2 Résumé exécutif

Recherches physiques, MDFC sort/terrain, neige, vie, hybrides/phyrexian, restrictions et ressources sélectionnées sont calculés dans un mode explicite. Un worker annulable et des budgets bornés protègent l'interface. Les 27 avertissements de lint et les huit anciens tests ignorés sont traités. Les dépendances inutilisées du CLI Vercel sont retirées du dépôt ; le parcours de publication reste natif.

# 3 Architecture mathématique découverte

Reprise sur `main = origin/main = d6418f065e286b451a72ab2a0de705361523df22`, version 2.7.9. Les corrections A1–A3 et pathways sont déjà publiées et ne sont pas réannoncées comme nouvelles. Aucune instruction locale AGENTS.md supplémentaire. Les fichiers annexes utilisateur identifiés dans la passation restent exclus des commits.

# 4 Modèles mathématiques utilisés

Le [contrat](MODEL.md) détaille l'événement extérieur, la politique, les états, les actions et les refus. Max sur les décisions présentes, puis espérance sur les pioches futures. p1/p2 du potentiel historique, probabilité de tirer puis lancer, score de santé et nouvelle probabilité de paiement restent des objets différents. Aucun calcul indisponible n'est remplacé par un pourcentage inventé.

# 5 Comparaison avec les références

105 textes Oracle archivés, issus de Scryfall, dont 60 MDFC, 14 fetchlands, 21 autres ressources et dix signets. Le manifeste admet 102 cartes canoniques / 222 alias ; les ressources dont les capacités demandent un modèle supplémentaire restent exclues. Le générateur vérifie les textes des faces de terrain et des signets. Les références aux règles officielles sont dans MODEL.md.

# 6 Bugs trouvés

Les refus antérieurs de fetchs, MDFC sort/terrain, neige et vie étaient des limites, pas des probabilités fausses démontrées. Une comparaison indépendante montre pourquoi réutiliser le potentiel clairvoyant pour une politique serait faux (écart 7/360). Pendant l'implémentation, les nouveaux cas testent les consommations physiques et les paiements effectifs ; les fixtures et mocks erronés ont été corrigés sans affaiblir les assertions. Les deux placeholders unitaires ne vérifiaient rien : ils sont remplacés par des tests d'erreur/réessai et de restauration du brouillon. Le placeholder navigateur est remplacé par une persistance après vrai reload.

# 7 Tests indépendants

Oracle Python Fraction : douze cas de recherches, identités physiques et politiques non clairvoyantes ; aucun import de production. Comptages combinatoires indépendants pour première main, ressources installées, vie, face modale, neige et flashback. Cultivate : 135/220 avec recherche en main contre 105/220 sans, explication dans les tests. Les régressions physiques antérieures restent exécutées.

# 8 Mulligan / Monte-Carlo

Le nouveau mode exclut le mulligan et n'utilise pas de simulation de secours. Les suites existantes du mulligan et des modèles historiques continuent de tourner. Leur stratégie reste limitée ; aucune nouvelle preuve universelle du mulligan n'est revendiquée.

# 9 Mana rocks / dorks / ramp

Installation payée, mal d'invocation, arrivée engagée, couleur fixée de Coldsteel Heart, vie, sacrifice, trésors, flashback, coût d'activation des signets et recherche des vraies cibles sont représentés. Le périmètre nommé dans MODEL.md comprend cinq sorts de ramp. Les effets non-mana (pioche de Mind Stone, effets des faces sort MDFC, etc.) sont exclus explicitement. Arcane Signet exige une identité déclarée et ne produit pas C.

# 10 Sources colorées / Karsten

La neige est une provenance, la restriction créature est une contrainte de dépense, et un mana alternatif est une seule unité. Les fonctions Karsten et les hooks sont déplacés dans des modules dédiés pour le lint ; leurs algorithmes et assertions existantes ne sont pas modifiés. Aucun score secondaire n'est fusionné avec le nouveau mode.

# 11 Cas limites

Cible absente ou épuisée, verso non cherchable, jeu d'une seule face, budget, réserve de vie, types de recherche, Fabled Passage au quatrième terrain, Cultivate en main, activation de signet, flashback, pioche d'une bibliothèque vide, réponse tardive après annulation, métadonnées malformées. La réserve de vie doit être au moins un : aucun effet empêchant la défaite n'est représenté.

# 12 Modifications effectuées

Nouveau moteur/pont de métadonnées/parser de coûts/manifeste, worker et panneau opt-in. Extractions mécaniques des helpers/hooks pour obtenir zéro avertissement sans désactiver les règles ESLint. Lint désormais bloquant au premier avertissement ; audit de toutes les dépendances bloquant à sévérité high en CI. Suppression du CLI Vercel inutilisé et remplacement de `npm run deploy` par le rappel du parcours natif ; rollback depuis le tableau de bord, documenté. Aucun outil vulnérable n'est déplacé vers un autre groupe npm pour masquer l'audit.

# 13 Tests exécutés

Consulter `validation.json` et les preuves référencées pour les nombres actuels, SHA et empreintes. Les références historiques 593/438 puis 621/438 restent dans les rapports précédents. Les contrôles locaux couvrent installation verrouillée, unité, types, lint, build, budget, audit et parcours Chromium/WebKit. La campagne complète Linux doit couvrir les six projets et inclure les deux nouveaux parcours sans tests ignorés.

# 14 Performance

Regroupement de cartes équivalentes et cache des nœuds de tirage, tous deux locaux à une invocation. Comparaison avec optimisation désactivée ; cas 60 cartes vérifié par produit hypergéométrique. Dépassement borné testé à exactement budget+1, sans probabilité partielle. Le worker et l'annulation sont testés ; cela ne garantit pas qu'un deck Commander hétérogène terminera dans 250 000 unités de travail.

# 15 Risques résiduels

Le modèle exact est fermé : autres recherches, permanents à états supplémentaires, effets de pioche, terrains hors catégories admises, coûts alternatifs non décrits, adversaire, combat, interactions et mulligan sont hors domaine. Les capacités non-mana ne sont pas simulées. Le potentiel historique continue de refuser certaines cartes maintenant admissibles dans la politique ; ces probabilités ne sont pas interchangeables. Pas de promesse de fiabilité à 100 %, pas de score global pour le nouveau mode. L'audit npm ne couvre pas les composants internes du service Vercel.

# 16 Suite et passation

Les cinq points ont été traités dans le périmètre ci-dessus. Continuer ensuite famille par famille avec contrat et oracle, en particulier les permanents à conditions supplémentaires et les actions non-mana ; ne pas simplement assouplir un garde. Vérifier le HEAD, les preuves et la publication réelle avant de reprendre. La passation principale renvoie à ce rapport ; les résultats historiques restent intacts.
