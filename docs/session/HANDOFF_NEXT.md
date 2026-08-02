# HANDOFF — Prochaines étapes ManaTuner

> **À jour :** 2026-08-02 (soir) · **Live prod :** **v2.7.9** · stamp **Engine v2.7.9** · SHA **`fdef163`**  
> **Code `main` remote :** **`332501d`** (T02–T05)  
> **Working tree local :** **T01 + T06–T15 + QW1–3 + AM1/AM6 FAIT** — **AUCUN commit** (attente ordre owner)  
> **Prod URL :** https://www.manatuner.app/  
> **Audit journal :** [`../../AUDIT_EVOLUTIONS.md`](../../AUDIT_EVOLUTIONS.md) §7  
> **État produit :** [`../product/STATUS.md`](../product/STATUS.md)

---

## Phrase à copier-coller

### A — Commit hygiène tech (quand owner dit « commit »)

```
Review working tree: T01 + T06–T15 + QW/AM (AUDIT_EVOLUTIONS §7.7).
440 unit pass, type-check, lint, build, bundle budget green.
Commit hygiène only if I say « commit ». No push/deploy without order.
```

### B — Distribution (priorité business)

```
Lis LAUNCH.md — P0-DIST @fireshoes + Discord. Pas de feature gratuite.
Prod reste v2.7.9 @ fdef163 jusqu’à « go prod ».
```

---

## État 30 s

|                       |                                                  |
| --------------------- | ------------------------------------------------ |
| **Prod live**         | **v2.7.9** · `fdef163`                           |
| **Remote main**       | **`332501d`** T02–T05                            |
| **Local uncommitted** | T01, T06–T15, QW, AM CI — **ready to commit**    |
| **Tests unit**        | **440** pass / 2 skip                            |
| **Build**             | ✓ · vendor-mui ~365 KB · vendor-mui-icons ~37 KB |

---

## Priorités suite

1. **Owner :** review + « commit » (ou amends) puis éventuellement « go prod »
2. **P0-DIST** — `LAUNCH.md` (pas de code)
3. ~~T02–T05~~ FAIT · ~~T01+T06–T15 tech reste~~ FAIT local
4. Re-audit personas optionnel

---

## Wins à ne pas casser

Health Score · Free no signup · K=3 · EDH · Share **hash `#d=`** · Reset wipe + **IDB Scryfall** · land SSOT · fetchWithTimeout · SW killer · hypergeom SSOT · persist sans analysisResult · batch lands · budget bundle CI

---

_P0 business = distribution, pas feature._
