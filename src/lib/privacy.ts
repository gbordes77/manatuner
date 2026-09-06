/**
 * Simple Storage for ManatunerPro
 *
 * Lightweight local storage - simple and efficient.
 */

import { nanoid } from 'nanoid'
import { z } from 'zod'

/**
 * Analysis record interface
 */
export interface AnalysisRecord {
  id: string
  deckName: string
  deckList: string
  analysis: any
  timestamp: number
  shareId?: string
  date?: string
  consistency?: number
  schemaVersion?: 1
  recoveryOnly?: boolean
}

const finite = z.number().finite()
// Validate the fields consumed by history cards and comparison. Preserve other
// result fields for backups; restoring always re-analyzes the original deck text.
const savedResultSchema = z
  .object({
    consistencyUnavailable: z.boolean().optional(),
    colorAccessNotes: z.array(z.string()).optional(),
    colorAccessByTurn: z
      .object({ turn2: finite.min(0).max(1), turn4: finite.min(0).max(1) })
      .optional(),
    averageCMC: finite.nonnegative().optional(),
    totalCards: finite.nonnegative().optional(),
    totalLands: finite.nonnegative().optional(),
    consistency: finite.min(0).max(1).optional(),
    landRatio: finite.min(0).max(1).optional(),
    colorDistribution: z.record(finite.nonnegative()).optional(),
    cards: z
      .array(
        z
          .object({
            name: z.string(),
            cmc: finite.optional(),
            manaCost: z.string().optional(),
            isLand: z.boolean().optional(),
          })
          .passthrough()
      )
      .max(250)
      .optional(),
    probabilities: z.record(z.object({ anyColor: finite.optional() }).passthrough()).optional(),
    spellAnalysisModel: z.string().optional(),
    spellAnalysis: z
      .record(
        z
          .object({
            castable: finite.optional(),
            total: finite.optional(),
            percentage: finite.optional(),
          })
          .passthrough()
      )
      .optional(),
  })
  .passthrough()
// These summary fields are the minimum needed to compare without fabricating
// missing values. Other legacy metadata is preserved, but requests re-analysis.
const hasRecognizedResult = (value: object): boolean =>
  ['averageCMC', 'totalCards', 'totalLands', 'consistency', 'landRatio'].every((key) =>
    Object.prototype.hasOwnProperty.call(value, key)
  )

const analysisRecordSchema = z
  .object({
    id: z.string().min(1).max(200),
    deckName: z.string().max(1000),
    // Historic drafts may exceed today's analyzer limit; keep them recoverable.
    deckList: z.string().max(1_000_000),
    analysis: z.unknown().optional(),
    timestamp: finite,
    shareId: z.string().optional(),
    date: z.string().optional(),
    consistency: z.unknown().optional(),
    schemaVersion: z.literal(1).optional(),
  })
  .passthrough()

export interface HistoryReadResult {
  records: AnalysisRecord[]
  warnings: string[]
}
export interface HistoryImportResult {
  imported: number
  duplicates: number
  recovered: number
}

/**
 * Simple Storage Management
 *
 * Stores analyses directly in localStorage.
 *
 * NOTE (2026-04-12): the legacy hyphen-separated key `manatuner-analyses`
 * (used by an old hook) is merged in the read view without rewriting sources.
 * An explicit successful write preserves the merged data in the canonical key.
 */
export class PrivacyStorage {
  private static readonly ANALYSES_KEY = 'manatuner_analyses'
  private static readonly LEGACY_KEY = 'manatuner-analyses'
  private static readonly MAX_RECORDS = 50

  /** Atomic storage write: quota never causes silent history eviction. */
  private static persist(records: unknown[]): void {
    try {
      localStorage.setItem(this.ANALYSES_KEY, JSON.stringify(records))
    } catch (error) {
      if (
        (error instanceof Error || error instanceof DOMException) &&
        error.name === 'QuotaExceededError'
      ) {
        throw new Error(
          'Browser storage full. No history was changed. Export a backup and delete selected analyses before retrying.'
        )
      }
      throw new Error('Browser storage unavailable. No history was changed.')
    }
  }

  private static readSources(): { raw: unknown[]; warnings: string[]; blocked: boolean } {
    const warnings: string[] = []
    let blocked = false
    const read = (key: string): unknown[] => {
      try {
        const text = localStorage.getItem(key)
        if (!text) return []
        const value: unknown = JSON.parse(text)
        if (!Array.isArray(value)) throw new Error('Expected array')
        return value
      } catch {
        blocked = true
        warnings.push(
          `History source ${key} could not be read. Its original data has not been changed.`
        )
        return []
      }
    }
    const current = read(this.ANALYSES_KEY)
    const legacy = read(this.LEGACY_KEY)
    const ids = new Set(
      current
        .map((value) => analysisRecordSchema.safeParse(value))
        .filter((result) => result.success)
        .map((result) => (result.success ? result.data.id : ''))
    )
    const raw = [...current]
    for (const value of legacy) {
      const parsed = analysisRecordSchema.safeParse(value)
      if (!parsed.success || !ids.has(parsed.data.id)) {
        raw.push(value)
        if (parsed.success) ids.add(parsed.data.id)
      }
    }
    return { raw, warnings, blocked }
  }

  static readHistory(): HistoryReadResult {
    if (typeof window === 'undefined') return { records: [], warnings: [] }
    const { raw, warnings } = this.readSources()
    const records: AnalysisRecord[] = []
    for (const [index, value] of raw.entries()) {
      const envelope = analysisRecordSchema.safeParse(value)
      if (!envelope.success) {
        warnings.push(
          `History entry ${index + 1} is invalid and hidden. Its original data is retained in storage and JSON export.`
        )
        continue
      }
      const result = savedResultSchema.safeParse(envelope.data.analysis)
      const summaryValid =
        envelope.data.consistency === undefined ||
        finite.min(0).max(1).safeParse(envelope.data.consistency).success
      const knownResult = result.success && hasRecognizedResult(result.data)
      const recoveryOnly = !summaryValid || !knownResult
      if (recoveryOnly)
        warnings.push(
          `“${envelope.data.deckName || 'Unnamed Deck'}”: saved result unavailable. The original deck can be loaded and analyzed again.`
        )
      records.push({
        ...envelope.data,
        // Preserve unknown historic metadata for compatibility, while recoveryOnly
        // prevents comparison and display of invented numeric defaults.
        analysis:
          summaryValid && result.success && Object.keys(result.data).length > 0
            ? result.data
            : null,
        recoveryOnly,
        ...(recoveryOnly ? { consistency: undefined } : {}),
      } as AnalysisRecord)
    }
    return { records, warnings }
  }

  static saveAnalysis(analysis: Omit<AnalysisRecord, 'id' | 'timestamp'>): string {
    const { raw, blocked } = this.readSources()
    if (blocked)
      throw new Error(
        'History could not be read. Existing data was preserved; the new analysis was not saved.'
      )
    if (raw.length >= this.MAX_RECORDS)
      throw new Error(
        'History limit of 50 reached. Export a backup and delete selected analyses before saving another.'
      )
    const record: AnalysisRecord = {
      ...analysis,
      schemaVersion: 1,
      id: nanoid(),
      timestamp: Date.now(),
      date: new Date().toISOString(),
    }
    this.persist([record, ...raw])
    try {
      localStorage.removeItem(this.LEGACY_KEY)
    } catch {
      /* Canonical data is already durable. */
    }
    return record.id
  }

  /** Reads are non-destructive, including legacy sources and damaged entries. */
  static getMyAnalyses(): AnalysisRecord[] {
    return this.readHistory().records
  }

  /**
   * Async version for compatibility
   */
  static async getMyAnalysesAsync(): Promise<AnalysisRecord[]> {
    return this.getMyAnalyses()
  }

  /**
   * Async save for compatibility
   */
  static async saveAnalysisAsync(
    analysis: Omit<AnalysisRecord, 'id' | 'timestamp'>
  ): Promise<string> {
    return this.saveAnalysis(analysis)
  }

  /**
   * Deletes an analysis.
   * Audit fix M2 (2026-04-13): use `persist()` instead of raw `setItem` so the
   * QuotaExceededError fallback is honored even on iOS Safari private mode
   * where the quota can be revoked between tabs.
   */
  static deleteAnalysis(id: string): void {
    if (typeof window === 'undefined') return

    const { raw, blocked } = this.readSources()
    if (blocked) throw new Error('History could not be read. No analyses were deleted.')
    const filtered = raw.filter((value) => {
      const parsed = analysisRecordSchema.safeParse(value)
      return !parsed.success || parsed.data.id !== id
    })
    this.persist(filtered)
    // Canonical now contains the full preserved source view minus this selected id.
    // Removing legacy only after successful persistence prevents resurrection.
    try {
      localStorage.removeItem(this.LEGACY_KEY)
    } catch {
      throw new Error(
        'The canonical history was updated, but the legacy source could not be removed. A legacy copy may still appear; its data is preserved.'
      )
    }
  }

  /**
   * Async delete for compatibility
   */
  static async deleteAnalysisAsync(id: string): Promise<void> {
    this.deleteAnalysis(id)
  }

  /**
   * Known localStorage keys written by ManaTuner (analyses, caches, prefs).
   * Keep in sync when adding a new key — wipe must be complete (SEC-2026-08-02).
   */
  private static readonly APP_LOCAL_KEYS = [
    'manatuner_analyses',
    'manatuner-analyses',
    'manatuner_user_code',
    'manatuner_privacy_mode',
    'userCode',
    'persist:root', // redux-persist (includes deckList + analysisResult)
    'manatuner_lands_cache',
    'manatuner_producer_cache',
    'manatuner_acceleration_settings',
    'manatuner-library-progress-v1',
    'manatuner-theme',
    'manatuner-onboarding-completed',
    'manatuner-feedback-banner-dismissed-v1',
  ] as const

  private static readonly APP_SESSION_KEYS = [
    'manatuner-commander-preset',
    'mt-sw-cleared',
  ] as const

  /**
   * Clears all ManaTuner local data (analyses, Redux persist, caches, prefs).
   * Callers that own React state should also dispatch `clearAnalyzer` / purge
   * the persistor so in-memory UI matches storage.
   */
  /**
   * Clears localStorage/sessionStorage keys. Also kicks off an async IDB wipe
   * for the Scryfall persistent cache (T11) — local wipe never waits on IDB.
   */
  static clearAllLocalData(): void {
    if (typeof window === 'undefined') return

    for (const key of this.APP_LOCAL_KEYS) {
      try {
        localStorage.removeItem(key)
      } catch {
        // private mode / quota — keep going
      }
    }

    // Belt-and-suspenders: any leftover manatuner* keys
    try {
      const toRemove: string[] = []
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i)
        if (key && (key.startsWith('manatuner') || key.startsWith('persist:'))) {
          toRemove.push(key)
        }
      }
      for (const key of toRemove) localStorage.removeItem(key)
    } catch {
      // ignore
    }

    for (const key of this.APP_SESSION_KEYS) {
      try {
        sessionStorage.removeItem(key)
      } catch {
        // ignore
      }
    }

    // T11: wipe Scryfall IndexedDB cache without blocking localStorage wipe
    void Promise.allSettled([
      import('../services/scryfallPersistentCache')
        .then((m) => m.clearPersistentScryfallCache())
        .catch(() => undefined),
    ])
  }

  /**
   * Exports analyses
   */
  static exportAnalyses(): string {
    const { raw, blocked } = this.readSources()
    if (blocked)
      throw new Error(
        'History source could not be read. Export cannot include that source; original storage is unchanged.'
      )
    return JSON.stringify(raw, null, 2)
  }

  /**
   * Async export for compatibility
   */
  static async exportAnalysesAsync(): Promise<string> {
    return this.exportAnalyses()
  }

  /**
   * Imports analyses
   */
  static importAnalyses(data: string): HistoryImportResult {
    if (data.length > 10_000_000) throw new Error('Import exceeds 10 MB. No history was changed.')
    let parsed: unknown
    try {
      parsed = JSON.parse(data)
    } catch {
      throw new Error('Invalid JSON data. No history was changed.')
    }
    if (!Array.isArray(parsed) || parsed.length > this.MAX_RECORDS) {
      throw new Error(
        'Import must contain an array of at most 50 analyses. No history was changed.'
      )
    }
    const records = parsed.map((value, index) => {
      const envelope = analysisRecordSchema.safeParse(value)
      if (!envelope.success)
        throw new Error(`Invalid history entry ${index + 1}. No history was changed.`)
      if (
        envelope.data.consistency !== undefined &&
        !finite.min(0).max(1).safeParse(envelope.data.consistency).success
      ) {
        throw new Error(`Invalid score in history entry ${index + 1}. No history was changed.`)
      }
      const analysis = envelope.data.analysis
      if (
        analysis !== undefined &&
        analysis !== null &&
        !savedResultSchema.safeParse(analysis).success
      ) {
        throw new Error(`Invalid result in history entry ${index + 1}. No history was changed.`)
      }
      return envelope.data
    })
    const { raw, blocked } = this.readSources()
    if (blocked)
      throw new Error(
        'Existing history could not be read. Import cancelled; original data is unchanged.'
      )
    const ids = new Set(
      raw
        .map((value) => analysisRecordSchema.safeParse(value))
        .filter((result) => result.success)
        .map((result) => (result.success ? result.data.id : ''))
    )
    let duplicates = 0
    const added = records.filter((record) => {
      if (ids.has(record.id)) {
        duplicates++
        return false
      }
      ids.add(record.id)
      return true
    })
    if (raw.length + added.length > this.MAX_RECORDS) {
      throw new Error(
        'Merged history would exceed 50 entries. Export a backup and delete selected analyses before importing. No history was changed.'
      )
    }
    this.persist([...raw, ...added])
    try {
      localStorage.removeItem(this.LEGACY_KEY)
    } catch {
      /* Canonical data is already durable. */
    }
    const recovered = added.filter(
      (record) => record.analysis == null || !hasRecognizedResult(record.analysis as object)
    ).length
    return { imported: added.length, duplicates, recovered }
  }

  /**
   * Async import for compatibility
   */
  static async importAnalysesAsync(data: string): Promise<void> {
    this.importAnalyses(data)
  }

  /**
   * Always returns true (for compatibility)
   */
  static async verifyUserCode(): Promise<boolean> {
    return true
  }
}

// Export convenience functions
export const getMyAnalyses = () => PrivacyStorage.getMyAnalyses()
export const getMyAnalysesAsync = () => PrivacyStorage.getMyAnalysesAsync()
export const exportAnalyses = () => PrivacyStorage.exportAnalyses()
export const exportAnalysesAsync = () => PrivacyStorage.exportAnalysesAsync()
export const clearAllLocalData = () => PrivacyStorage.clearAllLocalData()
export const saveAnalysisLocal = (analysis: Omit<AnalysisRecord, 'id' | 'timestamp'>) =>
  PrivacyStorage.saveAnalysis(analysis)
export const saveAnalysisLocalAsync = (analysis: Omit<AnalysisRecord, 'id' | 'timestamp'>) =>
  PrivacyStorage.saveAnalysisAsync(analysis)
export const deleteLocalAnalysis = (id: string) => PrivacyStorage.deleteAnalysis(id)
export const deleteLocalAnalysisAsync = (id: string) => PrivacyStorage.deleteAnalysisAsync(id)

// Legacy support for file import
export const importAnalyses = (file: File): Promise<void> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const data = e.target?.result as string
        PrivacyStorage.importAnalyses(data)
        resolve()
      } catch (error) {
        reject(error)
      }
    }
    reader.onerror = () => reject(new Error('Failed to read file'))
    reader.readAsText(file)
  })
}
