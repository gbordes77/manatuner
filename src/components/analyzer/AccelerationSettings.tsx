/**
 * Acceleration Settings Component
 *
 * Always-visible Format + Play/Draw controls (P1-4), with optional advanced
 * removal slider. Format can be auto-set from deck size (P1-9).
 */

import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import HelpOutlineIcon from '@mui/icons-material/HelpOutline'
import RestoreIcon from '@mui/icons-material/Restore'
import {
  Box,
  Chip,
  Collapse,
  FormControl,
  FormControlLabel,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Slider,
  Switch,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
  Typography,
  useTheme,
} from '@mui/material'
import React, { useState } from 'react'
import { useAcceleration } from '../../contexts/accelerationState'
import type { FormatPreset, ProducerInDeck } from '../../types/manaProducers'
import { formatFamilyLabel } from '../../utils/deckFormat'

// =============================================================================
// FORMAT OPTIONS — plain language first
// =============================================================================

const FORMAT_OPTIONS: Array<{ value: FormatPreset; label: string; description: string }> = [
  {
    value: 'goldfish',
    label: 'Goldfish (no interaction)',
    description: '0% removal — test pure mana odds only',
  },
  {
    value: 'casual_edh',
    label: 'Commander / EDH',
    description: '~10% creature removal — multiplayer casual',
  },
  {
    value: 'cedh',
    label: 'cEDH',
    description: '~15% removal — competitive EDH, less random creature kill',
  },
  {
    value: 'limited',
    label: 'Limited (Draft / Sealed)',
    description: '~15% removal — 40-card decks',
  },
  {
    value: 'standard',
    label: 'Standard',
    description: '~20% removal',
  },
  {
    value: 'modern',
    label: 'Modern / Pioneer',
    description: '~35% removal — “Bolt the Bird” density',
  },
  {
    value: 'legacy',
    label: 'Legacy / Vintage',
    description: '~40% removal — highest interaction',
  },
]

// =============================================================================
// HELPERS
// =============================================================================

interface AccelerationSettingsProps {
  producersInDeck?: ProducerInDeck[]
  deckSize?: number
}

function pAtLeastOneInHand(deckSize: number, rampCount: number, cardsSeen: number): number {
  if (rampCount <= 0 || cardsSeen <= 0) return 0
  if (rampCount >= deckSize) return 1
  const n = Math.min(cardsSeen, deckSize)
  let pZero = 1
  for (let i = 0; i < n; i++) {
    pZero *= (deckSize - rampCount - i) / (deckSize - i)
  }
  return Math.max(0, Math.min(1, 1 - pZero))
}

// =============================================================================
// COMPONENT
// =============================================================================

export const AccelerationSettings: React.FC<AccelerationSettingsProps> = ({
  producersInDeck = [],
  deckSize = 60,
}) => {
  const theme = useTheme()
  const isDark = theme.palette.mode === 'dark'
  const [advancedOpen, setAdvancedOpen] = useState(false)

  const {
    settings,
    removalRate,
    detectedFamily,
    setFormat,
    setPlayDraw,
    setCustomRemovalRate,
    setShowAcceleration,
    unlockFormatAuto,
    resetToDefaults,
  } = useAcceleration()

  const handleRemovalRateChange = (_: Event, value: number | number[]) => {
    const rate = Array.isArray(value) ? value[0] : value
    setCustomRemovalRate(rate / 100)
  }

  const formatLabel =
    FORMAT_OPTIONS.find((o) => o.value === settings.format)?.label ?? settings.format

  return (
    <Paper
      sx={{
        mb: 2,
        overflow: 'hidden',
        border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
      }}
      data-testid="analysis-settings"
    >
      {/* P1-4: Always-visible primary controls */}
      <Box
        sx={{
          p: 1.75,
          display: 'flex',
          flexDirection: 'column',
          gap: 1.5,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 2,
            alignItems: 'flex-end',
          }}
        >
          <FormControl size="small" sx={{ minWidth: 220, flex: '1 1 200px' }}>
            <InputLabel id="format-label">Format</InputLabel>
            <Select
              labelId="format-label"
              value={settings.format}
              label="Format"
              onChange={(e) => setFormat(e.target.value as FormatPreset)}
              data-testid="format-select"
            >
              {FORMAT_OPTIONS.map((opt) => (
                <MenuItem key={opt.value} value={opt.value}>
                  {opt.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Box sx={{ flex: '0 0 auto' }}>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ display: 'block', mb: 0.5, fontWeight: 600 }}
            >
              Starting player
            </Typography>
            <ToggleButtonGroup
              exclusive
              size="small"
              value={settings.playDraw}
              onChange={(_, v) => {
                if (v) setPlayDraw(v)
              }}
              data-testid="play-draw-toggle"
              aria-label="On the play or on the draw"
            >
              <ToggleButton value="PLAY" sx={{ textTransform: 'none', px: 1.5 }}>
                On the play
              </ToggleButton>
              <ToggleButton value="DRAW" sx={{ textTransform: 'none', px: 1.5 }}>
                On the draw
              </ToggleButton>
            </ToggleButtonGroup>
          </Box>

          <FormControlLabel
            control={
              <Switch
                size="small"
                checked={settings.showAcceleration && producersInDeck.length > 0}
                disabled={producersInDeck.length === 0}
                onChange={(e) => setShowAcceleration(e.target.checked)}
              />
            }
            label={
              <Typography
                variant="body2"
                color={producersInDeck.length === 0 ? 'text.disabled' : 'text.primary'}
              >
                Count rocks & dorks
              </Typography>
            }
            sx={{ ml: 0 }}
          />
        </Box>

        {/* Auto-detect + ramp summary row */}
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, alignItems: 'center' }}>
          {detectedFamily && (
            <Chip
              size="small"
              label={
                settings.formatSource === 'auto'
                  ? `Auto: ${formatFamilyLabel(detectedFamily)}`
                  : `Deck looks like ${formatFamilyLabel(detectedFamily)} (format locked by you)`
              }
              color={settings.formatSource === 'auto' ? 'primary' : 'default'}
              variant="outlined"
              onClick={
                settings.formatSource === 'user'
                  ? () => {
                      unlockFormatAuto()
                    }
                  : undefined
              }
              sx={{ fontWeight: 600 }}
            />
          )}
          <Tooltip
            title={`${formatLabel}. Creature removal ~${Math.round(removalRate * 100)}% (affects dork survival; rocks ~98%).`}
            arrow
          >
            <Chip
              size="small"
              icon={<HelpOutlineIcon sx={{ fontSize: '14px !important' }} />}
              label={`${Math.round(removalRate * 100)}% removal`}
              variant="outlined"
              sx={{ fontSize: '0.75rem' }}
            />
          </Tooltip>
          {producersInDeck.length > 0 ? (
            (() => {
              const totalRamp = producersInDeck.reduce((sum, p) => sum + p.copies, 0)
              const pOpener = Math.round(pAtLeastOneInHand(deckSize, totalRamp, 7) * 100)
              return (
                <Chip
                  size="small"
                  color="success"
                  label={`${totalRamp} ramp · ${pOpener}% in opener`}
                  sx={{ fontWeight: 600 }}
                />
              )
            })()
          ) : (
            <Chip size="small" label="No ramp detected" variant="outlined" />
          )}

          <Box sx={{ ml: 'auto', display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Tooltip title="Reset format & play/draw to defaults">
              <IconButton
                size="small"
                onClick={resetToDefaults}
                aria-label="Reset analysis settings"
              >
                <RestoreIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Chip
              size="small"
              label={advancedOpen ? 'Hide advanced' : 'Advanced'}
              onClick={() => setAdvancedOpen((o) => !o)}
              onDelete={() => setAdvancedOpen((o) => !o)}
              deleteIcon={
                <ExpandMoreIcon
                  sx={{
                    transform: advancedOpen ? 'rotate(180deg)' : 'none',
                    transition: 'transform 0.2s',
                  }}
                />
              }
              variant="outlined"
              sx={{ cursor: 'pointer' }}
            />
          </Box>
        </Box>
      </Box>

      <Collapse in={advancedOpen}>
        <Box
          sx={{
            p: 2,
            pt: 1,
            borderTop: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
          }}
        >
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
            Creature removal rate (override format default). Higher = dorks die more often.
          </Typography>
          <Box
            sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}
          >
            <Typography variant="caption" color="text.secondary">
              Custom removal
            </Typography>
            <Typography variant="caption" fontWeight="bold">
              {Math.round(removalRate * 100)}%
            </Typography>
          </Box>
          <Slider
            value={removalRate * 100}
            onChange={handleRemovalRateChange}
            min={0}
            max={60}
            step={5}
            marks={[
              { value: 0, label: '0%' },
              { value: 20, label: '20%' },
              { value: 40, label: '40%' },
              { value: 60, label: '60%' },
            ]}
            valueLabelDisplay="auto"
            valueLabelFormat={(v) => `${v}%`}
            sx={{ '& .MuiSlider-markLabel': { fontSize: '0.65rem' } }}
          />
          <Typography variant="caption" color="text.disabled" sx={{ display: 'block', mt: 1 }}>
            Dork survival ≈ (1 − removal)^turns exposed. Rocks stay ~98% survival.
          </Typography>
        </Box>
      </Collapse>
    </Paper>
  )
}

export default AccelerationSettings
