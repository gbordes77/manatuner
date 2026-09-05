/** Finite-horizon Bellman policy: max over current legal decisions, then expectation
 * over the next uniform draw. No branch can inspect the future library order.
 * Searches change the remaining population; the shuffle restores a uniform order.
 */
import { MANA, parsePolicyCost, payments, unitIndex } from './cost'
import type {
  LandFace,
  PolicyCard,
  PolicyInput,
  PolicyResult,
  ResourceSpell,
  SearchRule,
} from './types'
type Permanent = { land?: LandFace; spell?: ResourceSpell; outputs: LandFace['outputs'] }
type State = {
  hand: number[]
  graveyard: number[]
  remaining: number[]
  board: number[]
  ready: number[]
  pool: number[]
  life: number
  turn: number
  landPlayed: boolean
}
const clone = (s: State): State => ({
  ...s,
  hand: [...s.hand],
  graveyard: [...s.graveyard],
  remaining: [...s.remaining],
  board: [...s.board],
  ready: [...s.ready],
  pool: [...s.pool],
})
const choose = (n: number, k: number) => {
  let v = 1
  for (let i = 1; i <= Math.min(k, n - k); i++) v = (v * (n - i + 1)) / i
  return v
}
const fail = (
  code: 'invalid-input' | 'mechanic' | 'budget',
  reason: string,
  work?: number
): PolicyResult => ({ status: 'unsupported', model: 'payment-policy-v2', code, reason, work })
export function paymentPolicy(input: PolicyInput): PolicyResult {
  const integer = (n: number, max = 1000) => Number.isSafeInteger(n) && n >= 0 && n <= max
  if (
    !input ||
    !Array.isArray(input.cards) ||
    !integer(input.turn, 10) ||
    input.turn < 1 ||
    !integer(input.life, 1000) ||
    !integer(input.lifeFloor, input.life) ||
    input.lifeFloor < 1 ||
    !integer(input.x, 100) ||
    !['PLAY', 'DRAW'].includes(input.playDraw) ||
    !['creature', 'other', 'ability'].includes(input.targetKind)
  )
    return fail('invalid-input', 'Invalid horizon, life, target type or draw rules')
  const target = parsePolicyCost(input.cost, input.x)
  if (!target) return fail('mechanic', 'Unsupported or malformed target mana cost')
  const maxWork = input.maxWork ?? 250_000
  if (!integer(maxWork, 10_000_000) || !maxWork) return fail('invalid-input', 'Invalid work budget')
  if (
    input.cards.some(
      (c) => !c || !integer(c.count) || (c.lands !== undefined && !Array.isArray(c.lands))
    )
  )
    return fail('invalid-input', 'Malformed card contract')
  const n = input.cards.reduce((sum, c) => sum + c.count, 0)
  if (!integer(n) || n < 7 || input.cards.some((c) => !integer(c.count)))
    return fail(
      'invalid-input',
      'Library must contain 7–1000 physical cards with integer quantities'
    )
  // Programmatic contracts are strict: malformed outputs never become free mana.
  for (const c of input.cards) {
    for (const face of c.lands ?? []) {
      if (!face || !Array.isArray(face.outputs)) return fail('invalid-input', 'Invalid land face')
      if (face.search && (face.outputs.length || face.tapLife))
        return fail('mechanic', 'Mixed land activation contracts are not represented')
      if (
        face.entry &&
        !['control_lands_max', 'control_lands_min', 'control_basics_min', 'control_basic'].includes(
          face.entry.type
        )
      )
        return fail('mechanic', 'Unsupported conditional entry')
      if (
        face.entry &&
        (face.entry.type === 'control_basic'
          ? !Array.isArray(face.entry.basicTypes) ||
            !face.entry.basicTypes.length ||
            face.entry.basicTypes.some(
              (t) => !['Plains', 'Island', 'Swamp', 'Mountain', 'Forest'].includes(t)
            )
          : !integer(face.entry.threshold!))
      )
        return fail('invalid-input', 'Invalid entry condition')
      if ([face.entryLife ?? 0, face.tapLife ?? 0, face.search?.life ?? 0].some((x) => !integer(x)))
        return fail('invalid-input', 'Invalid land life payment')
    }
    if (
      c.spell &&
      (!parsePolicyCost(c.spell.cost, input.x) ||
        !['producer', 'ritual', 'treasure', 'ramp'].includes(c.spell.kind) ||
        (c.spell.activationCost && !parsePolicyCost(c.spell.activationCost, input.x)) ||
        (c.spell.flashbackCost && !parsePolicyCost(c.spell.flashbackCost, input.x)) ||
        (c.spell.kind === 'ramp' && (!c.spell.search || c.spell.search.life)))
    )
      return fail('mechanic', 'Unsupported resource spell contract')
    const all = [...(c.lands ?? []), ...(c.spell ? [c.spell] : [])]
    for (const resource of all) {
      const rule = resource.search
      if (
        rule &&
        (typeof rule.tapped !== 'boolean' ||
          (!rule.basicOnly && !rule.types?.length) ||
          (rule.types &&
            (!Array.isArray(rule.types) ||
              rule.types.some(
                (t) => !['Plains', 'Island', 'Swamp', 'Mountain', 'Forest'].includes(t)
              ))) ||
          (rule.toHand !== undefined && rule.toHand !== 1) ||
          (rule.untapAt !== undefined && (!integer(rule.untapAt) || !rule.tapped)) ||
          !integer(rule.life ?? 0))
      )
        return fail('invalid-input', 'Invalid restricted search contract')
      if (resource.outputs !== undefined && !Array.isArray(resource.outputs))
        return fail('invalid-input', 'Invalid mana outputs')
    }
    if (
      all.some((f) =>
        (f.outputs ?? []).some(
          (o) =>
            !Array.isArray(o) ||
            !o.length ||
            o.some(
              (u) =>
                !u || typeof u.color !== 'string' || !MANA.includes(u.color) || u.color.length !== 1
            )
        )
      )
    )
      return fail('invalid-input', 'Invalid mana output')
  }
  const grouped = new Map<string, PolicyCard>()
  for (const c of input.cards) {
    if (!c.count) continue
    const key =
      input.optimize === false
        ? `${grouped.size}`
        : JSON.stringify({
            lands: c.lands?.map((f) => ({ ...f, name: undefined })),
            spell: c.spell,
            searchable: c.searchable,
          })
    const old = grouped.get(key)
    if (old) old.count += c.count
    else grouped.set(key, { ...c, count: c.count })
  }
  const cards = [...grouped.values()]
  const permanents: Permanent[] = []
  const landSlots = cards.map((c) =>
    (c.lands ?? []).map((land) => {
      permanents.push({ land, outputs: land.outputs })
      return permanents.length - 1
    })
  )
  const spellSlots = cards.map((c) => {
    if (!c.spell || c.spell.kind === 'ramp' || c.spell.kind === 'ritual') return []
    const outputs =
      c.spell.kind === 'treasure'
        ? Array.from('WUBRG', (color) => [{ color }])
        : (c.spell.outputs ?? [])
    const choices = c.spell.chooseOutput ? outputs.map((o) => [o]) : [outputs]
    return choices.map((outputs) => {
      permanents.push({ spell: c.spell, outputs })
      return permanents.length - 1
    })
  })
  const memo = new Map<string, number>()
  const drawMemo = new Map<string, number>()
  let work = 0,
    memoHits = 0
  const tick = () => {
    if (++work > maxWork) throw new Error('budget')
  }
  const landCount = (s: State) =>
    permanents.reduce((sum, p, i) => sum + (p.land ? s.board[i] : 0), 0)
  const putLand = (s: State, index: number, forcedTapped = false): State[] => {
    const f = permanents[index].land!
    let untapped = !f.tapped
    if (f.entry) {
      const e = f.entry
      switch (e.type) {
        case 'control_lands_max':
          untapped = landCount(s) <= e.threshold!
          break
        case 'control_lands_min':
          untapped = landCount(s) >= e.threshold!
          break
        case 'control_basics_min':
          untapped =
            permanents.reduce((sum, p, i) => sum + (p.land?.basic ? s.board[i] : 0), 0) >=
            e.threshold!
          break
        case 'control_basic':
          untapped = permanents.some(
            (p, i) => s.board[i] > 0 && p.land?.types?.some((t) => e.basicTypes!.includes(t))
          )
          break
      }
    }
    const make = (ready: boolean, life: number) => {
      const next = clone(s)
      next.board[index]++
      if (ready) next.ready[index]++
      next.life = life
      return next
    }
    if (f.entryLife && !forcedTapped) {
      const out = [make(false, s.life)]
      if (s.life - f.entryLife >= input.lifeFloor) out.push(make(true, s.life - f.entryLife))
      return out
    }
    return [make(untapped && !forcedTapped, s.life)]
  }
  const addMana = (s: State, outputs: Permanent['outputs']): State[] =>
    outputs.map((output) => {
      const next = clone(s)
      for (const u of output) next.pool[unitIndex(u)]++
      return next
    })
  const search = (s: State, rule: SearchRule): State[] => {
    // Failing to find is legal for these restricted searches, even with targets.
    const out = [s]
    for (let i = 0; i < cards.length; i++) {
      if (!s.remaining[i] || !cards[i].searchable || !landSlots[i].length) continue
      const face = cards[i].lands![0]
      if (rule.basicOnly && !face.basic) continue
      if (rule.types && !face.types?.some((t) => rule.types!.includes(t))) continue
      const next = clone(s)
      next.remaining[i]--
      for (const entered of putLand(next, landSlots[i][0], rule.tapped)) {
        if (rule.untapAt && landCount(entered) >= rule.untapAt) entered.ready[landSlots[i][0]]++
        out.push(entered)
        if (rule.toHand === 1)
          for (let j = 0; j < cards.length; j++) {
            const f = cards[j].lands?.[0]
            if (
              !entered.remaining[j] ||
              !cards[j].searchable ||
              !f ||
              (rule.basicOnly && !f.basic) ||
              (rule.types && !f.types?.some((t) => rule.types!.includes(t)))
            )
              continue
            const withHand = clone(entered)
            withHand.remaining[j]--
            withHand.hand[j]++
            out.push(withHand)
          }
      }
    }
    return out
  }
  const draw = (s: State): number => {
    tick()
    const key = JSON.stringify(s)
    if (input.optimize !== false && drawMemo.has(key)) {
      memoHits++
      return drawMemo.get(key)!
    }
    const total = s.remaining.reduce((a, b) => a + b, 0)
    // Drawing an empty library loses before the target main phase.
    if (!total) return 0
    let value = 0
    for (let i = 0; i < cards.length; i++)
      if (s.remaining[i]) {
        const next = clone(s)
        next.hand[i]++
        next.remaining[i]--
        value += (s.remaining[i] / total) * main(next)
      }
    if (input.optimize !== false) drawMemo.set(key, value)
    return value
  }
  const main = (s: State): number => {
    tick()
    const key = JSON.stringify(s)
    const old = memo.get(key)
    if (old !== undefined) {
      memoHits++
      return old
    }
    if (
      s.turn === input.turn &&
      payments(s.pool, s.life, target, input.targetKind, input.lifeFloor, tick).length
    ) {
      memo.set(key, 1)
      return 1
    }
    let best = 0
    const consider = (next: State) => {
      best = Math.max(best, main(next))
    }
    // Make progress within this turn before evaluating waiting/drawing.
    for (let i = 0; i < permanents.length && best < 1; i++) {
      if (!s.ready[i]) continue
      const p = permanents[i]
      const lifeCost = p.land?.search?.life ?? p.land?.tapLife ?? 0
      if (s.life - lifeCost < input.lifeFloor) continue
      const cost = p.spell?.activationCost ? parsePolicyCost(p.spell.activationCost, input.x)! : []
      for (const paid of payments(s.pool, s.life, cost, 'ability', input.lifeFloor, tick)) {
        if (paid.life - lifeCost < input.lifeFloor) continue
        const next = clone(s)
        next.ready[i]--
        next.pool = paid.pool
        next.life = paid.life - lifeCost
        if (p.land?.search || p.spell?.sacrifice || p.spell?.kind === 'treasure') next.board[i]--
        if (p.land?.search) {
          for (const state of search(next, p.land.search)) consider(state)
        } else for (const state of addMana(next, p.outputs)) consider(state)
      }
    }
    for (let i = 0; i < cards.length && best < 1; i++) {
      if (!s.hand[i] && !s.graveyard[i]) continue
      if (s.hand[i] && !s.landPlayed)
        for (const slot of landSlots[i]) {
          const next = clone(s)
          next.hand[i]--
          next.landPlayed = true
          for (const state of putLand(next, slot)) consider(state)
        }
      const spell = cards[i].spell
      if (!spell) continue
      for (const fromGrave of [false, true]) {
        if (fromGrave ? !s.graveyard[i] || !spell.flashbackCost : !s.hand[i]) continue
        const cost = fromGrave ? spell.flashbackCost! : spell.cost
        for (const paid of payments(
          s.pool,
          s.life,
          parsePolicyCost(cost, input.x)!,
          spell.creature ? 'creature' : 'other',
          input.lifeFloor,
          tick
        )) {
          const next = clone(s)
          if (fromGrave) next.graveyard[i]--
          else next.hand[i]--
          next.pool = paid.pool
          next.life = paid.life
          if (
            !fromGrave &&
            (spell.kind === 'ramp' || spell.kind === 'ritual' || spell.kind === 'treasure')
          )
            next.graveyard[i]++
          if (spell.kind === 'ramp') {
            for (const state of search(next, spell.search!)) consider(state)
          } else if (spell.kind === 'ritual') {
            for (const state of addMana(next, spell.outputs ?? [])) consider(state)
          } else
            for (const slot of spellSlots[i]) {
              const cast = clone(next)
              cast.board[slot]++
              if (!spell.creature && !spell.tapped) cast.ready[slot]++
              consider(cast)
            }
        }
      }
    }
    if (best < 1 && s.turn < input.turn) {
      const next = clone(s)
      next.turn++
      next.ready = [...next.board]
      next.pool.fill(0)
      next.landPlayed = false
      best = Math.max(best, draw(next))
    }
    memo.set(key, best)
    return best
  }
  let probability = 0
  const opening = (index: number, left: number, hand: number[], weight: number) => {
    tick()
    if (index === cards.length) {
      if (left) return
      const state: State = {
        hand,
        graveyard: Array(cards.length).fill(0),
        remaining: cards.map((c, i) => c.count - hand[i]),
        board: Array(permanents.length).fill(0),
        ready: Array(permanents.length).fill(0),
        pool: Array(24).fill(0),
        life: input.life,
        turn: 1,
        landPlayed: false,
      }
      probability +=
        (weight / choose(n, 7)) * (input.playDraw === 'DRAW' ? draw(state) : main(state))
      return
    }
    for (let k = 0; k <= Math.min(left, cards[index].count); k++)
      opening(index + 1, left - k, [...hand, k], weight * choose(cards[index].count, k))
  }
  try {
    opening(0, 7, [], 1)
  } catch (e) {
    if (e instanceof Error && e.message === 'budget')
      return fail(
        'budget',
        'Exact policy work budget exceeded; no partial probability is returned',
        work
      )
    throw e
  }
  return {
    status: 'exact',
    model: 'payment-policy-v2',
    probability: Math.min(1, Math.max(0, probability)),
    work,
    memoHits,
    assumptions:
      'Optimal non-clairvoyant mana-resource policy at the target main phase. Uniform draws/shuffles; external target; no mulligan or opponent; explicit life reserve; non-mana spell effects excluded. Exact enumeration with floating-point arithmetic.',
  }
}
