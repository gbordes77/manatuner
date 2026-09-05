export function hasAnalyzerDeepLinkParams(
  search = typeof window !== 'undefined' ? window.location.search : ''
): boolean {
  const params = new URLSearchParams(search)
  return params.has('sample') || params.has('format')
}

/** Primary analyzer CTAs that should dismiss the tour without forcing Skip. */
export function isPrimaryAnalyzerCtaLabel(text: string): boolean {
  const t = text.replace(/\s+/g, ' ').trim()
  return t.includes('Try Example') || t.includes('Analyze Manabase') || t === 'Analyzing...'
}
