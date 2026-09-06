# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: core-flows/input-contract-audit.spec.js >> NR-M11 independent white T1 demand: 24 Plains / 36 Savannah Lions rounds to 98% in exact mode
- Location: tests/e2e/core-flows/input-contract-audit.spec.js:159:5

# Error details

```
Error: browserType.launch: Failed to launch the browser process.
Browser logs:

<launching> /Users/guillaumebordes/Library/Caches/ms-playwright/firefox-1543/firefox/Nightly.app/Contents/MacOS/firefox -no-remote -headless -profile /var/folders/_r/p2tt2k510nn24br_gjfh3t1h0000gn/T/playwright_firefoxdev_profile-J3I3vQ -juggler-pipe -silent
<launched> pid=50137
[pid=50137][err] *** You are running in headless mode.
[pid=50137][err] Could not find profile folder.
[pid=50137] <process did exit: exitCode=1, signal=null>
[pid=50137] starting temporary directories cleanup
Call log:
  - <launching> /Users/guillaumebordes/Library/Caches/ms-playwright/firefox-1543/firefox/Nightly.app/Contents/MacOS/firefox -no-remote -headless -profile /var/folders/_r/p2tt2k510nn24br_gjfh3t1h0000gn/T/playwright_firefoxdev_profile-J3I3vQ -juggler-pipe -silent
  - <launched> pid=50137
  - [pid=50137][err] *** You are running in headless mode.
  - [pid=50137][err] Could not find profile folder.
  - [pid=50137] <process did exit: exitCode=1, signal=null>
  - [pid=50137] starting temporary directories cleanup
  - [pid=50137] <gracefully close start>
  - [pid=50137] <kill>
  - [pid=50137] <skipped force kill spawnedProcess.killed=false processClosed=true>
  - [pid=50137] finished temporary directories cleanup
  - [pid=50137] <gracefully close end>

```