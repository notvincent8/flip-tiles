import { type ReactNode, useMemo } from "react"
import Tile from "@/components/Tile.tsx"
import { useGridLayoutAfterResize } from "@/hook/useGridLayoutAfterResize.tsx"

interface TileGridProps {
  children: ReactNode
  columns?: number
  rows?: number
  backContent?: ReactNode

  // optional: turn on responsive behavior even if props exist
  responsive?: boolean
  targetTilePx?: number
}

export const TileGrid = ({
  children,
  columns,
  rows,
  backContent,
  responsive = true,
  targetTilePx = 180,
}: TileGridProps) => {
  const layout = useGridLayoutAfterResize({
    debounceMs: 150,
    targetTilePx,
    minColumns: 4,
    maxColumns: 9,
    minRows: 3,
    maxRows: 7,
  })

  const resolvedColumns = responsive && columns == null ? layout.columns : (columns ?? 8)
  const resolvedRows = responsive && rows == null ? layout.rows : (rows ?? 5)

  const tiles = useMemo(
    () =>
      Array.from({ length: resolvedColumns * resolvedRows }, (_, i) => ({
        id: i,
        col: i % resolvedColumns,
        row: Math.floor(i / resolvedColumns),
      })),
    [resolvedColumns, resolvedRows],
  )

  return (
    <div className="relative h-screen w-screen overflow-hidden">
      <div className="pointer-events-none absolute inset-0 opacity-0">{children}</div>

      <div
        className="absolute inset-0 grid gap-1"
        style={{
          gridTemplateColumns: `repeat(${resolvedColumns}, 1fr)`,
          gridTemplateRows: `repeat(${resolvedRows}, 1fr)`,
        }}
      >
        {tiles.map((tile) => (
          <Tile
            key={tile.id}
            col={tile.col}
            row={tile.row}
            columns={resolvedColumns}
            rows={resolvedRows}
            frontContent={children}
            backContent={backContent}
          />
        ))}
      </div>
    </div>
  )
}
