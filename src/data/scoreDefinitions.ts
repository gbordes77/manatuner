/** Shared descriptions; the three formulas intentionally remain distinct. */
export const SCORE_DEFINITIONS = {
  health:
    'Health Score averages turn-two access to each required color or hybrid alternative group. It does not measure simultaneous payment or spell castability.',
  blueprint:
    'Blueprint Stability combines Health (40%), land-ratio balance around 40% lands (20%), turn-two color access (25%) and turn-four color access (15%).',
  mulligan:
    'Mulligan scores simulated opening hands using archetype weights. They differ from deck-level Health and Blueprint Stability.',
  limitation: 'These are heuristic indices, not win probabilities or guaranteed keep decisions.',
} as const
