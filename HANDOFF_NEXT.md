# HANDOFF — Prochaines étapes ManaTuner

> **À jour :** 2026-08-01 · **Live :** v2.7.6 · **Prod :** https://www.manatuner.app/  
> **Repo :** https://github.com/gbordes77/manatuner

---

## Phrase à copier-coller (nouvelle conversation)

```
Lis SESSION_START.md et HANDOFF_NEXT.md à la racine de ManaTuner
(/Volumes/DataDisk/_Projects/Project Mana base V2).

Contexte : ManaTuner v2.7.6 est en prod (React/Vite/MUI, port 3000, 100% client-side).
Vagues A–F déjà shippées : trust P0, UX, EDH/Limited format, Karsten N/60, command zone T4–T8,
etbTapped boolean, Monte Carlo seed, archetype mulligan lisible, a11y smoke EN, cast mobile.

Règles owner : local d’abord → valider → push/prod UNIQUEMENT si je dis « go prod ».
Privacy : pas de backend decklists, pas d’analytics decklist, pas de Sentry DSN sans scrubber.

Priorités suggérées (choisir 1–2 par session) :
1) Distribution / LAUNCH.md (fireshoes, Discord, créateurs) — le produit est shippable, manque d’utilisateurs
2) P2-7 prerender marketing (scripts/prerender.mjs)
3) P2-1 polish UI (moins MUI default / emoji)
4) A11y plus profond si besoin (suite smoke existe ; pas un audit WCAG 0-violation)
5) Ne PAS rouvrir Moxfield URL, i18n FR, backend, Sentry prod, analytics decklist sans décision owner

Commence par git status + npm run test:unit pour confirmer l’état, puis propose la tranche et attends mon OK avant de coder large.
Mets à jour SESSION_START.md + HANDOFF_NEXT.md + JOURNAL_AUDIT_IMPLEMENTATION.md en fin de session.
```

---

## État produit (résumé 30 s)

|             |                                                                              |
| ----------- | ---------------------------------------------------------------------------- |
| **Quoi**    | Analyzeur de manabase MTG (lands + rocks/dorks K=3 + mulligan Bellman)       |
| **Diff**    | Compte les producteurs non-land ; 100 % local                                |
| **Formats** | 40c Limited · 60c Constructed · 100c Commander (horizon T4–T8, command zone) |
| **Tests**   | ~362 unit · E2E core/tabs/a11y smoke chromium verts au ship F                |

---

## Backlog priorisé pour la suite

### P0 distribution (recommandé par LAUNCH.md)

Le produit est prêt. Priorité business = utilisateurs, pas features gratuites.

1. Contenu / RT @fireshoes (deck 5-0 + screenshot castabilité)
2. Discord MTG existants (répondre “combien de lands ?” avec lien)
3. DMs créateurs (LegenVD, etc.)
4. SEO long terme (article “How many lands…”)

### P1 produit (optionnel)

| ID        | Travail                         | Notes                                |
| --------- | ------------------------------- | ------------------------------------ |
| P2-7      | Prerender / SSG pages marketing | `scripts/prerender.mjs`              |
| P2-1      | Polish visuel                   | Moins générique MUI                  |
| P2-5+     | Castabilité mobile              | Base faite en F ; itérer si feedback |
| A11y deep | Violations axe non-critical     | Smoke EN en place                    |

### Différé / ne pas faire sans owner

- Import URL Moxfield (ToS/CORS)
- i18n FR
- Backend decks / Sentry prod / analytics decklist

---

## Points techniques à ne pas casser

- `etbTapped` = **boolean** sur `DeckCard` (jamais une fonction)
- Worker mulligan : toujours `toCloneableDeckCards` avant `postMessage`
- Hypergeom SSOT : `src/services/castability/hypergeom.ts`
- Karsten 100c : scale N/60 via `scaleKarstenSources` dans `deckFormat.ts`
- Command zone : `*CMDR*` / section Commander / premier non-land 99–100
- P1 ≥ P2 même moteur castabilité

---

## Smoke checklist prod

```
/analyzer?sample=edh     → Commander, T4–T8, Atraxa Command zone
/analyzer?format=commander
/analyzer                → Try Example → 5 tabs + Mulligan archetypes
Footer                   → Feedback + contraste OK
```

---

## Fichiers d’entrée session

| Fichier                           | Rôle                       |
| --------------------------------- | -------------------------- |
| `SESSION_START.md`                | État technique + règles    |
| `HANDOFF_NEXT.md`                 | Ce fichier + phrase coller |
| `LAUNCH.md`                       | Plan distribution          |
| `JOURNAL_AUDIT_IMPLEMENTATION.md` | Historique vagues A–F      |
| `Claude.md`                       | Conventions projet         |

---

_Fin handoff. Après chaque vague : mettre à jour la phrase coller si les priorités changent._
