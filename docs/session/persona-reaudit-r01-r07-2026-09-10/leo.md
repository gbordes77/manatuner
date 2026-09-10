# Léo — après R01–R07 : 3,50/5, note stable

Troisième évaluation du 10 septembre 2026. Persona canon : Léo, six mois de Magic, priorité à la compréhension, refus du compte obligatoire, partage occasionnel d’une URL à un ami. **Simulation experte, aucun participant réel.** Cible fournie : candidat local `dist-04`, campagne `reaudit-fixes-szrp1r9w`, HEAD annoncé `e14f329`, servi sur `http://127.0.0.1:4187`. Aucune conclusion sur la production.

## Méthode et parcours effectivement couvert

Le navigateur CUA a refusé l’ouverture d’un nouvel onglet : « Browser is not available: iab ». Aucun parcours interactif personnel n’a donc été rejoué. Conformément au protocole de repli, j’ai lu par HTTP le HTML du candidat pour accueil, Guide, Privacy, Library et `/analyzer?sample=exact`. Ces lectures vérifient les textes prérendus, pas le comportement JavaScript, les accordéons ouverts ni un nouveau calcul.

J’ai relu mon précédent rapport, le bilan final de correction, la revue indépendante et le log `persona-04.log`, terminé par 23 scénarios réussis. J’ai inspecté les captures partagées `guide-390-light.png` et `library-390-dark.png`. Les contrôles de largeur, contraste, partage et oracle consignés appartiennent à cette campagne antérieure ; ils ne sont pas mes tests. Les sources `AnalyzerPage.tsx` et `QuickVerdict.tsx` ont été consultées pour les éléments absents du HTML initial : bannière d’exemple, déficit prioritaire et explication des trois scores.

Le scénario de Léo reste accueil → exemple → diagnostic → prochaine action → aide → parcours First FNM. Ici il est évalué à partir des textes servis et des preuves disponibles. Ni stockage, ni progression de lecture, ni deck existant n’ont été modifiés.

## Ce qui a réellement progressé

**Le conseil sous 85 % est corrigé dans le HTML Guide.** Il invite maintenant à vérifier le mode, le coût, le tour visé, les terrains, le séquençage et les limites avant de comparer une modification avec les mêmes paramètres. Léo ne reçoit plus une recette systématique « ajoute des sources de cette couleur ». C’est une amélioration de la qualité pédagogique, même si la liste des vérifications suppose encore une compréhension qu’il n’a pas forcément.

**Le parcours First FNM annonce désormais sept lectures partout dans les passages examinés.** La contradiction « Five » / sept disparaît. Accueil et Library affichent 65 références. Le débutant bénéficie d’un parcours plus cohérent, sans nouvelle fonction nécessaire.

**L’exemple exact est mieux borné.** La source affiche une bannière précisant que les 24 Plains et 36 Savannah Lions constituent une fixture synthétique, non légale en tournoi. Le log partagé atteste du scénario exemple/oracle. Mon HTTP de l’Analyzer renvoie le formulaire initial sans cette bannière conditionnelle : je ne prétends pas l’avoir vue fonctionner dans un navigateur pendant ce réaudit.

**La confiance éditoriale se consolide.** Guide distingue seuil heuristique et décision optimale universelle ; Privacy conserve l’explication des requêtes Scryfall et des services externes. Le partage est présenté dans la FAQ comme deck, nom et onglet, avec un export de résultat sauvegardé distinct des paramètres interactifs.

## Notes avant/après

Même grille entière de six axes, moyenne simple. La stabilité n’annule pas les corrections : elles améliorent une expérience déjà notée 4 sur plusieurs axes, sans établir une excellente adéquation à ce débutant.

| Axe           | Avant R01–R07 |    Après |    Delta | Justification                                                                                                                               |
| ------------- | ------------: | -------: | -------: | ------------------------------------------------------------------------------------------------------------------------------------------- |
| Accessibilité |             3 |        3 |        0 | Vocabulaire technique et présentation compétitive toujours dominants ; pas de nouvelle entrée vraiment simple.                              |
| Pertinence    |             4 |        4 |        0 | Mana et First FNM répondent aux mêmes besoins, désormais avec moins de bruit éditorial.                                                     |
| Profondeur    |             3 |        3 |        0 | Conseil plus juste, mais pas d’exemple guidé expliquant une première décision ; les trois scores restent décrits techniquement.             |
| Utilisabilité |             4 |        4 |        0 | Action Manabase conservée dans la source, compteur corrigé ; aucun gain interactif supplémentaire personnellement établi.                   |
| Confiance     |             4 |        4 |        0 | Réserves précises et contradictions réduites ; la compréhension autonome et les comportements ne sont pas suffisamment observés pour 5.     |
| Partage       |             3 |        3 |        0 | FAQ plus transparente, mais Léo copie spontanément l’adresse courante ; aucune nouvelle aide immédiate ou réouverture personnelle vérifiée. |
| **Moyenne**   |      **3,50** | **3,50** | **0,00** | **21/6, soit 14,00/20.**                                                                                                                    |

Par rapport au tout premier audit du 9 septembre : **3,00 → 3,50 → 3,50**, soit un progrès cumulé de **+0,50/5**. Ces notes qualitatives ne sont pas une mesure statistique.

## Frictions prioritaires et verdict

Léo dirait : « Je comprends mieux ce que l’outil ne promet pas ; maintenant, montre-moi comment améliorer une seule chose. » Le prochain gain demande un petit parcours pratique : identifier une difficulté, expliquer un changement possible et comparer son effet sous les mêmes hypothèses. Une phrase simple pour chaque score doit précéder les définitions détaillées. Le déficit prioritaire et son bouton, relus dans la source, restent un bon point d’appui.

La Library conserve les nouveautés avant Start Here et un discours destiné aux joueurs sérieux. Les captures partagées montrent une interface lisible dans leurs états, mais pas l’autonomie d’un débutant sur téléphone. Le partage le plus plausible reste Library à un ami qui l’accompagne ; cette intention simulée ne vaut pas usage réel.

Verdict : **correctifs utiles et confirmés sur les textes clés, sans nouveau palier de note démontré**. Aucun test automatisé relancé, calcul personnel, export, interaction mobile, lecteur d’écran, contrôle réseau ou vérification juridique effectué. Aucun code produit modifié.
