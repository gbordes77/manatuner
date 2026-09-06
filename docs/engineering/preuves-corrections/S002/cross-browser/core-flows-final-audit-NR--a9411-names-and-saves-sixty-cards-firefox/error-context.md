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

<launching> /Users/guillaumebordes/Library/Caches/ms-playwright/firefox-1543/firefox/Nightly.app/Contents/MacOS/firefox -no-remote -headless -profile /var/folders/_r/p2tt2k510nn24br_gjfh3t1h0000gn/T/playwright_firefoxdev_profile-Vrda0k -juggler-pipe -silent
<launched> pid=50134
[pid=50134][err] *** You are running in headless mode.
[pid=50134][err] Could not find profile folder.
[pid=50134] <process did exit: exitCode=1, signal=null>
[pid=50134] starting temporary directories cleanup
Call log:
  - <launching> /Users/guillaumebordes/Library/Caches/ms-playwright/firefox-1543/firefox/Nightly.app/Contents/MacOS/firefox -no-remote -headless -profile /var/folders/_r/p2tt2k510nn24br_gjfh3t1h0000gn/T/playwright_firefoxdev_profile-Vrda0k -juggler-pipe -silent
  - <launched> pid=50134
  - [pid=50134][err] *** You are running in headless mode.
  - [pid=50134][err] Could not find profile folder.
  - [pid=50134] <process did exit: exitCode=1, signal=null>
  - [pid=50134] starting temporary directories cleanup
  - [pid=50134] <gracefully close start>
  - [pid=50134] <kill>
  - [pid=50134] <skipped force kill spawnedProcess.killed=false processClosed=true>
  - [pid=50134] finished temporary directories cleanup
  - [pid=50134] <gracefully close end>

```