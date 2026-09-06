# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: core-flows/privacy-audit.spec.js >> F12 detailed policy discloses third parties, deletion limits and disabled candidate monitoring
- Location: tests/e2e/core-flows/privacy-audit.spec.js:3:5

# Error details

```
Error: browserType.launch: Failed to launch the browser process.
Browser logs:

<launching> /Users/guillaumebordes/Library/Caches/ms-playwright/firefox-1543/firefox/Nightly.app/Contents/MacOS/firefox -no-remote -headless -profile /tmp/playwright_firefoxdev_profile-HR0ckS -juggler-pipe -silent
<launched> pid=50485
[pid=50485][err] *** You are running in headless mode.
[pid=50485][err] Could not find profile folder.
[pid=50485] <process did exit: exitCode=1, signal=null>
[pid=50485] starting temporary directories cleanup
Call log:
  - <launching> /Users/guillaumebordes/Library/Caches/ms-playwright/firefox-1543/firefox/Nightly.app/Contents/MacOS/firefox -no-remote -headless -profile /tmp/playwright_firefoxdev_profile-HR0ckS -juggler-pipe -silent
  - <launched> pid=50485
  - [pid=50485][err] *** You are running in headless mode.
  - [pid=50485][err] Could not find profile folder.
  - [pid=50485] <process did exit: exitCode=1, signal=null>
  - [pid=50485] starting temporary directories cleanup
  - [pid=50485] <gracefully close start>
  - [pid=50485] <kill>
  - [pid=50485] <skipped force kill spawnedProcess.killed=false processClosed=true>
  - [pid=50485] finished temporary directories cleanup
  - [pid=50485] <gracefully close end>

```