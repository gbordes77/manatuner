import HelpOutlineIcon from '@mui/icons-material/HelpOutline'
import TimelineIcon from '@mui/icons-material/Timeline'
import {
  Alert,
  Box,
  Button,
  Chip,
  Grid,
  IconButton,
  Paper,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
  Typography,
} from '@mui/material'
import React, { lazy, memo, Suspense, useEffect, useMemo, useState } from 'react'
import { useAcceleration } from '../../contexts/accelerationState'
import { AnalysisResult } from '../../services/deckAnalyzer'
import { manaProducerService, producerCacheService } from '../../services/manaProducerService'
import type { Card, ManaColor } from '../../types'
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
import { AccelerationSettings } from './AccelerationSettings'
import { SideboardSwapEditor, type SideboardSwap } from './SideboardSwapEditor'

interface CastabilityTabProps {
  analysisResult: AnalysisResult
}

const PaymentPolicyPanel = lazy(() => import('./PaymentPolicyPanel'))

type BoardScope = 'main' | 'postboard'

export const CastabilityTab: React.FC<CastabilityTabProps> = memo(({ analysisResult }) => {
  // Get acceleration context
  const { settings, accelContext, detectedFamily, suggestFromDeckSize } = useAcceleration()

  // P1-8: board scope — main only vs post-board (swaps)
  const [showPolicy, setShowPolicy] = useState(false)
  const [probabilityModel, setProbabilityModel] = useState<'estimate' | 'exact'>('estimate')
  // Goldfish is a calculation assumption, not a mutation of the user's estimate settings.
  const probabilityContext = useMemo(
    () =>
      probabilityModel === 'exact'
        ? { ...accelContext, removalRate: 0, defaultRockSurvival: 1 }
        : accelContext,
    [accelContext, probabilityModel]
  )
  const [boardScope, setBoardScope] = useState<BoardScope>('main')
  const [activeSwaps, setActiveSwaps] = useState<SideboardSwap[]>([])

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
  const mainLands = useMemo(
    () => maindeckCards.filter((c) => c.isLand).reduce((s, c) => s + (c.quantity || 1), 0),
    [maindeckCards]
  )
  // Board size for odds / banner: main (or post-board after swaps), never main+side.
  const effectiveDeckSize = useMemo(
    () => effectiveCards.reduce((s, c) => s + (c.quantity || 1), 0),
    [effectiveCards]
  )
  const effectiveLands = useMemo(
    () => effectiveCards.filter((c) => c.isLand).reduce((s, c) => s + (c.quantity || 1), 0),
    [effectiveCards]
  )

  const effectiveSources = useMemo(
    () =>
      Object.fromEntries(
        ['W', 'U', 'B', 'R', 'G', 'C'].map((color) => [
          color,
          effectiveCards
            .filter(
              (card) =>
                card.isLand && !card.isCommander && card.producedMana?.includes(color as ManaColor)
            )
            .reduce((sum, card) => sum + (card.quantity ?? 1), 0),
        ])
      ),
    [effectiveCards]
  )

  // P1-9: auto format from main deck size (not main+side = 75)
  useEffect(() => {
    if (mainCount > 0) suggestFromDeckSize(mainCount)
  }, [mainCount, suggestFromDeckSize])

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

  const listSize = effectiveDeckSize || mainCount || 60
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

  const policyCards = useMemo(
    () =>
      effectiveCards.map((card) => ({
        ...card,
        producesMana: card.producesMana || producersInDeck.some((p) => p.def.name === card.name),
      })),
    [effectiveCards, producersInDeck]
  )

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

  const physicalLands = useMemo(() => {
    // An unresolved library card might itself be a mana source.
    if (effectiveCards.some((card) => !card.isCommander && card.resolved !== true)) return null
    const lands = effectiveCards.filter((card) => card.isLand && !card.isCommander)
    if (lands.some((card) => !card.landMetadata || card.resolved !== true)) return null
    return lands.flatMap((card) =>
      Array.from({ length: card.quantity ?? 1 }, () => card.landMetadata!)
    )
  }, [effectiveCards])

  // Build Card objects from DeckCard to pass as initialCardData (avoids N+1 Scryfall calls)
  const cardDataMap = useMemo(() => {
    const map = new Map<string, Card>()
    for (const card of effectiveCards) {
      if (card.isLand) continue
      map.set(card.name, {
        id: '',
        name: card.name,
        mana_cost: card.resolved === true ? card.manaCost : '',
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

      <Button
        variant="outlined"
        onClick={() => setShowPolicy((v) => !v)}
        aria-expanded={showPolicy}
      >
        Searches & special mana — policy model
      </Button>
      {showPolicy && (
        <Suspense fallback={<Typography role="status">Loading policy model…</Typography>}>
          <PaymentPolicyPanel cards={policyCards} />
        </Suspense>
      )}
      {/* Acceleration Settings Panel */}
      <AccelerationSettings producersInDeck={producersInDeck} deckSize={listSize || 60} />

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
              effectiveLands || mainLands || 0,
              listSize || mainCount || 0
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

      <ToggleButtonGroup
        exclusive
        value={probabilityModel}
        aria-label="Probability model"
        onChange={(_, value: 'estimate' | 'exact' | null) => {
          if (value) setProbabilityModel(value)
        }}
        sx={{ mb: 2 }}
      >
        <ToggleButton value="estimate">Mana estimates</ToggleButton>
        <ToggleButton value="exact">Exact goldfish potential</ToggleButton>
      </ToggleButtonGroup>
      <Alert severity="warning" sx={{ mb: 2 }}>
        {probabilityModel === 'estimate'
          ? 'Source-count estimates approximate mana availability with the selected ramp and removal settings. They do not model every legal payment sequence or source overlap exactly. Perfect land drops conditions on having enough lands. Neither number includes mulligans or drawing the target spell.'
          : 'Exact potential within the supported goldfish model: at least one legal mana sequence. Choices may use the complete drawn history, so this is an upper bound for play without foresight. No mulligans or chance of drawing the target spell. This mode applies 0% removal and 100% ramp survival, regardless of the estimate settings above. Unsupported cards or calculations exceeding the budget still show no percentage.'}
      </Alert>
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
              {probabilityModel === 'estimate'
                ? 'Mana availability: source-count estimates, not exact payment probabilities.'
                : 'Potential castability: one legal sequence must pay every cost using distinct physical sources.'}
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
                  title={
                    probabilityModel === 'estimate'
                      ? 'Heuristic source-count estimates; no mulligan or drawing the target spell.'
                      : 'Exact potential castability in the supported goldfish model; not a mulligan-adjusted win probability.'
                  }
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
              probabilityModel={probabilityModel}
              cardName={card.name}
              quantity={card.quantity || 1}
              physicalLands={physicalLands}
              deckSources={effectiveSources}
              totalLands={physicalLands?.length ?? effectiveLands}
              // Commander sits in the command zone: library size excludes commander copies
              // for all castability rows (including the commander row — mana-only odds).
              // listSize is main (or post-board), never main+side.
              totalCards={librarySize}
              producers={producersInDeck}
              accelContext={probabilityContext}
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
          {probabilityModel === 'estimate'
            ? 'Source-count estimates use the selected board. Missing metadata and costs outside this model remain unavailable.'
            : 'Unsupported cards or rules are explicitly reported; no estimated fallback is displayed in these rows.'}
        </Typography>
      </Box>
    </>
  )
})
