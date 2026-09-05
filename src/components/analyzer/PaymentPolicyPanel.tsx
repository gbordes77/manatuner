import {
  Alert,
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  MenuItem,
  Paper,
  TextField,
  Typography,
} from '@mui/material'
import { useEffect, useRef, useState } from 'react'
import type { DeckCard } from '../../services/deckAnalyzer'
import { policyDeck } from '../../services/paymentPolicy/deck'
import type { PaymentKind, PolicyInput, PolicyResult } from '../../services/paymentPolicy/types'

/** A separate, versioned policy; never substitutes for a saved physical-v1 result. */
export default function PaymentPolicyPanel({ cards }: { cards: DeckCard[] }) {
  const [cost, setCost] = useState('{G}')
  const [turn, setTurn] = useState(2)
  const [life, setLife] = useState(20)
  const [floor, setFloor] = useState(1)
  const [x, setX] = useState(2)
  const [kind, setKind] = useState<PaymentKind>('other')
  const [draw, setDraw] = useState<'PLAY' | 'DRAW'>('PLAY')
  const [identity, setIdentity] = useState('')
  const [resources, setResources] = useState(true)
  const [result, setResult] = useState<PolicyResult | null>(null)
  const [running, setRunning] = useState(false)
  const worker = useRef<Worker | null>(null)
  const generation = useRef(0)
  const snapshot = useRef<PolicyInput | null>(null)
  useEffect(() => {
    const version = generation
    version.current++
    worker.current?.terminate()
    worker.current = null
    setResult(null)
    setRunning(false)
    snapshot.current = null
    return () => {
      version.current++
      worker.current?.terminate()
    }
  }, [cards, cost, turn, life, floor, x, kind, draw, identity, resources])
  const calculate = () => {
    const compiled = policyDeck(
      cards,
      resources,
      identity === '' ? undefined : identity === 'C' ? [] : Array.from(identity.toUpperCase())
    )
    if ('reason' in compiled) {
      setResult({
        status: 'unsupported',
        model: 'payment-policy-v2',
        code: 'metadata',
        reason: compiled.reason,
      })
      return
    }
    const input: PolicyInput = {
      cards: compiled.cards,
      cost,
      turn,
      playDraw: draw,
      targetKind: kind,
      life,
      lifeFloor: floor,
      x,
      maxWork: 250_000,
    }
    snapshot.current = input
    const id = ++generation.current
    worker.current?.terminate()
    setResult(null)
    setRunning(true)
    try {
      const next = new Worker(new URL('../../workers/paymentPolicy.worker.ts', import.meta.url), {
        type: 'module',
      })
      worker.current = next
      next.onmessage = (event: MessageEvent<{ id: number; result: PolicyResult }>) => {
        if (event.data.id !== generation.current) return
        setResult(event.data.result)
        setRunning(false)
        next.terminate()
        worker.current = null
      }
      next.onerror = () => {
        if (id !== generation.current) return
        setResult({
          status: 'unsupported',
          model: 'payment-policy-v2',
          code: 'execution',
          reason: 'Worker unavailable; no probability calculated',
        })
        setRunning(false)
        next.terminate()
        worker.current = null
      }
      next.postMessage({ id, input })
    } catch {
      worker.current?.terminate()
      worker.current = null
      setRunning(false)
      setResult({
        status: 'unsupported',
        model: 'payment-policy-v2',
        code: 'execution',
        reason: 'Worker unavailable; no probability calculated',
      })
    }
  }
  const cancel = () => {
    generation.current++
    worker.current?.terminate()
    worker.current = null
    setRunning(false)
    setResult(null)
  }
  const download = () => {
    if (!result || !snapshot.current) return
    const record = { model: 'payment-policy-v2', input: snapshot.current, result }
    const url = URL.createObjectURL(
      new Blob([JSON.stringify(record, null, 2)], { type: 'application/json' })
    )
    const link = document.createElement('a')
    link.href = url
    link.download = 'manatuner-payment-policy-v2.json'
    link.click()
    URL.revokeObjectURL(url)
  }
  return (
    <Paper variant="outlined" sx={{ p: 2, my: 2 }} data-testid="payment-policy-panel">
      <Typography variant="h6">Payment strategy — no foresight</Typography>
      <Alert severity="info" sx={{ my: 1 }}>
        Separate model: payment at the target main phase using the best represented mana-resource
        decisions, without seeing future draws. The target is external; its chance of being drawn is
        excluded. No mulligan, opponent or non-mana spell effects. Existing potential scores and
        saved comparisons keep their original model.
      </Alert>
      <Typography variant="body2" sx={{ mb: 2 }}>
        Audited searches, land/spell faces, snow, hybrid and life costs, filters, rituals, treasures
        and ramp. Unknown resource contracts and exceeded budgets remain unavailable.
      </Typography>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
        <TextField
          label="Target mana cost"
          value={cost}
          onChange={(e) => setCost(e.target.value)}
          size="small"
        />
        <TextField
          label="Target turn"
          type="number"
          value={turn}
          onChange={(e) => setTurn(Number(e.target.value))}
          inputProps={{ min: 1, max: 10 }}
          size="small"
        />
        <TextField
          label="X value"
          type="number"
          value={x}
          onChange={(e) => setX(Number(e.target.value))}
          inputProps={{ min: 0, max: 100 }}
          size="small"
        />
        <TextField
          label="Starting life"
          type="number"
          value={life}
          onChange={(e) => setLife(Number(e.target.value))}
          size="small"
        />
        <TextField
          label="Minimum life to retain"
          type="number"
          value={floor}
          onChange={(e) => setFloor(Number(e.target.value))}
          size="small"
        />
        <TextField
          select
          label="Target kind"
          value={kind}
          onChange={(e) => setKind(e.target.value as PaymentKind)}
          size="small"
        >
          <MenuItem value="other">Noncreature spell</MenuItem>
          <MenuItem value="creature">Creature spell</MenuItem>
          <MenuItem value="ability">Activated ability</MenuItem>
        </TextField>
        <TextField
          select
          label="First-turn draw"
          value={draw}
          onChange={(e) => setDraw(e.target.value as 'PLAY' | 'DRAW')}
          size="small"
        >
          <MenuItem value="PLAY">No (duel, on play)</MenuItem>
          <MenuItem value="DRAW">Yes (draw / multiplayer)</MenuItem>
        </TextField>
        <TextField
          label="Commander identity for Arcane Signet"
          placeholder="WUBRG letters, or C for colorless"
          value={identity}
          onChange={(e) => setIdentity(e.target.value)}
          size="small"
        />
      </Box>
      <FormControlLabel
        control={<Checkbox checked={resources} onChange={(e) => setResources(e.target.checked)} />}
        label="Include audited mana resource spells"
      />
      <Box sx={{ display: 'flex', gap: 1 }}>
        <Button variant="contained" onClick={calculate} disabled={running}>
          Calculate payment strategy
        </Button>
        {running && <Button onClick={cancel}>Cancel calculation</Button>}
        {result && snapshot.current && <Button onClick={download}>Export policy JSON</Button>}
      </Box>
      {running && <Typography role="status">Calculating in background…</Typography>}
      {result && (
        <Box role="status" sx={{ mt: 2 }}>
          {result.status === 'exact' ? (
            <>
              <Typography>
                Policy payment probability: {(result.probability * 100).toFixed(2)}%
              </Typography>
              <Typography variant="caption">
                Exact for the represented policy model (payment-policy-v2), with floating-point
                arithmetic. {result.work.toLocaleString()} work units.
              </Typography>
            </>
          ) : (
            <Alert severity="info">Calculation unavailable: {result.reason}</Alert>
          )}
        </Box>
      )}
    </Paper>
  )
}
