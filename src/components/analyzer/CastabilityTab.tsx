import HelpOutlineIcon from '@mui/icons-material/HelpOutline'
import TimelineIcon from '@mui/icons-material/Timeline'
import {
  Alert,
  Box,
  Chip,
  Grid,
  IconButton,
  Paper,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
  Typography,
} from '@mui/material'
import React, { memo, useEffect, useMemo, useState } from 'react'
import { useAcceleration } from '../../contexts/AccelerationContext'
import { AnalysisResult } from '../../services/deckAnalyzer'
import { manaProducerService, producerCacheService } from '../../services/manaProducerService'
import type { Card } from '../../types'
import type { ProducerInDeck, UnconditionalMultiManaGroup } from '../../types/manaProducers'
import {
  castabilityHorizon,
  commanderCaveats,
  effectiveLibrarySize,
  findSingletonViolations,
  isInCastabilityHorizon,
  landCountGuidance,
} from '../../utils/deckFormat'
import ManaCostRow from '../ManaCostRow'
import { Term } from '../common/Term'
import { AccelerationSettings } from './AccelerationSettings'
import { SideboardSwapEditor, type SideboardSwap } from './SideboardSwapEditor'

interface CastabilityTabProps {
  analysisResult: AnalysisResult
}

type BoardScope = 'main' | 'postboard'

export const CastabilityTab: React.FC<CastabilityTabProps> = memo(({ analysisResult }) => {
  // Get acceleration context
  const { settings, accelContext, detectedFamily, suggestFromDeckSize } = useAcceleration()

  // P1-8: board scope — main only vs post-board (swaps)
  const [boardScope, setBoardScope] = useState<BoardScope>('main')
  const [activeSwaps, setActiveSwaps] = useState<SideboardSwap[]>([])

  // P1-9: auto format from analyzed deck size
  useEffect(() => {
    const n = analysisResult?.totalCards
    if (n && n > 0) suggestFromDeckSize(n)
  }, [analysisResult?.totalCards, suggestFromDeckSize])

  // Separate maindeck and sideboard cards
  const maindeckCards = useMemo(
    () => (analysisResult?.cards || []).filter((c) => !c.isSideboard),
    [analysisResult?.cards]
  )
  const sideboardCards = useMemo(
    () => (analysisResult?.cards || []).filter((c) => c.isSideboard),
    [analysisResult?.cards]
  )

  // Apply sideboard swaps only in post-board scope
  const effectiveCards = useMemo(() => {
    if (boardScope === 'main' || activeSwaps.length === 0) return maindeckCards
    const cardMap = new Map(maindeckCards.map((c) => [c.name, { ...c }]))

    for (const swap of activeSwaps) {
      const outCard = cardMap.get(swap.cardOut)
      if (outCard) {
        outCard.quantity = Math.max(0, (outCard.quantity || 1) - swap.quantity)
        if (outCard.quantity === 0) cardMap.delete(swap.cardOut)
      }
      const sbCard = sideboardCards.find((c) => c.name === swap.cardIn)
      const existing = cardMap.get(swap.cardIn)
      if (existing) {
        existing.quantity = (existing.quantity || 1) + swap.quantity
      } else if (sbCard) {
        cardMap.set(swap.cardIn, { ...sbCard, isSideboard: false, quantity: swap.quantity })
      }
    }
    return Array.from(cardMap.values())
  }, [maindeckCards, sideboardCards, activeSwaps, boardScope])

  const mainCount = useMemo(
    () => maindeckCards.reduce((s, c) => s + (c.quantity || 1), 0),
    [maindeckCards]
  )
  const sbCount = useMemo(
    () => sideboardCards.reduce((s, c) => s + (c.quantity || 1), 0),
    [sideboardCards]
  )

  // Command zone cards in effective board
  const commanderCards = useMemo(
    () => effectiveCards.filter((c) => c.isCommander && !c.isLand),
    [effectiveCards]
  )
  const commanderCopies = useMemo(
    () => commanderCards.reduce((s, c) => s + (c.quantity || 1), 0),
    [commanderCards]
  )
  const commanderNames = useMemo(() => commanderCards.map((c) => c.name), [commanderCards])

  const listSize = analysisResult?.totalCards || 60
  const librarySize = useMemo(() => {
    if (!detectedFamily) return listSize
    return effectiveLibrarySize(listSize, commanderCopies, detectedFamily)
  }, [listSize, commanderCopies, detectedFamily])

  // Filter out lands; commanders first, then format horizon, then CMC
  const nonLandCards = useMemo(() => {
    const spells = effectiveCards.filter((card) => card.isLand !== true)
    if (!detectedFamily) {
      return [...spells].sort((a, b) => {
        if (!!a.isCommander !== !!b.isCommander) return a.isCommander ? -1 : 1
        return (a.cmc ?? 0) - (b.cmc ?? 0)
      })
    }
    return [...spells].sort((a, b) => {
      if (!!a.isCommander !== !!b.isCommander) return a.isCommander ? -1 : 1
      const aIn = isInCastabilityHorizon(a.cmc ?? 0, detectedFamily) ? 0 : 1
      const bIn = isInCastabilityHorizon(b.cmc ?? 0, detectedFamily) ? 0 : 1
      if (aIn !== bIn) return aIn - bIn
      return (a.cmc ?? 0) - (b.cmc ?? 0)
    })
  }, [effectiveCards, detectedFamily])

  const horizon = detectedFamily ? castabilityHorizon(detectedFamily) : null
  const horizonCount = useMemo(() => {
    if (!detectedFamily) return 0
    return nonLandCards.filter((c) => isInCastabilityHorizon(c.cmc ?? 0, detectedFamily)).length
  }, [nonLandCards, detectedFamily])

  const singletonViolations = useMemo(() => {
    if (detectedFamily !== 'edh') return []
    return findSingletonViolations(effectiveCards)
  }, [detectedFamily, effectiveCards])

  const edhCaveat = useMemo(() => {
    if (detectedFamily !== 'edh') return null
    return commanderCaveats({
      commanderNames,
      librarySize,
      listSize,
    })
  }, [detectedFamily, commanderNames, librarySize, listSize])

  // Detect mana producers in the deck (sync seed/cache + async Scryfall fallback)
  const [producersInDeck, setProducersInDeck] = useState<ProducerInDeck[]>([])

  useEffect(() => {
    // Use effective board (main or post-board), not raw analysis list
    if (!effectiveCards.length) {
      setProducersInDeck([])
      return
    }

    // Phase 1: Sync lookup from seed/cache (instant)
    const syncProducers: ProducerInDeck[] = []
    const unknownCards: { name: string; quantity: number }[] = []

    for (const card of effectiveCards) {
      if (card.isLand) continue
      const cached = producerCacheService.get(card.name)
      if (cached) {
        syncProducers.push({ def: cached, copies: card.quantity || 1 })
      } else {
        unknownCards.push({ name: card.name, quantity: card.quantity || 1 })
      }
    }

    setProducersInDeck(syncProducers)

    // Phase 2: Async Scryfall lookup for cards not in seed/cache.
    // Audit fix M1 (2026-04-13): cleanup flag + Promise.all so that fast
    // deck-switching cannot leak stale producers into the new deck's state.
    let cancelled = false
    if (unknownCards.length > 0) {
      Promise.all(
        unknownCards.map((card) =>
          manaProducerService
            .getProducer(card.name)
            .then((def) => (def ? { def, copies: card.quantity } : null))
            .catch(() => null)
        )
      ).then((results) => {
        if (cancelled) return
        const fresh = results.filter((r): r is ProducerInDeck => r !== null)
        if (fresh.length > 0) {
          setProducersInDeck((prev) => [...prev, ...fresh])
        }
      })
    }
    return () => {
      cancelled = true
    }
  }, [effectiveCards])

  // v1.1: Extract unconditional multi-mana lands for probabilistic handling
  // Groups lands by their delta (bonus mana per land)
  // e.g., Ancient Tomb (δ=1), Bounce lands (δ=1)
  const unconditionalMultiMana = useMemo<UnconditionalMultiManaGroup | undefined>(() => {
    if (!effectiveCards.length) return undefined

    let totalCount = 0
    let totalDelta = 0

    for (const card of effectiveCards) {
      if (!card.isLand || !card.landMetadata) continue

      const producesAmount = card.landMetadata.producesAmount ?? 1
      if (producesAmount > 1) {
        const delta = producesAmount - 1
        const quantity = card.quantity || 1
        totalCount += quantity
        totalDelta += delta * quantity
      }
    }

    if (totalCount === 0) return undefined

    const avgDelta = totalDelta / totalCount

    return {
      count: totalCount,
      delta: avgDelta,
    }
  }, [effectiveCards])

  // Calculate extra colored sources available only for creature spells
  const creatureOnlyExtraSources = useMemo<Record<string, number>>(() => {
    const extra: Record<string, number> = {}
    if (!effectiveCards.length) return extra

    const deckColors = new Set<string>()
    for (const card of effectiveCards) {
      if (!card.isLand) {
        for (const c of card.colors) deckColors.add(c)
      }
    }

    const LAND_COLORS = ['W', 'U', 'B', 'R', 'G', 'C'] as const
    const isLandManaColor = (c: string): c is (typeof LAND_COLORS)[number] =>
      (LAND_COLORS as readonly string[]).includes(c)
    for (const card of effectiveCards) {
      if (!card.isLand || !card.landMetadata) continue
      if (card.landMetadata.producesAny && card.landMetadata.producesAnyForCreaturesOnly) {
        const qty = card.quantity || 1
        for (const color of deckColors) {
          if (isLandManaColor(color) && !card.landMetadata.produces.includes(color)) {
            extra[color] = (extra[color] || 0) + qty
          }
        }
      }
    }

    return extra
  }, [effectiveCards])

  // Build Card objects from DeckCard to pass as initialCardData (avoids N+1 Scryfall calls)
  const cardDataMap = useMemo(() => {
    const map = new Map<string, Card>()
    for (const card of effectiveCards) {
      if (card.isLand) continue
      map.set(card.name, {
        id: '',
        name: card.name,
        mana_cost: card.manaCost,
        cmc: card.cmc,
        type_line: '',
        colors: card.colors,
        color_identity: card.colors,
        set: '',
        set_name: '',
        rarity: '',
        legalities: {},
        layout: 'normal',
      })
    }
    return map
  }, [effectiveCards])

  return (
    <>
      <Typography
        variant="h6"
        gutterBottom
        sx={{
          fontSize: { xs: '1.1rem', sm: '1.25rem' },
          display: 'flex',
          alignItems: 'center',
          gap: 1,
        }}
      >
        <TimelineIcon fontSize="small" color="primary" aria-hidden />
        Castability Analysis
      </Typography>
      <Typography
        variant="body2"
        color="text.secondary"
        sx={{ mb: 2, display: { xs: 'none', sm: 'block' } }}
      >
        Real-time mana costs from Scryfall with probability calculations
      </Typography>
      <Typography
        variant="caption"
        color="text.secondary"
        sx={{ mb: 1.5, display: { xs: 'block', sm: 'none' } }}
        data-testid="castability-mobile-hint"
      >
        Each card shows on-curve cast % — scroll the list. Priority horizon spells are highlighted.
      </Typography>

      {/* Acceleration Settings Panel */}
      <AccelerationSettings
        producersInDeck={producersInDeck}
        deckSize={analysisResult?.totalCards || 60}
      />

      {detectedFamily && analysisResult && (
        <Alert severity="info" sx={{ mb: 2 }} data-testid="format-family-banner">
          <Typography variant="body2" fontWeight={600}>
            Detected:{' '}
            {detectedFamily === 'edh'
              ? 'Commander'
              : detectedFamily === 'limited'
                ? 'Limited'
                : 'Constructed'}{' '}
            —{' '}
            {landCountGuidance(
              detectedFamily,
              analysisResult.totalLands || 0,
              analysisResult.totalCards || 0
            )}
            {horizon ? ` · Priority horizon ${horizon.label}` : ''}
          </Typography>
          {horizon && (
            <Typography variant="caption" display="block" sx={{ mt: 0.5, opacity: 0.9 }}>
              {horizon.description}
              {horizonCount > 0
                ? ` ${horizonCount} spell line${horizonCount === 1 ? '' : 's'} in range listed first.`
                : ''}
            </Typography>
          )}
          {detectedFamily === 'edh' && edhCaveat && (
            <Typography
              variant="caption"
              display="block"
              sx={{ mt: 0.5, opacity: 0.9, fontStyle: 'italic' }}
              data-testid="edh-command-zone-note"
            >
              {edhCaveat.commandZone}{' '}
              <Box component="a" href="/guide#commander" sx={{ color: 'inherit' }}>
                Details in the Guide
              </Box>
              .
            </Typography>
          )}
          {singletonViolations.length > 0 && (
            <Typography
              variant="caption"
              display="block"
              sx={{ mt: 0.5, color: 'warning.dark' }}
              data-testid="singleton-violations"
            >
              Singleton heads-up: {singletonViolations.slice(0, 5).join(', ')}
              {singletonViolations.length > 5
                ? ` (+${singletonViolations.length - 5} more)`
                : ''}{' '}
              appear more than once (basics excluded).
            </Typography>
          )}
          <Typography variant="caption" display="block" sx={{ mt: 0.5, opacity: 0.9 }}>
            Format controls above set ramp/removal model. Change Format anytime; click the Auto chip
            if you locked a format and want detection again.
          </Typography>
        </Alert>
      )}

      {/* P1-8: Main vs post-board scope */}
      {sideboardCards.length > 0 && (
        <Paper
          sx={{ p: 1.5, mb: 2, border: 1, borderColor: 'divider' }}
          data-testid="sideboard-scope"
        >
          <Box
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 1.5,
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Box>
              <Typography variant="subtitle2" fontWeight={700}>
                Board analyzed
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Sideboard auto-detected: {mainCount} main · {sbCount} side
              </Typography>
            </Box>
            <ToggleButtonGroup
              exclusive
              size="small"
              value={boardScope}
              onChange={(_, v) => {
                if (v) {
                  setBoardScope(v)
                  if (v === 'main') setActiveSwaps([])
                }
              }}
              aria-label="Main deck or post-board analysis"
            >
              <ToggleButton value="main" sx={{ textTransform: 'none' }}>
                Main only
              </ToggleButton>
              <ToggleButton value="postboard" sx={{ textTransform: 'none' }}>
                Post-board
              </ToggleButton>
            </ToggleButtonGroup>
          </Box>
          {boardScope === 'postboard' && (
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
              Define IN/OUT swaps below. Castability uses the post-board 60 (or 100) after swaps.
            </Typography>
          )}
          {boardScope === 'main' && (
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
              Showing maindeck only — sideboard cards are ignored for odds.
            </Typography>
          )}
        </Paper>
      )}

      {/* Ramp detection banner */}
      {producersInDeck.length > 0 && (
        <Paper
          sx={{
            mb: 2,
            p: 1.5,
            bgcolor: 'success.main',
            display: 'flex',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 1,
            borderRadius: 1,
            '& .MuiTypography-root': {
              color: '#fff !important',
            },
          }}
        >
          <Typography variant="body2" fontWeight="bold">
            {producersInDeck.reduce((sum, p) => sum + p.copies, 0)} mana rocks/dorks detected
          </Typography>
          <Typography variant="caption" sx={{ opacity: 0.9 }}>
            — {producersInDeck.map((p) => `${p.copies}x ${p.def.name}`).join(', ')}. Castability
            includes ramp acceleration.
          </Typography>
        </Paper>
      )}

      {nonLandCards.length > 0 ? (
        <Box>
          {/* P1-1: permanent legend ABOVE the % wall (sticky) — Leo/Sarah must see
              Perfect vs Realistic without scrolling past every spell. */}
          <Box
            data-testid="castability-legend"
            sx={{
              mb: 1.5,
              p: { xs: 1.25, sm: 1.5 },
              bgcolor: 'action.hover',
              borderRadius: 1,
              border: '1px solid',
              borderColor: 'divider',
              position: 'sticky',
              top: { xs: 0, md: 8 },
              zIndex: 2,
              backdropFilter: 'blur(6px)',
            }}
          >
            <Typography
              variant="body2"
              color="text.primary"
              sx={{
                fontSize: { xs: '0.8rem', sm: '0.875rem' },
                lineHeight: 1.5,
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                alignItems: { xs: 'flex-start', sm: 'center' },
                flexWrap: 'wrap',
                gap: { xs: 0.5, sm: 1 },
              }}
            >
              <Box
                component="span"
                sx={{ display: 'inline-flex', alignItems: 'center', flexWrap: 'wrap' }}
              >
                <strong>
                  <Term id="best-case">Perfect drops</Term>
                </strong>
                &nbsp;= right colors if lands on curve
              </Box>
              <Box
                component="span"
                sx={{ display: { xs: 'none', sm: 'inline' }, color: 'text.secondary' }}
                aria-hidden
              >
                ·
              </Box>
              <Box
                component="span"
                sx={{ display: 'inline-flex', alignItems: 'center', flexWrap: 'wrap' }}
              >
                <strong>
                  <Term id="realistic">Realistic</Term>
                </strong>
                &nbsp;= what to optimize (mana screw
                {producersInDeck.length > 0 ? ' + rocks/dorks' : ''})
              </Box>
              <Tooltip
                title="Perfect drops: chance of the right colors if you always hit land drops on curve. Realistic: on-curve cast chance including mana screw (and rocks/dorks when acceleration is on). Perfect drops is always ≥ Realistic (same model). Focus on Realistic."
                arrow
                placement="top"
              >
                <IconButton
                  size="small"
                  sx={{ p: 0.25, ml: { xs: 0, sm: 0.25 } }}
                  component="a"
                  href="/mathematics#probabilities"
                  aria-label="Explain Perfect drops vs Realistic probabilities"
                >
                  <HelpOutlineIcon sx={{ fontSize: 16, opacity: 0.6 }} />
                </IconButton>
              </Tooltip>
            </Typography>
          </Box>

          <Grid container spacing={1} sx={{ mb: 2, display: { xs: 'none', md: 'flex' } }}>
            <Grid item md={4}>
              <Typography variant="subtitle2" color="text.secondary">
                Card
              </Typography>
            </Grid>
            <Grid item md={2}>
              <Typography variant="subtitle2" color="text.secondary">
                Mana Cost
              </Typography>
            </Grid>
            <Grid item md={6}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Typography
                  variant="subtitle2"
                  component="a"
                  href="/mathematics#probabilities"
                  sx={{
                    color: 'text.secondary',
                    textDecoration: 'none',
                    cursor: 'pointer',
                    '&:hover': {
                      textDecoration: 'underline',
                      color: 'primary.main',
                    },
                  }}
                >
                  Probabilities
                </Typography>
                <Tooltip
                  title="Realistic = on-curve cast chance (land count + colors [+ ramp]). Perfect drops = right colors if you hit every land drop (same model). Click Mathematics for the full explanation."
                  arrow
                  placement="top"
                >
                  <IconButton
                    size="small"
                    sx={{ p: 0 }}
                    component="a"
                    href="/mathematics#probabilities"
                  >
                    <HelpOutlineIcon sx={{ fontSize: 16, opacity: 0.5 }} />
                  </IconButton>
                </Tooltip>
              </Box>
            </Grid>
          </Grid>

          {nonLandCards.map((card, index) => (
            <ManaCostRow
              key={`${card.name}-${index}`}
              cardName={card.name}
              quantity={card.quantity || 1}
              deckSources={analysisResult?.colorDistribution}
              totalLands={analysisResult?.totalLands || 0}
              // Commander sits in the command zone: library size excludes commander copies
              // for all castability rows (including the commander row — mana-only odds).
              totalCards={librarySize}
              producers={producersInDeck}
              accelContext={accelContext}
              showAcceleration={settings.showAcceleration && producersInDeck.length > 0}
              unconditionalMultiMana={unconditionalMultiMana}
              initialCardData={cardDataMap.get(card.name) ?? null}
              isCreature={card.isCreature}
              creatureOnlyExtraSources={creatureOnlyExtraSources}
              isCommander={!!card.isCommander}
              inFormatHorizon={
                !!card.isCommander ||
                (!!detectedFamily && isInCastabilityHorizon(card.cmc ?? 0, detectedFamily))
              }
              horizonLabel={card.isCommander ? 'Command zone' : horizon?.label}
            />
          ))}

          {/* Sideboard swap editor — only when analyzing post-board */}
          {sideboardCards.length > 0 && boardScope === 'postboard' && (
            <SideboardSwapEditor
              maindeckCards={maindeckCards}
              sideboardCards={sideboardCards}
              onSwapsChange={setActiveSwaps}
            />
          )}
          {boardScope === 'postboard' && activeSwaps.length > 0 && (
            <Box sx={{ mt: 1, p: 1.5, bgcolor: 'info.main', borderRadius: 1, opacity: 0.9 }}>
              <Typography variant="caption" color="info.contrastText" fontWeight={600}>
                Post-board castability — {activeSwaps.reduce((s, sw) => s + sw.quantity, 0)} card(s)
                swapped in from sideboard
              </Typography>
            </Box>
          )}
          {boardScope === 'postboard' && activeSwaps.length === 0 && sideboardCards.length > 0 && (
            <Chip
              size="small"
              sx={{ mt: 1 }}
              label="Post-board mode: add swaps below, or odds stay maindeck-identical"
              variant="outlined"
            />
          )}
        </Box>
      ) : (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="body1" color="text.secondary">
            No deck list available. Please enter a deck list and analyze it first.
          </Typography>
        </Box>
      )}

      {/* Footer echo kept short — primary legend is sticky at top (P1-1) */}
      <Box sx={{ mt: 2, px: 0.5 }}>
        <Typography variant="caption" color="text.secondary">
          Tip: optimize <strong>Realistic</strong> first — Perfect drops is always ≥ Realistic (same
          model).
        </Typography>
      </Box>
    </>
  )
})
