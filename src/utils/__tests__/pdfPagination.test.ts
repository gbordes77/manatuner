import { describe, expect, it } from 'vitest'
import { paginateBlueprint } from '../pdfPagination'

describe('PDF section pagination', () => {
  it('moves an opening-hand section before a page boundary and retains all rows', () => {
    const pages = paginateBlueprint(1600, 1000, [{ top: 920, bottom: 1150 }])
    expect(pages).toEqual([
      { top: 0, height: 920 },
      { top: 920, height: 680 },
    ])
    expect(pages.reduce((n, p) => n + p.height, 0)).toBe(1600)
  })
  it('keeps adjacent normal sections intact over multiple pages', () => {
    const blocks = [
      { top: 50, bottom: 650 },
      { top: 680, bottom: 1100 },
      { top: 1120, bottom: 1700 },
    ]
    const pages = paginateBlueprint(1750, 1000, blocks)
    for (const block of blocks) {
      expect(pages.some((p) => p.top <= block.top && p.top + p.height >= block.bottom)).toBe(true)
    }
    expect(pages.every((p) => p.height > 0 && p.height <= 1000)).toBe(true)
    expect(pages.reduce((n, p) => n + p.height, 0)).toBe(1750)
  })
  it('retains all source rows of oversized sections without looping', () => {
    expect(paginateBlueprint(2500, 1000, [{ top: 0, bottom: 2500 }])).toEqual([
      { top: 0, height: 1000 },
      { top: 1000, height: 1000 },
      { top: 2000, height: 500 },
    ])
  })
})
