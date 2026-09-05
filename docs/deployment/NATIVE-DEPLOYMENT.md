# Publication native unique

La branche `main` est publiée par l'intégration GitHub native de Vercel. Valider le code, pousser le commit, puis vérifier le contrôle Vercel associé à ce SHA et l'alias `www.manatuner.app`. Le job de déploiement GitHub Actions reste désactivé. `npm run deploy` rappelle ce parcours sans déclencher de build distant.

Le CLI Vercel n'est plus une dépendance du dépôt : ses builders serveur n'interviennent ni dans Vite ni dans l'intégration native. Il n'est pas déplacé dans un autre groupe de dépendances. Les anciennes commandes `npm run rollback` et `npm run rollback:list` sont retirées ; consulter l'historique et déclencher un rollback, si nécessaire, dans le tableau de bord Vercel. Aucun rollback n'est automatique.

La compilation Vercel reste `npm run build:vercel`. Ce retrait ne corrige pas les dépendances internes du service Vercel ou d'un CLI installé séparément ; l'audit npm décrit uniquement le graphe effectivement installé par ce dépôt.

Sources : [intégration GitHub](https://vercel.com/docs/git/vercel-for-github), [rollback de production](https://vercel.com/docs/deployments/rollback-production-deployment).
