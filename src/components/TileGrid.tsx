import type { ReactNode } from "react"
import Tile from "@/components/Tile.tsx"

interface TileGridProps {
  children: ReactNode
  columns?: number
  rows?: number
  backContent?: ReactNode
}

export const TileGrid = ({ children, columns = 8, rows = 5, backContent }: TileGridProps) => {
  const tiles = Array.from({ length: columns * rows }, (_, i) => ({
    id: i,
    col: i % columns,
    row: Math.floor(i / columns),
  }))

  return (
    <div className="relative h-screen w-screen overflow-hidden">
      <div className="pointer-events-none absolute inset-0 opacity-0">{children}</div>

      <div
        className="absolute inset-0 grid gap-1"
        style={{
          gridTemplateColumns: `repeat(${columns}, 1fr)`,
          gridTemplateRows: `repeat(${rows}, 1fr)`,
        }}
      >
        {tiles.map((tile) => (
          <Tile
            key={tile.id}
            col={tile.col}
            row={tile.row}
            columns={columns}
            rows={rows}
            frontContent={children}
            backContent={backContent}
          />
        ))}
      </div>
    </div>
  )
}
