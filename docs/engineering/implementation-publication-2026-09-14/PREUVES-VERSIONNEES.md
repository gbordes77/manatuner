# Disponibilité des preuves

Les preuves volumineuses (candidats statiques, PDF12,5/22,6Mo, PNG, traces navigateur et bundles des oracles) sont conservées dans cette campagne locale avec empreintes. Elles ne sont pas ajoutées au dépôt. Les logs, scripts de reproduction, résultats CSV et rapports sélectionnés accompagnent le commit.

Les fichiers bruts JSON et les rapports Markdown inclus dans des manifestes sont copiés à l'identique en `.json.txt` ou `.md.txt` pour leur versionnement : le hook Prettier ne les réécrit pas et leurs empreintes restent celles des originaux `.json`. Ce sont des représentations JSON textuelles, pas une nouvelle exécution. Les originaux restent lisibles localement aux chemins cités dans les rapports ; sur Git, utiliser le même chemin avec suffixe `.txt` lorsque présent.

Les manifestes `final-08/source-manifest.json.txt` et `final-08/candidate-manifest.json.txt` identifient la source et les artefacts testés. Les48cas et six évaluations simulées sont dans RESULTATS.csv/MATRICE-TESTS.csv et product/. Les anciennes preuves externes à cette campagne ne sont pas incluses dans ce commit. Les quatre fichiers de suivi racine conservent les informations préexistantes et ajoutent cette mission ; leurs snapshots initiaux sont conservés localement dans tracking-before.

Inventaire exact de sélection : evidence-stage-list.txt et application-stage-list.txt. L'identité Git après hooks sera consignée localement dans POST-COMMIT.md ; un rapport créé après un commit ne peut pas contenir son propre SHA dans ce même commit. Aucun SHA candidat ne vaut preuve de déploiement : consulter PUBLICATION.md.
