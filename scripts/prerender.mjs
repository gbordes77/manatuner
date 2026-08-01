/**
 * Prerender script for ManaTuner
 *
 * Generates static HTML for each route at build time using Playwright.
 * Crawlers (Google, Discord, Twitter) get full HTML with meta tags and content.
 * Users get the normal SPA experience (React hydrates on top).
 *
 * Usage: node scripts/prerender.mjs
 * Requires: vite build to have run first (dist/ must exist)
 *
 * Env:
 *   PRERENDER_CONCURRENCY — parallel pages (default 4)
 *   PRERENDER_TIMEOUT_MS  — per-route timeout (default 20000)
 *   PRERENDER_SKIP_LIBRARY — if "1", only STATIC_ROUTES (faster CI smoke)
 */

import { chromium } from 'playwright'
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

const PORT = Number(process.env.PRERENDER_PORT || 4174)
const PAGE_TIMEOUT = Number(process.env.PRERENDER_TIMEOUT_MS || 20000)
const CONCURRENCY = Math.max(1, Number(process.env.PRERENDER_CONCURRENCY || 4))
const SKIP_LIBRARY = process.env.PRERENDER_SKIP_LIBRARY === '1'

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

async function loadSeed() {
  const mod = await loadTsModule(SEED_ENTRY)
  if (!Array.isArray(mod.articlesReferenceSeed)) {
    throw new Error('Seed module did not export articlesReferenceSeed as an array')
  }
  return mod.articlesReferenceSeed
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

  if (!existsSync(DIST)) {
    console.error('Error: dist/ not found. Run "vite build" first.')
    process.exit(1)
  }

  const lib = await loadTsModule(LIB_ENTRY)
  const { STATIC_ROUTES, buildPrerenderRoutes, injectPrerenderMarker, looksPrerendered, routeToOutFile } =
    lib

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
    console.log(`Routes: ${STATIC_ROUTES.length} static only (PRERENDER_SKIP_LIBRARY=1)`)
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

  const browser = await chromium.launch({ headless: true })
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
    console.error('Critical: static route prerender failed:', staticFailed.join(', '))
    process.exit(1)
  }
  if (failed > 0) process.exit(1)
}

prerender().catch((err) => {
  console.error('Prerender failed:', err)
  process.exit(1)
})
