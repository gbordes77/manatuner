/** Inspect the actual candidate, not a manifest that could describe missing files. */
import { readFileSync, existsSync } from 'node:fs'
import { resolve, join } from 'node:path'
import { pathToFileURL } from 'node:url'
import { build } from 'esbuild'
import { JSDOM, VirtualConsole } from 'jsdom'

export async function deliveryRoutes() {
  const result = await build({
    stdin: {
      contents: `import { articlesReferenceSeed } from './src/data/articlesReferenceSeed'; import { buildPrerenderRoutes } from './src/utils/prerenderLib'; export default buildPrerenderRoutes(articlesReferenceSeed).routes;`,
      resolveDir: process.cwd(),
      loader: 'ts',
    },
    bundle: true,
    write: false,
    platform: 'node',
    format: 'esm',
  })
  return (
    await import(
      'data:text/javascript;base64,' + Buffer.from(result.outputFiles[0].text).toString('base64')
    )
  ).default
}

export async function checkHtmlContract(dist = 'dist') {
  const routes = await deliveryRoutes()
  const titles = new Set()
  const descriptions = new Set()
  for (const route of routes) {
    const file = join(dist, route, 'index.html')
    if (!existsSync(file)) throw new Error(`HTML contract: missing ${route}`)
    const html = readFileSync(file, 'utf8')
    const dom = new JSDOM(html, { virtualConsole: new VirtualConsole() })
    const doc = dom.window.document
    const fail = (message) => {
      throw new Error(`HTML contract ${route}: ${message}`)
    }
    if (
      !html.includes('<!-- prerendered -->') ||
      !doc.querySelector('#root h1')?.textContent.trim()
    )
      fail('missing rendered h1')
    for (const selector of [
      'title',
      'meta[name="description"]',
      'link[rel="canonical"]',
      'meta[property="og:title"]',
      'meta[property="og:url"]',
      'meta[property="og:description"]',
      'meta[name="twitter:title"]',
      'meta[name="twitter:description"]',
      'meta[name="twitter:url"]',
    ]) {
      if (doc.querySelectorAll(selector).length !== 1) fail(`expected exactly one ${selector}`)
    }
    const title = doc.title.trim()
    if (!title || titles.has(title)) fail('empty or duplicate route title')
    titles.add(title)
    const description = doc.querySelector('meta[name="description"]').content.trim()
    if (!description || descriptions.has(description)) fail('empty or duplicate route description')
    descriptions.add(description)
    if (
      doc.querySelector('meta[property="og:title"]').content !== title ||
      doc.querySelector('meta[name="twitter:title"]').content !== title
    )
      fail('contradictory social title')
    if (
      doc.querySelector('meta[property="og:description"]').content !== description ||
      doc.querySelector('meta[name="twitter:description"]').content !== description
    )
      fail('contradictory social description')
    if (
      doc.querySelector('link[rel="canonical"]').getAttribute('href') !==
      `https://www.manatuner.app${route}`
    )
      fail('wrong canonical')
    if (
      doc.querySelector('meta[property="og:url"]').content !== `https://www.manatuner.app${route}`
    )
      fail('wrong social URL')
    for (const asset of doc.querySelectorAll(
      'script[src],link[rel="stylesheet"][href],link[rel="modulepreload"][href]'
    )) {
      const url = asset.getAttribute('src') || asset.getAttribute('href')
      if (url.startsWith('/') && !existsSync(join(dist, url))) fail(`missing asset ${url}`)
    }
    dom.window.close()
  }
  const missing = new JSDOM(readFileSync(join(dist, '404.html'), 'utf8')).window.document
  if (
    !missing.querySelector('h1') ||
    !missing.querySelector('meta[name="robots"]')?.content.includes('noindex') ||
    missing.querySelector('link[rel="canonical"]')
  )
    throw new Error('HTML contract: 404 must have content, noindex and no homepage canonical')
  const config = JSON.parse(readFileSync('vercel.json', 'utf8'))
  if (config.rewrites?.length || config.routes?.length || config.cleanUrls !== true)
    throw new Error(
      'HTML contract: filesystem routing required; catch-all SPA rewrites are forbidden'
    )
  console.log(
    `HTML contract passed: ${routes.length} public routes, unique metadata, local assets and noindex 404. Vercel serves unmatched static paths with 404.html; local preview is not evidence of deployed routing.`
  )
  return routes
}
if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  checkHtmlContract(process.argv[2]).catch((error) => {
    console.error(error.message)
    process.exitCode = 1
  })
}
