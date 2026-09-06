# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: core-flows/mulligan-worker-recovery.spec.js >> F13 failed worker asset is recoverable; real worker runs again at 50k precision
- Location: tests/e2e/core-flows/mulligan-worker-recovery.spec.js:3:5

# Error details

```
Error: browserType.launch: Failed to launch the browser process.
Browser logs:

<launching> /Users/guillaumebordes/Library/Caches/ms-playwright/firefox-1543/firefox/Nightly.app/Contents/MacOS/firefox -no-remote -headless -profile /var/folders/_r/p2tt2k510nn24br_gjfh3t1h0000gn/T/playwright_firefoxdev_profile-0Xo6JK -juggler-pipe -silent
<launched> pid=50144
[pid=50144][err] *** You are running in headless mode.
[pid=50144][err] Could not find profile folder.
[pid=50144] <process did exit: exitCode=1, signal=null>
[pid=50144] starting temporary directories cleanup
Call log:
  - <launching> /Users/guillaumebordes/Library/Caches/ms-playwright/firefox-1543/firefox/Nightly.app/Contents/MacOS/firefox -no-remote -headless -profile /var/folders/_r/p2tt2k510nn24br_gjfh3t1h0000gn/T/playwright_firefoxdev_profile-0Xo6JK -juggler-pipe -silent
  - <launched> pid=50144
  - [pid=50144][err] *** You are running in headless mode.
  - [pid=50144][err] Could not find profile folder.
  - [pid=50144] <process did exit: exitCode=1, signal=null>
  - [pid=50144] starting temporary directories cleanup
  - [pid=50144] <gracefully close start>
  - [pid=50144] <kill>
  - [pid=50144] <skipped force kill spawnedProcess.killed=false processClosed=true>
  - [pid=50144] finished temporary directories cleanup
  - [pid=50144] <gracefully close end>

```