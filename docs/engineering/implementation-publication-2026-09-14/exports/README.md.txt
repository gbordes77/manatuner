# B15/B16 — exports inspectés, 14 septembre 2026

Évaluation simulée préalable : ../product/PREIMPLEMENTATION-PERSONAS.md, puis revue de la version finale par product-manager. Aucun tableur réel ou lecteur d'écran humain prétendu. Aucune formule du moteur modifiée.

## B15 — vecteur confirmé, durcissement livré

Sur le candidat historique local4190, saisie réelle `59 Plains\n1 =1+1`, métadonnées Scryfall interceptées localement avec404 pour nom inconnu. Analyse acceptée avec nom conservé et CSV réellement téléchargé : `deck,=1+1,1,2,{2},,false,,false,false` (formula-before.csv). C'est un champ attaquable en position initiale de cellule. Le comportement d'exécution d'un tableur n'a pas été testé : aucune application locale isolée Numbers/Excel/LibreOffice repérée. Pas d'ouverture dans Google Sheets, qui enverrait le contenu à un service tiers. Python csv vérifie la structure, pas l'exécution des formules.

Correction : apostrophe au début des seules cellules textuelles commençant, éventuellement après espaces, par =,+,-,@ ; CSV escaping conservé pour guillemets, virgules et lignes. Quantités, CMC, résumés numériques et booléens inchangés. Le commentaire du nom de deck est échappé comme cellule entière pour qu'un nom multiligne ne crée pas de nouvelle ligne de données. Aucune suppression de caractère sur les noms ordinaires. Fichier après `stable/formula.csv` réellement exporté : `deck,'=1+1,1,2,{2},,false,,false,false`. La conformité de structure CSV est vérifiée par csv.reader ; CSV formula execution reste NON EXÉCUTÉ.

## B16 — PDF paginé et alternative textuelle

Baseline fournie par le lead : ../before/before.pdf, rendu via pypdfium2 en before-page-1/2.png. Deux pages raster, zéro caractère de texte natif. Visuellement, Opening Hand Analysis reste page1 et ses quatre valeurs page2 : défaut reproduit.

La pagination tient les sections marquées data-pdf-block ensemble si elles tiennent sur une page A4. Les rangées source restent contiguës ; une section exceptionnellement plus haute qu'une page doit encore être fractionnée, sans perte de rangées (test dédié). Aucun canvas entier limité à la première page. Construction d'un PDF toujours raster, annoncé comme capture visuelle, pas comme document PDF balisé accessible.

Menu existant : Text report (accessible) → dialogue avec texte en lecture seule sélectionnable, téléchargeable en .txt. Rapport généré à partir des données réellement enregistrées : bibliothèque, terrains, commandant/réserve, contrat du modèle, scores et unités, probabilités, classifications de mains, résultats disponibles/indisponibles, suggestions et liste intégrale par zone. Liens deck/name/tab inchangés. Modèle legacy/inconnu n'hérite pas du contrat physical-v1. Le texte ne prétend pas reproduire les réglages interactifs absents du lien.

Les pourcentages de mulligan sont déjà0–100 et ne sont plus multipliés par100 dans le brouillon initial de texte. Le libellé Poor reflète0ou6, pas6+ ; la catégorie terrible7ou0sans early est distincte dans le texte, avec avertissement de chevauchement. Les couleurs non requises utilisent convention100%, explicitée. Nom du commandant désormais visible dans la zone deck Blueprint en plus du total99+1. Le rapport texte reste complet même si la capture visuelle d'un très long deck est scrollable/tronquée : cette limite est annoncée près de l'export.

## Fichiers réellement générés et contrôlés

Sorties définitives de cet agent dans **stable/** (exports antérieurs conservés à la racine pour traçabilité) :

| Fixture / vue | PDF | CSV et texte vérifiés |
|---|---|---|
| 24Plains +36SavannahLions,390px sombre | 2pages ; Opening Hand titre+77/77/19/3 réunis page2 | bibliothèque60,24terrains ; texte Good77.00%, pas7700% |
| 43Forest +56LlanowarElves +1Atraxa commandant +2Negate réserve,1440px clair | 1page ; identité99+1, sections et nom commandant | bibliothèque99,43terrains, commandant1, réserve2, zones distinctes et noms conservés |
| 59Plains +1nom=1+1,390px clair | Non exécuté, hors besoin PDF | apostrophe formule confirmée ; main60 et quantités conservées |

Chaque .txt téléchargé est strictement égal au texte affiché dans le dialogue. Les .json associés permettent de comparer les valeurs. Les fixtures sont synthétiques ; réponses API uniquement locales, à partir des fixtures du dépôt et métadonnées minimales documentées dans exports-stable.mjs. Pas de charge ni mesure de latence Scryfall réelle. Les rendus pypdfium2 ont été inspectés visuellement par l'agent ; zéro texte natif confirme la limite raster.

## Tests et limites

- `npx vitest run src/utils/__tests__/analysisText.test.ts src/utils/__tests__/pdfPagination.test.ts` : **14/14**, unit.log, unités/zones/legacy/CSV/pagination.
- `npx tsc --noEmit` : code0, types.log (candidat courant lors de cette exécution).
- eslint trois sources : code0, lint.log.
- exports-stable.mjs : **3/3 parcours**, results.json ; JSON/CSV/texte téléchargés, PDF pour2fixtures ; aucun test par screenshot seul.
- Dialogue390sombre : axe WCAG2A/AA/2.1AA après transition, **zéro violation**, Escape ferme réellement. dialog-a11y-final.json/log et dialog-final.png. Un contrôle source/visuel a identifié la couleur globale h2 sombre héritée ; titre fixé text.primary explicitement. Les anciens screenshots titre bleu restent antérieurs.
- Appareils physiques, lecteur d'écran réel, exécution tableur : **NON EXÉCUTÉ**. Le test axe ne les remplace pas. Revue du propriétaire et gate final sont ceux du lead.

Incidents de sonde préservés : première génération après utilisait fixture incomplète sans Plains/Savannah, attente de résultat interrompue ; fixtures corrigées sans changement produit. Première capture du dialogue prise pendant fade/menu sortant ; sorties stable attendent polices et animations finies. Première sonde axe utilisait browser.newPage, API refusée par AxeBuilder ; corrigée via browser.newContext, log conservé. Aucun seuil réduit ni assertions désactivées.

Sources détenues : ManaBlueprint.tsx, analysisText.ts, pdfPagination.ts, tests unitaires correspondants. Sources exports stables signalées au lead ; aucun gate complet, commit, push, déploiement effectué par cet agent.

## Validation candidat final

Rejeu FINAL-02 terminé : voir ../final-02/exports/README.md.3/3 parcours, PDF+CSV+TXT+JSON réellement contrôlés et manifeste ; titre dialogue sombre15.91:1 et axe0violation. Ces nouvelles preuves remplacent les sorties stable intermédiaires pour la livraison. Aucun code changé après.

## Révision CSV après FINAL-02

Lire CSV-COMPATIBILITY.md : commentaire #maintenu en première colonne, nom vraie cellule2 ;17unitaires et T07+recette officielle acquis. Cette modification postérieure impose nouveau gate lead ; les preuves FINAL-02 sont conservées sans prétention du nouveau format de commentaire.
