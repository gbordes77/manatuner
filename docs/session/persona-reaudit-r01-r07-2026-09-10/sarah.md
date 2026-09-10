# Sarah — Réaudit R01–R07 : 3,83/5, note stable

Évaluation du 10 septembre 2026 selon les six axes canoniques de Sarah : joueuse Standard, FNM hebdomadaire, premiers RCQ, comparaison de builds et partage Discord. Baseline immédiate : `docs/session/persona-reaudit-2026-09-10/sarah.md`, soit **4/3/4/4/4/4 = 23/6**. Le nouveau candidat est `dist-04`, servi sur **http://127.0.0.1:4187/**, campagne `reaudit-fixes-szrp1r9w`, HEAD `e14f329` indiqué par la coordination. Aucune publication n’est présumée.

## Méthode et parcours effectivement réalisé

La tentative d’ouverture d’un onglet CUA a échoué : navigateur `iab` indisponible. Cette troisième lecture n’est donc **pas une nouvelle session interactive complète**. J’ai utilisé le repli autorisé : requêtes HTTP locales, extraction du texte HTML prérendu, lecture des preuves du candidat et vérification ciblée des sources. Je n’ai ni recréé un historique, ni cliqué dans Compare, ni calculé un nouveau deck.

Le parcours HTTP a couvert `/my-analyses`, `/library`, `/library/reid-duke-level-one-sideboarding`, `/privacy` et `/analyzer?sample=exact`. Le dernier renvoie le formulaire prérendu, sans résultat calculé : cela ne prouve pas l’exécution de l’exemple.

J’ai lu `docs/engineering/reaudit-fixes-szrp1r9w/FINAL.md`, `REVIEW.md`, `persona-04.log`, `targeted.log`, puis les scénarios Compare pertinents et `src/utils/comparison.ts`. Les 23 scénarios persona et quatre tests ciblés verts appartiennent à cette campagne antérieure : **ils ne sont pas mes propres rejeux**.

## Progrès et expérience attendue de Sarah

**Historique et confidentialité — confirmé par HTTP.** Le message absolu « Nothing sent to servers » a disparu du texte servi. L’état vide annonce les recherches Scryfall et renvoie à Privacy ; le résumé indique « Analyses stored in this browser » et « External requests & privacy ». La politique explique toujours les noms de cartes, images, polices, stockage local et diffusion par liens. La contradiction identifiée au réaudit précédent est donc corrigée sur cette surface.

**Bibliothèque — confirmé par HTTP.** L’introduction annonce maintenant « 7 welcoming reads », puis « 7 reads », puis sept articles dans le parcours FNM. La fiche Sideboarding conserve la formulation adaptée aux événements best-of-three, FNM compris. Cela améliore la finition ; ce n’est pas une extension de la couverture Standard ou des matchups.

**Compare — preuve de campagne et lecture ciblée.** Les motifs communs sont regroupés et les sorts concernés restent accessibles, selon le scénario R03 du log final. Les scénarios couvrent séparément builds compatibles 24/20 Plains, builds identiques et absence de calcul. Le formateur consulté affiche une décimale, conserve `0%`, distingue `Unavailable`, affiche `=` pour un delta nul et un signe pour les très petits deltas. Le scénario 24/20 vérifie effectivement des probabilités sauvegardées différentes et un rendu sans longue précision. Ces preuves soutiennent une amélioration réelle de lisibilité ; je n’attribue pas à Sarah un clic qu’elle n’a pas effectué ici.

**Blueprint et contexte — sources et preuves attribuées.** Les définitions Health/Blueprint/Mulligan, hypothèses lands-only et avertissement sur les paramètres non transportés restent présents dans le composant. Le rapport R07 indique le remplacement du vocabulaire trompeur par « HIGH INDEX » ; les exports CSV sont mieux annoncés. Le nom et le contexte étaient déjà acquis dans la baseline. Le log inclut les scénarios d’identité JSON/CSV et de partage rouvert, sans les transformer en nouvelle observation visuelle personnelle.

## Notes avant/après

| Axe           |    Avant |    Après |    Delta | Motif                                                                                                            |
| ------------- | -------: | -------: | -------: | ---------------------------------------------------------------------------------------------------------------- |
| Accessibilité |        4 |        4 |        0 | Textes plus cohérents ; quantité d’informations et vocabulaire toujours conséquents.                             |
| Pertinence    |        3 |        3 |        0 | Préparation mana/RCQ utile ; suivi de résultats et matchups Standard récents toujours hors couverture démontrée. |
| Profondeur    |        4 |        4 |        0 | Hypothèses et comparaison mieux expliquées, sans élargissement démontré du modèle.                               |
| Utilisabilité |        4 |        4 |        0 | Groupement et arrondis consolident le niveau bon ; parcours réel FNM complet pas nouvellement démontré.          |
| Confiance     |        4 |        4 |        0 | Contradictions signalées corrigées ; honnêteté du modèle renforcée, sans validation universelle de ses conseils. |
| Partage       |        4 |        4 |        0 | Contexte et exports mieux exposés ; paramètres interactifs non transportés, pas de nouveau partage observé ici.  |
| **Moyenne**   | **3,83** | **3,83** | **0,00** | **23/6, soit 15,33/20.**                                                                                         |

La stabilité ne signifie pas absence de progrès. Sur une grille entière, une correction de finition consolide un 4 sans justifier automatiquement un 5. Depuis le 9 septembre, Sarah reste en hausse de **+0,33/5**, de 3,50 à 3,83.

## Verdict, restes et priorités

« Je comprends mieux les limites et je perds moins de temps à lire le même avertissement. Pour décider entre mes deux versions de vendredi, je veux maintenant une démonstration avec une vraie liste représentative. »

La priorité produit reste un parcours d’itération compatible : identifier le déficit, tester une modification, comprendre son effet et partager le contexte. L’exemple synthétique clarifié est pédagogique ; il ne remplace pas un deck de tournoi. La comparaison du snapshot lands-only ne répond pas automatiquement aux réglages interactifs de ramp et de retrait des créatures.

Recommandations : tester ce parcours avec une joueuse FNM réelle ; proposer un exemple représentatif compatible et expliqué ; mesurer le temps jusqu’à une modification comprise et une comparaison correctement interprétée. Aucun nouvel audit réseau, appareil physique, contraste, lecteur écran, oracle, export ou test automatisé n’a été réalisé ici. La confiance dans cette troisième notation est plus limitée côté interaction ; aucune panne du produit n’est déduite de l’indisponibilité du navigateur.
