# Espacement mesuré au début réel de fetch

Le lead a relu l'oracle final-03 :56/57 acquis, intervalle minimal88,966ms, et non57/57. Ce résultat rouge est conservé dans son dossier ; il ne faut pas recopier un ancien total vert.

Reproduction déterministe neuve `fetch-start-spacing-before.log` : la première préparation Headers coûte25ms simulées, les suivantes sont immédiates. Les débuts fetch sont enregistrés avec performance.now() sous horloge Vitest. Le code précédent fixe nextRequestAt avant cette préparation : **85ms entre les appels**, seuil100ms, test rouge. Cette reproduction isole le mécanisme plausible du constat réel, sans attribuer arbitrairement tout son délai à Headers.

Correction minimale http.ts : préparer Headers et l'objet RequestInit, revérifier l'annulation, puis fixer nextRequestAt immédiatement avant fetch. Intervalle configuré110ms et assertion≥100ms inchangés ; Retry-After, retry et deadlines inchangés. Date.now demeure l'horloge d'ordonnancement existante, performance.now sert à la mesure indépendante du test. Les ajustements système d'horloge ne sont pas exercés ici ; aucune refonte d'horloge ni de timeout ajoutée à ce correctif ciblé.

Après formatage : **36/36 tests,5fichiers réussis** (`fetch-start-spacing-after.log`) : file, nouveaux débuts réels, Retry-After partagé, deadlines HTTP, annulation, repli des collections et budget global30s. Lint ciblé code0 `fetch-start-lint.log`. Sources finales : http.ts et http.scryfallQueue.test.ts ; aucune autre source modifiée par cette correction. Nouvel oracle et gate sur candidat immuable à exécuter par le lead.

Validation ultérieure réellement relue : final-05/oracles/independent-results-final.json,57/57 acquis,12appels mock404, min110,554958ms≥100. Source et preuve du lead ; aucun ancien57copié. Compare15Chromium+15WebKit acquis sur ce même candidat.
