import { useEffect, useState } from "react"
import { getViewport, onResize } from "@/lib/dom"
import { computeGridLayout, type GridLayout } from "@/lib/gridLayout"

export const useGridLayoutAfterResize = (args?: {
  debounceMs?: number
  targetTilePx?: number
  minColumns?: number
  maxColumns?: number
  minRows?: number
  maxRows?: number
}): GridLayout => {
  const { debounceMs = 150, targetTilePx, minColumns, maxColumns, minRows, maxRows } = args ?? {}

  const [layout, setLayout] = useState<GridLayout>(() => {
    const vp = getViewport()
    return computeGridLayout({
      width: vp.width,
      height: vp.height,
      targetTilePx,
      minColumns,
      maxColumns,
      minRows,
      maxRows,
    })
  })

  useEffect(() => {
    return onResize((vp) => {
      setLayout(
        computeGridLayout({
          width: vp.width,
          height: vp.height,
          targetTilePx,
          minColumns,
          maxColumns,
          minRows,
          maxRows,
        }),
      )
    }, debounceMs)
  }, [debounceMs, targetTilePx, minColumns, maxColumns, minRows, maxRows])

  return layout
}
