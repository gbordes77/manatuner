# Library Gap Audit — 2026-08-01

> **Scope :** ManaTuner Competitive MTG Reading Library uniquement (`/library`).  
> **SSOT lu :** `src/data/articlesReferenceSeed.ts` (gagne en cas de divergence) · `public/library.json` (54, généré 2026-08-01) · `src/types/referenceArticle.ts` · tests seed.  
> **Live :** https://www.manatuner.app/library · **Prod stamp :** v2.7.8  
> **Contrainte session :** audit + recherche uniquement — **pas de code** tant que le créateur ne dit pas `go seed`.

---

## 0. Executive summary (10 lignes max)

- **Score santé catalogue : 6.5/10** — sélection éditoriale forte et cohérente marque, mais trous structurels graves (sideboard, mulligan post-London, limited mince, 6 lost, jp=0).
- **Force 1 :** manabase Karsten comme cœur de marque (lands + sources 2018/2022 + Commander) — alignement parfait ManaTuner.
- **Force 2 :** tracks curator lisibles (FNM → RCQ → PT) + voix `curatorNote` + FR (PCM, Moudou, Depraz, Boa).
- **Force 3 :** classiques durables présents (Flores Beatdown, Chapin mulligan/deckbuilding, Saito, Reid Level One index, PVDDR heuristics).
- **Faiblesse 1 :** **sideboard = 2** dont 1 lost — catégorie quasi vide pour un skill RCQ.
- **Faiblesse 2 :** **mulligan fragile** : 4 entrées, 3 lost ; seul Chapin 2010 (pré-Vancouver/London) est live.
- **Faiblesse 3 :** **limited track = 3** + **jp = 0** + **6 lost CFB** sans recovery Wayback confirmée.
- **Candidats ADD retenus :** **12** (dont **4 P0**, **5 P1**, **3 P2**) — backlog top 10 ci-dessous ; le reste en annexe / rejet.
- **Quick win n°1 sans nouveau contenu :** promouvoir `karsten-colored-sources-2022` hors grid-only (track rcq ou first-fnm) + patcher des `secondaryCategories` manquantes.
- **Recovery LOST :** **0/6 Found** · **0 Partial** · **6 Still lost** (CDX Wayback vide ou 503 ; substance partiellement remplacée par Reid Level One live).

---

## 1. Audit par catégorie

| Catégorie        | n      | Couverture                                                                                    | Forces                                   | Trous / redondances                                                                                                                    |
| ---------------- | ------ | --------------------------------------------------------------------------------------------- | ---------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| **fundamentals** | 5      | Flores Beatdown + Zvi suite + Reid full course + LSV signals (limited) + Brackets Commander   | Canon « role assignment » historique     | Peu de pieces _standalone_ gameplay (sequencing, tempo, role) hors index Level One — **chapitres Level One non extraits**              |
| **manabase**     | 5      | Karsten lands, sources 2018/2022, Commander, Reid Building a Mana Base                        | Cœur de marque ; tables opérationnelles  | Manque **intro hypergéométrique pédagogique** (Karsten 2018 CFB) ; `colored-sources-2022` **grid-only** alors que c’est le SSOT engine |
| **deckbuilding** | 5      | Chapin NLD + 61 cards + Elephant + PVDDR 10 commandments (lost) + Game Knights                | Bons angles theory                       | 1 lost canonique ; peu de constraint-based / 75-card construction moderne                                                              |
| **mulligan**     | 4      | Chapin Art live ; Karsten London / LSV / PVDDR **lost**                                       | Chapin toujours cité                     | **Couverture London-era cassée** ; pas de Reid Level One Mulligans alors qu’il est live sur wizards.com                                |
| **sideboard**    | **2**  | Reid Level One Sideboarding live ; PVDDR How to Sideboard **lost**                            | Reid reste excellent pour Sarah/Karim    | **Trou critique** ; pas de Sideboard Plans (Reid, live) ni framework post-board role                                                   |
| **metagame**     | 8      | Ban list, 17Lands, EDHREC, Best vs Known, Yahi maths, Battle Chads, Boa/Depraz MTGO           | Mélange data + tools + FR                | Battle Chads 2026 = **faible durabilité** / titre clickbait ; Boa = borderline « UI ladder »                                           |
| **mindset**      | **12** | Saito (6 parts) + Kuisma + Manfield + Fortier ladder + Zvi time + PVDDR one-mistake + PV Rule | Canon mindset le plus dense du catalogue | **Sur-représentation** vs skill technique ; 4 Saito en grid-only diluent le scan                                                       |
| **advanced**     | 6      | Heuristics, DASH, Dagen, Moudou GT, Cascades, Looter (lost)                                   | Excellent pour Natsuki/David             | Looter lost ; peu d’intro hypergeom (plutôt manabase)                                                                                  |
| **podcasts**     | 7      | PCM×5 FR + Command Zone + LR                                                                  | Diversité FR unique                      | PCM tous grid-only — OK ; pas de Constructed Resources / Limited Level-Ups                                                             |

**Doublons conceptuels (non bloquants) :**

- **Saito ×6** : série justifiée ; ne pas ajouter d’autres « mental game tournament success » sans angle nouveau.
- **Karsten sources 2018 vs 2022** : redondance volontaire historique — garder 2022 comme référence, 2018 comme archive.
- **Reid manabase + Karsten lands** : complémentaire (pédagogie vs tables) — garder les deux.
- **Beatdown Flores + Zvi Multitasking** : suite canonique — garder.

---

## 2. Audit par track

### first-fnm (5)

- **Couverture :** lands Karsten · Reid manabase · Chapin mulligan · Kuisma luck · Saito having fun (archived).
- **Forces :** parfait pour Léo/Sarah ; 1 archived non-EN-feel (Saito).
- **Trous :** pas de **sequencing** ni **role assignment** accessibles ; pas de sideboard (OK pour FNM, mais un teaser aide Sarah).
- **Cap :** 5/10 — place pour 1–2 adds beginner.

### rcq (7)

- **Couverture :** prep (Manfield, Fortier) · heuristics · one-mistake · sideboard Reid · time Zvi · **mulligan PVDDR LOST**.
- **Forces :** curriculum compétitif clair.
- **Trous :** track **porte un lost** (`pvddr-when-to-mulligan`) — UX honteuse pour un parcours guidé ; sideboard depth insuffisante (1 live).
- **Action track :** retirer le lost du track _ou_ le remplacer par Reid Mulligans / Mulligans Constructed dès seed.

### pro-tour (9)

- **Couverture :** Saito concentration · Cascades · Elephant · 61 cards · DASH · Dagen · Best vs Known · Yahi · Moudou FR.
- **Forces :** dense, international, advanced.
- **Trous :** saturé (9/10) ; **ne pas ajouter** de mindset Saito-like ; place optionnelle pour 1 theory pure seulement si on sort un item.

### commander (5)

- **Couverture :** Brackets · Karsten EDH manabase · Game Knights · EDHREC · Command Zone.
- **Forces :** boucle Analyzer CTA ; math EDH présente.
- **Trous :** peu de politics/threat assessment _écrit_ durable (Game Knights = video) ; pas de multi-color manabase au-delà Karsten ; cEDH hors scope volontaire — OK.
- **Cap :** OK qualité > fluff.

### limited (3) — **track le plus mince**

- **Couverture :** 17Lands blog · LSV signals (archived fragile) · Limited Resources podcast.
- **Forces :** data + classic + podcast.
- **Trous :** pas de sealed theory, pas de sideboarding limited, pas de mulligan limited, pas de data literacy « comment lire 17Lands » dédiée, signals LSV dépend d’un snapshot wayback `2020*`.
- **Cap :** 3/10 — **priorité P2 d’étoffer à 5–6** sans diluer.

### grid-only (25)

- Réservoir utile (PCM, Karsten sources, full course, classics, lost placeholders).
- **Problème :** le SSOT sources 2022 et plusieurs Level One chapitres _devraient_ être trackés ou au moins plus visibles ; 4 Saito grid + 5 PCM = bruit scan pour Léo.

---

## 3. Recovery des LOST

Méthode : CDX Wayback Machine (exact + wildcards) · recherche web · citations secondaires (Limited Resources show notes pour Looter). API CDX parfois 503 ; re-tentatives multiples.

| id                        | Status recovery | URL candidate | Notes                                                                                                                                                                                        |
| ------------------------- | --------------- | ------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `karsten-london-mulligan` | **Still lost**  | —             | CDX `[]` sur slug exact et wildcard. Substance **partiellement dans** `karsten-how-many-lands-2022` + `karsten-colored-sources-2022` (London modelés). **Ne pas inventer d’URL.**            |
| `pvddr-when-to-mulligan`  | **Still lost**  | —             | CDX vide. **Remplacement fonctionnel proposé :** Reid Level One Mulligans (+ Part III Constructed).                                                                                          |
| `lsv-mulligans`           | **Still lost**  | —             | CDX 503/vide. Remplacement : Reid Mulligans.                                                                                                                                                 |
| `pvddr-how-to-sideboard`  | **Still lost**  | —             | CDX ne trouve que `how-to-sideboard-with-bant-company` (guide matchup, **pas** le framework). SCG slug redirect unrelated (déjà noté seed). Remplacement : Reid Sideboard + Sideboard Plans. |
| `pvddr-ten-commandments`  | **Still lost**  | —             | CDX vide. Conserver placeholder community ; pas de mirror trouvé SCG/Substack.                                                                                                               |
| `lsv-looter-problem-lost` | **Still lost**  | —             | URL citée dans LR #340 show notes toujours morte ; CDX vide. Conserver call community.                                                                                                       |

**Partial adjacent (pas un recover d’id lost) :**
| Ressource | Status | URL |
|-----------|--------|-----|
| Karsten _An Introduction to the Hypergeometric Distribution for Magic Players_ (2018) | **Found (archive)** | `https://web.archive.org/web/20201107233402/https://www.channelfireball.com/articles/an-introduction-to-the-hypergeometric-distribution-for-magic-players/` — **ADD nouveau id**, pas recover |
| Mirror PDF orkerhulen.dk (souvent cité Reddit) | **Dead 404** | ne pas utiliser |
| Reid Level One chapitres (mulligan, sequencing, sideboard plans, limited…) | **Live 200** | `magic.wizards.com/en/news/feature/...` (redirects depuis `/articles/archive/`) |

---

## 4. Candidats ADD (triés P0 → P3)

### P0 — Alignés marque ManaTuner

#### 1. `karsten-hypergeometric-intro`

| Champ                             | Valeur                                                                                                                                                                                                  |
| --------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| title / author / year / publisher | An Introduction to the Hypergeometric Distribution for Magic Players · Frank Karsten · 2018 · ChannelFireball                                                                                           |
| url_primary                       | https://web.archive.org/web/20201107233402/https://www.channelfireball.com/articles/an-introduction-to-the-hypergeometric-distribution-for-magic-players/                                               |
| url_original                      | https://www.channelfireball.com/articles/an-introduction-to-the-hypergeometric-distribution-for-magic-players/                                                                                          |
| proposed_id                       | `karsten-hypergeometric-intro`                                                                                                                                                                          |
| category                          | manabase · secondary: advanced                                                                                                                                                                          |
| level                             | intermediate                                                                                                                                                                                            |
| medium                            | article                                                                                                                                                                                                 |
| language                          | en                                                                                                                                                                                                      |
| linkStatus                        | archived                                                                                                                                                                                                |
| proposed_track                    | **rcq** (ou first-fnm si on veut Léo+math ; préférer rcq pour ne pas surcharger FNM)                                                                                                                    |
| personas_served                   | Sarah, Karim, Natsuki, David                                                                                                                                                                            |
| why_missing                       | Tables Karsten présentes, mais **pas l’article pédagogique** qui explique _pourquoi_ ManaTuner / hypergeom existent                                                                                     |
| why_canonical                     | Fondement math de toute la littérature manabase post-2010 ; cité partout (TCGPlayer Karsten updates, Reddit, orkerhulen mirrors)                                                                        |
| durability_score                  | 5                                                                                                                                                                                                       |
| mana_tuner_fit                    | **5**                                                                                                                                                                                                   |
| redundancy_vs_existing            | Partial vs `karsten-how-many-lands-2022` / sources — **angle différent** (outil + distribution, pas tables N sources)                                                                                   |
| access_friction                   | free-archive                                                                                                                                                                                            |
| draft_curatorNote                 | « Si les tables Karsten sont le GPS, cet article est le cours de cartographie. Hypergéométrique sans jargon inutile : exactement le contrat ManaTuner. Lis ça avant de contester un % sur l’Analyzer. » |
| draft_description                 | Karsten explique la distribution hypergéométrique appliquée aux decks Magic — le socle math derrière land counts, colored sources, et l’engine ManaTuner.                                               |
| priority                          | **P0**                                                                                                                                                                                                  |
| action                            | **ADD**                                                                                                                                                                                                 |

#### 2. `reid-duke-level-one-mulligans`

| Champ                             | Valeur                                                                                                                                                                               |
| --------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| title / author / year / publisher | Mulligans · Reid Duke · 2015 · Wizards of the Coast (Level One)                                                                                                                      |
| url_primary                       | https://magic.wizards.com/en/news/feature/mulligans-2015-01-26                                                                                                                       |
| proposed_id                       | `reid-duke-level-one-mulligans`                                                                                                                                                      |
| category                          | mulligan                                                                                                                                                                             |
| level                             | beginner                                                                                                                                                                             |
| medium                            | article                                                                                                                                                                              |
| language                          | en                                                                                                                                                                                   |
| linkStatus                        | live                                                                                                                                                                                 |
| proposed_track                    | **first-fnm** (remplace conceptuellement le vide laissé par les lost)                                                                                                                |
| personas_served                   | Léo, Sarah, Karim                                                                                                                                                                    |
| why_missing                       | Catégorie mulligan dépend de Chapin 2010 + 3 lost ; Reid « Two to Five Lands Strategy » est **le** framework FNM manquant                                                            |
| why_canonical                     | Level One = curriculum officiel le plus lu de la décennie 2010                                                                                                                       |
| durability_score                  | 5                                                                                                                                                                                    |
| mana_tuner_fit                    | 4                                                                                                                                                                                    |
| redundancy_vs_existing            | Partial vs `chapin-art-of-mulligan` (theory vs heuristic actionnable)                                                                                                                |
| access_friction                   | free                                                                                                                                                                                 |
| draft_curatorNote                 | « Chapin te donne la philosophie. Reid te donne la règle par défaut : 2–5 lands, ship le reste — puis les exceptions. C’est le filet de sécurité avant que tu affines comme PVDDR. » |
| draft_description                 | Le chapitre Level One sur les mulligans : heuristique 2–5 lands, exceptions linear decks, et cadre clair pour arrêter de « feel-draft » ta main d’ouverture.                         |
| priority                          | **P0**                                                                                                                                                                               |
| action                            | **ADD** (+ option **retirer du track rcq** `pvddr-when-to-mulligan` lost)                                                                                                            |

#### 3. `reid-duke-level-one-sideboard-plans`

| Champ                             | Valeur                                                                                                                                                                                     |
| --------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| title / author / year / publisher | Sideboard Plans · Reid Duke · 2015 · Wizards                                                                                                                                               |
| url_primary                       | https://magic.wizards.com/en/news/feature/sideboard-plans-2015-03-09                                                                                                                       |
| proposed_id                       | `reid-duke-level-one-sideboard-plans`                                                                                                                                                      |
| category                          | sideboard                                                                                                                                                                                  |
| level                             | intermediate                                                                                                                                                                               |
| medium                            | article                                                                                                                                                                                    |
| language                          | en                                                                                                                                                                                         |
| linkStatus                        | live                                                                                                                                                                                       |
| proposed_track                    | **rcq**                                                                                                                                                                                    |
| personas_served                   | Sarah, Karim, Natsuki                                                                                                                                                                      |
| why_missing                       | sideboard n’a que le chapitre « The Sideboard » ; **plans** = le saut FNM→RCQ (construction 15 + in-match)                                                                                 |
| why_canonical                     | Complète le framework Reid ; unifie deck construction et décisions post-board                                                                                                              |
| durability_score                  | 5                                                                                                                                                                                          |
| mana_tuner_fit                    | 3                                                                                                                                                                                          |
| redundancy_vs_existing            | Partial vs `reid-duke-level-one-sideboarding` — **pas High** : plans ≠ intro sideboard                                                                                                     |
| access_friction                   | free                                                                                                                                                                                       |
| draft_curatorNote                 | « Avoir 15 cartes en side ne sert à rien sans plan écrit. Reid force le lien : ce que tu sors, ce que tu rentres, et **quel rôle** tu joues game 2. Lis ça la veille de ton premier RCQ. » |
| draft_description                 | Comment construire et exécuter des sideboard plans : unifier construction du 15 et décisions en match, matchup par matchup.                                                                |
| priority                          | **P0**                                                                                                                                                                                     |
| action                            | **ADD**                                                                                                                                                                                    |

#### 4. `reid-duke-level-one-sequencing`

| Champ                             | Valeur                                                                                                                                                       |
| --------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| title / author / year / publisher | Sequencing · Reid Duke · 2015 · Wizards                                                                                                                      |
| url_primary                       | https://magic.wizards.com/en/news/feature/sequencing-2015-02-16                                                                                              |
| proposed_id                       | `reid-duke-level-one-sequencing`                                                                                                                             |
| category                          | mulligan · secondary: fundamentals _(ou fundamentals + secondary mulligan — schéma : category `mulligan` est label « Mulligans & Sequencing »)_              |
| level                             | beginner                                                                                                                                                     |
| medium                            | article                                                                                                                                                      |
| language                          | en                                                                                                                                                           |
| linkStatus                        | live                                                                                                                                                         |
| proposed_track                    | **first-fnm**                                                                                                                                                |
| personas_served                   | Léo, Sarah, Karim                                                                                                                                            |
| why_missing                       | Catégorie s’appelle « Mulligans & Sequencing » mais **0 article sequencing**                                                                                 |
| why_canonical                     | Level One ; skill le plus sous-estimé entre « j’ai mon mana » et « je gagne »                                                                                |
| durability_score                  | 5                                                                                                                                                            |
| mana_tuner_fit                    | **4** (mana efficiency in-game)                                                                                                                              |
| redundancy_vs_existing            | None                                                                                                                                                         |
| access_friction                   | free                                                                                                                                                         |
| draft_curatorNote                 | « L’Analyzer te dit si tu _peux_ caster. Sequencing te dit dans quel _ordre_ tu le fais. Reid traite le sujet sans spoiler de set — parfait long-durée. »    |
| draft_description                 | L’art d’ordonner sorts et land drops : minimiser les dead turns, maximiser l’usage du mana, et éviter les pièges de séquence qui perdent des games « free ». |
| priority                          | **P0**                                                                                                                                                       |
| action                            | **ADD**                                                                                                                                                      |

---

### P1 — Compétitif durable

#### 5. `reid-duke-level-one-role-assignment`

| Champ                             | Valeur                                                                                                                                                      |
| --------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| title / author / year / publisher | Role Assignment · Reid Duke · 2015 · Wizards                                                                                                                |
| url_primary                       | https://magic.wizards.com/en/news/feature/role-assignment-2015-01-05                                                                                        |
| proposed_id                       | `reid-duke-level-one-role-assignment`                                                                                                                       |
| category                          | fundamentals · secondary: sideboard                                                                                                                         |
| level                             | intermediate                                                                                                                                                |
| medium                            | article                                                                                                                                                     |
| language                          | en                                                                                                                                                          |
| linkStatus                        | live                                                                                                                                                        |
| proposed_track                    | **rcq** (ou grid si rcq saturé après sideboard plans)                                                                                                       |
| personas_served                   | Sarah, Karim, Natsuki                                                                                                                                       |
| why_missing                       | Flores/Zvi sont archived advanced-ish ; manque le **pont pédagogique live** role → sideboard                                                                |
| why_canonical                     | Traduit Who's the Beatdown en curriculum moderne                                                                                                            |
| durability_score                  | 5                                                                                                                                                           |
| mana_tuner_fit                    | 3                                                                                                                                                           |
| redundancy_vs_existing            | Partial vs `flores-whos-the-beatdown` / `zvi-whos-the-beatdown-2-multitasking`                                                                              |
| access_friction                   | free                                                                                                                                                        |
| draft_curatorNote                 | « Flores invente la question. Reid te donne le mode d’emploi pour un matchup Standard de FNM. Lis Flores après, pas avant, si tu as moins d’un an de jeu. » |
| draft_description                 | Qui est le beatdown dans _ce_ matchup ? Reid formalise l’assignation de rôle offense/défense et les pièges de mauvaise assignation.                         |
| priority                          | **P1**                                                                                                                                                      |
| action                            | **ADD**                                                                                                                                                     |

#### 6. `reid-duke-mulligans-part-iii-constructed`

| Champ                             | Valeur                                                                                                                                   |
| --------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| title / author / year / publisher | Mulligans Part III: Constructed · Reid Duke · 2015 · Wizards                                                                             |
| url_primary                       | https://magic.wizards.com/en/news/feature/mulligans-part-iii-constructed-2015-06-29                                                      |
| proposed_id                       | `reid-duke-mulligans-part-iii-constructed`                                                                                               |
| category                          | mulligan                                                                                                                                 |
| level                             | intermediate                                                                                                                             |
| medium                            | article                                                                                                                                  |
| language                          | en                                                                                                                                       |
| linkStatus                        | live                                                                                                                                     |
| proposed_track                    | **rcq** (remplace track slot de `pvddr-when-to-mulligan`)                                                                                |
| personas_served                   | Karim, Natsuki                                                                                                                           |
| why_missing                       | Remplacement le plus proche d’un framework PVDDR lost pour constructed                                                                   |
| why_canonical                     | Suite Level One ; affine la règle 2–5 pour decks non-linear / combo-ish                                                                  |
| durability_score                  | 4                                                                                                                                        |
| mana_tuner_fit                    | 4                                                                                                                                        |
| redundancy_vs_existing            | Partial vs `reid-duke-level-one-mulligans` — OK en série (seriesId)                                                                      |
| access_friction                   | free                                                                                                                                     |
| draft_curatorNote                 | « La règle 2–5 casse dès que ton deck est linear. Ce chapitre est celui que tu relis avant un RCQ avec un deck « if I miss X I lose ». » |
| draft_description                 | Mulligans en Constructed au-delà de l’heuristique débutant : exceptions par archétype et mains « functionnelles » vs « pretty ».         |
| priority                          | **P1**                                                                                                                                   |
| action                            | **ADD**                                                                                                                                  |

#### 7. `chapin-next-level-magic-tempo`

| Champ                             | Valeur                                                                                                                                                                        |
| --------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| title / author / year / publisher | Next Level Magic Preview — Tempo · Patrick Chapin · 2009 · StarCityGames                                                                                                      |
| url_primary                       | https://articles.starcitygames.com/articles/next-level-magic-preview-tempo/                                                                                                   |
| proposed_id                       | `chapin-next-level-magic-tempo`                                                                                                                                               |
| category                          | advanced · secondary: fundamentals                                                                                                                                            |
| level                             | advanced                                                                                                                                                                      |
| medium                            | article                                                                                                                                                                       |
| language                          | en                                                                                                                                                                            |
| linkStatus                        | live                                                                                                                                                                          |
| proposed_track                    | **none** (grid) ou pro-tour **seulement si** on sort un item du track                                                                                                         |
| personas_served                   | Natsuki, David, Karim                                                                                                                                                         |
| why_missing                       | Tempo theory absente en standalone (Balance tempo/CA est dans Level One non extrait)                                                                                          |
| why_canonical                     | Extrait Next Level Magic ; reframing tempo lié à card economy / Philosophy of Fire lineage                                                                                    |
| durability_score                  | 4                                                                                                                                                                             |
| mana_tuner_fit                    | 4 (mana as resource efficiency)                                                                                                                                               |
| redundancy_vs_existing            | Low                                                                                                                                                                           |
| access_friction                   | free                                                                                                                                                                          |
| draft_curatorNote                 | « Chapin refuse l’équation naïve tempo = land drops. Si tu optimises des % de cast sans comprendre le tempo, tu construis des decks « correct on paper, lose to pressure ». » |
| draft_description                 | Extrait de Next Level Magic sur le tempo : framework qui relie ressource mana, card economy, et initiative — au-delà du simple « jouer on curve ».                            |
| priority                          | **P1**                                                                                                                                                                        |
| action                            | **ADD**                                                                                                                                                                       |

#### 8. `reid-duke-level-one-play-or-draw`

| Champ                             | Valeur                                                                                                                                                         |
| --------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| title / author / year / publisher | Play or Draw? · Reid Duke · 2015 · Wizards                                                                                                                     |
| url_primary                       | https://magic.wizards.com/en/news/feature/play-or-draw-2015-03-16                                                                                              |
| proposed_id                       | `reid-duke-level-one-play-or-draw`                                                                                                                             |
| category                          | mulligan · secondary: fundamentals                                                                                                                             |
| level                             | intermediate                                                                                                                                                   |
| medium                            | article                                                                                                                                                        |
| language                          | en                                                                                                                                                             |
| linkStatus                        | live                                                                                                                                                           |
| proposed_track                    | none (grid) — lié au toggle play/draw ManaTuner                                                                                                                |
| personas_served                   | Sarah, Karim, Natsuki                                                                                                                                          |
| why_missing                       | ManaTuner expose play/draw ; **0 lecture** associée dans la Library                                                                                            |
| why_canonical                     | Level One ; décisions tournoi quotidiennes                                                                                                                     |
| durability_score                  | 4                                                                                                                                                              |
| mana_tuner_fit                    | **5** (feature produit Analyzer)                                                                                                                               |
| redundancy_vs_existing            | None                                                                                                                                                           |
| access_friction                   | free                                                                                                                                                           |
| draft_curatorNote                 | « Ton Analyzer a un toggle Play/Draw pour une raison. Reid explique _quand_ le die roll change ta ligne — et pourquoi un mull to 4 bascule souvent le choix. » |
| draft_description                 | Play or draw : variables (durée de partie, curve, mulligans) et heuristiques pour ne plus flip a coin mentalement après le die roll.                           |
| priority                          | **P1**                                                                                                                                                         |
| action                            | **ADD**                                                                                                                                                        |

#### 9. `reid-duke-level-one-tempo` _(option backlog si on limite les Reid)_

| Champ       | Valeur                                                                                                                                 |
| ----------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| title       | Tempo · Reid Duke · 2015 · Wizards                                                                                                     |
| url_primary | https://magic.wizards.com/en/news/feature/tempo-2015-07-20 _(vérifier redirect live — syllabus full course ; si 404 utiliser archive)_ |
| proposed_id | `reid-duke-level-one-tempo`                                                                                                            |
| category    | fundamentals                                                                                                                           |
| level       | beginner                                                                                                                               |
| …           | **Annexe** si saturation Reid — préférer Chapin tempo advanced + Sequencing P0                                                         |
| priority    | P1/P2                                                                                                                                  |
| action      | ADD **conditionnel** (max Reid batch)                                                                                                  |

---

### P2 — Tracks minces

#### 10. `reid-duke-sideboarding-limited`

| Champ                             | Valeur                                                                                                                               |
| --------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| title / author / year / publisher | Sideboarding in Limited · Reid Duke · 2015 · Wizards                                                                                 |
| url_primary                       | https://magic.wizards.com/en/news/feature/sideboarding-limited-2015-01-12                                                            |
| proposed_id                       | `reid-duke-sideboarding-limited`                                                                                                     |
| category                          | sideboard · secondary: _(pas de cat limited — secondary N/A)_ → category sideboard, track limited                                    |
| level                             | beginner                                                                                                                             |
| medium                            | article                                                                                                                              |
| language                          | en                                                                                                                                   |
| linkStatus                        | live                                                                                                                                 |
| proposed_track                    | **limited**                                                                                                                          |
| personas_served                   | Léo, Sarah, Thibault (draft nights), Karim                                                                                           |
| why_missing                       | limited track sans sideboard ; sealed/draft post-board ignoré                                                                        |
| why_canonical                     | Level One Limited section                                                                                                            |
| durability_score                  | 4                                                                                                                                    |
| mana_tuner_fit                    | 2                                                                                                                                    |
| redundancy_vs_existing            | None                                                                                                                                 |
| access_friction                   | free                                                                                                                                 |
| draft_curatorNote                 | « En Limited le sideboard est un pool, pas un 15 construit. Reid évite le piège « j’ai un sideboard Constructed dans mon sealed ». » |
| draft_description                 | Sideboarding en Limited : comment utiliser le pool restant, quand choker un bomb adverse, et ce qui change sealed vs draft.          |
| priority                          | **P2**                                                                                                                               |
| action                            | **ADD**                                                                                                                              |

#### 11. `reid-duke-signals-booster-draft`

| Champ                             | Valeur                                                                                                      |
| --------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| title / author / year / publisher | Signals in Booster Draft · Reid Duke · 2015 · Wizards                                                       |
| url_primary                       | https://magic.wizards.com/en/news/feature/signals-booster-draft-2015-01-19                                  |
| proposed_id                       | `reid-duke-signals-booster-draft`                                                                           |
| category                          | fundamentals                                                                                                |
| level                             | beginner                                                                                                    |
| medium                            | article                                                                                                     |
| language                          | en                                                                                                          |
| linkStatus                        | live                                                                                                        |
| proposed_track                    | **limited**                                                                                                 |
| personas_served                   | Léo, Sarah                                                                                                  |
| why_missing                       | seul signals = LSV **archived fragile** ; besoin d’un live durable                                          |
| why_canonical                     | Level One ; même concept que LSV classic, URL officielle stable                                             |
| durability_score                  | 4                                                                                                           |
| mana_tuner_fit                    | 1                                                                                                           |
| redundancy_vs_existing            | Partial vs `lsv-draft-signals-classic` — **garder LSV** (voix + historique), Reid = filet live              |
| access_friction                   | free                                                                                                        |
| draft_curatorNote                 | « Si le Wayback de LSV te lâche, lis Reid. Même leçon (signaux, open colors, pivot), hébergement Wizards. » |
| draft_description                 | Lire les signaux en booster draft : ce que passent tes voisins, quand forcer une couleur, quand pivoter.    |
| priority                          | **P2**                                                                                                      |
| action                            | **ADD**                                                                                                     |

#### 12. `reid-duke-mulligans-part-ii-limited`

| Champ                             | Valeur                                                                                                                                 |
| --------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| title / author / year / publisher | Mulligans Part II: Limited · Reid Duke · 2015 · Wizards                                                                                |
| url_primary                       | https://magic.wizards.com/en/news/feature/mulligans-part-ii-limited-2015-06-15                                                         |
| proposed_id                       | `reid-duke-mulligans-part-ii-limited`                                                                                                  |
| category                          | mulligan                                                                                                                               |
| level                             | intermediate                                                                                                                           |
| medium                            | article                                                                                                                                |
| language                          | en                                                                                                                                     |
| linkStatus                        | live                                                                                                                                   |
| proposed_track                    | **limited**                                                                                                                            |
| personas_served                   | Sarah, Karim                                                                                                                           |
| why_missing                       | limited track sans mulligan theory ; 40-card math différente                                                                           |
| why_canonical                     | Level One                                                                                                                              |
| durability_score                  | 4                                                                                                                                      |
| mana_tuner_fit                    | 3                                                                                                                                      |
| redundancy_vs_existing            | Partial vs autres Reid mulligan                                                                                                        |
| access_friction                   | free                                                                                                                                   |
| draft_curatorNote                 | « 17 lands en sealed ce n’est pas 24 en Standard. Reid détaille les mains « keepable » en Limited quand la règle 2–5 ne suffit plus. » |
| draft_description                 | Mulligans en Limited : raffinements au-delà de 2–5 lands, mains splashy, et quand ship une main « almost ».                            |
| priority                          | **P2**                                                                                                                                 |
| action                            | **ADD**                                                                                                                                |

---

### P3 — Diversité linguistique & archive

#### FR (candidats — priorité basse, déjà 8 FR)

| Id proposé     | Note                                                                           | Action                                                      |
| -------------- | ------------------------------------------------------------------------------ | ----------------------------------------------------------- |
| —              | PCM + Moudou + Depraz + Boa déjà riches                                        | **Pas d’ADD FR forcé** ce batch ; qualité > quantité        |
| Community call | Articles FR écrits durables (pas podcast) type blogs pro FR manabase/sideboard | Chercher hors session si owner veut « FR article » vs audio |

#### JP (trou structurel — **aucun ADD URL-vérifié durable ce batch**)

| Candidat                    | Status                                                                       | Action                                                                          |
| --------------------------- | ---------------------------------------------------------------------------- | ------------------------------------------------------------------------------- |
| Hareruya JP strategy native | Contenu surtout lists/events ; pas de classique long-durée isolé vérifié ici | **P3 research follow-up** ; ne pas seed de listes meta JP                       |
| Saito original JP           | Série Library = EN archive CFB                                               | Si un original JP stable existe → ADD `language: jp` + track pro-tour rare pick |
| **Invariant tests**         | tracks ont déjà non-EN _ou_ archived — OK sans JP pour l’instant             | Flag gap éditorial, pas bloquant CI                                             |

#### Paywall (politique)

Aucun SCG Premium / CFB Premium **live paywall-flagged** ajouté ce batch. Recommandation : si un classic est paywall-only, l’ajouter avec `linkStatus: paywall` et note honnête — **pas de contournement**.

---

## 5. Top 10 backlog d’intégration

| #   | priority | id proposé                                 | track         | fit | effort | note 1 ligne                               |
| --- | -------- | ------------------------------------------ | ------------- | --- | ------ | ------------------------------------------ |
| 1   | P0       | `karsten-hypergeometric-intro`             | rcq           | 5   | 30m    | Archive vérifiée ; cœur math marque        |
| 2   | P0       | `reid-duke-level-one-mulligans`            | first-fnm     | 4   | 20m    | Remplace fonctionnellement 2 lost mulligan |
| 3   | P0       | `reid-duke-level-one-sideboard-plans`      | rcq           | 3   | 20m    | Double le corpus sideboard live            |
| 4   | P0       | `reid-duke-level-one-sequencing`           | first-fnm     | 4   | 20m    | Remplit le vide « Sequencing » de la cat   |
| 5   | P1       | `reid-duke-mulligans-part-iii-constructed` | rcq           | 4   | 20m    | Remplace track slot lost PVDDR mulligan    |
| 6   | P1       | `reid-duke-level-one-role-assignment`      | rcq _ou_ grid | 3   | 20m    | Pont Flores → practice                     |
| 7   | P1       | `reid-duke-level-one-play-or-draw`         | none          | 5   | 15m    | Alignement feature Analyzer                |
| 8   | P1       | `chapin-next-level-magic-tempo`            | none          | 4   | 25m    | Theory tempo live SCG                      |
| 9   | P2       | `reid-duke-sideboarding-limited`           | limited       | 2   | 20m    | Étoffe track 3→4+                          |
| 10  | P2       | `reid-duke-signals-booster-draft`          | limited       | 1   | 20m    | Live backup de LSV archived                |

**Hors top 10 mais retenus (max 12) :** #11 `reid-duke-mulligans-part-ii-limited` (limited) · #12 (option) `reid-duke-level-one-tempo` si non saturé Reid.

### Top 5 RECOVER / stabilisation lost

| #   | id                                          | Action                                                                      | Effort  |
| --- | ------------------------------------------- | --------------------------------------------------------------------------- | ------- |
| 1   | `pvddr-when-to-mulligan`                    | **RECOVER-URL** impossible → retirer du track rcq ; garder lost + community | 10m     |
| 2   | `pvddr-how-to-sideboard`                    | Still lost ; compenser par Sideboard Plans ADD                              | —       |
| 3   | `karsten-london-mulligan`                   | Still lost ; curatorNote déjà honnête ; pointer 2022                        | 5m note |
| 4   | `lsv-mulligans` / `lsv-looter-problem-lost` | Still lost ; call community GitHub                                          | —       |
| 5   | `pvddr-ten-commandments`                    | Still lost ; ne pas supprimer (canon cité)                                  | —       |

### Top 3 REJECT / dépriorisation du seed actuel _(ne pas supprimer sans owner)_

| id                                 | Raison                                                         | Suggestion                                                  |
| ---------------------------------- | -------------------------------------------------------------- | ----------------------------------------------------------- |
| `battle-chads-mtg-study-win-rates` | 2026, titre clickbait, durabilité faible, medium video hype    | **Demote** ou retirer au prochain prune ; pas « classique » |
| `boa-mtgo-getting-started`         | Utile FR mais angle UI/ladder proche hors-scope « pure skill » | Garder si FR diversity > purisme ; sinon grid only OK déjà  |
| _(pas de 3e hard reject)_          | Saito grid parts / Karsten 2018 = **volontaires**              | Ne pas toucher                                              |

### Rééquilibrage tracks (post-seed proposé)

| Track     | Avant | Après (si Top 10 ship) | Notes                                                                                  |
| --------- | ----- | ---------------------- | -------------------------------------------------------------------------------------- |
| first-fnm | 5     | 7                      | +mulligans +sequencing                                                                 |
| rcq       | 7     | 8–9                    | −track lost PVDDR mull ; +sideboard plans +mull constructed +hypergeom ; role optional |
| pro-tour  | 9     | 9                      | **pas d’add**                                                                          |
| commander | 5     | 5                      | stable                                                                                 |
| limited   | 3     | 5–6                    | +sideboard limited +signals +mull limited                                              |

**Nouvelle catégorie :** **non** (défaut). Limited reste track + catégories existantes.

### Quick wins (≤1h) vs Deep adds

**Quick wins**

1. Promouvoir `karsten-colored-sources-2022` → track **rcq** ou **first-fnm** (curatorNote 3 phrases).
2. Retirer `curatorTrack: rcq` de `pvddr-when-to-mulligan` tant que lost.
3. `secondaryCategories: ['manabase']` sur play-or-draw / hypergeom si add.
4. Vérifier/rafraîchir snapshot Wayback LSV signals (URL plus précise que `2020*`).

**Deep adds**

1. Batch Reid Level One (mulligan/sideboard/sequencing/limited) avec `seriesId: 'reid-level-one'` + curatorNotes.
2. Karsten hypergeom archived + note lien Analyzer.
3. Call community structuré pour 6 lost (template GitHub issue).

---

## 6. Recommandations éditoriales (pas code)

### Voix curator

- Continuer le ton **opinionné, utile, anti-jargon pour Léo** — les notes lost actuelles sont exemplaires (honnêteté link rot).
- Pour chaque ADD Reid : **différencier** de l’index `reid-duke-level-one-full-course` (« pourquoi ce chapitre seul mérite une carte »).
- Éviter d’ajouter 6 cartes Reid d’un coup sans curation : **batch 4–5 max**, reste backlog.

### Équilibre EN/FR/JP

- **EN** restera dominant (canon pro US/EU).
- **FR** déjà excellent via PCM — ne pas forcer articles FR médiocres.
- **JP = 0** : vrai gap prestige (Saito/Hareruya). Priorité recherche **1 classique JP natif** (pas une tier list) avant tout autre P3. Si introuvable, documenter « community bounty ».

### Politique paywall

- Autoriser `linkStatus: paywall` pour 1–2 classics SCG si URL live stable + description honnête.
- **Ne jamais** lier un scrape / PDF pirate.
- Préférer Wizards free + archives CFB quand le même concept existe.

### Politique video/podcast length

- Podcasts : garder shows **evergreen** (LR, Command Zone, PCM level-up), pas épisodes meta de la semaine.
- Videos : éviter titres clickbait 2026 ; préférer series pédagogiques (Moudou, Game Knights).
- Afficher `readingTimeMin` / durée pour Léo (déjà dans le type).

### Manabase = sacré

- Ne pas noyer Karsten sous 10 clones land-count YouTube.
- Hypergeom intro = **seul** add manabase math recommandé ce cycle.
- 2018 sources archive = historique OK ; 2022 = référence.

---

## 7. Hors-scope / idées refusées

| Idée                                                                         | Raison refus                                                                                                                        |
| ---------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| Tier lists Standard/Modern 2026                                              | Jetable ; hors positionnement long-durée                                                                                            |
| MTG Finance / sealed investment                                              | Hors scope explicite                                                                                                                |
| Spoilers set / best cards of EOE                                             | Jetable                                                                                                                             |
| Comprehensive Rules full                                                     | Trop dense ; pas skill competitive                                                                                                  |
| Arena UI tutorials génériques                                                | Déjà borderline avec Boa                                                                                                            |
| 10+ auteurs « absents » listés sans classique (Owen, Jensen, Nassif essays…) | **Ne pas lister pour lister** — aucun standalone durable URL-vérifié prioritaire trouvé ce session au-dessus de Reid/Karsten/Chapin |
| Content farm AI listicles                                                    | Qualité                                                                                                                             |
| Ajouter 15+ Reid Level One d’un coup                                         | Dilution + saturation tracks                                                                                                        |
| cEDH primers YouTube fluff                                                   | Qualité Commander track                                                                                                             |
| Hareruya event recaps                                                        | Meta jetable                                                                                                                        |

---

## 8. Annexes

### Sources consultées (URLs)

**Locales**

- `src/data/articlesReferenceSeed.ts`
- `public/library.json` (count 54, generated 2026-08-01T12:53:10.646Z)
- `src/types/referenceArticle.ts`
- `src/data/__tests__/articlesReferenceSeed.test.ts`
- `docs/session/PROMPT_LIBRARY_GAP_AUDIT.md`

**Externes / vérif HTTP 200**

- https://magic.wizards.com/en/news/feature/level-one-full-course-2015-10-05
- https://magic.wizards.com/en/news/feature/mulligans-2015-01-26
- https://magic.wizards.com/en/news/feature/sequencing-2015-02-16
- https://magic.wizards.com/en/news/feature/role-assignment-2015-01-05
- https://magic.wizards.com/en/news/feature/sideboard-plans-2015-03-09
- https://magic.wizards.com/en/news/feature/sideboarding-limited-2015-01-12
- https://magic.wizards.com/en/news/feature/mulligans-part-ii-limited-2015-06-15
- https://magic.wizards.com/en/news/feature/mulligans-part-iii-constructed-2015-06-29
- https://magic.wizards.com/en/news/feature/play-or-draw-2015-03-16
- https://magic.wizards.com/en/news/feature/basics-mana-2014-08-18
- https://web.archive.org/web/20201107233402/https://www.channelfireball.com/articles/an-introduction-to-the-hypergeometric-distribution-for-magic-players/
- https://articles.starcitygames.com/articles/next-level-magic-preview-tempo/
- https://www.17lands.com/ · https://lrcast.com/ · https://article.hareruyamtg.com/article/
- Wayback CDX API (queries lost CFB slugs → empty / 503 / false-positive Bant Company)

**Secondaires**

- Limited Resources #340 show notes (Looter URL morte)
- Reddit / orkerhulen PDF hypergeom (PDF 404 au fetch 2026-08-01)

### Articles considérés puis rejetés (titre + raison 1 ligne)

| Titre                                            | Raison                                                              |
| ------------------------------------------------ | ------------------------------------------------------------------- |
| How to Sideboard with Bant Company (CFB)         | Matchup-specific, pas framework                                     |
| London Mulligan Modern Impact (TCGPlayer)        | Meta snapshot format, pas theory durable                            |
| When Should You Mulligan in MTG (TCGPlayer 2023) | Correct mais redondant si Reid+Chapin ship                          |
| EDHREC random recent articles                    | Hub déjà présent                                                    |
| Hareruya English GP recaps                       | Event-bound                                                         |
| Next Level Magic full ebook                      | Paywall/book ; preview tempo suffit pour free tier                  |
| Creating a Fearless Magical Inventory (Stoddard) | Interesting mindset ; URL non stabilisée ce session → annexe future |
| Tolarian Community College sideboard YouTube     | Medium long + redondant Reid                                        |
| Wizards Basics of Mana (Level One)               | Excellent mais overlap Reid Building Mana Base déjà en track FNM    |

### Self-score

| Critère             | /5  | Commentaire                                                                 |
| ------------------- | --- | --------------------------------------------------------------------------- |
| Expertise MTG       | 4   | Priorisation canon pro ; n’a pas forcé auteurs « prestige name » sans pièce |
| Rigueur URLs        | 4   | HTTP 200 sur tous les ADD retenus ; LOST non inventés ; CDX parfois 503     |
| Fit ManaTuner       | 5   | P0 = hypergeom + mulligan/sequencing/play-draw + sideboard                  |
| Actionnabilité seed | 5   | Top 10 ids, tracks, notes, quick wins séparés                               |

**Self-score global : 18/20** — livrable actionnable ; gap JP assumé documenté sans fake URL.

---

## 9. Questions d’arbitrage pour le créateur

Voir section chat — 3 questions structurantes avant `go seed`.

---

_Fin du rapport — en attente de `go seed` pour implémentation seed._
