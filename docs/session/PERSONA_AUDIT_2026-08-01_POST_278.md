# Audit UX multi-personas — ManaTuner v2.7.8 (re-audit post fixes)

> **Date :** 2026-08-01  
> **Site :** https://www.manatuner.app (prod live)  
> **Engine stamp vérifié :** `Engine v2.7.8`  
> **Baseline :** [`PERSONA_AUDIT_2026-08-01.md`](./PERSONA_AUDIT_2026-08-01.md) (v2.7.7, moy **4.00**) — **non écrasée**  
> **Méthode :** incarnation des 6 personas de `docs/personas/mtg-player-personas.md` + crawl Playwright prod (home, analyzer, `?sample=edh|aggro|limited|midrange`, library, guide, mathematics, land-glossary, my-analyses, privacy, about, mobile iPhone 13)  
> **Contrainte :** audit only — **aucun code de fix**  
> **Prompt source :** `docs/session/PROMPT_PERSONA_AUDIT_NEXT.md` · phrase A `HANDOFF_NEXT.md`

### Contexte lu (confirmé)

| #   | Doc                                    | Statut   |
| --- | -------------------------------------- | -------- |
| 1   | `SESSION_START.md`                     | lu       |
| 2   | `docs/product/STATUS.md`               | lu       |
| 3   | `docs/session/HANDOFF_2026-08-01.md`   | lu       |
| 4   | `LAUNCH.md`                            | lu       |
| 5   | `docs/personas/mtg-player-personas.md` | lu (6/6) |

### Vérification des 4 fixes shippés en 2.7.8 (smoke prod)

| Fix | ID                             | Attendu                              | Preuve live                                                                                                                                           | Statut     |
| --- | ------------------------------ | ------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------- | ---------- |
| 1   | P0-UX-1 Joyride non-bloquant   | Clic Try Example / Analyze sans Skip | Overlay présent mais `pointer-events: none` ; `elementFromPoint` = bouton **Try Example** ; clic OK sans Skip                                         | **RÉSOLU** |
| 2   | P0-EDH-1 Atraxa 4 colors       | Plus de « 6 colors »                 | `?sample=edh` → « Multi-color deck detected **(4 colors)** » · Health 87 % · Atraxa · **pas** de « 6 colors »                                         | **RÉSOLU** |
| 3   | P1-1 Légende Perfect/Realistic | Caption + tip visibles               | Castability : « Perfect drops = right colors if lands on curve · Realistic = what to optimize… » + tip « optimize **Realistic** first » + % par ligne | **RÉSOLU** |
| 4   | P1-2 Share toast Discord       | Toast explicite                      | Snackbar : **« Share link copied — paste in Discord »** · clipboard = URL `manatuner.app/analyzer?d=…`                                                | **RÉSOLU** |

**Stamp :** `Engine v2.7.8 · Karsten tables · hypergeom + ramp K=3 · London mulligan / Bellman`

---

## 1. Léo — Le Curieux (débutant Arena, 6 mois)

### Première impression (30 s)

« Euh… “Rocks & Dorks” ? Ah OK ils expliquent : créatures mana et artifacts. Free, no signup, cool. C’est pas un site de decks top 8, c’est pour savoir si mon mana est pourri. Le bandeau Give Feedback en haut me distrait encore un peu. »

### Parcours de navigation

1. `/` — scrolle le hero, lit le sample Health Score 87 %
2. Clique **Try an example deck** ou va sur `/analyzer`
3. **Tour Joyride toujours visible** (Step 1), mais **ne bloque plus** Try Example — clic direct OK (overlay `pointer-events: none`)
4. Try Example / sample → Health Score + tabs ; légende **Perfect drops / Realistic** lisible en tête de Castability
5. Regarde Castability ~30 s — la légende aide un peu ; le mur de % reste dense
6. Library → track **Your First FNM** (Reid Duke, Karsten) — rassurant
7. My Analyses empty : chips sample (Constructed / Aggro / Commander) + « Analyze a Deck » — mieux qu’un mur Export/Import
8. Mobile : home lisible, hamburger, pas d’overflow horizontal ; overlay Joyride non-bloquant

### Points positifs

- H1 + sous-texte qui **définissent** dorks/rocks
- **Free. No signup.** + decklists on device
- Sample result home (Health 87 %)
- **Joyride non-bloquant** = first success sans ritual Skip (P0 v2.7.7 réglé)
- **Légende Perfect/Realistic** + tip « optimize Realistic first »
- Library First FNM + Guide « 3 minutes »
- Empty My Analyses orienté samples (pas seulement backup JSON)

### Points de friction

- Tour Joyride encore **visuellement** présent (tooltip) — moins grave qu’un mur de clics, mais bruit first-visit
- Site 100 % EN
- Densité Castability encore haute pour un débutant (légende aide, ne simplifie pas les lignes)
- « N colors short of Karsten » sans savoir qui est Karsten
- Pas de decklists « prêt à jouer vendredi »
- Bandeau Feedback permanent = charge header

### Notes (1–5)

| Axe           | Note     | Commentaire                                            |
| ------------- | -------- | ------------------------------------------------------ |
| Accessibilité | **4.1**  | Home claire ; first success sans bloquer le CTA        |
| Pertinence    | **3.5**  | Utile si mana screw ; pas « meilleur deck »            |
| Profondeur    | **3.8**  | Légende aide à lire les % ; densité encore haute       |
| Utilisabilité | **4.1**  | Joyride non-bloquant + samples My Analyses             |
| Confiance     | **4.0**  | Zero compte + privacy + open source                    |
| Partage       | **3.5**  | DM Discord URL si ça l’a aidé ; toast utile s’il Share |
| **Moyenne**   | **3.83** |                                                        |

### Verdict

Reviendrait **si un pote lui colle le lien après un mana screw**. Recommande en DM 1–2 potes Arena. **Δ vs baseline :** first-run moins humiliant.

### Recommandations (Léo)

1. Auto-dismiss Joyride plus tôt (après 1er CTA ou timeout court) — overlay déjà non-bloquant
2. Tooltip « Karsten » en langage humain au premier hit
3. Sur mobile, un seul CTA primary au-dessus du fold analyzer
4. Garder empty My Analyses sample-first (déjà bien)
5. Ne pas rouvrir i18n FR sans owner

---

## 2. Sarah — La Régulière (FNM, Standard/Pioneer)

### Première impression (30 s)

« OK, calculateur manabase + library compétitive. Exactement le genre d’outil que je colle après un 2-2 FNM où j’ai flood. Free, local — nice. J’y vais coller mon 75. »

### Parcours de navigation

1. `/` → Analyzer (paste Moxfield/MTGA)
2. Skip tour optionnel (ou ignore — CTA marche) → paste → Analyze
3. **Health Score + QuickVerdict** en premier
4. Castability : légende Perfect/Realistic + sorts bas %
5. Toggle **On the play / On the draw**
6. Mulligan tab (archétype auto)
7. **Share** → toast **« Share link copied — paste in Discord »** → collé dans le Discord team
8. Library track **RCQ** si qualifier
9. My Analyses pour comparer 23 vs 24 lands
10. Privacy : « stays on device » — rassurée

### Points positifs

- Happy path paste → Analyze → verdict en < 30 s
- Formats listés (Standard…Commander…Limited)
- Sideboard auto-détecté
- Health Score + recos actionnables
- **Share toast Discord** = friction virale réduite (P1 v2.7.7)
- Count rocks & dorks = différenciateur
- Engine stamp v2.7.8 pour crédibilité screenshot
- Library 54 articles, tracks par niveau
- Légende Castability = moins de « c’est quoi Perfect vs Realistic ? » en vocal Discord

### Points de friction

- Analysis tab : labels « Critical » sur splashes / late game peuvent encore alarmer (P1-3 non shippé)
- Pas de sideboard guide / matchup (hors scope)
- `?sample=` vs Redux persist : naviguer après un EDH peut laisser l’état résultats (friction multi-sample / tests)
- Export JSON My Analyses = backup, pas report FNM joli

### Notes (1–5)

| Axe           | Note     | Commentaire                               |
| ------------- | -------- | ----------------------------------------- |
| Accessibilité | **4.5**  | Positioning immédiat                      |
| Pertinence    | **4.5**  | Manabase FNM = cœur de job                |
| Profondeur    | **4.5**  | Ramp + mulligan + tabs = sweet spot       |
| Utilisabilité | **4.6**  | Joyride non-bloquant ; paste multi-format |
| Confiance     | **4.5**  | Karsten + open source + privacy + stamp   |
| Partage       | **4.7**  | Toast Discord explicite + URL + Blueprint |
| **Moyenne**   | **4.55** |                                           |

### Verdict

**Oui, revient chaque semaine** avant FNM. Recommande Discord boutique + r/spikes. Persona **idéale pour LAUNCH.md**.

### Recommandations (Sarah)

1. Clarifier « Critical » ≠ cut card (P1-3)
2. Hint Blueprint « Export PNG for Discord » plus visible
3. Preset chips « last 3 decks » dans My Analyses
4. Documenter deeplinks `?sample=` pour posts créateurs
5. Ne pas ajouter de feature gratuite — **poster** (LAUNCH)

---

## 3. Karim — Le Tacticien (RCQ / Pioneer grinder)

### Première impression (30 s)

« Manabase analyzer client-side avec K=3 ramp et Bellman mulligan. GitHub public. Ça c’est sérieux. Pas de meta matrix — OK, autre job. Je vais coller mon Pioneer list et checker les flex slots mana. »

### Parcours de navigation

1. GitHub rapide (MIT)
2. `/mathematics` — hypergeom / Karsten / Bellman
3. Analyzer + paste liste réelle
4. Castability : Perfect drops vs Realistic, ramp delta ; légende OK
5. Mulligan : precision Quick/Standard/Precise
6. Manabase + Blueprint JSON
7. Share URL (toast Discord) pour testing team
8. Library track RCQ / Pro Tour

### Points positifs

- Profondeur math rare (K=3, Bellman, stamp **v2.7.8**)
- P1 ≥ P2 cohérent
- Play/Draw explicite
- Export JSON + share URL
- Open source non négociable pour recommander
- Joyride moins gênant (non-bloquant / deep link skip)

### Points de friction

- Pas d’**export CSV** des % par sort
- Pas d’API batch
- Library = lecture, pas data fraîche MTGO
- Tempo BETA — honnête, il ignore
- Wording « N colors short of Karsten » encore un peu opaque pour un screenshot

### Notes (1–5)

| Axe           | Note     | Commentaire                          |
| ------------- | -------- | ------------------------------------ |
| Accessibilité | **4.0**  | Clair pour son niveau                |
| Pertinence    | **4.0**  | Manabase oui ; meta non (attendu)    |
| Profondeur    | **4.5**  | Au-dessus des concurrents manabase   |
| Utilisabilité | **4.1**  | Bon workflow ; CSV toujours manquant |
| Confiance     | **4.5**  | Code + math + stamp                  |
| Partage       | **4.1**  | Discord team + gist ; toast aide     |
| **Moyenne**   | **4.20** |                                      |

### Verdict

Intègre dans le **workflow prep RCQ**. Mention Discord privé. RT X rare (aligné LAUNCH).

### Recommandations (Karim)

1. Export CSV castability (P2 post-users)
2. Permalink / assumptions one-pager
3. Ne pas promettre meta data
4. Doc limites connues (dual-engine, Tempo BETA)

---

## 4. Natsuki — La Grinder (Pro Tour qual)

### Première impression (30 s)

« Client-side manabase toy. Pas d’API, pas de matchup matrix, pas de GIH WR. Utile une fois par mois pour un flex land count. Pas mon outil principal. »

### Parcours de navigation

1. Cherche `/api`, network tab, `library.json`
2. Analyzer : engine stamp v2.7.8, hypergeom
3. Quitte vers 17Lands / sheets
4. Mathematics : « correct but not research-grade bulk »

### Points positifs

- Math manabase plus profonde que la plupart des tools gratuits
- Open source + local
- Mulligan Bellman = curiosité
- library.json / RSS = surface machine-readable
- Engine version stamp pour reproduire un débat

### Points de friction

- **Pas d’API** manabase batch / CI
- Pas de CI/sample size sur les %
- Pas de limited analytics type 17Lands
- UI ≠ notebook workflow
- Blueprint JSON ≠ schéma versionné public

### Notes (1–5)

| Axe           | Note     | Commentaire                            |
| ------------- | -------- | -------------------------------------- |
| Accessibilité | **3.5**  | Elle comprend ; ce n’est pas « sa » UI |
| Pertinence    | **3.0**  | Niche manabase seulement               |
| Profondeur    | **3.5**  | Profond sur 1 axe                      |
| Utilisabilité | **3.5**  | Lente vs script custom                 |
| Confiance     | **3.5**  | Open source OK ; pas d’API = plafond   |
| Partage       | **3.0**  | Rarement ; team sheet > lien produit   |
| **Moyenne**   | **3.33** | **inchangé** (scope design)            |

### Verdict

**N’en fait pas son daily driver.** Ne bloque **pas** le launch — pas le canal P1 de `LAUNCH.md`. Les fixes 2.7.8 ne changent pas son job-to-be-done.

### Recommandations (Natsuki)

1. Doc `library.json` + schéma share URL (low effort)
2. Changelog moteur public
3. **Ne pas** builder API meta tant que pas d’users
4. Marketing honnête : « manabase engine », pas « competitive data platform »

---

## 5. David — L’Architecte (théoricien / Pro Tour vet)

### Première impression (30 s)

« Enfin un outil qui dit hypergeometric + Karsten + Bellman sans clickbait. Je regarde le repo et `/mathematics`. Si les invariants tiennent, je peux le citer. Stamp Engine v2.7.8 — bon. »

### Parcours de navigation

1. GitHub + source hypergeom
2. `/mathematics` — 82 % vs 90 % Karsten-with-mull
3. Analyzer sample ramp — K=3
4. EDH sample — T4–T8, N/60, command zone, **4 colors** (plus le faux 6c — trust)
5. Privacy / About — zero backend decklist

### Points positifs

- Transparence méthodo rare
- P1≥P2, Fisher-Yates, clone-safe worker (docs/code)
- EDH math adaptée
- Library canon (Saito, Chapin, Karsten…)
- Open source MIT
- Fix multi-color WUBRG-only = signal de rigueur

### Points de friction

- Dette dual path Castability (inline vs accel)
- Tempo BETA boundary pour citation académique
- Command zone ≠ full multiplayer threat model
- Pas de bulk historical dataset (hors scope)

### Notes (1–5)

| Axe           | Note     | Commentaire                             |
| ------------- | -------- | --------------------------------------- |
| Accessibilité | **4.0**  | Pour lui, immédiat                      |
| Pertinence    | **4.0**  | Manabase theory tool = match            |
| Profondeur    | **4.5**  | Excellent dans le domaine               |
| Utilisabilité | **4.0**  | UI correcte ; code > UI pour lui        |
| Confiance     | **4.5**  | Open source + pages math + fix couleurs |
| Partage       | **4.1**  | Cite / RT technique si insight          |
| **Moyenne**   | **4.18** |                                         |

### Verdict

**Cite et RT possible** si post contre-intuitif reproductible. Endorsement haute valeur LAUNCH.

### Recommandations (David)

1. Page « Model assumptions & known limitations »
2. Unifier dual engines (dette math — hors launch si pas bug)
3. Garder honesty badges (BETA tempo)
4. Lien GitHub toujours visible

---

## 6. Thibault — Le Capitaine de Table (EDH pod)

### Première impression (30 s)

« “Commander · Limited — all supported” sur la home. Track 👑 Commander Pod. Je clique sample EDH. Banner T4–T8, Karsten scaled, command zone. Atraxa. Health 87 %. Et là — **4 colors**, plus le ridicule “6 colors”. OK, je peux screenshot pour le Discord pod. »

### Parcours de navigation

1. `/` → Commander dans les formats
2. `/analyzer?sample=edh` ou `?format=commander`
3. Banner Commander + **Atraxa, Praetors' Voice**
4. Health Score 87 % · Excellent EDH
5. Reco : « Multi-color deck detected **(4 colors)** » + duals / Starting Town
6. Castability : commander pinné, horizon **T4–T8**, Sol Ring haut %
7. Share → toast Discord → collé dans le channel pod
8. Library Commander Pod
9. Guide section Commander — limites honnêtes

### Points positifs

- Preset EDH réel (100c, T4–T8, command zone)
- **Fix trust couleurs** : 4c Atraxa correct (P0 EDH v2.7.7)
- Banner dismissible + caveats
- Sample Atraxa 101 cards / 41 lands
- Library track Commander
- Privacy + Share Discord toast
- Engine stamp v2.7.8 sur screenshot

### Points de friction

- Wording « **4 colors short of Karsten target** » encore ambigu (short _of sources for_ 4 colors, pas « tu as 4 couleurs de trop/trop peu » au sens casual) — mineur vs l’ancien « 6 colors »
- Pas de path budget « upgrade 50 € manabase »
- Mulligan stamp London (constructed) vs EDH free/partial Paris
- Color identity soft, pas hard fail
- 101 cards sample peut interroger les puristes
- Chromatic Lantern etc. en rocks génériques

### Notes (1–5)

| Axe           | Note     | Commentaire                             |
| ------------- | -------- | --------------------------------------- |
| Accessibilité | **4.5**  | EDH visible home + sample               |
| Pertinence    | **4.1**  | Gros saut historique confirmé           |
| Profondeur    | **3.8**  | Solide ; plafond cEDH / budget / fixers |
| Utilisabilité | **4.1**  | sample=edh / format=commander OK        |
| Confiance     | **4.5**  | **4 colors** correct ; banner honnête   |
| Partage       | **4.3**  | Toast Discord + screenshot pod ce soir  |
| **Moyenne**   | **4.22** |                                         |

### Verdict

**Veto levé (confirmé).** Utilise avant le mardi soir. Partage Discord pod. Screenshot EDH **trustworthy** pour LAUNCH community.

### Recommandations (Thibault)

1. Affiner copy « N colors short of Karsten » → « short of Karsten sources on N colors »
2. Label mulligan EDH-specific (P2)
3. Budget upgrade path = nice-to-have **après** distribution
4. Garder Library CTA Commander

---

# Synthèse globale

## 1. Tableau des scores NEW (v2.7.8 live — 2026-08-01)

| Persona        | Acc. | Pert. | Prof. | Util. | Conf. | Partage | **Moy /5** |
| -------------- | ---- | ----- | ----- | ----- | ----- | ------- | ---------- |
| **Léo**        | 4.1  | 3.5   | 3.8   | 4.1   | 4.0   | 3.5     | **3.83**   |
| **Sarah**      | 4.5  | 4.5   | 4.5   | 4.6   | 4.5   | 4.7     | **4.55**   |
| **Karim**      | 4.0  | 4.0   | 4.5   | 4.1   | 4.5   | 4.1     | **4.20**   |
| **Natsuki**    | 3.5  | 3.0   | 3.5   | 3.5   | 3.5   | 3.0     | **3.33**   |
| **David**      | 4.0  | 4.0   | 4.5   | 4.0   | 4.5   | 4.1     | **4.18**   |
| **Thibault**   | 4.5  | 4.1   | 3.8   | 4.1   | 4.5   | 4.3     | **4.22**   |
| **Moyenne 6p** |      |       |       |       |       |         | **4.05**   |

## 2. Comparaison OBLIGATOIRE vs baseline v2.7.7

| Snapshot                             | Léo       | Sarah     | Karim     | Natsuki  | David     | Thibault  | **Moy 6p** |
| ------------------------------------ | --------- | --------- | --------- | -------- | --------- | --------- | ---------- |
| Whole-site v2.5.4 (2026-04-18)       | 3.84      | 4.71      | 4.05      | 2.85     | 3.75      | 2.56      | **3.63**   |
| **Baseline v2.7.7 (2026-08-01)**     | **3.67**  | **4.50**  | **4.17**  | **3.33** | **4.17**  | **4.05**  | **4.00**   |
| **NEW v2.7.8 (2026-08-01 re-audit)** | **3.83**  | **4.55**  | **4.20**  | **3.33** | **4.18**  | **4.22**  | **4.05**   |
| **Δ vs baseline v2.7.7**             | **+0.16** | **+0.05** | **+0.03** | **0.00** | **+0.01** | **+0.17** | **+0.05**  |

### Statut des P0/P1 de l’audit baseline

| Item audit v2.7.7                  | Personas              | Statut post-2.7.8                                       |
| ---------------------------------- | --------------------- | ------------------------------------------------------- |
| Joyride first-visit **bloque** CTA | Léo, Sarah, mobile    | **RÉSOLU** (non-bloquant ; tooltip peut rester visible) |
| Faux positif **6 colors** Atraxa   | Thibault, trust       | **RÉSOLU** → **4 colors**                               |
| Densité Castability sans légende   | Léo, Sarah            | **RÉSOLU** (légende + tip Realistic)                    |
| Share clipboard silencieux         | Sarah, Thibault       | **RÉSOLU** (toast Discord)                              |
| Critical ≠ cut card (P1-3)         | Sarah, Karim          | **INCHANGÉ** (hors phase 2.7.8)                         |
| Empty My Analyses (P1-4)           | Léo                   | **PARTIEL** (samples + Analyze déjà présents)           |
| CSV / schéma JSON (P2)             | Karim, Natsuki, David | **INCHANGÉ** (post-users)                               |

**Lecture honnête :**

- Les **4 fixes ciblés tiennent en prod** sous les personas concernées.
- Gagnants nets : **Léo** (+0.16, first success) et **Thibault** (+0.17, trust screenshot EDH).
- **Sarah** déjà très haute ; gain surtout **Partage** (toast Discord).
- **Natsuki** plate par design de scope — pas un échec produit.
- Moyenne **4.00 → 4.05** : polish réel, pas révolution — **le goulot redevient LAUNCH.md**.

## 3. Top 5 frictions transverses (impact × # personas)

| #   | Friction                                                                      | Personas              | Priorité      |
| --- | ----------------------------------------------------------------------------- | --------------------- | ------------- |
| 1   | **Distribution nulle** (produit prêt, pas d’users)                            | Business / toutes     | **P0-DIST**   |
| 2   | Labels **Critical** encore ambigus (≠ cut card)                               | Sarah, Karim          | P1-3          |
| 3   | Wording **« N colors short of Karsten »** encore opaque                       | Thibault, Léo, Sarah  | P1 copy       |
| 4   | Export data fin (CSV / schéma JSON) absent                                    | Karim, Natsuki, David | P2 post-users |
| 5   | Bandeau **Feedback** + Joyride **tooltip** first-visit = bruit (non bloquant) | Léo, mobile           | P2            |

Autres : site EN-only (owner-gated) ; Redux persist vs multi-`?sample=` ; dual-engine dette math.

## 4. Top 5 wins à ne pas casser

1. **Health Score + QuickVerdict** plain English
2. **Free · no signup · decklists locales**
3. **Rocks & dorks K=3** + labels Perfect / Realistic + **légende sticky**
4. **EDH first-class** : banner, T4–T8, Karsten N/60, command zone, Atraxa **4c**
5. **Engine stamp v2.7.8** + open source + Library 5 tracks + **Share toast Discord**

Honorable : Joyride non-bloquant, Feedback Tally sans decklist, Guide/Math.

## 5. Backlog priorisé (lié à `LAUNCH.md`)

### P0 — business (pas de code)

| ID          | Item                                        | Pourquoi                                  |
| ----------- | ------------------------------------------- | ----------------------------------------- |
| **P0-DIST** | Exécuter `LAUNCH.md` (@fireshoes + Discord) | Produit shippable ; manque d’utilisateurs |

### P1 — polish post-premiers users (si signal)

| ID      | Item                                                   | Personas      |
| ------- | ------------------------------------------------------ | ------------- |
| P1-3    | Clarifier labels Critical ≠ cut card                   | Sarah, Karim  |
| P1-4    | Empty My Analyses — déjà partiel ; peaufiner si besoin | Léo           |
| P1-copy | « short of Karsten **sources** on N colors »           | Thibault, Léo |

### P2 — hors chemin critique launch

| ID   | Item                                               | Personas       |
| ---- | -------------------------------------------------- | -------------- |
| P2-1 | Export CSV castability                             | Karim          |
| P2-2 | Doc schéma JSON / library.json                     | Natsuki, David |
| P2-3 | Budget upgrade path EDH                            | Thibault       |
| P2-4 | Dual-engine ManaCostRow unify                      | David          |
| P2-5 | Mulligan model label EDH-specific                  | Thibault       |
| P2-6 | Joyride auto-dismiss / moins de chrome first paint | Léo            |

**Ne pas rouvrir sans owner :** Moxfield URL, i18n FR, backend, Sentry DSN, analytics decklist.

## 6. Verdict créateur

**ManaTuner v2.7.8 est shippable pour la distribution — les 4 clous UX de l’audit v2.7.7 tiennent en prod.**  
Moyenne 6 personas **4.05/5** (+0.05) : Léo et Thibault récupèrent le first-run et le trust screenshot EDH ; Sarah reste championne (4.55) pour le canal FNM/Discord de `LAUNCH.md`. Natsuki reste bas **par scope** (pas un data platform) — ce n’est pas un bloquant. Il n’y a plus de P0 UX/trust bloquant avant d’envoyer du trafic : le goulot n’est **plus** le produit, c’est **`LAUNCH.md`** (post analytique @fireshoes, réponses naturelles Discord). **Ne code pas de feature gratuite** tant que la distribution n’a pas commencé — attendre « go fix » uniquement pour P1-3 / P1-copy si tu veux un polish screenshot, sinon **ship the message**.

---

### Preuves live (smoke re-audit 2026-08-01)

| Check               | Résultat                                                                             |
| ------------------- | ------------------------------------------------------------------------------------ |
| Prod HTTP           | 200                                                                                  |
| Engine stamp        | **`Engine v2.7.8`**                                                                  |
| Joyride overlay     | Présent first-visit ; **`pointer-events: none`** ; CTA cliquable sans Skip           |
| `?sample=edh`       | Commander · T4–T8 · Atraxa · Health **87 %** · **4 colors** · pas de 6 colors        |
| Légende Castability | Perfect drops + Realistic + tip optimize Realistic                                   |
| Share chip          | Toast **« Share link copied — paste in Discord »** · clipboard URL share             |
| Tabs post-analyse   | Castability · Analysis · Mulligan · Manabase · Blueprint                             |
| Library             | tracks First FNM / RCQ / Pro Tour / Commander / Limited                              |
| Privacy             | local / no tracking claims                                                           |
| Mobile iPhone 13    | no H-overflow ; overlay `pointer-events: none` ; **Try Example cliquable** sans Skip |
| My Analyses empty   | Samples : Constructed midrange · Aggro ramp · Commander (100c) · Analyze a Deck      |
| Home                | Free/no signup signals · Commander listé · Health 87 % sample · dorks expliqués      |

---

_Fin du rapport. Baseline `PERSONA_AUDIT_2026-08-01.md` préservée. Aucun code modifié. Attendre « go fix » pour toute implémentation ; priorité business = `LAUNCH.md`._
