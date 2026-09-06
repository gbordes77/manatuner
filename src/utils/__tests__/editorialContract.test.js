import { describe, expect, it } from 'vitest'
import { readFileSync } from 'node:fs'
import { healthScoreBand } from '../healthScore'
import { ANALYZER_TABS } from '../../data/analyzerTabs'
import { articlesReferenceSeed } from '../../data/articlesReferenceSeed'
const source = (file) => readFileSync(`src/${file}`, 'utf8')

describe('F10 editorial contracts', () => {
  it.each([[54, 'Needs work'], [55, 'Average'], [69, 'Average'], [70, 'Good'], [84, 'Good'], [85, 'Excellent'], [100, 'Excellent']])('labels the shared boundary %s consistently', (score, label) => {
    expect(healthScoreBand(Number(score)).label).toBe(label)
  })
  it('keeps public AI references aligned with model and privacy contracts', () => {
    for (const file of ['public/llms.txt', 'public/llms-full.txt']) {
      const copy = readFileSync(file, 'utf8')
      expect(copy).not.toMatch(/100% local|No data is ever sent|no data sent to servers|54 curated|Library of 54|Exact per-spell cast probability|means your mana base is tournament-ready/)
      expect(copy).toContain('default is an estimate')
      expect(copy).toContain('Exact modes enumerate only their stated supported')
      expect(copy).toMatch(/scryfall/i)
      expect(copy).toContain('Sentry initializes only in a production build with a configured DSN')
      expect(copy).toContain('best effort')
      expect(copy).toContain('Commander identification requires an explicit marker')
      expect(copy).toContain('55–69 Average')
    }
  })
  it('uses one score definition for verdict, history and export', () => {
    for (const file of ['components/analyzer/QuickVerdict.tsx', 'pages/MyAnalysesPage.tsx', 'components/export/ManaBlueprint.tsx']) expect(source(file)).toContain('healthScoreBand(')
    expect(source('pages/GuidePage.tsx')).toContain('details: HEALTH_SCORE_BANDS')
  })
  it('does not teach the audited false on-curve, exact-ramp or commander promises', () => {
    const publicCopy = ['pages/HomePage.tsx', 'pages/AnalyzerPage.tsx', 'pages/GuidePage.tsx'].map(source).join('\n')
    expect(publicCopy).not.toMatch(/casts 87% of spells|first non-land|exact hypergeometric castability|Exact results, not approximations/)
    expect(publicCopy).toContain('default is an estimate')
    expect(publicCopy).toContain('only when explicitly marked')
    expect(publicCopy).toContain('not the percentage of spells cast on curve')
  })
  it('explains seven-card redraw and bottoming, separately from deck Health Score', () => {
    const help = source('components/analyzer/MulliganTab.tsx')
    expect(help).toContain('draw seven again')
    expect(help).toContain('put one card on the bottom')
    expect(help).not.toContain('draw a new hand with 1 fewer card')
    expect(help).toContain('differ from the deck-level Health Score')
  })
  it('derives reference counts and keeps the advertised tab count equal to accessible tabs', () => {
    const home = source('pages/HomePage.tsx')
    expect(articlesReferenceSeed.length).toBeGreaterThan(54)
    expect(home.match(/articlesReferenceSeed.length/g)).toHaveLength(2)
    const tabs = source('pages/AnalyzerPage.tsx').match(/id="analyzer-tab-\d+"/g) ?? []
    expect(ANALYZER_TABS).toHaveLength(tabs.length)
    expect(home).toContain('String(ANALYZER_TABS.length)')
  })
})
