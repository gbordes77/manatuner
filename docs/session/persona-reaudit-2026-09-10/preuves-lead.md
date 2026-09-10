# Preuves du réaudit du 10 septembre 2026

## Candidat et comparaison

- Base corrigée HEAD `251731694b2a0b6b74102a73d50e56fae8ce2750`, artefact `docs/engineering/persona-validation-mfydqnp5/dist-06`.
- Briefing indépendant : 270/270 sources/configs et154/154 fichiers d’artefact conformes SHA-256 au manifest, aucun écart. Pas de rebuild nécessaire pour auditer ce candidat.
- Serveur strict lancé par le lead : `PRERENDER_DIST` absolu vers dist-06, `CANDIDATE_PORT=4186`, `node scripts/serve-candidate.mjs`. Le serveur préexistant3000 n’a pas été modifié.
- Comparaison : production visitée le9septembre → candidat local corrigé du10septembre. Aucun déploiement effectué ni amélioration publique vérifiée.

## Parcours CUA du lead, nouvellement exécutés

1. Accueil local : compteur65, parcours7/10/9/5/6,5onglets ; contrat exemple score87 présenté comme indice, noms/cartes/images Scryfall et polices externes annoncés. Lien nouveau d’exemple exact visible. Slogans « The math tells you what to play » et « optimal thresholds » encore visibles : ne pas conclure que tout le marketing est harmonisé.
2. Clic exemple exact → formulaire24Plains/36SavannahLions → Analyze. Résultat60/24, Health99, mode Exact Goldfish Potential sélectionné, potentiel SavannahLions98%. Aucun oracle recalculé pendant cette navigation ; conformité indépendante documentée dans campagne livraison antérieure.
3. Ouverture Why the three scores differ : définitionHealthT2, Blueprintpondérations40/20/25/15 et Mulliganheuristique, exclusion victoire/keepgaranti. Les valeurs99et98 mesurent des choses différentes.
4. My Analyses : exemples sauvegardés ; footer « Nothing sent to servers » encore présent, directement confirmé.
5. Compare → sélection des deux essais24Plains de la campagne : deux builds identiques60/24,1/1sortcalculé, SavannahLions97.8385472740882% de chaque côté, égalité affichée. Contrat lands-only,onplay,no mulligan/ramp,X2 lisible. Ce test confirme la disponibilité et l’égalité, pas le calcul d’un delta entre deux builds différents. Trop de décimales demeure une friction de lecture.

## Preuves de livraison reconsultées, pas réexécutées

- Captures QA candidate06 `360-light.png` et `360-dark.png` examinées visuellement : résultats lisibles dans les deux thèmes ; grande hauteur du bandeau et forte densité restent perceptibles. Pas de nouveau test mobile/tactile.
- JSON réel de QA relu : nom, version moteur, scoreDefinitions et assumptions conservés, y compris distinction savedlands-only vs paramètres interactifs. Revue CSV/PDF et tests partage du dossier FINAL restent des preuves antérieures attachées au même candidat.
- Résultats799tests/61Chromium/8WebKit issus de FINAL, aucun rejeu de ces suites pendant le réaudit.

## Limites d’organisation

Léo et Sarah ont des parcours CUA propres, le lead complète les interactions. Plusieurs agents réutilisés ne disposent plus de navigateur CUA : ils lisent les pages HTTP locales, les artefacts vérifiés et les observations actuelles partagées en attribuant leurs sources. Leurs notes ne sont pas présentées comme six nouvelles sessions navigateur autonomes. Les six voix demeurent des évaluations simulées distinctes, pas des entretiens.

Les limites d’outillage ne prouvent pas un défaut du site. Aucun reset, suppression de données ou publication. Les onglets locaux partagent leur stockage ; les exemples ajoutés par les essais sont conservés. Aucun code produit changé.
