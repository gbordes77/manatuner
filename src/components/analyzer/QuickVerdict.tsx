import HelpOutlineIcon from '@mui/icons-material/HelpOutline'
import { Alert, Box, List, ListItem, ListItemText, Tooltip, Typography } from '@mui/material'
import React from 'react'
import { healthScoreBand } from '../../utils/healthScore'
import { AnalysisResult } from '../../services/deckAnalyzer'

const HEALTH_SCORE_HELP =
  'Health Score is a heuristic average of turn-two access to each fixed color or hybrid alternative group. It is not a probability of casting spells on curve. Land sequencing, simultaneous pips and ramp are not measured by this score.'

interface QuickVerdictProps {
  analysisResult: AnalysisResult
  /**
   * Rolled-up Karsten verdict from `summarizeColorDeltas`. Null when the deck
   * is land-only or no spells were detected (in which case we skip the color
   * clause entirely).
   */
  manabaseVerdict:
    | {
        verdict: 'ok' | 'warn' | 'short'
        shortCount: number
        warnCount: number
      }
    | null
    | undefined
}

/**
 * One-phrase human-readable verdict shown at the top of the Analysis Results.
 * Léo persona ask: "give me a plain-English takeaway — I don't want to read
 * 5 tabs to know whether my manabase is good".
 *
 * Composition rules (kept deterministic so the phrasing is stable across
 * re-renders):
 *   1. Headline number = consistency (turn-2 average colored-source
 *      probability), expressed as a percentage.
 *   2. Quality tier derived from consistency (excellent/good/average/weak).
 *   3. If Karsten says any color is short, the phrase calls it out.
 *   4. Mulligan rider driven by `poorHand` (≥ 20 % → "mulligan aggressively
 *      on borderline hands"; else "keep almost any 2-4 land opener").
 *
 * The output is intentionally a single sentence — this is NOT where deep
 * analysis lives; it's the hook that tells a casual player whether to dig
 * deeper into the tabs.
 */
/**
 * Format detection thresholds.
 *   - Limited: 40-card decks (draft / sealed). `<= 45` leaves headroom for
 *     decks with 2-3 extra spells vs the 40-card baseline.
 *   - EDH / Commander: 99 (library only) or 100 (library + commander in
 *     one list) both count. Anything `>= 99` is treated as 100-card
 *     singleton.
 *   - Constructed: 60-89 cards (Standard, Pioneer, Modern, Legacy).
 */
const LIMITED_MAX_CARDS = 45
const EDH_MIN_CARDS = 99

type FormatFamily = 'limited' | 'edh' | 'constructed'

function detectFormatFamily(totalCards: number): FormatFamily {
  if (totalCards <= LIMITED_MAX_CARDS) return 'limited'
  if (totalCards >= EDH_MIN_CARDS) return 'edh'
  return 'constructed'
}

export const QuickVerdict: React.FC<QuickVerdictProps> = ({ analysisResult, manabaseVerdict }) => {
  const consistencyPct = Math.round((analysisResult.consistency || 0) * 100)
  const format = detectFormatFamily(analysisResult.totalCards || 0)
  const isEDH = format === 'edh'
  const isLimited = format === 'limited'

  const { label: healthBand, severity } = healthScoreBand(consistencyPct)
  const mulliganRider = 'review actual opening hands in the Mulligan tab'

  const colorClause = (() => {
    if (!manabaseVerdict || manabaseVerdict.verdict === 'ok') return null
    if (manabaseVerdict.verdict === 'short') {
      const n = manabaseVerdict.shortCount
      return `${n} color${n > 1 ? 's' : ''} short of Karsten target`
    }
    const n = manabaseVerdict.warnCount
    return `${n} color${n > 1 ? 's' : ''} close to limit`
  })()

  const headline = isEDH
    ? `EDH — color access score ${consistencyPct}/100`
    : isLimited
      ? `Limited — color access score ${consistencyPct}/100`
      : `Your deck has a color access score of ${consistencyPct}/100`

  const phrase = colorClause
    ? `${headline} — ${healthBand.toLowerCase()}, but ${colorClause}; ${mulliganRider}.`
    : `${headline} — ${healthBand.toLowerCase()}; ${mulliganRider}.`

  return (
    <Alert
      id="quick-verdict"
      tabIndex={-1}
      severity={analysisResult.consistencyUnavailable ? 'info' : severity}
      variant="outlined"
      sx={{
        mb: 2,
        borderWidth: 1.5,
        outline: 'none',
        '&:focus-visible': {
          boxShadow: (t) => `0 0 0 3px ${t.palette.primary.main}55`,
        },
        '& .MuiAlert-message': { width: '100%' },
      }}
      role="status"
      aria-live="polite"
      aria-atomic="true"
      data-testid="quick-verdict"
    >
      <Typography
        variant="caption"
        id="health-score-label"
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 0.5,
          fontWeight: 700,
          letterSpacing: 0.4,
          mb: 0.5,
          opacity: 0.9,
        }}
      >
        {analysisResult.consistencyUnavailable
          ? 'Health Score unavailable'
          : `Health Score ${consistencyPct}% · ${healthBand}`}
        <Tooltip title={HEALTH_SCORE_HELP}>
          <HelpOutlineIcon
            fontSize="inherit"
            sx={{ fontSize: '1rem', cursor: 'help', opacity: 0.8 }}
            aria-label="What Health Score means"
            aria-describedby="health-score-label"
          />
        </Tooltip>
      </Typography>
      <Typography variant="body2" sx={{ fontWeight: 500, lineHeight: 1.5 }}>
        {analysisResult.consistencyUnavailable
          ? 'Unrepresented payment symbols prevent a meaningful color access score. Review individual spell limitations.'
          : phrase}
      </Typography>
      {analysisResult.colorAccessNotes?.map((note) => (
        <Typography key={note} variant="caption" sx={{ display: 'block', mt: 1 }}>
          {note}
        </Typography>
      ))}
      {Array.isArray(analysisResult.recommendations) &&
        analysisResult.recommendations.length > 0 && (
          <Box sx={{ mt: 1.25 }} data-testid="top-recommendations">
            <Typography
              variant="caption"
              sx={{ fontWeight: 700, letterSpacing: 0.3, display: 'block', mb: 0.25 }}
            >
              Top recommendations
            </Typography>
            <List dense disablePadding>
              {analysisResult.recommendations.slice(0, 3).map((rec, i) => (
                <ListItem key={i} disableGutters sx={{ py: 0.15, alignItems: 'flex-start' }}>
                  <ListItemText
                    primary={`${i + 1}. ${rec}`}
                    primaryTypographyProps={{
                      variant: 'caption',
                      sx: { lineHeight: 1.4 },
                    }}
                  />
                </ListItem>
              ))}
            </List>
          </Box>
        )}
      {isEDH && (
        <Typography
          variant="caption"
          sx={{ display: 'block', mt: 0.5, opacity: 0.85, fontStyle: 'italic' }}
        >
          EDH: priority horizon T4–T8 · Karsten color targets scaled to {analysisResult.totalCards}{' '}
          cards · command zone only when explicitly marked; commander payment is shown separately in
          Castability.{' '}
          <a href="/guide#commander" style={{ color: 'inherit' }}>
            Guide
          </a>
          .
        </Typography>
      )}
      {isLimited && (
        <Typography
          variant="caption"
          sx={{ display: 'block', mt: 0.5, opacity: 0.85, fontStyle: 'italic' }}
        >
          Note: in Limited (40-card), Karsten targets are scaled down from the 60-card tables (N/60)
          — a 2-pip spell still eats most of a draft fixing pool. Aim for ~17 lands and at most a
          10/7 colour split.
        </Typography>
      )}
    </Alert>
  )
}
