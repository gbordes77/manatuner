# État produit — ManaTuner (production)

> **Source de vérité condensée.** Détail journée : [`../session/HANDOFF_2026-08-01.md`](../session/HANDOFF_2026-08-01.md).  
> **Mis à jour :** 2026-08-01 (post persona polish **v2.7.8**)

|                     |                                                                 |
| ------------------- | --------------------------------------------------------------- |
| **Version**         | **2.7.8** (`package.json`)                                      |
| **Engine stamp UI** | `Engine v2.7.8`                                                 |
| **SHA**             | _(voir `git rev-parse --short HEAD` après push)_                |
| **Live**            | https://www.manatuner.app                                       |
| **Repo**            | https://github.com/gbordes77/manatuner                          |
| **Tests unit**      | **381** pass / 2 skip                                           |
| **Hébergement**     | Vercel · build `npm run build:vercel`                           |
| **Mode crawl**      | SPA (HTML prerender **pas** garanti en prod si Chromium absent) |

## Produit

Analyseur manabase MTG **100 % client-side** :

- Castabilité hypergeom + ramp K=3 (dorks/rocks/enhancers…)
- Mulligan Monte Carlo + Bellman · worker **clone-safe**
- Formats : Constructed / Commander (T4–T8, command zone) / Limited
- Karsten tables **scale N/60** pour 100 cartes
- Library 54 ressources, privacy localStorage
- Feedback Tally (externe, pas de decklist)

## Vagues 2026-08-01 (shippées)

| Vague | Version   | Contenu                                                  |
| ----- | --------- | -------------------------------------------------------- |
| A–B   | 2.7.x     | P0 trust, UX Learn/Feedback, Health Score                |
| C     | 2.7.3     | EDH/Limited first-class                                  |
| D     | 2.7.4     | Karsten N/60                                             |
| E     | 2.7.5     | Command zone + T4–T8                                     |
| F     | 2.7.6     | etbTapped boolean, MC seed, archetype, a11y              |
| G     | 2.7.7     | Prerender soft, polish, E2E harden                       |
| H     | **2.7.8** | Persona audit P0/P1 (Joyride, EDH colors, legend, Share) |

## Invariants

1. `DeckCard.etbTapped` = **boolean**
2. Mulligan : `toCloneableDeckCards` avant `postMessage`
3. Hypergeom SSOT : `src/services/castability/hypergeom.ts`
4. Karsten 100c : `scaleKarstenSources`
5. EDH horizon **T4–T8**
6. **P1 ≥ P2** même moteur
7. Privacy : pas de backend decklists ; Sentry **off** sans `VITE_SENTRY_DSN`
8. Fisher-Yates pour shuffles
9. Multi-color reco : **WUBRG spell identity** only (pas C, pas any-color lands)

## Routes

`/`, `/analyzer`, `/my-analyses`, `/library`, `/library/:slug`, `/library/author/:slug`, `/guide`, `/mathematics`, `/land-glossary`, `/about`, `/privacy`

## Backlog honnête

| Priorité        | Item                                                           |
| --------------- | -------------------------------------------------------------- |
| **P0 business** | Distribution — [`../../LAUNCH.md`](../../LAUNCH.md)            |
| Optionnel       | P1-3 Critical label · P1-4 empty My Analyses · P2 exports      |
| Dette math      | Dual engines ManaCostRow (inline + accel)                      |
| Sans owner      | Moxfield URL, i18n FR, backend, Sentry DSN, analytics decklist |

## Sentry (état code)

| Composant             | État                                                          |
| --------------------- | ------------------------------------------------------------- |
| `@sentry/react`       | Installé                                                      |
| `@sentry/vite-plugin` | Installé (dev) — actif seulement si `SENTRY_AUTH_TOKEN`       |
| `Sentry.init`         | **Gated** : `PROD && VITE_SENTRY_DSN`                         |
| DSN Vercel            | **Doit rester non défini** tant que privacy OK                |
| Scrubber `beforeSend` | Présent (URLs / PII / deck hints) pour activation future sûre |

---

_Ne pas proposer de features gratuites tant que `LAUNCH.md` n’est pas exécuté._
