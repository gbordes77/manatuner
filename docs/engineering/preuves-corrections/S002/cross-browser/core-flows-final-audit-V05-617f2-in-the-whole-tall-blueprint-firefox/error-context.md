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

<launching> /Users/guillaumebordes/Library/Caches/ms-playwright/firefox-1543/firefox/Nightly.app/Contents/MacOS/firefox -no-remote -headless -profile /var/folders/_r/p2tt2k510nn24br_gjfh3t1h0000gn/T/playwright_firefoxdev_profile-1vZ0T9 -juggler-pipe -silent
<launched> pid=50118
[pid=50118][err] *** You are running in headless mode.
[pid=50118][err] Could not find profile folder.
[pid=50118] <process did exit: exitCode=1, signal=null>
[pid=50118] starting temporary directories cleanup
Call log:
  - <launching> /Users/guillaumebordes/Library/Caches/ms-playwright/firefox-1543/firefox/Nightly.app/Contents/MacOS/firefox -no-remote -headless -profile /var/folders/_r/p2tt2k510nn24br_gjfh3t1h0000gn/T/playwright_firefoxdev_profile-1vZ0T9 -juggler-pipe -silent
  - <launched> pid=50118
  - [pid=50118][err] *** You are running in headless mode.
  - [pid=50118][err] Could not find profile folder.
  - [pid=50118] <process did exit: exitCode=1, signal=null>
  - [pid=50118] starting temporary directories cleanup
  - [pid=50118] <gracefully close start>
  - [pid=50118] <kill>
  - [pid=50118] <skipped force kill spawnedProcess.killed=false processClosed=true>
  - [pid=50118] finished temporary directories cleanup
  - [pid=50118] <gracefully close end>

```