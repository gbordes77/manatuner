export interface PdfBlock {
  top: number
  bottom: number
}
export interface PdfSlice {
  top: number
  height: number
}

/** Keep a section's heading and values together whenever it fits on one page.
 * Oversized sections retain every source row across contiguous slices.
 */
export function paginateBlueprint(
  height: number,
  pageHeight: number,
  blocks: PdfBlock[]
): PdfSlice[] {
  if (!Number.isFinite(height) || !Number.isFinite(pageHeight) || height <= 0 || pageHeight < 1)
    return []
  const total = Math.ceil(height)
  const limit = Math.floor(pageHeight)
  const sections = blocks.filter(
    (b) => Number.isFinite(b.top) && Number.isFinite(b.bottom) && b.bottom > b.top
  )
  const slices: PdfSlice[] = []
  let top = 0
  while (top < total) {
    let end = Math.min(top + limit, total)
    const crossing = sections.find(
      (b) => b.top < end && b.bottom > end && Math.floor(b.top) > top && b.bottom - b.top <= limit
    )
    if (crossing) end = Math.floor(crossing.top)
    slices.push({ top, height: end - top })
    top = end
  }
  return slices
}
