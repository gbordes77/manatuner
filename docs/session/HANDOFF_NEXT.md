# HANDOFF — Prochaines étapes ManaTuner

> **À jour :** 2026-08-01 · **Live :** **v2.7.8** · stamp **Engine v2.7.8**  
> **Prod :** https://www.manatuner.app/  
> **SSOT journée :** [`HANDOFF_2026-08-01.md`](./HANDOFF_2026-08-01.md)  
> **État produit :** [`../product/STATUS.md`](../product/STATUS.md) · **Index docs :** [`../README.md`](../README.md)

---

## Phrase à copier-coller (nouvelle conversation)

### A — Re-audit multi-personas **comparatif** (post v2.7.8) — recommandé

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

### B — Audit multi-personas générique (sans forcer la baseline)

```
Lis et exécute en entier docs/session/PROMPT_PERSONA_AUDIT_NEXT.md
(ManaTuner, prod https://www.manatuner.app). Audit UX multi-personas uniquement :
les 6 personas du fichier docs/personas/mtg-player-personas.md analysent le site
sous tous les angles, notes 1–5 (grille officielle), synthèse + backlog.
Comparer vs docs/session/PERSONA_AUDIT_2026-08-01.md si présent.
Ne code pas tant que je ne dis pas « go fix ». Rapport en français.
```

### C — Session générique (produit / docs)

```
Lis SESSION_START.md puis docs/product/STATUS.md et docs/session/HANDOFF_NEXT.md
(ManaTuner v2.7.8). Docs sous docs/ — index docs/README.md.

Priorité business = LAUNCH.md (distribution). Pas de feature gratuite.
Ne pas activer VITE_SENTRY_DSN sans checklist privacy (SECURITY.md).
Ne pas rouvrir Moxfield URL, i18n FR, backend, analytics decklist sans owner.
```

---

## État 30 s

|                       |                                                                                                     |
| --------------------- | --------------------------------------------------------------------------------------------------- |
| **Version**           | **2.7.8** (`Engine v2.7.8`)                                                                         |
| **Tests**             | 381 unit · smoke persona fixes VERT                                                                 |
| **Audit UX baseline** | 6 personas v2.7.7 · moy **4.00/5** · [`PERSONA_AUDIT_2026-08-01.md`](./PERSONA_AUDIT_2026-08-01.md) |
| **Fixes shippés**     | Joyride · EDH 4c · légende Castability · Share Discord                                              |

---

## Priorités suite

1. ~~Audit multi-personas v2.7.7~~ **FAIT**
2. ~~Phase 4 fixes P0/P1~~ **FAIT** → **v2.7.8**
3. **Re-audit comparatif** — phrase **A** ci-dessus
4. **P0-DIST** — `LAUNCH.md` (@fireshoes + Discord) — **pas de code**
5. Optionnel « go suite » : P1-3 Critical label · P1-4 empty My Analyses
6. Optionnel « go P2 » : CSV, JSON schema, budget EDH, dual-engine unify…

---

## Wins à ne pas casser

Health Score + QuickVerdict · Free no signup · K=3 · EDH first-class · Engine stamp · Share URL · Library 5 tracks · Feedback Tally · Joyride non-bloquant · 4 colors Atraxa · légende Perfect/Realistic

---

_P0 business = distribution, pas feature._
