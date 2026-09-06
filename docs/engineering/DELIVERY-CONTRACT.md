# ManaTuner delivery contract

The public build is `npm run build:vercel`, configured by `vercel.json` and used by both CI and PR validation. It runs the following checks in order and exits nonzero on any failure:

1. ESLint and TypeScript.
2. Source, component and mathematical regression tests. Mathematical evidence is written to a fresh temporary directory, or to the explicit `MANATUNER_MATH_EVIDENCE_DIR`; historical audit proofs are not overwritten.
3. The delivery gate's own negative and positive tests.
4. Vite build of the candidate.
5. Bundle budget and dependency audit (high severity blocks).
6. Mandatory prerender and HTML contract verification on that same candidate.
7. Chromium accessibility, keyboard and HTTP/direct-load tests on that same candidate, using a strict static server. Accessibility scans block serious and critical axe findings; footer contrast uses the quantitative axe rule and a failing-contrast fixture proves detection.

There is no second publication path. The disabled GitHub deployment job remains disabled. Vercel's native integration may start before GitHub checks finish, but its configured build cannot finish successfully before these shared checks pass. A failed gate must remain a failed build; do not add soft-fail switches or `continue-on-error`. GitHub branch protection and Vercel private settings are separate controls, and this repository does not establish that GitHub required checks are enabled. The setting inspection and local execution evidence for the September audit live in `preuves-corrections/S002/`; no deployment was triggered to test a failure.

## HTML and routing

The delivery contract includes every route returned by `buildPrerenderRoutes(articlesReferenceSeed)`: the nine static pages, every article, and every author (101 routes at this change). Each is a real `route/index.html` with rendered content, a unique title and description, a route canonical and matching social metadata. Default HTML metadata is owned by Helmet, so route metadata replaces it. Native form controls in snapshots are disabled until React mounts, preventing input from being lost during mount. Links and editorial content remain available without JavaScript.

Library skipping and soft prerender failures are unsupported. Missing rendered content, duplicate or wrong metadata, missing local entry assets and missing route files fail the build. `npm run check:html -- /absolute/candidate/path` can inspect a saved artifact independently.

Vercel uses filesystem routing with `cleanUrls: true`; there is no catch-all SPA rewrite. Existing aliases `/mes-analyses` and `/reading-list` have explicit permanent redirects. Unknown URLs and missing assets reach the generated `404.html`, with meaningful content and `noindex`, rather than an indexable homepage. This follows Vercel's [static custom 404 contract](https://vercel.com/kb/guide/custom-404-page) and [filesystem precedence/configuration](https://vercel.com/docs/project-configuration/vercel-json), consulted 2026-09-06. React's client-side fallback also declares noindex.

`scripts/serve-candidate.mjs` provides local static HTTP verification, including 404 status, without Vite's SPA fallback. It is a local implementation of the selected static contract, not a Vercel emulator and not proof of a deployed HTTP response. Production HTTP, native integration behavior after a real authorized deployment, Search Console and full WCAG compliance require their own evidence.

## Isolated local run

Use absolute paths for `PRERENDER_DIST`, `DELIVERY_TEST_OUTPUT` and optionally `MANATUNER_MATH_EVIDENCE_DIR`. The first controls Vite, prerender, bundle budget, HTML checks and the candidate server consistently. The second keeps test artifacts away from existing reports. The candidate server reserves port 4175 and refuses to reuse an existing server; prerender uses port 4174 by default. Set no Sentry credentials/DSN for an offline telemetry-free local candidate.

Nightly suites install and request Chromium explicitly. Failures fail their jobs. These scheduled runs are supplementary signals and do not establish publication gating or WCAG certification.
