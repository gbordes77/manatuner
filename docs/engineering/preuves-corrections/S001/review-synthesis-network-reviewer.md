# Revue indépendante supplémentaire F03/F04 — S001

6 septembre 2026. Relecteur frontend/réseau (`keyboard`), distinct de l’auteur synthèses. Cette note restitue ma revue initialement écrite dans review-synthesis.md ; le relecteur cancellation ayant utilisé le même nom, les deux avis sont maintenant conservés séparément.

Aucun défaut bloquant supplémentaire trouvé dans le contrat examiné après lecture des diffs deckAnalyzer, manaCostParser, karstenDeltas, QuickVerdict, AnalysisTab, EnhancedCharts, EnhancedRecommendations, ManaBlueprint/manaStability et des tests.

- OR versus AND : pips fixes R/G séparés, hybrides masques de choix, ordre WUBRGC cohérent. L’absence de cible hybride est expliquée.
- Union physique : filtre `some` sur couleurs du terrain puis somme des quantités ; un dual offrant R/G n’est compté qu’une fois pour le groupe alternatif.
- Répétitions : le score marginal déduplique volontairement les groupes, avec limite explicite. Le moteur physique est testé séparément contre P(X≥2), et zéro avec une seule source pour deux hybrides.
- Non représenté : phyrexian/neige rendent le score indisponible. Les consommateurs principaux gardent la sentinelle zéro hors présentation, les conseils low-consistency sont neutralisés.
- Populations : principal seul pour tailles/sources/exigences, exclusion sideboard et commandant cohérente. Le test post-board construit une population effective et retrouve la cible uniquement après déplacement dans le principal.
- Exports : index Blueprint reçoit les mêmes événements marginaux T2/T4 et retourne null si score indisponible ; valeurs radar constantes retirées.

Commande rejouée indépendamment :

```sh
npx vitest run tests/math-audit/synthesis.f03-f04.test.ts tests/math-audit/synthesis-ui.f03.test.tsx tests/math-audit/physical-engine.test.ts tests/math-audit/spell-summary.test.ts tests/math-audit/regressions.test.ts tests/math-audit/populations.test.ts
```

Preuve `review-synthesis-network-reviewer-tests.log` : 69 tests passants dans 6 fichiers, démarrage 12:06:56. Ce log est la copie de ma sortie originale conservée après conflit de nom documentaire. Aucun code synthèses modifié par ce relecteur.

Limites : le parcours UI post-board est à l’intégration lead ; ces tests portent sur fonctions/populations contrôlées. Le score reste marginal, sans pondération de fréquence, simultanéité ou sequencing. La revue historique/comparaison F06 est séparée ; aucun réseau de production utilisé.
