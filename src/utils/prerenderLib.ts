/**
 * Pure helpers for ManaTuner prerender (shared by scripts/prerender.mjs + unit tests).
 * Keep this file dependency-free so Node can load it via esbuild at build time.
 */

/** Static marketing / shell routes always prerendered. */
export const STATIC_ROUTES = [
  '/',
  '/analyzer',
  '/guide',
  '/mathematics',
  '/land-glossary',
  '/about',
  '/privacy',
  '/library',
  '/my-analyses',
] as const

/**
 * Deterministic, URL-safe author slug. Kept in sync with
 * libraryHelpers.slugifyAuthor.
 */
export function slugifyAuthor(author: string | null | undefined): string {
  if (!author || typeof author !== 'string') return ''
  return author
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/&/g, ' ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-+|-+$)/g, '')
}

export interface PrerenderArticleSeed {
  id: string
  author?: string
}

/**
 * Build full prerender route list from article seed shape.
 */
export function buildPrerenderRoutes(articles: PrerenderArticleSeed[]) {
  const list = Array.isArray(articles) ? articles : []
  const articleRoutes = list
    .map((a) => a?.id)
    .filter((id): id is string => typeof id === 'string' && id.length > 0)
    .map((id) => `/library/${id}`)

  const authorSlugs = Array.from(
    new Set(list.map((a) => slugifyAuthor(a?.author || '')).filter(Boolean))
  )
  const authorRoutes = authorSlugs.map((slug) => `/library/author/${slug}`)

  const routes = [...STATIC_ROUTES, ...articleRoutes, ...authorRoutes]
  return {
    routes,
    staticCount: STATIC_ROUTES.length,
    articleCount: articleRoutes.length,
    authorCount: authorRoutes.length,
    total: routes.length,
  }
}

/** Dist output path for a route under dist/. */
export function routeToOutFile(route: string, distRoot: string): string {
  const root = distRoot.replace(/\/$/, '')
  if (route === '/') return `${root}/index.html`
  const clean = route.replace(/^\//, '').replace(/\/$/, '')
  return `${root}/${clean}/index.html`
}

/** Inject prerender marker after opening <head>. */
export function injectPrerenderMarker(html: string): string {
  if (typeof html !== 'string') return html
  if (html.includes('<!-- prerendered -->')) return html
  return html.replace(/<head(\s[^>]*)?>/i, (m) => `${m}\n<!-- prerendered -->`)
}

/**
 * True if HTML looks contentful for crawlers (not only the SPA shell).
 */
export function looksPrerendered(html: string): boolean {
  if (typeof html !== 'string' || html.length < 200) return false
  const hasMarker = html.includes('<!-- prerendered -->')
  const hasH1 = /<h1[\s>]/i.test(html)
  return hasMarker && hasH1
}
