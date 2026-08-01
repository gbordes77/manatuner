# Security Policy

## Architecture Security Model

ManaTuner is a **100% client-side application**. There is no backend, no database, no server-side processing, and no user authentication. All calculations happen in your browser.

| Aspect                | Status                                                           |
| --------------------- | ---------------------------------------------------------------- |
| **Backend**           | None - 100% client-side                                          |
| **Database**          | None - localStorage only                                         |
| **Authentication**    | None - no accounts                                               |
| **Data transmission** | Decklists never leave your browser                               |
| **External API**      | Scryfall (read-only, public card data)                           |
| **Crash reporting**   | **Off by default** (Sentry SDK installed, DSN unset — see below) |

**Version :** 2.7.7 (2026-08-01)

## Sentry (optional, privacy-gated)

| Piece                 | Status                                                                                   |
| --------------------- | ---------------------------------------------------------------------------------------- |
| `@sentry/react`       | Dependency present                                                                       |
| `@sentry/vite-plugin` | DevDependency — runs **only** if `SENTRY_AUTH_TOKEN` + org/project set                   |
| Runtime `Sentry.init` | **Only** if `import.meta.env.PROD && VITE_SENTRY_DSN`                                    |
| Production DSN        | **Must remain unset** on Vercel unless privacy checklist completed                       |
| `beforeSend` scrubber | Strips URL query (`?d=` share links), cookies, user, breadcrumb data, truncates messages |

**Do not set `VITE_SENTRY_DSN` in production** without:

1. Keeping the scrubber in `src/main.tsx`
2. Updating `PrivacySettings.tsx` to disclose anonymous crash reports
3. Offering an opt-out for EU/GDPR users
4. Confirming CSP `connect-src` includes `https://*.ingest.sentry.io` (already in `vercel.json`)

Until then: **no crash reports leave the browser** — PrivacySettings copy stays accurate.

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

Strict CSP headers configured in `vercel.json`:

```
default-src 'self';
script-src 'self';
style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdn.jsdelivr.net;
img-src 'self' data: https://cards.scryfall.io https://c1.scryfall.com;
connect-src 'self' https://api.scryfall.com https://*.ingest.sentry.io;
frame-ancestors 'none';
```

### Additional Headers

- `X-Frame-Options: DENY` - Prevents clickjacking
- `X-Content-Type-Options: nosniff` - Prevents MIME sniffing
- `Strict-Transport-Security` - HTTPS enforced with preload
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy: camera=(), microphone=(), geolocation=()`

### Data Privacy

- All deck data stored in browser `localStorage` as JSON (no server transmission)
- No cookies, no tracking, no analytics, no crash reports (default)
- Export/import feature for data portability
- One-click data deletion

### Dependencies

- Regular `npm audit` checks
- Dependabot enabled for automated security updates
- Minimal dependency footprint

## For Contributors

- Never commit secrets or API keys (`VITE_SENTRY_DSN`, `SENTRY_AUTH_TOKEN`, …)
- All PRs reviewed before merge
- Use `npm audit` before submitting changes
- Follow CSP restrictions when adding external resources

---

**Last Updated**: 2026-08-01  
**Version**: 2.7.7
