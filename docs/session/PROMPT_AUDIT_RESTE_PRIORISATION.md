# PROMPT — Priorisation expert du reste AUDIT_EVOLUTIONS.md

> **Usage :** coller le bloc « PROMPT EXÉCUTABLE » dans une **nouvelle conversation** (Grok / Claude / etc.).  
> **Date :** 2026-08-02  
> **Mode :** **ANALYSE UNIQUEMENT** — ne pas coder, ne pas commit, ne pas ouvrir de PR.  
> **Objectif :** dire **quoi faire ensuite** parmi le non-implémenté, **pourquoi**, et **dans quel ordre** — en confrontant l’audit au **produit réel** ManaTuner.

---

## Contexte factuel (vérité 2026-08-02)

|                                |                                                                                     |
| ------------------------------ | ----------------------------------------------------------------------------------- |
| **Produit**                    | ManaTuner — SPA manabase MTG 100 % client, privacy-first                            |
| **Prod**                       | https://www.manatuner.app                                                           |
| **Ship tech hygiène**          | SHA **`10845c7`** — T01 + T06–T15 + QW1–3 + AM1/AM4/AM6                             |
| **Base antérieure**            | `332501d` T02–T05 ; sécu share/wipe déjà en v2.7.9                                  |
| **Dependabot**                 | **OFF** (`0ae8295` — `dependabot.yml` supprimé)                                     |
| **Tests unit**                 | ~440 pass / 2 skip                                                                  |
| **Priorité business owner**    | **`LAUNCH.md`** (distribution / utilisateurs) — pas de feature gratuite             |
| **Interdits owner sauf ordre** | Moxfield URL, i18n FR, backend, `VITE_SENTRY_DSN`, analytics decklist               |
| **SSOT audit**                 | `AUDIT_EVOLUTIONS.md` (surtout §2 matrice, §5 produit, §6 AM/IN/QW, **§7 journal**) |
| **Boot**                       | `SESSION_START.md` · `docs/product/STATUS.md` · `SECURITY.md`                       |

### Déjà FAIT (ne pas re-proposer comme « à faire »)

**T01–T15** (tech) · **QW1, QW2, QW3** · **AM4** (= QW1) · **AM6** (nightly a11y/visual non bloquant) · **AM1 partiel** (budget bundle bloquant + `npm audit --omit=dev --audit-level=critical` ; e2e/a11y en **nightly**, pas gate PR) · SW killer conservé · Dependabot **volontairement off**.

### Encore NON FAIT ou PARTIEL (à prioriser)

#### Produit (AUDIT §5)

| ID      | Intitulé court                                                                                                                                                      |
| ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **P01** | UX adaptative par profil joueur (densité / métriques / onboarding)                                                                                                  |
| **P02** | Mode Commander « monolithe » — **attention** : EDH first-class déjà largement livré en v2.7.x (T4–T8, command zone, Karsten N/60) — ne pas traiter comme greenfield |
| **P03** | Mana Stats Card / export viral PNG-Discord                                                                                                                          |
| **P04** | OCR decklist physique (Tesseract worker) = **IN1**                                                                                                                  |

#### Innovations (AUDIT §6)

| ID      | Intitulé                             | Verdict d’origine dans l’audit          |
| ------- | ------------------------------------ | --------------------------------------- |
| **IN1** | OCR on-device                        | ★ retenu pour plan                      |
| **IN2** | Suggestions substitution de terrains | recommandé suite                        |
| **IN3** | Meta prediction / scraping           | différé (backend)                       |
| **IN4** | WebLLM explications                  | rejeté pour l’instant                   |
| **IN5** | Import URL Moxfield/Archidekt        | quick win — **owner freeze** sans ordre |

#### Angles morts techniques (AUDIT §6)

| ID      | Intitulé                                                    | Note                                            |
| ------- | ----------------------------------------------------------- | ----------------------------------------------- |
| **AM2** | Observabilité (Web Vitals / télémétrie opt-in / Sentry DSN) | privacy gate                                    |
| **AM3** | PWA offline réel (Workbox)                                  | vs SW killer actuel                             |
| **AM5** | Collab temps réel                                           | implique backend / P2P — différé volontairement |

#### Résidus techniques optionnels (pas des features)

| Sujet     | Écart vs brief max                                                                  |
| --------- | ----------------------------------------------------------------------------------- |
| AM1       | e2e core **bloquant** sur PR (aujourd’hui nightly) ; seuil **coverage** %           |
| T14       | ESLint flat / `moduleResolution: bundler` / `noUnusedLocals` (pas fait en big-bang) |
| T12       | mana.css encore render-blocking (CSP-safe)                                          |
| T08       | deckAnalyzer encore gros (parser/resolver extraits, pas « slim total »)             |
| T15       | majors deps (ESLint 8, vercel CLI…) non forcées ; Dependabot **off**                |
| npm audit | high `react-router` (RSC) non patché (fix force = downgrade)                        |

---

## PROMPT EXÉCUTABLE (coller tel quel)

```text
RÔLE
Tu es un staff product + tech lead (MTG tools / SPA privacy-first).
Tu ANALYSES le reste NON IMPLÉMENTÉ de AUDIT_EVOLUTIONS.md pour ManaTuner.
Tu ne codes PAS. Tu ne proposes PAS de re-faire T01–T15 / QW déjà shippés.
Tu livres une RECOMMANDATION de priorisation actionnable pour l’owner solo.

CONTEXTE
- SPA manabase MTG 100 % client, privacy-first, zéro backend decklist.
- Prod : https://www.manatuner.app · ship tech hygiène 10845c7 (T01–T15+QW+AM1/4/6).
- Dependabot OFF (choix owner — ne pas recommander de le réactiver sauf argument fort).
- Priorité business déclarée : LAUNCH.md (distribution / utilisateurs), pas feature gratuite.
- Interdits sans ordre explicite : Moxfield URL, i18n FR, backend, VITE_SENTRY_DSN, analytics decklist.
- Lire : SESSION_START.md, LAUNCH.md, docs/product/STATUS.md, SECURITY.md,
  AUDIT_EVOLUTIONS.md §2 + §5 + §6 + §7, docs/session/PROMPT_AUDIT_RESTE_PRIORISATION.md
  (ce brief), docs/personas/mtg-player-personas.md (si besoin UX).
- Croiser le CODE réel (grep) pour ne pas recommander ce qui est déjà livré
  (surtout P02 EDH : beaucoup déjà en v2.7.x).

PÉRIMÈTRE À ÉVALUER (uniquement non-fait / partiel)
- P01, P02 (re-scope vs EDH existant), P03, P04/IN1
- IN2, IN3, IN4, IN5
- AM2, AM3, AM5
- Résidus optionnels : AM1 e2e PR gate, coverage gate, T14 tooling big-bang,
  fonts non-blocking, slim deckAnalyzer, react-router high advisory

HORS PÉRIMÈTRE
- T01–T15, QW1–3, AM4, AM6, Dependabot (déjà décidé OFF)
- Implémentation, commits, deploys, refactors « pour le plaisir »

MÉTHODE (obligatoire)
1. Pour chaque ID : statut réel (non fait / partiel / déjà largement livré / obsolète).
2. Scorer 1–5 sur : Impact utilisateurs, Effort, Alignement privacy/frugalité,
   Alignement LAUNCH (distribution), Risque technique/RGPD, Différenciation MTG.
3. Dire explicitement CE QUI NE FAUT PAS FAIRE maintenant et pourquoi.
4. Proposer un TOP 3 « à faire » max + 1 option « quick win » si pertinent,
   avec ordre et critères de go/no-go.
5. Si le meilleur ROI n’est PAS du code (ex. LAUNCH distribution) : le dire en premier.
6. Ne pas inventer de métriques d’usage absentes — ManaTuner n’a quasi pas d’analytics.

FORMAT DE SORTIE (FR)
A. Verdict en 5 lignes (quoi faire / ne pas faire)
B. Tableau ID | statut réel | score impact | score effort | recommandation (faire / différer / abandonner) | pourquoi
C. Top 3 ordonné + justification
D. Anti-top (ne pas toucher) + pourquoi
E. Si code un jour : prérequis / pièges (privacy, bundle, EDH qty, SW killer)
F. Une phrase owner : « La prochaine action est … »

RÈGLES
- Honnête : P02 n’est pas un rebuild from zero si le code EDH existe.
- IN5 / Moxfield : freeze owner — recommander seulement si cas d’usage prouvé.
- AM2 Sentry DSN : checklist SECURITY.md obligatoire si oui.
- AM3 PWA : ne pas casser le SW killer sans plan d’éviction.
- AM5 collab : coût architecture vs frugalité.
- Pas de feature gratuite sans lien utilisateurs (LAUNCH).

COMMENCE
1. Lire docs listées + §7 pour la liste FAIT.
2. Grep code pour P02/EDH, share, privacy, Sentry, PWA.
3. Produire le rapport FR structuré.
4. STOP — pas d’implémentation.
```

---

## Notes pour l’owner

- Ce prompt est **décisionnel**, pas d’exécution.
- Après le rapport expert : tu choisis **1** piste max, ou **LAUNCH only**.
- Pour réactiver Dependabot plus tard : recréer `.github/dependabot.yml` sans assignees si tu veux du silence.
