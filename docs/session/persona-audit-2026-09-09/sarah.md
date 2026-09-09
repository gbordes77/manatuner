# Sarah — La Régulière : 3,50/5

Audit du 9 septembre 2026, production https://www.manatuner.app, navigateur Codex intégré, onglet propre. **Engine v2.7.9 observé**. Incarnation simulée du profil canonique, pas entretien avec une utilisatrice. Les preuves historiques S002 et le contrat de livraison ont été lus ; leurs tests locaux ne prouvent pas la publication. Aucun code corrigé, aucune donnée privée saisie, aucun message envoyé.

## Première impression simulée, 30 secondes

« Ça peut m'aider à décider si je garde 23 terrains avant vendredi. Le parcours RCQ me parle ; j'aimerais surtout comparer mes deux builds. Mais si le deck est “Excellent” alors que les deux couleurs manquent de sources, quelle décision je prends ? »

## Parcours réellement visité

1. Accueil `/` : promesse, formats, exemple, bibliothèque et confidentialité affichée.
2. Bouton Try an example deck → `/analyzer?sample=midrange` → Analyze Manabase → `/analyzer`. Exemple public Nature's Rhythm : 60 cartes, 23 terrains, résultat 91/100, Engine v2.7.9. Lecture Castability puis Blueprint, capture visuelle 1280×720.
3. Share : toast réellement observé « Share link copied — paste in Discord (link includes your deck) ». Aucun envoi et pas de test du lien réouvert.
4. `/my-analyses` : exemple enregistré ; Compare → deux entrées publiques Nature's Rhythm du jour → modal comparative. Historique partagé avec d'autres essais ; aucune entrée ancienne supprimée et aucun problème ancien attribué à ce test.
5. `/library` : parcours RCQ et Limited, catégories, dates, états live/archived/lost ; ouverture de `/library/reid-duke-level-one-sideboarding`.
6. `/privacy` : lecture des promesses visibles.

Limites : pas de test mobile effectif, lecteur écran, contraste mesuré, export téléchargé, restauration après fermeture, ni visite Learn/About et contenus externes. Analyse et Mulligan non parcourus dans cette session Sarah. Cela borne l'exhaustivité du score.

## Points positifs constatés

- Aucun compte requis ; l'exemple fournit immédiatement une vraie base d'analyse, puis se retrouve dans l'historique.
- Castability distingue les estimations, terrains seuls et terrains parfaits ; les limites sur mulligan, pioche du sort et séquençage sont écrites. C'est utile pour corriger mes attentes.
- Le parcours RCQ compte dix articles, avec Reid Duke, Karsten, préparation, sideboard et décisions. Les dates, langues et états des ressources sont visibles. Les fondamentaux anciens restent pertinents pour progresser entre deux FNM.
- Le Blueprint présente listes, matrice par couleur, ratios et mains d'ouverture dans une mise en page partageable. Le toast Discord annonce clairement que le lien contient le deck.
- Les métriques globales A/B et leurs deltas sont effectivement accessibles dans Compare.

## Frictions et manques

**P1 — Promesses contradictoires, constat live.** L'accueil parle de sorts lancés sur la courbe et de probabilités exactes, alors que l'analyse dit explicitement estimation heuristique. L'accueil admet les noms de cartes envoyés à Scryfall mais affiche aussi zéro donnée envoyée. Privacy affirme ne transmettre aucune information de deck et que les decklists ne quittent jamais l'appareil, sans précision visible sur Scryfall ou le partage. Cette incohérence suffit à réduire ma confiance ; aucun audit réseau ou verdict juridique n'en est déduit.

**P1 — Comparaison peu utile pour mon ajustement, constat live.** Les deux exemples du jour montrent quatorze sorts communs avec « Unavailable » des deux côtés. Les chiffres globaux fonctionnent, mais je ne peux pas comparer les sorts ici. Cause et compatibilité des paramètres non établies : ce n'est pas une preuve de régression du moteur.

**P1 — Conseil éditorial éloigné de ma pratique.** La fiche Sideboarding affirme « FNM doesn't really use sideboards. RCQ does. » Sarah joue justement avec un sideboard au FNM selon son profil. Cette généralisation invalide son expérience et fragilise la crédibilité du parcours.

**P2 — Décision difficile.** Verdict 91/100 Excellent malgré deux couleurs sous les objectifs ; Blueprint annonce un autre indice heuristique à 92. Les deux métriques peuvent être légitimes, mais leur différence n'aide pas à choisir une modification. Le Blueprint perd aussi le nom visible de l'exemple au profit de « Deck 09/09/2026 ».

**P2 — Couverture partielle de mes besoins, inférence persona.** Aucun résultat de tournoi récent, matchup spécifique, suivi de mes victoires ni tier list du set rencontré. La curation apporte des méthodes, pas ma préparation Standard hebdomadaire. Cela ne justifie pas de transformer ManaTuner en portail de métagame. L'exemple détecte Constructed mais choisit Modern/Pioneer ; Sarah doit repérer et adapter le format.

## Notes

| Axe           |       /5 | Justification                                                                                              |
| ------------- | -------: | ---------------------------------------------------------------------------------------------------------- |
| Accessibilité |        4 | Promesse comprise, exemple sans compte ; décisions demandant plusieurs notions.                            |
| Pertinence    |        3 | Mana et parcours RCQ utiles ; besoins Standard/matchups et suivi de résultats partiellement couverts.      |
| Profondeur    |        4 | Estimations documentées, sources, lectures et données par sort ; comparaison indisponible.                 |
| Utilisabilité |        3 | Parcours principal réussi ; comparaison ne répond pas au besoin, informations longues, mobile non vérifié. |
| Confiance     |        3 | Transparence dans l'analyse et source ouverte, mais claims contradictoires et note FNM maladroite.         |
| Partage       |        4 | Blueprint et toast Discord adaptés ; lien réouvert et exports non validés ici.                             |
| **Moyenne**   | **3,50** | **21/6**                                                                                                   |

Baseline documentaire août : 4,50 ; **delta −1,00**, jugement renouvelé avec constats supplémentaires, pas mesure causale d'une régression.

## Verdict et recommandations

« Je reviens pour contrôler ma mana et lire avant un RCQ. Je peux partager une capture à ma team FNM, en précisant les limites ; je garde un autre outil pour le méta et mes résultats. » Aucun P0 constaté dans ce parcours.

1. **P1** Aligner accueil et Privacy sur les limites déjà visibles dans Analyzer, puis vérifier les pages effectivement servies.
2. **P1** Expliquer pourquoi une comparaison est indisponible et proposer de recalculer les deux builds sous les mêmes paramètres.
3. **P1** Corriger la note FNM/sideboard ; contextualiser les articles historiques sans généraliser les pratiques des boutiques.
4. **P2** Rendre le verdict actionnable : une priorité de source manquante, sens des deux indices, nom du deck conservé sur le Blueprint.
5. **P2** Mesurer sur tests utilisateurs le temps jusqu'à un ajustement compris et un artefact Discord exploitable ; privilégier ces parcours avant d'élargir le produit au métagame.
