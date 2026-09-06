# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: core-flows/final-audit.spec.js >> E02 mobile manabase tabs show their complete labels and open the deck
- Location: tests/e2e/core-flows/final-audit.spec.js:10:5

# Error details

```
Error: browserType.launch: Failed to launch the browser process.
Browser logs:

<launching> /Users/guillaumebordes/Library/Caches/ms-playwright/firefox-1543/firefox/Nightly.app/Contents/MacOS/firefox -no-remote -headless -profile /var/folders/_r/p2tt2k510nn24br_gjfh3t1h0000gn/T/playwright_firefoxdev_profile-rkq8oJ -juggler-pipe -silent
<launched> pid=50101
[pid=50101][err] *** You are running in headless mode.
[pid=50101][err] Could not find profile folder.
[pid=50101] <process did exit: exitCode=1, signal=null>
[pid=50101] starting temporary directories cleanup
Call log:
  - <launching> /Users/guillaumebordes/Library/Caches/ms-playwright/firefox-1543/firefox/Nightly.app/Contents/MacOS/firefox -no-remote -headless -profile /var/folders/_r/p2tt2k510nn24br_gjfh3t1h0000gn/T/playwright_firefoxdev_profile-rkq8oJ -juggler-pipe -silent
  - <launched> pid=50101
  - [pid=50101][err] *** You are running in headless mode.
  - [pid=50101][err] Could not find profile folder.
  - [pid=50101] <process did exit: exitCode=1, signal=null>
  - [pid=50101] starting temporary directories cleanup
  - [pid=50101] <gracefully close start>
  - [pid=50101] <kill>
  - [pid=50101] <skipped force kill spawnedProcess.killed=false processClosed=true>
  - [pid=50101] finished temporary directories cleanup
  - [pid=50101] <gracefully close end>

```