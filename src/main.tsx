import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import App from "./App"
import "./index.css"
import { useGSAP } from "@gsap/react"

import gsap from "gsap"
import { ErrorBoundary } from "@/components/common/ErrorBoundary.tsx"

gsap.registerPlugin(useGSAP)

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
)
