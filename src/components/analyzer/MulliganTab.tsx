/**
 * MulliganTab - Advanced Mulligan Strategy Analysis
 *
 * Features:
 * - Archetype Selector (Aggro/Midrange/Control/Combo)
 * - Hand Score Breakdown with visual metrics
 * - Sample Hands Visualizer with turn-by-turn plan
 * - Score Legend with concrete explanations
 * - Distribution charts
 */

import BoltIcon from '@mui/icons-material/Bolt'
import CasinoIcon from '@mui/icons-material/Casino'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import HelpIcon from '@mui/icons-material/Help'
import LandscapeIcon from '@mui/icons-material/Landscape'
import PaletteIcon from '@mui/icons-material/Palette'
import RefreshIcon from '@mui/icons-material/Refresh'
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch'
import ShowChartIcon from '@mui/icons-material/ShowChart'
import TrackChangesIcon from '@mui/icons-material/TrackChanges'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import LightbulbOutlinedIcon from '@mui/icons-material/LightbulbOutlined'
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Alert,
  Box,
  Button,
  FormControlLabel,
  Switch,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Grid,
  IconButton,
  LinearProgress,
  Paper,
  Tooltip,
  Typography,
} from '@mui/material'
import React, { memo, useCallback, useEffect, useRef, useState } from 'react'
import MulliganArchetypeWorker from '../../workers/mulliganArchetype.worker?worker'
import type {
  MulliganWorkerRequest,
  MulliganWorkerResponse,
} from '../../workers/mulliganArchetype.worker'
import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from 'recharts'
import type { DeckCard } from '../../services/deckAnalyzer'
import { toCloneableDeckCards } from '../../services/mulliganSimulatorAdvanced'
import {
  ARCHETYPE_CONFIGS,
  suggestArchetypeFromDeck,
  SCORE_LEGEND,
  type AdvancedMulliganResult,
  type Archetype,
  type SampleHand,
} from '../../services/mulliganSimulatorAdvanced'

// =============================================================================
// PROPS
// =============================================================================

interface MulliganTabProps {
  cards: DeckCard[]
  isMobile?: boolean
}

// =============================================================================
// ARCHETYPE SELECTOR
// =============================================================================

interface ArchetypeSelectorProps {
  value: Archetype
  onChange: (archetype: Archetype) => void
  disabled?: boolean
}

const ArchetypeSelector: React.FC<ArchetypeSelectorProps> = ({ value, onChange, disabled }) => {
  return (
    <Box sx={{ mb: 3 }} data-testid="archetype-selector">
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5 }}>
        <Typography variant="subtitle2" fontWeight={700}>
          Deck archetype (mulligan lens)
        </Typography>
        <InfoTooltip title={TOOLTIPS.archetype} />
      </Box>
      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1.5 }}>
        Scores keep/mull decisions for how your deck wins. Change anytime — Aggro is stricter on
        early action; Control wants more lands.
      </Typography>

      <Grid container spacing={1}>
        {(Object.entries(ARCHETYPE_CONFIGS) as [Archetype, typeof ARCHETYPE_CONFIGS.aggro][]).map(
          ([key, config]) => (
            <Grid item xs={6} sm={3} key={key}>
              <Paper
                elevation={value === key ? 4 : 1}
                onClick={() => !disabled && onChange(key)}
                role="button"
                aria-pressed={value === key}
                data-testid={`archetype-${key}`}
                sx={{
                  p: { xs: 1.25, sm: 2 },
                  minHeight: { xs: 88, sm: 110 },
                  cursor: disabled ? 'not-allowed' : 'pointer',
                  textAlign: 'center',
                  border: 2,
                  borderColor: value === key ? 'primary.main' : 'divider',
                  backgroundColor: value === key ? 'action.selected' : 'background.paper',
                  transition: 'all 0.2s ease',
                  opacity: disabled ? 0.6 : 1,
                  '&:hover': disabled
                    ? {}
                    : {
                        borderColor: 'primary.light',
                        transform: 'translateY(-2px)',
                      },
                }}
              >
                <Typography
                  variant="h5"
                  sx={{ mb: 0.5, fontSize: { xs: '1.25rem', sm: '1.5rem' } }}
                >
                  {config.icon}
                </Typography>
                <Typography variant="subtitle2" fontWeight="bold">
                  {config.name}
                </Typography>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{
                    display: 'block',
                    mt: 0.5,
                    lineHeight: 1.3,
                    px: 0.25,
                  }}
                >
                  {config.description}
                </Typography>
              </Paper>
            </Grid>
          )
        )}
      </Grid>

      {/* Archetype priorities */}
      <Box
        sx={{ mt: 2, p: 2, backgroundColor: 'action.hover', borderRadius: 1 }}
        data-testid="archetype-priorities"
      >
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
          <strong>
            {ARCHETYPE_CONFIGS[value].icon} {ARCHETYPE_CONFIGS[value].name} — what “good hand”
            means:
          </strong>
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
          {ARCHETYPE_CONFIGS[value].priorities.map((priority, i) => (
            <Chip key={i} label={priority} size="small" variant="outlined" />
          ))}
        </Box>
      </Box>
    </Box>
  )
}

// =============================================================================
// SCORE LEGEND
// =============================================================================

const ScoreLegendSection: React.FC = () => {
  return (
    <Accordion defaultExpanded={false}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography variant="subtitle2" sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
          <ShowChartIcon fontSize="small" aria-hidden />
          Score Legend — What do the numbers mean?
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Grid container spacing={1}>
          {Object.entries(SCORE_LEGEND).map(([key, value]) => (
            <Grid item xs={12} sm={6} md={2.4} key={key}>
              <Box
                sx={{
                  p: 1.5,
                  borderRadius: 1,
                  backgroundColor: `${value.color}22`,
                  borderLeft: 4,
                  borderColor: value.color,
                }}
              >
                <Typography variant="subtitle2" fontWeight="bold" sx={{ color: value.color }}>
                  {value.min}+ {value.label}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {value.description}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </AccordionDetails>
    </Accordion>
  )
}

// =============================================================================
// TOOLTIPS - Explanations for all technical terms
// =============================================================================

const TOOLTIPS = {
  expectedScore7: `Average Score at 7 Cards

This is the average quality of all 7-card hands your deck can generate.

The higher this number, the more consistently your deck produces good opening hands.

Example: A score of 75 means on average, your 7-card hands are "good" and playable.`,

  expectedScore6: `Average Score at 6 Cards

This is the average quality after mulliganing to 6 cards (draw 7, keep 6).

Thanks to London Mulligan, this score often stays close to 7-card score because you choose the best 6.`,

  threshold7: `Decision Threshold to Keep 7 Cards

If your 7-card hand scores BELOW this threshold, you should mulligan.

Why? Because statistically, a 6-card hand will be better on average.

In practice: Mentally compare your hand to this threshold to decide.`,

  threshold6: `Decision Threshold to Keep 6 Cards

If your 6-card hand scores BELOW this threshold, you should mulligan to 5.

Warning: Going to 5 cards is risky, so this threshold is usually low.`,

  manaEfficiency: `Mana Efficiency (0-100%)

Measures how much mana you actually spend over the first 4 turns.

100% = You spend all your mana every turn (ideal)
50% = You waste half your mana (problematic)

A low score means your mana curve doesn't match your lands.`,

  curvePlayability: `Curve Playability (0-100%)

Measures if you can play spells optimally each turn.

Checks if you have:
• A 1-drop for Turn 1 (crucial for Aggro)
• A 2-drop for Turn 2
• A 3-drop for Turn 3
• etc.`,

  colorAccess: `Color Access (0-100%)

Measures if your lands produce the right colors to cast your spells.

100% = All your spells are castable with your lands
70% = Some spells are blocked by missing colors

A low score indicates a multicolor manabase problem.`,

  earlyGame: `Early Game (0-100%)

Evaluates if you can act in the first turns.

For Aggro: Do you have a 1-drop + enough lands?
For Midrange: Do you have a playable 2-drop or 3-drop?
For Control: Do you have answers and enough lands?`,

  landBalance: `Land Balance (0-100%)

Checks if you have the right number of lands for your archetype.

Aggro: 2-3 lands ideal (4+ = flood)
Midrange: 3-4 lands ideal
Control: 4-5 lands ideal (less = screw)`,

  distribution: `Distribution Chart

Shows the probability of getting each hand quality level.

• Green Curve (7 cards): Normal distribution
• Blue Curve (6 cards): After 1 mulligan
• Orange Curve (5 cards): After 2 mulligans

The more the curve is to the right, the better the hands.
The more "peaked" it is, the more predictable the results.`,

  optimalStrategy: `Optimal Strategy

These bars show you mathematically calculated decision thresholds.

How to use them:
1. Evaluate your hand (the tool does it for you in "Sample Hands")
2. Compare to the corresponding threshold
3. If your hand is BELOW the threshold → Mulligan
4. If your hand is ABOVE the threshold → Keep`,

  sampleHands: `Sample Hands

These are REAL hands your deck can generate, drawn from the simulation.

Each hand shows:
• The cards (lands in green, spells outlined)
• The calculated score and recommendation
• The turn-by-turn game plan (T1-T4)
• Detailed reasoning for the decision`,

  archetype: `Deck Archetype

Your deck's strategy type completely changes mulligan criteria:

⚡ Aggro: Priority on 1-drops, 2-3 lands max
⚖️ Midrange: Balanced curve, 3-4 lands
🛡️ Control: Answers + lands, 4+ lands OK
🔮 Combo: Combo pieces + mana to cast them`,

  deckQuality: `Deck Quality

Expected hand-quality value after modeled mulligans; these bands differ from the deck Health Score:

• Excellent (80+): Most hands are keepable
• Good (65-79): Good hands frequent
• Average (50-64): Variable results
• Poor (<50): Many problematic hands`,
}

// Helper component for tooltip with question mark
const InfoTooltip: React.FC<{ title: string }> = ({ title }) => (
  <Tooltip
    title={<Typography sx={{ whiteSpace: 'pre-line', fontSize: '0.85rem' }}>{title}</Typography>}
    arrow
    placement="top"
  >
    <HelpIcon
      fontSize="small"
      sx={{
        color: 'text.secondary',
        cursor: 'help',
        ml: 0.5,
        fontSize: '1rem',
        verticalAlign: 'middle',
        '&:hover': { color: 'primary.main' },
      }}
    />
  </Tooltip>
)

// =============================================================================
// EXPECTED VALUES DISPLAY
// =============================================================================

interface ExpectedValuesProps {
  result: AdvancedMulliganResult
}

const ExpectedValues: React.FC<ExpectedValuesProps> = ({ result }) => {
  const getScoreColor = (score: number): string => {
    if (score >= 85) return '#4caf50'
    if (score >= 70) return '#8bc34a'
    if (score >= 55) return '#ff9800'
    if (score >= 40) return '#f44336'
    return '#b71c1c'
  }

  const metrics = [
    {
      label: 'Average Score (7 cards)',
      shortLabel: 'Expected (7 cards)',
      value: result.expectedScores.hand7,
      highlight: true,
      tooltip: TOOLTIPS.expectedScore7,
    },
    {
      label: 'Average Score (6 cards)',
      shortLabel: 'Expected (6 cards)',
      value: result.expectedScores.hand6,
      tooltip: TOOLTIPS.expectedScore6,
    },
    {
      label: 'Keep 7 Threshold',
      shortLabel: 'Mull if below',
      value: result.thresholds.keep7,
      isThreshold: true,
      tooltip: TOOLTIPS.threshold7,
    },
    {
      label: 'Keep 6 Threshold',
      shortLabel: 'Mull to 5 if below',
      value: result.thresholds.keep6,
      isThreshold: true,
      tooltip: TOOLTIPS.threshold6,
    },
  ]

  return (
    <Grid container spacing={2} sx={{ mb: 3 }}>
      {metrics.map((item, i) => (
        <Grid item xs={6} md={3} key={i}>
          <Paper
            elevation={item.highlight ? 3 : 1}
            sx={{
              p: 2,
              textAlign: 'center',
              border: item.highlight ? 2 : 0,
              borderColor: 'primary.main',
            }}
          >
            <Typography variant="h4" fontWeight="bold" sx={{ color: getScoreColor(item.value) }}>
              {item.value}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Typography variant="caption" color="text.secondary">
                {item.shortLabel}
              </Typography>
              <InfoTooltip title={item.tooltip} />
            </Box>
          </Paper>
        </Grid>
      ))}
    </Grid>
  )
}

// =============================================================================
// OPTIMAL STRATEGY BARS
// =============================================================================

interface OptimalStrategyProps {
  result: AdvancedMulliganResult
}

const OptimalStrategy: React.FC<OptimalStrategyProps> = ({ result }) => {
  const strategies = [
    {
      label: 'Keep 7 cards',
      description: 'Your hand is good enough',
      threshold: result.thresholds.keep7,
      color: '#4caf50',
    },
    {
      label: 'Keep 6 cards',
      description: 'After one mulligan',
      threshold: result.thresholds.keep6,
      color: '#2196f3',
    },
    {
      label: 'Keep 5 cards',
      description: 'After two mulligans',
      threshold: result.thresholds.keep5,
      color: '#ff9800',
    },
  ]

  return (
    <Paper sx={{ p: 2, mb: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
        <Typography variant="subtitle2" sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
          <TrackChangesIcon fontSize="small" aria-hidden />
          Decision Thresholds
        </Typography>
        <InfoTooltip title={TOOLTIPS.optimalStrategy} />
      </Box>
      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 2 }}>
        Keep your hand if its score meets or exceeds these minimums:
      </Typography>
      {strategies.map((s, i) => (
        <Box key={i} sx={{ mb: 1.5 }}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'baseline',
              mb: 0.5,
            }}
          >
            <Box>
              <Typography variant="body2" component="span" fontWeight="medium">
                {s.label}
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
                ({s.description})
              </Typography>
            </Box>
            <Typography variant="body2" fontWeight="bold">
              ≥ {s.threshold}
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={s.threshold}
            sx={{
              height: 10,
              borderRadius: 5,
              backgroundColor: 'action.hover',
              '& .MuiLinearProgress-bar': {
                backgroundColor: s.color,
                borderRadius: 5,
              },
            }}
          />
        </Box>
      ))}
    </Paper>
  )
}

// =============================================================================
// DISTRIBUTION CHART
// =============================================================================

interface DistributionChartProps {
  result: AdvancedMulliganResult
}

const DistributionChart: React.FC<DistributionChartProps> = ({ result }) => {
  const data = result.distributions.hand7.map((d7, i) => ({
    score: d7.score,
    '7 Cards': Math.round(d7.frequency * 100),
    '6 Cards': Math.round(result.distributions.hand6[i].frequency * 100),
    '5 Cards': Math.round(result.distributions.hand5[i].frequency * 100),
  }))

  return (
    <Paper sx={{ p: 2, mb: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
        <Typography variant="subtitle2" sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
          <TrendingUpIcon fontSize="small" aria-hidden />
          Hand Quality Distribution
        </Typography>
        <InfoTooltip title={TOOLTIPS.distribution} />
      </Box>
      <ResponsiveContainer width="100%" height={250}>
        <AreaChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="score" label={{ value: 'Hand Score', position: 'bottom', offset: -5 }} />
          <YAxis label={{ value: 'Frequency %', angle: -90, position: 'insideLeft' }} />
          <RechartsTooltip />
          <Legend />
          <Area type="monotone" dataKey="7 Cards" stackId="1" stroke="#4caf50" fill="#4caf5066" />
          <Area type="monotone" dataKey="6 Cards" stackId="2" stroke="#2196f3" fill="#2196f366" />
          <Area type="monotone" dataKey="5 Cards" stackId="3" stroke="#ff9800" fill="#ff980066" />
        </AreaChart>
      </ResponsiveContainer>
    </Paper>
  )
}

// =============================================================================
// SCORE BREAKDOWN DISPLAY
// =============================================================================

interface ScoreBreakdownProps {
  breakdown: SampleHand['breakdown']
}

const ScoreBreakdownDisplay: React.FC<ScoreBreakdownProps> = ({ breakdown }) => {
  const metrics = [
    {
      label: 'Mana Efficiency',
      value: breakdown.manaEfficiency,
      icon: <BoltIcon sx={{ fontSize: 16 }} aria-hidden />,
      tooltip: TOOLTIPS.manaEfficiency,
    },
    {
      label: 'Curve Playability',
      value: breakdown.curvePlayability,
      icon: <TrendingUpIcon sx={{ fontSize: 16 }} aria-hidden />,
      tooltip: TOOLTIPS.curvePlayability,
    },
    {
      label: 'Color Access',
      value: breakdown.colorAccess,
      icon: <PaletteIcon sx={{ fontSize: 16 }} aria-hidden />,
      tooltip: TOOLTIPS.colorAccess,
    },
    {
      label: 'Early Game',
      value: breakdown.earlyGame,
      icon: <RocketLaunchIcon sx={{ fontSize: 16 }} aria-hidden />,
      tooltip: TOOLTIPS.earlyGame,
    },
    {
      label: 'Land Balance',
      value: breakdown.landBalance,
      icon: <LandscapeIcon sx={{ fontSize: 16 }} aria-hidden />,
      tooltip: TOOLTIPS.landBalance,
    },
  ]

  const getColor = (value: number): string => {
    if (value >= 80) return '#4caf50'
    if (value >= 60) return '#8bc34a'
    if (value >= 40) return '#ff9800'
    return '#f44336'
  }

  return (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
      {metrics.map((m, i) => (
        <Tooltip
          key={i}
          title={
            <Typography sx={{ whiteSpace: 'pre-line', fontSize: '0.85rem' }}>
              {m.tooltip}
            </Typography>
          }
          arrow
          placement="top"
        >
          <Chip
            icon={m.icon as React.ReactElement}
            label={`${m.label}: ${m.value}%`}
            size="small"
            sx={{
              backgroundColor: `${getColor(m.value)}22`,
              borderColor: getColor(m.value),
              border: 1,
              cursor: 'help',
            }}
          />
        </Tooltip>
      ))}
    </Box>
  )
}

// =============================================================================
// SAMPLE HAND CARD
// =============================================================================

interface SampleHandCardProps {
  hand: SampleHand
  index: number
}

const SampleHandCard: React.FC<SampleHandCardProps> = ({ hand, index }) => {
  const getRecommendationColor = (rec: SampleHand['recommendation']): string => {
    switch (rec) {
      case 'SNAP_KEEP':
        return '#4caf50'
      case 'KEEP':
        return '#8bc34a'
      case 'MARGINAL':
        return '#ff9800'
      case 'MULLIGAN':
        return '#f44336'
      case 'SNAP_MULL':
        return '#b71c1c'
    }
  }

  const getRecommendationLabel = (rec: SampleHand['recommendation']): string => {
    switch (rec) {
      case 'SNAP_KEEP':
        return '✅ SNAP KEEP'
      case 'KEEP':
        return '👍 KEEP'
      case 'MARGINAL':
        return '⚠️ MARGINAL'
      case 'MULLIGAN':
        return '👎 MULLIGAN'
      case 'SNAP_MULL':
        return '❌ SNAP MULL'
    }
  }

  return (
    <Card variant="outlined" sx={{ mb: 2 }}>
      <CardContent>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="subtitle1" fontWeight="bold">
            Sample Hand #{index + 1}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography
              variant="h6"
              fontWeight="bold"
              sx={{ color: getRecommendationColor(hand.recommendation) }}
            >
              {hand.score}
            </Typography>
            <Chip
              label={getRecommendationLabel(hand.recommendation)}
              size="small"
              sx={{
                backgroundColor: `${getRecommendationColor(hand.recommendation)}22`,
                color: getRecommendationColor(hand.recommendation),
                fontWeight: 'bold',
              }}
            />
          </Box>
        </Box>

        {/* Cards in hand */}
        <Box sx={{ mb: 2 }}>
          <Typography variant="caption" color="text.secondary" gutterBottom>
            Opening Hand:
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 0.5 }}>
            {hand.cards.map((card, i) => (
              <Chip
                key={i}
                label={card.name}
                size="small"
                variant={card.isLand ? 'filled' : 'outlined'}
                sx={{
                  backgroundColor: card.isLand ? 'success.light' : 'transparent',
                  color: card.isLand ? 'success.contrastText' : 'text.primary',
                }}
              />
            ))}
          </Box>
        </Box>

        {/* Score Breakdown */}
        <ScoreBreakdownDisplay breakdown={hand.breakdown} />

        {/* Turn by Turn Plan */}
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="caption">📅 Turn by Turn Plan (T1-T4)</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={1}>
              {hand.turnByTurn.map((turn, i) => (
                <Grid item xs={6} sm={3} key={i}>
                  <Box
                    sx={{
                      p: 1,
                      borderRadius: 1,
                      backgroundColor: 'action.hover',
                      textAlign: 'center',
                    }}
                  >
                    <Typography variant="caption" fontWeight="bold">
                      Turn {turn.turn}
                    </Typography>
                    <Typography variant="body2" sx={{ fontSize: '0.75rem' }}>
                      {turn.landDrop ? `🏔️ ${turn.landDrop.split(' ')[0]}` : '❌ No land'}
                    </Typography>
                    <Typography variant="body2" sx={{ fontSize: '0.75rem' }}>
                      {turn.plays.length > 0
                        ? `⚡ ${turn.plays.map((p) => p.split(' ')[0]).join(', ')}`
                        : '—'}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {turn.manaUsed}/{turn.manaAvailable} mana
                    </Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </AccordionDetails>
        </Accordion>

        {/* Reasoning */}
        <Box sx={{ mt: 2 }}>
          {hand.reasoning.map((reason, i) => (
            <Typography key={i} variant="caption" display="block" color="text.secondary">
              {reason}
            </Typography>
          ))}
        </Box>
      </CardContent>
    </Card>
  )
}

// =============================================================================
// SAMPLE HANDS SECTION
// =============================================================================

interface SampleHandsSectionProps {
  sampleHands: AdvancedMulliganResult['sampleHands']
}

const SampleHandsSection: React.FC<SampleHandsSectionProps> = ({ sampleHands }) => {
  const categories = [
    { key: 'excellent', label: '🌟 Excellent Hands (85+)', hands: sampleHands.excellent },
    { key: 'good', label: '✅ Good Hands (70-84)', hands: sampleHands.good },
    { key: 'marginal', label: '⚠️ Marginal Hands (55-69)', hands: sampleHands.marginal },
    { key: 'poor', label: '❌ Poor Hands (<55)', hands: sampleHands.poor },
  ]

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1 }}>
        <Typography variant="subtitle2">🃏 Sample Hands From Your Deck</Typography>
        <InfoTooltip title={TOOLTIPS.sampleHands} />
      </Box>

      {categories.map((cat) => (
        <Accordion
          key={cat.key}
          defaultExpanded={cat.key === 'excellent' || cat.key === 'marginal'}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="body2">
              {cat.label} ({cat.hands.length} examples)
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            {cat.hands.length > 0 ? (
              cat.hands.map((hand, i) => <SampleHandCard key={i} hand={hand} index={i} />)
            ) : (
              <Typography variant="body2" color="text.secondary">
                No hands in this category from the simulation
              </Typography>
            )}
          </AccordionDetails>
        </Accordion>
      ))}
    </Box>
  )
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export const MulliganTab: React.FC<MulliganTabProps> = memo(
  ({ cards, isMobile: _isMobile = false }) => {
    const [archetype, setArchetype] = useState<Archetype>(() => suggestArchetypeFromDeck(cards))
    const [archetypeLocked, setArchetypeLocked] = useState(false)
    const [multiplayer, setMultiplayer] = useState(false)
    const [iterations, setIterations] = useState(10000)
    const [result, setResult] = useState<AdvancedMulliganResult | null>(null)
    const [isAnalyzing, setIsAnalyzing] = useState(false)
    const [error, setError] = useState<string | null>(null)

    // Auto-suggest archetype from curve unless the user picked one manually
    useEffect(() => {
      if (archetypeLocked) return
      setArchetype(suggestArchetypeFromDeck(cards))
    }, [cards, archetypeLocked])

    const handleArchetypeChange = useCallback((a: Archetype) => {
      setArchetypeLocked(true)
      setArchetype(a)
    }, [])

    const ITERATION_PRESETS = [
      { value: 3000, label: 'Quick (3k)', desc: '3,000 samples per hand size' },
      { value: 10000, label: 'Standard (10k)', desc: '10,000 samples per hand size' },
      { value: 50000, label: 'Precise (50k)', desc: '50,000 samples per hand size' },
    ]

    // Calculate total cards including quantities
    const totalCards = cards
      .filter((c) => !c.isSideboard && !c.isCommander)
      .reduce((sum, card) => sum + card.quantity, 0)

    // Audit fix H1 + M3 (2026-04-13): Monte Carlo + Bellman now run inside a
    // dedicated Web Worker so the main thread stays responsive even on the
    // 50k-iteration "Precise" preset. Each request carries a monotonic id;
    // we only accept the response matching the id of the most recent request,
    // which fixes the race when archetype/iterations change while a previous
    // run is still in flight (the old code had two overlapping useEffects).
    const requestIdRef = useRef(0)
    const cleanupWorkerRef = useRef<(() => void) | null>(null)

    const stopWorker = useCallback(() => {
      ++requestIdRef.current
      cleanupWorkerRef.current?.()
      cleanupWorkerRef.current = null
    }, [])

    useEffect(() => () => stopWorker(), [stopWorker])

    const cancelAnalysis = useCallback(() => {
      stopWorker()
      setIsAnalyzing(false)
      setResult(null)
      setError('Analysis cancelled. You can run it again.')
    }, [stopWorker])

    const runAnalysis = useCallback(() => {
      stopWorker()
      setResult(null)
      setError(null)
      setIsAnalyzing(false)
      if (totalCards < 40) {
        setError('You need at least 40 cards for mulligan analysis')
        return
      }
      const id = requestIdRef.current
      let worker: Worker
      try {
        worker = new MulliganArchetypeWorker()
      } catch {
        setError('Failed to start mulligan analysis. The worker could not load; try again.')
        return
      }
      setIsAnalyzing(true)
      let finished = false
      const ownsRequest = () => !finished && id === requestIdRef.current
      const cleanup = () => {
        finished = true
        clearTimeout(startupTimer)
        worker.removeEventListener('message', handler)
        worker.removeEventListener('error', onError)
        worker.removeEventListener('messageerror', onMessageError)
        worker.terminate()
        if (cleanupWorkerRef.current === cleanup) cleanupWorkerRef.current = null
      }
      const fail = (message: string) => {
        if (!ownsRequest()) return
        cleanup()
        setError(message)
        setIsAnalyzing(false)
      }
      const onError = (event: ErrorEvent) => {
        event.preventDefault()
        fail('The mulligan worker stopped unexpectedly. Try running the analysis again.')
      }
      const onMessageError = () => {
        fail('The mulligan worker returned an unreadable message. Try again.')
      }
      const handler = (event: MessageEvent<MulliganWorkerResponse>) => {
        if (!ownsRequest() || event.data?.id !== id) return
        if ('type' in event.data && event.data.type === 'started') {
          // Only worker startup is bounded. Precise simulations on slow devices
          // keep running until completion or explicit user cancellation.
          clearTimeout(startupTimer)
          return
        }
        if (!('ok' in event.data)) return
        cleanup()
        if (event.data.ok) setResult(event.data.result)
        else setError(event.data.error)
        setIsAnalyzing(false)
      }
      cleanupWorkerRef.current = cleanup
      worker.addEventListener('message', handler)
      worker.addEventListener('error', onError)
      worker.addEventListener('messageerror', onMessageError)
      const startupTimer = setTimeout(() => {
        fail('The mulligan worker did not respond when starting. Try again.')
      }, 15000)

      try {
        const request: MulliganWorkerRequest = {
          id,
          cards: toCloneableDeckCards(cards),
          archetype,
          iterations,
          multiplayer,
        }
        worker.postMessage(request)
      } catch {
        fail('Failed to start mulligan analysis. The worker message could not be sent; try again.')
      }
    }, [cards, archetype, iterations, totalCards, multiplayer, stopWorker])

    // Single auto-run effect (was previously two overlapping effects → M3 fix).
    // Triggers on initial mount, on cards change, on archetype change, and on
    // iterations change. The worker request-id pattern guarantees only the
    // latest run's result reaches React state.
    useEffect(() => {
      runAnalysis()
      // runAnalysis is intentionally listed so dependency churn re-fires it.
    }, [runAnalysis, totalCards])

    if (totalCards < 40) {
      return (
        <Alert severity="warning">
          You need at least 40 cards in your deck for mulligan analysis. Currently: {totalCards}{' '}
          cards.
        </Alert>
      )
    }

    return (
      <Box>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <CasinoIcon /> Mulligan Strategy Analysis
          </Typography>
          <Button
            variant="outlined"
            startIcon={isAnalyzing ? <CircularProgress size={16} /> : <RefreshIcon />}
            onClick={isAnalyzing ? cancelAnalysis : runAnalysis}
            size="small"
          >
            {isAnalyzing ? 'Cancel analysis' : 'Re-run Analysis'}
          </Button>
        </Box>

        {/* Archetype Selector */}
        <ArchetypeSelector
          value={archetype}
          onChange={handleArchetypeChange}
          disabled={isAnalyzing}
        />
        {!archetypeLocked && (
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ display: 'block', mb: 2, mt: -1 }}
            data-testid="archetype-auto-hint"
          >
            Suggested from your curve (avg CMC) — click a card above to lock a different lens.
          </Typography>
        )}

        <Alert severity="info" sx={{ mb: 2 }}>
          Hand scores and keep thresholds optimize a heuristic opening-hand score, not win
          probability. The policy stops at four cards and uses heuristic bottoming. Plans allow one
          land per turn and no ramp. In multiplayer mode the first mulligan is free and turn one
          includes a draw; the seven-card threshold applies before the free mulligan.
        </Alert>
        <FormControlLabel
          control={<Switch checked={multiplayer} onChange={(_, value) => setMultiplayer(value)} />}
          label="Multiplayer: free first mulligan and turn-one draw"
        />
        {multiplayer && result?.multiplayer && (
          <Typography variant="body2" sx={{ mb: 2 }}>
            After the free mulligan, keep-seven threshold: {result.paidSevenThreshold}.
          </Typography>
        )}
        {/* Simulation Precision */}
        <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
          <Typography variant="subtitle2" color="text.secondary">
            Simulation precision:
          </Typography>
          {ITERATION_PRESETS.map((preset) => (
            <Chip
              key={preset.value}
              label={preset.label}
              size="small"
              variant={iterations === preset.value ? 'filled' : 'outlined'}
              color={iterations === preset.value ? 'primary' : 'default'}
              onClick={() => !isAnalyzing && setIterations(preset.value)}
              disabled={isAnalyzing}
            />
          ))}
          <Typography variant="caption" color="text.secondary">
            ({ITERATION_PRESETS.find((p) => p.value === iterations)?.desc})
          </Typography>
          <Tooltip
            arrow
            title={
              <Box sx={{ p: 0.5, maxWidth: 280 }}>
                <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                  How Monte Carlo Simulation Works
                </Typography>
                <Typography variant="caption" component="div" sx={{ mb: 1 }}>
                  We shuffle your deck thousands of times and simulate opening hands to calculate
                  mulligan thresholds statistically.
                </Typography>
                <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                  What is the margin?
                </Typography>
                <Typography variant="caption" component="div" sx={{ mb: 1 }}>
                  For an observed hand frequency near 72%, 10,000 independent samples give an
                  approximate 95% interval of 71.1–72.9%. This interval does not apply to heuristic
                  scores or Bellman thresholds, and does not include model error.
                </Typography>
                <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                  Which precision to choose?
                </Typography>
                <Typography variant="caption" component="div" sx={{ mb: 0.5 }}>
                  <strong>Quick (3k)</strong> — Fast overview, good enough for casual testing
                </Typography>
                <Typography variant="caption" component="div" sx={{ mb: 0.5 }}>
                  <strong>Standard (10k)</strong> — Reliable for deckbuilding decisions
                </Typography>
                <Typography variant="caption" component="div" sx={{ mb: 1 }}>
                  <strong>Precise (50k)</strong> — Compare builds that differ by 1-2%. May take a
                  few seconds.
                </Typography>
                <Button
                  component="a"
                  href="/mathematics"
                  size="small"
                  variant="text"
                  sx={{ mt: 0.5, p: 0, minWidth: 0, textTransform: 'none', fontSize: '0.75rem' }}
                >
                  Learn the full math behind this →
                </Button>
              </Box>
            }
          >
            <IconButton size="small" sx={{ p: 0.5 }}>
              <HelpIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
            </IconButton>
          </Tooltip>
        </Box>

        {/* Error */}
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {/* Loading */}
        {isAnalyzing && (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <CircularProgress />
            <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
              Running Monte Carlo simulation ({result ? 'updating' : 'initial analysis'})...
            </Typography>
          </Box>
        )}

        {/* Results */}
        {result && !isAnalyzing && (
          <>
            {/* Quality Badge */}
            <Alert
              severity={
                result.deckQuality === 'excellent'
                  ? 'success'
                  : result.deckQuality === 'good'
                    ? 'info'
                    : result.deckQuality === 'average'
                      ? 'warning'
                      : 'error'
              }
              sx={{ mb: 3 }}
            >
              <Typography variant="body2">
                <strong>
                  {result.archetypeConfig.icon} {result.archetypeConfig.name} Deck Quality:{' '}
                </strong>
                {result.deckQuality.toUpperCase()} (Score: {result.qualityScore}/100)
              </Typography>
            </Alert>

            {/* Pedagogical Introduction */}
            <Accordion defaultExpanded sx={{ mb: 3 }}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="subtitle2">How to use this analysis</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Box>
                    <Typography variant="body2" fontWeight="bold" gutterBottom>
                      What is a Mulligan?
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      London mulligan: shuffle your hand into the library and draw seven again.
                      Once you keep, put one card on the bottom for each counted mulligan.
                      The simulator evaluates kept hands from seven down to a forced keep at four cards. Enable multiplayer
                      mode to model a free first mulligan.
                    </Typography>
                  </Box>

                  <Box>
                    <Typography variant="body2" fontWeight="bold" gutterBottom>
                      Understanding the Scores (0–100)
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Each hand gets a heuristic score for its first turns. These hand-quality bands
                      differ from the deck-level Health Score because they measure a different quantity.
                      <strong> 85+</strong> = excellent hand, <strong>70-84</strong> = good,
                      <strong> 55-69</strong> = playable but risky, <strong>&lt;55</strong> =
                      consider mulligan.
                    </Typography>
                  </Box>

                  <Box>
                    <Typography variant="body2" fontWeight="bold" gutterBottom>
                      The Key Decision
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Compare your hand's score to the <strong>"Mull if below"</strong> threshold.
                      If your hand scores lower, statistically you'll get a better 6-card hand by
                      mulliganing.
                    </Typography>
                  </Box>
                </Box>
              </AccordionDetails>
            </Accordion>

            {/* Expected Values */}
            <ExpectedValues result={result} />

            {/* Optimal Strategy */}
            <OptimalStrategy result={result} />

            {/* Distribution Chart */}
            <DistributionChart result={result} />

            {/* Score Legend */}
            <ScoreLegendSection />

            {/* Recommendations */}
            <Paper sx={{ p: 2, mb: 3, mt: 2 }}>
              <Typography
                variant="subtitle2"
                gutterBottom
                sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}
              >
                <LightbulbOutlinedIcon fontSize="small" aria-hidden />
                Recommendations
              </Typography>
              {result.recommendations.map((rec, i) => (
                <Typography key={i} variant="body2" sx={{ mb: 0.5 }}>
                  {rec}
                </Typography>
              ))}
            </Paper>

            {/* Sample Hands */}
            <SampleHandsSection sampleHands={result.sampleHands} />

            {/* Footer */}
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ display: 'block', mt: 2, textAlign: 'center' }}
            >
              Based on {result.iterations.toLocaleString()} samples per hand size (four sizes) using
              a heuristic reward and finite-horizon stopping model
            </Typography>
          </>
        )}
      </Box>
    )
  }
)

export default MulliganTab
