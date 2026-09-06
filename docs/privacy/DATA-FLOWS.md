# ManaTuner: technical data-flow inventory

Reviewed 2026-09-06 for F12. This is a source-level inventory, not legal certification or proof of deployed configuration. Public wording is in `/privacy`, the data settings dialog and the home/guide pages.

## Network

| Destination | Trigger and information | Purpose / limits |
| --- | --- | --- |
| Site hosting service | Document, asset and route requests; IP and normal HTTP metadata | Delivery. Host logging/retention and current deployed settings require operator verification. Legacy `?d=` share payloads can reach host logs. |
| `api.scryfall.com` | Uncached resolution, image lookup, land/producer searches. `/cards/collection` POST includes arrays of `{name}`; named endpoints include exact/fuzzy names; other endpoints include card IDs or search queries. | Retrieve public metadata. These queries reveal looked-up cards. They do not upload the stored analysis result/history, but an array of names can reveal much of a deck. Index HTML also preconnects. |
| `cards.scryfall.io` | Card image URL requests, preconnect | Images; IP and request metadata visible to service. |
| `fonts.googleapis.com`, `fonts.gstatic.com` | Display-font stylesheet and font requests on page load | External Google Fonts resources, visible connection metadata. |
| `cdn.jsdelivr.net` | Pinned mana-font stylesheet, referenced fonts | Symbols, visible connection metadata. |
| Sentry DSN destination, only when configured | `PROD && VITE_SENTRY_DSN` in `src/main.tsx` | SDK configuration does not establish delivery: the current `vercel.json` connect-src permits self/Scryfall but no Sentry destination. No session replay configured. No DSN is introduced by F12. The policy displays actual build condition; it does not assert the production deployment's variables were inspected. |
| Recipients chosen by user | Shared link or exported JSON file | Deck/analysis disclosure to recipients. URL fragment sharing avoids sending the fragment in the HTTP request, but does not make a copied link secret or revocable. |

Sources: `index.html`, `src/services/cardResolver.ts`, `scryfall.ts`, `landService.ts`, `manaProducerService.ts`, `src/hooks/useCardImage.ts`, `src/main.tsx`, `src/utils/urlCodec.ts`. External retention is not inferred from client code. No new telemetry or third-party dependency added.

## Storage

| Storage | Contents / keys | Lifetime |
| --- | --- | --- |
| localStorage | `manatuner_analyses`, legacy `manatuner-analyses`, `persist:root` (current deck/settings), preferences `manatuner-theme`, onboarding/banner state, acceleration settings, `manatuner-library-progress-v1` | No application expiry for history/preferences; removed by user reset or browser. Private browsing, quotas or browser eviction can make persistence unavailable. |
| localStorage | `manatuner_lands_cache` | Land records expire after 30 days, checked on use. |
| localStorage | `manatuner_producer_cache` | Producer records expire after 7 days, checked on use. |
| IndexedDB `manatuner-scryfall`, store `cards-v1` | Card metadata keyed by lookup, which can reveal cards looked up | 30-day expiry checked on read, stale deletion asynchronous. |
| sessionStorage | `manatuner-commander-preset`, `mt-sw-cleared` | Browser session; reset removes these keys. |
| Memory | Resolver/image/land/producer caches, active UI state | Page lifetime; reload releases memory. |

`PrivacyStorage.clearAllLocalData` removes registered local keys (including legacy `userCode`, `manatuner_user_code`, `manatuner_privacy_mode`) and sweeps `manatuner*`/`persist:*` localStorage keys, removes known session keys and starts asynchronous IDB clearing. Exceptions are swallowed, so this is best effort, not an audited erasure guarantee. Settings also clears analyzer state and requests redux-persist purge. Remaining in-memory service caches can exist until reload. No storage algorithm was changed in F12.

Reset does not remove exported files, copied/shared links, browser history, third-party or host logs, or copies on other devices. Browser site-data controls provide a broader local cleanup; they do not revoke external copies. Old service workers and CacheStorage entries are cleared by app boot (`main.tsx`). Expiry periods are cache freshness windows, not scheduled secure erasure.

## Before enabling Sentry

Keep DSN unset until these tasks are completed by the operator:

1. Inspect the target environment's settings and establish the intended destination, purposes and retention. Verify its Content Security Policy permits only the approved monitoring destination before any authorized activation. The current source CSP does not allow Sentry; setting a DSN alone can configure the SDK while the browser blocks transmission. F12 does not open this CSP. Do not assume source comments establish deployed status.
2. Capture test events with non-sensitive fixtures in an isolated environment. Inspect errors, URLs, breadcrumbs and contexts as actually received. The current scrubber removes URL query/fragment, request payload/headers, user and extra data, but arbitrary exception and breadcrumb text can still contain sensitive values. Session replay stays disabled; review other default integrations.
3. Have a competent reviewer determine required legal information, legal qualifications and any user controls. Implement those requirements and update both policy and settings before activation. This checklist is not a legal conclusion or a consent implementation.
4. Review the build with monitoring enabled and disabled; confirm the public status and actual traffic agree. Record non-sensitive evidence and rollback procedure. Production testing or activation needs separate authorization.

F12-AC5 / V09 remain open: no competent legal validation is available in this correction session. V08 remains open: no real Sentry receipt was tested. The presence of this inventory does not establish compliance.
