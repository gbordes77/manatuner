/**
 * Prerender script for ManaTuner
 *
 * Generates static HTML for each route at build time using Playwright.
 * Crawlers get full HTML; users get the SPA (React hydrates on top).
 *
 * Usage: node scripts/prerender.mjs
 * Requires: vite build first (dist/ must exist)
 *
 * Env:
 *   PRERENDER_CONCURRENCY — parallel pages (default 4)
 *   PRERENDER_TIMEOUT_MS  — per-route timeout (default 20000)
 *   PRERENDER_SKIP_LIBRARY — if "1", only STATIC_ROUTES
 *   PRERENDER_FULL        — if "1" on Vercel, also prerender library routes
 *   PRERENDER_SOFT        — if "1", never fail the parent build (SPA still ships)
 *
 * On Vercel (VERCEL=1): soft-fail by default + install Chromium if missing +
 * skip library routes unless PRERENDER_FULL=1. Vite dist is already built;
 * a prerender miss must not block production deploys.
 */

import { execSync } from 'child_process'
import { chromium } from '@playwright/test'
import { preview } from 'vite'
import { build } from 'esbuild'
import { writeFileSync, mkdirSync, existsSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')
const DIST = join(ROOT, 'dist')
const SEED_ENTRY = join(ROOT, 'src/data/articlesReferenceSeed.ts')
const LIB_ENTRY = join(ROOT, 'src/utils/prerenderLib.ts')

const ON_VERCEL = process.env.VERCEL === '1' || process.env.VERCEL === 'true'
const SOFT_FAIL = ON_VERCEL || process.env.PRERENDER_SOFT === '1'
const PORT = Number(process.env.PRERENDER_PORT || 4174)
const PAGE_TIMEOUT = Number(process.env.PRERENDER_TIMEOUT_MS || 20000)
const CONCURRENCY = Math.max(1, Number(process.env.PRERENDER_CONCURRENCY || 4))
// Vercel: static marketing routes only (fast). Full library locally / PRERENDER_FULL=1.
const SKIP_LIBRARY =
  process.env.PRERENDER_SKIP_LIBRARY === '1' ||
  (ON_VERCEL && process.env.PRERENDER_FULL !== '1')

function softOrHardExit(code, message) {
  if (message) console[code === 0 ? 'log' : 'error'](message)
  if (code !== 0 && SOFT_FAIL) {
    console.warn(
      '\n[prerender] Soft-fail: continuing deploy with SPA-only HTML (no prerendered routes).\n' +
        'Users still get the full app via client JS. Fix browsers with: npx playwright install chromium\n'
    )
    process.exit(0)
  }
  process.exit(code)
}

async function loadTsModule(entry) {
  const result = await build({
    entryPoints: [entry],
    bundle: true,
    format: 'esm',
    platform: 'node',
    target: 'node18',
    write: false,
    logLevel: 'silent',
  })
  const js = result.outputFiles[0]?.text
  if (!js) throw new Error(`esbuild produced no output for ${entry}`)
  const dataUrl = 'data:text/javascript;base64,' + Buffer.from(js).toString('base64')
  return import(dataUrl)
}

/** Ensure Chromium is available; try install once if launch fails. */
async function launchChromium() {
  try {
    return await chromium.launch({ headless: true })
  } catch (firstErr) {
    console.warn('[prerender] Chromium missing, attempting install...', firstErr.message)
    try {
      execSync('npx playwright install chromium', {
        stdio: 'inherit',
        cwd: ROOT,
        env: process.env,
      })
      return await chromium.launch({ headless: true })
    } catch (installErr) {
      throw new Error(
        `Playwright Chromium unavailable after install attempt: ${installErr.message}`
      )
    }
  }
}

async function mapPool(items, limit, worker) {
  const results = new Array(items.length)
  let next = 0
  async function run() {
    while (next < items.length) {
      const i = next++
      results[i] = await worker(items[i], i)
    }
  }
  const runners = Array.from({ length: Math.min(limit, items.length) }, () => run())
  await Promise.all(runners)
  return results
}

async function prerender() {
  console.log('\n--- Prerendering ManaTuner ---\n')
  if (ON_VERCEL) console.log('Environment: Vercel (soft-fail + static routes by default)')
  if (SOFT_FAIL) console.log('Mode: soft-fail (deploy continues if prerender cannot run)')

  if (!existsSync(DIST)) {
    softOrHardExit(1, 'Error: dist/ not found. Run "vite build" first.')
  }

  const lib = await loadTsModule(LIB_ENTRY)
  const {
    STATIC_ROUTES,
    buildPrerenderRoutes,
    injectPrerenderMarker,
    looksPrerendered,
    routeToOutFile,
  } = lib

  let ROUTES
  let meta
  if (SKIP_LIBRARY) {
    ROUTES = [...STATIC_ROUTES]
    meta = {
      staticCount: STATIC_ROUTES.length,
      articleCount: 0,
      authorCount: 0,
      total: STATIC_ROUTES.length,
    }
    console.log(
      `Routes: ${STATIC_ROUTES.length} static only (PRERENDER_SKIP_LIBRARY / Vercel default)`
    )
  } else {
    const articles = await loadSeed()
    meta = buildPrerenderRoutes(articles)
    ROUTES = meta.routes
    console.log(
      `Routes: ${meta.staticCount} static + ${meta.articleCount} articles + ${meta.authorCount} authors = ${meta.total} total`
    )
  }
  console.log(`Concurrency: ${CONCURRENCY} · timeout: ${PAGE_TIMEOUT}ms`)

  console.log('Starting preview server...')
  const server = await preview({
    root: ROOT,
    preview: { port: PORT, host: true, strictPort: true },
  })
  const baseUrl = `http://127.0.0.1:${PORT}`
  console.log(`Preview server running at ${baseUrl}`)

  let browser
  try {
    browser = await launchChromium()
  } catch (err) {
    await new Promise((resolve) => server.httpServer.close(() => resolve()))
    softOrHardExit(1, `Prerender aborted (no browser): ${err.message}`)
    return
  }

  const context = await browser.newContext({
    userAgent: 'ManaTuner-Prerenderer/1.0',
  })

  let success = 0
  let failed = 0
  const failedRoutes = []

  await mapPool(ROUTES, CONCURRENCY, async (route) => {
    const url = `${baseUrl}${route}`
    const page = await context.newPage()
    try {
      process.stdout.write(`  Rendering ${route} ...`)

      await page.goto(url, { waitUntil: 'domcontentloaded', timeout: PAGE_TIMEOUT })
      try {
        await page.waitForSelector('h1, main, [data-testid="analysis-results"], #root h1', {
          timeout: Math.min(PAGE_TIMEOUT, 12000),
        })
      } catch {
        // Fall through — still capture HTML
      }
      await page.waitForTimeout(800)

      const html = await page.content()
      const markedHtml = injectPrerenderMarker(html)

      const outFile = routeToOutFile(route, DIST)
      if (route !== '/') {
        mkdirSync(dirname(outFile), { recursive: true })
      }
      writeFileSync(outFile, markedHtml, 'utf-8')

      const ok = looksPrerendered(markedHtml)
      if (!ok) {
        console.log(` WEAK (saved, low content signal) -> ${outFile.replace(ROOT + '/', '')}`)
      } else {
        console.log(` -> ${outFile.replace(ROOT + '/', '')}`)
      }
      success++
    } catch (err) {
      console.log(` FAILED: ${err.message}`)
      failed++
      failedRoutes.push(route)
    } finally {
      await page.close()
    }
  })

  await browser.close()
  await new Promise((resolve) => {
    server.httpServer.close(() => resolve())
  })

  console.log(`\nPrerender complete: ${success} succeeded, ${failed} failed`)
  if (failedRoutes.length) {
    console.log('Failed routes:', failedRoutes.join(', '))
  }
  console.log('---\n')

  const staticFailed = failedRoutes.filter((r) => STATIC_ROUTES.includes(r))
  if (staticFailed.length > 0) {
    softOrHardExit(1, `Critical: static route prerender failed: ${staticFailed.join(', ')}`)
  }
  if (failed > 0) {
    softOrHardExit(1, `Some routes failed: ${failedRoutes.join(', ')}`)
  }
}

async function loadSeed() {
  const mod = await loadTsModule(SEED_ENTRY)
  if (!Array.isArray(mod.articlesReferenceSeed)) {
    throw new Error('Seed module did not export articlesReferenceSeed as an array')
  }
  return mod.articlesReferenceSeed
}

prerender().catch((err) => {
  console.error('Prerender failed:', err)
  softOrHardExit(1, err?.message || String(err))
})
