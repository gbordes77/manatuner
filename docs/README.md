# Documentation ManaTuner

> **Produit live :** [manatuner.app](https://www.manatuner.app) · **v2.7.9** · Engine stamp `Engine v2.7.9`  
> **SHA prod live :** `fdef163`  
> **SHA code main (hygiène T02–T05) :** `332501d`  
> **Racine repo (docs actives) :** `README.md` · `LAUNCH.md` · `SESSION_START.md` · `CHANGELOG.md` · `Claude.md` · `AUDIT_EVOLUTIONS.md`

Ce dossier regroupe **toute** la documentation hors racine minimale.  
Tooling générique (`.claude/`, `_bmad/`) n’est **pas** document produit.

---

## Démarrage (ordre de lecture)

| Priorité | Fichier                                                          | Rôle                                    |
| -------- | ---------------------------------------------------------------- | --------------------------------------- |
| 1        | [`../SESSION_START.md`](../SESSION_START.md)                     | Boot agent / dev                        |
| 2        | [`session/HANDOFF_NEXT.md`](session/HANDOFF_NEXT.md)             | Priorités suite (à jour)                |
| 3        | [`session/HANDOFF_2026-08-02.md`](session/HANDOFF_2026-08-02.md) | SSOT session tech T02–T05               |
| 4        | [`../AUDIT_EVOLUTIONS.md`](../AUDIT_EVOLUTIONS.md) §7            | Journal audit evolutions (FAIT / reste) |
| 5        | [`../LAUNCH.md`](../LAUNCH.md)                                   | **Priorité business = distribution**    |
| 6        | [`product/STATUS.md`](product/STATUS.md)                         | État produit condensé                   |
| 7        | [`session/HANDOFF_2026-08-01.md`](session/HANDOFF_2026-08-01.md) | SSOT journée produit A→I (08-01)        |

---

## Arborescence

```
docs/
├── README.md                 ← ce fichier (index)
├── product/                  État produit, stratégie, idées
│   ├── STATUS.md             ⭐ vérité produit (prod + code)
│   ├── PRODUCT_STRATEGY.md
│   ├── FUTURE_IDEAS.md
│   └── EXPERT_ANALYSES.md
├── session/                  Handoffs & journaux récents
│   ├── HANDOFF_NEXT.md       ⭐ priorités suite
│   ├── HANDOFF_2026-08-02.md T02–T05 hygiène
│   ├── HANDOFF_2026-08-01.md journée produit sécu/personas
│   ├── SECURITY_AUDIT_2026-08-01.md
│   ├── PERSONA_AUDIT_2026-08-01.md
│   └── …
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
```

---

## Classes (rappel audit 2026-08-01)

| Classe | Contenu                                            | Traitement                               |
| ------ | -------------------------------------------------- | ---------------------------------------- |
| **A**  | État produit / session / handoff / STATUS / LAUNCH | Lire en premier ; tenir à jour           |
| **B**  | Historique archive (vagues, audits passés)         | Référence ; ne pas rouvrir comme backlog |
| **C**  | Tooling / agent                                    | Hors vérité produit                      |
| **D**  | Légal / contrib                                    | Stable                                   |
| **E**  | Obsolète / dupliqué                                | Archiver ou corriger si claim faux       |

---

_Priorité business = distribution (`LAUNCH.md`), pas feature gratuite._
