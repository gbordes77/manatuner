# Fiabilisation après l'audit mathématique

## Conclusion

**Les huit contre-exemples numériques de l'audit initial passent désormais comme tests ordinaires.** Le nouveau moteur physique est intégré à l'onglet principal de castabilité, avec un périmètre explicite et sans pourcentage de remplacement pour les cas non pris en charge.

**Cela ne certifie pas toute l'application ni toutes les interactions de Magic à 100 %.** Des graphiques secondaires conservent des estimations et les scores stratégiques restent heuristiques. La fiabilité établie concerne les événements et hypothèses documentés dans [MODEL.md](MODEL.md).

Le [rapport initial](../audit-2026-09-05/REPORT.md) constitue l'état historique avant cette deuxième série de corrections. Ses huit échecs attendus ne décrivent plus les chemins corrigés ; les résultats numériques avant/après restent utiles pour comprendre les défauts.

## Nouveau moteur

`src/services/castability/physicalManaEngine.ts` conserve l'identité fonctionnelle de chaque source, sa couleur, sa quantité produite, son coût et son délai. Il énumère les mains et les pioches sans remise, puis les actions légales : poser un terrain, engager une source, payer un producteur, préserver le mana flottant restant pendant le tour, dégager au tour suivant. Un paiement ne peut plus réutiliser une source ou du mana déjà dépensé.

Une somme multivariée plus rapide remplace l'énumération temporelle lorsque toutes les sources sont des terrains dégagés produisant chacun une unité. Les pips sont alors appariés à des sources distinctes ; les hybrides sont des alternatives de paiement.

Le résultat affiché est la **castabilité potentielle** : l'existence d'au moins une séquence légale pour l'histoire de tirage considérée. Puisque le choix de séquence peut dépendre de l'histoire complète, il s'agit d'une borne supérieure pour le joueur qui ne connaît pas les futures pioches. Le calcul n'inclut ni mulligan ni probabilité de tirer le sort demandé.

Le mode exact n'admet actuellement que les catégories de terrains basic/dual/triome sans condition supplémentaire et cinq contrats de producteurs vérifiés. Les autres mécaniques, les métadonnées incomplètes, les coûts non représentés et les dépassements du budget d'états renvoient un statut `unsupported`, sans probabilité partielle. Le composant affiche « Calculation unavailable » avec la raison. Un résultat de repli de l'ancien moteur ne remplace pas ce refus dans ces lignes.

Les textes de Llanowar Elves, Elvish Mystic, Fyndhorn Elves, Birds of Paradise et Sol Ring ont été vérifiés via l'API Scryfall ; les champs pertinents et les liens sont conservés dans [card-sources.json](card-sources.json). Toute nouvelle mécanique demande encore sa définition et ses tests avant admission.

## Huit contre-exemples corrigés

Les entrées physiques nécessaires ont été ajoutées aux profils qui ne contenaient auparavant que des marginales insuffisantes. Les valeurs attendues n'ont pas été changées.

| ID  | Cas                                                | Ancien résultat |   Référence | Résultat après correction |
| --- | -------------------------------------------------- | --------------: | ----------: | ------------------------: |
| M01 | WU, sources blanches/bleues distinctes, petit deck |     97,777778 % | 95,555556 % |               95,555556 % |
| M02 | Un biland W/U + trois forêts pour WU               |            80 % |         0 % |                       0 % |
| M03 | Terrain bleu engagé T1, disponible T2              |             0 % | 97,838547 % |               97,838547 % |
| M04 | Forêt et Elves conjointement disponibles           |            49 % | 46,666667 % |               46,666667 % |
| M05 | Sol Ring lancé et activé T1                        |             0 % | 46,666667 % |               46,666667 % |
| M06 | Deux exemplaires d'Elves pour trois manas T3       |             0 % | 40,833333 % |               40,833333 % |
| M07 | Coût 1U avec une seule île dans le deck            |     13,333333 % |         0 % |                       0 % |
| M08 | Hybride W/U avec 12 plaines et 12 îles             |     80,935331 % | 97,838547 % |               97,838547 % |

Les décimales non arrondies, écarts et statuts sont conservés dans [counterexamples-after.json](counterexamples-after.json). Le fichier `known-limitations.test.ts` a gardé son nom historique, mais ne contient plus d'exemption `it.fails` : ses huit assertions sont ordinaires.

## Autres corrections

- **Population** : l'analyse globale et la préparation des mains excluent sideboard et commandants de la bibliothèque ; les cartes importées restent conservées pour les autres vues.
- **Commandant** : une liste de 99 ou 100 cartes ne désigne plus automatiquement sa première carte comme commandant. Une déclaration explicite de zone est nécessaire.
- **Demande incolore** : le score de cohérence lit le coût effectivement demandé, y compris `{C}`, plutôt que la couleur de la carte. Un test a reproduit puis corrigé le score favorable sans aucune source C.
- **Coûts** : un parseur strict représente générique, WUBRGC, hybrides de deux couleurs et X fixé. Un symbole inconnu n'est pas silencieusement supprimé.
- **Mana générique** : les chemins de résumé tempo corrigés vérifient aussi le paiement total. Une ancienne assertion qui donnait 100 % à un coût `{1}` sans aucune source a été remplacée par l'attente correcte de zéro.
- **Recommandation de sources** : le déficit est non négatif et ne promet plus qu'une cible conditionnelle Karsten garantit 90 % sans mulligan.
- **Stabilité** : Blueprint exclut les couleurs inutilisées et les replis favorables 0,8/0,9 ; son intitulé indique qu'il s'agit d'une heuristique.
- **Histogramme de mulligan** : aucun libellé de score ne dépasse désormais 100 ; la dernière classe n'affiche plus 105.
- **Allocation entière** : la méthode des plus grands restes conserve le total de terrains demandé, contrairement aux arrondis indépendants.
- **Anciennes API inutilisées** : `utils/manabase.analyzeCard` et `runManabaseSimulation`, sans appel de production identifié, sont retirées explicitement et lèvent une erreur descriptive. Elles ne renvoient plus de probabilités ou pseudo-statistiques de parties incorrectes.
- **Documentation et interface** : distinction entre potentiel exact dans un modèle, estimations secondaires et scores heuristiques. Les pages mathématiques signalent cette distinction.

Les corrections de population et de demande C et les quatre corrections de chemins anciens/histogramme/allocation ont chacune un test qui a d'abord échoué avant modification. Les journaux rouges sont conservés dans `validation/`.

## Validation indépendante

- Les huit références de l'audit restent inchangées et passent.
- Les 28 configurations monochromes en bibliothèques 40/60/99/100 sont comparées au nouvel algorithme avec un oracle combinatoire indépendant.
- 48 configurations supplémentaires de recouvrements de sources blanches, bleues, bilands et autres terrains sont comparées à toutes les mains physiques possibles.
- Les tests de séquençage vérifient notamment le mal d'invocation, le mana restant après paiement de Sol Ring, l'impossibilité de financer rétroactivement un dork, les deux exemplaires d'un même producteur et la pioche du premier tour sur la draw.
- Une chaîne Forêt/Elves/Sol Ring est comparée à l'énumération exhaustive des mains initiales et de la pioche suivante.
- Les tests de composants rendent le véritable `ManaCostRow` et vérifient le 0 % physique, le refus des données manquantes et le refus des symboles non représentés.
- Les budgets d'états et les très grands nombres de pips refusent le calcul avant de produire une probabilité partielle ou une allocation déraisonnable.

Les tests hypergéométriques, de Bellman et les deux millions de tirages différentiels de l'audit précédent restent dans la suite. Aucune promesse de taux de victoire optimal n'en est déduite.

## Commandes et résultats

| Commande                                                                                                                 | Résultat                                                            |
| ------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------- |
| `npm run test:unit`                                                                                                      | **538 réussis, 2 ignorés, aucun échec attendu**, 48 fichiers        |
| `MTG_AUDIT_STRICT=1 npx vitest run tests/math-audit/known-limitations.test.ts`                                           | **8 réussis sur 8**                                                 |
| `npm run type-check`                                                                                                     | Réussi                                                              |
| `npm run lint`                                                                                                           | 0 erreur, 27 avertissements ; même nombre qu'après le premier audit |
| `npm run build -- --outDir /tmp/mtg-physical-build`                                                                      | Réussi                                                              |
| `npx vitest run tests/mtg-specific/card-types/special-lands.spec.js --config=/tmp/mtg-audit-final/audit-edge.config.mjs` | 12 échecs préexistants : import de `parseDeckList` non exporté      |
| `node scripts/math-audit-inventory.cjs docs/math/physical-engine-2026-09-05`                                             | Inventaire actualisé dans ce dossier                                |
| `git diff --check`                                                                                                       | Réussi                                                              |

La campagne complète a été relancée avec :

`npx playwright test --config=/tmp/mtg-physical-e2e/playwright.config.js --workers=4`

Résultat : **365 échecs, 67 réussites, 6 ignorés**, en 14,1 minutes. Les 365 identités d'échecs sont identiques à la référence initiale : aucun nouvel échec et aucun échec résolu dans cette comparaison. La configuration conserve les six projets et isole les rapports. La comparaison est dans [validation/e2e-comparison.json](validation/e2e-comparison.json).

Cette campagne couvre la migration principale. Les derniers garde-fous sur les coûts incolores et les métadonnées non résolues ont ensuite été vérifiés par la suite Vitest complète, les tests de composants, les types, le lint et le build finaux ; les 438 scénarios navigateur n'ont pas été relancés une quatrième fois après ces derniers garde-fous. Les échecs navigateur et les 12 tests exclus préexistants restent des limites réelles de validation globale.

## Traçabilité des nouveaux chemins

| Fonctionnalité                       | Implémentation                          | Référence indépendante / test                      | État                             |
| ------------------------------------ | --------------------------------------- | -------------------------------------------------- | -------------------------------- |
| Paiements et sources physiques       | `physicalManaEngine.ts`                 | Oracle `canPay`, énumération complète              | Vérifié sur le domaine testé     |
| Probabilité jointe multicolore       | Somme multivariée + appariement         | 48 configurations exhaustives                      | Vérifié sur le domaine testé     |
| Terrains engagés                     | États par tour                          | M03 et règles de dégagement                        | Vérifié dans le modèle           |
| Dorks et Sol Ring                    | Coût, engagement, délai, mana restant   | M04–M06, chaînes supplémentaires, sources Scryfall | Vérifié pour les contrats admis  |
| Coût générique/C/hybride/X           | `parsePhysicalCost.ts` + paiement       | M07–M08, tests UI et symboles                      | Vérifié pour les symboles admis  |
| Cas non pris en charge               | Résultat discriminé sans nombre         | Tests de budget, métadonnées et symboles           | Refus explicite                  |
| Affichage exact ou indisponible      | `ManaCostRow.tsx`, `CastabilityTab.tsx` | `physical-ui.test.tsx`                             | Vérifié par rendu de composant   |
| Zones de cartes                      | Analyse/préparation/parseurs            | `populations.test.ts`                              | Corrigé                          |
| Allocation/histogramme/API anciennes | Utilitaires et simulateur               | `retired-paths.test.ts`                            | Corrigé ou retiré explicitement  |
| Modèles secondaires, scores          | Composants de résumé                    | Formules heuristiques identifiées                  | Pas de certification stratégique |

## Limites et suite nécessaire

La qualification « exact » reste conditionnelle à des métadonnées correctes et aux seules actions représentées. Fetchlands, restrictions de types, terrains conditionnels, MDFC/pathways, rituels, trésors, doubleurs, producteurs non audités, interactions adverses et règles complètes de mulligan multijoueur ne sont pas ajoutés implicitement au modèle.

Les graphiques secondaires peuvent encore utiliser l'ancien moteur comme estimation ; ils sont nommés en conséquence. Les stratégies et scores ne sont pas des probabilités calibrées. Une application entièrement certifiée nécessiterait de migrer ou de retirer ces derniers chemins, puis d'étendre et de vérifier chaque nouvelle mécanique. L'existence du nouveau moteur ne constitue pas cette certification générale.

Les modifications antérieures de l'utilisateur et les rapports Playwright existants ont été conservés. Les sorties de cette campagne sont isolées. Aucun commit ni déploiement n'a été effectué.
