import { Alert, Box, Paper, Tooltip, Typography } from '@mui/material'
import React, { useMemo } from 'react'
import { MANA_COLOR_STYLES } from '../../constants/manaColors'
import { AnalysisResult } from '../../services/deckAnalyzer'
import { detectDeckFormatFamily, KARSTEN_REFERENCE_DECK_SIZE } from '../../utils/deckFormat'
import { computeColorDeltas, colorTargetLimitations } from './karstenDeltas'

interface KarstenTargetDeltaProps {
  analysisResult: AnalysisResult
  isMobile: boolean
}

const VERDICT_COLORS = {
  ok: { bg: 'rgba(46, 125, 50, 0.12)', border: '#2e7d32', label: '#1b5e20' },
  warn: { bg: 'rgba(237, 108, 2, 0.12)', border: '#ed6c02', label: '#b26a00' },
  short: { bg: 'rgba(211, 47, 47, 0.12)', border: '#d32f2f', label: '#c62828' },
} as const

export const KarstenTargetDelta: React.FC<KarstenTargetDeltaProps> = ({
  analysisResult,
  isMobile,
}) => {
  const deltas = useMemo(() => computeColorDeltas(analysisResult), [analysisResult])
  const limitations = useMemo(() => colorTargetLimitations(analysisResult), [analysisResult])
  const deckSize = analysisResult.totalCards || KARSTEN_REFERENCE_DECK_SIZE
  const family = detectDeckFormatFamily(deckSize)
  const anyScaled = deltas.some((d) => d.wasScaled)

  if (deltas.length === 0 && limitations.length === 0) return null

  return (
    <Paper sx={{ p: isMobile ? 2 : 3 }}>
      <Typography variant={isMobile ? 'body1' : 'h6'} gutterBottom sx={{ fontWeight: 'bold' }}>
        Fixed Color Sources — Main Deck
      </Typography>
      {deltas.length > 0 && (
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ display: 'block', mb: 2, lineHeight: 1.5 }}
        >
          For each fixed color requirement in main-deck spells, we compare how many lands producing
          that color you have against Frank Karsten&apos;s published source guidelines for the
          strongest requirement in your spells. These assume sufficient lands after mulligans and a
          target of 89 + mana value percent
          {anyScaled
            ? ` — scaled from 60-card tables to your ${deckSize}-card ${
                family === 'edh' ? 'Commander' : family === 'limited' ? 'Limited' : ''
              } list (×${deckSize}/${KARSTEN_REFERENCE_DECK_SIZE}).`
            : '.'}{' '}
          Green: you&apos;re fine. Orange: a few sources short. Red: well short — you&apos;ll miss a
          lot of casts.
        </Typography>
      )}

      {limitations.length > 0 && (
        <Alert severity="info" sx={{ mb: 2 }}>
          {limitations.map((note) => (
            <Typography key={note} variant="body2">
              {note}
            </Typography>
          ))}
        </Alert>
      )}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5 }}>
        {deltas.map((d) => {
          const manaStyle = MANA_COLOR_STYLES[d.color]
          const palette = VERDICT_COLORS[d.verdict]
          const pipSymbol = `{${d.color}}`.repeat(d.maxPips)
          const deltaLabel =
            d.delta === 0
              ? 'on target'
              : d.delta > 0
                ? `+${d.delta} above target`
                : `${d.delta} short`

          return (
            <Tooltip
              key={d.color}
              arrow
              title={
                <Box>
                  <Typography variant="caption" sx={{ display: 'block', fontWeight: 700 }}>
                    Toughest {d.color} requirement: {pipSymbol} at turn {d.pivotTurn}
                  </Typography>
                  <Typography variant="caption" sx={{ display: 'block' }}>
                    Karsten target: {d.required} sources
                    {d.wasScaled
                      ? ` (scaled from ${d.requiredUnscaled} @ 60-card → ${deckSize}-card)`
                      : ''}
                  </Typography>
                  <Typography variant="caption" sx={{ display: 'block' }}>
                    Your deck: {d.actual} sources ({deltaLabel})
                  </Typography>
                  {d.wasClamped && (
                    <Typography
                      variant="caption"
                      sx={{ display: 'block', mt: 0.5, fontStyle: 'italic', opacity: 0.85 }}
                    >
                      ⚠ Requirement exceeds Karsten&apos;s published range — target is an
                      extrapolation, treat with extra caution.
                    </Typography>
                  )}
                  {d.wasScaled && !d.wasClamped && (
                    <Typography
                      variant="caption"
                      sx={{ display: 'block', mt: 0.5, fontStyle: 'italic', opacity: 0.85 }}
                    >
                      Scaled N/60 approximation — outside the published table.
                    </Typography>
                  )}
                </Box>
              }
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  px: 1.5,
                  py: 1,
                  borderRadius: 2,
                  border: '1.5px solid',
                  borderColor: palette.border,
                  bgcolor: palette.bg,
                  minWidth: 145,
                  cursor: 'help',
                }}
              >
                <Box
                  sx={{
                    width: 28,
                    height: 28,
                    borderRadius: '50%',
                    bgcolor: manaStyle.bg,
                    color: manaStyle.text,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700,
                    fontSize: '0.9rem',
                    flexShrink: 0,
                  }}
                >
                  {d.color}
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'column', lineHeight: 1.2 }}>
                  <Typography
                    variant="caption"
                    sx={{ color: palette.label, fontWeight: 700, fontSize: '0.78rem' }}
                  >
                    {d.actual}/{d.required} sources
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      color: palette.label,
                      fontWeight: 600,
                      fontSize: '0.72rem',
                      opacity: 0.9,
                    }}
                  >
                    {d.verdict === 'ok'
                      ? 'Target met'
                      : d.delta < 0
                        ? `${Math.abs(d.delta)} source${Math.abs(d.delta) > 1 ? 's' : ''} short`
                        : `+${d.delta}`}
                  </Typography>
                </Box>
              </Box>
            </Tooltip>
          )
        })}
      </Box>
    </Paper>
  )
}
