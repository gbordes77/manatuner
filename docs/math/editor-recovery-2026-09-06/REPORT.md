# Incident : analyseur inaccessible après rechargement

Le signalement utilisateur est reproduit sur la production `58648b6` : seul « Your Deck » reste visible, sans zone de saisie ni bouton Analyze. Deux scénarios navigateur échouent avec une sauvegarde v2 contenant `isDeckMinimized: true`, pour un deck renseigné et pour un deck vide. La capture de reproduction est conservée dans `proofs/reproduced-empty-editor.png`. Quatre nouvelles régressions unitaires étaient rouges avant correction.

## Cause et lacune de validation

La persistance introduite en `10845c7` (2 août) retire `analysisResult`, mais conservait `isDeckMinimized`. Le formulaire masquait ses champs sur ce seul indicateur, alors que son action de réouverture exigeait un résultat présent. Après rechargement, l'état pouvait donc être replié et impossible à rouvrir.

Les campagnes précédentes n'avaient pas couvert le cycle complet **analyse réussie → formulaire replié → rechargement**. Le nouveau test de brouillon n'effectuait aucune analyse avant le reload. Un ancien test de sérialisation exigeait même la conservation du mauvais indicateur ; son attente est corrigée en `false`, conformément au nouvel invariant, sans suppression d'assertion.

## Correction ciblée — 2250f12

- Le formulaire reste visible dès qu'aucun résultat n'existe, même si un ancien indicateur replié subsiste en mémoire.
- La sérialisation enregistre un état non replié et la réhydratation répare toutes les sauvegardes existantes, y compris celles déjà en version 2. Aucun effacement du deck ou de son nom, aucune purge de localStorage.
- Le reducer rouvre le formulaire lorsqu'un résultat est supprimé. Le repli après analyse réussie reste actif.

## Régressions et validation

Tests de composant desktop/mobile sur l'état incohérent ; réhydratation de sauvegardes remplies/vides ; suppression de résultat sans perte du deck. Deux nouveaux scénarios E2E injectent un état v2 ancien, vérifient le nom et la liste préservés, collent une liste, analysent, rechargent et analysent à nouveau. Les métadonnées Forest sont contrôlées ; le composant, la persistance et le service d'analyse sont réels.

Les valeurs actuelles, SHA, campagnes et empreintes sont dans `validation.json`. Les chiffres des rapports précédents restent historiques et n'établissaient pas que ce cas avait été testé. Les fichiers de rapports utilisateur préexistants restent exclus des commits et des nouveaux dossiers de preuves.

Clôture du correctif formulaire `2250f12` : 674 tests unitaires, 462 scénarios Linux (77 par profil), zéro ignoré/échec/reprise ; CI et Vercel natif READY vérifiés. Le signalement ultérieur sur les probabilités est traité séparément dans [la revue suivante](../probability-recovery-2026-09-06/REPORT.md).
