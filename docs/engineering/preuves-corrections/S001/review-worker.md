# Revue indépendante F13 — 2026-09-06

Relecteur : agent cancellation, non auteur du correctif worker. Diff lu : `MulliganTab.tsx`, `mulliganArchetype.worker.ts`. Tests lus : `mulligan-worker-failures.test.tsx`, `mulligan-worker-ui.test.tsx` et parcours `mulligan-worker-recovery.spec.js`.

Aucun finding bloquant identifié dans le périmètre relu.

- La construction est maintenant dans un try/catch ; le précédent worker et le résultat sont abandonnés avant toute relance. Une construction impossible produit une erreur récupérable.
- Chaque génération possède worker, listeners, minuterie et booléen `finished`. Le compteur de requête est invalidé avant cleanup et toute réponse doit correspondre au compteur ainsi qu'à l'id du message. Les callbacks conservés artificiellement après retrait deviennent donc inopérants.
- Les événements de plateforme `error` et `messageerror`, la réponse métier négative et l'exception postMessage convergent vers une sortie qui retire les trois listeners, termine le worker et libère loading. La réussite termine également le worker. Le démontage appelle stopWorker et ne laisse pas de callback propriétaire.
- Le worker envoie `started` avant la simulation. La borne de 15 secondes ne vise que cette première réponse. Après accusé de réception, il n'y a plus de délai total qui interromprait arbitrairement les 50k itérations ; Cancel reste disponible et rend une relance possible.
- Les tests utilisent une fausse plateforme worker pour déclencher chaque panne, conserver un listener ancien, contrôler les timers et vérifier le cleanup. Un cas valide le résultat terminé puis échec de relance puis nouvelle réussite. Le E2E relu intercepte exclusivement le premier asset worker, puis autorise un vrai worker 50k et vérifie absence de pageerror.

## Vérification et limites

Commande de revue : `npx vitest run tests/math-audit/mulligan-worker-failures.test.tsx tests/math-audit/mulligan-worker-ui.test.tsx src/workers/__tests__/mulliganClamp.t15.test.ts`, sortie `review-worker-tests.log`.

La revue ne rejoue pas le navigateur réel ; ce résultat relève de la campagne intégrée du coordinateur. L'absence de borne après `started` permet volontairement à un worker silencieux mais vivant de poursuivre jusqu'à Cancel : c'est le contrat explicite retenu pour F13-AC4, pas une détection d'immobilité totale. Les messages positifs proviennent du worker livré avec l'application et ne font pas l'objet d'une validation structurelle complète du résultat au niveau composant ; aucune entrée distante arbitraire n'a été identifiée sur ce canal. La limite de démarrage de 15 secondes reste un choix produit, testée comme telle.

Résultat effectivement lu : **12/12**, 3 fichiers, `review-worker-tests.log`.
