# Documentation ManaTuner

> **Produit live :** [manatuner.app](https://www.manatuner.app) · **v2.7.7** · Engine stamp `Engine v2.7.7`  
> **SHA référence (fix deploy jour 2026-08-01) :** `f0e5d7f`  
> **Racine repo (docs actives) :** `README.md` · `LAUNCH.md` · `SESSION_START.md` · `CHANGELOG.md` · `CLAUDE.md`

Ce dossier regroupe **toute** la documentation hors racine minimale.  
Tooling générique (`.claude/`, `_bmad/`) n’est **pas** document produit.

---

## Démarrage (ordre de lecture)

| Priorité | Fichier                                                          | Rôle                                 |
| -------- | ---------------------------------------------------------------- | ------------------------------------ |
| 1        | [`../SESSION_START.md`](../SESSION_START.md)                     | Boot agent / dev                     |
| 2        | [`session/HANDOFF_2026-08-01.md`](session/HANDOFF_2026-08-01.md) | SSOT journée A→G                     |
| 3        | [`session/HANDOFF_NEXT.md`](session/HANDOFF_NEXT.md)             | Priorités suite                      |
| 4        | [`../LAUNCH.md`](../LAUNCH.md)                                   | **Priorité business = distribution** |
| 5        | [`product/STATUS.md`](product/STATUS.md)                         | État produit condensé prod           |

---

## Arborescence

```
docs/
├── README.md                 ← ce fichier (index)
├── product/                  État produit, stratégie, idées
│   ├── STATUS.md             ⭐ vérité produit v2.7.7
│   ├── PRODUCT_STRATEGY.md
│   ├── FUTURE_IDEAS.md
│   └── EXPERT_ANALYSES.md
├── session/                  Handoffs & journaux récents
│   ├── HANDOFF_2026-08-01.md
│   ├── HANDOFF_NEXT.md
│   ├── JOURNAL_AUDIT_IMPLEMENTATION.md
│   └── DOCS_AUDIT_REPORT_2026-08-01.md
├── engineering/              Architecture & systèmes
├── math/                     Hypergeom, Karsten, specs P3
├── personas/                 Personas UX MTG
├── marketing/                Contenu, identité visuelle
├── launch/                   Assets de lancement (tweets…)
├── seo/                      Stratégie SEO/AEO (snapshot)
├── security/                 Audits sécu historiques
├── performance/              Audits perf
├── sample-decks/             Decklists exemples
└── archive/                  Historique — ne pas traiter comme backlog ouvert
    ├── handoffs/
    ├── agents/               Plans/rapports phase 0, trackers
    ├── audits/
    └── *.md guides pre-prod
```

---

## Classes (rappel audit 2026-08-01)

| Classe        | Contenu                                                     | Traitement                      |
| ------------- | ----------------------------------------------------------- | ------------------------------- |
| **A** active  | `session/*`, `product/STATUS`, racine SESSION/LAUNCH/README | Maintenir à jour                |
| **B** archive | `archive/**`, audits datés                                  | Lire pour historique uniquement |
| **C** tooling | `.claude/`, `_bmad/` (hors docs/)                           | Pas vérité produit              |
| **D** légal   | racine SECURITY, LEGAL, CONTRIBUTING, CoC                   | Stable                          |

---

## Ne pas rouvrir sans owner

- Moxfield URL import
- i18n FR
- Backend decks
- **Sentry DSN en prod** (SDK + plugin installés, init **gated** — voir `SECURITY.md`)
- Analytics decklist

---

_Dernière réorg docs : 2026-08-01 · v2.7.7_
