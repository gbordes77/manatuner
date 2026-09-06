import analyzerReducer, { setDeckList, setAnalysisResult } from '../slices/analyzerSlice'
/**
 * T01 — redux-persist transform + migration v2 non-regression tests.
 * analysisResult must never land in the serialized blob; rehydrate forces null.
 */
import { describe, expect, it } from 'vitest'
import { analyzerPersistTransform, migrations, persistConfig } from '../index'

describe('T01 analyzerPersistTransform', () => {
  const sampleAnalysis = {
    totalCards: 60,
    totalLands: 24,
    cards: [{ name: 'Lightning Bolt', quantity: 4 }],
  }

  const fullState = {
    deckList: '4 Lightning Bolt\n20 Mountain',
    deckName: 'Burn',
    analysisResult: sampleAnalysis,
    isAnalyzing: true,
    isDeckMinimized: true,
    activeTab: 2,
    snackbar: { open: true, message: 'done', severity: 'success' as const },
  }

  it('outbound (serialize) strips analysisResult, isAnalyzing, snackbar open', () => {
    // createTransform exposes in/out via .in / .out on the transform object
    const out = analyzerPersistTransform.in(fullState as any, 'analyzer', fullState as any)
    expect(out.analysisResult).toBeNull()
    expect(out.isAnalyzing).toBe(false)
    expect(out.snackbar.open).toBe(false)
    // Surviving fields
    expect(out.deckList).toBe(fullState.deckList)
    expect(out.deckName).toBe('Burn')
    expect(out.activeTab).toBe(2)
    // No saved result exists to accompany a collapsed editor after reload.
    expect(out.isDeckMinimized).toBe(false)
  })

  it('inbound (rehydrate) forces analysisResult null even if blob has one', () => {
    const dirtyBlob = {
      deckList: '4 Bolt',
      deckName: 'x',
      analysisResult: sampleAnalysis,
      isAnalyzing: true,
      isDeckMinimized: false,
      activeTab: 0,
      snackbar: { open: true, message: 'stale', severity: 'error' as const },
    }
    const rehydrated = analyzerPersistTransform.out(dirtyBlob as any, 'analyzer', dirtyBlob as any)
    expect(rehydrated.analysisResult).toBeNull()
    expect(rehydrated.isAnalyzing).toBe(false)
    expect(rehydrated.snackbar.open).toBe(false)
    expect(rehydrated.deckList).toBe('4 Bolt')
  })

  it('persist version is 2', () => {
    expect(persistConfig.version).toBe(2)
  })

  it('migration 2 purges analysisResult from pre-v2 blobs', () => {
    const v1State = {
      analyzer: {
        deckList: '4 Bolt',
        deckName: 'old',
        analysisResult: sampleAnalysis,
        isAnalyzing: true,
        isDeckMinimized: true,
        activeTab: 1,
        snackbar: { open: true, message: 'x', severity: 'info' as const },
      },
    }
    const migrated = migrations[2]!(v1State as any) as any
    expect(migrated?.analyzer?.analysisResult).toBeNull()
    expect(migrated?.analyzer?.isAnalyzing).toBe(false)
    expect(migrated?.analyzer?.snackbar?.open).toBe(false)
    expect(migrated?.analyzer?.deckList).toBe('4 Bolt')
    expect(migrated?.analyzer?.deckName).toBe('old')
    expect(migrated?.analyzer?.activeTab).toBe(1)
  })

  it('migration 2 is a no-op-safe on null/undefined state', () => {
    expect(migrations[2]!(undefined as any)).toBeUndefined()
    expect(migrations[2]!(null as any)).toBeNull()
  })
})

it.each(['24 Forest', ''])(
  'rehydrates legacy minimized state into an editable deck (%s)',
  (deckList) => {
    const saved = { deckList, deckName: 'My saved deck', activeTab: 0, isDeckMinimized: true }
    const restored = analyzerPersistTransform.out(saved as any, 'analyzer', saved as any)
    expect(restored.analysisResult).toBeNull()
    expect(restored.isDeckMinimized).toBe(false)
    expect(restored.deckList).toBe(deckList)
    expect(restored.deckName).toBe('My saved deck')
  }
)

it('clearing an analysis reopens its editor without deleting the deck', () => {
  const ready = analyzerReducer(undefined, setDeckList('60 Forest'))
  const collapsed = { ...ready, isDeckMinimized: true }
  const recovered = analyzerReducer(collapsed, setAnalysisResult(null))
  expect(recovered.isDeckMinimized).toBe(false)
  expect(recovered.deckList).toBe('60 Forest')
})
