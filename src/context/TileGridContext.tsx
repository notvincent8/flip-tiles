import { createContext, type ReactNode, type RefObject, useCallback, useContext, useMemo, useRef } from "react"

export interface TileHandle {
  flip: (toFace?: "front" | "back", duration?: number) => void
  getVisibleFace: () => "front" | "back"
}

interface TileGridContextValue {
  registerTile: (id: number, handle: TileHandle) => void
  unregisterTile: (id: number) => void
  cascadeFlip: () => void
  flipAllToFront: () => void
}

const TileGridContext = createContext<TileGridContextValue | null>(null)

export const useTileGridContext = () => {
  const ctx = useContext(TileGridContext)
  if (!ctx) {
    throw new Error("useTileGridContext must be used within TileGridProvider")
  }
  return ctx
}

interface TileGridProviderProps {
  children: ReactNode
  cascadeRef?: RefObject<{ cascade: () => void; reset: () => void } | null>
}

export const TileGridProvider = ({ children, cascadeRef }: TileGridProviderProps) => {
  const tilesMap = useRef<Map<number, TileHandle>>(new Map())

  const registerTile = useCallback((id: number, handle: TileHandle) => {
    tilesMap.current.set(id, handle)
  }, [])

  const unregisterTile = useCallback((id: number) => {
    tilesMap.current.delete(id)
  }, [])

  const flipAllToFront = useCallback(() => {
    tilesMap.current.forEach((handle) => {
      if (handle.getVisibleFace() === "back") {
        handle.flip("front")
      }
    })
  }, [])

  const cascadeFlip = useCallback(() => {
    const entries = Array.from(tilesMap.current.entries())

    for (let i = entries.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[entries[i], entries[j]] = [entries[j], entries[i]]
    }

    entries.forEach(([, handle], index) => {
      const baseDelay = index * 3
      const randomDelay = Math.random() * 1000
      const randomDuration = 0.4 + Math.random() * 0.6

      setTimeout(() => {
        handle.flip("back", randomDuration)
      }, baseDelay + randomDelay)
    })
  }, [])

  if (cascadeRef) {
    cascadeRef.current = {
      cascade: cascadeFlip,
      reset: flipAllToFront,
    }
  }

  const value = useMemo(
    () => ({ registerTile, unregisterTile, cascadeFlip, flipAllToFront }),
    [cascadeFlip, flipAllToFront, registerTile, unregisterTile],
  )

  return <TileGridContext.Provider value={value}>{children}</TileGridContext.Provider>
}
