# Prompt — Audit UX multi-personas ManaTuner (relançable)

> **Usage :** coller la section « Phrase de lancement » en début de conversation, **ou** demander à l’agent de lire ce fichier en entier et d’exécuter la mission.  
> **Site :** https://www.manatuner.app · **Version cible :** v2.7.8+  
> **Personas canon :** `docs/personas/mtg-player-personas.md`  
> **État produit :** `docs/product/STATUS.md`  
> **Baseline scores :** `docs/session/PERSONA_AUDIT_2026-08-01.md` (v2.7.7, moy **4.00**)  
> **Créé :** 2026-08-01 · relançable à chaque release / avant push distribution

---

## Phrase de lancement (copier-coller)

### Re-audit comparatif (recommandé post-release)

```
Lis et exécute en entier docs/session/PROMPT_PERSONA_AUDIT_NEXT.md
(ManaTuner, prod https://www.manatuner.app, Engine v2.7.8).

Mission = AUDIT UX multi-personas IDENTIQUE au protocole de
docs/session/PERSONA_AUDIT_2026-08-01.md (baseline v2.7.7, moy 4.00),
avec comparaison obligatoire des notes.

Contraintes :
- 6 personas de docs/personas/mtg-player-personas.md, même grille 1–5, même format de sortie.
- Prod live uniquement (vérifier stamp Engine v2.7.8). Ne code pas tant que je ne dis pas « go fix ».
- Dans la synthèse : tableau scores NEW + tableau Δ vs baseline PERSONA_AUDIT_2026-08-01.md
  (Léo 3.67 · Sarah 4.50 · Karim 4.17 · Natsuki 3.33 · David 4.17 · Thibault 4.05 · Moy 4.00).
- Vérifier explicitement si les 4 fixes 2.7.8 tiennent sous chaque persona concernée :
  Joyride non-bloquant · Atraxa 4 colors · légende Perfect/Realistic · Share toast Discord.
- Livrer le rapport sous docs/session/PERSONA_AUDIT_2026-08-01_POST_278.md (ou date du jour).
- Rapport en français.
```

### Audit générique (sans forcer la baseline)

```
Lis et exécute en entier docs/session/PROMPT_PERSONA_AUDIT_NEXT.md
(ManaTuner, prod https://www.manatuner.app). Audit UX multi-personas uniquement :
les 6 personas du fichier docs/personas/mtg-player-personas.md analysent le site
sous tous les angles, notes 1–5 (grille officielle), synthèse + backlog.
Comparer vs docs/session/PERSONA_AUDIT_2026-08-01.md si présent.
Ne code pas tant que je ne dis pas « go fix ». Rapport en français.
```

---

## Mission complète

### Contexte produit (lire dans cet ordre)

1. `SESSION_START.md`
2. `docs/product/STATUS.md`
3. `docs/session/HANDOFF_2026-08-01.md` (ou handoff du jour le plus récent sous `docs/session/`)
4. `LAUNCH.md` (priorité business = distribution, pas features gratuites)
5. `docs/personas/mtg-player-personas.md` — **6 personas + grille + format de sortie**

**Site à auditer :** https://www.manatuner.app (prod live ; localhost seulement si prod inaccessible)  
**Repo :** racine ManaTuner (`Project Mana base V2`)

### Objectif

Incarner **toutes** les personas liées au projet et analyser le site **sous tous les angles** pertinents pour chacune. Chaque persona rend un **avis noté** (grille officielle) + une synthèse globale pour le créateur.

### Personas (6/6 — aucune oubliée)

1. **Léo** — Le Curieux (débutant casual Arena)
2. **Sarah** — La Régulière (FNM, copie/ajuste decklists)
3. **Karim** — Le Tacticien (grinder RCQ, data fine, exports)
4. **Natsuki** — La Grinder (Pro Tour qual, EV/equity, API/feeds)
5. **David** — L’Architecte (vétéran théorie, lit le code / math)
6. **Thibault** — Le Capitaine de Table (EDH pod, multiplayer)

**Règles d’incarnation** (fichier personas) :

- Mindset + vocabulaire + patience/impatience de la persona
- Navigation comme elle (où d’abord, où décrochage)
- Réactions authentiques (jargon, murs de data, claims marketing…)
- Trust & privacy + Distribution behavior de chaque persona

### Périmètre d’analyse (tous les angles)

| Zone                                       | URL / action                                                                              |
| ------------------------------------------ | ----------------------------------------------------------------------------------------- |
| Home / 1ʳᵉ impression                      | `/`                                                                                       |
| Analyzer happy path                        | `/analyzer` → Try Example → 5 tabs (Castability, Analysis, Mulligan, Manabase, Blueprint) |
| Samples formats                            | `?sample=aggro\|midrange\|control\|edh\|limited` et/ou `?format=commander`                |
| EDH                                        | banner Commander, horizon T4–T8, command zone si visible                                  |
| Health Score / QuickVerdict / Engine stamp | sous résultats                                                                            |
| Library                                    | `/library` (+ un article `/library/:slug` si pertinent)                                   |
| Learn                                      | `/guide`, `/mathematics`, `/land-glossary`                                                |
| My Analyses                                | `/my-analyses` (empty state + save/share si possible)                                     |
| Privacy / About                            | `/privacy`, `/about`                                                                      |
| Feedback                                   | CTA header + footer                                                                       |
| Mobile                                     | ≥ 1 parcours critique viewport mobile (Léo/Sarah prioritaires)                            |
| Share / viralité                           | URL share, “enverrais-je le lien ?”, artefact                                             |
| Trust math                                 | P1≥P2 labels, ramp, Karsten si la persona s’en soucie                                     |

Ne pas se limiter à l’Analyzer : Library + Learn + privacy + partage comptent pour les scores.

### Grille de notation (officielle v2 — 1 à 5)

| Axe               | Question                                                                            |
| ----------------- | ----------------------------------------------------------------------------------- |
| **Accessibilité** | Comprend-il le site dès l’arrivée ?                                                 |
| **Pertinence**    | A-t-il le contenu/données dont il a besoin ?                                        |
| **Profondeur**    | Le niveau de détail matche-t-il ses attentes ?                                      |
| **Utilisabilité** | Trouve-t-il vite ce qu’il cherche ? (+ mobile si pertinent)                         |
| **Confiance**     | Fait-il confiance aux chiffres / claims / privacy ?                                 |
| **Partage**       | Enverrait-il le lien ? À qui ? Canal ? Artefact (URL / screenshot / CSV / BibTeX) ? |
| **Frustrations**  | Ce qui le fait fuir (qualitatif)                                                    |
| **Manques**       | Ce qui manque pour satisfaction pleine (qualitatif)                                 |

**Score persona** = moyenne des 6 axes quantitatifs (Accessibilité → Partage).  
Frustrations / Manques = qualitatif, classer P0/P1/P2.

### Format de sortie OBLIGATOIRE par persona

1. **Première impression** (30 s) — 2–3 phrases viscérales
2. **Parcours de navigation** — ordre des clics / URLs, décrochages
3. **Points positifs**
4. **Points de friction**
5. **Tableau notes** (6 axes 1–5 + moyenne /5)
6. **Verdict** — revient ? recommande ? à qui ?
7. **Recommandations** — 3–5 changements concrets **pour cette persona**

### Synthèse globale (après les 6)

1. **Tableau scores** Léo | Sarah | Karim | Natsuki | David | Thibault | **Moy 6p**
2. **Comparaison OBLIGATOIRE** vs [`PERSONA_AUDIT_2026-08-01.md`](./PERSONA_AUDIT_2026-08-01.md) si re-audit :
   - Ligne baseline v2.7.7 + ligne NEW + **Δ par persona** + Δ moyenne
   - Baseline de référence : Léo **3.67** · Sarah **4.50** · Karim **4.17** · Natsuki **3.33** · David **4.17** · Thibault **4.05** · **Moy 4.00**
   - Dire clairement si les P0/P1 de l’audit (Joyride, 6 colors, légende, Share) sont **résolus / partiels / inchangés**
3. **Top 5 frictions transverses** (impact × # personas)
4. **Top 5 wins** à ne pas casser
5. **Backlog priorisé** P0/P1/P2 — ce qui sert utilisateurs / `LAUNCH.md`
6. **Verdict créateur** : shippable pour distribution ou bloqué UX ? 1 paragraphe honnête

### Contraintes process

- Prod live manatuner.app (vérifier Engine stamp si visible)
- **Ne code pas** de features (audit only), sauf demande explicite « go fix »
- **Ne rouvre pas** sans owner : Moxfield URL, i18n FR, backend, Sentry DSN, analytics decklist
- Ne pas inventer de features absentes ; croiser code / `STATUS.md` si doute
- Une persona = une voix distincte (pas de mélange)
- **Rapport en français** ; le site est en EN — noter frictions langue si pertinentes

### Livrable

Un seul rapport Markdown :

- 6 sections persona (format ci-dessus)
- 1 synthèse + tableau scores
- backlog actionnable lié à `LAUNCH.md` (distribution first)

**Ordre d’exécution :** confirmer lecture des 5 docs de contexte + personas → Léo → Sarah → Karim → Natsuki → David → Thibault → synthèse.

---

## Relancer après une release

1. Mettre à jour `docs/product/STATUS.md` si version/SHA ont changé
2. Relancer avec la **phrase re-audit comparatif** (section haute)
3. Archiver le rapport sous `docs/session/PERSONA_AUDIT_YYYY-MM-DD.md` (ou `*_POST_278.md`)
4. Ne pas écraser `PERSONA_AUDIT_2026-08-01.md` (baseline)

_Fin du prompt versionné._
