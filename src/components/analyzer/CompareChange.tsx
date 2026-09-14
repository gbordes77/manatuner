import React, { useEffect, useMemo, useRef, useState } from 'react'
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
} from '@mui/material'
import type { AnalysisResult } from '../../services/deckAnalyzer'
import { DeckAnalyzer } from '../../services/deckAnalyzer'
import { PrivacyStorage, type AnalysisRecord } from '../../lib/privacy'
import { analysisDeckText } from '../../utils/analysisText'
import { COMPARISON_MODEL } from '../../utils/comparison'
import { variantChanges } from '../../utils/variant'
import { ShareContext } from './ShareContext'
import { CompareView } from './CompareView'

export function CompareChange({
  result,
  name,
  onClose,
}: {
  result: AnalysisResult
  name: string
  onClose: () => void
}) {
  // This component is mounted only on explicit entry: A is an immutable snapshot,
  // independent of both the persisted Analyzer draft and every B calculation.
  const [a] = useState<AnalysisRecord>(() => ({
    id: 'original',
    timestamp: Date.now(),
    deckName: name || 'Original',
    deckList: analysisDeckText(result),
    analysis: structuredClone(result),
    consistency: result.consistency,
  }))
  const [draft, setDraft] = useState(a.deckList)
  const [variantName, setVariantName] = useState(`${a.deckName} — variant`)
  const [b, setB] = useState<AnalysisRecord | null>(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [saved, setSaved] = useState(false)
  const pending = useRef<AbortController | null>(null)
  const cancel = () => {
    const current = pending.current
    pending.current = null
    current?.abort()
    setBusy(false)
  }
  useEffect(
    () => () => {
      pending.current?.abort()
      pending.current = null
    },
    []
  )
  const diff = useMemo(() => {
    try {
      return { ...variantChanges(a.deckList, draft), error: '' }
    } catch (e) {
      return {
        changes: [],
        warnings: [],
        commanderChanged: false,
        error: e instanceof Error ? e.message : 'Invalid deck list',
      }
    }
  }, [a.deckList, draft])
  const close = () => {
    cancel()
    onClose()
  }
  const calculate = async () => {
    cancel()
    setB(null)
    setSaved(false)
    setError('')
    if (diff.error || diff.commanderChanged) return
    const controller = new AbortController()
    pending.current = controller
    setBusy(true)
    try {
      const analysis = await DeckAnalyzer.analyzeDeck(draft, { signal: controller.signal })
      if (pending.current !== controller || controller.signal.aborted) return
      setB({
        id: 'draft',
        timestamp: Date.now(),
        deckName: variantName,
        deckList: draft,
        analysis,
        consistency: analysis.consistency,
      })
    } catch (e) {
      if (pending.current === controller && !controller.signal.aborted)
        setError(e instanceof Error ? e.message : 'Analysis failed. Your draft is preserved.')
    } finally {
      if (pending.current === controller) {
        pending.current = null
        setBusy(false)
      }
    }
  }
  const save = () => {
    if (!b) return
    try {
      PrivacyStorage.saveAnalysis({
        ...b,
        deckName: variantName.trim() || `${a.deckName} — variant`,
      })
      setSaved(true)
      setError('')
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not save. Original and draft are preserved.')
    }
  }
  return (
    <Dialog
      open
      onClose={close}
      maxWidth="md"
      fullWidth
      aria-labelledby="compare-change-title"
      PaperProps={{
        sx: {
          backgroundColor: (theme) => (theme.palette.mode === 'dark' ? '#191a1f' : '#ffffff'),
          backgroundImage: 'none',
          m: { xs: 1, sm: 4 },
          width: { xs: 'calc(100% - 16px)', sm: '100%' },
        },
      }}
    >
      <DialogTitle id="compare-change-title" sx={{ color: 'text.primary' }}>
        Compare a change
      </DialogTitle>
      <DialogContent dividers>
        <Typography sx={{ mb: 1 }}>
          Your original A is preserved. You choose the change. B is a temporary draft until you save
          it. Closing discards an unsaved draft.
        </Typography>
        <Box component="details" sx={{ mb: 2 }}>
          <Box component="summary" sx={{ cursor: 'pointer' }}>
            How this comparison works
          </Box>
          <Typography>
            This compares the indicated event, not overall deck strength. No card changes are
            recommended automatically.
          </Typography>
        </Box>
        <Typography variant="h6" component="h3" color="text.primary">
          A — {a.deckName}
        </Typography>
        <Typography>
          {a.analysis.totalCards} library cards · {a.analysis.totalLands} lands
        </Typography>
        <Box component="details" sx={{ my: 1 }}>
          <Box component="summary" sx={{ cursor: 'pointer' }}>
            Original deck by zone
          </Box>
          <Box component="pre" sx={{ whiteSpace: 'pre-wrap', overflowWrap: 'anywhere' }}>
            {a.deckList}
          </Box>
        </Box>
        <Alert severity="info" sx={{ my: 2 }}>
          {COMPARISON_MODEL} Commander stays fixed in this version. Different library populations
          hide deltas.
        </Alert>
        <TextField
          label="Variant name"
          value={variantName}
          onChange={(e) => {
            setVariantName(e.target.value)
            setSaved(false)
          }}
          fullWidth
          inputProps={{ maxLength: 1000 }}
          sx={{ mb: 2 }}
        />
        <TextField
          autoFocus
          label="B — edit your variant deck list"
          multiline
          minRows={5}
          maxRows={14}
          fullWidth
          value={draft}
          onChange={(e) => {
            cancel()
            setDraft(e.target.value)
            setB(null)
            setSaved(false)
            setError('')
          }}
          inputProps={{ maxLength: 20000, spellCheck: false }}
        />
        <Typography variant="h6" component="h3" color="text.primary" sx={{ mt: 2 }}>
          List changes before calculation
        </Typography>
        {diff.error && <Alert severity="error">{diff.error}</Alert>}
        {diff.commanderChanged && (
          <Alert severity="warning">
            Keep the original commander unchanged. Edit the library or sideboard instead.
          </Alert>
        )}
        {diff.warnings.map((w) => (
          <Alert key={w} severity="warning">
            {w}
          </Alert>
        ))}
        <Box component="ul" aria-live="polite" sx={{ pl: 3, overflowWrap: 'anywhere' }}>
          {diff.changes.length ? (
            diff.changes.map((c) => (
              <li key={`${c.section}:${c.name}`}>
                {c.quantity > 0 ? 'Added' : 'Removed'} {Math.abs(c.quantity)} {c.name} (
                {c.section === 'main' ? 'library' : c.section})
              </li>
            ))
          ) : (
            <li>No changes.</li>
          )}
        </Box>
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', my: 2 }}>
          <Button
            variant="contained"
            onClick={calculate}
            disabled={busy || !!diff.error || diff.commanderChanged || !diff.changes.length}
          >
            Analyze variant
          </Button>
          {busy && <Button onClick={cancel}>Cancel variant calculation</Button>}
        </Box>
        {busy && <Typography role="status">Analyzing variant…</Typography>}
        {error && <Alert severity="error">{error}</Alert>}
        {b && (
          <>
            <CompareView a={a} b={{ ...b, deckName: variantName }} />
            <ShareContext
              result={a.analysis}
              name={a.deckName}
              comparison={{ ...b, deckName: variantName }}
            />
          </>
        )}
        {saved && (
          <Alert severity="success">
            Variant saved separately in My Analyses. Original A was not changed.
          </Alert>
        )}
      </DialogContent>
      <DialogActions sx={{ flexWrap: 'wrap', gap: 1 }}>
        <Button onClick={close}>{saved ? 'Close comparison' : 'Discard variant'}</Button>
        <Button variant="contained" onClick={save} disabled={!b || busy || saved}>
          Save variant separately
        </Button>
      </DialogActions>
    </Dialog>
  )
}
