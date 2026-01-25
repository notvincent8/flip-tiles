export type GridLayout = { columns: number; rows: number }

const clampInt = (v: number, min: number, max: number) => Math.max(min, Math.min(max, Math.round(v)))

/**
 * Compute a grid so each tile is around targetTilePx (rectangles happen naturally
 * because viewport aspect ratio differs).
 */
export const computeGridLayout = (args: {
  width: number
  height: number
  targetTilePx?: number
  minColumns?: number
  maxColumns?: number
  minRows?: number
  maxRows?: number
}): GridLayout => {
  const { width, height, targetTilePx = 180, minColumns = 4, maxColumns = 14, minRows = 3, maxRows = 10 } = args

  const columns = clampInt(width / targetTilePx, minColumns, maxColumns)
  const rows = clampInt(height / targetTilePx, minRows, maxRows)

  return { columns, rows }
}
