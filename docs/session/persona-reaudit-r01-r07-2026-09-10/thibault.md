# Thibault — troisième audit, R01–R07

10 septembre 2026 · Candidat local **dist-04**, campagne `reaudit-fixes-szrp1r9w` · HEAD communiqué `e14f329` · http://127.0.0.1:4187.

## Première impression simulée et méthode

« Le site explique maintenant ce que mes chiffres représentent. Je peux montrer mon analyse au pod sans devoir corriger moi-même l'aide sur la confidentialité ou les probabilités. Il me manque toujours une réponse directe à “quel terrain remplacer pour mieux lancer mon commandant ?”. »

Thibault demeure le joueur Commander exclusif du canon : pod hebdomadaire, manabase améliorée progressivement, importance du ramp, de la command zone et de T4–T8. Cette voix est simulée, pas issue d'un entretien.

**CUA indisponible**, confirmé par une tentative d'ouverture locale. Aucun clic, simulation ou partage personnel nouveau n'est revendiqué. J'ai relu le rapport précédent, les bilans `FINAL.md` et `REVIEW.md` de la campagne, puis consulté directement en HTTP le contenu prérendu de Guide, Privacy, My Analyses et Library. Les comportements interactifs ci-dessous sont attribués aux validations de campagne. Le site public reste ancien selon le lead : aucune amélioration de production n'est déduite.

## Avant/après constaté

**Confiance : les contradictions qui me concernaient sont réellement réduites.** My Analyses ne dit plus « Nothing sent to servers » : le texte lu précise l'enregistrement dans le navigateur et les requêtes Scryfall, avec renvoi vers Privacy. Cette dernière conserve une description concrète des destinations externes, caches, effacement et partage. Cela correspond bien à mon acceptation d'un outil sans compte ; je comprends que calcul local ne signifie pas absence de réseau.

La FAQ Guide abandonne la probabilité d'une « main spécifique ». Elle décrit désormais les mains et pioches aléatoires jusqu'au tour visé, sans mulligan et en supposant le sort disponible. Elle sépare Mana estimates et Exact goldfish potential, et précise les limites de ramp/removal. C'est une réponse nettement plus exploitable pour discuter de mes couleurs avec le pod.

**Commander : les acquis sont préservés, pas nouveaux.** Le Guide lu confirme la détection explicitement marquée, la bibliothèque hors commandant, les partenaires sur des lignes séparées, T4–T8, l'approximation Karsten N/60 et l'absence de taxe du commandant. La campagne conserve les contrôles EDH et rapporte les exports à 99 cartes de bibliothèque/43 terrains, plus un commandant et une réserve de test. Les quatre couleurs et le 99+1 étaient déjà acquis : aucun bonus pour les compter de nouveau.

**Partage : l'artefact raconte mieux le deck.** R06 et la revue indépendante attestent maintenant le rappel bibliothèque 99 + commandant 1 dans Blueprint. La FAQ HTTP annonce PNG/PDF/JSON/CSV et distingue le snapshot des réglages interactifs ; les liens transportent deck, nom et onglet seulement. Le protocole `#d=` est conservé. Cela améliore la capture montrée au pod, sans justifier un 5 tant que reproduire tous mes paramètres demande une explication supplémentaire.

**Mulligan et lectures : stabilité plutôt qu'extension.** Le modèle reste heuristique, avec mulligan gratuit multijoueur et pioche T1 annoncés ; aucune nouvelle modélisation de mes séquences Sol Ring/Signet n'est démontrée. Le parcours Commander de Library est présent dans le HTML consulté. La campagne corrige les compteurs voisins, mais n'apporte pas de nouveau contenu répondant à mon budget.

## Notes

| Axe           |    Avant | Maintenant | Motif                                                                                            |
| ------------- | -------: | ---------: | ------------------------------------------------------------------------------------------------ |
| Accessibilité |        4 |          4 | Entrée Commander déjà claire ; textes plus cohérents sans simplification majeure supplémentaire. |
| Pertinence    |        4 |          4 | Besoins EDH centraux couverts ; upgrade budgétaire toujours manuel.                              |
| Profondeur    |        3 |          3 | Pas d'élargissement des modèles exacts, du ramp ou des plans démontré.                           |
| Utilisabilité |        4 |          4 | Comparaisons et informations mieux organisées selon QA, mais pas de nouveau parcours personnel.  |
| Confiance     |        3 |          4 | Contradictions concrètes My Analyses/FAQ corrigées et vérifiées dans le HTML local.              |
| Partage       |        4 |          4 | 99+1 et formats mieux annoncés ; réglages interactifs toujours absents du lien.                  |
| **Moyenne**   | **3,67** |   **3,83** | **22/6 → 23/6 ; delta +1/6, soit +0,17 arrondi.**                                                |

## Frictions restantes et verdict

**P1 éditorial :** David/lead signale encore Guide 20 sources pour double symbole T2 contre Mathematics 21. Ce résidu n'est pas reproduit personnellement ; il empêche de traiter toutes les références numériques comme harmonisées. Pour mon usage EDH, je garde les cibles comme indicatives, conformément au Guide.

**P2 produit :** aucun ordre de priorité d'upgrades ni delta ciblé sur mon commandant ; limites persistantes pour terrains conditionnels, taxe et plans avec ramp. La disponibilité technique ne répond pas encore entièrement à ma décision d'achat.

Je recommande désormais plus sereinement un essai au pod et une capture contextualisée. Priorités : harmoniser la référence 20/21, proposer une comparaison guidée d'un swap, puis faciliter la reproduction des paramètres partagés. Aucun P0 démontré. Appareils physiques, utilisateurs réels, conformité juridique et production restent hors validation ; les tests locaux ne mesurent pas une hausse réelle d'adoption.

Sources : [bilan dist-04](../../engineering/reaudit-fixes-szrp1r9w/FINAL.md), [revue indépendante](../../engineering/reaudit-fixes-szrp1r9w/REVIEW.md), [rapport précédent](../persona-reaudit-2026-09-10/thibault.md).
