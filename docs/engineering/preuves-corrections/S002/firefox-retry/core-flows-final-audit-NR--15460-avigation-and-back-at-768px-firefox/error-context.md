# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: core-flows/final-audit.spec.js >> NR-M21/M27 shared deck survives direct navigation and back at 768px
- Location: tests/e2e/core-flows/final-audit.spec.js:64:7

# Error details

```
Error: browserType.launch: Failed to launch the browser process.
Browser logs:

<launching> /Users/guillaumebordes/Library/Caches/ms-playwright/firefox-1543/firefox/Nightly.app/Contents/MacOS/firefox -no-remote -headless -profile /tmp/playwright_firefoxdev_profile-7JD2ul -juggler-pipe -silent
<launched> pid=50453
[pid=50453][err] *** You are running in headless mode.
[pid=50453][err] Could not find profile folder.
[pid=50453] <process did exit: exitCode=1, signal=null>
[pid=50453] starting temporary directories cleanup
Call log:
  - <launching> /Users/guillaumebordes/Library/Caches/ms-playwright/firefox-1543/firefox/Nightly.app/Contents/MacOS/firefox -no-remote -headless -profile /tmp/playwright_firefoxdev_profile-7JD2ul -juggler-pipe -silent
  - <launched> pid=50453
  - [pid=50453][err] *** You are running in headless mode.
  - [pid=50453][err] Could not find profile folder.
  - [pid=50453] <process did exit: exitCode=1, signal=null>
  - [pid=50453] starting temporary directories cleanup
  - [pid=50453] <gracefully close start>
  - [pid=50453] <kill>
  - [pid=50453] <skipped force kill spawnedProcess.killed=false processClosed=true>
  - [pid=50453] finished temporary directories cleanup
  - [pid=50453] <gracefully close end>

```