# V12 — disponibilité HTTP des références externes

2026-09-06,10:45–10:47UTC.65 URL primaires extraites directement de `articlesReferenceSeed.ts`, sans changement de la bibliothèque. Concurrence3 maximum, timeout8 secondes par requête, User-Agent explicite; aucune tentative de contournement d'accès. Résultats bruts datés :`inventory.json`, `http-results.json`, `get-confirmation.json`, `run.log`; scripts reproductibles joints.

Première passe HEAD :58 réponses200,6 réponses404,1 timeout. GET de confirmation uniquement sur ces7 échecs :l'archive Commander répond200,5 anciennes pages redirigent vers la même rubrique générale TCGPlayer/ChannelFireball, et la page Looter Problem confirme404.

Bilan consolidé :59 destinations avec réponse200 sans perte manifeste de route d'article (accès au contenu non certifié),5 liens devenus une rubrique générique (article non récupéré),1 lien404. Les6 dernières entrées sont déjà marquées `lost` dans les données et ne constituent donc pas une nouvelle correction du seed. Les différences HEAD/GET montrent pourquoi la première passe ne suffit pas à déclarer un lien cassé.

|Référence perdue|GET|Destination|
|---|---|---|
|pvddr-when-to-mulligan|200 après redirection|rubrique générale ChannelFireball|
|pvddr-ten-commandments|200 après redirection|rubrique générale ChannelFireball|
|karsten-london-mulligan|200 après redirection|rubrique générale ChannelFireball|
|lsv-mulligans|200 après redirection|rubrique générale ChannelFireball|
|pvddr-how-to-sideboard|200 après redirection|rubrique générale ChannelFireball|
|lsv-looter-problem-lost|404|URL historique|

Limites :HTTP200 n'est pas une validation du contenu, de l'identité d'une vidéo, d'un paywall, du rendu d'une capture Archive.org ou de toutes les citations. Les redirections connues de YouTube sont conservées dans les preuves. Cette vérification couvre la disponibilité HTTP de toutes les65 références primaires, pas une revue éditoriale complète ni les URL originales secondaires. Ne pas cocher la totalité V12 si celle-ci exige la lecture/validation des contenus; aucun accès privé n'a été utilisé.
