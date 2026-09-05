import { it, expect } from 'vitest'
import { KARSTEN_TABLES } from '../../src/types/maths'
// Factual transcription of the primary article's summary, read 2026-09-05.
it.each([
  [1, 4, 10],
  [1, 5, 9],
  [2, 2, 21],
  [2, 6, 13],
  [2, 7, 12],
  [3, 4, 21],
  [3, 6, 17],
  [3, 7, 16],
  [4, 4, 24],
])('published Karsten 60-card row %i pips / T%i = %i', (pips, turn, expected) =>
  expect(KARSTEN_TABLES[pips][turn]).toBe(expected)
)
