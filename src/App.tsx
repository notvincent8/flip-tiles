import { useCallback, useEffect, useRef, useState } from "react"
import { Scene } from "./components/common/Scene.tsx"
import { type CascadeHandle, TileGrid } from "./components/TileGrid.tsx"

const App = () => {
  const cascadeRef = useRef<CascadeHandle | null>(null)
  const [isTriggering, setIsTriggering] = useState(false)

  const triggerCascade = useCallback(() => {
    if (isTriggering) return
    setIsTriggering(true)
    cascadeRef.current?.cascade()
    setTimeout(() => setIsTriggering(false), 2500)
  }, [isTriggering])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Tab") return e.preventDefault()
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return
      if (e.code === "Space" || e.key === " ") {
        e.preventDefault()
        triggerCascade()
      }
    }

    globalThis.addEventListener("keydown", handleKeyDown)
    return () => globalThis.removeEventListener("keydown", handleKeyDown)
  }, [triggerCascade])

  return (
    <TileGrid cascadeRef={cascadeRef}>
      <Scene>
        <div
          className="relative flex flex-col items-center z-10 px-8 py-10 md:px-16 md:py-14 rounded-2xl"
          style={{
            background: "#e0e5ec",
            boxShadow: `
              12px 12px 24px #a3b1c6,
              -12px -12px 24px #ffffff,
              inset 0 0 0 1px rgba(255, 255, 255, 0.5)
            `,
          }}
        >
          <div className="flex items-center justify-between w-full mb-8">
            <div className="font-mono text-[10px] tracking-widest uppercase" style={{ color: "#6b7280" }}>
              MODEL TX-90
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <div className="led led-blink" style={{ background: "#22c55e", color: "#22c55e" }} />
                <span className="font-mono text-[9px] uppercase" style={{ color: "#6b7280" }}>
                  PWR
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="led" style={{ background: "#ff6900", color: "#ff6900" }} />
                <span className="font-mono text-[9px] uppercase" style={{ color: "#6b7280" }}>
                  SYS
                </span>
              </div>
            </div>
          </div>

          <div
            className="relative px-6 py-5 md:px-10 md:py-8 rounded-lg mb-6"
            style={{
              background: "#1f2937",
              boxShadow: `
                inset 4px 4px 8px rgba(0, 0, 0, 0.4),
                inset -2px -2px 4px rgba(55, 65, 81, 0.3)
              `,
            }}
          >
            <div
              className="absolute inset-0 rounded-lg pointer-events-none opacity-10"
              style={{
                background:
                  "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.3) 2px, rgba(0,0,0,0.3) 4px)",
              }}
            />

            <h1
              className="font-display text-5xl md:text-7xl font-bold tracking-wide uppercase"
              style={{
                color: "#ff6900",
                textShadow: "0 0 20px rgba(255, 105, 0, 0.5)",
              }}
            >
              FLIP GRID
            </h1>
          </div>

          <p className="font-tech text-sm md:text-base tracking-[0.3em] uppercase mb-8" style={{ color: "#4b5563" }}>
            INTERACTIVE DISPLAY SYSTEM
          </p>

          <div className="flex items-center gap-6 md:gap-10">
            <div className="flex flex-col items-center">
              <span className="font-mono text-[10px] uppercase mb-1" style={{ color: "#9ca3af" }}>
                COLS
              </span>
              <span className="font-tech text-lg font-semibold" style={{ color: "#374151" }}>
                8
              </span>
            </div>
            <div
              className="w-px h-8"
              style={{ background: "linear-gradient(180deg, transparent, #9ca3af, transparent)" }}
            />
            <div className="flex flex-col items-center">
              <span className="font-mono text-[10px] uppercase mb-1" style={{ color: "#9ca3af" }}>
                ROWS
              </span>
              <span className="font-tech text-lg font-semibold" style={{ color: "#374151" }}>
                5
              </span>
            </div>
            <div
              className="w-px h-8"
              style={{ background: "linear-gradient(180deg, transparent, #9ca3af, transparent)" }}
            />
            <div className="flex flex-col items-center">
              <span className="font-mono text-[10px] uppercase mb-1" style={{ color: "#9ca3af" }}>
                VER
              </span>
              <span className="font-tech text-lg font-semibold" style={{ color: "#374151" }}>
                1.0
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={triggerCascade}
            disabled={isTriggering}
            className="group relative mt-8 px-8 py-3 rounded-lg font-tech text-sm tracking-[0.2em] uppercase transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-orange-500"
            style={{
              background: isTriggering ? "#d4d9e1" : "#e0e5ec",
              color: isTriggering ? "#9ca3af" : "#ff6900",
              boxShadow: isTriggering
                ? "inset 3px 3px 6px #a3b1c6, inset -3px -3px 6px #ffffff"
                : "6px 6px 12px #a3b1c6, -6px -6px 12px #ffffff, inset 0 0 0 1px rgba(255, 255, 255, 0.3)",
              transform: isTriggering ? "scale(0.98)" : "scale(1)",
            }}
          >
            <span className="relative z-10 flex items-center gap-3">
              <svg
                className="w-4 h-4 transition-transform duration-300"
                style={{
                  transform: isTriggering ? "rotate(180deg)" : "rotate(0deg)",
                }}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <title>{isTriggering ? "CASCADING..." : "CASCADE"}</title>
                <path d="M3 3h6v6H3zM15 3h6v6h-6zM9 9h6v6H9zM3 15h6v6H3zM15 15h6v6h-6z" />
              </svg>
              {isTriggering ? "CASCADING..." : "CASCADE"}
              <span
                className="ml-1 px-1.5 py-0.5 rounded text-[9px] font-mono"
                style={{
                  background: "rgba(0,0,0,0.08)",
                  color: "#6b7280",
                }}
              >
                SPACE
              </span>
            </span>

            {isTriggering && (
              <div
                className="absolute inset-0 rounded-lg pointer-events-none animate-pulse"
                style={{
                  background: "radial-gradient(circle at center, rgba(255, 105, 0, 0.15) 0%, transparent 70%)",
                }}
              />
            )}
          </button>

          <div className="flex items-center gap-2 mt-8">
            <div className="w-3 h-3 rounded-sm" style={{ background: "#ff6900" }} />
            <span className="font-mono text-[10px] tracking-[0.2em] uppercase" style={{ color: "#6b7280" }}>
              ATELIER LABS
            </span>
          </div>

          <div
            className="absolute top-3 left-3 w-2 h-2 rounded-full"
            style={{ background: "#9ca3af", boxShadow: "inset 1px 1px 2px rgba(0,0,0,0.3)" }}
          />
          <div
            className="absolute top-3 right-3 w-2 h-2 rounded-full"
            style={{ background: "#9ca3af", boxShadow: "inset 1px 1px 2px rgba(0,0,0,0.3)" }}
          />
          <div
            className="absolute bottom-3 left-3 w-2 h-2 rounded-full"
            style={{ background: "#9ca3af", boxShadow: "inset 1px 1px 2px rgba(0,0,0,0.3)" }}
          />
          <div
            className="absolute bottom-3 right-3 w-2 h-2 rounded-full"
            style={{ background: "#9ca3af", boxShadow: "inset 1px 1px 2px rgba(0,0,0,0.3)" }}
          />
        </div>
      </Scene>
    </TileGrid>
  )
}

export default App
