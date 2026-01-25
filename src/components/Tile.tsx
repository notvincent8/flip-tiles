import { type MouseEvent, memo, type ReactNode } from "react"

type TileProps = {
  col: number
  row: number
  columns: number
  rows: number
  frontContent: ReactNode
  backContent?: ReactNode
}

import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { useRef, useState } from "react"
import { prefersReducedMotion } from "@/lib/dom.ts"

const Tile = ({ col, row, columns, rows, frontContent, backContent }: TileProps) => {
  const container = useRef<HTMLButtonElement>(null)
  const frontFace = useRef<HTMLDivElement>(null)
  const backFace = useRef<HTMLDivElement>(null)
  const [visibleFace, setVisibleFace] = useState<"front" | "back">("front")
  const [isFlipping, setIsFlipping] = useState(false)

  const offsetX = (col / columns) * 100
  const offsetY = (row / rows) * 100

  const { contextSafe } = useGSAP({ scope: container })

  const flip = contextSafe(() => {
    if (prefersReducedMotion()) {
      setVisibleFace(visibleFace === "front" ? "back" : "front")
      return
    }
    gsap.fromTo(
      frontFace.current,
      {
        rotateX: visibleFace === "front" ? 0 : 180,
      },
      {
        rotateX: visibleFace === "front" ? 180 : 0,
        duration: 0.7,
        ease: "elastic.out(1,0.5)",
        onStart: () => setIsFlipping(true),
        onComplete: () => {
          setIsFlipping(false)
          setVisibleFace(visibleFace === "front" ? "back" : "front")
        },
      },
    )
  })

  const onMouseEnter = (e: MouseEvent) => {
    e.preventDefault()
    if (isFlipping) return
    flip()
  }

  return (
    <button
      ref={container}
      type="button"
      onMouseEnter={onMouseEnter}
      className="relative h-full w-full perspective-[1000px] rounded overflow-hidden cursor-default"
      style={{
        transitionDelay: `${(col + row) * 50}ms`,
      }}
    >
      <div ref={frontFace} className="relative h-full w-full transform-3d">
        <div className="absolute inset-0 overflow-hidden backface-hidden">
          <div
            className="absolute h-screen w-screen"
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

        <div ref={backFace} className="absolute inset-0 overflow-hidden backface-hidden transform-[rotateX(180deg)]">
          {backContent ?? <div className="h-full w-full bg-amber-600" />}
        </div>
      </div>
    </button>
  )
}

export default memo(Tile)
