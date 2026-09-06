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

<launching> /Users/guillaumebordes/Library/Caches/ms-playwright/firefox-1543/firefox/Nightly.app/Contents/MacOS/firefox -no-remote -headless -profile /var/folders/_r/p2tt2k510nn24br_gjfh3t1h0000gn/T/playwright_firefoxdev_profile-jiG4ib -juggler-pipe -silent
<launched> pid=50120
[pid=50120][err] *** You are running in headless mode.
[pid=50120][err] Could not find profile folder.
[pid=50120] <process did exit: exitCode=1, signal=null>
[pid=50120] starting temporary directories cleanup
Call log:
  - <launching> /Users/guillaumebordes/Library/Caches/ms-playwright/firefox-1543/firefox/Nightly.app/Contents/MacOS/firefox -no-remote -headless -profile /var/folders/_r/p2tt2k510nn24br_gjfh3t1h0000gn/T/playwright_firefoxdev_profile-jiG4ib -juggler-pipe -silent
  - <launched> pid=50120
  - [pid=50120][err] *** You are running in headless mode.
  - [pid=50120][err] Could not find profile folder.
  - [pid=50120] <process did exit: exitCode=1, signal=null>
  - [pid=50120] starting temporary directories cleanup
  - [pid=50120] <gracefully close start>
  - [pid=50120] <kill>
  - [pid=50120] <skipped force kill spawnedProcess.killed=false processClosed=true>
  - [pid=50120] finished temporary directories cleanup
  - [pid=50120] <gracefully close end>

```