# ManaTuner

[![Deploy Status](https://img.shields.io/badge/deploy-live-success)](https://manatuner.app)
[![React](https://img.shields.io/badge/React-18.2-61DAFB?logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Tests](https://img.shields.io/badge/Tests-404%20Passing-green)](https://github.com/gbordes77/manatuner)
[![Version](https://img.shields.io/badge/Version-2.7.9-blue)](https://github.com/gbordes77/manatuner/releases)

**Advanced MTG Manabase Analyzer** - Calculate exact probabilities for casting spells on curve and make optimal mulligan decisions.

[Live Demo](https://manatuner.app) | [Docs index](./docs/README.md) | [Product status](./docs/product/STATUS.md) | [Guide](https://manatuner.app/guide)

**Engineering handoff (2026-09-09):** see [session handoff](./HANDOFF.md) for the current expert review. Release and test figures below are historical; consult the [September correction register](./docs/engineering/SUIVI-CORRECTIONS-MANATUNER-2026-09-06.md) for correction evidence.

---

**Persona review (2026-09-10, corrected local candidate):** [latest comparative report](./docs/session/PERSONA_REAUDIT_POST_R01_R07_2026-09-10.md). Simulated score15.11/20, previously14.67/20; this is not a new production score or test run.

**Pre-communication audit preparation (2026-09-13):** [mission prompt](docs/handoff/PROMPT-AUDIT-PRECOMMUNICATION-2026-09-13.md) and [reusable test kit](docs/quality/precommunication-2026-09-13/README.md), with 48 specified cases. These are plans for future evaluation, not new passing test results.

## Overview

ManaTuner answers the fundamental question every Magic player asks: **"Can I cast my spells on curve?"**

Built on Frank Karsten's mathematical research, it provides:

- Exact hypergeometric probabilities for every spell
- Monte Carlo mulligan simulations (10,000 hands, configurable up to 50k)
- Turn-by-turn castability analysis
- Optimal land count recommendations
- A curated reading library of **54 essential MTG resources** across **5 format-aware tracks** (Your First FNM · Preparing for an RCQ · Pro Tour · 👑 Commander Pod · 📦 Limited Draft/Sealed), with full-text search, URL-stateful filters (category × level × language × medium), localStorage reading progress, per-article detail pages (`/library/:slug`), author indexes (`/library/author/:slug`), BibTeX citation export, and RSS + JSON feeds. Karsten, PVDDR, Saito, Chapin, Reid Duke, Zvi, Wizards Brackets 2024, Command Zone, Game Knights, EDHREC, Limited Resources, 17lands, Le Podcaster Mage FR, Battle Chads — many recovered via archive.org.

**100% client-side** — no ManaTuner server stores decks; Scryfall resolves card names; share links use a URL hash (`#d=`).

**Current release:** **v2.7.9** (2026-08-01) — security remediations: hash share links, complete privacy wipe, CSP docs alignment, dependency bumps (on top of persona polish 2.7.8 + EDH/Limited waves).  
**Day log:** `docs/session/HANDOFF_2026-08-01.md` · **Next:** `docs/session/HANDOFF_NEXT.md` · **Status:** `docs/product/STATUS.md` · **Security:** `docs/session/SECURITY_AUDIT_2026-08-01.md` · **Business:** `LAUNCH.md` (distribution).  
**Docs layout:** all product docs under `docs/` — see `docs/README.md`. Root keeps only README / LAUNCH / SESSION_START / CHANGELOG / CLAUDE / legal.

---

## Features

| Feature                    | Description                                                                                                                                                                                                                                                                                                                                                                                                                             |
| -------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Castability Analysis**   | Exact probability of casting each spell on curve, turn by turn                                                                                                                                                                                                                                                                                                                                                                          |
| **Post-Board Analysis**    | Sideboard auto-detected from any format; swap cards in/out to see post-board castability                                                                                                                                                                                                                                                                                                                                                |
| **Creature-Aware Sources** | Lands like Cavern of Souls correctly count as colored sources only for creature spells                                                                                                                                                                                                                                                                                                                                                  |
| **Analysis Dashboard**     | Visual breakdown of spells by category, curve insights, performance diagnostics                                                                                                                                                                                                                                                                                                                                                         |
| **Mana Acceleration**      | Detects 13 ramp types: dorks, rocks, rituals, land auras, land ramp, doublers, landfall, and more                                                                                                                                                                                                                                                                                                                                       |
| **Mulligan Simulator**     | Monte Carlo simulation with optimal keep/mulligan thresholds                                                                                                                                                                                                                                                                                                                                                                            |
| **Reading Library**        | 54 curated MTG resources in **5 tracks** (First FNM / RCQ / Pro Tour / 👑 Commander Pod / 📦 Limited). Full-text search, URL-stateful multi-axis filters, localStorage reading progress + bookmarks (privacy-first), per-article detail pages at `/library/:slug`, author indexes at `/library/author/:slug`, BibTeX + Markdown exports, RSS + JSON feeds, dynamic sitemap. Many live; archive.org + mirror fallbacks for the classics. |
| **Export Blueprint**       | Download analysis as PNG, PDF, or JSON for sharing                                                                                                                                                                                                                                                                                                                                                                                      |
| **Multi-Format Support**   | First-class sample decks for all three format families: Limited (40 — Selesnya draft), Constructed (60 — Aggro / Midrange / Control), Commander (100 — Atraxa Superfriends). QuickVerdict calibrates tier bands per format.                                                                                                                                                                                                             |
| **Privacy-First**          | All data stored locally in your browser — nothing sent to our servers                                                                                                                                                                                                                                                                                                                                                                   |

---

## Quick Start

### Use Online (Recommended)

Visit **[manatuner.app](https://manatuner.app)** - no installation required.

### Local Development

```bash
# Prerequisites: Node.js 18+
node --version  # v18.0.0 or higher

# Clone and install
git clone https://github.com/gbordes77/manatuner.git
cd manatuner
npm install

# Start development server
npm run dev
# Open http://localhost:3000

# Run tests
npm run test:unit    # Unit tests (Vitest)
npm run test:e2e     # E2E tests (Playwright)
```

---

## How It Works

```
1. Paste Your Deck     2. Get Probabilities     3. Know Your Mulligans
   MTGO, MTGA, or         Cast chances for          Optimal thresholds
   Moxfield format        every spell/turn          for your archetype
```

### Supported Formats

- **MTGO/MTGA**: `4 Lightning Bolt` or `4 Lightning Bolt (M21) 199`
- **Moxfield**: `4x Lightning Bolt`
- **Sideboard**: Auto-detected via `Sideboard` marker, `SB:` prefix, or blank line separator
- **Full 75**: Paste main + sideboard in one block — ManaTuner splits them automatically

### One-Click Sample Decks

| Format family | URL param                         | Sample                                |
| ------------- | --------------------------------- | ------------------------------------- |
| Constructed   | `?sample=aggro`                   | Mono-Red Aggro (60 cards)             |
| Constructed   | `?sample=midrange` or `?sample=1` | Nature's Rhythm Simic (60 cards)      |
| Constructed   | `?sample=control`                 | Azorius Control (60 cards)            |
| Commander     | `?sample=edh`                     | Atraxa Superfriends (100 cards, WUBG) |
| Limited       | `?sample=limited`                 | Selesnya draft pool (40 cards)        |

Each sample loads with `deckName` pre-populated and the URL cleaned. The AnalyzerPage empty state exposes the same five decks as one-click buttons.

---

## Mathematical Foundation

ManaTuner implements Frank Karsten's research on manabase optimization.

### Core Formulas

**Hypergeometric Distribution**

```
P(X = k) = C(K,k) * C(N-K,n-k) / C(N,n)

N = Deck size (60)
K = Mana sources in deck
n = Cards seen (hand + draws)
k = Sources needed
```

**Cards Seen by Turn**

```
On the play: 7 + turn - 1
On the draw: 7 + turn
```

### Karsten Tables (90% Probability)

| Colored Symbols | Turn 1 | Turn 2 | Turn 3 | Turn 4 |
| --------------- | ------ | ------ | ------ | ------ |
| 1 symbol        | 14     | 13     | 12     | 11     |
| 2 symbols       | -      | 20     | 18     | 16     |
| 3 symbols       | -      | -      | 23     | 20     |

**Reference**: [Frank Karsten - How Many Lands Do You Need?](https://strategy.channelfireball.com/all-strategy/mtg/channelmagic-articles/how-many-lands-do-you-need-to-consistently-hit-your-land-drops/)

---

## Tech Stack

| Layer    | Technology                        |
| -------- | --------------------------------- |
| Frontend | React 18, TypeScript, Material-UI |
| State    | Redux Toolkit, React Query        |
| Build    | Vite (ES2015 target)              |
| Testing  | Vitest, Playwright                |
| Hosting  | Vercel Edge Network               |
| Storage  | localStorage (client-only)        |

---

## Project Structure

```
src/
├── components/           # React components
│   ├── analyzer/        # Deck analysis UI
│   ├── analysis/        # Results visualization
│   ├── common/          # Shared UI components
│   └── layout/          # Header, Footer, Navigation
├── hooks/               # Custom React hooks
│   ├── useDeckAnalysis  # Main analysis orchestration
│   ├── useManaCalculations
│   └── useMonteCarloWorker
├── pages/               # Route pages
├── services/            # Business logic
│   ├── manaCalculator   # Hypergeometric calculations
│   ├── advancedMaths    # Monte Carlo engine
│   ├── deckAnalyzer     # Deck parsing & analysis
│   └── landService      # Land detection & ETB logic
├── store/               # Redux slices
├── types/               # TypeScript definitions
└── utils/               # Utility functions
```

See [ARCHITECTURE.md](./docs/ARCHITECTURE.md) for detailed system documentation.

---

## Scripts

```bash
# Development
npm run dev              # Start dev server (port 3000)
npm run build            # Production build
npm run preview          # Preview production build

# Testing
npm run test:unit        # Run unit tests
npm run test:e2e         # Run E2E tests
npm run test:coverage    # Generate coverage report

# Quality
npm run lint             # ESLint check
npm run lint:fix         # Auto-fix lint issues
npm run type-check       # TypeScript validation
```

---

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Make changes with tests
4. Run quality checks: `npm run lint && npm run test:unit`
5. Commit: `git commit -m "feat: your feature"`
6. Push and create a Pull Request

### Guidelines

- All new features require tests
- Critical math must pass Frank Karsten validation tests
- TypeScript strict mode enforced
- Bundle size monitored (target: <250KB gzipped)

---

## Performance

| Metric           | Value              |
| ---------------- | ------------------ |
| Bundle Size      | 202KB gzipped      |
| Build Time       | ~20 seconds        |
| Lighthouse Score | 90+ all categories |
| Test Coverage    | 85%+ critical code |

---

## Privacy

- **100% Client-Side**: All calculations run in your browser
- **No Account Required**: Use immediately without registration
- **No Tracking**: Zero analytics cookies by default, zero telemetry beacons
- **Local Storage Only**: Your decklists and analysis history never leave your device

---

## Credits

- **[Frank Karsten](https://strategy.channelfireball.com/all-strategy/author/frank-karsten/)** - Mathematical research foundation
- **[Charles Wickham](https://github.com/WickedFridge/magic-project-manabase)** - Original Project Manabase inspiration
- **[Scryfall](https://scryfall.com/)** - MTG card data API

---

## License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

**Ready to optimize your manabase?** [Start analyzing now](https://manatuner.app)

## Product evaluation

The [September 9, 2026 persona audit](docs/session/PERSONA_AUDIT_2026-09-09.md) documents six simulated player perspectives and observed production journeys. It includes scored findings, evidence limitations, and priorities for clearer explanations and comparison workflows. This evaluation is not a user study or a mathematical certification.

Implementation follow-up is documented in the [team handoff](docs/handoff/HANDOFF-PERSONAS-2026-09-09.md) and [task journal](docs/engineering/JOURNAL-TACHES-PERSONAS-2026-09-09.md), with acceptance criteria and separate local and production verification states.

## Persona follow-up (September 2026)

Local improvements clarify the three heuristic scores, preserve calculation-limit explanations in saved comparisons, add a basic-land exact example, and adapt London mulligan help to multiplayer. Blueprint exports retain deck names and include engine version, model assumptions and separate sideboard/commander flags in CSV. See the [task journal](docs/engineering/JOURNAL-TACHES-PERSONAS-2026-09-09.md) for validation evidence and production status. The exact example is a synthetic calculation fixture, not a tournament-legal list.

The [September 10 candidate re-audit](docs/session/PERSONA_REAUDIT_2026-09-10.md) compares the corrected local artifact with the September 9 production assessment. It documents improvements, remaining issues, and differences in verification coverage; it does not establish a production deployment.

Remaining re-audit findings are tracked in the [correction and validation mission](docs/handoff/MISSION-CORRECTIONS-REAUDIT-TESTS-PUSH-2026-09-10.md), including scoped commit and branch push verification, separately from deployment.

Project contributors and agents should follow the [main-branch workflow preference](AGENTS.md#préférence-permanente-du-propriétaire--branche-principale-uniquement): work on `main`; any exceptional branch requires a substantial explanation and the owner's prior agreement.

The re-audit corrections clarify calculation modes, group unavailable comparison reasons, format comparison percentages and identify Commander library/command zones. CSV import instructions are available in the [Blueprint CSV recipe](docs/engineering/BLUEPRINT-CSV.md). The [current validation report](docs/engineering/reaudit-fixes-szrp1r9w/FINAL.md) records local evidence; this mission explicitly authorizes the dedicated branch and excludes deployment.

Vercel builds install missing Chromium system libraries on Amazon Linux before the locked npm install; prerender and delivery checks remain mandatory. See [native deployment](docs/deployment/NATIVE-DEPLOYMENT.md).

### Audit avant communication — septembre 2026

Une [campagne d’audit documentée](docs/quality/audit-precommunication-2026-09-13-r7k2/00-SYNTHESE.md) sépare les validations techniques, les défauts encore ouverts et la recherche utilisateurs à réaliser. Elle comprend des cahiers réutilisables et deux prototypes isolés ; ces prototypes ne sont pas des fonctionnalités disponibles dans l’application. Aucun changement de version ou nouvelle publication n’accompagne cette campagne.

Une [évaluation simulée de l’atelier par six personas](docs/quality/personas-atelier-2026-09-14/00-SYNTHESE.md) complète l’audit : il s’agit d’une exploration produit, sans fonctionnalité ajoutée ni validation utilisateurs.

Les évolutions proposées font systématiquement l’objet d’une revue selon les [six personas du projet](docs/personas/mtg-player-personas.md). Ces évaluations simulées complètent les tests techniques et la recherche utilisateurs, sans s’y substituer.

Documentation produit : [demande Compare révisée après revue des six personas](docs/product/EVOLUTION-COMPARE-2026-09-14.md). Spécification préparatoire, fonctionnalité non implémentée.

[Mission préparée : implémentation, validation et publication](docs/handoff/PROMPT-IMPLEMENTATION-PUBLICATION-2026-09-14.md).

### Évolutions préparées le 14 septembre 2026

Le candidat local ajoute une comparaison depuis les résultats : conserver l'analyse originale, modifier une variante, examiner les différences et sauvegarder séparément. Le partage propose un texte de contexte facultatif ; les liens conservent leur format. Blueprint fournit un rapport texte et une pagination PDF améliorée. Les références éditoriales, la compatibilité des liens, les bornes d'entrée et la cadence Scryfall sont renforcées.

La disponibilité publique de ces changements doit être vérifiée dans le [bilan de livraison](docs/engineering/implementation-publication-2026-09-14/00-SYNTHESE.md) ; cette section ne constitue pas une annonce de déploiement. Les avis par personas sont simulés et ne remplacent pas une étude utilisateurs.
