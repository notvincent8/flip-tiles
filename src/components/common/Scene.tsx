import type { ReactNode } from "react"
import { cn } from "@/lib/cn.ts"

interface SceneProps {
  children: ReactNode
  className?: string
}

/**
 * Full-viewport centered container.
 * 90s Industrial Tech / Teenage Engineering aesthetic.
 */
export const Scene = ({ children, className }: Readonly<SceneProps>) => {
  return (
    <div
      className={cn(
        "relative flex min-h-svh w-full items-center justify-center p-4 overflow-hidden",
        className,
      )}
      style={{
        background: '#e0e5ec',
      }}
    >
      {/* Subtle grid pattern - industrial blueprint feel */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(#4b5563 1px, transparent 1px),
            linear-gradient(90deg, #4b5563 1px, transparent 1px)
          `,
          backgroundSize: '20px 20px',
        }}
      />

      {children}
    </div>
  )
}
