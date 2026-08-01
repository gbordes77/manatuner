# Cahier de tests Engine ManaTuner

## Métadonnées

| Champ             | Valeur                                                    |
| ----------------- | --------------------------------------------------------- |
| **Version app**   | `2.7.8` (`package.json`)                                  |
| **Stamp UI**      | Engine v2.7.8                                             |
| **Date**          | 2026-08-01                                                |
| **Environnement** | local `http://localhost:3000` (+ e2e Playwright chromium) |
| **OS / Node**     | macOS · Node v25.2.0                                      |
| **Scryfall**      | online (joignable)                                        |
| **Mode QA**       | Audit only (pas de fix code)                              |
| **Rapport**       | `docs/session/ENGINE_QA_2026-08-01.md`                    |

## Matrice des cas

| ID                | Format      | N       | Archétype            | Objectif                       | Priorité | Auto/Manuel  | Statut (2026-08-01)   |
| ----------------- | ----------- | ------- | -------------------- | ------------------------------ | -------- | ------------ | --------------------- |
| L40-SEALED-17L    | Limited     | 40      | GW sealed 17L        | format + horizon + land%       | P0       | Manuel       | **PASS**              |
| L40-SEALED-16L    | Limited     | 40      | GW 16L               | relation flood/screw vs 17L    | P0       | Manuel       | **PASS**              |
| L40-SPLASH        | Limited     | 40      | GW + U splash        | % bas sur pips splash          | P0       | Manuel       | **PASS**              |
| L40-MANA-SCREW    | Limited     | 40      | mono-R 14L           | land drop bas vs 17L           | P0       | Manuel       | **PASS\***            |
| C60-BURN-MONO-R   | Constructed | 60      | Burn multi-pip R/W/G | Bolt high ; multi-color detect | P0       | Manuel       | **PASS**              |
| C60-UW-CONTROL    | Constructed | 60      | UW control           | UU pips / T1–T4                | P0       | Manuel       | **PASS**              |
| C60-MID-SAMPLE    | Constructed | 60      | midrange sample      | 3c midrange stable             | P0       | Manuel + e2e | **PASS**              |
| C60-MANABASE-BAD  | Constructed | 60      | UR 2 Islands         | signal sources U bas           | P0       | Manuel       | **PASS\***            |
| C60-MANABASE-GOOD | Constructed | 60      | mono-G 24 Forest     | high cast / good health        | P0       | Manuel       | **PASS**              |
| C60-ETB-TAPPED    | Constructed | 60      | UR tapped duals      | pas de crash ; tempo           | P0       | Manuel       | **PASS**              |
| E100-ATRAXA       | EDH         | 101†    | Atraxa sample        | 4c · T4–T8 · cmd zone          | P0       | Manuel + e2e | **PASS\***            |
| E100-MONO-G       | EDH         | 100     | Selvala _CMDR_       | scale N/60 · lib 99            | P0       | Manuel       | **PASS**              |
| E100-CMD-ZONE     | EDH         | 101†    | Atraxa _CMDR_        | command zone note              | P0       | Manuel       | **PASS**              |
| E100-NO-MARKER    | EDH         | 100     | Selvala sans _CMDR_  | heuristique first non-land     | P0       | Manuel       | **PASS**              |
| E100-5C           | EDH         | 100     | 5c fixing stress     | pas crash                      | P1       | Manuel       | **SKIP** (temps)      |
| EDGE-EMPTY        | —           | 0       | vide                 | bouton disabled                | P0       | Manuel       | **PASS**              |
| EDGE-GARBAGE      | —           | 28      | noms inventés        | pas de faux 100%               | P0       | Manuel       | **FAIL**              |
| EDGE-SIDEBOARD    | Constructed | 60+15   | burn + SB            | SB hors N main                 | P0       | Manuel       | **FAIL\***            |
| EDGE-HYBRID       | Constructed | 60      | hybrid pips          | proba non absurde              | P1       | Manuel       | **PASS**              |
| EDGE-CAVERN       | Constructed | ~60     | Cavern               | créature vs non-créature       | P1       | Manuel       | **PASS\*** (comptage) |
| EDGE-RAMP-K3      | Constructed | 60      | midrange Cub+dorks   | e2e happy path                 | P1       | e2e          | **PASS** (via sample) |
| SAMPLE-LIMITED    | Limited     | **41†** | sample UI            | total 40 attendu               | P1       | Manuel       | **FAIL** (count)      |
| SAMPLE-AGGRO      | Constructed | 60      | sample               | smoke                          | P1       | code count   | **PASS** (count)      |
| SAMPLE-CONTROL    | Constructed | **59†** | sample               | total 60 attendu               | P1       | code count   | **FAIL** (count)      |
| UNIT-HYPERGEOM    | —           | —       | SSOT                 | 381 unit pass                  | P0       | Auto         | **PASS**              |
| E2E-CORE          | —           | —       | happy/edh/audit      | 8 chromium pass                | P0       | Auto         | **PASS**              |

\* = PASS oracles format/horizon, mais finding UX/score associé documenté.  
† = total cartes **incorrect** dans le sample seed (bug fixture, pas engine math).

---

## Fixtures decklists

### L40-SEALED-17L (total 40 · 17 lands)

```
1 Llanowar Elves
1 Elvish Mystic
2 Scavenging Ooze
2 Elvish Visionary
1 Voice of Resurgence
1 Loxodon Smiter
1 Centaur Courser
1 Qasali Pridemage
2 Abzan Battle Priest
2 Dromoka's Command
2 Selesnya Charm
2 Wildsize
1 Path to Exile
1 Banishing Light
1 Collected Company
1 Sundering Growth
1 Oath of Nissa
2 Selesnya Guildgate
8 Plains
7 Forest
```

### L40-SEALED-16L (total 40 · 16 lands)

```
1 Llanowar Elves
1 Elvish Mystic
2 Scavenging Ooze
2 Elvish Visionary
1 Voice of Resurgence
1 Loxodon Smiter
1 Centaur Courser
1 Qasali Pridemage
2 Abzan Battle Priest
2 Dromoka's Command
2 Selesnya Charm
2 Wildsize
1 Path to Exile
1 Banishing Light
1 Collected Company
1 Sundering Growth
1 Oath of Nissa
1 Giant Growth
2 Selesnya Guildgate
7 Plains
7 Forest
```

### L40-SPLASH (total 40)

```
1 Llanowar Elves
1 Elvish Mystic
2 Scavenging Ooze
2 Elvish Visionary
1 Loxodon Smiter
1 Centaur Courser
1 Qasali Pridemage
2 Abzan Battle Priest
2 Selesnya Charm
2 Wildsize
1 Path to Exile
1 Banishing Light
1 Essence Scatter
1 Negate
2 Selesnya Guildgate
8 Forest
6 Plains
2 Island
1 Giant Growth
1 Rabid Bite
1 Prey Upon
```

### L40-MANA-SCREW (total 40 · 14 Mountain)

```
2 Goblin Guide
2 Monastery Swiftspear
2 Lightning Bolt
2 Shock
2 Lightning Strike
2 Volcanic Hammer
2 Fanatical Firebrand
2 Rigging Runner
2 Goblin Motivator
2 Spear Spewer
2 Kargan Dragonrider
2 Viashino Pyromancer
2 Fireblade Charger
14 Mountain
```

### C60-BURN-MONO-R (total 60)

```
4 Lightning Bolt
4 Monastery Swiftspear
4 Goblin Guide
4 Lava Spike
4 Rift Bolt
4 Searing Blaze
4 Skullcrack
4 Atarka's Command
4 Boros Charm
4 Eidolon of the Great Revel
20 Mountain
```

### C60-UW-CONTROL (total 60)

```
4 Counterspell
4 Memory Deluge
4 No More Lies
4 Get Lost
3 Supreme Verdict
3 The Wandering Emperor
2 Teferi, Time Raveler
2 Teferi, Hero of Dominaria
2 Deduce
2 Three Steps Ahead
1 Farewell
1 Change the Equation
1 March of Otherworldly Light
4 Flooded Strand
4 Hallowed Fountain
4 Deserted Beach
4 Island
4 Plains
3 Field of Ruin
2 Otawara, Soaring City
1 Eiganjo, Seat of the Empire
1 Hall of Storm Giants
```

### C60-MID-SAMPLE

Via URL : `/analyzer?sample=midrange` (Nature's Rhythm, 60 cartes, seed produit).

### C60-MANABASE-BAD (total 60 · 2 Island / 18 Mountain)

```
4 Counterspell
4 Lightning Bolt
4 Opt
4 Shock
4 Delver of Secrets
4 Monastery Swiftspear
4 Expressive Iteration
4 Consider
4 Spell Pierce
4 Brainstorm
18 Mountain
2 Island
```

### C60-MANABASE-GOOD (total 60)

```
4 Llanowar Elves
4 Elvish Mystic
4 Steel Leaf Champion
4 Old-Growth Troll
4 Questing Beast
4 Collected Company
4 Aspect of Hydra
4 Blossoming Defense
4 Pelt Collector
24 Forest
```

### C60-ETB-TAPPED (total 60)

```
4 Counterspell
4 Lightning Bolt
4 Opt
4 Shock
4 Delver of Secrets
4 Consider
4 Expressive Iteration
4 Spell Pierce
4 Goblin Electromancer
4 Izzet Charm
4 Swiftwater Cliffs
4 Izzet Guildgate
4 Highland Lake
4 Mountain
4 Island
```

### E100-ATRAXA / E100-CMD-ZONE

Via URL : `/analyzer?sample=edh`  
**Note seed :** total compté = **101** cartes (bug fixture sample). Contient `1 Atraxa, Praetors' Voice *CMDR*`.

### E100-MONO-G (total 100 · _CMDR_)

```
1 Selvala, Heart of the Wilds *CMDR*
1 Sol Ring
1 Cultivate
1 Kodama's Reach
1 Nature's Lore
1 Three Visits
1 Rampant Growth
1 Farseek
1 Llanowar Elves
1 Elvish Mystic
1 Fyndhorn Elves
1 Birds of Paradise
1 Eternal Witness
1 Beast Whisperer
1 Craterhoof Behemoth
1 Goreclaw, Terror of Qal Sisma
1 Rishkar's Expertise
1 Return of the Wildspeaker
1 Garruk's Uprising
1 Harmonize
1 Greater Good
1 Sylvan Library
1 Heroic Intervention
1 Beast Within
1 Krosan Grip
1 Reclamation Sage
1 Scavenging Ooze
1 Tireless Tracker
1 Oracle of Mul Daya
1 Courser of Kruphix
1 Explore
1 Sakura-Tribe Elder
1 Wood Elves
1 Farhaven Elf
1 Springbloom Druid
1 Fertile Ground
1 Utopia Sprawl
1 Wild Growth
1 Overgrowth
1 Nissa's Pilgrimage
1 Circuitous Route
1 Migration Path
1 Explosive Vegetation
1 Skyshroud Claim
1 Hunting Wilds
1 Growing Rites of Itlimoc
1 Gaea's Cradle
1 Nykthos, Shrine to Nyx
1 Castle Garenbrig
1 Reliquary Tower
1 Rogue's Passage
1 War Room
1 Bonders' Enclave
1 Myriad Landscape
1 Blighted Woodland
1 Evolving Wilds
1 Terramorphic Expanse
1 Fabled Passage
1 Tranquil Thicket
1 Slippery Karst
1 Treetop Village
1 Llanowar Reborn
1 Oran-Rief, the Vastwood
1 Khalni Garden
1 Mosswort Bridge
1 Temple of the False God
1 Ghost Quarter
1 Field of Ruin
1 Demolition Field
1 Boseiju, Who Endures
1 Yavimaya, Cradle of Growth
29 Forest
```

### E100-NO-MARKER

Même liste que E100-MONO-G **sans** `*CMDR*` sur Selvala.

### EDGE-EMPTY

Liste vide.

### EDGE-GARBAGE

```
4 NotARealCardXYZ123
4 CompletelyFakeSpell99
20 ImaginaryLandFoo
```

### EDGE-SIDEBOARD (main 60 + SB 15)

```
4 Lightning Bolt
4 Monastery Swiftspear
4 Goblin Guide
4 Lava Spike
4 Rift Bolt
4 Searing Blaze
4 Skullcrack
4 Boros Charm
4 Eidolon of the Great Revel
4 Lightning Helix
20 Mountain
Sideboard
3 Abrade
2 Roiling Vortex
2 Smash to Smithereens
4 Dragon's Claw
4 Leyline of Combustion
```

### EDGE-HYBRID / EDGE-CAVERN

Voir script temporaire de run QA (batch) ou reconstituer : duals hybrid / Cavern of Souls + créatures vs counters.

---

## Oracles numériques (attendus)

| ID             | Métrique               | Attendu                      | Tolérance            | Source                                     |
| -------------- | ---------------------- | ---------------------------- | -------------------- | ------------------------------------------ |
| UNIT           | P(≥1 land) 60/20 hand7 | ≈ **0.9517**                 | exact (déterministe) | `hypergeom.atLeast(60,20,7,1)`             |
| UNIT           | Karsten 1 pip T1       | **14** /60                   | exact                | `KARSTEN_TABLES[1][1]`                     |
| UNIT           | Karsten 2 pip T2       | **20** /60                   | exact                | `KARSTEN_TABLES[2][2]`                     |
| UNIT           | Karsten 3 pip T3       | **23** /60                   | exact                | `KARSTEN_TABLES[3][3]`                     |
| UNIT           | scale 14→40            | **9**                        | exact                | `scaleKarstenSources(14,40)`               |
| UNIT           | scale 14→100           | **23**                       | exact                | `scaleKarstenSources(14,100)`              |
| UNIT           | scale 20→100           | **33**                       | exact                | `scaleKarstenSources(20,100)`              |
| L40-\*         | family                 | `limited`                    | exact                | `detectDeckFormatFamily`                   |
| L40-\*         | horizon                | **T1–T4**                    | exact                | `castabilityHorizon`                       |
| C60-\*         | family                 | `constructed`                | exact                |                                            |
| C60-\*         | horizon                | **T1–T4**                    | exact                |                                            |
| E100-\*        | family                 | `edh`                        | exact                | N≥99                                       |
| E100-\*        | horizon                | **T4–T8**                    | exact                |                                            |
| E100-_CMDR_    | library size note      | **N − cmd**                  | exact                | `effectiveLibrarySize`                     |
| ALL            | % affichés             | ∈ [0, 100]                   | 0                    | UI                                         |
| ALL            | Perfect ≥ Realistic    | P1 ≥ P2                      | ≤0.5 pp affichage    | tip UI + engine                            |
| ALL            | NaN / Infinity %       | absent                       | 0                    | (attention faux positif regex `Dominance`) |
| EDGE-EMPTY     | Analyze button         | **disabled**                 | exact                |                                            |
| EDGE-GARBAGE   | analyse crédible       | **refuse / cards not found** | —                    | **FAIL observé**                           |
| EDGE-SIDEBOARD | N pour odds            | **60 main**                  | exact                | scope UI OK, banner N=75 **FAIL**          |
| SAMPLE-LIMITED | total                  | **40**                       | exact                | **41 observé**                             |
| SAMPLE-EDH     | total                  | **100**                      | exact                | **101 observé**                            |
| SAMPLE-CONTROL | total                  | **60**                       | exact                | **59 observé**                             |

### Oracles relationnels (pas de valeur magique)

| ID               | Relation                                                                                              |
| ---------------- | ----------------------------------------------------------------------------------------------------- |
| L40-16L vs 17L   | land guidance mentionne 16 vs 17 ; early land-drop non-croissant                                      |
| L40-SCREW vs 17L | banner « 14 lands » vs « 17 lands » ; health score **peut** rester haut si curve très bas (documenté) |
| C60-BAD vs GOOD  | pctMin BAD < GOOD ; recos multi-color / sources                                                       |
| E100-ATRAXA      | Atraxa + 4 couleurs signalées dans QuickVerdict                                                       |

---

## Invariants globaux

- [x] `etbTapped` boolean (tests unit + wave F)
- [x] Mulligan payload `toCloneableDeckCards` (unit + e2e tabs)
- [x] Hypergeom SSOT + `clampProbability` (unit)
- [x] Karsten scale N/60 (unit + UI disclaimer Limited/EDH)
- [x] EDH horizon T4–T8 (manuel + e2e)
- [x] Perfect ≥ Realistic (tip UI + engine tests)
- [x] Fisher-Yates (revue code / tests mulligan seed)
- [x] Multi-color reco WUBRG spells (C60-BURN détecte multi via hybrid)
- [ ] Cavern creatures-only — non re-vérifié ligne par ligne (P1 backlog)
- [x] Privacy client-side (pas d’envoi decklist)

---

## Procédure d’exécution manuelle Analyzer

1. `npm run dev` → http://localhost:3000/analyzer
2. Dismiss Joyride si besoin (`manatuner-onboarding-completed=true`).
3. Coller decklist exacte du cahier (ou `?sample=…`).
4. **Analyze Manabase** → attendre `data-testid=analysis-results` (Scryfall).
5. Noter : banner format (`format-family-banner`), QuickVerdict, horizon, command zone note.
6. Onglet Castability : 3–5 sorts, Perfect vs Realistic, absence NaN%.
7. Onglet Manabase : Color Sources / Karsten scaled.
8. Onglet Mulligan : pas de DataCloneError.
9. Comparer oracles → PASS / FAIL / INCONCLUSIVE.

### Commandes auto

```bash
npm run test:unit          # 381 pass / 2 skip
npm run type-check         # 1 erreur préexistante MyAnalysesPage.tsx
npx playwright test tests/e2e/core-flows/analyzer-happy-path.spec.js \
  tests/e2e/core-flows/p1-9-edh-verify.spec.js \
  tests/e2e/core-flows/audit-wave-c-verify.spec.js --project=chromium
```

---

## Inventaire couverture auto (gaps)

| Zone                                   | Couvert ? | Notes                          |
| -------------------------------------- | --------- | ------------------------------ |
| hypergeom / Karsten tables             | ✅        | unit                           |
| scaleKarsten / horizon / format family | ✅        | `deckFormat.test.ts`           |
| sideboard detection unit               | ✅        | parser                         |
| sideboard **UI banner N** vs main      | ❌        | gap → FAIL EDGE-SIDEBOARD      |
| sample deck card counts 40/60/100      | ❌        | gap → FAIL samples             |
| garbage / not-found UX                 | ❌        | gap → FAIL EDGE-GARBAGE        |
| Cavern creatures-only end-to-end       | partiel   | seed + types ; pas e2e oracle  |
| P1≥P2 row-by-row golden                | partiel   | tip + engine ; pas snapshot UI |
| E100 5c stress                         | ❌        | skip session                   |

_Fin du cahier — exécution détaillée dans `ENGINE_QA_2026-08-01.md`._
