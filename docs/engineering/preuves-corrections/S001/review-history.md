# Revue indépendante F06 — S001

6 septembre 2026. Relecteur : sous-agent frontend/réseau, distinct de l’auteur du lot historique. Lecture du diff `privacy.ts`, `MyAnalysesPage.tsx`, `PrivacySettings.tsx`, des consommateurs `usePrivacyStorage` et des tests ; aucune modification de ces composants effectuée pour la revue.

## Résultat initial : une correction encore nécessaire

**P2 — un score top-level invalide masque un deck brut exploitable.** L’enveloppe Zod impose déjà `consistency` dans [0,1], donc le contrôle ultérieur `summaryValid` ne peut jamais récupérer un score ancien `87`. L’entrée est cachée avant construction de la vue recoveryOnly. Reproduction indépendante : commande ci-dessous, 22 tests passants et 1 échec du nouveau test `recovers an old top-level score...` ; `records[0]` absent. Cela confirme le signalement du lead et laisse F06-AC3 ouvert sur ce cas tant que sa protection ne passe pas.

## Observations secondaires transmises à l’auteur

- Le schéma de résultat contient uniquement des champs optionnels et `.passthrough()`. Un objet ne contenant que des clés inconnues, par exemple `{foo:'bar'}`, passe et n’est pas vide au sens `Object.keys(result.data)`. Il devient donc un résultat normal dans l’historique (valeurs de remplacement zéro et comparaison disponible) plutôt qu’un deck à réanalyser. Recommandation : décider à partir des champs reconnus ou exiger un noyau minimal pour considérer le résultat exploitable. Constat statique, pas de crash identifié.
- La branche de message quota utilise `error instanceof Error`. Dans l’environnement jsdom de cette campagne, DOMException ne satisfait pas cette condition (même frontière corrigée dans F08) : un quota simulé reçoit le message générique « storage unavailable ». Les tests quota F06 vérifient un motif trop large `/storage|quota|full/` et surtout la préservation ; une assertion du diagnostic spécifique « storage full » protégerait aussi F06-AC5. La préservation atomique des données est correcte indépendamment du libellé.
- Le commentaire `deleteAnalysis` évoque encore un fallback quota supprimé. Mise à jour documentaire souhaitable pour éviter une fausse explication.

## Points vérifiés par lecture et tests

- Les champs consommés par `.toFixed`, `.filter`, `.map` dans les cartes et la comparaison sont typés avant lecture : coût moyen, cartes, distribution, probabilités et spellAnalysis. Les payloads historiques averageCMC chaîne et cards contenant null sont refusés à l’import ; les entrées stockées endommagées sont isolées.
- Les imports sont fusionnés avec conservation de l’enregistrement existant pour un ID identique ; tous les objets sont validés avant écriture. JSON invalide, limite 50, source illisible et quota ne remplacent pas l’historique.
- Lecture sans migration destructive ; sauvegarde/export préservent les éléments bruts invalides. Une sauvegarde réussie consolide les deux clés puis retire l’ancienne. Suppression ciblée n’efface pas les objets invalides sans identifiant exploitable.
- Les objets explicitement recoveryOnly ne sont pas sélectionnables pour comparaison et le chargement conserve le texte brut.
- UI Import annonce fusion/doublons/réanalyse, et les erreurs de lecture/export/import sont visibles. L’export d’une source JSON illisible refuse de prétendre produire une sauvegarde complète ; les octets originaux restent en stockage.

## Commande et preuve

```sh
npx vitest run src/lib/__tests__/privacy.history.test.ts src/lib/__tests__/privacy.clearAll.test.ts
```

Résultat de revue initial : `review-history-tests.log` (22 passants, 1 échec). Cette revue ne remplace pas les parcours navigateur d’import/export ni la relance intégrée après correction. Le fichier de suivi principal reste sous responsabilité du lead.

## Addendum après corrections — 6 septembre 2026, 12:09

Relecture du code final et relance indépendante : **28 tests passants dans 2 fichiers**, preuve `review-history-tests-final.log`, même commande que ci-dessus.

Les trois points sont traités : la lecture d’un ancien score top-level 87 garde le deck en récupération, tandis qu’un nouvel import mal typé est refusé ; un résultat unknown-only ou partiel est marqué recoveryOnly tant que le noyau de statistiques nécessaire à la comparaison manque ; le diagnostic quota reconnaît DOMException et annonce explicitement « Browser storage full ». Les nouvelles assertions couvrent ces cas et la conservation des statistiques historiques complètes sans exiger des métadonnées moteur actuelles. Le commentaire de suppression a également été actualisé.

Aucun finding bloquant restant identifié dans ce périmètre relu. La comparaison est interdite aux entrées recoveryOnly, le contenu brut reste disponible à Load, et les imports refusés préservent les octets antérieurs. Les parcours navigateur et la validation de l’artefact intégré restent documentés par le lead, sans prétention de cette revue à les remplacer.
