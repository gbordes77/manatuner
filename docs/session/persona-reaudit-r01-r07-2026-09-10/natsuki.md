# Natsuki — troisième audit, R01–R07

## Cible et portée

Évaluation simulée du 10 septembre 2026 selon Natsuki, persona 4 du [référentiel](../../personas/mtg-player-personas.md) : compétitrice Pioneer/Modern, préparation méthodique, données partagées avec sa team. Référence : [réaudit précédent](../persona-reaudit-2026-09-10/natsuki.md), **4/3/4/4/3/4**, soit 22/30.

Cible exclusive : **http://127.0.0.1:4187, candidat dist-04**, campagne `reaudit-fixes-szrp1r9w`, HEAD `e14f329` communiqué par le coordinateur. Le [bilan final](../../engineering/reaudit-fixes-szrp1r9w/FINAL.md) rattache ses validations au manifeste et à l’équivalence après formatage. La production reste ancienne selon le coordinateur ; aucune amélioration publiée n’est revendiquée.

CUA étant indisponible dans ce contexte, j’ai lu personnellement le HTML servi de `/mathematics`, `/my-analyses` et `/guide`, avec réponses HTTP 200. J’ai aussi lu la recette CSV et ses résultats de validation. Aucun clic, calcul interactif ou téléchargement nouveau n’est inventé. Les autres résultats proviennent des artefacts de campagne explicitement cités.

## Réaction simulée et progrès

« Je peux enfin distinguer la colonne que j’exporte du réglage que je manipule. Je n’ai plus besoin de reconstruire le modèle en rapprochant trois avertissements contradictoires. Il reste une cible de sources incohérente à faire corriger avant de reprendre le guide dans notre feuille de testing. »

**La documentation répond maintenant à ma question méthodologique.** Mathematics indique dès l’entrée : estimation par défaut, exact séparé, aucun des deux conditionné à une main saisie. Les sections explicitent l’information sur l’historique tiré, l’absence de removal en exact, les refus hors couverture et le budget de calcul. Realistic/Perfect sont clairement deux vues de l’estimation. Le snapshot de Compare est décrit séparément : lands-only, PLAY, sans mulligan ni ramp, X=2. Ces distinctions corrigent personnellement les ambiguïtés HTTP qui limitaient ma confiance au réaudit précédent.

**Les conseils évitent davantage les conclusions excessives.** Le Guide présente un résultat inférieur à 85 % comme invitation à examiner coût, tour, séquençage et limites, puis comparer à paramètres égaux. La fixture 24 Plains/36 Savannah Lions est explicitement synthétique et non légale en tournoi. Je peux l’utiliser comme contrôle technique sans la confondre avec une démonstration représentative de Modern.

**Le stockage est enfin décrit sans promesse absolue.** My Analyses indique stockage navigateur, requêtes Scryfall et accès Privacy. Les deux formulations « Nothing sent to servers » et « nothing leaves your browser » précédemment relevées ont disparu des textes HTTP consultés. Ce progrès éditorial ne constitue pas un audit réseau ou juridique.

**L’export est accompagné d’une recette concrète.** La [documentation CSV](../../engineering/BLUEPRINT-CSV.md) explique ses deux tables, propose un script Python et la conversion des cartes vers un DataFrame. Le [résultat conservé](../../engineering/reaudit-fixes-szrp1r9w/csv-import.json) associe dist-04 à deux fichiers hachés et aux totaux 60/24 et 99/43 + commandant/réserve. J’ai lu cette preuve, sans rejouer personnellement le script. Cela traite la friction d’import déjà signalée ; le format reste toutefois plus complexe qu’une table unique.

## Frictions et limites restantes

**P1 ciblé — Une recommandation chiffrée se contredit encore.** Le Guide affiche « 20 for 2 pips T2 », tandis que Mathematics indique 21 sources, y compris dans sa table et son exemple Counterspell. Je reproduis directement cette différence dans le candidat. Pour une joueuse qui ajuste une source à la fois, elle mérite correction et rattachement clair à l’hypothèse concernée. Elle ne prouve pas une erreur du moteur.

**P2 — Reproductibilité interactive partielle.** Le partage conserve deck/nom/onglet, sans réglages interactifs. La limite est honnête et visible dans le Guide, mais ma team doit encore reporter les paramètres. Une API ou un schéma public versionné complet n’est pas établi par cette revue. Les besoins métagame/analytics Limited restent hors couverture ; ils expliquent la pertinence limitée sans imposer leur développement.

Les preuves de comparaison regroupée, petits deltas, clavier et contrastes viennent du bilan dist-04 : 801 tests source et 72 scénarios Chromium annoncés avec leurs logs. Je ne les additionne pas aux anciens tests et ne revendique ni nouvelle session visuelle personnelle ni validation utilisateur réelle.

## Notes indépendantes

| Axe           | Avant | Maintenant /5 | Commentaire                                                                    |
| ------------- | ----: | ------------: | ------------------------------------------------------------------------------ |
| Accessibilité |     4 |             4 | Contrats plus lisibles ; densité encore adaptée à une experte.                 |
| Pertinence    |     3 |             3 | Bon complément mana, besoins compétitifs généraux inchangés.                   |
| Profondeur    |     4 |             4 | Événements et snapshot mieux documentés, couverture moteur inchangée.          |
| Utilisabilité |     4 |             4 | Recette utile ; parcours interactif non rejoué personnellement.                |
| Confiance     |     3 |             4 | Deux contradictions majeures supprimées ; résidu 20/21 circonscrit.            |
| Partage       |     4 |             4 | CSV mieux documenté, paramètres interactifs toujours à transmettre séparément. |

**23/30 = 3,83/5 = 15,33/20.** Gain exact : **+1/6 point sur 5**, soit environ +0,17, contre le réaudit précédent. Aucune hausse automatique pour le nombre de correctifs : cinq axes restent inchangés.

## Verdict

Je recommanderais désormais cet outil comme complément documenté de testing de mana, avec un export annoté dans notre Notion. Avant de partager le Guide comme référence, je ferais corriger 20/21. Je ne présenterais ni les indices comme win rates ni le candidat local comme la version accessible publiquement.
