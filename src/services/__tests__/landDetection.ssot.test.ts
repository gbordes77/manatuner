import { describe, expect, it } from 'vitest'
import legacyLandNames from './fixtures/legacyLandNames.json'
import { isLandCardComplete, categorizeLandComplete } from '../../components/analyzer/landUtils'
import { landService } from '../landService'
import { LAND_SEED } from '../../data/landSeed'

/**
 * T03 non-regression: every name from the old hardcoded land lists
 * (landDetection.ts, landUtils knownLands, deckAnalyzer shock/fast arrays)
 * must resolve via landService seed/cache — the single source of truth.
 */
describe('T03 land detection SSOT non-regression', () => {
  it('recognizes every legacy hardcoded land name via landService', () => {
    const failures: string[] = []
    for (const name of legacyLandNames as string[]) {
      if (!landService.isLandSync(name)) {
        failures.push(name)
      }
    }
    expect(failures).toEqual([])
  })

  it('isLandCardComplete mirrors landService.isLandSync', () => {
    for (const name of ['Plains', 'Scalding Tarn', 'Lightning Bolt', 'sacred foundry']) {
      expect(isLandCardComplete(name)).toBe(landService.isLandSync(name))
    }
  })

  it('categorizeLandComplete uses seed categories for known lands', () => {
    expect(categorizeLandComplete('Hallowed Fountain')).toBe('Shockland')
    expect(categorizeLandComplete('Scalding Tarn')).toBe('Fetchland')
    expect(categorizeLandComplete('Inspiring Vantage')).toBe('Fastland')
    expect(categorizeLandComplete('Plains')).toBe('Basic Land')
  })

  it('unknown names do not throw and fall back safely', () => {
    expect(landService.getLandSync('Definitely Not A Real Card XYZ')).toBeNull()
    expect(isLandCardComplete('Definitely Not A Real Card XYZ')).toBe(false)
    expect(categorizeLandComplete('Definitely Not A Real Card XYZ')).toBe('Other Land')
  })

  it('seed covers at least the pre-T03 seed size plus non-regression adds', () => {
    // Original seed was 210; T03 added missing legacy lands
    expect(Object.keys(LAND_SEED).length).toBeGreaterThanOrEqual(210)
  })
})
