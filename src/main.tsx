import * as Sentry from '@sentry/react'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import { PersistGate } from 'redux-persist/integration/react'
import App from './App'
import { ErrorFallback, PersistLoader } from './components/common/BootFallbacks'
import { persistor, store } from './store'
import './styles/contrast-fixes.css'
import './styles/index.css'
import './styles/ux-improvements.css'

/**
 * Sentry privacy contract (2026-04-12, reinforced 2026-08-01)
 * - @sentry/react + @sentry/vite-plugin installed
 * - Init ONLY if PROD && VITE_SENTRY_DSN (default: DSN unset → no Sentry traffic)
 * - beforeSend scrubber strips URL query (?d= decks), PII, heavy breadcrumbs
 * - No session replay (would capture deck UI text)
 * Before enabling DSN in Vercel: update PrivacySettings disclosure + GDPR opt-out.
 */
function scrubSentryEvent(event: Sentry.ErrorEvent): Sentry.ErrorEvent | null {
  // Strip share payloads (?d= legacy query and #d= hash) so decks never reach Sentry.
  if (event.request?.url) {
    try {
      const u = new URL(event.request.url)
      u.search = ''
      u.hash = ''
      event.request.url = u.toString()
    } catch {
      event.request.url = undefined
    }
  }
  if (event.request) {
    delete event.request.cookies
    delete event.request.headers
    delete event.request.data
    delete event.request.query_string
  }
  for (const ex of event.exception?.values ?? []) {
    if (ex.value && ex.value.length > 200) {
      ex.value = `${ex.value.slice(0, 200)}…[truncated]`
    }
  }
  if (event.breadcrumbs) {
    event.breadcrumbs = event.breadcrumbs.slice(-20).map((b) => ({
      ...b,
      data: undefined,
      message: b.message && b.message.length > 120 ? `${b.message.slice(0, 120)}…` : b.message,
    }))
  }
  delete event.user
  delete event.extra
  if (event.contexts) {
    delete event.contexts.state
  }
  return event
}

if (import.meta.env.PROD && import.meta.env.VITE_SENTRY_DSN) {
  Sentry.init({
    dsn: import.meta.env.VITE_SENTRY_DSN,
    environment: import.meta.env.MODE || 'production',
    release: 'manatuner@2.7.9',
    tracesSampleRate: 0.05,
    sendDefaultPii: false,
    beforeSend: scrubSentryEvent,
    integrations: (defaults) =>
      defaults.filter((i) => !/Replay|BrowserSession/i.test(i.name ?? '')),
  })
}

// PWA Cleanup: Unregister all old Service Workers and clear caches
// This fixes the issue where old cached versions persist after deployment
if ('serviceWorker' in navigator) {
  const controlled = Boolean(navigator.serviceWorker.controller)
  navigator.serviceWorker.getRegistrations().then(async (registrations) => {
    await Promise.all(registrations.map((registration) => registration.unregister()))
    if ('caches' in window) {
      const cacheNames = await caches.keys()
      await Promise.all(cacheNames.map((name) => caches.delete(name)))
    }
    // One-shot recovery: if a SW was controlling this page, reload once onto network
    try {
      if (controlled && !sessionStorage.getItem('mt-sw-cleared')) {
        sessionStorage.setItem('mt-sw-cleared', '1')
        window.location.reload()
      }
    } catch {
      /* private mode */
    }
  })
}

try {
  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <Provider store={store}>
        <PersistGate loading={<PersistLoader />} persistor={persistor}>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </PersistGate>
      </Provider>
    </React.StrictMode>
  )
} catch (error) {
  console.error('Failed to render app:', error)
  ReactDOM.createRoot(document.getElementById('root')!).render(
    <ErrorFallback error={error as Error} />
  )
}
