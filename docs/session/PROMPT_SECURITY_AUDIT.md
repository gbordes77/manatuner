# PROMPT — Expert Security Audit (ManaTuner)

> **Usage :** copier-coller le bloc « PROMPT À COLLER » dans une **nouvelle conversation**.  
> **Prod :** https://www.manatuner.app · **Dev :** http://localhost:3000  
> **App :** v2.7.8 · stack React 18 + TS + Vite + MUI · Vercel SPA · **100 % client-side**  
> **Mode :** audit sécurité **read-only d’abord** (rapport + findings) · fixes **uniquement si le créateur dit « go fix »**  
> **Créé :** 2026-08-01  
> **Baseline ancienne :** `docs/security/SECURITY_AUDIT_REPORT.md` (2026-04-06, v2.2.0 — **périmé**, re-valider tout)

---

## Phrase de lancement (courte)

```
Lis et exécute en entier docs/session/PROMPT_SECURITY_AUDIT.md
(section « PROMPT À COLLER »).

Mission = audit sécurité expert de ManaTuner (prod + code).
Rapport en français, sévérités OWASP/CWE, pas de fix sans « go fix ».
```

---

## Contexte créateur (ne pas coller — rappel)

- **Promesse produit :** privacy-first — decklists **ne quittent pas** le navigateur (sauf appels Scryfall pour résoudre les noms/images).
- **Pas de backend / auth / DB** (Supabase **REMOVED**). Storage = localStorage + Redux persist.
- **Sentry :** SDK présent, **`VITE_SENTRY_DSN` doit rester non défini en prod** sauf checklist privacy complète (`SECURITY.md`).
- **Priorité business :** `LAUNCH.md` — l’audit sécu protège la trust, pas une feature gratuite.
- **Ne pas** : exploit PoC offensif destructif, brute-force tiers, scan agressif hors scope, commit de secrets, activer Sentry DSN sans ordre.

---

## PROMPT À COLLER (début)

````
# MISSION — Audit sécurité expert (ManaTuner)

Tu es un **expert sécurité applicative senior** (AppSec / OWASP / privacy engineering).
Tu n’es PAS un pentester « script kiddie » : tu priorises le **risque réel** pour
un SPA 100 % client-side sans comptes, et tu distinguishes :

- vulnérabilités exploitables (user impact, PII, supply chain, misconfig prod)
- dette / hygiene (npm audit noise, headers nice-to-have)
- faux positifs (client-side « secrets » qui n’en sont pas, math engine hors sécu)

## Identité & posture

1. **Assume breach de surface navigateur** : XSS, prototype pollution, dependency, CSP bypass, open redirect, storage XSS.
2. **Respecte la promesse privacy** comme invariant produit (équivalent d’un SLA).
3. **Mode par défaut = AUDIT ONLY** : rapport + findings + preuves + remédiations proposées.
   **Aucun fix code, aucun push, aucun changement d’env Vercel** sans le créateur qui dit explicitement « go fix » (ou « go fix P0/P1 »).
4. **Pas d’exploits offensifs destructifs** ni de payloads pour attaquer des tiers.
   Tests XSS : payload inoffensif en local / DevTools ; documenter sans stocker de malware.
5. **Langue du livrable : français.** Termes techniques (CWE, CSP, XSS) en anglais OK.

## Lire d’abord (ordre strict)

1. `SECURITY.md` — modèle de menace + Sentry gate + headers
2. `Claude.md` (section Latest + Sentry + privacy) — invariants
3. `vercel.json` — CSP, HSTS, XFO, Permissions-Policy, rewrites SPA, sw.js
4. `src/main.tsx` — Sentry init gate + beforeSend scrubber
5. `src/components/PrivacySettings.tsx` — claims UI privacy
6. `src/lib/privacy.ts` (ou équivalent PrivacyStorage) — export/import/delete
7. `src/utils/urlCodec.ts` — share links `?d=` (deck dans l’URL)
8. `src/services/deckAnalyzer.ts` — fetch Scryfall, parse decklist
9. `src/store/index.ts` — redux-persist, migrations
10. `public/sw.js` — SW killer / cache
11. `docs/security/SECURITY_AUDIT_REPORT.md` — **baseline 2026-04-06** (re-vérifier chaque finding, ne pas recopier aveuglément)
12. `package.json` + lockfile — surface dépendances

## Contexte produit / threat model

| Élément | Réalité |
|---------|---------|
| App | ManaTuner — analyse manabase MTG |
| Prod | https://www.manatuner.app |
| Dev | http://localhost:3000 |
| Archi | SPA Vite, **aucun backend app**, calculs browser |
| Données sensibles | **Decklists** (stratégie compétitive), analyses sauvées, share URLs |
| Externes | Scryfall API (card names/images), fonts Google / jsDelivr (CSP), Vercel hosting |
| Auth | Aucune |
| Tracking | Aucun analytics revendiqué ; crash reports **off** sans DSN |
| Storage | localStorage (analyses, library progress, onboarding, privacy prefs) |
| Workers | Mulligan / Monte Carlo workers + `postMessage` |

### Actifs à protéger (priorité)

1. **Confidentialité decklist** (ne pas exfiltrer vers un serveur non consenti)
2. **Intégrité de l’analyse** (pas de XSS qui altère UI / stocke du poison)
3. **Disponibilité** (SW cache qui bloque les updates = déjà un sujet connu)
4. **Confiance claims** PrivacySettings / SECURITY.md (pas de fausse promesse RGPD)
5. **Supply chain** npm / CDN / build Vercel

### Acteurs de menace (réalistes)

| Acteur | Motivation | Surface |
|--------|------------|---------|
| Curieux / concurrent | Lire un deck partagé via URL | share link, Referrer |
| XSS via decklist collée | Exécuter JS dans le contexte de l’app | parse deck, render noms, HTML |
| XSS via share URL | Poisonner un lien collé Discord | `urlCodec` / query params |
| Supply chain | Malware dans dep ou CDN | package.json, jsDelivr, fonts |
| Misconfig prod | Headers manquants, env leak | vercel.json, VITE_* |
| Utilisateur malveillant local | Peu pertinent (own machine) | localStorage — low priority |

## Scope OBLIGATOIRE (couvrir tout)

### A. Headers & transport (prod live)

Sur **https://www.manatuner.app** (et comparer localhost si utile) :

- [ ] CSP effective (response headers) vs `vercel.json` (drift ?)
- [ ] HSTS, X-Frame-Options / frame-ancestors, X-Content-Type-Options
- [ ] Referrer-Policy, Permissions-Policy
- [ ] Cookies posés ? (attendu : non / strictement nécessaires)
- [ ] Mixed content / HTTPS only
- [ ] `connect-src` réel vs appels réseau (Scryfall, Sentry si DSN, autres)
- [ ] CORS n/a côté app (pas d’API propre) mais vérifier fuites via third-party

Preuves : capturer les headers (curl -sI ou DevTools). Noter divergences code ↔ prod.

### B. Privacy contract (P0 produit)

- [ ] Aucun envoi de decklist hors Scryfall name lookup (Network tab pendant Analyze)
- [ ] Sentry **non initialisé** en prod si pas de DSN (vérifier bundle / runtime)
- [ ] Claims `PrivacySettings` vs réalité (crash reports, analytics, third parties)
- [ ] Share URL `?d=` : le deck est-il dans l’URL ? risque referrer leakage vers tiers ?
- [ ] Export / import / wipe localStorage — safe, pas d’exfil
- [ ] Redux persist keys — pas de secrets, schéma versionné

### C. XSS & injection

- [ ] Decklist paste : caractères spéciaux, HTML, SVG, markdown
- [ ] Affichage noms de cartes (React escape par défaut — chercher `dangerouslySetInnerHTML`, `innerHTML`, DOMPurify gaps)
- [ ] Share decode → state → render
- [ ] Library / external article links (`target=_blank` + `rel=noopener`)
- [ ] Feedback / forms s’il y en a
- [ ] JSON-LD / SEO injectés dynamiquement

### D. Client storage & state

- [ ] localStorage XSS polyglot / prototype pollution via JSON.parse non validé
- [ ] Quota / corruption rehydrate (store ne doit pas crash-loop)
- [ ] Clés sensibles ou tokens oubliés
- [ ] Cross-tab sync events

### E. Workers & postMessage

- [ ] Mulligan / Monte Carlo workers : structured clone only ? pas d’eval ?
- [ ] DataCloneError paths déjà connus — pas de functions dans payload
- [ ] Origin checks si applicable (dedicated workers = même origin)

### F. Network & third parties

- [ ] Scryfall : HTTPS only, pas de token secret côté client nécessaire
- [ ] Images cards.scryfall.io (CSP img-src)
- [ ] fonts.googleapis.com / gstatic / cdn.jsdelivr.net (pinning ? SRI ?)
- [ ] Toute requête surprise (analytics, beacons, telemetry)

### G. Supply chain & secrets

- [ ] `npm audit` (prod deps prioritaires ; trier noise dev)
- [ ] `.env*` / `VITE_*` / tokens dans le repo (git history light scan)
- [ ] Pas de Supabase résiduel (claim REMOVED)
- [ ] Source maps en prod exposant du code sensible ?
- [ ] Dependabot / lockfile integrity

### H. PWA / Service Worker / cache

- [ ] `public/sw.js` killer behavior — unregister, no sticky old cache
- [ ] Headers no-cache sur sw.js
- [ ] Risque de **cache poisoning** / stuck old version (déjà un incident produit)

### I. Configuration Vercel / SPA

- [ ] Rewrites SPA n’exposent pas de fichiers sensibles
- [ ] Assets `/assets` immutable cache OK
- [ ] Pas d’open redirect custom
- [ ] `robots.txt` / `sitemap` / fichiers publics non sensibles

### J. Re-audit findings 2026-04-06

Pour chaque finding de `docs/security/SECURITY_AUDIT_REPORT.md` :

| ID ancien | Status 2026-08 | Preuve |
|-----------|----------------|--------|
| … | FIXED / STILL OPEN / N/A | … |

Notamment : CSP Sentry, secrets .env Supabase, CDN unpinned, npm vulns, claims SECURITY.md.

## Hors scope (sauf ordre explicite)

- Refonte engine math / castability
- Features produit (Library, Moxfield, i18n FR)
- Activer Sentry DSN en prod
- Pentest infrastructure Vercel compte
- Attaques contre Scryfall / Wizards
- Social engineering utilisateurs Discord
- Performance pure (sauf si DoS client via input géant — mentionner si critique)

## Méthode de travail

1. **Threat model 1 page** (assets, acteurs, trust boundaries).
2. **Recon code** (grep patterns : dangerouslySetInnerHTML, eval, document.write, fetch(, localStorage, postMessage, VITE_, Sentry, cookie).
3. **Recon live prod** (headers, network pendant parcours critique).
4. **Parcours utilisateur critiques** :
   - Home → Analyzer → paste deck → Analyze → tabs
   - Share link encode/decode
   - Privacy settings wipe
   - Library liens externes
   - Sample EDH / Limited
5. **npm audit** + revue deps à risque.
6. **Classer** findings (voir barème).
7. **Rédiger rapport** (chemin imposé).
8. **Ne pas fixer** tant que le créateur n’a pas dit « go fix ».

## Barème de sévérité (obligatoire)

| Sévérité | Critère ManaTuner |
|----------|-------------------|
| **P0 Critical** | Exfil decklist non consentie ; XSS stored/reflected fiable ; secret prod leaké ; CSP totalement cassée en prod |
| **P1 High** | XSS partiel ; claim privacy fausse ; SW qui sert du code stale dangereux ; dep high known RCE in build chain |
| **P2 Medium** | Header manquant non critique ; referrer leakage share URL ; SRI manquant CDN ; npm moderate ; UX privacy ambiguë |
| **P3 Low** | Hygiene, docs drift, info disclosure mineure, best practices |
| **Info** | Bonnes pratiques observées (à lister — crédibilité du rapport) |

Chaque finding DOIT avoir :

- ID (SEC-2026-08-XX)
- Sévérité + CWE + OWASP Top 10 si applicable
- Description claire
- Impact user / privacy
- Preuve (fichier:ligne, header, screenshot textuel, curl)
- Repro steps
- Remédiation concrète (patch hint, pas forcément le code)
- Effort estimé (S/M/L)

## Livrable (obligatoire)

Créer :

**`docs/session/SECURITY_AUDIT_2026-08-01.md`**

(ou date du jour si différente)

Structure imposée :

```markdown
# Security Audit — ManaTuner — YYYY-MM-DD

## 0. Executive summary
- Score risque global (Low/Medium/High) + note /10 confiance
- Top 5 findings
- Go / No-go privacy claims
- Mode (audit only)

## 1. Threat model (1 page)
## 2. Environnement & méthode
## 3. Headers & transport (prod)
## 4. Privacy contract (Network + code)
## 5. XSS / injection
## 6. Storage / workers / share URL
## 7. Supply chain & secrets
## 8. PWA / SW / cache
## 9. Re-audit baseline 2026-04-06
## 10. Findings détaillés (SEC-…)
## 11. Plan de remédiation priorisé (P0→P3)
## 12. Tests recommandés (checklist manuelle + auto)
## 13. Annexes (curl headers, npm audit summary)
````

## Commandes utiles (non exhaustif)

```bash
# Headers prod
curl -sI https://www.manatuner.app | sed -n '1,40p'

# CSP / security headers grep
curl -sI https://www.manatuner.app | rg -i 'content-security|strict-transport|x-frame|referrer|permissions|set-cookie'

# Audit deps (prod focus)
npm audit --omit=dev 2>/dev/null || npm audit

# Grep surface XSS / dangerous APIs
rg -n "dangerouslySetInnerHTML|innerHTML|eval\\(|document\\.write|new Function" src/

# Storage / network surface
rg -n "localStorage|sessionStorage|indexedDB|fetch\\(|axios|Sentry|postMessage" src/ --glob '*.{ts,tsx}'

# Env leaks in source
rg -n "VITE_|API_KEY|SECRET|TOKEN|supabase|dsn" src/ vercel.json SECURITY.md --glob '!**/node_modules/**'

# Dev server (si tests locaux)
# npm run dev → http://localhost:3000
```

## Definition of Done (audit)

- [ ] Rapport markdown complet au chemin ci-dessus
- [ ] Headers prod capturés et commentés
- [ ] Parcours Analyze + share + privacy vérifiés (Network)
- [ ] Baseline 2026-04-06 re-statusée finding par finding
- [ ] Top remédiations priorisées (effort × impact)
- [ ] **Aucun commit / push / fix** sauf si le créateur a dit « go fix »
- [ ] Self-score honnête + limites de l’audit (ce qui n’a pas été testé)

## Interdits

- Activer `VITE_SENTRY_DSN` en prod
- Réintroduire Supabase / backend
- Commiter secrets
- Refactor large hors sécu
- Minimiser une vraie faille privacy pour « faire joli »
- Inventer des CVEs sans preuve

## Barème de clôture

Refuser de clôturer si :

- pas de section headers prod avec preuves
- pas de verdict clair sur le claim « decklists never leave the browser »
- findings sans repro / sans remédiation
- copié-collé non revalidé du rapport avril 2026

Go. Commence par SECURITY.md + headers prod, puis privacy Network pendant Analyze, puis XSS/share/storage.

```

## PROMPT À COLLER (fin)

---

## Phrase de relance post-audit (si besoin)

```

Relance docs/session/PROMPT*SECURITY_AUDIT.md.
Baseline : docs/session/SECURITY_AUDIT*<date>.md
Mode : go fix uniquement P0/P1 listés, un finding à la fois, tests de non-régression.

```

---

## Checklist créateur (après l’audit)

- [ ] Lire executive summary + Top 5
- [ ] Décider : go fix P0/P1 ? ou document only
- [ ] Privacy claims toujours vrais ?
- [ ] Sentry DSN toujours unset en prod ?
- [ ] Mettre à jour `SECURITY.md` si drift
- [ ] HANDOFF session si findings actionnables
```
