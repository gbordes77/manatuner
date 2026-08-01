# SESSION_START — ManaTuner (lire en premier)

> **Date :** 2026-08-01  
> **Branche live :** `main` @ **`7febc34`** · **v2.7.6** (vague F)  
> **Prod :** https://www.manatuner.app/  
> **Repo :** https://github.com/gbordes77/manatuner  
> **Handoff prochaines étapes :** `HANDOFF_NEXT.md`

Lis ce fichier + `HANDOFF_NEXT.md` avant de coder.  
Journal détaillé : `JOURNAL_AUDIT_IMPLEMENTATION.md`.

---

## 0. Règles owner

1. Local d’abord → `http://localhost:3000`
2. Valider avec l’utilisateur
3. **Prod uniquement si « go prod »** explicite (pas de chèque en blanc)
4. Privacy client-side (pas de backend decklists / analytics decklist)
5. `LAUNCH.md` : prioriser ce qui amène des utilisateurs

---

## 1. Stack & commandes

- React 18 + TS + Vite + MUI · port **3000** · Vercel
- Routes : `/`, `/analyzer`, `/my-analyses`, `/library`, `/guide`, `/mathematics`, `/land-glossary`

```bash
cd "/Volumes/DataDisk/_Projects/Project Mana base V2"
npm run dev
npm run test:unit
npx tsc --noEmit
npx playwright test tests/e2e/core-flows/ tests/e2e/tabs/ \
  tests/e2e/accessibility/a11y.spec.js --project=chromium
```

---

## 2. Ce qui est en prod (vagues A–F)

| Vague | Contenu                                                     | Version   |
| ----- | ----------------------------------------------------------- | --------- |
| A     | Worker Mulligan, P1/P2 cast, Health Score, E2E              | 2.7.x     |
| B     | Learn nav, feedback permanent, empty states                 |           |
| C     | Auto-format EDH/Limited, play/draw, sideboard               | 2.7.3     |
| D     | Karsten N/60, horizon EDH initial                           | 2.7.4     |
| E     | Command zone + T4–T8                                        | 2.7.5     |
| **F** | etbTapped bool, MC seed, archetype UX, a11y EN, cast mobile | **2.7.6** |

### Vague F (détail)

- `DeckCard.etbTapped: boolean` (plus de fonction) + `landMetadata` conditionnels
- `createSeededRng` / `analyzeWithArchetype(..., { seed })`
- Mulligan archetype lisible + auto-suggest avg CMC
- Footer contraste ; `a11y.spec.js` EN smoke
- Castability mobile (padding + hint)

**Tests F :** unit 362 · tsc OK · E2E 15 pass · build OK

---

## 3. Fichiers critiques

| Domaine                       | Fichiers                                    |
| ----------------------------- | ------------------------------------------- |
| Format / EDH / Karsten scale  | `src/utils/deckFormat.ts`                   |
| Parse / etbTapped / commander | `src/services/deckAnalyzer.ts`              |
| Mulligan + seed               | `src/services/mulliganSimulatorAdvanced.ts` |
| Castabilité UI                | `ManaCostRow.tsx`, `CastabilityTab.tsx`     |
| Archetype UI                  | `MulliganTab.tsx`                           |
| Footer                        | `src/components/layout/Footer.tsx`          |

**Invariant math :** Perfect drops (P1) ≥ Realistic lands-only (P2), même moteur.

---

## 4. Backlog restant → voir `HANDOFF_NEXT.md`

---

## 5. Smoke prod

1. `/analyzer?sample=edh` → T4–T8, Command zone Atraxa
2. Mulligan → archetypes lisibles
3. Feedback header + footer
4. Footer texte lisible (contraste)

---

_Mets à jour ce fichier + HANDOFF_NEXT.md à chaque vague livrée._
