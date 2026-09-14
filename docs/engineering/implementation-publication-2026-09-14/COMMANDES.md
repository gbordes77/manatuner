# Exécutions de campagne

14 septembre 2026, macOS, main a0a23519253751b9c98d6b93f73822f21e8191c0 à l'entrée. Les logs spécialisés donnent les sorties brutes et tentatives, pas des validations historiques recyclées.

- Inventaire Git + empreintes482fichiers non commités avant écriture ; tracked-historical-head.json complète les rapports propres à HEAD. Aucun reset/worktree/branche créé.
- Lecture mission, backlog16, audit complet et références répartie entre lead/organizer/produit/devops ; rôles réellement disponibles. context-manager absent ; organizer briefing seulement.
- Devop B13/B14 : npm audit avant/après, mise à jour famille Vitest4.1.10→4.1.11, diagnostic logs GitHub,84Chromium sur build intermédiaire et6contrats natifs. Deux rapports propres écrasés par --list ont été conservés dans devops/discovery-reports-incident puis restaurés exactement depuis HEAD ; aucune perte de rapport préexistant.
- Résilience : logs before-codec/before-queue rouges,53tests ciblés réussis ; aucune charge Scryfall. Nouveau constat POSTcollection réel : GETnamedHTTP200en0.16s, POSTexpire12s avec/sansAccept, timeout navigateur8000ms ; reprise bornée distincte documentée.
- Prototype isolé4196, interactions CUA et six avis avant implémentation ; serveur dev4197. QA indépendante Compare13puis15cas, contraste titres rouge2.04/1.24 puis15.93après correction. Firefoxbloqué avant navigation.
- Gatefinal-01 :831tests/84fichiers,101routes,16Chromium acquis. Titre dialogueTextmodifié ensuite : ne pas attribuer ce gate au candidat suivant.
- Gatefinal-02 :831tests/84fichiers,101routes,16Chromium acquis. Audit33Chromium+33WebKit ; Compare15+15 ; persona22/23 (assertion ancien format commentaire CSV rouge). Ces preuves restent distinctes du prochain candidat après correction CSV/réseau.
- Partagefinal-02 : vrai clipboard courant, destinataire neuf+reload, contextecopié égal aperçu, legacyreload, erreur taille conservant deck. Sondeinitiale invalide avait changé seulement hash sur page déjà montée ; reprise force vraie navigation. Ce défaut de sonde n'est pas présenté comme panne du codec.
- Oracles :45événements hypergéométriques BigInt,5populations,codec/débitmock ; première adaptation attendait à tort throw plutôt retourvide encodeDeck, corrigée pour assertion rejet selon contrat.57/57 réussis dans oracles/independent-results-final.json.
- Exports :baseline390darkPDFtitre coupé réellement téléchargé ; fichiers60/99+1+SB2 et formule analysés après. Aucun tableur ou lecteur écran réel prétendu. Voir final-02/exports et devops/export notes.

Toutes sorties build/test utilisent cette campagne et chemins absolus. Gate : PRERENDER_DIST=<campagne>/final-N/candidate, DELIVERY_TEST_OUTPUT=<campagne>/final-N/delivery, MANATUNER_MATH_EVIDENCE_DIR=<campagne>/final-N/math créé explicitement, VITE_SENTRY_DSN vide, npm run build:vercel intact.

Serveurs :4190/4192 préexistants préservés ;4196prototype,4197dev,4198candidat de cette mission. Gate utilise4174/4175 ; audits4201/4202 ; personas3001. Aucun service utilisateur arrêté.

## Final-03 à final-05

- Gate03 :839/85,101routes,16Chromium. AuditWebKit33/33,persona23/23,Compare15+15,exports3/3,partage4/4. AuditChromium32/33 : collision clipboard OS avec sonde partage simultanée ; rouge conservé, rejeu isolé04=33/33. Ne pas lancer simultanément deux suites lisant/écrivant le presse-papiers réel.
- Réseau03 sans mock : analyse réussie et POSTcollection200 ; incident externe précédent rétabli. Le repli après timeout local est testé séparément en mock, pas déduit de ce succès réel.
- Gate04 après manifeste PWA + format Guide :839/85,101routes,16Chromium.155fichiers identiques à03 ; différences manifest.json et ordre des liens preload Analyzer seulement.
- Oracle03 :56/57, intervalle88,966ms. Reproduction contrôlée85ms avec préparation initiale Headers25ms. Horodatage déplacé après Headers/RequestInit, immédiatement avant fetch, sans réduire seuil.36tests ciblés acquis.
- Gate05 : `PRERENDER_DIST`=campagne/final-05/candidate, `DELIVERY_TEST_OUTPUT`=campagne/final-05/delivery, `MANATUNER_MATH_EVIDENCE_DIR`=campagne/final-05/math, tous absolus, dossier math créé, `VITE_SENTRY_DSN='' npm run build:vercel` ;840/85,101routes,16Chromium, audit0. Oracle05 `node final-05/oracles/run.mjs` :57/57, minimum110,55ms sur12requêtes mock locales.
- Audits finaux `npx playwright test --config=playwright.audit.config.js --project=chromium`, puis WebKit, puis `--config=playwright.persona.config.js` exécutés séquentiellement, sorties absolues séparées05. Compare séparé utilise clipboard stub ; export ne copie pas au clipboard.
- Serveur strict4198 remplacé uniquement après identification PID de notre `serve-candidate.mjs` ; anciens serveurs4190/4192 et worktrees préservés.
- Staging applicatif explicite42fichiers, liste application-stage-list.txt ; preuvesJSON brutes copiées en.json.txt pour préserver les octets malgré hookPrettier. Aucun ajout global.

## Clôture technique final-08

UX005 : test réel05/07 rouge malgré premier cleanup ; sonde instrumentée rejette navigationnative, constatealler-retourSPAavantdémontage. Ajoutflush onBlur ; dev réelpasse sansdélai ajouté. Gate06rouge sur optionRTLexact invalide, corrigée sanschanger assertion. Gate07vert845/85 maisUXrouge, nonlivrable. Final08gate846/85+101routes+16Chromium, oracles57/57min109,75ms. UX08immuable3/3 ; audits33+33,persona23,Compare15+15,exports3+recette3,partage4 acquis. Toutes sortiesdistinctes, aucunancienrougeécrasé.

Quatre fichiers de suivi misàjour avec historique conservé. Staging explicit44fichiersapplicatifs etpreuves textuelles choisies ; JSONcopiés en.json.txt pourprotégeroctets deshooks. DerniercontrôlePrettiersources acquis. Commitmain avec hooknormal ; vérificationposthookde l’identité source etpréservation àconsignerPOST-COMMIT.md. Pushconditionnéconfirmationvisuelle propriétaire, sansdemandegénérale d’autorisation supplémentaire.
