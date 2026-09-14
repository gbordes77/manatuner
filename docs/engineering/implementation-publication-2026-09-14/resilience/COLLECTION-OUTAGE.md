# Collection indisponible, repli exact conservant les délais

## Constat et reproduction

Le lead a observé sur final-02 POST /cards/collection expirant sous CUA/Playwright et deux sondes curl (12s), tandis que GET named réussit. Ces observations établissent une différence entre chemins dans cet environnement, pas la cause (réseau, proxy, service, etc.). Aucune charge ni sonde tiers supplémentaire effectuée par cet agent.

Reproduction locale : `collection-outage-before.log`, deux cas rouges sur quatre. Chaque POST retourne une promesse qui ne se résout jamais ; GET renvoie des métadonnées de fixture. Analyse réelle24Plains/36SavannahLions échoue après8s ; fetchLandDataBatch échoue de même. Tests parent abort/deadline déjà verts. Le timeout local était propagé via isCancellation(HttpTimeoutError), interrompant tout repli : comportement préexistant à la file de cette mission.

Six avis simulés d'adaptation avant écriture : `../product/FINAL-PERSONAS.md`, section réévaluation ciblée. Distinction deadline enfant/parent, exact en premier, pas de remise à zéro du budget30s, queue110ms/cooldown, pas de cache d'absence transitoire.

## Correction bornée

`cardResolver.batchFetchFromScryfall` vérifie d'abord throwIfAborted(parent). Si seul son appel collection a dépassé8s, il abandonne les collections restantes de cette invocation et rend la main au résolveur existant exact→fuzzy pour les cartes non mises en cache. Il ne déclenche pas fuzzy parce que POST a expiré.

`fetchLandDataBatch` applique la même distinction pour les métadonnées et traite les cartes restantes par fetchLandData exact-first, sous le signal parent initial. Aucune modification de http.ts, des délais8s/30s, du nombre de retries, de la file110ms ou de Retry-After. Aucune modification des formules, du cache négatif ou des gardes anti-réponse périmée.

Portée : chemin d'analyse DeckAnalyzer et batch des métadonnées terrains. Le helper historique autonome searchCardsByCollection/analyzeDecklistText n'est pas modifié ; il n'est pas appelé par cette analyse UI. Sa stratégie historique reste distincte et ne constitue pas une réussite de repli sous timeout revendiquée ici.

## Preuves après

`collection-outage-final.log` : **23/23 tests sur4fichiers acquis** après formatage, dont cinq nouveaux scénarios :

1. Analyse réelle60cartes/24terrains réussie en temps simulé<20s malgré tous POST suspendus ; GET exact constaté, aucun fuzzy ; réponse POST tardive ne change pas le résultat.
2. Métadonnée Plains récupérée par GET après timeout enfant.
3. Annulation utilisateur avant8s : un appel seulement, aucun repli.
4. Deadline parent avant8s : un appel seulement, aucun repli.
5. Deadline globale30s pendant GET de repli6s : HttpTimeoutError à30s, requête courante annulée, aucune requête après10s supplémentaires.

Tests existants cancellation, pacing/cooldown et land batch rejoués dans le même lot. Lint ciblé acquis `collection-outage-lint-final.log`. Premier essai après code `collection-outage-after-1.log` rouge pour import HttpTimeoutError manquant dans scryfall (corrigé), essai2vert22 ; premier lint avertissement nom argument inutilisé (renommé \_init), historiques conservés. Aucun seuil réduit ni timeout de test augmenté.

La réussite réseau réelle après correction et le prochain gate candidat restent à établir par le lead. Cette correction ne promet pas que tous les decks, réseaux ou services répondront dans30s ; elle permet un chemin GET disponible de progresser sans masquer une annulation ni dépasser le budget global.
