# S001 — F13 cycle de vie du worker mulligan

6 septembre 2026, base148d5f8 + diff local. Responsable lead. Correction locale, aucun déploiement.

Contrat : une génération possède un worker, ses3 listeners et son timer de démarrage. Construction/postMessage/error/messageerror échouent avec message utile et relance possible ; cleanup retire listeners/timer et termine worker. Toute relance/changement de paramètres/cartes/démontage invalide ancienne génération, efface ancien résultat et neutralise messages tardifs. Les erreurs métier ok:false restent distinguées des messages de plateforme.

Le worker accuse réception par `{id,type:'started'}` avant le calcul. Sans accusé ni résultat sous15s, le chargement du worker échoue et peut être relancé. Après accusé, pas de limite de durée arbitraire : Precise50k sur matériel lent conserve son calcul, et **Cancel analysis** reste accessible. Un worker ayant commencé mais bloqué sans événement fatal nécessite cette annulation explicite ; cette limite est intentionnelle pour ne pas tuer un calcul légitime. Ce n'est pas une garantie de temps maximal du calcul ni une mesure de performance terrain.

Tests : `mulligan-worker-failures.test.tsx` et `mulligan-worker-ui.test.tsx`, mock de plateforme avec listeners séparés, promesses/horloge contrôlées. `red.log` :6 échecs avant correction (notamment construction non interceptée, aucune commande annulation ni libération). Première passe green a révélé un sélecteur d'alerte ambigu entre information et erreur : corrigé sans changer attente ni masquer un échec produit, conservée `green.log`. `green-final.log` :12 tests passants incluant clamps historiques. Tests de précision : accusé suivi d'une heure simulée sans timeout puis Cancel, relance ; succès réel du simulateur local utilisé pour vérifier résultat supprimé pendant relance/erreur puis nouveau succès.

Commande : `npx vitest run tests/math-audit/mulligan-worker-failures.test.tsx tests/math-audit/mulligan-worker-ui.test.tsx src/workers/__tests__ --configLoader runner --no-cache --reporter=dot`.

À compléter : build et E2E `mulligan-worker-recovery.spec.js` bloquant une requête asset du worker en local puis relançant le vrai worker50k ; revue indépendante et contrôles intégrés. AC non cochés sur cette seule note.
