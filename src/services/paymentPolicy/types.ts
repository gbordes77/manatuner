import type { ETBCondition } from '../../types/lands'
export type PaymentKind = 'creature' | 'other' | 'ability'
export type ManaOutput = { color: string; snow?: boolean; creatureOnly?: boolean }
export type SearchRule = {
  basicOnly?: boolean
  types?: string[]
  tapped: boolean
  life?: number
  untapAt?: number
  toHand?: number
}
export type LandFace = {
  name: string
  outputs: ManaOutput[][]
  basic?: boolean
  types?: string[]
  tapped?: boolean
  entry?: ETBCondition
  entryLife?: number
  tapLife?: number
  search?: SearchRule
}
export type ResourceSpell = {
  cost: string
  kind: 'producer' | 'ritual' | 'treasure' | 'ramp'
  creature?: boolean
  outputs?: ManaOutput[][]
  tapped?: boolean
  sacrifice?: boolean
  chooseOutput?: boolean
  flashbackCost?: string
  activationCost?: string
  search?: SearchRule
}
export type PolicyCard = {
  name: string
  count: number
  lands?: LandFace[]
  spell?: ResourceSpell
  searchable?: boolean
}
export type PolicyInput = {
  cards: PolicyCard[]
  cost: string
  turn: number
  playDraw: 'PLAY' | 'DRAW'
  targetKind: PaymentKind
  life: number
  lifeFloor: number
  x: number
  maxWork?: number
  optimize?: boolean
}
export type PolicyResult =
  | {
      status: 'exact'
      model: 'payment-policy-v2'
      probability: number
      work: number
      memoHits: number
      assumptions: string
    }
  | {
      status: 'unsupported'
      model: 'payment-policy-v2'
      code: 'invalid-input' | 'metadata' | 'mechanic' | 'budget' | 'execution'
      reason: string
      work?: number
    }
