import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import {
  KARSTEN_REFERENCE_TABLE,
  KARSTEN_UU_REFERENCE,
  KARSTEN_MULLIGAN_POLICY,
} from '../karstenReference'
import { articlesReferenceSeed } from '../articlesReferenceSeed'

const source = (path) => readFileSync(path, 'utf8')

describe('editorial confidence contract', () => {
  it('keeps Guide and Mathematics on the same qualified UU reference', () => {
    for (const page of ['src/pages/GuidePage.tsx', 'src/pages/MathematicsPage.tsx']) {
      expect(source(page)).toContain('KARSTEN_UU_REFERENCE')
      expect(source(page)).not.toMatch(/20 (?:blue )?sources|90% reliability/)
    }
    expect(KARSTEN_REFERENCE_TABLE[1].t2).toBe('21')
    for (const assumption of [
      '60-card',
      '25 lands',
      '91%',
      'conditional',
      'on the play',
      'London',
    ]) {
      expect(KARSTEN_UU_REFERENCE).toContain(assumption)
    }
    expect(KARSTEN_MULLIGAN_POLICY).toContain('off-color')
  })
  it('does not promise universal exactness or optimal mulligan play in initial metadata', () => {
    const html = source('index.html')
    const schemaMatch = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)
    expect(schemaMatch).not.toBeNull()
    const schema = JSON.parse(schemaMatch[1])
    expect(JSON.stringify(schema)).not.toMatch(
      /only MTG|exact spell casting probabilities|optimal keep\/mulligan/
    )
    const manifest = JSON.parse(source('public/manifest.json'))
    expect(manifest.description).toContain('supported exact calculations')
    expect(manifest.description).toContain('explicit model limits')
    expect(manifest.description).toContain('heuristic keep/mulligan')
    expect(manifest.description).not.toMatch(/only mana|Exact probabilities|Smart mulligan/i)
    expect(html).toContain('heuristic keep/mulligan')
    expect(source('src/pages/HomePage.tsx')).not.toContain('optimal keep/mull')
  })
  it('dates the Brackets introduction without changing its existing ID', () => {
    const article = articlesReferenceSeed.find((a) => a.id === 'wizards-commander-brackets-2024')
    expect(article?.year).toBe(2025)
    expect(article?.subtitle).toContain('February 11, 2025')
    expect(article?.description).not.toContain('ended a decade')
    expect(article?.primaryUrl).toContain('introducing-commander-brackets-beta')
  })
})
