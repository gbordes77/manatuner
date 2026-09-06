# Revue indépendante UI — S001 — 6 septembre 2026

Relecteur : sous-agent parsing, auteur distinct des changements F05/F07. Revue du diff local `AnalyzerPage.tsx` / `DeckInputSection.tsx`, des tests `AnalyzerPage.cancellation.test.jsx`, `DeckInputSection.keyboard.test.tsx`, des deux suites E2E et des logs avant/après `cancellation/` et `keyboard/`. HEAD de base `148d5f85ee26e60cdb10c6351031c89c03fd7ed0`, aucun commit créé.

## Finding à traiter avant clôture complète de Clear

**P2 — debounce de saisie encore susceptible de rétablir le texte après Clear.** Dans `DeckInputSection`, `handleDeckListChange` capture une valeur et programme `setDeckList(value)` à 300 ms. L'effet de synchronisation depuis `deckList` remet le brouillon local à jour mais n'annule pas ce timer. Le champ reste éditable pendant une analyse. Séquence : Analyze (flush initial), saisir une nouvelle ligne pendant la requête, Clear avant les 300 ms ; Clear vide Redux et le champ, puis le timer ancien réécrit le texte. Ce chemin préexistait mais entre dans la promesse « éditeur reste effacé » de F05. Les tests génération substituent DeckInputSection par un textarea sans debounce, et le test navigateur ne saisit pas de nouveau texte pendant l'analyse : ils ne le détectent pas. Constat par lecture précise, pas encore reproduction exécutée par ce relecteur. Recommandation : test avec composant réel et horloge contrôlée, puis annulation du debounce sur Clear et remplacement externe de texte. Attention au cas où deckList parent est déjà vide : annuler uniquement dans l'effet dépendant de deckList ne couvre pas nécessairement un Clear sans changement de prop.

## Conclusions sur les changements relus

F05 : la propriété du contrôleur est invalidée avant abort ; la reprise après await, catch/finally et le callback requestAnimationFrame sont gardés. Les mutations de résultat, format, preset, historique et notifications se font sans await intermédiaire après la garde. Le cleanup de démontage évite le résultat fantôme sur le store persistant. Les tests à promesses contrôlées ignorent volontairement le signal et vérifient donc la propriété UI indépendamment du transport : c'est approprié. Logs lus : 5 échecs initiaux sur 6 ; 15/15 composants après ; E2E 1/1.

F07 : remplacement des Paper cliquables/Chip par boutons natifs ; pas de handler parent concurrent ; aria-controls pointe vers un conteneur toujours présent ; focus explicitement transmis au textarea monté. La disparition du bouton après ouverture explique aria-expanded=false uniquement dans son état visible. Les tests couvrent Tab réel, Enter/Espace, clic/touch, conservation du texte, focus, outline visible, une seule activation et largeurs 1440/768/360. Logs lus : 3 échecs composants initiaux et 3 E2E initiaux ; 4 E2E verts. Aucun défaut bloquant identifié dans ce périmètre F07.

## Limites

Pas d'audit WCAG AA complet, ni de lecteur d'écran matériel, ni Safari/Firefox réel par cette revue. Les E2E utilisent Chromium et fixtures Scryfall publiques simulées. La preuve F05 n'est pas une preuve d'arrêt physique du transport (F08 reste distinct). Cette revue ne remplace pas le lint/typecheck/build et les suites intégrées du coordinateur. Le finding de debounce doit être soit corrigé et prouvé, soit explicitement maintenu ouvert ; il ne faut pas le présenter comme couvert par les tests génération.
