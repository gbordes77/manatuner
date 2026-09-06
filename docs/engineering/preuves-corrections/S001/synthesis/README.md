# S001 F03/F04 — synthèses de paiement et populations — 6 septembre 2026

Base HEAD `148d5f85ee26e60cdb10c6351031c89c03fd7ed0`, branche main, diff local non commité intégré avec F01/F02/F05/F07 puis changements F06/F08/F13 parallèles. Aucune requête externe requise par les tests de ce lot.

## Contrat

Les exigences fixes et les alternatives utilisent `parsePhysicalCost`, également réexporté sous `parseManaPayment`. Le compteur historique `countPipsInCost` conserve son rôle de présence de symboles pour exports : il ne sert plus à établir des obligations de couleur. Les cibles Karsten par couleur excluent les sorts à paiements alternatifs ou non représentés et affichent explicitement leur limite. Pour `{1}{R/G}`, aucune obligation rouge et verte indépendante n'est inventée ; `{R}{G}` garde deux cibles. Les coûts mixtes fixes/hybrides sont aussi exclus entièrement des cibles par couleur : leur paiement conjoint reste dans Castability.

Le score d'accès T2 reste une **heuristique marginale**, moyenne de chaque groupe distinct de paiement fixe ou alternatif. Pour R/G, une source physique offrant R ou G compte une seule fois ; pour R puis G fixes, deux événements marginaux sont conservés. Les pips répétés/simultanés ne sont pas validés par ce score : l'explication le dit et les lignes physiques restent l'autorité pour ce paiement. Le moteur exact n'a pas été modifié.

Pour un coût principal non représenté (phyrexian, neige, etc.), `consistencyUnavailable=true`, `colorAccessNotes` explique la cause et les principaux affichages annoncent l'indisponibilité. Le nombre `consistency=0` demeure seulement pour la compatibilité du stockage ; il ne doit pas être affiché comme résultat. Les métadonnées `colorAccessByTurn` fournissent les événements marginaux T2/T4 à l'export. QuickVerdict, EnhancedCharts, EnhancedRecommendations et ManaBlueprint sont gardés ; l'agent stockage adapte séparément historique/comparaison et schéma.

Les cibles de la manabase portent exclusivement sur la bibliothèque principale (sans sideboard ni commandant), avec les sources et total de cette même population. Le commandant explicitement identifié conserve son détail dans Castability, hors tirages de bibliothèque. L'écran post-board applique déjà ses échanges et recalcule ses sources ; son évaluation n'altère pas les cibles permanentes du principal. Listes de terrains, identité couleur des sorts et récapitulatif CSV/Blueprint principal suivent également ce filtre. La présence de symboles/couleurs dans l'identité ne signifie pas que toutes ces couleurs sont obligatoires à payer.

Le consommateur EnhancedCharts présentait des valeurs radar constantes 85/72/68/78/75 et remplaçait un score zéro par 75. Ces constantes sont retirées : le graphique compare désormais des valeurs réellement calculées d'accès et de proportion de terrains ; aucune nouvelle estimation de qualité n'est inventée.

## Preuves

- `red.log` : 4 échecs / 1 succès sur cinq tests initiaux avant correction (hybride, union de sources, phyrexian, sideboard/commandant).
- `green-initial.log` : cinq tests initiaux passent après correction.
- `green-final.log` : commande `npx vitest run tests/math-audit/synthesis.f03-f04.test.ts tests/math-audit/synthesis-ui.f03.test.tsx tests/math-audit/physical-engine.test.ts tests/math-audit/spell-summary.test.ts tests/math-audit/regressions.test.ts tests/math-audit/populations.test.ts` — **69 tests / 6 fichiers passants**. Oracles combinatoires indépendants `exactTail` : union hybride T2, strict R/G, dual compté une seule fois, deux hybrides nécessitent deux sources et donnent exactement P(X≥2), une seule source physique donne zéro. Index export vérifié contre combinaison indépendante T2/T4. Tests des composants réels : score indisponible, cible limitée, export null, graphique sans 75% inventé, exclusion du terrain de sideboard du récapitulatif.
- `math-initial.log` : passe élargie intermédiaire, 182 succès / 5 échecs provenant du test worker en édition parallèle. Signalés au coordinateur ; aucune assertion worker modifiée dans ce lot. Ne constitue pas la validation intégrée finale.
- `types.log` et `lint.log` : contrôles ciblés passants au moment indiqué ; validation intégrée finale et build à charge du coordinateur.

## AC et clôture

F03-AC1/2 : oracles et cibles testés ; AC3 : oracle exact indépendant deux pips physiques ; AC4 : métadonnées et composants/exports testés, E2E intégré à charge lead ; AC5 : indisponibilité et absence de conseils fondés sur un faux score démontrées. F04-AC1 : invariance sideboard ; AC2 : population effective explicite testée, parcours échanges existant à rejouer en navigateur ; AC3 : corrections des consommateurs avec test rendu manabase ; AC4 : commandant hors synthèse principale, détail conservé et contrat explicite. Aucun statut global « vérifié » n'est revendiqué par cette note avant revue et validation intégrées.

Contrôles finaux ciblés : `types-final.log` (code 0) et `lint-final.log` (code 0). Libellé d'identité clarifié « Spell Colors (Identity) », sans couleurs de sideboard/command zone ni assimilation à des obligations de paiement.
