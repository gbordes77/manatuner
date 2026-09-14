import React from 'react'
import { Alert, Box, Button, Chip, Paper, Typography } from '@mui/material'
import CompareIcon from '@mui/icons-material/CompareArrows'
import type { AnalysisRecord } from '../../lib/privacy'
import { SCORE_DEFINITIONS } from '../../data/scoreDefinitions'
import { healthScoreBand } from '../../utils/healthScore'
import {
  COMPARISON_MODEL,
  savedSpellResult,
  formatComparisonPercentage,
  formatComparisonDelta,
  groupComparisonReasons,
  comparisonBlockReason,
  sameHealthQuestion,
} from '../../utils/comparison'
// ─── Delta Display Helper ───────────────────────────────────────────────────

const DeltaChip: React.FC<{ value: number; suffix?: string }> = ({ value, suffix = '' }) => {
  if (value === 0) return <Chip label="=" size="small" variant="outlined" />
  const positive = value > 0
  return (
    <Chip
      label={formatComparisonDelta(value, suffix)}
      size="small"
      sx={{
        fontWeight: 'bold',
        bgcolor: positive ? '#e8f5e9' : '#ffebee',
        color: positive ? '#2e7d32' : '#c62828',
      }}
    />
  )
}

// ─── Health Badge ───────────────────────────────────────────────────────────

const HealthBadge: React.FC<{
  consistency: number
  unavailable?: boolean
  size?: 'small' | 'large'
}> = ({ consistency, unavailable, size = 'large' }) => {
  if (unavailable) return <Typography color="text.secondary">Health Score unavailable</Typography>
  const percent = Math.round(consistency * 100)
  const { label, severity } = healthScoreBand(percent)
  const color = severity === 'info' ? 'primary' : severity

  return (
    <Box sx={{ textAlign: 'center' }}>
      <Typography
        variant={size === 'large' ? 'h4' : 'h5'}
        fontWeight="bold"
        color={`${color}.main`}
      >
        {percent}%
      </Typography>
      <Chip
        label={label}
        color={color as 'success' | 'primary' | 'warning' | 'error'}
        size="small"
      />
    </Box>
  )
}

// ─── Compare View ───────────────────────────────────────────────────────────

export const CompareView: React.FC<{
  a: AnalysisRecord
  b: AnalysisRecord
  onLoad?: (record: AnalysisRecord) => void
}> = ({ a, b, onLoad }) => {
  const getStats = (record: AnalysisRecord) => ({
    name: record.deckName || 'Unnamed Deck',
    unavailable: Boolean(record.analysis?.consistencyUnavailable),
    consistency: record.consistency ?? record.analysis?.consistency ?? 0,
    totalCards: record.analysis?.totalCards || 0,
    totalLands: record.analysis?.totalLands || 0,
    avgCMC: record.analysis?.averageCMC || 0,
    landRatio: record.analysis?.landRatio || 0,
    colors: record.analysis?.colorDistribution
      ? (['W', 'U', 'B', 'R', 'G'] as const).filter(
          (k) => (record.analysis.colorDistribution[k] as number) > 0
        )
      : [],
    probabilities: record.analysis?.probabilities || null,
    cards: record.analysis?.cards || [],
    spellAnalysisModel: (record.analysis as any)?.spellAnalysisModel,
    spellAnalysis: (record.analysis?.spellAnalysis || {}) as Record<
      string,
      { castable: number; total: number; percentage: number }
    >,
  })

  const blocked = comparisonBlockReason(a, b)
  const healthComparable = sameHealthQuestion(a, b)
  const sa = getStats(a)
  const sb = getStats(b)

  // Find common spells for castability comparison
  type SpellInfo = {
    name: string
    cmc: number
    manaCost: string
    isLand?: boolean
    isSideboard?: boolean
    isCommander?: boolean
  }
  const spellsA = new Map<string, SpellInfo>(
    (sa.cards as SpellInfo[])
      .filter((c) => !c.isLand && !c.isSideboard && !c.isCommander)
      .map((c) => [c.name, c])
  )
  const spellsB = new Map<string, SpellInfo>(
    (sb.cards as SpellInfo[])
      .filter((c) => !c.isLand && !c.isSideboard && !c.isCommander)
      .map((c) => [c.name, c])
  )
  const commonSpells = [...spellsA.keys()].filter((name) => spellsB.has(name))
  const reasonGroups = groupComparisonReasons(a, b, commonSpells)

  const StatRow: React.FC<{
    label: string
    va: string
    vb: string
    delta?: number
    suffix?: string
  }> = ({ label, va, vb, delta, suffix = '' }) => (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        py: 1.5,
        px: 2,
        '&:nth-of-type(odd)': { bgcolor: 'action.hover' },
        borderRadius: 1,
      }}
    >
      <Typography variant="body2" sx={{ flex: 1, fontWeight: 500 }}>
        {label}
      </Typography>
      <Typography variant="body2" sx={{ width: 80, textAlign: 'center' }}>
        {va}
      </Typography>
      <Box sx={{ width: 100, textAlign: 'center' }}>
        {!blocked && delta !== undefined ? <DeltaChip value={delta} suffix={suffix} /> : null}
      </Box>
      <Typography variant="body2" sx={{ width: 80, textAlign: 'center' }}>
        {vb}
      </Typography>
    </Box>
  )

  const consistencyDelta = (sb.consistency - sa.consistency) * 100

  return (
    <Box role="region" aria-label="Saved build comparison" tabIndex={0} sx={{ overflowX: 'auto' }}>
      <Box sx={{ minWidth: 540 }}>
        {blocked && (
          <Alert severity="warning">{blocked} Probability and score deltas are hidden.</Alert>
        )}
        {/* Header */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 3,
            p: 2,
            bgcolor: 'action.hover',
            borderRadius: 2,
          }}
        >
          <Box sx={{ flex: 1, textAlign: 'center' }}>
            <Typography variant="h6" fontWeight="bold">
              {sa.name}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Version A
            </Typography>
          </Box>
          <CompareIcon sx={{ mx: 2, color: 'text.secondary' }} />
          <Box sx={{ flex: 1, textAlign: 'center' }}>
            <Typography variant="h6" fontWeight="bold">
              {sb.name}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Version B
            </Typography>
          </Box>
        </Box>

        {!healthComparable && (
          <Alert severity="info">
            The spell costs change the question used by Health Score. Health and Consistency deltas
            are hidden; each value remains a separate heuristic.
          </Alert>
        )}
        {/* Health Score comparison */}
        <Paper sx={{ p: 3, mb: 3, textAlign: 'center' }}>
          <Typography variant="caption">{SCORE_DEFINITIONS.health}</Typography>
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            Health Score
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
            <HealthBadge consistency={sa.consistency} unavailable={sa.unavailable} />
            <Box>
              {!blocked && healthComparable && !sa.unavailable && !sb.unavailable && (
                <DeltaChip value={consistencyDelta} suffix=" points" />
              )}
            </Box>
            <HealthBadge consistency={sb.consistency} unavailable={sb.unavailable} />
          </Box>
        </Paper>

        {/* Stats comparison */}
        <Paper sx={{ mb: 3, overflow: 'hidden' }}>
          <Box sx={{ display: 'flex', py: 1.5, px: 2, bgcolor: 'primary.main', color: 'white' }}>
            <Typography variant="subtitle2" sx={{ flex: 1 }}>
              Metric
            </Typography>
            <Typography variant="subtitle2" sx={{ width: 80, textAlign: 'center' }}>
              A
            </Typography>
            <Typography variant="subtitle2" sx={{ width: 100, textAlign: 'center' }}>
              Delta
            </Typography>
            <Typography variant="subtitle2" sx={{ width: 80, textAlign: 'center' }}>
              B
            </Typography>
          </Box>
          <StatRow
            label="Total Cards"
            va={String(sa.totalCards)}
            vb={String(sb.totalCards)}
            delta={sb.totalCards - sa.totalCards}
          />
          <StatRow
            label="Total Lands"
            va={String(sa.totalLands)}
            vb={String(sb.totalLands)}
            delta={sb.totalLands - sa.totalLands}
          />
          <StatRow
            label="Land Ratio"
            va={`${(sa.landRatio * 100).toFixed(1)}%`}
            vb={`${(sb.landRatio * 100).toFixed(1)}%`}
            delta={(sb.landRatio - sa.landRatio) * 100}
            suffix=" points"
          />
          <StatRow
            label="Avg CMC"
            va={sa.avgCMC.toFixed(2)}
            vb={sb.avgCMC.toFixed(2)}
            delta={sb.avgCMC - sa.avgCMC}
          />
          <StatRow
            label="Consistency"
            va={sa.unavailable ? 'Unavailable' : `${(sa.consistency * 100).toFixed(1)}%`}
            vb={sb.unavailable ? 'Unavailable' : `${(sb.consistency * 100).toFixed(1)}%`}
            delta={
              !healthComparable || sa.unavailable || sb.unavailable ? undefined : consistencyDelta
            }
            suffix=" points"
          />
        </Paper>

        {/* Turn probabilities comparison */}
        {sa.probabilities && sb.probabilities && (
          <Paper sx={{ mb: 3, overflow: 'hidden' }}>
            <Box sx={{ py: 1.5, px: 2, bgcolor: 'secondary.main', color: 'white' }}>
              <Typography variant="subtitle2">Color Probability by Turn (Any Color)</Typography>
            </Box>
            {(['turn1', 'turn2', 'turn3', 'turn4'] as const).map((turn) => {
              const pa = sa.probabilities?.[turn]?.anyColor ?? 0
              const pb = sb.probabilities?.[turn]?.anyColor ?? 0
              return (
                <StatRow
                  key={turn}
                  label={turn.replace('turn', 'Turn ')}
                  va={`${(pa * 100).toFixed(1)}%`}
                  vb={`${(pb * 100).toFixed(1)}%`}
                  delta={(pb - pa) * 100}
                  suffix=" points"
                />
              )
            })}
          </Paper>
        )}

        <Alert severity="info" sx={{ mb: 2 }}>
          {COMPARISON_MODEL}
          <Box sx={{ mt: 1, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            {onLoad && <Button onClick={() => onLoad(a)}>Load A in Analyzer</Button>}
            {onLoad && <Button onClick={() => onLoad(b)}>Load B in Analyzer</Button>}
            <Button href="/analyzer?sample=exact">Try the basic-land exact example</Button>
          </Box>
        </Alert>
        {commonSpells.length === 0 && (
          <Alert severity="info">
            No common library spells to compare. No spell delta is available.
          </Alert>
        )}
        {/* Common spells castability delta */}
        {commonSpells.length > 0 && (
          <Paper sx={{ overflow: 'hidden' }}>
            <Box sx={{ py: 1.5, px: 2, bgcolor: '#e65100', color: 'white' }}>
              <Typography variant="subtitle2">
                Castability Comparison ({commonSpells.length} common spells)
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', py: 1, px: 2, bgcolor: 'action.selected' }}>
              <Typography variant="caption" sx={{ flex: 1, fontWeight: 600 }}>
                Spell
              </Typography>
              <Typography
                variant="caption"
                sx={{ width: 80, textAlign: 'center', fontWeight: 600 }}
              >
                A
              </Typography>
              <Typography
                variant="caption"
                sx={{ width: 100, textAlign: 'center', fontWeight: 600 }}
              >
                Delta
              </Typography>
              <Typography
                variant="caption"
                sx={{ width: 80, textAlign: 'center', fontWeight: 600 }}
              >
                B
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ p: 2 }}>
              A:{' '}
              {
                commonSpells.filter((name) => savedSpellResult(a, name).percentage !== undefined)
                  .length
              }
              /{commonSpells.length} calculated. B:{' '}
              {
                commonSpells.filter((name) => savedSpellResult(b, name).percentage !== undefined)
                  .length
              }
              /{commonSpells.length} calculated. Missing calculations are not zero-risk spells.
              Deltas require both values under this same model.
            </Typography>
            {reasonGroups.length > 0 && (
              <Box data-testid="comparison-unavailable-reasons" sx={{ px: 2, pb: 2 }}>
                <Typography variant="subtitle2">Why results are unavailable</Typography>
                {reasonGroups.map((group, index) => (
                  <Box key={group.reason} sx={{ mt: 1 }}>
                    <Typography variant="body2">
                      Reason {index + 1}: {group.reason}
                    </Typography>
                    <Box component="details">
                      <Box component="summary" sx={{ cursor: 'pointer' }}>
                        Affected spells — A: {group.a.length}, B: {group.b.length}
                      </Box>
                      {group.a.length > 0 && (
                        <Typography variant="body2">A: {group.a.join(', ')}</Typography>
                      )}
                      {group.b.length > 0 && (
                        <Typography variant="body2">B: {group.b.join(', ')}</Typography>
                      )}
                    </Box>
                  </Box>
                ))}
              </Box>
            )}
            {commonSpells.map((name) => {
              const resultA = savedSpellResult(a, name)
              const resultB = savedSpellResult(b, name)
              const probaA = resultA.percentage
              const probaB = resultB.percentage
              const delta =
                probaA === undefined || probaB === undefined ? undefined : probaB - probaA
              const cardA = spellsA.get(name)
              return (
                <Box key={name} data-testid="comparison-spell">
                  <StatRow
                    label={`${name} (${cardA?.cmc ?? 0} CMC)`}
                    va={formatComparisonPercentage(probaA)}
                    vb={formatComparisonPercentage(probaB)}
                    delta={delta}
                    suffix=" points"
                  />
                  {resultA.reason && (
                    <Typography variant="caption" display="block" sx={{ px: 2, pb: 1 }}>
                      A — Reason{' '}
                      {reasonGroups.findIndex((group) => group.reason === resultA.reason) + 1}
                    </Typography>
                  )}
                  {resultB.reason && (
                    <Typography variant="caption" display="block" sx={{ px: 2, pb: 1 }}>
                      B — Reason{' '}
                      {reasonGroups.findIndex((group) => group.reason === resultB.reason) + 1}
                    </Typography>
                  )}
                </Box>
              )
            })}
          </Paper>
        )}
      </Box>
    </Box>
  )
}
