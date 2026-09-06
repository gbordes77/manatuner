import { beforeEach, afterEach, describe, expect, it, vi } from 'vitest'
import { PrivacyStorage } from '../privacy'
const key = 'manatuner_analyses'
const record = (id = 'good', analysis: unknown = { averageCMC: 2, cards: [] }) => ({
  id,
  deckName: id,
  deckList: '24 Forest',
  timestamp: 0,
  analysis,
})
let memory: Map<string, string>
beforeEach(() => {
  memory = new Map()
  vi.stubGlobal('localStorage', {
    getItem: vi.fn((k) => memory.get(k) ?? null),
    setItem: vi.fn((k, v) => memory.set(k, v)),
    removeItem: vi.fn((k) => memory.delete(k)),
  })
})
afterEach(() => vi.unstubAllGlobals())
describe('F06 safe history boundaries', () => {
  it.each([
    { averageCMC: 'oops' },
    { cards: [null] },
    { cards: 'bad' },
    { spellAnalysis: { x: { percentage: {} } } },
  ])('rejects malformed consumed result %j without touching prior history', (analysis) => {
    const before = JSON.stringify([record()])
    memory.set(key, before)
    expect(() => PrivacyStorage.importAnalyses(JSON.stringify([record('bad', analysis)]))).toThrow()
    expect(memory.get(key)).toBe(before)
  })
  it('isolates null entries and recovers malformed old results as raw decks without modifying storage', () => {
    const before = JSON.stringify([null, record(), record('old', { averageCMC: 'oops' })])
    memory.set(key, before)
    const records = PrivacyStorage.getMyAnalyses()
    expect(records.map((r) => r.id)).toEqual(['good', 'old'])
    expect(records[1].analysis).toBeNull()
    expect(records[1].deckList).toBe('24 Forest')
    expect(memory.get(key)).toBe(before)
  })
  it('accepts legacy records without results as restorable raw decks', () => {
    const old = { id: 'old', deckName: 'Legacy', deckList: '99 Forest', timestamp: 0 }
    PrivacyStorage.importAnalyses(JSON.stringify([old]))
    expect(PrivacyStorage.getMyAnalyses()[0].deckList).toBe('99 Forest')
    expect(PrivacyStorage.getMyAnalyses()[0].analysis).toBeNull()
  })
  it('merges imports without replacing existing same-id records', () => {
    memory.set(key, JSON.stringify([record()]))
    PrivacyStorage.importAnalyses(
      JSON.stringify([record('good', { averageCMC: 9 }), record('new')])
    )
    const records = PrivacyStorage.getMyAnalyses()
    expect(records).toHaveLength(2)
    expect(records.find((r) => r.id === 'good')?.analysis.averageCMC).toBe(2)
  })
  it('does not evict any existing records to fit quota', () => {
    const before = JSON.stringify(Array.from({ length: 20 }, (_, i) => record(String(i))))
    memory.set(key, before)
    vi.mocked(localStorage.setItem).mockImplementation((k, v) => {
      if (JSON.parse(v).length > 10) throw new DOMException('full', 'QuotaExceededError')
      memory.set(k, v)
    })
    expect(() => PrivacyStorage.importAnalyses(JSON.stringify([record('new')]))).toThrow(
      /storage|quota|full/i
    )
    expect(memory.get(key)).toBe(before)
  })
  it('rejects excessive imports without changing existing records', () => {
    const before = JSON.stringify([record()])
    memory.set(key, before)
    expect(() =>
      PrivacyStorage.importAnalyses(
        JSON.stringify(Array.from({ length: 51 }, (_, i) => record(String(i))))
      )
    ).toThrow()
    expect(memory.get(key)).toBe(before)
  })
  it('reading blocked storage returns an empty safe view', () => {
    vi.mocked(localStorage.getItem).mockImplementation(() => {
      throw new DOMException('denied', 'SecurityError')
    })
    expect(() => PrivacyStorage.getMyAnalyses()).not.toThrow()
    expect(PrivacyStorage.getMyAnalyses()).toEqual([])
  })
})

describe('F06 preservation and operation diagnostics', () => {
  it.each(['{bad', 'null', '{}', '[null]'])('rejects invalid document %s byte-for-byte', (data) => {
    const before = JSON.stringify([record()])
    memory.set(key, before)
    expect(() => PrivacyStorage.importAnalyses(data)).toThrow()
    expect(memory.get(key)).toBe(before)
  })
  it('reports raw recovery and preserves raw invalid entries on save and export', () => {
    const original = [null, record('old', { averageCMC: 'oops' })]
    memory.set(key, JSON.stringify(original))
    expect(PrivacyStorage.readHistory().warnings).toHaveLength(2)
    PrivacyStorage.saveAnalysis({
      deckName: 'New',
      deckList: '1 Forest',
      analysis: { averageCMC: 0 },
    })
    expect(JSON.parse(memory.get(key)!).slice(1)).toEqual(original)
    expect(JSON.parse(PrivacyStorage.exportAnalyses()).slice(1)).toEqual(original)
  })
  it('merges legacy source without mutating on read and preserves it when quota fails', () => {
    memory.set(key, JSON.stringify([record()]))
    const legacy = JSON.stringify([record('old'), null])
    memory.set('manatuner-analyses', legacy)
    expect(PrivacyStorage.getMyAnalyses().map((r) => r.id)).toEqual(['good', 'old'])
    expect(memory.get('manatuner-analyses')).toBe(legacy)
    vi.mocked(localStorage.setItem).mockImplementation(() => {
      throw new DOMException('Full', 'QuotaExceededError')
    })
    expect(() =>
      PrivacyStorage.saveAnalysis({ deckName: 'New', deckList: '1 Forest', analysis: {} })
    ).toThrow(/No history was changed/)
    expect(memory.get('manatuner-analyses')).toBe(legacy)
  })
  it('reports merge duplicates and raw legacy results without replacement', () => {
    memory.set(key, JSON.stringify([record()]))
    const result = PrivacyStorage.importAnalyses(JSON.stringify([record(), record('old', null)]))
    expect(result).toEqual({ imported: 1, duplicates: 1, recovered: 1 })
  })
  it('refuses new saves at capacity without eviction', () => {
    const before = JSON.stringify(Array.from({ length: 50 }, (_, i) => record(String(i))))
    memory.set(key, before)
    expect(() =>
      PrivacyStorage.saveAnalysis({ deckName: 'New', deckList: '1 Forest', analysis: {} })
    ).toThrow(/50/)
    expect(memory.get(key)).toBe(before)
  })
  it('does not overwrite malformed stored JSON when saving or importing', () => {
    memory.set(key, '{broken')
    expect(() =>
      PrivacyStorage.saveAnalysis({ deckName: 'New', deckList: '1 Forest', analysis: {} })
    ).toThrow(/preserved/)
    expect(() => PrivacyStorage.importAnalyses(JSON.stringify([record()]))).toThrow(/unchanged/)
    expect(memory.get(key)).toBe('{broken')
  })
})

it('recovers an old top-level score without hiding its deck and rejects it on new import', () => {
  const old = { ...record('old'), consistency: 87 }
  const before = JSON.stringify([old])
  memory.set(key, before)
  const records = PrivacyStorage.getMyAnalyses()
  expect(records[0].deckName).toBe('old')
  expect(records[0].deckList).toBe('24 Forest')
  expect(records[0].analysis).toBeNull()
  expect(records[0].consistency).toBeUndefined()
  expect(records[0].recoveryOnly).toBe(true)
  expect(() => PrivacyStorage.importAnalyses(JSON.stringify([old]))).toThrow(/score/)
  expect(memory.get(key)).toBe(before)
})

it('labels unknown-only legacy results as raw recovery and never invents a comparable score', () => {
  memory.set(key, JSON.stringify([record('old', { foo: 'bar' })]))
  const recovered = PrivacyStorage.readHistory()
  expect(recovered.records[0].recoveryOnly).toBe(true)
  expect(recovered.records[0].consistency).toBeUndefined()
  expect(recovered.warnings.join(' ')).toMatch(/saved result unavailable/i)
  expect(
    PrivacyStorage.importAnalyses(JSON.stringify([record('another', { foo: 'bar' })])).recovered
  ).toBe(1)
})
it('identifies a DOM quota error explicitly instead of reporting general unavailability', () => {
  const before = JSON.stringify([record()])
  memory.set(key, before)
  vi.mocked(localStorage.setItem).mockImplementation(() => {
    throw new DOMException('Full', 'QuotaExceededError')
  })
  expect(() => PrivacyStorage.importAnalyses(JSON.stringify([record('new')]))).toThrow(
    /Browser storage full/
  )
  expect(memory.get(key)).toBe(before)
})

it.each([{ cards: [] }, { averageCMC: 2 }])(
  'recovers incomplete legacy result %j without a fabricated summary',
  (analysis) => {
    memory.set(key, JSON.stringify([record('partial', analysis)]))
    expect(PrivacyStorage.readHistory().records[0]).toMatchObject({
      recoveryOnly: true,
      deckList: '24 Forest',
    })
    expect(PrivacyStorage.readHistory().warnings.join(' ')).toMatch(/saved result unavailable/)
  }
)
it('keeps complete old statistics comparable without requiring current engine metadata', () => {
  memory.set(
    key,
    JSON.stringify([
      record('old', {
        totalCards: 60,
        totalLands: 24,
        averageCMC: 2,
        landRatio: 0.4,
        consistency: 0.8,
      }),
    ])
  )
  expect(PrivacyStorage.readHistory().records[0].recoveryOnly).toBe(false)
})
