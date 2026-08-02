import { sentryVitePlugin } from '@sentry/vite-plugin'
import react from '@vitejs/plugin-react'
import { defineConfig, type PluginOption } from 'vite'

/**
 * Sentry Vite plugin uploads source maps only when credentials are present.
 * Default local/Vercel builds: plugin omitted → no Sentry network, no map upload.
 * Enable with: SENTRY_AUTH_TOKEN + SENTRY_ORG + SENTRY_PROJECT (+ VITE_SENTRY_DSN for runtime).
 */
function maybeSentryPlugin(): PluginOption[] {
  const token = process.env.SENTRY_AUTH_TOKEN
  const org = process.env.SENTRY_ORG
  const project = process.env.SENTRY_PROJECT
  if (!token || !org || !project) {
    return []
  }
  return [
    sentryVitePlugin({
      org,
      project,
      authToken: token,
      sourcemaps: {
        filesToDeleteAfterUpload: ['./dist/**/*.map'],
      },
      telemetry: false,
    }),
  ]
}

export default defineConfig(({ mode }) => ({
  plugins: [react(), ...maybeSentryPlugin()],
  resolve: {
    alias: {
      '@': '/src',
    },
  },
  build: {
    // 2026-04-17: bumped from 'es2015' to Vite 7's modern default.
    // Targets Baseline Widely Available (chrome107/edge107/firefox104/safari16)
    // — covers the browser footprint of MTG Arena/MTGO players. Smaller
    // bundles + native features instead of polyfills.
    target: 'baseline-widely-available',
    minify: 'esbuild',
    // CSS minified with lightningcss — more aggressive shorthand collapsing
    // and vendor-prefix stripping than esbuild's CSS minifier.
    cssMinify: 'lightningcss',
    // Source maps only when Sentry upload is configured (keeps public dist lean)
    sourcemap: Boolean(process.env.SENTRY_AUTH_TOKEN),
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            // T12: keep icons out of the eager MUI material chunk
            if (id.includes('@mui/icons-material')) {
              return 'vendor-mui-icons'
            }
            if (
              id.includes('@mui/material') ||
              id.includes('@emotion/react') ||
              id.includes('@emotion/styled')
            ) {
              return 'vendor-mui'
            }
            if (id.includes('react-dom') || id.includes('react-router') || id.includes('/react/')) {
              return 'vendor-react'
            }
            if (id.includes('recharts')) {
              return 'vendor-charts'
            }
            if (
              id.includes('@reduxjs/toolkit') ||
              id.includes('react-redux') ||
              id.includes('redux')
            ) {
              return 'vendor-redux'
            }
          }
        },
      },
    },
    chunkSizeWarningLimit: 1000,
  },
  server: {
    port: 3000,
    host: true,
    https: false,
  },
  preview: {
    port: 4173,
    host: true,
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom', '@mui/material', 'recharts'],
  },
  // T14: drop console/debugger only in production builds (keep logs in dev)
  esbuild: {
    drop: mode === 'production' ? (['console', 'debugger'] as ('console' | 'debugger')[]) : [],
  },
  worker: {
    format: 'es',
  },
}))
