# HANDOFF — Prochaines étapes ManaTuner

> **À jour :** 2026-08-01 · **Code local :** **v2.7.9** · stamp **Engine v2.7.9**  
> **Prod live (tant que non shippé) :** peut encore afficher **v2.7.8**  
> **Prod URL :** https://www.manatuner.app/  
> **SSOT journée :** [`HANDOFF_2026-08-01.md`](./HANDOFF_2026-08-01.md)  
> **Sécu :** [`SECURITY_AUDIT_2026-08-01.md`](./SECURITY_AUDIT_2026-08-01.md) — remédiations **code done**, deploy = owner  
> **État produit :** [`../product/STATUS.md`](../product/STATUS.md) · **Index docs :** [`../README.md`](../README.md)

---

## Phrase à copier-coller (nouvelle conversation)

### A — Ship / valider sécu 2.7.9 (si pas encore en prod)

```
Lis docs/session/SECURITY_AUDIT_2026-08-01.md + CHANGELOG [2.7.9].
Code local v2.7.9 : wipe privacy, share #d=, SECURITY.md CSP, react-router 7.18.2, tests 404.
Vérifie stamp Engine v2.7.9, Network Analyze = Scryfall only, Reset wipe persist:root.
Si OK et créateur dit « go prod » : push + deploy Vercel.
Sinon priorité = LAUNCH.md (distribution).
```

### B — Re-audit multi-personas **comparatif** (post v2.7.8 / 2.7.9)

```
Lis et exécute en entier docs/session/PROMPT_PERSONA_AUDIT_NEXT.md
(ManaTuner, prod https://www.manatuner.app).

Mission = AUDIT UX multi-personas IDENTIQUE au protocole de
docs/session/PERSONA_AUDIT_2026-08-01.md (baseline v2.7.7, moy 4.00),
avec comparaison obligatoire des notes.

Contraintes :
- 6 personas, même grille 1–5.
- Prod live (noter Engine stamp réel). Ne code pas tant que je ne dis pas « go fix ».
- Vérifier fixes 2.7.8 + sécu 2.7.9 (Share toast deck honesty, Reset wipe).
- Rapport en français.
```

### C — Session générique (produit / docs)

```
Lis SESSION_START.md puis docs/product/STATUS.md et docs/session/HANDOFF_NEXT.md
(ManaTuner v2.7.9 code / prod peut lag). Docs sous docs/ — index docs/README.md.

Priorité business = LAUNCH.md (distribution). Pas de feature gratuite.
Ne pas activer VITE_SENTRY_DSN sans checklist privacy (SECURITY.md).
Ne pas rouvrir Moxfield URL, i18n FR, backend, analytics decklist sans owner.
```

---

## État 30 s

|                       |                                                                                                     |
| --------------------- | --------------------------------------------------------------------------------------------------- |
| **Version code**      | **2.7.9** (`Engine v2.7.9`) — sécu remédiée localement                                              |
| **Tests**             | **404** unit pass / 2 skip                                                                          |
| **Audit sécu**        | Rapport + fixes SEC-01→05 · residual npm : RSC CSRF advisory N/A SPA                                |
| **Audit UX baseline** | 6 personas v2.7.7 · moy **4.00/5** · [`PERSONA_AUDIT_2026-08-01.md`](./PERSONA_AUDIT_2026-08-01.md) |
| **Prod deploy 2.7.9** | **Pas encore** (sauf si ship après ce handoff)                                                      |

---

## Priorités suite

1. ~~Audit multi-personas v2.7.7~~ **FAIT**
2. ~~Phase 4 fixes P0/P1~~ **FAIT** → **v2.7.8**
3. ~~Audit sécu + remédiations~~ **FAIT code** → **v2.7.9** (deploy = owner)
4. **P0-DIST** — `LAUNCH.md` (@fireshoes + Discord) — **pas de code**
5. Re-audit personas comparatif (optionnel)
6. Optionnel « go suite » : P1-3 Critical label · P1-4 empty My Analyses

---

## Wins à ne pas casser

Health Score + QuickVerdict · Free no signup · K=3 · EDH first-class · Engine stamp · Share URL **hash** · Reset wipe complet · Library 5 tracks · Feedback Tally · Joyride non-bloquant · 4 colors Atraxa · légende Perfect/Realistic · CSP sans Sentry tant que DSN unset

---

_P0 business = distribution, pas feature._
