# Revue indépendante F08 — S001 — 6 septembre 2026

Relecteur : sous-agent synthèses/parsing, distinct de l'auteur réseau. Revue du diff et code `http.ts`, `cardResolver.ts`, `scryfall.ts`, `landService.ts`, entrée `DeckAnalyzer.analyzeDeck`, `useCardImage`, tests HTTP/annulation/cache et logs réseau. Aucun changement réseau effectué par le relecteur.

## Retour transmis à l'auteur

1. **P2 — dépassement des timers pour un très grand Retry-After.** `parseRetryAfterMs` accepte un nombre de secondes arbitrairement grand ; `abortableDelay` transmettait ce nombre de millisecondes directement à setTimeout. Au-delà de 2^31−1 ms, les runtimes peuvent ramener l'attente à environ 1 ms. Un Retry-After de 31 536 000 secondes pouvait donc provoquer un retry quasi immédiat malgré le contrat documenté. Recommandation envoyée : limiter la tranche d'attente à la plage des timers (la deadline HTTP gagne bien avant), ajouter un test vérifiant aucune seconde requête avant expiration. Constat statique, correction/test avant clôture à charge auteur.
2. **Défense contre annulation en microtâche avant cache.** `fetchCardFromScryfallWithMeta` attend `tryFetch`, qui vérifie le signal, puis écrit le cache dans la continuation sans vérification finale. Un abort provenant d'une autre microtâche entre les deux pouvait laisser cette écriture se produire. Recommandation : garde `throwIfAborted` immédiatement avant cache/retour et passage exact→fuzzy. Ce point est une course identifiée par lecture, pas une reproduction exécutée ici.

## Points validés par lecture et preuves consultées

- Le signal utilisateur atteint fetch et son contrôleur dérivé, reste actif pendant JSON, Retry-After, délais inter-requêtes et fallback. Les catches des résolveurs relancent AbortError et HttpTimeoutError.
- La deadline JSON de 8 s n'est pas renouvelée au retry. `abortable` rejette même lorsqu'un mock de fetch/body ignore le signal ; les timers et abonnements externes sont nettoyés par finally.
- Le budget de résolution 30 s enveloppe réellement le point produit parseDeckList, ses collections et fallbacks. Il ne prétend pas limiter le CPU de l'analyse suivante, ce que la documentation précise.
- 429/5xx seuls sont retentés une fois par défaut ; 400/404, transport et JSON invalide ne le sont pas par le helper HTTP. Les résolveurs peuvent ensuite essayer un nom fuzzy ; c'est une politique de résolution distincte du retry HTTP.
- Une absence exige deux 404 pour `notFound=true`. Les erreurs transitoires de terrain ne créent plus de cache négatif ; les données publiques résolues peuvent être réutilisées après reprise.
- Les consommateurs JSON applicatifs ne restent pas sur l'API header-only `fetchWithTimeout`. La différence entre cette API compatible et `fetchJsonWithTimeout` est explicite.
- Le hook image possède une garde de génération/montage en plus du signal et ne remplace pas une carte courante par une ancienne réponse.

Logs consultés : `network/red.log` (deux défauts reproduits) et `network/targeted.log` (67 tests / 7 fichiers passants à la lecture), README et tests détaillés couvrant Retry-After numérique/date, corps lent, annulation, budget global, reprise terrain/cache. Ces résultats précèdent les retours de revue ci-dessus ; la preuve intégrée après correction doit être conservée par l'auteur/coordinateur.

## Limites

Aucune requête réelle Scryfall, ni panne d'infrastructure externe, ni garantie d'annulation par tous transports tiers. Les tests prouvent la lignée des signaux et les gardes de l'application avec fixtures contrôlées. La validation de schémas des réponses JSON Scryfall demeure distincte de F08 ; cette revue ne certifie pas que toute réponse mal typée est rejetée. Pas d'audit général des producteurs ou du budget CPU. Les deux retours ci-dessus doivent être résolus ou conservés ouverts explicitement avant la clôture F08.

## Relecture après corrections de revue — 12:05 locale

Les deux retours sont intégrés et relus : attente plafonnée à 2 147 483 647 ms dans `abortableDelay`, test `does not overflow the timer for a huge Retry-After` (31 536 000 secondes), gardes après chaque await exact/fuzzy et immédiatement avant cache/retour. `network/targeted.log` consulté après relance : **68 tests / 7 fichiers passants**, début 12:05:10. Le premier finding est désormais couvert par un test dédié ; le second par gardes relues et les tests d'annulation/cache existants (pas de nouveau test spécifique d'ordonnancement microtâche). Aucun finding bloquant F08 restant dans le périmètre de cette revue. Les limites précédemment décrites et la validation intégrée finale restent applicables.
