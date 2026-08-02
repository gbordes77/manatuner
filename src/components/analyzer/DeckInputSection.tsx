import AnalyticsIcon from '@mui/icons-material/Analytics'
import ClearIcon from '@mui/icons-material/Clear'
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined'
import PlaylistAddCheckIcon from '@mui/icons-material/PlaylistAddCheck'
import SpeedIcon from '@mui/icons-material/Speed'
import { Box, Button, LinearProgress, Paper, TextField, Typography } from '@mui/material'
import React, { memo, useCallback, useEffect, useRef, useState } from 'react'
import { AnalysisResult } from '../../services/deckAnalyzer'

/** Debounce before writing decklist keystrokes into redux-persist (T01). */
export const DECKLIST_PERSIST_DEBOUNCE_MS = 300

interface DeckInputSectionProps {
  deckList: string
  deckName: string
  setDeckList: (value: string) => void
  setDeckName: (value: string) => void
  isAnalyzing: boolean
  analysisResult: AnalysisResult | null
  isDeckMinimized: boolean
  setIsDeckMinimized: (value: boolean) => void
  /** Receives the flushed local draft so analyze never runs on a stale redux value. */
  onAnalyze: (deckList: string) => void
  onClear: () => void
  onLoadSample: () => void
  isMobile: boolean
  isSmallMobile: boolean
}

export const DeckInputSection: React.FC<DeckInputSectionProps> = memo(
  ({
    deckList,
    deckName,
    setDeckList,
    setDeckName,
    isAnalyzing,
    analysisResult,
    isDeckMinimized,
    setIsDeckMinimized,
    onAnalyze,
    onClear,
    onLoadSample,
    isMobile,
    isSmallMobile: _isSmallMobile,
  }) => {
    // Local draft for immediate TextField feedback; Redux/persist lags by 300 ms.
    const [localDeckList, setLocalDeckList] = useState(deckList)
    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
    // Track last value pushed to parent to avoid redundant dispatches.
    const lastFlushedRef = useRef(deckList)

    // Sync from parent when external sources update deckList (sample, clear, share URL).
    useEffect(() => {
      setLocalDeckList(deckList)
      lastFlushedRef.current = deckList
    }, [deckList])

    useEffect(() => {
      return () => {
        if (debounceRef.current) clearTimeout(debounceRef.current)
      }
    }, [])

    const flushDeckList = useCallback(
      (value: string) => {
        if (debounceRef.current) {
          clearTimeout(debounceRef.current)
          debounceRef.current = null
        }
        if (value !== lastFlushedRef.current) {
          lastFlushedRef.current = value
          setDeckList(value)
        }
      },
      [setDeckList]
    )

    const handleDeckListChange = useCallback(
      (value: string) => {
        setLocalDeckList(value)
        if (debounceRef.current) clearTimeout(debounceRef.current)
        debounceRef.current = setTimeout(() => {
          debounceRef.current = null
          lastFlushedRef.current = value
          setDeckList(value)
        }, DECKLIST_PERSIST_DEBOUNCE_MS)
      },
      [setDeckList]
    )

    const handleAnalyzeClick = useCallback(() => {
      const value = localDeckList
      flushDeckList(value)
      onAnalyze(value)
    }, [localDeckList, flushDeckList, onAnalyze])

    return (
      <Paper
        sx={{
          p: isMobile ? 2 : 3,
          height: 'fit-content',
          cursor: analysisResult && isDeckMinimized ? 'pointer' : 'default',
          transition: 'all 0.3s ease-in-out',
          '&:hover':
            analysisResult && isDeckMinimized
              ? {
                  transform: isMobile ? 'none' : 'scale(1.02)',
                  boxShadow: 3,
                }
              : {},
        }}
        onClick={() => {
          if (analysisResult && isDeckMinimized) {
            setIsDeckMinimized(false)
          }
        }}
      >
        <Typography
          variant={isMobile ? 'h6' : 'h5'}
          gutterBottom
          sx={{
            fontSize: isMobile ? '1.1rem' : undefined,
            display: 'flex',
            alignItems: 'center',
            gap: 1,
          }}
        >
          <DescriptionOutlinedIcon fontSize="small" color="action" aria-hidden />
          Your Deck {analysisResult && isDeckMinimized && '(Click to expand)'}
        </Typography>

        {!isDeckMinimized && (
          <Box sx={{ mb: 3 }}>
            <TextField
              fullWidth
              size="small"
              label="Deck Name (optional)"
              placeholder="e.g. Rakdos Midrange, Mono-Red Aggro..."
              value={deckName}
              onChange={(e) => setDeckName(e.target.value)}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              multiline
              rows={isMobile ? 10 : 12}
              label="Deck List"
              placeholder="Paste your decklist here...&#10;Format: 4 Lightning Bolt&#10;3 Counterspell&#10;..."
              value={localDeckList}
              onChange={(e) => handleDeckListChange(e.target.value)}
              // Audit fix UX/WCAG (2026-04-13): proper accessibility labels for
              // screen readers + maxLength to prevent multi-MB paste pathology.
              inputProps={{
                'aria-label':
                  'Paste your decklist in MTGA, Moxfield, Archidekt, or plain text format. Each line should be quantity followed by card name, e.g. "4 Lightning Bolt".',
                'aria-describedby': 'deck-format-hint',
                maxLength: 20000,
              }}
              FormHelperTextProps={{ id: 'deck-format-hint' }}
              helperText="Supported: MTGA, Moxfield, Archidekt, MTGGoldfish. Sideboard auto-detected."
              sx={{
                mb: 2,
                '& .MuiInputBase-root': {
                  fontSize: isMobile ? '0.875rem' : undefined,
                },
              }}
            />

            <Box
              sx={{
                display: 'flex',
                gap: isMobile ? 1 : 2,
                mb: 2,
                flexWrap: 'wrap',
                flexDirection: isMobile ? 'column' : 'row',
              }}
            >
              <Button
                variant="contained"
                size={isMobile ? 'medium' : 'large'}
                onClick={handleAnalyzeClick}
                disabled={!localDeckList.trim() || isAnalyzing}
                startIcon={isAnalyzing ? <SpeedIcon /> : <AnalyticsIcon />}
                sx={{
                  flexGrow: 1,
                  minWidth: isMobile ? 'auto' : '200px',
                  fontSize: isMobile ? '0.875rem' : undefined,
                }}
              >
                {isAnalyzing ? 'Analyzing...' : 'Analyze Manabase'}
              </Button>

              <Box
                sx={{
                  display: 'flex',
                  gap: isMobile ? 1 : 2,
                  flexWrap: 'wrap',
                }}
              >
                <Button
                  variant="outlined"
                  size={isMobile ? 'medium' : 'large'}
                  onClick={onClear}
                  startIcon={<ClearIcon />}
                  sx={{
                    color: 'var(--mtg-red)',
                    borderColor: 'var(--mtg-red)',
                    minWidth: isMobile ? 'auto' : '120px',
                    fontSize: isMobile ? '0.875rem' : '1rem',
                    fontWeight: 600,
                    '&:hover': {
                      borderColor: 'var(--mtg-red)',
                      backgroundColor: 'rgba(220, 53, 69, 0.1)',
                    },
                  }}
                >
                  Clear
                </Button>

                <Button
                  variant="outlined"
                  size={isMobile ? 'medium' : 'large'}
                  onClick={onLoadSample}
                  startIcon={<PlaylistAddCheckIcon />}
                  sx={{
                    minWidth: isMobile ? 'auto' : '140px',
                    fontSize: isMobile ? '0.875rem' : '1rem',
                    fontWeight: 600,
                  }}
                >
                  Try Example
                </Button>
              </Box>
            </Box>

            {isAnalyzing && (
              <Box sx={{ mb: 2 }}>
                <LinearProgress />
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    mt: 1,
                    fontSize: isMobile ? '0.75rem' : undefined,
                  }}
                >
                  Calculating hypergeometric probabilities...
                </Typography>
              </Box>
            )}
          </Box>
        )}

        {/* Version minimisée - affichage du résumé */}
        {isDeckMinimized && analysisResult && (
          <Box sx={{ textAlign: 'center', py: 2 }}>
            <Typography variant="body2" color="text.secondary">
              {analysisResult.totalCards} cards • {analysisResult.totalLands} lands
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Click to expand deck editor
            </Typography>
          </Box>
        )}
      </Paper>
    )
  }
)

DeckInputSection.displayName = 'DeckInputSection'
