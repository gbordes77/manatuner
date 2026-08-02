# Security Policy

## Architecture Security Model

ManaTuner is a **100% client-side application**. There is no backend, no database, no server-side processing, and no user authentication. All calculations happen in your browser.

| Aspect                | Status                                                           |
| --------------------- | ---------------------------------------------------------------- |
| **Backend**           | None - 100% client-side                                          |
| **Database**          | None - localStorage only                                         |
| **Authentication**    | None - no accounts                                               |
| **Data transmission** | No ManaTuner server stores decks; Scryfall resolves card names   |
| **External API**      | Scryfall (read-only, public card data)                           |
| **Crash reporting**   | **Off by default** (Sentry SDK installed, DSN unset — see below) |

**Version :** 2.7.9 (2026-08-01) · Audit : `docs/session/SECURITY_AUDIT_2026-08-01.md`

## Sentry (optional, privacy-gated)

| Piece                 | Status                                                                                |
| --------------------- | ------------------------------------------------------------------------------------- |
| `@sentry/react`       | Dependency present                                                                    |
| `@sentry/vite-plugin` | DevDependency — runs **only** if `SENTRY_AUTH_TOKEN` + org/project set                |
| Runtime `Sentry.init` | **Only** if `import.meta.env.PROD && VITE_SENTRY_DSN`                                 |
| Production DSN        | **Must remain unset** on Vercel unless privacy checklist completed                    |
| `beforeSend` scrubber | Strips URL query/hash share decks, cookies, user, breadcrumb data, truncates messages |

**Do not set `VITE_SENTRY_DSN` in production** without:

1. Keeping the scrubber in `src/main.tsx`
2. Updating `PrivacySettings.tsx` to disclose anonymous crash reports
3. Offering an opt-out for EU/GDPR users
4. **Adding** `https://*.ingest.sentry.io` to CSP `connect-src` in `vercel.json` (it is **not** present by default — intentional while DSN is unset)

Until then: **no crash reports leave the browser** — PrivacySettings copy stays accurate.

**CSP note (T11):** production `connect-src` intentionally omits `https://*.ingest.sentry.io`.
Activating `VITE_SENTRY_DSN` **requires** adding that host to CSP in `vercel.json` first,
otherwise the browser will block Sentry uploads. Do not widen CSP until the privacy
checklist above is complete and the DSN is deliberately set.

## Reporting a Vulnerability

If you discover a security vulnerability:

1. **DO NOT** create a public GitHub issue
2. Use [GitHub Security Advisories](https://github.com/gbordes77/manatuner/security/advisories) (preferred)
3. Or email the maintainer directly via GitHub profile

### Response Timeline

- **Acknowledgment**: Within 48 hours
- **Assessment**: Within 7 days
- **Fix**: Depends on severity

## Security Measures

### Content Security Policy (CSP)

Production CSP (must match `vercel.json` — source of truth):

```
default-src 'self';
script-src 'self';
style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdn.jsdelivr.net;
font-src 'self' https://fonts.gstatic.com https://cdn.jsdelivr.net data:;
img-src 'self' data: https://cards.scryfall.io;
connect-src 'self' https://api.scryfall.com;
frame-ancestors 'none';
base-uri 'none';
form-action 'self';
object-src 'none';
upgrade-insecure-requests
```

Notes:

- `style-src 'unsafe-inline'` is required by MUI; **scripts** stay `'self'` only (primary XSS control).
- XSS defense SSOT is React’s default escaping + no `dangerouslySetInnerHTML`. Regex sanitizers in `validations.ts` are defense-in-depth only, not a HTML sink control.

### Additional Headers

- `X-Frame-Options: DENY` - Prevents clickjacking
- `X-Content-Type-Options: nosniff` - Prevents MIME sniffing
- `Strict-Transport-Security` - HTTPS enforced with preload
- `Referrer-Policy: strict-origin-when-cross-origin` (mitigates share-link referrer leakage to third parties)
- `Permissions-Policy: camera=(), microphone=(), geolocation=(), interest-cohort=(), browsing-topics=(), attribution-reporting=()`

### Data Privacy

- All deck data stored in browser `localStorage` as JSON (no ManaTuner server transmission)
- Share links encode the deck in the **URL hash** (`#d=…`) so edge logs do not receive the payload; **anyone with the link can open the deck** (by design)
- Legacy `?d=` query share links still load for backward compatibility
- No cookies, no tracking, no analytics, no crash reports (default)
- Export/import feature for data portability
- Reset wipes analyses, Redux persist (`persist:root`), caches, library progress, and prefs

### Dependencies

- Regular `npm audit` checks (prod focus: `npm audit --omit=dev`)
- Dependabot enabled for automated security updates
- Minimal dependency footprint
- CDN: mana-font pinned + SRI in `index.html`

## For Contributors

- Never commit secrets or API keys (`VITE_SENTRY_DSN`, `SENTRY_AUTH_TOKEN`, …)
- Do not add Supabase / backend without an explicit product decision
- All PRs reviewed before merge
- Use `npm audit` before submitting changes
- Follow CSP restrictions when adding external resources

---

**Last Updated**: 2026-08-01  
**Version**: 2.7.9
