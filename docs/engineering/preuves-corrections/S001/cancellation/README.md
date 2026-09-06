# F05 — Annulation de génération UI

Date : 2026-09-06. Périmètre : `AnalyzerPage.tsx`, handlers analyze/Clear et cleanup de démontage. Pas de modification du contrat réseau F08.

## Reproduction et correction

`red.log` : 5 échecs / 6 tests avant correction, avec promesses contrôlées ignorant volontairement AbortSignal. Défauts observés : résultat après Clear ; A remplaçant B ; A coupant le loading de B ; absence d'abort au démontage ; callback focus exécuté après Clear. Le rejet obsolète après supersession était déjà protégé.

Le controller courant sert de propriétaire de génération. Clear et démontage invalident cette propriété avant abort et arrêtent le loading. Le succès après await, l'erreur, le finally et le focus différé vérifient la propriété. Toutes les mutations de résultat, format, preset Commander, sauvegarde et notification sont synchrones derrière la vérification du succès ; le callback requestAnimationFrame vérifie à nouveau sa propriété au moment de l'exécution. La route conserve le brouillon au démontage.

## Validation

- `npx vitest run tests/component/AnalyzerPage.cancellation.test.jsx tests/component/AnalyzerPage.test.jsx` : 15/15, `green.log`.
- `npx playwright test tests/e2e/core-flows/cancellation-audit.spec.js --project=chromium --workers=1 --retries=0 --reporter=line --output=docs/engineering/preuves-corrections/S001/cancellation/browser` : 1/1, `browser.log`. Contexte neuf, onboarding désactivé, données Scryfall fixes publiques ; collection retenue jusqu'au Clear, attente de la réponse complète puis vérification éditeur/résultats/historique et rechargement.
- `npx eslint src/pages/AnalyzerPage.tsx` : code retour 0, `lint.log` vide.

## Critères

- AC1 : test composant Clear après succès tardif + navigateur réel avec collection retardée.
- AC2 : espion saveAnalysis jamais appelé après annulation ; historique navigateur vide après réponse et reload.
- AC3 : B termine avant A ; seul résultat B et seule sauvegarde B conservés.
- AC4 : résolution/rejet obsolètes laissent loading B et notifications intacts ; aucun changement format/Commander ni focus obsolète.
- AC5 : démontage/remontage même store avant résolution A, signal annulé, aucun résultat/sauvegarde ; reload navigateur après Clear.
- Non-régression nominale : tests existants AnalyzerPage (9), plus résultat B et sauvegarde effectifs dans la suite génération.

## Limites et intégration

Ces tests ne valident pas l'arrêt physique de toutes les requêtes ou Retry-After (F08). Le scénario A/B utilise le callback du composant pour exercer une supersession même si le bouton est désactivé pendant une analyse. Les composants de rendu lourds sont substitués dans les tests de propriété ; les reducers et la page sont réels. Le parcours navigateur utilise la vraie UI. Le typecheck/build et la revue indépendante sont réservés à la validation commune du coordinateur ; cette fiche seule ne justifie pas encore le statut vérifié.

## Renforcement du parcours navigateur

Le deck de test utilise maintenant `24 Mountain / 36 Lightning Bolt`, deux cartes présentes dans la fixture publique, afin que la résolution nominale puisse réussir. Une modification du brouillon pendant la collection retenue précède Clear ; le test attend aussi 350 ms (au-delà du debounce de persistance de 300 ms) avant de vérifier l’état durable et le reload. Ce parcours vérifie l’intégration avec le correctif debounce de DeckInputSection.
