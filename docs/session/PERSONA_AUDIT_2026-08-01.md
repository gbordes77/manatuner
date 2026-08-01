# Audit UX multi-personas — ManaTuner v2.7.7

> **Date :** 2026-08-01  
> **Site :** https://www.manatuner.app (prod live)  
> **Engine stamp vérifié :** `Engine v2.7.7`  
> **Méthode :** incarnation des 6 personas de `docs/personas/mtg-player-personas.md` + crawl Playwright prod (home, analyzer happy path, samples EDH/format=commander/aggro/limited, library, guide, mathematics, land-glossary, my-analyses, privacy, about, mobile iPhone 13)  
> **Contrainte :** audit only — **aucun code de fix**  
> **Prompt source :** `docs/session/PROMPT_PERSONA_AUDIT_NEXT.md`

### Contexte lu (confirmé)

| #   | Doc                                    | Statut   |
| --- | -------------------------------------- | -------- |
| 1   | `SESSION_START.md`                     | lu       |
| 2   | `docs/product/STATUS.md`               | lu       |
| 3   | `docs/session/HANDOFF_2026-08-01.md`   | lu       |
| 4   | `LAUNCH.md`                            | lu       |
| 5   | `docs/personas/mtg-player-personas.md` | lu (6/6) |

---

## 1. Léo — Le Curieux (débutant Arena, 6 mois)

### Première impression (30 s)

« Euh… “Rocks & Dorks” ? Ah OK ils expliquent : créatures mana et artifacts. Free, no signup, cool. C’est pas un site de decks top 8, c’est pour savoir si mon mana est pourri. Le bandeau Give Feedback en haut me distrait un peu. »

### Parcours de navigation

1. `/` — scrolle le hero, lit le sample Health Score 87 %
2. Clique **Try an example deck** ou **Paste a deck & analyze** → `/analyzer`
3. **Friction immédiate :** tour Joyride (« Step 1: Your Deck ») recouvre l’UI et **bloque les clics** sur Try Example tant qu’on n’a pas Skip/Close
4. Skip tour → Try Example → Health Score 80 % + jargon (Perfect drops / Realistic / Karsten)
5. Regarde Castability 30 s, décroche sur la densité des %
6. Peut ouvrir Library → track **Your First FNM** (Reid Duke, Karsten) — plus rassurant
7. Mobile : home lisible, menu hamburger présent, pas d’overflow horizontal observé

### Points positifs

- H1 + sous-texte qui **définissent** dorks/rocks (pas seulement du jargon pro)
- **Free. No signup.** + decklists on device — trust immédiat pour Léo
- Sample result sur la home (Health Score 87 %) = « à quoi ça ressemble » avant d’oser
- Health Score en anglais simple (« Good / Excellent ») + une phrase de verdict
- Library track First FNM clairement débutant
- Guide « 3 minutes » existe

### Points de friction

- **Joyride first-visit** = mur avant le premier succès (P0 pour Léo)
- Site 100 % EN (Léo FR possible) — pas bloquant Arena mais friction
- Après analyse : mur de pourcentages sans légende « c’est bien / c’est mauvais » par ligne assez visible
- « 3 colors short of Karsten target » sans savoir qui est Karsten
- Pas de decklists « prêt à jouer vendredi » — si son intent Google était ça, il part
- Bandeau Feedback + Learn dropdown = charge cognitive header

### Notes (1–5)

| Axe           | Note     | Commentaire                                       |
| ------------- | -------- | ------------------------------------------------- |
| Accessibilité | **4.0**  | Home claire ; dorks expliqués ; free visible      |
| Pertinence    | **3.5**  | Utile si mana screw ; pas « meilleur deck »       |
| Profondeur    | **3.5**  | Trop dense post-analyse pour lui                  |
| Utilisabilité | **3.5**  | Tour bloquant ; ensuite Try Example OK            |
| Confiance     | **4.0**  | Zero compte + privacy + open source               |
| Partage       | **3.5**  | DM Discord URL si ça l’a aidé, pas de post public |
| **Moyenne**   | **3.67** |                                                   |

### Verdict

Reviendrait **si un pote lui a collé le lien après un mana screw**, pas comme destination meta. Recommande en DM 1–2 potes Arena : « colle ta liste, regarde le gros % en haut ».

### Recommandations (Léo)

1. Ne jamais bloquer Try Example derrière Joyride (skip auto après 1 clic primaire, ou tour non-modal)
2. Légende permanente 1 ligne sous Castability : « Focus Realistic % — plus c’est haut, mieux c’est »
3. Tooltip « Karsten » en langage humain au premier hit
4. Sur mobile, CTA unique primary au-dessus du fold analyzer
5. Empty state My Analyses avec un seul bouton « Try Example » (pas Export/Import d’abord)

---

## 2. Sarah — La Régulière (FNM, Standard/Pioneer)

### Première impression (30 s)

« OK, calculateur manabase + library compétitive. Exactement le genre d’outil que je colle après un 2-2 FNM où j’ai flood. Free, local — nice. J’y vais coller mon 75. »

### Parcours de navigation

1. `/` → Analyzer (ou coller depuis Moxfield/MTGA)
2. Skip tour (une fois) → paste → Analyze
3. Lit **Health Score + QuickVerdict** en premier (réflexe FNM)
4. Castability : regarde les sorts critiques en rouge / bas %
5. Toggle **On the play / On the draw**
6. Mulligan tab (archétype Midrange auto) pour seuils keep
7. Share chip → clipboard URL pour Discord team
8. Library track **RCQ** si elle prépare un qualifier
9. My Analyses pour comparer 23 vs 24 lands
10. Privacy : lit « stays on device » — rassurée

### Points positifs

- Happy path **paste → Analyze → verdict** en < 30 s (hors tour)
- Formats listés (Standard…Commander…Limited)
- Sideboard auto-détecté (MTGA blank line)
- Health Score + recos actionnables
- Share URL + Blueprint PNG/PDF/JSON pour Discord
- Count rocks & dorks (Badgermole Cub sample) = différenciateur vs « land count only »
- Engine stamp pour crédibilité screenshot
- Library 54 articles, tracks par niveau

### Points de friction

- Joyride first visit (mineur pour elle, elle skip)
- Analysis tab : labels « Critical » sur des sorts splashes / late game (Craterhoof) peuvent alarmer sans contexte
- Pas de sideboard guide / matchup data (hors scope produit, mais elle le cherche)
- `?sample=limited` peut coller un état persisté Redux d’un run précédent (confusion en tests multi-sample)
- Export JSON My Analyses = backup, pas « joli report FNM »

### Notes (1–5)

| Axe           | Note     | Commentaire                           |
| ------------- | -------- | ------------------------------------- |
| Accessibilité | **4.5**  | Positioning immédiat                  |
| Pertinence    | **4.5**  | Manabase FNM = cœur de job            |
| Profondeur    | **4.5**  | Ramp + mulligan + tabs = sweet spot   |
| Utilisabilité | **4.5**  | Paste multi-format, share, save local |
| Confiance     | **4.5**  | Karsten + open source + privacy       |
| Partage       | **4.5**  | Screenshot Discord + URL Share        |
| **Moyenne**   | **4.50** |                                       |

### Verdict

**Oui, revient chaque semaine** avant FNM. Recommande au Discord boutique et r/spikes occasionnellement. Persona **idéale pour LAUNCH.md** (@fireshoes RT → Sarah).

### Recommandations (Sarah)

1. Après Analyze : 3 recos max au-dessus des tabs (déjà partiel dans QuickVerdict — garder court)
2. Preset chips « last 3 decks » dans My Analyses
3. Hint Blueprint « Export PNG for Discord » plus visible
4. Clarifier que « Critical » = hard to cast on curve, pas « cut this card »
5. Deeplink `?sample=aggro` pour demos créateurs (déjà là — documenter dans posts launch)

---

## 3. Karim — Le Tacticien (RCQ / Pioneer grinder)

### Première impression (30 s)

« Manabase analyzer client-side avec K=3 ramp et Bellman mulligan. GitHub public. Ça c’est sérieux. Pas de meta matrix — OK, autre job. Je vais coller mon Pioneer list et checker les flex slots mana. »

### Parcours de navigation

1. GitHub rapide (MIT, structure)
2. `/mathematics` — vérifie méthodo hypergeom / Karsten / Bellman
3. Analyzer + paste liste réelle
4. Castability : P1 Perfect drops vs Realistic, ramp delta
5. Mulligan : precision Quick/Standard/Precise, archetype lock
6. Manabase stats + Blueprint JSON
7. Share URL pour coller dans Discord testing team
8. Library track RCQ / Pro Tour pour lecture, pas data live

### Points positifs

- **Profondeur math rare** sur le segment manabase (K=3, Bellman, stamp version)
- P1 ≥ P2 cohérent (trust après vague A)
- Play/Draw explicite
- Export JSON + share URL = workflow multi-onglets
- Open source = condition non négociable pour recommander
- Format auto-detect + Advanced controls

### Points de friction

- Pas d’**export CSV tabulaire** des % par sort (il veut sheet)
- Pas d’API / rate limit doc (il scripterait)
- Library = canon lecture, pas data fraîche MTGO
- Tempo-Aware Analysis marqué BETA — bien honnête, il ignore
- Onboarding Joyride inutile pour lui (bruit)

### Notes (1–5)

| Axe           | Note     | Commentaire                              |
| ------------- | -------- | ---------------------------------------- |
| Accessibilité | **4.0**  | Clair pour son niveau                    |
| Pertinence    | **4.0**  | Manabase oui ; meta non (attendu)        |
| Profondeur    | **4.5**  | Au-dessus des concurrents manabase       |
| Utilisabilité | **4.0**  | Bon workflow, manque CSV                 |
| Confiance     | **4.5**  | Code + math pages + stamp                |
| Partage       | **4.0**  | Discord team + gist, pas screenshot seul |
| **Moyenne**   | **4.17** |                                          |

### Verdict

Intègre dans le **workflow prep RCQ** pour manabase. Mentionne dans Discord privé. RT X rare, seulement si insight deck 5-0 surprenant (aligné LAUNCH).

### Recommandations (Karim)

1. Export CSV « card, cmc, p_realistic, p_perfect, ramp_delta »
2. Permalink stable documenté (déjà `buildShareUrl` — surface dans About/Guide)
3. Doc méthodo one-pager « assumptions & known limits »
4. Désactiver Joyride si `?sample=` ou repeat visitor
5. Ne pas promettre meta data — rester laser manabase (crédibilité)

---

## 4. Natsuki — La Grinder (Pro Tour qual)

### Première impression (30 s)

« Client-side manabase toy. Pas d’API, pas de matchup matrix, pas de GIH WR. Utile une fois par mois pour un flex land count. Pas mon outil principal. »

### Parcours de navigation

1. Cherche `/api`, network tab, library.json feed
2. Trouve `public/library.json` / feeds — **signal positif** pour scripts lecture
3. Analyzer : vérifie engine stamp, hypergeom, seed MC si visible
4. Quitte rapidement vers 17Lands / sheets personnels
5. Mathematics page : « correct but not research-grade bulk »

### Points positifs

- Math manabase **réellement** plus profonde que la plupart des tools gratuits
- Open source + local = pas de black box serveur
- Mulligan Bellman = curiosité intellectuelle
- library.json / RSS = petite surface machine-readable
- Engine version stamp pour reproduire un débat

### Points de friction

- **Pas d’API** manabase batch / CI decklists
- Pas de sample size / CI sur les % (hypergeom exact ≠ intervalle)
- Pas de limited analytics type 17Lands
- Feature surface UI ≠ son workflow (onglets vs notebook)
- Blueprint JSON ≠ schéma versionné documenté pour pipeline

### Notes (1–5)

| Axe           | Note     | Commentaire                                |
| ------------- | -------- | ------------------------------------------ |
| Accessibilité | **3.5**  | Elle comprend, mais ce n’est pas « sa » UI |
| Pertinence    | **3.0**  | Niche manabase seulement                   |
| Profondeur    | **3.5**  | Profond sur 1 axe, shallow ailleurs        |
| Utilisabilité | **3.5**  | Lente vs script custom                     |
| Confiance     | **3.5**  | Open source OK ; pas d’API = plafond       |
| Partage       | **3.0**  | Rarement ; team sheet > lien produit       |
| **Moyenne**   | **3.33** |                                            |

### Verdict

**N’en fait pas son daily driver.** Peut citer une fois dans un post technique si un calcul ramp K=3 est unique. Ne bloque **pas** le launch — elle n’est pas le canal P1 de `LAUNCH.md`.

### Recommandations (Natsuki)

1. Documenter `library.json` + schéma share URL (low effort, high respect)
2. Changelog moteur public (version stamp déjà là — lier)
3. Export JSON schema versionné (Blueprint)
4. **Ne pas** builder une API meta pour elle tant que distribution n’a pas d’users
5. Angle marketing honnête : « manabase engine », pas « competitive data platform »

---

## 5. David — L’Architecte (théoricien / Pro Tour vet)

### Première impression (30 s)

« Enfin un outil qui dit hypergeometric + Karsten + Bellman sans clickbait. Je regarde le repo et `/mathematics`. Si les invariants tiennent, je peux le citer. »

### Parcours de navigation

1. GitHub + `docs` si présents / source hypergeom
2. `/mathematics` — lit la distinction 82 % single-draw vs 90 % Karsten-with-mull
3. Analyzer sample ramp (Nature’s Rhythm / Cub) — vérifie K=3
4. EDH sample — horizon T4–T8, scale N/60, command zone
5. Cherche dual-engine debt (il devinerait la limite ManaCostRow)
6. Privacy / About — zero backend decklist = bon signal

### Points positifs

- **Transparence méthodo** (Guide + Math + stamp) rare et précieuse
- P1≥P2, Fisher-Yates, clone-safe worker (si lu dans docs/code)
- EDH math adaptée (pas de faux « 60-card only »)
- Library canon (Saito, Chapin, Karsten…) alignée culture theory
- Open source MIT

### Points de friction

- Dette connue dual path Castability (inline vs accel) — il la flairerait
- Tempo BETA honest mais boundary floue pour citation académique
- Command zone : detection + exclusion library size, **pas** simulation full threat density multiplayer
- Pas de bulk historical dataset (hors scope)

### Notes (1–5)

| Axe           | Note     | Commentaire                          |
| ------------- | -------- | ------------------------------------ |
| Accessibilité | **4.0**  | Pour lui, immédiat                   |
| Pertinence    | **4.0**  | Manabase theory tool = match         |
| Profondeur    | **4.5**  | Excellent dans le domaine            |
| Utilisabilité | **4.0**  | UI correcte, code > UI pour lui      |
| Confiance     | **4.5**  | Open source + pages math             |
| Partage       | **4.0**  | Cite / RT technique si insight clean |
| **Moyenne**   | **4.17** |                                      |

### Verdict

**Cite et RT possible** si un post montre un résultat contre-intuitif reproductible (ex. ramp delta). Endorsement à haute valeur pour LAUNCH. Reviendrait pour valider des théories manabase.

### Recommandations (David)

1. Page « Model assumptions & known limitations » (1 scroll)
2. Afficher formules / N,K,n sur tooltip avancé
3. Unifier dual engines (dette math — hors launch si pas bug)
4. Garder honesty badges (BETA tempo)
5. Lien GitHub toujours visible (déjà OK)

---

## 6. Thibault — Le Capitaine de Table (EDH pod)

### Première impression (30 s)

« “Commander · Limited — all supported” sur la home. Track 👑 Commander Pod dans la Library. Je clique sample EDH. Banner : T4–T8, Karsten scaled, command zone. OK… on est plus en 2024 “60-card only”. »

### Parcours de navigation

1. `/` → voit Commander dans la liste formats
2. `/analyzer?sample=edh` ou `?format=commander`
3. Banner Commander mode + **Atraxa, Praetors' Voice** détectée
4. Health Score 87 % · Excellent EDH
5. Castability : commander pinné, horizon **T4–T8**, Sol Ring 98 %
6. Caveat « 4 colors short of Karsten » + reco duals
7. Blueprint export pour montrer au pod
8. Library Commander Pod (Karsten 100c, Brackets, Command Zone, Game Knights)
9. Guide section Commander / EDH — lit les limites honnêtes

### Points positifs

- **Preset EDH réel** (plus le placeholder 60c de v2.6)
- Horizon T4–T8 + Karsten N/60 + command zone detection
- Banner dismissible avec caveats (trust)
- Sample Atraxa 101 cards / 41 lands
- Library track Commander dédié
- Privacy (colle sa liste sans compte)
- Share + Blueprint pour Discord pod (4 personnes)

### Points de friction

- Message « Multi-color deck detected (**6 colors**) » sur Atraxa 4c — **faux positif trust**
- Pas de path budget « upgrade 50 € manabase » (fetch > shock order)
- Pas de model spécial Chromatic Lantern / Prismatic Omen au-delà du rock générique
- Mulligan EDH (partial Paris / free mull) vs London — stamp dit London
- Color identity validator soft, pas hard fail
- 101 cards sample (99+1+?) peut interroger les puristes

### Notes (1–5)

| Axe           | Note     | Commentaire                             |
| ------------- | -------- | --------------------------------------- |
| Accessibilité | **4.5**  | EDH visible dès la home + sample        |
| Pertinence    | **4.0**  | Gros saut vs 2.56 historique            |
| Profondeur    | **3.8**  | Solide ; plafond cEDH / budget / fixers |
| Utilisabilité | **4.0**  | sample=edh / format=commander OK        |
| Confiance     | **4.0**  | Banner honnête ; bug « 6 colors »       |
| Partage       | **4.0**  | Screenshot pod Discord ce soir          |
| **Moyenne**   | **4.05** |                                         |

### Verdict

**Veto levé.** Utilise pour itérer manabase 4c avant le mardi soir. Partage dans le Discord pod. r/EDH possible si insight clair. Plus le trou de marché qu’il était en v2.5.4.

### Recommandations (Thibault)

1. Fix comptage couleurs / reco « 6 colors » sur decks 4c (P0 trust EDH)
2. Label mulligan « London (constructed default) — EDH mulligan model simplified »
3. Toggle « commander always available » déjà partiel — clarifier en UI
4. Library CTA Commander → analyzer déjà utile ; garder
5. Budget upgrade path = nice-to-have **après** distribution (pas bloquant launch)

---

# Synthèse globale

## 1. Tableau des scores (v2.7.7 live — 2026-08-01)

| Persona        | Acc. | Pert. | Prof. | Util. | Conf. | Partage | **Moy /5** |
| -------------- | ---- | ----- | ----- | ----- | ----- | ------- | ---------- |
| **Léo**        | 4.0  | 3.5   | 3.5   | 3.5   | 4.0   | 3.5     | **3.67**   |
| **Sarah**      | 4.5  | 4.5   | 4.5   | 4.5   | 4.5   | 4.5     | **4.50**   |
| **Karim**      | 4.0  | 4.0   | 4.5   | 4.0   | 4.5   | 4.0     | **4.17**   |
| **Natsuki**    | 3.5  | 3.0   | 3.5   | 3.5   | 3.5   | 3.0     | **3.33**   |
| **David**      | 4.0  | 4.0   | 4.5   | 4.0   | 4.5   | 4.0     | **4.17**   |
| **Thibault**   | 4.5  | 4.0   | 3.8   | 4.0   | 4.0   | 4.0     | **4.05**   |
| **Moyenne 6p** |      |       |       |       |       |         | **4.00**   |

## 2. Comparaison vs audits antérieurs

| Snapshot                           | Léo      | Sarah    | Karim    | Natsuki  | David    | Thibault  | **Moy 6p** |
| ---------------------------------- | -------- | -------- | -------- | -------- | -------- | --------- | ---------- |
| Whole-site v2.5.4 (2026-04-18)     | 3.84     | 4.71     | 4.05     | 2.85     | 3.75     | 2.56      | **3.63**   |
| Library-only v2.6.0 (2026-04-18)   | 3.90     | 4.50     | 3.94     | 3.45     | 3.79     | 3.89      | **3.91**   |
| **Whole-site v2.7.7 (2026-08-01)** | **3.67** | **4.50** | **4.17** | **3.33** | **4.17** | **4.05**  | **4.00**   |
| Δ vs v2.5.4 whole-site             | −0.17    | −0.21    | +0.12    | +0.48    | +0.42    | **+1.49** | **+0.37**  |

**Lecture honnête :**

- **Thibault** : plus grand gagnant (EDH T4–T8, command zone, sample Atraxa, track Library) — veto marché levé.
- **Karim / David / Natsuki** : progressent via trust math, stamp, exports, EDH rigor.
- **Sarah** : reste la championne absolue ; léger −0.21 vs pic 4.71 (étalon plus exigeant post-vagues + Joyride first-run).
- **Léo** : légèrement sous v2.5.4 — home meilleure, mais **Joyride bloquant + densité post-analyse** pèsent ; First FNM library compense partiellement.
- **Moyenne 6p 4.00** = produit **au-dessus du seuil “shippable distribution”** sur l’UX.

## 3. Top 5 frictions transverses (impact × # personas)

| #   | Friction                                                                      | Personas                             | Priorité         |
| --- | ----------------------------------------------------------------------------- | ------------------------------------ | ---------------- |
| 1   | **Joyride first-visit bloque** Try Example / Analyze (overlay pointer-events) | Léo, Sarah, mobile, tout first-timer | **P0 UX**        |
| 2   | **Densité Castability** sans légende « focus Realistic » assez saillante      | Léo, Sarah (1er run)                 | P1               |
| 3   | **Faux positif couleurs** (« 6 colors » sur Atraxa 4c)                        | Thibault, confiance recos            | **P0 trust EDH** |
| 4   | **Export data fin** (CSV / schéma JSON versionné) absent                      | Karim, Natsuki, David                | P2 (post-users)  |
| 5   | **Bandeau Feedback** permanent + Learn dropdown = bruit header                | Léo, mobile                          | P2               |

Autres notes : site EN-only (pas rouvrir i18n FR sans owner) ; Share = clipboard silencieux si toast manqué ; Redux persist peut coller un deck EDH sur `?sample=limited`.

## 4. Top 5 wins à ne pas casser

1. **Health Score + QuickVerdict** en anglais clair (Léo/Sarah)
2. **Free · no signup · decklists locales** (privacy trust toutes personas)
3. **Rocks & dorks K=3** + labels Perfect drops / Realistic (diff concurrentielle)
4. **EDH first-class** : banner, T4–T8, Karsten N/60, command zone, sample Atraxa
5. **Engine stamp v2.7.7** + open source + Library 5 tracks (canon compétitif)

Honorable : Share URL, Blueprint export, Guide/Math, Feedback header+footer (Tally sans decklist).

## 5. Backlog priorisé (lié à `LAUNCH.md`)

### P0 — avant / pendant distribution (utilisateurs)

| ID       | Item                                                              | Pourquoi                             | Personas                |
| -------- | ----------------------------------------------------------------- | ------------------------------------ | ----------------------- |
| P0-UX-1  | Joyride non-bloquant (ou auto-skip sur CTA primaire / `?sample=`) | First success rate                   | Léo, Sarah, mobile      |
| P0-EDH-1 | Corriger détection « N colors » / reco multi-color absurde        | Trust screenshot EDH                 | Thibault, Sarah partage |
| P0-DIST  | **Exécuter LAUNCH.md** (post @fireshoes + Discord)                | Pas d’users = pas d’UX feedback réel | Business                |

### P1 — polish post-premiers users (si signal)

| ID   | Item                                                     | Personas        |
| ---- | -------------------------------------------------------- | --------------- |
| P1-1 | Légende permanente Perfect vs Realistic sous Castability | Léo, Sarah      |
| P1-2 | Toast Share plus visible + hint « paste in Discord »     | Sarah, Thibault |
| P1-3 | Clarifier labels Critical ≠ cut card                     | Sarah, Karim    |
| P1-4 | Empty My Analyses orienté « Try Example »                | Léo             |

### P2 — hors chemin critique launch

| ID   | Item                              | Personas           |
| ---- | --------------------------------- | ------------------ |
| P2-1 | Export CSV castability            | Karim              |
| P2-2 | Doc schéma JSON / library.json    | Natsuki, David     |
| P2-3 | Budget upgrade path EDH           | Thibault           |
| P2-4 | Dual-engine ManaCostRow unify     | David (dette math) |
| P2-5 | Mulligan model label EDH-specific | Thibault           |

**Ne pas rouvrir sans owner :** Moxfield URL import, i18n FR, backend, Sentry DSN, analytics decklist.

## 6. Verdict créateur

**ManaTuner v2.7.7 est shippable pour la distribution.** La moyenne 6 personas à **4.00/5** et surtout le rattrapage **Thibault 2.56 → 4.05** montrent que le produit n’est plus « Constructed-only avec trou EDH ». Sarah (4.50) et Karim/David (~4.17) valident le cœur compétitif manabase. Natsuki reste bas **par design de scope** (pas un data platform) — ce n’est pas un bloquant de launch. Les seuls vrais clous UX avant d’envoyer du trafic sont : **(1)** ne pas piéger le premier clic derrière Joyride, **(2)** ne pas poster un screenshot EDH qui dit « 6 colors » sur Atraxa. Ensuite, le goulot n’est plus l’UX — c’est **`LAUNCH.md`** : un post analytique vers @fireshoes et des réponses naturelles dans les Discord, pas une nouvelle feature gratuite.

---

### Preuves live (smoke 2026-08-01)

| Check                               | Résultat                                         |
| ----------------------------------- | ------------------------------------------------ |
| Prod HTTP                           | 200                                              |
| Engine stamp                        | `Engine v2.7.7`                                  |
| Try Example (après skip tour)       | Health ~80 %, 5 tabs, ramp K=3 visible           |
| `?sample=edh` / `?format=commander` | Banner Commander, T4–T8, Atraxa, Health 87 % EDH |
| Share chip                          | présent (clipboard)                              |
| Blueprint                           | PNG/PDF/JSON surface                             |
| Library                             | 54 articles, 5 tracks incl. Commander + Limited  |
| Privacy                             | « never leave your device » / no tracking claims |
| Mobile iPhone 13                    | home OK, scrollWidth=clientWidth                 |

---

_Fin du rapport. Aucun code modifié. Attendre « go fix » pour toute implémentation._
