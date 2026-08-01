# HANDOFF — Prochaines étapes ManaTuner

> **À jour :** 2026-08-01 · **Live :** **v2.7.7** · **SHA :** `f0e5d7f`  
> **Prod :** https://www.manatuner.app/  
> **SSOT journée :** [`HANDOFF_2026-08-01.md`](./HANDOFF_2026-08-01.md)  
> **État produit :** [`../product/STATUS.md`](../product/STATUS.md) · **Index docs :** [`../README.md`](../README.md)

---

## Phrase à copier-coller (nouvelle conversation)

```
Lis SESSION_START.md puis docs/product/STATUS.md et docs/session/HANDOFF_2026-08-01.md
(ManaTuner v2.7.7 / f0e5d7f). Docs réorganisées sous docs/ — index docs/README.md.

Priorité business = LAUNCH.md (distribution). Pas de feature gratuite.
Ne pas activer VITE_SENTRY_DSN sans checklist privacy (SECURITY.md).
Ne pas rouvrir Moxfield URL, i18n FR, backend, analytics decklist sans owner.
```

---

## État 30 s

|             |                                                           |
| ----------- | --------------------------------------------------------- |
| **Version** | **2.7.7** (`Engine v2.7.7`)                               |
| **SHA**     | `f0e5d7f` · feature G `ac8371e`                           |
| **Tests**   | 369 unit · E2E core/tabs/a11y verts fin G                 |
| **Docs**    | Racine minimale + `docs/**` classés · audit + réorg faits |

---

## Priorités suite

1. ~~Audit docs~~ **FAIT**
2. ~~Réorg docs + Sentry plugin (privacy-gated)~~ **FAIT** (cette session)
3. **Distribution** — [`../../LAUNCH.md`](../../LAUNCH.md) ← **maintenant**
4. Optionnel : prerender HTML réel Vercel ; polish ; a11y deep

**Ne pas** sans owner : Moxfield URL, i18n FR, backend, **Sentry DSN**, analytics decklist.

---

## Sentry (rappel)

- `@sentry/react` + `@sentry/vite-plugin` installés
- Init **off** sans `VITE_SENTRY_DSN`
- Plugin upload maps seulement si `SENTRY_AUTH_TOKEN` + org/project
- Scrubber `beforeSend` en place — détail `SECURITY.md`
