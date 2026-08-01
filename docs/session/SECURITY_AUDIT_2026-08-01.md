# Security Audit — ManaTuner — 2026-08-01

|              |                                                                                                |
| ------------ | ---------------------------------------------------------------------------------------------- |
| **App**      | ManaTuner v2.7.8 (package.json / Engine stamp)                                                 |
| **Prod**     | https://www.manatuner.app                                                                      |
| **Code**     | SPA React 18 + TypeScript + Vite + MUI · Vercel · 100 % client-side                            |
| **Mode**     | **AUDIT ONLY** — aucun fix code, aucun push, aucun changement d’env                            |
| **Auditeur** | Expert AppSec (session agent)                                                                  |
| **Baseline** | `docs/security/SECURITY_AUDIT_REPORT.md` (2026-04-06, v2.2.0) — re-validée finding par finding |
| **Langue**   | Français (termes techniques CWE/CSP/XSS en anglais)                                            |

---

## 0. Executive summary

### Score risque global

| Métrique                 | Valeur       |
| ------------------------ | ------------ |
| **Risque global**        | **Low**      |
| **Confiance de l’audit** | **8.5 / 10** |
| **P0 Critical**          | **0**        |
| **P1 High**              | **0**        |
| **P2 Medium**            | **4**        |
| **P3 Low**               | **5**        |
| **Info (positives)**     | **6**        |

Pour un SPA sans backend, sans auth et sans comptes, la surface d’attaque réelle est **restreinte**. Les headers de production sont solides, le contrat privacy (pas de decklist envoyée à un serveur ManaTuner, Sentry off, pas d’analytics) est **vérifié en live**, et la baseline d’avril 2026 a largement progressé (CDN pinné + SRI, robots/sitemap, claim AES retiré, Supabase hors code).

### Top 5 findings

| #   | ID                 | Sévérité | Titre                                                                                    |
| --- | ------------------ | -------- | ---------------------------------------------------------------------------------------- |
| 1   | **SEC-2026-08-01** | **P2**   | Share URL `?d=` : decklist dans l’URL (logs CDN, historique, partage)                    |
| 2   | **SEC-2026-08-02** | **P2**   | Reset « All data » incomplet (Redux persist / caches restent)                            |
| 3   | **SEC-2026-08-03** | **P2**   | npm audit prod : `dompurify` + `react-router` (moderate)                                 |
| 4   | **SEC-2026-08-04** | **P2**   | Drift docs CSP : `SECURITY.md` affirme Sentry dans `vercel.json` alors qu’il n’y est pas |
| 5   | **SEC-2026-08-05** | **P3**   | `.env` local encore peuplé de clés Supabase orphelines (hors git)                        |

### Go / No-go privacy claims

| Claim                                                        | Verdict                                                                                                          |
| ------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------- |
| « Decklists never leave your browser » (sauf Scryfall names) | **GO** — avec nuance documentée                                                                                  |
| « No accounts, no tracking, no analytics, no crash reports » | **GO** (DSN unset, Network clean)                                                                                |
| « ManaTuner does not collect any data »                      | **GO** pour le produit (pas de backend) ; Scryfall reçoit les **noms de cartes** (divulgué dans PrivacySettings) |
| Share link = confidentialité stricte                         | **NO-GO** si interprété comme secret — le partage est **volontairement** public via URL                          |

### Mode

**Audit only (initial).** Remédiations **appliquées en code v2.7.9** le 2026-08-01 sur « go fix » créateur — voir §11bis. Deploy prod = owner.

---

## 1. Threat model (1 page)

### Assets (priorité)

1. **Confidentialité decklist** — stratégie compétitive (localStorage, Redux persist, share URL)
2. **Intégrité UI / analyse** — pas de XSS qui altère l’affichage ou poisonne le storage
3. **Disponibilité** — Service Worker / cache (incident historique « stuck old version »)
4. **Confiance des claims** PrivacySettings / SECURITY.md (RGPD / reputation)
5. **Supply chain** — npm prod, CDN fonts / mana-font, build Vercel

### Trust boundaries

```
[ Utilisateur navigateur ]
        │  localStorage / redux-persist / workers
        │
        ├─► api.scryfall.com          (noms de cartes, images metadata)
        ├─► cards.scryfall.io         (images)
        ├─► fonts.googleapis.com / gstatic
        ├─► cdn.jsdelivr.net (mana-font@1.18.0 + SRI)
        ├─► tally.so                  (Feedback — clic utilisateur uniquement)
        └─► Vercel edge               (HTML/JS static ; URL query possible en logs)
```

**Pas de** : backend app, DB, cookies de session, auth, analytics auto.

### Acteurs réalistes

| Acteur                   | Surface                  | Impact typique                                          |
| ------------------------ | ------------------------ | ------------------------------------------------------- |
| Concurrent / curieux     | Lien share Discord `?d=` | Lecture deck partagé (attendu)                          |
| XSS via decklist / share | Parse + render noms      | Faible (React escape, pas de `dangerouslySetInnerHTML`) |
| Supply chain CDN/npm     | CSS/JS tiers             | CSS injection / dep vuln                                |
| Misconfig prod           | Headers / env VITE\_\*   | Exfil si Sentry mal activé                              |
| User local malveillant   | localStorage             | Hors scope (own machine)                                |

### Invariants produit (à préserver)

- Pas d’exfil decklist vers un serveur non consenti
- `VITE_SENTRY_DSN` **unset** en prod tant que checklist privacy non faite
- Supabase **REMOVED** (ne pas réintroduire)
- Calculs 100 % client

---

## 2. Environnement & méthode

### Environnement

| Élément | Détail                                                   |
| ------- | -------------------------------------------------------- |
| Prod    | https://www.manatuner.app · v2.7.8                       |
| Code    | workspace local aligné main                              |
| Stack   | React 18, Vite, MUI, Redux + redux-persist, workers Vite |
| Hosting | Vercel SPA (`vercel.json` rewrites + headers)            |

### Méthode

1. Lecture ordre strict : SECURITY.md, Claude.md, vercel.json, main.tsx, PrivacySettings, privacy.ts, urlCodec, deckAnalyzer (fetch), store, sw.js, baseline 2026-04-06, package.json
2. Recon grep : XSS sinks, fetch, storage, Sentry, VITE\_, postMessage, target=\_blank
3. Headers prod (`curl -sI`)
4. Parcours live Playwright : Analyzer → Try Example → Analyze Manabase → Network
5. `npm audit` / `npm audit --omit=dev`
6. Re-status baseline finding par finding
7. **Aucun fix**

### Limites (honnêteté)

- Pas de pentest infra Vercel compte / firewall rules
- Pas de lecture des **logs Vercel** (présence réelle de `?d=` non confirmée côté plateforme)
- Pas d’attaque offensive XSS payload stockée
- Dev server local non re-testé bout-en-bout (prod prioritaire)
- Dépendances **dev** (vite/vitest/undici via vercel CLI) notées en hygiene, non en risque user prod

---

## 3. Headers & transport (prod)

### Capture `curl -sI https://www.manatuner.app` (2026-08-01)

```
HTTP/2 200
content-security-policy: default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdn.jsdelivr.net; font-src 'self' https://fonts.gstatic.com https://cdn.jsdelivr.net data:; img-src 'self' data: https://cards.scryfall.io; connect-src 'self' https://api.scryfall.com; frame-ancestors 'none'; base-uri 'none'; form-action 'self'; object-src 'none'; upgrade-insecure-requests
strict-transport-security: max-age=63072000; includeSubDomains; preload
x-frame-options: DENY
x-content-type-options: nosniff
referrer-policy: strict-origin-when-cross-origin
permissions-policy: camera=(), microphone=(), geolocation=(), interest-cohort=(), browsing-topics=(), attribution-reporting=()
access-control-allow-origin: *
(no Set-Cookie)
```

### `/sw.js`

```
cache-control: no-cache, no-store, must-revalidate
content-type: application/javascript; charset=utf-8
(+ mêmes headers sécu globaux)
```

### Analyse

| Contrôle                                | Statut              | Commentaire                                                                                                              |
| --------------------------------------- | ------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| CSP                                     | **OK fort**         | `script-src 'self'` (pas d’`unsafe-inline` scripts) ; `frame-ancestors 'none'` ; `object-src 'none'` ; `base-uri 'none'` |
| `style-src 'unsafe-inline'`             | Acceptable          | Requis MUI — n’affaiblit pas `script-src`                                                                                |
| HSTS preload 2 ans                      | **Excellent**       |                                                                                                                          |
| XFO DENY + frame-ancestors              | **OK**              | Defense in depth clickjacking                                                                                            |
| Referrer-Policy                         | **OK**              | Cross-origin HTTPS → origin only (mitige fuite `?d=` vers tiers)                                                         |
| Permissions-Policy                      | **OK**              | Étendu (FLoC/topics/attribution off)                                                                                     |
| Cookies                                 | **Aucun**           | Attendu                                                                                                                  |
| `connect-src`                           | Scryfall only       | **Pas** de `*.ingest.sentry.io` en prod (cohérent Sentry off ; diverge de SECURITY.md)                                   |
| `img-src`                               | `cards.scryfall.io` | Plus de `c1.scryfall.com` (OK si non utilisé)                                                                            |
| CORS `*`                                | Info                | Assets statiques publics ; pas d’API auth                                                                                |
| Mixed content                           | OK                  | `upgrade-insecure-requests`                                                                                              |
| Alignement `vercel.json` ↔ headers live | **Match**           | Pas de drift headers code/prod                                                                                           |

---

## 4. Privacy contract (Network + code)

### Network live (Playwright, 2026-08-01)

Parcours : `/analyzer` → **Try Example** → **Analyze Manabase**.

**Requêtes data (non-static) :**

- `POST https://api.scryfall.com/cards/collection`
- `GET https://api.scryfall.com/cards/named?exact=…` / `fuzzy=…` (noms de cartes uniquement)

**Absents :** Sentry, analytics, beacons, Supabase, gtag, Mixpanel, Plausible, fullstory, etc.

**Static tiers :** Google Fonts, jsDelivr mana-font@1.18.0, assets self.

### Sentry

| Check                          | Preuve                                               | Verdict             |
| ------------------------------ | ---------------------------------------------------- | ------------------- |
| Gate `PROD && VITE_SENTRY_DSN` | `src/main.tsx:58-69`                                 | Init conditionnel   |
| Scrubber `beforeSend`          | strip query URL, cookies, user, truncate messages    | Prêt si DSN un jour |
| DSN en prod                    | pas de pattern DSN dans assets ; Network sans ingest | **OFF**             |
| Claims UI                      | PrivacySettings : « no crash reports »               | **Cohérent**        |

### Claims PrivacySettings vs réalité

| Claim UI                                           | Réalité                                                                              |
| -------------------------------------------------- | ------------------------------------------------------------------------------------ |
| Analyses stockées localement                       | Oui (`manatuner_analyses` + `persist:root`)                                          |
| Decklists ne quittent pas le browser               | **Pas vers un serveur ManaTuner** ; **noms** vers Scryfall (divulgué ligne suivante) |
| Card data from Scryfall                            | Confirmé Network                                                                     |
| No accounts / tracking / analytics / crash reports | Confirmé                                                                             |
| Reset « All data has been deleted »                | **Sur-claim** snackbar — voir SEC-2026-08-02                                         |

### Share URL `?d=`

- Encode base64 URL-safe de la decklist (`src/utils/urlCodec.ts`)
- `name` en clair dans query
- Partage volontaire (clipboard → Discord)
- Risques : historique navigateur, logs edge Vercel (hypothétique), screenshots, destinataires du lien
- Mitigation referrer cross-origin : **OK**

### Export / import / wipe

- Export : Blob JSON local (pas d’upload)
- Import : `JSON.parse` + **Zod** `importSchema` (bon)
- Wipe : partiel (analyses keys seulement)

### Verdict privacy

**GO** pour le cœur de promesse produit (pas de backend ManaTuner, pas d’analytics, Sentry off), avec **nuances obligatoires** share URL + Scryfall names + wipe incomplet.

---

## 5. XSS / injection

### Sinks dangereux

| Pattern                                    | Résultat grep `src/`                                 |
| ------------------------------------------ | ---------------------------------------------------- |
| `dangerouslySetInnerHTML`                  | **Aucun** (hors test `document.head.innerHTML = ''`) |
| `innerHTML` runtime                        | **Aucun**                                            |
| `eval` / `new Function` / `document.write` | **Aucun**                                            |

### Surfaces testées (analyse statique)

| Surface                        | Contrôle                                                              | Risque                                        |
| ------------------------------ | --------------------------------------------------------------------- | --------------------------------------------- |
| Paste decklist                 | React text nodes + parse                                              | **Low**                                       |
| Share decode → Redux → render  | `decodeDeck` → `setDeckList` ; pas d’HTML sink                        | **Low**                                       |
| `name` query param             | string React                                                          | **Low**                                       |
| JSON-LD SEO                    | `JSON.stringify(...).replace(/</g, '\\u003c')` (`SEO.tsx:66-77`)      | **Bien fait**                                 |
| Library external links         | `target="_blank"` + `rel="noopener noreferrer"` (+ nofollow articles) | **OK**                                        |
| Feedback Tally                 | Lien externe, pas d’iframe auto                                       | **OK**                                        |
| sanitizeInput / sanitizeString | Regex (fragile en théorie)                                            | **Low** car React escape est le vrai contrôle |

### Remarque DOMPurify

- **Pas** une dépendance directe ; transitive via `jspdf` → `dompurify@3.3.3`
- Usage app : html2canvas → image → jsPDF (pas de HTML utilisateur passé à DOMPurify)
- CVEs DOMPurify = impact **théorique faible** ici (voir SEC-2026-08-03)

---

## 6. Storage / workers / share URL

### Clés localStorage observées

| Clé                                                  | Contenu sensible                  |
| ---------------------------------------------------- | --------------------------------- |
| `manatuner_analyses`                                 | Decklists sauvegardées            |
| `persist:root` (redux-persist)                       | **`deckList` + `analysisResult`** |
| `manatuner_lands_cache` / `manatuner_producer_cache` | Cache cartes (public data)        |
| `manatuner_acceleration_settings`                    | Préférences                       |
| `manatuner-library-progress-v1`                      | Lecture/bookmarks library         |
| `manatuner-theme`, onboarding, banner                | UI flags                          |

### Workers

| Worker                                | Analyse                                                                                       |
| ------------------------------------- | --------------------------------------------------------------------------------------------- |
| `mulliganArchetype.worker.ts`         | Dedicated worker Vite ; message typé ; **pas d’eval** ; structured clone (clone-safe payload) |
| `public/workers/monteCarlo.worker.js` | Math pure ; `onmessage` config ; pas d’eval                                                   |
| Origin check                          | N/A (same-origin dedicated workers)                                                           |

### Share URL (détail risque)

| Vecteur                         | Sévérité | Note                                      |
| ------------------------------- | -------- | ----------------------------------------- |
| Destinataire volontaire du lien | Attendu  | Feature                                   |
| Referrer vers site tiers        | Mitigé   | `strict-origin-when-cross-origin`         |
| Logs hébergeur (URL complète)   | P2       | SPA static ; dépend config Vercel logging |
| OG crawlers (Discord)           | Faible   | HTML générique ; deck pas dans meta OG    |

---

## 7. Supply chain & secrets

### npm audit

| Scope                   | Total                                       | Breakdown                                                                |
| ----------------------- | ------------------------------------------- | ------------------------------------------------------------------------ |
| **Prod (`--omit=dev`)** | **3 moderate**                              | `dompurify`, `react-router`, `react-router-dom`                          |
| **Full (incl. dev)**    | **32** (3 low, 10 mod, 15 high, 4 critical) | vite, vitest, undici (vercel CLI), ws, … — **ne shippent pas** aux users |

### Secrets / env

| Check                                        | Résultat                                                          |
| -------------------------------------------- | ----------------------------------------------------------------- |
| `.env` dans git                              | **Non** (gitignore + `git ls-files` fail)                         |
| Historique JWT `eyJ…` / `VITE_SUPABASE_ANON` | Pas de commit de secret réel trouvé (seulement docs d’audit)      |
| `.env` local                                 | Encore `VITE_SUPABASE_URL` + `VITE_SUPABASE_ANON_KEY` (orphelins) |
| Supabase dans `src/`                         | **Aucune** référence                                              |
| Source maps prod                             | `sourcemap: Boolean(SENTRY_AUTH_TOKEN)` — off par défaut          |
| Dependabot                                   | Activé (weekly npm + GH Actions)                                  |
| Lockfile                                     | `package-lock.json` présent                                       |

### CDN

| Ressource    | Status 2026-08                                                 |
| ------------ | -------------------------------------------------------------- |
| mana-font    | **Pin 1.18.0 + SRI sha384** (`index.html`) — FIXED vs baseline |
| Google Fonts | Sans SRI (pratique courante ; surface CSS)                     |

---

## 8. PWA / SW / cache

| Contrôle                          | Status                                                                    |
| --------------------------------- | ------------------------------------------------------------------------- |
| `public/sw.js` killer             | Clear caches → unregister → reload clients                                |
| Headers no-cache sw.js            | Confirmé prod                                                             |
| `main.tsx` unregister client-side | Belt-and-suspenders                                                       |
| Cache poisoning sticky            | Pattern correct ; risque résiduel bas si vieux SW non killer (historique) |
| Assets `/assets/*`                | `immutable` long cache — OK (hash filenames)                              |
| `index.html`                      | no-cache — OK                                                             |

---

## 9. Re-audit baseline 2026-04-06

| ID ancien  | Titre                         | Status 2026-08               | Preuve                                                                                                                                                                     |
| ---------- | ----------------------------- | ---------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| FINDING-01 | CSP sans Sentry ingest        | **CHANGED / N/A risk**       | Sentry **volontairement off** ; CSP prod **sans** Sentry (correct pour DSN unset). Doc SECURITY.md **encore** prétend que Sentry est dans vercel.json → **SEC-2026-08-04** |
| FINDING-02 | Supabase JWT dans `.env`      | **PARTIALLY FIXED**          | Hors code + hors git ; **fichier local `.env` encore peuplé** → SEC-2026-08-05                                                                                             |
| FINDING-03 | mana-font `@latest` sans SRI  | **FIXED**                    | `mana-font@1.18.0` + integrity sha384                                                                                                                                      |
| FINDING-04 | 19 vulns dev                  | **STILL OPEN (hygiene)**     | 32 full audit ; 0 critical **prod** ; 3 moderate prod                                                                                                                      |
| FINDING-05 | robots/sitemap old domain     | **FIXED**                    | `manatuner.app` 2026-08-01                                                                                                                                                 |
| FINDING-06 | SECURITY.md claim AES-256     | **FIXED**                    | « JSON », pas AES                                                                                                                                                          |
| FINDING-07 | localStorage quota multi-clés | **PARTIALLY FIXED**          | privacy.ts quota fallback ; multi-clés restent ; wipe incomplet → SEC-2026-08-02                                                                                           |
| FINDING-08 | sanitize regex                | **STILL OPEN (Low accepté)** | Toujours vrai ; React escape = contrôle principal                                                                                                                          |
| FINDING-09 | legacy encrypted storage hook | **FIXED / N/A**              | `useAnalysisStorage.ts` **supprimé**                                                                                                                                       |
| FINDING-10 | Redux DevTools DEV only       | **OK**                       | `devTools: import.meta.env.DEV`                                                                                                                                            |
| FINDING-11 | Input validation (Info)       | **OK maintenu**              | Zod + encodeURIComponent Scryfall                                                                                                                                          |
| FINDING-12 | Headers (Info)                | **OK renforcé**              | base-uri, form-action, object-src, upgrade-insecure                                                                                                                        |
| FINDING-13 | noopener links (Info)         | **OK maintenu**              |                                                                                                                                                                            |

---

## 10. Findings détaillés (SEC-…)

### SEC-2026-08-01 — Share URL embarque la decklist

|              |                                                                        |
| ------------ | ---------------------------------------------------------------------- |
| **Sévérité** | **P2 Medium**                                                          |
| **CWE**      | CWE-598 (Information Exposure Through Query Strings) · CWE-200         |
| **OWASP**    | A01:2021 Broken Access Control (confidentialité par obscurité de lien) |

**Description :** `buildShareUrl` place la decklist encodée base64 dans `?d=` et le nom en clair dans `?name=`. Toute personne (ou système) qui voit l’URL complète peut reconstruire le deck.

**Impact :** Fuite deck compétitif via Discord, historique, partage d’écran, éventuels logs edge. Feature **intentionnelle** — le risque est le **sur-promesse** de confidentialité si l’utilisateur croit que « never leaves browser » s’applique aussi aux liens share.

**Preuve :** `src/utils/urlCodec.ts:35-48` ; toast « paste in Discord » AnalyzerPage.

**Repro :**

1. Analyzer → coller un deck → Share
2. Observer URL `https://www.manatuner.app/analyzer?d=…&name=…`
3. Ouvrir dans un navigateur privé → deck rechargé

**Remédiation :**

- Documenter clairement : « Share links contain your deck ; anyone with the link can see it »
- Optionnel : `Referrer-Policy: no-referrer` sur `/analyzer` seulement (trade-off analytics SEO)
- Optionnel long terme : fragment `#d=` (non envoyé au serveur) au lieu de query (limite logs CDN)
- Ne pas logger les query strings côté Vercel si configurable

**Effort :** S (docs) / M (fragment URL)

---

### SEC-2026-08-02 — Wipe privacy incomplet vs snackbar

|              |                                                                                |
| ------------ | ------------------------------------------------------------------------------ |
| **Sévérité** | **P2 Medium**                                                                  |
| **CWE**      | CWE-212 (Improper Removal of Sensitive Information Before Storage or Transfer) |
| **OWASP**    | A04:2021 Insecure Design                                                       |

**Description :** `PrivacyStorage.clearAllLocalData()` ne supprime que `manatuner_analyses`, legacy keys, et vieux flags. **Ne touche pas** à `persist:root` (deckList Redux), caches lands/producers, library progress, acceleration settings, theme. Le snackbar affiche « All data has been deleted ».

**Impact :** Utilisateur croit avoir tout effacé ; le deck courant reste dans le navigateur (et peut être re-partagé / re-analysé). Dialog titre plus honnête (« saved analyses ») mais snackbar trompeur.

**Preuve :** `src/lib/privacy.ts:180-188` ; `PrivacySettings.tsx:261-265` ; `src/store/index.ts` whitelist `analyzer` avec `deckList`.

**Repro :**

1. Analyser un deck (persist:root peuplé)
2. Privacy → Reset → Delete
3. Recharger : analyses vides mais textarea / state Redux peut encore contenir le deck

**Remédiation :**

- Étendre wipe : `persistor.purge()`, remove caches + library + acceleration
- Ou renommer UI : « Delete saved analyses only » + lister ce qui reste
- Align snackbar et docs

**Effort :** S–M

---

### SEC-2026-08-03 — Dépendances prod moderate (DOMPurify, React Router)

|              |                                                             |
| ------------ | ----------------------------------------------------------- |
| **Sévérité** | **P2 Medium** (exploitable réel : **Low** dans ce codebase) |
| **CWE**      | CWE-1395                                                    |
| **OWASP**    | A06:2021 Vulnerable and Outdated Components                 |

**Description :** `npm audit --omit=dev` → 3 moderate :

- `dompurify` ≤3.4.11 (via jspdf) — multiples bypass sanitization
- `react-router` / `react-router-dom` 6.30.3 — open redirect protocol-relative / backslash ; SSR constructor injection (N/A sans SSR)

**Impact :**

- DOMPurify : path PDF via canvas image, pas HTML user → **risque résiduel faible**
- react-router open redirect : pas de `navigate(userInput)` identifié → **faible**

**Preuve :** `npm audit --omit=dev` ; `npm ls dompurify` → jspdf@4.2.1 ; ManaBlueprint html2canvas+jsPDF.

**Remédiation :** `npm audit fix` (ou bump jspdf/react-router-dom) + retest unit/e2e.

**Effort :** S

---

### SEC-2026-08-04 — Drift SECURITY.md CSP / Sentry

|              |                                         |
| ------------ | --------------------------------------- |
| **Sévérité** | **P2 Medium** (docs / operational risk) |
| **CWE**      | CWE-1059                                |
| **OWASP**    | A05:2021 Security Misconfiguration      |

**Description :** `SECURITY.md` affirme que `connect-src` inclut `https://*.ingest.sentry.io` et que c’est « already in vercel.json ». **Faux** : `vercel.json` et headers prod n’ont que `'self' https://api.scryfall.com`.

**Impact :**

- Aujourd’hui (DSN unset) : **sécurité renforcée** (même si DSN fuité, CSP bloquerait — en fait DSN absent)
- Demain si on active DSN sans mettre à jour CSP : monitoring mort (déjà noté en 2026-04)
- Confiance docs érodée

**Preuve :** `SECURITY.md` lignes CSP vs `vercel.json:37` vs curl prod.

**Remédiation :** Aligner SECURITY.md sur la CSP réelle ; documenter « Sentry domain must be added when enabling DSN ».

**Effort :** S

---

### SEC-2026-08-05 — `.env` local Supabase orphelin

|              |                   |
| ------------ | ----------------- |
| **Sévérité** | **P3 Low**        |
| **CWE**      | CWE-798 / CWE-200 |
| **OWASP**    | A07:2021          |

**Description :** `.env` local contient encore `VITE_SUPABASE_*`. Non tracké git, zéro usage `src/`. Hygiene.

**Impact :** Fuite machine locale / backup ; confusion contributeurs.

**Remédiation :** Purger valeurs ; optionnel supprimer projet Supabase dashboard ; garder `.env.example` sans Supabase (déjà le cas).

**Effort :** S

---

### SEC-2026-08-06 — Sanitizers regex (hygiene)

|              |                    |
| ------------ | ------------------ |
| **Sévérité** | **P3 Low**         |
| **CWE**      | CWE-79             |
| **OWASP**    | A03:2021 Injection |

**Description :** `sanitizeInput` / `sanitizeString` basés regex. Bypassables en isolation. Mitigé par absence de sinks HTML et React escaping.

**Remédiation :** Ne pas s’y fier pour du HTML ; si un jour HTML user → DOMPurify à jour.

**Effort :** S (doc) / M (si refactor)

---

### SEC-2026-08-07 — `style-src 'unsafe-inline'`

|              |                      |
| ------------ | -------------------- |
| **Sévérité** | **P3 Low** (accepté) |
| **CWE**      | CWE-693              |
| **OWASP**    | A05:2021             |

**Description :** Requis par MUI. N’autorise pas l’exécution JS. CSS injection via XSS serait déjà un échec `script-src`.

**Remédiation :** Non prioritaire (nonces CSS = gros chantier MUI).

**Effort :** L

---

### SEC-2026-08-08 — Google Fonts / jsDelivr sans pin complet

|              |            |
| ------------ | ---------- |
| **Sévérité** | **P3 Low** |
| **CWE**      | CWE-829    |
| **OWASP**    | A08:2021   |

**Description :** mana-font pinné + SRI. Fonts Google CSS non pinnées (API dynamique). jsDelivr fonts woff servi depuis même package pinné.

**Remédiation :** Self-host Roboto/Cinzel + mana-font npm pour zéro CDN runtime.

**Effort :** M

---

### SEC-2026-08-09 — Dev dependency vulns (vite/vitest/undici)

|              |                               |
| ------------ | ----------------------------- |
| **Sévérité** | **P3 Low** (dev machine / CI) |
| **CWE**      | CWE-1395                      |

**Description :** 32 vulns full tree dont critical vitest UI, high vite path traversal — **dev server only**.

**Remédiation :** `npm audit fix` ; bump vitest/vite/vercel CLI ; ne pas exposer dev server sur Internet.

**Effort :** S–M

---

### SEC-2026-08-10 — `Access-Control-Allow-Origin: *` sur HTML/assets

|              |               |
| ------------ | ------------- |
| **Sévérité** | **Info / P3** |
| **CWE**      | CWE-942       |

**Description :** Header présent sur réponses Vercel static. Pas de cookies, pas d’API privée → impact négligeable.

**Remédiation :** Aucune urgente.

**Effort :** S si restriction désirée

---

### Info — Bonnes pratiques observées

1. **CSP stricte scripts** + frame-ancestors + base-uri + form-action
2. **Privacy Network clean** pendant Analyze (Scryfall only)
3. **Sentry gated + scrubber** prêt sans activer
4. **JSON-LD escape** `</script>`
5. **SW killer** + no-cache + client unregister
6. **Zod sur import analyses** + `encodeURIComponent` Scryfall
7. **External links** noopener
8. **Dependabot** + lockfile
9. **Source maps off** sans token Sentry

---

## 11. Plan de remédiation priorisé (P0→P3)

| Priorité | ID             | Action                                | Effort | Status code v2.7.9                                                   |
| -------- | -------------- | ------------------------------------- | ------ | -------------------------------------------------------------------- |
| —        | —              | **Aucun P0/P1**                       | —      | —                                                                    |
| **P2**   | SEC-2026-08-02 | Wipe complet + copy honnête           | S–M    | **FIXED**                                                            |
| **P2**   | SEC-2026-08-01 | Share hash `#d=` + toast + dual parse | S–M    | **FIXED**                                                            |
| **P2**   | SEC-2026-08-04 | Corriger SECURITY.md CSP              | S      | **FIXED**                                                            |
| **P2**   | SEC-2026-08-03 | Bump dompurify / react-router         | S      | **FIXED** (dompurify 3.4.12 ; RR 7.18.2 — residual RSC advisory N/A) |
| **P3**   | SEC-2026-08-05 | Purger `.env` Supabase local          | S      | **FIXED** (local only)                                               |
| **P3**   | SEC-2026-08-06 | Doc React escape SSOT XSS             | S      | **FIXED** (SECURITY.md)                                              |
| **P3**   | SEC-2026-08-09 | Bump dev toolchain                    | M      | **OPEN** (dev-only noise)                                            |
| **P3**   | SEC-2026-08-08 | Self-host fonts (optionnel)           | M      | **DEFERRED**                                                         |
| **P3**   | SEC-2026-08-07 | style-src unsafe-inline MUI           | L      | **ACCEPTED**                                                         |

### 11bis. Remédiations livrées (2026-08-01)

| Fichier / zone                       | Changement                                                         |
| ------------------------------------ | ------------------------------------------------------------------ |
| `src/utils/urlCodec.ts`              | `buildShareUrl` → hash ; `parseShareParams` hash puis query legacy |
| `src/lib/privacy.ts`                 | `clearAllLocalData` sweep complet + manatuner\* / persist:\*       |
| `PrivacySettings` / `MyAnalysesPage` | wipe + `clearAnalyzer` + `persistor.purge()`                       |
| `SECURITY.md`                        | CSP = vercel.json ; share/wipe/Sentry checklist                    |
| `package.json`                       | 2.7.9 · `react-router-dom@^7.18.2`                                 |
| Tests                                | `urlCodec.test.ts` · `privacy.clearAll.test.ts` → **404** unit     |

**Ne pas faire sans owner :** activer `VITE_SENTRY_DSN`, réintroduire backend/Supabase, analytics decklist, self-host fonts.

---

## 12. Tests recommandés (checklist)

### Manuelle (régression privacy)

- [ ] Analyzer → Network : uniquement `api.scryfall.com` (+ static fonts/cdn)
- [ ] Confirmer absence `ingest.sentry.io`
- [ ] Share URL : coller dans navigateur privé → deck recharge
- [ ] Reset privacy : vérifier ce qui reste dans Application → Local Storage
- [ ] Export JSON → Import → pas d’appel réseau
- [ ] Liens Library `rel=noopener`
- [ ] Feedback Tally : s’ouvre nouvel onglet, pas de script injecté

### Automatisable

- [ ] `npm audit --omit=dev` dans CI (fail sur high+)
- [ ] Grep CI : `dangerouslySetInnerHTML`, `eval(`, `VITE_SUPABASE`
- [ ] Test unitaire : `decodeDeck` + caractères `<script>` ne cassent pas le render
- [ ] Playwright : network allowlist sur parcours Analyze

### Headers

```bash
curl -sI https://www.manatuner.app | grep -iE 'content-security|strict-transport|x-frame|referrer|permissions|set-cookie'
curl -sI https://www.manatuner.app/sw.js | grep -i cache-control
```

---

## 13. Annexes

### A. Headers prod (extrait)

Voir §3 — capture complète 2026-08-01 18:43 UTC.

### B. npm audit summary

```
Prod (--omit=dev): 3 moderate (dompurify, react-router, react-router-dom)
Full: 32 (3 low, 10 moderate, 15 high, 4 critical) — majority dev/transitive
```

### C. Network Analyze (extrait Playwright)

```
POST api.scryfall.com/cards/collection
GET  api.scryfall.com/cards/named?exact=…
GET  api.scryfall.com/cards/named?fuzzy=…
(+ fonts.googleapis.com, cdn.jsdelivr.net mana-font@1.18.0, self assets)
NO sentry / analytics / tally (sauf clic user) / supabase
```

### D. Fichiers clés relus

- `SECURITY.md`, `vercel.json`, `src/main.tsx`, `src/components/PrivacySettings.tsx`
- `src/lib/privacy.ts`, `src/utils/urlCodec.ts`, `src/store/index.ts`
- `src/services/deckAnalyzer.ts` (fetch Scryfall), `src/components/common/SEO.tsx`
- `public/sw.js`, `index.html` (CDN SRI), `docs/security/SECURITY_AUDIT_REPORT.md`

### E. Self-score & non-testé

| Item                              | Status                     |
| --------------------------------- | -------------------------- |
| Headers prod avec preuves         | ✅                         |
| Verdict claim decklists           | ✅ (GO + nuances)          |
| Baseline re-statusée              | ✅                         |
| Findings avec repro + remédiation | ✅                         |
| Fix appliqués                     | ❌ volontaire (audit only) |
| Logs Vercel query strings         | ❌ non inspectés           |
| XSS dynamique payload             | ❌ non offensif            |
| Compte Vercel / env panel         | ❌ non accès               |

**Confiance globale : 8.5/10.**

---

## Clôture

- Rapport : `docs/session/SECURITY_AUDIT_2026-08-01.md`
- Mode : **audit only** — attendre **« go fix »** (ou « go fix P2 ») pour toute remédiation
- Priorité business rappel : `LAUNCH.md` (distribution) — cet audit protège la **trust**, ne remplace pas le lancement

**Prochaine phrase utile :**

```
Relance docs/session/PROMPT_SECURITY_AUDIT.md.
Baseline : docs/session/SECURITY_AUDIT_2026-08-01.md
Mode : go fix uniquement P2 listés, un finding à la fois, tests de non-régression.
```
