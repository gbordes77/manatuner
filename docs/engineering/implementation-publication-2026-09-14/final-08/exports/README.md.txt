# QA exports FINAL-08 — 14 septembre 2026

Nouvelle exécution complète contre le candidat FINAL-08 servi sur http://127.0.0.1:4198. Aucun fichier source modifié, aucun staging/commit/push, aucun appel au presse-papiers réel.

**3/3 parcours réussis** : Constructed 60 cartes / 24 terrains, sombre 390 px ; Commander 99 + 1, 43 terrains et réserve 2, clair 1440 px ; nom =1+1 avec 59 Plains, clair 390 px. JSON, CSV, TXT téléchargés pour chacun ; texte affiché égal au TXT exact. PDF téléchargé pour Constructed et Commander. Réponses API entièrement mockées localement ; aucune charge ou mesure de latence tiers.

**Recette officielle exécutée sur les trois CSV : 3/3 réussites**. Totaux, zones et noms décodés concordent avec JSON. Commentaire du nom conservant # en premier caractère, cellule de formule protégée par apostrophe et quantité 1 intacte. Exécution réelle dans un tableur : NON EXÉCUTÉE.

Les nouveaux PDF sont rendus par pypdfium2 : Constructed 2 pages, Commander 1 page, aucun texte natif. Leurs trois rendus sont strictement identiques aux rendus FINAL-07 déjà inspectés visuellement, comparaison octet par octet dans render-equivalence-07.json. Le titre Opening Hand et ses valeurs restent ensemble ; commandant nommé, bibliothèque et réserve cohérentes. Le PDF demeure raster et volumineux ; TXT sélectionnable contient le deck complet par zone.

**Dialogue sombre 390 px** : nouveau scan axe WCAG2A/AA/2.1AA zéro violation ; titre 15,91:1 contre seuil 4,5 ; Escape ferme réellement. Cette vérification ne vaut pas test de lecteur d'écran humain ou appareil physique.

DATA004 (quatre PNG/PDF clair/sombre, nom long accentué) reste une preuve historique FINAL-05, non rejouée ici sur instruction du lead. export-source-equivalence-05.json confirme les quatre sources export identiques entre 05 et 08 ; aucune nouvelle exécution PNG n'est prétendue.

Preuves nouvelles : results.json, inspection.json, *-official-recipe.json, téléchargements, rendus et captures, MANIFEST.json. Scripts utilisés : exports/exports-stable.mjs, exports/dialog-a11y.mjs et exports/inspect-exports.py ; EXPORT_BASE_URL4198 et EXPORT_OUTPUT absolu vers ce dossier. Gate 846 tests / 85 fichiers + 101 routes + 16 Chromium attribué au lead, non exécuté par cet agent. Aucun nouveau défaut export bloquant observé.
