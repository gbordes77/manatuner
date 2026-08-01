/**
 * Boot watchdog — if React never replaces the static "Loading ManaTuner" shell,
 * offer a one-click recovery (clear SW/caches + hard reload).
 * Loaded as classic script (CSP script-src 'self', no inline).
 */
(function () {
  var DEADLINE_MS = 10000
  var started = Date.now()

  function stillOnShell() {
    var root = document.getElementById('root')
    if (!root) return false
    // React mounted (any non-loading content or MUI root)
    if (root.querySelector('[data-reactroot], .MuiBox-root, #main-content, header, nav')) {
      return false
    }
    var loading = root.querySelector('.loading')
    return !!loading
  }

  function clearClientCaches() {
    var tasks = []
    if ('serviceWorker' in navigator) {
      tasks.push(
        navigator.serviceWorker.getRegistrations().then(function (regs) {
          return Promise.all(regs.map(function (r) { return r.unregister() }))
        })
      )
    }
    if ('caches' in window) {
      tasks.push(
        caches.keys().then(function (keys) {
          return Promise.all(keys.map(function (k) { return caches.delete(k) }))
        })
      )
    }
    return Promise.all(tasks).catch(function () { /* ignore */ })
  }

  function showRecovery() {
    var root = document.getElementById('root')
    if (!root || !stillOnShell()) return

    root.innerHTML =
      '<div style="font-family:system-ui,sans-serif;max-width:28rem;margin:20vh auto;padding:1.5rem;text-align:center;color:#0d47a1">' +
      '<p style="font-size:1.15rem;font-weight:600;margin:0 0 0.75rem">ManaTuner is taking too long to load</p>' +
      '<p style="font-size:0.9rem;color:#455a64;margin:0 0 1.25rem;line-height:1.45">' +
      'Usually a stuck browser cache or old Service Worker. Click below to clear local caches and reload.' +
      '</p>' +
      '<button id="mt-boot-recover" type="button" style="' +
      'appearance:none;border:0;border-radius:8px;padding:0.7rem 1.25rem;font-size:0.95rem;font-weight:700;' +
      'background:#1976d2;color:#fff;cursor:pointer">' +
      'Clear cache &amp; reload' +
      '</button>' +
      '<p style="font-size:0.75rem;color:#78909c;margin:1rem 0 0">Or open a private window: manatuner.app</p>' +
      '</div>'

    var btn = document.getElementById('mt-boot-recover')
    if (btn) {
      btn.addEventListener('click', function () {
        btn.disabled = true
        btn.textContent = 'Clearing…'
        clearClientCaches().then(function () {
          var url = new URL(window.location.href)
          url.searchParams.set('_boot', String(Date.now()))
          window.location.replace(url.toString())
        })
      })
    }
  }

  // Only run on production-like pages (built HTML has module /assets/)
  window.addEventListener('load', function () {
    setTimeout(function () {
      if (Date.now() - started < DEADLINE_MS - 50) return
      if (stillOnShell()) showRecovery()
    }, DEADLINE_MS)
  })
})()
