import { createContext, useContext } from 'react'
import type { AccelContext, FormatPreset } from '../types/manaProducers'
import type { DeckFormatFamily } from '../utils/deckFormat'
export interface AccelerationSettings {
  /** Selected format preset */
  format: FormatPreset

  /** On the play or draw */
  playDraw: 'PLAY' | 'DRAW'

  /** Custom removal rate (overrides format preset if set) */
  customRemovalRate: number | null

  /** Whether to show acceleration data in UI */
  showAcceleration: boolean

  /**
   * 'auto' = next suggestFromDeckSize may update format.
   * 'user' = user picked a format; auto-detect will not override.
   */
  formatSource: 'auto' | 'user'
}

export interface AccelerationContextValue {
  /** Current settings */
  settings: AccelerationSettings

  /** Computed AccelContext for calculations */
  accelContext: AccelContext

  /** Current effective removal rate */
  removalRate: number

  /** Last auto-detected family (null until a deck size is applied) */
  detectedFamily: DeckFormatFamily | null

  /** Update format (marks source = user) */
  setFormat: (format: FormatPreset) => void

  /** Update play/draw */
  setPlayDraw: (playDraw: 'PLAY' | 'DRAW') => void

  /** Set custom removal rate (null to use format preset) */
  setCustomRemovalRate: (rate: number | null) => void

  /** Toggle acceleration display */
  setShowAcceleration: (show: boolean) => void

  /**
   * If formatSource is auto, set format from deck size (Commander / Limited / Modern).
   * Always updates detectedFamily for UI banners.
   */
  suggestFromDeckSize: (totalCards: number) => void

  /** Allow auto format again (e.g. after loading a new sample) */
  unlockFormatAuto: () => void

  /** Reset to defaults */
  resetToDefaults: () => void
}

export const AccelerationContext = createContext<AccelerationContextValue | null>(null)
export function useAcceleration(): AccelerationContextValue {
  const context = useContext(AccelerationContext)
  if (!context) {
    throw new Error('useAcceleration must be used within an AccelerationProvider')
  }
  return context
}
