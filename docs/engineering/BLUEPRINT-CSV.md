# Lire le CSV Blueprint

Dans Analyzer, ouvrir **Blueprint → Export Blueprint → CSV (Sheets / Pandas)**. Le fichier comporte des métadonnées (`#`), une table `section,card_name,…` puis une table `section,metric,value`. Ce ne sont pas les lignes d'une table unique : un appel direct à `pandas.read_csv` sur tout le fichier ne convient pas.

La recette standard Python préserve les noms entre guillemets, virgules et retours à la ligne, sépare les tables et contrôle les totaux :

```sh
python3 scripts/read-blueprint-csv.py /chemin/mon-export.csv > /chemin/mon-export.json
```

Le résultat contient `cards`, `metrics` et `totals`. Pour un DataFrame, charger ce JSON puis appeler `pandas.DataFrame(data['cards'])` ; les métriques restent dans `data['metrics']`.

La bibliothèque exclut `is_sideboard=true` et `is_commander=true`. Pour Commander, **99 cartes de bibliothèque + 1 commandant** ne font donc pas `total_cards=100`. Les cartes de réserve restent exportées et comptées séparément. Le script vérifie que les quantités de bibliothèque et de terrains correspondent aux métriques `total_cards` et `total_lands`, sans arrondir les valeurs exportées.

Dans Sheets, importer le CSV, puis copier chaque table dans une feuille distincte en conservant son propre en-tête. Les lignes de métadonnées documentent le moteur, les indices et le modèle ; elles ne sont pas des cartes. Les liens de partage transportent le deck, son nom et l'onglet, pas les paramètres interactifs.

Les preuves de la campagne courante doivent accompagner la livraison : exporter les fixtures 24 Plains/36 Savannah Lions et Atraxa99+1 avec une carte de réserve, puis exécuter la recette sur chacun des deux fichiers téléchargés. Résultats attendus : bibliothèque60/terrains24/commandants0/réserve0 et bibliothèque99/commandants1/réserve1. La première fixture est synthétique et n'est pas une liste légale de tournoi.

Vérification du 10 septembre 2026 sur les deux téléchargements du nouveau candidat : les totaux attendus ci-dessus sont acquis (43 terrains pour Atraxa). Preuve : [csv-import.json](reaudit-fixes-szrp1r9w/csv-import.json).

## Métadonnées et cellules textuelles — 14 septembre 2026

La ligne du nom utilise deux champs : `# Deck:,"Persona, ""White"""`. Elle commence toujours par `#` ; le nom est une véritable cellule CSV, ce qui préserve virgules et guillemets sans créer de cellule de formule supplémentaire. Les retours CR/LF du nom sont représentés par les caractères littéraux `\r` et `\n` pour garder une ligne physique unique ; le JSON conserve le nom original exact. Les cellules textuelles commençant éventuellement après espaces par `=`, `+`, `-` ou `@` reçoivent une apostrophe de protection. Les quantités, nombres et zones ne changent pas. La recette `read-blueprint-csv.py` ignore toujours les lignes dont le premier champ commence par `#`.
