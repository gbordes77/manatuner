import AnalyticsIcon from '@mui/icons-material/Analytics'
import AssessmentIcon from '@mui/icons-material/Assessment'
import CasinoIcon from '@mui/icons-material/Casino'
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined'
import DownloadIcon from '@mui/icons-material/Download'
import FunctionsIcon from '@mui/icons-material/Functions'
import ShowChartIcon from '@mui/icons-material/ShowChart'
import TerrainIcon from '@mui/icons-material/Terrain'
import {
  Alert,
  Box,
  Chip,
  Container,
  Grid,
  Paper,
  Snackbar,
  Tab,
  Tabs,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material'
import ShareIcon from '@mui/icons-material/Share'
import React, { Suspense, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AnalyzerSkeleton } from '../components/analyzer/AnalyzerSkeleton'
import { DeckInputSection } from '../components/analyzer/DeckInputSection'
import { computeColorDeltas, summarizeColorDeltas } from '../components/analyzer/KarstenTargetDelta'
import { QuickVerdict } from '../components/analyzer/QuickVerdict'
import { TabPanel } from '../components/analyzer/TabPanel'
import { ErrorBoundary } from '../components/common/ErrorBoundary'
import { FloatingManaSymbols } from '../components/common/FloatingManaSymbols'
import { SEO } from '../components/common/SEO'

// Audit fix perf (2026-04-13): lazy-load PrivacySettings to drop ~14 KB gzip
// from the first AnalyzerPage paint (DOMPurify ships inside this component).
const PrivacySettings = React.lazy(() => import('../components/PrivacySettings'))

// Lazy-loaded tabs (only loaded when selected)
const CastabilityTab = React.lazy(() =>
  import('../components/analyzer/CastabilityTab').then((m) => ({ default: m.CastabilityTab }))
)
const MulliganTab = React.lazy(() =>
  import('../components/analyzer/MulliganTab').then((m) => ({ default: m.MulliganTab }))
)
const AnalysisTab = React.lazy(() =>
  import('../components/analyzer/AnalysisTab').then((m) => ({ default: m.AnalysisTab }))
)
const ManabaseFullTab = React.lazy(() =>
  import('../components/analyzer/ManabaseFullTab').then((m) => ({ default: m.ManabaseFullTab }))
)
const ManaBlueprint = React.lazy(() => import('../components/export/ManaBlueprint'))
import { PrivacyStorage } from '../lib/privacy'
import { DeckAnalyzer } from '../services/deckAnalyzer'
import { AppDispatch, RootState } from '../store'
import {
  clearAnalyzer,
  hideSnackbar,
  setActiveTab,
  setAnalysisResult,
  setDeckList,
  setDeckName,
  setIsAnalyzing,
  setIsDeckMinimized,
  showSnackbar,
} from '../store/slices/analyzerSlice'
import { useAcceleration } from '../contexts/AccelerationContext'
import { detectDeckFormatFamily, formatFamilyLabel, landCountGuidance } from '../utils/deckFormat'
import { buildShareUrl, parseShareParams } from '../utils/urlCodec'
import { SAMPLE_DECKS } from '../data/sampleDecks'
// Lazy-load Onboarding (includes react-joyride ~50KB)
const Onboarding = React.lazy(() => import('../components/Onboarding'))

// Default fallback for ?sample=1 (back-compat) and the main CTA from home.
const SAMPLE_DECK = SAMPLE_DECKS.midrange.list

const AnalyzerPage: React.FC = () => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const isSmallMobile = useMediaQuery('(max-width:375px)')

  // Redux state
  const dispatch = useDispatch<AppDispatch>()
  const { deckList, deckName, analysisResult, isAnalyzing, isDeckMinimized, activeTab, snackbar } =
    useSelector((state: RootState) => state.analyzer)

  // Commander preset state — set when arriving via /analyzer?format=commander
  // (the CTA from the Library's Commander Pod track). Drives a persistent
  // info banner so Thibault sees the preset is actually active, and auto-
  // loads the Atraxa EDH sample if no deck is in state yet.
  const [commanderPreset, setCommanderPreset] = useState(false)
  const { suggestFromDeckSize, unlockFormatAuto } = useAcceleration()

  // Banner flag in sessionStorage survives React 18 Strict Mode remount after
  // replaceState clears ?sample=edh / ?format=commander. Deck list lives in
  // Redux; only the local `commanderPreset` boolean needs this bridge.
  const COMMANDER_PRESET_KEY = 'manatuner-commander-preset'

  const clearCommanderPresetFlag = useCallback(() => {
    try {
      sessionStorage.removeItem(COMMANDER_PRESET_KEY)
    } catch {
      /* private mode */
    }
  }, [])

  const markCommanderPreset = useCallback(() => {
    try {
      sessionStorage.setItem(COMMANDER_PRESET_KEY, '1')
    } catch {
      /* private mode */
    }
    setCommanderPreset(true)
  }, [])

  // URL share: hydrate deck from URL params on mount (once).
  // Also handles ?sample=1 shortcut from HomePage to auto-load the sample
  // deck (Léo friction fix — no decklist-pasting required on first visit).
  const hydratedRef = useRef(false)
  useEffect(() => {
    // Always restore banner after Strict Mode remount (even if hydrate already ran
    // on the previous mount instance — that instance's local state is gone).
    try {
      if (sessionStorage.getItem(COMMANDER_PRESET_KEY) === '1') {
        setCommanderPreset(true)
      }
    } catch {
      /* private mode */
    }

    if (hydratedRef.current) return
    hydratedRef.current = true

    const params = new URLSearchParams(window.location.search)

    // ?format=commander → Library → Analyzer handoff. Auto-load the Atraxa
    // EDH sample and flag the session as "Commander preset active" so the
    // banner sticks around until a different sample is chosen. This honors
    // the contract Thibault expects when clicking the Library CTA: the
    // Analyzer DOES know it's analyzing Commander, not a 60-card default.
    const formatParam = params.get('format')
    if (formatParam === 'commander') {
      markCommanderPreset()
      unlockFormatAuto()
      suggestFromDeckSize(100)
      const sample = SAMPLE_DECKS.edh
      if (sample) {
        dispatch(setDeckList(sample.list))
        dispatch(setDeckName(sample.name))
      }
      window.history.replaceState({}, '', '/analyzer')
      return
    }

    // ?sample=1 → default sample (back-compat with HomePage link).
    // ?sample=aggro|control|midrange|edh|limited → specific archetype sample.
    const sampleParam = params.get('sample')
    if (sampleParam) {
      const sample = sampleParam === '1' ? SAMPLE_DECKS.midrange : SAMPLE_DECKS[sampleParam]
      if (sample) {
        dispatch(setDeckList(sample.list))
        dispatch(setDeckName(sample.name))
        unlockFormatAuto()
        if (sampleParam === 'edh') {
          markCommanderPreset()
          suggestFromDeckSize(100)
        } else if (sampleParam === 'limited') {
          clearCommanderPresetFlag()
          setCommanderPreset(false)
          suggestFromDeckSize(40)
        } else {
          clearCommanderPresetFlag()
          setCommanderPreset(false)
          suggestFromDeckSize(60)
        }
        window.history.replaceState({}, '', '/analyzer')
        return
      }
    }

    const shared = parseShareParams()
    if (shared && shared.deckList) {
      dispatch(setDeckList(shared.deckList))
      if (shared.deckName) dispatch(setDeckName(shared.deckName))
      if (shared.tab > 0) dispatch(setActiveTab(shared.tab))
      window.history.replaceState({}, '', '/analyzer')
    }
  }, [
    dispatch,
    unlockFormatAuto,
    suggestFromDeckSize,
    markCommanderPreset,
    clearCommanderPresetFlag,
  ])

  const handleShare = useCallback(() => {
    if (!deckList.trim()) return
    const url = buildShareUrl({ deckList, deckName, tab: activeTab })
    if (!url) return
    // P1-2: explicit Discord hint so Share isn't silent clipboard (persona Partage)
    const shareToastMessage = 'Share link copied — paste in Discord'
    navigator.clipboard.writeText(url).then(
      () => {
        dispatch(showSnackbar({ message: shareToastMessage, severity: 'success' }))
      },
      () => {
        // Clipboard may fail in insecure contexts; still surface the URL intent
        dispatch(
          showSnackbar({
            message: 'Could not copy automatically — use the address bar to share',
            severity: 'warning',
          })
        )
      }
    )
  }, [deckList, deckName, activeTab, dispatch])

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    dispatch(setActiveTab(newValue))
  }

  // Karsten verdict rollup for the Manabase tab badge — surfaces color
  // shortfalls on the tab label itself so Sarah doesn't have to click
  // Manabase and scroll to discover she's short on a color.
  const manabaseVerdict = useMemo(() => {
    if (!analysisResult) return null
    const deltas = computeColorDeltas(analysisResult)
    if (deltas.length === 0) return null
    return summarizeColorDeltas(deltas)
  }, [analysisResult])

  // Memoized analyze handler to prevent unnecessary re-renders
  const handleAnalyze = useCallback(async () => {
    if (!deckList.trim()) return

    dispatch(setIsAnalyzing(true))

    try {
      const result = await DeckAnalyzer.analyzeDeck(deckList)
      // P1-9: auto Format from main deck size (exclude sideboard so 60+15 ≠ 75)
      const mainSize =
        result?.cards?.filter((c) => !c.isSideboard).reduce((s, c) => s + (c.quantity || 1), 0) ||
        result?.totalCards
      if (mainSize && mainSize > 0) {
        suggestFromDeckSize(mainSize)
        if (detectDeckFormatFamily(mainSize) === 'edh') {
          markCommanderPreset()
        }
      }
      dispatch(setAnalysisResult(result))

      // Auto-minimize deck on mobile to show results
      if (isMobile) {
        dispatch(setIsDeckMinimized(true))
      }

      // P2-11: move focus to verdict for keyboard / SR users after analysis
      requestAnimationFrame(() => {
        const el = document.getElementById('quick-verdict')
        if (!el) return
        if (typeof el.focus === 'function') {
          el.focus({ preventScroll: false })
        }
        if (typeof el.scrollIntoView === 'function') {
          el.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
        }
      })

      // Auto-save to PrivacyStorage
      try {
        // Generate a descriptive name from colors if user didn't set one
        const colorNames: Record<string, string> = {
          W: 'White',
          U: 'Blue',
          B: 'Black',
          R: 'Red',
          G: 'Green',
        }
        // WUBRG only — never count colorless as a deck color (P0-EDH-1)
        const activeColors = result.colorDistribution
          ? (['W', 'U', 'B', 'R', 'G'] as const)
              .filter((k) => (result.colorDistribution[k] || 0) > 0)
              .map((k) => colorNames[k] || k)
          : []
        const colorLabel =
          activeColors.length > 0 ? `${activeColors.length}C ${activeColors.join('/')}` : 'Deck'
        const saveName = deckName.trim() || `${colorLabel} - ${new Date().toLocaleDateString()}`
        PrivacyStorage.saveAnalysis({
          deckName: saveName,
          deckList,
          analysis: result,
          consistency: result.consistency,
        })
      } catch (saveErr) {
        // Auto-save failed (most likely quota exceeded). Warn the user
        // — silently losing history is worse than a polite message.
        const msg =
          saveErr instanceof Error && saveErr.name === 'QuotaExceededError'
            ? 'Browser storage full. Analysis shown but not saved to history. Clear old analyses in Privacy Settings.'
            : 'Could not save analysis to local history.'
        dispatch(showSnackbar({ message: msg, severity: 'warning' }))
      }
    } catch (error) {
      dispatch(setAnalysisResult(null))
      // Surface a more helpful error message when possible.
      const rawMessage = error instanceof Error ? error.message : ''
      const userMessage = rawMessage
        ? `Failed to analyze deck: ${rawMessage}. Check the format and try again.`
        : 'Failed to analyze deck. Please check the format and try again.'
      dispatch(
        showSnackbar({
          message: userMessage,
          severity: 'error',
        })
      )
    } finally {
      dispatch(setIsAnalyzing(false))
    }
  }, [deckList, deckName, dispatch, suggestFromDeckSize, markCommanderPreset, isMobile])

  const handleClear = useCallback(() => {
    setCommanderPreset(false)
    clearCommanderPresetFlag()
    dispatch(clearAnalyzer())
    dispatch(
      showSnackbar({
        message: 'Interface cleared. Ready for a new deck analysis.',
        severity: 'info',
      })
    )
  }, [dispatch, clearCommanderPresetFlag])

  const handleLoadSample = useCallback(() => {
    // Midrange 60-card sample — leave Commander mode if it was active
    setCommanderPreset(false)
    clearCommanderPresetFlag()
    dispatch(setDeckList(SAMPLE_DECK))
    dispatch(setDeckName(SAMPLE_DECKS.midrange.name))
  }, [dispatch, clearCommanderPresetFlag])

  return (
    <>
      <SEO
        title="MTG Deck Analyzer — Paste Deck, See Castability | ManaTuner"
        description="Free MTG deck analyzer. Paste your decklist (MTGO, MTGA, Moxfield) and get exact hypergeometric castability probabilities per spell — including mana rocks and dorks. No signup, results in 3 seconds."
        path="/analyzer"
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'SoftwareApplication',
          '@id': 'https://www.manatuner.app/analyzer#software',
          name: 'ManaTuner Deck Analyzer',
          url: 'https://www.manatuner.app/analyzer',
          applicationCategory: 'UtilityApplication',
          applicationSubCategory: 'Mana Base Analyzer',
          operatingSystem: 'Any (browser-based)',
          browserRequirements: 'Requires a modern browser with JavaScript enabled',
          description:
            'Interactive MTG deck analyzer. Paste any decklist (MTGO, MTGA, Moxfield) and get exact hypergeometric castability probabilities per spell, turn by turn, including mana rocks and dorks.',
          featureList: [
            'Castability analysis with P1/P2 probabilities',
            'Post-board sideboard swap editor',
            'Monte Carlo mulligan simulation (10,000 hands)',
            'Turn-by-turn color requirement probabilities',
            'Export blueprint as PNG, PDF, or JSON',
          ],
          isPartOf: { '@id': 'https://www.manatuner.app/#software' },
          offers: {
            '@type': 'Offer',
            price: '0',
            priceCurrency: 'USD',
            availability: 'https://schema.org/InStock',
          },
          author: { '@id': 'https://www.manatuner.app/#author' },
          publisher: { '@id': 'https://www.manatuner.app/#organization' },
          isAccessibleForFree: true,
          license: 'https://opensource.org/licenses/MIT',
        }}
      />
      <React.Suspense fallback={null}>
        <Onboarding hasAnalysisResult={!!analysisResult} />
      </React.Suspense>
      <Container
        maxWidth="xl"
        sx={{
          py: isSmallMobile ? 1 : isMobile ? 2 : 4,
          px: isSmallMobile ? 0.5 : isMobile ? 1 : 3,
          width: '100%',
          maxWidth: '100% !important',
          overflowX: 'hidden',
          boxSizing: 'border-box',
          margin: '0 auto',
          position: 'relative',
        }}
      >
        {/* Floating mana symbols background */}
        <FloatingManaSymbols />

        {/* Commander preset banner — shown whenever the user arrived via
            /analyzer?format=commander (Library → Analyzer handoff) OR loaded
            the ?sample=edh deck. Tells Thibault the Analyzer knows it's
            looking at a Commander deck: n=100, singleton-aware, EDH-widened
            tier bands downstream in QuickVerdict. Can be dismissed with the
            Clear button. */}
        {commanderPreset && (
          <Alert
            severity="info"
            onClose={() => {
              setCommanderPreset(false)
              clearCommanderPresetFlag()
            }}
            sx={{
              mb: 2,
              borderWidth: 1.5,
              borderRadius: 2,
              '& .MuiAlert-message': { width: '100%' },
            }}
            data-testid="commander-preset-banner"
          >
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              Commander mode — 100-card math, priority horizon T4–T8, Karsten targets scaled N/60,
              command zone detection, EDH tier bands.
            </Typography>
            <Typography variant="caption" sx={{ display: 'block', mt: 0.5, opacity: 0.85 }}>
              Paste your own 100-card list anytime (Atraxa sample is only a starter). Castability
              pins the commander first and prioritizes CMC 4–8; library size excludes the commander
              for other spells when detected (*CMDR*, Commander section, or first non-land).
              Manabase uses deck-size-scaled Karsten sources. Rule 0 / multiplayer politics are out
              of scope.{' '}
              <Box component="a" href="/guide#commander" sx={{ color: 'inherit', fontWeight: 600 }}>
                Guide: Commander
              </Box>
            </Typography>
          </Alert>
        )}
        {/* Header - Hidden when analysis is displayed */}
        {!analysisResult && (
          <Box sx={{ mb: isMobile ? 3 : 4, textAlign: 'center' }}>
            <Typography
              variant={isMobile ? 'h4' : 'h3'}
              component="h1"
              gutterBottom
              sx={{
                fontWeight: 800,
                fontSize: isMobile ? '1.8rem' : '2.5rem',
                background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 50%, #9c27b0 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 1,
              }}
            >
              <AnalyticsIcon
                sx={{
                  fontSize: isMobile ? 32 : 44,
                  color: '#1976d2',
                }}
              />
              ManaTuner
            </Typography>
            <Typography
              variant={isMobile ? 'body1' : 'h6'}
              color="text.secondary"
              sx={{
                fontSize: isMobile ? '0.95rem' : '1.1rem',
                px: isMobile ? 1 : 0,
                maxWidth: 600,
                mx: 'auto',
                mb: 2,
              }}
            >
              Analyze your manabase with proven mathematical precision
            </Typography>

            {/* Feature Tags */}
            <Box
              sx={{
                display: 'flex',
                gap: 1,
                justifyContent: 'center',
                flexWrap: 'wrap',
              }}
            >
              <Chip
                icon={<ShowChartIcon />}
                label="Castability"
                size="small"
                sx={{
                  bgcolor: '#e3f2fd',
                  color: '#1565c0',
                  fontWeight: 600,
                  '& .MuiChip-icon': { color: '#1565c0' },
                }}
              />
              <Chip
                icon={<CasinoIcon />}
                label="Mulligan Sim"
                size="small"
                sx={{
                  bgcolor: '#f3e5f5',
                  color: '#7b1fa2',
                  fontWeight: 600,
                  '& .MuiChip-icon': { color: '#7b1fa2' },
                }}
              />
              <Chip
                icon={<FunctionsIcon />}
                label="Karsten Math"
                size="small"
                sx={{
                  bgcolor: '#fff3e0',
                  color: '#e65100',
                  fontWeight: 600,
                  '& .MuiChip-icon': { color: '#e65100' },
                }}
              />
            </Box>
          </Box>
        )}

        {/* Compact deck bar when minimized */}
        {analysisResult && isDeckMinimized && (
          <Paper
            sx={{
              p: 2,
              mb: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              borderRadius: 3,
              border: '2px dashed',
              borderColor: 'primary.light',
              background: 'linear-gradient(135deg, #fafafa 0%, #f5f5f5 100%)',
              '&:hover': {
                boxShadow: '0 8px 24px rgba(25, 118, 210, 0.15)',
                backgroundColor: '#e3f2fd',
                borderColor: 'primary.main',
                transform: 'translateY(-2px)',
              },
            }}
            onClick={() => dispatch(setIsDeckMinimized(false))}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: '50%',
                  bgcolor: '#e3f2fd',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <DescriptionOutlinedIcon color="primary" />
              </Box>
              <Box>
                <Typography variant="body1" fontWeight={700}>
                  Your Deck
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {analysisResult.totalCards} cards • {analysisResult.totalLands} lands
                </Typography>
              </Box>
            </Box>

            {/* Center instruction text */}
            <Box sx={{ display: { xs: 'none', md: 'block' }, textAlign: 'center', flex: 1 }}>
              <Typography variant="body1" color="primary.main" fontWeight={500}>
                Click to edit your deck or start a new analysis
              </Typography>
            </Box>

            <Chip
              label="✏️ Edit Deck"
              size="small"
              sx={{
                bgcolor: '#1976d2',
                color: 'white',
                fontWeight: 600,
                '&:hover': { bgcolor: '#1565c0' },
              }}
            />
          </Paper>
        )}

        <Grid
          container
          spacing={isSmallMobile ? 1 : isMobile ? 2 : 4}
          sx={{
            width: '100%',
            maxWidth: '100%',
            margin: 0,
            overflowX: 'hidden',
            boxSizing: 'border-box',
            '& .MuiGrid-item': {
              paddingLeft: isSmallMobile ? '4px !important' : undefined,
              paddingTop: isSmallMobile ? '4px !important' : undefined,
              maxWidth: '100%',
              boxSizing: 'border-box',
            },
          }}
        >
          {/* Input Section - Hidden when minimized */}
          {!(analysisResult && isDeckMinimized) && (
            <Grid item xs={12} lg={isMobile ? 12 : 6}>
              <DeckInputSection
                deckList={deckList}
                deckName={deckName}
                setDeckList={(value: string) => dispatch(setDeckList(value))}
                setDeckName={(value: string) => dispatch(setDeckName(value))}
                isAnalyzing={isAnalyzing}
                analysisResult={analysisResult}
                isDeckMinimized={isDeckMinimized}
                setIsDeckMinimized={(value: boolean) => dispatch(setIsDeckMinimized(value))}
                onAnalyze={handleAnalyze}
                onClear={handleClear}
                onLoadSample={handleLoadSample}
                isMobile={isMobile}
                isSmallMobile={isSmallMobile}
              />
            </Grid>
          )}

          {/* Results Section - Full width when minimized */}
          <Grid item xs={12} lg={analysisResult && isDeckMinimized ? 12 : isMobile ? 12 : 6}>
            <Paper
              sx={{
                p: isMobile ? 2 : 3,
                minHeight: isMobile ? 400 : 600,
                transition: 'all 0.3s ease-in-out',
                borderRadius: 3,
                border: '1px solid',
                borderColor: 'divider',
              }}
            >
              {isAnalyzing ? (
                <AnalyzerSkeleton variant="results" />
              ) : !analysisResult ? (
                <Box
                  sx={{
                    textAlign: 'center',
                    py: isMobile ? 6 : 10,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 2,
                  }}
                >
                  <Box
                    sx={{
                      width: 100,
                      height: 100,
                      borderRadius: '50%',
                      background: `linear-gradient(135deg, ${theme.palette.info.light}40 0%, ${theme.palette.secondary.light}40 100%)`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mb: 1,
                    }}
                  >
                    <AssessmentIcon
                      sx={{
                        fontSize: isMobile ? 48 : 56,
                        color: '#9e9e9e',
                      }}
                    />
                  </Box>
                  <Typography
                    variant={isMobile ? 'body1' : 'h6'}
                    color="text.secondary"
                    sx={{ maxWidth: 360 }}
                  >
                    Paste a decklist and hit <strong>Analyze</strong>.
                  </Typography>
                  <Box
                    sx={{
                      display: 'flex',
                      gap: 1,
                      flexWrap: 'wrap',
                      justifyContent: 'center',
                      mt: 2,
                    }}
                  >
                    <Chip
                      label="Castability"
                      size="small"
                      sx={{ bgcolor: 'info.light', color: 'info.contrastText' }}
                    />
                    <Chip
                      label="Mulligan"
                      size="small"
                      sx={{ bgcolor: 'secondary.light', color: 'secondary.contrastText' }}
                    />
                    <Chip
                      label="Manabase"
                      size="small"
                      sx={{ bgcolor: 'success.light', color: 'success.contrastText' }}
                    />
                  </Box>
                </Box>
              ) : (
                <div data-testid="analysis-results">
                  <Typography
                    variant={isMobile ? 'h6' : 'h5'}
                    gutterBottom
                    sx={{
                      fontWeight: 700,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                    }}
                  >
                    Analysis Results
                    <Chip
                      icon={<ShareIcon sx={{ fontSize: 16 }} />}
                      label="Share"
                      size="small"
                      variant="outlined"
                      clickable
                      onClick={handleShare}
                      sx={{ fontSize: '0.75rem' }}
                    />
                    {!isDeckMinimized && !isMobile && (
                      <Chip
                        label="Expand full width"
                        size="small"
                        clickable
                        onClick={(e) => {
                          e.stopPropagation()
                          dispatch(setIsDeckMinimized(true))
                        }}
                        sx={{
                          ml: 1,
                          bgcolor: 'primary.main',
                          color: 'primary.contrastText',
                          fontSize: '0.7rem',
                          '&:hover': { bgcolor: 'primary.dark' },
                        }}
                      />
                    )}
                  </Typography>

                  {/* One-phrase verdict — Léo persona ask: "tell me plainly
                      whether my deck is good before I read 5 tabs". */}
                  <QuickVerdict analysisResult={analysisResult} manabaseVerdict={manabaseVerdict} />

                  {/* P3-7: engine provenance for screenshots / Discord debates */}
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    data-testid="engine-stamp"
                    sx={{
                      display: 'block',
                      mb: 1.5,
                      fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
                      fontSize: '0.7rem',
                      letterSpacing: 0.2,
                      opacity: 0.85,
                    }}
                  >
                    Engine v2.7.8 · Karsten tables · hypergeom + ramp K=3 · London mulligan /
                    Bellman
                  </Typography>

                  {/* Tabs with improved styling */}
                  <Tabs
                    value={activeTab}
                    onChange={handleTabChange}
                    variant="scrollable"
                    scrollButtons="auto"
                    allowScrollButtonsMobile
                    aria-label="Analysis results tabs"
                    sx={{
                      mb: isMobile ? 2 : 3,
                      // P2-5: scroll-snap tabs on narrow screens
                      scrollPaddingInline: 8,
                      '& .MuiTabs-scroller': {
                        scrollSnapType: { xs: 'x mandatory', sm: 'none' },
                      },
                      '& .MuiTab-root': {
                        fontSize: isSmallMobile ? '0.75rem' : isMobile ? '0.85rem' : '0.95rem',
                        fontWeight: 600,
                        textTransform: 'none',
                        minHeight: isMobile ? 48 : 56,
                        borderRadius: '8px 8px 0 0',
                        transition: 'all 0.2s ease',
                        scrollSnapAlign: { xs: 'start', sm: 'none' },
                        '&:hover': {
                          bgcolor: 'action.hover',
                        },
                        '&.Mui-selected': {
                          color: 'primary.main',
                        },
                      },
                      '& .MuiTabs-indicator': {
                        height: 3,
                        borderRadius: '3px 3px 0 0',
                        background: 'linear-gradient(90deg, #1976d2 0%, #9c27b0 100%)',
                      },
                    }}
                  >
                    <Tab
                      icon={<ShowChartIcon sx={{ fontSize: 18 }} />}
                      iconPosition="start"
                      label="Castability"
                      aria-label="Castability - Spell casting probabilities"
                      data-testid="tab-castability"
                    />
                    <Tab
                      icon={<AnalyticsIcon sx={{ fontSize: 18 }} />}
                      iconPosition="start"
                      label="Analysis"
                      aria-label="Analysis - Detailed spell analysis"
                      data-testid="tab-analysis"
                    />
                    <Tab
                      icon={<CasinoIcon sx={{ fontSize: 18 }} />}
                      iconPosition="start"
                      label="Mulligan"
                      aria-label="Mulligan - Hand simulation and strategy"
                      data-testid="tab-mulligan"
                    />
                    <Tab
                      icon={<TerrainIcon sx={{ fontSize: 18 }} />}
                      iconPosition="start"
                      label={
                        <Box
                          sx={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 0.75,
                          }}
                        >
                          <span>Manabase</span>
                          {manabaseVerdict && manabaseVerdict.verdict !== 'ok' && (
                            <Box
                              component="span"
                              sx={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                minWidth: 18,
                                height: 18,
                                px: 0.6,
                                borderRadius: 9,
                                fontSize: '0.65rem',
                                fontWeight: 700,
                                lineHeight: 1,
                                color: 'white',
                                bgcolor:
                                  manabaseVerdict.verdict === 'short' ? '#d32f2f' : '#ed6c02',
                              }}
                              title={
                                manabaseVerdict.verdict === 'short'
                                  ? `${manabaseVerdict.shortCount} color(s) short of Karsten targets`
                                  : `${manabaseVerdict.warnCount} color(s) close to Karsten targets`
                              }
                              aria-label={
                                manabaseVerdict.verdict === 'short'
                                  ? `${manabaseVerdict.shortCount} colors short`
                                  : `${manabaseVerdict.warnCount} colors close to limit`
                              }
                            >
                              {manabaseVerdict.verdict === 'short'
                                ? manabaseVerdict.shortCount
                                : manabaseVerdict.warnCount}
                            </Box>
                          )}
                          {manabaseVerdict && manabaseVerdict.verdict === 'ok' && (
                            <Box
                              component="span"
                              sx={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: 14,
                                height: 14,
                                borderRadius: '50%',
                                fontSize: '0.6rem',
                                fontWeight: 700,
                                lineHeight: 1,
                                color: 'white',
                                bgcolor: '#2e7d32',
                              }}
                              aria-label="All colors meet Karsten targets"
                            >
                              ✓
                            </Box>
                          )}
                        </Box>
                      }
                      aria-label={
                        manabaseVerdict?.verdict === 'short'
                          ? `Manabase — ${manabaseVerdict.shortCount} colors short of Karsten targets`
                          : manabaseVerdict?.verdict === 'warn'
                            ? `Manabase — ${manabaseVerdict.warnCount} colors close to target`
                            : 'Manabase - Land breakdown'
                      }
                      data-testid="tab-manabase"
                    />
                    <Tab
                      icon={<DownloadIcon sx={{ fontSize: 18 }} />}
                      iconPosition="start"
                      label="Blueprint"
                      aria-label="Blueprint - Export analysis as PNG, PDF or JSON"
                      data-testid="tab-blueprint"
                    />
                  </Tabs>

                  <Suspense fallback={<AnalyzerSkeleton />}>
                    <TabPanel value={activeTab} index={0}>
                      <ErrorBoundary label="AnalyzerTab.Castability">
                        <CastabilityTab analysisResult={analysisResult} />
                      </ErrorBoundary>
                    </TabPanel>

                    <TabPanel value={activeTab} index={1}>
                      <ErrorBoundary label="AnalyzerTab.Analysis">
                        <AnalysisTab
                          analysisResult={analysisResult}
                          isMobile={isMobile}
                          cards={analysisResult.cards}
                        />
                      </ErrorBoundary>
                    </TabPanel>

                    <TabPanel value={activeTab} index={2}>
                      <ErrorBoundary label="AnalyzerTab.Mulligan">
                        <MulliganTab cards={analysisResult.cards || []} isMobile={isMobile} />
                      </ErrorBoundary>
                    </TabPanel>

                    <TabPanel value={activeTab} index={3}>
                      <ErrorBoundary label="AnalyzerTab.Manabase">
                        <ManabaseFullTab
                          deckList={deckList}
                          analysisResult={analysisResult}
                          isMobile={isMobile}
                          isSmallMobile={isSmallMobile}
                          deckName={deckName}
                        />
                      </ErrorBoundary>
                    </TabPanel>

                    <TabPanel value={activeTab} index={4}>
                      <ErrorBoundary label="AnalyzerTab.Blueprint">
                        <ManaBlueprint
                          analysisResult={analysisResult}
                          deckName={`Deck ${new Date().toLocaleDateString()}`}
                        />
                      </ErrorBoundary>
                    </TabPanel>
                  </Suspense>
                </div>
              )}
            </Paper>
          </Grid>
        </Grid>

        {/* Privacy Settings (lazy-loaded — see import comment above) */}
        <Box sx={{ mt: 4 }}>
          <Suspense fallback={null}>
            <PrivacySettings />
          </Suspense>
        </Box>

        {/* Snackbar */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={() => dispatch(hideSnackbar())}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
          <Alert
            onClose={() => dispatch(hideSnackbar())}
            severity={snackbar.severity}
            sx={{
              width: '100%',
              borderRadius: 2,
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Container>
    </>
  )
}

export default AnalyzerPage
