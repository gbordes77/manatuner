# Léo — Le Curieux : 3,00/5

Audit du 9 septembre 2026. Persona canon : joueur Arena casual, six mois de pratique, priorité à la compréhension, refus de créer un compte. **Simulation experte d’un persona, pas entretien avec un utilisateur réel.**

## Première impression simulée, 30 secondes

« Ça a l’air joli et c’est gratuit. Je peux essayer sans donner mon mail, cool. Mais “Rocks & Dorks”, “on curve”, tous ces pourcentages… je veux juste comprendre pourquoi je n’arrive pas à jouer mes cartes. »

## Parcours réellement réalisé

Navigation CUA sur la production, onglet dédié, écran de bureau : [accueil](https://www.manatuner.app/) → bouton “Try an example deck” → `/analyzer?sample=midrange`, puis `/analyzer` → bouton “Analyze Manabase” → résultats de Nature’s Rhythm (60 cartes, 23 terrains, Health Score 91%, Engine v2.7.9) → [Guide](https://www.manatuner.app/guide) → [Privacy](https://www.manatuner.app/privacy) → [Library](https://www.manatuner.app/library), lecture du parcours First FNM dans la page.

L’exemple préremplit le formulaire ; il faut encore lancer l’analyse. Aucun tutoriel bloquant observé. Le résultat s’affiche sans inscription. Captures visuelles de l’accueil et du formulaire examinées ; contenus suivants lus par arbre d’accessibilité. Aucun article externe ouvert, aucune simulation Mulligan ni export exécutés par cet agent. Mobile confié au lead : cette note d’utilisabilité ne certifie pas l’expérience mobile. Le décrochage supposé de Léo se situe au résultat, lorsque plusieurs paragraphes de modèle précèdent les lignes de cartes.

Documents S002, DELIVERY-CONTRACT, profil complet de Léo et protocole historique consultés. Leurs tests locaux restent des preuves historiques, non des tests de production rejoués ici.

## Points positifs

- Entrée visuellement accueillante, grand bouton d’action et exemple public : Léo n’a pas besoin de connaître un format d’import pour essayer.
- Gratuité et absence de compte très explicites : son principal veto est levé.
- Le verdict résume immédiatement le résultat ; le nombre de cartes et de terrains permet de reconnaître ce qui a été analysé.
- Library propose réellement “New to MTG?” et “Your First FNM”, avec Reid Duke et un article sur la malchance : adéquation directe à ses questions.
- Dans Analyzer, les limites des estimations sont réellement écrites, notamment exclusion du mulligan et de la probabilité de piocher le sort. Le vocabulaire est plus honnête que la promesse simplifiée de l’accueil.

## Frictions et manques

**P0 : aucun blocage fonctionnel critique observé sur le parcours testé.**

**P1 — Comprendre le résultat reste trop difficile.** “Excellent” et “2 colors short” coexistent dans le verdict. Puis arrivent hybrid access, marginal score, source overlap, K=3, Bellman et deux modes de probabilité. Léo ne sait pas quelle information doit guider sa première modification. C’est une friction cognitive, pas une preuve que le calcul est faux.

**P1 — Le guide contredit le résultat.** Le guide qualifie Castability d’exacte et le score de critère “tournament-ready”, alors qu’Analyzer parle d’estimations et de score d’accès aux couleurs. Léo risque d’apprendre une mauvaise interprétation ; il ne saura pas corriger seul cette confusion.

**P1 — Confidentialité incohérente entre les pages.** L’accueil indique que les noms de cartes vont à Scryfall, mais affiche aussi zéro donnée envoyée aux serveurs. Privacy affirme ne transmettre aucune information de deck. Ces textes ont été vus en production ; aucune conclusion sur les flux réseau réels ou la conformité juridique n’est tirée ici.

**P2 — Parcours débutant noyé dans la bibliothèque.** Le raccourci “Start Here” aide, mais les nouveautés précèdent les lectures d’initiation. La page annonce cinq lectures puis affiche sept articles ; l’accueil annonce 54 articles, Library 65. Ce bruit nuit à la sensation d’un petit parcours simple.

**P2 — Langue et identité compétitive.** Interface anglaise, nombreuses références aux pros, peu d’explications visuelles immédiatement accessibles. La friction est notée ; une traduction générale n’est pas nécessaire pour améliorer d’abord les libellés et la pédagogie.

## Notes officielles

| Axe           |       /5 | Justification                                                                                               |
| ------------- | -------: | ----------------------------------------------------------------------------------------------------------- |
| Accessibilité |        3 | CTA clair, mais vocabulaire du titre et des résultats supérieur au niveau de Léo.                           |
| Pertinence    |        4 | Mana screw, terrains, mulligans et First FNM répondent à ses besoins de progression.                        |
| Profondeur    |        3 | Contenu utile mais insuffisamment gradué ; trop de modèle avant l’explication concrète.                     |
| Utilisabilité |        3 | Exemple réussi sans compte ; deuxième clic et hiérarchie pédagogique ralentissent. Mobile non testé ici.    |
| Confiance     |        2 | Absence de compte rassurante, mais promesses de précision et de confidentialité contradictoires.            |
| Partage       |        3 | Enverrait éventuellement l’URL de Library à un ami qui l’aide ; résultat encore difficile à expliquer seul. |
| **Moyenne**   | **3,00** | **18/6 ; baseline historique 3,67 : écart −0,67.**                                                          |

L’écart exprime cette nouvelle évaluation, pas une dégradation mesurée auprès des mêmes personnes.

## Verdict et recommandations

**Retour plausible pour First FNM, retour autonome moins probable pour Analyzer.** Partage simulé : copier l’URL de Library dans un DM Discord à un ami, avec « tu peux m’expliquer lequel lire ? ». Aucun message envoyé ni partage réel prétendu. Léo copie naturellement l’adresse ; ici l’adresse Analyzer observée n’inclut pas la liste, donc ce geste ne transporte pas son résultat.

1. **P1 :** harmoniser accueil, guide et confidentialité avec les limites affichées dans Analyzer ; vérifier le rendu publié de chaque page.
2. **P1 :** placer juste sous le score une explication simple du signal prioritaire : quelles couleurs manquent, pourquoi, et où regarder ensuite, sans conseil de victoire ni probabilité inventée.
3. **P1 :** transformer l’exemple en mini-parcours pédagogique : lire un résultat, comprendre une limite, comparer une modification.
4. **P2 :** rendre First FNM immédiatement accessible et accorder tous ses compteurs ; montrer la première lecture avant les nouveautés.
5. **P2 :** expliquer près du résultat que l’adresse courante ne contient pas le deck et que “Share” fabrique le lien complet ; garder cette aide discrète et sans obligation de compte.
