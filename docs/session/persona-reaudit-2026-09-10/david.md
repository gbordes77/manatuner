# David — L’Architecte : réaudit du candidat, 3,50/5

10 septembre 2026. Persona 5 du canon `docs/personas/mtg-player-personas.md`, expert Modern/Legacy, utilisateur de notebooks et auteur technique. **Candidat local dist-06 sur http://127.0.0.1:4186, pas production.** Le lead rapporte la conformité du manifest à HEAD `2517316` ; je n’ai pas refait ce contrôle. Référence : audit David du 9 septembre, 4/3/3/3/2/3 = 3,00/5.

## Portée et parcours réellement accompli

Mon contexte CUA ne dispose d’aucun navigateur : création d’onglet refusée, inventaire `browsers:[]`, puis nouvelle tentative avec l’URL locale également refusée. **Je n’ai donc pas exécuté personnellement de clics sur ce candidat.** Cela limite la solidité de la note d’utilisabilité ; ce n’est pas un défaut du site.

Travail exécuté : lecture de `persona-validation-mfydqnp5/FINAL.md`, puis récupération HTTP des pages locales `/`, `/mathematics`, `/privacy` et `/library`, avec extraction du texte HTML. Lecture directe des fichiers JSON et CSV déjà téléchargés lors de la validation dist-06, ainsi que du rapport de revue des exports. Cette extraction confirme le contenu prérendu servi, pas son apparence après hydratation ni l’interaction clavier.

Preuve actuelle partagée : le lead a joué le parcours **accueil → exemple exact → Analyze**, constaté Savannah Lions à **98 %**, Health à **99**, puis ouvert l’explication des trois scores. Les captures mobiles et les 799 tests cités dans FINAL.md appartiennent à la validation précédente ; je ne les présente pas comme des vérifications rejouées aujourd’hui. Aucun stockage partagé n’a été modifié par moi.

## Première impression simulée

« Je peux enfin distinguer la promesse du calcul, et conserver les hypothèses avec les données. Le petit exemple exact donne une entrée vérifiable dans le moteur. En revanche, pour citer le site dans un article, j’ai toujours besoin d’une documentation mathématique qui décrit sans ambiguïté le mode affiché. »

Cette réaction est une interprétation de persona fondée sur les preuves ci-dessus, pas le verbatim d’un participant réel.

## Progrès utiles à David

**Le score ne se fait plus passer pour une fréquence de sorts lancés.** L’accueil servi précise que 87 % illustre un score d’accès aux couleurs au tour deux, sans représenter la proportion de sorts joués sur courbe ni une consigne de keep. L’aide observée par le lead sépare Health, Blueprint et Mulligan. C’est une amélioration directe de mon interprétation des nombres, sans attendre une correction artificielle des formules.

**L’exemple exact débloque la démonstration.** Le bouton distinct est présent dans le HTML ; le lead obtient réellement 98 %. La fixture 24 Plains/36 Savannah Lions est un exercice synthétique, pas un deck de tournoi légal. Elle permet d’illustrer un cas simple sans prétendre couvrir les interactions complexes qui faisaient refuser les quatorze lignes de l’exemple précédent. Je n’ai pas recalculé l’oracle ici.

**Les exports gagnent un contexte exploitable.** Le JSON existant contient `engineVersion`, les définitions des trois scores et `assumptions`, avec modèle `physical-v1`, PLAY, absence de mulligans/ramp, X=2 et exclusion de la pioche du sort cible. Il précise que le snapshot sauvegardé ne correspond pas aux réglages interactifs de Castability. Le CSV consulté conserve nom, quantités et indicateurs sideboard/commandant ; ses commentaires rappellent également la portée du partage. Ce sont des informations effectivement lues dans les fichiers, pas simplement annoncées dans un changelog.

**La confidentialité devient défendable sur le plan descriptif.** La page locale détaille Scryfall, images, polices, métadonnées de connexion, caches et durées, partage, effacement best effort et monitoring désactivé. L’accueil renvoie à cette réalité. Je ne déduis aucune conformité juridique de cette amélioration.

## Frictions restantes

**P0 : aucun démontré.** Ni la restriction d’un modèle exact, ni un indice heuristique correctement nommé ne constituent en soi une erreur mathématique.

**P1 — Documentation mathématique encore ambiguë.** Le HTML `/mathematics` commence toujours par un bandeau affirmant que les lignes Castability utilisent le modèle goldfish physique, tandis que le corps décrit Realistic/Perfect drops, approximations de séquençage et bonus ramp. L’utilisateur doit reconstruire la correspondance avec les deux modes actuels. La formule « every game, not just sometimes » reste également trop absolue pour un problème probabiliste. La clarification du Monte Carlo en mains échantillonnées est réelle, mais elle ne résout pas cette ambiguïté générale.

**P1 — Reproductibilité partielle.** Les exports sont mieux définis, mais décrivent un snapshot lands-only fixe. Un lien deck/name/tab ne reproduit pas les réglages interactifs, limitation désormais explicitée. Je peux exploiter ces données à condition de respecter ce contrat ; je ne peux pas traiter le partage comme un protocole complet d’expérience. Aucun schéma public versionné ni notebook de référence n’a été établi par ce réaudit.

**P2 — CSV à documenter pour Pandas.** Le fichier comporte des commentaires puis une table deck à dix colonnes et une table summary à trois colonnes. C’est exploitable, mais demande une lecture par sections pour un traitement propre ; le label Sheets/Pandas ne remplace pas une recette d’import. Aucun échec d’import n’est affirmé.

**P2 — Résidus éditoriaux.** Les 65 références sont désormais cohérentes entre accueil et Library. « Five short » demeure à côté de sept lectures ; quelques slogans « optimal » persistent. L’incohérence de quantité touche peu mon travail, mais rappelle que les résumés éditoriaux méritent encore une vérification avant citation.

## Notes avant/après

| Axe           |  9 sept. | Candidat | Justification du changement ou maintien                                                                  |
| ------------- | -------: | -------: | -------------------------------------------------------------------------------------------------------- |
| Accessibilité |        4 |        4 | Positionnement lisible et second exemple explicite ; pas de motif pour une note maximale.                |
| Pertinence    |        3 |        4 | Démonstration exacte exploitable et exports contextualisés répondent mieux au travail de recherche.      |
| Profondeur    |        3 |        3 | Hypothèses plus riches, mais méthode publique ambiguë et absence de protocole complet établi.            |
| Utilisabilité |        3 |        3 | Parcours du lead positif ; aucune nouvelle interaction personnelle permettant une hausse indépendante.   |
| Confiance     |        2 |        3 | Score et confidentialité clarifiés ; documentation mathématique empêche encore une confiance forte.      |
| Partage       |        3 |        4 | Les fichiers portent désormais définitions et limites ; citation conditionnelle possible après contrôle. |
| **Moyenne**   | **3,00** | **3,50** | **21/6, delta +0,50/5. Notes provisoires sous les limites indiquées.**                                   |

## Verdict et priorités

Je testerais ce candidat dans mon travail exploratoire et partagerais des références ou exports contextualisés avec ma team. Je n’en ferais pas encore une référence générale d’exactitude pour tout deck. Cette amélioration concerne le candidat local et ne change pas le verdict sur la production non revue.

1. Réécrire Mathematics autour des deux modes actuels, avec événement, hypothèses et exemple distinct pour chacun.
2. Publier un schéma JSON/CSV et une recette Python minimale séparant deck et summary.
3. Fournir une fiche de reproduction indiquant les paramètres transportés ou exclus, sans confondre snapshot et calcul interactif.
4. Retirer les garanties probabilistes absolues résiduelles et terminer l’alignement des compteurs éditoriaux.
