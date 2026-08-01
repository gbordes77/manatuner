import * as Sentry from '@sentry/react'
import { Box, CircularProgress } from '@mui/material'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import { PersistGate } from 'redux-persist/integration/react'
import App from './App'
import { persistor, store } from './store'

/**
 * Sentry privacy contract (2026-04-12, reinforced 2026-08-01)
 * - @sentry/react + @sentry/vite-plugin installed
 * - Init ONLY if PROD && VITE_SENTRY_DSN (default: DSN unset → no Sentry traffic)
 * - beforeSend scrubber strips URL query (?d= decks), PII, heavy breadcrumbs
 * - No session replay (would capture deck UI text)
 * Before enabling DSN in Vercel: update PrivacySettings disclosure + GDPR opt-out.
 */
function scrubSentryEvent(event: Sentry.ErrorEvent): Sentry.ErrorEvent | null {
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
    release: 'manatuner@2.7.7',
    tracesSampleRate: 0.05,
    sendDefaultPii: false,
    beforeSend: scrubSentryEvent,
    integrations: (defaults) =>
      defaults.filter((i) => !/Replay|BrowserSession/i.test(i.name ?? '')),
  })
}
import './styles/contrast-fixes.css'
import './styles/index.css'
import './styles/ux-improvements.css'

// PWA Cleanup: Unregister all old Service Workers and clear caches
// This fixes the issue where old cached versions persist after deployment
if ('serviceWorker' in navigator) {
  // Unregister all Service Workers
  navigator.serviceWorker.getRegistrations().then((registrations) => {
    registrations.forEach((registration) => {
      registration.unregister()
    })
  })

  // Clear all caches
  if ('caches' in window) {
    caches.keys().then((cacheNames) => {
      cacheNames.forEach((cacheName) => {
        caches.delete(cacheName)
      })
    })
  }
}

// Configure React Query client with performance optimizations
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Scryfall API cache for 10 minutes (réduit de 30 min)
      staleTime: 10 * 60 * 1000,
      // Keep in cache for 15 minutes (réduit de 30 min)
      gcTime: 15 * 60 * 1000,
      // Retry failed requests
      retry: 1, // Réduit de 2 à 1
      // Refetch on window focus for fresh data
      refetchOnWindowFocus: false,
      // Background refetch
      refetchOnMount: false,
      // Réduire les refetch automatiques
      refetchOnReconnect: false,
    },
    mutations: {
      // Retry mutations once
      retry: 0, // Réduit de 1 à 0
    },
  },
})

// Loading component for PersistGate
const PersistLoader = () => (
  <Box
    sx={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    }}
  >
    <CircularProgress size={48} sx={{ color: 'white' }} />
  </Box>
)

// Error boundary for production
const ErrorFallback = ({ error: _error }: { error: Error }) => (
  <div
    style={{
      padding: '20px',
      textAlign: 'center',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
    }}
  >
    <h1>🎯 ManaTuner</h1>
    <p>Something went wrong loading the application.</p>
    <button
      onClick={() => window.location.reload()}
      style={{
        padding: '10px 20px',
        background: 'white',
        color: '#667eea',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        marginTop: '10px',
      }}
    >
      Reload Page
    </button>
  </div>
)

const isDevelopment = import.meta.env.DEV

try {
  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <Provider store={store}>
          <PersistGate loading={<PersistLoader />} persistor={persistor}>
            <BrowserRouter>
              <App />
              {/* React Query DevTools - only in development */}
              {isDevelopment && <ReactQueryDevtools initialIsOpen={false} />}
            </BrowserRouter>
          </PersistGate>
        </Provider>
      </QueryClientProvider>
    </React.StrictMode>
  )
} catch (error) {
  console.error('Failed to render app:', error)
  ReactDOM.createRoot(document.getElementById('root')!).render(
    <ErrorFallback error={error as Error} />
  )
}
