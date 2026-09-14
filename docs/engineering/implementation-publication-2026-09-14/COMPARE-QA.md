# QA indépendante Compare B05 / contexte B06

Responsabilité : tests seulement, aucun code produit modifié par l'agent QA. Sources relues : CompareChange, CompareView, ShareContext, variant, comparison, analysisText, stockage PrivacyStorage. Serveur de développement de cette phase : http://127.0.0.1:4197/analyzer . Les résultats ci-dessous ne constituent pas encore les preuves du build final.

## Couverture et résultats réellement acquis

- `compare-qa-1.log` : 13/13 Chromium réussis, 23,5 s, première suite.
- `compare-qa-2-webkit.log` : 13/13 WebKit réussis, 30,8 s. Annulation renforcée pour attendre une requête effectivement interceptée avant annuler, puis relâcher la réponse.
- `compare-qa-3-firefox.log` : BLOQUÉ avant navigation. browserType.launch échoue : Firefox1543 «Could not find profile folder», exit1. Le test apparaît failed dans Playwright, mais aucune assertion applicative exécutée.
- `compare-qa-4-chromium.log` : 13/13 Chromium réussis, 20,8 s ; fond opaque explicite et attente de fin de transition vérifiés.
- `compare-qa-5-health.log` : 2/2, nouveau cas de coûts différents sur Chromium et WebKit. Health/Consistency deltas masqués, Lightning Bolt commun garde son delta en points.
- `compare-qa-6-contrast.log` : nouveau cas ROUGE, défaut réel de contraste sur les trois titres de la fenêtre en thème sombre. Titre bleu rgb(10,79,133) sur rgb(25,26,31), ratio2,043<4,5 ; titres A et List changes rgb(44,44,44), ratio1,244<4,5. Captures et trace conservées. Signalé au lead pour correction de color:text.primary avant validation finale.

Les traces, captures et pièces jointes sont dans les dossiers correspondants. Aucun dossier ancien réutilisé. Tous les appels Scryfall des scénarios passent les fixtures locales du projet ; aucune charge de test tiers.

## Contrats vérifiés

CMP01–02 : entrée depuis résultat, A prérempli, édition B manuelle, diff Removed4Mountain / Added4LightningBolt, calcul désactivé sans changement, original et stockage inchangés pendant B.

CMP03 : delta commun exprimé en points ; population59vs60 masque les deltas ; coûts nouveaux masquent les seuls deltas d'heuristique Health/Consistency sans faire disparaître le résultat commun comparable. Pas d'oracle mathématique indépendant additionnel dans ces scénarios UI.

CMP04 : jeu synthétique99 cartes bibliothèque +1 Atraxa ; total99 confirmé, commander immuable, tentative changement refusée, modification35→36 terrains compensée64→63 sorts conserve la population99 et le commandant.

CMP05 : QuotaExceededError injectée seulement sur le stockage d'historique après calcul ; message explicite, historique structurellement intact, B conservé ; quota retiré puis sauvegarde sous ID distinct, A conservé octet logique identique, nouveau nom et20terrains corrects.

CMP06 : annulation d'une requête réellement en vol, réponse tardive relâchée, aucun B ni bouton Save actif ; abandon ferme, focus retourne à l'entrée ; aucun nouvel historique. Retour Edit Deck après abandon conserve la saisie originale24/36.

B06 : texte A→B présent, listes exclues par défaut, options nom/listes activables, les deux zones ajoutées au reçu ; clipboard simulé reçoit exactement l'aperçu ; refus clipboard affiche récupération manuelle. Ce test n'atteste pas le presse-papiers système d'un navigateur utilisateur.

Responsive : 320/390/768/1440, clair/sombre, aucune largeur document/dialog débordante ; comparaison bidimensionnelle reste dans région horizontale540px focalisable, ArrowRight puis Escape et fermeture. L'absence de débordement extérieur ne signifie pas que toutes les colonnes sont visibles simultanément à320px ; le défilement horizontal local est nécessaire. Pas de téléphone physique ni lecteur d'écran.

## Revue visuelle et attribution prudente

La première capture Chromium320dark présentait le texte arrière-plan à travers le dialogue et Save semblait grisé ; la capture WebKit ne reproduisait pas cet aspect. La palette source était déjà opaque : hypothèse de transition Fade non achevée, pas un bug d'opacité établi. Le lead a explicité le fond local ; la sonde attend désormais opacity1 et désactive les animations de capture. Nouvelle suite Chromium acquise. Ce constat est distinct du défaut de couleur des titres mesuré ensuite, qui est un vrai échec quantitatif.

## Réserves des six personas

Référence : product/PROTOTYPE-REVIEW.md et product/PREIMPLEMENTATION-PERSONAS.md, avis simulés uniquement.

- Léo : choix manuel et brouillon explicités ; effort d'édition texte novice reste non mesuré auprès de vrais joueurs.
- Sarah : séparation Analyze/Save confirmée techniquement, quota et maintien A vérifiés.
- Karim : diff visible et sorts communs distincts ; pas de taux de victoire, pas de nouvelles probabilités du prototype.
- Natsuki : entrée unique puis édition directe ; aide facultative, coût humain de temps non mesuré.
- David : modèle snapshot visible avant calcul, populations incompatibles masquées ; vérification des coûts Health ajoutée après retour produit.
- Thibault :99+1 réellement exécuté sous fixtures, commandant verrouillé et exclu bibliothèque ; aucune étude de vrais decks Commander.

CMP07 demeure NON EXÉCUTÉ (humain). Le contraste sombre rouge doit être corrigé puis vérifié ; les premiers tests fonctionnels verts n'annulent pas cet échec.

## Réexécution sur candidat final

Configuration dédiée : playwright.changes.config.js, suite tests/e2e/core-flows/compare-change.spec.js, désormais15cas. Fournir CHANGES_BASE_URL et CHANGES_TEST_OUTPUT absolu neuf. Tests retries0, workers1, navigateurs sélectionnés explicitement. Le build final et sa publication sont sous responsabilité lead et ne sont pas revendiqués ici.

### Correction vérifiée avant gate

Le lead a explicitement lié les trois titres à text.primary. `compare-qa-7-contrast-fixed.log` :2/2 Chromium/WebKit acquis, texte rgb(245,245,245) sur rgb(25,26,31), ratio15,934 pour chaque titre. Le défaut de contraste ci-dessus est résolu sur développement ; son test reste dans les15cas à rejouer sur candidat final. Aucun défaut bloquant connu subsiste dans cette couverture, sous réserve de cette réexécution.

## Conclusion indépendante sur candidat final-02

Réexécution réelle du build servi http://127.0.0.1:4198/analyzer, dossier candidat `final-02/candidate`, sans modification produit par l'agent QA :

- **15/15 Chromium acquis en20,0s**, `final-02/compare-chromium.log`, captures dans `final-02/compare-chromium/`.
- **15/15 WebKit acquis en27,8s**, `final-02/compare-webkit.log`, captures dans `final-02/compare-webkit/`.
- Nouvelle tentative Firefox sur cette URL : **BLOQUÉ avant navigation**, même erreur browserType.launch / Could not find profile folder, exit1 ; `final-02/compare-firefox.log` et trace. Le build n'a pas été chargé par Firefox ; ce n'est pas une panne de Compare constatée.

Les15cas incluent tous les contrats décrits plus haut, B06, coûts Health différents, ainsi que le contraste des trois titres : **15,934:1** dans les deux navigateurs, seuil4,5. Les captures finales Chromium320 clair et sombre ont été réellement ouvertes et inspectées par l'agent : titres lisibles, fond opaque, boutons présents, comparaison dans sa région horizontale focalisable. La capture est prise après ArrowRight : une partie des libellés est volontairement hors fenêtre de cette région ; cela ne prouve pas l'absence d'effort de navigation horizontal pour un novice. Les huit combinaisons de largeur/thème passent sur chaque navigateur.

Conclusion : **aucun défaut bloquant identifié dans la couverture technique B05/B06 sur final-02**. Les résultats UI ne certifient ni toutes les cartes/mécaniques ni l'utilité réelle ; CMP07, étude humaine, appareil physique et lecteur d'écran restent non exécutés. Clipboard simulé et fixtures réseau restent explicitement distincts d'un copier-coller système ou des performances du tiers. Les réserves personas éditoriales sur l'effort novice et le défilement horizontal demeurent pertinentes. Publication, identité SHA distant et smoke public restent à établir par le lead après les autres gates.

## Conclusion actualisée — candidat final-03

Cette exécution remplace final-02 comme preuve courante après le correctif de repli GET sur timeout local des collections. Sources gelées ; aucun code produit ni test modifié pendant cette validation.

- **15/15 Chromium acquis,43,3s** : `final-03/compare-chromium.log`, sorties `final-03/compare-chromium/`.
- **15/15 WebKit acquis,59,8s** : `final-03/compare-webkit.log`, sorties `final-03/compare-webkit/`.
- **Firefox BLOQUÉ avant navigation**, tentative unique actuelle, même erreur de lancement/profile folder : `final-03/compare-firefox.log`, trace dans dossier propre. Aucun résultat Firefox de l'application déduit.

Durées de suites concurrentes avec d'autres validations, pas mesures de latence utilisateur. Contraste des trois titres sombre encore15,934:1 sur les deux navigateurs. Capture finale Chromium320sombre réellement ouverte : titres lisibles, fond opaque, actions présentes, scroll horizontal local conservé.

Identité locale partielle contrôlée : asset servi AnalyzerPage-DvoAuJFJ.js identique octet pour octet à final-03/candidate/assets, SHA2562694faf6799e9b501a0e056ea3d27b123be739d74862776c6e0597a624609e95 (`final-03/compare-candidate-identity.json`). Ce contrôle relie le module servi à ce candidat ; il ne prétend pas être une attestation complète du déploiement public.

**Conclusion QA B05/B06 inchangée : aucun défaut bloquant identifié dans ces15scénarios du candidat final-03.** Annulation, identité A/B, stockage/quota, populations, Commander99+1, coûts Health, reçu, clavier/reflow et contrastes sont acquis sous fixtures. Tests réseau réels et audits complémentaires du lead restent des preuves séparées. CMP07/humains/appareils physiques/lecteurécran restent non exécutés ; clipboard demeure simulé. Les rapports/captures final-02 et de développement sont conservés et ne sont pas présentés comme nouvelles exécutions.

## Conclusion courante — candidat final-05

Après correction de l'horodatage réel des départs fetch, les15scénarios ont été rejoués sans modification source sur le candidat final-05 immuable servi4198 : **15/15Chromium en23,2s** et **15/15WebKit en34,4s** (`final-05/compare-chromium.log`, `final-05/compare-webkit.log`). Captures et pièces jointes dans les dossiers dédiés ; contraste titres15,934:1 confirmé dans les deux navigateurs. Aucune interaction avec le presse-papiers système : B06 utilise exclusivement le stub et son refus simulé.

Identité locale du module vérifiée avant exécution : AnalyzerPage-ComUfyKn.js servi identique au candidat, SHA2562cd1106f2dd19f6920cf10436f2edee706be47ed86ef6d653b064fcf216d6a66 (`final-05/compare-candidate-identity.json`). La première lecture avant bascule du serveur renvoyait404 ; aucune suite n'a été lancée avant le contrôle positif. Aucun ancien résultat n'est attribué à ce candidat.

Oracle indépendant du lead **réellement relu** dans `final-05/oracles/independent-results-final.json` :57réussites/0échec, espacement minimal110,554958ms sur12requêtes mock404. Il remplace le résultat56/57 rouge de final-03, sans effacer sa preuve ; pas de charge tiers ni de performance réelle extrapolée. Voir `resilience/FETCH-START-SPACING.md` pour le défaut et sa correction.

Firefox n'est pas relancé inutilement : binaire inchangé, blocage de lancement déjà reproduit dans final-03 avant navigation. **BLOQUÉ, aucune validation Firefox de final-05**.

Conclusion technique B05/B06 : aucun défaut bloquant identifié dans la couverture actuelle15×2. Les réserves précédentes sur compréhension humaine/CMP07, appareils physiques, lecteur d'écran, clipboard simulé, fixtures réseau et défilement horizontal mobile restent valides. Le smoke public et l'identité du déploiement sont séparés de cette QA locale.

## Final-07 — Compare acquis, candidat global non validé

Rejeu inchangé **15/15 Chromium24,3s +15/15 WebKit35,1s**, preuves `final-07/compare-*.log`. Asset AnalyzerPage-Cvg3vTAz.js servi4198 identique au candidat (`compare-candidate-identity.json`), contraste titres15,934:1. Gate845/85 etoracle57/0 réellement relus. Aucun clipboard réel utilisé par cette suite.

**Cela ne valide pas final-07 pour publication** : le cas UX de brouillon immédiat→Guide/back/reload échoue séparément (`final-07/matrix-ux/results.json`). Correction complémentaire blur ensuite réalisée et vérifiée sur développement, détaillée dans resilience/DRAFT-NAVIGATION.md. La conclusion finale doit porter sur le prochain candidat immuable après cette correction, et non réattribuer les30tests Compare à celui-ci.

## Conclusion finale courante — FINAL-08

Dernière exécution sur le candidat immuable servi4198, sources et tests inchangés : **15/15 Chromium en25,2s** et **15/15 WebKit en34,9s**, logs `final-08/compare-chromium.log` / `compare-webkit.log`, captures dans leurs dossiers neufs. Contraste des trois titres sombre15,934:1 sur les deux navigateurs. Clipboard exclusivement simulé dans cette suite.

Identité locale avant tests : AnalyzerPage-CtfeQz9q.js servi et candidat identiques, SHA256126a8de00622b3a072c62c085aaec39cfddd4baefc275261cfd3791e3c23df12, `final-08/compare-candidate-identity.json`.

La preuve UX du lead a été réellement relue : `final-08/matrix-ux/results.json` contient **3/3 réussites**, dont brouillon non analysé25/35 conservé après Guide/retour/reload sur build immuable. Elle résout le blocage révélé sur final-07 ; les traces rouges historiques restent conservées. `resilience/DRAFT-NAVIGATION.md` détaille nettoyage puis correctif blur et16tests ciblés.

Oracle également relu : `final-08/oracles/independent-results-final.json`, **57/57**, espacement minimal109,749375ms≥100 sur12requêtes localesmock404. Ce résultat est celui de08, pas le110,55ms de05. Aucun débit réel tiers ou garantie d'horloge parfaite extrapolé.

**Aucun blocage technique identifié dans la couverture Compare/B06 et le parcours UX de brouillon contrôlé sur final-08.** Cette conclusion ne remplace pas les autres audits/gates du lead ni le smoke public. Firefox demeure bloqué au lancement selon tentative antérieure sur binaire inchangé, aucune réussite08 revendiquée. CMP07, compréhension humaine, appareils physiques et lecteur d'écran restent hors validation ; navigation horizontale locale à320px et nature simulée du clipboard/réseau gardent leurs limites décrites plus haut. Aucune source modifiée pendant/après cette exécution par l'agent QA.
