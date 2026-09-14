import React, { useMemo, useState } from 'react'
import {
  Alert,
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  TextField,
  Typography,
} from '@mui/material'
import type { AnalysisResult } from '../../services/deckAnalyzer'
import { analysisContextText, analysisDeckText } from '../../utils/analysisText'
import {
  comparisonBlockReason,
  formatComparisonDelta,
  formatComparisonPercentage,
  savedSpellResult,
} from '../../utils/comparison'
import type { AnalysisRecord } from '../../lib/privacy'

export function ShareContext({
  result,
  name,
  comparison,
}: {
  result: AnalysisResult
  name: string
  comparison?: AnalysisRecord
}) {
  const [includeName, setIncludeName] = useState(false)
  const [includeDeck, setIncludeDeck] = useState(false)
  const [status, setStatus] = useState('')
  const text = useMemo(() => {
    const a: AnalysisRecord = {
      id: 'a',
      timestamp: 0,
      deckName: name,
      deckList: '',
      analysis: result,
    }
    const lines = [analysisContextText(result, includeName ? name : undefined)]
    if (comparison) {
      lines.push(
        '',
        'COMPARISON A → B',
        analysisContextText(comparison.analysis, includeName ? comparison.deckName : undefined)
      )
      const blocked = comparisonBlockReason(a, comparison)
      if (blocked) lines.push(blocked, 'Deltas unavailable.')
      const names = [
        ...new Set(
          result.cards
            .filter(
              (c) =>
                !c.isLand &&
                !c.isCommander &&
                !c.isSideboard &&
                comparison.analysis.cards.some(
                  (d: {
                    name: string
                    isSideboard?: boolean
                    isCommander?: boolean
                    isLand?: boolean
                  }) => d.name === c.name && !d.isSideboard && !d.isCommander && !d.isLand
                )
            )
            .map((c) => c.name)
        ),
      ]
      for (const spell of names) {
        const av = savedSpellResult(a, spell),
          bv = savedSpellResult(comparison, spell)
        lines.push(
          `${spell}: A ${formatComparisonPercentage(av.percentage)}; B ${formatComparisonPercentage(bv.percentage)}; ${!blocked && av.percentage !== undefined && bv.percentage !== undefined ? `${formatComparisonDelta(bv.percentage - av.percentage, ' points')}` : 'delta unavailable'}. ${av.reason || ''} ${bv.reason || ''}`
        )
      }
      if (!names.length) lines.push('No common library spells to compare.')
    }
    if (includeDeck)
      lines.push(
        '',
        'A — deck by zone',
        analysisDeckText(result),
        ...(comparison ? ['', 'B — deck by zone', analysisDeckText(comparison.analysis)] : [])
      )
    return lines.join('\n')
  }, [result, name, comparison, includeName, includeDeck])
  return (
    <Box>
      <Typography variant="body2">
        Share links contain deck, name and tab, not model settings.
      </Typography>
      <Box component="details" sx={{ my: 2 }} onToggle={() => setStatus('')}>
        <Box component="summary" sx={{ cursor: 'pointer' }}>
          Preview context to share (optional)
        </Box>
        <Typography variant="body2">
          The link contains deck, name and tab, not model settings. This optional text is separate
          from the link.
        </Typography>
        <FormControlLabel
          control={
            <Checkbox
              checked={includeName}
              onChange={(e) => {
                setIncludeName(e.target.checked)
                setStatus('')
              }}
            />
          }
          label="Include deck name"
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={includeDeck}
              onChange={(e) => {
                setIncludeDeck(e.target.checked)
                setStatus('')
              }}
            />
          }
          label="Include deck list"
        />
        <TextField
          label="Context preview"
          multiline
          minRows={5}
          maxRows={12}
          fullWidth
          value={text}
          InputProps={{ readOnly: true }}
          sx={{ my: 1 }}
        />
        <Button
          onClick={async () => {
            try {
              await navigator.clipboard.writeText(text)
              setStatus('Context copied.')
            } catch {
              setStatus('Copy unavailable. Select and copy the preview text manually.')
            }
          }}
        >
          Copy context text
        </Button>
        {status && <Alert severity="info">{status}</Alert>}
      </Box>
    </Box>
  )
}
