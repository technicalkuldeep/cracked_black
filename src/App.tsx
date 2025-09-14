import TextAnimations from "./components/TextAnimations"
import BG from "./assets/cover.png"

const App = () => {
  return (
    <div className="relative h-screen w-full overflow-hidden">
      {/* Background Image */}
      <img
        src={BG}
        alt="cover"
        className="absolute inset-0 w-full h-full object-cover"
      />

      <div className="absolute inset-0 bg-black/10" />

      <div className="relative z-10 h-full">
        <TextAnimations />
      </div>
    </div>
  )
}

export default App
