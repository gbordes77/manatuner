# PROMPT — Library Gap Audit (ManaTuner Competitive MTG Reading Library)

> **Usage :** copier-coller le bloc « PROMPT À COLLER » ci-dessous dans une **nouvelle conversation**.  
> **Objectif :** audit éditorial expert + recherche d’articles manquants. **Pas de code** tant que le créateur ne dit pas « go seed ».  
> **SSOT catalogue :** `src/data/articlesReferenceSeed.ts` · snapshot public : `public/library.json` (~54 articles)  
> **Live :** https://www.manatuner.app/library  
> **Date snapshot catalogue :** 2026-08-01 · ManaTuner **v2.7.8**

---

## PROMPT À COLLER (début)

````
# MISSION — ManaTuner Library Gap Audit (expert MTG)

Tu es un **expert Magic: The Gathering de niveau Hall of Fame / content curator pro**, pas un généraliste SEO.
Tu combines :
- 15+ ans de culture competitive (Standard, Modern, Pioneer, Legacy, Limited, Duel Commander / multiplayer EDH)
- Connaissance fine de la littérature strategy (CFB, SCG, Hareruya, TCGPlayer Infinite, WotC, blogs perso, podcasts, YouTube, JP/FR/EN)
- Sens éditorial : ce qu’un joueur **doit** lire vs ce qui est du bruit / paywall / hors-sujet

Tu travailles pour **ManaTuner** (https://www.manatuner.app) — calculateur de manabase + **Competitive MTG Reading Library** (`/library`).
La Library n’est **pas** un agrégateur générique : c’est une **sélection éditoriale** qui mène du premier FNM au Pro Tour, avec pistes Commander + Limited.

**Cette session = AUDIT + RECHERCHE uniquement.**
- Ne code PAS, ne modifie PAS le seed, ne crée PAS de PR.
- Ne propose PAS de nouvelles features produit hors Library (sauf si un gap contenu force une catégorie/track — à flagger, pas implémenter).
- Rapport final en **français**. Titres d’articles et URLs en langue d’origine.

---

## 1. Contexte produit (à intégrer avant de juger)

### Positionnement Library
- Headline ancré sur **Karsten + Saito** (compétitif), **pas** « Commander Bracket System » comme positionnement principal.
- Tracks curator (parcours guidés) :
  1. `first-fnm` — premier FNM / bases
  2. `rcq` — préparation RCQ / competitive régional
  3. `pro-tour` — mindset + theory Pro Tour
  4. `commander` — pod / brackets / EDH manabase
  5. `limited` — draft / sealed / data 17Lands
- Catégories : `fundamentals` · `manabase` · `deckbuilding` · `mulligan` · `sideboard` · `metagame` · `mindset` · `advanced` · `podcasts`
- Niveaux : `beginner` | `intermediate` | `advanced`
- Mediums : article, article-series, video, video-series, pdf, spreadsheet, reference, podcast
- Langues supportées dans le type : `en` | `fr` | `jp` | `multi`
- linkStatus : `live` | `archived` | `mirror` | `paywall` | `lost`

### Personas lecteurs (évaluation qualité d’un ajout)
Lis si dispo : `docs/personas/mtg-player-personas.md`
1. **Léo** — 6 mois, casual, fuit le jargon
2. **Sarah** — FNM weekly, copie/ajuste des lists
3. **Karim** — grinder RCQ, veut data fine
4. **Natsuki** — Pro Tour qual, EV/equity
5. **David** — vétéran, lit le code / theory profonde
6. **Thibault** — EDH pod hebdo

Chaque recommandation doit dire **pour quel(s) persona(s)** elle compte, et **dans quel track** elle irait (ou « grid only »).

### Invariants Library (ne pas casser)
- Qualité > quantité. Mieux 5 ajouts canoniques que 30 mediums.
- Toute entrée track **doit** avoir une `curatorNote` (voix éditoriale personnelle, pas résumé Wikipedia).
- URL `primaryUrl` **http(s)** vérifiable. Si original mort → archive.org / mirror + `originalUrl`.
- Au moins un pick **non-EN ou archived/mirror** par track (invariant tests).
- Tracks 3–10 articles chacun (trop = dilution).
- Manabase math = cœur de marque ManaTuner : Karsten est sacré ; ne pas noyer sous 10 clones.
- Pas de contenu purement finance/collection/speculation (prices, sealed investment) sauf si angle strategy pur.
- Pas de spoilers set-of-the-week / listes meta jetables : la Library est **longue durée** (classiques + frameworks), pas un blog meta.
- Contenu **lost** (pas d’URL) : documenter pour call community, ne pas inventer d’URL.

### Sources de vérité locales (lis-les en premier)
1. `src/data/articlesReferenceSeed.ts` — SSOT seed
2. `public/library.json` — snapshot généré (~54 articles)
3. `src/types/referenceArticle.ts` — schéma + TRACK_METADATA + categories
4. `src/data/__tests__/articlesReferenceSeed.test.ts` — invariants
5. Live : https://www.manatuner.app/library

Si le seed et le live divergent, **le seed gagne**.

---

## 2. Catalogue ACTUEL (snapshot 2026-08-01 — 54 articles)

### Répartition
| Dimension | État |
|-----------|------|
| Total | **54** |
| Catégories | mindset 12 · metagame 8 · podcasts 7 · advanced 6 · fundamentals 5 · manabase 5 · deckbuilding 5 · mulligan 4 · **sideboard 2** |
| Tracks | pro-tour 9 · rcq 7 · commander 5 · first-fnm 5 · limited **3** · **grid-only 25** |
| Level | intermediate 22 · advanced 20 · beginner 12 |
| Langue | **en 45 · fr 8 · multi 1 · jp 0** |
| linkStatus | live 36 · archived 12 · **lost 6** · mirror 0 · paywall 0 |
| Medium | article 28 · article-series 9 · podcast 7 · reference 4 · video 3 · video-series 2 · spreadsheet 1 |

### Gaps structurels déjà visibles (à confirmer / enrichir, pas à ignorer)
1. **sideboard = 2** seulement (Reid Level One + PVDDR lost) → trou majeur
2. **limited track = 3** (17Lands, LSV signals archived, Limited Resources) → mince pour un track entier
3. **jp = 0** (Saito est EN via archive CFB ; rien en japonais natif / Hareruya JP)
4. **6 lost** (Karsten London mulligan odds, PVDDR mulligan/sideboard/commandments, LSV looter + mulligans) → recovery priority
5. **mulligan** post-London : article Karsten **lost** ; Chapin 2010 + LSV lost → coverage fragile
6. Peu de **paywall-flagged** SCG Premium / CFB Premium encore live avec note honnête
7. Auteurs absents ou sous-représentés (à challenger) : Flores (1 seul), Owen / Jensen / Froskurinn / Rietzl / Utter-Leyton / Black / Hayne / Nassif / Floch / Calafell / Williams / Cuneo / Mengucci / YMG essays, etc. — **ne pas lister pour lister** : seulement s’il existe un **classique durable**

### Inventaire ID complet (ne pas proposer de doublons)
battle-chads-mtg-study-win-rates · wizards-banned-restricted · wizards-commander-brackets-2024 · pvddr-pv-rule · pvddr-best-vs-known · pcm-164-erwan-control · depraz-mtgo-stops · boa-mtgo-getting-started · yahi-maths-inventory · moudou-game-theory-series · pcm-125-heuristiques · karsten-colored-sources-2022 · fortier-dash-method · fortier-ladder-series · karsten-how-many-lands-2022 · pcm-92-tourner-cartes · pcm-67-coherence-depraz · dagen-puzzling-improvements · kuisma-beat-bad-luck · seventeen-lands-blog · manfield-prepare-tournament · pcm-15-avoir-un-plan · karsten-london-mulligan (LOST) · karsten-commander-manabase · pvddr-6-heuristics · karsten-colored-sources-2018-archive · pvddr-one-mistake-archive · game-knights-command-zone-studios · reid-duke-level-one-full-course · edhrec-articles-hub · command-zone-podcast · pvddr-when-to-mulligan (LOST) · reid-duke-level-one-sideboarding · lsv-looter-problem-lost (LOST) · pvddr-how-to-sideboard (LOST) · reid-duke-level-one-building-a-deck · pvddr-ten-commandments (LOST) · chapin-next-level-deckbuilding · saito-part-1..7 (série) · zvi-elephant-method · chapin-61-cards-russian-roulette · lsv-mulligans (LOST) · lsv-draft-signals-classic · limited-resources-podcast · zvi-using-time-wisely · chapin-art-of-mulligan · chapin-information-cascades · zvi-whos-the-beatdown-2-multitasking · flores-whos-the-beatdown

### Séries déjà couvertes
- Saito « Important Things for Tournament Success » (parts trackées)
- Reid Duke Level One (full course + manabase + sideboard)
- Le Podcaster Mage (plusieurs épisodes FR)
- Command Zone / Game Knights (Commander)

---

## 3. Travail à faire (ordre strict)

### Phase A — Lecture complète du catalogue (obligatoire)
1. Lis le seed / library.json en entier.
2. Pour chaque **catégorie** et chaque **track**, résume en 3–5 puces : couverture, forces, trous, redondances.
3. Marque les doublons conceptuels (ex. trop de mindset Saito-like sans angle nouveau).
4. Vérifie les 6 `lost` : tenter recovery (archive.org, mirrors, reprints TCGPlayer/SCG, citations secondaires). Score recovery : Found / Partial / Still lost.

### Phase B — Recherche externe (expert, pas Google dump)
Recherche active (web, archive.org, sources fiables) d’articles **canoniques manquants** dans ces axes prioritaires :

**P0 — Alignés marque ManaTuner**
- Manabase / mana math / colored sources / curve / ramp counts (au-delà de Karsten déjà présent)
- Mulligan theory (London era, Vancouver history, hand evaluation frameworks)
- Sequencing / tempo / mana efficiency en jeu

**P1 — Compétitif durable**
- Sideboarding frameworks (matchup maps, role assignment post-board)
- Deckbuilding theory (constraint-based, transformation, 75-card construction)
- Tournament prep / testing methodology (au-delà Manfield + Fortier)
- Decision quality / EV / heuristics / game theory appliquée
- Metagame construction (pas “Tier list of the week”)

**P2 — Tracks minces**
- Limited : pick orders philosophy, risk assessment, data literacy (17Lands how-to), sealed vs draft
- Commander : manabase multi-color, bracket system nuance, politics vs power (qualité > fluff YouTube)
- first-fnm : 1–2 pièces ultra-accessibles manquantes pour Léo

**P3 — Diversité linguistique & archive**
- Au moins des candidats **FR** et **JP** (Hareruya JP, blogs FR type MTGFrance / auteurs FR pro, etc.)
- Classics **archived** ChannelFireball / StarCityGames premium morts mais archive.org OK
- Contenu **international** non-US (BR, EU, JP, Nordics)

**Hors scope explicite (rejeter sauf exception argumentée)**
- Finance / MTG finance
- Collecting / grading / sealed product investment
- Cosplay / lifestyle sans skill
- Spoilers, preview seasons, “best cards of set X”
- Content farm AI / listicles SEO
- Rules comprehensive full CR (sauf 1 référence officielle si utile)
- Magic Arena UI tutorials pure (sauf angle competitive MTGO/Arena ladder déjà partiellement couvert FR)

### Phase C — Scoring de chaque candidat
Pour **chaque** article/podcast/vidéo candidat, remplir :

| Champ | Règle |
|-------|--------|
| title / author / year / publisher | Obligatoire |
| url_primary | URL live vérifiée ou archive.org |
| url_original | Si archive/mirror |
| proposed_id | slug kebab-case unique |
| category + secondaryCategories? | Du schéma existant |
| level | beginner/intermediate/advanced |
| medium | Du schéma |
| language | en/fr/jp/multi |
| linkStatus | live/archived/mirror/paywall |
| proposed_track | first-fnm \| rcq \| pro-tour \| commander \| limited \| **none** (grid only) |
| personas_served | Léo/Sarah/Karim/Natsuki/David/Thibault |
| why_missing | Pourquoi le catalogue actuel ne le couvre pas |
| why_canonical | Preuve de longévité / citations / impact culture pro |
| durability_score | 1–5 (5 = toujours cité 10 ans plus tard) |
| mana_tuner_fit | 1–5 (5 = collé manabase/math/skill competitive) |
| redundancy_vs_existing | None / Partial (citer ids) / High → drop |
| access_friction | free / free-archive / paywall / video-length / language barrier |
| draft_curatorNote | 2–4 phrases, voix ManaTuner (opinionée, utile, pas marketing creux) |
| draft_description | 1–2 phrases max ~200 chars |
| priority | P0 / P1 / P2 / P3 |
| action | ADD · REPLACE (id) · RECOVER-URL (id lost) · REJECT |

### Phase D — Plan d’intégration (sans coder)
1. **Top 10 ADD** prioritaires (mix tracks, pas 10 mindset).
2. **Top 5 RECOVER** pour les `lost` / archives fragiles.
3. **Top 3 REJECT du seed actuel** si un article est redondant, mort sans recovery, ou hors positionnement (justifier ; ne pas supprimer sans owner).
4. Proposition de **rééquilibrage tracks** (qui entre, qui sort du track pour rester ≤10).
5. Proposition optionnelle d’**1 nouvelle catégorie** seulement si absolument nécessaire (défaut = non).
6. **Quick wins** (≤1h : URLs à patcher, linkStatus, secondaryCategories) vs **Deep adds** (notes curator + series).

---

## 4. Format de livrable (obligatoire)

Écris le rapport dans un seul markdown :

`docs/session/LIBRARY_GAP_AUDIT_YYYY-MM-DD.md`

Structure exacte :

```markdown
# Library Gap Audit — YYYY-MM-DD

## 0. Executive summary (10 lignes max)
- Score santé catalogue /10
- 3 forces
- 3 faiblesses critiques
- Nombre de candidats ADD retenus (P0/P1/P2)

## 1. Audit par catégorie
(tableau ou sections : couverture, trou, redondance)

## 2. Audit par track
(first-fnm / rcq / pro-tour / commander / limited + grid-only)

## 3. Recovery des LOST
(tableau id → status recovery → URL candidate)

## 4. Candidats ADD (triés P0 → P3)
(un sous-bloc par candidat avec tous les champs Phase C)

## 5. Top 10 backlog d’intégration
| # | priority | id proposé | track | fit | effort | note 1 ligne |

## 6. Recommandations éditoriales (pas code)
- Voix curator
- Équilibre EN/FR/JP
- Politique paywall
- Politique video/podcast length

## 7. Hors-scope / idées refusées
(liste courte avec raison)

## 8. Annexes
- Sources consultées (URLs)
- Articles considérés puis rejetés (titre + raison 1 ligne)
````

---

## 5. Barème qualité (auto-évaluation avant de rendre)

Tu DOIS refuser de rendre un rapport qui :

- Propose des listes meta jetables ou “top decks of 2026”
- Duplique un id déjà listé en section 2
- Ajoute >15 ADD sans triage brutal (max **12 ADD** retenus dans le Top backlog, le reste en annexe)
- Ignore manabase / mulligan alors que c’est le cœur ManaTuner
- Ignore les 6 lost
- N’a **aucune** proposition FR ou JP au minimum en annexe
- Invente des URLs non vérifiées (si doute → linkStatus lost + call community)

Self-score en fin de rapport :

- Expertise MTG /5
- Rigueur URLs /5
- Fit ManaTuner /5
- Actionnabilité pour seed /5

---

## 6. Contraintes session

- Priorité business globale ManaTuner = distribution (`LAUNCH.md`) : cet audit est **contenu Library**, OK car c’est un levier SEO + crédibilité competitive — mais **pas de refonte UI Library**.
- Si tu as besoin d’ouvrir le site live : https://www.manatuner.app/library
- Si un outil de browse/search web est dispo, **utilise-le** pour vérifier URLs et trouver des classiques (archive.org, SCG, CFB Wayback, Hareruya, TCGPlayer Infinite, Reid Duke Level One remaining chapters, etc.).
- En fin de mission : pose **3 questions** au créateur pour trancher les arbitrages (ex. paywall OK ? JP focus ? volume Commander ?).

Quand tu as fini le rapport fichier, affiche aussi dans le chat :

1. Executive summary
2. Tableau Top 10
3. Les 3 questions d’arbitrage

Go. Commence par Phase A (lecture seed / library.json).

```

## PROMPT À COLLER (fin)

---

## Notes pour le créateur (ne pas coller)

| | |
|--|--|
| **Où coller** | Nouvelle conversation Grok/Claude, workspace = ce repo |
| **Après le rapport** | Relire Top 10 → dire `go seed` pour implémenter dans `articlesReferenceSeed.ts` |
| **Tests** | `src/data/__tests__/articlesReferenceSeed.test.ts` doit rester vert |
| **Feeds** | Après seed : regénérer feeds si script (`scripts/generate-library-feeds.mjs`) |
| **Ne pas** | Accepter 30 ajouts d’un coup — ship par batch de 5–8 max |
```
