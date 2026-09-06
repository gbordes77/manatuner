# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: core-flows/final-audit.spec.js >> V05 blueprint JSON matches results and PNG/PDF retain the whole tall blueprint
- Location: tests/e2e/core-flows/final-audit.spec.js:31:5

# Error details

```
Error: browserType.launch: Failed to launch the browser process.
Browser logs:

<launching> /Users/guillaumebordes/Library/Caches/ms-playwright/firefox-1543/firefox/Nightly.app/Contents/MacOS/firefox -no-remote -headless -profile /tmp/playwright_firefoxdev_profile-rvp95T -juggler-pipe -silent
<launched> pid=50448
[pid=50448][err] *** You are running in headless mode.
[pid=50448][err] Could not find profile folder.
[pid=50448] <process did exit: exitCode=1, signal=null>
[pid=50448] starting temporary directories cleanup
Call log:
  - <launching> /Users/guillaumebordes/Library/Caches/ms-playwright/firefox-1543/firefox/Nightly.app/Contents/MacOS/firefox -no-remote -headless -profile /tmp/playwright_firefoxdev_profile-rvp95T -juggler-pipe -silent
  - <launched> pid=50448
  - [pid=50448][err] *** You are running in headless mode.
  - [pid=50448][err] Could not find profile folder.
  - [pid=50448] <process did exit: exitCode=1, signal=null>
  - [pid=50448] starting temporary directories cleanup
  - [pid=50448] <gracefully close start>
  - [pid=50448] <kill>
  - [pid=50448] <skipped force kill spawnedProcess.killed=false processClosed=true>
  - [pid=50448] finished temporary directories cleanup
  - [pid=50448] <gracefully close end>

```