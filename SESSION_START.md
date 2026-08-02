# SESSION_START — ManaTuner (lire en premier)

> **Date :** 2026-08-02  
> **Prod :** https://www.manatuner.app · ship tech **`10845c7`** (T01–T15+QW/AM) · Dependabot **off** `0ae8295`  
> **Engine stamp UI :** v2.7.9 (package non bumpé pour hygiène)  
> **Docs index :** [`docs/README.md`](docs/README.md) · **État :** [`docs/product/STATUS.md`](docs/product/STATUS.md)  
> **Audit journal :** [`AUDIT_EVOLUTIONS.md`](AUDIT_EVOLUTIONS.md) §7  
> **Prioriser le reste audit (expert) :** [`docs/session/PROMPT_AUDIT_RESTE_PRIORISATION.md`](docs/session/PROMPT_AUDIT_RESTE_PRIORISATION.md)

## Ordre de lecture

1. **Ce fichier**
2. [`docs/session/HANDOFF_NEXT.md`](docs/session/HANDOFF_NEXT.md)
3. [`LAUNCH.md`](LAUNCH.md) — **priorité business (utilisateurs)**
4. [`docs/product/STATUS.md`](docs/product/STATUS.md)
5. [`AUDIT_EVOLUTIONS.md`](AUDIT_EVOLUTIONS.md) §7 — tech FAIT ; reste = produit/AM
6. [`SECURITY.md`](SECURITY.md)

## Règles owner

1. Local d’abord → `http://localhost:3000`
2. Privacy client-side ; share = hash `#d=`
3. Prioriser ce qui amène des utilisateurs (`LAUNCH.md`)
4. **Ne pas rouvrir sans owner :** Moxfield URL, i18n FR, backend, **Sentry DSN**, analytics decklist
5. Dependabot **désactivé** — bumps manuels seulement
6. Tech audit T01–T15 **shippé** — ne pas re-faire

## Stack & commandes

```bash
cd "/Volumes/DataDisk/_Projects/Project Mana base V2"
npm run dev          # port 3000
npm run test:unit    # 440 pass / 2 skip
npm run build:vercel # prod Vercel (prerender soft-fail)
```

Routes : `/` · `/analyzer` · `/my-analyses` · `/library` · `/guide` · `/mathematics` · `/land-glossary` · `/about` · `/privacy`

## Invariants

- `etbTapped` **boolean** · `toCloneableDeckCards` · hypergeom SSOT · Karsten N/60 · EDH T4–T8 · P1≥P2 · Fisher-Yates
- Multi-color reco : WUBRG spell identity only
- Sentry : SDK installé ; **init off** sans `VITE_SENTRY_DSN`
- Share : **hash** `#d=` (legacy `?d=` rewrite → hash)
- Privacy Reset : wipe localStorage + IDB Scryfall
- land SSOT · Scryfall via `http.ts` · SW killer `public/sw.js` **conservé**
