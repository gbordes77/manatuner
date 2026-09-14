# UX005 — navigation et saisie non analysée

Run1 utilise à tort la fixture sample sans Mountain/Bolt : expiration, erreur de sonde conservée. Run2 corrige la fixture mais attend le textarea déjà visible alors que le retour conserve le résultat et l'éditeur replié : erreur de sonde conservée. Run3 ouvre Edit Deck si nécessaire.

Run3 constate : analyse24Mountain/36Bolt →Guide→retour conserve le résultat ; reload conserve deck et nécessite nouvelleanalyse (contrat volatile). Modifier25/35 puis cliquerGuide immédiatement et revenir retourne24/36 : **perte réelle de la saisie en attente du debounce300ms**. Source DeckInputSection annule timer surunmount sanstransmettre valeur. Ce résultat rouge empêche de considérer la conservation complète acquise. Réparation ciblée soumise aux six personas et tests, nouveau candidat requis. Aucune suppression de ces preuves.
