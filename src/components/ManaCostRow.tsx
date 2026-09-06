import {
  Box,
  CircularProgress,
  Fade,
  Grid,
  LinearProgress,
  Paper,
  Tooltip,
  Typography,
  useTheme,
} from '@mui/material'
import React, { memo, useEffect, useMemo, useState } from 'react'
import { parsePhysicalCost } from '../services/castability/parsePhysicalCost'
import { physicalManaProbability } from '../services/castability/physicalManaEngine'
import { searchCardByName } from '../services/scryfall'
import type { Card as MTGCard } from '../types'
import { CardImageTooltip } from './CardImageTooltip'
import {
  ManaCostRowProps,
  getCmcFromCard,
  getFixedCmcFromManaCost,
  getManaCostFromCard,
  useAcceleratedCastability,
  useProbabilityCalculation,
} from './manaCostHooks'

/** v1.1: Unconditional multi-mana land group */
// Keyrune mana symbol component
const KeyruneManaSymbol: React.FC<{ symbol: string; size?: number }> = ({ symbol, size = 18 }) => {
  const theme = useTheme()
  const isDark = theme.palette.mode === 'dark'

  const symbolMap: Record<string, string> = {
    W: 'w',
    U: 'u',
    B: 'b',
    R: 'r',
    G: 'g',
    C: 'c',
    S: 's',
    X: 'x',
  }

  const cleanSymbol = symbol.replace(/[{}]/g, '')

  // Generic mana (numbers) - display as numbered circle
  // Keyrune icons render larger than their fontSize, so we scale up generic symbols to match
  const scaledSize = size * 1.2

  if (/^\d+$/.test(cleanSymbol)) {
    const num = parseInt(cleanSymbol)
    return (
      <Box
        component="span"
        sx={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: scaledSize,
          height: scaledSize,
          borderRadius: '50%',
          bgcolor: isDark ? '#4a4a4a' : '#CAC5C0',
          color: isDark ? '#e0e0e0' : '#333',
          fontSize: scaledSize * 0.55,
          fontWeight: 'bold',
          fontFamily: 'monospace',
          border: `1px solid ${isDark ? '#666' : '#999'}`,
          boxShadow: '0 1px 2px rgba(0,0,0,0.2)',
        }}
      >
        {num}
      </Box>
    )
  }

  // X cost
  if (cleanSymbol === 'X') {
    return (
      <Box
        component="span"
        sx={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: scaledSize,
          height: scaledSize,
          borderRadius: '50%',
          bgcolor: isDark ? '#4a4a4a' : '#CAC5C0',
          color: isDark ? '#e0e0e0' : '#333',
          fontSize: scaledSize * 0.55,
          fontWeight: 'bold',
          fontFamily: 'monospace',
          border: `1px solid ${isDark ? '#666' : '#999'}`,
          boxShadow: '0 1px 2px rgba(0,0,0,0.2)',
        }}
      >
        X
      </Box>
    )
  }

  // Hybrid mana (e.g., "R/G", "W/U", "2/W")
  // mana-font supports hybrid symbols: ms-rg, ms-wu, ms-2w, etc.
  // Hybrid rendering uses ::before/::after pseudo-elements with position: absolute,
  // so the element needs proper sizing and overflow: visible.
  if (cleanSymbol.includes('/')) {
    const parts = cleanSymbol.split('/')
    // Build hybrid class: lowercase both parts joined (e.g., "R/G" → "rg", "2/W" → "2w")
    const hybridClass = parts.map((p) => p.toLowerCase()).join('')
    return (
      <i
        className={`ms ms-${hybridClass} ms-cost ms-shadow`}
        style={{
          fontSize: size,
          overflow: 'visible',
        }}
      />
    )
  }

  // Standard color symbols with Keyrune
  if (symbolMap[cleanSymbol]) {
    return (
      <i
        className={`ms ms-${symbolMap[cleanSymbol]} ms-cost`}
        style={{
          fontSize: size,
          filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.3))',
        }}
      />
    )
  }

  // Fallback
  return (
    <Box
      component="span"
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: size,
        height: size,
        borderRadius: '50%',
        bgcolor: '#888',
        color: '#fff',
        fontSize: size * 0.5,
        fontWeight: 'bold',
      }}
    >
      ?
    </Box>
  )
}

// Parse and render full mana cost string with Keyrune
const KeyruneManaCost: React.FC<{ manaCost: string; size?: number }> = memo(
  ({ manaCost, size = 18 }) => {
    if (!manaCost) {
      return (
        <Typography variant="body2" color="text.secondary" component="span">
          No cost
        </Typography>
      )
    }

    const matches = manaCost.match(/\{[^}]+\}/g) || []

    if (matches.length === 0) {
      return (
        <Typography variant="body2" color="text.secondary" component="span">
          {manaCost}
        </Typography>
      )
    }

    return (
      <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.3 }}>
        {matches.map((symbol, index) => (
          <KeyruneManaSymbol key={index} symbol={symbol} size={size} />
        ))}
      </Box>
    )
  }
)

KeyruneManaCost.displayName = 'KeyruneManaCost'

// Helper to get mana cost from card data, handling DFCs (double-faced cards)
// Get color based on probability
// Hook for accelerated castability calculation
// v1.1: Uses unconditionalMultiMana for probabilistic multi-mana land handling
// NOTE (2026-04-12): `baseProbability` was previously in the signature but was
// never read in the body — including it in the deps array invalidated the
// memo on every P2 recalc, defeating the optimization. Removed.
const ManaCostRow: React.FC<ManaCostRowProps> = memo(
  ({
    cardName,
    quantity,
    probabilityModel = 'exact',
    deckSources,
    totalLands,
    totalCards,
    producers,
    accelContext,
    showAcceleration = false,
    unconditionalMultiMana,
    physicalLands,
    initialCardData,
    isCreature,
    creatureOnlyExtraSources,
    inFormatHorizon = false,
    horizonLabel,
    isCommander = false,
  }) => {
    const theme = useTheme()
    const isDark = theme.palette.mode === 'dark'
    const [cardData, setCardData] = useState<MTGCard | null>(initialCardData ?? null)
    const [loading, setLoading] = useState(!initialCardData)
    const [error, setError] = useState<string | null>(null)

    // Adjust sources for creature spells: add Cavern of Souls-type lands
    const effectiveDeckSources = useMemo(() => {
      if (!isCreature || !creatureOnlyExtraSources || !deckSources) return deckSources
      const adjusted = { ...deckSources }
      for (const [color, count] of Object.entries(creatureOnlyExtraSources)) {
        adjusted[color] = (adjusted[color] || 0) + count
      }
      return adjusted
    }, [deckSources, isCreature, creatureOnlyExtraSources])

    const probabilities = useProbabilityCalculation(
      cardData,
      cardName,
      effectiveDeckSources,
      totalLands,
      totalCards,
      accelContext?.playDraw ?? 'PLAY'
    )

    // Calculate accelerated castability if enabled
    // v1.1: Multi-mana lands now handled probabilistically in engine
    // Audit fix H3 (2026-04-13): pass effectiveDeckSources (with Cavern of Souls
    // / Unclaimed Territory / etc. adjustments for creature spells) so the
    // accelerated path agrees with the base path on tribal decks. Without this,
    // enabling acceleration could PARADOXICALLY decrease the displayed
    // castability (e.g. Humans + Cavern: 95% base → 78% accelerated).
    const acceleratedResult = useAcceleratedCastability(
      cardData,
      cardName,
      effectiveDeckSources,
      totalLands,
      totalCards,
      producers,
      accelContext,
      showAcceleration,
      unconditionalMultiMana
    )

    const physicalResult = useMemo(() => {
      if (probabilityModel === 'estimate') return null
      if (physicalLands == null)
        return { status: 'unsupported' as const, reason: 'Physical land metadata is incomplete' }
      if (
        showAcceleration &&
        (producers?.length ?? 0) > 0 &&
        (accelContext?.removalRate ?? 0) !== 0
      )
        return {
          status: 'unsupported' as const,
          reason: 'Exact sequencing currently supports goldfish only (removal rate 0)',
        }
      const cost = parsePhysicalCost(getManaCostFromCard(cardData) || '')
      return physicalManaProbability(
        {
          deckSize: totalCards ?? 60,
          totalLands: physicalLands.length,
          landColorSources: {},
          physicalLands,
        },
        cost,
        Math.max(1, cost.mv),
        showAcceleration ? (producers ?? []) : [],
        accelContext?.playDraw ?? 'PLAY',
        1_000_000
      )
    }, [
      probabilityModel,
      physicalLands,
      cardData,
      totalCards,
      producers,
      showAcceleration,
      accelContext,
    ])

    useEffect(() => {
      // Skip fetch if card data was provided via props
      if (initialCardData || !cardName) return

      const fetchCardData = async () => {
        setLoading(true)
        setError(null)

        try {
          const data = await searchCardByName(cardName)
          setCardData(data)
        } catch (err) {
          setError('Failed to fetch card data')
          console.error('Error fetching card:', err)
        } finally {
          setLoading(false)
        }
      }

      fetchCardData()
    }, [cardName, initialCardData])

    if (loading) {
      return (
        <Paper sx={{ p: 2, mb: 1.5 }}>
          <Grid container alignItems="center" spacing={2}>
            <Grid item xs={4}>
              <Typography variant="body1" fontWeight="600">
                {quantity}x {cardName}
              </Typography>
            </Grid>
            <Grid item xs={4} display="flex" alignItems="center" gap={1}>
              <CircularProgress size={18} />
              <Typography variant="body2" color="text.secondary">
                Loading...
              </Typography>
            </Grid>
            <Grid item xs={2}>
              <Typography variant="body2" color="text.secondary">
                —
              </Typography>
            </Grid>
            <Grid item xs={2}>
              <Typography variant="body2" color="text.secondary">
                —
              </Typography>
            </Grid>
          </Grid>
        </Paper>
      )
    }

    if (error) {
      return (
        <Paper sx={{ p: 2, mb: 1.5, borderLeft: `3px solid ${theme.palette.error.main}` }}>
          <Grid container alignItems="center" spacing={2}>
            <Grid item xs={4}>
              <Typography variant="body1" fontWeight="600">
                {quantity}x {cardName}
              </Typography>
            </Grid>
            <Grid item xs={4}>
              <Typography variant="caption" color="error">
                Card not found
              </Typography>
            </Grid>
            <Grid item xs={2}>
              <Typography variant="body2" color="text.secondary">
                —
              </Typography>
            </Grid>
            <Grid item xs={2}>
              <Typography variant="body2" color="text.secondary">
                —
              </Typography>
            </Grid>
          </Grid>
        </Paper>
      )
    }

    // Extract set code from card data
    const setCode = cardData?.set?.toUpperCase() || ''

    return (
      <Fade in={true} timeout={300}>
        <Paper
          data-horizon={inFormatHorizon ? 'priority' : undefined}
          data-commander={isCommander ? 'true' : undefined}
          sx={{
            p: { xs: 1.25, sm: 2 },
            mb: { xs: 1, sm: 1.5 },
            transition: 'all 0.2s ease',
            // P2-5: stack cleanly on narrow screens — avoid dense table feel
            overflow: 'hidden',
            ...(isCommander
              ? {
                  borderLeft: '3px solid',
                  borderLeftColor: 'secondary.main',
                  bgcolor: (t) =>
                    t.palette.mode === 'dark'
                      ? 'rgba(156, 39, 176, 0.12)'
                      : 'rgba(156, 39, 176, 0.06)',
                }
              : inFormatHorizon
                ? {
                    borderLeft: '3px solid',
                    borderLeftColor: 'primary.main',
                    bgcolor: (t) =>
                      t.palette.mode === 'dark'
                        ? 'rgba(25, 118, 210, 0.08)'
                        : 'rgba(25, 118, 210, 0.04)',
                  }
                : {}),
            '&:hover': {
              boxShadow: isDark ? '0 4px 12px rgba(0,0,0,0.3)' : '0 4px 12px rgba(0,0,0,0.1)',
            },
          }}
        >
          {/* Row 1: Card name, mana cost, CMC, P1, P2 */}
          <Grid container alignItems="center" spacing={2}>
            {/* Card Name & Quantity */}
            <Grid item xs={12} md={4}>
              <CardImageTooltip cardName={cardData?.name || cardName}>
                <Box>
                  <Typography
                    variant="body1"
                    fontWeight="600"
                    sx={{
                      cursor: 'pointer',
                      '&:hover': { color: theme.palette.primary.main },
                    }}
                  >
                    {quantity}x {cardData?.name || cardName}
                    {(isCommander || inFormatHorizon) && horizonLabel ? (
                      <Typography
                        component="span"
                        variant="caption"
                        sx={{
                          ml: 0.75,
                          px: 0.6,
                          py: 0.15,
                          borderRadius: 1,
                          bgcolor: isCommander ? 'secondary.main' : 'primary.main',
                          color: isCommander ? 'secondary.contrastText' : 'primary.contrastText',
                          fontWeight: 700,
                          fontSize: '0.65rem',
                          verticalAlign: 'middle',
                        }}
                      >
                        {horizonLabel}
                      </Typography>
                    ) : null}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Cost: {getManaCostFromCard(cardData) || '—'}
                  </Typography>
                </Box>
              </CardImageTooltip>
            </Grid>

            {/* Mana Cost with Keyrune + CMC — full width on phone for readability */}
            <Grid item xs={12} sm={4} md={2}>
              <Box display="flex" alignItems="center" gap={1.5}>
                <KeyruneManaCost manaCost={getManaCostFromCard(cardData) || ''} size={20} />
                {probabilities.hasX && probabilities.xInfo ? (
                  <Tooltip
                    title={
                      <Box sx={{ p: 0.5 }}>
                        <Typography variant="body2" fontWeight="bold" gutterBottom>
                          Variable Cost (X spell)
                        </Typography>
                        <Typography variant="caption" component="div" sx={{ mb: 1 }}>
                          This spell has X in its cost. We calculate castability assuming you want a
                          meaningful X value.
                        </Typography>
                        <Typography variant="caption" component="div">
                          • Fixed cost: {probabilities.xInfo.fixedCost}
                        </Typography>
                        <Typography variant="caption" component="div">
                          • Calculated with X = {probabilities.xInfo.xValue}
                        </Typography>
                        <Typography variant="caption" component="div">
                          • Target turn: {probabilities.xInfo.targetTurn}
                        </Typography>
                        <Typography
                          variant="caption"
                          component="div"
                          sx={{ mt: 1, fontStyle: 'italic' }}
                        >
                          At turn {probabilities.xInfo.targetTurn}, you'd have{' '}
                          {probabilities.xInfo.targetTurn} mana, spending{' '}
                          {getFixedCmcFromManaCost(getManaCostFromCard(cardData))} on fixed costs
                          and {probabilities.xInfo.xValue} on X.
                        </Typography>
                      </Box>
                    }
                    arrow
                  >
                    <Box display="flex" alignItems="center" gap={0.5}>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          bgcolor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
                          px: 1,
                          py: 0.25,
                          borderRadius: 1,
                          fontSize: '0.75rem',
                        }}
                      >
                        CMC: {getFixedCmcFromManaCost(getManaCostFromCard(cardData))}+X
                      </Typography>
                      <Box
                        sx={{
                          bgcolor: theme.palette.warning.main,
                          color: '#fff',
                          px: 0.75,
                          py: 0.25,
                          borderRadius: 1,
                          fontSize: '0.65rem',
                          fontWeight: 'bold',
                          cursor: 'help',
                        }}
                      >
                        X={probabilities.xInfo.xValue}
                      </Box>
                    </Box>
                  </Tooltip>
                ) : (
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      bgcolor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
                      px: 1,
                      py: 0.25,
                      borderRadius: 1,
                      fontSize: '0.75rem',
                    }}
                  >
                    CMC: {getCmcFromCard(cardData)}
                  </Typography>
                )}
              </Box>
            </Grid>

            {/* Realistic + Perfect drops — prefer SSOT accelerated engine (base always).
                Full width on xs so primary % never clips beside mana pips. */}
            <Grid item xs={12} sm={8} md={6}>
              {physicalResult ? (
                physicalResult.status === 'exact' ? (
                  <Box>
                    <Typography variant="body2">
                      Potential castability: {Math.round(physicalResult.p2 * 100)}%
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {showAcceleration ? 'Audited ramp included. ' : 'Lands only. '}
                      Exact for the represented goldfish model. At least one legal sequence; no
                      mulligan or chance of drawing this spell.
                    </Typography>
                  </Box>
                ) : (
                  <Box role="status">
                    <Typography variant="body2">Calculation unavailable</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {physicalResult.reason}
                    </Typography>
                  </Box>
                )
              ) : acceleratedResult && physicalLands != null ? (
                <Box data-testid="mana-estimate">
                  <LinearProgress
                    variant="determinate"
                    aria-label="Estimated mana availability"
                    value={
                      (showAcceleration
                        ? acceleratedResult.withAcceleration.p2
                        : acceleratedResult.base.p2) * 100
                    }
                    sx={{ height: 8, borderRadius: 1, mb: 0.5 }}
                  />
                  <Typography variant="body2">
                    Mana availability estimate:{' '}
                    {Math.round(
                      (showAcceleration
                        ? acceleratedResult.withAcceleration.p2
                        : acceleratedResult.base.p2) * 100
                    )}
                    %
                  </Typography>
                  <Typography variant="caption" display="block">
                    Lands only: {Math.round(acceleratedResult.base.p2 * 100)}% · Perfect land drops:{' '}
                    {Math.round(acceleratedResult.base.p1 * 100)}%
                  </Typography>
                  <Typography variant="caption" color="text.secondary" display="block">
                    Source-count heuristic.{' '}
                    {showAcceleration
                      ? `Ramp included; creature removal ${Math.round((accelContext?.removalRate ?? 0) * 100)}%. `
                      : 'Lands only. '}
                    No mulligan or chance of drawing this spell. Source overlap and sequencing are
                    approximated.
                    {getManaCostFromCard(cardData)?.includes('/') &&
                      ' Hybrid pips use a fixed choice of the most represented color.'}
                  </Typography>
                </Box>
              ) : (
                <Box role="status">
                  <Typography variant="body2">Calculation unavailable</Typography>
                  <Typography variant="caption" color="text.secondary">
                    {physicalLands == null
                      ? 'Physical land metadata is incomplete'
                      : 'Missing metadata or cost outside the source-count model. Special costs can be explored in the policy model.'}
                  </Typography>
                </Box>
              )}
            </Grid>
          </Grid>

          {/* Row 2: Type line and Set */}
          {(cardData?.type_line || setCode) && (
            <Box
              sx={{
                mt: 1.5,
                pt: 1.5,
                borderTop: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              {cardData?.type_line && (
                <Typography variant="caption" color="text.secondary">
                  Type: {cardData.type_line}
                </Typography>
              )}
              {setCode && (
                <Typography variant="caption" color="text.secondary">
                  Set: {cardData?.set_name || setCode} ({setCode})
                </Typography>
              )}
            </Box>
          )}
        </Paper>
      </Fade>
    )
  }
)

ManaCostRow.displayName = 'ManaCostRow'

export default ManaCostRow
