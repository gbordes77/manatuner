# UX-005 — conserver la dernière saisie avant navigation interne

Reproduction navigateur du lead sur final-05 : modification25/35 puis navigation Guide immédiate et retour, dernière saisie perdue. Le debounce300ms était annulé au démontage sans transmettre le texte au parent. Rapport lead : final-05/matrix-ux/run3 results. Reproduction unitaire indépendante avant modification : `draft-navigation-before.log`, deux tests rouges (démontage immédiat et callback courant sous StrictMode), huit autres acquis.

Six avis simulés avant correction confirmés par le lead dans product/FINAL-PERSONAS.md : conserver le texte brut, zones, Unicode et saisie incomplète ; aucune analyse/sauvegarde historique implicite ; Clear et exemple prioritaires ; callback courant ; nettoyage StrictMode idempotent. Le nom de deck est déjà transmis directement au parent et n'est pas modifié.

Modification limitée à DeckInputSection.tsx : une ref conserve le dernier texte en attente ; une autre conserve le dernier callback parent. Au démontage, le timer est annulé et seul un texte effectivement en attente et différent du dernier texte transmis est synchronisé. La ref en attente est vidée avant dispatch : aucune double transmission. La transmission déclenchée par Analyze et par échéance du debounce vide également cette ref. Les mises à jour externes, Clear et Try Example invalident l'ancien texte avant leur action. Try Example réinitialise aussi l'éditeur si le parent choisit un exemple identique à son ancienne valeur.

Aucune modification des calculs, du protocole de partage ou des enregistrements d'analyse ; le composant n'appelle pas onAnalyze lors de ce nettoyage. Cette correction vise la navigation SPA et le retour au formulaire. Elle ne prétend pas forcer redux-persist à finir avant fermeture de fenêtre, panne de navigateur ou rechargement complet.

Validation : `draft-navigation-after.log`, **15/15 tests sur3fichiers acquis** : debounce, transmission Analyze, départ immédiat avec zones/Unicode/incomplet, callback remplacé sans flush précoce, StrictMode sans double dispatch, Clear/TryExample suivis immédiatement d'un démontage, remplacement externe de sample ; clavier/éditeur récupérable existants. Lint final code0 `draft-navigation-lint-final.log`, typecheck global code0 `draft-navigation-types-final.log`.

Essais intermédiaires conservés : premier lint prefer-const sur variable de test ; première vérification types détecte option exact issue de Playwright non admise par Testing Library. Les deux sont corrigés dans le test, sans supprimer d'assertion. Test source final utilise name:string (correspondance exacte par défaut). Formatage réalisé avant les tests fonctionnels ; dernières retouches uniquement types/lint de ce test.

Sources finales : composant et son fichier debounce.test.tsx seulement. Rejeu E2E immédiat et gate final-06 à réaliser par le lead sur candidat stable ; aucune ancienne réussite de final-05 ne doit être attribuée à ce correctif.

## Complément réel : navigation rapide avant démontage d'une route lazy

Le candidat final-07 a conservé le défaut dans la sonde UX du lead malgré les tests unitaires du nettoyage. Cette preuve rouge n'est pas annulée par leurs réussites.

Reproduction instrumentée sur développement4197, `draft-blur-before/results.json` : après clic Guide, URL=/guide mais le textarea précédent est encore monté ; performance.timeOrigin est identique sur Guide/retour. Le brouillon25/35 reste visible après retour immédiat, alors que le stockage contient24/36 ; un reload restitue24/36. Footer utilise bien RouterLink. Donc ce constat n'étaye pas une navigation native complète : le nettoyage React n'a pas encore eu lieu lorsque la navigation lazy est aussitôt inversée puis suivie d'un reload.

Correction minimale complémentaire : TextField appelle flushDeckList sur blur. Le brouillon est envoyé au parent dès la sortie du champ avant le clic Guide, sans attendre démontage ou300ms. Les protections contre doublons, les remplacements Clear/exemple et les callbacks courants sont conservés. Aucun routage ou stockage externe modifié.

Preuve avant unitaire : `draft-blur-before/unit.log`, nouveau scénario rouge de blur avec éditeur toujours monté. Après : **16/16 tests sur3fichiers**, `draft-blur-unit-final.log`, typecheck global etlint ciblé code0 (`draft-blur-types.log`, `draft-blur-lint.log`).

**Reproduction navigateur réellement réussie après correction**, avant annonce de stabilité : `draft-blur-after/run.mjs` et `results.json`. Même séquence sans délai de sommeil ajouté : analyse originale→Guide/back, reloadoriginal, saisie25/35→Guide/back puisreload. Texte25/35 et stockage25/35 constatés au retour puis aprèsreload. À l'instant exact aprèsGuide, le stockage peut encore avoir24/36 : redux-persist reste asynchrone. Aucune garantie de flushsynchrone au niveau disque ni de survie à une fermeture brutale n'est revendiquée. Cette sonde valide le parcours précis mesuré ; prochain gate/candidat immuable à revalider par le lead.

### Preuve sur build immuable FINAL-08

Résultat du lead effectivement relu : final-08/matrix-ux/results.json,3/3réussites dont saisie nonanalysée25/35 aprèsGuide/retour/reload. Le cas de perte reste documenté sur07 et surdevavantblur ; il est résolu sur08 pour ce parcours. Compare15Chromium+15WebKit rejoué sur08 sans régression identifiée. Cette preuve est distincte des16tests ciblés du composant et ne promet pas un flush disque avant fermeture brutale.
