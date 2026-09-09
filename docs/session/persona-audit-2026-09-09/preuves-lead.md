# Observations directes du coordinateur — 9 septembre 2026

Production visitée : https://www.manatuner.app/. Navigateur intégré Codex, CUA. Observations de session, pas suite de tests automatisée ni entretien utilisateur. HEAD local : `2ba772af1f308ea93c68ffea53b0ccef0e49c57d`, sans preuve que ce SHA est déployé.

## Parcours et résultats

1. Accueil : mentions « only card names ping Scryfall » et « 0 Data sent to servers » présentes simultanément. Exemple marketing « Your deck casts 87% of spells on curve », blocs « Exact Probabilities » et « Exact cast probability ». Compteur six onglets annoncé.
2. Bouton « Try an example deck » : formulaire prérempli Nature’s Rhythm, clic « Analyze Manabase » nécessaire. Aucun overlay bloquant rencontré.
3. Résultat : 60 cartes, 23 terrains, Health Score 91%, Excellent ; deux couleurs sous les cibles Karsten. Texte précise score marginal d’accès aux couleurs, pas paiement simultané/répétition des symboles. Engine v2.7.9. Cinq onglets effectivement présents.
4. Castability : Mana Estimates sélectionné ; Exact Goldfish Potential alternatif. Limites de séquençage, recouvrement des sources, absence de mulligan/pioche du sort explicites. Format Modern/Pioneer, removal35%, 19 accélérateurs annoncés.
5. Share : clic produit « Share link copied — paste in Discord (link includes your deck) ». Lecture du presse-papiers via le navigateur : chaîne vide. Tentative d’ouverture de cette chaîne refusée par la politique d’URL. Aucun contournement ; aucun lien externe envoyé. Le toast est confirmé, la copie effective et le rechargement du lien ne sont PAS validés.
6. Mulligan : panneau chargé avec résultats10k échantillons par taille, Midrange, score54, seuil51 pour sept cartes. Avertissement explicite : score heuristique, pas probabilité de victoire ; arrêt à quatre cartes, bottoming heuristique, plans sans ramp, premier mulligan gratuit en mode multijoueur. Aide ouverte conserve la formulation simplifiée de repiocher une carte de moins. Plusieurs exemples de mains annoncent que le plan tour par tour est indisponible hors modèle. Aucun oracle mathématique rejoué.

## Visuel et mobile

Capture d’écran des résultats examinée : écran clair, navigation et cinq onglets lisibles sur bureau, résultat long et dense. Le réglage demandé390×844 via la capacité viewport n’a pas modifié la taille réelle : lecture DOM `clientWidth=1280`, `clientHeight=720`, `scrollWidth=1280`. Capture également1280×720. Réglage réinitialisé. Aucun succès mobile, tactile, sombre ou WCAG revendiqué.

## Compléments de couverture

- Onglet Analysis du midrange : modèle potentiel de castabilité lands-only,14 sorts indisponibles pour la restriction Abandoned Air Temple ; avertissement explicite. Compteurs strong/risky/critical tous à zéro dans cette situation. Ne pas interpréter ces zéros comme absence de risque ; le calcul est indisponible.
- `/about` : page parcourue ; promesse de seuils de mulligan « mathematically perfect » encore présente, plus absolue que le modèle heuristique annoncé dans Mulligan.
- `/land-glossary` : page parcourue ; classement pédagogique selon tempo/flexibilité/synergie/contreparties et exemples concrets. Généralisation « Rainbow Land » toujours dégagé, incluant Grand Coliseum. Le texte de carte reproduit sur [mtg.wtf](https://mtg.wtf/card/c16/299/Grand-Coliseum) dit au contraire que ce terrain arrive engagé. La tentative de consulter le lien primaire Gatherer renvoie403 ; cette vérification externe repose sur la reproduction du texte de carte, pas une lecture de Gatherer. Correction éditoriale ciblée recommandée.

## Limites communes

- Les onglets des agents partagent le stockage du navigateur ; les exemples créent des sauvegardes automatiques. Aucun effacement des historiques existants. Les parcours ne sont pas six sessions de première visite indépendantes.
- L’export de contenu de l’onglet n’est pas pris en charge par le navigateur intégré ; ces observations textuelles consignent les sorties CUA consultées pendant la session.
- Les différences entre pages publiques et documents locaux sont constatées ; leur cause (version, cache, prérendu ou autre) n’est pas établie.
- Les résultats historiques S002 ne sont pas attribués à cet audit. Aucun code produit, déploiement, réglage externe ni message communautaire modifié.
