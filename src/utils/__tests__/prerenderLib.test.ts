/**
 * Unit tests for prerender pure helpers (P2-7).
 */
import { describe, expect, it } from 'vitest'
import {
  STATIC_ROUTES,
  slugifyAuthor,
  buildPrerenderRoutes,
  injectPrerenderMarker,
  looksPrerendered,
  routeToOutFile,
} from '../prerenderLib'

describe('prerenderLib', () => {
  describe('slugifyAuthor', () => {
    it('normalizes accents and punctuation', () => {
      expect(slugifyAuthor('Frank Karsten')).toBe('frank-karsten')
      expect(slugifyAuthor('Paulo Vitor Damo da Rosa')).toBe('paulo-vitor-damo-da-rosa')
      expect(slugifyAuthor('Luis Scott-Vargas')).toBe('luis-scott-vargas')
    })

    it('returns empty for bad input', () => {
      expect(slugifyAuthor('')).toBe('')
      expect(slugifyAuthor(null)).toBe('')
    })
  })

  describe('buildPrerenderRoutes', () => {
    it('includes static + article + author routes', () => {
      const { routes, articleCount, authorCount, staticCount, total } = buildPrerenderRoutes([
        { id: 'karsten-manabase', author: 'Frank Karsten' },
        { id: 'saito-mindset', author: 'Kenji Egashira' },
        { id: 'other-karsten', author: 'Frank Karsten' },
      ])
      expect(staticCount).toBe(STATIC_ROUTES.length)
      expect(articleCount).toBe(3)
      expect(authorCount).toBe(2)
      expect(total).toBe(staticCount + 3 + 2)
      expect(routes).toContain('/')
      expect(routes).toContain('/library')
      expect(routes).toContain('/library/karsten-manabase')
      expect(routes).toContain('/library/author/frank-karsten')
      expect(routes).toContain('/my-analyses')
    })

    it('handles empty seed', () => {
      const { routes, articleCount } = buildPrerenderRoutes([])
      expect(articleCount).toBe(0)
      expect(routes).toEqual([...STATIC_ROUTES])
    })
  })

  describe('injectPrerenderMarker / looksPrerendered', () => {
    it('injects marker once', () => {
      const html = '<html><head><title>T</title></head><body><h1>Hi</h1></body></html>'
      const once = injectPrerenderMarker(html)
      expect(once).toContain('<!-- prerendered -->')
      const twice = injectPrerenderMarker(once)
      expect(twice.match(/<!-- prerendered -->/g)?.length).toBe(1)
    })

    it('detects contentful prerender HTML', () => {
      const weak = '<html><head></head><body></body></html>'
      expect(looksPrerendered(weak)).toBe(false)

      const good = injectPrerenderMarker(
        '<!doctype html><html><head><meta property="og:title" content="ManaTuner" /></head><body><h1>Built to Count</h1><p>x'.repeat(
          30
        ) + '</p></body></html>'
      )
      expect(looksPrerendered(good)).toBe(true)
    })
  })

  describe('routeToOutFile', () => {
    it('maps / and nested routes', () => {
      expect(routeToOutFile('/', '/app/dist')).toBe('/app/dist/index.html')
      expect(routeToOutFile('/guide', '/app/dist')).toBe('/app/dist/guide/index.html')
      expect(routeToOutFile('/library/foo', '/app/dist')).toBe('/app/dist/library/foo/index.html')
    })
  })
})
