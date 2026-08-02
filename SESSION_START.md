# SESSION_START — ManaTuner (lire en premier)

> **Date :** 2026-08-02  
> **Prod live :** **v2.7.9** · stamp **Engine v2.7.9** · SHA **`fdef163`** · https://www.manatuner.app  
> **Code remote main :** **`332501d`** (T02–T05) · **working tree :** T01+T06–T15+QW/AM **FAIT local, pas de commit**  
> **Docs index :** [`docs/README.md`](docs/README.md) · **État produit :** [`docs/product/STATUS.md`](docs/product/STATUS.md)  
> **Audit evolutions journal :** [`AUDIT_EVOLUTIONS.md`](AUDIT_EVOLUTIONS.md) §7  
> **Sécu :** [`docs/session/SECURITY_AUDIT_2026-08-01.md`](docs/session/SECURITY_AUDIT_2026-08-01.md)

## Ordre de lecture

1. **Ce fichier**
2. [`docs/session/HANDOFF_NEXT.md`](docs/session/HANDOFF_NEXT.md) — suite immédiate
3. [`docs/session/HANDOFF_2026-08-02.md`](docs/session/HANDOFF_2026-08-02.md) — session tech T02–T05
4. [`AUDIT_EVOLUTIONS.md`](AUDIT_EVOLUTIONS.md) §7 — journal T02–T05 FAIT / reste T06+
5. [`LAUNCH.md`](LAUNCH.md) — **priorité business (utilisateurs)**
6. [`docs/product/STATUS.md`](docs/product/STATUS.md) — vérité condensée
7. [`SECURITY.md`](SECURITY.md) — privacy + CSP
8. [`docs/session/HANDOFF_2026-08-01.md`](docs/session/HANDOFF_2026-08-01.md) — journée produit A→I

**Audit UX 6 personas (relançable) :**  
[`docs/session/PROMPT_PERSONA_AUDIT_NEXT.md`](docs/session/PROMPT_PERSONA_AUDIT_NEXT.md)

## Règles owner

1. Local d’abord → `http://localhost:3000`
2. Prod seulement si **« go prod »** explicite
3. Privacy client-side (pas de decklist serveur ManaTuner) ; share = hash `#d=`
4. Prioriser ce qui amène des utilisateurs (`LAUNCH.md`)
5. **Ne pas rouvrir sans owner :** Moxfield URL, i18n FR, backend, **Sentry DSN**, analytics decklist
6. Tech audit T01+T06–T15 livré en working tree — **commit seulement sur ordre owner**

## Stack & commandes

```bash
cd "/Volumes/DataDisk/_Projects/Project Mana base V2"
npm run dev          # port 3000
npm run test:unit    # 440 pass / 2 skip (post T01+T06–T15 local)
npm run build:vercel # prod Vercel (prerender soft-fail)
```

Routes : `/` · `/analyzer` · `/my-analyses` · `/library` · `/guide` · `/mathematics` · `/land-glossary` · `/about` · `/privacy`

## Invariants

- `etbTapped` **boolean** · `toCloneableDeckCards` · hypergeom SSOT · Karsten N/60 · EDH T4–T8 · P1≥P2 · Fisher-Yates
- Multi-color reco : WUBRG spell identity only
- Sentry : SDK + Vite plugin installés ; **init off** sans `VITE_SENTRY_DSN` (voir `SECURITY.md`)
- Share links : **hash** `#d=` (legacy `?d=` still loads)
- Privacy Reset : wipe analyses + `persist:root` + caches + prefs

## Smoke local / prod

1. `/analyzer?sample=edh` → Commander, T4–T8, Atraxa, **4 colors** (jamais 6)
2. First-visit `/analyzer` → **Try Example sans Skip** Joyride
3. Try Example → 5 tabs + **Engine v2.7.9** + légende Perfect/Realistic + Share (toast deck honesty)
4. Share → URL contient `#d=` (pas `?d=`)
5. Privacy Reset → `persist:root` disparu
6. Feedback header + footer

## Où est le reste des docs ?

Tout le reste est sous **`docs/`** (engineering, math, archive, personas…).  
Voir [`docs/README.md`](docs/README.md). Archives ≠ backlog ouvert.
