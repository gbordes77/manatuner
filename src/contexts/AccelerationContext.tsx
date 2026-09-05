import {
  AccelerationContext,
  AccelerationContextValue,
  AccelerationSettings,
} from './accelerationState'
/**
 * Acceleration Context
 *
 * Provides global settings for mana acceleration calculations:
 * - Format preset (affects removal rate)
 * - Play/Draw preference
 * - Custom removal rate override
 *
 * @version 1.0
 */

import React, { useCallback, useMemo, useState } from 'react'
import type { AccelContext, FormatPreset } from '../types/manaProducers'
import { FORMAT_REMOVAL_RATES } from '../types/manaProducers'
import {
  detectDeckFormatFamily,
  suggestedFormatPreset,
  type DeckFormatFamily,
} from '../utils/deckFormat'

// =============================================================================
// TYPES
// =============================================================================

// =============================================================================
// DEFAULTS
// =============================================================================

const DEFAULT_SETTINGS: AccelerationSettings = {
  format: 'modern',
  playDraw: 'PLAY',
  customRemovalRate: null,
  showAcceleration: true,
  formatSource: 'auto',
}

// =============================================================================
// CONTEXT
// =============================================================================

// =============================================================================
// PROVIDER
// =============================================================================

interface AccelerationProviderProps {
  children: React.ReactNode
}

export const AccelerationProvider: React.FC<AccelerationProviderProps> = ({ children }) => {
  const [settings, setSettings] = useState<AccelerationSettings>(() => {
    // Try to load from localStorage
    try {
      const stored = localStorage.getItem('manatuner_acceleration_settings')
      if (stored) {
        const parsed = JSON.parse(stored)
        // Migrate older saves missing formatSource / limited preset
        const format: FormatPreset =
          parsed.format && parsed.format in FORMAT_REMOVAL_RATES
            ? parsed.format
            : DEFAULT_SETTINGS.format
        return {
          ...DEFAULT_SETTINGS,
          ...parsed,
          format,
          formatSource: parsed.formatSource === 'user' ? 'user' : 'auto',
        }
      }
    } catch (e) {
      console.warn('Failed to load acceleration settings:', e)
    }
    return DEFAULT_SETTINGS
  })

  const [detectedFamily, setDetectedFamily] = useState<DeckFormatFamily | null>(null)

  // Persist settings to localStorage
  const persistSettings = useCallback((newSettings: AccelerationSettings) => {
    try {
      localStorage.setItem('manatuner_acceleration_settings', JSON.stringify(newSettings))
    } catch (e) {
      console.warn('Failed to persist acceleration settings:', e)
    }
  }, [])

  // Calculate effective removal rate
  const removalRate = useMemo(() => {
    if (settings.customRemovalRate !== null) {
      return settings.customRemovalRate
    }
    return FORMAT_REMOVAL_RATES[settings.format] ?? FORMAT_REMOVAL_RATES.modern
  }, [settings.format, settings.customRemovalRate])

  // Build AccelContext for calculations
  const accelContext = useMemo<AccelContext>(
    () => ({
      playDraw: settings.playDraw,
      removalRate,
      defaultRockSurvival: 0.98,
    }),
    [settings.playDraw, removalRate]
  )

  // Setters — explicit format pick locks auto
  const setFormat = useCallback(
    (format: FormatPreset) => {
      setSettings((prev) => {
        const updated: AccelerationSettings = {
          ...prev,
          format,
          customRemovalRate: null,
          formatSource: 'user',
        }
        persistSettings(updated)
        return updated
      })
    },
    [persistSettings]
  )

  const setPlayDraw = useCallback(
    (playDraw: 'PLAY' | 'DRAW') => {
      setSettings((prev) => {
        const updated = { ...prev, playDraw }
        persistSettings(updated)
        return updated
      })
    },
    [persistSettings]
  )

  const setCustomRemovalRate = useCallback(
    (rate: number | null) => {
      setSettings((prev) => {
        const updated = { ...prev, customRemovalRate: rate }
        persistSettings(updated)
        return updated
      })
    },
    [persistSettings]
  )

  const setShowAcceleration = useCallback(
    (show: boolean) => {
      setSettings((prev) => {
        const updated = { ...prev, showAcceleration: show }
        persistSettings(updated)
        return updated
      })
    },
    [persistSettings]
  )

  const suggestFromDeckSize = useCallback(
    (totalCards: number) => {
      const family = detectDeckFormatFamily(totalCards)
      setDetectedFamily(family)
      setSettings((prev) => {
        if (prev.formatSource === 'user') return prev
        const format = suggestedFormatPreset(family)
        if (prev.format === format) return prev
        const updated: AccelerationSettings = {
          ...prev,
          format,
          customRemovalRate: null,
          formatSource: 'auto',
        }
        persistSettings(updated)
        return updated
      })
    },
    [persistSettings]
  )

  const unlockFormatAuto = useCallback(() => {
    setSettings((prev) => {
      const updated: AccelerationSettings = { ...prev, formatSource: 'auto' }
      persistSettings(updated)
      return updated
    })
  }, [persistSettings])

  const resetToDefaults = useCallback(() => {
    setSettings(DEFAULT_SETTINGS)
    setDetectedFamily(null)
    persistSettings(DEFAULT_SETTINGS)
  }, [persistSettings])

  const value = useMemo<AccelerationContextValue>(
    () => ({
      settings,
      accelContext,
      removalRate,
      detectedFamily,
      setFormat,
      setPlayDraw,
      setCustomRemovalRate,
      setShowAcceleration,
      suggestFromDeckSize,
      unlockFormatAuto,
      resetToDefaults,
    }),
    [
      settings,
      accelContext,
      removalRate,
      detectedFamily,
      setFormat,
      setPlayDraw,
      setCustomRemovalRate,
      setShowAcceleration,
      suggestFromDeckSize,
      unlockFormatAuto,
      resetToDefaults,
    ]
  )

  return <AccelerationContext.Provider value={value}>{children}</AccelerationContext.Provider>
}

// =============================================================================
// HOOK
// =============================================================================

// =============================================================================
// EXPORTS
// =============================================================================
