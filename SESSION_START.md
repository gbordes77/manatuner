# SESSION_START — ManaTuner (lire en premier)

> **Date :** 2026-08-01  
> **Prod :** **v2.7.7** · SHA **`f0e5d7f`** · https://www.manatuner.app  
> **Docs index :** [`docs/README.md`](docs/README.md) · **État produit :** [`docs/product/STATUS.md`](docs/product/STATUS.md)

## Ordre de lecture

1. **Ce fichier**
2. [`docs/session/HANDOFF_2026-08-01.md`](docs/session/HANDOFF_2026-08-01.md) — journée A→G
3. [`docs/session/HANDOFF_NEXT.md`](docs/session/HANDOFF_NEXT.md) — suite
4. [`LAUNCH.md`](LAUNCH.md) — **priorité business (utilisateurs)**
5. [`docs/product/STATUS.md`](docs/product/STATUS.md) — vérité condensée

**Audit UX 6 personas (relançable) :**  
[`docs/session/PROMPT_PERSONA_AUDIT_NEXT.md`](docs/session/PROMPT_PERSONA_AUDIT_NEXT.md) — phrase de lancement dans le fichier + `HANDOFF_NEXT` section A.

## Règles owner

1. Local d’abord → `http://localhost:3000`
2. Prod seulement si **« go prod »** explicite
3. Privacy client-side (pas de decklist serveur)
4. Prioriser ce qui amène des utilisateurs (`LAUNCH.md`)
5. **Ne pas rouvrir sans owner :** Moxfield URL, i18n FR, backend, **Sentry DSN**, analytics decklist

## Stack & commandes

```bash
cd "/Volumes/DataDisk/_Projects/Project Mana base V2"
npm run dev          # port 3000
npm run test:unit    # 369 pass / 2 skip
npm run build:vercel # prod Vercel (prerender soft-fail)
```

Routes : `/` · `/analyzer` · `/my-analyses` · `/library` · `/guide` · `/mathematics` · `/land-glossary` · `/about` · `/privacy`

## Invariants

- `etbTapped` **boolean** · `toCloneableDeckCards` · hypergeom SSOT · Karsten N/60 · EDH T4–T8 · P1≥P2 · Fisher-Yates
- Sentry : SDK + Vite plugin installés ; **init off** sans `VITE_SENTRY_DSN` (voir `SECURITY.md`)

## Smoke prod

1. `/analyzer?sample=edh` → Commander, T4–T8, Atraxa
2. Try Example → 5 tabs + **Engine v2.7.7**
3. Feedback header + footer

## Où est le reste des docs ?

Tout le reste est sous **`docs/`** (engineering, math, archive, personas…).  
Voir [`docs/README.md`](docs/README.md). Archives ≠ backlog ouvert.
