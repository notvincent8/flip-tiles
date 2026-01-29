import { type KeyboardEvent, type MouseEvent, memo, type ReactNode, useEffect } from "react"

type TileProps = {
  id: number
  col: number
  row: number
  columns: number
  rows: number
  frontContent: ReactNode
  backContent?: ReactNode
  autoReverseDelay?: number
}

import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { useCallback, useRef } from "react"
import { useTileGridContext } from "@/context/TileGridContext.tsx"
import { prefersReducedMotion } from "@/lib/dom.ts"

type Face = "front" | "back"

const Tile = ({ id, col, row, columns, rows, frontContent, backContent, autoReverseDelay = 3000 }: TileProps) => {
  const { registerTile, unregisterTile } = useTileGridContext()
  const container = useRef<HTMLDivElement>(null)
  const frontFace = useRef<HTMLDivElement>(null)

  const visibleFace = useRef<Face>("front")
  const isFlipping = useRef(false)
  const autoReverseTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const offsetX = (col / columns) * 100
  const offsetY = (row / rows) * 100

  const clearAutoReverse = useCallback(() => {
    if (autoReverseTimer.current) {
      clearTimeout(autoReverseTimer.current)
      autoReverseTimer.current = null
    }
  }, [])

  useGSAP(
    () => {
      gsap.set(frontFace.current, { rotateX: 0 })
    },
    { scope: container },
  )

  const flip = useCallback(
    (toFace?: Face, duration?: number) => {
      if (!frontFace.current || isFlipping.current) return

      const currentFace = visibleFace.current
      const targetFace = toFace ?? (currentFace === "front" ? "back" : "front")
      if (targetFace === currentFace) return

      clearAutoReverse()

      if (prefersReducedMotion()) {
        visibleFace.current = targetFace
        gsap.set(frontFace.current, { rotateX: targetFace === "back" ? 180 : 0 })
        return
      }

      isFlipping.current = true
      const animDuration = duration ?? 0.7

      gsap.to(frontFace.current, {
        rotateX: targetFace === "back" ? 180 : 0,
        duration: animDuration,
        ease: "elastic.out(1,0.5)",
        onComplete: () => {
          isFlipping.current = false
          visibleFace.current = targetFace

          if (targetFace === "back") {
            autoReverseTimer.current = setTimeout(() => {
              flip("front")
            }, autoReverseDelay)
          }
        },
      })
    },
    [autoReverseDelay, clearAutoReverse],
  )

  useEffect(() => {
    registerTile(id, {
      flip,
      getVisibleFace: () => visibleFace.current,
    })

    return () => {
      unregisterTile(id)
      clearAutoReverse()
      if (frontFace.current) {
        gsap.killTweensOf(frontFace.current)
      }
    }
  }, [id, registerTile, unregisterTile, clearAutoReverse, flip])

  const onMouseEnter = (e: MouseEvent) => {
    e.preventDefault()
    flip()
  }
  const onClick = (e: MouseEvent) => {
    e.preventDefault()
    if (visibleFace.current === "front") return
    flip("front")
  }
  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault()
      if (visibleFace.current === "front") return
      flip("front")
    }
  }

  return (
    // biome-ignore lint/a11y/noStaticElementInteractions: decorative tile flip, no suitable native element
    <div
      ref={container}
      onMouseEnter={onMouseEnter}
      onClick={onClick}
      onKeyDown={onKeyDown}
      className="relative h-full w-full perspective-[1000px] overflow-hidden cursor-default"
      style={{
        transitionDelay: `${(col + row) * 50}ms`,
        contain: "layout style paint",
      }}
    >
      <div ref={frontFace} className="relative h-full w-full transform-3d" style={{ willChange: "transform" }}>
        <div className="absolute inset-0 overflow-hidden backface-hidden" style={{ contain: "strict" }}>
          <div
            className="absolute"
            style={{
              left: `-${offsetX}vw`,
              top: `-${offsetY}vh`,
              width: "100vw",
              height: "100vh",
            }}
          >
            {frontContent}
          </div>
        </div>

        <div className="absolute inset-0 overflow-hidden backface-hidden transform-[rotateX(180deg)]">
          {backContent ?? <div className="h-full w-full tile-back" />}
        </div>
      </div>
    </div>
  )
}

export default memo(Tile)
