# Revue QA exports FINAL-05 — 14 septembre 2026

Rejeu réel complet contre le candidat courant immuable http://127.0.0.1:4198. Aucun changement de source, staging, commit ou push. Aucun appel au presse-papiers réel ; les assertions comparent téléchargements et texte du dialogue dans des profils neufs.

**3/3 parcours réussis** : Constructed60/24 à390px sombre ; Commander99+1,43terrains et réserve2 à1440px clair ; nom formule=1+1 avec59Plains à390px clair. JSON/CSV/TXT réellement téléchargés pour chacun ; contenu TXT strictement égal au dialogue. PDF pour Constructed et Commander. Les noms/API sont des fixtures synthétiques avec réponses interceptées localement ; aucun test de charge tiers.

**Recette officielle** read-blueprint-csv.py exécutée sur les trois CSV : code0 et totaux conformes aux JSON. Le commentaire#du nom reste en début de ligne et son décodage CSV retrouve le nom original ordinaire. La cellule=1+1 est neutralisée par apostrophe, quantité conservée. Exécution tableur NON EXÉCUTÉE.

**Rendus PDF inspectés** via pypdfium2 :2pages Constructed, titre Opening Hand avec77/77/19/3 ensemble surpage2 ;1page Commander avec nomAtraxa,99+1 et réserve2. Tous les PDF restent raster sans texte natif ; les TXT assurent le contenu sélectionnable et le deck entier par zone. Le poids des PDF reste élevé (environ12,5Mo/22,6Mo) ; les zones très longues peuvent être scrollables sur la capture, TXT complet en alternative.

**Dialogue390sombre** : axeWCAG2A/AA/2.1AA zéro violation, contraste du titre15,91:1 pour seuil4,5 ; Escape ferme réellement. Ce résultat ne remplace ni appareil physique ni lecteur d'écran humain.

Preuves : results.json, inspection.json, *-official-recipe.json, fichiers téléchargés, captures/rendus et MANIFEST.json. Rejeu scripts exports/exports-stable.mjs et exports/dialog-a11y.mjs avec EXPORT_BASE_URL4198, EXPORT_OUTPUT absolu vers ce dossier ; inspection reproductible exports/inspect-exports.py via Pythonruntime pypdfium2. Logs copie locale jointe.

Gate et oracles courants sont ceux du lead : ne pas leur attribuer une nouvelle exécution par cet agent. Aucun défaut export bloquant nouvellement observé sur FINAL-05 ; les limites raster, poids, tableur/lecteur d'écran demeurent déclarées. Publication suit la confirmation visuelle du propriétaire et les contrôles Git/Vercel du lead.
