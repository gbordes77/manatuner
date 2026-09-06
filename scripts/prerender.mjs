/** Build every public route from the app; fail on missing content or metadata.
 * PRERENDER_DIST, PORT, TIMEOUT_MS and CONCURRENCY support isolated local validation.
 * Library skipping and soft failures are deliberately unsupported.
 */

import { execSync } from 'child_process'
import { chromium } from '@playwright/test'
import { preview } from 'vite'
import { build } from 'esbuild'
import { writeFileSync, mkdirSync, existsSync } from 'fs'
import { checkHtmlContract } from './check-html-contract.mjs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')
const DIST = process.env.PRERENDER_DIST || join(ROOT, 'dist')
const SEED_ENTRY = join(ROOT, 'src/data/articlesReferenceSeed.ts')
const LIB_ENTRY = join(ROOT, 'src/utils/prerenderLib.ts')

const ON_VERCEL = process.env.VERCEL === '1' || process.env.VERCEL === 'true'
const PORT = Number(process.env.PRERENDER_PORT || 4174)
const PAGE_TIMEOUT = Number(process.env.PRERENDER_TIMEOUT_MS || 20000)
const CONCURRENCY = Math.max(1, Number(process.env.PRERENDER_CONCURRENCY || 4))
function failBuild(code, message) {
  if (message) console.error(message)
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
  if (ON_VERCEL) console.log('Environment: Vercel (full, mandatory prerender)')

  if (!existsSync(DIST)) {
    failBuild(1, 'Error: dist/ not found. Run "vite build" first.')
  }

  const lib = await loadTsModule(LIB_ENTRY)
  const {
    STATIC_ROUTES,
    buildPrerenderRoutes,
    injectPrerenderMarker,
    looksPrerendered,
    routeToOutFile,
  } = lib

  const articles = await loadSeed()
  const meta = buildPrerenderRoutes(articles)
  const ROUTES = meta.routes
  console.log(
    `Routes: ${meta.staticCount} static + ${meta.articleCount} articles + ${meta.authorCount} authors = ${meta.total} total`
  )
  console.log(`Concurrency: ${CONCURRENCY} · timeout: ${PAGE_TIMEOUT}ms`)

  console.log('Starting preview server...')
  const server = await preview({
    root: ROOT,
    build: { outDir: DIST },
    preview: { port: PORT, host: '127.0.0.1', strictPort: true },
  })
  const baseUrl = `http://127.0.0.1:${PORT}`
  console.log(`Preview server running at ${baseUrl}`)

  let browser
  try {
    browser = await launchChromium()
  } catch (err) {
    await new Promise((resolve) => server.httpServer.close(() => resolve()))
    failBuild(1, `Prerender aborted (no browser): ${err.message}`)
    return
  }

  const context = await browser.newContext({
    userAgent: 'ManaTuner-Prerenderer/1.0',
    serviceWorkers: 'block',
  })

  // Prerender is deterministic and sends no requests to external services.
  await context.route('**/*', (route) =>
    new URL(route.request().url()).origin === baseUrl ? route.continue() : route.abort()
  )
  await context.addInitScript(() => localStorage.setItem('manatuner-onboarding-completed', 'true'))

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
        await page.waitForSelector('#root h1', {
          timeout: Math.min(PAGE_TIMEOUT, 12000),
        })
      } catch {
        throw new Error('Required route has no rendered h1')
      }
      await page.waitForFunction(
        (expected) =>
          document.querySelector('link[rel="canonical"]')?.getAttribute('href') === expected,
        `https://www.manatuner.app${route}`,
        { timeout: PAGE_TIMEOUT }
      )
      // Snapshots must not accept edits/clicks that would be discarded on React mount.
      // Native controls become enabled when React replaces the snapshot with the live app.
      await page
        .locator('button,input,textarea,select')
        .evaluateAll((elements) => elements.forEach((el) => el.setAttribute('disabled', '')))

      const html = await page.content()
      const markedHtml = injectPrerenderMarker(html)

      const outFile = routeToOutFile(route, DIST)
      if (route !== '/') {
        mkdirSync(dirname(outFile), { recursive: true })
      }
      writeFileSync(outFile, markedHtml, 'utf-8')

      const ok = looksPrerendered(markedHtml)
      if (!ok) {
        throw new Error('Rendered HTML violates content contract')
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

  writeFileSync(
    join(DIST, '404.html'),
    '<!doctype html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Page not found — ManaTuner</title><meta name="description" content="This ManaTuner page does not exist."><meta name="robots" content="noindex,follow"></head><body><main><h1>Page not found</h1><p>This page does not exist.</p><a href="/">Back to Home</a><a href="/analyzer">Open Analyzer</a></main></body></html>'
  )

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
    failBuild(1, `Critical: static route prerender failed: ${staticFailed.join(', ')}`)
  }
  if (failed > 0) {
    failBuild(1, `Some routes failed: ${failedRoutes.join(', ')}`)
  }
  await checkHtmlContract(DIST)
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
  failBuild(1, err?.message || String(err))
})
