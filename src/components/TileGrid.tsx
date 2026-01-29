import { type ReactNode, type RefObject, useMemo, useRef } from "react"
import Tile from "@/components/Tile.tsx"
import { TileGridProvider } from "@/context/TileGridContext.tsx"
import { useGridLayoutAfterResize } from "@/hook/useGridLayoutAfterResize.tsx"

export interface CascadeHandle {
  cascade: () => void
  reset: () => void
}

interface TileGridProps {
  children: ReactNode
  columns?: number
  rows?: number
  backContent?: ReactNode
  cascadeRef?: RefObject<CascadeHandle | null>
  responsive?: boolean
  targetTilePx?: number
}

export const TileGrid = ({
  children,
  columns,
  rows,
  backContent,
  cascadeRef,
  responsive = true,
  targetTilePx = 180,
}: TileGridProps) => {
  const internalCascadeRef = useRef<CascadeHandle | null>(null)
  const effectiveCascadeRef = cascadeRef ?? internalCascadeRef
  const layout = useGridLayoutAfterResize({
    debounceMs: 150,
    targetTilePx,
    minColumns: 4,
    maxColumns: 8,
    minRows: 3,
    maxRows: 10,
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
    <TileGridProvider cascadeRef={effectiveCascadeRef}>
      <div className="relative h-screen w-screen overflow-hidden page-fade-in">
        <div className="pointer-events-none absolute inset-0 opacity-0">{children}</div>

        <div
          className="absolute inset-0 grid"
          style={{
            gridTemplateColumns: `repeat(${resolvedColumns}, 1fr)`,
            gridTemplateRows: `repeat(${resolvedRows}, 1fr)`,
          }}
        >
          {tiles.map((tile) => (
            <Tile
              key={tile.id}
              id={tile.id}
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
    </TileGridProvider>
  )
}
