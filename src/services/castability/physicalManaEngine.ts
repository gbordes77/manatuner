/** Exact probability that a drawn history admits at least one legal mana sequence.
 * Goldfish, no mulligan, target spell treated as an external mana demand.
 * This is potential castability (an upper bound for a policy without foresight),
 * not a win rate. Unsupported mechanics and resource limits yield no probability.
 */
import { auditedPathwayColors } from '../../data/auditedPathways'
import type { ETBCondition, LandMetadata } from '../../types/lands'
import type { DeckManaProfile, ProducerInDeck, ProducerManaCost } from '../../types/manaProducers'

export type PhysicalManaResult =
  | { status: 'exact'; p1: number; p2: number; histories: number }
  | { status: 'unsupported'; reason: string }

type Cost = { generic: number; symbols: number[] }
type Source = {
  name?: string
  faceMasks?: number[]
  faceIndices?: number[]
  count: number
  land: boolean
  mask: number
  amount: number
  delay: number
  entry?: ETBCondition
  basic?: boolean
  basicTypes?: string[]
  cost: Cost
}
type State = {
  hand: number[]
  board: number[]
  ready: number[]
  pool: number[]
  landPlayed: boolean
}
const colors = ['W', 'U', 'B', 'R', 'G', 'C'] as const
const mask = (list: readonly string[]) =>
  list.reduce((m, c) => m | (1 << colors.indexOf(c as (typeof colors)[number])), 0)
const emptyCost = (): Cost => ({ generic: 0, symbols: [] })
const clone = (s: State): State => ({
  hand: [...s.hand],
  board: [...s.board],
  ready: [...s.ready],
  pool: [...s.pool],
  landPlayed: s.landPlayed,
})
const key = (s: State) => JSON.stringify([s.hand, s.board, s.ready, s.pool, s.landPlayed])

function costOf(cost: ProducerManaCost): Cost | null {
  if (cost.unsupportedSymbols || !Number.isSafeInteger(cost.generic) || cost.generic < 0)
    return null
  const symbols: number[] = []
  for (let i = 0; i < colors.length; i++) {
    const n = cost.pips[colors[i]] ?? 0
    if (!Number.isSafeInteger(n) || n < 0 || n > 100) return null
    for (let j = 0; j < n; j++) symbols.push(1 << i)
  }
  for (const h of cost.hybrid ?? []) {
    if (!Number.isSafeInteger(h) || h <= 0 || h > 63) return null
    symbols.push(h)
  }
  if (cost.mv !== cost.generic + symbols.length) return null
  return { generic: cost.generic, symbols }
}

/** Enumerate distinct remaining pools after payment; mana is never spent twice. */
function pay(pool: number[], cost: Cost): number[][] {
  if (pool.reduce((a, b) => a + b, 0) < cost.generic + cost.symbols.length) return []
  const out = new Map<string, number[]>()
  function generic(left: number, index: number, p: number[]) {
    if (left === 0) {
      out.set(p.join(','), p)
      return
    }
    for (let i = index; i < p.length; i++)
      if (p[i] > 0) {
        const next = [...p]
        next[i]--
        generic(left - 1, i, next)
      }
  }
  function colored(index: number, p: number[]) {
    if (index === cost.symbols.length) {
      generic(cost.generic, 0, p)
      return
    }
    for (let i = 0; i < 6; i++)
      if (p[i] > 0 && cost.symbols[index] & (1 << i)) {
        const next = [...p]
        next[i]--
        colored(index + 1, next)
      }
  }
  colored(0, pool)
  return [...out.values()]
}

function landSource(land: LandMetadata): Source | string {
  if (land.category === 'pathway') {
    const faces = auditedPathwayColors(land)
    if (!faces) return `Unsupported pathway face metadata: ${land.name}`
    return {
      count: 1,
      land: true,
      mask: 0,
      amount: 1,
      delay: 0,
      faceMasks: faces.map((c) => mask([c])),
      cost: emptyCost(),
    }
  }
  if (land.produces.some((c) => !colors.includes(c))) return `Invalid produced mana: ${land.name}`
  if (
    land.isFetch ||
    land.producesAnyForCreaturesOnly ||
    !['basic', 'dual', 'triome', 'fast', 'slow', 'check', 'battle'].includes(land.category) ||
    land.isMDFC
  )
    return `Unsupported land restriction: ${land.name}`
  const entry = land.etbBehavior.type === 'conditional' ? land.etbBehavior.condition : undefined
  if (land.etbBehavior.type === 'conditional') {
    if (
      !entry ||
      !['control_lands_max', 'control_lands_min', 'control_basic', 'control_basics_min'].includes(
        entry.type
      )
    )
      return `Unsupported conditional entry: ${land.name}`
    if (entry.type === 'control_basic') {
      if (
        !entry.basicTypes?.length ||
        entry.basicTypes.some(
          (t) => !['Plains', 'Island', 'Swamp', 'Mountain', 'Forest'].includes(t)
        )
      )
        return `Invalid required land types: ${land.name}`
    } else if (!Number.isSafeInteger(entry.threshold) || entry.threshold! < 0) {
      return `Invalid land threshold: ${land.name}`
    }
  }
  const sourceMask = (land.producesAny ? 31 : 0) | mask(land.produces)
  const amount = land.producesAmount ?? 1
  if (
    !sourceMask ||
    !Number.isSafeInteger(amount) ||
    amount < 1 ||
    (amount > 1 && (sourceMask & (sourceMask - 1)) !== 0)
  )
    return `Unsupported mana production: ${land.name}`
  return {
    count: 1,
    land: true,
    mask: sourceMask,
    amount,
    delay: land.etbBehavior.type === 'always_tapped' ? 1 : 0,
    cost: emptyCost(),
    entry,
    basic: land.category === 'basic',
    basicTypes: land.basicLandTypes ?? [],
  }
}

function sourceModel(
  deck: DeckManaProfile,
  spell: ProducerManaCost,
  producers: ProducerInDeck[]
): Source[] | string {
  const sources: Source[] = []
  if (deck.physicalLands) {
    if (deck.physicalLands.length !== deck.totalLands)
      return 'Physical land count does not match deck profile'
    for (const land of deck.physicalLands) {
      const s = landSource(land)
      if (typeof s === 'string') return s
      sources.push(s)
    }
  } else {
    if (deck.unconditionalMultiMana) return 'Physical multi-mana land identities are required'
    const relevant = new Set<string>(
      Object.keys(spell.pips).filter((c) => (spell.pips[c as (typeof colors)[number]] ?? 0) > 0)
    )
    for (const h of spell.hybrid ?? [])
      colors.forEach((c, i) => {
        if (h & (1 << i)) relevant.add(c)
      })
    for (const p of producers)
      Object.entries(p.def.castCostColors).forEach(([c, n]) => {
        if (n) relevant.add(c)
      })
    const needed = [...relevant]
    if (
      needed.length > 1 &&
      !needed.every((c) => deck.landColorSources[c as (typeof colors)[number]] === deck.totalLands)
    )
      return 'Physical land identities are required for joint color probabilities'
    const K =
      needed.length === 0 ? 0 : (deck.landColorSources[needed[0] as (typeof colors)[number]] ?? 0)
    if (!Number.isSafeInteger(K) || K < 0 || K > deck.totalLands) return 'Invalid source count'
    // Bit 6 is unspecified off-color mana: can pay generic, never a colored/C pip.
    if (K)
      sources.push({
        count: K,
        land: true,
        mask: mask(needed),
        amount: 1,
        delay: 0,
        cost: emptyCost(),
      })
    if (deck.totalLands > K)
      sources.push({
        count: deck.totalLands - K,
        land: true,
        mask: 64,
        amount: 1,
        delay: 0,
        cost: emptyCost(),
      })
  }
  // Only independently audited activation contracts are admitted in exact mode.
  const auditedProducers: Record<
    string,
    { generic: number; green: number; output: number; amount: number; delay: number }
  > = {
    'Llanowar Elves': { generic: 0, green: 1, output: 16, amount: 1, delay: 1 },
    'Elvish Mystic': { generic: 0, green: 1, output: 16, amount: 1, delay: 1 },
    'Fyndhorn Elves': { generic: 0, green: 1, output: 16, amount: 1, delay: 1 },
    'Birds of Paradise': { generic: 0, green: 1, output: 31, amount: 1, delay: 1 },
    'Sol Ring': { generic: 1, green: 0, output: 32, amount: 2, delay: 0 },
  }
  for (const { def, copies } of producers) {
    if (!Number.isSafeInteger(copies) || copies < 0) return 'Invalid producer count'
    if (!copies) continue
    const audited = auditedProducers[def.name]
    if (
      !audited ||
      def.castCostGeneric !== audited.generic ||
      (def.castCostColors.G ?? 0) !== audited.green ||
      Object.entries(def.castCostColors).some(([c, n]) => c !== 'G' && n) ||
      (def.producesAny ? 31 : def.producesMask) !== audited.output ||
      def.producesAmount !== audited.amount ||
      def.delay !== audited.delay
    )
      return `Producer activation has not been audited: ${def.name}`
    if (
      !['DORK', 'ROCK'].includes(def.type) ||
      def.oneShot ||
      def.activationTax !== 0 ||
      ![0, 1].includes(def.delay)
    )
      return `Unsupported producer mechanic: ${def.name}`
    const sourceMask = def.producesAny ? 31 : def.producesMask
    if (
      !Number.isSafeInteger(def.producesAmount) ||
      def.producesAmount < 1 ||
      (def.producesAmount > 1 && (sourceMask & (sourceMask - 1)) !== 0)
    )
      return `Unsupported producer output: ${def.name}`
    const mv =
      def.castCostGeneric + Object.values(def.castCostColors).reduce((a, b) => a + (b ?? 0), 0)
    const cost = costOf({ mv, generic: def.castCostGeneric, pips: def.castCostColors })
    if (!cost || sourceMask <= 0 || sourceMask > 63) return `Invalid producer: ${def.name}`
    sources.push({
      name: def.name,
      count: copies,
      land: false,
      mask: sourceMask,
      amount: def.producesAmount,
      delay: def.delay,
      cost,
    })
  }
  const grouped = new Map<string, Source>()
  for (const s of sources) {
    const k = JSON.stringify({ ...s, count: 0 })
    const prev = grouped.get(k)
    if (prev) prev.count += s.count
    else grouped.set(k, { ...s })
  }
  const result = [...grouped.values()]
  // Face permanents have zero library population. Playing one physical card chooses
  // exactly one board slot; its color can never be changed by an untap step.
  for (const source of [...result]) {
    if (!source.faceMasks) continue
    source.faceIndices = source.faceMasks.map((faceMask) => {
      const index = result.length
      result.push({ count: 0, land: true, mask: faceMask, amount: 1, delay: 0, cost: emptyCost() })
      return index
    })
  }
  return result
}

function choose(n: number, k: number): number {
  if (k < 0 || k > n) return 0
  let value = 1
  for (let i = 1; i <= Math.min(k, n - k); i++) value = (value * (n - i + 1)) / i
  return value
}

function computePhysicalManaProbability(
  deck: DeckManaProfile,
  spell: ProducerManaCost,
  turn: number,
  producers: ProducerInDeck[] = [],
  playDraw: 'PLAY' | 'DRAW' = 'PLAY',
  maxWork = 250_000,
  onlineProducer?: string
): PhysicalManaResult {
  if (turn > 10 || deck.deckSize > 1000 || !Number.isSafeInteger(maxWork) || maxWork < 1)
    return {
      status: 'unsupported',
      reason:
        'Exact mode supports turns 1–10, libraries up to 1000 cards and a finite state budget',
    }
  const demand = costOf(spell)
  const seen = 7 + turn - (playDraw === 'PLAY' ? 1 : 0)
  if (
    !demand ||
    !Number.isSafeInteger(turn) ||
    turn < 1 ||
    !Number.isSafeInteger(deck.deckSize) ||
    !Number.isSafeInteger(deck.totalLands) ||
    deck.totalLands < 0 ||
    deck.totalLands > deck.deckSize ||
    seen > deck.deckSize
  )
    return { status: 'unsupported', reason: 'Invalid mana cost, population or horizon' }
  const model = sourceModel(deck, spell, producers)
  if (typeof model === 'string') return { status: 'unsupported', reason: model }
  const sources = model,
    g = sources.length
  const counts = [
    ...sources.map((s) => s.count),
    deck.deckSize - sources.reduce((sum, s) => sum + s.count, 0),
  ]
  if (counts[g] < 0)
    return { status: 'unsupported', reason: 'Land and producer counts exceed the library size' }
  // With only untapped one-mana lands, order can be eliminated exactly:
  // one new card per draw step allows any payable subset of at most `turn` lands.
  if (sources.every((s) => s.land && !s.faceMasks && !s.entry && s.delay === 0 && s.amount === 1)) {
    if (onlineProducer)
      return { status: 'unsupported', reason: 'Producer is absent from the source model' }
    if (spell.mv > turn) return { status: 'exact', p1: 0, p2: 0, histories: 0 }
    let visited = 0,
      numerator = 0,
      denominator = 0
    const totalWeight = choose(deck.deckSize, seen)
    const payable = (available: number[], index = 0): boolean => {
      if (index === demand!.symbols.length)
        return available.reduce((a, b) => a + b, 0) >= demand!.generic
      for (let i = 0; i < g; i++)
        if (available[i] && sources[i].mask & demand!.symbols[index]) {
          available[i]--
          const ok = payable(available, index + 1)
          available[i]++
          if (ok) return true
        }
      return false
    }
    const enumerate = (i: number, left: number, picks: number[], weight: number): void => {
      if (++visited > maxWork) throw new Error('Exact state budget exceeded')
      if (i === counts.length) {
        if (left) return
        if (picks.slice(0, g).reduce((a, b) => a + b, 0) < spell.mv) return
        denominator += weight / totalWeight
        if (payable(picks.slice(0, g))) numerator += weight / totalWeight
        return
      }
      for (let k = 0; k <= Math.min(left, counts[i]); k++)
        enumerate(i + 1, left - k, [...picks, k], weight * choose(counts[i], k))
    }
    try {
      enumerate(0, seen, [], 1)
    } catch (error) {
      return {
        status: 'unsupported',
        reason: error instanceof Error ? error.message : 'Exact calculation failed',
      }
    }
    return {
      status: 'exact',
      p1: denominator ? Math.min(1, numerator / denominator) : 0,
      p2: Math.min(1, numerator),
      histories: visited,
    }
  }
  let work = 0,
    histories = 0,
    success = 0,
    genericSuccess = 0
  const genericDemand: Cost = { generic: spell.mv, symbols: [] }
  function tick() {
    if (++work > maxWork) throw new Error('Exact state budget exceeded')
  }

  function closure(
    initial: State[],
    final: boolean
  ): { next: State[]; colored: boolean; generic: boolean } {
    const pending = [...initial],
      visited = new Set<string>(),
      endStates = new Map<string, State>()
    let colored = false,
      generic = false
    while (pending.length) {
      tick()
      const s = pending.pop()!,
        k = key(s)
      if (visited.has(k)) continue
      visited.add(k)
      if (final) {
        if (onlineProducer) {
          const available = sources.some(
            (source, i) => source.name === onlineProducer && s.ready[i] > 0
          )
          if (available) return { next: [], colored: true, generic: true }
        }
        if (!onlineProducer && !colored && pay(s.pool, demand!).length) colored = true
        if (!onlineProducer && !generic && pay(s.pool, genericDemand).length) generic = true
        if (colored && generic) return { next: [], colored, generic }
      } else {
        // At the next untap step only the remaining hand and permanents matter.
        const end = clone(s)
        end.pool.fill(0)
        end.ready = [...end.board]
        end.landPlayed = false
        endStates.set(key(end), end)
      }
      for (let i = 0; i < g; i++) {
        const source = sources[i]
        if (s.ready[i] > 0) {
          for (let c = 0; c < 7; c++)
            if (source.mask & (1 << c)) {
              const next = clone(s)
              next.ready[i]--
              next.pool[c] += source.amount
              pending.push(next)
            }
        }
        if (s.hand[i] <= 0) continue
        if (source.land) {
          if (s.landPlayed) continue
          if (source.faceIndices) {
            for (const face of source.faceIndices) {
              const next = clone(s)
              next.hand[i]--
              next.board[face]++
              next.ready[face]++
              next.landPlayed = true
              pending.push(next)
            }
            continue
          }
          const next = clone(s)
          next.hand[i]--
          next.board[i]++
          let untapped = source.delay === 0
          if (source.entry) {
            const otherLands = sources.reduce((n, x, j) => n + (x.land ? s.board[j] : 0), 0)
            const basics = sources.reduce((n, x, j) => n + (x.basic ? s.board[j] : 0), 0)
            switch (source.entry.type) {
              case 'control_lands_max':
                untapped = otherLands <= source.entry.threshold!
                break
              case 'control_lands_min':
                untapped = otherLands >= source.entry.threshold!
                break
              case 'control_basics_min':
                untapped = basics >= source.entry.threshold!
                break
              case 'control_basic':
                untapped = sources.some(
                  (x, j) =>
                    s.board[j] > 0 &&
                    x.basicTypes?.some((t) => source.entry!.basicTypes!.includes(t))
                )
                break
            }
          }
          if (untapped) next.ready[i]++
          next.landPlayed = true
          pending.push(next)
        } else {
          for (const remainder of pay(s.pool, source.cost)) {
            const next = clone(s)
            next.hand[i]--
            next.board[i]++
            if (!source.delay) next.ready[i]++
            next.pool = remainder
            pending.push(next)
          }
        }
      }
    }
    return { next: [...endStates.values()], colored, generic }
  }

  function advance(states: State[], remaining: number[], t: number, probability: number) {
    tick()
    const resolve = (drawnStates: State[], rem: number[], mass: number) => {
      const result = closure(drawnStates, t === turn)
      if (t === turn) {
        histories++
        if (result.colored) success += mass
        if (result.generic) genericSuccess += mass
      } else advance(result.next, rem, t + 1, mass)
    }
    if (t === 1 && playDraw === 'PLAY') {
      resolve(states, remaining, probability)
      return
    }
    const total = remaining.reduce((a, b) => a + b, 0)
    for (let i = 0; i < remaining.length; i++)
      if (remaining[i]) {
        const rem = [...remaining]
        rem[i]--
        const drawn = states.map((s) => {
          const next = clone(s)
          if (i < g) next.hand[i]++
          return next
        })
        resolve(drawn, rem, (probability * remaining[i]) / total)
      }
  }

  function opening(i: number, left: number, picks: number[], weight: number) {
    tick()
    if (i === counts.length) {
      if (left) return
      const remaining = counts.map((n, j) => n - picks[j])
      advance(
        [
          {
            hand: picks.slice(0, g),
            board: Array(g).fill(0),
            ready: Array(g).fill(0),
            pool: Array(7).fill(0),
            landPlayed: false,
          },
        ],
        remaining,
        1,
        weight / choose(deck.deckSize, 7)
      )
      return
    }
    for (let n = 0; n <= Math.min(left, counts[i]); n++)
      opening(i + 1, left - n, [...picks, n], weight * choose(counts[i], n))
  }
  try {
    opening(0, 7, [], 1)
  } catch (error) {
    return {
      status: 'unsupported',
      reason: error instanceof Error ? error.message : 'Exact calculation failed',
    }
  }
  return {
    status: 'exact',
    p1: genericSuccess > 0 ? Math.min(1, success / genericSuccess) : 0,
    p2: Math.min(1, success),
    histories,
  }
}

// Repeated UI and legacy summary calls often ask the same exact question.
// Bound both key size and entry count; return copies so callers cannot poison
// later results. Budgets, metadata, draw rules and producer identities are keyed.
const resultCache = new Map<string, PhysicalManaResult>()
export function physicalManaProbability(
  deck: DeckManaProfile,
  spell: ProducerManaCost,
  turn: number,
  producers: ProducerInDeck[] = [],
  playDraw: 'PLAY' | 'DRAW' = 'PLAY',
  maxWork = 250_000,
  onlineProducer?: string
): PhysicalManaResult {
  const serialized = JSON.stringify(
    [deck, spell, turn, producers, playDraw, maxWork, onlineProducer],
    (_key, value) =>
      typeof value === 'number' && !Number.isFinite(value)
        ? { invalidNumber: String(value) }
        : value
  )
  const cacheKey = serialized.length <= 16_384 ? serialized : undefined
  const cached = cacheKey === undefined ? undefined : resultCache.get(cacheKey)
  if (cached) return { ...cached }
  const result = computePhysicalManaProbability(
    deck,
    spell,
    turn,
    producers,
    playDraw,
    maxWork,
    onlineProducer
  )
  if (cacheKey !== undefined) {
    if (resultCache.size >= 64) resultCache.delete(resultCache.keys().next().value!)
    resultCache.set(cacheKey, { ...result })
  }
  return result
}
