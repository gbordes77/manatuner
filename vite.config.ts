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

export default defineConfig({
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
        manualChunks: {
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-mui': [
            '@mui/material',
            '@mui/icons-material',
            '@emotion/react',
            '@emotion/styled',
          ],
          'vendor-charts': ['recharts'],
          'vendor-redux': ['@reduxjs/toolkit', 'react-redux'],
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
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      '@mui/material',
      '@mui/icons-material',
      'recharts',
    ],
  },
  esbuild: {
    drop: ['console', 'debugger'],
  },
  worker: {
    format: 'es',
  },
})
