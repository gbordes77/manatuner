# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: core-flows/final-audit.spec.js >> NR-M02 actual Try Example resolves all twenty public card names and saves sixty cards
- Location: tests/e2e/core-flows/final-audit.spec.js:90:5

# Error details

```
Error: browserType.launch: Failed to launch the browser process.
Browser logs:

<launching> /Users/guillaumebordes/Library/Caches/ms-playwright/firefox-1543/firefox/Nightly.app/Contents/MacOS/firefox -no-remote -headless -profile /tmp/playwright_firefoxdev_profile-9lpDqx -juggler-pipe -silent
<launched> pid=50466
[pid=50466][err] *** You are running in headless mode.
[pid=50466][err] Could not find profile folder.
[pid=50466] <process did exit: exitCode=1, signal=null>
[pid=50466] starting temporary directories cleanup
Call log:
  - <launching> /Users/guillaumebordes/Library/Caches/ms-playwright/firefox-1543/firefox/Nightly.app/Contents/MacOS/firefox -no-remote -headless -profile /tmp/playwright_firefoxdev_profile-9lpDqx -juggler-pipe -silent
  - <launched> pid=50466
  - [pid=50466][err] *** You are running in headless mode.
  - [pid=50466][err] Could not find profile folder.
  - [pid=50466] <process did exit: exitCode=1, signal=null>
  - [pid=50466] starting temporary directories cleanup
  - [pid=50466] <gracefully close start>
  - [pid=50466] <kill>
  - [pid=50466] <skipped force kill spawnedProcess.killed=false processClosed=true>
  - [pid=50466] finished temporary directories cleanup
  - [pid=50466] <gracefully close end>

```