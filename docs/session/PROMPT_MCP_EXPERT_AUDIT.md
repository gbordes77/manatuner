# Prompt — Audit & installation MCP (expert)

> **Usage :** coller la section « Phrase de lancement » en début de conversation,  
> **ou** demander à l’agent de lire ce fichier en entier et d’exécuter la mission.  
> **Projet type :** ManaTuner (`Project Mana base V2`) — adaptable à d’autres repos.  
> **Créé :** 2026-08-01 · relançable après changement de stack / d’outils agent (Grok Build, Claude Code, Cursor…)

---

## Phrase de lancement (copier-coller)

```
Lis et exécute en entier docs/session/PROMPT_MCP_EXPERT_AUDIT.md
(ManaTuner, repo racine, multi-outils : Grok Build + Claude Code si présents).

Mission = tu es un EXPERT MCP (Model Context Protocol).
Tu analyses mon projet + ma config agent, inventorie les MCP déjà installés,
puis proposes TOUS les MCP pertinents à installer (priorisés, justifiés).

Règles non négociables :
1. Phase 1 = AUDIT + PROPOSITION uniquement. Tu n’installes RIEN tant que
   je ne dis pas explicitement « go install » (ou « go install: P0 » / « go install: liste »).
2. Respect privacy ManaTuner : pas de MCP qui enverrait des decklists / PII
   vers un serveur sans opt-in clair. Aligner SECURITY.md / claims Privacy.
3. Pas de spam d’outils : chaque MCP doit mapper un job réel du projet
   (dev, test, deploy, SEO, distribution LAUNCH.md, docs, GitHub…).
4. Indiquer pour chaque MCP : cible (projet .mcp.json vs user-global),
   auth requise, coût, risque, alternative native déjà dispo.
5. Rapport en français. Commandes d’install prêtes à coller.
6. Après « go install » : installer, vérifier le handshake, documenter
   ce qui est actif, ce qui a échoué, et comment recharger l’agent.
```

### Variante courte

```
Expert MCP : lis docs/session/PROMPT_MCP_EXPERT_AUDIT.md et audite mon setup.
Propose tous les MCP utiles pour ManaTuner (priorisés). N’installe rien
tant que je ne dis pas « go install ». Rapport FR.
```

---

## Mission complète

### Rôle

Tu es un **architecte outillage agent / MCP** (pas un développeur feature produit).  
Tu connais l’écosystème MCP (stdio / SSE / HTTP), les marketplaces (npm, GitHub, Claude plugins, Grok), et les pièges (auth, secrets, doublons, privacy, cold start `npx`).

### Contexte projet à lire (ordre)

1. `SESSION_START.md`
2. `docs/product/STATUS.md`
3. `LAUNCH.md` (priorité business = distribution)
4. `SECURITY.md` / privacy claims si présents
5. Stack : `package.json`, `playwright.config.*`, `vercel.json`
6. Config MCP existante :
   - **Projet :** `.mcp.json`, `.cursor/mcp.json`, `.vscode/mcp.json` (si présents)
   - **User / outil :** selon l’agent en cours
     - Grok Build : `~/.grok/` + guide MCP user-guide
     - Claude Code : `~/.claude/settings.json`, plugins marketplaces, `mcp-needs-auth-cache.json`
     - Cursor / autres si détectés
7. Skills / agents locaux déjà présents (`~/.claude/skills`, `~/.claude/agents`, skills Grok) — **éviter les doublons** avec un MCP redondant

### Objectif

1. **Cartographier** l’existant (MCP connectés, en échec, déclarés mais morts).
2. **Comprendre** les jobs du repo (React/Vite/MUI, Vitest, Playwright, Vercel, Scryfall, Library SEO, distribution Discord/X, privacy-first).
3. **Proposer** une shortlist + longlist de MCP, **priorisée**.
4. **N’installer que sur ordre** (`go install` / sous-ensemble).
5. **Valider** post-install (tools listables, smoke call non destructif).

### Inventaire obligatoire (Phase 1)

Produire un tableau **État actuel** :

| Source | Serveur | Statut (ok / fail / unknown) | Outils exposés (aperçu) | Notes |
| ------ | ------- | ---------------------------- | ----------------------- | ----- |

Sources typiques à inspecter :

- Fichiers `*mcp*.json` projet + user
- MCP déjà attachés à la session courante (si visibles)
- Logs récents (`~/.grok/logs/mcp/`, logs Claude) si utiles
- Skills qui **remplacent** un MCP (ex. context7 CLI, Playwright via npm local)

### Axes d’analyse (tous les angles)

| Axe              | Questions                                                       |
| ---------------- | --------------------------------------------------------------- |
| **Dev / code**   | Docs libs à jour (React, MUI, Vite, Redux) ? Refactors guidés ? |
| **Qualité**      | E2E browser, a11y, Lighthouse, visual regression ?              |
| **Ops**          | GitHub PRs, Vercel deploy/logs, Sentry (privacy-gated) ?        |
| **Produit MTG**  | Scryfall, data externe, scraping légitime ?                     |
| **Distribution** | Discord, X/Twitter, Notion/Linear pour backlog launch ?         |
| **SEO / GEO**    | Crawl, Search Console, DataForSEO — vs skills déjà installées   |
| **Knowledge**    | Memory projet, Notion, Drive (auth)                             |
| **Sécurité**     | Secrets, scope minimal, pas d’exfil decklist                    |

### Format de proposition OBLIGATOIRE

Pour **chaque** MCP proposé :

```markdown
### [Nom du serveur]

- **Priorité :** P0 / P1 / P2 / Skip
- **Job couvert :** (1 phrase)
- **Pourquoi pour CE projet :** (lien stack ou workflow)
- **Pourquoi PAS un skill/CLI déjà là :** (ou « doublon → skip »)
- **Install cible :** projet (`.mcp.json`) | user-global | les deux
- **Méthode d’install :** commande exacte / snippet JSON
- **Auth / secrets :** aucune | OAuth | API key (où la mettre, jamais commit)
- **Privacy / risque :** OK ManaTuner | attention | interdit sans owner
- **Coût / quota :** free / freemium / paid
- **Smoke test post-install :** 1 appel tool non destructif
- **Décision recommandée :** Installer / Reporter / Rejeter
```

### Synthèse (fin Phase 1)

1. **Tableau priorisé** P0 → P2 (max ~8–12 installables ; le reste en backlog)
2. **À NE PAS installer** + raison (doublon, privacy, hors scope, cost)
3. **Plan d’install en vagues** (Vague A = 15 min, B = auth, C = nice-to-have)
4. **Snippet `.mcp.json` fusionné** proposé (diff clair vs actuel)
5. **Question unique à l’humain** : « Réponds `go install` / `go install: P0` / `go install: nom1,nom2` / `stop` »

### Phase 2 — seulement si ordre explicite

Quand l’utilisateur dit **`go install`** (ou sous-ensemble) :

1. Backup du fichier MCP touché (copie datée ou `git show` si versionné)
2. Appliquer les installs **une par une** (pas un big-bang aveugle)
3. Après chaque serveur :
   - config écrite
   - tenter handshake / list tools si l’environnement le permet
   - noter VERT / ROUGE + log
4. **Ne jamais** committer de secrets (`.env`, tokens) ; documenter les vars manquantes
5. Si un MCP demande OAuth : donner l’URL / la procédure, **ne pas inventer de tokens**
6. Rapport final install :
   - installés OK
   - en attente d’auth
   - échoués + rollback si besoin
   - **comment recharger** l’agent (restart session / reload window)
7. Optionnel : commit **config seule** (sans secrets) si l’utilisateur dit `go commit`

### Contraintes ManaTuner / owner

- Priorité business = **distribution** (`LAUNCH.md`), pas feature gratuite
- **Ne pas rouvrir sans owner :** Moxfield URL, i18n FR, backend, Sentry DSN, analytics decklist
- Privacy client-side : tout MCP analytics / crash / remote log doit être **opt-in** et documenté
- Éviter d’empiler 20 MCP « au cas où » : charge cognitive + latence agent
- Préférer MCP **maintenus** (stars, release récente, doc claire) aux one-shot abandonnés

### Livrables

| Phase | Livrable                                                                         |
| ----- | -------------------------------------------------------------------------------- |
| 1     | Rapport Markdown dans le chat + optionnel `docs/session/MCP_AUDIT_YYYY-MM-DD.md` |
| 2     | Config MCP mise à jour + rapport d’install + smoke                               |

### Ordre d’exécution

1. Confirmer lecture contexte + inventaire configs
2. État actuel MCP
3. Analyse jobs projet
4. Propositions P0/P1/P2 + rejects
5. Snippet config + question `go install`
6. **STOP** jusqu’à ordre humain
7. (Si go) install vague par vague + validation

---

## Exemples de catégories à considérer (non exhaustif, à filtrer)

> L’expert **ne doit pas** tout installer : ce sont des pistes d’analyse.

| Catégorie     | Exemples de rôle                 | Signal projet ManaTuner                  |
| ------------- | -------------------------------- | ---------------------------------------- |
| Docs libs     | Context7, doc fetchers           | React 18, MUI, Vite, Playwright          |
| Browser / E2E | Playwright MCP, browser tools    | audits personas, smoke prod              |
| Git forge     | GitHub MCP                       | repo `gbordes77/manatuner`, PRs          |
| Deploy        | Vercel MCP                       | hébergement prod                         |
| Community     | Discord MCP                      | LAUNCH.md distribution                   |
| SEO           | crawl / GSC (si compte)          | Library, sitemap — vs skills SEO déjà là |
| Task board    | Linear / GitHub Issues           | backlog optionnel                        |
| Memory        | memory MCP / project notes       | sessions multi-jours                     |
| Design        | Figma (si design system)         | souvent Skip si pas de fichier Figma     |
| TTS / vibe    | AgentVibes (déjà en `.mcp.json`) | garder si utilisé, sinon documenter fail |

---

## Anti-patterns (refus explicite dans le rapport)

- Installer un MCP **sans** job mappé
- Dupliquer un skill local déjà excellent (ex. SEO skills massives vs 5 MCP SEO redondants)
- Activer Sentry/analytics remote **sans** checklist privacy
- Mettre des API keys en clair dans un fichier commité
- « Active all MCP » sans priorisation
- Promettre un MCP qui n’existe plus / package npm fantôme — **vérifier** existence (registry, repo)

---

## Phrase de relance post-install (conversation suivante)

```
Lis docs/session/MCP_AUDIT_<date>.md (ou le dernier audit MCP).
Vérifie que les MCP installés répondent encore (handshake).
Propose uniquement les manques vs mon workflow actuel.
N’installe rien tant que je ne dis pas « go install ».
```

_Fin du prompt versionné._
