# B02 / B04 / B12 — résilience et partage, 14 septembre 2026

## Reproduction et décision

Six avis simulés avant implémentation : `../product/PREIMPLEMENTATION-PERSONAS.md`. Ce ne sont pas des participants humains.

- B02 : test neuf de seconde lecture du lien legacy rouge : le helper produisait `##d=`, perdant son propre contrat de relecture. Le parcours Analyzer historique nettoyait ensuite l’URL, donc ce constat ne démontre pas une perte globale dans la page. Preuve `before-codec.log`.
- B12 : rejet avant atob et rejet du texte décodé >20 000 caractères rouges dans la même preuve. Aucun OOM ni exploitation allégué.
- B04 : trois appels concurrents et un retry immédiat sans espacement ; Retry-After n’empêchait pas un second consommateur d’appeler immédiatement. Deux tests rouges, `before-queue.log`. Aucun trafic de charge tiers : fetch remplacé par des réponses locales.

## Changements

Migration legacy : suppression du second dièse, conservation nom Unicode/onglet et paramètres query étrangers, seconde lecture identique. Protocole reste deck/nom/onglet, sans réglages ajoutés.

Entrées bornées : 20 000 unités UTF-16 comme le parser ; avant atob, plafond base64 80 000 caractères (trois octets UTF-8 maximum par unité UTF-16, facteur base64 4/3). Les séquences UTF-8 invalides sont refusées intégralement, sans substitution silencieuse. Nom limité à 1 000 unités UTF-16. Avant URLSearchParams, query+hash limité à 260 000 caractères, marge pour percent-encoding. Aucun texte tronqué. Le callback optionnel `parseShareParams(onError)` fournit un message anglais de récupération ; l’intégration Snackbar appartient au lead. Le codec ne modifie aucun état de deck lors d’un rejet.

File Scryfall centrale dans http.ts : tous les appels API source passent ce helper, y compris collections, exact/fuzzy, terrains, manaProducer et images. Départs espacés de 110 ms minimum ; attente jusqu’aux headers avant libération, puis consommation du corps sous délai existant. Retry-After des 429/503 met aussi en pause les autres consommateurs. Nombre de retries existant (un) inchangé ; délais 8 s par opération / 30 s analyse inchangés et incluent la file. Un délai Retry-After long entraîne un timeout sans appel prématuré. Les requêtes annulées en attente ne sont pas envoyées, les réponses tardives ignorées ; un rejet ne bloque pas les appels suivants. Accept JSON explicite ; User-Agent navigateur conservé. Les anciens limiteurs locaux sont supprimés pour éviter deux mécanismes indépendants.

Pas de déduplication des requêtes en vol ajoutée : les caches existants restent en place ; une déduplication ferait partager la propriété d’annulation entre plusieurs consommateurs. Le rythme est global à ce document JavaScript, pas entre onglets, utilisateurs ou IP derrière NAT.

## Source primaire

Consultée via web le 14 septembre 2026 : https://scryfall.com/docs/faqs/i-m-having-trouble-accessing-the-scryfall-api-or-i-m-blocked-17 . FAQ accessible : moins de 10 requêtes/s, réduire la charge après 429, pas de boucle pour forcer le passage ; en-têtes Accept/User-Agent et HTTPS. Espacement 110 ms choisi pour rester strictement sous ce débit. L’ouverture directe https://scryfall.com/docs/api a retourné 403 ; aucune extrapolation depuis un agrégateur utilisée. Les images statiques ont des limites distinctes selon cette FAQ ; seuls les lookups API sont régulés ici.

## Validation

`targeted-3.log` : **53 tests réussis, 7 fichiers**, nouvelle exécution. Codec, pacing partagé, Retry-After, annulation en file, réponse tardive, délai long, réseau/metadata/negative cache, images et batches. Exécution :

```
npx vitest run src/utils/__tests__/urlCodec.test.ts src/services/__tests__/http.scryfallQueue.test.ts src/services/__tests__/http.test.ts src/services/__tests__/http.deadline.test.ts src/services/__tests__/landBatch.t07.test.ts src/services/__tests__/networkCancellation.test.ts src/hooks/__tests__/useCardImage.network.test.ts
```

`lint.log` : ESLint ciblé sans avertissement, code 0. Formatage Prettier ciblé après tests (`format.log`), vérification finale confiée au gate du lead. Aucune formule modifiée, aucun commit/push/déploiement par cet agent.

Essais intermédiaires conservés : `targeted-1.log`, `targeted-2.log`. Défaut de harness établi : fake timers redémarraient dans le passé alors que la nouvelle file partage une horloge ; anciennes assertions fallback attendaient une réponse immédiate sans avancer les timers. Correction des tests : horloge monotone entre cas, modules HTTP isolés et progression explicite des timers. Aucune assertion supprimée, aucun délai de test augmenté. Les 53 assertions/scénarios passent après correction.

Limites : le rendu Snackbar, les clics/reloads publics, la conservation du deck visible après erreur et le gate candidat final appartiennent aux validations lead. Les tests bornent les effets du code ; ils ne mesurent ni latence Scryfall réelle ni charge utilisateurs, ni conformité globale sur IP partagée. Le runtime navigateur possède ses propres limites d’URL et peut refuser un lien encore inférieur aux plafonds défensifs.
