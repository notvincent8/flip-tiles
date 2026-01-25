import { Scene } from "./components/common/Scene.tsx"
import { TileGrid } from "./components/TileGrid.tsx"

const App = () => {
  return (
    <TileGrid columns={6} rows={7}>
      <Scene>
        <div className="relative flex flex-col items-center font-display justify-center gap-4">
          <div
            className="absolute -inset-120 bg-amber-600/30 blur-3xl"
            style={{
              transform: "translate(-0px, -120px)",
              maskImage: "url(/dragon4.svg)",
              maskSize: "contain",
              maskRepeat: "no-repeat",
              maskPosition: "center",
              WebkitMaskImage: "url(/dragon4.svg)",
              WebkitMaskSize: "contain",
              WebkitMaskRepeat: "no-repeat",
              WebkitMaskPosition: "center",
            }}
          />
          <h1 className="relative text-9xl font-bold uppercase text-white">FOURTH WING</h1>
          <h2 className="relative text-xl uppercase tracking-wide text-white">Graduate... or die</h2>
        </div>
      </Scene>
    </TileGrid>
  )
}

export default App
