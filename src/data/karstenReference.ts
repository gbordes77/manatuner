/** Editorial reference only; not an input to the analysis engine.
 * Primary table and assumptions verified on TCGplayer on 2026-09-14.
 */
export const KARSTEN_REFERENCE_URL =
  'https://www.tcgplayer.com/content/article/How-Many-Sources-Do-You-Need-to-Consistently-Cast-Your-Spells-A-2022-Update/dc23a7d2-0a16-4c0b-ad36-586fcca03ad8/'

export const KARSTEN_REFERENCE_TABLE = [
  { cost: '1 Colored (e.g. {R}, {1}{U})', t1: '14', t2: '13', t3: '12', t4: '10' },
  { cost: '2 Same (e.g. {U}{U})', t1: '-', t2: '21', t3: '18', t4: '16' },
  { cost: '3 Same (e.g. {B}{B}{B})', t1: '-', t2: '-', t3: '23', t4: '21' },
]
export const KARSTEN_UU_REFERENCE =
  'Karsten’s 2022 reference uses 21 blue sources for UU on turn 2 in a 60-card deck with 25 lands. Its 91% target is conditional on drawing at least two lands by turn 2, on the play, after the stated London mulligan policy. This is color consistency, not the overall chance to draw and cast the spell.'
export const KARSTEN_REFERENCE_SCOPE =
  'The table assumes lands-only mana and no card selection. The target is 89% plus the mana value. Turn-one sources must be untapped; later turns simplify tapped-land sequencing. Commander uses a separate 99-card model, not these 60-card targets.'
export const KARSTEN_MULLIGAN_POLICY =
  'Reference mulligans: keep 2–5 lands at seven cards; 2–4 at six after bottoming; 2–4 at five; keep any four. Bottom toward three lands, removing off-color lands first when a land must go. This reference policy is separate from ManaTuner’s hand-scoring heuristic.'
