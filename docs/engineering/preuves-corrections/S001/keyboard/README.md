# S001 — F07 réédition clavier, protection F11-AC1

6 septembre 2026. HEAD de départ : `148d5f85ee26e60cdb10c6351031c89c03fd7ed0`. Correctifs locaux non commités : `AnalyzerPage.tsx`, `DeckInputSection.tsx`, test composant `DeckInputSection.keyboard.test.tsx`, E2E `edit-deck-keyboard.spec.js`. Le manifeste global de S001 identifie le diff intégré ; HEAD seul ne contient pas le correctif.

## Contrat et correction

Le résumé compact comporte un véritable bouton « Edit Deck », `aria-expanded=false` et `aria-controls` vers le conteneur présent et caché de l’éditeur. Une activation ouvre l’éditeur et focalise sa textarea, dont le contenu est conservé. Le résumé parent n’a plus de gestionnaire click : aucune double activation ni contrôle interactif imbriqué. La variante compacte autonome de DeckInputSection applique le même contrat. L’état ouvert est indiqué par l’éditeur visible et son champ focalisé ; le bouton de réouverture disparaît.

Le bouton reçoit un outline explicite de 3 px. Le thème anime sa largeur pendant 300 ms : la vérification attend une largeur calculée >= 2 px au lieu d’échantillonner la première frame à 0 px. Le parcours pointeur cible désormais le bouton Edit Deck (la surface décorative du résumé n’est plus cliquable).

Par coordination F01/F02, AnalyzerPage affiche aussi les `inputWarnings` du parseur dans une alerte au-dessus des résultats. Les preuves métier de cet affichage appartiennent au lot parsing intégré.

## Preuves avant/après

- `component-red.log` : 3 tests échouent avant correction (bouton nommé absent).
- `red.log` et `red-artifacts/` : 3 E2E Chromium échouent avant correction (bouton nommé absent). Les snapshots constatent bien des résultats 60 cartes / 24 terrains puis le simple texte Edit Deck. Le défaut F07, et non une panne de calcul, est reproduit. Cela constitue la protection négative F11-AC1.
- `component-green.log` : 6 tests passent, dont 3 ouvertures Enter/Espace/clic de la variante autonome et 3 non-régressions debounce/synchronisation/état vide existantes.
- `green.log` : 4 E2E Chromium passent (Enter à 1440 px, Space à 768 px, clic à 360 px, tap émulé à 360 px).
- `green-artifacts/*/edit-focused.png` : captures du focus. La capture 360 px a été inspectée visuellement : résumé et bouton accessibles, focus visible, aucun débordement du document.
- `lint.log` : lint ciblé passant. Types, build et relecture indépendante sont coordonnés au niveau intégration.

Les E2E emploient le chemin produit `/analyzer`, remplissent et analysent `24 Mountain / 36 Lightning Bolt`, puis parcourent Tab avant activation. Métadonnées publiques fixes dans `tests/fixtures/scryfall-audit.json`, requêtes Scryfall interceptées par `audit-browser.js`, contextes Playwright isolés. Ce deck synthétique n’est pas une validation de légalité tournoi.

Les quatre parcours vérifient : nom/rôle, état fermé, cible controls présente, focus clavier visible, ouverture, focus textarea, contenu intégral puis édition, une seule activation click, absence de pageerror, absence de débordement horizontal à la largeur testée.

## Commandes

```sh
npx vitest run src/components/analyzer/__tests__/DeckInputSection.keyboard.test.tsx
npx vitest run src/components/analyzer/__tests__/DeckInputSection.keyboard.test.tsx src/components/analyzer/__tests__/DeckInputSection.debounce.test.tsx
npx playwright test tests/e2e/accessibility/edit-deck-keyboard.spec.js --project=chromium --workers=1 --retries=0 --reporter=line --output=docs/engineering/preuves-corrections/S001/keyboard/green-artifacts
npx eslint src/pages/AnalyzerPage.tsx src/components/analyzer/DeckInputSection.tsx src/components/analyzer/__tests__/DeckInputSection.keyboard.test.tsx --max-warnings=0
```

La commande red E2E utilisait `--output=docs/engineering/preuves-corrections/S001/keyboard/red-artifacts` avant correction, trois activations desktop. La version finale étend les mêmes assertions aux trois largeurs et au tap. Les sorties sont redirigées vers les logs nommés ci-dessus.

## Portée

F07-AC1 à AC4 couverts par les preuves ciblées, sous réserve de revue et validation intégrées. F11-AC1 couvert par red + green ciblés ; cela ne clôture pas F11. Pas de lecteur d’écran physique, Safari réel, audit WCAG global ou publication. L’émulation tactile Chromium n’est pas une mesure sur appareil physique.

## Complément de revue F05 — Clear et debounce

La revue croisée a révélé un brouillon en attente de persistance susceptible d’être restauré 300 ms après Clear pendant une analyse. Test réel DeckInputSection avec horloge contrôlée : saisir un brouillon, cliquer Clear, vérifier le champ vide, avancer 300 ms sans mutation du parent, puis saisir à nouveau et vérifier cette nouvelle persistance. `clear-debounce-red.log` reproduit l’ancienne publication du brouillon après Clear (1 échec, 3 tests existants passants).

Correction : invalider le timer lors de la synchronisation d’un texte externe et lors du clic Clear, y compris si le parent était déjà vide ; remettre aussi le brouillon local à vide. Aucun handler AnalyzerPage modifié pour ce complément. Le test final couvre un parent précédemment rempli et un parent déjà vide ; `clear-debounce-green.log` contient 8 tests passants (5 debounce, 3 clavier). `clear-debounce-lint.log` : lint ciblé passant.

Commande : `npx vitest run src/components/analyzer/__tests__/DeckInputSection.debounce.test.tsx src/components/analyzer/__tests__/DeckInputSection.keyboard.test.tsx`. La protection porte sur l’état d’édition ; les preuves de génération/annulation restent dans le lot F05.
