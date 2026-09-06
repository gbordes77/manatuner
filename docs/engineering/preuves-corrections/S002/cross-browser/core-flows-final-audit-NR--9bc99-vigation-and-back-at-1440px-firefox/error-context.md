# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: core-flows/final-audit.spec.js >> NR-M21/M27 shared deck survives direct navigation and back at 1440px
- Location: tests/e2e/core-flows/final-audit.spec.js:64:7

# Error details

```
Error: browserType.launch: Failed to launch the browser process.
Browser logs:

<launching> /Users/guillaumebordes/Library/Caches/ms-playwright/firefox-1543/firefox/Nightly.app/Contents/MacOS/firefox -no-remote -headless -profile /var/folders/_r/p2tt2k510nn24br_gjfh3t1h0000gn/T/playwright_firefoxdev_profile-ghvMJp -juggler-pipe -silent
<launched> pid=50128
[pid=50128][err] *** You are running in headless mode.
[pid=50128][err] Could not find profile folder.
[pid=50128] <process did exit: exitCode=1, signal=null>
[pid=50128] starting temporary directories cleanup
Call log:
  - <launching> /Users/guillaumebordes/Library/Caches/ms-playwright/firefox-1543/firefox/Nightly.app/Contents/MacOS/firefox -no-remote -headless -profile /var/folders/_r/p2tt2k510nn24br_gjfh3t1h0000gn/T/playwright_firefoxdev_profile-ghvMJp -juggler-pipe -silent
  - <launched> pid=50128
  - [pid=50128][err] *** You are running in headless mode.
  - [pid=50128][err] Could not find profile folder.
  - [pid=50128] <process did exit: exitCode=1, signal=null>
  - [pid=50128] starting temporary directories cleanup
  - [pid=50128] <gracefully close start>
  - [pid=50128] <kill>
  - [pid=50128] <skipped force kill spawnedProcess.killed=false processClosed=true>
  - [pid=50128] finished temporary directories cleanup
  - [pid=50128] <gracefully close end>

```