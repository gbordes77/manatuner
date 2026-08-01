# Plan de fix — Audit personas v2.7.7 (2026-08-01)

> **Source audit :** [`PERSONA_AUDIT_2026-08-01.md`](./PERSONA_AUDIT_2026-08-01.md)  
> **Prompt audit (réf.) :** [`PROMPT_PERSONA_AUDIT_NEXT.md`](./PROMPT_PERSONA_AUDIT_NEXT.md)  
> **Prod baseline :** https://www.manatuner.app · Engine **v2.7.7** · SHA **`f0e5d7f`**  
> **Objectif :** corriger les frictions UX/trust des 6 personas **sans** features hors backlog, **sans** sujets owner-gated.  
> **Priorité business** reste [`LAUNCH.md`](../../LAUNCH.md) — ce plan = polish bloquant / pré-screenshot.  
> **Mode d’exécution :** **une seule phase = 4 fixes**, chacun suivi d’un **auto-test agent** (obligatoire) avant le suivant.

---

## Phrase de lancement (copier-coller dans une **nouvelle** conversation)

```
Lis et exécute en entier docs/session/FIX_PLAN_PERSONA_AUDIT_2026-08-01.md
(ManaTuner, prod https://www.manatuner.app, baseline Engine v2.7.7).

Tu implémentes la PHASE UNIQUE « 4 fixes » de l’audit multi-personas 2026-08-01
(rapport : docs/session/PERSONA_AUDIT_2026-08-01.md).

Règle d’or (non négociable) :
- Une seule phase, 4 fixes dans l’ordre Fix 1 → Fix 4.
- Après CHAQUE fix : tu fais TOI-MÊME l’étape « Auto-test agent » du plan
  (unit ciblés + smoke local / Playwright si utile). Tu n’avances au fix suivant
  QUE si l’auto-test est VERT. Si ROUGE : corrige le fix en cours, re-teste,
  puis seulement continue. Ne batch pas les 4 implémentations avant de tester.
- Ne demande pas à l’humain de tester entre les fixes — c’est ton job.
- À la fin des 4 fixes verts : smoke de régression global (checklist plan).
- P2 uniquement si je dis « go P2 ». P0-DIST (LAUNCH.md) = rappel fin de session, pas code.
- Local :3000 d’abord → pas de push/prod sans « go prod ».
- Ne casse pas les wins du plan. Pas de Moxfield URL / i18n FR / backend /
  Sentry DSN / analytics decklist. Pas de feature hors plan.
- Rapport final en français : Fix1…Fix4 + résultat de chaque auto-test + reste.
```

---

## Contexte product (lire avant de coder)

1. `SESSION_START.md`
2. `docs/product/STATUS.md`
3. `docs/session/PERSONA_AUDIT_2026-08-01.md`
4. **Ce fichier**
5. `LAUNCH.md`

**Stack :** React 18 + TS + Vite + MUI · port **3000**  
**Tests :** `npm run test:unit` · smoke Playwright/curl local  
**Invariants :** `etbTapped` boolean · `toCloneableDeckCards` · Karsten N/60 · EDH T4–T8 · P1≥P2 · privacy client-side

---

## Wins à NE PAS casser

| Win                                                   | Zone                               |
| ----------------------------------------------------- | ---------------------------------- |
| Health Score + QuickVerdict plain English             | QuickVerdict, header résultats     |
| Free · no signup · decklists locales                  | Home, Privacy, My Analyses         |
| Rocks/dorks K=3 + Perfect / Realistic                 | CastabilityTab, ManaCostRow        |
| EDH first-class (banner, T4–T8, command zone, Atraxa) | `?sample=edh`, `?format=commander` |
| Engine stamp                                          | `data-testid="engine-stamp"`       |
| Share URL + Blueprint                                 | Share chip, Blueprint tab          |
| Library 5 tracks                                      | `/library`                         |
| Feedback header+footer (Tally, pas de decklist)       | Header / Footer                    |

---

## Hors scope (sans owner)

Moxfield URL · i18n FR · backend / comptes · `VITE_SENTRY_DSN` · analytics decklist · API meta · features non listées.

---

# Protocole d’exécution — PHASE UNIQUE (4 fixes)

## Principe

```
Pour i = 1..4 :
  1. IMPLÉMENTER Fix i uniquement (diff minimal, pas de scope creep)
  2. AUTO-TEST AGENT (section du Fix i) — agent seul, sans attendre l’humain
  3. Si ROUGE → corriger Fix i → rejouer auto-test jusqu’à VERT
  4. Si VERT → journaler résultat → passer à Fix i+1
Après Fix 4 VERT → SMOKE RÉGRESSION GLOBAL (section fin de phase)
→ Rapport final + rappel LAUNCH.md
→ Stop (pas de P2, pas de prod sans ordre)
```

**Interdit :**

- Implémenter Fix 2 avant auto-test VERT de Fix 1
- « Je testerai tout à la fin »
- Demander à l’utilisateur de valider entre les fixes (sauf blocage environnement réel : port, deps manquantes)

**Obligatoire à chaque auto-test :**

| Étape | Action agent                                                                             |
| ----- | ---------------------------------------------------------------------------------------- | ------------------------------------ |
| A     | Lancer les **tests unitaires ciblés** (fichiers touchés / suite liée)                    |
| B     | Si UI : **smoke local** (dev server :3000 ou Playwright headless) selon le script du fix |
| C     | Noter dans le journal : `Fix i — AUTO-TEST : VERT                                        | ROUGE — preuve (commande + extrait)` |
| D     | Si ROUGE : ne pas ouvrir le fix suivant                                                  |

**Prérequis phase (une fois, avant Fix 1) :**

```bash
cd "/Volumes/DataDisk/_Projects/Project Mana base V2"
# s’assurer dev dispo
curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/ || npm run dev &
# baseline unit (optionnel mais recommandé)
npm run test:unit -- --run 2>&1 | tail -20
```

---

## Les 4 fixes (ordre strict)

| #         | ID       | Titre                                   | Personas                    |
| --------- | -------- | --------------------------------------- | --------------------------- |
| **Fix 1** | P0-UX-1  | Joyride non-bloquant                    | Léo, Sarah, mobile          |
| **Fix 2** | P0-EDH-1 | Comptage couleurs / reco multi-color    | Thibault, trust screenshots |
| **Fix 3** | P1-1     | Légende permanente Perfect vs Realistic | Léo, Sarah                  |
| **Fix 4** | P1-2     | Share toast + hint Discord              | Sarah, Thibault, Partage    |

_(P1-3 Critical label · P1-4 empty My Analyses · P2_ : **hors phase** sauf ordre explicite « go suite » / « go P2 ».)\*

---

### Fix 1 — P0-UX-1 Joyride non-bloquant

|              |                                                                |
| ------------ | -------------------------------------------------------------- |
| **Problème** | Overlay Joyride bloque Try Example / Analyze (pointer-events). |
| **Fichiers** | `src/components/Onboarding.tsx` · `src/pages/AnalyzerPage.tsx` |
| **Clé LS**   | `manatuner-onboarding-completed`                               |

**Implémentation (critères) :**

1. First-visit peut cliquer **Try Example** ou **Analyze** sans Skip forcé.
2. Options acceptables (prendre la plus robuste) :
   - pas de Joyride si `?sample=` / `?format=` ;
   - `spotlightClicks: true` + pas d’overlay qui mange les CTA ;
   - ou tour reporté après premier `analysisResult` ;
   - skip auto au clic CTA primaire.
3. Skip + LS « completed » restent valides.
4. Mobile : même comportement.

#### Auto-test agent (après Fix 1 — OBLIGATOIRE avant Fix 2)

```text
[ ] 1. Unit / E2E ciblés si ajoutés (sinon skip unit OK)
[ ] 2. Smoke Playwright OU script local :
      - clear localStorage key manatuner-onboarding-completed
      - goto http://localhost:3000/analyzer
      - CLIQUER Try Example SANS cliquer Skip tour
      - ATTENDU : analyse démarre / résultats ou deck chargé (pas timeout overlay)
[ ] 3. goto /analyzer?sample=edh — pas bloqué par tour
[ ] 4. Journal : « Fix 1 AUTO-TEST VERT|ROUGE » + extrait log
```

**Exemple commande agent (adaptative) :**

```bash
# Dev server up, puis node/playwright : clear LS + click Try Example without Skip
# Échec si joyride overlay intercepte encore le clic
```

**Porte :** VERT → Fix 2. ROUGE → rework Onboarding seulement.

---

### Fix 2 — P0-EDH-1 Comptage couleurs (pas de « 6 colors » sur Atraxa)

|              |                                                                                                                                                 |
| ------------ | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| **Problème** | Reco `Multi-color deck detected (6 colors)` sur Atraxa 4c.                                                                                      |
| **Fichiers** | `src/services/deckAnalyzer.ts` (`generateRecommendations` ~L1068–1085) · éventuellement construction `colorDistribution` · wording `shortCount` |

**Cause probable :** clés hors WUBRG (ex. **C**) comptées comme couleurs.

**Implémentation (critères) :**

1. Compter uniquement **W,U,B,R,G** (sources et/ou pips sorts non-land).
2. `?sample=edh` Atraxa → **4 colors** (jamais 6).
3. Mono/2c : pas de reco multi-color abusive (seuil ≥ 3 WUBRG).
4. Test unitaire dédié (WUBG + beaucoup de C → toujours 4).
5. Aligner wording « N colors short of Karsten » si trompeur (`computeColorDeltas`).

#### Auto-test agent (après Fix 2 — OBLIGATOIRE avant Fix 3)

```text
[ ] 1. npm run test:unit — fichiers deckAnalyzer / reco / karsten liés (ou full unit si rapide)
[ ] 2. Smoke : http://localhost:3000/analyzer?sample=edh
      - ATTENDU : pas de texte « 6 colors »
      - ATTENDU : multi-color / 4-color cohérent avec WUBG
      - ATTENDU : banner Commander + Engine stamp toujours là (non-régression)
[ ] 3. Smoke régression : /analyzer Try Example (constructed) — Health Score toujours OK
[ ] 4. Journal : « Fix 2 AUTO-TEST VERT|ROUGE » + preuve (grep body / test output)
```

**Porte :** VERT → Fix 3. ROUGE → rework couleurs seulement (ne pas toucher Joyride sauf régression).

---

### Fix 3 — P1-1 Légende permanente Perfect drops vs Realistic

|              |                                                                  |
| ------------ | ---------------------------------------------------------------- |
| **Pourquoi** | Léo/Sarah perdus dans le mur de %.                               |
| **Fichiers** | `CastabilityTab` / `ManaCostRow` (légende existante à renforcer) |

**Implémentation (critères) :**

1. Caption **toujours visible** (pas seulement en bas de liste invisible) :  
   _Perfect drops = right colors if lands on curve · Realistic = what to optimize (mana screw + rocks/dorks)_.
2. Desktop + mobile lisible.
3. Ne pas casser labels P1≥P2.

#### Auto-test agent (après Fix 3 — OBLIGATOIRE avant Fix 4)

```text
[ ] 1. Unit si composant testable / snapshot non obligatoire
[ ] 2. Smoke : Try Example ou sample chargé → onglet Castability
      - ATTENDU : texte Perfect drops / Realistic visible dans le body (grep)
[ ] 3. Non-régression : Perfect drops % ≥ Realistic sur une ligne sample (si affichées)
[ ] 4. Journal : « Fix 3 AUTO-TEST VERT|ROUGE »
```

**Porte :** VERT → Fix 4.

---

### Fix 4 — P1-2 Share toast + hint Discord

|              |                                                |
| ------------ | ---------------------------------------------- |
| **Pourquoi** | Share clipboard silencieux → Partage plafonné. |
| **Fichiers** | `AnalyzerPage` `handleShare` + snackbar        |

**Implémentation (critères) :**

1. Message type : _Share link copied — paste in Discord_ (EN, ton site).
2. Durée toast **≥ 3 s**.
3. Accessible (snackbar role / live region existante OK).

#### Auto-test agent (après Fix 4 — OBLIGATOIRE avant smoke global)

```text
[ ] 1. Unit si logique pure extraite (sinon skip)
[ ] 2. Smoke : analyser un deck → cliquer Share
      - ATTENDU : snackbar/message contient « Discord » ou « copied » de façon explicite
      - ATTENDU : clipboard contient une URL manatuner (si API clipboard dispo en headless ; sinon vérifier dispatch snackbar en code + test unitaire du message)
[ ] 3. Non-régression : BuildShareUrl toujours fonctionnel (pas d’erreur console bloquante)
[ ] 4. Journal : « Fix 4 AUTO-TEST VERT|ROUGE »
```

**Porte :** VERT → **Smoke régression global** (ci-dessous).

---

## Smoke régression global (après les 4 fixes VERT)

L’agent exécute **seul** cette checklist avant de déclarer la phase terminée :

| #   | Check                                                     | Attendu                                               |
| --- | --------------------------------------------------------- | ----------------------------------------------------- |
| G1  | LS onboarding clear → `/analyzer` → Try Example sans Skip | OK (Fix 1)                                            |
| G2  | `/analyzer?sample=edh`                                    | Pas « 6 colors » ; Commander ; T4–T8 ; stamp (Fix 2)  |
| G3  | Castability après analyse                                 | Légende Perfect/Realistic visible (Fix 3)             |
| G4  | Share                                                     | Toast clair Discord/copied (Fix 4)                    |
| G5  | `npm run test:unit` (full ou large)                       | Pass                                                  |
| G6  | Mobile ~390px first analyzer                              | Pas bloqué overlay                                    |
| G7  | Wins                                                      | Health Score, privacy claims, K=3, 5 tabs toujours là |

---

## Journal de phase (à remplir par l’agent pendant l’exec)

```markdown
### Journal PHASE 4 fixes — [date]

| Fix          | Statut impl. | Auto-test  | Preuve (cmd / extrait) |
| ------------ | ------------ | ---------- | ---------------------- |
| 1 P0-UX-1    | …            | VERT/ROUGE | …                      |
| 2 P0-EDH-1   | …            | VERT/ROUGE | …                      |
| 3 P1-1       | …            | VERT/ROUGE | …                      |
| 4 P1-2       | …            | VERT/ROUGE | …                      |
| Smoke global | —            | VERT/ROUGE | …                      |
```

---

## Hors phase (ne pas faire sans ordre)

### Suite polish (si « go suite »)

| ID   | Item                            | Auto-test minimal si un jour exécuté            |
| ---- | ------------------------------- | ----------------------------------------------- |
| P1-3 | Critical ≠ cut card             | Smoke Analysis tab : sous-titre/tooltip présent |
| P1-4 | Empty My Analyses → Try Example | `/my-analyses` vide : CTA primaire Analyzer     |

### P2 (si « go P2 »)

| ID   | Item                                |
| ---- | ----------------------------------- |
| P2-1 | Export CSV castability              |
| P2-2 | Doc schéma JSON / library.json      |
| P2-3 | Budget upgrade path EDH             |
| P2-4 | Dual-engine ManaCostRow unify       |
| P2-5 | Label mulligan EDH vs London        |
| P2-6 | `?sample=` vs Redux persist         |
| P2-7 | Bandeau Feedback first paint mobile |

### P0-DIST — pas de code

Rappeler `LAUNCH.md` en fin de session (post @fireshoes + Discord).

---

## Versioning / ship

- Patch si prod (ex. **2.7.8**) + stamp UI aligné
- `docs/product/STATUS.md` + note handoff
- **Pas de push/prod** sans « go prod »
- Re-audit personas optionnel via `PROMPT_PERSONA_AUDIT_NEXT.md`

---

## Mapping persona → fixes phase

| Persona                 | Moy audit                             | Fix phase |
| ----------------------- | ------------------------------------- | --------- |
| Léo 3.67                | Fix 1, Fix 3                          |
| Sarah 4.50              | Fix 1, Fix 3, Fix 4                   |
| Thibault 4.05           | **Fix 2**, Fix 4                      |
| Karim / David / Natsuki | surtout non-régression + P2 plus tard |

---

## Livrable de fin de session (format obligatoire)

```markdown
## Phase 4 fixes — terminée / partielle

| Fix        | Fait    | Auto-test      |
| ---------- | ------- | -------------- |
| 1 P0-UX-1  | oui/non | VERT/ROUGE — … |
| 2 P0-EDH-1 | oui/non | VERT/ROUGE — … |
| 3 P1-1     | oui/non | VERT/ROUGE — … |
| 4 P1-2     | oui/non | VERT/ROUGE — … |

## Smoke global

- …

## Tests unit

- X pass / échecs

## URLs à rafraîchir (humain — validation visuelle optionnelle)

- http://localhost:3000/analyzer
- http://localhost:3000/analyzer?sample=edh

## Non fait

- P1-3, P1-4, P2…

## Rappel créateur

- P0-DIST : LAUNCH.md
- go prod ?
```

---

_Mis à jour 2026-08-01 : phase unique 4 fixes + auto-test agent obligatoire entre chaque fix. Ne code que sur exécution de la phrase de lancement._
