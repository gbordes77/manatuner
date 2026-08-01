# HANDOFF — Prochaines étapes ManaTuner

> **À jour :** 2026-08-01 fin de journée · **Live :** **v2.7.7** · **SHA :** `f0e5d7f`  
> **Prod :** https://www.manatuner.app/ · **Repo :** https://github.com/gbordes77/manatuner  
> **Handoff journée complète (source de vérité) :** **`HANDOFF_2026-08-01.md`**

---

## Phrase à copier-coller (nouvelle conversation)

```
Lis en premier et en entier HANDOFF_2026-08-01.md à la racine de ManaTuner
(/Volumes/DataDisk/_Projects/Project Mana base V2). C’est le handoff ULTRA-PRÉCIS
de TOUTE la journée 2026-08-01 (vagues A→G + fix deploy), pas seulement une session.

Ensuite : AUDIT DOCUMENTAIRE TOTAL — ne code pas de feature tant que ce n’est pas fait.

PÉRIMÈTRE = TOUTES les docs du dossier projet, pas une shortlist.
1) Inventorie EXHAUSTIVEMENT tous les fichiers documentation dans
   /Volumes/DataDisk/_Projects/Project Mana base V2 :
   - tous les *.md, *.mdx, *.txt (et README* / CHANGELOG* / HANDOFF* / *AUDIT* / *JOURNAL*)
   - racine + sous-dossiers (docs/, public/ si docs, .claude/ si md de process projet, etc.)
   - EXCLURE seulement : node_modules/, .git/, dist/, coverage/, playwright-report/,
     test-results/, .claude/worktrees/ (copies isolées, pas la vérité produit)
2) Classe chaque doc : (A) état produit / session / handoff, (B) historique archive,
   (C) tooling/agent générique, (D) légal/contrib, (E) obsolète/dupliqué.
3) Pour TOUTE doc de classe A (et toute doc B/C qui affirme version, SHA, feature “faite”,
   “encore ouvert”, “en prod”, scores, routes, privacy) : croise avec réalité via
   git log / origin/main, package.json, code (grep + lecture), live https://www.manatuner.app.
4) Produis un rapport d’écarts doc-par-doc (claim → vrai/faux → preuve → action).
5) METS À JOUR les docs pour aligner sur la réalité : v2.7.7, SHA f0e5d7f, vagues A–G,
   backlog restant, invariants. Marque explicitement les archives obsolètes ou corrige-les.
   Ne laisse pas de claim faux “encore ouvert” pour des items déjà shippés le 2026-08-01.
6) Ne rouvre pas Moxfield URL, i18n FR, backend, Sentry DSN, analytics decklist sans owner.
7) Après alignement docs : priorité business = LAUNCH.md (distribution), pas features gratuites.

Confirme l’alignement doc↔code↔prod (inventaire exhaustif fait) avant toute nouvelle tranche de code.
```

---

## État 30 s

|             |                                                               |
| ----------- | ------------------------------------------------------------- |
| **Version** | **2.7.7** live (`Engine v2.7.7`)                              |
| **SHA**     | `f0e5d7f` (fix deploy) · feature G `ac8371e`                  |
| **Tests**   | ~369 unit · E2E core/tabs/a11y chromium verts fin G           |
| **Journée** | Vagues **A→G** shippées — détail dans `HANDOFF_2026-08-01.md` |

---

## Priorités suite

1. **Audit + alignement docs** (mission phrase ci-dessus)
2. **Distribution** (`LAUNCH.md`) — utilisateurs
3. Optionnel : prerender HTML réel sur Vercel (deps Chromium) ; polish UI plus large ; a11y deep

**Ne pas** sans owner : Moxfield URL, i18n FR, backend, Sentry prod, analytics decklist.

---

_Voir `HANDOFF_2026-08-01.md` pour le détail commit-par-commit et fichier-par-fichier._
